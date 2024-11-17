import React, { useState } from 'react';
import { X } from 'lucide-react';
import { generateTrack } from '../../services/api';
import { usePlayer } from '../../context/PlayerContext';
import { useQueue } from '../../context/QueueContext';
import GenerationForm from './GenerationForm';
import GenerationStatus from './GenerationStatus';
import GenreSelector from './GenreSelector';

interface AIGeneratorProps {
  genreSubgenres: Record<string, string[]>;
  onClose: () => void;
}

export default function AIGenerator({ genreSubgenres, onClose }: AIGeneratorProps) {
  const { playTrack } = usePlayer();
  const { addAlternateVersions } = useQueue();
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [activeSubgenres, setActiveSubgenres] = useState<Record<string, boolean>>({});
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

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
    setProgress(0);
    setApiStatus('Preparing to generate your music...');

    try {
      const selectedSubgenres = Object.entries(activeSubgenres)
        .filter(([_, isSelected]) => isSelected)
        .map(([subgenre]) => subgenre);

      setProgress(25);
      setApiStatus('Generating your music...');
      
      const track = await generateTrack(inputValue.trim(), activeGenre, selectedSubgenres);
      
      setProgress(100);
      setApiStatus('Playing generated track...');
      
      // Small delay to show 100% completion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      playTrack(track);
      onClose();
    } catch (error) {
      console.error('Generation failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate music');
      setProgress(0);
    } finally {
      setIsGenerating(false);
      setApiStatus(null);
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

      <GenerationStatus
        isGenerating={isGenerating}
        apiStatus={apiStatus}
        progress={progress}
        error={error}
      />

      <GenerationForm
        inputValue={inputValue}
        isGenerating={isGenerating}
        activeGenre={activeGenre}
        onInputChange={setInputValue}
        onSubmit={handleGenerate}
      />

      <GenreSelector
        genreSubgenres={genreSubgenres}
        activeGenre={activeGenre}
        activeSubgenres={activeSubgenres}
        isGenerating={isGenerating}
        onGenreClick={handleGenreClick}
        onSubgenreClick={handleSubgenreClick}
      />
    </div>
  );
}