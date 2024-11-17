import React from 'react';
import { Loader2 } from 'lucide-react';

interface GenerationFormProps {
  inputValue: string;
  isGenerating: boolean;
  activeGenre: string | null;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function GenerationForm({
  inputValue,
  isGenerating,
  activeGenre,
  onInputChange,
  onSubmit
}: GenerationFormProps) {
  return (
    <form onSubmit={onSubmit} className="mb-8">
      <input
        type="text"
        className="w-full p-4 bg-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
        placeholder="Describe the music you want generated..."
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
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
  );
}