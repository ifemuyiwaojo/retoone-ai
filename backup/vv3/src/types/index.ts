export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: number;
  liked: boolean;
  audioUrl?: string;
}

export interface Playlist {
  id: string;
  name: string;
  coverUrl: string;
  songCount: number;
}