import { Router, Request, Response } from 'express';
import { RTHKService } from '../services/rthk';

const router = Router();
const rthkService = new RTHKService();

// Get all available channels
router.get('/channels', async (req: Request, res: Response) => {
  try {
    const channels = await rthkService.getChannels();
    res.json(channels);
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

// Get stream URL for a specific channel
router.get('/stream/:channelId', async (req: Request, res: Response) => {
  try {
    const { channelId } = req.params;
    const streamInfo = await rthkService.getStreamUrl(channelId);
    res.json(streamInfo);
  } catch (error) {
    console.error('Error fetching stream:', error);
    res.status(500).json({ error: 'Failed to fetch stream URL' });
  }
});

// Proxy stream to avoid CORS issues
router.get('/proxy', async (req: Request, res: Response) => {
  try {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    const streamData = await rthkService.proxyStream(url);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    
    res.send(streamData);
  } catch (error) {
    console.error('Error proxying stream:', error);
    res.status(500).json({ error: 'Failed to proxy stream' });
  }
});

export { router as rthkRouter };