// Daily horoscope (Rashifal) — 12 Moon signs.
// Predictions are generated deterministically from the date, so they are stable
// through the day and refresh each morning. For reflection only — not a substitute
// for a personalised jyotish reading from a qualified astrologer.

export interface Rashi {
  index: number;
  name: string;      // Sanskrit
  english: string;
  symbol: string;
  dates: string;     // approx tropical date range
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
}

export const RASHIS: Rashi[] = [
  { index: 0,  name: 'Mesha',     english: 'Aries',       symbol: '♈', dates: 'Mar 21 – Apr 19', element: 'Fire' },
  { index: 1,  name: 'Vrishabha', english: 'Taurus',      symbol: '♉', dates: 'Apr 20 – May 20', element: 'Earth' },
  { index: 2,  name: 'Mithuna',   english: 'Gemini',      symbol: '♊', dates: 'May 21 – Jun 20', element: 'Air' },
  { index: 3,  name: 'Karka',     english: 'Cancer',      symbol: '♋', dates: 'Jun 21 – Jul 22', element: 'Water' },
  { index: 4,  name: 'Simha',     english: 'Leo',         symbol: '♌', dates: 'Jul 23 – Aug 22', element: 'Fire' },
  { index: 5,  name: 'Kanya',     english: 'Virgo',       symbol: '♍', dates: 'Aug 23 – Sep 22', element: 'Earth' },
  { index: 6,  name: 'Tula',      english: 'Libra',       symbol: '♎', dates: 'Sep 23 – Oct 22', element: 'Air' },
  { index: 7,  name: 'Vrischika', english: 'Scorpio',     symbol: '♏', dates: 'Oct 23 – Nov 21', element: 'Water' },
  { index: 8,  name: 'Dhanu',     english: 'Sagittarius', symbol: '♐', dates: 'Nov 22 – Dec 21', element: 'Fire' },
  { index: 9,  name: 'Makara',    english: 'Capricorn',   symbol: '♑', dates: 'Dec 22 – Jan 19', element: 'Earth' },
  { index: 10, name: 'Kumbha',    english: 'Aquarius',    symbol: '♒', dates: 'Jan 20 – Feb 18', element: 'Air' },
  { index: 11, name: 'Meena',     english: 'Pisces',      symbol: '♓', dates: 'Feb 19 – Mar 20', element: 'Water' },
];

const OPENINGS = [
  'The stars favour calm, steady progress today.',
  'A bright surge of energy moves in your favour.',
  'Patience and a gentle heart open the right doors.',
  'The day rewards courage tempered with wisdom.',
  'Quiet reflection brings unexpected clarity.',
  'Harmony at home sets the tone for everything else.',
  'A long-held intention finds fresh momentum.',
  'Listen more than you speak, and insight follows.',
];

const DOMAINS = [
  'In work, a thoughtful word earns lasting goodwill.',
  'Family bonds feel especially warm — share your time.',
  'Finances steady; avoid impulsive spending this evening.',
  'A creative idea deserves your trust — pursue it.',
  'Health improves with rest and a little sunlight.',
  'An old friend or relative brings welcome news.',
  'Travel or learning plans take a hopeful turn.',
  'Resolve a small misunderstanding before the day ends.',
];

const ADVICE = [
  'Offer a prayer at dawn and begin with gratitude.',
  'Light a diya and set one clear intention.',
  'Help someone quietly — the merit returns manifold.',
  'Keep your promises small and your effort large.',
  'Trust the slow path; it is the surest one today.',
  'Speak kindly to yourself before others.',
  'A moment of silence will settle a restless mind.',
  'Let go of one worry you cannot control.',
];

const COLORS = [
  { name: 'Saffron', hex: '#f57c00' },
  { name: 'Crimson', hex: '#b91c1c' },
  { name: 'Indigo', hex: '#3949ab' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Gold', hex: '#c9a227' },
  { name: 'Turquoise', hex: '#0d9488' },
  { name: 'Maroon', hex: '#7f1d1d' },
  { name: 'Sky Blue', hex: '#0284c7' },
  { name: 'Marigold', hex: '#d97706' },
  { name: 'Ivory', hex: '#e7d9c4' },
];

const MOODS = ['Optimistic', 'Reflective', 'Energetic', 'Calm', 'Determined', 'Joyful', 'Focused', 'Content'];

export interface DailyHoroscope {
  rashi: Rashi;
  prediction: string;
  luckyColor: { name: string; hex: string };
  luckyNumber: number;
  mood: string;
  energy: number; // 1–5
}

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type HoroPeriod = 'daily' | 'tomorrow' | 'yesterday' | 'weekly' | 'monthly' | 'yearly';

export const HORO_PERIODS: { id: HoroPeriod; label: string }[] = [
  { id: 'daily', label: 'Today' },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'weekly', label: 'This Week' },
  { id: 'monthly', label: 'This Month' },
  { id: 'yearly', label: 'This Year' },
];

function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

function isoWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** A stable seed key for the period — changes only when the period rolls over. */
function periodKey(period: HoroPeriod, base: Date): string {
  switch (period) {
    case 'daily': return `D:${base.getFullYear()}-${base.getMonth() + 1}-${base.getDate()}`;
    case 'tomorrow': { const t = addDays(base, 1); return `D:${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()}`; }
    case 'yesterday': { const y = addDays(base, -1); return `D:${y.getFullYear()}-${y.getMonth() + 1}-${y.getDate()}`; }
    case 'weekly': return `W:${base.getFullYear()}-${isoWeek(base)}`;
    case 'monthly': return `M:${base.getFullYear()}-${base.getMonth()}`;
    case 'yearly': return `Y:${base.getFullYear()}`;
  }
}

/** Human label for the chosen period (for the subtitle). */
export function periodLabel(period: HoroPeriod, base: Date): string {
  const fmt = (d: Date) => d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  switch (period) {
    case 'daily': return fmt(base);
    case 'tomorrow': return fmt(addDays(base, 1));
    case 'yesterday': return fmt(addDays(base, -1));
    case 'weekly': return `Week ${isoWeek(base)}, ${base.getFullYear()}`;
    case 'monthly': return base.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    case 'yearly': return `${base.getFullYear()}`;
  }
}

export function getHoroscope(rashiIndex: number, period: HoroPeriod, base: Date): DailyHoroscope {
  const rng = mulberry32(hashStr(`${periodKey(period, base)}#${rashiIndex}`));
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];
  return {
    rashi: RASHIS[rashiIndex],
    prediction: `${pick(OPENINGS)} ${pick(DOMAINS)} ${pick(ADVICE)}`,
    luckyColor: pick(COLORS),
    luckyNumber: 1 + Math.floor(rng() * 9),
    mood: pick(MOODS),
    energy: 2 + Math.floor(rng() * 4),
  };
}

export function getAllHoroscopes(period: HoroPeriod, base: Date): DailyHoroscope[] {
  return RASHIS.map((r) => getHoroscope(r.index, period, base));
}
