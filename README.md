# 🎵 Erotify - Open Source Music Player

Erotify, herkes tarafından kendi sunucusunda barındırılabilen, açık kaynak bir müzik çalıcı uygulamasıdır. Spotify benzeri arayüzü ile kendi müzik koleksiyonunuzu yönetebilir, playlist oluşturabilir ve sevdiğiniz şarkıları dinleyebilirsiniz.

## ✨ Özellikler

- 🎵 **Yerel Müzik Depolama**: Kendi müziklerinizi yükleyin ve yönetin
- 🎼 **Müzik İndirme**: Spotify ve YouTube'dan müzik indirme (SpotDL entegrasyonu)
- 📱 **Modern Arayüz**: React + TypeScript ile geliştirilmiş responsive tasarım
- 🎨 **Spotify Benzeri UI**: Tanıdık ve kullanıcı dostu arayüz
- 📂 **Playlist Yönetimi**: Kendi playlistlerinizi oluşturun ve düzenleyin
- 🔊 **Gelişmiş Ses Kontrolü**: Volume, shuffle, repeat modları
- 📤 **Kolay Yükleme**: Drag & drop ile müzik yükleme
- 🔍 **Müzik Arama**: Spotify veritabanında şarkı arama
- 🎯 **Metadata Desteği**: Otomatik şarkı bilgisi tanıma
- 🔍 **Arama ve Filtreleme**: Müzik kütüphanenizde kolayca arama yapın
- 🌐 **Self-Hosted**: Kendi sunucunuzda barındırın, veritabanı gerekmez
- 🔓 **Hesap Gerektirmez**: Kullanıcı kaydı veya giriş gerekmez

## 🛠️ Teknoloji Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Multer** - File upload handling
- **music-metadata** - Audio metadata extraction
- **fs-extra** - Enhanced file system utilities

### Download Service
- **Python** - Backend language for download service
- **FastAPI** - Modern Python web framework
- **SpotDL** - Spotify/YouTube downloader
- **Spotify API** - Music metadata and search
- **YouTube-DL** - Video/audio extraction

### Storage
- **JSON Files** - Simple local data storage
- **Local File System** - Music file storage
- No database required!

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn
- Python 3.9+ (müzik indirme servisi için)
- pip (Python package manager)

### 1. Projeyi İndirin
```bash
git clone https://github.com/yourusername/erotify.git
cd erotify
```

### 2. Bağımlılıkları Kurun
```bash
# Tüm bağımlılıkları tek seferde kurmak için
npm run install:all

# Veya manuel olarak
npm install
cd server && npm install
cd ../client && npm install
```

### 3. Müzik İndirme Servisini Kurma (Opsiyonel)

Spotify ve YouTube'dan müzik indirmek için:

```bash
# Python bağımlılıklarını kurun
cd python-service
pip install -r requirements.txt

# Spotify API ayarları (opsiyonel ama önerilen)
# https://developer.spotify.com/dashboard adresinden Client ID ve Secret alın

# Windows:
$env:SPOTIFY_CLIENT_ID="your_client_id"
$env:SPOTIFY_CLIENT_SECRET="your_client_secret"

# Linux/Mac:
export SPOTIFY_CLIENT_ID="your_client_id"  
export SPOTIFY_CLIENT_SECRET="your_client_secret"
```

Detaylı kurulum için: [DOWNLOAD_SERVICE.md](DOWNLOAD_SERVICE.md)

### 4. Uygulamayı Başlatın

#### Development Mode (Geliştirme)
```bash
# Sadece web uygulaması
npm run dev

# Müzik indirme servisi ile birlikte (3 terminal)
# Terminal 1: Node.js server
npm run dev

# Terminal 2: Python download service
cd python-service
python main.py

# Terminal 3: React client  
cd client
npm start
```

#### Production Mode (Üretim)
```bash
# Build
npm run build

# Start
npm start
```

### 5. Uygulamayı Açın
- Ana uygulama: `http://localhost:3000`
- İndirme servisi API: `http://localhost:8000` (opsiyonel)
- Node.js API: `http://localhost:3001/api`

## 📁 Proje Yapısı

```
erotify/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context (state management)
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript type definitions
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # Express routes
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── index.ts        # Main server file
│   └── package.json
├── python-service/         # Download service (Python + FastAPI)
│   ├── main.py            # FastAPI download service
│   └── requirements.txt   # Python dependencies
├── uploads/                # Uploaded music files
├── data/                   # JSON data files
│   ├── songs.json          # Song metadata
│   └── playlists.json      # Playlist data
├── DOWNLOAD_SERVICE.md     # Download service documentation
└── package.json           # Root package.json
```

## 🎯 Kullanım

### Müzik Yükleme
1. Sol menüden "Dosya Yükle" sekmesine tıklayın
2. Dosyaları sürükleyip bırakın veya "Gözat" butonuna tıklayın
3. Desteklenen formatlar: MP3, WAV, OGG, FLAC, M4A, AAC
4. Dosyalar otomatik olarak işlenir ve kütüphaneye eklenir

### Müzik İndirme (Yeni!)
1. Sol menüden "Müzik İndir" sekmesine tıklayın
2. **URL'den İndirme**: Spotify veya YouTube URL'si yapıştırın
3. **Arama ile İndirme**: Şarkı adı yazarak arama yapın  
4. İndirme durumunu gerçek zamanlı takip edin
5. İndirilen şarkılar otomatik olarak kütüphaneye eklenir

**Desteklenen Linkler:**
- Spotify şarkıları: `https://open.spotify.com/track/...`
- Spotify albümleri: `https://open.spotify.com/album/...`
- Spotify playlistleri: `https://open.spotify.com/playlist/...`
- YouTube videoları: `https://youtube.com/watch?v=...`

### Müzik Dinleme
1. "Müzik Kütüphanem" sekmesinde şarkılarınızı görün
2. Bir şarkıya tıklayarak çalmaya başlayın
3. Alt kısımdaki player ile kontrolü sağlayın
4. Shuffle, repeat modlarını kullanabilirsiniz

### Playlist Oluşturma
1. "Playlistler" sekmesine gidin
2. "Yeni Playlist" butonuna tıklayın
3. Playlist'e şarkı eklemek için şarkının yanındaki "..." menüsünü kullanın

## 🌐 Digital Ocean Deployment

### Droplet Oluşturma
1. Digital Ocean'da yeni bir droplet oluşturun (Ubuntu 22.04 önerili)
2. En az 1GB RAM, 25GB disk alanı seçin
3. SSH key'inizi ekleyin

### Sunucuya Kurulum
```bash
# Sunucuya bağlanın
ssh root@your-droplet-ip

# Node.js kurun
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 kurun (process manager)
sudo npm install -g pm2

# Projeyi klonlayın
git clone https://github.com/yourusername/erotify.git
cd erotify

# Bağımlılıkları kurun
npm run install:all

# Build edin
npm run build

# PM2 ile başlatın
pm2 start server/dist/index.js --name "erotify"
pm2 startup
pm2 save
```

### Nginx Kurulumu (Opsiyonel)
```bash
# Nginx kurun
sudo apt install nginx

# Nginx konfigürasyonu
sudo nano /etc/nginx/sites-available/erotify

# İçerik:
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Aktifleştir
sudo ln -s /etc/nginx/sites-available/erotify /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔧 Konfigürasyon

### Environment Variables
Server tarafında `.env` dosyası oluşturabilirsiniz:

```env
PORT=3001
NODE_ENV=production
MAX_FILE_SIZE=52428800  # 50MB
UPLOAD_DIR=./uploads
DATA_DIR=./data
```

### Dosya Boyutu Limiti
`server/src/routes/music.ts` dosyasında `limits.fileSize` değerini değiştirebilirsiniz.

## 🤝 Katkıda Bulunma

1. Bu repo'yu fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 🐛 Sorun Bildirimi

Bir hata bulursanız veya özellik isteğiniz varsa, GitHub Issues kullanın.

## 📞 Destek

- GitHub Issues: [Issues](https://github.com/yourusername/erotify/issues)
- Documentation: [Wiki](https://github.com/yourusername/erotify/wiki)

## 🙏 Teşekkürler

Bu proje açık kaynak topluluk katkıları ile geliştirilmiştir. Katkıda bulunan herkese teşekkürler!

---

**Erotify ile müzik dinlemenin keyfini çıkarın! 🎵**
