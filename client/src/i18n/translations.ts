export const translations = {
  tr: {
    // Genel
    appName: "Erotify",
    loading: "Yükleniyor...",
  welcomeTitle: "Hoş geldiniz!",
  welcomeSubtitle: "Müzik kütüphaneni keşfet.",
    save: "Kaydet",
    cancel: "İptal",
    delete: "Sil",
    edit: "Düzenle",
    add: "Ekle",
    search: "Ara",
    back: "Geri",
    next: "İleri",
    previous: "Önceki",
    close: "Kapat",
    ok: "Tamam",
    yes: "Evet",
    no: "Hayır",
    
    // Navigasyon
    nav: {
      home: "Ana Sayfa",
      search: "Ara",
      library: "Kütüphaneniz",
      createPlaylist: "Çalma Listesi Oluştur",
      favorites: "Beğenilen Şarkılar",
      upload: "Dosya Yükle",
      download: "Müzik İndir",
      settings: "Ayarlar"
    },
    
    // Müzik Kütüphanesi
    library: {
      title: "BAŞLIK",
      noSongs: "Henüz şarkı yok",
      noSongsDesc: "Şarkı yükleyerek veya indirerek başlayın",
      duration: "Süre",
      album: "ALBÜM",
      artist: "Sanatçı",
      songTitle: "Başlık",
      unknown: "Bilinmiyor",
      songCount: "şarkı",
      playAll: "Tümünü Çal",
      dateAdded: "EKLENME TARİHİ",
      playlist: "ÇALMA LİSTESİ",
      songs: "şarkı"
    },

    // Favoriler
    favorites: {
      title: "Beğenilen Şarkılar",
      noFavorites: "Henüz favori şarkınız yok",
      noFavoritesDesc: "Sevdiğiniz şarkıları beğenerek buraya ekleyebilirsiniz",
      addToFavorites: "Favorilere ekle",
      removeFromFavorites: "Favorilerden çıkar",
      playlist: "ÇALMA LİSTESİ",
      songs: "şarkı",
      album: "Albüm",
      unknownAlbum: "Bilinmeyen Albüm"
    },
    
    // Çalma Listeleri
    playlists: {
      title: "Çalma Listeleri",
      create: "Çalma Listesi Oluştur",
      name: "Liste Adı",
      description: "Açıklama",
      addSong: "Şarkı Ekle",
      removeSong: "Şarkıyı Çıkar",
      deletePlaylist: "Listeyi Sil",
      editPlaylist: "Listeyi Düzenle",
      addToPlaylist: "Çalma Listesine Ekle",
      noPlaylists: "Henüz çalma listeniz yok",
      createFirst: "İlk çalma listenizi oluşturun"
    },
    
    // Dosya Yükleme
    upload: {
      title: "Müzik Yükle",
      description: "Bilgisayarınızdan müzik dosyalarını sürükleyip bırakın veya seçin",
      selectFiles: "Dosya Seç",
      uploadButton: "Yükle",
      uploading: "Yükleniyor...",
      success: "Başarıyla yüklendi",
      error: "Yükleme hatası",
      dragHere: "Dosyaları buraya sürükleyin",
      uploadedFiles: "Yüklenen Dosyalar",
      invalidFormat: "Lütfen sadece ses dosyalarını seçin (.mp3, .wav, .ogg, .flac, .m4a, .aac)",
      errorText: "Hata",
      browseClick: "göz atmak için tıklayın",
      supportedFormats: "Desteklenen formatlar: MP3, WAV, OGG, FLAC, M4A, AAC",
      clearCompleted: "Tamamlananları Temizle",
      tipsTitle: "💡 İpuçları:",
      tips: {
        quality: "En iyi kalite için yüksek bit rate'li dosyalar kullanın",
        metadata: "Dosya adları ve metadata (artist, album) otomatik olarak okunur",
        multiple: "Aynı anda birden fazla dosya yükleyebilirsiniz",
        maxSize: "Maksimum dosya boyutu: 50MB"
      }
    },
    
    // Müzik İndirme
    download: {
      title: "Müzik İndir",
      subtitle: "Spotify ve YouTube'dan müzik indirin",
      placeholder: "Spotify URL'si girin",
      downloadButton: "İndir",
      downloading: "İndiriliyor...",
      success: "Başarıyla indirildi",
      error: "İndirme hatası",
      invalidUrl: "Geçersiz URL",
      spotifyUrl: "Spotify URL'si gerekli",
      searchFailed: "Arama başarısız oldu. Lütfen tekrar deneyin.",
      invalidUrlAlert: "Geçerli bir Spotify veya YouTube URL'si girin.",
      playlistConfirm: "Bu bir playlist/albüm linki. Tüm şarkıları indirmek istiyor musunuz?\\n\\nBu işlem uzun sürebilir ve birden fazla şarkı indirecektir.",
      downloadStartFailed: "İndirme başlatılamadı. Lütfen tekrar deneyin.",
      searchMusic: "Müzik Ara",
      searchResults: "Arama Sonuçları",
      bulkDownload: "Toplu İndirme",
      confirmBulkDownload: "Bu işlem birden fazla şarkı indirecek. Devam etmek istiyor musunuz?",
      serviceStatus: "Servis Durumu",
      service: "İndirme Servisi",
      online: "Çevrimiçi",
      offline: "Çevrimdışı",
      serviceOffline: "İndirme servisi çalışmıyor. Python service'i başlatmak için:",
      spotifyNotConfigured: "Spotify API ayarlanmamış. Çevresel değişkenler:",
  urlDownload: "URL'den İndir",
  downloadsTitle: "İndirmeler",
  supportedFormats: "Desteklenen: Spotify şarkıları, albümleri, çalma listeleri ve YouTube videoları",
  playlistBulkInfo: "💡 Playlist/Album linkleri için toplu indirme desteklenir"
    },
    
    // Çalar
    player: {
      play: "Oynat",
      pause: "Duraklat",
      next: "Sonraki",
      previous: "Önceki",
      shuffle: "Karıştır",
      repeat: "Tekrarla",
      volume: "Ses",
      mute: "Sessiz",
      currentTime: "Mevcut Zaman",
  duration: "Süre",
  emptyTitle: "Bir şarkı seçin",
  emptySubtitle: "Kütüphaneden bir şarkı seç ve çalmaya başla"
    },
    
    // Ayarlar
    settings: {
      title: "Ayarlar",
      language: "Dil",
      spotify: "Spotify API Ayarları",
      clientId: "Client ID",
      clientSecret: "Client Secret",
      testConnection: "Bağlantıyı Test Et",
      testing: "Test Ediliyor...",
      connectionSuccess: "Bağlantı başarılı",
      connectionError: "Bağlantı hatası",
      saveSettings: "Ayarları Kaydet",
      saving: "Kaydediliyor...",
      settingsSaved: "Ayarlar kaydedildi",
      settingsError: "Ayarlar kaydedilemedi",
      appInfo: "Uygulama Bilgileri",
      version: "Sürüm",
      technology: "Teknolojiler",
      features: "Öne Çıkanlar",
      spotifyInstructions: "Spotify API anahtarları nasıl alınır?",
      spotifyStep1: "Spotify Developer Dashboard'a gidin",
      spotifyStep2: "Yeni bir uygulama oluşturun",
      spotifyStep3: "Uygulama ayarlarını açın",
      spotifyStep4: "Client ID ve Client Secret değerlerini kopyalayın"
    },
    
    // Mesajlar
    messages: {
      confirmDelete: "Bu öğeyi silmek istediğinizden emin misiniz?",
      deleteSuccess: "Başarıyla silindi",
      deleteError: "Silme hatası",
      saveSuccess: "Başarıyla kaydedildi",
      saveError: "Kaydetme hatası",
      networkError: "Ağ bağlantı hatası",
      unknownError: "Bilinmeyen hata oluştu"
    }
  },
  
  en: {
    // General
    appName: "Erotify",
    loading: "Loading...",
  welcomeTitle: "Welcome!",
  welcomeSubtitle: "Explore your music library.",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    back: "Back",
    next: "Next",
    previous: "Previous",
    close: "Close",
    ok: "OK",
    yes: "Yes",
    no: "No",
    
    // Navigation
    nav: {
      home: "Home",
      search: "Search",
      library: "Your Library",
      createPlaylist: "Create Playlist",
      favorites: "Liked Songs",
      upload: "Upload File",
      download: "Download Music",
      settings: "Settings"
    },
    
    // Music Library
    library: {
      title: "TITLE",
      noSongs: "No songs yet",
      noSongsDesc: "Start by uploading or downloading songs",
      duration: "Duration",
      album: "ALBUM",
      artist: "Artist",
      songTitle: "Title",
      unknown: "Unknown",
      songCount: "songs",
      playAll: "Play All",
      dateAdded: "DATE ADDED",
      playlist: "PLAYLIST",
      songs: "songs"
    },
    
    // Favorites
    favorites: {
      title: "Liked Songs",
      noFavorites: "No favorite songs yet",
      noFavoritesDesc: "Like songs you love to add them here",
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
      playlist: "PLAYLIST",
      songs: "songs",
      album: "Album", 
      unknownAlbum: "Unknown Album"
    },
    
    // Playlists
    playlists: {
      title: "Playlists",
      create: "Create Playlist",
      name: "Playlist Name",
      description: "Description",
      addSong: "Add Song",
      removeSong: "Remove Song",
      deletePlaylist: "Delete Playlist",
      editPlaylist: "Edit Playlist",
      addToPlaylist: "Add to Playlist",
      noPlaylists: "No playlists yet",
      createFirst: "Create your first playlist"
    },
    
    // Upload
    upload: {
      title: "Upload Files",
      description: "Drag and drop your music files",
      selectFiles: "Select Files",
      uploadButton: "Upload",
      uploading: "Uploading...",
      success: "Successfully uploaded",
      error: "Upload error",
      dragHere: "Drag files here",
      uploadedFiles: "Uploaded Files",
      invalidFormat: "Please select only audio files (.mp3, .wav, .ogg, .flac, .m4a, .aac)",
      errorText: "Error",
      browseClick: "click to browse",
      supportedFormats: "Supported formats: MP3, WAV, OGG, FLAC, M4A, AAC",
      clearCompleted: "Clear Completed",
      tipsTitle: "💡 Tips:",
      tips: {
        quality: "Use high bit rate files for best quality",
        metadata: "File names and metadata (artist, album) are read automatically",
        multiple: "You can upload multiple files at once",
        maxSize: "Maximum file size: 50MB"
      }
    },
    
    // Music Download
    download: {
      title: "Download Music",
      subtitle: "Download music from Spotify and YouTube",
      placeholder: "Enter Spotify URL",
      downloadButton: "Download",
      downloading: "Downloading...",
      success: "Successfully downloaded",
      error: "Download error",
      invalidUrl: "Invalid URL",
      spotifyUrl: "Spotify URL required",
      searchFailed: "Search failed. Please try again.",
      invalidUrlAlert: "Please enter a valid Spotify or YouTube URL.",
      playlistConfirm: "This is a playlist/album link. Do you want to download all songs?\\n\\nThis process may take a long time and will download multiple songs.",
      downloadStartFailed: "Failed to start download. Please try again.",
      searchMusic: "Search Music",
      searchResults: "Search Results",
      bulkDownload: "Bulk Download",
      confirmBulkDownload: "This process will download multiple songs. Do you want to continue?",
      serviceStatus: "Service Status",
      service: "Download Service",
      online: "Online",
      offline: "Offline",
      serviceOffline: "Download service is not running. To start Python service:",
      spotifyNotConfigured: "Spotify API not configured. Environment variables:",
      urlDownload: "Download from URL",
      downloadsTitle: "Downloads",
      supportedFormats: "Supported: Spotify tracks, albums, playlists and YouTube videos",
      playlistBulkInfo: "💡 Bulk download is supported for playlist/album links"
    },
    
    // Player
    player: {
      play: "Play",
      pause: "Pause",
      next: "Next",
      previous: "Previous",
      shuffle: "Shuffle",
      repeat: "Repeat",
      volume: "Volume",
      mute: "Mute",
      currentTime: "Current Time",
  duration: "Duration",
  emptyTitle: "Select a song",
  emptySubtitle: "Pick something from your library to start playing"
    },
    
    // Settings
    settings: {
      title: "Settings",
      language: "Language",
      spotify: "Spotify API Settings",
      clientId: "Client ID",
      clientSecret: "Client Secret",
      testConnection: "Test Connection",
      testing: "Testing...",
      connectionSuccess: "Connection successful",
      connectionError: "Connection error",
      saveSettings: "Save Settings",
      saving: "Saving...",
      settingsSaved: "Settings saved",
      settingsError: "Failed to save settings",
      appInfo: "App Information",
      version: "Version",
      technology: "Technology",
      features: "Features",
      spotifyInstructions: "How to get Spotify API credentials?",
      spotifyStep1: "Go to Spotify Developer Dashboard",
      spotifyStep2: "Create a new application",
      spotifyStep3: "Open application settings",
      spotifyStep4: "Copy Client ID and Client Secret values"
    },
    
    // Messages
    messages: {
      confirmDelete: "Are you sure you want to delete this item?",
      deleteSuccess: "Successfully deleted",
      deleteError: "Delete error",
      saveSuccess: "Successfully saved",
      saveError: "Save error",
      networkError: "Network connection error",
      unknownError: "Unknown error occurred"
    }
  },
  
  zh: {
    // 通用
    appName: "Erotify",
    loading: "加载中...",
  welcomeTitle: "欢迎！",
  welcomeSubtitle: "探索你的音乐库。",
    save: "保存",
    cancel: "取消",
    delete: "删除",
    edit: "编辑",
    add: "添加",
    search: "搜索",
    back: "返回",
    next: "下一个",
    previous: "上一个",
    close: "关闭",
    ok: "确定",
    yes: "是",
    no: "否",
    
    // 导航
    nav: {
      home: "主页",
      search: "搜索",
      library: "您的音乐库",
      createPlaylist: "创建播放列表",
      favorites: "喜欢的歌曲",
      upload: "上传文件",
      download: "下载音乐",
      settings: "设置"
    },
    
    // 音乐库
    library: {
      title: "标题",
      noSongs: "还没有歌曲",
      noSongsDesc: "通过上传或下载歌曲开始",
      duration: "时长",
      album: "专辑",
      artist: "艺术家",
      songTitle: "标题",
      unknown: "未知",
      songCount: "首歌曲",
      playAll: "播放全部",
      dateAdded: "添加日期",
      playlist: "播放列表",
      songs: "首歌曲"
    },
    
    // 收藏
    favorites: {
      title: "喜欢的歌曲",
      noFavorites: "还没有收藏的歌曲",
      noFavoritesDesc: "点赞您喜欢的歌曲来添加到这里",
      addToFavorites: "添加到收藏",
      removeFromFavorites: "从收藏中移除",
      playlist: "播放列表",
      songs: "首歌曲",
      album: "专辑",
      unknownAlbum: "未知专辑"
    },
    
    // 播放列表
    playlists: {
      title: "播放列表",
      create: "创建播放列表",
      name: "播放列表名称",
      description: "描述",
      addSong: "添加歌曲",
      removeSong: "移除歌曲",
      deletePlaylist: "删除播放列表",
      editPlaylist: "编辑播放列表",
      addToPlaylist: "添加到播放列表",
      noPlaylists: "还没有播放列表",
      createFirst: "创建您的第一个播放列表"
    },
    
    // 上传
    upload: {
      title: "上传文件",
      description: "拖放您的音乐文件",
      selectFiles: "选择文件",
      uploadButton: "上传",
      uploading: "上传中...",
      success: "上传成功",
      error: "上传错误",
      dragHere: "拖放文件到这里",
      uploadedFiles: "已上传文件",
      invalidFormat: "请只选择音频文件 (.mp3, .wav, .ogg, .flac, .m4a, .aac)",
      errorText: "错误",
      browseClick: "点击浏览",
      supportedFormats: "支持的格式：MP3, WAV, OGG, FLAC, M4A, AAC",
      clearCompleted: "清除已完成",
      tipsTitle: "💡 提示：",
      tips: {
        quality: "使用高比特率文件以获得最佳质量",
        metadata: "文件名和元数据（艺术家，专辑）会自动读取",
        multiple: "您可以同时上传多个文件",
        maxSize: "最大文件大小：50MB"
      }
    },
    
    // 音乐下载
    download: {
      title: "下载音乐",
      subtitle: "从 Spotify 和 YouTube 下载音乐",
      placeholder: "输入 Spotify URL",
      downloadButton: "下载",
      downloading: "下载中...",
      success: "下载成功",
      error: "下载错误",
      invalidUrl: "无效 URL",
      spotifyUrl: "需要 Spotify URL",
      searchFailed: "搜索失败。请重试。",
      invalidUrlAlert: "请输入有效的 Spotify 或 YouTube URL。",
      playlistConfirm: "这是播放列表/专辑链接。您想下载所有歌曲吗？\\n\\n此过程可能需要很长时间并将下载多首歌曲。",
      downloadStartFailed: "启动下载失败。请重试。",
      searchMusic: "搜索音乐",
      searchResults: "搜索结果",
      bulkDownload: "批量下载",
      confirmBulkDownload: "这将下载多首歌曲。您想继续吗？",
      serviceStatus: "服务状态",
      service: "下载服务",
      online: "在线",
      offline: "离线",
      serviceOffline: "下载服务未运行。启动 Python 服务:",
      spotifyNotConfigured: "Spotify API 未配置。环境变量:",
      urlDownload: "从 URL 下载",
      downloadsTitle: "下载",
      supportedFormats: "支持：Spotify 歌曲、专辑、播放列表和 YouTube 视频",
      playlistBulkInfo: "💡 支持播放列表/专辑链接的批量下载"
    },
    
    // 播放器
    player: {
      play: "播放",
      pause: "暂停",
      next: "下一首",
      previous: "上一首",
      shuffle: "随机播放",
      repeat: "重复播放",
      volume: "音量",
      mute: "静音",
      currentTime: "当前时间",
  duration: "时长",
  emptyTitle: "选择一首歌曲",
  emptySubtitle: "从音乐库选择一首歌开始播放"
    },
    
    // 设置
    settings: {
      title: "设置",
      language: "语言",
      spotify: "Spotify API 设置",
      clientId: "客户端 ID",
      clientSecret: "客户端密钥",
      testConnection: "测试连接",
      testing: "测试中...",
      connectionSuccess: "连接成功",
      connectionError: "连接错误",
      saveSettings: "保存设置",
      saving: "保存中...",
      settingsSaved: "设置已保存",
      settingsError: "保存设置失败",
      appInfo: "应用信息",
      version: "版本",
      technology: "技术",
      features: "功能",
      spotifyInstructions: "如何获取 Spotify API 凭据？",
      spotifyStep1: "访问 Spotify 开发者仪表板",
      spotifyStep2: "创建新应用程序",
      spotifyStep3: "打开应用程序设置",
      spotifyStep4: "复制客户端 ID 和客户端密钥值"
    },
    
    // 消息
    messages: {
      confirmDelete: "您确定要删除此项目吗？",
      deleteSuccess: "删除成功",
      deleteError: "删除失败",
      saveSuccess: "保存成功",
      saveError: "保存失败",
      networkError: "网络连接错误",
      unknownError: "发生未知错误"
    }
  }
};

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations.tr;
