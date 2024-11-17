import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { featuredSongs } from '../data/mockData';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSongs = featuredSongs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-indigo-900 to-black p-8">
      <div className="max-w-3xl mx-auto">
        <div className="relative mb-8">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for songs, artists, or albums"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/10 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>

        {searchQuery && (
          <div className="space-y-4">
            {filteredSongs.length > 0 ? (
              filteredSongs.map(song => (
                <div
                  key={song.id}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/10 transition-colors group"
                >
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-16 h-16 rounded"
                  />
                  <div>
                    <h3 className="text-white font-medium">{song.title}</h3>
                    <p className="text-gray-400 text-sm">{song.artist} • {song.album}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No results found for "{searchQuery}"</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}