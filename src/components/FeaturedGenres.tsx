import React, { useState } from 'react';
import { Music4, Loader2 } from 'lucide-react';
import { generateTrack } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import { generateTitle } from '../utils/titleGenerator';
import { shuffle } from '../utils/arrayUtils';
import type { Track } from '../types';

const genres = [
  {
    name: 'Pop',
    description: 'Catchy melodies with modern production',
    color: 'from-pink-500 to-purple-500'
  },
  {
    name: 'Rock',
    description: 'Electric guitars and powerful rhythms',
    color: 'from-red-500 to-orange-500'
  },
  {
    name: 'Jazz',
    description: 'Smooth improvisations and soulful rhythms',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    name: 'Electronic',
    description: 'Synthesized sounds and digital beats',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    name: 'Classical',
    description: 'Timeless orchestral compositions',
    color: 'from-amber-500 to-yellow-500'
  },
  {
    name: 'Hip-Hop',
    description: 'Urban beats with rhythmic flow',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    name: 'R&B',
    description: 'Soulful melodies with smooth grooves',
    color: 'from-rose-500 to-pink-500'
  },
  {
    name: 'Folk',
    description: 'Acoustic storytelling with traditional roots',
    color: 'from-green-500 to-emerald-500'
  },
  {
    name: 'Latin',
    description: 'Vibrant rhythms and passionate melodies',
    color: 'from-orange-500 to-yellow-500'
  },
  {
    name: 'Ambient',
    description: 'Atmospheric soundscapes and textures',
    color: 'from-teal-500 to-cyan-500'
  }
];

interface GenerationState {
  progress: number;
  title?: string;
}

export default function FeaturedGenres() {
  const { playTrack } = usePlayer();
  const [generatingStates, setGeneratingStates] = useState<Record<string, GenerationState>>({});

  const handleGenreClick = async (genre: string, description: string) => {
    if (generatingStates[genre]?.progress) return;

    try {
      // Generate title first
      const title = generateTitle(genre, description);
      setGeneratingStates(prev => ({ 
        ...prev, 
        [genre]: { progress: 1, title }
      }));

      // Start progress animation
      const interval = setInterval(() => {
        setGeneratingStates(prev => {
          const current = prev[genre]?.progress || 0;
          return current >= 95 
            ? prev 
            : { 
                ...prev, 
                [genre]: { 
                  ...prev[genre], 
                  progress: current + 5 
                }
              };
        });
      }, 500);

      // Generate the track
      const track = await generateTrack(description, genre);

      clearInterval(interval);
      setGeneratingStates(prev => ({ 
        ...prev, 
        [genre]: { 
          ...prev[genre], 
          progress: 100 
        }
      }));

      // Enhance track with generated title and metadata
      const enhancedTrack: Track = {
        ...track,
        title: title || track.title,
        artist: 'AI Studio',
        album: `${genre} Generation`,
        genre,
        description
      };

      // Small delay to show 100% completion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      playTrack(enhancedTrack);
      
      // Clear progress after playing
      setTimeout(() => {
        setGeneratingStates(prev => {
          const { [genre]: _, ...rest } = prev;
          return rest;
        });
      }, 1000);

    } catch (error) {
      console.error('Generation failed:', error);
      setGeneratingStates(prev => {
        const { [genre]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6">
      {shuffle(genres).map(({ name, description, color }) => {
        const state = generatingStates[name] || { progress: 0 };
        const isGenerating = state.progress > 0;

        return (
          <button
            key={name}
            onClick={() => handleGenreClick(name, description)}
            disabled={isGenerating}
            className={`relative group overflow-hidden rounded-lg aspect-square bg-gradient-to-br ${color} p-6 text-white hover:shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100`}
          >
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
              {isGenerating ? (
                <>
                  <Loader2 className="w-8 h-8 mb-3 animate-spin" />
                  {state.title && (
                    <p className="text-sm font-medium mb-2 line-clamp-1">
                      {state.title}
                    </p>
                  )}
                  <div className="w-full h-1 bg-white/20 rounded-full mt-2">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-300"
                      style={{ width: `${state.progress}%` }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <Music4 className="w-8 h-8 mb-3" />
                  <h3 className="font-bold text-lg mb-1">{name}</h3>
                  <p className="text-sm text-white/80">{description}</p>
                </>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}