import axios from 'axios';
import { Song, Playlist } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 30000,
});

export const musicAPI = {
  // Songs
  getAllSongs: async (): Promise<Song[]> => {
    const response = await api.get('/music');
    return response.data;
  },

  uploadSong: async (file: File): Promise<Song> => {
    const formData = new FormData();
    formData.append('audio', file);
    
    const response = await api.post('/music/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.song;
  },

  deleteSong: async (songId: string): Promise<void> => {
    await api.delete(`/music/${songId}`);
  },

  getStreamUrl: (songId: string): string => {
    return `http://localhost:3001/api/music/stream/${songId}`;
  },

  // Favorites
  toggleFavorite: async (songId: string): Promise<Song> => {
    const response = await api.post(`/music/favorite/${songId}`);
    return response.data.song;
  },

  getFavorites: async (): Promise<Song[]> => {
    const response = await api.get('/music/favorites');
    return response.data;
  },

  // Playlists
  getAllPlaylists: async (): Promise<Playlist[]> => {
    const response = await api.get('/playlists');
    return response.data;
  },

  createPlaylist: async (name: string, description?: string): Promise<Playlist> => {
    const response = await api.post('/playlists', { name, description });
    return response.data;
  },

  updatePlaylist: async (playlistId: string, updates: Partial<Playlist>): Promise<Playlist> => {
    const response = await api.put(`/playlists/${playlistId}`, updates);
    return response.data;
  },

  deletePlaylist: async (playlistId: string): Promise<void> => {
    await api.delete(`/playlists/${playlistId}`);
  },

  addSongToPlaylist: async (playlistId: string, songId: string): Promise<void> => {
    await api.post(`/playlists/${playlistId}/songs`, { songId });
  },

  removeSongFromPlaylist: async (playlistId: string, songId: string): Promise<void> => {
    await api.delete(`/playlists/${playlistId}/songs/${songId}`);
  },

  getPlaylistSongs: async (playlistId: string): Promise<{ playlist: Playlist; songs: Song[] }> => {
    const response = await api.get(`/playlists/${playlistId}/songs`);
    return response.data;
  },

  // Settings
  getSettings: async (): Promise<any> => {
    const response = await api.get('/settings');
    return response.data;
  },

  updateSettings: async (settings: any): Promise<any> => {
    const response = await api.put('/settings', settings);
    return response.data;
  },

  testSpotifyConfig: async (spotifyClientId: string, spotifyClientSecret: string): Promise<any> => {
    const response = await api.post('/settings/test-spotify', {
      spotifyClientId,
      spotifyClientSecret
    });
    return response.data;
  },
};

export default api;
