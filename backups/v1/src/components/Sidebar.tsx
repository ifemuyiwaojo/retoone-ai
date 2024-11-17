import React, { useState } from 'react';
import { Home, Search, Library, PlusCircle, Heart, Music } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { playlists } from '../data/mockData';
import CreatePlaylistModal from './CreatePlaylist';

export default function Sidebar() {
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  const handleCreatePlaylist = (name: string, description: string) => {
    // Here you would typically make an API call to create the playlist
    console.log('Creating playlist:', { name, description });
  };

  return (
    <>
      <div className="w-64 bg-black h-full flex flex-col text-gray-300 p-6">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Music className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold text-white">Retoone AI</span>
        </Link>
        
        <nav className="space-y-4">
          <Link 
            to="/" 
            className={`flex items-center gap-4 transition-colors ${
              isActive('/') ? 'text-white' : 'hover:text-white'
            }`}
          >
            <Home className="w-6 h-6" />
            <span>Home</span>
          </Link>
          <Link 
            to="/search" 
            className={`flex items-center gap-4 transition-colors ${
              isActive('/search') ? 'text-white' : 'hover:text-white'
            }`}
          >
            <Search className="w-6 h-6" />
            <span>Search</span>
          </Link>
          <Link 
            to="/library" 
            className={`flex items-center gap-4 transition-colors ${
              isActive('/library') ? 'text-white' : 'hover:text-white'
            }`}
          >
            <Library className="w-6 h-6" />
            <span>Your Library</span>
          </Link>
        </nav>

        <div className="mt-8 space-y-4">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-4 hover:text-white transition-colors w-full text-left"
          >
            <PlusCircle className="w-6 h-6" />
            <span>Create Playlist</span>
          </button>
          <Link 
            to="/liked" 
            className={`flex items-center gap-4 transition-colors ${
              isActive('/liked') ? 'text-white' : 'hover:text-white'
            }`}
          >
            <Heart className="w-6 h-6" />
            <span>Liked Songs</span>
          </Link>
        </div>

        <div className="mt-6 border-t border-gray-800 pt-6">
          <div className="space-y-4">
            {playlists.map(playlist => (
              <Link
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                className={`block text-sm transition-colors ${
                  isActive(`/playlist/${playlist.id}`) ? 'text-white' : 'hover:text-white'
                }`}
              >
                {playlist.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />
    </>
  );
}