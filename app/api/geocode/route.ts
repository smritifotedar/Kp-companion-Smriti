import { NextRequest, NextResponse } from 'next/server';

// Kashmir-valley fallback (Open-Meteo misses some KP-town spellings). IANA: Asia/Kolkata.
const KASHMIR_FALLBACK = [
  { name: 'Srinagar', lat: 34.0837, lng: 74.7973 }, { name: 'Anantnag', lat: 33.7311, lng: 75.1487 },
  { name: 'Baramulla', lat: 34.1980, lng: 74.3636 }, { name: 'Sopore', lat: 34.2870, lng: 74.4730 },
  { name: 'Pulwama', lat: 33.8742, lng: 74.8997 }, { name: 'Kupwara', lat: 34.5311, lng: 74.2546 },
  { name: 'Pampore', lat: 34.0151, lng: 74.9189 }, { name: 'Pahalgam', lat: 34.0161, lng: 75.3150 },
  { name: 'Ganderbal', lat: 34.2268, lng: 74.7752 }, { name: 'Budgam', lat: 34.0143, lng: 74.7197 },
  { name: 'Kulgam', lat: 33.6446, lng: 75.0193 }, { name: 'Shopian', lat: 33.7160, lng: 74.8350 },
  { name: 'Bandipora', lat: 34.4197, lng: 74.6470 }, { name: 'Handwara', lat: 34.4001, lng: 74.2819 },
  { name: 'Jammu', lat: 32.7266, lng: 74.8570 }, { name: 'Udhampur', lat: 32.9160, lng: 75.1416 },
];

// Proxy to Open-Meteo's free geocoding API (no key required). Lets users search
// any city/town worldwide and returns coordinates + IANA timezone for the Lagna.
export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get('q') || '').trim();
  if (q.length < 2) return NextResponse.json({ results: [] });

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=en&format=json`;
    const res = await fetch(url, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return NextResponse.json({ results: [] });
    const data = await res.json();
    const results = (data?.results ?? []).map((r: {
      name: string; admin1?: string; country?: string; latitude: number; longitude: number; timezone: string;
    }) => ({
      name: r.name,
      region: [r.admin1, r.country].filter(Boolean).join(', '),
      lat: r.latitude,
      lng: r.longitude,
      timezone: r.timezone,
    }));

    // Add any matching Kashmir-fallback towns not already returned
    const ql = q.toLowerCase();
    const have = new Set(results.map((r: { name: string }) => r.name.toLowerCase()));
    for (const f of KASHMIR_FALLBACK) {
      if (f.name.toLowerCase().includes(ql) && !have.has(f.name.toLowerCase())) {
        results.unshift({ name: f.name, region: 'Jammu and Kashmir, India', lat: f.lat, lng: f.lng, timezone: 'Asia/Kolkata' });
      }
    }
    return NextResponse.json({ results: results.slice(0, 10) });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
