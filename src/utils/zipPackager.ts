/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Packages all Chrome Extension files and Windows Desktop files into downloadable archives
 */

import JSZip from 'jszip';
import {
  MANIFEST_CONTENT,
  POPUP_HTML_CONTENT,
  POPUP_CSS_CONTENT,
  POPUP_JS_CONTENT,
  BACKGROUND_JS_CONTENT,
  README_CONTENT
} from '../data/extensionFiles';

/**
 * Triggers instant browser download of a blob
 */
function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Downloads the complete enterprise Chrome Extension package (.zip)
 * Tries direct pre-built package first, falls back to dynamic client-side generation
 */
export async function downloadExtensionZipPackage(prdMarkdown: string, specMarkdown: string): Promise<void> {
  try {
    const res = await fetch('/uyfox-news-chrome-extension.zip');
    if (res.ok) {
      const blob = await res.blob();
      triggerBrowserDownload(blob, 'uyfox-news-chrome-extension.zip');
      return;
    }
  } catch (e) {
    console.info('Direct extension zip fetch failed, building in-memory:', e);
  }

  // Fallback: build in-memory
  const zip = new JSZip();
  const extFolder = zip.folder('uyfox-news-chrome-extension');
  if (!extFolder) return;

  extFolder.file('manifest.json', MANIFEST_CONTENT);
  extFolder.file('popup.html', POPUP_HTML_CONTENT);
  extFolder.file('popup.css', POPUP_CSS_CONTENT);
  extFolder.file('popup.js', POPUP_JS_CONTENT);
  extFolder.file('background.js', BACKGROUND_JS_CONTENT);
  extFolder.file('README.md', README_CONTENT);
  extFolder.file('PRD.md', prdMarkdown);
  extFolder.file('SPEC.md', specMarkdown);

  // Bundle image assets
  const assetsFolder = extFolder.folder('assets');
  if (assetsFolder) {
    for (const name of ['logo_wolf.jpg', 'bg_karluk.jpg', 'logo_emblem.jpg']) {
      try {
        const r = await fetch(`/assets/${name}`);
        if (r.ok) {
          const buf = await r.arrayBuffer();
          assetsFolder.file(name, buf, { binary: true });
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  triggerBrowserDownload(content, 'uyfox-news-chrome-extension.zip');
}

/**
 * Downloads the Windows Desktop App (.exe & Electron / Standalone HTML5) package
 */
export async function downloadWindowsDesktopZipPackage(): Promise<void> {
  try {
    const res = await fetch('/uyfox-news-windows-setup.zip');
    if (res.ok) {
      const blob = await res.blob();
      triggerBrowserDownload(blob, 'uyfox-news-windows-setup.zip');
      return;
    }
  } catch (e) {
    console.info('Direct windows zip fetch failed, building in-memory:', e);
  }

  // Fallback: build in-memory
  const zip = new JSZip();
  const winFolder = zip.folder('uyfox-news-windows-desktop');
  if (!winFolder) return;

  const electronMain = `const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    title: 'UyFox news - Windows ئۈستەلئۈستى نۇسخىسى',
    icon: path.join(__dirname, 'assets/logo_wolf.jpg'),
    backgroundColor: '#070b14',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
`;

  const packageJson = JSON.stringify({
    name: "uyfox-news-windows",
    version: "1.0.0",
    description: "UyFox News - Windows Desktop Native App",
    main: "main.js",
    scripts: {
      "start": "electron .",
      "pack:win": "electron-builder --win nsis portable"
    }
  }, null, 2);

  const batLauncher = `@echo off
start "" "%~dp0index.html"
`;

  winFolder.file('main.js', electronMain);
  winFolder.file('package.json', packageJson);
  winFolder.file('run-app.bat', batLauncher);
  winFolder.file('README_WINDOWS.md', `# UyFox News - Windows ئۈستەلئۈستى نۇسخىسى\n1. run-app.bat نى قوش چېكىپ تۈز بىۋاسىتە ئېچىش.\n2. ياكى npm install && npm start ئارقىلىق Electron دە قوزغىتىش.`);

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  triggerBrowserDownload(content, 'uyfox-news-windows-setup.zip');
}
