import React from 'react';
import { Heart, ChevronUp } from 'lucide-react';
import { Track } from '../../types';

interface TrackInfoProps {
  track: Track;
  isExpanded: boolean;
  isLiked: boolean;
  onLikeToggle: () => void;
  onExpandClick: () => void;
}

export default function TrackInfo({ 
  track, 
  isExpanded, 
  isLiked, 
  onLikeToggle, 
  onExpandClick 
}: TrackInfoProps) {
  return (
    <div className={`flex items-center gap-4 ${isExpanded ? 'w-full md:w-1/3' : 'w-1/3'}`}>
      <div className="relative group cursor-pointer" onClick={onExpandClick}>
        <img
          src={track.coverUrl}
          alt={track.title}
          className={`rounded ${isExpanded ? 'w-32 h-32' : 'w-14 h-14'}`}
        />
        {!isExpanded && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <ChevronUp className="w-6 h-6" />
          </div>
        )}
      </div>
      <div>
        <h4 className="text-white font-medium">{track.title}</h4>
        <p className="text-gray-400 text-sm">{track.artist}</p>
      </div>
      <button
        onClick={onLikeToggle}
        className="ml-4 text-gray-400 hover:text-white transition-colors"
      >
        <Heart className={isLiked ? 'fill-green-500 text-green-500' : ''} />
      </button>
    </div>
  );
}