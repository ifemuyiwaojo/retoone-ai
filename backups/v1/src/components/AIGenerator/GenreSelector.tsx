import React from 'react';

interface GenreSelectorProps {
  genreSubgenres: Record<string, string[]>;
  activeGenre: string | null;
  activeSubgenres: Record<string, boolean>;
  isGenerating: boolean;
  onGenreClick: (genre: string) => void;
  onSubgenreClick: (subgenre: string) => void;
}

export default function GenreSelector({
  genreSubgenres,
  activeGenre,
  activeSubgenres,
  isGenerating,
  onGenreClick,
  onSubgenreClick
}: GenreSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Object.entries(genreSubgenres).map(([genre, subgenres]) => (
        <div key={genre} className="space-y-2">
          <button
            type="button"
            className={`w-full p-3 rounded-lg text-left transition-colors ${
              activeGenre === genre 
                ? 'bg-white/20 text-white' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
            onClick={() => onGenreClick(genre)}
            disabled={isGenerating}
          >
            {genre}
          </button>
          {activeGenre === genre && (
            <div className="space-y-2 pl-4">
              {subgenres.map((subgenre) => (
                <button
                  key={subgenre}
                  type="button"
                  className={`w-full p-2 rounded-lg text-sm text-left transition-colors ${
                    activeSubgenres[subgenre]
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                  onClick={() => onSubgenreClick(subgenre)}
                  disabled={isGenerating}
                >
                  {subgenre}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}