import React, { createContext, useContext, useState, useCallback } from 'react';
import { Track } from '../types';

interface QueueContextType {
  queue: Track[];
  history: Track[];
  addToQueue: (track: Track) => void;
  addAlternateVersions: (tracks: Track[]) => void;
  removeFromQueue: (trackId: string) => void;
  playNext: (track: Track) => void;
  clearQueue: () => void;
  addToHistory: (track: Track) => void;
  clearHistory: () => void;
  getNextTrack: () => Track | null;
  getPreviousTrack: () => Track | null;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export function QueueProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<Track[]>([]);
  const [history, setHistory] = useState<Track[]>([]);

  const addToQueue = useCallback((track: Track) => {
    setQueue(prev => [...prev, track]);
  }, []);

  const addAlternateVersions = useCallback((tracks: Track[]) => {
    setQueue(prev => [...prev, ...tracks]);
  }, []);

  const removeFromQueue = useCallback((trackId: string) => {
    setQueue(prev => prev.filter(track => track.id !== trackId));
  }, []);

  const playNext = useCallback((track: Track) => {
    setQueue(prev => [track, ...prev]);
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const addToHistory = useCallback((track: Track) => {
    setHistory(prev => {
      // Remove any existing instances of this track from history
      const filteredHistory = prev.filter(t => t.id !== track.id);
      // Add the track to the beginning and keep only the last 50 tracks
      return [track, ...filteredHistory].slice(0, 50);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const getNextTrack = useCallback(() => {
    return queue.length > 0 ? queue[0] : null;
  }, [queue]);

  const getPreviousTrack = useCallback(() => {
    return history.length > 0 ? history[0] : null;
  }, [history]);

  return (
    <QueueContext.Provider value={{
      queue,
      history,
      addToQueue,
      addAlternateVersions,
      removeFromQueue,
      playNext,
      clearQueue,
      addToHistory,
      clearHistory,
      getNextTrack,
      getPreviousTrack,
    }}>
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
}