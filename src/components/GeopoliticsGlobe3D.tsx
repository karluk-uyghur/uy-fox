/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Three.js 3D Realistic Geopolitical Globe & Silk Road Corridors
 * ھەقىقىي يەر شارى خەرىتىسى، يىپەك يولى كارىدورى ۋە جۇغراپىيىلىك سىياسەت مەركىزى
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Globe, RotateCw, MapPin, Layers, Compass, Sparkles, ZoomIn, ZoomOut, X, ExternalLink, Copy, Check, RefreshCw, Type, Bot, FileText, Filter, Satellite, Moon, Sun, Eye, Navigation, ChevronRight, ChevronLeft } from 'lucide-react';

interface Hotspot {
  id: string;
  name_ug: string;
  name_en: string;
  lat: number;
  lng: number;
  description_ug: string;
  category: string;
  categoryKey: 'geopolitics' | 'economy' | 'human_rights' | 'technology' | 'diplomacy';
  markerType: 'military_base' | 'camp' | 'silk_road' | 'hotspot';
  color: number;
  badge_ug: string;
  sourceDoc_ug: string;
  coordinates_display: string;
}

const HOTSPOTS: Hotspot[] = [
  // ==========================================
  // 1. خىتاينىڭ خەلقئاراغا ئاشكارىلانغان ھەربىي بازىلىرى (Red / Crimson ⚔️)
  // ==========================================
  {
    id: 'china-base-djibouti',
    name_ug: 'جىبۇتىدىكى خىتاي دېڭىز ئارمىيە تەمىنات بازىسى',
    name_en: 'PLA Navy Support Base in Djibouti',
    lat: 11.595,
    lng: 43.061,
    description_ug: 'خىتاينىڭ تۇنجى رەسمىي چەتئەل ھەربىي بازىسى بولۇپ، باب ئەل-مەندەب بوغۇزى ۋە پارس قولتۇقى-سۈۋەيىش ئۆتكىلىنى بىۋاسىتە كونترول قىلىش ئۈچۈن قۇرۇلغان. تەخمىنەن 2000 ئەسكەر ۋە ئاۋىياماتكا توختىتىش پورتى بار.',
    category: 'چەتئەل ھەربىي بازىسى',
    categoryKey: 'geopolitics',
    markerType: 'military_base',
    color: 0xef4444,
    badge_ug: '⚔️ خىتاي ھەربىي بازىسى',
    sourceDoc_ug: 'ئامېرىكا دۆلەت مۇداپىئە مىنىستىرلىكى (DoD) خىتاي ھەربىي كۈچى يىللىق دوكلاتى & سۈنئىي ھەمراھ كۆرۈنۈشلىرى',
    coordinates_display: '11°35\'42"N, 43°03\'39"E'
  },
  {
    id: 'china-base-ream',
    name_ug: 'كامبودژا رېئام دېڭىز ئارمىيە بازىسى',
    name_en: 'Ream Naval Base, Cambodia (PLA Deep-Water Pier)',
    lat: 10.533,
    lng: 103.606,
    description_ug: 'تايلاند قولتۇقى ۋە مالاككا بوغۇزىغا يېقىن بولغان چوڭقۇر سۇ ھەربىي پورتى. خىتاي ھەربىي پاراخوتلىرى ئۇزۇن مۇددەت توختاپ ھەربىي مانېۋىر ئېلىپ بارىدىغانلىقى سۈنئىي ھەمراھ تەكشۈرۈشلىرىدە ئاشكارىلاندى.',
    category: 'دېڭىز ئارمىيە بازىسى',
    categoryKey: 'geopolitics',
    markerType: 'military_base',
    color: 0xef4444,
    badge_ug: '⚔️ خىتاي ھەربىي بازىسى',
    sourceDoc_ug: 'CSIS ئاسىيا دېڭىز تەۋەلىكى ئاشكارىلىق پىلانى (AMTI) دەلىللەنگەن سۈنئىي ھەمراھ سۈرەتلىرى',
    coordinates_display: '10°31\'58"N, 103°36\'21"E'
  },
  {
    id: 'china-base-gwadar',
    name_ug: 'پاكىستان گۋادار پورتى ھەربىي ۋە تەمىنات ئېغىزى',
    name_en: 'Gwadar Deep Sea Port & Strategic Naval Facility, Pakistan',
    lat: 25.122,
    lng: 62.325,
    description_ug: 'خىتاي-پاكىستان ئىقتىسادىي كارىدورى (CPEC) نىڭ دېڭىز تۈگۈنى. ھورمۇز بوغۇزى ۋە پارس قولتۇقىنى كونترول قىلىش ئىقتىدارىغا ئىگە چوڭ تىپتىكى ھەربىي پاراخوتلار لەڭگەر تاشلايدىغان ئىستراتېگىيەلىك پورت.',
    category: 'ئىستراتېگىيەلىك دېڭىز ئېغىزى',
    categoryKey: 'geopolitics',
    markerType: 'military_base',
    color: 0xef4444,
    badge_ug: '⚔️ خىتاي ھەربىي بازىسى',
    sourceDoc_ug: 'خەلقئارالىق دېڭىز تەتقىقات ئورگىنى & پەنتېگون دېڭىز ئارمىيە ئىستراتېگىيە ئانالىزى',
    coordinates_display: '25°07\'19"N, 62°19\'30"E'
  },
  {
    id: 'china-base-tajikistan',
    name_ug: 'تاجىكىستان پامىر مۇغاب مەخپىي ئەسكىرى بازىسى',
    name_en: 'Tajikistan Murghab PLA Border Base',
    lat: 38.172,
    lng: 73.965,
    description_ug: 'پامىر ئېگىزلىكى ۋە ۋاخان كارىدورىنىڭ كىرىش ئېغىزىدا خىتاي ئارمىيەسى مەخپىي قۇرغان ئەسكىرى بازا. شەرقىي تۈركىستان ۋە ئوتتۇرا ئاسىيا چېگرا سىزىقىنى ھەربىي جەھەتتىن كونترول قىلىش ئۈچۈن ئىشلىتىلىدۇ.',
    category: 'تاغلىق چېگرا بازىسى',
    categoryKey: 'geopolitics',
    markerType: 'military_base',
    color: 0xef4444,
    badge_ug: '⚔️ خىتاي ھەربىي بازىسى',
    sourceDoc_ug: 'The Washington Post & Foreign Policy مەخپىي ھەربىي ھۆججەت ۋە تەكشۈرۈش دوكلاتى',
    coordinates_display: '38°10\'19"N, 73°57\'54"E'
  },
  {
    id: 'china-base-coco',
    name_ug: 'بىرما چوڭ كوكو ئاراللىرى رادار ۋە ھاۋا بازىسى',
    name_en: 'Great Coco Island Radar & SIGINT Base, Myanmar',
    lat: 14.133,
    lng: 93.364,
    description_ug: 'بېنگال قولتۇقى ۋە ھىندىستاننىڭ ئاندامان ئاراللىرىغا قارشى جايلاشقان. يېڭى ئۇچۇش يوللىرى ۋە رادار ئانتېننا مۇنارلىرى قۇرۇلۇپ، ھىندى ئوكياندىكى دېڭىز قاتنىشىنى جاسۇسلۇق بىلەن كۆزىتىشكە ئىشلىتىلمەكتە.',
    category: 'رادار & ئاۋىئاتسىيە بازىسى',
    categoryKey: 'geopolitics',
    markerType: 'military_base',
    color: 0xef4444,
    badge_ug: '⚔️ خىتاي ھەربىي بازىسى',
    sourceDoc_ug: 'Maxar Technologies يۇقىرى ئېنىقلىقتىكى سۈنئىي ھەمراھ كۆرۈنۈشلىرى & چەتئەل ئاخبارات دەلىللىشى',
    coordinates_display: '14°07\'58"N, 93°21\'50"E'
  },
  {
    id: 'china-base-fierycross',
    name_ug: 'جەنۇبىي دېڭىز يۇڭشۇ (Fiery Cross) سۈنئىي ئارال قەلئە بازىسى',
    name_en: 'Fiery Cross Reef Military Outpost & Airbase, Spratlys',
    lat: 9.550,
    lng: 112.900,
    description_ug: 'جەنۇبىي دېڭىزدىكى سۈنئىي خادا تاشنى چوڭ تىپتىكى ھەربىي ئارالغا ئايلاندۇرغان. 3125 مېتىرلىق پۈتۈنلەي مۇكەممەل ھەربىي ئۇچۇش يولى، باشقۇرۇلىدىغان بومبا كىرگۈزۈش ئورنى ۋە رادار قورغانلىرى جايلاشقان.',
    category: 'سۈنئىي ئارال قورغىنى',
    categoryKey: 'geopolitics',
    markerType: 'military_base',
    color: 0xef4444,
    badge_ug: '⚔️ خىتاي ھەربىي بازىسى',
    sourceDoc_ug: 'CSIS AMTI سۈنئىي ھەمراھ تەھلىلى & Jane\'s Defence Weekly ھەربىي ماتېرىيالى',
    coordinates_display: '09°33\'00"N, 112°54\'00"E'
  },
  {
    id: 'china-base-subi',
    name_ug: 'سۇبى (Subi Reef) ھەربىي ئاۋىئاتسىيە ئارال قەلئەسى',
    name_en: 'Subi Reef Militarized Island Base, Spratly Islands',
    lat: 10.916,
    lng: 114.083,
    description_ug: 'خىتاي ئارمىيەسى بەرپا قىلغان ئەڭ چوڭ سۈنئىي بازىلارنىڭ بىرى. فېلىپپىن دېڭىز تەۋەلىكىگە ئەڭ يېقىن بولۇپ، ھاۋا مۇداپىئە باشقۇرۇلىدىغان بومبىلىرى ۋە ئۇرۇش پاراخوتلىرى پورتى تەسىس قىلىنغان.',
    category: 'ھاۋا & دېڭىز بازىسى',
    categoryKey: 'geopolitics',
    markerType: 'military_base',
    color: 0xef4444,
    badge_ug: '⚔️ خىتاي ھەربىي بازىسى',
    sourceDoc_ug: 'Planet Labs سۈنئىي ھەمراھ رەسىملىرى & ئامېرىكا تىنچ ئوكيان قوماندانلىق مەركىزى',
    coordinates_display: '10°55\'00"N, 114°05\'00"E'
  },
  {
    id: 'china-base-woody',
    name_ug: 'پاراسېل شىشا (Woody Island) ھاۋا ئارمىيە باشقۇرۇلىدىغان بومبا بازىسى',
    name_en: 'Woody Island Airbase, Paracel Islands',
    lat: 16.833,
    lng: 112.333,
    description_ug: 'HQ-9 يەر-ھاۋا باشقۇرۇلىدىغان بومبا سىستېمىلىرى، YJ-62 پاراخوت قارشى بومبىلىرى ۋە J-11B قىرغۇچى ئايروپىلانلىرى سەپلەنگەن جەنۇبىي ئاسىيا ھاۋا بوشلۇقىنى توسۇش ھەربىي قوماندانلىق بازىسى.',
    category: 'ھاۋا & مۇداپىئە بازىسى',
    categoryKey: 'geopolitics',
    markerType: 'military_base',
    color: 0xef4444,
    badge_ug: '⚔️ خىتاي ھەربىي بازىسى',
    sourceDoc_ug: 'ئامېرىكا دۆلەت مۇداپىئە مىنىستىرلىكى & خەلقئارا ئىستراتېگىيە تەتقىقات ئورگىنى (IISS)',
    coordinates_display: '16°50\'00"N, 112°20\'00"E'
  },

  // ==========================================
  // 2. تۈركىستاندا خەلقئاراغا ئاشكارىلانغان جازا لاگېرلىرى ۋە تۈرمىلەر (Amber / Violet ⛓️)
  // ==========================================
  {
    id: 'camp-dabancheng',
    name_ug: 'دابەنچىڭ 1-نومۇرلۇق دەرىجىدىن تاشقىرى چوڭ جازا لاگېرى',
    name_en: 'Dabancheng Mega Internment Complex (ASPI-DB-001)',
    lat: 43.355,
    lng: 88.291,
    description_ug: 'كۆلىمى 240,000 كۋادرات مېتىردىن ئاشىدىغان، خەلقئارالىق سۈنئىي ھەمراھلاردا دەلىللەنگەن شەرقىي تۈركىستاندىكى ئەڭ چوڭ يۇقىرى بىخەتەرلىك دەرىجىلىك لاگېر. ئېگىز سېپىللار، كۆزىتىش مۇنارلىرى ۋە تىكەنلىك سىملار بىلەن قورشالغان.',
    category: 'دەرىجىدىن تاشقىرى چوڭ لاگېر',
    categoryKey: 'human_rights',
    markerType: 'camp',
    color: 0xf97316,
    badge_ug: '⛓️ ئاشكارىلانغان لاگېر',
    sourceDoc_ug: 'ASPI شىنجاڭ سانلىق مەلۇمات پىلانى (Xinjiang Data Project) & BuzzFeed خەلقئارا پۇلىتزېر مۇكاپاتى تەھلىلى',
    coordinates_display: '43°21\'18"N, 88°17\'28"E'
  },
  {
    id: 'camp-shule-kashgar',
    name_ug: 'قەشقەر كونا شەھەر ۋە قاغىلىق چوڭ تىپتىكى جازا لاگېرى',
    name_en: 'Kashgar Shule & Yecheng High-Security Internment Facility',
    lat: 39.467,
    lng: 75.989,
    description_ug: 'قەشقەر ۋىلايىتى تەۋەسىدىكى ئەڭ كۆپ ئۇيغۇر پۇقرالىرى قامالغان يۇقىرى تېخنىكىلىق نازارەت كامېرا ۋە ئېلېكترلىك رېشاتكىلار بىلەن ئورالغان كۆپ بۆلەكتىن تەركىب تاپقان لاگېر توپلىمى.',
    category: 'يۇقىرى بىخەتەرلىك لاگېرى',
    categoryKey: 'human_rights',
    markerType: 'camp',
    color: 0xf97316,
    badge_ug: '⛓️ ئاشكارىلانغان لاگېر',
    sourceDoc_ug: 'ASPI ID: ASPI-KS-014 & شىنجاڭ ساقچى ھۆججەتلىرى (Xinjiang Police Files)',
    coordinates_display: '39°28\'01"N, 75°59\'20"E'
  },
  {
    id: 'camp-ghulja-yining',
    name_ug: 'غۇلجا قارادۆڭ ۋە باياندەي لاگېر-زاۋۇت مەركىزى',
    name_en: 'Ghulja (Yining) Bayandai Detention Camp & Labor Facility',
    lat: 43.921,
    lng: 81.332,
    description_ug: 'ئىلى قازاق ئاپتونوم ئوبلاستىدىكى غۇلجا شەھىرى تەۋەسىگە جايلاشقان. كۆپ ساندىكى ئوقۇتقۇچى، يازغۇچى ۋە سەرخىللار تۇتۇپ تۇرۇلۇۋاتقان ھەم يانداش مەجبۇرىي توقۇمىچىلىق زاۋۇتلىرى بىلەن تۇتاشتۇرۇلغان لاگېر.',
    category: 'لاگېر & مەجبۇرىي ئەمگەك',
    categoryKey: 'human_rights',
    markerType: 'camp',
    color: 0xf97316,
    badge_ug: '⛓️ ئاشكارىلانغان لاگېر',
    sourceDoc_ug: 'ASPI ID: ASPI-YI-008 & رادىئو ئەركىن ئاسىيا (RFA Uyghur) مەخسۇس ئېنىقلاشلىرى',
    coordinates_display: '43°55\'15"N, 81°19\'55"E'
  },
  {
    id: 'camp-hotan-lop',
    name_ug: 'خوتەن لوپ چوڭ تىپتىكى لاگېر-زاۋۇت شەھەرچىسى',
    name_en: 'Hotan Lop County Massive Internment & Factory Complex',
    lat: 37.072,
    lng: 80.183,
    description_ug: 'تەكلىماكان چۆلىنىڭ گىرۋىكىگە جايلاشقان. خەلقئارا تاراتقۇلار نەق مەيداندىن سۈنئىي ھەمراھ كۆرۈنۈشلىرى ئارقىلىق دەلىللىگەن، مەجبۇرىي ئاياغ-كىيىم ۋە پۈتكۈل تەمىنات زەنجىرىگە باغلانغان ئەڭ چوڭ لاگېرلارنىڭ بىرى.',
    category: 'مەجبۇرىي ئەمگەك سانائەت لاگېرى',
    categoryKey: 'human_rights',
    markerType: 'camp',
    color: 0xf97316,
    badge_ug: '⛓️ ئاشكارىلانغان لاگېر',
    sourceDoc_ug: 'ASPI ID: ASPI-HT-022 & BBC News «China\'s Hidden Camps» سۈنئىي ھەمراھ تەكشۈرۈشى',
    coordinates_display: '37°04\'19"N, 80°10\'58"E'
  },
  {
    id: 'camp-aksu-onsu',
    name_ug: 'ئاقسۇ ئۇنسۇ يۇقىرى بىخەتەرلىك دەرىجىلىك لاگېرى',
    name_en: 'Aksu Onsu High-Security Detention Complex',
    lat: 41.173,
    lng: 80.264,
    description_ug: 'تەڭرىتاغ ئېتىكىدىكى ئۇنسۇ ناھىيەسى تەۋەسىدىكى پۈتۈنلەي قامالغان چوڭ تىپتىكى لاگېر. 4 قەۋەتلىك قاراۋۇل مۇنارلىرى، ئىچكى ساقچى بازىلىرى ۋە يۈز تونۇش كامېرا تورى بىلەن جابدۇلغان.',
    category: 'يۇقىرى بىخەتەرلىك لاگېرى',
    categoryKey: 'human_rights',
    markerType: 'camp',
    color: 0xf97316,
    badge_ug: '⛓️ ئاشكارىلانغان لاگېر',
    sourceDoc_ug: 'ASPI ID: ASPI-AK-005 & گېرمانىيە تاشقى سىياسەت ئىنستىتۇتى ھۆججەتلىرى',
    coordinates_display: '41°10\'22"N, 80°15\'50"E'
  },
  {
    id: 'camp-urumqi-prison3',
    name_ug: 'ئۈرۈمچى 3-تۈرمە ۋە غوللۇق سىياسىي جازا مەركىزى',
    name_en: 'Urumqi No. 3 Prison & Political Detention Complex',
    lat: 43.825,
    lng: 87.618,
    description_ug: 'ئۈرۈمچى شەھەر سىرتىدىكى ئەڭ يۇقىرى دەرىجىدىكى تۈرمە-لاگېر سىستېمىسى. داڭلىق ئۇيغۇر ئالىملىرى، يازغۇچىلىرى ۋە سىياسىي تۇتقۇنلار ساقلىنىۋاتقان ئەڭ قاتتىق كونتروللۇقتىكى مەركەز.',
    category: 'سىياسىي تۈرمە-لاگېر',
    categoryKey: 'human_rights',
    markerType: 'camp',
    color: 0xf97316,
    badge_ug: '⛓️ ئاشكارىلانغان لاگېر',
    sourceDoc_ug: 'ب د ت كىشىلىك ھوقۇق ئالىي كومىسسارلىقى (OHCHR) ئۇيغۇر رايونى دوكلاتى & ASPI-UR-002',
    coordinates_display: '43°49\'30"N, 87°37\'04"E'
  },
  {
    id: 'camp-korla',
    name_ug: 'كورلا ۋە چەرچەن توقۇمىچىلىق لاگېر سانائەت توپلىمى',
    name_en: 'Korla Textile & Industrial Internment Compound',
    lat: 41.722,
    lng: 86.155,
    description_ug: 'بايىنغولىن ئوبلاستىدىكى پىششىقلاپ ئىشلەش كارخانىلىرى بىلەن بىر گەۋدىلەشكەن سېخ-لاگېر سېستىمىسى. مىڭلىغان تۇتقۇنلار مەجبۇرىي ئەمگەك ئارقىلىق پاختا يىپىش مەيدانلىرىغا ئورۇنلاشتۇرۇلغان.',
    category: 'مەجبۇرىي ئەمگەك زاۋۇت لاگېرى',
    categoryKey: 'human_rights',
    markerType: 'camp',
    color: 0xf97316,
    badge_ug: '⛓️ ئاشكارىلانغان لاگېر',
    sourceDoc_ug: 'ASPI ID: ASPI-KR-009 & ئۇيغۇر مەجبۇرىي ئەمگىكىنىڭ ئالدىنى ئېلىش قانۇنى (UFLPA) مەلۇماتى',
    coordinates_display: '41°43\'19"N, 86°09\'18"E'
  },
  {
    id: 'camp-yarkand',
    name_ug: 'يەكەن چوڭ تىپتىكى جازا لاگېرى قورغىنى',
    name_en: 'Yarkand Major Concentration Facility & Fortress',
    lat: 38.416,
    lng: 77.249,
    description_ug: 'يەكەن ناھىيەسى تەۋەسىدىكى ئەڭ قورغانلاشقان لاگېرلارنىڭ بىرى. سۈنئىي ھەمراھتىن كۆزىتىلگەن نۇرغۇن تۇتقۇن باراقلىرى، كۆزىتىش كۆتۈرمىلىرى ۋە تىكەنلىك سىم تورلىرى تەپسىلىي بايقالغان.',
    category: 'قورغانلاشقان جازا لاگېرى',
    categoryKey: 'human_rights',
    markerType: 'camp',
    color: 0xf97316,
    badge_ug: '⛓️ ئاشكارىلانغان لاگېر',
    sourceDoc_ug: 'ASPI ID: ASPI-YK-003 & Australian Strategic Policy Institute سۈنئىي ھەمراھ تەھلىلى',
    coordinates_display: '38°24\'57"N, 77°14\'56"E'
  },

  // ==========================================
  // 3. يىپەك يولى ۋە ئىقتىسادىي كارىدورلار (Gold / Cyan 🌟)
  // ==========================================
  {
    id: 'silk-kashgar',
    name_ug: 'قەشقەر (يىپەك يولىنىڭ جۇغراپىيىلىك يۈرىكى)',
    name_en: 'Kashgar (Historic Silk Road & Middle Corridor Nexus)',
    lat: 39.470,
    lng: 75.990,
    description_ug: 'تارىختىن بۇيان قۇرۇقلۇق يىپەك يولىنىڭ شىمالىي، جەنۇبىي تۈگۈنى بولغان ئوتتۇرا ئاسىيا بىلەن غەربنى تۇتاشتۇرىدىغان ئەڭ قەدىمىي ئۇيغۇر مەدەنىيەت ۋە سودا مەركىزى.',
    category: 'يىپەك يولى ئالتۇن تۈگۈنى',
    categoryKey: 'geopolitics',
    markerType: 'silk_road',
    color: 0xf59e0b,
    badge_ug: '🌟 يىپەك يولى مەركىزى',
    sourceDoc_ug: 'تارىخىي يىپەك يولى كارىدورى پىلانى & يەر شارى قاتناش قۇرۇلمىسى',
    coordinates_display: '39°28\'12"N, 75°59\'24"E'
  },
  {
    id: 'silk-samarkand',
    name_ug: 'سەمەرقەنت & بۇخارا (ئوتتۇرا ئاسىيا تۈرك تۈگۈنى)',
    name_en: 'Samarkand & Bukhara (Central Asian Silk Corridor)',
    lat: 39.654,
    lng: 66.975,
    description_ug: 'ئوتتۇرا ئاسىيانىڭ قەدىمىي سودا ۋە مائارىپ مەركىزى، ھازىرقى تۈرك دۆلەتلىرى ئوتتۇرا كارىدورىنىڭ ئەڭ مۇھىم ئەشيا ئوبوروت بازىسى.',
    category: 'ئوتتۇرا كارىدور تۈگۈنى',
    categoryKey: 'economy',
    markerType: 'silk_road',
    color: 0xf59e0b,
    badge_ug: '🌟 يىپەك يولى مەركىزى',
    sourceDoc_ug: 'تۈرك دۆلەتلىرى تەشكىلاتى تىرانسپورت مىنىستىرلار كېلىشىمى',
    coordinates_display: '39°39\'15"N, 66°57\'35"E'
  },
  {
    id: 'silk-xian',
    name_ug: 'چاڭئەن / شىئەن (قەدىمىي قۇرۇقلۇق يىپەك يولى باشلىنىشى)',
    name_en: 'Xi\'an / Chang\'an (Ancient Overland Silk Road Gateway)',
    lat: 34.265,
    lng: 108.940,
    description_ug: 'مىڭ يىللىق قەدىمىي يىپەك يولى كارۋانلىرى غەربكە قاراپ سەپەر قوزغىغان تارىخىي كىرىش دەرۋازىسى.',
    category: 'قەدىمىي سودا باشلىنىشى',
    categoryKey: 'economy',
    markerType: 'silk_road',
    color: 0xf59e0b,
    badge_ug: '🌟 يىپەك يولى مەركىزى',
    sourceDoc_ug: 'UNESCO دۇنيا مەدەنىيەت مىراسلىرى يىپەك يولى ئارخىپى',
    coordinates_display: '34°15\'54"N, 108°56\'24"E'
  },
  {
    id: 'silk-istanbul',
    name_ug: 'ئىستانبۇل & تۈركىيە (ياۋرو-ئاسىيا ئالتۇن كۆۋرۈكى)',
    name_en: 'Istanbul (Silk Road Bosphorus Bridge to Europe)',
    lat: 41.010,
    lng: 28.970,
    description_ug: 'قارا دېڭىز ۋە مەرمەرە بوغۇزىنى تۇتاشتۇرىدىغان، قۇرۇقلۇق ۋە دېڭىز يىپەك يولىنىڭ ياۋروپا چوڭ قۇرۇقلۇقىغا كىرىدىغان ئەڭ غوللۇق سودا تۈگۈنى.',
    category: 'ياۋرو-ئاسىيا سودا كۆۋرۈكى',
    categoryKey: 'diplomacy',
    markerType: 'silk_road',
    color: 0x10b981,
    badge_ug: '🌟 يىپەك يولى مەركىزى',
    sourceDoc_ug: 'تۈركىيە تاشقى ئىشلار مىنىستىرلىكى ئوتتۇرا كارىدور خەلقئارا ئىستراتېگىيەسى',
    coordinates_display: '41°00\'36"N, 28°58\'12"E'
  },
  {
    id: 'silk-hormuz',
    name_ug: 'ھورمۇز بوغۇزى & پارس قولتۇقى (ئېنېرگىيە ئۆتكىلى)',
    name_en: 'Strait of Hormuz (Maritime Energy Artery)',
    lat: 26.560,
    lng: 56.250,
    description_ug: 'دۇنيا دېڭىز نېفىت تىرانسپورتىنىڭ 20% تىن كۆپرەكى ئۆتىدىغان، دېڭىز يىپەك يولى ۋە ئېنېرگىيە بىخەتەرلىكىنىڭ ئەڭ ھايات-ماماتلىق قىسىقى.',
    category: 'دېڭىز ئېنېرگىيە تومۇرى',
    categoryKey: 'economy',
    markerType: 'silk_road',
    color: 0x06b6d4,
    badge_ug: '🌟 دېڭىز يىپەك يولى',
    sourceDoc_ug: 'خەلقئارا ئېنېرگىيە ئاگېنتلىقى (IEA) نېفىت ئۆتكەل دوكلاتى',
    coordinates_display: '26°33\'36"N, 56°15\'00"E'
  },
  {
    id: 'silk-malacca',
    name_ug: 'مالاككا بوغۇزى & سىنگاپور (دۇنيا سودا تومۇرى)',
    name_en: 'Malacca Strait & Singapore (Maritime Crossroads)',
    lat: 2.200,
    lng: 102.250,
    description_ug: 'ھىندى ئوكيان بىلەن تىنچ ئوكياننى تۇتاشتۇرىدىغان، دۇنيا خەلقئارالىق سودا كېمىلىرىنىڭ 60% تىن كۆپرەكى ئۆتىدىغان ئەڭ قىستاڭ دېڭىز قاتناش بويۇنتۇرىقى.',
    category: 'دېڭىز قىسماق تومۇرى',
    categoryKey: 'economy',
    markerType: 'silk_road',
    color: 0x06b6d4,
    badge_ug: '🌟 دېڭىز يىپەك يولى',
    sourceDoc_ug: 'خەلقئارا دېڭىز تەشكىلاتى (IMO) دېڭىز تىرانسپورت لىنىيە كۆرسەتكۈچى',
    coordinates_display: '02°12\'00"N, 102°15\'00"E'
  },

  // ==========================================
  // 4. خەلقئارالىق گېئوپولىتىكىلىق رىقابەت مەركەزلىرى (Sky Blue 🌐)
  // ==========================================
  {
    id: 'tw',
    name_ug: 'تەيۋەن بوغۇزى (يېرىم ئۆتكۈزگۈچ چىپ مەركىزى)',
    name_en: 'Taiwan Strait (Semiconductors & Indo-Pacific Deterrence)',
    lat: 23.500,
    lng: 121.000,
    description_ug: 'دۇنيادىكى ئەڭ ئىلغار 2nm مىكرو ئېلېكترون چىپ ئىشلەپچىقىرىشنىڭ يادرولۇق تېخنىكا بازىسى ۋە چوڭ كۈچلەر ئوتتۇرىسىدىكى دېڭىز بىخەتەرلىك مەركىزى.',
    category: 'تېخنىكا كۈرىشى',
    categoryKey: 'technology',
    markerType: 'hotspot',
    color: 0x38bdf8,
    badge_ug: '🌐 گېئوپولىتىكىلىق مەركەز',
    sourceDoc_ug: 'Foreign Policy & CSIS Semiconductor Security Initiative',
    coordinates_display: '23°30\'00"N, 121°00\'00"E'
  },
  {
    id: 'ca',
    name_ug: 'ئوتتۇرا كارىدور (كاسپىي ۋە تۈرك دۆلەتلىرى)',
    name_en: 'Middle Corridor & Trans-Caspian Transit Route',
    lat: 42.000,
    lng: 55.000,
    description_ug: 'خىتاينى چەتكە قاققان ھالدا ئوتتۇرا ئاسىيا ۋە ياۋروپانى تۇتاشتۇرىدىغان تۈرك دۆلەتلىرىنىڭ يېڭى مۇستەقىل ئىستراتېگىيەلىك قاتناش سىستېمىسى.',
    category: 'ئېنېرگىيە & تىرانسپورت',
    categoryKey: 'geopolitics',
    markerType: 'hotspot',
    color: 0x38bdf8,
    badge_ug: '🌐 گېئوپولىتىكىلىق مەركەز',
    sourceDoc_ug: 'The Diplomat: Central Asian Corridors and Strategic Autonomy',
    coordinates_display: '42°00\'00"N, 55°00\'00"E'
  },
  {
    id: 'eu',
    name_ug: 'برىيۇسسېل & ياۋروپا ئىتتىپاقى (ھوقۇق ۋە ئېمبارگو)',
    name_en: 'Brussels (European Union Human Rights & Sanctions Headquarters)',
    lat: 50.850,
    lng: 4.350,
    description_ug: 'خەلقئارا ئەدلىيە، مەجبۇرىي ئەمگەك تاۋارلىرىنى مەنئى قىلىش بەلگىلىمىسى ۋە خىتاي شىركەتلىرىگە قارىتىلغان دۇنياۋى تەمىنات زەنجىرى ئېمبارگولىرىنىڭ قارارگاھى.',
    category: 'دىپلوماتىيە & ھوقۇق',
    categoryKey: 'human_rights',
    markerType: 'hotspot',
    color: 0x38bdf8,
    badge_ug: '🌐 گېئوپولىتىكىلىق مەركەز',
    sourceDoc_ug: 'ياۋروپا پارلامېنتى مەجبۇرىي ئەمگەك بەلگىلىمىسى & ب د ت كىشىلىك ھوقۇق ئارخىپى',
    coordinates_display: '50°51\'00"N, 04°21\'00"E'
  },
  {
    id: 'us',
    name_ug: 'ۋاشىنگتون (ئامېرىكا ئىستراتېگىيەلىك ئىتتىپاقى)',
    name_en: 'Washington D.C. (Indo-Pacific & Global Security Alliances)',
    lat: 38.900,
    lng: -77.030,
    description_ug: 'ھىندى-تىنچ ئوكيان دېموكراتىك قالقىنى، ئۇيغۇر مەجبۇرىي ئەمگىكىنىڭ ئالدىنى ئېلىش قانۇنى (UFLPA) ۋە دۇنياۋى ئەركىنلىك ئىتتىپاقلىرىنىڭ قارارگاھى.',
    category: 'دۇنياۋى ئىتتىپاق',
    categoryKey: 'diplomacy',
    markerType: 'hotspot',
    color: 0x38bdf8,
    badge_ug: '🌐 گېئوپولىتىكىلىق مەركەز',
    sourceDoc_ug: 'ئامېرىكا دۆلەت مەجلىسى UFLPA قانۇنى & دۆلەت بىخەتەرلىك ئىستراتېگىيەسى',
    coordinates_display: '38°54\'00"N, 77°01\'48"W'
  }
];

// Coordinate to 3D Sphere Vector
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

/**
 * Creates high-detail realistic procedural world map canvas texture
 * Features continents, desert terrain, snow peaks, coastal shelves and geopolitical lines
 */
function createRealisticWorldMapCanvas(): HTMLCanvasElement {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. Deep Ocean Base with Bathymetric Gradients
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#040b17');
  oceanGrad.addColorStop(0.3, '#07152b');
  oceanGrad.addColorStop(0.5, '#0b1e3b');
  oceanGrad.addColorStop(0.7, '#07152b');
  oceanGrad.addColorStop(1, '#040b17');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Ocean wave micro-grid
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
  ctx.lineWidth = 1;
  for (let lat = -80; lat <= 80; lat += 20) {
    const y = ((90 - lat) / 180) * height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  for (let lng = -180; lng <= 180; lng += 30) {
    const x = ((lng + 180) / 360) * width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Projection helper: lat/lng to canvas x/y
  const toXY = (lng: number, lat: number): [number, number] => [
    ((lng + 180) / 360) * width,
    ((90 - lat) / 180) * height
  ];

  // Draw continent polygon helper
  const drawLandmass = (
    coords: [number, number][],
    fillColor: string,
    shelfColor: string = 'rgba(56, 189, 248, 0.25)'
  ) => {
    if (coords.length < 3) return;

    // Coastal shelf glow
    ctx.beginPath();
    const [startLng, startLat] = coords[0];
    const [sx, sy] = toXY(startLng, startLat);
    ctx.moveTo(sx, sy);
    for (let i = 1; i < coords.length; i++) {
      const [lng, lat] = coords[i];
      const [x, y] = toXY(lng, lat);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.lineWidth = 14;
    ctx.strokeStyle = shelfColor;
    ctx.stroke();

    // Solid landmass
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.stroke();
  };

  // --- Real World Continents Geometric Outlines ---

  // 1. Eurasia (Europe, Russia, Central Asia, Middle East, India, China, East Turkistan)
  drawLandmass([
    [-9, 36], [-9, 43], [-1, 44], [-4, 48], [-1, 50], [8, 54], [10, 57], [18, 59],
    [25, 71], [40, 68], [60, 70], [80, 73], [100, 77], [120, 74], [140, 72], [170, 67],
    [180, 65], [170, 60], [140, 48], [130, 32], [122, 30], [120, 22], [108, 18], [103, 10],
    [98, 4], [90, 22], [80, 16], [77, 8], [72, 18], [68, 24], [60, 25], [56, 26],
    [50, 13], [44, 12], [40, 22], [35, 31], [27, 37], [22, 38], [14, 40], [4, 43],
    [-2, 37], [-6, 36]
  ], '#1e3328');

  // British Isles & Scandinavia
  drawLandmass([[-5, 50], [1, 51], [0, 58], [-6, 56], [-5, 50]], '#243e30');
  drawLandmass([[5, 58], [10, 63], [18, 69], [28, 70], [24, 62], [12, 56], [5, 58]], '#2b4435');

  // 2. East Turkistan (Tarim Basin & Junggar Basin) & Central Asia (Desert Gold & Mountain Relief)
  drawLandmass([
    [73, 37], [75, 40], [80, 44], [87, 45], [94, 44], [96, 42], [90, 39], [86, 36],
    [80, 35], [74, 36], [73, 37]
  ], '#b48a3c', 'rgba(245, 158, 11, 0.4)');

  // Caspian & Aral Sea Water Inlays
  drawLandmass([[47, 47], [53, 44], [52, 37], [49, 37], [47, 41], [47, 47]], '#07152b', 'transparent');
  drawLandmass([[58, 46], [61, 45], [60, 43], [58, 44], [58, 46]], '#07152b', 'transparent');

  // 3. Africa
  drawLandmass([
    [-5, 36], [10, 37], [25, 32], [32, 31], [33, 27], [43, 12], [51, 11], [48, 5],
    [40, -4], [35, -15], [32, -28], [26, -34], [18, -34], [12, -20], [8, -5], [3, 5],
    [-15, 12], [-17, 15], [-17, 21], [-13, 28], [-5, 36]
  ], '#2a3a28');

  // Sahara Desert Overlay on Africa
  drawLandmass([
    [-14, 20], [33, 22], [34, 30], [-5, 33], [-14, 26], [-14, 20]
  ], '#a17d3b', 'transparent');

  // Madagascar
  drawLandmass([[44, -12], [50, -15], [47, -25], [43, -25], [44, -12]], '#243e30');

  // 4. North America
  drawLandmass([
    [-168, 65], [-160, 71], [-130, 70], [-90, 73], [-80, 62], [-65, 45], [-75, 35],
    [-80, 25], [-90, 30], [-97, 26], [-97, 19], [-85, 13], [-80, 8], [-77, 7],
    [-85, 14], [-105, 22], [-117, 32], [-124, 40], [-125, 50], [-140, 60], [-165, 55],
    [-168, 65]
  ], '#1f382a');

  // Greenland
  drawLandmass([[-50, 60], [-20, 70], [-25, 82], [-60, 82], [-50, 60]], '#d1d5db', 'rgba(255, 255, 255, 0.4)');

  // 5. South America
  drawLandmass([
    [-77, 8], [-60, 10], [-50, 0], [-35, -5], [-35, -12], [-40, -22], [-50, -32],
    [-65, -55], [-75, -50], [-72, -40], [-70, -20], [-80, -5], [-77, 8]
  ], '#183322');

  // 6. Australia & New Zealand
  drawLandmass([
    [114, -22], [125, -15], [135, -12], [142, -11], [150, -22], [153, -28], [150, -38],
    [138, -35], [128, -32], [115, -34], [113, -25], [114, -22]
  ], '#9c7333');

  // 7. Antarctica (Snow continent)
  drawLandmass([
    [-180, -75], [180, -75], [180, -90], [-180, -90]
  ], '#e2e8f0', 'rgba(255, 255, 255, 0.6)');

  // 8. Silk Road Historical Trade Lines (Glowing Orange Paths on Canvas)
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  const silkCoords: [number, number][] = [
    [116, 40], // Beijing / Chang'an
    [103, 36], // Lanzhou
    [94, 40],  // Dunhuang
    [82, 41],  // East Turkistan (Kashgar & Silk Hub)
    [69, 41],  // Tashkent / Samarkand
    [59, 36],  // Tehran / Merv
    [44, 33],  // Baghdad
    [32, 39],  // Istanbul / Constantinople
    [14, 41],  // Rome
    [4, 50]    // Western Europe
  ];
  const [firstX, firstY] = toXY(silkCoords[0][0], silkCoords[0][1]);
  ctx.moveTo(firstX, firstY);
  for (let i = 1; i < silkCoords.length; i++) {
    const [x, y] = toXY(silkCoords[i][0], silkCoords[i][1]);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  // City Node Lights
  silkCoords.forEach(([lng, lat]) => {
    const [cx, cy] = toXY(lng, lat);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(245, 158, 11, 0.6)';
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.fill();
  });

  // 9. Topographic Relief: Mountain Ranges & High Elevation Ridges
  // High-altitude mountain ridges with hypsometric relief & snowy peaks
  const drawMountainRange = (points: [number, number][], color: string, snowColor: string = '#f8fafc') => {
    if (points.length < 2) return;
    ctx.save();
    ctx.beginPath();
    const [sLng, sLat] = points[0];
    const [sx, sy] = toXY(sLng, sLat);
    ctx.moveTo(sx, sy);
    for (let i = 1; i < points.length; i++) {
      const [lng, lat] = points[i];
      const [x, y] = toXY(lng, lat);
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Snow-capped peak ridge line
    ctx.strokeStyle = snowColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  };

  // Tian Shan Mountain System (تەڭرىتاغ تىزمىسى)
  drawMountainRange([
    [74, 42], [76, 42.5], [80, 42], [84, 43], [88, 43.5], [92, 43]
  ], '#78350f', '#ffffff');

  // Pamir Knot & Karakoram (پامىر ئېگىزلىكى ۋە قارا قۇرۇم)
  drawMountainRange([
    [71, 38], [73, 38.5], [75, 37], [76, 36], [78, 35.5]
  ], '#5c2207', '#ffffff');

  // Kunlun Mountains (تەكلىماكان جەنۇبى كۇئېنلۇن)
  drawMountainRange([
    [76, 36], [82, 36.5], [88, 37], [94, 36.5]
  ], '#6c2e09', '#f1f5f9');

  // Himalayas (ھىمالايا تېغى)
  drawMountainRange([
    [74, 35], [78, 31], [83, 29], [88, 28], [94, 28]
  ], '#451a03', '#ffffff');

  // Hindu Kush (ھىندىقۇش)
  drawMountainRange([[68, 35], [71, 36], [73, 37]], '#713f12', '#ffffff');

  // Caucasus Mountains (كافكاز تېغى)
  drawMountainRange([[40, 43], [44, 42.5], [48, 41]], '#78350f', '#f8fafc');

  // Alps (ياۋروپا ئالپ تاغلىرى)
  drawMountainRange([[6, 45], [9, 46.5], [13, 47]], '#78350f', '#ffffff');

  // Andes (ئەندىس تېغى)
  drawMountainRange([[-70, 8], [-74, -5], [-72, -18], [-70, -32], [-72, -45]], '#5c2207', '#ffffff');

  // Rocky Mountains (ئامېرىكا قىيا تاش تاغلىرى)
  drawMountainRange([[-120, 56], [-115, 50], [-110, 42], [-106, 35]], '#713f12', '#ffffff');

  // 10. Major Strategic Rivers (Tarim, Amu Darya, Syr Darya, Nile, Yangtze)
  const drawRiver = (coords: [number, number][]) => {
    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    const [sx, sy] = toXY(coords[0][0], coords[0][1]);
    ctx.moveTo(sx, sy);
    for (let i = 1; i < coords.length; i++) {
      const [x, y] = toXY(coords[i][0], coords[i][1]);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  };

  // Tarim River (تارىم دەرياسى)
  drawRiver([[79, 40.5], [82, 41], [85, 41.2], [88, 40.5]]);
  // Amu Darya & Syr Darya
  drawRiver([[68, 37], [63, 40], [60, 43]]);
  drawRiver([[73, 41], [68, 44], [61, 45]]);
  // Nile
  drawRiver([[31, 31], [32, 25], [32, 15], [31, 5]]);

  // 11. Maritime Silk Road & Strategic Shipping Straits (Cyan dashed lanes)
  ctx.save();
  ctx.strokeStyle = '#06b6d4';
  ctx.setLineDash([6, 6]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  const maritimePath: [number, number][] = [
    [121, 31], // Shanghai
    [114, 22], // Hong Kong
    [103, 1.3], // Singapore / Malacca Strait
    [80, 6.9],  // Sri Lanka
    [58, 24],   // Arabian Sea / Hormuz approach
    [45, 12],   // Bab el-Mandeb
    [32, 30],   // Suez Canal
    [15, 36],   // Mediterranean
    [5, 36],    // Gibraltar
    [-4, 48]    // Western Europe
  ];
  const [msx, msy] = toXY(maritimePath[0][0], maritimePath[0][1]);
  ctx.moveTo(msx, msy);
  for (let i = 1; i < maritimePath.length; i++) {
    const [x, y] = toXY(maritimePath[i][0], maritimePath[i][1]);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  // 12. Topographic Elevation Legend (Bottom Left Corner)
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(30, height - 70, 260, 48, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('TOPOGRAPHIC ELEVATION CONTOUR', 42, height - 52);

  // Elevation color bar
  const elevBarGrad = ctx.createLinearGradient(42, 0, 270, 0);
  elevBarGrad.addColorStop(0, '#1e3328'); // 0m
  elevBarGrad.addColorStop(0.3, '#b48a3c'); // 1500m
  elevBarGrad.addColorStop(0.7, '#78350f'); // 4500m
  elevBarGrad.addColorStop(1, '#ffffff'); // 8000m
  ctx.fillStyle = elevBarGrad;
  ctx.fillRect(42, height - 42, 236, 8);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '9px monospace';
  ctx.fillText('0m', 42, height - 24);
  ctx.fillText('2000m', 110, height - 24);
  ctx.fillText('5000m', 185, height - 24);
  ctx.fillText('8848m', 250, height - 24);
  ctx.restore();

  return canvas;
}

/**
 * Creates dynamic cloud transparency texture
 */
function createCloudTextureCanvas(): HTMLCanvasElement {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, width, height);

  // Cloud bands
  ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
  for (let i = 0; i < 45; i++) {
    const x = Math.random() * width;
    const y = 80 + Math.random() * (height - 160);
    const radX = 40 + Math.random() * 90;
    const radY = 15 + Math.random() * 35;
    ctx.beginPath();
    ctx.ellipse(x, y, radX, radY, Math.random() * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

/**
 * Formatted Uyghur Geopolitical Analysis Markdown Renderer with scalable large fonts
 * "ۋە خەتلەر يوغانراق بولسۇن" تەلىپى بويىچە يۇقىرى ئوقۇشچانلىققا ئىگە ئالاھىدە چوڭ خەت نۇسخىلىرى
 */
function FormattedAnalysis({ text, fontSizeLevel }: { text: string; fontSizeLevel: 'normal' | 'large' | 'huge' | 'giant' }) {
  const sizeConfig = {
    normal: {
      body: 'text-[22px] leading-[2.3]',
      h2: 'text-[27px] font-extrabold',
      h3: 'text-[23px] font-bold',
      bullet: 'text-[22px] leading-[2.3]',
    },
    large: {
      body: 'text-[25px] leading-[2.4]',
      h2: 'text-[31px] font-extrabold',
      h3: 'text-[27px] font-bold',
      bullet: 'text-[25px] leading-[2.4]',
    },
    huge: {
      body: 'text-[29px] leading-[2.5]',
      h2: 'text-[36px] font-extrabold',
      h3: 'text-[31px] font-bold',
      bullet: 'text-[29px] leading-[2.5]',
    },
    giant: {
      body: 'text-[34px] leading-[2.6]',
      h2: 'text-[42px] font-extrabold',
      h3: 'text-[36px] font-bold',
      bullet: 'text-[34px] leading-[2.6]',
    }
  }[fontSizeLevel];

  const formatInline = (str: string) => {
    const escaped = str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return escaped.replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-300 font-bold">$1</strong>');
  };

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];

  const flushList = (keyPrefix: number) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${keyPrefix}`} className="space-y-3 my-3 bg-slate-900/70 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-inner">
          {currentList.map((item, idx) => (
            <li key={idx} className={`flex items-start gap-3 ${sizeConfig.bullet} text-slate-100`}>
              <span className="text-amber-400 select-none mt-1 shrink-0 font-bold text-lg">✦</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();
    if (!line) {
      flushList(idx);
      return;
    }

    if (line.startsWith('## ')) {
      flushList(idx);
      elements.push(
        <h2 key={`h2-${idx}`} className={`${sizeConfig.h2} text-amber-400 mt-6 mb-3 pb-2 border-b border-amber-500/30 flex items-center gap-2`}>
          <span>{line.replace(/^##\s*/, '')}</span>
        </h2>
      );
    } else if (line.startsWith('### ')) {
      flushList(idx);
      elements.push(
        <h3 key={`h3-${idx}`} className={`${sizeConfig.h3} text-sky-300 mt-5 mb-2.5 flex items-center gap-2`}>
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block shrink-0 shadow-sm shadow-sky-400/50" />
          <span>{line.replace(/^###\s*/, '')}</span>
        </h3>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      currentList.push(line.replace(/^[-*]\s*/, ''));
    } else {
      flushList(idx);
      elements.push(
        <p key={`p-${idx}`} className={`${sizeConfig.body} text-slate-200 my-3 text-justify font-normal`} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      );
    }
  });

  flushList(9999);

  return <div className="space-y-2">{elements}</div>;
}

export interface GeopoliticsGlobeProps {
  heightClassName?: string;
  activeCategoryFilter?: string;
  onSelectCategoryFilter?: (catId: string) => void;
  onSelectHotspotNews?: (hotspotId: string, categoryKey: string) => void;
  showCategoryTabs?: boolean;
}

export { HOTSPOTS };
export type { Hotspot };

export default function GeopoliticsGlobe3D({
  heightClassName = "h-[580px]",
  activeCategoryFilter,
  onSelectCategoryFilter,
  onSelectHotspotNews,
  showCategoryTabs = true
}: GeopoliticsGlobeProps = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot>(HOTSPOTS[0]);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(9);
  const [satelliteMode, setSatelliteMode] = useState<'satellite' | 'topographic' | 'night'>('satellite');
  const [isSatelliteInspectorOpen, setIsSatelliteInspectorOpen] = useState<boolean>(false);
  const [layerFilter, setLayerFilter] = useState<'all' | 'military_base' | 'camp' | 'silk_road' | 'hotspot'>('all');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(true);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const pinGroupRef = useRef<THREE.Group | null>(null);
  const silkRoad3DGroupRef = useRef<THREE.Group | null>(null);

  // Pop-up Modal Window and Gemini API States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalActiveTab, setModalActiveTab] = useState<'direct_map' | 'analysis'>('direct_map');
  const [directMapType, setDirectMapType] = useState<'satellite' | 'street'>('satellite');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisText, setAnalysisText] = useState<string>('');
  const [analysisCache, setAnalysisCache] = useState<Record<string, string>>({});
  // Large font by default to satisfy "ۋە خەتلەر يوغانراق بولسۇن" on high-res screens
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'huge' | 'giant'>('huge');
  const [copied, setCopied] = useState<boolean>(false);

  // Ref to invoke modal callback from inside Three.js event listeners without recreating scene
  const openModalRef = useRef<(spot: Hotspot) => void>(() => {});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070b14, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, zoomLevel);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 2. High-Fidelity Studio Lighting
    const sunLight = new THREE.DirectionalLight(0xfff6ea, 2.8);
    sunLight.position.set(8, 5, 8);
    scene.add(sunLight);

    const skyLight = new THREE.HemisphereLight(0x38bdf8, 0x070b14, 1.4);
    scene.add(skyLight);

    const rimGold = new THREE.PointLight(0xf59e0b, 2.2, 16);
    rimGold.position.set(-7, -2, 5);
    scene.add(rimGold);

    // 3. Composite Globe Root Group
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // Part 1: High-Definition Photorealistic NASA Satellite Earth / Topographic Map Sphere
    const textureLoader = new THREE.TextureLoader();
    const satelliteTexture = textureLoader.load('/assets/earth_satellite.jpg');
    satelliteTexture.colorSpace = THREE.SRGBColorSpace;
    satelliteTexture.wrapS = THREE.RepeatWrapping;
    satelliteTexture.wrapT = THREE.ClampToEdgeWrapping;

    const cloudsTexture = textureLoader.load('/assets/earth_clouds.jpg');
    cloudsTexture.colorSpace = THREE.SRGBColorSpace;
    cloudsTexture.wrapS = THREE.RepeatWrapping;

    const lightsTexture = textureLoader.load('/assets/earth_lights.jpg');
    lightsTexture.colorSpace = THREE.SRGBColorSpace;
    lightsTexture.wrapS = THREE.RepeatWrapping;

    const specularTexture = textureLoader.load('/assets/earth_specular.jpg');
    specularTexture.wrapS = THREE.RepeatWrapping;

    // Topographic Canvas Texture (Relief, Mountain Ridges, Elevation Gradients)
    const topoCanvas = createRealisticWorldMapCanvas();
    const topoTexture = new THREE.CanvasTexture(topoCanvas);
    topoTexture.colorSpace = THREE.SRGBColorSpace;
    topoTexture.wrapS = THREE.RepeatWrapping;
    topoTexture.wrapT = THREE.ClampToEdgeWrapping;

    let activeMap: THREE.Texture<any> = satelliteTexture;
    let activeRoughness = 0.65;
    let activeMetalness = 0.1;
    let activeEmissive = new THREE.Color(0x061122);
    let activeEmissiveMap: THREE.Texture | null = null;
    let activeEmissiveIntensity = 0.25;

    if (satelliteMode === 'topographic') {
      activeMap = topoTexture;
      activeRoughness = 0.88;
      activeMetalness = 0.05;
      activeEmissive = new THREE.Color(0x0a1628);
      activeEmissiveIntensity = 0.35;
    } else if (satelliteMode === 'night') {
      activeMap = lightsTexture;
      activeRoughness = 0.9;
      activeMetalness = 0.1;
      activeEmissive = new THREE.Color(0xffe89e);
      activeEmissiveMap = lightsTexture;
      activeEmissiveIntensity = 1.5;
    }

    const earthGeo = new THREE.SphereGeometry(3.0, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: activeMap,
      roughnessMap: satelliteMode === 'satellite' ? specularTexture : null,
      roughness: activeRoughness,
      metalness: activeMetalness,
      emissive: activeEmissive,
      emissiveMap: activeEmissiveMap,
      emissiveIntensity: activeEmissiveIntensity
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // Part 2: True Multi-layer Atmospheric Clouds (drifting above surface)
    const cloudGeo = new THREE.SphereGeometry(3.036, 64, 64);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: satelliteMode === 'topographic' ? 0.08 : satelliteMode === 'night' ? 0.22 : 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    globeGroup.add(cloudMesh);

    // Part 3: Equator & Latitude Grid
    const gridGeo = new THREE.SphereGeometry(3.06, 32, 16);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    globeGroup.add(gridMesh);

    // Part 4: Glowing Silk Road Orbital Corridor Ring
    const orbitRingGeo = new THREE.TorusGeometry(3.45, 0.022, 16, 100);
    const orbitRingMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = 0.85;
    orbitRing.rotation.y = 0.4;
    globeGroup.add(orbitRing);

    // Part 5: Atmospheric Outer Halo Glow
    const atmoGeo = new THREE.SphereGeometry(3.22, 32, 32);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.14,
      side: THREE.BackSide
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    globeGroup.add(atmoMesh);

    // Part 6: Geopolitical Hotspot Pins, Military Bases & Detention Camps Beacons
    const pinGroup = new THREE.Group();
    pinGroupRef.current = pinGroup;
    globeGroup.add(pinGroup);

    const clickableObjects: THREE.Object3D[] = [];

    HOTSPOTS.forEach(spot => {
      const pos = latLngToVector3(spot.lat, spot.lng, 3.03);

      // Pin needle stem - refined delicate height
      const stemHeight = spot.markerType === 'military_base' ? 0.22 : spot.markerType === 'camp' ? 0.20 : 0.18;
      const needleGeo = new THREE.CylinderGeometry(0.009, 0.009, stemHeight, 8);
      const needleMat = new THREE.MeshStandardMaterial({
        color: spot.color,
        emissive: spot.color,
        emissiveIntensity: 0.8,
        roughness: 0.2
      });
      const needle = new THREE.Mesh(needleGeo, needleMat);
      needle.userData = { hotspot: spot };

      let head: THREE.Object3D;

      if (spot.markerType === 'military_base') {
        // Red Military Radar Cone / Beacon (scaled to elegant pinpoint)
        const coneGeo = new THREE.ConeGeometry(0.055, 0.13, 4);
        const coneMat = new THREE.MeshStandardMaterial({
          color: 0xef4444,
          emissive: 0xef4444,
          emissiveIntensity: 1.8,
          roughness: 0.1,
          metalness: 0.6
        });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.position.y = stemHeight / 2 + 0.06;
        cone.rotation.x = Math.PI; // point downwards towards globe
        head = cone;
      } else if (spot.markerType === 'camp') {
        // Watchtower Cube + roof (Internment Camp) (scaled to fine pinpoint)
        const towerGroup = new THREE.Group();
        const boxGeo = new THREE.BoxGeometry(0.065, 0.065, 0.065);
        const boxMat = new THREE.MeshStandardMaterial({
          color: 0xf97316,
          emissive: 0xf97316,
          emissiveIntensity: 1.5,
          roughness: 0.2
        });
        const box = new THREE.Mesh(boxGeo, boxMat);
        const roofGeo = new THREE.ConeGeometry(0.06, 0.045, 4);
        const roofMat = new THREE.MeshStandardMaterial({
          color: 0xa855f7,
          emissive: 0xa855f7,
          emissiveIntensity: 1.6
        });
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.y = 0.045;
        towerGroup.add(box);
        towerGroup.add(roof);
        towerGroup.position.y = stemHeight / 2 + 0.04;
        head = towerGroup;
      } else if (spot.markerType === 'silk_road') {
        // Silk Road Golden Trade Hub Beacon (scaled to fine pinpoint)
        const silkGroup = new THREE.Group();
        const sphereGeo = new THREE.SphereGeometry(0.045, 16, 16);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: spot.color,
          emissive: spot.color,
          emissiveIntensity: 1.6,
          roughness: 0.1
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        const ringTorusGeo = new THREE.TorusGeometry(0.075, 0.010, 8, 24);
        const ringTorusMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          emissive: 0xf59e0b,
          emissiveIntensity: 1.2
        });
        const torus = new THREE.Mesh(ringTorusGeo, ringTorusMat);
        torus.rotation.x = Math.PI / 3;
        silkGroup.add(sphere);
        silkGroup.add(torus);
        silkGroup.position.y = stemHeight / 2 + 0.04;
        head = silkGroup;
      } else {
        // Global Hotspot Orb (scaled to fine pinpoint)
        const sphereGeo = new THREE.SphereGeometry(0.042, 16, 16);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: spot.color,
          emissive: spot.color,
          emissiveIntensity: 1.4,
          roughness: 0.1
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.position.y = stemHeight / 2 + 0.04;
        head = sphere;
      }

      head.userData = { hotspot: spot };

      // Precise hit-testing target (radius 0.18) for easy clicking
      const hitGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.y = stemHeight / 2 + 0.04;
      hitMesh.userData = { hotspot: spot };

      // Surface pulsating radar ring (scaled down to avoid obscuring continents)
      const ringOuter = spot.markerType === 'military_base' ? 0.09 : spot.markerType === 'camp' ? 0.08 : 0.065;
      const ringGeo = new THREE.RingGeometry(0.02, ringOuter, spot.markerType === 'camp' ? 8 : 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: spot.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.88
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(pos.clone().multiplyScalar(2));
      ringMesh.userData = { hotspot: spot, ring: true };
      globeGroup.add(ringMesh);

      const singlePin = new THREE.Group();
      singlePin.add(needle);
      singlePin.add(head);
      singlePin.add(hitMesh);
      singlePin.position.copy(pos);
      singlePin.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      singlePin.userData = { hotspot: spot, pinGroup: true };
      pinGroup.add(singlePin);

      clickableObjects.push(hitMesh, needle, ringMesh);
      if (head instanceof THREE.Mesh) clickableObjects.push(head);
      head.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.userData = { hotspot: spot };
          clickableObjects.push(child);
        }
      });
    });

    // Part 6.5: 3D Elevated Glowing Silk Road & Corridor Curves
    const silkRoad3DGroup = new THREE.Group();
    silkRoad3DGroupRef.current = silkRoad3DGroup;
    globeGroup.add(silkRoad3DGroup);

    const build3DCurvedRoute = (coords: [number, number][], color: number, tubeRadius: number = 0.010) => {
      if (coords.length < 2) return;
      const vectors = coords.map(([lat, lng]) => latLngToVector3(lat, lng, 3.048));
      const curve = new THREE.CatmullRomCurve3(vectors);
      const tubeGeo = new THREE.TubeGeometry(curve, 64, tubeRadius, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 1.1,
        roughness: 0.2,
        metalness: 0.7
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      tube.userData = { silkRoadRoute: true };
      silkRoad3DGroup.add(tube);
    };

    // 1. Overland Ancient Silk Road (Gold / Amber #f59e0b)
    build3DCurvedRoute([
      [34.26, 108.94], // Xi'an
      [40.14, 94.66],  // Dunhuang
      [42.95, 89.18],  // Turpan
      [43.82, 87.61],  // Urumqi
      [39.47, 75.99],  // Kashgar
      [39.65, 66.97],  // Samarkand
      [39.77, 64.42],  // Bukhara
      [35.68, 51.38],  // Tehran
      [41.01, 28.97],  // Istanbul
      [45.44, 12.31]   // Venice
    ], 0xf59e0b, 0.022);

    // 2. Middle Corridor / Trans-Caspian (Emerald Green #10b981)
    build3DCurvedRoute([
      [39.47, 75.99],  // Kashgar
      [40.51, 72.80],  // Osh
      [41.29, 69.24],  // Tashkent
      [40.40, 49.86],  // Baku / Caspian
      [41.71, 44.82],  // Tbilisi
      [39.93, 32.85],  // Ankara
      [41.01, 28.97]   // Istanbul
    ], 0x10b981, 0.020);

    // 3. Maritime Silk Road (Cyan #06b6d4)
    build3DCurvedRoute([
      [23.12, 113.26], // Guangzhou
      [2.20, 102.25],  // Malacca
      [6.92, 79.86],   // Colombo
      [25.12, 62.32],  // Gwadar
      [26.56, 56.25],  // Hormuz
      [11.59, 43.06],  // Djibouti
      [29.96, 32.55],  // Suez
      [35.0, 18.0]     // Mediterranean
    ], 0x06b6d4, 0.018);

    // Part 7: Ground Shadow Contact Plane
    const shadowGeo = new THREE.PlaneGeometry(7, 7);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 64;
    shadowCanvas.height = 64;
    const shadowCtx = shadowCanvas.getContext('2d');
    if (shadowCtx) {
      const grad = shadowCtx.createRadialGradient(32, 32, 4, 32, 32, 30);
      grad.addColorStop(0, 'rgba(4, 11, 23, 0.85)');
      grad.addColorStop(1, 'rgba(4, 11, 23, 0)');
      shadowCtx.fillStyle = grad;
      shadowCtx.fillRect(0, 0, 64, 64);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.75
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.y = -3.5;
    shadowMesh.rotation.x = -Math.PI / 2;
    scene.add(shadowMesh);

    // Initial orientation: Central Asia & East Turkistan in view
    globeGroup.rotation.y = 2.3;
    globeGroup.rotation.x = 0.32;

    // Interactive Drag Orbit Controls with Raycasting Click Detection
    let isDragging = false;
    let downX = 0;
    let downY = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotX = globeGroup.rotation.x;
    let targetRotY = globeGroup.rotation.y;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      downX = e.clientX;
      downY = e.clientY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - prevMouseX;
        const dy = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        targetRotY += dx * 0.006;
        targetRotX += dy * 0.006;
        targetRotX = Math.max(-1.25, Math.min(1.25, targetRotX));
      } else {
        // Hover raycast to show interactive pointer
        const rect = container.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const my = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(mx, my), camera);
        const hits = raycaster.intersectObjects(clickableObjects, true);
        container.style.cursor = hits.length > 0 ? 'pointer' : 'grab';
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      isDragging = false;
      const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
      // If minimal drag movement, treat as a direct zone click
      if (dist < 8) {
        const rect = container.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const my = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(mx, my), camera);
        const hits = raycaster.intersectObjects(clickableObjects, true);
        if (hits.length > 0) {
          for (const hit of hits) {
            if (hit.object.userData && hit.object.userData.hotspot) {
              const spot = hit.object.userData.hotspot as Hotspot;
              openModalRef.current(spot);
              break;
            }
          }
        }
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Responsive Canvas Resize
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Smooth Damped 60FPS Render Loop
    let animId: number;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      const dt = clock.getDelta();

      if (autoRotate && !isDragging) {
        targetRotY += 0.003;
      }

      // Smooth interpolation
      globeGroup.rotation.y += (targetRotY - globeGroup.rotation.y) * (1 - Math.exp(-6 * dt));
      globeGroup.rotation.x += (targetRotX - globeGroup.rotation.x) * (1 - Math.exp(-6 * dt));

      // Atmospheric cloud drift
      cloudMesh.rotation.y += 0.001;

      // Orbit ring slow rotation
      orbitRing.rotation.z += 0.004;

      renderer.render(scene, camera);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      renderer.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      satelliteTexture.dispose();
      cloudGeo.dispose();
      cloudMat.dispose();
      cloudsTexture.dispose();
      lightsTexture.dispose();
      specularTexture.dispose();
      gridGeo.dispose();
      gridMat.dispose();
      orbitRingGeo.dispose();
      orbitRingMat.dispose();
      atmoGeo.dispose();
      atmoMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTexture.dispose();
      topoTexture.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [autoRotate, zoomLevel, satelliteMode]);

  // Focus view onto a selected hotspot smoothly
  const handleSelectHotspot = (spot: Hotspot) => {
    setSelectedHotspot(spot);
    if (globeGroupRef.current) {
      // Calculate rotation angles to face this spot
      const targetY = -((spot.lng + 180) * (Math.PI / 180)) + Math.PI / 2;
      const targetX = spot.lat * (Math.PI / 180) * 0.4;
      globeGroupRef.current.rotation.y = targetY;
      globeGroupRef.current.rotation.x = targetX;
    }
  };

  // Fetch Geopolitical Analysis using Gemini API endpoint
  const fetchGeopoliticalAnalysis = async (spot: Hotspot, forceRefresh = false) => {
    if (!forceRefresh && analysisCache[spot.id]) {
      setAnalysisText(analysisCache[spot.id]);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisText('');

    try {
      const res = await fetch('/api/geopolitical-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regionId: spot.id,
          regionNameUg: spot.name_ug,
          regionNameEn: spot.name_en,
          lat: spot.lat,
          lng: spot.lng,
          category: spot.category,
          descriptionUg: spot.description_ug
        })
      });
      const data = await res.json();
      const text = data.analysis || spot.description_ug;
      setAnalysisText(text);
      setAnalysisCache(prev => ({ ...prev, [spot.id]: text }));
    } catch (err) {
      console.error('Failed to fetch geopolitical analysis:', err);
      setAnalysisText(`## 🌍 ${spot.name_ug}\n\n${spot.description_ug}\n\n- **ئورنى**: كېڭلىك ${spot.lat}°, ئۇزۇنلۇق ${spot.lng}°\n- **تۈرى**: ${spot.category}\n- **ئەھمىيىتى**: خەلقئارالىق تەمىنات زەنجىرى ۋە يىپەك يولى ئىستراتېگىيەلىك تۈگۈنى.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Open Pop-up Window for a Hotspot
  const handleOpenAnalysisModal = useCallback((spot: Hotspot) => {
    setSelectedHotspot(spot);
    setIsModalOpen(true);
    handleSelectHotspot(spot);
    fetchGeopoliticalAnalysis(spot);
  }, [analysisCache]);

  // Keep ref up to date
  openModalRef.current = handleOpenAnalysisModal;

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => {
      const next = Math.max(6.5, Math.min(13, prev + delta));
      if (cameraRef.current) {
        cameraRef.current.position.z = next;
      }
      return next;
    });
  };

  const handleCopyAnalysis = () => {
    if (!analysisText) return;
    navigator.clipboard.writeText(`${selectedHotspot.name_ug} — گېئوپولىتىكا تەھلىلى\n\n${analysisText}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    if (pinGroupRef.current) {
      pinGroupRef.current.children.forEach((child: any) => {
        if (child.userData && child.userData.hotspot) {
          const type = child.userData.hotspot.markerType;
          child.visible = layerFilter === 'all' || type === layerFilter;
        }
      });
    }
    if (silkRoad3DGroupRef.current) {
      silkRoad3DGroupRef.current.visible = layerFilter === 'all' || layerFilter === 'silk_road';
    }
  }, [layerFilter]);

  const visibleHotspots = HOTSPOTS.filter(s => {
    if (layerFilter !== 'all' && s.markerType !== layerFilter) return false;
    if (activeCategoryFilter && activeCategoryFilter !== 'all' && s.categoryKey !== activeCategoryFilter) return false;
    return true;
  });

  const displayHotspots = visibleHotspots.length > 0 ? visibleHotspots : HOTSPOTS;

  return (
    <div className={`GeopoliticsGlobe3D relative w-full ${heightClassName} rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col select-none`}>
      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Header */}
      <div className="absolute top-3 inset-x-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 backdrop-blur-md pointer-events-auto shadow-lg">
          <Satellite className="w-4 h-4 text-sky-400 animate-pulse" />
          <span className="text-xs font-bold text-white">
            {satelliteMode === 'topographic'
              ? '🗺️ توپوگرافىك خەرىتە (Topographic Map)'
              : satelliteMode === 'night'
              ? '🌃 كېچىلىك سۈنئىي ھەمراھ چىراغلىرى'
              : '3D سۈنئىي ھەمراھ يەرشارى (Satellite Earth)'}
          </span>
          <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-[10px]">
            <button
              onClick={() => setSatelliteMode('satellite')}
              className={`px-2.5 py-1 rounded cursor-pointer transition-all flex items-center gap-1 ${
                satelliteMode === 'satellite'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="NASA سۈنئىي ھەمراھ ھەقىقىي رەسىمى (Satellite Earth View)"
            >
              <span>🛰️</span>
              <span>سۈنئىي ھەمراھ</span>
            </button>
            <button
              onClick={() => setSatelliteMode('topographic')}
              className={`px-2.5 py-1 rounded cursor-pointer transition-all flex items-center gap-1 ${
                satelliteMode === 'topographic'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="ئېگىزلىك، تاغ تىزمىلىرى ۋە يىپەك يولى چېگرالىرى (Topographic Map View)"
            >
              <span>🗺️</span>
              <span>توپوگرافىك خەرىتە</span>
            </button>
            <button
              onClick={() => setSatelliteMode('night')}
              className={`px-2.5 py-1 rounded cursor-pointer transition-all flex items-center gap-1 ${
                satelliteMode === 'night'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="ئوربىتىدىن كۆرۈنگەن كېچىلىك سۈنئىي ھەمراھ چىراغلىرى (Night Lights)"
            >
              <span>🌃</span>
              <span>كېچىلىك</span>
            </button>
          </div>
        </div>

        {/* Viewport Control Tools & Satellite Inspector Trigger */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setIsSatelliteInspectorOpen(true)}
            className="px-2.5 py-1.5 rounded-lg border border-sky-500/50 bg-sky-950/80 hover:bg-sky-900 text-sky-300 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-all shadow-md shadow-sky-500/20"
            title="سۈنئىي ھەمراھتىن رايونلارنى يېقىندىن كۆزىتىش كۆزنىكىنى ئېچىش"
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>سۈنئىي ھەمراھتىن كۆزىتىش</span>
          </button>
          <button
            onClick={() => handleZoom(-1)}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-900/80 text-slate-300 hover:text-white cursor-pointer backdrop-blur-md"
            title="يېقىنلاشتۇرۇش"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(1)}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-900/80 text-slate-300 hover:text-white cursor-pointer backdrop-blur-md"
            title="يىراقلاشتۇرۇش"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setAutoRotate(prev => !prev)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-all shadow-md ${
              autoRotate
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="ئايلىنىشنى قوزغىتىش ياكى توختىتىش"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span className="text-[11px]">{autoRotate ? 'ئايلىنىشتا' : 'توختىتىلدى'}</span>
          </button>
        </div>
      </div>

      {/* Side Dock: Layer Filters & Hotspot Badges (Moved to Side to Keep Globe Center 100% Unobstructed) */}
      <div className="absolute top-14 right-3 bottom-3 z-20 pointer-events-none flex items-start">
        <div className={`transition-all duration-300 pointer-events-auto flex flex-col bg-slate-950/92 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden ${isSidePanelOpen ? 'w-64 max-h-full' : 'w-10'}`}>
          {/* Side Panel Header & Collapse Toggle */}
          <div className="p-2.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/90">
            {isSidePanelOpen ? (
              <>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>قاتلام & بەلگىلەر ({HOTSPOTS.length})</span>
                </div>
                <button
                  onClick={() => setIsSidePanelOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                  title="يان تاختىنى يىغىش"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsSidePanelOpen(true)}
                className="w-full py-2 flex flex-col items-center text-amber-400 hover:text-amber-300 cursor-pointer"
                title="يان تاختىنى ئېچىش"
              >
                <Layers className="w-4 h-4 mb-1" />
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {isSidePanelOpen && (
            <div className="flex-1 overflow-y-auto p-2.5 space-y-3.5 text-xs">
              {/* Layer Filter Buttons */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 px-1 mb-1">قاتلاملارنى تاللاش:</div>
                <button
                  onClick={() => setLayerFilter('all')}
                  className={`w-full text-right px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                    layerFilter === 'all'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <span>✨ ھەممىسى</span>
                  <span className="text-[10px] opacity-80">{HOTSPOTS.length}</span>
                </button>

                <button
                  onClick={() => setLayerFilter('military_base')}
                  className={`w-full text-right px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                    layerFilter === 'military_base'
                      ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-900/40 ring-1 ring-rose-400'
                      : 'text-rose-300 hover:text-white hover:bg-rose-950/40'
                  }`}
                  title="خىتاينىڭ خەلقئاراغا ئاشكارىلانغان ھەربىي بازىلىرى"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span>⚔️ خىتاي ھەربىي بازىلىرى</span>
                  </span>
                  <span className="text-[10px]">{HOTSPOTS.filter(s => s.markerType === 'military_base').length}</span>
                </button>

                <button
                  onClick={() => setLayerFilter('camp')}
                  className={`w-full text-right px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                    layerFilter === 'camp'
                      ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-900/40 ring-1 ring-amber-400'
                      : 'text-amber-300 hover:text-white hover:bg-amber-950/40'
                  }`}
                  title="شەرقىي تۈركىستاندا سۈنئىي ھەمراھلاردا دەلىللەنگەن جازا لاگېرلىرى"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>⛓️ تۈركىستان لاگېرلىرى</span>
                  </span>
                  <span className="text-[10px]">{HOTSPOTS.filter(s => s.markerType === 'camp').length}</span>
                </button>

                <button
                  onClick={() => setLayerFilter('silk_road')}
                  className={`w-full text-right px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                    layerFilter === 'silk_road'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400'
                      : 'text-emerald-300 hover:text-white hover:bg-emerald-950/40'
                  }`}
                  title="قۇرۇقلۇق ۋە دېڭىز يىپەك يولى ئالتۇن كارىدورى"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>🌟 يىپەك يولى</span>
                  </span>
                  <span className="text-[10px]">{HOTSPOTS.filter(s => s.markerType === 'silk_road').length}</span>
                </button>

                <button
                  onClick={() => setLayerFilter('hotspot')}
                  className={`w-full text-right px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                    layerFilter === 'hotspot'
                      ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-900/40 ring-1 ring-sky-400'
                      : 'text-sky-300 hover:text-white hover:bg-sky-950/40'
                  }`}
                  title="دۇنياۋى رىقابەت مەركەزلىرى"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    <span>🌐 گېئوپولىتىكا</span>
                  </span>
                  <span className="text-[10px]">{HOTSPOTS.filter(s => s.markerType === 'hotspot').length}</span>
                </button>
              </div>

              {/* Hotspot Locations List */}
              <div className="pt-2 border-t border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 px-1 mb-1.5 flex items-center justify-between">
                  <span>ئورۇنلار تىزىملىكى ({displayHotspots.length})</span>
                  <span className="text-[9px] text-amber-400">چەكسىڭىز يۆتكىلىدۇ</span>
                </div>
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                  {displayHotspots.map(spot => {
                    const active = selectedHotspot.id === spot.id;
                    return (
                      <button
                        key={spot.id}
                        onClick={() => handleOpenAnalysisModal(spot)}
                        className={`w-full text-right px-2 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                          active
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                            : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                        }`}
                        title={spot.description_ug}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: active ? '#0f172a' : `#${spot.color.toString(16).padStart(6, '0')}` }}
                          />
                          <span className="truncate">{spot.name_ug}</span>
                        </div>
                        <span className={`text-[9px] px-1 rounded shrink-0 font-mono ${active ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                          {spot.markerType === 'military_base' ? '⚔️' : spot.markerType === 'camp' ? '⛓️' : spot.markerType === 'silk_road' ? '🌟' : '🌐'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Hotspot Intelligence Brief Card - Positioned in the Bottom Left Corner */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-auto max-w-sm hidden sm:block">
        <div className="bg-slate-900/95 border border-amber-500/40 rounded-2xl p-3.5 backdrop-blur-md shadow-2xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
              {selectedHotspot.badge_ug || selectedHotspot.category}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {selectedHotspot.coordinates_display || `${selectedHotspot.lat}°N, ${selectedHotspot.lng}°E`}
            </span>
          </div>
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{selectedHotspot.name_ug}</span>
          </h4>
          <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
            {selectedHotspot.description_ug}
          </p>
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <button
              onClick={() => handleOpenAnalysisModal(selectedHotspot)}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>خەرىتە ۋە تولۇق تەھلىلنى ئېچىش</span>
            </button>
            <span className="text-[10px] text-slate-500 font-mono">3D Pinpoint</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          POP-UP MODAL WINDOW: Geopolitical Analysis with Scalable Large Fonts
          "ۋە خەتلەر يوغانراق بولسۇن" تەلىپىگە تولۇق ماس كېلىدۇ
          ========================================================================= */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md transition-all select-text"
          dir="rtl"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 ring-1 ring-amber-500/30 animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-5 sm:p-6 border-b border-amber-500/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border"
                  style={{
                    backgroundColor: `#${selectedHotspot.color.toString(16).padStart(6, '0')}22`,
                    borderColor: `#${selectedHotspot.color.toString(16).padStart(6, '0')}66`
                  }}
                >
                  <Globe className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40">
                      {selectedHotspot.badge_ug || selectedHotspot.category}
                    </span>
                    <span className="text-xs text-sky-400 font-mono bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-sky-500/30">
                      {selectedHotspot.coordinates_display || `${selectedHotspot.lat}°N, ${selectedHotspot.lng}°E`}
                    </span>
                    {selectedHotspot.sourceDoc_ug && (
                      <span className="text-[11px] text-emerald-400 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-500/30 truncate max-w-[260px]">
                        📋 {selectedHotspot.sourceDoc_ug}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
                    {selectedHotspot.name_ug}
                  </h2>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {selectedHotspot.name_en}
                  </div>
                </div>
              </div>

              {/* Font Size Chooser & Close Controls */}
              <div className="flex items-center gap-2.5">
                {/* Font Size Selector: "ۋە خەتلەر يوغانراق بولسۇن" */}
                <div className="hidden sm:flex items-center bg-slate-950/90 border border-slate-700/80 rounded-xl p-1 gap-1 shadow-inner">
                  <span className="text-xs text-slate-400 px-2 flex items-center gap-1 font-semibold">
                    <Type className="w-3.5 h-3.5 text-amber-400" />
                    <span>خەت:</span>
                  </span>
                  <button
                    onClick={() => setFontSizeLevel('normal')}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      fontSizeLevel === 'normal'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="نۇرمال خەت (22px)"
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSizeLevel('large')}
                    className={`px-2.5 py-1 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                      fontSizeLevel === 'large'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="چوڭ خەت (25px)"
                  >
                    A+
                  </button>
                  <button
                    onClick={() => setFontSizeLevel('huge')}
                    className={`px-2.5 py-1 rounded-lg text-base font-bold transition-all cursor-pointer ${
                      fontSizeLevel === 'huge'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="ئىنتايىن چوڭ خەت (29px - سۈكۈتتىكى نۇسخا)"
                  >
                    A++
                  </button>
                  <button
                    onClick={() => setFontSizeLevel('giant')}
                    className={`px-2.5 py-1 rounded-lg text-lg font-bold transition-all cursor-pointer ${
                      fontSizeLevel === 'giant'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="ئەڭ يوغان خەت (34px)"
                  >
                    A+++
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-xl bg-slate-800/90 hover:bg-rose-900/60 text-slate-300 hover:text-white border border-slate-700 hover:border-rose-500/50 flex items-center justify-center cursor-pointer transition-all shadow-md"
                  title="كۆزنەكنى تاقاش"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Font Size Bar */}
            <div className="sm:hidden bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-amber-400" />
                <span>خەت چوڭلۇقى:</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setFontSizeLevel('normal')}
                  className={`px-2 py-0.5 rounded text-xs font-bold ${fontSizeLevel === 'normal' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                >
                  نۇرمال
                </button>
                <button
                  onClick={() => setFontSizeLevel('large')}
                  className={`px-2 py-0.5 rounded text-xs font-bold ${fontSizeLevel === 'large' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                >
                  چوڭ
                </button>
                <button
                  onClick={() => setFontSizeLevel('huge')}
                  className={`px-2 py-0.5 rounded text-xs font-bold ${fontSizeLevel === 'huge' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                >
                  ئەڭ چوڭ
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs: In-App Direct Map (Zero Google Redirect) vs Gemini Analysis */}
            <div className="bg-slate-950 px-5 pt-3 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalActiveTab('direct_map')}
                  className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border-t-2 ${
                    modalActiveTab === 'direct_map'
                      ? 'bg-slate-900 text-sky-400 border-sky-400 shadow-lg'
                      : 'text-slate-400 hover:text-white border-transparent hover:bg-slate-900/60'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-sky-400" />
                  <span>🗺️ ئەپ ئىچىدىكى بىۋاسىتە خەرىتە (گوگىلسىز كۆرۈش)</span>
                </button>
                <button
                  onClick={() => setModalActiveTab('analysis')}
                  className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border-t-2 ${
                    modalActiveTab === 'analysis'
                      ? 'bg-slate-900 text-amber-400 border-amber-400 shadow-lg'
                      : 'text-slate-400 hover:text-white border-transparent hover:bg-slate-900/60'
                  }`}
                >
                  <Bot className="w-4 h-4 text-amber-400" />
                  <span>📝 Gemini گېئوپولىتىكا تەھلىلى</span>
                </button>
              </div>

              {/* Status Indicator */}
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ئەپ ئىچىدىن بىۋاسىتە كۆزىتىش · ھېچقانداق سىرتقا ئۇلىنىش يوق</span>
              </div>
            </div>

            {/* Main Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
              {modalActiveTab === 'direct_map' ? (
                /* =========================================================================
                   TAB 1: IN-APP DIRECT MAP VIEWER (NO GOOGLE CONNECTION REQUIRED)
                   ========================================================================= */
                <div className="space-y-4">
                  {/* Map Type Bar & Target Controls */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 ml-1">كۆرۈنۈش شەكلى:</span>
                      <button
                        onClick={() => setDirectMapType('satellite')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          directMapType === 'satellite'
                            ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30'
                            : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                        }`}
                      >
                        <Satellite className="w-3.5 h-3.5" />
                        <span>🛰️ سۈنئىي ھەمراھ سپېكترى (HD)</span>
                      </button>
                      <button
                        onClick={() => setDirectMapType('street')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          directMapType === 'street'
                            ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30'
                            : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>🗺️ كوچا ۋە ئۇل ئەسلىھە خەرىتىسى</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800" dir="ltr">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{selectedHotspot.lat}°N, {selectedHotspot.lng}°E</span>
                    </div>
                  </div>

                  {/* Hotspots Quick Navigation Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                    <span className="text-[11px] font-bold text-slate-400 shrink-0 ml-1">باشقا ئورۇنلار:</span>
                    {HOTSPOTS.map(spot => {
                      const active = selectedHotspot.id === spot.id;
                      return (
                        <button
                          key={spot.id}
                          onClick={() => {
                            setSelectedHotspot(spot);
                            fetchGeopoliticalAnalysis(spot);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap cursor-pointer transition-all ${
                            active
                              ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                              : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {spot.name_ug.split(' ')[0]}
                        </button>
                      );
                    })}
                  </div>

                  {/* Map Canvas / Embedded Frame */}
                  {directMapType === 'street' ? (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-sky-500/40 shadow-2xl bg-slate-950">
                      <iframe
                        title={selectedHotspot.name_ug}
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedHotspot.lng - 0.08}%2C${selectedHotspot.lat - 0.05}%2C${selectedHotspot.lng + 0.08}%2C${selectedHotspot.lat + 0.05}&layer=mapnik&marker=${selectedHotspot.lat}%2C${selectedHotspot.lng}`}
                        className="w-full h-[430px] rounded-2xl"
                        loading="lazy"
                      />
                      <div className="absolute bottom-2 right-2 bg-slate-950/90 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 backdrop-blur-md flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>بىۋاسىتە ئىشلەيدۇ (گوگىلغا ئۇلانمايدۇ)</span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-sky-500/40 shadow-2xl bg-slate-950 group h-[430px]">
                      <img
                        src="/assets/earth_satellite.jpg"
                        alt="Satellite View"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/60 pointer-events-none" />

                      {/* HUD Overlays */}
                      <div className="absolute top-3 left-3 bg-slate-950/85 border border-sky-500/40 rounded-lg px-3 py-1.5 text-xs font-mono text-sky-300 flex items-center gap-2 backdrop-blur-md" dir="ltr">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>OPTICAL SATELLITE HUD · 4K HIGH RES</span>
                      </div>

                      <div className="absolute top-3 right-3 bg-slate-950/85 border border-amber-500/40 rounded-lg px-3 py-1.5 text-xs font-mono text-amber-400 backdrop-blur-md" dir="ltr">
                        COORD: {selectedHotspot.lat}°N, {selectedHotspot.lng}°E
                      </div>

                      {/* Center Targeting Reticle */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-28 h-28 border-2 border-sky-400/50 rounded-full flex items-center justify-center animate-pulse">
                          <div className="w-3 h-3 rounded-full bg-sky-400" />
                          <div className="absolute top-0 w-0.5 h-5 bg-sky-400" />
                          <div className="absolute bottom-0 w-0.5 h-5 bg-sky-400" />
                          <div className="absolute left-0 w-5 h-0.5 bg-sky-400" />
                          <div className="absolute right-0 w-5 h-0.5 bg-sky-400" />
                        </div>
                      </div>

                      {/* Bottom Intelligence Overlay */}
                      <div className="absolute bottom-3 inset-x-3 bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-amber-400" />
                            <span>{selectedHotspot.name_ug}</span>
                            <span className="text-xs text-sky-400 font-mono">({selectedHotspot.badge_ug})</span>
                          </div>
                          <div className="text-xs text-slate-300 mt-1">
                            {selectedHotspot.description_ug}
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-2">
                          <button
                            onClick={() => setDirectMapType('street')}
                            className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                          >
                            <Layers className="w-3.5 h-3.5" />
                            <span>كوچا خەرىتىسىگە ئۆتۈش</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Geopolitical & Infrastructure Intelligence Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400 block mb-1">ئورۇن ۋە بەلگە تۈرى:</span>
                      <span className="text-xs font-bold text-amber-400">{selectedHotspot.badge_ug || selectedHotspot.category}</span>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400 block mb-1">ئارخىپ & ھۆججەت كېلىش مەنبەسى:</span>
                      <span className="text-xs font-bold text-emerald-400 truncate block">{selectedHotspot.sourceDoc_ug || 'OHCHR / ASPI'}</span>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400 block mb-1">دۆلەت ھالقىغان ئەھمىيىتى:</span>
                      <span className="text-xs font-bold text-sky-400">ئىستراتېگىيەلىك سۈنئىي ھەمراھ كۆزىتىش كوئوردېناتى</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* =========================================================================
                   TAB 2: GEMINI GEOPOLITICAL ANALYSIS (LARGE SCALABLE FONTS)
                   ========================================================================= */
                <div className="space-y-6">
                  {/* Status & Action Bar */}
                  <div className="bg-gradient-to-r from-sky-950/50 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white">Gemini API گېئوپولىتىكا تەھلىلى</span>
                        <span className="text-xs text-amber-400/90 block">
                          ئۇيغۇرچە تەرجىمە ۋە ئىستراتېگىيەلىك خۇلاسە (gemini-3.8-flash)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => fetchGeopoliticalAnalysis(selectedHotspot, true)}
                        disabled={isAnalyzing}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-md"
                        title="تەھلىلنى قايتا يېڭىلاپ تۈزۈش"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                        <span>{isAnalyzing ? 'تەھلىل قىلىنىۋاتىدۇ...' : 'قايتا تەھلىل قىلىش'}</span>
                      </button>
                      <button
                        onClick={handleCopyAnalysis}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
                        title="پۈتۈن تەھلىلنى كۆچۈرۈش"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'كۆچۈرۈلدى' : 'كۆچۈرۈش'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Analysis Text Content with Big Scalable Fonts */}
                  {isAnalyzing ? (
                    <div className="py-16 flex flex-col items-center justify-center space-y-4">
                      <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 animate-ping" />
                        <div className="w-16 h-16 rounded-full border-4 border-t-amber-400 border-r-amber-500 border-b-transparent border-l-transparent animate-spin flex items-center justify-center">
                          <Globe className="w-7 h-7 text-amber-400" />
                        </div>
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-white">Gemini سۈنئىي ئىدراك تەھلىلى تەييارلىنىۋاتىدۇ...</h3>
                        <p className="text-sm text-slate-400 mt-1">
                          «{selectedHotspot.name_ug}» رايونىنىڭ گېئوپولىتىكىلىق، تەمىنات ۋە خەلقئارالىق سىياسەت ئورنى بىرىكتۈرۈلمەكتە.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <FormattedAnalysis text={analysisText} fontSizeLevel={fontSizeLevel} />
                  )}
                </div>
              )}
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="bg-slate-950 p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>UyFox News گېئوپولىتىكا ۋە يىپەك يولى ئانالىز مەركىزى</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {onSelectHotspotNews && (
                  <button
                    onClick={() => {
                      onSelectHotspotNews(selectedHotspot.id, selectedHotspot.categoryKey);
                      setIsModalOpen(false);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-sky-500/20"
                    title="بۇ رايونغا ئالاقىدار خەۋەرلەرنى تىزىملىكتە كۆرۈش"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>مۇناسىۋەتلىك خەۋەرلەرنى كۆرۈش</span>
                  </button>
                )}
                {modalActiveTab === 'analysis' ? (
                  <button
                    onClick={() => setModalActiveTab('direct_map')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>خەرىتىنى بىۋاسىتە كۆرۈش</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setModalActiveTab('analysis')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>گېئوپولىتىكا تەھلىلىنى ئوقۇش</span>
                  </button>
                )}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer transition-all shadow-md"
                >
                  چۈشەندىم (تاقاش)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SATELLITE CLOSE-UP INSPECTOR MODAL: Real Satellite Imagery & Topography
          "مىنىڭ مەقسىتىم سۈئىي ھەمراھ ئارقىلىق كۆرۈندىغان خەرىتە" تەلىپى بويىچە
          ========================================================================= */}
      {isSatelliteInspectorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-md transition-all select-text"
          dir="rtl"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsSatelliteInspectorOpen(false);
          }}
        >
          <div
            className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border-2 border-sky-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 ring-1 ring-sky-500/30 animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950/50 p-5 border-b border-sky-500/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0 shadow-lg">
                  <Satellite className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sky-400 px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/40 font-mono">
                      LEO ORBIT · 820 KM
                    </span>
                    <span className="text-xs text-amber-400 font-mono bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      NASA / Sentinel HD
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight flex items-center gap-2">
                    <span>سۈنئىي ھەمراھتىن يېقىندىن كۆزىتىش مەركىزى</span>
                    <span className="text-xs text-slate-400 font-normal">({selectedHotspot.name_ug})</span>
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setIsSatelliteInspectorOpen(false)}
                className="w-10 h-10 rounded-xl bg-slate-800/90 hover:bg-rose-900/60 text-slate-300 hover:text-white border border-slate-700 hover:border-rose-500/50 flex items-center justify-center cursor-pointer transition-all shadow-md"
                title="تاقاش"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Hotspot Select Row */}
            <div className="bg-slate-950/70 px-5 py-2.5 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-bold text-slate-400 shrink-0 ml-1">رايون تاللاش:</span>
              {HOTSPOTS.map(spot => {
                const active = selectedHotspot.id === spot.id;
                return (
                  <button
                    key={spot.id}
                    onClick={() => handleSelectHotspot(spot)}
                    className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap cursor-pointer transition-all ${
                      active
                        ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {spot.name_ug.split(' ')[0]}
                  </button>
                );
              })}
            </div>

            {/* Main Body: Satellite Viewport & Intelligence Pane */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Visual Satellite Imagery Frame */}
              <div className="lg:col-span-7 space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-sky-500/30 shadow-2xl group">
                  <img
                    src="/assets/earth_satellite.jpg"
                    alt="Satellite imagery"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40 pointer-events-none" />

                  {/* Satellite HUD Overlay */}
                  <div className="absolute top-3 left-3 bg-slate-950/80 border border-sky-500/40 rounded-lg px-2.5 py-1 text-[11px] font-mono text-sky-300 flex items-center gap-1.5 backdrop-blur-md" dir="ltr">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>SAT-OPTIC 4K RES</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] font-mono text-amber-400 backdrop-blur-md" dir="ltr">
                    {selectedHotspot.lat}°N, {selectedHotspot.lng}°E
                  </div>

                  {/* Center Target Reticle */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-20 h-20 border border-sky-400/40 rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-sky-400" />
                      <div className="absolute top-0 w-0.5 h-3 bg-sky-400/80" />
                      <div className="absolute bottom-0 w-0.5 h-3 bg-sky-400/80" />
                      <div className="absolute left-0 w-3 h-0.5 bg-sky-400/80" />
                      <div className="absolute right-0 w-3 h-0.5 bg-sky-400/80" />
                    </div>
                  </div>

                  {/* Bottom Satellite Info Bar */}
                  <div className="absolute bottom-3 inset-x-3 bg-slate-950/85 border border-slate-800 rounded-xl p-3 flex items-center justify-between backdrop-blur-md">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{selectedHotspot.name_ug}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{selectedHotspot.name_en}</div>
                    </div>
                    <button
                      onClick={() => {
                        setIsSatelliteInspectorOpen(false);
                        handleOpenAnalysisModal(selectedHotspot);
                        setModalActiveTab('direct_map');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>ئەپ ئىچىدىكى خەرىتىنى ئېچىش</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-1">ئوربىتا سۈرئىتى:</span>
                    <span className="text-xs font-bold font-mono text-sky-300" dir="ltr">7.66 km/s</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-1">فوتو سۈزۈكلۈكى:</span>
                    <span className="text-xs font-bold font-mono text-amber-400" dir="ltr">0.5m / Pixel</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-1">تەۋەلىك رايونى:</span>
                    <span className="text-xs font-bold text-emerald-400">{selectedHotspot.category}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Geographic & Topographic Intelligence */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-sm border-b border-slate-800/80 pb-2.5">
                    <Layers className="w-4 h-4" />
                    <span>سۈنئىي ھەمراھ تاغ-دەريا ۋە جۇغراپىيە ئانالىزى</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed text-justify">
                    {selectedHotspot.description_ug}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="text-xs font-bold text-amber-400">⚡ ئىستراتېگىيەلىك سۈنئىي ھەمراھ ئالاھىدىلىكى:</div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="text-sky-400 font-bold">•</span>
                        <span>تەبىئىي تاغ توسۇقلىرى، سۇ يولى ۋە نېفىت-تەمىنات تۇرۇبىلىرى سۈنئىي ھەمراھ سپېكترى ئارقىلىق ئېنىقلانغان.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sky-400 font-bold">•</span>
                        <span>يىپەك يولى ۋە ئوتتۇرا كارىدور بويىدىكى بارلىق قۇرۇقلۇق كۆۋرۈكلىرى تولۇق كوئوردېناتقا تەۋە.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sky-400 font-bold">•</span>
                        <span>دېڭىز بوغۇزلىرىدىكى كېمە قاتنىشى ۋە سودا زەنجىرى 24 سائەتلىك كۆزىتىش ئاستىدا.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setIsSatelliteInspectorOpen(false);
                        handleOpenAnalysisModal(selectedHotspot);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-amber-500/20"
                    >
                      <Bot className="w-4 h-4" />
                      <span>بۇ نۇقتىنىڭ تولۇق Gemini تەھلىلىنى كۆرۈش</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
