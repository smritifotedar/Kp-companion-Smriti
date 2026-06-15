// Astrologer-style interpretation of a computed Kundli. Turns the raw chart
// (signs, houses, planetary dignities, dasha) into readable, personalised guidance.
// All text is generated from the actual chart data — no fixed/canned report.

import { RASHIS, RASHIS_EN, RASHI_LORD, type Kundli, type GrahaPos } from './kp-kundli';

// ── Sign data (index 0 = Mesha/Aries) ─────────────────────────────────────────
export interface SignInfo {
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  quality: 'Cardinal' | 'Fixed' | 'Dual';
  keywords: string;
  persona: string;   // Lagna / outward self
  mind: string;      // Moon / emotional nature
  soul: string;      // Sun / inner self & vitality
}
export const SIGN_INFO: SignInfo[] = [
  { element: 'Fire', quality: 'Cardinal', keywords: 'pioneering, bold, energetic',
    persona: 'You meet life head-on — direct, courageous and quick to act. A natural initiator who dislikes waiting, you carry a youthful, competitive spark and lead from the front.',
    mind: 'Your emotions move fast and burn bright; you feel things instantly, act on impulse, and recover quickly. You need independence and a cause to channel that fire.',
    soul: 'At your core you are a warrior-leader — self-reliant, driven to prove yourself and happiest when blazing a new trail.' },
  { element: 'Earth', quality: 'Fixed', keywords: 'steady, patient, sensual',
    persona: 'You are grounded, reliable and unhurried — building slowly but surely. You value comfort, beauty and security, and once set on a path you are hard to move.',
    mind: 'Emotionally you seek stability and the pleasures of the senses; you are loyal and calm, but resist sudden change and can hold on a little too long.',
    soul: 'Your inner nature is patient and productive — you find meaning in creating lasting, tangible value and a beautiful, secure life.' },
  { element: 'Air', quality: 'Dual', keywords: 'curious, communicative, versatile',
    persona: 'Quick-witted and sociable, you live through ideas and words. Adaptable and ever-curious, you can juggle many interests — though focus is the lesson.',
    mind: 'Your mind is restless and playful; you process feelings by talking and thinking them through, and need variety and mental stimulation to feel alive.',
    soul: 'At heart you are a communicator and learner — youthful, clever and energised by exchange of ideas.' },
  { element: 'Water', quality: 'Cardinal', keywords: 'nurturing, intuitive, protective',
    persona: 'Sensitive and caring, you lead with feeling and intuition. Home and family anchor you, and you instinctively protect and nourish those you love.',
    mind: 'Deeply emotional and receptive, your moods ebb and flow like the tides. You remember everything and feel safest in a warm, familiar nest.',
    soul: 'Your inner self is tender and devotional — you shine when caring for others and trusting your strong gut instinct.' },
  { element: 'Fire', quality: 'Fixed', keywords: 'confident, generous, dignified',
    persona: 'Warm, magnetic and proud, you carry a natural authority. You like to be seen, to lead with heart and to do things grandly and generously.',
    mind: 'Emotionally you crave appreciation and loyalty; you love wholeheartedly, give generously, and feel hurt when overlooked.',
    soul: 'At your core you are royal and creative — born to shine, inspire and rule your own domain with dignity.' },
  { element: 'Earth', quality: 'Dual', keywords: 'analytical, precise, helpful',
    persona: 'Practical, observant and refined, you notice every detail. A natural problem-solver, you serve through skill and a quiet drive for perfection.',
    mind: 'Your mind is analytical and a touch anxious; you soothe yourself through order, usefulness and improving things around you.',
    soul: 'Your inner nature is the devoted craftsman — finding purpose in service, health and doing work well.' },
  { element: 'Air', quality: 'Cardinal', keywords: 'balanced, charming, diplomatic',
    persona: 'Gracious, fair-minded and socially gifted, you seek harmony and beauty. You weigh both sides and excel at partnership, art and tact.',
    mind: 'Emotionally you need peace and companionship; conflict unsettles you, and you feel most yourself in a balanced, beautiful relationship.',
    soul: 'At heart you are the diplomat-artist — drawn to fairness, refinement and meaningful union.' },
  { element: 'Water', quality: 'Fixed', keywords: 'intense, focused, transformative',
    persona: 'Magnetic, private and powerful, you feel everything deeply and hold a still intensity. You probe beneath the surface and are fiercely loyal once trust is earned.',
    mind: 'Your emotions run deep and secret; you bond intensely, guard your inner world, and have a remarkable capacity to transform and regenerate.',
    soul: 'Your inner self is the alchemist — driven to uncover hidden truths and to be reborn through life’s deepest experiences.' },
  { element: 'Fire', quality: 'Dual', keywords: 'optimistic, philosophical, free',
    persona: 'Expansive, honest and adventurous, you reach for the big picture. A natural teacher and traveller, you need freedom, meaning and room to grow.',
    mind: 'Emotionally you are buoyant and faith-filled; you cheer others up, crave space, and feel low when fenced in.',
    soul: 'At your core you are the seeker-philosopher — happiest exploring truth, distant horizons and higher wisdom.' },
  { element: 'Earth', quality: 'Cardinal', keywords: 'disciplined, ambitious, responsible',
    persona: 'Serious, capable and ambitious, you climb steadily toward your goals. You respect structure, carry responsibility well and earn authority through patience.',
    mind: 'Emotionally reserved and self-reliant, you process feelings privately and find security in achievement and control.',
    soul: 'Your inner nature is the master-builder — destined to rise through discipline, duty and the long game.' },
  { element: 'Air', quality: 'Fixed', keywords: 'original, humane, independent',
    persona: 'Unconventional, principled and forward-thinking, you march to your own beat. You care for the collective and value freedom of thought above conformity.',
    mind: 'Emotionally cool yet humane, you connect through ideals and friendship more than sentiment, and need intellectual freedom.',
    soul: 'At heart you are the visionary-reformer — here to think differently and serve a larger humanitarian purpose.' },
  { element: 'Water', quality: 'Dual', keywords: 'compassionate, imaginative, gentle',
    persona: 'Dreamy, kind and artistic, you live partly in a world of feeling and imagination. Empathetic to a fault, you absorb the moods around you and seek the transcendent.',
    mind: 'Your emotions are oceanic and compassionate; you merge with others’ feelings, need quiet retreat, and are deeply intuitive and devotional.',
    soul: 'Your inner self is the mystic-artist — drawn to compassion, surrender and union with the divine.' },
];

// ── Nakshatra data (index 0 = Ashwini) ────────────────────────────────────────
export interface NakInfo { deity: string; symbol: string; lord: string; gana: string; trait: string }
export const NAK_INFO: NakInfo[] = [
  { deity: 'Ashwini Kumaras', symbol: "Horse's head", lord: 'Ketu', gana: 'Deva', trait: 'swift, healing, pioneering and youthful' },
  { deity: 'Yama', symbol: 'Yoni (vulva)', lord: 'Venus', gana: 'Manushya', trait: 'disciplined, enduring and capable of great forbearance' },
  { deity: 'Agni', symbol: 'Razor / flame', lord: 'Sun', gana: 'Rakshasa', trait: 'sharp, purifying, determined and fiercely honest' },
  { deity: 'Brahma (Prajapati)', symbol: 'Ox-cart / chariot', lord: 'Moon', gana: 'Manushya', trait: 'charming, fertile, artistic and growth-loving' },
  { deity: 'Soma (Chandra)', symbol: "Deer's head", lord: 'Mars', gana: 'Deva', trait: 'curious, gentle, seeking and ever-searching' },
  { deity: 'Rudra', symbol: 'Teardrop / diamond', lord: 'Rahu', gana: 'Manushya', trait: 'intense, transformative and sharp-minded' },
  { deity: 'Aditi', symbol: 'Quiver of arrows', lord: 'Jupiter', gana: 'Deva', trait: 'optimistic, renewing, nurturing and resilient' },
  { deity: 'Brihaspati', symbol: "Cow's udder / lotus", lord: 'Saturn', gana: 'Deva', trait: 'nourishing, devout and supportive — among the most auspicious' },
  { deity: 'Nagas (serpents)', symbol: 'Coiled serpent', lord: 'Mercury', gana: 'Rakshasa', trait: 'penetrating, intuitive, hypnotic and secretive' },
  { deity: 'Pitris (ancestors)', symbol: 'Royal throne', lord: 'Ketu', gana: 'Rakshasa', trait: 'regal, proud and honouring of tradition and lineage' },
  { deity: 'Bhaga', symbol: 'Front legs of a bed', lord: 'Venus', gana: 'Manushya', trait: 'pleasure-loving, creative, warm and generous' },
  { deity: 'Aryaman', symbol: 'Back legs of a bed', lord: 'Sun', gana: 'Manushya', trait: 'helpful, reliable, sociable and steady in leadership' },
  { deity: 'Savitr (Sun)', symbol: 'Hand', lord: 'Moon', gana: 'Deva', trait: 'skilful, clever and gifted with healing, dextrous hands' },
  { deity: 'Tvashtar (Vishwakarma)', symbol: 'Bright jewel / pearl', lord: 'Mars', gana: 'Rakshasa', trait: 'artistic, charismatic and gifted in design and craft' },
  { deity: 'Vayu', symbol: 'Young shoot / coral', lord: 'Rahu', gana: 'Deva', trait: 'independent, adaptable, breezy and self-reliant' },
  { deity: 'Indra-Agni', symbol: 'Triumphal arch', lord: 'Jupiter', gana: 'Rakshasa', trait: 'goal-driven, ambitious and determined to triumph' },
  { deity: 'Mitra', symbol: 'Lotus / staff', lord: 'Saturn', gana: 'Deva', trait: 'devoted, friendly, balanced and loyal' },
  { deity: 'Indra', symbol: 'Earring / umbrella', lord: 'Mercury', gana: 'Rakshasa', trait: 'senior, courageous, protective and authoritative' },
  { deity: 'Nirriti', symbol: 'Tied roots / lion’s tail', lord: 'Ketu', gana: 'Rakshasa', trait: 'investigative, root-seeking and deeply transformative' },
  { deity: 'Apas (the Waters)', symbol: 'Winnowing fan', lord: 'Venus', gana: 'Manushya', trait: 'invincible, persuasive and unshakeable once decided' },
  { deity: 'Vishvedevas', symbol: 'Elephant tusk', lord: 'Sun', gana: 'Manushya', trait: 'principled, enduring and built for lasting victory' },
  { deity: 'Vishnu', symbol: 'Ear / three footprints', lord: 'Moon', gana: 'Deva', trait: 'a fine listener — learned, wise and connected to knowledge' },
  { deity: 'Eight Vasus', symbol: 'Drum / flute', lord: 'Mars', gana: 'Rakshasa', trait: 'rhythmic, prosperous, musical and adaptable' },
  { deity: 'Varuna', symbol: 'Empty circle / 100 stars', lord: 'Rahu', gana: 'Rakshasa', trait: 'healing, mystical, secretive and philosophical' },
  { deity: 'Aja Ekapada', symbol: 'Sword / funeral cot', lord: 'Jupiter', gana: 'Manushya', trait: 'fiery, idealistic, intense and transformative' },
  { deity: 'Ahir Budhnya', symbol: 'Back of a funeral cot', lord: 'Saturn', gana: 'Manushya', trait: 'deep, wise, calm and spiritually mature' },
  { deity: 'Pushan', symbol: 'Fish / drum', lord: 'Mercury', gana: 'Deva', trait: 'nourishing, protective, gentle and well-wishing' },
];

// ── Planet significations & dignity ───────────────────────────────────────────
export interface PlanetInfo { karaka: string; nature: 'benefic' | 'malefic' | 'neutral'; exalt: number; debil: number; own: number[] }
export const PLANET_INFO: Record<string, PlanetInfo> = {
  Sun:     { karaka: 'soul, father, authority, vitality and leadership', nature: 'malefic', exalt: 0, debil: 6, own: [4] },
  Moon:    { karaka: 'mind, mother, emotions and nourishment', nature: 'benefic', exalt: 1, debil: 7, own: [3] },
  Mars:    { karaka: 'energy, courage, siblings, drive and property', nature: 'malefic', exalt: 9, debil: 3, own: [0, 7] },
  Mercury: { karaka: 'intellect, speech, learning and commerce', nature: 'neutral', exalt: 5, debil: 11, own: [2, 5] },
  Jupiter: { karaka: 'wisdom, fortune, children, dharma and guidance', nature: 'benefic', exalt: 3, debil: 9, own: [8, 11] },
  Venus:   { karaka: 'love, relationships, art, comforts and the spouse', nature: 'benefic', exalt: 11, debil: 5, own: [1, 6] },
  Saturn:  { karaka: 'discipline, longevity, karma, labour and patience', nature: 'malefic', exalt: 6, debil: 0, own: [9, 10] },
  Rahu:    { karaka: 'worldly desire, ambition, the foreign and the unconventional', nature: 'malefic', exalt: 1, debil: 7, own: [] },
  Ketu:    { karaka: 'detachment, spirituality, past-life karma and liberation', nature: 'malefic', exalt: 7, debil: 1, own: [] },
};

export type Dignity = 'Exalted' | 'Debilitated' | 'Own sign' | '';
export function dignityOf(planet: string, rashi: number): Dignity {
  const info = PLANET_INFO[planet];
  if (!info) return '';
  if (rashi === info.exalt) return 'Exalted';
  if (rashi === info.debil) return 'Debilitated';
  if (info.own.includes(rashi)) return 'Own sign';
  return '';
}

// ── House data ────────────────────────────────────────────────────────────────
export const HOUSE_INFO: { name: string; themes: string }[] = [
  { name: 'Tanu (1st)', themes: 'self, body, personality and overall vitality' },
  { name: 'Dhana (2nd)', themes: 'wealth, family, speech, food and values' },
  { name: 'Sahaja (3rd)', themes: 'courage, siblings, communication and self-effort' },
  { name: 'Sukha (4th)', themes: 'home, mother, happiness, property and schooling' },
  { name: 'Putra (5th)', themes: 'children, creativity, intelligence and romance' },
  { name: 'Ari (6th)', themes: 'health, service, debts, competition and obstacles' },
  { name: 'Yuvati (7th)', themes: 'marriage, partnership, business and the spouse' },
  { name: 'Randhra (8th)', themes: 'longevity, transformation, secrets and inheritance' },
  { name: 'Dharma (9th)', themes: 'fortune, father, guru, higher learning and faith' },
  { name: 'Karma (10th)', themes: 'career, status, public life and achievement' },
  { name: 'Labha (11th)', themes: 'gains, income, friendships and aspirations' },
  { name: 'Vyaya (12th)', themes: 'expenditure, foreign lands, retreat and liberation' },
];

// ── Dasha guidance ────────────────────────────────────────────────────────────
export const DASHA_READING: Record<string, { theme: string; guidance: string }> = {
  Sun: { theme: 'authority, recognition, vitality and your relationship with the father/figures of power', guidance: 'A time to step into leadership and visibility; protect your health and ego, and act with integrity.' },
  Moon: { theme: 'emotions, home, the mind, the mother and public popularity', guidance: 'Nurture your inner peace and relationships; honour your feelings but guard against mood-driven decisions.' },
  Mars: { theme: 'energy, courage, ambition, property and bold initiative', guidance: 'Excellent for action, competition and real estate — channel the drive constructively and avoid haste and conflict.' },
  Mercury: { theme: 'intellect, communication, learning, trade and networking', guidance: 'Favourable for study, writing, business and skilful negotiation; keep commitments clear and grounded.' },
  Jupiter: { theme: 'wisdom, fortune, growth, children, teachers and dharma', guidance: 'One of the most benevolent periods — invest in knowledge, family and ethical expansion; opportunities and grace flow.' },
  Venus: { theme: 'love, marriage, comfort, art, wealth and the good things of life', guidance: 'Beautiful for relationships, creativity and prosperity; enjoy life’s pleasures while keeping balance.' },
  Saturn: { theme: 'discipline, responsibility, hard work and hard-won maturity', guidance: 'A demanding but deeply rewarding teacher — be patient, consistent and dutiful; slow, lasting gains come through perseverance.' },
  Rahu: { theme: 'ambition, sudden change, worldly desire and unconventional paths', guidance: 'A period of intense drive and rapid, sometimes turbulent growth — stay ethical and grounded amid big leaps.' },
  Ketu: { theme: 'detachment, spirituality, endings and inner work', guidance: 'A reflective, sometimes uncertain time turning you inward — favourable for sadhana, research and letting go.' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
const houseOfRashi = (rashi: number, lagnaRashi: number) => ((rashi - lagnaRashi + 12) % 12) + 1;

// ── Reading types ─────────────────────────────────────────────────────────────
export interface PlanetReading { name: string; abbr: string; sign: string; signEn: string; dignity: Dignity; house: number; retro: boolean; text: string }
export interface HouseReading { num: number; name: string; themes: string; sign: string; lord: string; lordHouse: number; occupants: string[]; text: string }
export interface YogaReading { name: string; tone: 'good' | 'challenge' | 'neutral'; text: string }
export interface KundliReading {
  overview: string;
  ascendant: { sign: string; signEn: string; lord: string; element: string; quality: string; text: string };
  moon: { sign: string; signEn: string; text: string };
  sun: { sign: string; signEn: string; text: string };
  nakshatra: { name: string; deity: string; symbol: string; lord: string; gana: string; text: string };
  planets: PlanetReading[];
  houses: HouseReading[];
  yogas: YogaReading[];
  dasha: { maha: string | null; antar: string | null; text: string };
  strengths: string[];
  guidance: string[];
}

const KENDRA = [1, 4, 7, 10];
const MAHAPURUSHA: Record<string, string> = { Mars: 'Ruchaka', Mercury: 'Bhadra', Jupiter: 'Hamsa', Venus: 'Malavya', Saturn: 'Sasa' };

export function interpretKundli(k: Kundli, who = 'This chart'): KundliReading {
  const lagnaRashi = k.lagna.rashi;
  const grahas = k.grahas;
  const byName = (n: string) => grahas.find((g) => g.name === n)!;
  const moon = byName('Moon');
  const sun = byName('Sun');
  const asc = SIGN_INFO[lagnaRashi];
  const lagnaLord = RASHI_LORD[lagnaRashi];

  // Planet readings
  const planets: PlanetReading[] = grahas.map((g: GrahaPos) => {
    const info = PLANET_INFO[g.name];
    const dig = dignityOf(g.name, g.rashi);
    const hInfo = HOUSE_INFO[g.house - 1];
    let dignityClause = '';
    if (dig === 'Exalted') dignityClause = ` Here it is exalted — extremely strong and able to give its best results.`;
    else if (dig === 'Own sign') dignityClause = ` In its own sign it is comfortable, stable and effective.`;
    else if (dig === 'Debilitated') dignityClause = ` It is debilitated here, so its significations may feel strained or need conscious effort (results often improve over time).`;
    const retroClause = g.retro && !['Rahu', 'Ketu'].includes(g.name) ? ' Being retrograde, its energy turns inward and intensifies, often maturing later in life.' : '';
    const text = `${g.name} governs ${info.karaka}. It sits in ${g.rashiName} (${RASHIS_EN[g.rashi]}) in your ${ordinal(g.house)} house — the house of ${hInfo.themes}, colouring those areas with ${g.name}’s qualities.${dignityClause}${retroClause}`;
    return { name: g.name, abbr: g.abbr, sign: g.rashiName, signEn: RASHIS_EN[g.rashi], dignity: dig, house: g.house, retro: g.retro, text };
  });

  // House readings (all 12)
  const houses: HouseReading[] = HOUSE_INFO.map((h, i) => {
    const num = i + 1;
    const rashi = (lagnaRashi + i) % 12;
    const lord = RASHI_LORD[rashi];
    const lordPos = byName(lord);
    const occupants = grahas.filter((g) => g.house === num).map((g) => g.name);
    const occ = occupants.length
      ? `${occupants.join(', ')} ${occupants.length === 1 ? 'sits' : 'sit'} here, directly shaping these matters.`
      : 'No planet sits here, so it expresses mainly through its lord.';
    const text = `Your ${h.name} house — ${h.themes} — falls in ${RASHIS[rashi]} (${RASHIS_EN[rashi]}), ruled by ${lord}, which is placed in the ${ordinal(lordPos.house)} house. ${occ}`;
    return { num, name: h.name, themes: h.themes, sign: RASHIS[rashi], lord, lordHouse: lordPos.house, occupants, text };
  });

  // Yogas & doshas
  const yogas: YogaReading[] = [];
  // Exalted / debilitated highlights
  for (const g of grahas) {
    const d = dignityOf(g.name, g.rashi);
    if (d === 'Exalted') yogas.push({ name: `${g.name} Exalted`, tone: 'good', text: `${g.name} is exalted in ${g.rashiName} — a powerful placement strengthening ${PLANET_INFO[g.name].karaka}.` });
    if (d === 'Debilitated') yogas.push({ name: `${g.name} Debilitated`, tone: 'challenge', text: `${g.name} is debilitated in ${g.rashiName} — its significations (${PLANET_INFO[g.name].karaka}) may need extra care, though this often strengthens with maturity.` });
  }
  // Budhaditya
  if (sun.rashi === byName('Mercury').rashi) yogas.push({ name: 'Budha-Aditya Yoga', tone: 'good', text: 'Sun and Mercury together grant a sharp, intelligent mind, good communication and administrative ability.' });
  // Gajakesari
  const jup = byName('Jupiter');
  const jupFromMoon = ((jup.rashi - moon.rashi + 12) % 12) + 1;
  if (KENDRA.includes(jupFromMoon)) yogas.push({ name: 'Gaja-Kesari Yoga', tone: 'good', text: 'Jupiter in a kendra (angle) from the Moon forms Gaja-Kesari — bestowing wisdom, respect, good fortune and a noble reputation.' });
  // Chandra-Mangal
  if (moon.rashi === byName('Mars').rashi) yogas.push({ name: 'Chandra-Mangal Yoga', tone: 'good', text: 'Moon and Mars together give drive, financial acumen and the ability to turn effort into wealth.' });
  // Pancha Mahapurusha
  for (const p of ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']) {
    const g = byName(p);
    const d = dignityOf(p, g.rashi);
    if ((d === 'Exalted' || d === 'Own sign') && KENDRA.includes(g.house)) {
      yogas.push({ name: `${MAHAPURUSHA[p]} Yoga (Pancha Mahapurusha)`, tone: 'good', text: `${p} is strong (in ${d.toLowerCase()}) and in a kendra, forming the rare ${MAHAPURUSHA[p]} Yoga — a mark of distinction, strong character and success through ${PLANET_INFO[p].karaka}.` });
    }
  }
  // Kaal Sarpa — all 7 planets on one side of the Rahu–Ketu axis
  const rahuLon = byName('Rahu').longitude;
  const seven = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const within = (lon: number) => { const d = ((lon - rahuLon) % 360 + 360) % 360; return d < 180; };
  const sideA = seven.every((p) => within(byName(p).longitude));
  const sideB = seven.every((p) => !within(byName(p).longitude));
  if (sideA || sideB) yogas.push({ name: 'Kaal Sarpa Yoga', tone: 'challenge', text: 'All seven planets fall on one side of the Rahu–Ketu axis (Kaal Sarpa). Life can move in intense waves with delays then breakthroughs; sustained effort and spiritual practice channel it well.' });
  // Mangal Dosha
  const mars = byName('Mars');
  const mangalHouses = [1, 2, 4, 7, 8, 12];
  const marsFromMoon = ((mars.rashi - moon.rashi + 12) % 12) + 1;
  const fromLagna = mangalHouses.includes(mars.house);
  const fromMoon = mangalHouses.includes(marsFromMoon);
  if (fromLagna || fromMoon) {
    yogas.push({ name: 'Mangal (Manglik) Dosha', tone: 'challenge', text: `Mars falls in a Manglik house (${[fromLagna && 'from Lagna', fromMoon && 'from the Moon'].filter(Boolean).join(' and ')}). This calls for care and matching in marriage; many classical cancellations exist, so have it reviewed by a Jyotishi before concluding anything.` });
  }

  // Dasha
  const md = k.dasha.currentMaha?.lord ?? null;
  const ad = k.dasha.currentAntar?.lord ?? null;
  let dashaText = 'Dasha period could not be determined.';
  if (md) {
    const r = DASHA_READING[md];
    dashaText = `You are running the ${md} Mahadasha${ad ? ` with ${ad} Antardasha` : ''}. ${r.theme[0].toUpperCase() + r.theme.slice(1)} come to the fore. ${r.guidance}`;
    if (ad && ad !== md) dashaText += ` The ${ad} sub-period overlays themes of ${DASHA_READING[ad].theme}.`;
  }

  // Overview
  const overview = `${who} rises in ${asc.element.toLowerCase()}y ${k.lagna.rashiName} (${RASHIS_EN[lagnaRashi]}) Lagna, ruled by ${lagnaLord} — so the personality is ${asc.keywords}. The Moon in ${RASHIS_EN[moon.rashi]} under ${k.janmaNakshatra.name} nakshatra shapes the emotional core, while the Sun in ${RASHIS_EN[sun.rashi]} carries the inner identity.${md ? ` Life is currently coloured by the ${md} Mahadasha.` : ''}`;

  // Strengths & guidance (data-driven highlights)
  const strengths: string[] = [];
  const goodYogas = yogas.filter((y) => y.tone === 'good');
  for (const y of goodYogas.slice(0, 4)) strengths.push(y.text);
  for (const g of grahas) if (dignityOf(g.name, g.rashi) === 'Exalted' && !goodYogas.some((y) => y.name.includes(g.name))) strengths.push(`${g.name} is exalted, a clear strength for ${PLANET_INFO[g.name].karaka}.`);
  if (strengths.length === 0) strengths.push(`Your ${k.lagna.rashiName} Lagna gives a ${asc.keywords} foundation to build on.`);

  const guidance: string[] = [];
  if (md) guidance.push(DASHA_READING[md].guidance);
  const challenges = yogas.filter((y) => y.tone === 'challenge');
  for (const c of challenges.slice(0, 2)) guidance.push(c.text);
  guidance.push(`Strengthen your Lagna lord ${lagnaLord} through its positive qualities and, if you wish, traditional remedies — this supports the whole chart.`);

  return {
    overview,
    ascendant: { sign: k.lagna.rashiName, signEn: RASHIS_EN[lagnaRashi], lord: lagnaLord, element: asc.element, quality: asc.quality, text: asc.persona },
    moon: { sign: RASHIS[moon.rashi], signEn: RASHIS_EN[moon.rashi], text: SIGN_INFO[moon.rashi].mind },
    sun: { sign: RASHIS[sun.rashi], signEn: RASHIS_EN[sun.rashi], text: SIGN_INFO[sun.rashi].soul },
    nakshatra: {
      name: k.janmaNakshatra.name, ...NAK_INFO[k.janmaNakshatra.index],
      text: `Born under ${k.janmaNakshatra.name} (Pada ${k.janmaNakshatra.pada}), presided by ${NAK_INFO[k.janmaNakshatra.index].deity} with ${NAK_INFO[k.janmaNakshatra.index].lord} as ruler. Its symbol is the ${NAK_INFO[k.janmaNakshatra.index].symbol}, ${NAK_INFO[k.janmaNakshatra.index].gana} gana. People of this nakshatra tend to be ${NAK_INFO[k.janmaNakshatra.index].trait}.`,
    },
    planets,
    houses,
    yogas,
    dasha: { maha: md, antar: ad, text: dashaText },
    strengths,
    guidance,
  };
}
