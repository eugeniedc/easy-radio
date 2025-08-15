import axios from 'axios';
import * as cheerio from 'cheerio';
import { Channel } from './channels';

export interface StreamInfo {
  type: 'hls' | 'http';
  url: string;
}

interface CacheEntry {
  streamInfo: StreamInfo;
  timestamp: number;
}

// In-memory cache (30 minutes TTL)
const streamCache = new Map<string, CacheEntry>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

export async function resolveStreamUrl(channel: Channel): Promise<StreamInfo> {
  // Check cache first
  const cached = streamCache.get(channel.id);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`Returning cached stream for ${channel.id}`);
    return cached.streamInfo;
  }

  try {
    console.log(`Scraping stream URL for ${channel.id} from ${channel.sourcePage}`);
    
    // Fetch the source page
    const response = await axios.get(channel.sourcePage, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    // Look for various patterns that might contain the stream URL
    let streamUrl: string | null = null;
    
    // Pattern 1: Look for m3u8 URLs in script tags
    $('script').each((_, element) => {
      const scriptContent = $(element).html() || '';
      const m3u8Match = scriptContent.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/);
      if (m3u8Match) {
        streamUrl = m3u8Match[0];
        return false; // Break the loop
      }
      return undefined;
    });

    // Pattern 2: Look for audio source elements
    if (!streamUrl) {
      $('audio source, audio').each((_, element) => {
        const src = $(element).attr('src');
        if (src && (src.includes('.m3u8') || src.includes('stream'))) {
          streamUrl = src.startsWith('http') ? src : `https:${src}`;
          return false; // Break the loop
        }
        return undefined;
      });
    }

    // Pattern 3: Look for data attributes that might contain stream URLs
    if (!streamUrl) {
      $('[data-stream], [data-url], [data-src]').each((_, element) => {
        const streamAttr = $(element).attr('data-stream') || 
                          $(element).attr('data-url') || 
                          $(element).attr('data-src');
        if (streamAttr && (streamAttr.includes('.m3u8') || streamAttr.includes('stream'))) {
          streamUrl = streamAttr.startsWith('http') ? streamAttr : `https:${streamAttr}`;
          return false; // Break the loop
        }
        return undefined;
      });
    }

    if (streamUrl) {
      const streamInfo: StreamInfo = {
        type: (streamUrl as string).includes('.m3u8') ? 'hls' : 'http',
        url: streamUrl
      };

      // Cache the result
      streamCache.set(channel.id, {
        streamInfo,
        timestamp: Date.now()
      });

      console.log(`Successfully resolved stream for ${channel.id}: ${streamUrl}`);
      return streamInfo;
    }

    // If scraping failed, use fallback
    throw new Error('No stream URL found in page content');

  } catch (error) {
    console.error(`Failed to resolve stream for ${channel.id}:`, error);
    
    // Use fallback stream URL if available
    if (channel.fallbackStreamUrl) {
      console.log(`Using fallback stream for ${channel.id}: ${channel.fallbackStreamUrl}`);
      const streamInfo: StreamInfo = {
        type: channel.fallbackStreamUrl.includes('.m3u8') ? 'hls' : 'http',
        url: channel.fallbackStreamUrl
      };

      // Cache the fallback result (shorter TTL)
      streamCache.set(channel.id, {
        streamInfo,
        timestamp: Date.now() - (CACHE_TTL * 0.8) // Cache for only 6 minutes
      });

      return streamInfo;
    }

    throw new Error(`Failed to resolve stream URL for ${channel.id} and no fallback available`);
  }
}