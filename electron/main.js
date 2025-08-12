const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

// Server'ı başlat
function startServer() {
  if (isDev) {
    return; // Development'ta ayrı çalışıyor
  }
  
  const serverPath = path.join(__dirname, '../server/dist/index.js');
  serverProcess = spawn('node', [serverPath], {
    stdio: 'inherit',
    env: { ...process.env, PORT: 3001 }
  });
  
  serverProcess.on('error', (err) => {
    console.error('Server start error:', err);
  });
}

// Server'ı durdur
function stopServer() {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
}

function createWindow() {
  // Ana pencereyi oluştur
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false // Lokal dosyalar için gerekli
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    titleBarStyle: 'default',
    show: false // Yükleme bitince göster
  });

  // URL'yi yükle
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../client/build/index.html')}`;
    
  mainWindow.loadURL(startUrl);

  // Pencere hazır olunca göster
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Development'ta DevTools'u aç
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // External linkler browser'da açılsın
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Pencere kapanınca
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Uygulama menüsü
function createMenu() {
  const template = [
    {
      label: 'Dosya',
      submenu: [
        {
          label: 'Müzik Yükle',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow.webContents.send('navigate-to', 'upload');
          }
        },
        { type: 'separator' },
        {
          label: isDev ? 'Çıkış' : 'Çıkış',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Görünüm',
      submenu: [
        {
          label: 'Kütüphane',
          accelerator: 'CmdOrCtrl+1',
          click: () => {
            mainWindow.webContents.send('navigate-to', 'library');
          }
        },
        {
          label: 'Playlistler',
          accelerator: 'CmdOrCtrl+2',
          click: () => {
            mainWindow.webContents.send('navigate-to', 'playlists');
          }
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Çalar',
      submenu: [
        {
          label: 'Çal/Duraklat',
          accelerator: 'Space',
          click: () => {
            mainWindow.webContents.send('player-action', 'toggle');
          }
        },
        {
          label: 'Sonraki',
          accelerator: 'CmdOrCtrl+Right',
          click: () => {
            mainWindow.webContents.send('player-action', 'next');
          }
        },
        {
          label: 'Önceki',
          accelerator: 'CmdOrCtrl+Left',
          click: () => {
            mainWindow.webContents.send('player-action', 'previous');
          }
        },
        { type: 'separator' },
        {
          label: 'Karıştır',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('player-action', 'shuffle');
          }
        },
        {
          label: 'Tekrar',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.webContents.send('player-action', 'repeat');
          }
        }
      ]
    },
    {
      label: 'Yardım',
      submenu: [
        {
          label: 'Hakkında',
          click: () => {
            shell.openExternal('https://github.com/yourusername/erotify');
          }
        },
        {
          label: 'GitHub',
          click: () => {
            shell.openExternal('https://github.com/yourusername/erotify');
          }
        }
      ]
    }
  ];

  // macOS için özel ayarlar
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Uygulama hazır
app.whenReady().then(() => {
  createWindow();
  createMenu();
  
  if (!isDev) {
    startServer();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Tüm pencereler kapandığında
app.on('window-all-closed', () => {
  stopServer();
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Uygulama kapanırken
app.on('before-quit', () => {
  stopServer();
});

// IPC handlers
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-app-path', (event, name) => {
  return app.getPath(name);
});

// Global shortcuts
app.on('ready', () => {
  // Media keys desteği
  const { globalShortcut } = require('electron');
  
  globalShortcut.register('MediaPlayPause', () => {
    if (mainWindow) {
      mainWindow.webContents.send('player-action', 'toggle');
    }
  });
  
  globalShortcut.register('MediaNextTrack', () => {
    if (mainWindow) {
      mainWindow.webContents.send('player-action', 'next');
    }
  });
  
  globalShortcut.register('MediaPreviousTrack', () => {
    if (mainWindow) {
      mainWindow.webContents.send('player-action', 'previous');
    }
  });
});

app.on('will-quit', () => {
  // Global shortcuts'u temizle
  const { globalShortcut } = require('electron');
  globalShortcut.unregisterAll();
});
