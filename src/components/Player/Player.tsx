import React, { useState } from 'react';
import { ChevronDown, Share2, ListMusic } from 'lucide-react';
import PlayerControls from './PlayerControls';
import VolumeControl from './VolumeControl';
import TrackInfo from './TrackInfo';
import Lyrics from './Lyrics';
import { usePlayer } from '../../context/PlayerContext';

export default function Player() {
  const { currentTrack, isPlaying, togglePlay } = usePlayer();
  const [volume, setVolume] = useState(80);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  if (!currentTrack) return null;

  // Parse lyrics if they're in JSON format
  const parsedLyrics = currentTrack.lyrics ? (
    typeof currentTrack.lyrics === 'string' 
      ? currentTrack.lyrics
      : Array.isArray(currentTrack.lyrics)
        ? currentTrack.lyrics
        : JSON.stringify(currentTrack.lyrics, null, 2)
  ) : null;

  return (
    <>
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
      
      <div className={`fixed bottom-0 left-0 right-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black border-t border-white/5 shadow-2xl transition-all duration-300 ease-in-out z-50 ${
        isExpanded ? 'h-screen' : 'h-24'
      }`}>
        <div className={`h-full flex flex-col ${isExpanded ? 'px-4 py-4 md:px-8 md:py-6' : 'px-4'}`}>
          {isExpanded && (
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Now Playing</h2>
                <p className="text-sm text-gray-400 mt-1">
                  {currentTrack.genre || 'AI Generated Music'}
                </p>
              </div>
              <button 
                onClick={() => setIsExpanded(false)}
                className="hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>
          )}

          <div className={`flex flex-col md:flex-row items-center ${isExpanded ? 'flex-1' : 'h-full'}`}>
            <div className={`flex items-center ${isExpanded ? 'w-full md:w-1/3 mb-6 md:mb-0' : 'w-1/3'}`}>
              <TrackInfo
                track={currentTrack}
                isExpanded={isExpanded}
                isLiked={isLiked}
                onLikeToggle={() => setIsLiked(!isLiked)}
                onExpandClick={() => setIsExpanded(true)}
              />
            </div>

            <div className={`flex-1 ${
              isExpanded 
                ? 'absolute bottom-24 left-0 right-0 px-4 md:px-0 md:static md:mt-0' 
                : 'flex justify-center'
            }`}>
              <PlayerControls
                isPlaying={isPlaying}
                onPlayPause={togglePlay}
                audioUrl={currentTrack.audioUrl}
                volume={volume}
              />
            </div>

            <div className={`${
              isExpanded 
                ? 'absolute bottom-24 right-8 hidden md:flex' 
                : 'w-1/3 justify-end hidden md:flex'
            } items-center gap-6`}>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <ListMusic className="w-5 h-5" />
              </button>
              <VolumeControl
                volume={volume}
                onVolumeChange={setVolume}
              />
            </div>
          </div>

          {isExpanded && (
            <div className="mt-8 max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                {currentTrack.description && (
                  <div>
                    <h3 className="text-xl font-bold mb-3">About this Track</h3>
                    <p className="text-gray-300 leading-relaxed">{currentTrack.description}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold mb-3">Track Details</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex">
                      <dt className="w-24 text-gray-400">Genre</dt>
                      <dd className="text-white">{currentTrack.genre || 'AI Generated'}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-24 text-gray-400">Artist</dt>
                      <dd className="text-white">{currentTrack.artist}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-24 text-gray-400">Album</dt>
                      <dd className="text-white">{currentTrack.album}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              {parsedLyrics && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Lyrics</h3>
                  <div className="bg-black/20 rounded-lg p-6">
                    {Array.isArray(parsedLyrics) ? (
                      <Lyrics lyrics={parsedLyrics} />
                    ) : (
                      <div className="whitespace-pre-wrap text-gray-300">
                        {parsedLyrics}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}