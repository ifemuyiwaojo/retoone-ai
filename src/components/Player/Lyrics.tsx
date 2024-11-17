import React from 'react';

interface Lyric {
  time: string;
  text: string;
}

interface LyricsProps {
  lyrics: Lyric[];
}

export default function Lyrics({ lyrics }: LyricsProps) {
  if (!Array.isArray(lyrics)) return null;

  return (
    <div className="space-y-6">
      {lyrics.map((lyric, index) => (
        <div key={index} className="flex gap-4">
          <span className="text-gray-400 w-12">{lyric.time}</span>
          <p className="text-white flex-1">{lyric.text}</p>
        </div>
      ))}
    </div>
  );
}