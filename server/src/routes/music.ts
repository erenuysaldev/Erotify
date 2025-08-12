import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as mm from 'music-metadata';
import fs from 'fs-extra';
import { Song } from '../types';
import { DataManager } from '../utils/dataManager';

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../../uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Kabul edilen ses formatları
    const allowedTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/flac',
      'audio/m4a',
      'audio/aac'
    ];
    
    if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(mp3|wav|ogg|flac|m4a|aac)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Sadece ses dosyaları yüklenebilir!'));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Tüm şarkıları getir
router.get('/', async (req, res) => {
  try {
    const songs = await DataManager.getSongs();
    res.json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ error: 'Şarkılar getirilemedi' });
  }
});

// Şarkı yükle
router.post('/upload', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Ses dosyası bulunamadı' });
    }

    const filePath = req.file.path;
    
    // Ses dosyasının metadata'sını oku
    let metadata;
    try {
      metadata = await mm.parseFile(filePath);
    } catch (error) {
      console.error('Metadata parse error:', error);
      // Metadata okunamazsa varsayılan değerler kullan
      metadata = {
        format: { duration: 0, bitrate: 0, sampleRate: 0 },
        common: {
          title: path.parse(req.file.originalname).name,
          artist: 'Bilinmeyen Sanatçı',
          album: 'Bilinmeyen Albüm'
        }
      };
    }

    const song: Song = {
      id: uuidv4(),
      title: metadata.common.title || path.parse(req.file.originalname).name,
      artist: metadata.common.artist || 'Bilinmeyen Sanatçı',
      album: metadata.common.album || undefined,
      duration: metadata.format.duration || 0,
      filename: req.file.filename,
      filePath,
      uploadedAt: new Date().toISOString(),
      size: req.file.size,
      format: path.extname(req.file.originalname).toLowerCase(),
      bitrate: metadata.format.bitrate,
      sampleRate: metadata.format.sampleRate,
      genre: metadata.common.genre?.[0],
      year: metadata.common.year
    };

    await DataManager.addSong(song);

    res.json({
      success: true,
      song
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Hata durumunda dosyayı sil
    if (req.file) {
      try {
        await fs.remove(req.file.path);
      } catch (deleteError) {
        console.error('Error deleting file after upload failure:', deleteError);
      }
    }
    
    res.status(500).json({ 
      error: 'Dosya yüklenirken hata oluştu',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

// Şarkı sil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await DataManager.deleteSong(id);
    
    if (success) {
      res.json({ message: 'Şarkı başarıyla silindi' });
    } else {
      res.status(404).json({ error: 'Şarkı bulunamadı' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Şarkı silinirken hata oluştu' });
  }
});

// Şarkı stream et
router.get('/stream/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const songs = await DataManager.getSongs();
    const song = songs.find(s => s.id === id);
    
    if (!song) {
      return res.status(404).json({ error: 'Şarkı bulunamadı' });
    }

    const filePath = song.filePath;
    
    if (!(await fs.pathExists(filePath))) {
      return res.status(404).json({ error: 'Dosya bulunamadı' });
    }

    const stat = await fs.stat(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    // CORS headers for audio
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Range',
      'Accept-Ranges': 'bytes',
      'Content-Type': 'audio/mpeg',
    });

    if (range) {
      // Range request için partial content
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      
      const stream = fs.createReadStream(filePath, { start, end });
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Content-Length': chunksize,
      });
      
      stream.pipe(res);
    } else {
      // Normal request
      res.writeHead(200, {
        'Content-Length': fileSize,
      });
      
      fs.createReadStream(filePath).pipe(res);
    }

  } catch (error) {
    console.error('Stream error:', error);
    res.status(500).json({ error: 'Şarkı stream edilemedi' });
  }
});

// İndirilen şarkıyı veritabanına ekle (Python service'den gelecek)
router.post('/add-downloaded', async (req, res) => {
  try {
    const { title, artist, album, duration, filename, source } = req.body;
    
    if (!title || !artist || !filename) {
      return res.status(400).json({ error: 'Gerekli alanlar eksik' });
    }

    const filePath = path.join(__dirname, '../../../uploads', filename);
    const altPath = path.join(process.cwd(), 'uploads', filename);
    
    console.log('Looking for file at:', filePath);
    console.log('__dirname:', __dirname);
    console.log('process.cwd():', process.cwd());
    console.log('Filename:', filename);
    console.log('Alternative path:', altPath);
    
    // Dosyanın var olduğunu kontrol et
    if (await fs.pathExists(filePath)) {
      console.log('Found file at primary path');
      const stat = await fs.stat(filePath);

      const song: Song = {
        id: uuidv4(),
        title,
        artist,
        album,
        duration: duration || 0,
        filename,
        filePath,
        uploadedAt: new Date().toISOString(),
        size: stat.size,
        format: path.extname(filename).toLowerCase(),
        source: source || 'download'
      };

      await DataManager.addSong(song);

      return res.json({
        success: true,
        song
      });
    } else if (await fs.pathExists(altPath)) {
      console.log('Found file at alternative path');
      const stat = await fs.stat(altPath);

      const song: Song = {
        id: uuidv4(),
        title,
        artist,
        album,
        duration: duration || 0,
        filename,
        filePath: altPath,
        uploadedAt: new Date().toISOString(),
        size: stat.size,
        format: path.extname(filename).toLowerCase(),
        source: source || 'download'
      };

      await DataManager.addSong(song);

      return res.json({
        success: true,
        song
      });
    } else {
      // List all files in uploads to debug
      const uploadsDir = path.join(process.cwd(), 'uploads');
      try {
        const files = await fs.readdir(uploadsDir);
        console.log('Files in uploads directory:', files);
      } catch (err) {
        console.log('Error reading uploads directory:', err);
      }
      
      return res.status(404).json({ 
        error: 'İndirilen dosya bulunamadı',
        searched: [filePath, altPath],
        filename: filename
      });
    }

  } catch (error) {
    console.error('Add downloaded song error:', error);
    res.status(500).json({ 
      error: 'İndirilen şarkı eklenirken hata oluştu',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

// Şarkıyı favorilere ekle/çıkar
router.post('/favorite/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const songs = await DataManager.getSongs();
    const songIndex = songs.findIndex(s => s.id === id);
    
    if (songIndex === -1) {
      return res.status(404).json({ error: 'Şarkı bulunamadı' });
    }

    // Favorilere ekle/çıkar
    songs[songIndex].isFavorite = !songs[songIndex].isFavorite;
    
    await DataManager.saveSongs(songs);

    res.json({
      success: true,
      song: songs[songIndex],
      message: songs[songIndex].isFavorite ? 'Favorilere eklendi' : 'Favorilerden çıkarıldı'
    });

  } catch (error) {
    console.error('Favorite toggle error:', error);
    res.status(500).json({ error: 'Favori durumu değiştirilemedi' });
  }
});

// Favori şarkıları getir
router.get('/favorites', async (req, res) => {
  try {
    const songs = await DataManager.getSongs();
    const favorites = songs.filter(song => song.isFavorite === true);
    res.json(favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Favori şarkılar getirilemedi' });
  }
});

export default router;
