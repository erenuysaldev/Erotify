import React, { useState, useEffect } from 'react';
import { Save, TestTube, Eye, EyeOff, Check, X, AlertCircle, Globe } from 'lucide-react';
import { musicAPI } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

interface SettingsState {
  spotifyClientId: string;
  spotifyClientSecret: string;
  showSecret: boolean;
  isLoading: boolean;
  isSaving: boolean;
  isTesting: boolean;
  testResult: {
    success?: boolean;
    message?: string;
  } | null;
  saveResult: {
    success?: boolean;
    message?: string;
  } | null;
}

const Settings: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [settings, setSettings] = useState<SettingsState>({
    spotifyClientId: '',
    spotifyClientSecret: '',
    showSecret: false,
    isLoading: true,
    isSaving: false,
    isTesting: false,
    testResult: null,
    saveResult: null
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setSettings(prev => ({ ...prev, isLoading: true }));
      const data = await musicAPI.getSettings();
      setSettings(prev => ({
        ...prev,
        spotifyClientId: data.spotifyClientId || '',
        spotifyClientSecret: data.spotifyClientSecret === '***masked***' ? '' : data.spotifyClientSecret || '',
        isLoading: false
      }));
    } catch (error) {
      console.error('Settings yüklenirken hata:', error);
      setSettings(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleInputChange = (field: keyof SettingsState, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
      testResult: null,
      saveResult: null
    }));
  };

  const handleTestSpotify = async () => {
    if (!settings.spotifyClientId || !settings.spotifyClientSecret) {
      setSettings(prev => ({
        ...prev,
        testResult: {
          success: false,
          message: 'Client ID ve Client Secret gerekli'
        }
      }));
      return;
    }

    try {
      setSettings(prev => ({ ...prev, isTesting: true, testResult: null }));
      const result = await musicAPI.testSpotifyConfig(
        settings.spotifyClientId,
        settings.spotifyClientSecret
      );
      
      setSettings(prev => ({
        ...prev,
        isTesting: false,
        testResult: result
      }));
    } catch (error: any) {
      setSettings(prev => ({
        ...prev,
        isTesting: false,
        testResult: {
          success: false,
          message: error.response?.data?.error || 'Test başarısız'
        }
      }));
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSettings(prev => ({ ...prev, isSaving: true, saveResult: null }));
      
      const result = await musicAPI.updateSettings({
        spotifyClientId: settings.spotifyClientId,
        spotifyClientSecret: settings.spotifyClientSecret
      });

      setSettings(prev => ({
        ...prev,
        isSaving: false,
        saveResult: {
          success: true,
          message: 'Ayarlar başarıyla kaydedildi'
        }
      }));

      // 3 saniye sonra mesajı temizle
      setTimeout(() => {
        setSettings(prev => ({ ...prev, saveResult: null }));
      }, 3000);

    } catch (error: any) {
      setSettings(prev => ({
        ...prev,
        isSaving: false,
        saveResult: {
          success: false,
          message: error.response?.data?.error || 'Ayarlar kaydedilemedi'
        }
      }));
    }
  };

  if (settings.isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-white">{t.loading}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-8">{t.settings.title}</h1>

      {/* Language Settings */}
      <div className="bg-dark-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-3 text-spotify-500" />
          {t.settings.language}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-600 mb-2">
              {t.settings.language}
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'tr' | 'en' | 'zh')}
              className="w-full px-4 py-2 bg-dark-300 text-white rounded-lg border border-dark-400 focus:ring-2 focus:ring-spotify-500 focus:border-transparent"
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
          </div>
        </div>
      </div>

      {/* Spotify API Ayarları */}
      <div className="bg-dark-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="w-2 h-2 bg-spotify-500 rounded-full mr-3"></span>
          {t.settings.spotify}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-600 mb-2">
              {t.settings.clientId}
            </label>
            <input
              type="text"
              value={settings.spotifyClientId}
              onChange={(e) => handleInputChange('spotifyClientId', e.target.value)}
              placeholder="Spotify Client ID'nizi girin"
              className="w-full px-4 py-3 bg-dark-300 border border-dark-500 rounded-lg text-white placeholder-dark-600 focus:outline-none focus:border-spotify-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-600 mb-2">
              {t.settings.clientSecret}
            </label>
            <div className="relative">
              <input
                type={settings.showSecret ? "text" : "password"}
                value={settings.spotifyClientSecret}
                onChange={(e) => handleInputChange('spotifyClientSecret', e.target.value)}
                placeholder={t.settings.clientSecret}
                className="w-full px-4 py-3 bg-dark-300 border border-dark-500 rounded-lg text-white placeholder-dark-600 focus:outline-none focus:border-spotify-500 transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setSettings(prev => ({ ...prev, showSecret: !prev.showSecret }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-600 hover:text-white transition-colors"
              >
                {settings.showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="bg-dark-300 rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-2">{t.settings.spotifyInstructions}</h3>
            <ol className="text-sm text-dark-600 space-y-1">
              <li>1. <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-spotify-500 hover:underline">{t.settings.spotifyStep1}</a></li>
              <li>2. {t.settings.spotifyStep2}</li>
              <li>3. {t.settings.spotifyStep3}</li>
              <li>4. {t.settings.spotifyStep4}</li>
            </ol>
          </div>

          {/* Test ve Kaydet Butonları */}
          <div className="flex gap-3">
            <button
              onClick={handleTestSpotify}
              disabled={settings.isTesting || !settings.spotifyClientId || !settings.spotifyClientSecret}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-dark-500 disabled:text-dark-600 text-white rounded-lg transition-colors"
            >
              <TestTube className="w-4 h-4" />
              {settings.isTesting ? t.settings.testing : t.settings.testConnection}
            </button>

            <button
              onClick={handleSaveSettings}
              disabled={settings.isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-spotify-500 hover:bg-spotify-600 disabled:bg-dark-500 disabled:text-dark-600 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              {settings.isSaving ? t.settings.saving : t.save}
            </button>
          </div>

          {/* Test Sonucu */}
          {settings.testResult && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              settings.testResult.success 
                ? 'bg-green-900/20 border border-green-500/30' 
                : 'bg-red-900/20 border border-red-500/30'
            }`}>
              {settings.testResult.success ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <X className="w-5 h-5 text-red-500" />
              )}
              <span className={settings.testResult.success ? 'text-green-400' : 'text-red-400'}>
                {settings.testResult.message}
              </span>
            </div>
          )}

          {/* Kaydetme Sonucu */}
          {settings.saveResult && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              settings.saveResult.success 
                ? 'bg-green-900/20 border border-green-500/30' 
                : 'bg-red-900/20 border border-red-500/30'
            }`}>
              {settings.saveResult.success ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              <span className={settings.saveResult.success ? 'text-green-400' : 'text-red-400'}>
                {settings.saveResult.message}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Uygulama Bilgileri */}
      <div className="bg-dark-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Uygulama Bilgileri</h2>
        <div className="space-y-2 text-sm">
          <p className="text-dark-600">
            <span className="text-white font-medium">Erotify</span> - Açık kaynak müzik çalıcı
          </p>
          <p className="text-dark-600">
            <span className="text-white font-medium">Versiyon:</span> 1.0.0
          </p>
          <p className="text-dark-600">
            <span className="text-white font-medium">Teknoloji:</span> React + TypeScript + Node.js + Python
          </p>
          <p className="text-dark-600">
            <span className="text-white font-medium">Özellikler:</span> Müzik çalma, SpotDL entegrasyonu, Favoriler sistemi
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
