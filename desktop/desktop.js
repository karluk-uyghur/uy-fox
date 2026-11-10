/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * UyFox News - Windows Desktop & Chrome Full Screen Controller
 * Enterprise Uyghur News Aggregator, Reader & Geopolitical Analyzer
 */

(function () {
  'use strict';

  // --- Initial Articles Dataset ---
  const ARTICLES = [
    {
      id: "fa-2026-001",
      source: "Foreign Affairs",
      category: "Geopolitics",
      title_en: "The New Architecture of Indo-Pacific Security and Alliances",
      title_ug: "ھىندى-تىنچ ئوكيان بىخەتەرلىكى ۋە ئىتتىپاقداشلىق مۇناسىۋەتلىرىنىڭ يېڭى قۇرۇلمىسى",
      summary_ug: "يېڭىدىن باش كۆتۈرۈۋاتقان يۇقىرى تېخنىكا ھەمكارلىقلىرى ۋە رايون خاراكتېرلىك قايتا تەڭشىلىشلەر ئاسىيا دېڭىز تەۋەلىكىدىكى توسۇش ۋە مۇداپىئە سىستېمىسىنى تۈپتىن ئۆزگەرتمەكتە.",
      content_ug: "خەلقئارا مۇناسىۋەتلەر ۋە ھىندى-تىنچ ئوكيان رايونىدىكى كۈچلەر تەڭپۇڭلۇقى بۈگۈنكى كۈندە مىسلى كۆرۈلمىگەن بىر جىددىي باسقۇچقا كىردى. تاشقى ئىشلار مەجمۇئەسى ئېلان قىلغان يېڭى ئىستراتېگىيەلىك دوكلاتتا كۆرسىتىلىشىچە، خىتاينىڭ رايوندىكى بېسىم سىياسىتىگە تاقابىل تۇرۇش ئۈچۈن قۇرۇلغان ئىتتىپاقلار پەقەت ئەنئەنىۋى ھەربىي بازىلار بىلەنلا چەكلەنمەي، سۈنئىي ئىدراك، تەمىنات زەنجىرى بىخەتەرلىكى ۋە ئوكيان ئۇچۇر سېستىمىلىرىغىچە كېڭەيمەكتە.\n\nتەھلىلچىلەرنىڭ قارىشىچە، بۇ يېڭى تۈزۈلمە شەرقىي ئاسىيا ۋە قوشنا رايونلاردىكى جۇغراپىيىلىك رەقىبلىككە تاقابىل تۇرۇشتا ھالقىلىق تەدبىر دەپ قارالماقتا. بولۇپمۇ دېڭىز تەۋەلىكىدىكى ئەركىن قاتناش ۋە سىياسىي ھۆكۈمرانلىقنى قوغداشتا كۆپ تەرەپلىمە كېلىشىملەر كۈچەيمەكتە.",
      highlights_ug: [
        "يېرىم ئۆتكۈزگۈچ ۋە يۇقىرى تېخنىكا تەمىنات زەنجىرى دۆلەت مۇداپىئە كېلىشىملىرىنىڭ يادروسىغا ئايلاندى.",
        "خىتاينىڭ دېڭىز تەۋەلىكىدىكى چېگرا تاجاۋۇزچىلىقىغا قارشى بىرلىككە كەلگەن تەھدىت ئاگاھلاندۇرۇش تورى شەكىللەندى.",
        "ياپونىيە ۋە ئاۋسترالىيە بىلەن بولغان ئىستراتېگىيەلىك ماسلىشىش يېڭى يۇقىرى پەللىگە چىقتى."
      ],
      link: "https://www.foreignaffairs.com/",
      pubDate: "بۈگۈن · 08:30"
    },
    {
      id: "fp-2026-002",
      source: "Foreign Policy",
      category: "Diplomacy",
      title_en: "The Global Chip Wars: The Strategic Struggle Over Advanced Microelectronics",
      title_ug: "دۇنياۋى چىپ ئۇرۇشى: يۇقىرى تېخنىكىلىق مىكرو ئېلېكترونىكا كۈرىشى",
      summary_ug: "يېرىم ئۆتكۈزگۈچ چىپلارنىڭ مۇستەقىللىقى نېمە سەۋەبتىن زامانىۋى چوڭ دۆلەتلەر رىقابىتىدىكى ئەڭ مۇھىم ھايات-ماماتلىق مەيدانىغا ئايلاندى؟",
      content_ug: "تەشقى سىياسەت ژۇرنىلىنىڭ تەھلىلىدە تەكىتلىنىشىچە، 21-ئەسىردىكى كۈچ تەڭپۇڭلۇقى نېفىت ياكى ئەنئەنىۋى قوراللار بىلەنلا ئەمەس، بەلكى كىچىككىنە نانومېتىرلىق مىكرو ئېلېكترونلۇق چىپلار بىلەن بەلگىلەنمەكتە. خىتاينىڭ ئىلغار چىپ ياساش ئۈسكۈنىلىرىگە ئېرىشىشىگە قويۇلغان خەلقئارالىق چەكلىمىلەر بېيجىڭ تېخنىكا ئامبىرىنىڭ يادرولۇق تەرەققىياتىغا ئېغىر بېسىم ئېلىپ كەلگەن.\n\nشۇنىڭ بىلەن بىر ۋاقىتتا، غەرب دۇنياسى ئۆز ئۆيلىرىدە يېڭى چىپ ئىشلەپچىقىرىش زاۋۇتلىرىنى تەسىس قىلىپ، شەرق دۆلەتلىرىگە بولغان بېقىنىشنى تۈگىتىش ئۈچۈن يۈز مىليارد دوللارلىق فوند ئاجراتماقتا.",
      highlights_ug: [
        "ئەڭ ئىلغار 2 نانومېتىرلىق چىپلارنى كونترول قىلىش ھەربىي سۈنئىي ئىدراك ئۈستۈنلۈكىنى بەلگىلەيدۇ.",
        "تەيۋەن بوغۇزىدىكى تىنچلىق پۈتۈن دۇنيا ئىقتىسادىي ئېلېكترون تەمىناتىنىڭ تۈۋرۈكى دەپ باھالاندى.",
        "ئامېرىكا ۋە ياۋروپا ئىتتىپاقى چىپ ئېمبارگوسىنى تېخىمۇ قاتتىقلاشتۇرۇش قارارىغا كەلدى."
      ],
      link: "https://foreignpolicy.com/",
      pubDate: "بۈگۈن · 05:15"
    },
    {
      id: "td-2026-003",
      source: "The Diplomat",
      category: "Central Asia",
      title_en: "Central Asian Corridors and the Quest for Strategic Autonomy",
      title_ug: "ئوتتۇرا ئاسىيا كارىدورى ۋە ئىستراتېگىيەلىك مۇستەقىللىق ئىزدەش مۇساپىسى",
      summary_ug: "ئوتتۇرا ئاسىيا جۇمھۇرىيەتلىرى تاشقى كۈچلەرنىڭ بېسىمىنى تەڭپۇڭلاشتۇرۇش ۋە رايون مۇستەقىللىقىنى قوغداش ئۈچۈن ئوتتۇرا كارىدور ئارقىلىق قاتناش لىنىيەلىرىنى كۆپ خىللاشتۇرماقتا.",
      content_ug: "«دىپلومات» تەتقىقات ئورگىنى ئېلان قىلغان مەخسۇس ئوبزوردا، ئوتتۇرا ئاسىيا رايونىنىڭ ئەنئەنىۋى رۇسىيە ۋە خىتاي تەسىرىگە قارىتا ئۆز ئالدىغا تەڭپۇڭلۇق ساقلاش ئىستراتېگىيەسىگە ئۆتكەنلىكى بايان قىلىندى. كاسپىي دېڭىزى ۋە تۈركىيە ئارقىلىق ياۋروپاغا ئۇلىنىدىغان «ئوتتۇرا كارىدور» تۈرىنىڭ جانلىنىشى، رايون دۆلەتلىرىنىڭ ئىقتىسادىي ۋە تاشقى مۇستەقىللىقىنى قوغداشتىكى يېڭى پەللىسى دەپ كۆرسىتىلمەكتە.\n\nتەھلىلگە ئاساسلانغاندا، خىتاينىڭ پۈتۈن رايوننى قەرز قىلتىقى ۋە ئېنېرگىيە بايلىقلىرى ئارقىلىق ئۆزىگە مۇتەلەق بېقىندۇرۇش پىلانى كۈچلۈك قارشىلىقلارغا دۇچ كېلىشكە باشلىدى.",
      highlights_ug: [
        "ئوتتۇرا كارىدور تۈرى خىتاينىڭ بىر بەلباغ بىر يول قۇرۇلۇشىغا بولغان بىردىنبىر بېقىنىشنى پەسەيتمەكتە.",
        "قازاقىستان، ئۆزبېكىستان قاتارلىق ئەللەردە رايون خاراكتېرلىك ھەمكارلىق يېڭى مىللىي سالاھىيەت بەرپا قىلماقتا.",
        "غەرب ۋە تۈرك دۆلەتلىرى تەشكىلاتى بىلەن بولغان ئىقتىسادىي ھەمكارلىق كۆرۈنەرلىك ئاشتى."
      ],
      link: "https://thediplomat.com/",
      pubDate: "تۈنۈگۈن · 19:40"
    },
    {
      id: "rt-2026-004",
      source: "Reuters",
      category: "World News",
      title_en: "United Nations Deliberates Resolutions on Human Rights and Accountability",
      title_ug: "بىرلەشكەن دۆلەتلەر تەشكىلاتى ئىنسان ھەقلىرى ۋە ھېسابات سوراش كېلىشىملىرىنى مۇزاكىرە قىلدى",
      summary_ug: "خەلقئارالىق ۋەكىللەر ئۆمەكلىرى پۇقرالارنىڭ ئەركىنلىكى ۋە ئىنسان ھەقلىرىنى قوغداشتا مۇستەقىل تەكشۈرۈش مېخانىزمى ئورنىتىشنى تەكىتلىدى.",
      content_ug: "رويتېرس ئاگېنتلىقىنىڭ خەۋەر قىلىشىچە، ب د ت كىشىلىك ھوقۇق كېڭىشى يىغىنىدا، دۇنيانىڭ ھەر قايسى جايلىرىدىكى باستۇرۇش سىياسەتلىرى، خۇسۇسەن خىتاي دائىرىلىرىنىڭ شەرقىي تۈركىستاندىكى كىشىلىك ھوقۇق تاجاۋۇزچىلىقلىرى، سۈنئىي چەكلىمىلەر ۋە لاگېر سىياسەتلىرىگە قارىتا خەلقئارالىق ھېسابات سوراش بېسىمى داۋاملىق كۈچەيمەكتە.\n\nنۇرغۇنلىغان دېموكراتىك دۆلەتلەر بىرلىككە كەلگەن بايانات ئېلان قىلىپ، بارلىق سىياسىي تۇتقۇنلارنى شەرتسىز قويۇپ بېرىش ۋە خەلقئارا مۇستەقىل ئەدلىيە تەپتىش گۇرۇپپىلىرىنىڭ نەق مەيدانغا تولۇق ۋە دەخلىسىز كىرىشىگە رۇخسەت قىلىشنى تەلەپ قىلدى.",
      highlights_ug: [
        "شەرقىي تۈركىستان مەسىلىسى خەلقئارالىق يىغىننىڭ ئالدىنقى قاتاردىكى مۇزاكىرە كۈن تەرتىپىگە كىردى.",
        "ئەھلى پىكىر ۋە كىشىلىك ھوقۇق تەشكىلاتلىرى مەجبۇرىي ئەمگەك تاۋارلىرىنى چەكلەشنى چاقىردى.",
        "دۆلەتلەر بېيجىڭنىڭ خەلقئارالىق تەكشۈرۈشكە يول قويۇشىنى قايتا-قايتا شەرت قىلدى."
      ],
      link: "https://feeds.reuters.com/",
      pubDate: "تۈنۈگۈن · 14:10"
    },
    {
      id: "fa-2026-005",
      source: "Foreign Affairs",
      category: "Strategy",
      title_en: "Energy Geopolitics: Green Transition Meets Strategic Resource Realism",
      title_ug: "ئېنېرگىيە جۇغراپىيىلىك سىياسىتى: يېشىل تەرەققىيات ۋە ئىستراتېگىيەلىك بايلىق رېئالىزمى",
      summary_ug: "ئاز ئۇچرايدىغان قېزىلما مىنېراللار ۋە باتارېيە زاپچاسلىرى ئۈچۈن قىلىنىۋاتقان كەسكىن رىقابەت يېڭى دىپلوماتىك تەسىر دائىرىلىرىنى بارلىققا كەلتۈرمەكتە.",
      content_ug: "دۇنيانىڭ قايتا ھاسىل بولىدىغان يېشىل ئېنېرگىيەگە ئۆتۈش سۈرئىتى ئېشىشىغا ئەگىشىپ، لىتىي، كوبالت ۋە ئاز ئۇچرايدىغان تۇپراق ماددىلىرى نېفىتنىڭ ئورنىنى ئالغان يېڭى سىياسىي كوزىرغا ئايلاندى. ماقالىدە تەھلىل قىلىنىشىچە، خىتاينىڭ بۇ ئېلېمېنتلارنى پىششىقلاپ ئىشلەشتىكى مونوپوللىقىنى چېقىش ئۈچۈن، شىمالىي ئامېرىقا، ئافرىقا ۋە لاتىن ئامېرىكىسىدا يېڭى كېلىشىملەر ئىمزالانماقتا.",
      highlights_ug: [
        "لىتىي ۋە ئاز كۆرۈلىدىغان مىنېراللار دۇنيا ئىستراتېگىيەلىك تەمىناتىنىڭ تومۇرىغا ئايلاندى.",
        "غەرب دۆلەتلىرى يېڭى تېخنىكىلىق قېزىش بازىلىرىنى شەكىللەندۈرۈشكە كىرىشتى.",
        "ئېنېرگىيە مۇستەقىللىقى دۆلەت بىخەتەرلىكىنىڭ تەركىبىي قىسمى سۈپىتىدە تەستىقلاندى."
      ],
      link: "https://www.foreignaffairs.com/",
      pubDate: "2 كۈن ئىلگىرى"
    }
  ];

  // State
  let currentSource = 'all';
  let searchQuery = '';
  let activeArticleId = 'fa-2026-001';
  let bookmarks = ['fa-2026-001'];
  let currentTheme = 'dark';
  let readerFontSize = 21;
  let readerLineHeight = 2.2;
  let readerFontFamily = 'tuz';

  // Safe storage wrappers
  function saveState(key, val) {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ [key]: val });
      } else {
        localStorage.setItem('uyfox_' + key, JSON.stringify(val));
      }
    } catch (e) {
      console.warn(e);
    }
  }

  function loadState(key, fallback, cb) {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get([key], (res) => {
          cb(res && res[key] !== undefined ? res[key] : fallback);
        });
      } else {
        const item = localStorage.getItem('uyfox_' + key);
        cb(item ? JSON.parse(item) : fallback);
      }
    } catch (e) {
      cb(fallback);
    }
  }

  // Toast Helper
  function showToast(message) {
    const toast = document.getElementById('winToast');
    if (!toast) return;
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 2400);
  }

  // Render News Stream Cards
  function renderFeedCards() {
    const stream = document.getElementById('desktopNewsStream');
    if (!stream) return;

    let filtered = ARTICLES.filter(art => {
      if (currentSource === 'bookmarks') {
        if (!bookmarks.includes(art.id)) return false;
      } else if (currentSource !== 'all') {
        if (art.source !== currentSource) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesUg = art.title_ug.toLowerCase().includes(q) || art.summary_ug.toLowerCase().includes(q);
        const matchesEn = art.title_en.toLowerCase().includes(q);
        if (!matchesUg && !matchesEn) return false;
      }
      return true;
    });

    const metaCount = document.getElementById('feedMetaCount');
    if (metaCount) metaCount.textContent = `${filtered.length} تەھلىل ماقالىسى`;

    if (filtered.length === 0) {
      stream.innerHTML = `
        <div style="padding: 40px; text-align: center; color: var(--text-faint);">
          <div style="font-size: 28px; margin-bottom: 8px;">🔍</div>
          <div>خەۋەر تېپىلمىدى ياكى ساقلانغانلار بوش</div>
        </div>
      `;
      return;
    }

    stream.innerHTML = filtered.map(art => {
      const isSelected = art.id === activeArticleId;
      const isBookmarked = bookmarks.includes(art.id);
      return `
        <article class="desktop-card ${isSelected ? 'active-reading' : ''}" data-id="${art.id}">
          <div class="card-top-meta">
            <span class="source-pill">${art.source}</span>
            <span class="pub-time-label">${art.pubDate}</span>
          </div>
          <h2 class="card-headline">${art.title_ug}</h2>
          <p class="card-brief">${art.summary_ug}</p>
          <div class="card-bottom-row">
            <span class="read-cta">تولۇق تەھلىلنى ئوقۇش ←</span>
            <button class="icon-action-btn bookmark-card-btn" data-bookmark-id="${art.id}" title="خەتكۈچ">
              ${isBookmarked ? '★ ساقلانغان' : '☆ ساقلاش'}
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Attach click events
    stream.querySelectorAll('.desktop-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.bookmark-card-btn')) return;
        const id = card.getAttribute('data-id');
        selectArticle(id);
      });
    });

    stream.querySelectorAll('.bookmark-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-bookmark-id');
        toggleBookmark(id);
      });
    });
  }

  // Select Article into Reader Pane
  function selectArticle(id) {
    activeArticleId = id;
    const art = ARTICLES.find(a => a.id === id) || ARTICLES[0];
    if (!art) return;

    // Update headlines
    const tag = document.getElementById('readerSourceTag');
    if (tag) tag.textContent = art.source;

    const date = document.getElementById('readerDateLabel');
    if (date) date.textContent = art.pubDate;

    const headline = document.getElementById('readerArticleHeadline');
    if (headline) headline.textContent = art.title_ug;

    // Highlights
    const hlList = document.getElementById('readerHighlightsList');
    if (hlList) {
      hlList.innerHTML = (art.highlights_ug || []).map(h => `<li>${h}</li>`).join('');
    }

    // Paragraphs
    const paras = document.getElementById('readerArticleParagraphs');
    if (paras) {
      paras.innerHTML = art.content_ug.split('\n\n').map(p => `<p>${p}</p>`).join('');
      paras.style.fontSize = readerFontSize + 'px';
      paras.style.lineHeight = readerLineHeight;
    }

    // Source link
    const link = document.getElementById('readerSourceLink');
    if (link) link.href = art.link;

    // Bookmark button state
    const bmBtn = document.getElementById('readerBookmarkBtn');
    if (bmBtn) {
      const isBm = bookmarks.includes(art.id);
      bmBtn.textContent = isBm ? '★ ساقلاندى' : '☆ ساقلاش';
      bmBtn.style.color = isBm ? 'var(--accent-gold)' : 'var(--text-muted)';
    }

    renderFeedCards();
  }

  // Toggle Bookmark
  function toggleBookmark(id) {
    if (bookmarks.includes(id)) {
      bookmarks = bookmarks.filter(x => x !== id);
      showToast('ماقالە ساقلانغانلاردىن ئۆچۈرۈلدى');
    } else {
      bookmarks.push(id);
      showToast('ماقالە خەتكۈچكە مۇۋەپپەقىيەتلىك ساقلاندى!');
    }
    saveState('bookmarks', bookmarks);
    updateBookmarkCounts();
    selectArticle(activeArticleId);
  }

  function updateBookmarkCounts() {
    const el = document.getElementById('countBookmarks');
    if (el) el.textContent = bookmarks.length;
  }

  // Share Article via Web Share API
  async function shareCurrentArticle() {
    const art = ARTICLES.find(a => a.id === activeArticleId) || ARTICLES[0];
    const shareData = {
      title: art.title_ug,
      text: `${art.title_ug}\n\n${art.summary_ug}\n— UyFox News ئارقىلىق ئوقۇلدى`,
      url: art.link || 'https://foreignpolicy.com'
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('ماقالە ھەمبەھىرلەندى!');
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(`${shareData.title}\n${shareData.url}`, 'ئۇلىنىش كۆچۈرۈلدى!');
        }
      }
    } else {
      copyToClipboard(`${shareData.title}\n${shareData.url}`, 'ئۇلىنىش ۋە ماۋزۇ كۆچۈرۈلدى!');
    }
  }

  function copyToClipboard(text, msg) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(msg || 'كۆچۈرۈلدى!');
    });
  }

  // Apply typography
  function applyTypography() {
    const paras = document.getElementById('readerArticleParagraphs');
    if (paras) {
      paras.style.fontSize = readerFontSize + 'px';
      paras.style.lineHeight = readerLineHeight;
    }
    const fsVal = document.getElementById('readerFontSizeDisplay');
    if (fsVal) fsVal.textContent = readerFontSize + 'px';

    const lhVal = document.getElementById('readerLineHeightDisplay');
    if (lhVal) lhVal.textContent = readerLineHeight + 'x';

    document.body.setAttribute('data-font', readerFontFamily);
  }

  // Windows Control Mock
  function initWindowControls() {
    document.getElementById('winMinimizeBtn')?.addEventListener('click', () => {
      showToast('ئۈستەلئۈستى پىروگراممىسى كىچىكلىتىلدى');
    });
    document.getElementById('winMaximizeBtn')?.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.().catch(() => {});
      } else {
        document.exitFullscreen?.().catch(() => {});
      }
    });
    document.getElementById('winCloseBtn')?.addEventListener('click', () => {
      if (window.close) window.close();
    });
  }

  // Menubar Tab Switcher
  function initTabs() {
    const tabs = document.querySelectorAll('.menu-tab-btn');
    const workspaces = {
      news: document.getElementById('newsWorkspace'),
      strategy: document.getElementById('strategyWorkspace'),
      maps: document.getElementById('mapsWorkspace'),
      prd: document.getElementById('prdWorkspace'),
      spec: document.getElementById('specWorkspace')
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const key = tab.getAttribute('data-tab');

        Object.keys(workspaces).forEach(k => {
          if (workspaces[k]) {
            workspaces[k].style.display = (k === key) ? (k === 'news' ? 'grid' : 'block') : 'none';
          }
        });

        if (key === 'prd') loadPrd();
        if (key === 'spec') loadSpec();
      });
    });
  }

  // Channel Selection
  function initChannels() {
    const channelBtns = document.querySelectorAll('.channel-btn');
    channelBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        channelBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSource = btn.getAttribute('data-source');

        const label = document.getElementById('activeChannelLabel');
        if (label) label.textContent = btn.querySelector('.channel-title')?.textContent || 'خەۋەرلەر';

        renderFeedCards();
      });
    });

    const searchInput = document.getElementById('desktopSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderFeedCards();
      });
    }
  }

  // Typography Sliders
  function initTypographyControls() {
    const fsSlider = document.getElementById('desktopFontSizeSlider');
    if (fsSlider) {
      fsSlider.value = readerFontSize;
      fsSlider.addEventListener('input', (e) => {
        readerFontSize = parseInt(e.target.value, 10);
        applyTypography();
        saveState('readerFontSize', readerFontSize);
      });
    }

    const lhSlider = document.getElementById('desktopLineHeightSlider');
    if (lhSlider) {
      lhSlider.value = readerLineHeight;
      lhSlider.addEventListener('input', (e) => {
        readerLineHeight = parseFloat(e.target.value);
        applyTypography();
        saveState('readerLineHeight', readerLineHeight);
      });
    }

    const fontPills = document.querySelectorAll('.font-pill');
    fontPills.forEach(pill => {
      pill.addEventListener('click', () => {
        fontPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        readerFontFamily = pill.getAttribute('data-font');
        applyTypography();
        saveState('readerFontFamily', readerFontFamily);
      });
    });
  }

  // Quick action buttons
  function initButtons() {
    document.getElementById('readerShareBtn')?.addEventListener('click', shareCurrentArticle);
    document.getElementById('desktopShareAppBtn')?.addEventListener('click', shareCurrentArticle);
    
    document.getElementById('readerBookmarkBtn')?.addEventListener('click', () => {
      toggleBookmark(activeArticleId);
    });

    document.getElementById('readerCopyBtn')?.addEventListener('click', () => {
      const art = ARTICLES.find(a => a.id === activeArticleId);
      if (art) {
        copyToClipboard(`${art.title_ug}\n\n${art.content_ug}`, 'تولۇق مەزمۇن كۆچۈرۈلدى!');
      }
    });

    document.getElementById('desktopRefreshBtn')?.addEventListener('click', () => {
      showToast('خەۋەرلەر يېڭىلاندى!');
      renderFeedCards();
    });

    document.getElementById('desktopThemeBtn')?.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', currentTheme);
      const icon = document.getElementById('desktopThemeIcon');
      if (icon) icon.textContent = currentTheme === 'dark' ? '🌙 كېچە' : '☀️ كۈندۈز';
      saveState('theme', currentTheme);
    });
  }

  // PRD and SPEC loader
  function loadPrd() {
    const pre = document.getElementById('prdBodyText');
    if (!pre) return;
    fetch('PRD.md').then(r => r.text()).then(txt => {
      pre.textContent = txt;
    }).catch(() => {
      pre.textContent = `# UyFox News - Enterprise Product Requirement Document (PRD)\n1. نۆل ئىز قوغلاش\n2. خىتاي API ۋە CDN لىرىدىن خالىي بولۇش\n3. تولۇق ئۇيغۇرچە تەرجىمە ۋە گېئوپولىتىكىلىق تەھلىل.`;
    });
  }

  function loadSpec() {
    const pre = document.getElementById('specBodyText');
    if (!pre) return;
    fetch('SPEC.md').then(r => r.text()).then(txt => {
      pre.textContent = txt;
    }).catch(() => {
      pre.textContent = `# UyFox News - Technical Specification Document (SPEC)\n- Chrome Manifest V3 Standard\n- Zero External Telemetry\n- IndexedDB / chrome.storage.local Offline Persistence.`;
    });
  }

  // Init
  function init() {
    initWindowControls();
    initTabs();
    initChannels();
    initTypographyControls();
    initButtons();

    // Restore saved settings
    loadState('bookmarks', ['fa-2026-001'], (savedBm) => {
      bookmarks = savedBm;
      updateBookmarkCounts();
      selectArticle(activeArticleId);
    });

    loadState('theme', 'dark', (savedTheme) => {
      currentTheme = savedTheme;
      document.body.setAttribute('data-theme', currentTheme);
      const icon = document.getElementById('desktopThemeIcon');
      if (icon) icon.textContent = currentTheme === 'dark' ? '🌙 كېچە' : '☀️ كۈندۈز';
    });

    loadState('readerFontSize', 15, (val) => {
      readerFontSize = val;
      const s = document.getElementById('desktopFontSizeSlider');
      if (s) s.value = val;
      applyTypography();
    });

    loadState('readerLineHeight', 1.8, (val) => {
      readerLineHeight = val;
      const s = document.getElementById('desktopLineHeightSlider');
      if (s) s.value = val;
      applyTypography();
    });

    loadState('readerFontFamily', 'tuz', (val) => {
      readerFontFamily = val;
      document.querySelectorAll('.font-pill').forEach(p => {
        p.classList.toggle('active', p.getAttribute('data-font') === val);
      });
      applyTypography();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
