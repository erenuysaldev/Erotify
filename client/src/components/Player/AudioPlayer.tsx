import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle,
  Music,
  Heart,
  PictureInPicture2
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { musicAPI } from '../../services/api';

const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const AudioPlayer: React.FC = () => {
  const { t } = useLanguage();
  const { 
    state, 
    togglePlayPause, 
    nextSong, 
    previousSong, 
    setVolume, 
    toggleMute, 
    seek,
    dispatch 
  } = usePlayer();

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = (parseFloat(e.target.value) / 100) * state.duration;
    seek(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value) / 100;
    setVolume(volume);
  };

  const handleToggleFavorite = async () => {
    if (!state.currentSong) return;
    
    try {
      const updatedSong = await musicAPI.toggleFavorite(state.currentSong.id);
      // Player state'teki current song'u güncelle
      dispatch({
        type: 'SET_SONG',
        payload: updatedSong
      });
    } catch (error) {
      console.error('Favori durumu değiştirilemedi:', error);
    }
  };

  const toggleRepeat = () => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(state.repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    dispatch({ type: 'SET_REPEAT_MODE', payload: nextMode });
  };

  const toggleShuffle = () => {
    dispatch({ type: 'TOGGLE_SHUFFLE' });
  };

  const progressPercent = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  if (!state.currentSong) {
    return (
      <div className="h-24 bg-dark-100 border-t border-dark-500 flex items-center justify-center">
        <div className="flex items-center text-dark-600">
          <Music className="w-8 h-8 mr-3" />
          <div>
            <p className="text-sm font-medium">{t.player.emptyTitle}</p>
            <p className="text-xs">{t.player.emptySubtitle}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-24 bg-dark-100 border-t border-dark-500">
      <div className="h-full flex items-center justify-between px-4">
        {/* Sol: Şarkı Bilgisi */}
        <div className="flex items-center space-x-4 w-1/3 min-w-0">
          {/* Album Art */}
          <div className="w-14 h-14 bg-dark-300 rounded-md flex items-center justify-center flex-shrink-0">
            <Music className="w-8 h-8 text-dark-600" />
          </div>
          
          {/* Şarkı Detayları */}
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-white truncate hover:underline cursor-pointer">
              {state.currentSong.title}
            </h3>
            <p className="text-xs text-dark-600 truncate hover:underline cursor-pointer">
              {state.currentSong.artist}
            </p>
          </div>
          
          {/* Beğen butonu */}
          <button 
            onClick={handleToggleFavorite}
            className={`transition-colors p-2 ${
              state.currentSong?.isFavorite 
                ? 'text-red-500 hover:text-red-400' 
                : 'text-dark-600 hover:text-spotify-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${state.currentSong?.isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          {/* PiP butonu */}
          <button className="text-dark-600 hover:text-white transition-colors p-2">
            <PictureInPicture2 className="w-4 h-4" />
          </button>
        </div>

        {/* Orta: Kontroller ve Progress Bar */}
        <div className="flex flex-col items-center w-1/3 max-w-sm">
          {/* Kontrol Butonları */}
          <div className="flex items-center space-x-2 mb-2">
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded transition-colors ${
                state.isShuffled 
                  ? 'text-spotify-500' 
                  : 'text-dark-600 hover:text-white'
              }`}
              title="Karıştır"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Previous */}
            <button
              onClick={previousSong}
              className="p-2 text-dark-600 hover:text-white transition-colors"
              disabled={state.playlist.length === 0}
              title="Önceki"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlayPause}
              className="btn-play w-8 h-8"
              title={state.isPlaying ? "Duraklat" : "Oynat"}
            >
              {state.isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={nextSong}
              className="p-2 text-dark-600 hover:text-white transition-colors"
              disabled={state.playlist.length === 0}
              title="Sonraki"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Repeat */}
            <button
              onClick={toggleRepeat}
              className={`p-2 rounded transition-colors relative ${
                state.repeatMode !== 'none' 
                  ? 'text-spotify-500' 
                  : 'text-dark-600 hover:text-white'
              }`}
              title={`Tekrar: ${state.repeatMode === 'none' ? 'Kapalı' : state.repeatMode === 'one' ? 'Tek' : 'Tümü'}`}
            >
              <Repeat className="w-4 h-4" />
              {state.repeatMode === 'one' && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-spotify-500 rounded-full text-xs flex items-center justify-center text-black text-xs">
                  1
                </span>
              )}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs text-dark-600 tabular-nums">
              {formatTime(state.currentTime)}
            </span>
            <div className="flex-1 track-progress" style={{'--progress': `${progressPercent}%`} as React.CSSProperties}>
              <div className="progress-fill" style={{width: `${progressPercent}%`}}></div>
              <input
                type="range"
                min="0"
                max="100"
                value={progressPercent}
                onChange={handleProgressChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <span className="text-xs text-dark-600 tabular-nums">
              {formatTime(state.duration)}
            </span>
          </div>
        </div>

        {/* Sağ: Volume ve diğer kontroller */}
        <div className="flex items-center justify-end space-x-2 w-1/3">
          {/* Now Playing Queue */}
          <button className="text-dark-600 hover:text-white transition-colors p-2" title="Şimdi Çalıyor">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M15 7v3H1V7h14zM1 5h14v1H1V5z"/>
            </svg>
          </button>
          
          {/* Devices */}
          <button className="text-dark-600 hover:text-white transition-colors p-2" title="Cihazlara Bağlan">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M6 13c0 1.1.9 2 2 2s2-.9 2-2-2-1-2-1-2-.1-2 1zM12 1H4c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zM5.5 2h5c.28 0 .5.22.5.5s-.22.5-.5.5h-5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5z"/>
            </svg>
          </button>

          {/* Volume */}
          <button
            onClick={toggleMute}
            className="text-dark-600 hover:text-white transition-colors p-2"
            title={state.isMuted ? "Sesi Aç" : "Sesi Kapat"}
          >
            {state.isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          
          <div className="relative w-24 h-4 flex items-center group">
            <div className="w-full h-1 bg-dark-500 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-colors group-hover:bg-spotify-500" 
                style={{width: `${state.isMuted ? 0 : state.volume * 100}%`}}
              ></div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={state.isMuted ? 0 : state.volume * 100}
              onChange={handleVolumeChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>

          {/* Fullscreen */}
          <button className="text-dark-600 hover:text-white transition-colors p-2" title="Tam Ekran">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
