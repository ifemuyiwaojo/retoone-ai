import { sample } from './arrayUtils';

const adjectives = [
  'Midnight', 'Crystal', 'Electric', 'Neon', 'Cosmic', 'Urban', 'Digital',
  'Golden', 'Silver', 'Velvet', 'Mystic', 'Eternal', 'Stellar', 'Lunar',
  'Sonic', 'Astral', 'Radiant', 'Ethereal', 'Infinite', 'Quantum'
];

const nouns = [
  'Dreams', 'Waves', 'Echo', 'Pulse', 'Rhythm', 'Dance', 'Symphony',
  'Journey', 'Vision', 'Light', 'Storm', 'Rain', 'Fire', 'Wind',
  'Heart', 'Soul', 'Spirit', 'Mind', 'Sky', 'Ocean'
];

const genreWords = {
  'Pop': ['Love', 'Heart', 'Dance', 'Night', 'Dream', 'Star'],
  'Rock': ['Fire', 'Storm', 'Thunder', 'Wild', 'Free', 'Dark'],
  'Jazz': ['Blue', 'Moon', 'Smooth', 'Night', 'Soul', 'Groove'],
  'Electronic': ['Pulse', 'Beat', 'Wave', 'Neon', 'Digital', 'Circuit'],
  'Classical': ['Symphony', 'Sonata', 'Aria', 'Opus', 'Harmony', 'Echo'],
  'Hip-Hop': ['Flow', 'Beat', 'Street', 'Rhythm', 'City', 'Vibe']
};

export function generateTitle(genre: string, description?: string): string {
  const genreSpecificWords = genreWords[genre as keyof typeof genreWords] || [];
  const allWords = [...adjectives, ...nouns, ...genreSpecificWords];
  
  // Extract meaningful words from description
  const descriptionWords = description
    ?.split(' ')
    .filter(word => word.length > 3)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .slice(0, 3) || [];

  // Combine different approaches
  const approaches = [
    // Genre-specific word + Common noun
    () => `${sample(genreSpecificWords || adjectives)} ${sample(nouns)}`,
    // Adjective + Genre-specific word
    () => `${sample(adjectives)} ${sample(genreSpecificWords || nouns)}`,
    // Use description word if available
    () => descriptionWords.length ? `${sample(adjectives)} ${sample(descriptionWords)}` : null,
    // Simple two-word combination
    () => `${sample(allWords)} ${sample(nouns)}`
  ];

  // Try each approach until we get a title
  for (const approach of approaches) {
    const title = approach();
    if (title) return title;
  }

  // Fallback
  return `${sample(adjectives)} ${sample(nouns)}`;
}