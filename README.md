# 🎵 Erotify - Open Source Music Player

[🇹🇷 Türkçe](#türkçe) | [🇺🇸 English](#english)

---

## English

**Erotify** is a self-hosted, open-source music player application inspired by Spotify's interface. Built with modern web technologies, it allows you to manage your personal music collection, create playlists, and enjoy your favorite songs with a beautiful, responsive interface.

### ✨ Features

- 🎵 **Local Music Storage**: Upload and manage your own music collection
- 🎼 **Music Download**: Download music from Spotify and YouTube using SpotDL integration
- 📱 **Modern Interface**: Responsive design built with React + TypeScript
- 🎨 **Spotify-like UI**: Familiar and user-friendly interface
- 📂 **Playlist Management**: Create and organize your custom playlists
- ❤️ **Favorites System**: Mark songs as favorites for quick access
- 🔊 **Advanced Audio Controls**: Volume, shuffle, repeat modes
- 📤 **Easy Upload**: Drag & drop file upload with metadata extraction
- 🔍 **Music Search**: Search Spotify database for new music
- 🎯 **Metadata Support**: Automatic song information recognition
- 🌐 **Multi-language**: Support for Turkish, English, and Chinese
- ⚙️ **Settings Management**: Configure Spotify API credentials
- 🔓 **No Account Required**: No user registration or login needed
- 🌐 **Self-Hosted**: Run on your own server, no database required

### 🛠️ Technology Stack

#### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful and consistent icons
- **Axios** - HTTP client for API requests
- **React Context** - State management for audio player and language

#### Backend
- **Node.js** - JavaScript runtime environment
- **Express** - Minimal and flexible web application framework
- **TypeScript** - Type safety for backend code
- **Multer** - Middleware for handling file uploads
- **music-metadata** - Library for extracting audio metadata
- **fs-extra** - Enhanced file system utilities

#### Download Service
- **Python 3.9+** - Backend language for download service
- **FastAPI** - Modern, fast web framework for building APIs
- **SpotDL** - Download songs from Spotify and YouTube
- **Spotify Web API** - Access to Spotify's music catalog
- **yt-dlp** - Enhanced YouTube downloader

#### Storage
- **JSON Files** - Simple local data storage
- **File System** - Direct music file storage
- **No Database Required** - Simplified deployment and maintenance

### 🚀 Installation

#### Prerequisites
- Node.js 18+
- npm or yarn
- Python 3.9+ (for download service)
- pip (Python package manager)

#### 1. Clone the Repository
```bash
git clone https://github.com/erenuysaldev/erotify.git
cd erotify
```

#### 2. Install Dependencies
```bash
# Install all dependencies at once
npm run install:all

# Or manually
npm install
cd server && npm install
cd ../client && npm install
```

#### 3. Setup Download Service (Optional)

For downloading music from Spotify and YouTube:

```bash
# Install Python dependencies
cd python-service
pip install -r requirements.txt

# Setup Spotify API credentials (optional but recommended)
# Get Client ID and Secret from https://developer.spotify.com/dashboard


#### 4. Start the Application

##### Development Mode
```bash
# Start all services (requires 3 terminals)

# Terminal 1: Node.js backend
cd server
npm run dev

# Terminal 2: Python download service
cd python-service
python main.py

# Terminal 3: React frontend
cd client
npm start
```

##### Production Mode
```bash
# Build the application
npm run build

# Start in production mode
npm start
```

#### 5. Access the Application
- Main app: `http://localhost:3000`
- Download service API: `http://localhost:8000` (optional)
- Node.js API: `http://localhost:3001/api`

### 📁 Project Structure

```
erotify/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Layout/     # App layout components
│   │   │   ├── Music/      # Music-related components
│   │   │   ├── Player/     # Audio player components
│   │   │   └── Settings/   # Settings components
│   │   ├── context/        # React context providers
│   │   ├── i18n/          # Internationalization files
│   │   ├── services/       # API service functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # Express route handlers
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── index.ts        # Main server file
│   └── package.json
├── python-service/         # Download service (Python + FastAPI)
│   ├── main.py            # FastAPI application
│   └── requirements.txt   # Python dependencies
├── upload/                 # Uploaded music files storage
├── data/                   # JSON data files
│   ├── songs.json          # Song metadata
│   ├── playlists.json      # Playlist data
│   └── settings.json       # Application settings
└── package.json           # Root package.json with scripts
```

### 🎯 Usage Guide

#### Uploading Music
1. Click on "Upload File" in the left sidebar
2. Drag and drop music files or click "Browse"
3. Supported formats: MP3, WAV, OGG, FLAC, M4A, AAC
4. Files are automatically processed and added to your library

#### Downloading Music
1. Click on "Download Music" in the left sidebar
2. **URL Download**: Paste Spotify or YouTube URLs
3. **Search Download**: Search for songs by name
4. Monitor download progress in real-time
5. Downloaded songs are automatically added to your library

**Supported Links:**
- Spotify tracks: `https://open.spotify.com/track/...`
- Spotify albums: `https://open.spotify.com/album/...`
- Spotify playlists: `https://open.spotify.com/playlist/...`
- YouTube videos: `https://youtube.com/watch?v=...`

#### Playing Music
1. View your songs in "Your Library"
2. Click on any song to start playing
3. Use the bottom player controls
4. Enable shuffle and repeat modes as needed

#### Managing Playlists
1. Go to "Create Playlist" section
2. Click "New Playlist" button
3. Add songs using the "..." menu next to each song
4. Organize your music collection efficiently

#### Favorites System
1. Click the heart icon next to any song to add to favorites
2. Access your favorite songs from the "Liked Songs" section
3. Favorites are saved locally and persist between sessions

### ⚙️ Configuration

#### Settings Panel
- **Language Selection**: Switch between Turkish, English, and Chinese
- **Spotify Integration**: Configure your Spotify API credentials
- **Connection Testing**: Test your Spotify API setup




### 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📝 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

### 🐛 Bug Reports

If you encounter any bugs or have feature requests, please use GitHub Issues.

### 📞 Support

- GitHub Issues: [Report Issues](https://github.com/erenuysaldev/erotify/issues)
- Documentation: [Wiki](https://github.com/erenuysaldev/erotify/wiki)

---

## Türkçe

**Erotify**, Spotify arayüzünden ilham alan, kendi sunucunuzda barındırabileceğiniz açık kaynak bir müzik çalar uygulamasıdır. Modern web teknolojileri ile geliştirilmiş olup, kişisel müzik koleksiyonunuzu yönetmenize, çalma listeleri oluşturmanıza ve güzel, duyarlı bir arayüzle favori şarkılarınızı dinlemenize olanak tanır.

### ✨ Özellikler

- 🎵 **Yerel Müzik Depolama**: Kendi müzik koleksiyonunuzu yükleyin ve yönetin
- 🎼 **Müzik İndirme**: SpotDL entegrasyonu ile Spotify ve YouTube'dan müzik indirme
- 📱 **Modern Arayüz**: React + TypeScript ile geliştirilmiş duyarlı tasarım
- 🎨 **Spotify Benzeri Arayüz**: Tanıdık ve kullanıcı dostu arayüz
- 📂 **Çalma Listesi Yönetimi**: Özel çalma listelerinizi oluşturun ve düzenleyin
- ❤️ **Favoriler Sistemi**: Şarkıları favorilere ekleyerek hızlı erişim
- 🔊 **Gelişmiş Ses Kontrolleri**: Ses seviyesi, karıştırma, tekrar modları
- 📤 **Kolay Yükleme**: Metadata çıkarma ile sürükle-bırak dosya yükleme
- 🔍 **Müzik Arama**: Yeni müzikler için Spotify veritabanında arama
- 🎯 **Metadata Desteği**: Otomatik şarkı bilgisi tanıma
- 🌐 **Çok Dilli**: Türkçe, İngilizce ve Çince desteği
- ⚙️ **Ayar Yönetimi**: Spotify API kimlik bilgilerini yapılandırma
- 🔓 **Hesap Gerektirmez**: Kullanıcı kaydı veya girişi gerekmez
- 🌐 **Kendi Sunucunuzda**: Kendi sunucunuzda çalıştırın, veritabanı gerekmez

### �️ Teknoloji Yığını

#### Ön Yüz (Frontend)
- **React 18** - Modern kullanıcı arayüzü çerçevesi
- **TypeScript** - Tip güvenliği ve gelişmiş geliştirme deneyimi
- **Tailwind CSS** - Yardımcı program öncelikli CSS çerçevesi
- **Lucide React** - Güzel ve tutarlı simgeler
- **Axios** - API istekleri için HTTP istemcisi
- **React Context** - Ses çalar ve dil için durum yönetimi

#### Arka Yüz (Backend)
- **Node.js** - JavaScript çalışma zamanı ortamı
- **Express** - Minimal ve esnek web uygulama çerçevesi
- **TypeScript** - Arka yüz kodu için tip güvenliği
- **Multer** - Dosya yüklemelerini işleyen ara yazılım
- **music-metadata** - Ses metadata'sını çıkaran kütüphane
- **fs-extra** - Gelişmiş dosya sistemi yardımcı programları

#### İndirme Servisi
- **Python 3.9+** - İndirme servisi için arka yüz dili
- **FastAPI** - API oluşturmak için modern, hızlı web çerçevesi
- **SpotDL** - Spotify ve YouTube'dan şarkı indirme
- **Spotify Web API** - Spotify'ın müzik kataloğuna erişim
- **yt-dlp** - Gelişmiş YouTube indirici

#### Depolama
- **JSON Dosyaları** - Basit yerel veri depolaması
- **Dosya Sistemi** - Doğrudan müzik dosyası depolaması
- **Veritabanı Gerektirmez** - Basitleştirilmiş dağıtım ve bakım

### � Kurulum

#### Gereksinimler
- Node.js 18+
- npm veya yarn
- Python 3.9+ (indirme servisi için)
- pip (Python paket yöneticisi)

#### 1. Depoyu Klonlayın
```bash
git clone https://github.com/erenuysaldev/erotify.git
cd erotify
```

#### 2. Bağımlılıkları Kurun
```bash
# Tüm bağımlılıkları tek seferde kurun
npm run install:all

# Veya manuel olarak
npm install
cd server && npm install
cd ../client && npm install
```

#### 3. İndirme Servisini Kurun (İsteğe Bağlı)

Spotify ve YouTube'dan müzik indirmek için:

```bash
# Python bağımlılıklarını kurun
cd python-service
pip install -r requirements.txt

# Spotify API kimlik bilgilerini ayarlayın (isteğe bağlı ama önerilen)
# https://developer.spotify.com/dashboard adresinden Client ID ve Secret alın



#### 4. Uygulamayı Başlatın

##### Geliştirme Modu
```bash
# Tüm servisleri başlatın (3 terminal gerekir)

# Terminal 1: Node.js arka yüz
cd server
npm run dev

# Terminal 2: Python indirme servisi
cd python-service
python main.py

# Terminal 3: React ön yüz
cd client
npm start
```

##### Üretim Modu
```bash
# Uygulamayı derleyin
npm run build

# Üretim modunda başlatın
npm start
```

#### 5. Uygulamaya Erişin
- Ana uygulama: `http://localhost:3000`
- İndirme servisi API: `http://localhost:8000` (isteğe bağlı)
- Node.js API: `http://localhost:3001/api`

### 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 🙏 Acknowledgments

This project uses the following open source libraries and tools:

- **[SpotDL](https://github.com/spotDL/spotify-downloader)** - The amazing Python library that enables Spotify and YouTube music downloading functionality
- **[React](https://reactjs.org/)** - The web framework that powers our frontend
- **[Node.js](https://nodejs.org/)** - JavaScript runtime for our backend
- **[Tailwind CSS](https://tailwindcss.com/)** - For beautiful and responsive styling
- **[Lucide React](https://lucide.dev/)** - For clean and consistent icons
- **[FastAPI](https://fastapi.tiangolo.com/)** - Python web framework for our download service
- **[Spotify Web API](https://developer.spotify.com/documentation/web-api/)** - For accessing Spotify's music catalog

Special thanks to the [SpotDL](https://github.com/spotDL/spotify-downloader) team for creating such a powerful tool that makes music downloading possible in Erotify.

### 📞 Support

- GitHub Issues: [Report Issues](https://github.com/erenuysaldev/erotify/issues)
- Documentation: [Wiki](https://github.com/erenuysaldev/erotify/wiki)

---

**Enjoy listening to music with Erotify! 🎵**
