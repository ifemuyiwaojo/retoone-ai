import React, { useState } from 'react';
import { ChevronDown, Heart, Share2, ListMusic } from 'lucide-react';
import PlayerControls from './Player/PlayerControls';
import { usePlayer } from '../context/PlayerContext';

export default function Player() {
  const { currentTrack, isPlaying, togglePlay } = usePlayer();
  const [volume, setVolume] = useState(80);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const defaultTrack = {
    title: "Select a track",
    artist: "Choose from library",
    coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop"
  };

  const track = currentTrack || defaultTrack;

  return (
    <>
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
      
      <div className={`fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 transition-all duration-300 ease-in-out z-50 ${
        isExpanded ? 'h-screen' : 'h-20'
      }`}>
        <div className={`h-full flex flex-col ${isExpanded ? 'px-8 py-6' : 'px-4'}`}>
          {isExpanded && (
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => setIsExpanded(false)}
                className="hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>
          )}

          <div className={`flex items-center ${isExpanded ? 'flex-1' : 'h-20'}`}>
            <div className={`flex items-center ${isExpanded ? 'flex-1 justify-between' : 'w-1/3'}`}>
              <div 
                className={`flex items-center cursor-pointer group`}
                onClick={() => !isExpanded && setIsExpanded(true)}
              >
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className={`${isExpanded ? 'w-96 h-96' : 'w-14 h-14'} rounded transition-all duration-300`}
                />
                <div className={`ml-4 ${isExpanded ? 'flex-1' : ''}`}>
                  <h4 className="text-white font-medium group-hover:underline">{track.title}</h4>
                  <p className="text-gray-400 text-sm">{track.artist}</p>
                </div>
              </div>

              {isExpanded && (
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-2 rounded-full hover:bg-white/10 transition-colors ${isLiked ? 'text-green-500' : 'text-white'}`}
                  >
                    <Heart className={`w-8 h-8 ${isLiked ? 'fill-green-500' : ''}`} />
                  </button>
                  <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <Share2 className="w-8 h-8" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <ListMusic className="w-8 h-8" />
                  </button>
                </div>
              )}
            </div>

            <div className={`flex flex-col items-center ${isExpanded ? 'absolute bottom-24 left-1/2 -translate-x-1/2 w-[600px]' : 'w-1/3'}`}>
              <PlayerControls
                isPlaying={isPlaying}
                onPlayPause={togglePlay}
                audioUrl={currentTrack?.audioUrl}
                volume={volume}
              />
            </div>
          </div>

          {isExpanded && currentTrack?.lyrics && (
            <div className="mt-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold mb-4">Lyrics</h3>
              <div className="whitespace-pre-wrap text-gray-300">
                {currentTrack.lyrics}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}