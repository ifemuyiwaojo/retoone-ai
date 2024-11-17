import React from 'react';
import { Wand2 } from 'lucide-react';
import FeaturedGenres from '../components/FeaturedGenres';

interface HomeProps {
  onGenerateClick: () => void;
}

export default function Home({ onGenerateClick }: HomeProps) {
  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-indigo-900 to-black">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">AI Music Studio</h1>
            <p className="text-gray-400">Create unique music with artificial intelligence</p>
          </div>
          <button
            onClick={onGenerateClick}
            type="button"
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            <Wand2 className="w-5 h-5" />
            Custom Generation
          </button>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Genres</h2>
          <p className="text-gray-400 mb-6">Click any genre to instantly generate music in that style</p>
          <FeaturedGenres />
        </section>
      </div>
    </div>
  );
}