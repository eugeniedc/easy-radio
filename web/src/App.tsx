import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { ApiService } from './services/api';
import type { Channel } from './services/api';
import { ChannelTile } from './components/ChannelTile';
import { PlayerBar } from './components/PlayerBar';
import { LanguageSelector } from './components/LanguageSelector';

function App() {
  const { t } = useTranslation();
  const audioPlayer = useAudioPlayer();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      setLoading(true);
      setError(null);
      const channelData = await ApiService.getChannels();
      setChannels(channelData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load channels');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayChannel = async (channelId: string) => {
    try {
      audioPlayer.clearError();
      
      // If this channel is already playing, pause it
      if (audioPlayer.state.currentChannel === channelId && audioPlayer.state.isPlaying) {
        audioPlayer.pause();
        return;
      }

      // Load and play the new stream
      const streamInfo = await ApiService.getStreamUrl(channelId);
      await audioPlayer.loadStream(streamInfo, channelId);
      await audioPlayer.play();
    } catch (err) {
      console.error('Error playing channel:', err);
      setError(err instanceof Error ? err.message : 'Failed to play channel');
    }
  };

  const handleRetry = () => {
    setError(null);
    audioPlayer.clearError();
    loadChannels();
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">{t('player.loading')}</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">{t('app.title')}</h1>
        <LanguageSelector />
      </header>

      <main className="app-main">
        {error && (
          <div className="error-message">
            {error}
            <br />
            <button 
              onClick={handleRetry} 
              className="btn-primary"
              style={{ marginTop: '1rem' }}
            >
              {t('player.retry')}
            </button>
          </div>
        )}

        {audioPlayer.state.error && (
          <div className="error-message">
            {audioPlayer.state.error}
            <br />
            <button 
              onClick={audioPlayer.clearError} 
              className="btn-primary"
              style={{ marginTop: '1rem' }}
            >
              {t('player.retry')}
            </button>
          </div>
        )}

        {channels.map(channel => (
          <ChannelTile
            key={channel.id}
            channel={channel}
            isLoading={audioPlayer.state.isLoading && audioPlayer.state.currentChannel === channel.id}
            isPlaying={audioPlayer.state.isPlaying}
            isCurrentChannel={audioPlayer.state.currentChannel === channel.id}
            onPlay={handlePlayChannel}
          />
        ))}
      </main>

      <PlayerBar
        audioState={audioPlayer.state}
        channels={channels}
        onPlay={audioPlayer.play}
        onPause={audioPlayer.pause}
        onStop={audioPlayer.stop}
        onVolumeChange={audioPlayer.setVolume}
        onToggleMute={audioPlayer.toggleMute}
      />
    </div>
  );
}

export default App;
