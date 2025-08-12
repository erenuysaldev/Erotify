import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { Song, PlayerState } from '../types';
import { musicAPI } from '../services/api';

type PlayerAction = 
  | { type: 'SET_SONG'; payload: Song }
  | { type: 'SET_PLAYLIST'; payload: Song[] }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'NEXT_SONG' }
  | { type: 'PREVIOUS_SONG' }
  | { type: 'SET_CURRENT_INDEX'; payload: number }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'SET_REPEAT_MODE'; payload: 'none' | 'one' | 'all' };

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  playlist: [],
  currentIndex: -1,
  isShuffled: false,
  repeatMode: 'none',
};

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'SET_SONG':
      const songIndex = state.playlist.findIndex(s => s.id === action.payload.id);
      return {
        ...state,
        currentSong: action.payload,
        currentIndex: songIndex !== -1 ? songIndex : state.currentIndex,
      };
    
    case 'SET_PLAYLIST':
      return {
        ...state,
        playlist: action.payload,
        currentIndex: action.payload.length > 0 ? 0 : -1,
        currentSong: action.payload.length > 0 ? action.payload[0] : null,
      };
    
    case 'PLAY':
      return { ...state, isPlaying: true };
    
    case 'PAUSE':
      return { ...state, isPlaying: false };
    
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };
    
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    
    case 'SET_VOLUME':
      return { ...state, volume: action.payload, isMuted: action.payload === 0 };
    
    case 'TOGGLE_MUTE':
      return { ...state, isMuted: !state.isMuted };
    
    case 'NEXT_SONG':
      if (state.playlist.length === 0) return state;
      let nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.playlist.length) {
        nextIndex = state.repeatMode === 'all' ? 0 : state.currentIndex;
      }
      return {
        ...state,
        currentIndex: nextIndex,
        currentSong: state.playlist[nextIndex],
        currentTime: 0,
      };
    
    case 'PREVIOUS_SONG':
      if (state.playlist.length === 0) return state;
      let prevIndex = state.currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = state.repeatMode === 'all' ? state.playlist.length - 1 : 0;
      }
      return {
        ...state,
        currentIndex: prevIndex,
        currentSong: state.playlist[prevIndex],
        currentTime: 0,
      };
    
    case 'SET_CURRENT_INDEX':
      return {
        ...state,
        currentIndex: action.payload,
        currentSong: state.playlist[action.payload] || null,
        currentTime: 0,
      };
    
    case 'TOGGLE_SHUFFLE':
      return { ...state, isShuffled: !state.isShuffled };
    
    case 'SET_REPEAT_MODE':
      return { ...state, repeatMode: action.payload };
    
    default:
      return state;
  }
}

interface PlayerContextType {
  state: PlayerState;
  dispatch: React.Dispatch<PlayerAction>;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  playSong: (song: Song) => void;
  playPlaylist: (songs: Song[], startIndex?: number) => void;
  togglePlayPause: () => void;
  nextSong: () => void;
  previousSong: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seek: (time: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Electron player kontrolleri
  useEffect(() => {
    // @ts-ignore - Electron API'si
    if (window.electronAPI) {
      // @ts-ignore
      window.electronAPI.onPlayerAction((action: string) => {
        switch (action) {
          case 'toggle':
            togglePlayPause();
            break;
          case 'next':
            nextSong();
            break;
          case 'previous':
            previousSong();
            break;
          case 'shuffle':
            dispatch({ type: 'TOGGLE_SHUFFLE' });
            break;
          case 'repeat':
            const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
            const currentIndex = modes.indexOf(state.repeatMode);
            const nextMode = modes[(currentIndex + 1) % modes.length];
            dispatch({ type: 'SET_REPEAT_MODE', payload: nextMode });
            break;
        }
      });

      // Cleanup
      return () => {
        // @ts-ignore
        window.electronAPI.removeAllListeners('player-action');
      };
    }
  }, [state.repeatMode]);

  const playSong = (song: Song) => {
    dispatch({ type: 'SET_SONG', payload: song });
    dispatch({ type: 'PLAY' });
  };

  const playPlaylist = (songs: Song[], startIndex = 0) => {
    dispatch({ type: 'SET_PLAYLIST', payload: songs });
    if (startIndex >= 0 && startIndex < songs.length) {
      dispatch({ type: 'SET_CURRENT_INDEX', payload: startIndex });
    }
    dispatch({ type: 'PLAY' });
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !state.currentSong) return;
    
    const audio = audioRef.current;
    
    if (state.isPlaying) {
      audio.pause();
      dispatch({ type: 'PAUSE' });
    } else {
      // Ensure the audio source is loaded before playing
      if (audio.readyState === 0) {
        audio.load();
      }
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            dispatch({ type: 'PLAY' });
          })
          .catch((error) => {
            console.error('Error playing audio:', error);
            dispatch({ type: 'PAUSE' });
          });
      }
    }
  };

  const nextSong = () => {
    dispatch({ type: 'NEXT_SONG' });
  };

  const previousSong = () => {
    dispatch({ type: 'PREVIOUS_SONG' });
  };

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    dispatch({ type: 'SET_VOLUME', payload: volume });
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !state.isMuted;
    }
    dispatch({ type: 'TOGGLE_MUTE' });
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    dispatch({ type: 'SET_CURRENT_TIME', payload: time });
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      dispatch({ type: 'SET_CURRENT_TIME', payload: audio.currentTime });
    };

    const handleDurationChange = () => {
      dispatch({ type: 'SET_DURATION', payload: audio.duration || 0 });
    };

    const handleEnded = () => {
      if (state.repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextSong();
      }
    };

    const handleLoadedMetadata = () => {
      dispatch({ type: 'SET_DURATION', payload: audio.duration || 0 });
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [state.repeatMode]);

  // Update audio source when current song changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentSong) return;

    const streamUrl = musicAPI.getStreamUrl(state.currentSong.id);
    
    // Only update if URL is different
    if (audio.src !== streamUrl) {
      audio.src = streamUrl;
      audio.load(); // Important: load the new source
    }
    
    audio.volume = state.volume;
    audio.muted = state.isMuted;

    if (state.isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Error auto-playing audio:', error);
          dispatch({ type: 'PAUSE' });
        });
      }
    }
  }, [state.currentSong, state.volume, state.isMuted]);

  // Handle play/pause state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentSong) return;

    if (state.isPlaying) {
      if (audio.readyState >= 2) { // HAVE_CURRENT_DATA or higher
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('Error playing audio:', error);
            dispatch({ type: 'PAUSE' });
          });
        }
      } else {
        // Wait for audio to be ready
        const handleCanPlay = () => {
          audio.removeEventListener('canplay', handleCanPlay);
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.error('Error playing audio after load:', error);
              dispatch({ type: 'PAUSE' });
            });
          }
        };
        audio.addEventListener('canplay', handleCanPlay);
      }
    } else {
      audio.pause();
    }
  }, [state.isPlaying]);

  return (
    <PlayerContext.Provider
      value={{
        state,
        dispatch,
        audioRef,
        playSong,
        playPlaylist,
        togglePlayPause,
        nextSong,
        previousSong,
        setVolume,
        toggleMute,
        seek,
      }}
    >
      {children}
      <audio 
        ref={audioRef} 
        preload="metadata" 
        crossOrigin="anonymous"
        onError={(e) => {
          console.error('Audio error:', e);
          dispatch({ type: 'PAUSE' });
        }}
        onLoadStart={() => {
          console.log('Audio load started');
        }}
        onCanPlay={() => {
          console.log('Audio can play');
        }}
      />
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
