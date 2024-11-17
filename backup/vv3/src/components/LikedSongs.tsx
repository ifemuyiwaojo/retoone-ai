import React from 'react';
import { Heart } from 'lucide-react';
import { featuredSongs } from '../data/mockData';

export default function LikedSongs() {
  const likedSongs = featuredSongs.filter(song => song.liked);

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-indigo-900 to-black">
      <div className="h-64 bg-gradient-to-b from-purple-800 to-transparent p-8 flex items-end">
        <div className="flex items-center gap-6">
          <div className="w-52 h-52 bg-gradient-to-br from-purple-600 to-purple-900 rounded-lg flex items-center justify-center">
            <Heart className="w-24 h-24 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase text-white">Playlist</h4>
            <h1 className="text-7xl font-bold text-white mt-2">Liked Songs</h1>
            <p className="text-gray-300 mt-6">{likedSongs.length} songs</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <table className="w-full text-left text-gray-300">
          <thead>
            <tr className="border-b border-gray-700 text-sm">
              <th className="pb-3 w-12">#</th>
              <th className="pb-3">Title</th>
              <th className="pb-3">Album</th>
              <th className="pb-3">Duration</th>
            </tr>
          </thead>
          <tbody>
            {likedSongs.map((song, index) => (
              <tr
                key={song.id}
                className="group hover:bg-white/10 transition-colors"
              >
                <td className="py-4">{index + 1}</td>
                <td>
                  <div className="flex items-center">
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="w-10 h-10 mr-4"
                    />
                    <div>
                      <p className="text-white font-medium">{song.title}</p>
                      <p className="text-sm">{song.artist}</p>
                    </div>
                  </div>
                </td>
                <td>{song.album}</td>
                <td>
                  {Math.floor(song.duration / 60)}:
                  {(song.duration % 60).toString().padStart(2, '0')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}