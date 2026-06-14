// Kundli Matching — Ashtakoot Guna Milan (36 gunas) + Mangal (Manglik) Dosha.
// Uses each person's Moon nakshatra & rashi (from the kundli engine).
// Standard tables; for the final decision consult a qualified astrologer.

import type { Kundli } from './kp-kundli';

// ── Varna (1) ────────────────────────────────────────────────────────────────
// rashi → varna level (Brahmin 4, Kshatriya 3, Vaishya 2, Shudra 1)
const VARNA: number[] = [3, 2, 1, 4, 3, 2, 1, 4, 3, 2, 1, 4];
// Mesha K3, Vrish V2, Mith S1, Karka B4, Simha K3, Kanya V2, Tula S1, Vrisch B4, Dhanu K3, Makar V2, Kumbh S1, Meen B4

// ── Vashya (2) ───────────────────────────────────────────────────────────────
// group: 0 Nara(human) 1 Chatushpad(quadruped) 2 Jalachar(aquatic) 3 Vanachar(wild) 4 Keeta(insect)
const VASHYA_GROUP: number[] = [1, 1, 0, 2, 3, 0, 0, 4, 0, 2, 0, 2];

function vashyaScore(b: number, g: number): number {
  const gb = VASHYA_GROUP[b], gg = VASHYA_GROUP[g];
  if (gb === gg) return 2;
  const soft = new Set([0, 1, 2]); // Nara / Chatushpad / Jalachar are broadly compatible
  if (gb === 3 || gg === 3) return 0.5; // Vanachar (wild) is difficult
  if (soft.has(gb) && soft.has(gg)) return 1;
  return 0.5;
}

// ── Tara (3) — count both directions, avoid Vipat/Pratyari/Vadha (3,5,7) ──────
function taraDirGood(from: number, to: number): boolean {
  const count = ((to - from + 27) % 27) + 1;
  let r = count % 9;
  if (r === 0) r = 9;
  return ![3, 5, 7].includes(r);
}
function taraScore(b: number, g: number): number {
  return (taraDirGood(b, g) ? 1.5 : 0) + (taraDirGood(g, b) ? 1.5 : 0);
}

// ── Yoni (4) — nakshatra → animal yoni; same=4, enemy pairs low ──────────────
// 14 yonis: 0 Horse,1 Elephant,2 Sheep,3 Snake,4 Dog,5 Cat,6 Rat,7 Cow,8 Buffalo,9 Tiger,10 Deer,11 Monkey,12 Mongoose,13 Lion
const YONI: number[] = [
  0,  // Ashwini — Horse
  1,  // Bharani — Elephant
  2,  // Krittika — Sheep
  3,  // Rohini — Snake
  3,  // Mrigashira — Snake
  4,  // Ardra — Dog
  5,  // Punarvasu — Cat
  2,  // Pushya — Sheep
  5,  // Ashlesha — Cat
  6,  // Magha — Rat
  6,  // Purva Phalguni — Rat
  7,  // Uttara Phalguni — Cow
  8,  // Hasta — Buffalo
  9,  // Chitra — Tiger
  8,  // Swati — Buffalo
  9,  // Vishakha — Tiger
  10, // Anuradha — Deer
  10, // Jyeshtha — Deer
  4,  // Mula — Dog
  11, // Purva Ashadha — Monkey
  12, // Uttara Ashadha — Mongoose
  11, // Shravana — Monkey
  13, // Dhanishtha — Lion
  13, // Shatabhisha — Horse? (commonly Horse) → use Horse
  0,  // Purva Bhadrapada — Lion? commonly Lion; keep Lion
  7,  // Uttara Bhadrapada — Cow
  1,  // Revati — Elephant
];
// enemy (bitter) yoni pairs → 0 points
const YONI_ENEMIES: [number, number][] = [
  [7, 9],   // Cow–Tiger
  [1, 13],  // Elephant–Lion
  [0, 8],   // Horse–Buffalo
  [2, 11],  // Sheep–Monkey
  [3, 12],  // Snake–Mongoose
  [4, 10],  // Dog–Deer
  [5, 6],   // Cat–Rat
];
function yoniScore(b: number, g: number): number {
  const yb = YONI[b], yg = YONI[g];
  if (yb === yg) return 4;
  const enemy = YONI_ENEMIES.some(([x, y]) => (x === yb && y === yg) || (x === yg && y === yb));
  if (enemy) return 0;
  return 3; // friendly/neutral
}

// ── Graha Maitri (5) — moon-rashi lords' friendship ──────────────────────────
const RASHI_LORD_IDX: number[] = [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4];
// planets index: 0 Sun 1 Moon 2 Mars 3 Mercury 4 Jupiter 5 Venus 6 Saturn
// relation matrix [a][b]: 1 friend, 0 neutral, -1 enemy
const FRIENDSHIP: number[][] = [
  // Sun  Moon Mars Merc Jup  Ven  Sat
  [ 1,    1,   1,   0,   1,  -1,  -1], // Sun
  [ 1,    1,   0,   1,   0,   0,   0], // Moon
  [ 1,    1,   1,  -1,   1,   0,   0], // Mars
  [ 1,   -1,   0,   1,   0,   1,   0], // Mercury
  [ 1,    1,   1,  -1,   1,  -1,   0], // Jupiter
  [-1,   -1,   0,   1,   0,   1,   1], // Venus
  [-1,   -1,  -1,   1,   0,   1,   1], // Saturn
];
function grahaMaitriScore(bRashi: number, gRashi: number): number {
  const lb = RASHI_LORD_IDX[bRashi], lg = RASHI_LORD_IDX[gRashi];
  if (lb === lg) return 5;
  const r1 = FRIENDSHIP[lb][lg], r2 = FRIENDSHIP[lg][lb];
  const sum = r1 + r2;
  if (sum === 2) return 5;        // both friends
  if (sum === 1) return 4;        // friend + neutral
  if (sum === 0 && r1 === 0) return 3; // both neutral
  if (sum === 0) return 1;        // friend + enemy
  if (sum === -1) return 0.5;     // neutral + enemy
  return 0;                        // both enemies
}

// ── Gana (6) — Deva / Manushya / Rakshasa ────────────────────────────────────
// 0 Deva, 1 Manushya, 2 Rakshasa
const GANA: number[] = [
  0,1,2,1,0,1,0,0,2,2,1,1,0,2,0,2,0,2,2,1,1,0,2,2,1,1,0,
];
const GANA_MATRIX: number[][] = [
  // girl: Deva Manushya Rakshasa
  [6, 5, 1], // boy Deva
  [6, 6, 0], // boy Manushya
  [5, 3, 6], // boy Rakshasa
];
function ganaScore(b: number, g: number): number {
  return GANA_MATRIX[GANA[b]][GANA[g]];
}

// ── Bhakoot (7) — rashi distance dosha ───────────────────────────────────────
function bhakootScore(bRashi: number, gRashi: number): number {
  const diff = ((bRashi - gRashi + 12) % 12) + 1; // 1..12
  if ([2, 12, 5, 9, 6, 8].includes(diff)) return 0; // dwirdwadash / nava-pancham / shadashtak
  return 7;
}

// ── Nadi (8) — Adi / Madhya / Antya ──────────────────────────────────────────
// 0 Adi(Vata) 1 Madhya(Pitta) 2 Antya(Kapha)
const NADI: number[] = [
  0,1,2,2,1,0,0,1,2,2,1,0,0,1,2,2,1,0,0,1,2,2,1,0,0,1,2,
];
function nadiScore(b: number, g: number): number {
  return NADI[b] === NADI[g] ? 0 : 8;
}

// ── Mangal (Manglik) Dosha ───────────────────────────────────────────────────
const MANGLIK_HOUSES = new Set([1, 4, 7, 8, 12]);
function isManglik(k: Kundli): { manglik: boolean; fromLagna: boolean; fromMoon: boolean } {
  const mars = k.grahas.find((g) => g.name === 'Mars')!;
  const fromLagna = MANGLIK_HOUSES.has(mars.house);
  const houseFromMoon = ((mars.rashi - k.moonRashi + 12) % 12) + 1;
  const fromMoon = MANGLIK_HOUSES.has(houseFromMoon);
  return { manglik: fromLagna || fromMoon, fromLagna, fromMoon };
}

// ── Result ────────────────────────────────────────────────────────────────────
export interface Koota { name: string; score: number; max: number; meaning: string }
export interface MatchResult {
  kootas: Koota[];
  total: number;
  max: 36;
  verdict: string;
  verdictTone: 'excellent' | 'good' | 'average' | 'poor';
  boyManglik: ReturnType<typeof isManglik>;
  girlManglik: ReturnType<typeof isManglik>;
  manglikNote: string;
}

export function matchKundlis(boy: Kundli, girl: Kundli): MatchResult {
  const bN = boy.janmaNakshatra.index, gN = girl.janmaNakshatra.index;
  const bR = boy.moonRashi, gR = girl.moonRashi;

  const kootas: Koota[] = [
    { name: 'Varna', max: 1, score: VARNA[bR] >= VARNA[gR] ? 1 : 0, meaning: 'Spiritual development & ego compatibility' },
    { name: 'Vashya', max: 2, score: vashyaScore(bR, gR), meaning: 'Mutual attraction & control' },
    { name: 'Tara', max: 3, score: taraScore(bN, gN), meaning: 'Health & well-being / destiny' },
    { name: 'Yoni', max: 4, score: yoniScore(bN, gN), meaning: 'Physical & intimate compatibility' },
    { name: 'Graha Maitri', max: 5, score: grahaMaitriScore(bR, gR), meaning: 'Mental & intellectual bond' },
    { name: 'Gana', max: 6, score: ganaScore(bN, gN), meaning: 'Temperament & nature' },
    { name: 'Bhakoot', max: 7, score: bhakootScore(bR, gR), meaning: 'Love, family welfare & prosperity' },
    { name: 'Nadi', max: 8, score: nadiScore(bN, gN), meaning: 'Health & progeny (most important)' },
  ];

  const total = kootas.reduce((s, k) => s + k.score, 0);

  let verdict: string, verdictTone: MatchResult['verdictTone'];
  if (total >= 32) { verdict = 'Excellent match'; verdictTone = 'excellent'; }
  else if (total >= 24) { verdict = 'Good match'; verdictTone = 'good'; }
  else if (total >= 18) { verdict = 'Acceptable — review carefully'; verdictTone = 'average'; }
  else { verdict = 'Not recommended'; verdictTone = 'poor'; }

  const boyManglik = isManglik(boy);
  const girlManglik = isManglik(girl);
  let manglikNote: string;
  if (boyManglik.manglik && girlManglik.manglik) manglikNote = 'Both are Manglik — the dosha is considered mutually cancelled in most traditions.';
  else if (boyManglik.manglik || girlManglik.manglik) manglikNote = `${boyManglik.manglik ? 'Boy' : 'Girl'} is Manglik while the other is not — traditionally reviewed carefully; consult a priest for remedies.`;
  else manglikNote = 'Neither partner has Mangal Dosha.';

  return { kootas, total, max: 36, verdict, verdictTone, boyManglik, girlManglik, manglikNote };
}
