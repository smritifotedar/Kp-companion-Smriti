// Muhurta engine — classical Vedic / Kashmiri Pandit electional rules applied to
// the KP Panchang (Sapta Rishi Samvat). Evaluates a day on Panchanga shuddhi
// (Tithi, Vara, Nakshatra, Yoga, Karana), the day-doshas (Rahu Kaal / Yamaganda /
// Gulika), and activity-specific favourable Nakshatra/Vara sets, then surfaces the
// auspicious Choghadiya time-windows of the day.
//
// This follows the traditional rule-set KP families use; for the final pick always
// verify against the official Vijayeshwar Panchang and your purohit.

import {
  computeDayPanchang,
  getSunTimes,
  getInauspiciousPeriods,
  getChoghadiya,
  KP_LOCATIONS,
  KP_YOGAS,
} from './kp-calendar';

// ─── Tithi categories (repeat every fortnight) ───────────────────────────────
// Nanda 1,6,11 · Bhadra 2,7,12 · Jaya 3,8,13 · Rikta 4,9,14 (avoid) · Purna 5,10,15
export function tithiCategory(n: number): 'Nanda' | 'Bhadra' | 'Jaya' | 'Rikta' | 'Purna' {
  const m = ((n - 1) % 5);
  return (['Nanda', 'Bhadra', 'Jaya', 'Rikta', 'Purna'] as const)[m];
}

// ─── Nakshatra nature (index matches KP_NAKSHATRAS: 0=Ashwini … 26=Revati) ────
export type NakNature = 'Kshipra' | 'Mridu' | 'Dhruva' | 'Chara' | 'Mishra' | 'Ugra' | 'Tikshna';
const NAK_NATURE: NakNature[] = [
  'Kshipra', // 0 Ashwini
  'Ugra',    // 1 Bharani
  'Mishra',  // 2 Krittika
  'Dhruva',  // 3 Rohini
  'Mridu',   // 4 Mrigashirsha
  'Tikshna', // 5 Ardra
  'Chara',   // 6 Punarvasu
  'Kshipra', // 7 Pushya
  'Tikshna', // 8 Ashlesha
  'Ugra',    // 9 Magha
  'Ugra',    // 10 Purva Phalguni
  'Dhruva',  // 11 Uttara Phalguni
  'Kshipra', // 12 Hasta
  'Mridu',   // 13 Chitra
  'Chara',   // 14 Swati
  'Mishra',  // 15 Vishakha
  'Mridu',   // 16 Anuradha
  'Tikshna', // 17 Jyeshtha
  'Tikshna', // 18 Mula
  'Ugra',    // 19 Purva Ashadha
  'Dhruva',  // 20 Uttara Ashadha
  'Chara',   // 21 Shravana
  'Chara',   // 22 Dhanishtha
  'Chara',   // 23 Shatabhisha
  'Ugra',    // 24 Purva Bhadrapada
  'Dhruva',  // 25 Uttara Bhadrapada
  'Mridu',   // 26 Revati
];

export function nakshatraNature(i: number): NakNature {
  return NAK_NATURE[i] ?? 'Mishra';
}

// Nakshatras generally inauspicious for soft/auspicious beginnings
const UNFAVOURABLE_NAK = new Set<NakNature>(['Ugra', 'Tikshna']);

// ─── Inauspicious Yogas (classical "avoid" set) ──────────────────────────────
const BAD_YOGAS = new Set(['Vishkambha', 'Atiganda', 'Shoola', 'Ganda', 'Vyaghata', 'Vajra', 'Vyatipata', 'Parigha', 'Vaidhriti']);
const SEVERE_YOGAS = new Set(['Vyatipata', 'Vaidhriti', 'Parigha']);

// ─── Vara (weekday) lords & general nature ───────────────────────────────────
const VARA_GOOD = new Set([1, 3, 4, 5]); // Mon, Wed, Thu, Fri — generally auspicious
const VARA_AVOID = new Set([2, 6]);       // Tue (Mars), Sat (Saturn) — avoid for soft works

// ─── Activities ──────────────────────────────────────────────────────────────
export interface MuhurtaActivity {
  id: string;
  name: string;
  kashmiri: string;
  icon: string;
  favNakshatras: number[]; // indices into KP_NAKSHATRAS
  favVaras: number[];      // 0=Sun … 6=Sat
  note: string;
}

// Classical favourable Nakshatras per activity
const N = {
  ashwini: 0, bharani: 1, krittika: 2, rohini: 3, mrigashira: 4, ardra: 5, punarvasu: 6,
  pushya: 7, ashlesha: 8, magha: 9, pPhalguni: 10, uPhalguni: 11, hasta: 12, chitra: 13,
  swati: 14, vishakha: 15, anuradha: 16, jyeshtha: 17, mula: 18, pAshadha: 19, uAshadha: 20,
  shravana: 21, dhanishtha: 22, shatabhisha: 23, pBhadra: 24, uBhadra: 25, revati: 26,
};

export const MUHURTA_ACTIVITIES: MuhurtaActivity[] = [
  {
    id: 'griha-pravesh', name: 'Griha Pravesh (Home Entry)', kashmiri: 'गृह प्रवेश', icon: '🏠',
    favNakshatras: [N.rohini, N.uPhalguni, N.uAshadha, N.uBhadra, N.mrigashira, N.chitra, N.anuradha, N.revati, N.shravana, N.dhanishtha, N.shatabhisha, N.pushya],
    favVaras: [1, 3, 4, 5],
    note: 'Fixed (Dhruva) nakshatras are ideal for a permanent dwelling. Avoid Tue & Sat, Rikta tithis and Amavasya.',
  },
  {
    id: 'property', name: 'Property / Land Purchase', kashmiri: 'भूमि क्रय', icon: '🏗️',
    favNakshatras: [N.rohini, N.uPhalguni, N.uAshadha, N.uBhadra, N.anuradha, N.chitra, N.dhanishtha, N.shatabhisha, N.swati],
    favVaras: [1, 3, 4, 5],
    note: 'Fixed nakshatras favour lasting acquisitions. Saturn-ruled Saturday is acceptable for land; avoid Rikta & Amavasya.',
  },
  {
    id: 'vehicle', name: 'Vehicle Purchase', kashmiri: 'वाहन क्रय', icon: '🚗',
    favNakshatras: [N.ashwini, N.punarvasu, N.pushya, N.hasta, N.shravana, N.dhanishtha, N.shatabhisha, N.revati, N.mrigashira, N.chitra, N.anuradha],
    favVaras: [1, 3, 4, 5],
    note: 'Movable (Chara) & light (Kshipra) nakshatras suit vehicles & travel. Avoid Rikta, Amavasya, Vishti karana.',
  },
  {
    id: 'travel', name: 'Travel / Yatra', kashmiri: 'यात्रा', icon: '✈️',
    favNakshatras: [N.ashwini, N.punarvasu, N.pushya, N.hasta, N.anuradha, N.shravana, N.dhanishtha, N.shatabhisha, N.revati, N.mrigashira],
    favVaras: [1, 3, 4, 5],
    note: 'Movable nakshatras favour journeys. Avoid Rikta tithis, Amavasya and the day-doshas.',
  },
  {
    id: 'gold', name: 'Gold / Jewellery', kashmiri: 'स्वर्ण क्रय', icon: '🪙',
    favNakshatras: [N.pushya, N.rohini, N.uPhalguni, N.uAshadha, N.uBhadra, N.hasta, N.chitra, N.swati, N.anuradha, N.shravana, N.revati],
    favVaras: [1, 3, 4, 5],
    note: 'Pushya is supreme for wealth; Akshaya Tritiya is especially auspicious. Avoid Rikta & Amavasya.',
  },
  {
    id: 'business', name: 'New Business / Shop', kashmiri: 'व्यापार आरम्भ', icon: '🏢',
    favNakshatras: [N.ashwini, N.pushya, N.hasta, N.chitra, N.anuradha, N.uPhalguni, N.uAshadha, N.uBhadra, N.shravana, N.dhanishtha, N.revati],
    favVaras: [1, 3, 4, 5],
    note: 'Wednesday (Mercury) is excellent for commerce. Avoid Rikta tithis, Amavasya, Vishti karana.',
  },
  {
    id: 'job', name: 'New Job / Joining', kashmiri: 'नौकरी आरम्भ', icon: '💼',
    favNakshatras: [N.ashwini, N.pushya, N.hasta, N.chitra, N.anuradha, N.uPhalguni, N.uAshadha, N.uBhadra, N.punarvasu, N.revati],
    favVaras: [1, 3, 4, 5],
    note: 'Wed & Thu favour new responsibilities. Avoid Rikta, Amavasya and Tue/Sat.',
  },
  {
    id: 'education', name: 'Education / Vidyarambh', kashmiri: 'विद्यारम्भ', icon: '📚',
    favNakshatras: [N.pushya, N.hasta, N.chitra, N.swati, N.ashwini, N.punarvasu, N.shravana, N.revati, N.uPhalguni, N.uAshadha, N.uBhadra, N.mrigashira],
    favVaras: [3, 4], // Wed, Thu best for learning
    note: 'Wednesday & Thursday are ideal for beginning study. Pushya & Hasta are classic Vidyarambh nakshatras.',
  },
];

// ─── Day evaluation ───────────────────────────────────────────────────────────
export type CheckStatus = 'good' | 'bad' | 'neutral';
export interface MuhurtaCheck { label: string; value: string; status: CheckStatus }
export interface MuhurtaWindow { name: string; start: string; end: string; nature: 'good' | 'neutral' }

export interface MuhurtaDay {
  date: Date;
  tithi: string;
  paksha: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  vara: string;
  rating: number;        // 1–5
  verdict: string;
  checks: MuhurtaCheck[];
  warnings: string[];
  windows: MuhurtaWindow[]; // auspicious Choghadiya periods (doshas excluded)
}

const WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function evaluateMuhurta(date: Date, activity: MuhurtaActivity): MuhurtaDay {
  const p = computeDayPanchang(date);
  const loc = KP_LOCATIONS[0]; // Srinagar — KP Panchang reference
  const sun = getSunTimes(date, loc.lat, loc.lng, loc.tz, loc.sunZenith, loc.sunsetZenith);
  const weekday = date.getDay();

  const checks: MuhurtaCheck[] = [];
  const warnings: string[] = [];
  let score = 0;

  // 1. Tithi
  const tcat = tithiCategory(p.tithiNumber);
  if (p.isAmavasya) {
    checks.push({ label: 'Tithi', value: `Amavasya — inauspicious for new work`, status: 'bad' });
    warnings.push('Amavasya (new moon) — avoid auspicious beginnings.');
    score -= 2;
  } else if (tcat === 'Rikta') {
    checks.push({ label: 'Tithi', value: `${p.tithiName} (Rikta — avoid)`, status: 'bad' });
    warnings.push('Rikta tithi (4 / 9 / 14) — traditionally avoided for auspicious acts.');
    score -= 2;
  } else if (p.isPurnima || tcat === 'Purna' || tcat === 'Bhadra' || tcat === 'Jaya') {
    checks.push({ label: 'Tithi', value: `${p.tithiName} (${tcat} — favourable)`, status: 'good' });
    score += 1;
  } else {
    checks.push({ label: 'Tithi', value: `${p.tithiName} (${tcat})`, status: 'neutral' });
  }

  // 2. Vara (weekday)
  if (activity.favVaras.includes(weekday)) {
    checks.push({ label: 'Vara', value: `${WEEKDAY[weekday]} — favourable`, status: 'good' });
    score += 1;
  } else if (VARA_AVOID.has(weekday)) {
    checks.push({ label: 'Vara', value: `${WEEKDAY[weekday]} — generally avoided`, status: 'bad' });
    warnings.push(`${WEEKDAY[weekday]} is generally avoided for this activity.`);
    score -= 1;
  } else {
    checks.push({ label: 'Vara', value: `${WEEKDAY[weekday]}`, status: 'neutral' });
  }

  // 3. Nakshatra
  const nature = nakshatraNature(p.nakshatraIndex);
  if (activity.favNakshatras.includes(p.nakshatraIndex)) {
    checks.push({ label: 'Nakshatra', value: `${p.nakshatra} (${nature}) — favourable`, status: 'good' });
    score += 2;
  } else if (UNFAVOURABLE_NAK.has(nature)) {
    checks.push({ label: 'Nakshatra', value: `${p.nakshatra} (${nature}) — inauspicious`, status: 'bad' });
    warnings.push(`${p.nakshatra} is a ${nature} (fierce/sharp) nakshatra — avoid for auspicious work.`);
    score -= 2;
  } else {
    checks.push({ label: 'Nakshatra', value: `${p.nakshatra} (${nature})`, status: 'neutral' });
  }

  // 4. Yoga
  if (SEVERE_YOGAS.has(p.yoga)) {
    checks.push({ label: 'Yoga', value: `${p.yoga} — inauspicious`, status: 'bad' });
    warnings.push(`${p.yoga} yoga is strongly avoided.`);
    score -= 2;
  } else if (BAD_YOGAS.has(p.yoga)) {
    checks.push({ label: 'Yoga', value: `${p.yoga} — caution`, status: 'bad' });
    warnings.push(`${p.yoga} yoga is among the inauspicious yogas.`);
    score -= 1;
  } else {
    checks.push({ label: 'Yoga', value: `${p.yoga} — fine`, status: 'good' });
    score += 1;
  }

  // 5. Karana (avoid Vishti / Bhadra)
  if (p.karana === 'Vishti') {
    checks.push({ label: 'Karana', value: `Vishti (Bhadra) — avoid`, status: 'bad' });
    warnings.push('Vishti (Bhadra) karana — inauspicious; avoid starting work.');
    score -= 2;
  } else {
    checks.push({ label: 'Karana', value: `${p.karana}`, status: 'neutral' });
  }

  // Map score → rating (1–5) and verdict
  let rating: number;
  if (score >= 4) rating = 5;
  else if (score >= 2) rating = 4;
  else if (score >= 0) rating = 3;
  else if (score >= -2) rating = 2;
  else rating = 1;

  const verdict =
    rating === 5 ? 'Highly Auspicious' :
    rating === 4 ? 'Auspicious' :
    rating === 3 ? 'Acceptable' :
    rating === 2 ? 'Not Recommended' : 'Avoid';

  // Auspicious time-windows: day Choghadiya that are good/neutral and NOT inside a dosha
  const windows: MuhurtaWindow[] = [];
  const chog = getChoghadiya(sun, weekday);
  const periods = getInauspiciousPeriods(sun, weekday);
  const doshaRanges = [periods.rahu, periods.yamaganda, periods.gulika]
    .filter(Boolean)
    .map((d) => [d!.startMin, d!.endMin] as [number, number]);

  if (chog) {
    // re-derive start minutes for overlap test by walking the day periods
    const sr = sun.sunriseMinutes ?? 0;
    const part = sun.sunsetMinutes && sun.sunriseMinutes ? (sun.sunsetMinutes - sun.sunriseMinutes) / 8 : 0;
    chog.day.forEach((c, i) => {
      if (c.nature === 'bad') return;
      const s = sr + i * part;
      const e = s + part;
      const overlapsDosha = doshaRanges.some(([ds, de]) => s < de && e > ds);
      if (!overlapsDosha) {
        windows.push({ name: c.name, start: c.start, end: c.end, nature: c.nature === 'good' ? 'good' : 'neutral' });
      }
    });
  }

  return {
    date,
    tithi: p.tithiName,
    paksha: p.pakshaLabel,
    nakshatra: p.nakshatra,
    yoga: p.yoga,
    karana: p.karana,
    vara: WEEKDAY[weekday],
    rating,
    verdict,
    checks,
    warnings,
    windows,
  };
}

export function findMuhurtaRange(start: Date, end: Date, activity: MuhurtaActivity): MuhurtaDay[] {
  const out: MuhurtaDay[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const stop = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  let guard = 0;
  while (cursor <= stop && guard < 366) {
    out.push(evaluateMuhurta(new Date(cursor), activity));
    cursor.setDate(cursor.getDate() + 1);
    guard++;
  }
  return out;
}

// Yoga list export for reference (kept in sync with kp-calendar)
export const ALL_YOGAS = KP_YOGAS;
