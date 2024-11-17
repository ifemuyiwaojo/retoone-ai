export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: number;
  liked: boolean;
  audioUrl?: string;
  lyrics?: string | Array<{ time: string; text: string }>;
  description?: string;
  genre?: string;
}

export interface Playlist {
  id: string;
  name: string;
  coverUrl: string;
  songCount: number;
}