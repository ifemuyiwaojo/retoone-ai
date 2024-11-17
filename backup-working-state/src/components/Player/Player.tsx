import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import PlayerControls from './PlayerControls';
import VolumeControl from './VolumeControl';
import TrackInfo from './TrackInfo';
import Lyrics from './Lyrics';
import { usePlayer } from '../../context/PlayerContext';

const mockLyrics = [
  { time: "0:00", text: "Walking through the city lights" },
  { time: "0:15", text: "Neon signs paint the night" },
  { time: "0:30", text: "Memories of yesterday" },
  { time: "0:45", text: "Slowly starting to fade away" },
  { time: "1:00", text: "In the midnight rain" },
  { time: "1:15", text: "Trying to wash away the pain" },
];

export default function Player() {
  const { currentTrack, isPlaying, togglePlay } = usePlayer();
  const [volume, setVolume] = useState(80);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  if (!currentTrack) return null;

  return (
    <>
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
      
      <div className={`fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-black transition-all duration-300 ease-in-out z-50 ${
        isExpanded ? 'h-screen' : 'h-20'
      }`}>
        <div className={`h-full flex flex-col ${isExpanded ? 'px-4 py-4 md:px-8 md:py-6' : 'px-4'}`}>
          {isExpanded && (
            <div className="flex justify-end mb-2 md:mb-4">
              <button 
                onClick={() => setIsExpanded(false)}
                className="hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>
          )}

          <div className={`flex flex-col md:flex-row items-center ${isExpanded ? 'flex-1' : 'h-20'}`}>
            <TrackInfo
              track={currentTrack}
              isExpanded={isExpanded}
              isLiked={isLiked}
              onLikeToggle={() => setIsLiked(!isLiked)}
              onExpandClick={() => setIsExpanded(true)}
            />

            <div className={`flex-1 ${
              isExpanded 
                ? 'absolute bottom-24 left-0 right-0 px-4 md:px-0 md:static md:mt-0' 
                : 'mt-2 md:mt-0'
            }`}>
              <PlayerControls
                isPlaying={isPlaying}
                onPlayPause={togglePlay}
                audioUrl={currentTrack.audioUrl}
              />
            </div>

            <div className={`${
              isExpanded 
                ? 'absolute bottom-24 right-8 hidden md:block' 
                : 'w-1/3 justify-end hidden md:flex'
            }`}>
              <VolumeControl
                volume={volume}
                onVolumeChange={setVolume}
              />
            </div>
          </div>

          {isExpanded && (
            <Lyrics lyrics={mockLyrics} />
          )}
        </div>
      </div>
    </>
  );
}