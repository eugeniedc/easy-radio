import { useTranslation } from 'react-i18next';
import type { AudioState } from '../hooks/useAudioPlayer';
import type { Channel } from '../services/api';

interface PlayerBarProps {
  audioState: AudioState;
  channels: Channel[];
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

export function PlayerBar({
  audioState,
  channels,
  onPlay,
  onPause,
  onStop,
  onVolumeChange,
  onToggleMute
}: PlayerBarProps) {
  const { i18n, t } = useTranslation();

  const getCurrentChannelName = () => {
    if (!audioState.currentChannel) return '';
    
    const channel = channels.find(c => c.id === audioState.currentChannel);
    if (!channel) return audioState.currentChannel;
    
    return channel.name[i18n.language as keyof typeof channel.name] || channel.name.en;
  };

  const getPlayerStatus = () => {
    if (audioState.isLoading) return t('player.loading');
    if (audioState.isPlaying) return t('player.play');
    return '';
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(event.target.value);
    onVolumeChange(volume);
  };

  return (
    <div className="player-bar">
      <div className="player-controls">
        <button
          className="btn-primary btn-icon"
          onClick={audioState.isPlaying ? onPause : onPlay}
          disabled={!audioState.currentChannel || audioState.isLoading}
          aria-label={audioState.isPlaying ? t('player.pause') : t('player.play')}
        >
          {audioState.isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <button
          className="btn-icon"
          onClick={onStop}
          disabled={!audioState.currentChannel}
          aria-label={t('player.stop')}
        >
          ⏹️
        </button>
      </div>

      <div className="player-info">
        {audioState.currentChannel && (
          <>
            <p className="current-channel">{getCurrentChannelName()}</p>
            <p className="player-status">{getPlayerStatus()}</p>
          </>
        )}
      </div>

      <div className="volume-control">
        <button
          className="btn-icon"
          onClick={onToggleMute}
          aria-label={audioState.isMuted ? t('player.unmute') : t('player.mute')}
        >
          {audioState.isMuted ? '🔇' : '🔊'}
        </button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={audioState.isMuted ? 0 : audioState.volume}
          onChange={handleVolumeChange}
          className="volume-slider"
          aria-label={t('player.volume')}
          disabled={audioState.isMuted}
        />
      </div>
    </div>
  );
}