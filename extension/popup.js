/**
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
      content_ug: "خەلقئارا مۇناسىۋەتلەر ۋە ھىندى-تىنچ ئوكيان رايونىدىكى كۈچلەر تەڭپۇڭلۇقى بۈگۈنكى كۈندە مىسلى كۆرۈلمىگەن بىر جىددىي باسقۇچقا كىردى. تاشقى ئىشلار مەجمۇئەسى ئېلان قىلغان يېڭى ئىستراتېگىيەلىك دوكلاتتا كۆرسىتىلىشىچە، خىتاينىڭ رايوندىكى بېسىم سىياسىتىگە تاقابىل تۇرۇش ئۈچۈن قۇرۇلغان ئىتتىپاقلار پەقەت ئەنئەنىۋى ھەربىي بازىلار بىلەنلا چەكلەنمەي، سۈنئىي ئىدراك، تەمىنات زەنجىرى بىخەتەرلىكى ۋە ئوكيان ئۇچۇر سېستىمىلىرىغىچە كېڭەيمەكتە.\n\nتەھلىلچىلەرنىڭ قارىشىچە، بۇ يېڭى تۈزۈلمە شەرقىي ئاسىيا ۋە قوشنا رايونلاردىكى جۇغراپىيىلىك رەقىبلىككە تاقابىل تۇرۇشتا ھالقىلىق تەدبىر دەپ قارالماقتا. بولۇپمۇ دېڭىز تەۋەلىكىدىكى ئەركىن قاتناش ۋە سىياسىي ھۆكۈمرانلىقنى قوغداشتا كۆپ تەرەپلىمە كېلىشىملەر كۈچەيمەكتە.",
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
          text: `${isUg ? State.activeArticle.summary_ug : State.activeArticle.summary_en}\n— UyFox news`,
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
              navigator.clipboard.writeText(`${shareData.title}\n${shareData.url}\n— UyFox news`).then(setSuccess).catch(() => {});
            }
          }
        } else {
          navigator.clipboard.writeText(`${shareData.title}\n${shareData.url}\n— UyFox news`).then(setSuccess).catch(() => {});
        }
      });
    }

    DOM.modalCopyBtn.addEventListener('click', () => {
      if (!State.activeArticle) return;
      const t = `${State.activeArticle.title_ug}\n\n${State.activeArticle.content_ug}`;
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

    DOM.articleCountLabel.textContent = `${list.length} خەۋەر`;

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

      return `
        <article class="news-card" data-id="${item.id}">
          <div class="card-meta">
            <span class="source-name">${item.source}</span>
            <span class="category-tag">${item.category_ug || item.category || 'گېئوپولىتىكا'}</span>
            <span class="pub-time">${item.pubDate}</span>
          </div>
          <h3 class="card-title">${title}</h3>
          <p class="card-summary">${summary}</p>
          <div class="card-footer">
            <button class="read-btn" type="button">
              <span>${isUg ? 'تەپسىلىي تەھلىل ←' : 'Read Full Analysis →'}</span>
            </button>
            <div class="card-actions-right">
              <button class="icon-btn bookmark-action ${isBookmarked ? 'bookmarked' : ''}" type="button">
                <span>${isBookmarked ? '★' : '☆'}</span>
              </button>
            </div>
          </div>
        </article>
      `;
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
        .map(h => `<div class="highlight-item">${sanitizeUyghurText(h)}</div>`)
        .join('');
      document.getElementById('modalHighlightsBox').style.display = 'block';
    } else {
      document.getElementById('modalHighlightsBox').style.display = 'none';
    }

    const bodyContent = isUg ? article.content_ug : article.summary_en;
    DOM.modalContentParagraphs.innerHTML = bodyContent.split('\n\n')
      .map(p => `<p class="modal-paragraph">${sanitizeUyghurText(p)}</p>`)
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
})();