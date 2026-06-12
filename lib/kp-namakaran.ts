// Namakaran (naming) syllables by Janma Nakshatra.
// Traditionally, the first sound of a child's name is chosen from the syllable
// assigned to the Nakshatra pada (quarter) at birth. Index matches KP_NAKSHATRAS.

export const NAKSHATRA_SYLLABLES: string[][] = [
  ['Chu', 'Che', 'Cho', 'La'],     // 0  Ashwini
  ['Lee', 'Lu', 'Le', 'Lo'],       // 1  Bharani
  ['A', 'Ee', 'U', 'Ea'],          // 2  Krittika
  ['O', 'Va', 'Vi', 'Vu'],         // 3  Rohini
  ['Ve', 'Vo', 'Ka', 'Ki'],        // 4  Mrigashirsha
  ['Ku', 'Gha', 'Nga', 'Chha'],    // 5  Ardra
  ['Ke', 'Ko', 'Ha', 'Hi'],        // 6  Punarvasu
  ['Hu', 'He', 'Ho', 'Da'],        // 7  Pushya
  ['Dee', 'Doo', 'De', 'Do'],      // 8  Ashlesha
  ['Ma', 'Mee', 'Mu', 'Me'],       // 9  Magha
  ['Mo', 'Ta', 'Ti', 'Tu'],        // 10 Purva Phalguni
  ['Te', 'To', 'Pa', 'Pi'],        // 11 Uttara Phalguni
  ['Pu', 'Sha', 'Na', 'Tha'],      // 12 Hasta
  ['Pe', 'Po', 'Ra', 'Ri'],        // 13 Chitra
  ['Ru', 'Re', 'Ro', 'Ta'],        // 14 Swati
  ['Ti', 'Tu', 'Te', 'To'],        // 15 Vishakha
  ['Na', 'Ni', 'Nu', 'Ne'],        // 16 Anuradha
  ['No', 'Ya', 'Yi', 'Yu'],        // 17 Jyeshtha
  ['Ye', 'Yo', 'Bha', 'Bhi'],      // 18 Mula
  ['Bhu', 'Dha', 'Pha', 'Dha'],    // 19 Purva Ashadha
  ['Bhe', 'Bho', 'Ja', 'Ji'],      // 20 Uttara Ashadha
  ['Ju', 'Je', 'Jo', 'Gha'],       // 21 Shravana
  ['Ga', 'Gi', 'Gu', 'Ge'],        // 22 Dhanishtha
  ['Go', 'Sa', 'Si', 'Su'],        // 23 Shatabhisha
  ['Se', 'So', 'Da', 'Di'],        // 24 Purva Bhadrapada
  ['Du', 'Tha', 'Jha', 'Tra'],     // 25 Uttara Bhadrapada
  ['De', 'Do', 'Cha', 'Chi'],      // 26 Revati
];

export function getNamakaran(nakshatraIndex: number, pada: number) {
  const all = NAKSHATRA_SYLLABLES[nakshatraIndex] ?? [];
  return {
    syllable: all[pada - 1] ?? null,
    all,
  };
}
