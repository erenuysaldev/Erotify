import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs-extra';
import musicRoutes from './routes/music';
import playlistRoutes from './routes/playlist';
import settingsRoutes from './routes/settings';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false, // CSP'yi devre dışı bırak - ses dosyaları için
}));

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Range'],
  exposedHeaders: ['Content-Range', 'Content-Length', 'Accept-Ranges']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik dosya servisi
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Gerekli klasörleri oluştur
const ensureDirectories = async () => {
  const dirs = [
    path.join(__dirname, '../../uploads'),
    path.join(__dirname, '../../data')
  ];
  
  for (const dir of dirs) {
    await fs.ensureDir(dir);
  }
  
  // Varsayılan data dosyalarını oluştur
  const dataFiles = [
    { file: 'songs.json', defaultData: [] },
    { file: 'playlists.json', defaultData: [] }
  ];
  
  for (const { file, defaultData } of dataFiles) {
    const filePath = path.join(__dirname, '../../data', file);
    if (!(await fs.pathExists(filePath))) {
      await fs.writeJson(filePath, defaultData, { spaces: 2 });
    }
  }
};

// Routes
app.use('/api/music', musicRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

const startServer = async () => {
  try {
    await ensureDirectories();
    
    app.listen(PORT, () => {
      console.log(`🎵 Erotify Server running on http://localhost:${PORT}`);
      console.log(`📁 Uploads directory: ${path.join(__dirname, '../../uploads')}`);
      console.log(`💾 Data directory: ${path.join(__dirname, '../../data')}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
