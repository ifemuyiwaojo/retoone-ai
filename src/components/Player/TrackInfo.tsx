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
    <div className="flex items-center gap-4 w-full">
      <div 
        className="relative group cursor-pointer rounded-lg overflow-hidden flex-shrink-0"
        onClick={onExpandClick}
      >
        <img
          src={track.coverUrl}
          alt={track.title}
          className={`object-cover ${isExpanded ? 'w-32 h-32' : 'w-16 h-16'} transition-all duration-300`}
        />
        {!isExpanded && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <ChevronUp className="w-6 h-6" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity p-3">
          <div className="text-xs text-white space-y-1">
            {track.genre && <p><span className="text-gray-400">Genre:</span> {track.genre}</p>}
            {track.description && (
              <p className="line-clamp-3 text-gray-300">{track.description}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium truncate hover:underline cursor-pointer" onClick={onExpandClick}>
          {track.title}
        </h4>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="truncate">{track.artist}</span>
          {track.genre && (
            <>
              <span className="text-gray-600">•</span>
              <span className="truncate text-gray-500">{track.genre}</span>
            </>
          )}
        </div>
      </div>

      <button
        onClick={onLikeToggle}
        className={`p-2 rounded-full transition-colors ${
          isLiked ? 'text-green-500 hover:bg-green-500/10' : 'text-gray-400 hover:bg-white/10'
        }`}
      >
        <Heart className={`w-5 h-5 ${isLiked ? 'fill-green-500' : ''}`} />
      </button>
    </div>
  );
}