import React from 'react';
import { Play, ListPlus } from 'lucide-react';

interface PlayOptionsProps {
  onPlayNow: () => void;
  onPlayNext: () => void;
}

export default function PlayOptions({ onPlayNow, onPlayNext }: PlayOptionsProps) {
  return (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPlayNow();
        }}
        className="p-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
      >
        <Play className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPlayNext();
        }}
        className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
      >
        <ListPlus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}