# Erotify - Müzik İndirme Servisi

## Özellikler

✅ **Spotify Entegrasyonu**: Spotify şarkıları, albümleri ve çalma listelerini indirin
✅ **YouTube Desteği**: YouTube videolarını MP3 olarak indirin  
✅ **Arama Fonksiyonu**: Şarkı adı ile arama yapın
✅ **İndirme Takibi**: Gerçek zamanlı indirme durumu
✅ **Otomatik Ekleme**: İndirilen şarkılar Erotify kütüphanesine otomatik eklenir

## Kurulum

### 1. Python Servisini Kurma

```bash
# Python service dizinine gidin
cd python-service

# Paketleri kurun
pip install -r requirements.txt
```

### 2. Spotify API Ayarları (Opsiyonel ama Önerilen)

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) adresine gidin
2. "Create App" ile yeni uygulama oluşturun
3. Client ID ve Client Secret değerlerini alın
4. Çevresel değişkenleri ayarlayın:

**Windows (PowerShell):**
```powershell
$env:SPOTIFY_CLIENT_ID="your_client_id_here"
$env:SPOTIFY_CLIENT_SECRET="your_client_secret_here"
```

**Linux/Mac:**
```bash
export SPOTIFY_CLIENT_ID="your_client_id_here"
export SPOTIFY_CLIENT_SECRET="your_client_secret_here"
```

### 3. Servisleri Başlatma

**Terminal 1 - Node.js Server:**
```bash
npm run dev
```

**Terminal 2 - Python Download Service:**
```bash
cd python-service
python main.py
```

**Terminal 3 - React Client:**
```bash
cd client
npm start
```

## Kullanım

### URL'den İndirme

1. Erotify uygulamasında "Müzik İndir" sekmesine gidin
2. Spotify veya YouTube URL'sini yapıştırın
3. "İndir" butonuna tıklayın
4. İndirme durumunu takip edin

**Desteklenen URL Formatları:**
- `https://open.spotify.com/track/...`
- `https://open.spotify.com/album/...`
- `https://open.spotify.com/playlist/...`
- `https://www.youtube.com/watch?v=...`
- `https://youtu.be/...`

### Arama ile İndirme

1. "Müzik Ara" bölümünde şarkı adı yazın
2. Arama sonuçlarından istediğinizi seçin
3. "İndir" butonuna tıklayın

## Teknik Detaylar

### Servis Mimarisi

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Client  │    │   Node.js Server │    │ Python Service  │
│   (Port 3000)   │◄──►│   (Port 3001)    │◄──►│   (Port 8000)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Interface│    │   File Storage   │    │   SpotDL Core   │
│   - Search UI   │    │   - Songs.json   │    │   - YouTube-DL  │
│   - Download UI │    │   - Uploads/     │    │   - Spotify API │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### API Endpoints

**Python Service (Port 8000):**
- `POST /search` - Müzik arama
- `POST /download` - İndirme başlatma
- `GET /download/{id}/status` - İndirme durumu
- `GET /downloads` - Tüm indirmeler
- `DELETE /download/{id}` - İndirme iptali
- `GET /health` - Servis durumu

**Node.js Server (Port 3001):**
- `POST /api/music/add-downloaded` - İndirilen şarkıyı ekle

### Dosya Formatları

- **İndirme Formatı**: MP3 (320kbps)
- **Metadata**: Otomatik etiketleme (başlık, sanatçı, albüm)
- **Depolama**: `/uploads` dizini

## Sorun Giderme

### Python Service Bağlantı Hatası

```
❌ İndirme servisi çevrimdışı
```

**Çözüm:**
1. Python service'in çalıştığını kontrol edin: `http://127.0.0.1:8000/health`
2. Port 8000'in kullanımda olmadığını kontrol edin
3. Python bağımlılıklarını tekrar kurun: `pip install -r requirements.txt`

### Spotify API Hatası

```
⚠️ Spotify API ayarlanmamış
```

**Çözüm:**
1. Spotify Developer hesabı oluşturun
2. Client ID ve Secret'ı çevresel değişkenlere ekleyin
3. Python service'i yeniden başlatın

### İndirme Başarısız

```
❌ Download failed
```

**Muhtemel Nedenler:**
- Geçersiz URL
- Çok uzun video (>10 dakika)
- Bölgesel kısıtlamalar
- Ağ bağlantısı sorunları

## Geliştirme

### Yeni Özellik Ekleme

1. Python service'e yeni endpoint ekleyin
2. Frontend'de ilgili UI componentini oluşturun
3. DownloadService'i güncelleyin

### Desteklenen Platformları Genişletme

SpotDL aşağıdaki platformları destekler:
- Spotify
- YouTube
- YouTube Music
- SoundCloud
- Bandcamp

Yeni platform desteği için `python-service/main.py` dosyasını güncelleyin.

## Lisans

Bu proje MIT lisansı altında açık kaynak yazılımdır.
