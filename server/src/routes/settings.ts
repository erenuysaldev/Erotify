import express from 'express';
import { SettingsManager } from '../utils/settingsManager';
import axios from 'axios';

const router = express.Router();

// Ayarları getir
router.get('/', async (req, res) => {
  try {
    const settings = await SettingsManager.getSettings();
    
    // Güvenlik için client secret'ı maskeleyelim
    const safeSettings = {
      ...settings,
      spotifyClientSecret: settings.spotifyClientSecret ? '***masked***' : undefined
    };
    
    res.json(safeSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Ayarlar getirilemedi' });
  }
});

// Ayarları güncelle
router.put('/', async (req, res) => {
  try {
    const { spotifyClientId, spotifyClientSecret } = req.body;
    
    const updates: any = {};
    
    if (spotifyClientId !== undefined) {
      updates.spotifyClientId = spotifyClientId;
    }
    
    if (spotifyClientSecret !== undefined && spotifyClientSecret !== '***masked***') {
      updates.spotifyClientSecret = spotifyClientSecret;
    }
    
    const updatedSettings = await SettingsManager.updateSettings(updates);
    
    // Python service'i bilgilendir
    try {
      await axios.post('http://localhost:8000/update-spotify-config', {
        client_id: updatedSettings.spotifyClientId,
        client_secret: updatedSettings.spotifyClientSecret
      });
    } catch (error) {
      console.warn('Python service could not be notified about config update:', error);
    }
    
    // Güvenlik için client secret'ı maskeleyelim
    const safeSettings = {
      ...updatedSettings,
      spotifyClientSecret: updatedSettings.spotifyClientSecret ? '***masked***' : undefined
    };
    
    res.json({
      success: true,
      settings: safeSettings,
      message: 'Ayarlar başarıyla güncellendi'
    });
    
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Ayarlar güncellenirken hata oluştu' });
  }
});

// Spotify bağlantısını test et
router.post('/test-spotify', async (req, res) => {
  try {
    const { spotifyClientId, spotifyClientSecret } = req.body;
    
    if (!spotifyClientId || !spotifyClientSecret) {
      return res.json({
        success: false,
        message: 'Client ID ve Client Secret gerekli'
      });
    }
    
    // Python service'te test yap
    const response = await axios.post('http://localhost:8000/test-spotify-config', {
      client_id: spotifyClientId,
      client_secret: spotifyClientSecret
    }, { timeout: 10000 });
    
    // Python service'ten dönen sonucu direkt frontend'e ilet
    if (response.data.success) {
      res.json({
        success: true,
        message: 'Spotify bağlantısı başarılı'
      });
    } else {
      res.json({
        success: false,
        message: response.data.error || 'Spotify bağlantısı başarısız'
      });
    }
    
  } catch (error: any) {
    console.error('Spotify test error:', error);
    
    // Network/timeout hatası
    if (error.code === 'ECONNREFUSED') {
      return res.json({
        success: false,
        message: 'Python service\'e bağlanılamıyor. Servisin çalıştığından emin olun.'
      });
    }
    
    if (error.code === 'ETIMEDOUT') {
      return res.json({
        success: false,
        message: 'Bağlantı zaman aşımına uğradı. İnternet bağlantınızı kontrol edin.'
      });
    }
    
    // Python service'ten dönen hata
    if (error.response?.data) {
      return res.json({
        success: false,
        message: error.response.data.error || 'Spotify bağlantısı başarısız'
      });
    }
    
    res.json({ 
      success: false,
      message: 'Spotify bağlantısı test edilemedi'
    });
  }
});

export default router;
