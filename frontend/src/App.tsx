import { useState, useEffect } from 'react';
import { ChannelList } from './components/ChannelList';
import { PlayerControls } from './components/PlayerControls';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { RadioService } from './services/radioService';
import type { RadioChannel } from './types/radio';
import './App.css';

const radioService = new RadioService();

function App() {
  const [channels, setChannels] = useState<RadioChannel[]>([]);
  const [isLoadingChannels, setIsLoadingChannels] = useState(true);
  const [channelsError, setChannelsError] = useState<string | null>(null);
  
  const audioPlayer = useAudioPlayer();

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      setIsLoadingChannels(true);
      setChannelsError(null);
      const fetchedChannels = await radioService.getChannels();
      setChannels(fetchedChannels);
    } catch (error) {
      console.error('Failed to load channels:', error);
      setChannelsError('Failed to load radio channels. Please try again later.');
    } finally {
      setIsLoadingChannels(false);
    }
  };

  const handleChannelSelect = (channel: RadioChannel) => {
    audioPlayer.playChannel(channel);
  };

  const handleRetry = () => {
    loadChannels();
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Easy Radio HK</h1>
        <p className="app__subtitle">Listen to RTHK Radio Channels</p>
      </header>

      <main className="app__main" role="main" id="main">
        {channelsError ? (
          <div className="app__error" role="alert">
            <h2>Unable to Load Channels</h2>
            <p>{channelsError}</p>
            <button 
              className="retry-button"
              onClick={handleRetry}
              aria-label="Retry loading channels"
            >
              Try Again
            </button>
          </div>
        ) : isLoadingChannels ? (
          <div className="app__loading" aria-live="polite">
            <div className="loading-spinner" aria-hidden="true"></div>
            <p>Loading radio channels...</p>
          </div>
        ) : (
          <>
            <PlayerControls
              currentChannel={audioPlayer.currentChannel}
              isPlaying={audioPlayer.isPlaying}
              isLoading={audioPlayer.isLoading}
              volume={audioPlayer.volume}
              error={audioPlayer.error}
              onPlay={audioPlayer.resume}
              onPause={audioPlayer.pause}
              onStop={audioPlayer.stop}
              onVolumeChange={audioPlayer.setVolume}
            />
            
            <ChannelList
              channels={channels}
              currentChannel={audioPlayer.currentChannel}
              onChannelSelect={handleChannelSelect}
              isLoading={audioPlayer.isLoading}
            />
          </>
        )}
      </main>

      <footer className="app__footer">
        <p>
          Easy Radio HK - Accessible radio streaming for RTHK channels
        </p>
      </footer>
    </div>
  );
}

export default App;
