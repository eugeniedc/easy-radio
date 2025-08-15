import axios from 'axios';
import * as cheerio from 'cheerio';
import { RadioChannel, StreamInfo } from '../types/radio';

export class RTHKService {
  private baseUrl = 'https://www.rthk.hk';
  
  // Common RTHK radio channels
  private channels: RadioChannel[] = [
    {
      id: 'radio1',
      name: 'RTHK Radio 1',
      description: 'News, current affairs and documentaries',
      streamUrl: '',
      isLive: true
    },
    {
      id: 'radio2',
      name: 'RTHK Radio 2',
      description: 'Popular music and entertainment',
      streamUrl: '',
      isLive: true
    },
    {
      id: 'radio3',
      name: 'RTHK Radio 3',
      description: 'English programming',
      streamUrl: '',
      isLive: true
    },
    {
      id: 'radio4',
      name: 'RTHK Radio 4',
      description: 'Classical music',
      streamUrl: '',
      isLive: true
    },
    {
      id: 'radio5',
      name: 'RTHK Radio 5',
      description: 'Literature and culture',
      streamUrl: '',
      isLive: true
    }
  ];

  async getChannels(): Promise<RadioChannel[]> {
    // For now, return static channels with resolved stream URLs
    const channelsWithStreams = await Promise.all(
      this.channels.map(async (channel) => {
        try {
          const streamInfo = await this.getStreamUrl(channel.id);
          return {
            ...channel,
            streamUrl: streamInfo.url
          };
        } catch (error) {
          console.error(`Failed to get stream for ${channel.id}:`, error);
          return channel;
        }
      })
    );
    
    return channelsWithStreams;
  }

  async getStreamUrl(channelId: string): Promise<StreamInfo> {
    // RTHK stream URLs (these are commonly available public streams)
    const streamMap: Record<string, string> = {
      radio1: 'https://rthkaudio1-lh.akamaihd.net/i/radio1_1@355864/master.m3u8',
      radio2: 'https://rthkaudio2-lh.akamaihd.net/i/radio2_1@355865/master.m3u8',
      radio3: 'https://rthkaudio3-lh.akamaihd.net/i/radio3_1@355866/master.m3u8',
      radio4: 'https://rthkaudio4-lh.akamaihd.net/i/radio4_1@355867/master.m3u8',
      radio5: 'https://rthkaudio5-lh.akamaihd.net/i/radio5_1@355868/master.m3u8'
    };

    const streamUrl = streamMap[channelId];
    if (!streamUrl) {
      throw new Error(`Channel ${channelId} not found`);
    }

    return {
      url: streamUrl,
      type: 'hls',
      bitrate: 128
    };
  }

  async proxyStream(url: string): Promise<Buffer> {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      return Buffer.from(response.data);
    } catch (error) {
      throw new Error(`Failed to proxy stream: ${error}`);
    }
  }
}