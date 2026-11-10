# تېخنىكىلىق لايىھە ھۆججىتى (Enterprise SPEC)
## تۈر: خەۋەرلەرنى يىغىپ كۆرسىتىش قۇرالى (Uyghur World News Chrome Extension)
**ئارخىتېكتۇرا ئۆلچىمى:** Chrome Extension Manifest Version 3 (MV3)  
**بىخەتەرلىك سەۋىيەسى:** Zero-Trust / Zero-Telemetry Architecture  
**ئورۇندىلىش مۇھىتى:** Chromium / Google Chrome 110+  
**ھالىتى:** رەسمىي تەستىقلانغان كود ئارخىتېكتورى ئۆلچىمى  

---

### 1. سىستېما يۇقىرى دەرىجىلىك ئارخىتېكتۇرىسى (High-Level Architecture)

```
+--------------------------------------------------------------------------+
|                        Google Chrome Browser                             |
|                                                                          |
|  +--------------------------------------------------------------------+  |
|  |                 Extension Action Popup (UI Layer)                  |  |
|  |                                                                    |  |
|  |  [popup.html]  RTL Uyghur, Frosted Glass (Apple/Linear Style)       |  |
|  |       |                                                            |  |
|  |  [popup.js]    State Store, Instant Search, Uyghur Typography,     |  |
|  |       |        Bilingual Toggle, Reader Modal, Bookmarks           |  |
|  +-------+-----------------------------+------------------------------+  |
|          | Local Message / Storage     |                                 |
|          v                             v                                 |
|  +--------------------------------+  +--------------------------------+  |
|  | chrome.storage.local           |  | Background Service Worker      |  |
|  | (Local Encrypted Device Store) |  | [background.js]                |  |
|  | - cached_news_items            |  | - chrome.alarms (Auto-Refresh) |  |
|  | - user_bookmarks               |  | - Fetch RSS Feeds via CORS     |  |
|  | - ui_preferences (theme, font) |  | - DOMParser XML Sanitization   |  |
|  +--------------------------------+  +---------------+----------------+  |
|                                                      |                   |
+------------------------------------------------------|-------------------+
                                                       v
                                       +-------------------------------+
                                       | External Trusted News Sources |
                                       | (Explicit Host Permissions)   |
                                       | - Foreign Affairs RSS         |
                                       | - Foreign Policy RSS          |
                                       | - The Diplomat RSS            |
                                       | - Reuters World RSS           |
                                       +-------------------------------+
```

---

### 2. ھۆججەت قۇرۇلمىسى (Enterprise File Tree)
```
khwerler-chrome-extension/
├── manifest.json              # MV3 چۈشەندۈرۈش، قاتتىق CSP، زۆرۈر ئىجازەتلەر
├── popup.html                 # RTL ئۇيغۇرچە كۆرۈنمە يۈز، ئەينەكسىمان قۇرۇلما
├── popup.js                   # UI ئەھۋال باشقۇرۇش، تەرجىمە، ئىزدەش، كاش ماتورى
├── popup.css                  # يۇقىرى ئېنىقلىقتىكى ئۇيغۇرچە مەتبەئە ۋە كۆرۈنۈش ئۇسلۇبى
├── background.js              # مەخسۇس ئارقا سۇپا مۇلازىمەتچىسى (Service Worker)
├── rules.json                 # بىخەتەر تور قائىدىلىرى (ئەگەر باغلانسا)
├── PRD.md                     # كارخانا مەھسۇلات تەلەپ ھۆججىتى
├── SPEC.md                    # كارخانا تېخنىكىلىق لايىھە ھۆججىتى
├── README.md                  # ئورنىتىش، سىناش ۋە چۈشەندۈرۈش ھۆججىتى
└── icons/
    ├── icon16.png             # 16x16 كېڭەيتىلمە سىنبەلگىسى
    ├── icon48.png             # 48x48 كېڭەيتىلمە سىنبەلگىسى
    └── icon128.png            # 128x128 يۇقىرى ئېنىقلىقتىكى سىنبەلگە
```

---

### 3. بىخەتەرلىك ۋە ھوقۇق بېكىتىش تەكشۈرۈشى (Security & Least Privilege Audit)

#### 3.1 Content Security Policy (CSP)
Manifest V3 نىڭ قاتتىق CSP بەلگىلىمىسى ئىجرا قىلىنىدۇ:
```json
"content_security_policy": {
  "extension_pages": "script-src 'self'; object-src 'self';"
}
```
- **سەۋەبى:** `eval()`، تاشقى كود قاچىلاش (`https://.../script.js`) ۋە inline event handler (`onclick="..."`) قەتئىي مەنئى قىلىنىدۇ. بارلىق ۋەقەلەر `addEventListener` ئارقىلىق پۈتۈنلەي بىخەتەر ئۇلىنىدۇ.

#### 3.2 ئىجازەتلەر تىزىملىكى (Least Privilege Permissions)
- `"permissions": ["storage", "alarms"]`
  - `storage`: ئابۇنتنىڭ كاش ۋە خەتكۈچلىرىنى پەقەت ئۆز كومپيۇتېرىدىكى `chrome.storage.local` غا ساقلاش ئۈچۈن.
  - `alarms`: ئارقا سۇپىدا بەلگىلەنگەن مىنۇتلاردا خەۋەرلەرنى ئاپتوماتىك كاشلاش ئۈچۈن.
- `"host_permissions": [...]`
  - پەقەت خەۋەر مەنبەلىرىنىڭ ئېنىق RSS تور بەتلىرىگىلا چەكلىنىدۇ:
    - `https://foreignpolicy.com/*`
    - `https://www.foreignaffairs.com/*`
    - `https://thediplomat.com/*`
    - `https://feeds.reuters.com/*`
  - `<all_urls>` ياكى `*://*/*` قاتارلىق دەرىجىدىن تاشقىرى خەتەرلىك ھوقۇقلار مەۋجۇت ئەمەس.

#### 3.3 Zero-Telemetry & Non-Chinese Infrastructure Guarantee
- كودتا ھېچقانداق تاشقى CDN (Baidu, Alibaba, Tencent, BootCDN, cdnjs, unpkg) ئۇلانمىسى يوق.
- بارلىق سىنبەلگىلەر يەرلىك SVG شەكىلدە بىۋاسىتە ئىچكى كودقا كىرگۈزۈلگەن.
- تاشقى تەھلىل مۇلازىمەتلىرى (Google Analytics, Sentry, Clarity) قەتئىي تۈگىتىلگەن.

---

### 4. ئۇيغۇرچە تەرجىمە ۋە ئاتالغۇ ماتورى (Translation & Terminology Engine)

#### 4.1 ئاتالغۇ تۈزەش قائىدىسى (Terminology Sanitizer)
تەرجىمە سىستېمىسى سۈزۈشتىن ئۆتكۈزۈلگەن سىياسىي، جۇغراپىيىلىك ۋە ئىستراتېگىيەلىك لۇغەتكە تايىنىدۇ:
- **شەرقىي تۈركىستان كاپالىتى:** «Xinjiang», «XUAR», «NW China» سۆزلىرى دائىم ۋە مەجبۇرىي ھالدا «شەرقىي تۈركىستان» دەپ تەرجىمە قىلىنىدۇ.
- **خىتاي ئاتالغۇسى:** «China», «PRC», «Beijing regime» كەلىمىلىرى ئەركىن ھەم ئېنىق ھالدا «خىتاي»، «بېيجىڭ ھاكىمىيىتى» دەپ ئاتىلىدۇ. «جۇڭگو»، «خەنزۇ» دېگەندەك سۆزلەر سىستېمىدا تەلتۆكۈس بايقاپ تۈزىتىلىدۇ.
- **ئىلمىي ۋە رەسمىي تىل:** ئەھلى سۈننەت ۋەلجامائەت ئەخلاقىغا ئۇيغۇن، ئىلمىي ۋە مەتبۇئات سەۋىيەسىدىكى ئەدەبىي تىل قوللىنىلىدۇ.

---

### 5. يەرلىك سانلىق مەلۇمات قۇرۇلمىسى (Local Storage Schema)

```typescript
interface ExtensionStorageSchema {
  // يەرلىك ساقلانغان كاش خەۋەرلىرى
  cached_articles: Array<{
    id: string;
    source: 'Foreign Policy' | 'Foreign Affairs' | 'The Diplomat' | 'Reuters';
    title_en: string;
    title_ug: string;
    summary_en: string;
    summary_ug: string;
    content_ug: string;
    highlights_ug: string[];
    link: string;
    pubDate: string;
    timestamp: number;
    category: string;
  }>;

  // ئابۇنت ساقلىۋالغان خەتكۈچلەر ID تىزىمى
  user_bookmarks: string[];

  // ئابۇنت تەڭشەكلىرى
  user_settings: {
    current_language: 'ug' | 'en';
    theme: 'dark' | 'light';
    font_size: 'normal' | 'large' | 'xlarge';
    auto_refresh_minutes: number;
    active_source: 'all' | 'foreign_policy' | 'foreign_affairs' | 'diplomat' | 'reuters' | 'bookmarks';
  };
}
```

---

### 6. ئۆلچەملىك كۆرۈنمە يۈز ئۇسلۇبى (Awwwards UX & Typography)

```css
/* ئۇيغۇرچە مەتبەئە ئۆلچىمى */
.ug-text {
  direction: rtl;
  text-align: justify;
  text-justify: inter-word;
  font-family: 'UKIJ Tuz', 'ALKATIP Basma', 'Uyghur Pashto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, sans-serif;
  line-height: 1.8;
}

.ug-paragraph {
  text-indent: 1.8em;
  margin-bottom: 0.8em;
}

/* Apple & Linear ئۇسلۇبىدىكى Frosted Glass ئەينەكسىمان كۆرۈنۈش */
.glass-panel {
  background: rgba(18, 24, 38, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

---

### 7. ئېنترىپرايس كود سۈپىتى كاپالىتى (Quality & Error Handling)
- بارلىق تور چاقىرىشلىرى `try...catch` ۋە `AbortController` ئارقىلىق دەۋرلىك چېكى بېكىتىلگەن.
- تور ئۈزۈلۈپ قالسا كاشتىكى ماتېرىياللار ئاپتوماتىك ئېچىلىپ كۆرسىتىلىدۇ، ھەرگىز قۇرۇق ئېكران ياكى ئېقىپ كەتكەن خاتالىق قالمايدۇ.
