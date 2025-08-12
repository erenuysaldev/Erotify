import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Music, 
  Play, 
  Pause, 
  MoreVertical, 
  Edit3, 
  Trash2,
  Clock,
  X
} from 'lucide-react';
import { Playlist, Song } from '../../types';
import { musicAPI } from '../../services/api';
import { usePlayer } from '../../context/PlayerContext';

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds === 0) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

interface PlaylistManagerProps {
  onPlaylistChange: () => void;
}

const PlaylistManager: React.FC<PlaylistManagerProps> = ({ onPlaylistChange }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const { state, playSong, playPlaylist } = usePlayer();

  useEffect(() => {
    loadPlaylists();
  }, []);

  useEffect(() => {
    if (selectedPlaylist) {
      loadPlaylistSongs(selectedPlaylist.id);
    }
  }, [selectedPlaylist]);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const playlistsData = await musicAPI.getAllPlaylists();
      setPlaylists(playlistsData);
    } catch (error) {
      console.error('Error loading playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPlaylistSongs = async (playlistId: string) => {
    try {
      const data = await musicAPI.getPlaylistSongs(playlistId);
      setPlaylistSongs(data.songs);
    } catch (error) {
      console.error('Error loading playlist songs:', error);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;

    try {
      await musicAPI.createPlaylist(newPlaylistName.trim(), newPlaylistDescription.trim());
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setShowCreateModal(false);
      await loadPlaylists();
      onPlaylistChange();
    } catch (error) {
      console.error('Error creating playlist:', error);
      alert('Playlist oluşturulamadı');
    }
  };

  const handleUpdatePlaylist = async () => {
    if (!selectedPlaylist || !newPlaylistName.trim()) return;

    try {
      await musicAPI.updatePlaylist(selectedPlaylist.id, {
        name: newPlaylistName.trim(),
        description: newPlaylistDescription.trim()
      });
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setShowEditModal(false);
      await loadPlaylists();
      setSelectedPlaylist(prev => prev ? { ...prev, name: newPlaylistName.trim(), description: newPlaylistDescription.trim() } : null);
      onPlaylistChange();
    } catch (error) {
      console.error('Error updating playlist:', error);
      alert('Playlist güncellenemedi');
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    if (window.confirm('Bu playlist\'i silmek istediğinizden emin misiniz?')) {
      try {
        await musicAPI.deletePlaylist(playlistId);
        await loadPlaylists();
        if (selectedPlaylist?.id === playlistId) {
          setSelectedPlaylist(null);
          setPlaylistSongs([]);
        }
        onPlaylistChange();
      } catch (error) {
        console.error('Error deleting playlist:', error);
        alert('Playlist silinemedi');
      }
    }
  };

  const handleRemoveSongFromPlaylist = async (songId: string) => {
    if (!selectedPlaylist) return;

    try {
      await musicAPI.removeSongFromPlaylist(selectedPlaylist.id, songId);
      await loadPlaylistSongs(selectedPlaylist.id);
      await loadPlaylists(); // Playlist song count'unu güncellemek için
      onPlaylistChange();
    } catch (error) {
      console.error('Error removing song from playlist:', error);
      alert('Şarkı playlist\'ten çıkarılamadı');
    }
  };

  const handlePlayPlaylist = () => {
    if (playlistSongs.length === 0) return;
    playPlaylist(playlistSongs, 0);
  };

  const handlePlaySong = (song: Song, index: number) => {
    if (state.currentSong?.id === song.id) {
      return; // Aynı şarkı çalıyorsa
    }
    playPlaylist(playlistSongs, index);
  };

  const openEditModal = (playlist: Playlist) => {
    setNewPlaylistName(playlist.name);
    setNewPlaylistDescription(playlist.description || '');
    setShowEditModal(true);
    setShowDropdown(null);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Music className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-400">Playlistler yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Playlistler</h1>
          <p className="text-gray-400">{playlists.length} playlist</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Yeni Playlist
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Playlist List */}
        <div className="col-span-4">
          <div className="bg-dark-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-medium text-white">Tüm Playlistler</h3>
            </div>
            
            {playlists.length === 0 ? (
              <div className="p-8 text-center">
                <Music className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Henüz playlist yok</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className={`p-4 hover:bg-dark-100 transition-colors cursor-pointer border-b border-gray-800 last:border-b-0 ${
                      selectedPlaylist?.id === playlist.id ? 'bg-primary-900/20' : ''
                    }`}
                    onClick={() => setSelectedPlaylist(playlist)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 bg-primary-600 rounded flex items-center justify-center">
                          <Music className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            selectedPlaylist?.id === playlist.id ? 'text-primary-500' : 'text-white'
                          }`}>
                            {playlist.name}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {playlist.songIds.length} şarkı
                          </p>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDropdown(showDropdown === playlist.id ? null : playlist.id);
                          }}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {showDropdown === playlist.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-dark-100 rounded-lg shadow-lg border border-gray-700 z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(playlist);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-white hover:bg-dark-200 flex items-center gap-2"
                            >
                              <Edit3 className="w-4 h-4" />
                              Düzenle
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePlaylist(playlist.id);
                                setShowDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-dark-200 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Sil
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Playlist Details */}
        <div className="col-span-8">
          {selectedPlaylist ? (
            <div className="bg-dark-200 rounded-lg overflow-hidden">
              {/* Playlist Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center">
                      <Music className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {selectedPlaylist.name}
                      </h2>
                      <p className="text-gray-400 mb-2">
                        {selectedPlaylist.description || 'Açıklama yok'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {playlistSongs.length} şarkı • 
                        Oluşturulma: {new Date(selectedPlaylist.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  
                  {playlistSongs.length > 0 && (
                    <button
                      onClick={handlePlayPlaylist}
                      className="p-4 bg-primary-600 hover:bg-primary-700 rounded-full transition-colors"
                    >
                      <Play className="w-6 h-6 text-white ml-1" />
                    </button>
                  )}
                </div>
              </div>

              {/* Songs List */}
              {playlistSongs.length === 0 ? (
                <div className="p-8 text-center">
                  <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Playlist boş</h3>
                  <p className="text-gray-400">
                    Bu playlist'e müzik kütüphanenizden şarkı ekleyin
                  </p>
                </div>
              ) : (
                <div>
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-400">
                    <div className="col-span-1">#</div>
                    <div className="col-span-5">BAŞLIK</div>
                    <div className="col-span-3">ALBÜM</div>
                    <div className="col-span-2">EKLENME TARİHİ</div>
                    <div className="col-span-1 flex justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Songs */}
                  <div className="max-h-96 overflow-y-auto">
                    {playlistSongs.map((song, index) => (
                      <div
                        key={song.id}
                        className={`grid grid-cols-12 gap-4 p-4 hover:bg-dark-100 transition-colors group border-b border-gray-800 last:border-b-0 ${
                          state.currentSong?.id === song.id ? 'bg-primary-900/20' : ''
                        }`}
                      >
                        {/* Index/Play Button */}
                        <div className="col-span-1 flex items-center">
                          <button
                            onClick={() => handlePlaySong(song, index)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary-600 transition-colors group"
                          >
                            {state.currentSong?.id === song.id && state.isPlaying ? (
                              <Pause className="w-4 h-4 text-white" />
                            ) : (
                              <>
                                <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                                <Play className="w-4 h-4 text-white hidden group-hover:block ml-0.5" />
                              </>
                            )}
                          </button>
                        </div>

                        {/* Title & Artist */}
                        <div className="col-span-5 flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-600 rounded flex items-center justify-center">
                            <Music className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className={`font-medium ${
                              state.currentSong?.id === song.id ? 'text-primary-500' : 'text-white'
                            }`}>
                              {song.title}
                            </p>
                            <p className="text-sm text-gray-400">{song.artist}</p>
                          </div>
                        </div>

                        {/* Album */}
                        <div className="col-span-3 flex items-center">
                          <p className="text-sm text-gray-400">{song.album || 'Bilinmeyen Albüm'}</p>
                        </div>

                        {/* Date Added */}
                        <div className="col-span-2 flex items-center">
                          <p className="text-sm text-gray-400">
                            {new Date(song.uploadedAt).toLocaleDateString('tr-TR')}
                          </p>
                        </div>

                        {/* Duration & Remove */}
                        <div className="col-span-1 flex items-center justify-between">
                          <p className="text-sm text-gray-400">{formatTime(song.duration)}</p>
                          <button
                            onClick={() => handleRemoveSongFromPlaylist(song.id)}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-dark-200 rounded-lg p-8 text-center">
              <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Playlist Seçin</h3>
              <p className="text-gray-400">
                Sol taraftan bir playlist seçerek şarkıları görüntüleyin
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-200 rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-white mb-4">Yeni Playlist Oluştur</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Playlist Adı *
                </label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-100 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Playlist adını girin"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-100 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500 resize-none"
                  rows={3}
                  placeholder="Playlist açıklaması (opsiyonel)"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleCreatePlaylist}
                disabled={!newPlaylistName.trim()}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Playlist Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-200 rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-white mb-4">Playlist Düzenle</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Playlist Adı *
                </label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-100 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Playlist adını girin"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-100 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500 resize-none"
                  rows={3}
                  placeholder="Playlist açıklaması (opsiyonel)"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleUpdatePlaylist}
                disabled={!newPlaylistName.trim()}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Güncelle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistManager;
