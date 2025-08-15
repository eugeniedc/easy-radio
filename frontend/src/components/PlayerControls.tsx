import React from 'react';
import type { RadioChannel } from '../types/radio';
import './PlayerControls.css';

interface PlayerControlsProps {
  currentChannel: RadioChannel | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  error: string | null;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onVolumeChange: (volume: number) => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  currentChannel,
  isPlaying,
  isLoading,
  volume,
  error,
  onPlay,
  onPause,
  onStop,
  onVolumeChange
}) => {
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    onVolumeChange(newVolume);
  };

  if (!currentChannel) {
    return (
      <div className="player-controls player-controls--empty">
        <p className="player-controls__message">
          Select a radio channel to start listening
        </p>
      </div>
    );
  }

  return (
    <div className="player-controls" role="region" aria-label="Media player controls">
      <div className="player-controls__info">
        <h2 className="player-controls__channel-name">
          {currentChannel.name}
        </h2>
        <p className="player-controls__channel-description">
          {currentChannel.description}
        </p>
        {error && (
          <div className="player-controls__error" role="alert">
            <span className="sr-only">Error: </span>
            {error}
          </div>
        )}
        {isLoading && (
          <div className="player-controls__loading" aria-live="polite">
            <span className="loading-spinner" aria-hidden="true"></span>
            <span>Loading stream...</span>
          </div>
        )}
      </div>

      <div className="player-controls__buttons">
        <button
          className="control-button control-button--primary"
          onClick={isPlaying ? onPause : onPlay}
          disabled={isLoading}
          aria-label={isPlaying ? 'Pause playback' : 'Start playback'}
        >
          <span className="control-button__icon" aria-hidden="true">
            {isLoading ? '⏳' : isPlaying ? '⏸️' : '▶️'}
          </span>
          <span className="control-button__text">
            {isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}
          </span>
        </button>

        <button
          className="control-button control-button--secondary"
          onClick={onStop}
          disabled={isLoading || !isPlaying}
          aria-label="Stop playback"
        >
          <span className="control-button__icon" aria-hidden="true">⏹️</span>
          <span className="control-button__text">Stop</span>
        </button>
      </div>

      <div className="player-controls__volume">
        <label htmlFor="volume-slider" className="volume-label">
          Volume: {Math.round(volume * 100)}%
        </label>
        <input
          id="volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
          aria-label="Volume control"
        />
      </div>
    </div>
  );
};