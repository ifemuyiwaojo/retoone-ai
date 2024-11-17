import React from 'react';
import { useParams } from 'react-router-dom';
import { playlists, featuredSongs } from '../data/mockData';
import { usePlayer } from '../context/PlayerContext';
import { Heart, Play, Pause } from 'lucide-react';

export default function Playlist() {
  const { id } = useParams();
  const playlist = playlists.find(p => p.id === id);
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();

  if (!playlist) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-indigo-900 to-black">
        <p className="text-gray-400">Playlist not found</p>
      </div>
    );
  }

  const isCurrentTrack = (songId: string) => currentTrack?.id === songId;

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-indigo-900 to-black">
      <div className="h-64 bg-gradient-to-b from-blue-800 to-transparent p-8 flex items-end">
        <div className="flex items-center gap-6">
          <img
            src={playlist.coverUrl}
            alt={playlist.name}
            className="w-52 h-52 shadow-lg rounded"
          />
          <div>
            <h4 className="text-sm font-bold uppercase text-white">Playlist</h4>
            <h1 className="text-7xl font-bold text-white mt-2">{playlist.name}</h1>
            <p className="text-gray-300 mt-6">{playlist.songCount} songs</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <table className="w-full text-left text-gray-300">
          <thead>
            <tr className="border-b border-gray-700 text-sm">
              <th className="pb-3 w-12">#</th>
              <th className="pb-3">Title</th>
              <th className="pb-3 hidden md:table-cell">Album</th>
              <th className="pb-3 hidden md:table-cell">Duration</th>
            </tr>
          </thead>
          <tbody>
            {featuredSongs.map((song, index) => {
              const isPlaying = isCurrentTrack(song.id);
              
              return (
                <tr
                  key={song.id}
                  className="group hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => playTrack(song)}
                >
                  <td className="py-4 w-12">
                    <div className="relative w-4 group-hover:hidden">
                      {index + 1}
                    </div>
                    <button 
                      className="hidden group-hover:block absolute"
                      onClick={(e) => {
                        e.stopPropagation();
                        isPlaying ? togglePlay() : playTrack(song);
                      }}
                    >
                      {isPlaying && isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                  <td>
                    <div className="flex items-center">
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="w-10 h-10 mr-4"
                      />
                      <div>
                        <p className={`font-medium ${isPlaying ? 'text-green-500' : 'text-white'}`}>
                          {song.title}
                        </p>
                        <p className="text-sm">{song.artist}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell">{song.album}</td>
                  <td className="hidden md:table-cell">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle like functionality
                        }}
                        className="invisible group-hover:visible"
                      >
                        <Heart className={`w-5 h-5 ${song.liked ? 'fill-green-500 text-green-500' : ''}`} />
                      </button>
                      {Math.floor(song.duration / 60)}:
                      {(song.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}