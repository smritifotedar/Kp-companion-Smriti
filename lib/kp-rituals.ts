// Kashmiri Pandit ritual library — fully detailed, step-by-step vidhi with
// per-step explanations, mantras (shlokas), samagri, setup diagrams, quick facts,
// and a how-to video per ritual. Mantras are well-known Vedic verses (public
// domain). Family/KP-specific procedures vary — always follow your purohit.

export interface Mantra {
  sanskrit: string;
  transliteration: string;
  meaning: string;
  when?: string;
}
export interface ProcedureStep {
  title: string;
  detail: string;   // fully explained instruction
  mantra?: string;  // short mantra said at this step
  tip?: string;     // practical tip / what to watch for
}
export type DiagramKind = 'puja' | 'havan' | 'thread';

export interface Ritual {
  id: string;
  name: string;
  kashmiri: string;
  category: string;
  icon: string;
  youtubeId?: string;
  diagram?: DiagramKind;
  description: string;
  purpose: string;
  historicalBackground: string;
  religiousSignificance: string;
  quickFacts: { performedBy: string; duration: string; timing: string };
  prep: string[];        // before you begin
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
const ACHAMAN_TIP = 'Sip a little water three times (Achamana) to purify yourself before starting.';

export const KP_RITUALS: Ritual[] = [
  // ─────────────────────────────────────────────────────────── DEVGON ──
  {
    id: 'devgon',
    name: 'Devgon',
    kashmiri: 'देवगन',
    category: 'Annual Ritual',
    icon: '🪔',
    youtubeId: 'd8qychSLuUc',
    diagram: 'puja',
    description: 'Annual propitiation of the family deity (Kuldevta/Kuldevi) and ancestors — a ritual unique to Kashmiri Pandits, performed in the home and also before weddings and Yagnopavit.',
    purpose: 'To renew the sacred bond with the family deity and ancestors and seek their protection and blessings for the household.',
    historicalBackground: 'Devgon is rooted in ancient Kashmiri ancestor worship fused with Shaiva tantra, predating later Vaishnava influences in Kashmir.',
    religiousSignificance: 'It upholds the covenant between a family and its protecting deity, and is mandatory before major samskaras such as marriage and the sacred-thread ceremony.',
    quickFacts: { performedBy: 'Family priest (purohit) with the family', duration: '2–3 hours', timing: 'An auspicious day fixed by the purohit; before weddings/Yagnopavit' },
    prep: [
      'Bathe and wear clean, preferably traditional clothes.',
      'Find out your family Gotra and Kuldevta/Kuldevi name (needed for the Sankalpa).',
      'Clean the puja room; set a low table (chowki) facing East.',
      'Arrange all samagri on a thaal within easy reach before you sit.',
    ],
    materials: [
      'Thaal (ritual plate)', 'Walnuts (akhrot)', 'Rice (chawal / akshat)', 'Mustard-oil lamp (diwa)',
      'Incense (agarbatti)', 'Red cloth (for the deity seat)', 'Marigold & seasonal flowers',
      'Betel leaves & nuts (supari)', 'Fruit & sweets', 'Curd (dahi) and honey', 'Kalash (water pot) with coconut',
    ],
    procedure: [
      { title: 'Achamana & Shuddhi (self-purification)', detail: 'Sit facing East. Sip water three times for Achamana, then sprinkle a little water around yourself and the altar to purify the space. Light the diwa and incense.', tip: ACHAMAN_TIP },
      { title: 'Deepa Prajwalan (lighting the lamp)', detail: 'Light the mustard-oil lamp first — it represents the divine presence and must stay lit through the whole puja.', mantra: 'ॐ दीपज्योतिः परब्रह्म दीपज्योतिर्जनार्दनः ॥' },
      { title: 'Kalash Sthapana (establish the pot)', detail: 'Place the Kalash filled with water, a coin, betel nut and a coconut on top. Lay the red cloth beside it as the seat (asana) for the deity.', tip: 'A mango leaf ring under the coconut is traditional.' },
      { title: 'Ganesha Vandana', detail: 'Invoke Lord Ganesha first to remove all obstacles, offering a flower and a pinch of rice (akshat) to him.', mantra: 'ॐ गं गणपतये नमः ॥' },
      { title: 'Sankalpa (statement of intent)', detail: 'Hold water, rice and a flower in your right palm and state your family name, Gotra, the place, the date (tithi) and the purpose — "I perform this Devgon to honour our Kuldevta and ancestors." Release it into the thaal.', tip: 'The Sankalpa is what dedicates the whole rite — say it sincerely.' },
      { title: 'Avahana (invoke the deity & ancestors)', detail: 'Invite your family deity onto the red-cloth seat and the ancestors with the family-specific mantras your purohit has given. Offer a flower with each invocation.', mantra: 'ॐ ऐं ह्रीं श्रीं शारिकायै नमः ॥' },
      { title: 'Shodashopachara (sixteen honours)', detail: 'Offer, in order: asana (seat), padya (water for feet), arghya (water for hands), achamana, snana, vastra (cloth), gandha (sandal), pushpa (flowers), dhupa (incense), deepa (lamp) and naivedya (food).', tip: 'You can simplify to flowers, incense, lamp and food if short on time — intent matters most.' },
      { title: 'Naivedya (food offering)', detail: 'Offer the fruit, sweets, curd and honey to the deity, sprinkling water around the plate to sanctify it.' },
      { title: 'Stotra & family prayers', detail: 'Recite the deity\'s stotra (e.g., the Sharika or Bhavani stotra) and your family prayers, asking for the well-being of every member by name.', mantra: 'सर्वमंगलमांगल्ये शिवे सर्वार्थसाधिके ॥' },
      { title: 'Aarti', detail: 'Perform aarti with the lit lamp, circling it clockwise before the deity while everyone joins. Ring the bell if available.' },
      { title: 'Kshama Prarthana (seek forgiveness)', detail: 'Apologise for any errors in the rite and request the deity to accept the worship.', mantra: 'आवाहनं न जानामि न जानामि विसर्जनम् ॥' },
      { title: 'Prasad & blessings', detail: 'Take the deity\'s blessings, apply tilak, and distribute the prasad to all present. The Kalash water is sprinkled in the home for protection.' },
    ],
    mantras: [
      GANAPATI,
      { sanskrit: 'ॐ ऐं ह्रीं श्रीं शारिकायै नमः ॥', transliteration: 'Om Aiṁ Hrīṁ Śrīṁ Śārikāyai Namaḥ', meaning: 'Salutations to Mother Sharika (Ragnya Bhagwati), the presiding goddess of Kashmir — a common Kuldevi invocation.', when: 'Invoking the family goddess' },
      { sanskrit: 'सर्वमंगलमांगल्ये शिवे सर्वार्थसाधिके। शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥', transliteration: 'Sarva-maṅgala-māṅgalye Śive Sarvārtha-sādhike · Śaraṇye Tryambake Gauri Nārāyaṇi Namo’stu Te', meaning: 'O auspicious one, giver of all goals, refuge of all — Gauri, Narayani, salutations to you.', when: 'Devi vandana' },
    ],
    tips: [
      'Observe a light sattvic diet on the day; many families fast until the puja concludes.',
      'Keep the lamp burning throughout — do not let it go out mid-puja.',
      'The exact mantras and offerings are family-specific — follow your own purohit\'s tradition.',
    ],
    regionalVariations: 'Devgon differs greatly by family and tehsil — some perform elaborate multi-day rites, others a single focused puja.',
    commonMisconceptions: 'It is not a generic puja; it is a family-specific rite with unique elements passed down generations.',
  },

  // ───────────────────────────────────────────────────── YAGNOPAVIT ──
  {
    id: 'yagnopavit',
    name: 'Yagnopavit (Mekhal / Janeu)',
    kashmiri: 'यज्ञोपवीत',
    category: 'Samskara',
    icon: '🧵',
    youtubeId: '-odf-0D2-zA',
    diagram: 'thread',
    description: 'The sacred-thread ceremony (called Mekhal in Kashmir) initiating a boy into Vedic study and the stage of brahmacharya. One of the sixteen samskaras.',
    purpose: 'To initiate the child with the Gayatri Mantra and invest the sacred thread, marking the start of formal spiritual and Vedic life.',
    historicalBackground: 'A core samskara of Kashmiri Pandits; the Mekhal is among the most important rites of a KP boy\'s life and is preceded by Devgon.',
    religiousSignificance: 'The three strands of the yajnopavita represent the three debts — to the gods, the sages, and the ancestors — and the responsibility of dharma.',
    quickFacts: { performedBy: 'Father & family purohit; the Acharya gives the Gayatri', duration: 'Half to full day', timing: 'Auspicious muhurat, traditionally age 7–12 (often combined with Mundan)' },
    prep: [
      'Fix the muhurat and perform Devgon beforehand.',
      'Prepare the havan kund, samidha (mango wood) and ghee.',
      'Keep the new yajnopavita, dhoti, danda, kamandalu and begging bowl ready.',
      'The boy should bathe and ideally observe a light fast that morning.',
    ],
    materials: [
      'Yajnopavita (sacred thread, three strands)', 'Havan kund, ghee, samidha & samagri',
      'New dhoti and uttariya', 'Mout (ceremonial crown)', 'Danda (staff)', 'Kamandalu (water pot)',
      'Begging bowl (symbolic)', 'Kashmiri ritual items / mudra',
    ],
    procedure: [
      { title: 'Devgon & Ganesh Puja', detail: 'The family first completes Devgon, then worships Ganesha and takes the Sankalpa for the samskara naming the child and Gotra.', mantra: 'ॐ गं गणपतये नमः ॥' },
      { title: 'Mangala Snana (auspicious bath)', detail: 'The boy is bathed ceremonially; if Mundan is combined, the head is shaved leaving the shikha (tuft).', tip: 'The shikha is kept at the crown — it is not shaved off.' },
      { title: 'Agni Sthapana (kindle the fire)', detail: 'The purohit kindles the havan fire and invokes Agni as the divine witness to the ceremony.', mantra: 'ॐ अग्नये नमः ॥' },
      { title: 'Aahutis (offerings)', detail: 'Ghee and samidha are offered into the fire with mantras to sanctify the rite, each ending "Svaha".' },
      { title: 'Investiture of the Yajnopavita', detail: 'The father places the sacred thread over the boy\'s LEFT shoulder, hanging to the right hip, while reciting the Yajnopavita-dharana mantra.', mantra: 'यज्ञोपवीतं परमं पवित्रं प्रजापतेर्यत्सहजं पुरस्तात् ॥', tip: 'Worn over the left shoulder (savya) — see the diagram.' },
      { title: 'Gayatri Upadesha (the core)', detail: 'Under a covering cloth, the Acharya whispers the Gayatri Mantra into the boy\'s ear — the heart of the entire ceremony and his initiation into Vedic study.', mantra: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं… ॥' },
      { title: 'Sandhyavandana teaching', detail: 'The Acharya teaches the boy the daily Sandhya worship and the use of the kamandalu and danda.' },
      { title: 'Bhiksha (symbolic begging)', detail: 'Holding the bowl, the boy seeks his first alms from his mother and elders — teaching humility and dependence on the community.', mantra: 'ॐ भवति भिक्षां देहि ॥' },
      { title: 'Purnahuti & blessings', detail: 'The final full oblation completes the havan; elders bless the initiate with rice and good wishes.' },
      { title: 'Feast (bhojan)', detail: 'A family feast concludes the day.' },
    ],
    mantras: [
      GANAPATI,
      { sanskrit: 'यज्ञोपवीतं परमं पवित्रं प्रजापतेर्यत्सहजं पुरस्तात्। आयुष्यमग्र्यं प्रतिमुञ्च शुभ्रं यज्ञोपवीतं बलमस्तु तेजः ॥', transliteration: 'Yajñopavītaṁ paramaṁ pavitraṁ prajāpater yat sahajaṁ purastāt · Āyuṣyam agryaṁ pratimuñca śubhraṁ yajñopavītaṁ balam astu tejaḥ', meaning: 'The sacred thread is supremely pure, born with Prajapati of old. Wear this bright thread for long life; may it bring strength and lustre.', when: 'While investing the sacred thread' },
      GAYATRI,
    ],
    tips: [
      'The initiate observes brahmacharya discipline through the ceremony.',
      'Keep the shikha and practise the daily Sandhyavandana the Acharya teaches.',
      'In Kashmir the rite is called Mekhal — confirm the exact vidhi with your purohit.',
    ],
    regionalVariations: 'Traditionally spread over days; now often a single-day ceremony. Often combined with Mundan.',
    commonMisconceptions: 'It is not merely symbolic — it confers lifelong spiritual discipline and responsibility.',
  },

  // ──────────────────────────────────────────────────────────── HAVAN ──
  {
    id: 'havan',
    name: 'Havan (Yajna / Homa)',
    kashmiri: 'हवन',
    category: 'Vedic Ritual',
    icon: '🔥',
    youtubeId: 'iIFFjamWrJg',
    diagram: 'havan',
    description: 'The sacred fire offering at the heart of Vedic worship — performed for purification, blessings, and on every major occasion.',
    purpose: 'To offer oblations to the deities through Agni, purify the environment, and fulfil a stated intention (sankalpa).',
    historicalBackground: 'Yajna is the oldest and central Vedic act; KP havans use specific Kashmiri Shaiva mantras and procedures.',
    religiousSignificance: 'Agni is the divine messenger and witness; offerings placed in the fire reach the devatas. "Idam na mama" — nothing is for the self.',
    quickFacts: { performedBy: 'Purohit with the host (yajamana)', duration: '1–2 hours', timing: 'Any auspicious time; sunrise is ideal' },
    prep: [
      'Bathe and wear clean clothes; sit on the WEST side facing East.',
      'Place the havan kund on a fire-safe base (bricks/sand).',
      'Keep dry mango wood, camphor, pure ghee, a sruva spoon and samagri ready.',
      'Decide your Sankalpa (the purpose of the havan) in advance.',
    ],
    materials: [
      'Havan kund (fire pit)', 'Mango wood (samidha)', 'Pure cow ghee', 'Havan samagri (herbal mix)',
      'Til (sesame), rice, jau (barley)', 'Camphor & matches', 'Spoon (sruva)', 'Kalash & flowers',
    ],
    procedure: [
      { title: 'Achamana & Sankalpa', detail: 'Purify yourself with Achamana, then take the Sankalpa stating your name, Gotra and the purpose of the havan.', tip: ACHAMAN_TIP },
      { title: 'Ganesha & Kalash puja', detail: 'Worship Ganesha and establish the Kalash to invite divine presence and remove obstacles.', mantra: 'ॐ गं गणपतये नमः ॥' },
      { title: 'Agni Sthapana (kindle the fire)', detail: 'Place camphor and a few sticks of mango wood in the kund and light it, invoking Agni to accept the offerings.', mantra: 'ॐ अग्नये नमः, आगच्छ ॥', tip: 'Build the fire steadily before starting offerings.' },
      { title: 'Samidha offerings', detail: 'Offer ghee-dipped samidha sticks into the fire with the opening mantras to strengthen Agni.' },
      { title: 'Aahutis (oblations)', detail: 'With the sruva, offer ghee and samagri into the fire after each mantra, saying "Svaha" as you offer and "Idam na mama" (this is not mine) in renunciation.', mantra: 'ॐ अग्नये स्वाहा। इदं अग्नये इदं न मम ॥' },
      { title: 'Devata offerings', detail: 'Offer to the deity of the occasion — e.g., Gayatri for purification, Mahamrityunjaya for health, or Navagraha for the nine planets — repeating the mantra with each aahuti.', mantra: 'ॐ त्र्यम्बकं यजामहे… स्वाहा ॥' },
      { title: 'Purnahuti (final oblation)', detail: 'Make the concluding full offering — a whole coconut wrapped in cloth with ghee — to complete the yajna.', mantra: 'ॐ पूर्णमदः पूर्णमिदम् … स्वाहा ॥' },
      { title: 'Aarti & Bhasma', detail: 'Perform aarti, then take the sacred ash (bhasma) and apply it to the forehead; distribute prasad.', tip: 'Let the fire die naturally; never extinguish a yajna with water.' },
    ],
    mantras: [
      GANAPATI,
      { sanskrit: 'ॐ अग्नये स्वाहा। इदं अग्नये इदं न मम ॥', transliteration: 'Om Agnaye Svāhā · Idaṁ Agnaye Idaṁ Na Mama', meaning: 'This oblation is for Agni — this is for Agni, not for me. The renunciation said with each offering.', when: 'With each aahuti into the fire' },
      { sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥', transliteration: 'Om Tryambakaṁ Yajāmahe Sugandhiṁ Puṣṭi-vardhanam · Urvārukam iva Bandhanān Mṛtyor Mukṣīya Mā’mṛtāt', meaning: 'We worship the three-eyed Lord Shiva; may he free us from death, like a cucumber from its stalk, towards immortality. (Mahamrityunjaya — for health & protection.)', when: 'For health, healing and protection' },
      GAYATRI,
    ],
    tips: [
      'Use only pure cow ghee and dry mango wood for a clean flame.',
      'Sit facing East; keep the fire fed steadily — never let it die mid-yajna.',
      'Apply the bhasma (sacred ash) to the forehead at the end.',
    ],
    regionalVariations: 'KP havans use particular Shaiva mantras and sequence; the deity and mantras change with the occasion.',
    commonMisconceptions: 'Havan is a precise Vedic procedure, not just "lighting a sacred fire".',
  },

  // ─────────────────────────────────────────────────── SHRADDHA ──
  {
    id: 'shraddha',
    name: 'Shraddha & Tarpan',
    kashmiri: 'श्राद्ध',
    category: 'Ancestral Ritual',
    icon: '🪷',
    youtubeId: 'yvVa5sk3KW8',
    diagram: 'thread',
    description: 'Rites for the departed — on the death anniversary (barsi) and through Pitru Paksha — offering water (tarpan) and pinda to the ancestors.',
    purpose: 'To nourish and give peace to the departed souls, repay the debt to ancestors (pitru-rin), and seek their blessings.',
    historicalBackground: 'KP Shraddha follows the Kashmiri Shaiva tradition with specific mantras; Khetsrimavas and Pitru Paksha are key observances.',
    religiousSignificance: 'An act of love and gratitude that helps the soul\'s onward journey and keeps the lineage spiritually connected.',
    quickFacts: { performedBy: 'Eldest son / male heir with a purohit', duration: '1–2 hours', timing: 'Death tithi, Amavasya, and during Pitru Paksha (Mahalaya)' },
    prep: [
      'Bathe; the performer observes a fast until the rite is complete.',
      'Wear the sacred thread over the RIGHT shoulder (apasavya) for ancestral rites — see the diagram.',
      'Keep black til, kusha grass and water ready; sit facing South.',
      'Prepare cooked rice for the pinda and a portion of food for the offering.',
    ],
    materials: [
      'Til (black sesame)', 'Water for tarpan', 'Kusha grass', 'Cooked rice & barley (for pinda)',
      'Seasonal fruits & sweets', 'A leaf-plate of food for the offering', 'Flowers & a lamp',
    ],
    procedure: [
      { title: 'Apasavya & Achamana', detail: 'Purify yourself, then shift the sacred thread to the right shoulder (apasavya) and face South — the direction of the ancestors.', tip: 'Pitru rites are always done apasavya (thread over right shoulder).' },
      { title: 'Sankalpa', detail: 'Take the Sankalpa naming the departed, the relationship, your Gotra and the tithi, stating the intention to offer Shraddha.' },
      { title: 'Avahana (invoke the pitrs)', detail: 'Spread kusha grass as the seat and invoke the ancestors (pitrs) to be present and accept the offering.', mantra: 'ॐ आगच्छन्तु मे पितरः ॥' },
      { title: 'Tarpan (water offering)', detail: 'Take water mixed with black til and kusha in cupped hands and pour it out through the base of the fingers, naming each ancestor — repeating for father, grandfather, great-grandfather lines.', mantra: 'ॐ पितृभ्यः स्वधायिभ्यः स्वधा नमः ॥' },
      { title: 'Pinda Dan', detail: 'Shape balls of cooked rice (pinda) and offer them on the kusha, sprinkling til and water, to nourish the departed and aid their journey.' },
      { title: 'Naivedya & Pancha-bali', detail: 'Offer the food, then set aside small portions for the cow, crow, dog, deva and ant (pancha-bali) — symbolic of feeding the pitrs and all beings.' },
      { title: 'Brahmana / anna daan', detail: 'Feed brahmins or the needy, or donate food — considered the most meritorious part of Shraddha.' },
      { title: 'Prarthana & visarjan', detail: 'Pray for the peace and progress of the souls, seek their blessings, and respectfully conclude (visarjan). Restore the thread to the left shoulder afterwards.' },
    ],
    mantras: [
      { sanskrit: 'ॐ आगच्छन्तु मे पितरः इमं गृह्णन्तु जलाञ्जलिम् ॥', transliteration: 'Om Āgacchantu Me Pitaraḥ · Imaṁ Gṛhṇantu Jalāñjalim', meaning: 'May my ancestors come and accept this offering of water from my hands.', when: 'While beginning tarpan' },
      { sanskrit: 'ॐ पितृभ्यः स्वधायिभ्यः स्वधा नमः ॥', transliteration: 'Om Pitṛbhyaḥ Svadhāyibhyaḥ Svadhā Namaḥ', meaning: 'Salutations with svadha to the ancestors who receive the svadha offering.', when: 'Offering tarpan / pinda' },
    ],
    tips: [
      'Use black til and kusha grass — both essential for tarpan.',
      'Pour the tarpan water through the pitru-tirtha (base of the fingers), not the fingertips.',
      'Perform with a calm, grateful heart — Shraddha is devotion, not mourning.',
    ],
    regionalVariations: 'Performed according to each family\'s sampradaya; KP observe Khetsrimavas (Pausha Amavasya) specially.',
    commonMisconceptions: 'Shraddha is not mourning — it is an act of love, gratitude and duty toward ancestors.',
  },

  // ─────────────────────────────────────────────────────────── MUNDAN ──
  {
    id: 'mundan',
    name: 'Mundan (Chudakarana / Zarakasai)',
    kashmiri: 'मुंडन',
    category: 'Samskara',
    icon: '✂️',
    youtubeId: 'IYPvYXFnGnU',
    diagram: 'puja',
    description: 'The first-haircut samskara for a child, removing the birth hair — in the first or third year, often before or with the Mekhal.',
    purpose: 'To remove the birth hair (believed to carry past-life impurities) and bless the child with health, vigour and long life.',
    historicalBackground: 'Among the Shodasha Samskaras, observed in KP families for generations, sometimes at family temples or Kheer Bhawani.',
    religiousSignificance: 'Purification and a fresh start; the shikha (tuft) may be kept. A blessing for the child\'s growth and intellect.',
    quickFacts: { performedBy: 'Parents with a purohit (and barber)', duration: '1–2 hours', timing: 'Auspicious day in the 1st or 3rd year (odd year preferred)' },
    prep: [
      'Fix a muhurat; many families choose a temple or sacred site (e.g., Kheer Bhawani).',
      'Choose a calm time of day so the child is comfortable.',
      'Keep a new razor, puja thaal, lamp and sweets ready.',
    ],
    materials: ['New razor', 'Puja thaal & lamp', 'Flowers & rice (akshat)', 'Sweets for distribution', 'Clean cloth for the hair'],
    procedure: [
      { title: 'Ganesh Puja & Sankalpa', detail: 'Begin with Ganesha worship and a Sankalpa for the child\'s long life and well-being, naming the child and Gotra.', mantra: 'ॐ गं गणपतये नमः ॥' },
      { title: 'Seat the child', detail: 'The child sits on the parent\'s lap facing the deity; the head is sprinkled with a little water to moisten the hair.' },
      { title: 'Blessing the head', detail: 'The purohit blesses the child\'s head invoking long life and vigour before the first cut.', mantra: 'ॐ आयुष्यं वर्चस्यं रायस्पोषमौद्भिदम् ॥' },
      { title: 'First symbolic cut', detail: 'The father (or priest) ceremonially cuts the first lock of hair with mantras; the shikha at the crown is kept.', tip: 'Only a symbolic first lock is cut ritually — the barber completes the rest.' },
      { title: 'Completing the haircut', detail: 'The barber gently completes the haircut while the family keeps the child calm.' },
      { title: 'Offering the hair', detail: 'The collected hair is wrapped in the clean cloth and later offered to a sacred river or buried respectfully.' },
      { title: 'Blessing & feast', detail: 'Elders bless the child with akshat; sweets are distributed and a small feast held.' },
    ],
    mantras: [
      GANAPATI,
      { sanskrit: 'ॐ आयुष्यं वर्चस्यं रायस्पोषमौद्भिदम्। इदं हिरण्यं वर्चस्वज्जैत्रायाविशतादु माम् ॥', transliteration: 'Om Āyuṣyaṁ Varcasyaṁ Rāyaspoṣam Audbhidam', meaning: 'A blessing invoked for the child\'s long life, vigour, prosperity and growth.', when: 'While blessing the child at the first cut' },
    ],
    tips: [
      'Keep the shikha if your family tradition observes it.',
      'Have a familiar toy or parent close so the child stays calm during the cut.',
      'Many KP families perform Mundan at Kheer Bhawani or a family temple.',
    ],
    regionalVariations: 'Some families perform it at sacred sites; sometimes combined with Yagnopavit.',
    commonMisconceptions: 'It is a sacred samskara, not merely a first haircut.',
  },

  // ─────────────────────────────────────────────────────────── LAGAN ──
  {
    id: 'lagan',
    name: 'Lagan (Marriage)',
    kashmiri: 'लगन',
    category: 'Marriage Ceremony',
    icon: '🕉️',
    youtubeId: 'uAOpx1pt3qk',
    diagram: 'havan',
    description: 'The Kashmiri Pandit marriage — from kundali milan and Lagan Patra through the sacred fire rites — among the most elaborate Hindu ceremonies, blending Vedic and Kashmir Shaiva tradition.',
    purpose: 'The sacred union (vivaha samskara) of two souls and families, solemnised through Vedic and Kashmiri Shaiva rites.',
    historicalBackground: 'Centuries-old, combining astrology, Devgon, and a sequence of rites unique to Kashmir (Livun, Vanvun, Dejhoor, Mout, Athwas).',
    religiousSignificance: 'Marriage is a dharmic and spiritual journey; the Saptapadi (seven steps) and Panigrahana (joining of hands) are its sacred core.',
    quickFacts: { performedBy: 'Family purohit; both families', duration: 'Multi-day (engagement → wedding)', timing: 'Auspicious muhurat fixed by kundali milan' },
    prep: [
      'Match horoscopes (kundali milan) and fix the muhurat with the purohit.',
      'Both families perform Devgon before the wedding — it is essential.',
      'Arrange the mandap with the havan kund; keep Mout, Dejhoor, Lagan Patra and attire ready.',
    ],
    materials: [
      'Lagan Patra (engagement document)', 'Havan kund & ghee', 'Devgon thaal', 'Mout (crown) for bride & groom',
      'Dejhoor (gold earrings)', 'Aetpar / Atta (ritual rice)', 'Kadur (ring)', 'Coconut, supari, flowers', 'Ceremonial attire',
    ],
    procedure: [
      { title: 'Kundali Milan & Lagan Patra', detail: 'The horoscopes are matched (Ashtakoot), the muhurat fixed, and the Lagan Patra exchanged to formalise the alliance.' },
      { title: 'Livun & Devgon', detail: 'The homes are ritually cleansed (Livun); both families perform Devgon to their deities and ancestors.' },
      { title: 'Mehndi & Vanvun', detail: 'Henna is applied to the bride; the women sing the traditional Vanvun chorus through the ceremonies.' },
      { title: 'Var Satkaar (welcome)', detail: 'The groom\'s party (baraat) is received with honour at the venue.' },
      { title: 'Ganesh Puja & Mandap', detail: 'Ganesha is worshipped to remove obstacles; the couple is seated at the sacred-fire mandap.', mantra: 'ॐ गं गणपतये नमः ॥' },
      { title: 'Kanyadaan', detail: 'The bride\'s parents give her hand to the groom, entrusting their daughter with blessings.' },
      { title: 'Panigrahana (Hasta Milap)', detail: 'The groom accepts the bride\'s right hand with the Vedic mantra — the central rite of the marriage.', mantra: 'गृभ्णामि ते सौभगत्वाय हस्तम् ॥' },
      { title: 'Agni Parikrama & Saptapadi', detail: 'The couple circle the sacred fire and take the seven steps (Saptapadi), each a vow for nourishment, strength, prosperity, happiness, progeny, health and lifelong friendship.', mantra: 'धर्मेच अर्थेच कामेच नातिचरामि ॥' },
      { title: 'Dejhoor & Athwas', detail: 'The bride receives the Dejhoor (gold earrings, a mark of the married KP woman); the Athwas and other Kashmiri-specific rites are performed.' },
      { title: 'Posh Puza', detail: 'Flowers are showered over the couple while the priests chant — a uniquely Kashmiri blessing.' },
      { title: 'Ashirvad & Vidaai', detail: 'Elders bless the couple; the bride departs for her new home (Vidaai), followed by Grih Pravesh.' },
    ],
    mantras: [
      GANAPATI,
      { sanskrit: 'गृभ्णामि ते सौभगत्वाय हस्तं मया पत्या जरदष्टिर्यथासः ॥', transliteration: 'Gṛbhṇāmi Te Saubhagatvāya Hastaṁ · Mayā Patyā Jaradaṣṭir Yathāsaḥ', meaning: 'I take your hand for good fortune, that you may grow old with me, your husband. (The Panigrahana / hand-taking mantra.)', when: 'Panigrahana — joining of hands' },
      { sanskrit: 'धर्मेच अर्थेच कामेच नातिचरामि ॥', transliteration: 'Dharme cha Arthe cha Kāme cha Nāticharāmi', meaning: 'In dharma, in prosperity, and in pleasure — I shall never transgress (against you). The mutual vow of fidelity.', when: 'The Saptapadi vows' },
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
