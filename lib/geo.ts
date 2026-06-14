// Worldwide geocoding (via /api/geocode → Open-Meteo) + timezone-offset helper.

export interface GeoCity {
  name: string;
  region: string;   // "State, Country"
  lat: number;
  lng: number;
  timezone: string; // IANA, e.g. "Asia/Kolkata"
}

export async function geocode(query: string): Promise<GeoCity[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  try {
    const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    return (data?.results ?? []) as GeoCity[];
  } catch {
    return [];
  }
}

/**
 * UTC offset (in hours, e.g. 5.5, -5, 10) for an IANA timezone at a given date.
 * Uses the runtime's tz database, so it accounts for DST and historical rules
 * for the actual birth date.
 */
export function tzOffsetHours(timeZone: string, date: Date): number {
  try {
    const inTz = new Date(date.toLocaleString('en-US', { timeZone }));
    const inUtc = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    return Math.round(((inTz.getTime() - inUtc.getTime()) / 3600000) * 100) / 100;
  } catch {
    return 0;
  }
}
