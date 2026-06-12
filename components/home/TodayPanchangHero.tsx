'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  computeDayPanchang,
  getSunTimes,
  getUpcomingFestivals,
  getPakshaGradient,
  KP_LOCATIONS,
  type DayPanchang,
  type SunTimes,
  type UpcomingFestival,
} from '@/lib/kp-calendar';
import { Sunrise, Sunset, Moon, Star, CalendarDays, ArrowRight, CalendarPlus } from 'lucide-react';
import { downloadICS } from '@/lib/ics';
import { SaveDayButton } from '@/components/ui/SaveDayButton';

interface Countdown { days: number; hours: number; mins: number }

function diffToCountdown(target: Date): Countdown {
  const ms = target.getTime() - Date.now();
  const clamped = Math.max(0, ms);
  const days = Math.floor(clamped / 86400000);
  const hours = Math.floor((clamped % 86400000) / 3600000);
  const mins = Math.floor((clamped % 3600000) / 60000);
  return { days, hours, mins };
}

export function TodayPanchangHero() {
  const [data, setData] = useState<{
    p: DayPanchang;
    sun: SunTimes;
    next: UpcomingFestival | null;
  } | null>(null);
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  // Compute on the client to use the visitor's "today" and avoid hydration drift
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const srinagar = KP_LOCATIONS[0];
    const p = computeDayPanchang(today);
    const sun = getSunTimes(today, srinagar.lat, srinagar.lng, srinagar.tz, srinagar.sunZenith, srinagar.sunsetZenith);
    const upcoming = getUpcomingFestivals(today, 13, ['major']);
    const next = upcoming[0] ?? null;
    setData({ p, sun, next });
  }, []);

  // Tick the countdown each minute
  useEffect(() => {
    if (!data?.next) return;
    const update = () => setCountdown(diffToCountdown(data.next!.date));
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [data]);

  // Skeleton while computing (also the SSR output → no hydration mismatch)
  if (!data) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="glass rounded-3xl border border-saffron-200 shadow-premium-lg p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="skeleton h-4 w-40" />
            <div className="skeleton h-8 w-56" />
            <div className="skeleton h-4 w-64" />
          </div>
          <div className="space-y-3">
            <div className="skeleton h-4 w-40" />
            <div className="skeleton h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const { p, sun, next } = data;
  const todayLabel = p.date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
      <div className="glass rounded-3xl border border-saffron-200 shadow-premium-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Today's panchang */}
        <div className="p-6 sm:p-7">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-ui font-semibold text-saffron-700 uppercase tracking-[0.14em]">
              Today&apos;s Panchang
            </span>
            <span className="text-xs text-earth-500">{todayLabel}</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl leading-none">{getPakshaGradient(p.elongation)}</span>
            <div>
              <div className="font-display font-bold text-earth-900 text-xl leading-tight">
                {p.tithiName}
              </div>
              <div className="text-earth-500 text-sm">
                {p.pakshaLabel} Paksha · {p.kpMonthName} ({p.kpMonthKashmiri}) · Samvat {p.samvatYear}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { icon: <Star size={14} className="text-kashmir-500" />, label: 'Nakshatra', value: p.nakshatra },
              { icon: <Moon size={14} className="text-saffron-500" />, label: 'Yoga', value: p.yoga },
              { icon: <Sunrise size={14} className="text-amber-500" />, label: 'Sunrise', value: sun.sunrise ?? '—' },
              { icon: <Sunset size={14} className="text-orange-500" />, label: 'Sunset', value: sun.sunset ?? '—' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/70 border border-saffron-100 px-2.5 py-2">
                <div className="flex items-center gap-1 text-[10px] text-earth-500 uppercase tracking-wide">
                  {s.icon} {s.label}
                </div>
                <div className="font-semibold text-earth-900 text-sm leading-tight truncate">{s.value}</div>
              </div>
            ))}
          </div>

          <Link
            href="/kp-calendar"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-ui font-medium text-saffron-700 hover:text-saffron-800 group"
          >
            <CalendarDays size={15} />
            Open full Panchang
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="text-[10px] text-earth-400 mt-1">Sun timings for Srinagar (KP reference)</div>
        </div>

        {/* Next festival countdown */}
        <div className="relative p-6 sm:p-7 bg-gradient-to-br from-earth-900 to-[#5a2f17] text-white overflow-hidden">
          <div className="pointer-events-none absolute -top-12 -right-8 w-48 h-32 bg-saffron-500/20 blur-3xl" />
          <div className="relative">
            <span className="text-xs font-ui font-semibold text-saffron-300 uppercase tracking-[0.14em]">
              Next KP Festival
            </span>

            {next && countdown ? (
              <>
                <div className="mt-2 font-display font-bold text-2xl text-white leading-tight">
                  {next.event.name.split('—')[0].trim()}
                </div>
                <div className="font-devanagari text-saffron-300 text-sm">{next.event.kashmiri}</div>
                <div className="text-earth-300 text-xs mt-1">
                  {next.date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>

                <div className="flex gap-2 mt-4">
                  {[
                    { v: countdown.days, l: 'Days' },
                    { v: countdown.hours, l: 'Hours' },
                    { v: countdown.mins, l: 'Min' },
                  ].map((u) => (
                    <div key={u.l} className="flex-1 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm py-2.5 text-center">
                      <div className="font-display font-bold text-2xl text-saffron-200 tabular-nums">
                        {String(u.v).padStart(2, '0')}
                      </div>
                      <div className="text-[10px] text-earth-300 uppercase tracking-wide">{u.l}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() =>
                      downloadICS({
                        title: next.event.name.split('—')[0].trim(),
                        description: `${next.event.kashmiri} — ${next.event.description}`,
                        date: next.date,
                      })
                    }
                    className="inline-flex items-center gap-1.5 text-sm font-ui font-medium text-white bg-white/15 border border-white/20 rounded-full px-3.5 py-1.5 hover:bg-white/25 transition-colors"
                  >
                    <CalendarPlus size={15} /> Add to Calendar
                  </button>
                  <SaveDayButton
                    variant="dark"
                    item={{
                      id: `festival-${next.event.id}`,
                      kind: 'festival',
                      title: next.event.name.split('—')[0].trim(),
                      kashmiri: next.event.kashmiri,
                      eventId: next.event.id,
                    }}
                  />
                  <Link
                    href="/festivals"
                    className="inline-flex items-center gap-1.5 text-sm font-ui font-medium text-saffron-300 hover:text-saffron-200 group"
                  >
                    View all festivals
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="mt-3 text-earth-300 text-sm">No major festival found in the coming year.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
