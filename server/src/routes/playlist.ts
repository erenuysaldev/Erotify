import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Playlist } from '../types';
import { DataManager } from '../utils/dataManager';

const router = express.Router();

// Tüm playlistleri getir
router.get('/', async (req, res) => {
  try {
    const playlists = await DataManager.getPlaylists();
    res.json(playlists);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ error: 'Playlistler getirilemedi' });
  }
});

// Playlist oluştur
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Playlist adı gerekli' });
    }

    const playlist: Playlist = {
      id: uuidv4(),
      name: name.trim(),
      description: description?.trim() || '',
      songIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await DataManager.addPlaylist(playlist);
    res.json(playlist);

  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ error: 'Playlist oluşturulamadı' });
  }
});

// Playlist güncelle
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // ID'yi güncellemesine izin verme
    delete updates.id;
    delete updates.createdAt;
    
    const success = await DataManager.updatePlaylist(id, updates);
    
    if (success) {
      const playlists = await DataManager.getPlaylists();
      const updatedPlaylist = playlists.find(p => p.id === id);
      res.json(updatedPlaylist);
    } else {
      res.status(404).json({ error: 'Playlist bulunamadı' });
    }
  } catch (error) {
    console.error('Error updating playlist:', error);
    res.status(500).json({ error: 'Playlist güncellenemedi' });
  }
});

// Playlist sil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await DataManager.deletePlaylist(id);
    
    if (success) {
      res.json({ message: 'Playlist başarıyla silindi' });
    } else {
      res.status(404).json({ error: 'Playlist bulunamadı' });
    }
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ error: 'Playlist silinirken hata oluştu' });
  }
});

// Playlist'e şarkı ekle
router.post('/:id/songs', async (req, res) => {
  try {
    const { id } = req.params;
    const { songId } = req.body;
    
    if (!songId) {
      return res.status(400).json({ error: 'Şarkı ID gerekli' });
    }

    const playlists = await DataManager.getPlaylists();
    const playlist = playlists.find(p => p.id === id);
    
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist bulunamadı' });
    }

    // Şarkı zaten playlist'te var mı kontrol et
    if (playlist.songIds.includes(songId)) {
      return res.status(400).json({ error: 'Şarkı zaten playlist\'te mevcut' });
    }

    // Şarkının gerçekten var olduğunu kontrol et
    const songs = await DataManager.getSongs();
    const songExists = songs.some(s => s.id === songId);
    
    if (!songExists) {
      return res.status(404).json({ error: 'Şarkı bulunamadı' });
    }

    playlist.songIds.push(songId);
    const success = await DataManager.updatePlaylist(id, { songIds: playlist.songIds });
    
    if (success) {
      res.json({ message: 'Şarkı playlist\'e eklendi' });
    } else {
      res.status(500).json({ error: 'Şarkı eklenirken hata oluştu' });
    }
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    res.status(500).json({ error: 'Şarkı playlist\'e eklenirken hata oluştu' });
  }
});

// Playlist'ten şarkı çıkar
router.delete('/:id/songs/:songId', async (req, res) => {
  try {
    const { id, songId } = req.params;
    
    const playlists = await DataManager.getPlaylists();
    const playlist = playlists.find(p => p.id === id);
    
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist bulunamadı' });
    }

    const songIndex = playlist.songIds.indexOf(songId);
    if (songIndex === -1) {
      return res.status(404).json({ error: 'Şarkı playlist\'te bulunamadı' });
    }

    playlist.songIds.splice(songIndex, 1);
    const success = await DataManager.updatePlaylist(id, { songIds: playlist.songIds });
    
    if (success) {
      res.json({ message: 'Şarkı playlist\'ten çıkarıldı' });
    } else {
      res.status(500).json({ error: 'Şarkı çıkarılırken hata oluştu' });
    }
  } catch (error) {
    console.error('Error removing song from playlist:', error);
    res.status(500).json({ error: 'Şarkı playlist\'ten çıkarılırken hata oluştu' });
  }
});

// Playlist şarkılarını detaylı bilgileriyle getir
router.get('/:id/songs', async (req, res) => {
  try {
    const { id } = req.params;
    
    const playlists = await DataManager.getPlaylists();
    const playlist = playlists.find(p => p.id === id);
    
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist bulunamadı' });
    }

    const songs = await DataManager.getSongs();
    const playlistSongs = playlist.songIds
      .map(songId => songs.find(s => s.id === songId))
      .filter(song => song !== undefined);

    res.json({
      playlist,
      songs: playlistSongs
    });
  } catch (error) {
    console.error('Error fetching playlist songs:', error);
    res.status(500).json({ error: 'Playlist şarkıları getirilemedi' });
  }
});

export default router;
