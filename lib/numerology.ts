// Numerology engine + interpretation data.
// Combines Pythagorean name numbers (Life Path, Expression, Soul Urge, Personality)
// with Indian/Vedic numerology (Mulank & Bhagyank + planetary associations).

// ── Core math ─────────────────────────────────────────────────────────────────
const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

// Pythagorean: A=1…I=9, J=1…R=9, S=1…Z=8
function letterValue(ch: string): number {
  const c = ch.toUpperCase().charCodeAt(0);
  if (c < 65 || c > 90) return 0;
  return ((c - 65) % 9) + 1;
}

const isMaster = (n: number) => n === 11 || n === 22 || n === 33;

// Reduce to a single digit, preserving master numbers 11/22/33.
export function reduceKeepMaster(n: number): number {
  let x = Math.abs(n);
  while (x > 9 && !isMaster(x)) {
    x = String(x).split('').reduce((s, d) => s + Number(d), 0);
  }
  return x;
}

// Reduce all the way to 1–9 (used by Indian Mulank/Bhagyank & personal year).
export function reduceToSingle(n: number): number {
  let x = Math.abs(n);
  while (x > 9) x = String(x).split('').reduce((s, d) => s + Number(d), 0);
  return x;
}

const cleanName = (name: string) => name.toUpperCase().replace(/[^A-Z]/g, '');

export interface NumerologyResult {
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  birthdayNumber: number;   // day of month (1–31)
  mulank: number;           // Indian psychic/driver number (1–9)
  bhagyank: number;         // Indian destiny/conductor number (1–9)
  personalYear: number;     // current-year cycle (1–9)
  hasName: boolean;
}

export function computeNumerology(name: string, dobISO: string, today = new Date()): NumerologyResult {
  const [y, m, d] = dobISO.split('-').map(Number);

  // Life Path — reduce month, day, year (keeping masters), sum, reduce again.
  const lifePath = reduceKeepMaster(reduceKeepMaster(m) + reduceKeepMaster(d) + reduceKeepMaster(y));

  // Indian numerology — full reductions to a single digit.
  const mulank = reduceToSingle(d);
  const bhagyank = reduceToSingle(y + m + d);

  // Name numbers (Pythagorean).
  const letters = cleanName(name);
  let all = 0, vow = 0, con = 0;
  for (const ch of letters) {
    const v = letterValue(ch);
    all += v;
    if (VOWELS.has(ch)) vow += v; else con += v;
  }

  // Personal Year — birth month + birth day + current year.
  const personalYear = reduceToSingle(reduceToSingle(m) + reduceToSingle(d) + reduceToSingle(today.getFullYear()));

  return {
    lifePath,
    expression: letters ? reduceKeepMaster(all) : 0,
    soulUrge: letters ? reduceKeepMaster(vow) : 0,
    personality: letters ? reduceKeepMaster(con) : 0,
    birthdayNumber: d,
    mulank,
    bhagyank,
    personalYear,
    hasName: letters.length > 0,
  };
}

// ── Planetary associations (Indian numerology, numbers 1–9) ────────────────────
export interface NumAttr { planet: string; gem: string; color: string; day: string }
export const NUMBER_ATTR: Record<number, NumAttr> = {
  1: { planet: 'Sun (Surya)', gem: 'Ruby', color: 'Gold / Orange', day: 'Sunday' },
  2: { planet: 'Moon (Chandra)', gem: 'Pearl', color: 'White / Cream', day: 'Monday' },
  3: { planet: 'Jupiter (Guru)', gem: 'Yellow Sapphire', color: 'Yellow', day: 'Thursday' },
  4: { planet: 'Rahu', gem: 'Hessonite (Gomed)', color: 'Grey / Khaki', day: 'Sunday' },
  5: { planet: 'Mercury (Budha)', gem: 'Emerald', color: 'Green', day: 'Wednesday' },
  6: { planet: 'Venus (Shukra)', gem: 'Diamond', color: 'White / Pastel Pink', day: 'Friday' },
  7: { planet: 'Ketu', gem: "Cat's Eye", color: 'Smoky Grey', day: 'Monday' },
  8: { planet: 'Saturn (Shani)', gem: 'Blue Sapphire', color: 'Dark Blue / Black', day: 'Saturday' },
  9: { planet: 'Mars (Mangal)', gem: 'Red Coral', color: 'Red / Crimson', day: 'Tuesday' },
};

// ── Number meanings ────────────────────────────────────────────────────────────
export interface NumberMeaning {
  title: string;
  keywords: string;
  lifePath: string;
  strengths: string;
  challenges: string;
  soulUrge: string;
  expression: string;
  personality: string;
}

export const NUMBER_MEANING: Record<number, NumberMeaning> = {
  1: {
    title: 'The Leader', keywords: 'independence, initiative, originality, willpower',
    lifePath: 'You are here to lead, pioneer and stand on your own feet. Independent and ambitious, you have the drive to start things others only dream of. Your path rewards self-reliance, courage and original thinking — but asks you to balance ego with cooperation.',
    strengths: 'Determined, original, self-motivated, courageous and a natural trailblazer.',
    challenges: 'Can become stubborn, domineering or impatient; learn to listen and share credit.',
    soulUrge: 'Deep down you crave independence, achievement and the freedom to do things your way.',
    expression: 'You naturally express leadership, drive and innovation, and like to be first.',
    personality: 'You come across as confident, capable and self-assured — a person who gets things done.',
  },
  2: {
    title: 'The Diplomat', keywords: 'harmony, partnership, sensitivity, intuition',
    lifePath: 'You are the peacemaker — gifted at cooperation, diplomacy and bringing people together. Sensitive and intuitive, you succeed through patience, partnership and gentle persuasion rather than force. Your path teaches the quiet power of support and balance.',
    strengths: 'Tactful, caring, intuitive, cooperative and a wonderful partner and mediator.',
    challenges: 'Over-sensitivity, indecision and dependence on others; cultivate self-confidence.',
    soulUrge: 'Your heart longs for love, harmony, companionship and emotional connection.',
    expression: 'You express warmth, tact and a gift for working with and reading people.',
    personality: 'You appear gentle, approachable and considerate — someone people confide in.',
  },
  3: {
    title: 'The Communicator', keywords: 'creativity, expression, joy, optimism',
    lifePath: 'You are here to create, express and uplift. Blessed with imagination, charm and words, you bring colour and optimism wherever you go. Your path flourishes through art, communication and joy — provided you focus your scattered gifts.',
    strengths: 'Creative, expressive, sociable, optimistic and inspiring to be around.',
    challenges: 'Scattered energy, superficiality or moodiness; channel talent with discipline.',
    soulUrge: 'You yearn to express yourself, to create beauty and to share joy with the world.',
    expression: 'You express creativity, wit and warmth, and lift the mood of any room.',
    personality: 'You seem cheerful, charming and expressive — fun, friendly and full of life.',
  },
  4: {
    title: 'The Builder', keywords: 'stability, discipline, hard work, order',
    lifePath: 'You are the steady builder — practical, disciplined and dependable. You create lasting foundations through patience, honesty and sheer hard work. Your path values method and integrity over shortcuts, and rewards the long, sincere effort.',
    strengths: 'Reliable, organised, hard-working, loyal and grounded.',
    challenges: 'Rigidity, stubbornness or over-work; allow flexibility and rest.',
    soulUrge: 'You desire security, order and a solid, well-built life you can rely on.',
    expression: 'You express dependability, structure and a talent for turning plans into reality.',
    personality: 'You appear solid, trustworthy and practical — the one others lean on.',
  },
  5: {
    title: 'The Free Spirit', keywords: 'freedom, change, adventure, versatility',
    lifePath: 'You are here to experience life in all its variety. Curious, adaptable and energetic, you thrive on freedom, travel and change. Your path is one of versatility and progressive thinking — its lesson is to find freedom without losing focus.',
    strengths: 'Adaptable, adventurous, magnetic, quick-witted and versatile.',
    challenges: 'Restlessness, excess or inconsistency; learn constructive freedom.',
    soulUrge: 'Your heart craves freedom, variety, travel and new experiences.',
    expression: 'You express dynamism, curiosity and an easy, persuasive charm.',
    personality: 'You seem lively, adventurous and engaging — never dull company.',
  },
  6: {
    title: 'The Nurturer', keywords: 'love, responsibility, family, service',
    lifePath: 'You are the caretaker and healer — responsible, loving and devoted to family and community. You find meaning in service, harmony and beauty, and others naturally turn to you for support. Your path is the way of the heart and of nurturing love.',
    strengths: 'Caring, responsible, warm, artistic and deeply supportive.',
    challenges: 'Over-giving, worry or interference; learn to nurture without controlling.',
    soulUrge: 'You long to love and be loved, to care for others and create a harmonious home.',
    expression: 'You express compassion, responsibility and a healing, harmonising presence.',
    personality: 'You appear warm, dependable and caring — a natural protector and host.',
  },
  7: {
    title: 'The Seeker', keywords: 'wisdom, analysis, spirituality, introspection',
    lifePath: 'You are the thinker and seeker of truth. Analytical, intuitive and introspective, you are drawn to knowledge, spirituality and the mysteries beneath the surface. Your path rewards depth, study and faith — and asks you to trust and connect rather than withdraw.',
    strengths: 'Insightful, intuitive, studious, wise and spiritually inclined.',
    challenges: 'Aloofness, over-thinking or isolation; balance solitude with connection.',
    soulUrge: 'Your soul seeks truth, wisdom, solitude and spiritual understanding.',
    expression: 'You express depth, analysis and a quiet, contemplative wisdom.',
    personality: 'You seem reserved, thoughtful and a touch mysterious — an old soul.',
  },
  8: {
    title: 'The Powerhouse', keywords: 'ambition, authority, wealth, karma',
    lifePath: 'You are here to master the material world — power, money, status and achievement. Ambitious and capable, you can build great things and lead at scale. Your path (ruled by Saturn) is one of karma and effort: success comes through integrity, balance and resilience.',
    strengths: 'Ambitious, disciplined, executive, resilient and goal-oriented.',
    challenges: 'Workaholism, control or material obsession; balance power with ethics.',
    soulUrge: 'You desire achievement, abundance, recognition and lasting influence.',
    expression: 'You express authority, organisation and the drive to achieve big results.',
    personality: 'You appear strong, capable and commanding — a born executive.',
  },
  9: {
    title: 'The Humanitarian', keywords: 'compassion, idealism, completion, generosity',
    lifePath: 'You are the old soul and humanitarian — compassionate, idealistic and generous. You are here to give, to heal and to serve a cause larger than yourself. Your path completes cycles and teaches selfless love; fulfilment comes through letting go and serving others.',
    strengths: 'Compassionate, wise, generous, creative and broad-minded.',
    challenges: 'Emotional intensity or martyrdom; learn healthy boundaries and release.',
    soulUrge: 'Your heart longs to serve humanity, to give selflessly and to heal the world.',
    expression: 'You express idealism, compassion and a wide, embracing vision.',
    personality: 'You seem dignified, warm and worldly — a compassionate idealist.',
  },
  11: {
    title: 'The Intuitive (Master 11)', keywords: 'inspiration, intuition, illumination, idealism',
    lifePath: 'A master number — you carry heightened intuition, inspiration and spiritual insight. You are here to illuminate and uplift others, often as a visionary or teacher. The path is sensitive and demanding; grounded faith turns your nervous energy into genuine light.',
    strengths: 'Highly intuitive, inspiring, idealistic, visionary and spiritually gifted.',
    challenges: 'Nervous tension, self-doubt or extremes; ground your gifts in practice.',
    soulUrge: 'You yearn for spiritual truth, inspiration and to uplift those around you.',
    expression: 'You express vision, intuition and an inspiring, almost electric presence.',
    personality: 'You appear sensitive, charismatic and quietly luminous.',
  },
  22: {
    title: 'The Master Builder (Master 22)', keywords: 'vision, mastery, large-scale achievement',
    lifePath: 'The most powerful number — you can turn the grandest visions into concrete reality. Combining the dreamer (11) with the builder (4), you are capable of large-scale, lasting contributions. The path asks for discipline and self-belief equal to your great potential.',
    strengths: 'Visionary yet practical, capable, disciplined and able to build at scale.',
    challenges: 'Self-imposed pressure or playing small; trust your vast capacity.',
    soulUrge: 'You desire to build something significant and enduring for the world.',
    expression: 'You express grand vision married to real-world execution.',
    personality: 'You appear capable, steady and quietly formidable.',
  },
  33: {
    title: 'The Master Teacher (Master 33)', keywords: 'compassion, healing, selfless service',
    lifePath: 'The rarest master number — the teacher of unconditional love. You blend creativity (3), nurturing (6) and vision into a calling to heal and uplift through selfless service. The path is one of devotion and great-hearted responsibility.',
    strengths: 'Loving, wise, devoted, healing and selflessly giving.',
    challenges: 'Self-sacrifice or overwhelm; care for yourself as you care for others.',
    soulUrge: 'Your soul longs to heal, teach and serve with unconditional love.',
    expression: 'You express compassion, wisdom and a deeply nurturing influence.',
    personality: 'You appear warm, wise and selflessly devoted.',
  },
};

export const PERSONAL_YEAR_THEME: Record<number, string> = {
  1: 'a fresh start — new beginnings, initiative and planting seeds for the cycle ahead.',
  2: 'patience and partnership — nurture relationships, cooperate and let things develop slowly.',
  3: 'self-expression and joy — creativity, socialising and optimism flourish.',
  4: 'hard work and foundations — build steadily, get organised and stay disciplined.',
  5: 'change and freedom — travel, new experiences and welcome, dynamic shifts.',
  6: 'home and responsibility — family, love, service and matters of the heart.',
  7: 'reflection and study — turn inward, learn, rest and seek deeper understanding.',
  8: 'achievement and reward — career, finances and recognition come to the fore.',
  9: 'completion and release — finish cycles, let go and make room for the new.',
};
