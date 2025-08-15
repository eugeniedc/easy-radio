export interface Channel {
  id: string;
  name: {
    en: string;
    zh: string;
  };
}

export interface StreamInfo {
  type: 'hls' | 'http';
  url: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

const API_BASE_URL = import.meta.env.DEV ? '' : '';

export class ApiService {
  static async getChannels(): Promise<Channel[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/channels`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch channels');
      }
      
      return data.channels;
    } catch (error) {
      console.error('Error fetching channels:', error);
      throw error;
    }
  }

  static async getStreamUrl(channelId: string): Promise<StreamInfo> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stream-url/${channelId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get stream URL');
      }
      
      return {
        type: data.type,
        url: data.url
      };
    } catch (error) {
      console.error('Error fetching stream URL:', error);
      throw error;
    }
  }

  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}