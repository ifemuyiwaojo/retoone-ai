import React, { createContext, useContext, useState, useCallback } from 'react';
import { Track } from '../types';

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  setCurrentTrack: (track: Track) => void;
  togglePlay: () => void;
  playTrack: (track: Track) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = useCallback(() => {
    if (!currentTrack?.audioUrl) {
      console.warn('No audio URL available for current track');
      return;
    }
    setIsPlaying(prev => !prev);
  }, [currentTrack]);

  const playTrack = useCallback((track: Track) => {
    if (!track.audioUrl) {
      console.warn('Cannot play track without audio URL:', track);
      return;
    }

    // Create a new track object without any non-serializable data
    const safeTrack = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album,
      coverUrl: track.coverUrl,
      duration: track.duration,
      liked: track.liked,
      audioUrl: track.audioUrl,
      lyrics: track.lyrics
    };

    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      setCurrentTrack(safeTrack);
      setIsPlaying(true);
    }
  }, [currentTrack, togglePlay]);

  const value = {
    currentTrack,
    isPlaying,
    setCurrentTrack,
    togglePlay,
    playTrack,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}