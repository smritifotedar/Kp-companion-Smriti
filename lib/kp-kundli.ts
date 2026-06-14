// Vedic Kundli (birth chart) engine — sidereal (Lahiri), whole-sign houses.
//
// Planet positions: Sun & Moon reuse the validated Meeus functions; Mercury–Saturn
// use JPL Keplerian elements (valid ~1800–2050) reduced to geocentric ecliptic
// longitude, then precessed to date and converted to sidereal via Lahiri. Rahu is
// the mean lunar node; Ketu is opposite. Accuracy ≈ arcminutes — ample for sign,
// nakshatra, pada and house placement (not a substitute for a professional ephemeris).

import { getLahiriAyanamsa, getSunLongitude, getMoonLongitudePrecise } from './kp-calendar';
import { gregorianToJD, KP_NAKSHATRAS } from './kp-panchang';

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const mod360 = (d: number) => ((d % 360) + 360) % 360;

export const RASHIS = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
  'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena',
];
export const RASHIS_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];
const RASHI_LORD = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];

export interface GrahaPos {
  name: string;
  abbr: string;
  longitude: number;   // sidereal, 0–360
  rashi: number;       // 0–11
  rashiName: string;
  degInSign: number;   // 0–30
  nakshatra: string;
  nakshatraIndex: number;
  pada: number;        // 1–4
  house: number;       // 1–12 (whole-sign from Lagna)
  retro: boolean;
}

// ── JPL Keplerian elements (J2000) + per-century rates: a(AU) e i L ϖ Ω (deg) ──
interface Elem { a: number[]; e: number[]; i: number[]; L: number[]; w: number[]; o: number[] }
const ELEMENTS: Record<string, Elem> = {
  Mercury: { a: [0.38709927, 0.00000037], e: [0.20563593, 0.00001906], i: [7.00497902, -0.00594749], L: [252.25032350, 149472.67411175], w: [77.45779628, 0.16047689], o: [48.33076593, -0.12534081] },
  Venus:   { a: [0.72333566, 0.00000390], e: [0.00677672, -0.00004107], i: [3.39467605, -0.00078890], L: [181.97909950, 58517.81538729], w: [131.60246718, 0.00268329], o: [76.67984255, -0.27769418] },
  Earth:   { a: [1.00000261, 0.00000562], e: [0.01671123, -0.00004392], i: [-0.00001531, -0.01294668], L: [100.46457166, 35999.37244981], w: [102.93768193, 0.32327364], o: [0.0, 0.0] },
  Mars:    { a: [1.52371034, 0.00001847], e: [0.09339410, 0.00007882], i: [1.84969142, -0.00813131], L: [-4.55343205, 19140.30268499], w: [-23.94362959, 0.44441088], o: [49.55953891, -0.29257343] },
  Jupiter: { a: [5.20288700, -0.00011607], e: [0.04838624, -0.00013253], i: [1.30439695, -0.00183714], L: [34.39644051, 3034.74612775], w: [14.72847983, 0.21252668], o: [100.47390909, 0.20469106] },
  Saturn:  { a: [9.53667594, -0.00125060], e: [0.05386179, -0.00050991], i: [2.48599187, 0.00193609], L: [49.95424423, 1222.49362201], w: [92.59887831, -0.41897216], o: [113.66242448, -0.28867794] },
};

// Heliocentric ecliptic rectangular coords (J2000) for a planet at Julian centuries T
function helio(planet: string, T: number): [number, number, number] {
  const el = ELEMENTS[planet];
  const a = el.a[0] + el.a[1] * T;
  const e = el.e[0] + el.e[1] * T;
  const i = (el.i[0] + el.i[1] * T) * D2R;
  const L = el.L[0] + el.L[1] * T;
  const w = el.w[0] + el.w[1] * T;     // longitude of perihelion ϖ
  const o = (el.o[0] + el.o[1] * T) * D2R; // node Ω
  let M = mod360(L - w);
  if (M > 180) M -= 360;
  const Mr = M * D2R;
  // Solve Kepler's equation
  let E = Mr + e * Math.sin(Mr);
  for (let k = 0; k < 8; k++) {
    const dE = (E - e * Math.sin(E) - Mr) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-9) break;
  }
  // Position in orbital plane
  const xv = a * (Math.cos(E) - e);
  const yv = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const omega = (w - el.o[0] - el.o[1] * T) * D2R; // argument of perihelion ω = ϖ − Ω
  const co = Math.cos(omega), so = Math.sin(omega);
  const cO = Math.cos(o), sO = Math.sin(o);
  const ci = Math.cos(i), si = Math.sin(i);
  const x = (co * cO - so * sO * ci) * xv + (-so * cO - co * sO * ci) * yv;
  const y = (co * sO + so * cO * ci) * xv + (-so * sO + co * cO * ci) * yv;
  const z = (so * si) * xv + (co * si) * yv;
  return [x, y, z];
}

// Geocentric of-date tropical ecliptic longitude (deg) for an outer/inner planet
function geoTropical(planet: string, jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const [px, py, pz] = helio(planet, T);
  const [ex, ey, ez] = helio('Earth', T);
  const gx = px - ex, gy = py - ey, gz = pz - ez;
  void gz;
  let lon = mod360(Math.atan2(gy, gx) * R2D);
  // precession J2000 → date (general precession in longitude ≈ 1.39697°/century)
  lon = mod360(lon + 1.396971 * T + 0.0003086 * T * T);
  return lon;
}

function toSidereal(tropical: number, jd: number): number {
  return mod360(tropical - getLahiriAyanamsa(jd));
}

// Rahu (mean lunar node), of-date tropical
function rahuTropical(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return mod360(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T);
}

// ── Ascendant (Lagna), sidereal ───────────────────────────────────────────────
function ascendantSidereal(jdUT: number, latDeg: number, lngDeg: number): number {
  const T = (jdUT - 2451545.0) / 36525;
  // Greenwich Mean Sidereal Time (deg)
  let gmst = 280.46061837 + 360.98564736629 * (jdUT - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000;
  gmst = mod360(gmst);
  const lst = mod360(gmst + lngDeg);               // local sidereal time (RAMC) in deg
  const ramc = lst * D2R;
  const eps = (23.439291 - 0.0130042 * T) * D2R;    // obliquity
  const lat = latDeg * D2R;
  // Tropical ascendant longitude
  let asc = Math.atan2(Math.cos(ramc), -(Math.sin(ramc) * Math.cos(eps) + Math.tan(lat) * Math.sin(eps))) * R2D;
  asc = mod360(asc);
  return toSidereal(asc, jdUT);
}

// ── Nakshatra / pada helpers ──────────────────────────────────────────────────
const NAK_SPAN = 360 / 27;       // 13.333°
const PADA_SPAN = NAK_SPAN / 4;  // 3.333°
function nakshatraOf(lon: number) {
  const idx = Math.floor(lon / NAK_SPAN) % 27;
  const pada = Math.floor((lon % NAK_SPAN) / PADA_SPAN) + 1;
  return { index: idx, name: KP_NAKSHATRAS[idx], pada };
}

// ── Vimshottari Dasha ─────────────────────────────────────────────────────────
const DASHA_LORDS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const DASHA_YEARS: Record<string, number> = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };
const YEAR_DAYS = 365.2425;

export interface DashaPeriod { lord: string; start: Date; end: Date; }
export interface DashaInfo {
  mahas: DashaPeriod[];
  currentMaha: DashaPeriod | null;
  currentAntar: DashaPeriod | null;
}

function computeDasha(moonLon: number, birth: Date): DashaInfo {
  const nakIdx = Math.floor(moonLon / NAK_SPAN) % 27;
  const fraction = (moonLon % NAK_SPAN) / NAK_SPAN;        // traversed within nakshatra
  const startLordIdx = nakIdx % 9;
  const firstLord = DASHA_LORDS[startLordIdx];
  const balanceYears = DASHA_YEARS[firstLord] * (1 - fraction);

  const mahas: DashaPeriod[] = [];
  let cursor = new Date(birth.getTime() - (DASHA_YEARS[firstLord] - balanceYears) * YEAR_DAYS * 86400000);
  // (cursor = notional start of the first maha, before birth)
  for (let k = 0; k < 9; k++) {
    const lord = DASHA_LORDS[(startLordIdx + k) % 9];
    const yrs = DASHA_YEARS[lord];
    const start = new Date(cursor);
    const end = new Date(cursor.getTime() + yrs * YEAR_DAYS * 86400000);
    mahas.push({ lord, start, end });
    cursor = end;
  }

  const now = new Date();
  const currentMaha = mahas.find((m) => now >= m.start && now < m.end) ?? null;

  let currentAntar: DashaPeriod | null = null;
  if (currentMaha) {
    const mahaYrs = DASHA_YEARS[currentMaha.lord];
    const mahaIdx = DASHA_LORDS.indexOf(currentMaha.lord);
    let c = new Date(currentMaha.start);
    for (let k = 0; k < 9; k++) {
      const lord = DASHA_LORDS[(mahaIdx + k) % 9];
      const antarYrs = (DASHA_YEARS[lord] * mahaYrs) / 120;
      const start = new Date(c);
      const end = new Date(c.getTime() + antarYrs * YEAR_DAYS * 86400000);
      if (now >= start && now < end) { currentAntar = { lord, start, end }; break; }
      c = end;
    }
  }
  return { mahas, currentMaha, currentAntar };
}

// ── Main: generate a Kundli ───────────────────────────────────────────────────
export interface Kundli {
  jdUT: number;
  ayanamsa: number;
  lagna: { longitude: number; rashi: number; rashiName: string; degInSign: number; nakshatra: string; pada: number };
  grahas: GrahaPos[];
  moonRashi: number;
  janmaNakshatra: { name: string; index: number; pada: number };
  sunRashi: number;
  dasha: DashaInfo;
}

const PLANET_META: { name: string; abbr: string }[] = [
  { name: 'Sun', abbr: 'Su' }, { name: 'Moon', abbr: 'Mo' }, { name: 'Mars', abbr: 'Ma' },
  { name: 'Mercury', abbr: 'Me' }, { name: 'Jupiter', abbr: 'Ju' }, { name: 'Venus', abbr: 'Ve' },
  { name: 'Saturn', abbr: 'Sa' }, { name: 'Rahu', abbr: 'Ra' }, { name: 'Ketu', abbr: 'Ke' },
];

function siderealLongitude(name: string, jd: number): number {
  switch (name) {
    case 'Sun': return toSidereal(getSunLongitude(jd), jd);
    case 'Moon': return toSidereal(getMoonLongitudePrecise(jd), jd);
    case 'Rahu': return toSidereal(rahuTropical(jd), jd);
    case 'Ketu': return mod360(toSidereal(rahuTropical(jd), jd) + 180);
    default: return toSidereal(geoTropical(name, jd), jd);
  }
}

export function generateKundli(date: Date, hourIST: number, lat: number, lng: number, tz: number): Kundli {
  // Birth instant in UT
  const jdNoonUT = gregorianToJD(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const jdUT = jdNoonUT - 0.5 + (hourIST - tz) / 24;

  const lagnaLon = ascendantSidereal(jdUT, lat, lng);
  const lagnaRashi = Math.floor(lagnaLon / 30) % 12;
  const lagnaNak = nakshatraOf(lagnaLon);

  const grahas: GrahaPos[] = PLANET_META.map((pm) => {
    const lon = siderealLongitude(pm.name, jdUT);
    const rashi = Math.floor(lon / 30) % 12;
    const nak = nakshatraOf(lon);
    // retrograde (not for Sun/Moon/Rahu/Ketu)
    let retro = false;
    if (!['Sun', 'Moon', 'Rahu', 'Ketu'].includes(pm.name)) {
      const lon2 = siderealLongitude(pm.name, jdUT + 0.7);
      let diff = lon2 - lon;
      if (diff > 180) diff -= 360; else if (diff < -180) diff += 360;
      retro = diff < 0;
    }
    if (pm.name === 'Rahu' || pm.name === 'Ketu') retro = true; // nodes always retrograde
    const house = ((rashi - lagnaRashi + 12) % 12) + 1;
    return {
      name: pm.name, abbr: pm.abbr, longitude: lon, rashi, rashiName: RASHIS[rashi],
      degInSign: lon % 30, nakshatra: nak.name, nakshatraIndex: nak.index, pada: nak.pada, house, retro,
    };
  });

  const moon = grahas.find((g) => g.name === 'Moon')!;
  const sun = grahas.find((g) => g.name === 'Sun')!;

  return {
    jdUT,
    ayanamsa: getLahiriAyanamsa(jdUT),
    lagna: {
      longitude: lagnaLon, rashi: lagnaRashi, rashiName: RASHIS[lagnaRashi],
      degInSign: lagnaLon % 30, nakshatra: lagnaNak.name, pada: lagnaNak.pada,
    },
    grahas,
    moonRashi: moon.rashi,
    janmaNakshatra: { name: moon.nakshatra, index: moon.nakshatraIndex, pada: moon.pada },
    sunRashi: sun.rashi,
    dasha: computeDasha(moon.longitude, date),
  };
}

export function rashiLord(rashi: number): string { return RASHI_LORD[rashi]; }
export { RASHI_LORD };
