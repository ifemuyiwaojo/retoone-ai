import React, { useState, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle } from 'lucide-react';
import AudioPlayer from '../AudioPlayer/AudioPlayer';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  audioUrl?: string;
  volume: number;
}

export default function PlayerControls({ isPlaying, onPlayPause, audioUrl, volume }: PlayerControlsProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleTimeUpdate = useCallback((current: number, total: number) => {
    setCurrentTime(current);
    setDuration(total);
    setProgress((current / total) * 100 || 0);
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      const time = (value / 100) * duration;
      setCurrentTime(time);
      setProgress(value);
    }
  }, [duration]);

  const handleError = useCallback((error: Error) => {
    console.error('Player error:', error.message);
    setError(error.message);
    onPlayPause(); // Stop playback on error
  }, [onPlayPause]);

  const formatTime = useCallback((time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Only render audio player if we have a valid URL
  const shouldRenderAudio = audioUrl && audioUrl.startsWith('http');

  return (
    <div className="flex flex-col items-center">
      {shouldRenderAudio && (
        <AudioPlayer
          src={audioUrl}
          isPlaying={isPlaying}
          volume={volume}
          onTimeUpdate={handleTimeUpdate}
          onEnded={onPlayPause}
          onError={handleError}
        />
      )}

      {error && (
        <div className="text-red-500 text-sm mb-2">
          Failed to play audio: {error}
        </div>
      )}

      <div className="flex items-center gap-6">
        <button 
          className="text-gray-400 hover:text-white transition-colors"
          disabled={!shouldRenderAudio}
        >
          <Shuffle className="w-4 h-4" />
        </button>
        <button 
          className="text-gray-400 hover:text-white transition-colors"
          disabled={!shouldRenderAudio}
        >
          <SkipBack className="w-5 h-5" />
        </button>
        <button
          onClick={onPlayPause}
          disabled={!shouldRenderAudio}
          className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-black" />
          ) : (
            <Play className="w-4 h-4 text-black ml-1" />
          )}
        </button>
        <button 
          className="text-gray-400 hover:text-white transition-colors"
          disabled={!shouldRenderAudio}
        >
          <SkipForward className="w-5 h-5" />
        </button>
        <button 
          className="text-gray-400 hover:text-white transition-colors"
          disabled={!shouldRenderAudio}
        >
          <Repeat className="w-4 h-4" />
        </button>
      </div>
      
      <div className="w-full mt-2 flex items-center gap-2">
        <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          disabled={!shouldRenderAudio}
          className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
        />
        <span className="text-xs text-gray-400">{formatTime(duration)}</span>
      </div>
    </div>
  );
}