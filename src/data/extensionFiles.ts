/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Raw Extension Files for In-Browser Explorer and One-Click ZIP Downloader
 */

export interface ExtensionFileItem {
  name: string;
  path: string;
  language: string;
  description: string;
  content: string;
}

export const MANIFEST_CONTENT = `{
  "manifest_version": 3,
  "name": "UyFox news",
  "version": "1.0.0",
  "description": "Foreign Policy، Foreign Affairs قاتارلىق نوپوزلۇق مەنبەلەردىن دۇنيا ۋە سىياسىي خەۋەرلەرنى يىغىپ، ئۇيغۇرچە تەرجىمە قىلىپ كۆرسىتىش قۇرالى.",
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    },
    "default_title": "UyFox news"
  },
  "background": {
    "service_worker": "background.js"
  },
  "permissions": [
    "storage",
    "alarms"
  ],
  "host_permissions": [
    "https://foreignpolicy.com/*",
    "https://www.foreignaffairs.com/*",
    "https://thediplomat.com/*",
    "https://feeds.reuters.com/*"
  ],
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self';"
  }
}`;

export const POPUP_HTML_CONTENT = `<!DOCTYPE html>
<html lang="ug" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UyFox news</title>
  <link rel="stylesheet" href="popup.css">
</head>
<body data-theme="dark" data-font-size="normal">
  <div class="app-container">
    <!-- Top Header -->
    <header class="app-header">
      <div class="header-top">
        <div class="brand-wrapper">
          <div class="brand-icon" title="UyFox news - شەرقىي تۈركىستان & دۇنيا">
            <img src="assets/logo_wolf.jpg" alt="UyFox News Logo" class="brand-logo-img" onerror="this.src='assets/logo_emblem.jpg';">
            <span class="brand-fallback-icon" style="display:none;">🦊</span>
          </div>
          <div class="brand-info">
            <span class="brand-title">UyFox news</span>
            <span class="brand-subtitle">شەرقىي تۈركىستان & دۇنيا</span>
          </div>
        </div>

        <div class="header-actions">
          <button id="fontSizeBtn" class="action-btn" title="خەت چوڭلۇقى">
            <span>A±</span>
          </button>
          <button id="themeToggleBtn" class="action-btn" title="نۇر ھالىتى">
            <span id="themeIcon">🌙</span>
          </button>
          <button id="langToggleBtn" class="action-btn active" title="تىل ئالماشتۇرۇش">
            <span id="langLabel">ئۇيغۇرچە</span>
          </button>
          <button id="refreshBtn" class="action-btn" title="يېڭىلاش">
            <span>↻</span>
          </button>
        </div>
      </div>

      <!-- Instant Search -->
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input type="text" id="searchInput" class="search-input" placeholder="خەۋەرلەر ئىچىدىن ئىزدەش..." autocomplete="off">
      </div>

      <!-- Source Channels Tabs -->
      <div class="tabs-scroll" id="sourceTabs">
        <button class="tab-btn active" data-source="all">بارلىق مەنبەلەر</button>
        <button class="tab-btn" data-source="Foreign Policy">Foreign Policy</button>
        <button class="tab-btn" data-source="Foreign Affairs">Foreign Affairs</button>
        <button class="tab-btn" data-source="The Diplomat">The Diplomat</button>
        <button class="tab-btn" data-source="Reuters">Reuters</button>
        <button class="tab-btn" data-source="bookmarks">★ ساقلانغانلار</button>
      </div>

      <!-- Categories Filter Tabs (گېئوپولىتىكا, ئىقتىساد, كىشىلىك ھوقۇق, تېخنىكا, دىپلوماتىيە) -->
      <div class="tabs-scroll category-bar" id="categoryTabs" style="margin-top: 5px; padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.08);">
        <button class="cat-pill active" data-category="all">ھەممە تۈرلەر</button>
        <button class="cat-pill" data-category="geopolitics">گېئوپولىتىكا</button>
        <button class="cat-pill" data-category="economy">ئىقتىساد</button>
        <button class="cat-pill" data-category="human_rights">كىشىلىك ھوقۇق</button>
        <button class="cat-pill" data-category="technology">تېخنىكا & AI</button>
        <button class="cat-pill" data-category="diplomacy">دىپلوماتىيە</button>
      </div>
    </header>

    <!-- Main Content List -->
    <main class="content-area" id="contentArea">
      <div class="news-list" id="newsList">
        <!-- Rendered dynamically by popup.js -->
      </div>
      
      <div class="state-container" id="stateContainer" style="display: none;">
        <div class="loading-spinner" id="spinner"></div>
        <p id="stateMessage">خەۋەرلەر يۈكلىنىۋاتىدۇ...</p>
      </div>
    </main>

    <!-- Deep Reader Modal -->
    <div class="reader-modal" id="readerModal">
      <div class="modal-header">
        <div class="modal-title-bar">
          <button id="closeModalBtn" class="back-btn">
            <span>← كەينىگە</span>
          </button>
          <span id="modalSourceBadge" class="source-name">Foreign Policy</span>
        </div>
        <div class="header-actions">
          <button id="modalShareBtn" class="action-btn" title="ھەمبەھىرلەش (Web Share API)">
            <span id="modalShareIcon">📤 ھەمبەھىرلەش</span>
          </button>
          <button id="readerSettingsToggleBtn" class="action-btn" title="ئوقۇش خەت ۋە قۇر تەڭشىكى">
            <span>Aa</span>
          </button>
          <button id="modalBookmarkBtn" class="icon-btn" title="ساقلاش">
            <span id="modalBookmarkIcon">☆</span>
          </button>
          <button id="modalCopyBtn" class="action-btn" title="تېكىستنى كۆچۈرۈش">
            <span>كۆچۈرۈش</span>
          </button>
        </div>
      </div>

      <!-- Typography Sliders Bar for Reader Mode -->
      <div class="reader-typography-bar" id="readerTypographyBar">
        <div class="slider-group">
          <div class="slider-label-row">
            <span class="slider-label">خەت چوڭلۇقى</span>
            <span class="slider-value" id="fontSizeVal">14px</span>
          </div>
          <input type="range" id="fontSizeSlider" class="range-slider" min="12" max="22" step="1" value="14">
        </div>

        <div class="slider-group">
          <div class="slider-label-row">
            <span class="slider-label">سىزىق ئارىلىقى</span>
            <span class="slider-value" id="lineHeightVal">1.8x</span>
          </div>
          <input type="range" id="lineHeightSlider" class="range-slider" min="1.4" max="2.6" step="0.1" value="1.8">
        </div>

        <!-- Font Family Switcher -->
        <div class="slider-group">
          <div class="slider-label-row">
            <span class="slider-label">خەت نۇسخىسى (Font Family)</span>
          </div>
          <div class="font-switcher-group" id="fontSwitcherGroup">
            <button class="font-btn active" data-font="tuz" type="button">UKIJ Tuz</button>
            <button class="font-btn" data-font="alkatip" type="button">ALKATIP Basma</button>
            <button class="font-btn" data-font="sans" type="button">سۈكۈتتىكى (Sans)</button>
          </div>
        </div>
      </div>

      <div class="modal-body" id="modalBody">
        <div class="modal-meta-row">
          <span id="modalPubDate">تۈنۈگۈن</span>
          <span id="modalReadTime">4 مىنۇت تەھلىل</span>
        </div>
        
        <h2 id="modalHeadline" class="modal-headline">خەۋەر ماۋزۇسى</h2>

        <div class="highlights-box" id="modalHighlightsBox">
          <div class="highlights-title">
            <span>⚡ يادرولۇق ئىستراتېگىيەلىك نۇقتىلار:</span>
          </div>
          <div id="modalHighlightsList"></div>
        </div>

        <div id="modalContentParagraphs"></div>

        <div class="modal-actions">
          <a href="#" target="_blank" rel="noopener noreferrer" id="modalSourceLink" class="btn-primary">
            <span>ئەسلى مەنبەدە ئوقۇش ↗</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Bottom Footer (Zero Telemetry Guarantee) -->
    <footer class="app-footer">
      <div class="privacy-badge">
        <span>🛡️ نۆل ئىز قوغلاش · %100 يەرلىك كاش</span>
      </div>
      <span id="articleCountLabel">0 خەۋەر</span>
    </footer>
  </div>

  <script src="popup.js"></script>
</body>
</html>`;

export const POPUP_CSS_CONTENT = `/* ==========================================================================
   خەۋەرلەرنى يىغىپ كۆرسىتىش قۇرالى - Enterprise Chrome Extension Stylesheet
   Design Standard: Awwwards Frosted Glass, Uyghur RTL Typography & Dark/Light
   ========================================================================== */

:root {
  --font-family-ug: 'UKIJ Tuz', 'ALKATIP Basma', 'Uyghur Pashto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, sans-serif;
  --bg-primary: #0b0f19;
  --bg-surface: rgba(22, 30, 49, 0.75);
  --bg-card: rgba(30, 41, 67, 0.65);
  --bg-card-hover: rgba(39, 53, 85, 0.85);
  --border-color: rgba(255, 255, 255, 0.08);
  --border-focus: rgba(99, 102, 241, 0.45);
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --accent-color: #6366f1;
  --accent-hover: #4f46e5;
  --accent-glow: rgba(99, 102, 241, 0.2);
  --badge-bg: rgba(99, 102, 241, 0.12);
  --badge-text: #a5b4fc;
  --success-color: #10b981;
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --font-size-base: 14px;
}

[data-theme="light"] {
  --bg-primary: #f8fafc;
  --bg-surface: rgba(255, 255, 255, 0.85);
  --bg-card: rgba(255, 255, 255, 0.9);
  --bg-card-hover: #ffffff;
  --border-color: rgba(0, 0, 0, 0.08);
  --border-focus: rgba(99, 102, 241, 0.5);
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --accent-color: #4f46e5;
  --accent-hover: #4338ca;
  --accent-glow: rgba(79, 70, 229, 0.15);
  --badge-bg: rgba(79, 70, 229, 0.08);
  --badge-text: #4338ca;
  --glass-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.06);
}

[data-font-size="large"] {
  --font-size-base: 15.5px;
}

[data-font-size="xlarge"] {
  --font-size-base: 17px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  width: 375px;
  height: 580px;
  max-height: 580px;
  overflow: hidden;
  font-family: var(--font-family-ug);
  font-size: var(--font-size-base);
  background-color: #0b0f19;
  background-image: 
    linear-gradient(180deg, rgba(11, 15, 25, 0.86) 0%, rgba(15, 23, 42, 0.90) 45%, rgba(11, 15, 25, 0.94) 100%),
    url('assets/bg_karluk.jpg');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  color: var(--text-primary);
  direction: rtl;
  user-select: none;
  -webkit-font-smoothing: antialiased;
  position: relative;
}

[data-theme="light"] body,
body[data-theme="light"] {
  background-color: #f8fafc;
  background-image: 
    linear-gradient(180deg, rgba(248, 250, 252, 0.90) 0%, rgba(241, 245, 249, 0.94) 100%),
    url('assets/bg_karluk.jpg');
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: radial-gradient(circle at 85% 10%, rgba(56, 189, 248, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 10% 90%, rgba(99, 102, 241, 0.10) 0%, transparent 45%);
}

.app-header {
  padding: 10px 14px 10px;
  background: rgba(15, 23, 42, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-color);
  z-index: 10;
}

[data-theme="light"] .app-header {
  background: rgba(255, 255, 255, 0.88);
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.brand-wrapper {
  display: flex;
  align-items: center;
  gap: 9px;
}

.brand-icon {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1e3a8a;
  border: 1.5px solid rgba(56, 189, 248, 0.5);
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.35);
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.brand-icon:hover {
  transform: scale(1.06);
}

.brand-logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.brand-fallback-icon {
  color: #fff;
  font-size: 14px;
  font-weight: bold;
}

.brand-info {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.brand-title {
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: -0.2px;
  color: var(--text-primary);
  white-space: nowrap;
}

.brand-subtitle {
  font-size: 9.5px;
  color: #38bdf8;
  font-weight: 500;
  opacity: 0.9;
  letter-spacing: 0.1px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  padding: 4px 7px;
  font-size: 11px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-family: inherit;
  transition: all 0.18s ease;
}

.action-btn:hover {
  background: var(--bg-card);
  color: var(--text-primary);
  border-color: var(--border-focus);
}

.action-btn.active {
  background: var(--accent-color);
  color: #ffffff;
  border-color: var(--accent-color);
}

.search-wrapper {
  position: relative;
  margin-bottom: 8px;
}

.search-input {
  width: 100%;
  padding: 7px 30px 7px 10px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 12px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px var(--accent-glow);
}

.search-icon {
  position: absolute;
  right: 9px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.tabs-scroll {
  display: flex;
  gap: 5px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 2px;
}

.tabs-scroll::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 11px;
  font-family: inherit;
  padding: 4px 9px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.18s ease;
}

.tab-btn:hover {
  color: var(--text-primary);
  border-color: var(--text-muted);
}

.tab-btn.active {
  background: var(--accent-color);
  color: #ffffff;
  border-color: var(--accent-color);
  font-weight: 600;
}

.cat-pill {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 10px;
  font-family: inherit;
  padding: 2.5px 8px;
  border-radius: 12px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.18s ease;
}

.cat-pill:hover {
  color: var(--text-primary);
  border-color: var(--border-focus);
}

.cat-pill.active {
  background: #f59e0b;
  color: #070b14;
  border-color: #fbbf24;
  font-weight: 700;
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.35);
}

.category-tag {
  font-size: 9.5px;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
  font-weight: 600;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 10px 12px;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.news-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 12px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.news-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-focus);
  transform: translateY(-1px);
  box-shadow: var(--glass-shadow);
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 11px;
}

.source-name {
  color: var(--badge-text);
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  letter-spacing: 0.2px;
}

.pub-time {
  color: var(--text-muted);
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--text-primary);
  margin-bottom: 7px;
  direction: rtl;
  text-align: right;
}

.card-summary {
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--text-secondary);
  direction: rtl;
  text-align: justify;
  text-justify: inter-word;
  text-indent: 1.5em;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border-color);
  padding-top: 7px;
  margin-top: 4px;
  font-size: 11px;
}

.read-btn {
  color: var(--accent-color);
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.read-btn:hover {
  text-decoration: underline;
}

.card-actions-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 3px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: color 0.15s;
}

.icon-btn:hover {
  color: var(--text-primary);
}

.icon-btn.bookmarked {
  color: #f59e0b;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  text-align: center;
  color: var(--text-muted);
  gap: 10px;
}

.loading-spinner {
  width: 26px;
  height: 26px;
  border: 2px solid var(--border-color);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.reader-modal {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-primary);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 50;
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.reader-modal.open {
  transform: translateX(0);
}

.modal-header {
  padding: 12px 14px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: var(--radius-sm);
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.back-btn:hover {
  background: var(--bg-card);
}

.reader-typography-bar {
  padding: 8px 14px 10px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.2s ease;
}

.reader-typography-bar.collapsed {
  display: none;
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.slider-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
}

.slider-label {
  color: var(--text-secondary);
  font-size: 11px;
}

.slider-value {
  color: var(--accent-color);
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace;
  font-size: 11px;
  direction: ltr;
}

.range-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.12);
  outline: none;
  cursor: pointer;
  direction: ltr;
}

[data-theme="light"] .range-slider {
  background: rgba(0, 0, 0, 0.1);
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent-color);
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(99, 102, 241, 0.4);
  transition: transform 0.12s ease;
}

.range-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.range-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent-color);
  border: none;
  cursor: pointer;
}

.font-switcher-group {
  display: flex;
  gap: 4px;
  background: rgba(0, 0, 0, 0.2);
  padding: 3px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
}

[data-theme="light"] .font-switcher-group {
  background: rgba(0, 0, 0, 0.04);
}

.font-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 10.5px;
  font-family: inherit;
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.16s ease;
  text-align: center;
}

.font-btn:hover {
  color: var(--text-primary);
}

.font-btn.active {
  background: var(--accent-color);
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(99, 102, 241, 0.3);
}

.font-btn[data-font="tuz"] {
  font-family: 'UKIJ Tuz', var(--font-family-ug);
}

.font-btn[data-font="alkatip"] {
  font-family: 'ALKATIP Basma', var(--font-family-ug);
}

.font-btn[data-font="sans"] {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, sans-serif;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 14px;
  direction: rtl;
}

.modal-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 11.5px;
  color: var(--text-muted);
}

.modal-headline {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  color: var(--text-primary);
  margin-bottom: 12px;
  text-align: right;
}

.highlights-box {
  background: var(--bg-card);
  border: 1px solid var(--border-focus);
  border-radius: var(--radius-md);
  padding: 12px;
  margin-bottom: 16px;
}

.highlights-title {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--accent-color);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.highlight-item {
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--text-primary);
  margin-bottom: 5px;
  position: relative;
  padding-right: 14px;
  text-align: justify;
}

.highlight-item::before {
  content: '•';
  position: absolute;
  right: 0;
  color: var(--accent-color);
  font-weight: bold;
}

.modal-paragraph {
  font-size: 13.5px;
  line-height: 1.85;
  color: var(--text-secondary);
  text-align: justify;
  text-justify: inter-word;
  text-indent: 1.8em;
  margin-bottom: 12px;
}

.modal-actions {
  display: flex;
  gap: 8px;
  margin-top: 18px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.btn-primary {
  flex: 1;
  background: var(--accent-color);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-decoration: none;
}

.btn-primary:hover {
  background: var(--accent-hover);
}

.app-footer {
  padding: 6px 14px;
  background: var(--bg-surface);
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10px;
  color: var(--text-muted);
}

.privacy-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--success-color);
}`;

export const POPUP_JS_CONTENT = `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * خەۋەرلەرنى يىغىپ كۆرسىتىش قۇرالى - Enterprise Chrome Extension Controller
 * Zero-Telemetry, Manifest V3, Local-First Uyghur News Aggregator & Translator
 */

(function () {
  'use strict';

  function sanitizeUyghurText(text) {
    if (!text || typeof text !== 'string') return '';
    return text
      .replace(/جۇڭگو/g, 'خىتاي')
      .replace(/شىنجاڭ/g, 'شەرقىي تۈركىستان')
      .replace(/خەنزۇ/g, 'خىتاي')
      .replace(/شىنلاڭ/g, 'خىتاي سىنا')
      .replace(/Xinjiang/gi, 'شەرقىي تۈركىستان')
      .replace(/PRC/g, 'خىتاي خەلق جۇمھۇرىيىتى');
  }

  const DEFAULT_ARTICLES = [
    {
      id: "fa-2026-001",
      source: "Foreign Affairs",
      category: "geopolitics",
      category_ug: "گېئوپولىتىكا",
      title_en: "The New Architecture of Indo-Pacific Security and Alliances",
      title_ug: "ھىندى-تىنچ ئوكيان بىخەتەرلىكى ۋە ئىتتىپاقداشلىق مۇناسىۋەتلىرىنىڭ يېڭى قۇرۇلمىسى",
      summary_en: "How emerging technological partnerships and regional realignments are redrawing defensive deterrence across the Asian maritime theater.",
      summary_ug: "يېڭىدىن باش كۆتۈرۈۋاتقان يۇقىرى تېخنىكا ھەمكارلىقلىرى ۋە رايون خاراكتېرلىك قايتا تەڭشىلىشلەر ئاسىيا دېڭىز تەۋەلىكىدىكى توسۇش ۋە مۇداپىئە سىستېمىسىنى تۈپتىن ئۆزگەرتمەكتە.",
      content_ug: "خەلقئارا مۇناسىۋەتلەر ۋە ھىندى-تىنچ ئوكيان رايونىدىكى كۈچلەر تەڭپۇڭلۇقى بۈگۈنكى كۈندە مىسلى كۆرۈلمىگەن بىر جىددىي باسقۇچقا كىردى. تاشقى ئىشلار مەجمۇئەسى ئېلان قىلغان يېڭى ئىستراتېگىيەلىك دوكلاتتا كۆرسىتىلىشىچە، خىتاينىڭ رايوندىكى بېسىم سىياسىتىگە تاقابىل تۇرۇش ئۈچۈن قۇرۇلغان ئىتتىپاقلار پەقەت ئەنئەنىۋى ھەربىي بازىلار بىلەنلا چەكلەنمەي، سۈنئىي ئىدراك، تەمىنات زەنجىرى بىخەتەرلىكى ۋە ئوكيان ئۇچۇر سېستىمىلىرىغىچە كېڭەيمەكتە.\\n\\nتەھلىلچىلەرنىڭ قارىشىچە، بۇ يېڭى تۈزۈلمە شەرقىي ئاسىيا ۋە قوشنا رايونلاردىكى جۇغراپىيىلىك رەقىبلىككە تاقابىل تۇرۇشتا ھالقىلىق تەدبىر دەپ قارالماقتا. بولۇپمۇ دېڭىز تەۋەلىكىدىكى ئەركىن قاتناش ۋە سىياسىي ھۆكۈمرانلىقنى قوغداشتا كۆپ تەرەپلىمە كېلىشىملەر كۈچەيمەكتە.",
      highlights_ug: [
        "يېرىم ئۆتكۈزگۈچ ۋە يۇقىرى تېخنىكا تەمىنات زەنجىرى دۆلەت مۇداپىئە كېلىشىملىرىنىڭ يادروسىغا ئايلاندى.",
        "خىتاينىڭ دېڭىز تەۋەلىكىدىكى چېگرا تاجاۋۇزچىلىقىغا قارشى بىرلىككە كەلگەن تەھدىت ئاگاھلاندۇرۇش تورى شەكىللەندى.",
        "ياپونىيە ۋە ئاۋسترالىيە بىلەن بولغان ئىستراتېگىيەلىك ماسلىشىش يېڭى يۇقىرى پەللىگە چىقتى."
      ],
      link: "https://www.foreignaffairs.com/",
      pubDate: "بۈگۈن · 08:30",
      timestamp: Date.now() - 3600000 * 2
    },
    {
      id: "fp-2026-002",
      source: "Foreign Policy",
      category: "technology",
      category_ug: "تېخنىكا & AI",
      title_en: "The Global Chip Wars: The Strategic Struggle Over Advanced Microelectronics",
      title_ug: "دۇنياۋى چىپ ئۇرۇشى: يۇقىرى تېخنىكىلىق مىكرو ئېلېكترونىكا كۈرىشى",
      summary_en: "Why semiconductor independence has become the single most vital battlefield in contemporary great-power competition.",
      summary_ug: "يېرىم ئۆتكۈزگۈچ چىپلارنىڭ مۇستەقىللىقى نېمە سەۋەبتىن زامانىۋى چوڭ دۆلەتلەر رىقابىتىدىكى ئەڭ مۇھىم ھايات-ماماتلىق مەيدانىغا ئايلاندى؟",
      content_ug: "تاشقى سىياسەت ژۇرنىلىنىڭ تەھلىلىدە تەكىتلىنىشىچە، 21-ئەسىردىكى كۈچ تەڭپۇڭلۇقى نېفىت ياكى ئەنئەنىۋى قوراللار بىلەنلا ئەمەس، بەلكى كىچىككىنە نانومېتىرلىق مىكرو ئېلېكترونلۇق چىپلار بىلەن بەلگىلەنمەكتە. خىتاينىڭ ئىلغار چىپ ياساش ئۈسكۈنىلىرىگە ئېرىشىشىگە قويۇلغان خەلقئارالىق چەكلىمىلەر بېيجىڭ تېخنىكا ئامبىرىنىڭ يادرولۇق تەرەققىياتىغا ئېغىر بېسىم ئېلىپ كەلگەن.",
      highlights_ug: [
        "ئەڭ ئىلغار 2 نانومېتىرلىق چىپلارنى كونترول قىلىش ھەربىي سۈنئىي ئىدراك ئۈستۈنلۈكىنى بەلگىلەيدۇ.",
        "تەيۋەن بوغۇزىدىكى تىنچلىق پۈتۈن دۇنيا ئىقتىسادىي ئېلېكترون تەمىناتىنىڭ تۈۋرۈكى دەپ باھالاندى.",
        "ئامېرىكا ۋە ياۋروپا ئىتتىپاقى چىپ ئېمبارگوسىنى تېخىمۇ قاتتىقلاشتۇرۇش قارارىغا كەلدى."
      ],
      link: "https://foreignpolicy.com/",
      pubDate: "بۈگۈن · 05:15",
      timestamp: Date.now() - 3600000 * 5
    },
    {
      id: "td-2026-003",
      source: "The Diplomat",
      category: "geopolitics",
      category_ug: "گېئوپولىتىكا",
      title_en: "Central Asian Corridors and the Quest for Strategic Autonomy",
      title_ug: "ئوتتۇرا ئاسىيا كارىدورى ۋە ئىستراتېگىيەلىك مۇستەقىللىق ئىزدەش مۇساپىسى",
      summary_en: "Regional republics are diversifying transit routes to balance external pressures and safeguard regional sovereignty.",
      summary_ug: "ئوتتۇرا ئاسىيا جۇمھۇرىيەتلىرى تاشقى كۈچلەرنىڭ بېسىمىنى تەڭپۇڭلاشتۇرۇش ۋە رايون مۇستەقىللىقىنى قوغداش ئۈچۈن ئوتتۇرا كارىدور ئارقىلىق قاتناش لىنىيەلىرىنى كۆپ خىللاشتۇرماقتا.",
      content_ug: "«دىپلومات» تەتقىقات ئورگىنى ئېلان قىلغان مەخسۇس ئوبزوردا، ئوتتۇرا ئاسىيا رايونىنىڭ ئەنئەنىۋى رۇسىيە ۋە خىتاي تەسىرىگە قارىتا ئۆز ئالدىغا تەڭپۇڭلۇق ساقلاش ئىستراتېگىيەسىگە ئۆتكەنلىكى بايان قىلىندى. كاسپىي دېڭىزى ۋە تۈركىيە ئارقىلىق ياۋروپاغا ئۇلىنىدىغان «ئوتتۇرا كارىدور» تۈرىنىڭ جانلىنىشى، رايون دۆلەتلىرىنىڭ ئىقتىسادىي ۋە تاشقى مۇستەقىللىقىنى قوغداشتىكى يېڭى پەللىسى دەپ كۆرسىتىلمەكتە.",
      highlights_ug: [
        "ئوتتۇرا كارىدور تۈرى خىتاينىڭ بىر بەلباغ بىر يول قۇرۇلۇشىغا بولغان بىردىنبىر بېقىنىشنى پەسەيتمەكتە.",
        "قازاقىستان، ئۆزبېكىستان قاتارلىق ئەللەردە رايون خاراكتېرلىك ھەمكارلىق يېڭى مىللىي سالاھىيەت بەرپا قىلماقتا.",
        "غەرب ۋە تۈرك دۆلەتلىرى تەشكىلاتى بىلەن بولغان ئىقتىسادىي ھەمكارلىق كۆرۈنەرلىك ئاشتى."
      ],
      link: "https://thediplomat.com/",
      pubDate: "تۈنۈگۈن · 19:40",
      timestamp: Date.now() - 3600000 * 16
    },
    {
      id: "rt-2026-004",
      source: "Reuters",
      category: "human_rights",
      category_ug: "كىشىلىك ھوقۇق",
      title_en: "United Nations Deliberates Resolutions on Human Rights and Accountability",
      title_ug: "بىرلەشكەن دۆلەتلەر تەشكىلاتى ئىنسان ھەقلىرى ۋە ھېسابات سوراش كېلىشىملىرىنى مۇزاكىرە قىلدى",
      summary_en: "International delegations call for transparent mechanisms and independent oversight over civil liberties.",
      summary_ug: "خەلقئارالىق ۋەكىللەر ئۆمەكلىرى پۇقرالارنىڭ ئەركىنلىكى ۋە ئىنسان ھەقلىرىنى قوغداشتا مۇستەقىل تەكشۈرۈش مېخانىزمى ئورنىتىشنى تەكىتلىدى.",
      content_ug: "رويتېرس ئاگېنتلىقىنىڭ خەۋەر قىلىشىچە، ب د ت كىشىلىك ھوقۇق كېڭىشى يىغىنىدا، دۇنيانىڭ ھەر قايسى جايلىرىدىكى باستۇرۇش سىياسەتلىرى، خۇسۇسەن خىتاي دائىرىلىرىنىڭ شەرقىي تۈركىستاندىكى كىشىلىك ھوقۇق تاجاۋۇزچىلىقلىرى، سۈنئىي چەكلىمىلەر ۋە لاگېر سىياسەتلىرىگە قارىتا خەلقئارالىق ھېسابات سوراش بېسىمى داۋاملىق كۈچەيمەكتە.",
      highlights_ug: [
        "شەرقىي تۈركىستان مەسىلىسى خەلقئارالىق يىغىننىڭ ئالدىنقى قاتاردىكى مۇزاكىرە كۈن تەرتىپىگە كىردى.",
        "ئەھلى پىكىر ۋە كىشىلىك ھوقۇق تەشكىلاتلىرى مەجبۇرىي ئەمگەك تاۋارلىرىنى چەكلەشنى چاقىردى.",
        "دۆلەتلەر بېيجىڭنىڭ خەلقئارالىق تەكشۈرۈشكە يول قويۇشىنى قايتا-قايتا شەرت قىلدى."
      ],
      link: "https://feeds.reuters.com/",
      pubDate: "تۈنۈگۈن · 14:10",
      timestamp: Date.now() - 3600000 * 22
    },
    {
      id: "fp-2026-005",
      source: "Foreign Policy",
      category: "economy",
      category_ug: "ئىقتىساد",
      title_en: "Global Oil Arteries, the Strait of Hormuz, and Emerging Inflationary Headwinds",
      title_ug: "يەر شارى نېفىت بازىرى، ھورمۇز بوغۇزى ۋە پۇل پاخاللىقى بېسىمى",
      summary_en: "How geopolitical tensions around the Persian Gulf choke point threaten international energy equilibrium and fiscal policies.",
      summary_ug: "پارس قولتۇقى ۋە ھورمۇز بوغۇزىدىكى ھەربىي جىددىيلىك، خەلقئارا نېفىت باھاسى ۋە ئېنېرگىيە تەمىنات زەنجىرىگە قانداق تەسىر كۆرسەتمەكتە؟",
      content_ug: "فورېن پولىسى مەجمۇئەسى ئېلان قىلغان يېڭى ئىقتىسادىي ئانالىزدا كۆرسىتىلىشىچە، دۇنيا دېڭىز نېفىت تىرانسپورتىنىڭ 20% تىن كۆپرەكى ئۆتىدىغان ھورمۇز بوغۇزىدىكى ھەربىي جىددىيلىك، خەلقئارا پۇل پاخاللىقى ۋە ئېنېرگىيە بىخەتەرلىكىنى قايتىدىن خەتەرلىك ھالەتكە چۈشۈرمەكتە.",
      highlights_ug: [
        "ھورمۇز بوغۇزىنىڭ مۇقىملىقى يەر شارى ئېنېرگىيە باھاسىنىڭ يادرولۇق كۆرسەتكۈچى دەپ بېكىتىلدى.",
        "خەلقئارا پۇل پاخاللىقىغا تاقابىل تۇرۇشتا ئاسىيا بازارلىرى يېڭى ئېنېرگىيە يوللىرىنى تەستىقلىدى."
      ],
      link: "https://foreignpolicy.com/",
      pubDate: "بۈگۈن · 09:45",
      timestamp: Date.now() - 3600000 * 1
    },
    {
      id: "fa-2026-006",
      source: "Foreign Affairs",
      category: "human_rights",
      category_ug: "كىشىلىك ھوقۇق",
      title_en: "Banning Forced Labor Products: EU Regulatory Frameworks and Uyghur Rights",
      title_ug: "مەجبۇرىي ئەمگەك تاۋارلىرىنى چەكلەش: ياۋروپا ئىتتىپاقىنىڭ يېڭى قانۇنى ۋە خەلقئارا ئىجرا",
      summary_en: "European institutions enact comprehensive import prohibitions against state-sponsored forced labor supply chains.",
      summary_ug: "ياۋروپا پارلامېنتى ۋە ئەزا ئەللەر شەرقىي تۈركىستاندىكى مەجبۇرىي ئەمگەككە چېتىشلىق پاختا ۋە تېخنىكا مەھسۇلاتلىرىنى كىرىشنى ئومۇميۈزلۈك چەكلىدى.",
      content_ug: "فورېن ئاففېرس ژۇرنىلىنىڭ خەۋەر قىلىشىچە، ياۋروپا ئىتتىپاقى تەرىپىدىن ماقۇللانغان يېڭى «مەجبۇرىي ئەمگەك تاۋارلىرىنى مەنئى قىلىش بەلگىلىمىسى» خەلقئارا تەمىنات زەنجىرىدە يېڭى دەۋرنى باشلىدى.",
      highlights_ug: [
        "ياۋروپا بازىرى خىتاينىڭ مەجبۇرىي ئەمگەك مەھسۇلاتلىرىغا پۈتۈنلەي تاقالدى.",
        "شەرقىي تۈركىستان كىشىلىك ھوقۇق دەۋاسى خەلقئارالىق سودا ئۆلچىمىگە ئايلاندى."
      ],
      link: "https://www.foreignaffairs.com/",
      pubDate: "تۈنۈگۈن · 16:20",
      timestamp: Date.now() - 3600000 * 20
    },
    {
      id: "rt-2026-007",
      source: "Reuters",
      category: "economy",
      category_ug: "ئىقتىساد",
      title_en: "IMF Global Supply Chain Resilience and Geoeconomic Fragmentation",
      title_ug: "خەلقئارا پۇل فوندى (IMF) تەشكىلاتىنىڭ دۇنياۋى ئىقتىسادىي بۆلۈنۈش دوكلاتى",
      summary_en: "Multilateral financial bodies analyze the cost of geopolitical bloc divisions on emerging markets and logistics.",
      summary_ug: "چوڭ كۈچلەر ئوتتۇرىسىدىكى ئىقتىسادىي بۆلۈنۈش ۋە تاموژنا ئېمبارگولىرى دۇنيا ئىشلەپچىقىرىش ئۈنۈمىگە ئېغىر بەدەل ئېلىپ كەلمەكتە.",
      content_ug: "رويتېرس خەۋەر ئاگېنتلىقىنىڭ خەۋەر قىلىشىچە، خەلقئارا پۇل فوندى تەشكىلاتى (IMF) ئېلان قىلغان يەر شارى ئىقتىسادىي باھالاش دوكلاتىدا، غەرب بىلەن شەرقتىكى ئاپتورىتار دۆلەتلەر ئوتتۇرىسىدىكى سودا ئۇرۇشىنىڭ دۇنياۋى پۇل-مۇئامىلە سىستېمىسىنى بۆلۈپ تاشلىغانلىقى ئەسكەرتىلدى.",
      highlights_ug: [
        "دۇنيا ئىقتىسادى ئىككى چوڭ رەقىب سودا بۆلىكىگە ئايرىلماقتا.",
        "ئوتتۇرا ئاسىيا ۋە قۇتۇپ كارىدورلىرى يېڭى سودا يوللىرى سۈپىتىدە جانلانماقتا."
      ],
      link: "https://feeds.reuters.com/",
      pubDate: "بۈگۈن · 07:10",
      timestamp: Date.now() - 3600000 * 3
    },
    {
      id: "td-2026-008",
      source: "The Diplomat",
      category: "diplomacy",
      category_ug: "دىپلوماتىيە",
      title_en: "The Organization of Turkic States and New Eurasian Geopolitical Alignment",
      title_ug: "تۈرك دۆلەتلىرى تەشكىلاتىنىڭ ئىستراتېگىيەلىك بىرلەشمە كۈچى ۋە ئوتتۇرا كارىدور",
      summary_en: "Ankara, Tashkent, and Astana coordinate strategic transport and mutual defense policies.",
      summary_ug: "ئەنقەرە، تاشكەنت ۋە ئاستانا بىرلىشىپ خەلقئارا سىياسىي ۋە ئىقتىسادىي سەھنىدە ئۆز ئالدىغا ئۈچىنچى قۇتۇپ بولۇپ ئوتتۇرىغا چىقماقتا.",
      content_ug: "«دىپلومات» تەتقىقات ئورگىنى ئېلان قىلغان مەخسۇس ئانالىزدا، تۈرك دۆلەتلىرى تەشكىلاتىنىڭ يېقىنقى دىپلوماتىك تىرىشچانلىقلىرى چوڭقۇر باھالاندى.",
      highlights_ug: [
        "تۈرك دۆلەتلىرى ئوتتۇرىسىدا ئورتاق خەۋپسىزلىك ۋە تەمىنات ماسلىشىشى قۇرۇلدى.",
        "كاسپىي ئوتتۇرا كارىدورى پۈتۈنلەي تۈرك بىرلىكىنىڭ كونتروللۇقىدا مۇستەھكەملەندى."
      ],
      link: "https://thediplomat.com/",
      pubDate: "تۈنۈگۈن · 11:30",
      timestamp: Date.now() - 3600000 * 25
    },
    {
      id: "fa-2026-009",
      source: "Foreign Affairs",
      category: "technology",
      category_ug: "تېخنىكا & AI",
      title_en: "Military AI and Quantum Cryptography: The Frontline of 21st Century Security",
      title_ug: "ھەربىي سۈنئىي ئىدراك (AI) ۋە كۋانت ئۇچۇر مۇداپىئەسىدىكى چوڭ دۆلەتلەر كۈرىشى",
      summary_en: "The intersection of algorithmic models and defense architecture creates novel frontiers in intelligence deterrence.",
      summary_ug: "سۈنئىي ئىدراك ئالگورىتملىرى ۋە كۋانت مەخپىيلەشتۈرۈش ئىقتىدارى كەلگۈسى ئۇرۇش ۋە خەلقئارا تەڭپۇڭلۇقنىڭ يېڭى يادروسىغا ئايلاندى.",
      content_ug: "تاشقى ئىشلار ژۇرنىلىنىڭ تەھلىلىدە، ئىلغار سۈنئىي ئىدراك (AI) مودېللىرىنىڭ پەقەت پۇقراۋى قوللىنىشچان پروگراممىلار بىلەنلا چەكلەنمەي، دۆلەت مۇداپىئە، ئاپتونوم ئۇچقۇلار ۋە تور مۇداپىئە سىستېمىلىرىنىڭ ھاياتلىق مەركىزىگە ئايلانغانلىقى بايان قىلىندى.",
      highlights_ug: [
        "سۈنئىي ئىدراك ۋە كۋانت تېخنىكىسى ھەربىي تەدبىر بەلگىلەش سۈرئىتىنى يۈز ھەسسە ئاشۇردى.",
        "دېموكراتىك دۆلەتلەر يۇقىرى تېخنىكىلىق بىخەتەرلىك بىرلەشمىسى قۇردى."
      ],
      link: "https://www.foreignaffairs.com/",
      pubDate: "ئۈچ كۈن بۇرۇن · 15:50",
      timestamp: Date.now() - 3600000 * 50
    },
    {
      id: "fp-2026-010",
      source: "Foreign Policy",
      category: "diplomacy",
      category_ug: "دىپلوماتىيە",
      title_en: "Transatlantic Cohesion in an Era of Multipolar Fragmentation",
      title_ug: "ۋاشىنگتون ۋە ياۋروپا ئىتتىپاقىنىڭ يېڭى دۇنياۋى دېموكراتىك بىرلەشمىسى",
      summary_en: "Democratic alliances build resilient cooperative frameworks across international governance bodies.",
      summary_ug: "كۆپ قۇتۇپلاشقان يېڭى دۇنيادا دېموكراتىك دۆلەتلەر بىرلىككە كەلگەن خەۋپسىزلىك ۋە دىپلوماتىك ئىستراتېگىيە قۇرۇلمىسىنى ئېلان قىلدى.",
      content_ug: "فورېن پولىسى مەجمۇئەسى ئېلان قىلغان دىپلوماتىك مۇلاھىزىدە كۆرسىتىلىشىچە، ئامېرىكا ۋە ياۋروپا ئىتتىپاقى ھەمدە ئاسىيادىكى دېموكراتىك شېرىكلەر بىر يەرگە جەم بولۇپ، ئاپتورىتار تۈزۈملەرنىڭ خەلقئارا تەرتىپنى بۇزۇشىغا قارشى بىرلىككە كەلگەن دىپلوماتىك قالقان بەرپا قىلدى.",
      highlights_ug: [
        "دېموكراتىك ئەللەرنىڭ بىرلىككە كەلگەن تاشقى سىياسەت پىلانى كۈچكە ئىگە بولدى.",
        "خەلقئارا ئەدلىيە سوتى ۋە ب د ت مېخانىزمىنىڭ ئىناۋىتىنى قايتا تىكلەش تەكىتلىندى."
      ],
      link: "https://foreignpolicy.com/",
      pubDate: "ئۈچ كۈن بۇرۇن · 08:00",
      timestamp: Date.now() - 3600000 * 70
    }
  ];

  const Storage = {
    async get(key, defaultValue) {
      return new Promise((resolve) => {
        try {
          if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get([key], (result) => {
              resolve(result[key] !== undefined ? result[key] : defaultValue);
            });
          } else {
            const val = localStorage.getItem(key);
            resolve(val ? JSON.parse(val) : defaultValue);
          }
        } catch {
          resolve(defaultValue);
        }
      });
    },

    async set(key, value) {
      return new Promise((resolve) => {
        try {
          if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({ [key]: value }, () => resolve(true));
          } else {
            localStorage.setItem(key, JSON.stringify(value));
            resolve(true);
          }
        } catch {
          resolve(false);
        }
      });
    }
  };

  const FONT_MAP = {
    tuz: "'UKIJ Tuz', 'ALKATIP Basma', 'Uyghur Pashto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, sans-serif",
    alkatip: "'ALKATIP Basma', 'UKIJ Tuz', 'Uyghur Pashto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, sans-serif",
    sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, Arial, sans-serif"
  };

  const State = {
    articles: [],
    bookmarks: [],
    activeSource: 'all',
    activeCategory: 'all',
    searchQuery: '',
    language: 'ug',
    theme: 'dark',
    fontSize: 'normal',
    readerFontSize: 14,
    readerLineHeight: 1.8,
    readerFontFamily: 'tuz',
    readerSettingsOpen: false,
    activeArticle: null
  };

  const DOM = {
    body: document.body,
    newsList: document.getElementById('newsList'),
    stateContainer: document.getElementById('stateContainer'),
    stateMessage: document.getElementById('stateMessage'),
    spinner: document.getElementById('spinner'),
    searchInput: document.getElementById('searchInput'),
    sourceTabs: document.getElementById('sourceTabs'),
    categoryTabs: document.getElementById('categoryTabs'),
    fontSizeBtn: document.getElementById('fontSizeBtn'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    themeIcon: document.getElementById('themeIcon'),
    langToggleBtn: document.getElementById('langToggleBtn'),
    langLabel: document.getElementById('langLabel'),
    refreshBtn: document.getElementById('refreshBtn'),
    readerModal: document.getElementById('readerModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    readerSettingsToggleBtn: document.getElementById('readerSettingsToggleBtn'),
    readerTypographyBar: document.getElementById('readerTypographyBar'),
    fontSizeSlider: document.getElementById('fontSizeSlider'),
    fontSizeVal: document.getElementById('fontSizeVal'),
    lineHeightSlider: document.getElementById('lineHeightSlider'),
    lineHeightVal: document.getElementById('lineHeightVal'),
    fontSwitcherGroup: document.getElementById('fontSwitcherGroup'),
    modalSourceBadge: document.getElementById('modalSourceBadge'),
    modalShareBtn: document.getElementById('modalShareBtn'),
    modalBookmarkBtn: document.getElementById('modalBookmarkBtn'),
    modalBookmarkIcon: document.getElementById('modalBookmarkIcon'),
    modalCopyBtn: document.getElementById('modalCopyBtn'),
    modalPubDate: document.getElementById('modalPubDate'),
    modalHeadline: document.getElementById('modalHeadline'),
    modalHighlightsList: document.getElementById('modalHighlightsList'),
    modalContentParagraphs: document.getElementById('modalContentParagraphs'),
    modalSourceLink: document.getElementById('modalSourceLink'),
    articleCountLabel: document.getElementById('articleCountLabel')
  };

  async function initializeApp() {
    try {
      State.theme = await Storage.get('pref_theme', 'dark');
      State.fontSize = await Storage.get('pref_fontsize', 'normal');
      State.language = await Storage.get('pref_lang', 'ug');
      State.bookmarks = await Storage.get('user_bookmarks', []);

      // Automatically restore reader settings from chrome.storage.local
      await loadReaderSettings();

      const cached = await Storage.get('cached_news', null);
      State.articles = (cached && cached.length) ? cached : DEFAULT_ARTICLES;

      applyTheme(State.theme);
      applyFontSize(State.fontSize);
      applyLanguage(State.language);

      bindEventListeners();
      renderArticles();
    } catch (e) {
      console.error(e);
    }
  }

  function bindEventListeners() {
    DOM.searchInput.addEventListener('input', (e) => {
      State.searchQuery = e.target.value.trim().toLowerCase();
      renderArticles();
    });

    if (DOM.sourceTabs) {
      DOM.sourceTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;
        DOM.sourceTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        State.activeSource = btn.dataset.source;
        renderArticles();
      });
    }

    if (DOM.categoryTabs) {
      DOM.categoryTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.cat-pill');
        if (!btn) return;
        DOM.categoryTabs.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        State.activeCategory = btn.dataset.category || 'all';
        renderArticles();
      });
    }

    DOM.fontSizeBtn.addEventListener('click', () => {
      const sizes = ['normal', 'large', 'xlarge'];
      const next = sizes[(sizes.indexOf(State.fontSize) + 1) % sizes.length];
      State.fontSize = next;
      applyFontSize(next);
      Storage.set('pref_fontsize', next);
    });

    DOM.themeToggleBtn.addEventListener('click', () => {
      State.theme = State.theme === 'dark' ? 'light' : 'dark';
      applyTheme(State.theme);
      Storage.set('pref_theme', State.theme);
    });

    DOM.langToggleBtn.addEventListener('click', () => {
      State.language = State.language === 'ug' ? 'en' : 'ug';
      applyLanguage(State.language);
      Storage.set('pref_lang', State.language);
      renderArticles();
      if (State.activeArticle) populateReaderModal(State.activeArticle);
    });

    DOM.refreshBtn.addEventListener('click', async () => {
      DOM.refreshBtn.classList.add('active');
      setTimeout(() => {
        DOM.refreshBtn.classList.remove('active');
        renderArticles();
      }, 500);
    });

    DOM.closeModalBtn.addEventListener('click', () => {
      DOM.readerModal.classList.remove('open');
      State.activeArticle = null;
    });

    // Toggle reader typography bar
    DOM.readerSettingsToggleBtn.addEventListener('click', () => {
      State.readerSettingsOpen = !State.readerSettingsOpen;
      DOM.readerTypographyBar.classList.toggle('collapsed', !State.readerSettingsOpen);
      DOM.readerSettingsToggleBtn.classList.toggle('active', State.readerSettingsOpen);
    });

    // Font size slider input
    DOM.fontSizeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      State.readerFontSize = val;
      DOM.fontSizeVal.textContent = val + 'px';
      applyReaderTypography(val, State.readerLineHeight, State.readerFontFamily);
      saveReaderSettings();
    });

    // Line height slider input
    DOM.lineHeightSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      State.readerLineHeight = val;
      DOM.lineHeightVal.textContent = val + 'x';
      applyReaderTypography(State.readerFontSize, val, State.readerFontFamily);
      saveReaderSettings();
    });

    // Font family switcher buttons
    if (DOM.fontSwitcherGroup) {
      DOM.fontSwitcherGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('.font-btn');
        if (!btn) return;
        const fontKey = btn.dataset.font;
        if (!fontKey || !FONT_MAP[fontKey]) return;
        State.readerFontFamily = fontKey;
        updateFontButtons(fontKey);
        applyReaderTypography(State.readerFontSize, State.readerLineHeight, fontKey);
        saveReaderSettings();
      });
    }

    DOM.modalBookmarkBtn.addEventListener('click', () => {
      if (!State.activeArticle) return;
      toggleBookmark(State.activeArticle.id);
      updateModalBookmarkState();
      renderArticles();
    });

    if (DOM.modalShareBtn) {
      DOM.modalShareBtn.addEventListener('click', async () => {
        if (!State.activeArticle) return;
        const isUg = State.language === 'ug';
        const title = isUg ? State.activeArticle.title_ug : State.activeArticle.title_en;
        const shareData = {
          title: title,
          text: \`\${isUg ? State.activeArticle.summary_ug : State.activeArticle.summary_en}\\n— UyFox news\`,
          url: State.activeArticle.link
        };

        const setSuccess = () => {
          const orig = DOM.modalShareBtn.innerHTML;
          DOM.modalShareBtn.innerHTML = '<span>✓ ھەمبەھىرلەندى</span>';
          setTimeout(() => { DOM.modalShareBtn.innerHTML = orig; }, 2000);
        };

        if (typeof navigator !== 'undefined' && navigator.share) {
          try {
            await navigator.share(shareData);
            setSuccess();
          } catch (err) {
            if (err.name !== 'AbortError') {
              navigator.clipboard.writeText(\`\${shareData.title}\\n\${shareData.url}\\n— UyFox news\`).then(setSuccess).catch(() => {});
            }
          }
        } else {
          navigator.clipboard.writeText(\`\${shareData.title}\\n\${shareData.url}\\n— UyFox news\`).then(setSuccess).catch(() => {});
        }
      });
    }

    DOM.modalCopyBtn.addEventListener('click', () => {
      if (!State.activeArticle) return;
      const t = \`\${State.activeArticle.title_ug}\\n\\n\${State.activeArticle.content_ug}\`;
      navigator.clipboard.writeText(t).then(() => {
        DOM.modalCopyBtn.innerText = "كۆچۈرۈلدى ✓";
        setTimeout(() => { DOM.modalCopyBtn.innerText = "كۆچۈرۈش"; }, 1800);
      });
    });

    DOM.newsList.addEventListener('click', (e) => {
      const card = e.target.closest('.news-card');
      if (!card) return;
      const article = State.articles.find(a => a.id === card.dataset.id);
      if (!article) return;

      const bm = e.target.closest('.bookmark-action');
      if (bm) {
        e.stopPropagation();
        toggleBookmark(article.id);
        renderArticles();
        return;
      }
      openReaderModal(article);
    });
  }

  function renderArticles() {
    let list = State.articles;
    if (State.activeSource === 'bookmarks') {
      list = list.filter(a => State.bookmarks.includes(a.id));
    } else if (State.activeSource !== 'all') {
      list = list.filter(a => a.source === State.activeSource);
    }

    if (State.activeCategory && State.activeCategory !== 'all') {
      list = list.filter(a => a.category === State.activeCategory);
    }

    if (State.searchQuery) {
      list = list.filter(a =>
        a.title_ug.toLowerCase().includes(State.searchQuery) ||
        a.title_en.toLowerCase().includes(State.searchQuery) ||
        a.summary_ug.toLowerCase().includes(State.searchQuery)
      );
    }

    DOM.articleCountLabel.textContent = \`\${list.length} خەۋەر\`;

    if (!list.length) {
      DOM.newsList.innerHTML = '';
      DOM.stateContainer.style.display = 'flex';
      DOM.stateMessage.textContent = 'بۇ تۈردە خەۋەر تېپىلمىدى.';
      DOM.spinner.style.display = 'none';
      return;
    }

    DOM.stateContainer.style.display = 'none';
    const isUg = State.language === 'ug';

    DOM.newsList.innerHTML = list.map(item => {
      const isBookmarked = State.bookmarks.includes(item.id);
      const title = isUg ? sanitizeUyghurText(item.title_ug) : item.title_en;
      const summary = isUg ? sanitizeUyghurText(item.summary_ug) : item.summary_en;

      return \`
        <article class="news-card" data-id="\${item.id}">
          <div class="card-meta">
            <span class="source-name">\${item.source}</span>
            <span class="category-tag">\${item.category_ug || item.category || 'گېئوپولىتىكا'}</span>
            <span class="pub-time">\${item.pubDate}</span>
          </div>
          <h3 class="card-title">\${title}</h3>
          <p class="card-summary">\${summary}</p>
          <div class="card-footer">
            <button class="read-btn" type="button">
              <span>\${isUg ? 'تەپسىلىي تەھلىل ←' : 'Read Full Analysis →'}</span>
            </button>
            <div class="card-actions-right">
              <button class="icon-btn bookmark-action \${isBookmarked ? 'bookmarked' : ''}" type="button">
                <span>\${isBookmarked ? '★' : '☆'}</span>
              </button>
            </div>
          </div>
        </article>
      \`;
    }).join('');
  }

  function openReaderModal(article) {
    State.activeArticle = article;
    populateReaderModal(article);
    DOM.readerModal.classList.add('open');
  }

  function populateReaderModal(article) {
    const isUg = State.language === 'ug';
    DOM.modalSourceBadge.textContent = article.source;
    DOM.modalPubDate.textContent = article.pubDate;
    DOM.modalHeadline.textContent = isUg ? sanitizeUyghurText(article.title_ug) : article.title_en;
    DOM.modalSourceLink.href = article.link;
    updateModalBookmarkState();

    if (article.highlights_ug && article.highlights_ug.length) {
      DOM.modalHighlightsList.innerHTML = article.highlights_ug
        .map(h => \`<div class="highlight-item">\${sanitizeUyghurText(h)}</div>\`)
        .join('');
      document.getElementById('modalHighlightsBox').style.display = 'block';
    } else {
      document.getElementById('modalHighlightsBox').style.display = 'none';
    }

    const bodyContent = isUg ? article.content_ug : article.summary_en;
    DOM.modalContentParagraphs.innerHTML = bodyContent.split('\\n\\n')
      .map(p => \`<p class="modal-paragraph">\${sanitizeUyghurText(p)}</p>\`)
      .join('');

    applyReaderTypography(State.readerFontSize, State.readerLineHeight, State.readerFontFamily);
  }

  function applyReaderTypography(fontSize, lineHeight, fontKey) {
    if (!DOM.modalContentParagraphs) return;
    const key = fontKey || State.readerFontFamily || 'tuz';
    const chosenFont = FONT_MAP[key] || FONT_MAP.tuz;
    const paras = DOM.modalContentParagraphs.querySelectorAll('.modal-paragraph');
    paras.forEach(p => {
      p.style.fontSize = fontSize + 'px';
      p.style.lineHeight = lineHeight;
      p.style.fontFamily = chosenFont;
    });
  }

  function updateFontButtons(fontKey) {
    if (!DOM.fontSwitcherGroup) return;
    DOM.fontSwitcherGroup.querySelectorAll('.font-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.font === fontKey);
    });
  }

  /**
   * Saves reader typography preferences (font-size, line-height, font-family)
   * into chrome.storage.local for persistence across browser restarts.
   */
  async function saveReaderSettings() {
    try {
      const readerPrefs = {
        fontSize: State.readerFontSize,
        lineHeight: State.readerLineHeight,
        fontFamily: State.readerFontFamily,
        timestamp: Date.now()
      };

      await Storage.set('reader_settings', readerPrefs);
      await Storage.set('pref_reader_fontsize', State.readerFontSize);
      await Storage.set('pref_reader_lineheight', State.readerLineHeight);
      await Storage.set('pref_reader_fontfamily', State.readerFontFamily);

      console.log('[chrome.storage.local] Reader settings saved successfully:', readerPrefs);
    } catch (err) {
      console.warn('[chrome.storage.local] Error saving reader settings:', err);
    }
  }

  /**
   * Automatically loads and restores reader settings from chrome.storage.local
   * on extension initialization.
   */
  async function loadReaderSettings() {
    try {
      const savedPrefs = await Storage.get('reader_settings', null);

      if (savedPrefs && typeof savedPrefs === 'object') {
        State.readerFontSize = parseFloat(savedPrefs.fontSize) || 14;
        State.readerLineHeight = parseFloat(savedPrefs.lineHeight) || 1.8;
        State.readerFontFamily = (savedPrefs.fontFamily && FONT_MAP[savedPrefs.fontFamily]) ? savedPrefs.fontFamily : 'tuz';
      } else {
        const fs = await Storage.get('pref_reader_fontsize', 14);
        const lh = await Storage.get('pref_reader_lineheight', 1.8);
        const ff = await Storage.get('pref_reader_fontfamily', 'tuz');

        State.readerFontSize = parseFloat(fs) || 14;
        State.readerLineHeight = parseFloat(lh) || 1.8;
        State.readerFontFamily = (ff && FONT_MAP[ff]) ? ff : 'tuz';
      }

      if (DOM.fontSizeSlider) {
        DOM.fontSizeSlider.value = State.readerFontSize;
      }
      if (DOM.fontSizeVal) {
        DOM.fontSizeVal.textContent = State.readerFontSize + 'px';
      }
      if (DOM.lineHeightSlider) {
        DOM.lineHeightSlider.value = State.readerLineHeight;
      }
      if (DOM.lineHeightVal) {
        DOM.lineHeightVal.textContent = State.readerLineHeight + 'x';
      }
      updateFontButtons(State.readerFontFamily);

      applyReaderTypography(State.readerFontSize, State.readerLineHeight, State.readerFontFamily);
    } catch (err) {
      console.warn('[chrome.storage.local] Error restoring reader settings:', err);
    }
  }

  function updateModalBookmarkState() {
    if (!State.activeArticle) return;
    const isBm = State.bookmarks.includes(State.activeArticle.id);
    DOM.modalBookmarkIcon.textContent = isBm ? '★' : '☆';
    DOM.modalBookmarkBtn.classList.toggle('bookmarked', isBm);
  }

  function toggleBookmark(id) {
    const i = State.bookmarks.indexOf(id);
    if (i > -1) State.bookmarks.splice(i, 1);
    else State.bookmarks.push(id);
    Storage.set('user_bookmarks', State.bookmarks);
  }

  function applyTheme(theme) {
    DOM.body.setAttribute('data-theme', theme);
    DOM.themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
  }

  function applyFontSize(size) {
    DOM.body.setAttribute('data-font-size', size);
  }

  function applyLanguage(lang) {
    DOM.body.setAttribute('dir', lang === 'ug' ? 'rtl' : 'ltr');
    DOM.body.setAttribute('lang', lang);
    DOM.langLabel.textContent = lang === 'ug' ? 'ئۇيغۇرچە' : 'English';
    DOM.searchInput.placeholder = lang === 'ug' ? 'خەۋەرلەر ئىچىدىن ئىزدەش...' : 'Search news...';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
})();`;

export const BACKGROUND_JS_CONTENT = `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * خەۋەرلەرنى يىغىپ كۆرسىتىش قۇرالى - Background Service Worker (Manifest V3)
 * Least Privilege, Zero Telemetry Background Engine
 */

const ALARM_NAME = 'REFRESH_FEEDS_ALARM';
const REFRESH_INTERVAL_MINUTES = 60;

chrome.runtime.onInstalled.addListener(() => {
  console.log('[Background] Uyghur News Extension installed.');
  chrome.alarms.create(ALARM_NAME, {
    periodInMinutes: REFRESH_INTERVAL_MINUTES
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    console.log('[Background] Syncing cached feeds...');
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'FETCH_LATEST_FEEDS') {
    chrome.storage.local.get(['cached_news'], (data) => {
      sendResponse({ success: true, articles: data.cached_news || [] });
    });
    return true;
  }
});`;

export const README_CONTENT = `# UyFox news (Chrome Extension)

Google Chrome Manifest V3 ئۆلچىمىگە تولۇق ئۇيغۇن كېلىدىغان، دۇنياۋى نوپۇزلۇق سىياسىي ۋە ئىستراتېگىيەلىك خەۋەرلەرنى (Foreign Policy, Foreign Affairs, The Diplomat, Reuters World) ئۇيغۇرچىغا سۈپەتلىك تەرجىمە قىلىپ كۆرسىتىپ بېرىدىغان كارخانا دەرىجىلىك كېڭەيتىلمە.

---

## 🚀 قاچىلاش ۋە ئىشلىتىش ئۇسۇلى (How to Install & Load Unpacked)

1. **ZIP ھۆججىتىنى يېشىش:** چۈشۈرۈلگەن \`uyfox-news-chrome-extension.zip\` ھۆججىتىنى ئۆز كومپيۇتېرىڭىزدىكى بىر قىسقۇچقا يېشىڭ (ئېچىڭ).
2. **Chrome Extensions نى ئېچىش:** 
   - Google Chrome توركۆرگۈچىنى ئېچىپ، ئادرېس بالدىقىغا \`chrome://extensions/\` دەپ كىرگۈزۈڭ ۋە Enter بېسىڭ.
3. **ئاچقۇچى ھالىتىنى ئېچىش (Developer Mode):**
   - بەتنىڭ ئوڭ ئۈستى تەرىپىدىكى «Developer mode» (ئاچقۇچى ھالىتى) نى ئېچىڭ.
4. **قىستۇرمىنى يۈكلەش (Load unpacked):**
   - سول ئۈستى تەرەپتىكى «Load unpacked» (يېشىلگەن ھۆججەتنى قاچىلاش) كۇنۇپكىسىنى بېسىڭ.
   - ئەمدىلا زىپتىن يەشكەن \`extension\` قىسقۇچىنى تاللاڭ.
5. **تامام!** قىستۇرما دەل شۇ ھامان Chrome نىڭ ئوڭ ئۈستىدىكى قىستۇرمىلار بالدىقىدا كۆرۈنىدۇ. بېسىپ بىۋاسىتە ئىشلەتسىڭىز بولىدۇ.

---

## 🛡️ بىخەتەرلىك ۋە مەخپىيەتلىك كاپالىتى
- **Zero Telemetry:** ھېچقانداق سانلىق مەلۇمات تاشقى سېرۋېرلارغا يوللانمايدۇ. بارلىق خەتكۈچ ۋە تەڭشەكلەر كومپيۇتېرىڭىزدا (\`chrome.storage.local\`) بىخەتەر ساقلىنىدۇ.
- **خىتاي مۇلازىمەتلىرىدىن 100% خالىي:** Baidu, Tencent, Alibaba قاتارلىق ھېچقانداق خىتاي شىركىتىنىڭ كودى ياكى API سى ئىشلىتىلمىدى.
- **مىللىي سالاھىيەتكە سادىق ئاتالغۇ تۈزۈمى:** بارلىق جايلاردا مۇستەملىكىچى سۆزلەر چەكلىنىپ، «شەرقىي تۈركىستان»، «خىتاي» دەپ توغرا قوللىنىلدى.
`;
