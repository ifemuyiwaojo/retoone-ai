import { useCallback, useRef } from 'react';

interface UsePlaybackProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  onError?: (error: Error) => void;
}

export function usePlayback({ audioRef, onError }: UsePlaybackProps) {
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.readyState < 3) {
        await new Promise<void>((resolve, reject) => {
          const handleCanPlay = () => {
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('error', handleError);
            resolve();
          };
          const handleError = () => {
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('error', handleError);
            reject(new Error('Failed to load audio'));
          };
          audio.addEventListener('canplay', handleCanPlay);
          audio.addEventListener('error', handleError);
        });
      }

      if (playPromiseRef.current) {
        await playPromiseRef.current;
      }
      playPromiseRef.current = audio.play();
      await playPromiseRef.current;
      playPromiseRef.current = null;
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error : new Error('Failed to play audio'));
      }
    }
  }, [audioRef, onError]);

  const pause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (playPromiseRef.current) {
        await playPromiseRef.current;
      }
      audio.pause();
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error : new Error('Failed to pause audio'));
      }
    }
  }, [audioRef, onError]);

  return { play, pause };
}