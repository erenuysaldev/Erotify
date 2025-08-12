import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  MoreVertical,
  Clock,
  Music,
  Trash2,
  Plus,
  Heart,
  HeartOff
} from 'lucide-react';
import { Song } from '../../types';
import { musicAPI } from '../../services/api';
import { usePlayer } from '../../context/PlayerContext';
import { useLanguage } from '../../context/LanguageContext';

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds === 0) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const Favorites: React.FC = () => {
  const { t } = useLanguage();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);
  const { state, playSong } = usePlayer();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoritesData = await musicAPI.getFavorites();
      setSongs(favoritesData);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySong = (song: Song, index: number) => {
    if (state.currentSong?.id === song.id) {
      return;
    }
    playSong(song);
  };

  const handleToggleFavorite = async (songId: string) => {
    try {
      await musicAPI.toggleFavorite(songId);
      await loadFavorites(); // Favoriler listesini yenile
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spotify-500 mx-auto mb-4"></div>
          <p className="text-gray-400">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <Heart className="w-12 h-12 text-gray-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">{t.favorites.noFavorites}</h2>
          <p className="text-gray-400 mb-6">
            {t.favorites.noFavoritesDesc}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="relative mb-8">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 via-pink-500/20 to-transparent rounded-lg"></div>
        
        {/* Content */}
        <div className="relative p-8 pb-6">
          <div className="flex items-end space-x-6">
            {/* Favorites Icon */}
            <div className="w-48 h-48 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 flex items-center justify-center shadow-2xl">
              <Heart className="w-24 h-24 text-white fill-current" />
            </div>
            
            {/* Text Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/70 uppercase tracking-wide">
                {t.favorites.playlist}
              </p>
              <h1 className="text-6xl font-black text-white mt-2 mb-4">
                {t.favorites.title}
              </h1>
              <div className="flex items-center text-white/70 space-x-1">
                <span className="font-medium">Erotify</span>
                <span>•</span>
                <span>{songs.length} {t.favorites.songs}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-6 mb-8 px-6">
        <button 
          onClick={() => songs.length > 0 && handlePlaySong(songs[0], 0)}
          className="w-14 h-14 bg-spotify-500 hover:bg-spotify-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <Play className="w-6 h-6 text-black ml-1 fill-current" />
        </button>
      </div>

      {/* Songs List */}
      <div className="px-6">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-gray-400 border-b border-gray-800 mb-2">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-6">{t.favorites.title}</div>
          <div className="col-span-3">{t.favorites.album}</div>
          <div className="col-span-2 flex justify-end">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Songs */}
        <div className="space-y-1">
          {songs.map((song, index) => {
            const isPlaying = state.currentSong?.id === song.id && state.isPlaying;
            const isCurrent = state.currentSong?.id === song.id;
            
            return (
              <div
                key={song.id}
                className={`group grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-white/5 transition-all duration-200 cursor-pointer ${
                  isCurrent ? 'bg-white/10' : ''
                }`}
                onMouseEnter={() => setHoveredSong(song.id)}
                onMouseLeave={() => setHoveredSong(null)}
                onClick={() => handlePlaySong(song, index)}
              >
                {/* Index/Play Button */}
                <div className="col-span-1 flex items-center justify-center">
                  {hoveredSong === song.id || isPlaying ? (
                    <button className="w-8 h-8 flex items-center justify-center">
                      {isPlaying ? (
                        <Pause className="w-4 h-4 text-white" />
                      ) : (
                        <Play className="w-4 h-4 text-white" />
                      )}
                    </button>
                  ) : (
                    <span className={`text-sm ${isCurrent ? 'text-spotify-500' : 'text-gray-400'}`}>
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Song Info */}
                <div className="col-span-6 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
                    <Music className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${isCurrent ? 'text-spotify-500' : 'text-white'}`}>
                      {song.title}
                    </p>
                    <p className="text-sm text-gray-400 truncate">
                      {song.artist}
                    </p>
                  </div>
                </div>

                {/* Album */}
                <div className="col-span-3 flex items-center">
                  <p className="text-sm text-gray-400 truncate">
                    {song.album || t.favorites.unknownAlbum}
                  </p>
                </div>

                {/* Duration and Actions */}
                <div className="col-span-2 flex items-center justify-end space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(song.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-full transition-all duration-200"
                  >
                    <HeartOff className="w-4 h-4 text-spotify-500" />
                  </button>
                  <span className="text-sm text-gray-400 min-w-[40px] text-right">
                    {formatTime(song.duration)}
                  </span>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDropdown(showDropdown === song.id ? null : song.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-full transition-all duration-200"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    {showDropdown === song.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(song.id);
                            setShowDropdown(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 flex items-center space-x-3"
                        >
                          <HeartOff className="w-4 h-4" />
                          <span>{t.favorites.removeFromFavorites}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
