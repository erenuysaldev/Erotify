import React, { useState, useEffect } from 'react';
import { 
  Play, 
  MoreVertical, 
  Clock, 
  Music,
  Trash2,
  Plus,
  Heart,
  Download
} from 'lucide-react';
import { Song, Playlist } from '../../types';
import { musicAPI } from '../../services/api';
import { usePlayer } from '../../context/PlayerContext';
import { useLanguage } from '../../context/LanguageContext';

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds === 0) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

interface MusicLibraryProps {
  playlists: Playlist[];
  onPlaylistsChange: () => void;
}

const MusicLibrary: React.FC<MusicLibraryProps> = ({ playlists, onPlaylistsChange }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState<string | null>(null);
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);
  
  const { state, playSong, playPlaylist } = usePlayer();
  const { t } = useLanguage();

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      setLoading(true);
      const songsData = await musicAPI.getAllSongs();
      setSongs(songsData);
    } catch (error) {
      console.error('Error loading songs:', error);
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

  const handleDeleteSong = async (songId: string) => {
    if (window.confirm(t.messages.confirmDelete)) {
      try {
        await musicAPI.deleteSong(songId);
        await loadSongs();
        onPlaylistsChange();
      } catch (error) {
        console.error('Error deleting song:', error);
        alert('An error occurred while deleting the song');
      }
    }
  };

  const handleToggleFavorite = async (songId: string) => {
    try {
      await musicAPI.toggleFavorite(songId);
      await loadSongs(); // Listeyi yenile
    } catch (error) {
      console.error('Favori durumu değiştirilemedi:', error);
    }
  };

  const handleAddToPlaylist = async (playlistId: string, songId: string | null) => {
    if (!songId) return;
    
    try {
      await musicAPI.addSongToPlaylist(playlistId, songId);
      setShowPlaylistModal(null);
      onPlaylistsChange();
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      alert('An error occurred while adding the song to playlist');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-spotify-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Music className="w-12 h-12 text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Henüz müzik yok</h3>
            <p className="text-dark-600">{t.library.noSongsDesc}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-end space-x-6 mb-6">
          <div className="w-56 h-56 bg-gradient-spotify flex items-center justify-center rounded-lg shadow-2xl">
            <Music className="w-20 h-20 text-black" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white mb-2">{t.favorites.playlist}</p>
            <h1 className="text-6xl font-black text-white mb-4">{t.favorites.title}</h1>
            <p className="text-dark-600 mb-4">
              <span className="text-white font-semibold">Erotify</span> • {songs.length} {t.library.songCount}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => songs.length > 0 && playPlaylist(songs, 0)}
            className="btn-play w-14 h-14"
            disabled={songs.length === 0}
          >
            <Play className="w-6 h-6 ml-1" />
          </button>
          
          <button className="text-dark-600 hover:text-white transition-colors p-2">
            <Heart className="w-8 h-8" />
          </button>
          
          <button className="text-dark-600 hover:text-white transition-colors p-2">
            <Download className="w-8 h-8" />
          </button>
          
          <button className="text-dark-600 hover:text-white transition-colors p-2">
            <MoreVertical className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Song List */}
      <div className="space-y-1">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-dark-600 border-b border-dark-500">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-5">{t.library.title}</div>
          <div className="col-span-2">{t.library.album}</div>
          <div className="col-span-2">{t.library.dateAdded}</div>
          <div className="col-span-1 text-center">
            <Clock className="w-4 h-4 mx-auto" />
          </div>
          <div className="col-span-1"></div>
        </div>

        {/* Song Rows */}
        {songs.map((song, index) => (
          <div 
            key={song.id}
            className={`song-row grid grid-cols-12 gap-4 px-4 py-2 group rounded-md transition-colors ${
              state.currentSong?.id === song.id ? 'bg-dark-400' : ''
            }`}
            onMouseEnter={() => setHoveredSong(song.id)}
            onMouseLeave={() => setHoveredSong(null)}
          >
            {/* Index/Play Button */}
            <div className="col-span-1 flex items-center justify-center">
              <button
                onClick={() => handlePlaySong(song, index)}
                className="w-4 text-center"
              >
                {state.currentSong?.id === song.id && state.isPlaying ? (
                  <div className="flex items-center justify-center">
                    <div className="flex space-x-1">
                      <div className="w-1 h-4 bg-spotify-500 animate-pulse"></div>
                      <div className="w-1 h-3 bg-spotify-500 animate-pulse" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1 h-4 bg-spotify-500 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-1 h-2 bg-spotify-500 animate-pulse" style={{animationDelay: '0.3s'}}></div>
                    </div>
                  </div>
                ) : hoveredSong === song.id ? (
                  <Play className="w-4 h-4 text-white" />
                ) : (
                  <span className={`text-sm ${
                    state.currentSong?.id === song.id ? 'text-spotify-500' : 'text-dark-600'
                  }`}>
                    {index + 1}
                  </span>
                )}
              </button>
            </div>

            {/* Title & Artist */}
            <div className="col-span-5 flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 bg-dark-300 rounded flex items-center justify-center flex-shrink-0">
                <Music className="w-5 h-5 text-dark-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`font-medium truncate ${
                  state.currentSong?.id === song.id ? 'text-spotify-500' : 'text-white'
                }`}>
                  {song.title}
                </p>
                <p className="text-sm text-dark-600 truncate">{song.artist}</p>
              </div>
            </div>

            {/* Album */}
            <div className="col-span-2 flex items-center">
              <p className="text-sm text-dark-600 truncate">{song.album || t.favorites.unknownAlbum}</p>
            </div>

            {/* Date Added */}
            <div className="col-span-2 flex items-center">
              <p className="text-sm text-dark-600">
                {new Date(song.uploadedAt).toLocaleDateString('tr-TR')}
              </p>
            </div>

            {/* Duration */}
            <div className="col-span-1 flex items-center justify-center">
              <p className="text-sm text-dark-600">{formatTime(song.duration)}</p>
            </div>

            {/* Actions */}
            <div className="col-span-1 flex items-center justify-end">
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleToggleFavorite(song.id)}
                  className={`transition-colors p-1 ${
                    song.isFavorite 
                      ? 'text-red-500 hover:text-red-400' 
                      : 'text-dark-600 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${song.isFavorite ? 'fill-current' : ''}`} />
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(showDropdown === song.id ? null : song.id)}
                    className="text-dark-600 hover:text-white transition-colors p-1"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {showDropdown === song.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-dark-300 rounded-md shadow-xl border border-dark-500 z-10">
                      <button
                        onClick={() => {
                          handleToggleFavorite(song.id);
                          setShowDropdown(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-white hover:bg-dark-400 flex items-center gap-2"
                      >
                        <Heart className={`w-4 h-4 ${song.isFavorite ? 'fill-current text-red-500' : ''}`} />
                        {song.isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                      </button>
                      <button
                        onClick={() => {
                          setShowPlaylistModal(song.id);
                          setShowDropdown(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-white hover:bg-dark-400 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Çalma listesine ekle
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteSong(song.id);
                          setShowDropdown(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-white hover:bg-dark-400 flex items-center gap-2 rounded-b-md"
                      >
                        <Trash2 className="w-4 h-4" />
                        Kaldır
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Playlist Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-300 rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-medium text-white mb-4">Çalma Listesi Seç</h3>
            
            {playlists.length === 0 ? (
              <p className="text-dark-600 text-center py-4">
                Henüz çalma listesi oluşturmadınız
              </p>
            ) : (
              <div className="space-y-2">
                {playlists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => handleAddToPlaylist(playlist.id, showPlaylistModal)}
                    className="w-full p-3 text-left bg-dark-400 hover:bg-dark-500 rounded-md transition-colors"
                  >
                    <p className="font-medium text-white">{playlist.name}</p>
                    <p className="text-sm text-dark-600">{playlist.songIds.length} {t.library.songCount}</p>
                  </button>
                ))}
              </div>
            )}
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowPlaylistModal(null)}
                className="flex-1 px-4 py-2 bg-dark-500 hover:bg-dark-600 text-white rounded-md transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicLibrary;
