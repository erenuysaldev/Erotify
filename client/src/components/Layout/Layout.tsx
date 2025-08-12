import React from 'react';
import { Music, Heart, Upload, Settings, Home, Library, Plus, Download } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  const { t } = useLanguage();
  
  const mainMenuItems = [
    { id: 'library', label: t.nav.home, icon: Home },
    { id: 'playlists', label: t.nav.library, icon: Library },
  ];

  const libraryItems = [
    { id: 'create-playlist', label: t.nav.createPlaylist, icon: Plus },
    { id: 'favorites', label: t.nav.favorites, icon: Heart },
    { id: 'upload', label: t.nav.upload, icon: Upload },
    { id: 'download', label: t.nav.download, icon: Download },
  ];

  return (
    <div className="h-screen bg-dark-200 text-white flex flex-col overflow-hidden">
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Spotify tarzı */}
        <div className="w-64 bg-dark-50 flex flex-col">
          {/* Logo */}
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <Music className="w-8 h-8 text-spotify-500" />
              <span className="text-2xl font-bold text-white">Erotify</span>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="px-3 space-y-1">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`sidebar-item w-full text-left flex items-center space-x-4 ${
                    currentView === item.id ? 'active' : ''
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Separator */}
          <div className="mx-6 my-4 border-t border-dark-500"></div>

          {/* Library Section */}
          <div className="px-3 space-y-1">
            {libraryItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`sidebar-item w-full text-left flex items-center space-x-4 ${
                    currentView === item.id ? 'active' : ''
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Separator */}
          <div className="mx-6 my-4 border-t border-dark-500"></div>

          {/* Playlist List */}
         

          {/* Settings */}
          <div className="px-3 pb-4">
            <button
              onClick={() => onViewChange('settings')}
              className={`sidebar-item w-full text-left flex items-center space-x-4 ${
                currentView === 'settings' ? 'active' : ''
              }`}
            >
              <Settings className="w-6 h-6" />
              <span>Ayarlar</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gradient-dark overflow-hidden flex flex-col">
          {/* Top Bar */}
          <div className="h-16 bg-dark-300 bg-opacity-90 backdrop-blur-custom flex items-center justify-between px-6 border-b border-dark-500">
            <div className="flex items-center space-x-4">
              <button className="p-2 bg-dark-50 rounded-full hover:bg-dark-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="p-2 bg-dark-50 rounded-full hover:bg-dark-400 transition-colors opacity-50 cursor-not-allowed">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button className="btn-ghost">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="w-8 h-8 bg-spotify-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">E</span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
