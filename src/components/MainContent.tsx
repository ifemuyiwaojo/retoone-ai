import React from 'react';
import { Clock, Heart, Wand2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { featuredSongs } from '../data/mockData';

interface MainContentProps {
  onGenerateClick: () => void;
}

export default function MainContent({ onGenerateClick }: MainContentProps) {
  const { playTrack } = usePlayer();

  const handleGenerateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onGenerateClick();
  };

  const handleLikeToggle = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Toggle like for track:', trackId);
  };

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-indigo-900 to-black">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Unleash Your AI Music Creativity</h1>
          <button
            onClick={handleGenerateClick}
            type="button"
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            <Wand2 className="w-5 h-5" />
            Generate Music
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredSongs.slice(0, 6).map(track => (
            <div
              key={track.id}
              className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
              onClick={() => playTrack(track)}
            >
              <img
                src={track.coverUrl}
                alt={track.title}
                className="w-full aspect-square object-cover rounded-lg mb-4"
              />
              <h3 className="text-white font-semibold">{track.title}</h3>
              <p className="text-gray-400">{track.artist}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-6">Recent Generations</h2>
        <table className="w-full text-left text-gray-300">
          <thead>
            <tr className="border-b border-gray-700 text-sm">
              <th className="pb-3 w-12">#</th>
              <th className="pb-3">Title</th>
              <th className="pb-3">Album</th>
              <th className="pb-3 text-right">
                <Clock className="w-5 h-5 inline-block" />
              </th>
            </tr>
          </thead>
          <tbody>
            {featuredSongs.map((track, index) => (
              <tr
                key={track.id}
                className="group hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => playTrack(track)}
              >
                <td className="py-4">{index + 1}</td>
                <td>
                  <div className="flex items-center">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-10 h-10 mr-4"
                    />
                    <div>
                      <p className="text-white font-medium">{track.title}</p>
                      <p className="text-sm">{track.artist}</p>
                    </div>
                  </div>
                </td>
                <td>{track.album}</td>
                <td className="text-right">
                  <button 
                    className="invisible group-hover:visible mr-4"
                    onClick={(e) => handleLikeToggle(track.id, e)}
                    type="button"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        track.liked ? 'text-green-500 fill-green-500' : ''
                      }`}
                    />
                  </button>
                  {Math.floor(track.duration / 60)}:
                  {(track.duration % 60).toString().padStart(2, '0')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}