import { NextRequest, NextResponse } from 'next/server';

// Worldwide city/town search. We query TWO free, no-key geocoders in parallel and
// merge the results:
//   • Open-Meteo geocoding — clean, population-ranked big cities, WITH an IANA timezone.
//   • Photon (Komoot, OpenStreetMap) — comprehensive + typo-tolerant coverage of small
//     towns and villages (e.g. "Mahendergarh" still finds Mahendragarh, Haryana).
// Indian places get Asia/Kolkata immediately; anywhere else the precise IANA timezone is
// resolved on selection via /api/timezone (Open-Meteo timezone=auto).

interface Cand { name: string; region: string; lat: number; lng: number; timezone: string; rank: number; india: boolean; pop: number }

// How strongly a result looks like a real settlement (higher = better). 0 = not a settlement.
const PLACE_RANK: Record<string, number> = {
  city: 5, town: 4, municipality: 4, village: 3, hamlet: 3,
  suburb: 2, locality: 2, borough: 2, quarter: 2, neighbourhood: 2,
  county: 1, district: 1, state: 1, region: 1, province: 1,
};

// Rank an Open-Meteo result by its GeoNames feature_code (PPLC=capital, PPLA=state
// seat, PPLA2/3=district seats, PPL=generic place; AIRP/PRK/MTS… aren't settlements).
function omRank(fc?: string): number {
  if (!fc) return 4;
  if (fc === 'PPLC' || fc === 'PPLA') return 6;
  if (fc === 'PPLA2' || fc === 'PPLA3') return 5;
  if (fc === 'PPLA4' || fc === 'PPL') return 4;
  if (fc.startsWith('PPL')) return 3;     // PPLX/PPLL/PPLS — sections/localities
  if (fc.startsWith('ADM')) return 1;     // admin divisions
  return 0;                                // AIRP, PRK, MTS, RSTN, … — drop
}

// Kashmir-valley offline fallback (always available, even if both APIs are down).
const KASHMIR_FALLBACK: { name: string; lat: number; lng: number }[] = [
  { name: 'Srinagar', lat: 34.0837, lng: 74.7973 }, { name: 'Anantnag', lat: 33.7311, lng: 75.1487 },
  { name: 'Baramulla', lat: 34.1980, lng: 74.3636 }, { name: 'Sopore', lat: 34.2870, lng: 74.4730 },
  { name: 'Pulwama', lat: 33.8742, lng: 74.8997 }, { name: 'Kupwara', lat: 34.5311, lng: 74.2546 },
  { name: 'Pampore', lat: 34.0151, lng: 74.9189 }, { name: 'Pahalgam', lat: 34.0161, lng: 75.3150 },
  { name: 'Ganderbal', lat: 34.2268, lng: 74.7752 }, { name: 'Budgam', lat: 34.0143, lng: 74.7197 },
  { name: 'Kulgam', lat: 33.6446, lng: 75.0193 }, { name: 'Shopian', lat: 33.7160, lng: 74.8350 },
  { name: 'Bandipora', lat: 34.4197, lng: 74.6470 }, { name: 'Handwara', lat: 34.4001, lng: 74.2819 },
  { name: 'Jammu', lat: 32.7266, lng: 74.8570 }, { name: 'Udhampur', lat: 32.9160, lng: 75.1416 },
];

const PLACE_VALUES = new Set([
  'city', 'town', 'village', 'hamlet', 'suburb', 'municipality', 'locality',
  'borough', 'quarter', 'neighbourhood', 'county', 'district', 'state', 'region', 'province',
]);

async function fromOpenMeteo(q: string): Promise<Cand[]> {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=10&language=en&format=json`;
    const res = await fetch(url, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(6000) });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.results ?? [])
      .map((r: {
        name: string; admin1?: string; country?: string; latitude: number; longitude: number;
        timezone?: string; feature_code?: string; population?: number;
      }) => ({
        name: r.name,
        region: [r.admin1, r.country].filter(Boolean).join(', '),
        lat: r.latitude,
        lng: r.longitude,
        timezone: r.timezone || '',
        rank: omRank(r.feature_code),
        india: r.country === 'India',
        pop: r.population || 0,
      }))
      .filter((c: Cand) => c.rank > 0);            // drop airports/parks/mountains
  } catch { return []; }
}

async function fromPhoton(q: string): Promise<Cand[]> {
  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=12&lang=en`;
    const res = await fetch(url, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(6000) });
    if (!res.ok) return [];
    const data = await res.json();
    const out: Cand[] = [];
    for (const f of (data?.features ?? [])) {
      const p = f.properties ?? {};
      const coords = f.geometry?.coordinates ?? [];
      const lng = coords[0], lat = coords[1];
      if (typeof lat !== 'number' || typeof lng !== 'number') continue;

      let name = '';
      let rank = 0;
      if (p.osm_key === 'place' && PLACE_VALUES.has(p.osm_value)) { name = p.name; rank = PLACE_RANK[p.osm_value] ?? 1; }
      else if (p.osm_key === 'boundary' && p.osm_value === 'administrative') { name = p.name; rank = 2; }
      else if (p.city) { name = p.city; rank = 0; }   // POI (hospital, station…) → use its town, low rank
      else continue;                                   // skip nameless / non-settlement features
      if (!name) continue;

      const cc = (p.countrycode || '').toLowerCase();
      // Region = "State, Country". Avoid a self-referential "Town, Town" label.
      const stateLabel = p.state || (p.county && p.county !== name ? p.county : '');
      const region = [stateLabel, p.country].filter(Boolean).join(', ');
      out.push({ name, region, lat, lng, timezone: cc === 'in' ? 'Asia/Kolkata' : '', rank, india: cc === 'in', pop: 0 });
    }
    return out;
  } catch { return []; }
}

const countryOf = (region: string) => (region.split(',').pop() || '').trim().toLowerCase();
// Full key (name + full region) keeps same-name towns in different states distinct.
const keyOf = (c: Cand) => `${c.name}|${c.region}`.toLowerCase().replace(/\s+/g, '');
const hasState = (c: Cand) => c.region.includes(',');           // "State, Country" vs just "Country"
const nameCountry = (c: Cand) => `${c.name}|${countryOf(c.region)}`.toLowerCase().replace(/\s+/g, '');
// When two sources describe the same place, keep the better description:
// higher settlement rank, then one with a timezone, then the richer region label.
const better = (a: Cand, b: Cand) => {
  if (a.rank !== b.rank) return a.rank > b.rank ? a : b;
  if (!!a.timezone !== !!b.timezone) return a.timezone ? a : b;
  return b.region.length > a.region.length ? b : a;
};

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get('q') || '').trim();
  if (q.length < 2) return NextResponse.json({ results: [] });

  const [om, ph] = await Promise.all([fromOpenMeteo(q), fromPhoton(q)]);

  const ql = q.toLowerCase();
  const fallback: Cand[] = KASHMIR_FALLBACK
    .filter((f) => f.name.toLowerCase().includes(ql))
    .map((f) => ({ name: f.name, region: 'Jammu and Kashmir, India', lat: f.lat, lng: f.lng, timezone: 'Asia/Kolkata', rank: 4, india: true, pop: 0 }));

  // Merge keeping first-seen order (Open-Meteo big cities first, then Photon long-tail),
  // upgrading an entry if a later source has a timezone / richer region.
  const map = new Map<string, Cand>();
  for (const c of [...om, ...ph, ...fallback]) {
    const k = keyOf(c);
    const existing = map.get(k);
    map.set(k, existing ? better(existing, c) : c);
  }

  // Drop region-less duplicates (e.g. "Mahendragarh, India") when a richer same
  // name+country entry exists (e.g. "Mahendragarh, Haryana, India").
  let list = Array.from(map.values());
  const richNC = new Set(list.filter(hasState).map(nameCountry));
  list = list.filter((c) => hasState(c) || !richNC.has(nameCountry(c)));

  // Prefer real settlements; only fall back to POI-derived (rank 0) entries if nothing else.
  const settlements = list.filter((c) => c.rank > 0);
  const ranked = settlements.length ? settlements : list;

  // Score (higher = first):
  //  • exact name match (diacritic-insensitive) — "Mattan" beats "Mattanur", "New York" beats "York"
  //  • Indian settlements (village/town/city) — this app's audience: Kochi, Kerala over Kochi, Japan
  //  • higher settlement type, then larger population
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  const nq = norm(q);
  const score = (c: Cand) => c.rank + (c.india && c.rank >= 3 ? 10 : 0) + (norm(c.name) === nq ? 5 : 0);
  ranked.sort((a, b) => (score(b) - score(a)) || (b.pop - a.pop));

  const results = ranked.slice(0, 10).map(({ name, region, lat, lng, timezone }) => ({ name, region, lat, lng, timezone }));
  return NextResponse.json({ results });
}
