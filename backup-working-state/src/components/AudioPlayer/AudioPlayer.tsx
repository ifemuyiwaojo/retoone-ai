import React, { useEffect, useRef } from 'react';

interface AudioPlayerProps {
  src?: string;
  isPlaying: boolean;
  volume: number;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
}

export default function AudioPlayer({
  src,
  isPlaying,
  volume,
  onTimeUpdate,
  onEnded,
  onError
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (onTimeUpdate) {
        onTimeUpdate(audio.currentTime, audio.duration);
      }
    };

    const handleEnded = () => {
      if (onEnded) {
        onEnded();
      }
    };

    const handleError = () => {
      if (onError && audio.error) {
        onError(new Error(audio.error.message));
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      
      if (playPromiseRef.current) {
        playPromiseRef.current.then(() => {
          audio.pause();
          audio.src = '';
        }).catch(() => {});
      } else {
        audio.pause();
        audio.src = '';
      }
      
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    const handlePlayback = async () => {
      try {
        // Only reload if source changed
        if (audio.src !== src) {
          audio.src = src;
          audio.load();
        }

        audio.volume = volume / 100;

        if (isPlaying) {
          // Wait for any existing playback to finish
          if (playPromiseRef.current) {
            await playPromiseRef.current;
          }
          
          // Start new playback
          playPromiseRef.current = audio.play();
          await playPromiseRef.current;
          playPromiseRef.current = null;
        } else {
          if (playPromiseRef.current) {
            await playPromiseRef.current;
          }
          audio.pause();
        }
      } catch (error) {
        console.error('Audio playback error:', error);
        if (onError) {
          onError(error instanceof Error ? error : new Error('Failed to play audio'));
        }
      }
    };

    handlePlayback();
  }, [src, isPlaying, volume]);

  return null;
}