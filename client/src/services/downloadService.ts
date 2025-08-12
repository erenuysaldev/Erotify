// Download service for communicating with Python backend
export interface SearchResult {
  title: string;
  artist: string;
  album: string;
  duration: number;
  url: string;
  cover_url?: string;
}

export interface DownloadStatus {
  id: string;
  status: 'pending' | 'downloading' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  message: string;
  song_info?: {
    title: string;
    artist: string;
    album: string;
    duration: number;
  };
  file_path?: string;
}

const PYTHON_SERVICE_URL = 'http://127.0.0.1:8000';

class DownloadService {
  // Müzik arama
  async searchMusic(query: string): Promise<SearchResult[]> {
    try {
      const response = await fetch(`${PYTHON_SERVICE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  // İndirme başlat
  async startDownload(url: string): Promise<{ download_id: string; status: string }> {
    try {
      const response = await fetch(`${PYTHON_SERVICE_URL}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`Download start failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Download start error:', error);
      throw error;
    }
  }

  // İndirme durumu kontrol et
  async getDownloadStatus(downloadId: string): Promise<DownloadStatus> {
    try {
      const response = await fetch(`${PYTHON_SERVICE_URL}/download/${downloadId}/status`);

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Status check error:', error);
      throw error;
    }
  }

  // Tüm indirmeleri getir
  async getAllDownloads(): Promise<{ downloads: DownloadStatus[] }> {
    try {
      const response = await fetch(`${PYTHON_SERVICE_URL}/downloads`);

      if (!response.ok) {
        throw new Error(`Get downloads failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get downloads error:', error);
      throw error;
    }
  }

  // İndirmeyi iptal et
  async cancelDownload(downloadId: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${PYTHON_SERVICE_URL}/download/${downloadId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Cancel download failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Cancel download error:', error);
      throw error;
    }
  }

  // Python service sağlık kontrolü
  async checkHealth(): Promise<{
    status: string;
    spotdl_initialized: boolean;
    spotify_configured: boolean;
  }> {
    try {
      const response = await fetch(`${PYTHON_SERVICE_URL}/health`);

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  // Spotify URL'i kontrol et
  isSpotifyUrl(url: string): boolean {
    const spotifyUrlRegex = /^https?:\/\/(open\.spotify\.com|spotify\.com)\/(track|album|playlist|artist)\/[a-zA-Z0-9]+/;
    return spotifyUrlRegex.test(url);
  }

  // YouTube URL'i kontrol et
  isYouTubeUrl(url: string): boolean {
    const youtubeUrlRegex = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/)?[a-zA-Z0-9_-]+/;
    return youtubeUrlRegex.test(url);
  }

  // Geçerli URL kontrol et
  isValidUrl(url: string): boolean {
    return this.isSpotifyUrl(url) || this.isYouTubeUrl(url);
  }
}

export const downloadService = new DownloadService();
