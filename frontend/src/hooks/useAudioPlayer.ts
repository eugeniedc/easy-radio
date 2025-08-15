import { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import type { RadioChannel, AudioPlayerState } from '../types/radio';

export const useAudioPlayer = () => {
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    isLoading: false,
    currentChannel: null,
    volume: 0.7,
    error: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio();
    audioRef.current.preload = 'none';
    audioRef.current.volume = state.volume;

    // Setup audio event listeners
    const audio = audioRef.current;
    
    const handleLoadStart = () => setState(prev => ({ ...prev, isLoading: true, error: null }));
    const handleCanPlay = () => setState(prev => ({ ...prev, isLoading: false }));
    const handlePlay = () => setState(prev => ({ ...prev, isPlaying: true }));
    const handlePause = () => setState(prev => ({ ...prev, isPlaying: false }));
    const handleError = () => setState(prev => ({ 
      ...prev, 
      isLoading: false, 
      isPlaying: false,
      error: 'Failed to load audio stream' 
    }));

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('loadstart', handleLoadStart);
        audioRef.current.removeEventListener('canplay', handleCanPlay);
        audioRef.current.removeEventListener('play', handlePlay);
        audioRef.current.removeEventListener('pause', handlePause);
        audioRef.current.removeEventListener('error', handleError);
      }
    };
  }, []);

  const playChannel = async (channel: RadioChannel) => {
    if (!audioRef.current || !channel.streamUrl) return;

    try {
      setState(prev => ({ 
        ...prev, 
        isLoading: true, 
        error: null,
        currentChannel: channel 
      }));

      // Stop current playback
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      audioRef.current.pause();

      // Check if HLS is supported
      if (Hls.isSupported() && channel.streamUrl.includes('.m3u8')) {
        hlsRef.current = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        
        hlsRef.current.loadSource(channel.streamUrl);
        hlsRef.current.attachMedia(audioRef.current);
        
        hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
          audioRef.current?.play();
        });

        hlsRef.current.on(Hls.Events.ERROR, (_event, data) => {
          console.error('HLS Error:', data);
          setState(prev => ({ 
            ...prev, 
            isLoading: false,
            error: 'Stream playback error' 
          }));
        });
      } else {
        // Fallback for browsers that support HLS natively
        audioRef.current.src = channel.streamUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Error playing channel:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: 'Failed to play channel' 
      }));
    }
  };

  const pause = () => {
    audioRef.current?.pause();
  };

  const resume = () => {
    audioRef.current?.play();
  };

  const stop = () => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setState(prev => ({ 
      ...prev, 
      isPlaying: false,
      currentChannel: null 
    }));
  };

  const setVolume = (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
    setState(prev => ({ ...prev, volume: clampedVolume }));
  };

  return {
    ...state,
    playChannel,
    pause,
    resume,
    stop,
    setVolume,
  };
};