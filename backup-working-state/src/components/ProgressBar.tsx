import React from 'react';

interface ProgressBarProps {
  progress: number;
  showPercentage?: boolean;
}

export default function ProgressBar({ progress, showPercentage = true }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {showPercentage && (
        <div className="mt-1 text-sm text-gray-400 text-right">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
}