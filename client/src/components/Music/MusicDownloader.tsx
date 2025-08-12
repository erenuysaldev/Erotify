import React, { useState, useEffect } from 'react';
import { Download, Search, CheckCircle, AlertCircle, Clock, Music, ExternalLink, X } from 'lucide-react';
import { downloadService, SearchResult, DownloadStatus } from '../../services/downloadService';
import { useLanguage } from '../../context/LanguageContext';

const MusicDownloader: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [downloads, setDownloads] = useState<DownloadStatus[]>([]);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isServiceOnline, setIsServiceOnline] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<any>(null);
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);

  // Servis durumunu kontrol et
  useEffect(() => {
    checkServiceHealth();
    const interval = setInterval(checkServiceHealth, 30000); // Her 30 saniyede kontrol et
    return () => clearInterval(interval);
  }, []);

  // İndirme durumlarını güncelle
  useEffect(() => {
    if (isServiceOnline) {
      loadDownloads();
      const interval = setInterval(loadDownloads, 2000); // Her 2 saniyede güncelle
      return () => clearInterval(interval);
    }
  }, [isServiceOnline]);

  const checkServiceHealth = async () => {
    try {
      const status = await downloadService.checkHealth();
      setServiceStatus(status);
      setIsServiceOnline(status.status === 'healthy');
    } catch (error) {
      setIsServiceOnline(false);
      setServiceStatus(null);
    }
  };

  const loadDownloads = async () => {
    try {
      const response = await downloadService.getAllDownloads();
      setDownloads(response.downloads);
    } catch (error) {
      console.error('Failed to load downloads:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !isServiceOnline) return;

    setIsSearching(true);
    try {
      const results = await downloadService.searchMusic(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      alert(t.download.searchFailed);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDownloadFromUrl = async () => {
    if (!downloadUrl.trim() || !isServiceOnline) return;

    if (!downloadService.isValidUrl(downloadUrl)) {
      alert(t.download.invalidUrlAlert);
      return;
    }

    try {
      // Playlist/album URL'si mi kontrol et
      const isPlaylistOrAlbum = downloadUrl.includes('/playlist/') || downloadUrl.includes('/album/');
      
      if (isPlaylistOrAlbum) {
        const confirmBulk = window.confirm(
          'Bu bir playlist/albüm linki. Tüm şarkıları indirmek istiyor musunuz?\n\n' +
          'Bu işlem uzun sürebilir ve birden fazla şarkı indirecektir.'
        );
        
        if (!confirmBulk) return;
        setIsBulkDownloading(true);
      }

      await downloadService.startDownload(downloadUrl);
      setDownloadUrl('');
      loadDownloads();
      
      if (isPlaylistOrAlbum) {
        // 5 saniye sonra bulk downloading'i kapat
        setTimeout(() => setIsBulkDownloading(false), 5000);
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert(t.download.downloadStartFailed);
      setIsBulkDownloading(false);
    }
  };

  const handleDownloadFromSearch = async (result: SearchResult) => {
    if (!isServiceOnline) return;

    try {
      await downloadService.startDownload(result.url);
      loadDownloads();
    } catch (error) {
      console.error('Download failed:', error);
      alert('İndirme başlatılamadı. Lütfen tekrar deneyin.');
    }
  };

  const handleCancelDownload = async (downloadId: string) => {
    try {
      await downloadService.cancelDownload(downloadId);
      loadDownloads();
    } catch (error) {
      console.error('Cancel failed:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-spotify-500" />;
      case 'failed':
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'downloading':
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
      default:
        return <Music className="w-5 h-5 text-dark-600" />;
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Müzik İndir</h1>
        <p className="text-dark-600">Spotify ve YouTube'dan müzik indirin</p>
      </div>

      {/* Service Status */}
      <div className="mb-6 p-4 rounded-lg bg-dark-200 border border-dark-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isServiceOnline ? 'bg-spotify-500' : 'bg-red-500'}`}></div>
            <span className="text-white font-medium">
              İndirme Servisi: {isServiceOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
            </span>
          </div>
          {serviceStatus && (
            <div className="text-sm text-dark-600">
              SpotDL: {serviceStatus.spotdl_initialized ? '✓' : '✗'} | 
              Spotify: {serviceStatus.spotify_configured ? '✓' : '✗'}
            </div>
          )}
        </div>
        
        {!isServiceOnline && (
          <div className="mt-3 p-3 bg-red-900/20 rounded border border-red-800">
            <p className="text-red-400 text-sm">
              İndirme servisi çalışmıyor. Python service'i başlatmak için:
              <code className="block mt-2 bg-dark-800 p-2 rounded">
                cd python-service && pip install -r requirements.txt && python main.py
              </code>
            </p>
          </div>
        )}

        {serviceStatus && !serviceStatus.spotify_configured && (
          <div className="mt-3 p-3 bg-yellow-900/20 rounded border border-yellow-800">
            <p className="text-yellow-400 text-sm">
              Spotify API ayarlanmamış. Çevresel değişkenler:
              <code className="block mt-1">SPOTIFY_CLIENT_ID ve SPOTIFY_CLIENT_SECRET</code>
            </p>
          </div>
        )}
      </div>

      {/* URL Download */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">URL'den İndir</h2>
        <div className="flex space-x-3">
          <input
            type="text"
            value={downloadUrl}
            onChange={(e) => setDownloadUrl(e.target.value)}
            placeholder="Spotify veya YouTube URL'sini yapıştırın..."
            className="flex-1 bg-dark-200 border border-dark-500 rounded-lg px-4 py-3 text-white placeholder-dark-600 focus:outline-none focus:border-spotify-500"
            disabled={!isServiceOnline}
          />
          <button
            onClick={handleDownloadFromUrl}
            disabled={!downloadUrl.trim() || !isServiceOnline || isBulkDownloading}
            className="btn-spotify px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5 mr-2" />
            {isBulkDownloading ? 'İndiriliyor...' : 'İndir'}
          </button>
        </div>
        <p className="text-sm text-dark-600 mt-2">
          Desteklenen: Spotify şarkıları, albümleri, çalma listeleri ve YouTube videoları
          <br />
          <span className="text-spotify-500">💡 Playlist/Album linkleri için toplu indirme desteklenir</span>
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Müzik Ara</h2>
        <div className="flex space-x-3 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Şarkı, sanatçı veya albüm adı..."
            className="flex-1 bg-dark-200 border border-dark-500 rounded-lg px-4 py-3 text-white placeholder-dark-600 focus:outline-none focus:border-spotify-500"
            disabled={!isServiceOnline}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isSearching || !isServiceOnline}
            className="btn-outline px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="w-5 h-5 mr-2" />
            {isSearching ? 'Aranıyor...' : 'Ara'}
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="grid gap-3">
            {searchResults.map((result, index) => (
              <div key={index} className="bg-dark-200 rounded-lg p-4 border border-dark-500 hover:border-dark-400 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{result.title}</h3>
                    <p className="text-dark-600 text-sm">{result.artist}</p>
                    <p className="text-dark-700 text-xs">{result.album} • {formatDuration(result.duration)}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-dark-600 hover:text-white transition-colors"
                      title="Spotify'da Aç"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDownloadFromSearch(result)}
                      className="btn-spotify px-4 py-2 text-sm"
                      disabled={!isServiceOnline}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      İndir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Downloads */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">İndirmeler</h2>
        {downloads.length === 0 ? (
          <div className="text-center py-8 text-dark-600">
            <Download className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Henüz indirme yok</p>
          </div>
        ) : (
          <div className="space-y-3">
            {downloads.map((download) => (
              <div key={download.id} className="bg-dark-200 rounded-lg p-4 border border-dark-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(download.status)}
                    <div className="min-w-0 flex-1">
                      {download.song_info ? (
                        <>
                          <h3 className="text-white font-medium truncate">{download.song_info.title}</h3>
                          <p className="text-dark-600 text-sm">{download.song_info.artist}</p>
                        </>
                      ) : (
                        <h3 className="text-white font-medium">İndiriliyor...</h3>
                      )}
                      <p className="text-xs text-dark-700">{download.message}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {download.status === 'downloading' && (
                      <div className="text-right">
                        <div className="text-sm text-white">{Math.round(download.progress)}%</div>
                        <div className="w-20 h-1 bg-dark-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-spotify-500 transition-all duration-300"
                            style={{ width: `${download.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {(download.status === 'pending' || download.status === 'downloading') && (
                      <button
                        onClick={() => handleCancelDownload(download.id)}
                        className="p-2 text-dark-600 hover:text-red-500 transition-colors"
                        title="İptal Et"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicDownloader;
