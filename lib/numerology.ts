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
export interface NumAttr { planet: string; gem: string; color: string; day: string; metal: string; direction: string; mantra: string; remedy: string }
export const NUMBER_ATTR: Record<number, NumAttr> = {
  1: { planet: 'Sun (Surya)', gem: 'Ruby', color: 'Gold / Orange', day: 'Sunday', metal: 'Gold / Copper', direction: 'East', mantra: 'Om Suryaya Namah', remedy: 'Offer water (arghya) to the rising Sun and respect father-figures and mentors.' },
  2: { planet: 'Moon (Chandra)', gem: 'Pearl', color: 'White / Cream', day: 'Monday', metal: 'Silver', direction: 'North-West', mantra: 'Om Chandraya Namah', remedy: 'Keep silver near you, drink enough water, and honour your mother and elder women.' },
  3: { planet: 'Jupiter (Guru)', gem: 'Yellow Sapphire', color: 'Yellow', day: 'Thursday', metal: 'Gold', direction: 'North-East', mantra: 'Om Gurave Namah', remedy: 'Wear/keep yellow, respect teachers and gurus, and feed Brahmins or donate on Thursdays.' },
  4: { planet: 'Rahu', gem: 'Hessonite (Gomed)', color: 'Grey / Khaki', day: 'Sunday', metal: 'Mixed metals', direction: 'South-West', mantra: 'Om Rahave Namah', remedy: 'Keep routines clean and honest, avoid shortcuts, and donate to the underprivileged.' },
  5: { planet: 'Mercury (Budha)', gem: 'Emerald', color: 'Green', day: 'Wednesday', metal: 'Bronze', direction: 'North', mantra: 'Om Budhaya Namah', remedy: 'Keep green around you, feed/serve students, and channel restless energy into learning.' },
  6: { planet: 'Venus (Shukra)', gem: 'Diamond / White Sapphire', color: 'White / Pastel Pink', day: 'Friday', metal: 'Silver / Platinum', direction: 'South-East', mantra: 'Om Shukraya Namah', remedy: 'Keep your surroundings beautiful and clean, and honour women and the arts.' },
  7: { planet: 'Ketu', gem: "Cat's Eye", color: 'Smoky Grey', day: 'Monday', metal: 'Mixed metals', direction: 'South', mantra: 'Om Ketave Namah', remedy: 'Keep a regular spiritual practice (meditation/prayer) and serve quietly without ego.' },
  8: { planet: 'Saturn (Shani)', gem: 'Blue Sapphire', color: 'Dark Blue / Black', day: 'Saturday', metal: 'Iron / Steel', direction: 'West', mantra: 'Om Shanaye Namah', remedy: 'Serve the elderly and needy, be disciplined and patient, and light a mustard-oil lamp on Saturdays.' },
  9: { planet: 'Mars (Mangal)', gem: 'Red Coral', color: 'Red / Crimson', day: 'Tuesday', metal: 'Copper', direction: 'South', mantra: 'Om Angarakaya Namah', remedy: 'Exercise to channel energy, control anger, and donate red items / serve on Tuesdays.' },
};

// Indian-numerology friendliness — softly framed harmonious vs. handle-with-care numbers.
export const NUMBER_COMPAT: Record<number, { harmonious: number[]; caution: number[] }> = {
  1: { harmonious: [1, 3, 5, 9], caution: [8] },
  2: { harmonious: [1, 3, 5], caution: [8, 9] },
  3: { harmonious: [1, 3, 5, 9], caution: [8] },
  4: { harmonious: [1, 5, 6, 7], caution: [2, 9] },
  5: { harmonious: [1, 3, 5, 6, 9], caution: [] },
  6: { harmonious: [1, 5, 6, 7, 8], caution: [3] },
  7: { harmonious: [1, 2, 5, 6, 7], caution: [8] },
  8: { harmonious: [3, 5, 6, 8], caution: [1, 2] },
  9: { harmonious: [1, 3, 5, 9], caution: [4, 8] },
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
  careers: string;
  love: string;
  health: string;
  luckyNumbers: number[];
  affirmation: string;
  suggestions: string[];
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
    careers: 'Leadership and enterprise — founder/CEO, manager, government and administration, the armed forces, design, and any role where you can be your own boss and innovate.',
    love: 'You love loyally and protectively, but need a partner who respects your independence and ambition. Soften your urge to lead and make decisions together.',
    health: 'Strong vitality; mind the heart, eyes, blood pressure and burnout from overwork. Morning sunlight and regular exercise suit you well.',
    luckyNumbers: [1, 3, 5, 9],
    affirmation: 'I lead with confidence and lift others as I rise.',
    suggestions: ['Begin the important things you keep postponing — initiative is your superpower.', 'Practise patience and truly listen before deciding.', 'Share credit generously; it multiplies your influence.', 'Guard against arrogance and stubborn pride.'],
  },
  2: {
    title: 'The Diplomat', keywords: 'harmony, partnership, sensitivity, intuition',
    lifePath: 'You are the peacemaker — gifted at cooperation, diplomacy and bringing people together. Sensitive and intuitive, you succeed through patience, partnership and gentle persuasion rather than force. Your path teaches the quiet power of support and balance.',
    strengths: 'Tactful, caring, intuitive, cooperative and a wonderful partner and mediator.',
    challenges: 'Over-sensitivity, indecision and dependence on others; cultivate self-confidence.',
    soulUrge: 'Your heart longs for love, harmony, companionship and emotional connection.',
    expression: 'You express warmth, tact and a gift for working with and reading people.',
    personality: 'You appear gentle, approachable and considerate — someone people confide in.',
    careers: 'Partnership and people roles — counselling, HR, diplomacy, teaching, healthcare, hospitality, music and the arts, and any supportive or mediating work.',
    love: 'Deeply romantic and devoted, you thrive on closeness and harmony. Choose a gentle, appreciative partner and protect yourself from over-dependence.',
    health: 'A sensitive constitution; watch digestion, sleep, fluid balance and emotional stress. Calming routines and time near water restore you.',
    luckyNumbers: [1, 2, 3, 5],
    affirmation: 'I create harmony and trust my intuition.',
    suggestions: ['Decide and then commit — don’t let indecision stall you.', 'Set kind boundaries so you aren’t taken for granted.', 'Honour your feelings, but don’t absorb everyone else’s.', 'Find calm through music, prayer or time by water.'],
  },
  3: {
    title: 'The Communicator', keywords: 'creativity, expression, joy, optimism',
    lifePath: 'You are here to create, express and uplift. Blessed with imagination, charm and words, you bring colour and optimism wherever you go. Your path flourishes through art, communication and joy — provided you focus your scattered gifts.',
    strengths: 'Creative, expressive, sociable, optimistic and inspiring to be around.',
    challenges: 'Scattered energy, superficiality or moodiness; channel talent with discipline.',
    soulUrge: 'You yearn to express yourself, to create beauty and to share joy with the world.',
    expression: 'You express creativity, wit and warmth, and lift the mood of any room.',
    personality: 'You seem cheerful, charming and expressive — fun, friendly and full of life.',
    careers: 'Creative and communicative fields — writing, media, design, acting, teaching, marketing, public speaking, counselling and the arts.',
    love: 'Warm, playful and expressive, you need fun, conversation and admiration. Commit fully and avoid scattering your affections.',
    health: 'Generally vital; mind the throat, nerves, weight and over-indulgence. Creative outlets and joyful movement keep you well.',
    luckyNumbers: [3, 6, 9],
    affirmation: 'I express my truth joyfully and create beauty.',
    suggestions: ['Finish what you start — focus turns talent into results.', 'Channel emotions into a regular creative practice.', 'Avoid gossip and spreading your energy too thin.', 'Speak and write often — your words inspire others.'],
  },
  4: {
    title: 'The Builder', keywords: 'stability, discipline, hard work, order',
    lifePath: 'You are the steady builder — practical, disciplined and dependable. You create lasting foundations through patience, honesty and sheer hard work. Your path values method and integrity over shortcuts, and rewards the long, sincere effort.',
    strengths: 'Reliable, organised, hard-working, loyal and grounded.',
    challenges: 'Rigidity, stubbornness or over-work; allow flexibility and rest.',
    soulUrge: 'You desire security, order and a solid, well-built life you can rely on.',
    expression: 'You express dependability, structure and a talent for turning plans into reality.',
    personality: 'You appear solid, trustworthy and practical — the one others lean on.',
    careers: 'Building and systems — engineering, architecture, construction, finance and accounting, administration, law, agriculture, IT and skilled trades.',
    love: 'Loyal, steady and dependable, you show love through reliability and service. Let warmth and a little flexibility soften your seriousness.',
    health: 'Sturdy but tense; watch the joints, knees, back and stress-related stiffness. Routine, stretching and real rest are essential.',
    luckyNumbers: [1, 5, 7],
    affirmation: 'I build steadily and trust the process.',
    suggestions: ['Allow flexibility — not everything must follow the plan.', 'Schedule genuine rest; you tend to over-work.', 'Take an occasional bold step to break the routine.', 'Express appreciation to loved ones out loud.'],
  },
  5: {
    title: 'The Free Spirit', keywords: 'freedom, change, adventure, versatility',
    lifePath: 'You are here to experience life in all its variety. Curious, adaptable and energetic, you thrive on freedom, travel and change. Your path is one of versatility and progressive thinking — its lesson is to find freedom without losing focus.',
    strengths: 'Adaptable, adventurous, magnetic, quick-witted and versatile.',
    challenges: 'Restlessness, excess or inconsistency; learn constructive freedom.',
    soulUrge: 'Your heart craves freedom, variety, travel and new experiences.',
    expression: 'You express dynamism, curiosity and an easy, persuasive charm.',
    personality: 'You seem lively, adventurous and engaging — never dull company.',
    careers: 'Variety and communication — sales, marketing, travel, media, journalism, trade, entrepreneurship, tech and anything dynamic and people-facing.',
    love: 'Charming and freedom-loving, you need a partner who gives you space and adventure. Beware restlessness; choose depth over constant novelty.',
    health: 'Restless nervous energy; mind the nerves, skin and a tendency to over-stimulate (caffeine, late nights). Movement and fresh air balance you.',
    luckyNumbers: [1, 3, 5, 6],
    affirmation: 'I embrace change and stay free yet focused.',
    suggestions: ['Finish projects before chasing the next thrill.', 'Use your adaptability, but commit where it matters.', 'Moderate over-indulgence and over-stimulation.', 'Travel and keep learning — new horizons feed your soul.'],
  },
  6: {
    title: 'The Nurturer', keywords: 'love, responsibility, family, service',
    lifePath: 'You are the caretaker and healer — responsible, loving and devoted to family and community. You find meaning in service, harmony and beauty, and others naturally turn to you for support. Your path is the way of the heart and of nurturing love.',
    strengths: 'Caring, responsible, warm, artistic and deeply supportive.',
    challenges: 'Over-giving, worry or interference; learn to nurture without controlling.',
    soulUrge: 'You long to love and be loved, to care for others and create a harmonious home.',
    expression: 'You express compassion, responsibility and a healing, harmonising presence.',
    personality: 'You appear warm, dependable and caring — a natural protector and host.',
    careers: 'Care, beauty and harmony — medicine and nursing, teaching, counselling, hospitality, interior/fashion design and the arts, food, and family business.',
    love: 'Devoted, nurturing and home-loving, you give generously in love. Care without controlling, and choose a partner who values your warmth.',
    health: 'Generally good; watch the throat, heart, weight and stress from over-responsibility. Beauty, music and nature heal you.',
    luckyNumbers: [3, 6, 9],
    affirmation: 'I nurture with love and care for myself too.',
    suggestions: ['Help and serve — but don’t carry everyone’s burdens.', 'Beautify your home and surroundings; it genuinely lifts you.', 'Say no when needed; over-giving breeds resentment.', 'Make time for art, music and family rituals.'],
  },
  7: {
    title: 'The Seeker', keywords: 'wisdom, analysis, spirituality, introspection',
    lifePath: 'You are the thinker and seeker of truth. Analytical, intuitive and introspective, you are drawn to knowledge, spirituality and the mysteries beneath the surface. Your path rewards depth, study and faith — and asks you to trust and connect rather than withdraw.',
    strengths: 'Insightful, intuitive, studious, wise and spiritually inclined.',
    challenges: 'Aloofness, over-thinking or isolation; balance solitude with connection.',
    soulUrge: 'Your soul seeks truth, wisdom, solitude and spiritual understanding.',
    expression: 'You express depth, analysis and a quiet, contemplative wisdom.',
    personality: 'You seem reserved, thoughtful and a touch mysterious — an old soul.',
    careers: 'Research and depth — science, analysis, IT, philosophy, spirituality, psychology, medicine, writing, investigation and academia.',
    love: 'Private and selective, you need a partner who respects your need for solitude and depth. Open up; don’t retreat behind a wall.',
    health: 'Sensitive nerves; mind anxiety, sleep, the nervous system and a tendency to over-think. Meditation, nature and routine ground you.',
    luckyNumbers: [1, 2, 7],
    affirmation: 'I trust my inner wisdom and connect with others.',
    suggestions: ['Balance solitude with real human connection.', 'Quiet over-analysis with meditation and faith.', 'Pursue knowledge and a steady spiritual practice.', 'Trust your intuition — it is unusually strong.'],
  },
  8: {
    title: 'The Powerhouse', keywords: 'ambition, authority, wealth, karma',
    lifePath: 'You are here to master the material world — power, money, status and achievement. Ambitious and capable, you can build great things and lead at scale. Your path (ruled by Saturn) is one of karma and effort: success comes through integrity, balance and resilience.',
    strengths: 'Ambitious, disciplined, executive, resilient and goal-oriented.',
    challenges: 'Workaholism, control or material obsession; balance power with ethics.',
    soulUrge: 'You desire achievement, abundance, recognition and lasting influence.',
    expression: 'You express authority, organisation and the drive to achieve big results.',
    personality: 'You appear strong, capable and commanding — a born executive.',
    careers: 'Power and structure — business and finance, real estate, law, administration, large organisations, politics and executive leadership.',
    love: 'Strong and protective, you show love through providing and loyalty. Lower your guard, share vulnerability and balance work with home.',
    health: 'Tends to carry stress; mind the bones, knees, teeth, chronic tension and overwork. Discipline plus deliberate rest is key.',
    luckyNumbers: [3, 5, 6, 8],
    affirmation: 'I build lasting success with integrity and balance.',
    suggestions: ['Pace yourself — rest is part of success.', 'Lead with ethics; karma is central to your path.', 'Balance ambition with family and inner life.', 'Serve the less fortunate to ease Saturn’s lessons.'],
  },
  9: {
    title: 'The Humanitarian', keywords: 'compassion, idealism, completion, generosity',
    lifePath: 'You are the old soul and humanitarian — compassionate, idealistic and generous. You are here to give, to heal and to serve a cause larger than yourself. Your path completes cycles and teaches selfless love; fulfilment comes through letting go and serving others.',
    strengths: 'Compassionate, wise, generous, creative and broad-minded.',
    challenges: 'Emotional intensity or martyrdom; learn healthy boundaries and release.',
    soulUrge: 'Your heart longs to serve humanity, to give selflessly and to heal the world.',
    expression: 'You express idealism, compassion and a wide, embracing vision.',
    personality: 'You seem dignified, warm and worldly — a compassionate idealist.',
    careers: 'Service and vision — medicine, social work, teaching, law, the armed forces, the arts, healing and humanitarian or non-profit work.',
    love: 'Passionate and idealistic, you love deeply and generously. Manage intensity and possessiveness, and choose a broad-minded, compassionate partner.',
    health: 'Strong but fiery; mind inflammation, blood, accidents and anger-driven stress. Exercise and calming practices balance the Mars energy.',
    luckyNumbers: [3, 6, 9],
    affirmation: 'I give freely and let go with grace.',
    suggestions: ['Channel intensity into a cause larger than yourself.', 'Practise forgiveness and release old grievances.', 'Manage temper through exercise and breathwork.', 'Give generously — selfless service completes you.'],
  },
  11: {
    title: 'The Intuitive (Master 11)', keywords: 'inspiration, intuition, illumination, idealism',
    lifePath: 'A master number — you carry heightened intuition, inspiration and spiritual insight. You are here to illuminate and uplift others, often as a visionary or teacher. The path is sensitive and demanding; grounded faith turns your nervous energy into genuine light.',
    strengths: 'Highly intuitive, inspiring, idealistic, visionary and spiritually gifted.',
    challenges: 'Nervous tension, self-doubt or extremes; ground your gifts in practice.',
    soulUrge: 'You yearn for spiritual truth, inspiration and to uplift those around you.',
    expression: 'You express vision, intuition and an inspiring, almost electric presence.',
    personality: 'You appear sensitive, charismatic and quietly luminous.',
    careers: 'Inspiration and guidance — teaching, counselling, spirituality, the arts, healing, writing, design and visionary leadership.',
    love: 'Idealistic and sensitive in love, you seek a soulful connection. Ground your high expectations and protect your nervous energy.',
    health: 'A highly sensitive nervous system; mind anxiety, sleep and overwhelm. Meditation, routine and grounding are essential.',
    luckyNumbers: [2, 9, 11],
    affirmation: 'I channel inspiration calmly into the world.',
    suggestions: ['Ground your visions in practical, doable steps.', 'Protect your energy with quiet time and routine.', 'Trust your intuition — it is exceptional.', 'Teach or create; you’re here to inspire others.'],
  },
  22: {
    title: 'The Master Builder (Master 22)', keywords: 'vision, mastery, large-scale achievement',
    lifePath: 'The most powerful number — you can turn the grandest visions into concrete reality. Combining the dreamer (11) with the builder (4), you are capable of large-scale, lasting contributions. The path asks for discipline and self-belief equal to your great potential.',
    strengths: 'Visionary yet practical, capable, disciplined and able to build at scale.',
    challenges: 'Self-imposed pressure or playing small; trust your vast capacity.',
    soulUrge: 'You desire to build something significant and enduring for the world.',
    expression: 'You express grand vision married to real-world execution.',
    personality: 'You appear capable, steady and quietly formidable.',
    careers: 'Large-scale building — architecture, engineering, founding institutions, international business, public works and visionary enterprise.',
    love: 'Devoted but often absorbed in your mission; make room for partnership and don’t let work eclipse the heart.',
    health: 'Carries great pressure; mind stress, nerves and overwork. Discipline plus genuine rest sustains your large output.',
    luckyNumbers: [4, 8, 22],
    affirmation: 'I turn great visions into lasting reality.',
    suggestions: ['Think big — then build it brick by brick.', 'Don’t shrink your goals out of self-doubt.', 'Balance the mission with rest and relationships.', 'Use your gifts to serve the collective.'],
  },
  33: {
    title: 'The Master Teacher (Master 33)', keywords: 'compassion, healing, selfless service',
    lifePath: 'The rarest master number — the teacher of unconditional love. You blend creativity (3), nurturing (6) and vision into a calling to heal and uplift through selfless service. The path is one of devotion and great-hearted responsibility.',
    strengths: 'Loving, wise, devoted, healing and selflessly giving.',
    challenges: 'Self-sacrifice or overwhelm; care for yourself as you care for others.',
    soulUrge: 'Your soul longs to heal, teach and serve with unconditional love.',
    expression: 'You express compassion, wisdom and a deeply nurturing influence.',
    personality: 'You appear warm, wise and selflessly devoted.',
    careers: 'Healing and teaching — medicine, counselling, spiritual teaching, the arts, social leadership and selfless service.',
    love: 'Deeply loving and self-sacrificing; ensure love also flows to you, and choose a partner who supports your giving nature.',
    health: 'Gives until depleted; mind emotional exhaustion and the heart/throat. Self-care is a duty, not a luxury.',
    luckyNumbers: [6, 9, 33],
    affirmation: 'I heal and uplift, and I care for myself too.',
    suggestions: ['Care for yourself as devotedly as you care for others.', 'Teach and heal — it is your true calling.', 'Set firm boundaries to avoid burnout.', 'Lead with compassion and earned wisdom.'],
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
