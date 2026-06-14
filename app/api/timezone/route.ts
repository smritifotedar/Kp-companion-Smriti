import { NextRequest, NextResponse } from 'next/server';

// Resolve the precise IANA timezone for any coordinate via Open-Meteo's timezone=auto.
// Used when a selected city's timezone isn't already known (i.e. outside India), so the
// Lagna (ascendant) uses a DST-correct UTC offset for the birth date.
export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get('lat');
  const lng = request.nextUrl.searchParams.get('lng');
  if (!lat || !lng) return NextResponse.json({ timezone: '' });

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lng)}&timezone=auto&forecast_days=1`;
    const res = await fetch(url, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(6000) });
    if (!res.ok) return NextResponse.json({ timezone: '' });
    const data = await res.json();
    return NextResponse.json({ timezone: data?.timezone || '' });
  } catch {
    return NextResponse.json({ timezone: '' });
  }
}
