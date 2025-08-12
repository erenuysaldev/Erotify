import React, { useState, useEffect } from 'react';
import Layout from './components/Layout/Layout';
import AudioPlayer from './components/Player/AudioPlayer';
import MusicLibrary from './components/Music/MusicLibrary';
import MusicUpload from './components/Music/MusicUpload';
import MusicDownloader from './components/Music/MusicDownloader';
import PlaylistManager from './components/Music/PlaylistManager';
import Favorites from './components/Music/Favorites';
import Settings from './components/Settings/Settings';
import { PlayerProvider } from './context/PlayerContext';
import { LanguageProvider } from './context/LanguageContext';
import { Playlist } from './types';
import { musicAPI } from './services/api';
import './index.css';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('library');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadPlaylists();
  }, [refreshKey]);

  // Electron menü komutlarını dinle
  useEffect(() => {
    // @ts-ignore - Electron API'si
    if (window.electronAPI) {
      // @ts-ignore
      window.electronAPI.onNavigateTo((view: string) => {
        setCurrentView(view);
      });

      // Cleanup
      return () => {
        // @ts-ignore
        window.electronAPI.removeAllListeners('navigate-to');
      };
    }
  }, []);

  const loadPlaylists = async () => {
    try {
      const playlistsData = await musicAPI.getAllPlaylists();
      setPlaylists(playlistsData);
    } catch (error) {
      console.error('Error loading playlists:', error);
    }
  };

  const handlePlaylistsChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleUploadComplete = () => {
    // Kütüphane görünümüne geç ve listeyi yenile
    setCurrentView('library');
    setRefreshKey(prev => prev + 1);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'library':
        return (
          <MusicLibrary 
            playlists={playlists}
            onPlaylistsChange={handlePlaylistsChange}
          />
        );
      
      case 'upload':
        return <MusicUpload onUploadComplete={handleUploadComplete} />;
      
      case 'download':
        return <MusicDownloader />;
      
      case 'playlists':
        return (
          <PlaylistManager onPlaylistChange={handlePlaylistsChange} />
        );
      
      case 'favorites':
        return <Favorites />;
      
      case 'settings':
        return <Settings />;
      
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white">Hoş Geldiniz!</h1>
            <p className="text-gray-400">Müzik kütüphanenizi keşfedin.</p>
          </div>
        );
    }
  };

  return (
    <LanguageProvider>
      <PlayerProvider>
        <div className="App h-screen bg-dark-300 text-white">
          <Layout currentView={currentView} onViewChange={setCurrentView}>
            {renderContent()}
          </Layout>
          <AudioPlayer />
        </div>
      </PlayerProvider>
    </LanguageProvider>
  );
};

export default App;
