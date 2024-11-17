import { useState, useCallback } from 'react';
import * as api from '../services/api';
import { Track, Playlist } from '../types';

export function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((error: unknown) => {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('API Error:', error);
    setError(message);
    throw new Error(message);
  }, []);

  const generateTrack = useCallback(async (
    description: string,
    genre: string,
    subgenres: string[] = []
  ): Promise<Track> => {
    setIsLoading(true);
    setError(null);

    try {
      const track = await api.generateTrack(description, genre, subgenres);
      return track;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getLikedTracks = useCallback(async (): Promise<Track[]> => {
    setIsLoading(true);
    setError(null);

    try {
      return await api.getLikedTracks();
    } catch (err) {
      handleError(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getPlaylists = useCallback(async (): Promise<Playlist[]> => {
    setIsLoading(true);
    setError(null);

    try {
      return await api.getPlaylists();
    } catch (err) {
      handleError(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const toggleLike = useCallback(async (trackId: string): Promise<void> => {
    try {
      await api.toggleLike(trackId);
    } catch (err) {
      handleError(err);
    }
  }, [handleError]);

  return {
    generateTrack,
    getLikedTracks,
    getPlaylists,
    toggleLike,
    isLoading,
    error
  };
}