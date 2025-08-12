import fs from 'fs-extra';
import path from 'path';
import { Song, Playlist } from '../types';

const DATA_DIR = path.join(__dirname, '../../../data');

export class DataManager {
  static async getSongs(): Promise<Song[]> {
    try {
      const filePath = path.join(DATA_DIR, 'songs.json');
      return await fs.readJson(filePath);
    } catch (error) {
      console.error('Error reading songs:', error);
      return [];
    }
  }

  static async saveSongs(songs: Song[]): Promise<void> {
    try {
      const filePath = path.join(DATA_DIR, 'songs.json');
      await fs.writeJson(filePath, songs, { spaces: 2 });
    } catch (error) {
      console.error('Error saving songs:', error);
      throw error;
    }
  }

  static async addSong(song: Song): Promise<void> {
    const songs = await this.getSongs();
    songs.push(song);
    await this.saveSongs(songs);
  }

  static async deleteSong(songId: string): Promise<boolean> {
    const songs = await this.getSongs();
    const index = songs.findIndex(s => s.id === songId);
    
    if (index === -1) return false;
    
    // Dosyayı sil
    const song = songs[index];
    try {
      await fs.remove(song.filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
    
    // Listeden çıkar
    songs.splice(index, 1);
    await this.saveSongs(songs);
    
    // Playlist'lerden de çıkar
    await this.removeSongFromAllPlaylists(songId);
    
    return true;
  }

  static async getPlaylists(): Promise<Playlist[]> {
    try {
      const filePath = path.join(DATA_DIR, 'playlists.json');
      return await fs.readJson(filePath);
    } catch (error) {
      console.error('Error reading playlists:', error);
      return [];
    }
  }

  static async savePlaylists(playlists: Playlist[]): Promise<void> {
    try {
      const filePath = path.join(DATA_DIR, 'playlists.json');
      await fs.writeJson(filePath, playlists, { spaces: 2 });
    } catch (error) {
      console.error('Error saving playlists:', error);
      throw error;
    }
  }

  static async addPlaylist(playlist: Playlist): Promise<void> {
    const playlists = await this.getPlaylists();
    playlists.push(playlist);
    await this.savePlaylists(playlists);
  }

  static async updatePlaylist(playlistId: string, updates: Partial<Playlist>): Promise<boolean> {
    const playlists = await this.getPlaylists();
    const index = playlists.findIndex(p => p.id === playlistId);
    
    if (index === -1) return false;
    
    playlists[index] = { ...playlists[index], ...updates, updatedAt: new Date().toISOString() };
    await this.savePlaylists(playlists);
    return true;
  }

  static async deletePlaylist(playlistId: string): Promise<boolean> {
    const playlists = await this.getPlaylists();
    const index = playlists.findIndex(p => p.id === playlistId);
    
    if (index === -1) return false;
    
    playlists.splice(index, 1);
    await this.savePlaylists(playlists);
    return true;
  }

  static async removeSongFromAllPlaylists(songId: string): Promise<void> {
    const playlists = await this.getPlaylists();
    let hasChanges = false;
    
    for (const playlist of playlists) {
      const index = playlist.songIds.indexOf(songId);
      if (index !== -1) {
        playlist.songIds.splice(index, 1);
        playlist.updatedAt = new Date().toISOString();
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      await this.savePlaylists(playlists);
    }
  }
}
