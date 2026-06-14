// Kashmiri Pandit ritual library — detailed vidhi, mantras (shlokas), samagri,
// quick facts and a how-to video per ritual. Mantras are well-known Vedic verses
// (public domain). Family/KP-specific procedures vary — always follow your purohit.

export interface Mantra {
  sanskrit: string;
  transliteration: string;
  meaning: string;
  when?: string;
}
export interface ProcedureStep {
  title: string;
  detail: string;
}
export interface Ritual {
  id: string;
  name: string;
  kashmiri: string;
  category: string;
  icon: string;
  youtubeId?: string;
  description: string;
  purpose: string;
  historicalBackground: string;
  religiousSignificance: string;
  quickFacts: { performedBy: string; duration: string; timing: string };
  materials: string[];
  procedure: ProcedureStep[];
  mantras: Mantra[];
  tips: string[];
  regionalVariations: string;
  commonMisconceptions: string;
}

const GANAPATI: Mantra = {
  sanskrit: 'ॐ गं गणपतये नमः ॥',
  transliteration: 'Om Gaṁ Gaṇapataye Namaḥ',
  meaning: 'Salutations to Lord Ganesha — invoked first to remove all obstacles before any rite.',
  when: 'At the very beginning of every puja',
};
const GAYATRI: Mantra = {
  sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥',
  transliteration: 'Om Bhūr Bhuvaḥ Svaḥ · Tat Savitur Vareṇyaṁ · Bhargo Devasya Dhīmahi · Dhiyo Yo Naḥ Prachodayāt',
  meaning: 'We meditate on the radiant glory of the Sun (Savitr); may it illumine our intellect.',
  when: 'During havan and as the core Vedic prayer',
};

export const KP_RITUALS: Ritual[] = [
  {
    id: 'devgon',
    name: 'Devgon',
    kashmiri: 'देवगन',
    category: 'Annual Ritual',
    icon: '🪔',
    youtubeId: 'd8qychSLuUc',
    description: 'Annual propitiation of the family deity (Kuldevta/Kuldevi) and ancestors — a ritual unique to Kashmiri Pandits, performed in the home and also before weddings and Yagnopavit.',
    purpose: 'To renew the sacred bond with the family deity and ancestors and seek their protection and blessings for the household.',
    historicalBackground: 'Devgon is rooted in ancient Kashmiri ancestor worship fused with Shaiva tantra, predating later Vaishnava influences in Kashmir.',
    religiousSignificance: 'It upholds the covenant between a family and its protecting deity, and is mandatory before major samskaras such as marriage and the sacred-thread ceremony.',
    quickFacts: { performedBy: 'Family priest (purohit) with the family', duration: '2–3 hours', timing: 'An auspicious day fixed by the purohit; before weddings/Yagnopavit' },
    materials: [
      'Thaal (ritual plate)', 'Walnuts (akhrot)', 'Rice (chawal / akshat)', 'Mustard-oil lamp (diwa)',
      'Incense (agarbatti)', 'Red cloth (for the deity seat)', 'Marigold & seasonal flowers',
      'Betel leaves & nuts (supari)', 'Fruit & sweets', 'Curd (dahi) and honey', 'Kalash (water pot) with coconut',
    ],
    procedure: [
      { title: 'Shuddhi (purification)', detail: 'Bathe and wear clean clothes; purify the puja space by sprinkling Gangajal and lighting the diwa and incense.' },
      { title: 'Kalash & deity seat', detail: 'Establish the Kalash and lay the red cloth as the seat (asana) for the Kuldevta/Kuldevi.' },
      { title: 'Ganesha & Sankalpa', detail: 'Invoke Ganesha to remove obstacles, then take the Sankalpa — stating the family name, gotra, place and intention of the puja.' },
      { title: 'Avahana (invocation)', detail: 'Invoke the family deity and ancestors with the family-specific mantras given by your purohit.' },
      { title: 'Shodashopachara puja', detail: 'Offer the sixteen honours — asana, padya, arghya, water, flowers, incense, lamp, naivedya (food) — to the deity.' },
      { title: 'Prayers & aarti', detail: 'Recite the family prayers and the deity stotra, then perform aarti with the lamp.' },
      { title: 'Prasad & blessings', detail: 'Seek blessings for every family member and distribute the prasad.' },
    ],
    mantras: [
      GANAPATI,
      {
        sanskrit: 'ॐ ऐं ह्रीं श्रीं शारिकायै नमः ॥',
        transliteration: 'Om Aiṁ Hrīṁ Śrīṁ Śārikāyai Namaḥ',
        meaning: 'Salutations to Mother Sharika (Ragnya Bhagwati), the presiding goddess of Kashmir — a common Kuldevi invocation.',
        when: 'Invoking the family goddess',
      },
      {
        sanskrit: 'सर्वमंगलमांगल्ये शिवे सर्वार्थसाधिके। शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥',
        transliteration: 'Sarva-maṅgala-māṅgalye Śive Sarvārtha-sādhike · Śaraṇye Tryambake Gauri Nārāyaṇi Namo’stu Te',
        meaning: 'O auspicious one, giver of all goals, refuge of all — Gauri, Narayani, salutations to you.',
        when: 'Devi vandana',
      },
    ],
    tips: [
      'Observe a light sattvic diet on the day; many families fast until the puja concludes.',
      'Keep your family gotra and Kuldevta name ready for the Sankalpa.',
      'The exact mantras and offerings are family-specific — follow your own purohit\'s tradition.',
    ],
    regionalVariations: 'Devgon differs greatly by family and tehsil — some perform elaborate multi-day rites, others a single focused puja.',
    commonMisconceptions: 'It is not a generic puja; it is a family-specific rite with unique elements passed down generations.',
  },

  {
    id: 'yagnopavit',
    name: 'Yagnopavit (Mekhal / Janeu)',
    kashmiri: 'यज्ञोपवीत',
    category: 'Samskara',
    icon: '🧵',
    youtubeId: '-odf-0D2-zA',
    description: 'The sacred-thread ceremony (called Mekhal in Kashmir) initiating a boy into Vedic study and the stage of brahmacharya. One of the sixteen samskaras.',
    purpose: 'To initiate the child with the Gayatri Mantra and invest the sacred thread, marking the start of formal spiritual and Vedic life.',
    historicalBackground: 'A core samskara of Kashmiri Pandits; the Mekhal is among the most important rites of a KP boy\'s life and is preceded by Devgon.',
    religiousSignificance: 'The three strands of the yajnopavita represent the three debts — to the gods, the sages, and the ancestors — and the responsibility of dharma.',
    quickFacts: { performedBy: 'Father & family purohit; the Acharya gives the Gayatri', duration: 'Half to full day', timing: 'Auspicious muhurat, traditionally age 7–12 (often combined with Mundan)' },
    materials: [
      'Yajnopavita (sacred thread, three strands)', 'Havan kund, ghee, samidha & samagri',
      'New dhoti and uttariya', 'Mout (ceremonial crown)', 'Danda (staff)', 'Kamandalu (water pot)',
      'Begging bowl (symbolic)', 'Kashmiri ritual items / mudra',
    ],
    procedure: [
      { title: 'Devgon & purification', detail: 'The family first performs Devgon; the boy is bathed and prepared.' },
      { title: 'Mundan (if combined)', detail: 'The head may be ceremonially shaved, leaving the shikha (tuft).' },
      { title: 'Havan & Sankalpa', detail: 'Agni is invoked; the father takes the Sankalpa for the samskara.' },
      { title: 'Investiture of the thread', detail: 'The yajnopavita is worn over the left shoulder while reciting the Yajnopavita mantra.' },
      { title: 'Gayatri Upadesha', detail: 'The Acharya whispers the Gayatri Mantra to the initiate — the heart of the ceremony.' },
      { title: 'Bhiksha (symbolic begging)', detail: 'The boy seeks his first alms from his mother and elders, symbolising humility.' },
      { title: 'Blessings & feast', detail: 'Elders bless the child; a family feast follows.' },
    ],
    mantras: [
      GANAPATI,
      {
        sanskrit: 'यज्ञोपवीतं परमं पवित्रं प्रजापतेर्यत्सहजं पुरस्तात्। आयुष्यमग्र्यं प्रतिमुञ्च शुभ्रं यज्ञोपवीतं बलमस्तु तेजः ॥',
        transliteration: 'Yajñopavītaṁ paramaṁ pavitraṁ prajāpater yat sahajaṁ purastāt · Āyuṣyam agryaṁ pratimuñca śubhraṁ yajñopavītaṁ balam astu tejaḥ',
        meaning: 'The sacred thread is supremely pure, born with Prajapati of old. Wear this bright thread for long life; may it bring strength and lustre.',
        when: 'While investing the sacred thread',
      },
      GAYATRI,
    ],
    tips: [
      'The initiate observes brahmacharya discipline through the ceremony.',
      'Keep the shikha and learn the daily Sandhyavandana the Acharya teaches.',
      'In Kashmir the rite is called Mekhal — confirm the exact vidhi with your purohit.',
    ],
    regionalVariations: 'Traditionally spread over days; now often a single-day ceremony. Often combined with Mundan.',
    commonMisconceptions: 'It is not merely symbolic — it confers lifelong spiritual discipline and responsibility.',
  },

  {
    id: 'havan',
    name: 'Havan (Yajna / Homa)',
    kashmiri: 'हवन',
    category: 'Vedic Ritual',
    icon: '🔥',
    youtubeId: 'iIFFjamWrJg',
    description: 'The sacred fire offering at the heart of Vedic worship — performed for purification, blessings, and on every major occasion.',
    purpose: 'To offer oblations to the deities through Agni, purify the environment, and fulfil a stated intention (sankalpa).',
    historicalBackground: 'Yajna is the oldest and central Vedic act; KP havans use specific Kashmiri Shaiva mantras and procedures.',
    religiousSignificance: 'Agni is the divine messenger and witness; offerings placed in the fire reach the devatas. "Idam na mama" — nothing is for the self.',
    quickFacts: { performedBy: 'Purohit with the host (yajamana)', duration: '1–2 hours', timing: 'Any auspicious time; sunrise is ideal' },
    materials: [
      'Havan kund (fire pit)', 'Mango wood (samidha)', 'Pure ghee', 'Havan samagri (herbal mix)',
      'Til (sesame), rice, jau (barley)', 'Camphor & matches', 'Spoon (sruva)', 'Kalash & flowers',
    ],
    procedure: [
      { title: 'Setup & purification', detail: 'Arrange the kund, purify the area, and place the deity/Kalash. Light the diwa.' },
      { title: 'Ganesha & Sankalpa', detail: 'Invoke Ganesha and take the Sankalpa stating name, gotra and intention.' },
      { title: 'Agni Sthapana', detail: 'Kindle the fire with camphor and samidha while invoking Agni.' },
      { title: 'Aahutis (offerings)', detail: 'Offer ghee and samagri into the fire with each mantra, ending "Svaha · Idam na mama".' },
      { title: 'Main devata offerings', detail: 'Offer to the principal deity of the occasion (e.g., Gayatri, Navagraha, Mahamrityunjaya).' },
      { title: 'Purnahuti', detail: 'Make the final full oblation (coconut/whole offering) to complete the yajna.' },
      { title: 'Aarti & prasad', detail: 'Perform aarti, take the sacred ash (bhasma), and distribute prasad.' },
    ],
    mantras: [
      GANAPATI,
      {
        sanskrit: 'ॐ अग्नये स्वाहा। इदं अग्नये इदं न मम ॥',
        transliteration: 'Om Agnaye Svāhā · Idaṁ Agnaye Idaṁ Na Mama',
        meaning: 'This oblation is for Agni — this is for Agni, not for me. The renunciation said with each offering.',
        when: 'With each aahuti into the fire',
      },
      {
        sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥',
        transliteration: 'Om Tryambakaṁ Yajāmahe Sugandhiṁ Puṣṭi-vardhanam · Urvārukam iva Bandhanān Mṛtyor Mukṣīya Mā’mṛtāt',
        meaning: 'We worship the three-eyed Lord Shiva, fragrant and nourishing; may he free us from death, like a cucumber from its stalk, towards immortality. (Mahamrityunjaya — for health & protection.)',
        when: 'For health, healing and protection',
      },
      GAYATRI,
    ],
    tips: [
      'Use only pure cow ghee and dry mango wood for a clean flame.',
      'Sit facing east; keep the fire fed steadily — never let it die mid-yajna.',
      'Apply the bhasma (sacred ash) to the forehead at the end.',
    ],
    regionalVariations: 'KP havans use particular Shaiva mantras and sequence; the deity and mantras change with the occasion.',
    commonMisconceptions: 'Havan is a precise Vedic procedure, not just "lighting a sacred fire".',
  },

  {
    id: 'shraddha',
    name: 'Shraddha & Tarpan',
    kashmiri: 'श्राद्ध',
    category: 'Ancestral Ritual',
    icon: '🪷',
    youtubeId: 'yvVa5sk3KW8',
    description: 'Rites for the departed — performed on the death anniversary (barsi) and through Pitru Paksha — offering water (tarpan) and pinda to the ancestors.',
    purpose: 'To nourish and give peace to the departed souls, repay the debt to ancestors (pitru-rin), and seek their blessings.',
    historicalBackground: 'KP Shraddha follows the Kashmiri Shaiva tradition with specific mantras; Khetsrimavas and Pitru Paksha are key observances.',
    religiousSignificance: 'An act of love and gratitude that helps the soul\'s onward journey and keeps the lineage spiritually connected.',
    quickFacts: { performedBy: 'Eldest son / male heir with a purohit', duration: '1–2 hours', timing: 'Death tithi, Amavasya, and during Pitru Paksha (Mahalaya)' },
    materials: [
      'Til (black sesame)', 'Water for tarpan', 'Kusha grass', 'Cooked rice & barley (for pinda)',
      'Seasonal fruits & sweets', 'A leaf-plate of food for the offering', 'Flowers & a lamp',
    ],
    procedure: [
      { title: 'Purification & fast', detail: 'The performer bathes and observes a fast; wears the yajnopavita over the right shoulder (apasavya) for pitru karya.' },
      { title: 'Sankalpa & invocation', detail: 'Take the Sankalpa and invoke the ancestors (pitrs) onto the kusha asana.' },
      { title: 'Tarpan (water offering)', detail: 'Offer water mixed with til and kusha to the ancestors, naming them, with cupped hands.' },
      { title: 'Pinda Dan', detail: 'Offer rice balls (pinda) to nourish the departed and aid their journey.' },
      { title: 'Brahmana bhojana', detail: 'Feed brahmins / the needy and offer food to cow, crow and dog (symbolic of the pitrs).' },
      { title: 'Prayers for peace', detail: 'Pray for the peace and progress of the departed souls.' },
    ],
    mantras: [
      {
        sanskrit: 'ॐ आगच्छन्तु मे पितरः इमं गृह्णन्तु जलाञ्जलिम् ॥',
        transliteration: 'Om Āgacchantu Me Pitaraḥ · Imaṁ Gṛhṇantu Jalāñjalim',
        meaning: 'May my ancestors come and accept this offering of water from my hands.',
        when: 'While beginning tarpan',
      },
      {
        sanskrit: 'ॐ पितृभ्यः स्वधायिभ्यः स्वधा नमः ॥',
        transliteration: 'Om Pitṛbhyaḥ Svadhāyibhyaḥ Svadhā Namaḥ',
        meaning: 'Salutations with svadha to the ancestors who receive the svadha offering.',
        when: 'Offering tarpan / pinda',
      },
    ],
    tips: [
      'Wear the sacred thread over the right shoulder (apasavya) and use south-facing direction for pitru karya.',
      'Use black til and kusha grass — both essential for tarpan.',
      'Perform with a calm, grateful heart — Shraddha is devotion, not mourning.',
    ],
    regionalVariations: 'Performed according to each family\'s sampradaya; KP observe Khetsrimavas (Pausha Amavasya) specially.',
    commonMisconceptions: 'Shraddha is not mourning — it is an act of love, gratitude and duty toward ancestors.',
  },

  {
    id: 'mundan',
    name: 'Mundan (Chudakarana / Zarakasai)',
    kashmiri: 'मुंडन',
    category: 'Samskara',
    icon: '✂️',
    youtubeId: 'IYPvYXFnGnU',
    description: 'The first-haircut samskara for a child, removing the birth hair — in the first or third year, often before or with the Mekhal.',
    purpose: 'To remove the birth hair (which is believed to carry past-life impurities) and bless the child with health and long life.',
    historicalBackground: 'Among the Shodasha Samskaras, observed in KP families for generations, sometimes at family temples or Kheer Bhawani.',
    religiousSignificance: 'Purification and a fresh start; the shikha (tuft) may be kept. A blessing for the child\'s growth and intellect.',
    quickFacts: { performedBy: 'Parents with a purohit (and barber)', duration: '1–2 hours', timing: 'Auspicious day in the 1st or 3rd year (odd year preferred)' },
    materials: ['New razor', 'Puja thaal & lamp', 'Flowers & rice', 'Sweets for distribution', 'Clean cloth for the hair'],
    procedure: [
      { title: 'Auspicious day & puja', detail: 'Fix a muhurat; begin with Ganesha puja and a Sankalpa for the child\'s well-being.' },
      { title: 'Seat the child', detail: 'The child sits on the parent\'s lap facing the deity; the head is moistened.' },
      { title: 'First cut', detail: 'The father/priest symbolically cuts the first lock with mantras, then the barber completes it (shikha kept).' },
      { title: 'Offering the hair', detail: 'The hair is collected and offered to a sacred river or buried respectfully.' },
      { title: 'Blessing & feast', detail: 'Elders bless the child; sweets are distributed and a feast held.' },
    ],
    mantras: [
      GANAPATI,
      {
        sanskrit: 'ॐ आयुष्यं वर्चस्यं रायस्पोषमौद्भिदम्। इदं हिरण्यं वर्चस्वज्जैत्रायाविशतादु माम् ॥',
        transliteration: 'Om Āyuṣyaṁ Varcasyaṁ Rāyaspoṣam Audbhidam',
        meaning: 'A blessing invoked for the child\'s long life, vigour, prosperity and growth.',
        when: 'While blessing the child at the first cut',
      },
    ],
    tips: [
      'Choose a calm time of day so the child is comfortable.',
      'Keep the shikha if your family tradition observes it.',
      'Many KP families perform Mundan at Kheer Bhawani or a family temple.',
    ],
    regionalVariations: 'Some families perform it at sacred sites; sometimes combined with Yagnopavit.',
    commonMisconceptions: 'It is a sacred samskara, not merely a first haircut.',
  },

  {
    id: 'lagan',
    name: 'Lagan (Marriage)',
    kashmiri: 'लगन',
    category: 'Marriage Ceremony',
    icon: '🕉️',
    youtubeId: 'uAOpx1pt3qk',
    description: 'The Kashmiri Pandit marriage — from kundali milan and Lagan Patra through the sacred fire rites — among the most elaborate Hindu ceremonies, blending Vedic and Kashmir Shaiva tradition.',
    purpose: 'The sacred union (vivaha samskara) of two souls and families, solemnised through Vedic and Kashmiri Shaiva rites.',
    historicalBackground: 'Centuries-old, combining astrology, Devgon, and a sequence of rites unique to Kashmir (Livun, Vanvun, Dejhoor, Mout, Athwas).',
    religiousSignificance: 'Marriage is a dharmic and spiritual journey; the Saptapadi (seven steps) and Panigrahana (joining of hands) are its sacred core.',
    quickFacts: { performedBy: 'Family purohit; both families', duration: 'Multi-day (engagement → wedding)', timing: 'Auspicious muhurat fixed by kundali milan' },
    materials: [
      'Lagan Patra (engagement document)', 'Havan kund & ghee', 'Devgon thaal', 'Mout (crown) for bride & groom',
      'Dejhoor (gold earrings)', 'Aetpar / Atta (ritual rice)', 'Kadur (ring)', 'Coconut, supari, flowers', 'Ceremonial attire',
    ],
    procedure: [
      { title: 'Kundali Milan & Lagan Patra', detail: 'Charts are matched, the muhurat fixed, and the Lagan Patra exchanged to formalise the alliance.' },
      { title: 'Livun & Devgon', detail: 'The homes are ritually cleansed (Livun); both families perform Devgon to their deities.' },
      { title: 'Mehndi & Vanvun', detail: 'Henna is applied; women sing the traditional Vanvun chorus through the ceremonies.' },
      { title: 'Var Satkaar & Ganesh Puja', detail: 'The groom\'s party is welcomed; Ganesha is worshipped to remove obstacles.' },
      { title: 'Panigrahana (Hasta Milap)', detail: 'The groom accepts the bride\'s hand with the Vedic mantra — the central rite.' },
      { title: 'Saptapadi', detail: 'The couple take seven steps around the sacred fire, each a vow for their life together.' },
      { title: 'Posh Puza & blessings', detail: 'Flowers are showered over the couple (Posh Puza) as the priests chant; elders bless them.' },
    ],
    mantras: [
      GANAPATI,
      {
        sanskrit: 'गृभ्णामि ते सौभगत्वाय हस्तं मया पत्या जरदष्टिर्यथासः ॥',
        transliteration: 'Gṛbhṇāmi Te Saubhagatvāya Hastaṁ · Mayā Patyā Jaradaṣṭir Yathāsaḥ',
        meaning: 'I take your hand for good fortune, that you may grow old with me, your husband. (The Panigrahana / hand-taking mantra.)',
        when: 'Panigrahana — joining of hands',
      },
      {
        sanskrit: 'धर्मेच अर्थेच कामेच नातिचरामि ॥',
        transliteration: 'Dharme cha Arthe cha Kāme cha Nāticharāmi',
        meaning: 'In dharma, in prosperity, and in pleasure — I shall never transgress (against you). The mutual vow of fidelity.',
        when: 'The Saptapadi vows',
      },
    ],
    tips: [
      'Both families perform Devgon before the wedding — it is essential, not optional.',
      'Keep the Lagan Patra, Dejhoor and Mout ready as per family custom.',
      'KP weddings differ from North-Indian ones in many rites — follow your purohit\'s sequence.',
    ],
    regionalVariations: 'Significant variation by tehsil and family; rites like Dejhoor, Athwas and Vanvun are distinctly Kashmiri.',
    commonMisconceptions: 'Lagan is a binding sacred commitment and a multi-stage samskara, not a single event.',
  },
];

// Retained for reference (used previously by the wedding timeline)
export const KP_WEDDING_TIMELINE = [
  { stage: 'Pre-Wedding', ceremonies: [
    { name: 'Kundali Milan & Lagan', description: 'Chart matching and the formal engagement', importance: 'high' },
    { name: 'Muhurat Fixing', description: 'Auspicious wedding date & time', importance: 'high' },
  ] },
  { stage: 'Day Before', ceremonies: [
    { name: 'Livun', description: 'Ritual cleansing of the venue', importance: 'high' },
    { name: 'Devgon', description: 'Propitiation of family deities at both homes', importance: 'critical' },
    { name: 'Mehndi & Vanvun', description: 'Henna and traditional songs', importance: 'medium' },
  ] },
  { stage: 'Wedding Day', ceremonies: [
    { name: 'Ganesh Puja', description: 'Removal of obstacles', importance: 'critical' },
    { name: 'Panigrahana', description: 'Joining of hands — central rite', importance: 'critical' },
    { name: 'Saptapadi', description: 'Seven steps & vows around the fire', importance: 'critical' },
    { name: 'Posh Puza', description: 'Flower showering with mantras', importance: 'critical' },
  ] },
];
