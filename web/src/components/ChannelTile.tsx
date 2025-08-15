import { useTranslation } from 'react-i18next';
import type { Channel } from '../services/api';

interface ChannelTileProps {
  channel: Channel;
  isLoading: boolean;
  isPlaying: boolean;
  isCurrentChannel: boolean;
  onPlay: (channelId: string) => void;
}

export function ChannelTile({ 
  channel, 
  isLoading, 
  isPlaying, 
  isCurrentChannel, 
  onPlay 
}: ChannelTileProps) {
  const { i18n, t } = useTranslation();

  const handleClick = () => {
    onPlay(channel.id);
  };

  const getChannelName = () => {
    return channel.name[i18n.language as keyof typeof channel.name] || channel.name.en;
  };

  const getButtonText = () => {
    if (isLoading) return t('player.loading');
    if (isCurrentChannel && isPlaying) return t('player.pause');
    return t('player.play');
  };

  return (
    <div className="channel-tile">
      <h2 className="channel-name">{getChannelName()}</h2>
      <button
        className="btn-primary btn-large"
        onClick={handleClick}
        disabled={isLoading}
        aria-label={`${getButtonText()} ${getChannelName()}`}
      >
        {getButtonText()}
      </button>
    </div>
  );
}