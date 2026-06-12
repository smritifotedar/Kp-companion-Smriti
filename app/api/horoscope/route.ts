import { NextRequest, NextResponse } from 'next/server';

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const BASE = 'https://horoscope-app-api.vercel.app/api/v1/get-horoscope';

// Which periods the upstream API can actually serve.
function endpointFor(period: string, sign: string): string | null {
  switch (period) {
    case 'daily': return `${BASE}/daily?sign=${sign}&day=TODAY`;
    case 'weekly': return `${BASE}/weekly?sign=${sign}`;
    case 'monthly': return `${BASE}/monthly?sign=${sign}`;
    default: return null; // tomorrow / yesterday / yearly → not supported upstream
  }
}

export async function GET(request: NextRequest) {
  const period = request.nextUrl.searchParams.get('period') || 'daily';

  // Unsupported periods → tell the client to use its local fallback.
  if (!['daily', 'weekly', 'monthly'].includes(period)) {
    return NextResponse.json({ source: 'fallback', period, items: {} });
  }

  const fetchSign = async (sign: string): Promise<[string, { horoscope: string; date?: string } | null]> => {
    try {
      const url = endpointFor(period, sign)!;
      const res = await fetch(url, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(8000) });
      if (!res.ok) return [sign, null];
      const json = await res.json();
      const d = json?.data;
      if (!d?.horoscope) return [sign, null];
      return [sign, { horoscope: d.horoscope, date: d.date }];
    } catch {
      return [sign, null];
    }
  };

  const results = await Promise.all(SIGNS.map(fetchSign));
  const items: Record<string, { horoscope: string; date?: string }> = {};
  let okCount = 0;
  for (const [sign, val] of results) {
    if (val) { items[sign] = val; okCount++; }
  }

  return NextResponse.json({
    source: okCount > 0 ? 'api' : 'fallback',
    period,
    items,
  });
}
