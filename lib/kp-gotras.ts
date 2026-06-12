// Kashmiri Pandit Gotra reference data
//
// A gotra is a patrilineal lineage tracing descent from an ancient Rishi (sage).
// The "pravara" is the set of ancestral Rishis invoked during rituals — it refines
// the lineage within a gotra. Traditional rule: marriage within the same gotra
// (sagotra) is not permitted, as the partners are considered of one lineage.
//
// NOTE: Associations below reflect widely-held traditional accounts. A family's
// exact gotra and pravara come from family records (kuldevta/purohit tradition),
// not from surname. Always verify with your family priest.

export interface Gotra {
  id: string;
  name: string;
  rishi: string;        // founding sage
  lineage: string;      // broader Rishi family / origin
  pravara: string[];    // ancestral Rishis invoked (where traditionally recorded)
  meaning: string;      // short description
  saptarishiFounder: boolean; // founder is one of the classic gotra-kāra Rishis
}

export const KP_GOTRA_DATA: Gotra[] = [
  {
    id: 'bharadwaja', name: 'Bharadwaja',
    rishi: 'Maharishi Bharadwaja', lineage: 'Angirasa',
    pravara: ['Angirasa', 'Bārhaspatya', 'Bhāradvāja'],
    meaning: 'Descendants of the sage Bharadwaja, son of Brihaspati. One of the most widespread gotras, associated with learning and the Vedas.',
    saptarishiFounder: true,
  },
  {
    id: 'kashyapa', name: 'Kashyapa',
    rishi: 'Maharishi Kashyapa', lineage: 'Kashyapa',
    pravara: ['Kāśyapa', 'Āvatsāra', 'Naidhruva'],
    meaning: 'Descendants of Kashyapa, son of Marichi and a progenitor of many beings in Puranic tradition.',
    saptarishiFounder: true,
  },
  {
    id: 'vatsa', name: 'Vatsa',
    rishi: 'Rishi Vatsa', lineage: 'Bhrigu (Bhārgava)',
    pravara: ['Bhārgava', 'Chyāvana', 'Āpnavāna', 'Aurva', 'Jāmadagnya'],
    meaning: 'A Bhrigu-line gotra descending through the sage Vatsa; shares its pravara with the Jamadagni lineage.',
    saptarishiFounder: false,
  },
  {
    id: 'atri', name: 'Atri',
    rishi: 'Maharishi Atri', lineage: 'Atreya',
    pravara: ['Ātreya', 'Ārchanānasa', 'Śyāvāśva'],
    meaning: 'Descendants of Atri, one of the Saptarishis and a seer of several Rigvedic hymns; husband of Anasuya.',
    saptarishiFounder: true,
  },
  {
    id: 'vishwamitra', name: 'Vishwamitra',
    rishi: 'Maharishi Vishwamitra', lineage: 'Kaushika',
    pravara: ['Vaiśvāmitra', 'Aghamarṣaṇa', 'Kauśika'],
    meaning: 'Descendants of Vishwamitra, the royal sage (Brahmarishi) who composed the Gayatri Mantra.',
    saptarishiFounder: true,
  },
  {
    id: 'jamadagni', name: 'Jamadagni',
    rishi: 'Maharishi Jamadagni', lineage: 'Bhrigu (Bhārgava)',
    pravara: ['Bhārgava', 'Chyāvana', 'Āpnavāna', 'Aurva', 'Jāmadagnya'],
    meaning: 'Descendants of Jamadagni, a Saptarishi and father of Parashurama, of the Bhrigu line.',
    saptarishiFounder: true,
  },
  {
    id: 'vasishtha', name: 'Vasishtha',
    rishi: 'Maharishi Vasishtha', lineage: 'Vāsishtha',
    pravara: ['Vāsishtha', 'Indrapramada', 'Ābharadvasavya'],
    meaning: 'Descendants of Vasishtha, a Saptarishi and the preceptor (rajaguru) of the Ikshvaku kings.',
    saptarishiFounder: true,
  },
  {
    id: 'gautama', name: 'Gautama',
    rishi: 'Maharishi Gautama', lineage: 'Angirasa',
    pravara: ['Āngirasa', 'Āyāsya', 'Gautama'],
    meaning: 'Descendants of Gautama of the Angirasa line; husband of Ahalya and associated with the Nyaya tradition.',
    saptarishiFounder: true,
  },
  {
    id: 'angirasa', name: 'Angirasa',
    rishi: 'Maharishi Angiras', lineage: 'Angirasa',
    pravara: ['Āngirasa', 'Āmbarīṣa', 'Yauvanāśva'],
    meaning: 'Descendants of Angiras, a Saptarishi and Prajapati; root of many derived gotras including Bharadwaja and Gautama.',
    saptarishiFounder: true,
  },
  {
    id: 'agastya', name: 'Agastya',
    rishi: 'Maharishi Agastya', lineage: 'Agastya',
    pravara: ['Āgastya', 'Dārḍhachyuta', 'Aidhmavāha'],
    meaning: 'Descendants of Agastya, the revered sage who is said to have spread Vedic culture to the south.',
    saptarishiFounder: true,
  },
  {
    id: 'shandilya', name: 'Shandilya',
    rishi: 'Rishi Shandilya', lineage: 'Kashyapa',
    pravara: ['Kāśyapa', 'Āvatsāra', 'Śāṇḍilya'],
    meaning: 'A Kashyapa-line gotra named after the sage Shandilya, noted for the Shandilya Bhakti Sutras.',
    saptarishiFounder: false,
  },
  {
    id: 'gargya', name: 'Gargya',
    rishi: 'Rishi Garga', lineage: 'Angirasa (Bhāradvāja)',
    pravara: ['Āngirasa', 'Bārhaspatya', 'Bhāradvāja', 'Śaiṅya', 'Gārgya'],
    meaning: 'Descendants of the sage Garga, an early astronomer-seer, of the Angirasa-Bharadwaja line.',
    saptarishiFounder: false,
  },
  {
    id: 'kaushika', name: 'Kaushika',
    rishi: 'Rishi Kaushika', lineage: 'Vishwamitra',
    pravara: ['Vaiśvāmitra', 'Aghamarṣaṇa', 'Kauśika'],
    meaning: 'A branch of the Vishwamitra lineage; "Kaushika" is also an epithet of Vishwamitra himself.',
    saptarishiFounder: false,
  },
  {
    id: 'moudgalya', name: 'Moudgalya',
    rishi: 'Rishi Mudgala', lineage: 'Angirasa',
    pravara: ['Āngirasa', 'Bhārmyaśva', 'Maudgalya'],
    meaning: 'Descendants of the sage Mudgala of the Angirasa line; associated with the Mudgala Purana.',
    saptarishiFounder: false,
  },
  {
    id: 'dhananjaya', name: 'Dhananjaya',
    rishi: 'Rishi Dhananjaya', lineage: 'Vishwamitra',
    pravara: ['Vaiśvāmitra', 'Mādhuchhandasa', 'Dhānañjaya'],
    meaning: 'A Vishwamitra-line gotra descending through the sage Dhananjaya.',
    saptarishiFounder: false,
  },
  {
    id: 'koundinya', name: 'Koundinya',
    rishi: 'Rishi Kaundinya', lineage: 'Vāsishtha',
    pravara: ['Vāsishtha', 'Maitrāvaruṇa', 'Kauṇḍinya'],
    meaning: 'Descendants of Kaundinya of the Vasishtha line; a widely recorded gotra across many communities.',
    saptarishiFounder: false,
  },
  {
    id: 'parashara', name: 'Parashara',
    rishi: 'Rishi Parashara', lineage: 'Vāsishtha',
    pravara: ['Vāsishtha', 'Śāktya', 'Pārāśarya'],
    meaning: 'Descendants of Parashara, grandson of Vasishtha and father of Veda Vyasa; author of the Parashara Smriti.',
    saptarishiFounder: false,
  },
  {
    id: 'shaunaka', name: 'Shaunaka',
    rishi: 'Rishi Shaunaka', lineage: 'Bhrigu / Gritsamada',
    pravara: ['Gārtsamada', 'Śaunahotra', 'Śaunaka'],
    meaning: 'Descendants of Shaunaka, compiler of Vedic indices (Anukramani) and head of a great gurukula.',
    saptarishiFounder: false,
  },
  {
    id: 'upamanyu', name: 'Upamanyu',
    rishi: 'Rishi Upamanyu', lineage: 'Vāsishtha',
    pravara: ['Vāsishtha', 'Aindrapramada', 'Aupamanyava'],
    meaning: 'A Vasishtha-line gotra named after the devoted sage Upamanyu, celebrated for his devotion to Shiva.',
    saptarishiFounder: false,
  },
  {
    id: 'laugakshi', name: 'Laugakshi',
    rishi: 'Rishi Laugakshi', lineage: 'Kāṭhaka tradition',
    pravara: ['Āngirasa', 'Laugākṣi'],
    meaning: 'A gotra closely associated with Kashmiri Pandits, linked to the Laugakshi sage and the Kathaka (Katha) school of the Yajurveda followed in Kashmir.',
    saptarishiFounder: false,
  },
];

export type SagotraVerdict = 'prohibited' | 'caution' | 'allowed';

export interface SagotraResult {
  verdict: SagotraVerdict;
  title: string;
  detail: string;
  sharedPravara: string[];
}

/** Traditional sagotra marriage compatibility check between two gotras. */
export function checkSagotra(gotraIdA: string, gotraIdB: string): SagotraResult {
  const a = KP_GOTRA_DATA.find(g => g.id === gotraIdA);
  const b = KP_GOTRA_DATA.find(g => g.id === gotraIdB);

  if (!a || !b) {
    return { verdict: 'allowed', title: 'Select both gotras', detail: 'Choose a gotra for each person to check compatibility.', sharedPravara: [] };
  }

  if (a.id === b.id) {
    return {
      verdict: 'prohibited',
      title: 'Same Gotra (Sagotra) — not traditionally permitted',
      detail: `Both belong to the ${a.name} gotra. In Kashmiri Pandit tradition, partners of the same gotra are considered of one lineage (descendants of ${a.rishi}), so marriage is traditionally avoided.`,
      sharedPravara: [],
    };
  }

  // Different gotra — check for shared pravara Rishis (a stricter consideration)
  const shared = a.pravara.filter(p => b.pravara.includes(p));
  if (shared.length > 0) {
    return {
      verdict: 'caution',
      title: 'Different gotras, but shared pravara — consult a priest',
      detail: `${a.name} and ${b.name} are different gotras, so the basic sagotra rule is satisfied. However, they share pravara Rishi(s), which some traditions also consider. A purohit should confirm based on your full pravara and family records.`,
      sharedPravara: shared,
    };
  }

  return {
    verdict: 'allowed',
    title: 'Different gotras — traditionally permitted',
    detail: `${a.name} (lineage of ${a.rishi}) and ${b.name} (lineage of ${b.rishi}) are distinct gotras with no shared pravara, so marriage is traditionally permitted. Families should still observe sapinda rules (paternal & maternal lineage) and consult their family priest.`,
    sharedPravara: [],
  };
}
