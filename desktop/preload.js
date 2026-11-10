/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Secure Electron Preload for Windows
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isWindowsApp: true,
  platform: process.platform,
  onRefreshNews: (callback) => ipcRenderer.on('refresh-news', callback)
});
