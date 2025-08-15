export interface RadioChannel {
  id: string;
  name: string;
  description: string;
  streamUrl: string;
  isLive: boolean;
}

export interface StreamInfo {
  url: string;
  type: 'hls' | 'mp3' | 'aac';
  bitrate?: number;
}