import type { RadioChannel, StreamInfo } from '../types/radio';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class RadioService {
  async getChannels(): Promise<RadioChannel[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/rthk/channels`);
      if (!response.ok) {
        throw new Error('Failed to fetch channels');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching channels:', error);
      throw error;
    }
  }

  async getStreamInfo(channelId: string): Promise<StreamInfo> {
    try {
      const response = await fetch(`${API_BASE_URL}/rthk/stream/${channelId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stream info');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching stream info:', error);
      throw error;
    }
  }
}