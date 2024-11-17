import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { generateTrack } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import ProgressBar from './ProgressBar';

interface AIGeneratorProps {
  genreSubgenres: Record<string, string[]>;
  onClose: () => void;
}

export default function AIGenerator({ genreSubgenres, onClose }: AIGeneratorProps) {
  const { playTrack } = usePlayer();
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [activeSubgenres, setActiveSubgenres] = useState<Record<string, boolean>>({});
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isGenerating) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + (95 - prev) * 0.1;
        });
      }, 500);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isGenerating]);

  const handleGenreClick = (genre: string) => {
    if (!isGenerating) {
      setActiveGenre(activeGenre === genre ? null : genre);
      setActiveSubgenres({});
    }
  };

  const handleSubgenreClick = (subgenre: string) => {
    if (!isGenerating) {
      setActiveSubgenres(prev => ({
        ...prev,
        [subgenre]: !prev[subgenre]
      }));
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGenre || !inputValue.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const selectedSubgenres = Object.entries(activeSubgenres)
        .filter(([_, isSelected]) => isSelected)
        .map(([subgenre]) => subgenre);

      const track = await generateTrack(inputValue, activeGenre, selectedSubgenres);
      
      setProgress(100);
      
      // Small delay to show 100% completion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      playTrack(track);
      onClose();
    } catch (error) {
      console.error('Generation failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate music');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-indigo-900 to-black p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Generate AI Music</h1>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          disabled={isGenerating}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {isGenerating && (
        <div className="mb-6 space-y-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <p className="text-green-400 mb-4">Generating your music...</p>
            <ProgressBar progress={progress} />
          </div>
        </div>
      )}

      <form onSubmit={handleGenerate} className="mb-8">
        <input
          type="text"
          className="w-full p-4 bg-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="Describe the music you want generated..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isGenerating}
        />
        <button
          type="submit"
          disabled={isGenerating || !activeGenre || !inputValue.trim()}
          className={`mt-4 px-8 py-3 rounded-full flex items-center justify-center gap-2 ${
            isGenerating || !activeGenre || !inputValue.trim()
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
          } text-white transition-colors min-w-[160px]`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate'
          )}
        </button>
      </form>

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
              onClick={() => handleGenreClick(genre)}
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
                    onClick={() => handleSubgenreClick(subgenre)}
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
    </div>
  );
}