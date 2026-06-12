'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAllHoroscopes, periodLabel, HORO_PERIODS, type HoroPeriod, type DailyHoroscope } from '@/lib/kp-horoscope';
import { Reveal } from '@/components/ui/Reveal';
import { Sparkles, Star } from 'lucide-react';

function HoroscopeInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawPeriod = searchParams.get('period');
  const period: HoroPeriod = (HORO_PERIODS.some((x) => x.id === rawPeriod) ? rawPeriod : 'daily') as HoroPeriod;

  const [now, setNow] = useState<Date | null>(null);
  const [apiText, setApiText] = useState<Record<string, string> | null>(null);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setNow(new Date()); }, []);

  // Fetch real horoscope text from the API for supported periods
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setApiText(null);
    setLive(false);
    fetch(`/api/horoscope?period=${period}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.source === 'api' && d.items) {
          const map: Record<string, string> = {};
          for (const [sign, v] of Object.entries(d.items as Record<string, { horoscope: string }>)) {
            map[sign] = v.horoscope;
          }
          setApiText(map);
          setLive(true);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [period]);

  const items: DailyHoroscope[] = useMemo(() => (now ? getAllHoroscopes(period, now) : []), [now, period]);
  const label = now ? periodLabel(period, now) : '';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="font-devanagari text-saffron-500 text-xl mb-2">राशिफल</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-earth-900 mb-3 flex items-center justify-center gap-2">
          <Sparkles className="text-saffron-500 animate-float" size={28} /> Horoscope
        </h1>
        <p className="text-earth-600 max-w-2xl mx-auto">
          Guidance for all twelve Rashis. {label && <span className="font-medium text-earth-700">{label}</span>}
        </p>
      </div>

      {/* Period tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-3">
        {HORO_PERIODS.map((p) => (
          <button
            key={p.id}
            onClick={() => router.push(`/horoscope?period=${p.id}`, { scroll: false })}
            className={`px-4 py-2 rounded-full text-sm font-ui font-medium transition-all duration-300 ease-premium ${
              period === p.id
                ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-premium scale-105'
                : 'bg-white border border-earth-200 text-earth-600 hover:border-saffron-300 hover:-translate-y-0.5 hover:shadow-sm'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="text-center mb-8">
        {live ? (
          <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-2xl px-4 py-2 text-xs text-green-800 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Live sun-sign horoscope · updated {period === 'daily' ? 'daily' : period === 'weekly' ? 'weekly' : 'monthly'}
          </span>
        ) : (
          <span className="inline-block glass-saffron border border-amber-200 rounded-2xl px-4 py-2 text-xs text-amber-900 shadow-sm">
            ✨ App-generated guidance for this view (live feed covers Today, Weekly &amp; Monthly). Not a substitute for a personalised jyotish reading.
          </span>
        )}
      </div>

      {/* Cards */}
      {!now ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-56 rounded-3xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((h, i) => (
            <Reveal
              key={`${period}-${h.rashi.index}`}
              delay={(i % 3) * 60}
              className="kp-card card-ring bg-white rounded-3xl border border-earth-100 shadow-premium overflow-hidden flex flex-col"
            >
              {/* Header band */}
              <div className="relative bg-gradient-to-br from-earth-900 to-[#5a2f17] text-white p-4 flex items-center gap-3 overflow-hidden">
                <div className="pointer-events-none absolute -top-8 -right-6 w-32 h-20 bg-saffron-500/25 blur-2xl" />
                <span className="relative w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-2xl leading-none">
                  {h.rashi.symbol}
                </span>
                <div className="relative">
                  <div className="font-display font-bold text-lg leading-tight">{h.rashi.name}</div>
                  <div className="text-saffron-200 text-xs">{h.rashi.english} · {h.rashi.dates}</div>
                </div>
                <span className="relative ml-auto text-[10px] uppercase tracking-wide bg-white/15 border border-white/20 rounded-full px-2 py-0.5">
                  {h.rashi.element}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-1">
                <p className="text-earth-700 text-sm leading-relaxed mb-4 flex-1">{apiText?.[h.rashi.english] ?? h.prediction}</p>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: h.luckyColor.hex }} />
                    <span className="text-earth-600">{h.luckyColor.name}</span>
                  </div>
                  <div className="text-earth-600">No. <strong className="text-earth-900">{h.luckyNumber}</strong></div>
                  <div className="text-earth-600">{h.mood}</div>
                </div>

                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-earth-100">
                  <span className="text-[10px] text-earth-400 uppercase tracking-wide mr-1">Energy</span>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={13} className={s < h.energy ? 'text-saffron-500 fill-saffron-500' : 'text-earth-200'} />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HoroscopePage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center text-earth-500">Loading horoscope…</div>}>
      <HoroscopeInner />
    </Suspense>
  );
}
