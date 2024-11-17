import React from 'react';
import { playlists } from '../data/mockData';

export default function Library() {
  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-indigo-900 to-black p-8">
      <h1 className="text-4xl font-bold mb-8">Your Library</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {playlists.map(playlist => (
          <div
            key={playlist.id}
            className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
          >
            <img
              src={playlist.coverUrl}
              alt={playlist.name}
              className="w-full aspect-square object-cover rounded-lg mb-4"
            />
            <h3 className="text-white font-semibold">{playlist.name}</h3>
            <p className="text-gray-400 text-sm">{playlist.songCount} songs</p>
          </div>
        ))}
      </div>
    </div>
  );
}