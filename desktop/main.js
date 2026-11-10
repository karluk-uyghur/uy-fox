/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * UyFox News - Windows Desktop Native Application (Electron Main Process)
 * پۈتۈنلەي ئۇيغۇرچە Windows ئۈستەلئۈستى پىروگراممىسى
 */

const { app, BrowserWindow, Menu, Tray, ipcMain, shell } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    title: 'UyFox news - Windows ئۈستەلئۈستى نۇسخىسى',
    icon: path.join(__dirname, 'assets/logo_wolf.jpg'),
    backgroundColor: '#070b14',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#0b1120',
      symbolColor: '#f59e0b',
      height: 38
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  // Always load offline standalone app directly
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Handle external links securely
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Windows System Tray Integration
function createTray() {
  const iconPath = path.join(__dirname, 'assets/logo_wolf.jpg');
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    { label: 'UyFox news نى كۆرسىتىش', click: () => mainWindow && mainWindow.show() },
    { label: 'خەۋەرلەرنى يېڭىلاش', click: () => mainWindow && mainWindow.webContents.send('refresh-news') },
    { type: 'separator' },
    { label: 'پىروگراممىدىن چىقىش', click: () => app.quit() }
  ]);

  tray.setToolTip('UyFox news - نوپوزلۇق خەۋەرلەر ۋە سىياسىي تەھلىل');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
