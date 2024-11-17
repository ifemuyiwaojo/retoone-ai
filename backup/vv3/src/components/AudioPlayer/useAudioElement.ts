import { useEffect, useRef, useCallback } from 'react';

interface UseAudioElementProps {
  src?: string;
  volume: number;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
  onLoading?: (isLoading: boolean) => void;
}

export function useAudioElement({
  src,
  volume,
  onTimeUpdate,
  onEnded,
  onError,
  onLoading
}: UseAudioElementProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMountedRef = useRef(true);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (onTimeUpdate && audio && isMountedRef.current) {
      onTimeUpdate(audio.currentTime, audio.duration);
    }
  }, [onTimeUpdate]);

  const handleEnded = useCallback(() => {
    if (onEnded && isMountedRef.current) {
      onEnded();
    }
  }, [onEnded]);

  const handleError = useCallback((error: Error) => {
    if (onError && isMountedRef.current) {
      onError(error);
    }
    if (onLoading && isMountedRef.current) {
      onLoading(false);
    }
  }, [onError, onLoading]);

  const handleCanPlayThrough = useCallback(() => {
    if (onLoading && isMountedRef.current) {
      onLoading(false);
    }
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  }, [onLoading]);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    isMountedRef.current = true;

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', () => {
      if (audio.error) {
        handleError(new Error(`Audio error: ${audio.error.message}`));
      }
    });

    return () => {
      isMountedRef.current = false;
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('error', () => {});
      
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [handleTimeUpdate, handleEnded, handleCanPlayThrough, handleError]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!src) {
      audio.src = '';
      return;
    }

    const loadAudio = async () => {
      try {
        if (!src.startsWith('http')) {
          throw new Error('Invalid audio URL');
        }

        if (onLoading) {
          onLoading(true);
        }

        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }

        loadingTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            handleError(new Error('Audio loading timeout'));
          }
        }, 15000);

        audio.src = src;
        audio.preload = 'auto';
        audio.volume = Math.min(Math.max(volume / 100, 0), 1);
        await audio.load();
      } catch (error) {
        handleError(error instanceof Error ? error : new Error('Failed to load audio'));
      }
    };

    loadAudio();

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [src, volume, handleError, onLoading]);

  return audioRef;
}