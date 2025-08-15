import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { channels, getChannelById } from './channels';
import { resolveStreamUrl } from './streamResolver';

const expressApp = express();

// Enable CORS for all routes
expressApp.use(cors({ origin: true }));

// Parse JSON bodies
expressApp.use(express.json());

// GET /api/channels - Return all available channels (only Radio 1 for now)
expressApp.get('/api/channels', (req, res) => {
  try {
    const channelList = channels.map(channel => ({
      id: channel.id,
      name: channel.name
    }));
    
    res.json({
      success: true,
      channels: channelList
    });
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch channels'
    });
  }
});

// GET /api/stream-url/:channelId - Resolve stream URL for a specific channel
expressApp.get('/api/stream-url/:channelId', async (req, res) => {
  try {
    const { channelId } = req.params;
    
    const channel = getChannelById(channelId);
    if (!channel) {
      return res.status(404).json({
        success: false,
        error: `Channel '${channelId}' not found`
      });
    }

    const streamInfo = await resolveStreamUrl(channel);
    
    return res.json({
      success: true,
      ...streamInfo
    });
  } catch (error) {
    console.error(`Error resolving stream URL for ${req.params.channelId}:`, error);
    return res.status(500).json({
      success: false,
      error: 'Failed to resolve stream URL',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/proxy - Optional CORS proxy for any URL
expressApp.get('/api/proxy', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'URL parameter is required'
      });
    }

    // Basic URL validation
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return res.status(400).json({
        success: false,
        error: 'URL must start with http:// or https://'
      });
    }

    const response = await axios.get(url, {
      timeout: 10000,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    // Forward content type and other relevant headers
    if (response.headers['content-type']) {
      res.setHeader('Content-Type', response.headers['content-type']);
    }
    
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Pipe the response
    return response.data.pipe(res);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      success: false,
      error: 'Proxy request failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health check endpoint
expressApp.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Export the Express app as a Firebase Function
export const app = functions.https.onRequest(expressApp);