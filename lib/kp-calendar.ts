// Full KP Panchang Calendar Engine
// Sapta Rishi Samvat / Laukika Samvat — Kashmiri Pandit tradition
//
// Astronomical accuracy note:
// Tithi/Nakshatra are calculated using Jean Meeus "Astronomical Algorithms" (Ch. 22/47)
// with angles properly reduced mod 360° to avoid floating-point precision loss.
// Accuracy is ±1 tithi on boundary days. For exact results always verify
// against the official Vijayeshwar Panchang.

import { gregorianToJD, KP_MONTHS, KP_NAKSHATRAS, KP_TITHIS, getSaptaRishiSamvat, KP_MUHURAT_TYPES } from './kp-panchang';

export type MuhuratType = typeof KP_MUHURAT_TYPES[0];

// ─── Panchang constants ───────────────────────────────────────────────────────

export const KP_YOGAS = [
  'Vishkambha','Preeti','Ayushman','Saubhagya','Shobhana',
  'Atiganda','Sukarma','Dhriti','Shoola','Ganda',
  'Vriddhi','Dhruva','Vyaghata','Harshana','Vajra',
  'Siddhi','Vyatipata','Variyana','Parigha','Shiva',
  'Siddha','Sadhya','Shubha','Shukla','Brahma',
  'Indra','Vaidhriti',
];

// 60 karana slots for a full lunar month (first 4 fixed, then 7 repeating)
const KARANA_NAMES = ['Bava','Balava','Kaulava','Taitila','Garija','Vanija','Vishti'];
const FIXED_KARANAS = ['Kimstughna','Shakuni','Chatushpada','Naga'];

export function getKaranaName(karanaSerial: number): string {
  // serial 0 = Kimstughna (Krishna 14 second half), 1 = Bava (Shukla 1 first half)…
  if (karanaSerial === 0) return FIXED_KARANAS[0]; // Kimstughna
  if (karanaSerial >= 57) return FIXED_KARANAS[karanaSerial - 56]; // Shakuni, Chatushpada, Naga
  return KARANA_NAMES[(karanaSerial - 1) % 7];
}

export const KP_VARAS = [
  { name: 'Ravivara',   kashmiri: 'Aadith',   deity: 'Surya' },
  { name: 'Somavara',   kashmiri: 'Som',       deity: 'Chandra' },
  { name: 'Mangalavara',kashmiri: 'Mangal',    deity: 'Mangala' },
  { name: 'Budhavara',  kashmiri: 'Budh',      deity: 'Budha' },
  { name: 'Guruvara',   kashmiri: 'Braspati',  deity: 'Brihaspati' },
  { name: 'Shukravara', kashmiri: 'Shukur',    deity: 'Shukra' },
  { name: 'Shanivara',  kashmiri: 'Shan',      deity: 'Shani' },
];

// Lahiri ayanamsa (Chitrapaksha) — matches Indian government / Rashtriya Panchang standard
// Approximate for year ~2026; grows ~50.3"/year
// Formula: ayanamsa = 23.85 + (year - 2000) * 0.01397
export function getLahiriAyanamsa(jd: number): number {
  const year = 2000 + (jd - 2451545.0) / 365.25;
  return 23.85 + (year - 2000) * 0.01397;
}

// ─── Core: reduce degrees to [0, 360) BEFORE sin/cos ─────────────────────────
// This is critical — unmodded large angles cause floating-point precision loss

function mod360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function rad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// ─── Sun longitude (Jean Meeus Ch. 25, low-precision) ────────────────────────

export function getSunLongitude(jd: number): number {
  const T  = (jd - 2451545.0) / 36525;
  const L0 = mod360(280.46646 + 36000.76983 * T);
  const M  = mod360(357.52911 + 35999.05029 * T);
  const C  =
    (1.914602 - 0.004817 * T) * Math.sin(rad(M))
    + 0.019993 * Math.sin(rad(2 * M))
    + 0.000289 * Math.sin(rad(3 * M));
  return mod360(L0 + C);
}

// ─── Moon longitude (Jean Meeus Ch. 47, truncated to ~0.3° accuracy) ─────────
// All angles reduced mod 360 before sin/cos to prevent precision loss

export function getMoonLongitudePrecise(jd: number): number {
  const T  = (jd - 2451545.0) / 36525;

  // Mean arguments (degrees) — reduced immediately
  const L0 = mod360(218.3165 + 481267.8813 * T);   // mean longitude
  const M  = mod360(134.9634 + 477198.8676 * T);   // moon mean anomaly
  const Ms = mod360(357.5291 + 35999.0503  * T);   // sun mean anomaly
  const D  = mod360(297.8502 + 445267.1115 * T);   // mean elongation
  const F  = mod360(93.2720  + 483202.0175 * T);   // arg of latitude

  // Correction terms (degrees)
  const dL =
      6.2886 * Math.sin(rad(M))
    + 1.2740 * Math.sin(rad(2*D - M))
    + 0.6583 * Math.sin(rad(2*D))
    + 0.2136 * Math.sin(rad(2*M))
    - 0.1851 * Math.sin(rad(Ms))
    - 0.1143 * Math.sin(rad(2*F))
    + 0.0588 * Math.sin(rad(2*D - 2*M))
    + 0.0572 * Math.sin(rad(2*D - Ms - M))
    + 0.0533 * Math.sin(rad(2*D + M))
    + 0.0459 * Math.sin(rad(2*D - Ms))
    + 0.0410 * Math.sin(rad(M - Ms))
    + 0.0350 * Math.sin(rad(2*D + Ms))
    - 0.0307 * Math.sin(rad(D))
    + 0.0265 * Math.sin(rad(2*F + M))
    + 0.0249 * Math.sin(rad(2*D - M + Ms))
    + 0.0231 * Math.sin(rad(2*D + 2*M))
    - 0.0214 * Math.sin(rad(2*F - M))
    + 0.0173 * Math.sin(rad(4*D - M))
    + 0.0167 * Math.sin(rad(2*D - 2*F))
    - 0.0111 * Math.sin(rad(M + Ms))
    + 0.0103 * Math.sin(rad(4*D - 2*M))
    - 0.0084 * Math.sin(rad(2*Ms))
    - 0.0083 * Math.sin(rad(2*D + Ms - M))
    + 0.0083 * Math.sin(rad(2*D - Ms + M))
    + 0.0082 * Math.sin(rad(2*D + 2*F - M))
    - 0.0081 * Math.sin(rad(2*D + Ms + M))
    + 0.0074 * Math.sin(rad(2*F - 2*D))
    + 0.0067 * Math.sin(rad(4*D - 3*M))
    + 0.0066 * Math.sin(rad(D - Ms))
    - 0.0063 * Math.sin(rad(D + M))
    - 0.0059 * Math.sin(rad(2*D - Ms + 2*F))
    - 0.0058 * Math.sin(rad(2*D - Ms - M))
    + 0.0051 * Math.sin(rad(M + 2*F))
    + 0.0041 * Math.sin(rad(2*D - M - 2*F))
    + 0.0038 * Math.sin(rad(2*D - Ms - 2*M))
    + 0.0033 * Math.sin(rad(3*M))
    + 0.0031 * Math.sin(rad(4*D + M))
    - 0.0029 * Math.sin(rad(Ms + F));

  return mod360(L0 + dL);
}

// ─── Sidereal conversion ──────────────────────────────────────────────────────

function toSidereal(tropical: number, jd: number): number {
  return mod360(tropical - getLahiriAyanamsa(jd));
}

// ─── KP Panchang element types ────────────────────────────────────────────────

export interface DayPanchang {
  date: Date;
  jd: number;
  // Tithi
  tithiNumber: number;        // 1–15
  tithiName: string;
  paksha: 'shukla' | 'krishna';
  pakshaLabel: string;
  elongation: number;         // 0–360°
  // Nakshatra
  nakshatraIndex: number;     // 0–26
  nakshatra: string;
  nakshatraPada: number;      // 1–4
  // Yoga
  yogaIndex: number;
  yoga: string;
  // Karana
  karana: string;
  // Vara
  vara: typeof KP_VARAS[0];
  // KP month (solar, sidereal)
  kpSolarMonth: number;       // 1–12
  kpMonthName: string;
  kpMonthKashmiri: string;
  // KP lunar month (amanta — named after the sankranti within the lunation)
  kpLunarMonth: number;       // 1–12
  kpLunarMonthName: string;
  kpLunarMonthKashmiri: string;
  samvatYear: number;
  // Longitudes
  sunLongSidereal: number;
  moonLongSidereal: number;
  moonRashi: string;
  // Events
  festivals: KPCalendarEvent[];
  // Flags
  isAmavasya: boolean;
  isPurnima: boolean;
  isEkadashi: boolean;
  isAshtami: boolean;
  isChaturdashi: boolean;
}

// ─── Event types ──────────────────────────────────────────────────────────────

export interface KPCalendarEvent {
  id: string;
  name: string;
  kashmiri: string;
  type: 'major' | 'monthly' | 'samskara' | 'solar' | 'vrat' | 'auspicious';
  color: string;
  description: string;
  uniqueToKP?: boolean;
}

// ─── Event rules (tithi-based matching) ──────────────────────────────────────

interface EventRule {
  id: string;
  name: string;
  kashmiri: string;
  type: KPCalendarEvent['type'];
  color: string;
  description: string;
  uniqueToKP?: boolean;
  kpMonth: number;           // 0 = every month
  paksha: 'shukla' | 'krishna' | 'both';
  tithiNumber: number;       // -1 = any
  weekday?: number;          // 0=Sun … 6=Sat
}

export const KP_EVENT_RULES: EventRule[] = [
  // ── MAJOR KP FESTIVALS ────────────────────────────────────────────────────
  {
    id: 'navreh', name: 'Navreh — KP New Year', kashmiri: 'नवरेह',
    type: 'major', color: '#e06500', uniqueToKP: true,
    description: 'Kashmiri Pandit New Year. Pratipada Shukla Paksha, Chaitra (Sapta Rishi Samvat). Navreh Thaal prepared the night before: rice, walnuts, curd, haak, coins, pen. First sight of the day must be the Thaal. Prayers to Sharika Mata.',
    kpMonth: 1, paksha: 'shukla', tithiNumber: 1,
  },
  {
    id: 'herath', name: 'Herath — KP Shivaratri', kashmiri: 'हेरथ',
    type: 'major', color: '#6d28d9', uniqueToKP: true,
    description: 'Holiest night for Kashmiri Pandits. Chaturdashi Krishna Paksha, Phalguna. Vatuk (earthen pots filled with water) represent Lord Shiva. All-night vigil, traditional fish and mutton offerings. Completely distinct from Maha Shivaratri in timing and observance.',
    kpMonth: 12, paksha: 'krishna', tithiNumber: 14,
  },
  {
    id: 'zyeth-atham', name: 'Zyeth Atham', kashmiri: 'ज्येठ अठम',
    type: 'major', color: '#b45309', uniqueToKP: true,
    description: 'Ashtami Shukla Paksha, Jyeshtha (Zyesth). Worship of Ragnya Bhagwati — Sharika Devi. Traditional pilgrimage to Hari Parbat. Sindoor, marigold, Sharika Stotram.',
    kpMonth: 3, paksha: 'shukla', tithiNumber: 8,
  },
  {
    id: 'khichdi-mavas', name: 'Khet Khichdi / Khetsrimavas', kashmiri: 'खेत खिचड़ी',
    type: 'major', color: '#047857', uniqueToKP: true,
    description: 'Amavasya of Pausha (Poh) — KP harvest festival. Khichdi prepared in open fields as gratitude offering. Ancestor tarpan (Pitru Paksha observance).',
    kpMonth: 10, paksha: 'krishna', tithiNumber: 15,
  },
  {
    id: 'gaad-batta', name: 'Gaad Batta', kashmiri: 'गाड बट',
    type: 'major', color: '#0e7490', uniqueToKP: true,
    description: 'Pratipada Shukla Paksha, Magha — the morning after Khetsimavas. Fish (gaad) and rice (batta) are offered to the Ghar Devta, the family guardian deity, in a sacred niche of the home, then shared as a family meal.',
    kpMonth: 11, paksha: 'shukla', tithiNumber: 1,
  },
  {
    id: 'gatah-ashtami', name: 'Gatah Ashtami', kashmiri: 'गत अष्टमी',
    type: 'major', color: '#b45309', uniqueToKP: true,
    description: 'Krishna Paksha Ashtami of Margashirsha — important KP observance dedicated to ancestral rites and family deity worship.',
    kpMonth: 9, paksha: 'krishna', tithiNumber: 8,
  },
  // ── MONTHLY OBSERVANCES ──────────────────────────────────────────────────
  {
    id: 'sharika-ashtami', name: 'Sharika Ashtami', kashmiri: 'शारिका अष्टमी',
    type: 'monthly', color: '#dc2626', uniqueToKP: true,
    description: 'Monthly Ashtami — worship of Sharika Devi, presiding deity of Kashmir (Hari Parbat). Sindoor, marigold, lamp. Recitation of Sharika Stotram. Observed by KP families every Shukla Ashtami.',
    kpMonth: 0, paksha: 'shukla', tithiNumber: 8,
  },
  {
    id: 'purnima', name: 'Purnima', kashmiri: 'पूर्णिमा',
    type: 'monthly', color: '#0369a1',
    description: 'Full moon — auspicious for prayers, Satyanarayan Puja, charitable acts and sacred bathing.',
    kpMonth: 0, paksha: 'shukla', tithiNumber: 15,
  },
  {
    id: 'amavasya', name: 'Amavasya', kashmiri: 'अमावस्या',
    type: 'monthly', color: '#374151',
    description: 'New moon — day of ancestor veneration (Pitru Tarpan). Avoid new beginnings. Offer water and sesame to ancestors.',
    kpMonth: 0, paksha: 'krishna', tithiNumber: 15,
  },
  {
    id: 'ekadashi-shukla', name: 'Ekadashi (Shukla)', kashmiri: 'एकादशी',
    type: 'vrat', color: '#0f766e',
    description: 'Shukla Paksha Ekadashi — fasting and Vishnu worship. One of the most sacred observances.',
    kpMonth: 0, paksha: 'shukla', tithiNumber: 11,
  },
  {
    id: 'ekadashi-krishna', name: 'Ekadashi (Krishna)', kashmiri: 'एकादशी',
    type: 'vrat', color: '#0f766e',
    description: 'Krishna Paksha Ekadashi — fasting and Vishnu worship.',
    kpMonth: 0, paksha: 'krishna', tithiNumber: 11,
  },
  {
    id: 'pradosh-shukla', name: 'Pradosh Vrat (Shukla)', kashmiri: 'प्रदोष',
    type: 'vrat', color: '#7c3aed',
    description: 'Trayodashi Shukla Paksha — Shiva worship at twilight (dusk). Fast observed from sunrise to three hours after sunset.',
    kpMonth: 0, paksha: 'shukla', tithiNumber: 13,
  },
  {
    id: 'pradosh-krishna', name: 'Pradosh Vrat (Krishna)', kashmiri: 'प्रदोष',
    type: 'vrat', color: '#7c3aed',
    description: 'Trayodashi Krishna Paksha — Shiva worship at twilight.',
    kpMonth: 0, paksha: 'krishna', tithiNumber: 13,
  },
  {
    id: 'chaturdashi-shiva', name: 'Maasik Shivaratri', kashmiri: 'मासिक शिवरात्री',
    type: 'monthly', color: '#4c1d95',
    description: 'Chaturdashi Krishna Paksha — monthly Shivaratri. Night puja of Lord Shiva. (Note: Herath falls on this tithi in Phalguna.)',
    kpMonth: 0, paksha: 'krishna', tithiNumber: 14,
  },
  // ── SPECIFIC FESTIVALS ───────────────────────────────────────────────────
  {
    id: 'basant-panchami', name: 'Basant Panchami / Saraswati Puja', kashmiri: 'बसंत पंचमी',
    type: 'major', color: '#ca8a04',
    description: 'Panchami Shukla Paksha, Magha — Saraswati Puja. Worship of Goddess of Knowledge. Yellow garments worn. Springtime begins.',
    kpMonth: 11, paksha: 'shukla', tithiNumber: 5,
  },
  {
    id: 'ram-navami', name: 'Ram Navami', kashmiri: 'राम नवमी',
    type: 'major', color: '#b45309',
    description: 'Navami Shukla Paksha, Chaitra — birth of Lord Rama. Fasting and Ram Katha recitation.',
    kpMonth: 1, paksha: 'shukla', tithiNumber: 9,
  },
  {
    id: 'akshaya-tritiya', name: 'Akshaya Tritiya', kashmiri: 'अक्षय तृतीया',
    type: 'auspicious', color: '#d97706',
    description: 'Tritiya Shukla Paksha, Vaishakha — highly auspicious day (Swayamsiddha Muhurat). Gold purchase, new beginnings, marriages. Never-diminishing (akshaya) prosperity.',
    kpMonth: 2, paksha: 'shukla', tithiNumber: 3,
  },
  {
    id: 'guru-purnima', name: 'Guru Purnima', kashmiri: 'गुरु पूर्णिमा',
    type: 'major', color: '#f59e0b',
    description: 'Purnima of Ashadha — veneration of teachers, gurus and the Guru Parampara. Vyasa Purnima.',
    kpMonth: 4, paksha: 'shukla', tithiNumber: 15,
  },
  {
    id: 'raksha-bandhan', name: 'Raksha Bandhan', kashmiri: 'राखी',
    type: 'major', color: '#ec4899',
    description: 'Purnima of Shravana — sisters tie rakhi on brothers. Sacred bond of protection.',
    kpMonth: 5, paksha: 'shukla', tithiNumber: 15,
  },
  {
    id: 'janmashtami', name: 'Janmashtami', kashmiri: 'जन्माष्टमी',
    type: 'major', color: '#1d4ed8',
    description: 'Ashtami Krishna Paksha, Shravana — birth of Lord Krishna. Midnight celebration, Dahi Handi.',
    kpMonth: 5, paksha: 'krishna', tithiNumber: 8,
  },
  {
    id: 'ganesh-chaturthi', name: 'Ganesh Chaturthi', kashmiri: 'गणेश चतुर्थी',
    type: 'major', color: '#ea580c',
    description: 'Chaturthi Shukla Paksha, Bhadrapada — birth of Lord Ganesha. 10-day celebration.',
    kpMonth: 6, paksha: 'shukla', tithiNumber: 4,
  },
  {
    id: 'pitru-paksha-start', name: 'Pitru Paksha Begins', kashmiri: 'पितृ पक्ष आरम्भ',
    type: 'monthly', color: '#64748b',
    description: 'Purnima of Bhadrapada — start of the 16-day Pitru Paksha (Mahalaya). Ancestor Shraddha performed daily.',
    kpMonth: 6, paksha: 'shukla', tithiNumber: 15,
  },
  {
    id: 'navratri-ashwina', name: 'Sharada Navratri Begins', kashmiri: 'नवरात्री आरम्भ',
    type: 'major', color: '#be185d',
    description: 'Pratipada Shukla Paksha, Ashwina — nine nights of Devi worship. Sharika Mata especially worshipped by KP community.',
    kpMonth: 7, paksha: 'shukla', tithiNumber: 1,
  },
  {
    id: 'dussehra', name: 'Vijaya Dashami / Dussehra', kashmiri: 'विजय दशमी',
    type: 'major', color: '#b91c1c',
    description: 'Dashami Shukla Paksha, Ashwina — victory of Devi over Mahishasura. End of Navratri. Shastra Puja.',
    kpMonth: 7, paksha: 'shukla', tithiNumber: 10,
  },
  {
    id: 'diwali', name: 'Diwali / Deepavali', kashmiri: 'दीवाली',
    type: 'major', color: '#f59e0b',
    description: 'Amavasya of Kartika — festival of lights. Lakshmi Puja at night. KP families light diyas and perform Laxmi-Kubera puja.',
    kpMonth: 8, paksha: 'krishna', tithiNumber: 15,
  },
  {
    id: 'bhai-dooj', name: 'Bhai Dooj', kashmiri: 'भाई दूज',
    type: 'major', color: '#7c3aed',
    description: 'Dwitiya Shukla Paksha, Kartika — celebration of the brother-sister bond. Sisters apply tilak on brothers.',
    kpMonth: 8, paksha: 'shukla', tithiNumber: 2,
  },
  {
    id: 'kartika-purnima', name: 'Kartika Purnima / Dev Diwali', kashmiri: 'कार्तिक पूर्णिमा',
    type: 'major', color: '#2563eb',
    description: 'Purnima of Kartika — sacred full moon. Dev Diwali, lamps lit at river ghats. Tripuri Purnima.',
    kpMonth: 8, paksha: 'shukla', tithiNumber: 15,
  },
  {
    id: 'vivah-panchami', name: 'Vivah Panchami', kashmiri: 'विवाह पंचमी',
    type: 'major', color: '#ec4899',
    description: 'Panchami Shukla Paksha, Margashirsha — wedding anniversary of Rama and Sita.',
    kpMonth: 9, paksha: 'shukla', tithiNumber: 5,
  },
  {
    id: 'navratri-chaitra', name: 'Chaitra Navratri Begins', kashmiri: 'चैत्र नवरात्री',
    type: 'major', color: '#be185d',
    description: 'Pratipada Shukla Paksha, Chaitra — nine nights of Devi Bhagwati. Note: Navreh (KP New Year) also falls on this day.',
    kpMonth: 1, paksha: 'shukla', tithiNumber: 1,
  },
  {
    id: 'maha-shivaratri', name: 'Maha Shivaratri', kashmiri: 'महाशिवरात्री',
    type: 'major', color: '#7c3aed',
    description: 'Chaturdashi Krishna Paksha, Magha — great night of Shiva. (KP community observes Herath in Phalguna as the primary Shivaratri.)',
    kpMonth: 11, paksha: 'krishna', tithiNumber: 14,
  },
  {
    id: 'holika-dahan', name: 'Holika Dahan', kashmiri: 'होलिका दहन',
    type: 'major', color: '#ea580c',
    description: 'Purnima of Phalguna — bonfire celebrating victory of Prahlad. Holi (colours) next day.',
    kpMonth: 12, paksha: 'shukla', tithiNumber: 15,
  },
];

// ─── Sapta Rishi Samvat with Navreh boundary ──────────────────────────────────
// The Samvat year changes on Navreh (Chaitra Shukla Pratipada).
// As a practical approximation: year changes when KP solar month becomes Chaitra (month 1).
// Exact boundary requires computing actual Navreh; here we use solar month as proxy.

export function getKPSamvatYear(kpSolarMonth: number, gregorianYear: number): number {
  // Chaitra (month 1) corresponds to Aries — roughly mid-April to mid-May
  // If KP solar month is Jan–March (months 10, 11, 12 = Pausha, Magha, Phalguna), the new year hasn't started
  // Simple proxy: months 10-12 still belong to the previous Samvat year
  const base = getSaptaRishiSamvat(gregorianYear); // year + 3076
  // Phalguna (12) and Pausha (10), Magha (11) are before Navreh in the calendar year
  // BUT these months span Jan–April of the Gregorian year, so the Samvat year started the previous April
  // Approximation: if solar month ≥ 1 (Chaitra/Aries) Samvat = base, else Samvat = base - 1
  if (kpSolarMonth <= 9) return base; // Chaitra through Margashirsha (Apr–Jan)
  return base - 1;                    // Pausha, Magha, Phalguna (Jan–Apr still previous Samvat)
}

// ─── Compute full panchang for one day ───────────────────────────────────────
// Time: sunrise proxy = 6:00 AM IST = 0.25 days (matches Vijayeshwar which uses sunrise tithi)

const SUNRISE_OFFSET = 0.25; // 6:00 AM IST offset from midnight

export function computeDayPanchang(
  date: Date,
  events: KPCalendarEvent[] = [],
  hourIST?: number, // optional local IST hour (e.g. birth time). Defaults to sunrise (6:00).
): DayPanchang {
  // gregorianToJD returns JD at noon (standard Julian Day convention).
  // To get 6:00 AM IST we must go back to midnight UTC first: noon - 0.5 days.
  // Then: midnight UTC + SUNRISE_OFFSET (6h local) - IST offset (5.5h) = 0:30 AM UTC = 6:00 AM IST.
  const jdNoon = gregorianToJD(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const dayFraction = hourIST === undefined ? SUNRISE_OFFSET : hourIST / 24;
  const jd = jdNoon - 0.5 + dayFraction - (5.5 / 24); // IST → UTC

  const ayanamsa = getLahiriAyanamsa(jd);

  const sunTrop   = getSunLongitude(jd);
  const moonTrop  = getMoonLongitudePrecise(jd);
  const sunSid    = toSidereal(sunTrop, jd);
  const moonSid   = toSidereal(moonTrop, jd);

  // ── Tithi: (moon - sun elongation) / 12, mod 360 ──────────────────────────
  const elongation   = mod360(moonTrop - sunTrop);          // 0–360°
  const tithiRaw     = Math.floor(elongation / 12);          // 0–29
  const paksha: 'shukla' | 'krishna' = tithiRaw < 15 ? 'shukla' : 'krishna';
  const tithiSeq     = tithiRaw % 15;                        // 0–14 within paksha
  const tithiNumber  = tithiSeq + 1;                         // 1–15

  const isAmavasya   = paksha === 'krishna' && tithiNumber === 15;
  const isPurnima    = paksha === 'shukla'  && tithiNumber === 15;
  const tithiName    = isPurnima ? 'Purnima' : isAmavasya ? 'Amavasya' : (KP_TITHIS[tithiSeq] ?? 'Unknown');

  // ── Nakshatra ─────────────────────────────────────────────────────────────
  const nakshatraSpan  = 360 / 27;                           // 13.333°
  const nakshatraIndex = Math.floor(moonSid / nakshatraSpan) % 27;
  const nakshatraPada  = Math.floor((moonSid % nakshatraSpan) / (nakshatraSpan / 4)) + 1;

  // ── Yoga = (sun + moon sidereal) / (360/27) ──────────────────────────────
  const yogaIndex      = Math.floor(mod360(sunSid + moonSid) / nakshatraSpan) % 27;

  // ── Karana = half-tithi slot ──────────────────────────────────────────────
  const halfTithiPos   = elongation / 6;   // 0–60
  const karanaSerial   = Math.floor(halfTithiPos) % 60;
  const karana         = getKaranaName(karanaSerial);

  // ── Vara ──────────────────────────────────────────────────────────────────
  const vara           = KP_VARAS[date.getDay()];

  // ── KP Solar Month (sidereal sun sign) ────────────────────────────────────
  // Aries (0°–30°) = Chaitra (1), Taurus = Vaishakha (2), … Pisces = Phalguna (12)
  const sunSign        = Math.floor(sunSid / 30) % 12;       // 0–11
  const kpSolarMonth   = sunSign + 1;                         // 1–12
  const kpMonthObj     = KP_MONTHS.find(m => m.number === kpSolarMonth);

  // ── KP Lunar Month (amanta) ───────────────────────────────────────────────
  // The lunar month is named after the solar sign the sun enters DURING the
  // current lunation (new-moon → new-moon). Find the previous new moon, read the
  // sun's sign there, then the month is the next sign.
  // e.g. new moon while sun in Taurus → Mithuna sankranti follows → Jyeshtha.
  const daysSinceNewMoon = (elongation / 360) * 29.530588853;
  const newMoonJD        = jd - daysSinceNewMoon;
  const sunSidAtNM       = toSidereal(getSunLongitude(newMoonJD), newMoonJD);
  const signAtNewMoon    = Math.floor(sunSidAtNM / 30) % 12;  // 0–11
  const kpLunarMonth     = ((signAtNewMoon + 1) % 12) + 1;    // 1–12
  const kpLunarMonthObj  = KP_MONTHS.find(m => m.number === kpLunarMonth);

  // ── Rashi ─────────────────────────────────────────────────────────────────
  const rashiNames = ['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya',
                      'Tula','Vrischika','Dhanu','Makara','Kumbha','Meena'];
  const moonRashi  = rashiNames[Math.floor(moonSid / 30) % 12];

  // ── Samvat year ───────────────────────────────────────────────────────────
  const samvatYear = getKPSamvatYear(kpSolarMonth, date.getFullYear());

  return {
    date,
    jd,
    tithiNumber,
    tithiName,
    paksha,
    pakshaLabel: paksha === 'shukla' ? 'Shukla' : 'Krishna',
    elongation,
    nakshatraIndex,
    nakshatra: KP_NAKSHATRAS[nakshatraIndex],
    nakshatraPada,
    yogaIndex,
    yoga: KP_YOGAS[yogaIndex],
    karana,
    vara,
    kpSolarMonth,
    kpMonthName:     kpMonthObj?.name     ?? 'Unknown',
    kpMonthKashmiri: kpMonthObj?.kashmiri ?? '',
    kpLunarMonth,
    kpLunarMonthName:     kpLunarMonthObj?.name     ?? 'Unknown',
    kpLunarMonthKashmiri: kpLunarMonthObj?.kashmiri ?? '',
    samvatYear,
    sunLongSidereal:  sunSid,
    moonLongSidereal: moonSid,
    moonRashi,
    festivals: events,
    isAmavasya,
    isPurnima,
    isEkadashi: tithiNumber === 11,
    isAshtami:  tithiNumber === 8,
    isChaturdashi: tithiNumber === 14,
  };
}

// ─── Match events to a day ────────────────────────────────────────────────────

function matchEvents(p: Omit<DayPanchang, 'festivals'>): KPCalendarEvent[] {
  const out: KPCalendarEvent[] = [];
  for (const rule of KP_EVENT_RULES) {
    const monthOk   = rule.kpMonth === 0 || rule.kpMonth === p.kpSolarMonth;
    const pakshaOk  = rule.paksha === 'both' || rule.paksha === p.paksha;
    const tithiOk   = rule.tithiNumber === -1 || rule.tithiNumber === p.tithiNumber;
    const weekdayOk = rule.weekday === undefined || rule.weekday === p.date.getDay();
    if (monthOk && pakshaOk && tithiOk && weekdayOk) {
      out.push({ id: rule.id, name: rule.name, kashmiri: rule.kashmiri,
                 type: rule.type, color: rule.color, description: rule.description,
                 uniqueToKP: rule.uniqueToKP });
    }
  }
  return out;
}

// ─── Build full month calendar ────────────────────────────────────────────────

export interface CalendarDay {
  date: Date | null;
  panchang: DayPanchang | null;
  isToday: boolean;
  isCurrentMonth: boolean;
}

export function buildMonthCalendar(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);
  const today    = new Date(); today.setHours(0, 0, 0, 0);
  const cells: CalendarDay[] = [];

  // Compute all panchangs first so we can detect Sangrandan (solar month transitions)
  const panchangs: DayPanchang[] = [];
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d); date.setHours(0, 0, 0, 0);
    panchangs.push(computeDayPanchang(date));
  }

  // Leading empty cells
  for (let i = 0; i < firstDay.getDay(); i++) {
    cells.push({ date: null, panchang: null, isToday: false, isCurrentMonth: false });
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const partial = panchangs[d - 1];
    const events  = matchEvents(partial);

    // Detect Sangrandan: KP solar month changes from previous day
    const prevMonth = d === 1
      ? computeDayPanchang(new Date(year, month, 0)).kpSolarMonth  // last day of prev month
      : panchangs[d - 2].kpSolarMonth;
    if (partial.kpSolarMonth !== prevMonth) {
      const kpM = KP_MONTHS.find(m => m.number === partial.kpSolarMonth);
      events.unshift({
        id: `sangrandan-${partial.kpSolarMonth}`,
        name: `${kpM?.name ?? ''} Sangrandan`,
        kashmiri: `${kpM?.kashmiri ?? ''} संग्रांद`,
        type: 'solar',
        color: '#15803d',
        description: `Sun enters ${kpM?.name ?? ''} (${kpM?.kashmiri ?? ''}) — start of KP solar month. Observed with prayers and traditional meal in KP households.`,
        uniqueToKP: true,
      });
    }

    cells.push({
      date: panchangs[d - 1].date,
      panchang: { ...partial, festivals: events },
      isToday: partial.date.getTime() === today.getTime(),
      isCurrentMonth: true,
    });
  }
  return cells;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getMonthHeaderInfo(year: number, month: number) {
  const first = computeDayPanchang(new Date(year, month, 1));
  const last  = computeDayPanchang(new Date(year, month + 1, 0));
  const samvatYear = first.samvatYear;

  if (first.kpSolarMonth === last.kpSolarMonth) {
    return {
      kpMonthName: first.kpMonthName,
      kpMonthKashmiri: first.kpMonthKashmiri,
      samvatYear,
      kpSolarMonth: first.kpSolarMonth,
      kpMonthName2: null,
      kpMonthKashmiri2: null,
    };
  }
  // Month spans two KP solar months (Sangrandan mid-month)
  return {
    kpMonthName: first.kpMonthName,
    kpMonthKashmiri: first.kpMonthKashmiri,
    samvatYear,
    kpSolarMonth: first.kpSolarMonth,
    kpMonthName2: last.kpMonthName,
    kpMonthKashmiri2: last.kpMonthKashmiri,
  };
}

// ─── Janma Tithi → Hindu birthday for a chosen year ───────────────────────────
// The lunar birthday recurs on the same tithi + lunar month each year, while the
// Gregorian date shifts. Given a birth date/time, find the Gregorian date in
// `targetYear` when the same lunar month + paksha + tithi occurs.

export interface JanmaBirthdayResult {
  birth: DayPanchang;                 // panchang at the moment of birth
  targetYear: number;
  birthdayDate: Date | null;          // Gregorian date of the lunar birthday
  birthdayPanchang: DayPanchang | null;
  exact: boolean;                     // true if the exact tithi was found (false = nearest, e.g. kshaya tithi)
}

export function findJanmaBirthday(
  birthDate: Date,
  targetYear: number,
  birthHourIST?: number,
): JanmaBirthdayResult {
  const birth = computeDayPanchang(birthDate, [], birthHourIST);

  let exact: { date: Date; p: DayPanchang } | null = null;
  let nearest: { date: Date; p: DayPanchang; diff: number } | null = null;

  for (let m = 0; m < 12 && !exact; m++) {
    const daysInMonth = new Date(targetYear, m + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(targetYear, m, d); date.setHours(0, 0, 0, 0);
      const p = computeDayPanchang(date);
      if (p.kpLunarMonth !== birth.kpLunarMonth) continue;
      if (p.paksha !== birth.paksha) continue;
      if (p.tithiNumber === birth.tithiNumber) {
        exact = { date, p };
        break;
      }
      const diff = Math.abs(p.tithiNumber - birth.tithiNumber);
      if (!nearest || diff < nearest.diff) nearest = { date, p, diff };
    }
  }

  const chosen = exact ?? nearest;
  return {
    birth,
    targetYear,
    birthdayDate: chosen?.date ?? null,
    birthdayPanchang: chosen?.p ?? null,
    exact: !!exact,
  };
}

// ─── Muhurat evaluation (accurate engine) ─────────────────────────────────────

export interface MuhuratDayResult {
  date: Date;
  tithi: string;
  paksha: string;
  nakshatra: string;
  weekday: string;
  rating: number;        // 1–5
  isFavorable: boolean;
  reasoning: string;
}

export function evaluateMuhuratDay(date: Date, type: MuhuratType): MuhuratDayResult {
  const p = computeDayPanchang(date);

  const tithiFav   = type.favorableTithis.includes(p.tithiName);
  const tithiUnfav = type.unfavorableTithis.includes(p.tithiName);
  const nakFav     = type.favorableNakshatras.includes(p.nakshatra);

  let rating = 3;
  if (tithiFav)   rating += 2;
  if (tithiUnfav) rating -= 3;
  if (nakFav)     rating += 2;
  rating = Math.max(1, Math.min(5, rating));

  const isFavorable = rating >= 4 && !tithiUnfav;

  let reasoning = `Tithi: ${p.tithiName} (${p.pakshaLabel} Paksha) — `;
  if (tithiUnfav)     reasoning += 'inauspicious tithi for this activity. ';
  else if (tithiFav)  reasoning += 'favorable tithi. ';
  else                reasoning += 'neutral tithi. ';
  reasoning += `Nakshatra: ${p.nakshatra} — `;
  reasoning += nakFav ? 'auspicious nakshatra for this activity.' : 'neutral nakshatra.';

  return {
    date,
    tithi: p.tithiName,
    paksha: p.pakshaLabel,
    nakshatra: p.nakshatra,
    weekday: p.vara.name,
    rating,
    isFavorable,
    reasoning,
  };
}

// Scan an inclusive date range and return every day evaluated. Capped at 366 days.
export function findMuhuratRange(start: Date, end: Date, type: MuhuratType): MuhuratDayResult[] {
  const results: MuhuratDayResult[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const stop   = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  let guard = 0;
  while (cursor <= stop && guard < 366) {
    results.push(evaluateMuhuratDay(new Date(cursor), type));
    cursor.setDate(cursor.getDate() + 1);
    guard++;
  }
  return results;
}

// ─── Upcoming festivals (scan forward from a date) ────────────────────────────

export interface UpcomingFestival {
  date: Date;
  event: KPCalendarEvent;
}

/**
 * Returns festival occurrences on/after `from`, sorted by date, scanning
 * `monthsAhead` months. Optionally restrict to a set of event types.
 */
export function getUpcomingFestivals(
  from: Date,
  monthsAhead = 13,
  types?: KPCalendarEvent['type'][],
): UpcomingFestival[] {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const out: UpcomingFestival[] = [];

  let y = start.getFullYear();
  let m = start.getMonth();
  for (let i = 0; i < monthsAhead; i++) {
    const cells = buildMonthCalendar(y, m);
    for (const c of cells) {
      if (!c.date || !c.panchang) continue;
      if (c.date < start) continue;
      for (const ev of c.panchang.festivals) {
        if (types && !types.includes(ev.type)) continue;
        out.push({ date: c.date, event: ev });
      }
    }
    m++;
    if (m > 11) { m = 0; y++; }
  }

  out.sort((a, b) => a.date.getTime() - b.date.getTime());
  return out;
}

// ─── Locations (for sunrise/sunset) ───────────────────────────────────────────
// Srinagar is the canonical reference for the Kashmiri Pandit Panchang.
// India/Kashmir entries are IST (UTC+5:30, no DST) → exact.
// Diaspora entries use STANDARD offsets and ignore daylight-saving (±1h in summer).

export interface KPLocation {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;       // positive East
  tz: number;        // standard UTC offset in hours
  dst?: boolean;       // observes daylight-saving (times shown are standard time)
  sunZenith?: number;   // sunrise zenith angle (°). Default 90.833 (flat horizon + refraction).
  sunsetZenith?: number; // sunset zenith angle (°). Defaults to sunZenith if unset.
}

// Kashmir valley sits in a mountain bowl, so the sun clears the ridgeline later
// and dips below it earlier than a flat-horizon model predicts. The western
// (Pir Panjal) ridge is higher than the eastern, so sunset uses a smaller angle.
// Calibrated to the Kashmiri Jantri: Srinagar ≈ 5:26 AM / 7:34 PM near the June solstice.
const KASHMIR_RISE_ZENITH = 89.6;
const KASHMIR_SET_ZENITH = 89.35;

export const KP_LOCATIONS: KPLocation[] = [
  // ── Kashmir Valley (mountain-horizon calibrated to the Kashmiri Jantri) ──
  { id: 'srinagar',   name: 'Srinagar',   region: 'Kashmir', lat: 34.0837, lng: 74.7973, tz: 5.5, sunZenith: KASHMIR_RISE_ZENITH, sunsetZenith: KASHMIR_SET_ZENITH },
  { id: 'anantnag',   name: 'Anantnag',   region: 'Kashmir', lat: 33.7311, lng: 75.1487, tz: 5.5, sunZenith: KASHMIR_RISE_ZENITH, sunsetZenith: KASHMIR_SET_ZENITH },
  { id: 'baramulla',  name: 'Baramulla',  region: 'Kashmir', lat: 34.1980, lng: 74.3636, tz: 5.5, sunZenith: KASHMIR_RISE_ZENITH, sunsetZenith: KASHMIR_SET_ZENITH },
  { id: 'pulwama',    name: 'Pulwama',    region: 'Kashmir', lat: 33.8742, lng: 74.8997, tz: 5.5, sunZenith: KASHMIR_RISE_ZENITH, sunsetZenith: KASHMIR_SET_ZENITH },
  { id: 'kupwara',    name: 'Kupwara',    region: 'Kashmir', lat: 34.5311, lng: 74.2546, tz: 5.5, sunZenith: KASHMIR_RISE_ZENITH, sunsetZenith: KASHMIR_SET_ZENITH },
  // ── J&K / North India ──
  { id: 'jammu',      name: 'Jammu',      region: 'J&K',     lat: 32.7266, lng: 74.8570, tz: 5.5 },
  { id: 'chandigarh', name: 'Chandigarh', region: 'India',   lat: 30.7333, lng: 76.7794, tz: 5.5 },
  { id: 'delhi',      name: 'Delhi',      region: 'India',   lat: 28.6139, lng: 77.2090, tz: 5.5 },
  { id: 'lucknow',    name: 'Lucknow',    region: 'India',   lat: 26.8467, lng: 80.9462, tz: 5.5 },
  { id: 'jaipur',     name: 'Jaipur',     region: 'India',   lat: 26.9124, lng: 75.7873, tz: 5.5 },
  // ── Major Indian metros ──
  { id: 'mumbai',     name: 'Mumbai',     region: 'India',   lat: 19.0760, lng: 72.8777, tz: 5.5 },
  { id: 'pune',       name: 'Pune',       region: 'India',   lat: 18.5204, lng: 73.8567, tz: 5.5 },
  { id: 'ahmedabad',  name: 'Ahmedabad',  region: 'India',   lat: 23.0225, lng: 72.5714, tz: 5.5 },
  { id: 'bengaluru',  name: 'Bengaluru',  region: 'India',   lat: 12.9716, lng: 77.5946, tz: 5.5 },
  { id: 'hyderabad',  name: 'Hyderabad',  region: 'India',   lat: 17.3850, lng: 78.4867, tz: 5.5 },
  { id: 'kolkata',    name: 'Kolkata',    region: 'India',   lat: 22.5726, lng: 88.3639, tz: 5.5 },
  // ── Diaspora (standard time; ignores DST) ──
  { id: 'dubai',      name: 'Dubai',      region: 'Diaspora', lat: 25.2048, lng: 55.2708, tz: 4 },
  { id: 'london',     name: 'London',     region: 'Diaspora', lat: 51.5074, lng: -0.1278, tz: 0,  dst: true },
  { id: 'toronto',    name: 'Toronto',    region: 'Diaspora', lat: 43.6532, lng: -79.3832, tz: -5, dst: true },
  { id: 'newyork',    name: 'New York',   region: 'Diaspora', lat: 40.7128, lng: -74.0060, tz: -5, dst: true },
  { id: 'sanjose',    name: 'San Jose',   region: 'Diaspora', lat: 37.3382, lng: -121.8863, tz: -8, dst: true },
  { id: 'sydney',     name: 'Sydney',     region: 'Diaspora', lat: -33.8688, lng: 151.2093, tz: 10, dst: true },
];

// ─── Sunrise / Sunset (NOAA algorithm) ────────────────────────────────────────
// Accuracy ≈ ±2 minutes for the given location & date. Times returned in local
// clock time using the location's standard UTC offset.

export interface SunTimes {
  sunrise: string | null;   // formatted "h:mm AM"
  sunset: string | null;
  dayLength: string | null; // "13h 24m"
  sunriseMinutes: number | null;
  sunsetMinutes: number | null;
  note: 'normal' | 'no-sunrise' | 'no-sunset';
}

function formatClock(minutesOfDay: number): string {
  let m = ((minutesOfDay % 1440) + 1440) % 1440;
  let h = Math.floor(m / 60);
  const mm = Math.round(m % 60);
  const ampm = h >= 12 ? 'PM' : 'AM';
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${String(mm).padStart(2, '0')} ${ampm}`;
}

export function getSunTimes(
  date: Date,
  lat: number,
  lng: number,
  tzHours: number,
  zenithRise = 90.833,
  zenithSet = zenithRise,
): SunTimes {
  // ── High-precision solar position (Jean Meeus, Ch. 25/28) ──────────────────
  // Evaluate at the location's local apparent noon for best transit accuracy.
  const jdNoonUTC = gregorianToJD(date.getFullYear(), date.getMonth() + 1, date.getDate()); // noon UTC
  const T = (jdNoonUTC - tzHours / 24 - 2451545.0) / 36525;
  const d2r = Math.PI / 180;

  const L0 = mod360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);      // mean longitude
  const M  = mod360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);      // mean anomaly
  const Mr = M * d2r;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mr) +
    0.000289 * Math.sin(3 * Mr);                                            // equation of centre
  const trueLong = L0 + C;
  const omega = (125.04 - 1934.136 * T) * d2r;
  const lambda = (trueLong - 0.00569 - 0.00478 * Math.sin(omega)) * d2r;    // apparent longitude
  const eps =
    (23.439291 - 0.0130042 * T - 1.64e-7 * T * T + 5.04e-7 * T * T * T + 0.00256 * Math.cos(omega)) * d2r;

  const decl = Math.asin(Math.sin(eps) * Math.sin(lambda));                 // declination (rad)
  const alpha = mod360(Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda)) / d2r); // right ascension (deg)

  // Equation of time (minutes) — Meeus 28.1
  let Edeg = L0 - 0.0057183 - alpha;
  Edeg = ((Edeg + 180) % 360 + 360) % 360 - 180;
  const eqtime = 4 * Edeg;

  const latRad = lat * d2r;
  // Separate hour angles for the eastern (sunrise) and western (sunset) horizon —
  // a valley ringed by mountains has different ridge heights on each side.
  const hourAngle = (zenithDeg: number): { ha: number | null; note: SunTimes['note'] } => {
    const z = zenithDeg * d2r;
    const cosH = Math.cos(z) / (Math.cos(latRad) * Math.cos(decl)) - Math.tan(latRad) * Math.tan(decl);
    if (cosH > 1) return { ha: null, note: 'no-sunrise' };
    if (cosH < -1) return { ha: null, note: 'no-sunset' };
    return { ha: (Math.acos(cosH) * 180) / Math.PI, note: 'normal' };
  };

  const empty = (note: SunTimes['note']): SunTimes => ({
    sunrise: null, sunset: null, dayLength: null,
    sunriseMinutes: null, sunsetMinutes: null, note,
  });

  const rise = hourAngle(zenithRise);
  const set = hourAngle(zenithSet);
  if (rise.note !== 'normal') return empty(rise.note);
  if (set.note !== 'normal') return empty(set.note);

  // UTC minutes, then shift to local standard time
  const sunriseLocal = 720 - 4 * (lng + rise.ha!) - eqtime + tzHours * 60;
  const sunsetLocal  = 720 - 4 * (lng - set.ha!) - eqtime + tzHours * 60;

  const dayMin = sunsetLocal - sunriseLocal;
  const dh = Math.floor(dayMin / 60);
  const dm = Math.round(dayMin % 60);

  return {
    sunrise: formatClock(sunriseLocal),
    sunset: formatClock(sunsetLocal),
    dayLength: `${dh}h ${dm}m`,
    sunriseMinutes: sunriseLocal,
    sunsetMinutes: sunsetLocal,
    note: 'normal',
  };
}

// ─── Inauspicious day periods (Rahu Kaal / Yamaganda / Gulika) ────────────────
// The daytime (sunrise→sunset) is split into 8 equal parts; each is assigned to a
// planet by weekday. Times returned in the location's local clock.

export interface TimePeriod {
  name: string;
  start: string;
  end: string;
  startMin: number;
  endMin: number;
}

// 1-based segment (of 8 day-parts) by weekday index (0=Sun … 6=Sat)
const RAHU_SEG      = [8, 2, 7, 5, 6, 4, 3];
const YAMAGANDA_SEG = [5, 4, 3, 2, 1, 7, 6];
const GULIKA_SEG    = [7, 6, 5, 4, 3, 2, 1];

export interface InauspiciousPeriods {
  rahu: TimePeriod | null;
  yamaganda: TimePeriod | null;
  gulika: TimePeriod | null;
}

export function getInauspiciousPeriods(sun: SunTimes, weekday: number): InauspiciousPeriods {
  if (sun.note !== 'normal' || sun.sunriseMinutes == null || sun.sunsetMinutes == null) {
    return { rahu: null, yamaganda: null, gulika: null };
  }
  const sr = sun.sunriseMinutes;
  const part = (sun.sunsetMinutes - sr) / 8;
  const mk = (segArr: number[], name: string): TimePeriod => {
    const startMin = sr + (segArr[weekday] - 1) * part;
    const endMin = startMin + part;
    return { name, start: formatClock(startMin), end: formatClock(endMin), startMin, endMin };
  };
  return {
    rahu: mk(RAHU_SEG, 'Rahu Kaal'),
    yamaganda: mk(YAMAGANDA_SEG, 'Yamaganda'),
    gulika: mk(GULIKA_SEG, 'Gulika Kaal'),
  };
}

// ─── Choghadiya (auspicious time bands, day & night) ──────────────────────────

export type ChoghadiyaNature = 'good' | 'bad' | 'neutral';
export interface Choghadiya {
  name: string;
  nature: ChoghadiyaNature;
  meaning: string;
  start: string;
  end: string;
}

const CHOGHADIYA_CYCLE = ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'];
const CHOGHADIYA_INFO: Record<string, { nature: ChoghadiyaNature; meaning: string }> = {
  Amrit: { nature: 'good',    meaning: 'Most auspicious (nectar)' },
  Shubh: { nature: 'good',    meaning: 'Auspicious — good works' },
  Labh:  { nature: 'good',    meaning: 'Profit & gain' },
  Char:  { nature: 'neutral', meaning: 'Movable — good for travel' },
  Udveg: { nature: 'bad',     meaning: 'Anxiety — avoid' },
  Rog:   { nature: 'bad',     meaning: 'Illness — avoid' },
  Kaal:  { nature: 'bad',     meaning: 'Loss — avoid' },
};
// First daytime choghadiya (ruled by the weekday lord), index 0=Sun … 6=Sat
const DAY_FIRST_CHOGHADIYA = ['Udveg', 'Amrit', 'Rog', 'Labh', 'Shubh', 'Char', 'Kaal'];

export interface ChoghadiyaSet {
  day: Choghadiya[];
  night: Choghadiya[];
}

export function getChoghadiya(sun: SunTimes, weekday: number): ChoghadiyaSet | null {
  if (sun.note !== 'normal' || sun.sunriseMinutes == null || sun.sunsetMinutes == null) return null;
  const sr = sun.sunriseMinutes;
  const ss = sun.sunsetMinutes;
  const dayPart = (ss - sr) / 8;
  const nightPart = (1440 - (ss - sr)) / 8;

  const dayStart = CHOGHADIYA_CYCLE.indexOf(DAY_FIRST_CHOGHADIYA[weekday]);
  const nightStart = (dayStart + 5) % 7;

  const build = (startIdx: number, base: number, part: number): Choghadiya[] =>
    Array.from({ length: 8 }, (_, i) => {
      const name = CHOGHADIYA_CYCLE[(startIdx + i) % 7];
      const info = CHOGHADIYA_INFO[name];
      const s = base + i * part;
      return { name, nature: info.nature, meaning: info.meaning, start: formatClock(s), end: formatClock(s + part) };
    });

  return { day: build(dayStart, sr, dayPart), night: build(nightStart, ss, nightPart) };
}

export function getPakshaGradient(elongation: number): string {
  const ph = elongation / 360;
  if (ph < 0.03 || ph > 0.97) return '🌑';
  if (ph < 0.22) return '🌒';
  if (ph < 0.28) return '🌓';
  if (ph < 0.47) return '🌔';
  if (ph < 0.53) return '🌕';
  if (ph < 0.72) return '🌖';
  if (ph < 0.78) return '🌗';
  return '🌘';
}
