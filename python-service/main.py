import os
import json
import asyncio
import aiofiles
import time
import uuid
import requests
from datetime import datetime
from typing import List, Optional, Dict, Any
from pathlib import Path
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import uvicorn
from spotdl import Spotdl
from spotdl.types.song import Song
import logging
import threading
from concurrent.futures import ThreadPoolExecutor

# Logging ayarları
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Erotify Download Service", version="1.0.0")

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic modeller
class DownloadRequest(BaseModel):
    url: str
    output_path: Optional[str] = None

class DownloadStatus(BaseModel):
    id: str
    status: str  # "pending", "downloading", "completed", "failed"
    progress: float = 0.0
    message: str = ""
    song_info: Optional[Dict[str, Any]] = None
    file_path: Optional[str] = None

class SearchRequest(BaseModel):
    query: str

class SearchResult(BaseModel):
    title: str
    artist: str
    album: str
    duration: int
    url: str
    cover_url: Optional[str] = None

# Global değişkenler
downloads: Dict[str, DownloadStatus] = {}
spotdl_client: Optional[Spotdl] = None
executor = ThreadPoolExecutor(max_workers=4)  # Thread pool for SpotDL operations

# Spotify Client ayarları - Bu değerleri environment variable'lardan al
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID", "")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET", "")

# Runtime'da güncellenebilir credential'lar
current_spotify_credentials = {
    "client_id": SPOTIFY_CLIENT_ID,
    "client_secret": SPOTIFY_CLIENT_SECRET
}

def init_spotdl():
    """SpotDL istemcisini başlat"""
    global spotdl_client
    try:
        if not current_spotify_credentials["client_id"] or not current_spotify_credentials["client_secret"]:
            logger.warning("Spotify credentials not found. Some features may not work.")
            # Spotify credentials olmadan da çalışabilir, sadece search fonksiyonu etkilenir
            return None
            
        spotdl_client = Spotdl(
            client_id=current_spotify_credentials["client_id"],
            client_secret=current_spotify_credentials["client_secret"],
            downloader_settings={
                "output": "../uploads",
                "format": "mp3",
                "bitrate": "320k",
                "threads": 1,  # Tek thread kullan
                "quiet": False,
            }
        )
        logger.info("SpotDL client initialized successfully")
        return spotdl_client
    except Exception as e:
        logger.error(f"Failed to initialize SpotDL: {e}")
        return None

@app.on_event("startup")
async def startup_event():
    """Uygulama başlangıcında çalışacak fonksiyon"""
    init_spotdl()
    
    # Downloads klasörünü oluştur
    os.makedirs("../uploads", exist_ok=True)
    logger.info("Download service started")

@app.get("/health")
async def health_check():
    """Sağlık kontrolü"""
    return {
        "status": "healthy",
        "spotdl_initialized": spotdl_client is not None,
        "spotify_configured": bool(current_spotify_credentials["client_id"] and current_spotify_credentials["client_secret"])
    }

@app.post("/search")
async def search_music(request: SearchRequest):
    """Müzik arama"""
    try:
        if not spotdl_client:
            return {
                "results": [],
                "message": "Spotify credentials not configured. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables."
            }
        
        # SpotDL arama işlemini thread pool'da çalıştır
        loop = asyncio.get_event_loop()
        songs = await loop.run_in_executor(executor, search_songs_sync, request.query)
        
        results = []
        for song in songs:
            results.append(SearchResult(
                title=song.name,
                artist=", ".join(song.artists),
                album=song.album_name,
                duration=song.duration,
                url=song.url,
                cover_url=song.cover_url
            ))
        
        return {"results": results}
    except Exception as e:
        logger.error(f"Search error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def search_songs_sync(query: str):
    """Şarkı arama (senkron wrapper)"""
    try:
        return spotdl_client.search([query])
    except Exception as e:
        logger.error(f"Search sync error: {e}")
        return []

@app.post("/download")
async def start_download(request: DownloadRequest, background_tasks: BackgroundTasks):
    """Müzik indirme işlemini başlat"""
    try:
        # Benzersiz bir ID oluştur
        import uuid
        download_id = str(uuid.uuid4())
        
        # İndirme durumunu kaydet
        downloads[download_id] = DownloadStatus(
            id=download_id,
            status="pending",
            message="Download queued"
        )
        
        # Arka planda indirme işlemini başlat (thread pool'da)
        background_tasks.add_task(run_download_in_thread, download_id, request.url, request.output_path)
        
        return {"download_id": download_id, "status": "started"}
    except Exception as e:
        logger.error(f"Download start error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
        
        return {"download_id": download_id, "status": "started"}
    except Exception as e:
        logger.error(f"Download start error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def run_download_in_thread(download_id: str, url: str, output_path: Optional[str] = None):
    """İndirme işlemini ayrı thread'de çalıştır"""
    try:
        download_song_subprocess(download_id, url, output_path)
    except Exception as e:
        logger.error(f"Thread download error for {download_id}: {e}")
        downloads[download_id].status = "failed"
        downloads[download_id].message = f"Thread error: {str(e)}"

def download_song_subprocess(download_id: str, url: str, output_path: Optional[str] = None):
    """SpotDL'i subprocess olarak çalıştır (event loop sorununu çözer)"""
    try:
        import subprocess
        import os
        import time
        
        # Durumu güncelle
        downloads[download_id].status = "downloading"
        downloads[download_id].message = "Starting download..."
        downloads[download_id].progress = 5.0
        
        # Output dizinini hazırla
        output_dir = "../uploads"
        os.makedirs(output_dir, exist_ok=True)
        
        # SpotDL komutunu hazırla
        cmd = [
            "spotdl",
            "download",
            url,
            "--output", output_dir,
            "--format", "mp3",
            "--bitrate", "320k",
            "--threads", "1"
        ]
        
        # Spotify credentials varsa ekle
        if current_spotify_credentials["client_id"] and current_spotify_credentials["client_secret"]:
            cmd.extend([
                "--client-id", current_spotify_credentials["client_id"],
                "--client-secret", current_spotify_credentials["client_secret"]
            ])
        
        downloads[download_id].message = "Downloading with SpotDL..."
        downloads[download_id].progress = 10.0
        
        # SpotDL'i çalıştır
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300  # 5 dakika timeout
        )
        
        if result.returncode == 0:
            downloads[download_id].progress = 80.0
            downloads[download_id].message = "Download completed, adding to library..."
            
            # İndirilen dosyayı bul ve veritabanına ekle
            time.sleep(2)  # Dosyanın tamamen yazılmasını bekle
            
            # İndirilen dosyaları bul ve ekle
            added_files = find_and_add_downloaded_files(download_id, output_dir)
            
            if added_files > 0:
                downloads[download_id].status = "completed"
                downloads[download_id].progress = 100.0
                downloads[download_id].message = f"Successfully downloaded and added {added_files} song(s) to library"
            else:
                downloads[download_id].status = "completed"
                downloads[download_id].progress = 100.0
                downloads[download_id].message = "Download completed (check uploads folder)"
            
        else:
            downloads[download_id].status = "failed"
            downloads[download_id].message = f"SpotDL error: {result.stderr}"
            logger.error(f"SpotDL failed: {result.stderr}")
            
    except subprocess.TimeoutExpired:
        downloads[download_id].status = "failed"
        downloads[download_id].message = "Download timeout (5 minutes)"
    except Exception as e:
        logger.error(f"Download error for {download_id}: {e}")
        downloads[download_id].status = "failed"
        downloads[download_id].message = f"Error: {str(e)}"

def get_song_info_from_spotify(track_id: str):
    """Spotify API'den şarkı bilgilerini al"""
    try:
        import requests
        
        if not current_spotify_credentials["client_id"] or not current_spotify_credentials["client_secret"]:
            return None
            
        # Spotify API token al
        auth_url = "https://accounts.spotify.com/api/token"
        auth_data = {
            "grant_type": "client_credentials",
            "client_id": current_spotify_credentials["client_id"],
            "client_secret": current_spotify_credentials["client_secret"]
        }
        
        auth_response = requests.post(auth_url, data=auth_data, timeout=10)
        if auth_response.status_code != 200:
            return None
            
        token = auth_response.json().get("access_token")
        
        # Track bilgilerini al
        track_url = f"https://api.spotify.com/v1/tracks/{track_id}"
        headers = {"Authorization": f"Bearer {token}"}
        
        track_response = requests.get(track_url, headers=headers, timeout=10)
        if track_response.status_code != 200:
            return None
            
        track_data = track_response.json()
        
        return {
            "title": track_data["name"],
            "artist": ", ".join([artist["name"] for artist in track_data["artists"]]),
            "album": track_data["album"]["name"],
            "duration": track_data["duration_ms"] // 1000
        }
        
    except Exception as e:
        logger.error(f"Spotify API error: {e}")
        return None

def find_and_add_downloaded_file(download_id: str, output_dir: str):
    """İndirilen dosyayı bul ve veritabanına ekle"""
    try:
        import os
        import time
        from pathlib import Path
        
        # Son eklenen dosyaları bul
        files = []
        for file in os.listdir(output_dir):
            if file.endswith(".mp3"):
                file_path = os.path.join(output_dir, file)
                files.append((file_path, os.path.getctime(file_path)))
        
        if not files:
            return
            
        # En son oluşturulan dosyayı al
        latest_file = max(files, key=lambda x: x[1])[0]
        filename = os.path.basename(latest_file)
        
        # Basit dosya adından bilgi çıkar
        name_parts = filename.replace(".mp3", "").split(" - ")
        if len(name_parts) >= 2:
            artist = name_parts[0]
            title = " - ".join(name_parts[1:])
        else:
            title = filename.replace(".mp3", "")
            artist = "Unknown Artist"
        
        song_info = {
            "title": title,
            "artist": artist,
            "album": "Downloaded",
            "duration": 0
        }
        
        downloads[download_id].song_info = song_info
        add_downloaded_file_to_database(download_id, output_dir, song_info, filename)
        
    except Exception as e:
        logger.error(f"Error finding downloaded file: {e}")

def add_downloaded_file_to_database(download_id: str, output_dir: str, song_info: dict, filename: str = None):
    """İndirilen dosyayı Erotify veritabanına ekle"""
    try:
        import requests
        import os
        
        if not filename:
            # Dosya adını song_info'dan oluştur
            safe_title = "".join(c for c in song_info["title"] if c.isalnum() or c in (' ', '-', '_')).strip()
            safe_artist = "".join(c for c in song_info["artist"] if c.isalnum() or c in (' ', '-', '_')).strip()
            filename = f"{safe_artist} - {safe_title}.mp3"
        
        # Erotify server'ına şarkı bilgilerini gönder
        song_data = {
            "title": song_info["title"],
            "artist": song_info["artist"],
            "album": song_info.get("album", "Downloaded"),
            "duration": song_info.get("duration", 0),
            "filename": filename,
            "source": "spotdl"
        }
        
        response = requests.post(
            "http://localhost:3001/api/music/add-downloaded",
            json=song_data,
            timeout=10
        )
        
        if response.status_code == 200:
            logger.info(f"Song added to Erotify database: {song_info['title']}")
        else:
            logger.warning(f"Failed to add song to Erotify database: {response.status_code}")
            
    except Exception as e:
        logger.error(f"Error adding song to Erotify database: {e}")

@app.get("/download/{download_id}/status")
async def get_download_status(download_id: str):
    """İndirme durumunu kontrol et"""
    if download_id not in downloads:
        raise HTTPException(status_code=404, detail="Download not found")
    
    return downloads[download_id]

@app.get("/downloads")
async def get_all_downloads():
    """Tüm indirme durumlarını getir"""
    return {"downloads": list(downloads.values())}

@app.delete("/download/{download_id}")
async def cancel_download(download_id: str):
    """İndirme işlemini iptal et"""
    if download_id not in downloads:
        raise HTTPException(status_code=404, detail="Download not found")
    
    download = downloads[download_id]
    if download.status in ["pending", "downloading"]:
        download.status = "cancelled"
        download.message = "Download cancelled by user"
    
    return {"message": "Download cancelled"}

def find_and_add_downloaded_files(download_id: str, output_dir: str) -> int:
    """İndirilen dosyaları bul ve veritabanına ekle"""
    added_count = 0
    
    try:
        if not os.path.exists(output_dir):
            logger.warning(f"Output directory does not exist: {output_dir}")
            return 0
            
        # Son 5 dakikada oluşturulan/değiştirilen dosyaları bul
        current_time = time.time()
        cutoff_time = current_time - 300  # 5 dakika
        
        for filename in os.listdir(output_dir):
            if filename.endswith('.mp3'):
                filepath = os.path.join(output_dir, filename)
                file_mtime = os.path.getmtime(filepath)
                
                if file_mtime > cutoff_time:
                    # Bu dosya yeni indirildi
                    success = add_single_file_to_database(filename, filepath)
                    if success:
                        added_count += 1
                        logger.info(f"Added {filename} to database")
                    else:
                        logger.warning(f"Failed to add {filename} to database")
                        
    except Exception as e:
        logger.error(f"Error finding downloaded files: {e}")
        return 0
        
    return added_count


def add_single_file_to_database(filename: str, filepath: str) -> bool:
    """Tek bir dosyayı veritabanına ekle"""
    try:
        # Dosya adından şarkı bilgilerini çıkar
        # Format genelde: "Artist - Song Title.mp3"
        base_name = os.path.splitext(filename)[0]
        
        if " - " in base_name:
            artist, title = base_name.split(" - ", 1)
            artist = artist.strip()
            title = title.strip()
        else:
            # Fallback
            artist = "Unknown Artist"
            title = base_name.strip()
        
        # Unique ID oluştur
        song_id = str(uuid.uuid4())
        
        # Song objesi oluştur
        song_data = {
            "id": song_id,
            "title": title,
            "artist": artist,
            "filename": filename,
            "source": "downloaded",
            "duration": 0,  # Bu daha sonra client'ta hesaplanacak
            "createdAt": datetime.now().isoformat()
        }
        
        # Erotify backend'ine ekle
        response = requests.post(
            f"http://localhost:3001/api/music/add-downloaded",
            json=song_data,
            timeout=10
        )
        
        if response.status_code == 200:
            logger.info(f"Successfully added {filename} to database")
            return True
        else:
            logger.error(f"Failed to add to database: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        logger.error(f"Error adding file to database: {e}")
        return False

@app.post("/update-spotify-config")
async def update_spotify_config(request: dict):
    """Spotify config'ini runtime'da güncelle"""
    global current_spotify_credentials, spotdl_client
    
    try:
        client_id = request.get("client_id", "")
        client_secret = request.get("client_secret", "")
        
        # Credentials'ları güncelle
        current_spotify_credentials["client_id"] = client_id
        current_spotify_credentials["client_secret"] = client_secret
        
        # SpotDL client'ını yeniden başlat
        if client_id and client_secret:
            try:
                spotdl_client = Spotdl(
                    client_id=client_id,
                    client_secret=client_secret,
                    downloader_settings={
                        "output": "../uploads",
                        "format": "mp3",
                        "bitrate": "320k",
                        "quality": "high"
                    }
                )
                logger.info("SpotDL client reinitialized with new credentials")
            except Exception as e:
                logger.error(f"Failed to reinitialize SpotDL: {e}")
                spotdl_client = None
        else:
            spotdl_client = None
            logger.info("SpotDL client disabled - no credentials provided")
        
        return {
            "success": True,
            "message": "Spotify config updated successfully",
            "spotify_configured": bool(client_id and client_secret)
        }
        
    except Exception as e:
        logger.error(f"Error updating Spotify config: {e}")
        return {
            "success": False,
            "error": str(e)
        }

@app.post("/test-spotify-config")
async def test_spotify_config(request: dict):
    """Spotify credentials'larını test et"""
    try:
        client_id = request.get("client_id", "")
        client_secret = request.get("client_secret", "")
        
        if not client_id or not client_secret:
            return {
                "success": False,
                "error": "Client ID and Client Secret are required"
            }
        
        # Spotify API'ye test isteği gönder
        import requests
        
        auth_url = "https://accounts.spotify.com/api/token"
        auth_data = {
            "grant_type": "client_credentials",
            "client_id": client_id,
            "client_secret": client_secret
        }
        
        auth_response = requests.post(auth_url, data=auth_data, timeout=10)
        
        if auth_response.status_code == 200:
            return {
                "success": True,
                "message": "Spotify credentials are valid",
                "token_type": auth_response.json().get("token_type")
            }
        else:
            return {
                "success": False,
                "error": f"Invalid credentials. Status code: {auth_response.status_code}",
                "details": auth_response.text
            }
            
    except Exception as e:
        logger.error(f"Error testing Spotify config: {e}")
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
