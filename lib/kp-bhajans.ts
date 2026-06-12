// Kashmiri Pandit devotional music & ceremonial songs.
//
// Content note: verses from Lal Ded, Roopa Bhawani and traditional folk wanwun
// are centuries old (public domain) and a short refrain is shown for context.
// For modern compositions only a description is given — please seek full lyrics
// and recordings from community/cultural archives and artists.

export type SongCategory = 'Bhajan & Leela' | 'Stotra & Stuti' | 'Vakh & Shruk' | 'Wanwun & Henzae' | 'Kashmiri Folk & Song';

export interface KPSong {
  id: string;
  title: string;
  kashmiri?: string;
  category: SongCategory;
  deity?: string;
  occasion: string;
  about: string;
  refrain?: string;        // short, public-domain or traditional line
  refrainMeaning?: string; // translation/gloss
  icon: string;
  audioUrl?: string;       // optional hosted/licensed recording (mp3). Plays inline when present.
  youtubeId?: string;      // optional YouTube video id — plays inline via embed.
}

// Listen link: the exact video when we have one, else a YouTube search.
export function listenSearchUrl(song: KPSong): string {
  if (song.youtubeId) return `https://youtu.be/${song.youtubeId}`;
  const kind = song.category === 'Wanwun & Henzae' ? 'kashmiri wanwun' : 'kashmiri pandit bhajan';
  const q = `${song.title} ${kind}`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}

export const SONG_CATEGORIES: SongCategory[] = ['Bhajan & Leela', 'Stotra & Stuti', 'Vakh & Shruk', 'Wanwun & Henzae', 'Kashmiri Folk & Song'];

export const KP_SONGS: KPSong[] = [
  // ── Bhajan & Leela ───────────────────────────────────────────────────────
  // ── Kashmir Heritage bhajan playlist ──
  {
    id: 'om-shree-ganeshaye', title: 'Om Shree Ganeshaye Namah', kashmiri: 'ॐ श्री गणेशाय नमः',
    category: 'Bhajan & Leela', deity: 'Ganesha',
    occasion: 'Auspicious beginnings, before any rite',
    about: 'Invocation to Lord Ganesha, remover of obstacles — sung before beginning any auspicious work.',
    icon: '🐘', youtubeId: 'w2hSuqm3q2E',
  },
  {
    id: 'om-namo-vasudevaye', title: 'Om Namo Bhagwate Vasudevaye', kashmiri: 'ॐ नमो भगवते वासुदेवाय',
    category: 'Stotra & Stuti', deity: 'Vishnu / Krishna',
    occasion: 'Daily japa, Janmashtami',
    about: 'The sacred twelve-syllable Dwadakshari mantra of Lord Vishnu (Vasudeva), chanted for peace and devotion.',
    icon: '🪈', youtubeId: 'V83IO3D4vrw',
  },
  {
    id: 'maejai-kar-daya', title: 'Maejai Kar Daya', kashmiri: 'माजै कर दया',
    category: 'Bhajan & Leela', deity: 'Mother Goddess',
    occasion: 'Devi worship, Ashtami',
    about: 'A heartfelt Kashmiri prayer to the Divine Mother — “Mother, show your mercy.”',
    icon: '🌺', youtubeId: 'p3cdgwwhbZ4',
  },
  {
    id: 'maej-sharikaey', title: 'Maej Sharikaey Kar Daya', kashmiri: 'माज शारिके कर दया',
    category: 'Bhajan & Leela', deity: 'Sharika Devi',
    occasion: 'Sharika Ashtami, Hari Parbat',
    about: 'A devotional appeal to Maej Sharika, presiding goddess of Kashmir at Hari Parbat.',
    icon: '🌺', youtubeId: 'JyoLqozsX1A',
  },
  {
    id: 'shivratri-vatak', title: 'Shivratri Vatak Puja', kashmiri: 'शिवरात्री वटक पूजा',
    category: 'Bhajan & Leela', deity: 'Shiva',
    occasion: 'Herath (KP Shivaratri)',
    about: 'Chants for the Vatuk Puja of Herath — the central worship of Shiva on the holiest KP night.',
    icon: '🔱', youtubeId: 'Gs97V1Rp0Lc',
  },
  {
    id: 'ya-devi-sarvabhuteshu', title: 'Ya Devi Sarvabhuteshu', kashmiri: 'या देवी सर्वभूतेषु',
    category: 'Stotra & Stuti', deity: 'Durga / Devi',
    occasion: 'Navratri, Devi puja',
    about: 'The celebrated verses from the Durga Saptashati saluting the Goddess present in all beings.',
    icon: '🪔', youtubeId: 'zlVB2FXR7_g',
  },
  {
    id: 'cha-mata-kastami', title: 'Cha Mata Kastami Gaam', kashmiri: 'छ माता कस्तमि गाम',
    category: 'Bhajan & Leela', deity: 'Mother Goddess',
    occasion: 'Devi bhajan gatherings',
    about: 'A traditional Kashmiri bhajan in praise of the Divine Mother.',
    icon: '🌸', youtubeId: 'KTZyYMnORZ8',
  },
  {
    id: 'tvamev-mata', title: 'Tvamev Mata Cha Pita', kashmiri: 'त्वमेव माता च पिता',
    category: 'Stotra & Stuti', deity: 'Universal',
    occasion: 'Daily prayer, before puja',
    about: 'The beloved shloka — “You alone are mother and father, kin and friend” — a complete surrender to the Divine.',
    icon: '🙏', youtubeId: 'hyXEzyjIK9Q',
  },
  {
    id: 'kar-iyea-darshun', title: 'Kar Iyea Darshun Diyea', kashmiri: 'कर इये दर्शुन दिये',
    category: 'Bhajan & Leela', deity: 'Devi',
    occasion: 'Devi worship, pilgrimage',
    about: 'A yearning Kashmiri bhajan, a plea to the Mother for her darshan (sacred sight).',
    icon: '✨', youtubeId: 'V6tOZ-Fg4CA',
  },
  {
    id: 'guru-bramha', title: 'Guru Bramha Guru Vishnu', kashmiri: 'गुरुर्ब्रह्मा गुरुर्विष्णु',
    category: 'Stotra & Stuti', deity: 'Guru',
    occasion: 'Guru Purnima, daily prayer',
    about: 'The Guru Vandana shloka revering the Guru as Brahma, Vishnu and Maheshwara.',
    icon: '📿', youtubeId: 'ZHrjtu5WQEg',
  },
  {
    id: 'gauri-amba', title: 'Gauri Amba', kashmiri: 'गौरी अम्बा',
    category: 'Bhajan & Leela', deity: 'Gauri / Parvati',
    occasion: 'Devi worship, weddings',
    about: 'A devotional song to Gauri (Parvati), the gentle Mother and consort of Shiva.',
    icon: '🌷', youtubeId: 'Gh6u5IVqIqg',
  },
  {
    id: 'beltai-madal', title: 'Beltai Madal — Shaiva Chants', kashmiri: 'कश्मीर शैव मंत्र',
    category: 'Stotra & Stuti', deity: 'Shiva',
    occasion: 'Contemplation, Shaiva worship',
    about: 'Sacred chants rooted in Kashmir Shaivism — the philosophical heart of Kashmiri Pandit spirituality.',
    icon: '🕉️', youtubeId: 'TjsxQLJNzIc',
  },
  {
    id: 'razdan-leela',
    youtubeId: 'uLQ7AO2uZ2w',
    title: 'Leelas of Bhakta Krishna Joo Razdan',
    kashmiri: 'कृष्ण जू रज़दान लीला',
    category: 'Bhajan & Leela',
    deity: 'Shiva / Vishnu',
    occasion: 'Bhajan gatherings, festivals, satsang',
    about: 'The 19th-century saint-poet Bhakta Krishna Joo Razdan composed beloved Kashmiri leelas (devotional songs) on Shiva, Rama and Krishna. They remain central to KP bhajan singing and are sung in chorus at home satsangs and on festival nights.',
    icon: '🎶',
  },
  {
    id: 'parmanand-leela',
    youtubeId: 'YNPlJ0AhSSA',
    title: 'Leelas of Parmanand',
    kashmiri: 'परमानंद लीला',
    category: 'Bhajan & Leela',
    deity: 'Krishna / Radha',
    occasion: 'Janmashtami, bhajan sandhya',
    about: 'Swami Parmanand (19th century) wrote luminous Kashmiri devotional poetry, including Radha-Krishna leelas and the “Amarnath Yatra” poem. His leelas are sung with deep emotion in KP homes, especially around Janmashtami.',
    icon: '🪈',
  },
  {
    id: 'sharika-bhajan',
    youtubeId: 'PXFSGrerppQ',
    title: 'Sharika Bhagwati Bhajans',
    kashmiri: 'शारिका भगवती भजन',
    category: 'Bhajan & Leela',
    deity: 'Sharika Devi (Hari Parbat)',
    occasion: 'Sharika Ashtami, Navreh, Zyeth Atham',
    about: 'Bhajans in praise of Sharika Bhagwati, the presiding goddess of Kashmir at Hari Parbat. Sung on Ashtami days and during the pilgrimage, often with the refrain invoking “Maej Sharika”.',
    refrain: 'Jai Maej Sharika, Hari Parbat vaeyni',
    refrainMeaning: 'Victory to Mother Sharika, who dwells on Hari Parbat.',
    icon: '🌺',
  },
  {
    id: 'kheer-bhawani-bhajan',
    youtubeId: 'N4GgANYYys4',
    title: 'Ragnya / Kheer Bhawani Bhajans',
    kashmiri: 'रागन्या भवानी भजन',
    category: 'Bhajan & Leela',
    deity: 'Ragnya Devi (Kheer Bhawani)',
    occasion: 'Jyeshtha Ashtami (Kheer Bhawani Mela)',
    about: 'Devotional songs to Mata Ragnya of Tulamula (Kheer Bhawani), sung especially at the annual Jyeshtha Ashtami mela when devotees offer kheer at the sacred spring.',
    icon: '🍚',
  },

  // ── Stotra & Stuti ────────────────────────────────────────────────────────
  {
    id: 'panchastavi',
    youtubeId: '20dDJ2a2L2o',
    title: 'Panchastavi',
    kashmiri: 'पञ्चस्तवी',
    category: 'Stotra & Stuti',
    deity: 'Devi (Tripurasundari)',
    occasion: 'Daily/Navratri Devi worship',
    about: 'A revered five-part hymn to the Goddess, treasured in Kashmir Shaiva-Shakta tradition. Recited by KP devotees for grace, protection and spiritual elevation; considered a jewel of Kashmiri devotional literature.',
    icon: '📿',
  },
  {
    id: 'indrakshi',
    youtubeId: 'cuSGy5SuVtA',
    title: 'Indrakshi Stotra',
    kashmiri: 'इन्द्राक्षी स्तोत्र',
    category: 'Stotra & Stuti',
    deity: 'Durga / Indrakshi',
    occasion: 'Navratri, havan, healing prayers',
    about: 'A powerful Devi stotra widely recited in Kashmiri Pandit households during Navratri and havan for health and well-being.',
    icon: '🔱',
  },
  {
    id: 'bhavani-sahasranama',
    youtubeId: 'YVxi7Q7lFgs',
    title: 'Bhavani Sahasranama',
    kashmiri: 'भवानी सहस्रनाम',
    category: 'Stotra & Stuti',
    deity: 'Bhavani',
    occasion: 'Navratri, Ashtami, vrat',
    about: 'The thousand names of Goddess Bhavani, chanted by KP families on Ashtami and through Navratri as a core act of Devi bhakti.',
    icon: '🕉️',
  },

  // ── Vakh & Shruk (mystic verse) ───────────────────────────────────────────
  {
    id: 'lal-ded-vakh',
    youtubeId: 'IuiAJwc-HlQ',
    title: 'Vakhs of Lal Ded (Lalleshwari)',
    kashmiri: 'लल वाख',
    category: 'Vakh & Shruk',
    deity: 'Shiva (formless)',
    occasion: 'Contemplation, satsang',
    about: 'The 14th-century mystic Lal Ded (Lalleshwari) gave Kashmir its most beloved vakhs — terse, luminous verses of Shaiva realisation, cherished across communities for over six centuries.',
    refrain: 'Aami pana so’dras nāvi ches lamān',
    refrainMeaning: '“With a rope of untwisted thread I tow my boat across the sea…” — a meditation on faith and surrender.',
    icon: '🪔',
  },
  {
    id: 'roopa-bhawani',
    youtubeId: '5naVKBf1Z3s',
    title: 'Vakhs of Roopa Bhawani',
    kashmiri: 'रूप भवानी वाख',
    category: 'Vakh & Shruk',
    deity: 'Devi / Shiva',
    occasion: 'Sahib Saptami, contemplation',
    about: 'Roopa Bhawani (Alakheshwari, 17th century), a great KP woman saint of the Sahib family, composed vakhs of profound non-dual wisdom. Her devotees observe Sahib Saptami in her remembrance.',
    icon: '✨',
  },
  {
    id: 'nund-reshi',
    youtubeId: 'SfM9EtRBaNU',
    title: 'Shruks of Nund Reshi',
    kashmiri: 'नुंद ऋषि श्रुक',
    category: 'Vakh & Shruk',
    deity: 'Universal / Shaiva-Sufi',
    occasion: 'Contemplation, shared heritage',
    about: 'The shruks of Sheikh-ul-Alam (Nund Reshi) reflect Kashmir’s shared mystic culture and echo Lal Ded’s spirit; they are part of the wider Kashmiri devotional inheritance.',
    icon: '🍃',
  },

  // ── Wanwun & Henzae (ceremonial folk song) ────────────────────────────────
  {
    id: 'wanwun',
    youtubeId: '9JpHjCNqnzg',
    title: 'Wanwun (Wedding Chorus)',
    kashmiri: 'वनवुन',
    category: 'Wanwun & Henzae',
    occasion: 'Lagan (wedding), Mekhal / Yagnopavit, Kahnethar',
    about: 'Wanwun is the traditional call-and-response chorus sung by women at Kashmiri Pandit ceremonies — weddings, the sacred-thread Mekhal, and the sixth-day Kahnethar. One leads a line and the group answers, blessing the family and the occasion.',
    refrain: 'Yiwaan yiwaan, vesiye yiwaan…',
    refrainMeaning: 'A traditional welcoming refrain — “come, dear ones, come…” sung to greet guests and bless the gathering.',
    icon: '👏',
  },
  {
    id: 'roff',
    youtubeId: 'DpCYSznKFGs',
    title: 'Rouf Songs',
    kashmiri: 'रौफ़',
    category: 'Wanwun & Henzae',
    occasion: 'Spring festivals, Navreh, weddings',
    about: 'Rouf is a graceful group song-and-dance form performed by women in rows, sung in spring and at joyous occasions — a vivid expression of Kashmiri communal celebration.',
    icon: '💃',
  },
  {
    id: 'herath-songs',
    youtubeId: '6mwY0IGUmsw',
    title: 'Herath Night Songs',
    kashmiri: 'हेरथ भजन',
    category: 'Wanwun & Henzae',
    deity: 'Shiva',
    occasion: 'Herath (KP Shivaratri)',
    about: 'On the holy night of Herath, families sing Shiva bhajans and traditional songs through the vigil, welcoming Shiva and Parvati (the Vatuk) into the home.',
    icon: '🌙',
  },

  // ── Kashmiri Folk & Song (recordings via Kashmir Heritage) ─────────────────
  {
    id: 'hukus-bukus',
    title: 'Hukus Bukus Telwan Tsukus',
    kashmiri: 'हुकुस बुकुस',
    category: 'Kashmiri Folk & Song',
    occasion: 'Childhood, cultural gatherings',
    about: 'A beloved Kashmiri rhyme with deep Shaiva-Vedantic undertones — often read as a meditation on the Self (“who am I?”). Cherished across generations of Kashmiris.',
    icon: '🪔',
    youtubeId: 'HNDe3A0mEYY',
  },
  {
    id: 'katyu-chuk-nund-bane',
    title: 'Katyu Chuk Nund Bane',
    kashmiri: 'कत्यु छुक नुंद बने',
    category: 'Kashmiri Folk & Song',
    occasion: 'Devotional / reflective listening',
    about: 'A devotional Kashmiri song in the spirit of the saint tradition of the valley, evoking longing for the divine.',
    icon: '🍃',
    youtubeId: '_rQvQyhYfgM',
  },
  {
    id: 'roshay-walla',
    title: 'Roshay Walla Myane Dilbaro',
    kashmiri: 'रोशे वला म्याने दिलबरो',
    category: 'Kashmiri Folk & Song',
    occasion: 'Folk gatherings, festive evenings',
    about: 'A melodious traditional Kashmiri folk song, part of the valley’s rich repertoire of love and longing.',
    icon: '🎶',
    youtubeId: 'jopVSKruqkc',
  },
  {
    id: 'gilas-kulnee-tal',
    title: 'Gilas Kulnee Tal',
    kashmiri: 'गिलास कुल्नी तल',
    category: 'Kashmiri Folk & Song',
    occasion: 'Folk gatherings',
    about: 'A classic Kashmiri folk number celebrating the imagery of the valley — orchards, streams and the chinar.',
    icon: '🌳',
    youtubeId: 'TJVop2GwA3c',
  },
  {
    id: 'khanmaej-koor',
    title: 'Khanmaej Koor',
    kashmiri: 'खनमज कूर',
    category: 'Kashmiri Folk & Song',
    occasion: 'Folk gatherings, weddings',
    about: 'A traditional Kashmiri folk song, often heard at celebrations and community gatherings.',
    icon: '🎵',
    youtubeId: 'QqwwK4td9K8',
  },
  {
    id: 'folk-medley',
    title: 'Kashmiri Folk Medley',
    kashmiri: 'कॉशुर लोक संगीत',
    category: 'Kashmiri Folk & Song',
    occasion: 'Listening, cultural programmes',
    about: 'A medley of traditional Kashmiri folk tunes — a lovely introduction to the sounds of the valley.',
    icon: '🪕',
    youtubeId: '3hhM0bv46t0',
  },
];
