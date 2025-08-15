import { useState, useRef, useEffect } from 'react';
import Hls from 'hls.js';

export interface StreamInfo {
  type: 'hls' | 'http';
  url: string;
}

export interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  isMuted: boolean;
  error: string | null;
  currentChannel: string | null;
}

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    isLoading: false,
    volume: 0.7,
    isMuted: false,
    error: null,
    currentChannel: null
  });

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = state.volume;
      audioRef.current.muted = state.isMuted;
      
      // Set up event listeners
      audioRef.current.addEventListener('play', () => {
        setState(prev => ({ ...prev, isPlaying: true, isLoading: false }));
      });
      
      audioRef.current.addEventListener('pause', () => {
        setState(prev => ({ ...prev, isPlaying: false }));
      });
      
      audioRef.current.addEventListener('ended', () => {
        setState(prev => ({ ...prev, isPlaying: false }));
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setState(prev => ({ 
          ...prev, 
          isPlaying: false, 
          isLoading: false,
          error: 'Failed to play audio stream'
        }));
      });
      
      audioRef.current.addEventListener('loadstart', () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
      });
      
      audioRef.current.addEventListener('canplay', () => {
        setState(prev => ({ ...prev, isLoading: false }));
      });
    }

    return () => {
      // Cleanup
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const loadStream = async (streamInfo: StreamInfo, channelId: string) => {
    if (!audioRef.current) return;

    try {
      setState(prev => ({ 
        ...prev, 
        isLoading: true, 
        error: null, 
        currentChannel: channelId 
      }));

      // Stop current playback
      audioRef.current.pause();
      
      // Cleanup previous HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (streamInfo.type === 'hls' && Hls.isSupported()) {
        // Use HLS.js for HLS streams
        hlsRef.current = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        
        hlsRef.current.on(Hls.Events.ERROR, (_, data) => {
          console.error('HLS Error:', data);
          setState(prev => ({ 
            ...prev, 
            isPlaying: false, 
            isLoading: false,
            error: `HLS Error: ${data.details || 'Unknown error'}`
          }));
        });

        hlsRef.current.loadSource(streamInfo.url);
        hlsRef.current.attachMedia(audioRef.current);
      } else {
        // Use direct audio source for HTTP streams or when HLS.js is not supported
        audioRef.current.src = streamInfo.url;
        audioRef.current.load();
      }
    } catch (error) {
      console.error('Error loading stream:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load stream'
      }));
    }
  };

  const play = async () => {
    if (!audioRef.current) return;
    
    try {
      await audioRef.current.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to start playback'
      }));
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setState(prev => ({ ...prev, currentChannel: null }));
  };

  const setVolume = (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setState(prev => ({ ...prev, volume: clampedVolume }));
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  };

  const toggleMute = () => {
    const newMuted = !state.isMuted;
    setState(prev => ({ ...prev, isMuted: newMuted }));
    if (audioRef.current) {
      audioRef.current.muted = newMuted;
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    state,
    loadStream,
    play,
    pause,
    stop,
    setVolume,
    toggleMute,
    clearError
  };
}