// Kashmiri Pandit Panchang Utilities
// Based on Sapta Rishi Samvat (Laukika Samvat) used by Kashmiri Pandits
// This differs from Vikram Samvat used in standard Hindu Panchang

export const KP_SAMVAT_OFFSET = 25; // Sapta Rishi Samvat is ~25 years ahead of Vikram Samvat

// Kashmiri Pandit months (Shishir/Solar calendar used in Kashmir)
export const KP_MONTHS = [
  { name: 'Chaitra', kashmiri: 'Tsёthar', number: 1 },
  { name: 'Vaishakha', kashmiri: 'Vyaath', number: 2 },
  { name: 'Jyeshtha', kashmiri: 'Zyesth', number: 3 },
  { name: 'Ashadha', kashmiri: 'Aashaad', number: 4 },
  { name: 'Shravana', kashmiri: 'Shraavin', number: 5 },
  { name: 'Bhadrapada', kashmiri: 'Bhaadur', number: 6 },
  { name: 'Ashwina', kashmiri: 'Aasuj', number: 7 },
  { name: 'Kartika', kashmiri: 'Kaatik', number: 8 },
  { name: 'Margashirsha', kashmiri: 'Maangazur', number: 9 },
  { name: 'Pausha', kashmiri: 'Poh', number: 10 },
  { name: 'Magha', kashmiri: 'Maag', number: 11 },
  { name: 'Phalguna', kashmiri: 'Phagun', number: 12 },
];

// Kashmiri Pandit Nakshatras
export const KP_NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

// Rashis (Zodiac Signs)
export const KP_RASHIS = [
  { name: 'Mesha', english: 'Aries', symbol: '♈' },
  { name: 'Vrishabha', english: 'Taurus', symbol: '♉' },
  { name: 'Mithuna', english: 'Gemini', symbol: '♊' },
  { name: 'Karka', english: 'Cancer', symbol: '♋' },
  { name: 'Simha', english: 'Leo', symbol: '♌' },
  { name: 'Kanya', english: 'Virgo', symbol: '♍' },
  { name: 'Tula', english: 'Libra', symbol: '♎' },
  { name: 'Vrischika', english: 'Scorpio', symbol: '♏' },
  { name: 'Dhanu', english: 'Sagittarius', symbol: '♐' },
  { name: 'Makara', english: 'Capricorn', symbol: '♑' },
  { name: 'Kumbha', english: 'Aquarius', symbol: '♒' },
  { name: 'Meena', english: 'Pisces', symbol: '♓' },
];

// Tithis (Lunar days)
export const KP_TITHIS = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya',
];

// Kashmiri Pandit specific festivals with KP Panchang dates
export const KP_FESTIVALS = [
  {
    id: 'navreh',
    name: 'Navreh',
    kashmiri: 'नवरेह',
    description: 'Kashmiri New Year – celebrated on the first day of Chaitra as per Sapta Rishi Samvat (Laukika Samvat). This is the most sacred festival for Kashmiri Pandits, unique to the KP community and NOT the same as Chaitra Navratri.',
    tithi: 'Pratipada of Shukla Paksha, Chaitra',
    significance: 'Marks the Kashmiri Pandit New Year. A thaal (plate) is prepared the night before with rice, walnuts, seasonal greens, curd, salt, and a pen/paper symbolizing prosperity and learning.',
    rituals: [
      'Preparation of Navreh Thaal the night before',
      'First sight in the morning should be the Navreh Thaal',
      'Include fresh greens (haak), walnuts, coins, curd, rice',
      'Include a pen or pencil for knowledge',
      'Puja and prayers to Sharika Mata',
      'Community gatherings and exchange of greetings',
    ],
    foods: ['Haak (collard greens)', 'Akhrot (walnuts)', 'Dahi (yogurt)', 'Rice', 'Salt'],
    month: 1, // Chaitra
    paksha: 'shukla',
    tithiNumber: 1,
    category: 'major',
    uniqueToKP: true,
  },
  {
    id: 'herath',
    name: 'Herath',
    kashmiri: 'हेरथ',
    description: 'Kashmiri Pandit Shivaratri – observed on Chaturdashi of Krishna Paksha in Phalguna. Herath is the most sacred festival for KP community, observed differently from standard Maha Shivaratri.',
    tithi: 'Chaturdashi of Krishna Paksha, Phalguna (Phagun)',
    significance: 'The most sacred night for Kashmiri Pandits. Lord Shiva is worshipped in the form of Vatuk (earthen pots filled with water representing Shiva) and Devi is worshipped as Sharika.',
    rituals: [
      'Setting up Vatuk (earthen pots) representing Lord Shiva',
      'All-night vigil (jaagran)',
      'Preparation of traditional Herath food',
      'Fish and meat are traditionally offered',
      'Havan and prayers',
      'Welcoming Shiva as groom into the home',
    ],
    foods: ['Fish (Gaad)', 'Mutton dishes', 'Shufta (dry fruit sweet)', 'Nadru (lotus stem)'],
    month: 12, // Phalguna
    paksha: 'krishna',
    tithiNumber: 14,
    category: 'major',
    uniqueToKP: true,
  },
  {
    id: 'zyeth-atham',
    name: 'Zyeth Atham',
    kashmiri: 'ज्येठ अठम',
    description: 'Observed on Ashtami of Shukla Paksha in Jyeshtha (Zyesth). This is a uniquely Kashmiri Pandit observance honoring the divine feminine.',
    tithi: 'Ashtami of Shukla Paksha, Jyeshtha',
    significance: 'Worship of Ragnya Bhagwati (Sharika Devi). A major annual pilgrimage to Hari Parbat temple was traditionally observed.',
    rituals: [
      'Puja at home with flowers and offerings',
      'Prayers to Sharika Devi',
      'Traditional fasting (some families)',
      'Community gathering',
    ],
    foods: ['Seasonal fruits', 'Kheer', 'Puri'],
    month: 3, // Jyeshtha
    paksha: 'shukla',
    tithiNumber: 8,
    category: 'major',
    uniqueToKP: true,
  },
  {
    id: 'khichdi-mavas',
    name: 'Khet Khichdi / Khetsrimavas',
    kashmiri: 'खेत खिचड़ी',
    description: 'Observed on Amavasya of Pausha (Poh). A harvest festival unique to Kashmiri Pandits celebrating the winter harvest.',
    tithi: 'Amavasya, Pausha (Poh)',
    significance: 'Marks the winter harvest. Khichdi is prepared in fields as an offering of gratitude.',
    rituals: [
      'Preparation of khichdi in open fields or courtyards',
      'Ancestor worship (Pitru Tarpan)',
      'Community feast',
    ],
    foods: ['Khichdi', 'Sarson ka saag', 'Gaad (fish)'],
    month: 10, // Pausha
    paksha: 'krishna',
    tithiNumber: 30,
    category: 'major',
    uniqueToKP: true,
  },
  {
    id: 'gaad-batta',
    name: 'Gaad Batta',
    kashmiri: 'गाड बट',
    description: 'A cherished Kashmiri Pandit household tradition — an offering of fish (gaad) and cooked rice (batta) to the Ghar Devta, the family\'s guardian house deity. Observed the morning after Khetsimavas (Khichi Mavas), the Amavasya of Pausha (Poh).',
    tithi: 'Pratipada of Shukla Paksha, Magha (the day after Khetsimavas)',
    significance: 'Honours the Ghar Devta — the protective household divinity. Fish-and-rice is placed in a sacred niche of the home (often the kitchen or a wall recess) as an offering of gratitude and a prayer for the family\'s wellbeing and prosperity through the year.',
    rituals: [
      'Cook gaad (fish) with batta (rice) — the traditional KP fish preparation',
      'Offer a portion to the Ghar Devta in the home\'s sacred niche',
      'Leave the offering for the household deity, then share the meal as a family',
      'Follows the khichdi offered to the Yaksha on Khetsimavas the previous day',
    ],
    foods: ['Gaad (fish)', 'Batta (rice)', 'Muji Gaad (fish with radish)', 'Nadru (lotus stem)'],
    month: 11, // Magha — the day after Pausha Amavasya
    paksha: 'shukla',
    tithiNumber: 1,
    category: 'major',
    uniqueToKP: true,
  },
  {
    id: 'pan-festival',
    name: 'Pan (Paan) Festival',
    kashmiri: 'पान',
    description: 'A unique Kashmiri Pandit festival celebrated with the worship of the sacred betel leaf and elaborate ritual preparations.',
    tithi: 'Varies by family tradition',
    significance: 'Celebration of abundance and prosperity. The betel leaf holds special significance in KP rituals.',
    rituals: [
      'Preparation of elaborate thaal with betel leaves',
      'Family puja',
      'Exchange of betel leaves among community',
    ],
    foods: ['Betel leaves', 'Traditional sweets', 'Dry fruits'],
    month: 7, // Ashwina
    paksha: 'shukla',
    tithiNumber: 15,
    category: 'regional',
    uniqueToKP: true,
  },
  {
    id: 'ashtami-zyeshtha',
    name: 'Sharika Ashtami',
    kashmiri: 'शारिका अष्टमी',
    description: 'Multiple Ashtami observances throughout the year dedicated to Sharika Devi (Goddess Sharika), the presiding deity of Kashmir and special deity of Kashmiri Pandits.',
    tithi: 'Ashtami (Shukla Paksha) each month',
    significance: 'Sharika Devi is considered the supreme deity of Kashmiri Pandits. Monthly Ashtami observances are common in KP households.',
    rituals: [
      'Puja with vermillion (sindoor)',
      'Offering of flowers, especially marigold',
      'Recitation of Sharika Stotram',
      'Lamp lighting',
    ],
    foods: ['Kheer', 'Halwa', 'Seasonal fruits'],
    month: 0, // All months
    paksha: 'shukla',
    tithiNumber: 8,
    category: 'monthly',
    uniqueToKP: true,
  },
];

// KP Gotras commonly found in the community
export const KP_GOTRAS = [
  'Bharadwaja', 'Kashyapa', 'Vatsa', 'Atri', 'Vishwamitra',
  'Jamadagni', 'Vasishtha', 'Gautama', 'Angiras', 'Agastya',
  'Shandilya', 'Gargya', 'Kaushika', 'Moudgalya', 'Dhananjaya',
  'Koundinya', 'Parashara', 'Shaunaka', 'Upamanyu', 'Laugakshi',
];

// KP Kuldevi/Kuldevta (Family deities)
export const KP_KULDEVTAS = [
  { name: 'Sharika Mata', location: 'Hari Parbat, Srinagar' },
  { name: 'Jwala Mata', location: 'Khrew, Kashmir' },
  { name: 'Ragnya Devi', location: 'Hari Parbat' },
  { name: 'Sharda Mata', location: 'Sharda Peeth, Neelam Valley' },
  { name: 'Kheer Bhawani', location: 'Tullamulla, Kashmir' },
  { name: 'Durgah Nag', location: 'Srinagar' },
  { name: 'Rishi Peer', location: 'Various locations in Kashmir' },
  { name: 'Mattan Martand', location: 'Mattan, Anantnag' },
];

// Sapta Rishi Samvat calculation
// Sapta Rishi Samvat = Gregorian Year + 3076 (approximately)
export function getSaptaRishiSamvat(gregorianYear: number): number {
  return gregorianYear + 3076;
}

// Get current Laukika Samvat year
export function getLaukikaSamvat(gregorianYear: number): number {
  return gregorianYear + 25; // Approximate conversion from Vikram Samvat offset
}

// Calculate Tithi for a given Julian Day Number
export function getTithiFromJD(jd: number): { tithi: number; paksha: 'shukla' | 'krishna'; tithiname: string } {
  // Approximate calculation
  const synodicMonth = 29.530588853;
  const newMoonJD = 2451549.5; // Reference new moon
  const daysSinceNewMoon = ((jd - newMoonJD) % synodicMonth + synodicMonth) % synodicMonth;
  const tithi = Math.floor(daysSinceNewMoon / (synodicMonth / 30)) + 1;
  const paksha = tithi <= 15 ? 'shukla' : 'krishna';
  const adjustedTithi = tithi <= 15 ? tithi : tithi - 15;
  const tithiname = KP_TITHIS[adjustedTithi - 1] || 'Unknown';
  return { tithi: adjustedTithi, paksha, tithiname };
}

// Convert Gregorian date to Julian Day Number
export function gregorianToJD(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

// Get Nakshatra from moon longitude (approximate)
export function getNakshatraFromMoonLong(moonLong: number): string {
  const nakshatraIndex = Math.floor(moonLong / (360 / 27)) % 27;
  return KP_NAKSHATRAS[nakshatraIndex];
}

// Get Rashi from moon longitude
export function getRashiFromLong(longitude: number): typeof KP_RASHIS[0] {
  const rashiIndex = Math.floor(longitude / 30) % 12;
  return KP_RASHIS[rashiIndex];
}

// Calculate approximate moon longitude for a date
export function getMoonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L0 = 218.3165 + 481267.8813 * T;
  const M = 134.9634 + 477198.8676 * T;
  const moonLong = L0 + 6.2886 * Math.sin((M * Math.PI) / 180);
  return ((moonLong % 360) + 360) % 360;
}

// Get Janma Tithi details for a birth date
export interface JanmaTithiResult {
  gregorianDate: string;
  tithi: string;
  paksha: string;
  nakshatra: string;
  rashi: string;
  kpMonth: string;
  samvatYear: number;
  currentYearJanmaTithi: Date | null;
}

export function calculateJanmaTithi(birthDate: Date): JanmaTithiResult {
  const jd = gregorianToJD(
    birthDate.getFullYear(),
    birthDate.getMonth() + 1,
    birthDate.getDate()
  );

  const { tithiname, paksha } = getTithiFromJD(jd);
  const moonLong = getMoonLongitude(jd);
  const nakshatra = getNakshatraFromMoonLong(moonLong);
  const rashi = getRashiFromLong(moonLong);
  const kpMonth = KP_MONTHS[birthDate.getMonth()];
  const samvatYear = getSaptaRishiSamvat(birthDate.getFullYear());

  return {
    gregorianDate: birthDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    tithi: tithiname,
    paksha: paksha === 'shukla' ? 'Shukla Paksha' : 'Krishna Paksha',
    nakshatra,
    rashi: rashi.name,
    kpMonth: kpMonth?.name || 'Unknown',
    samvatYear,
    currentYearJanmaTithi: null, // Would need full ephemeris for exact calculation
  };
}

// Muhurat types with KP-specific auspicious periods
export const KP_MUHURAT_TYPES = [
  {
    id: 'vehicle',
    name: 'Vehicle Purchase',
    kashmiri: 'Sawari Kharidna',
    description: 'Auspicious timing for purchasing a vehicle',
    favorableTithis: ['Pratipada', 'Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Ekadashi', 'Trayodashi', 'Purnima'],
    favorableNakshatras: ['Rohini', 'Pushya', 'Hasta', 'Ashwini', 'Uttara Phalguni', 'Uttara Ashadha', 'Uttara Bhadrapada', 'Revati'],
    unfavorableTithis: ['Chaturdashi', 'Amavasya', 'Ashtami'],
    icon: '🚗',
  },
  {
    id: 'gold',
    name: 'Gold Purchase',
    kashmiri: 'Sona Kharidna',
    description: 'Best timings for purchasing gold and jewelry',
    favorableTithis: ['Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Ekadashi', 'Purnima'],
    favorableNakshatras: ['Rohini', 'Pushya', 'Hasta', 'Chitra', 'Swati', 'Anuradha'],
    unfavorableTithis: ['Chaturdashi', 'Amavasya'],
    icon: '🪙',
  },
  {
    id: 'business',
    name: 'Business Start',
    kashmiri: 'Vyapar Shuru',
    description: 'Favorable timings for starting a new business',
    favorableTithis: ['Pratipada', 'Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Dwadashi', 'Trayodashi'],
    favorableNakshatras: ['Rohini', 'Pushya', 'Ashwini', 'Hasta', 'Uttara Phalguni', 'Uttara Ashadha', 'Revati'],
    unfavorableTithis: ['Chaturdashi', 'Amavasya', 'Ashtami'],
    icon: '🏢',
  },
  {
    id: 'job',
    name: 'New Job / Career',
    kashmiri: 'Naukri Shuru',
    description: 'Auspicious timings for joining a new job',
    favorableTithis: ['Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Ekadashi', 'Dwadashi'],
    favorableNakshatras: ['Pushya', 'Hasta', 'Chitra', 'Ashwini', 'Uttara Phalguni', 'Uttara Ashadha', 'Revati'],
    unfavorableTithis: ['Chaturdashi', 'Amavasya', 'Ashtami'],
    icon: '💼',
  },
  {
    id: 'housewarming',
    name: 'Griha Pravesh',
    kashmiri: 'Ghar Mein Aana',
    description: 'Sacred timing for entering a new home',
    favorableTithis: ['Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi'],
    favorableNakshatras: ['Rohini', 'Pushya', 'Hasta', 'Uttara Phalguni', 'Uttara Ashadha', 'Uttara Bhadrapada', 'Revati'],
    unfavorableTithis: ['Chaturdashi', 'Amavasya', 'Ashtami', 'Chaturthi'],
    icon: '🏠',
  },
  {
    id: 'travel',
    name: 'Travel / Journey',
    kashmiri: 'Safar',
    description: 'Favorable days for beginning important journeys',
    favorableTithis: ['Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Dwadashi', 'Trayodashi'],
    favorableNakshatras: ['Ashwini', 'Pushya', 'Hasta', 'Chitra', 'Swati', 'Uttara Phalguni', 'Revati'],
    unfavorableTithis: ['Chaturdashi', 'Amavasya', 'Ashtami'],
    icon: '✈️',
  },
  {
    id: 'property',
    name: 'Property Purchase',
    kashmiri: 'Zameen Kharidna',
    description: 'Auspicious timings for purchasing land or property',
    favorableTithis: ['Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Dwadashi', 'Trayodashi'],
    favorableNakshatras: ['Rohini', 'Pushya', 'Hasta', 'Uttara Phalguni', 'Uttara Ashadha', 'Uttara Bhadrapada'],
    unfavorableTithis: ['Chaturdashi', 'Amavasya', 'Ashtami'],
    icon: '🏗️',
  },
  {
    id: 'education',
    name: 'Education Start',
    kashmiri: 'Vidya Arambh',
    description: 'Best timings for beginning education or new courses',
    favorableTithis: ['Pratipada', 'Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Purnima'],
    favorableNakshatras: ['Pushya', 'Hasta', 'Chitra', 'Ashwini', 'Uttara Phalguni', 'Revati', 'Ashlesha'],
    unfavorableTithis: ['Chaturdashi', 'Amavasya'],
    icon: '📚',
  },
];

// Calculate muhurat recommendation
export function calculateMuhurat(date: Date, muhuratType: typeof KP_MUHURAT_TYPES[0]): {
  isFavorable: boolean;
  rating: number;
  tithi: string;
  paksha: string;
  nakshatra: string;
  reasoning: string;
} {
  const jd = gregorianToJD(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const { tithiname, paksha } = getTithiFromJD(jd);
  const moonLong = getMoonLongitude(jd);
  const nakshatra = getNakshatraFromMoonLong(moonLong);

  const tithiFavorable = muhuratType.favorableTithis.includes(tithiname);
  const tithaUnfavorable = muhuratType.unfavorableTithis.includes(tithiname);
  const nakshatraFavorable = muhuratType.favorableNakshatras.includes(nakshatra);

  let rating = 3;
  if (tithiFavorable) rating += 2;
  if (tithaUnfavorable) rating -= 3;
  if (nakshatraFavorable) rating += 2;
  rating = Math.max(1, Math.min(5, rating));

  const isFavorable = rating >= 3 && !tithaUnfavorable;

  let reasoning = `Tithi: ${tithiname} (${paksha === 'shukla' ? 'Shukla' : 'Krishna'} Paksha) — `;
  if (tithiFavorable) reasoning += 'Favorable tithi for this activity. ';
  else if (tithaUnfavorable) reasoning += 'Avoid this tithi for this activity. ';
  else reasoning += 'Neutral tithi. ';
  reasoning += `Nakshatra: ${nakshatra} — `;
  if (nakshatraFavorable) reasoning += 'Auspicious nakshatra for this activity.';
  else reasoning += 'Consult a scholar for nakshatra-specific guidance.';

  return { isFavorable, rating, tithi: tithiname, paksha: paksha === 'shukla' ? 'Shukla' : 'Krishna', nakshatra, reasoning };
}
