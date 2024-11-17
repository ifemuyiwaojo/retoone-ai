import React, { useEffect } from 'react';
import { Volume2 } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  audioRef?: React.RefObject<HTMLAudioElement>;
}

export default function VolumeControl({ volume, onVolumeChange, audioRef }: VolumeControlProps) {
  useEffect(() => {
    if (audioRef?.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume, audioRef]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Math.min(100, Math.max(0, Number(e.target.value)));
    onVolumeChange(newVolume);
  };

  return (
    <div className="flex items-center gap-2">
      <Volume2 className="w-5 h-5 text-gray-400" />
      <input
        type="range"
        min="0"
        max="100"
        value={volume.toString()}
        onChange={handleVolumeChange}
        className="w-24 accent-white"
      />
    </div>
  );
}