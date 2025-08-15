export interface Channel {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  sourcePage: string;
  fallbackStreamUrl?: string;
}

export const channels: Channel[] = [
  {
    id: 'radio1',
    name: {
      en: 'RTHK Radio 1',
      zh: 'RTHK 第一台'
    },
    sourcePage: 'https://www.rthk.hk/radio/radio1',
    fallbackStreamUrl: 'https://rthkaudio1-lh.akamaihd.net/i/radio1_1@355864/master.m3u8'
  }
];

export function getChannelById(id: string): Channel | undefined {
  return channels.find(channel => channel.id === id);
}