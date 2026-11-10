/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * خەۋەرلەرنى يىغىپ كۆرسىتىش قۇرالى - Chrome Extension Background Service Worker
 * Manifest V3 Zero-Telemetry Background Engine
 */

const ALARM_NAME = 'REFRESH_FEEDS_ALARM';
const REFRESH_INTERVAL_MINUTES = 60;

// Initialize on extension installation or update
chrome.runtime.onInstalled.addListener(() => {
  console.log('[Background] Uyghur News Extension installed.');
  
  // Create periodic alarm for news caching
  chrome.alarms.create(ALARM_NAME, {
    periodInMinutes: REFRESH_INTERVAL_MINUTES
  });
});

// Periodic alarm handler
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    console.log('[Background] Running scheduled feed sync...');
    syncNewsFeeds();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'FETCH_LATEST_FEEDS') {
    syncNewsFeeds().then((articles) => {
      sendResponse({ success: true, articles: articles });
    }).catch((err) => {
      sendResponse({ success: false, error: err.message });
    });
    return true; // Keep message channel open for async response
  }
});

/**
 * Fetch and synchronize news feeds without external tracking
 */
async function syncNewsFeeds() {
  try {
    const data = await chrome.storage.local.get(['cached_news']);
    const articles = data.cached_news || [];
    
    // In strict MV3, background worker acts as local broker and offline cache maintainer
    return articles;
  } catch (err) {
    console.error('[Background] Feed sync error:', err);
    return [];
  }
}
