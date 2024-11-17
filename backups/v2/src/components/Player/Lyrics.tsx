import React from 'react';

interface Lyric {
  time: string;
  text: string;
}

interface LyricsProps {
  lyrics: Lyric[];
}

export default function Lyrics({ lyrics }: LyricsProps) {
  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold mb-4">Lyrics</h3>
      <div className="space-y-6">
        {lyrics.map((lyric, index) => (
          <div key={index} className="flex gap-4">
            <span className="text-gray-400 w-12">{lyric.time}</span>
            <p className="text-white">{lyric.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}