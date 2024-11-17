import React from 'react';
import ProgressBar from '../ProgressBar';

interface GenerationStatusProps {
  isGenerating: boolean;
  apiStatus: string | null;
  progress: number;
  error: string | null;
}

export default function GenerationStatus({
  isGenerating,
  apiStatus,
  progress,
  error
}: GenerationStatusProps) {
  if (!isGenerating && !error) return null;

  return (
    <>
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {isGenerating && (
        <div className="mb-6 space-y-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <p className="text-green-400 mb-4">{apiStatus}</p>
            <ProgressBar progress={progress} />
          </div>
        </div>
      )}
    </>
  );
}