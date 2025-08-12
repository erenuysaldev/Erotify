export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  filename: string;
  filePath: string;
  uploadedAt: string;
  size: number;
  format: string;
  bitrate?: number;
  sampleRate?: number;
  genre?: string;
  year?: number;
  isFavorite?: boolean; // Favori şarkı mı
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songIds: string[];
  createdAt: string;
  updatedAt: string;
  coverImage?: string;
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playlist: Song[];
  currentIndex: number;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
}
