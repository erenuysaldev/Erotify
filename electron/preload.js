const { contextBridge, ipcRenderer } = require('electron');

// Electron API'sini renderer process'e güvenli şekilde expose et
contextBridge.exposeInMainWorld('electronAPI', {
  // App bilgileri
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: (name) => ipcRenderer.invoke('get-app-path', name),
  
  // Navigation
  onNavigateTo: (callback) => {
    ipcRenderer.on('navigate-to', (event, view) => callback(view));
  },
  
  // Player controls
  onPlayerAction: (callback) => {
    ipcRenderer.on('player-action', (event, action) => callback(action));
  },
  
  // IPC cleanup
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

// Development için console.log'ları ana process'e gönder
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('DOMContentLoaded', () => {
    console.log('Electron preload script loaded');
  });
}
