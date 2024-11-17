import { Track, Playlist } from '../types';

export const featuredSongs: Track[] = [
  {
    id: '1',
    title: 'Midnight Rain',
    artist: 'Luna Eclipse',
    album: 'Neon Dreams',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop',
    duration: 241,
    liked: true,
    audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav'
  },
  {
    id: '2',
    title: 'Stellar Dance',
    artist: 'Cosmic Waves',
    album: 'Galaxy Groove',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop',
    duration: 197,
    liked: false,
    audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch60.wav'
  },
  {
    id: '3',
    title: 'Urban Echo',
    artist: 'City Lights',
    album: 'Metropolitan',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    duration: 224,
    liked: true,
    audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther60.wav'
  }
];

export const playlists: Playlist[] = [
  {
    id: '1',
    name: 'Chill Vibes',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    songCount: 45
  },
  {
    id: '2',
    name: 'Workout Mix',
    coverUrl: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=300&h=300&fit=crop',
    songCount: 32
  }
];