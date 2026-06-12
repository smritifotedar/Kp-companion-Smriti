'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { loadMyDays, removeMyDay, resolveNextDate, type SavedDay } from '@/lib/my-days';
import { downloadICS } from '@/lib/ics';
import { CalendarPlus, Trash2, CalendarHeart, Star, Cake } from 'lucide-react';

interface Resolved extends SavedDay {
  date: Date | null;
  days: number | null;
}

function daysUntil(d: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

export default function MyDaysPage() {
  const [items, setItems] = useState<Resolved[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    const resolved = loadMyDays()
      .map((it) => {
        const date = resolveNextDate(it);
        return { ...it, date, days: date ? daysUntil(date) : null };
      })
      .sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return a.date.getTime() - b.date.getTime();
      });
    setItems(resolved);
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener('my-days-changed', refresh);
    return () => window.removeEventListener('my-days-changed', refresh);
  }, [refresh]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <div className="font-devanagari text-saffron-500 text-xl mb-2">मेरे दिन</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-earth-900 mb-3">My Days</h1>
        <p className="text-earth-600 max-w-xl mx-auto">
          Your saved festivals and Janma Tithis, with live countdowns. Saved on this device — add reminders to
          your calendar with one tap.
        </p>
      </div>

      {!ready ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-earth-100 shadow-premium p-10 text-center">
          <CalendarHeart size={40} className="mx-auto text-saffron-400 mb-3" />
          <h2 className="font-display font-bold text-earth-900 text-lg mb-2">No saved days yet</h2>
          <p className="text-earth-600 text-sm mb-5 max-w-md mx-auto">
            Tap <strong>Save</strong> on any festival in the Panchang or Festivals pages, or save a Janma Tithi,
            and it will appear here with a countdown.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/kp-calendar" className="btn-primary px-5 py-2.5 text-sm">Open Panchang</Link>
            <Link href="/janma-tithi" className="px-5 py-2.5 text-sm font-semibold rounded-full border-2 border-saffron-300 text-saffron-700 hover:bg-saffron-50 transition-colors">
              Janma Tithi
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <div
              key={it.id}
              className="bg-white rounded-2xl border border-earth-100 shadow-premium p-4 flex items-center gap-4 transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-premium-lg"
            >
              {/* Countdown badge */}
              <div className="flex-shrink-0 w-16 text-center">
                {it.days === null ? (
                  <span className="text-xs text-earth-400">—</span>
                ) : it.days === 0 ? (
                  <span className="font-display font-bold text-saffron-600 text-sm">Today</span>
                ) : (
                  <>
                    <div className="font-display font-bold text-saffron-600 text-2xl leading-none tabular-nums">{it.days}</div>
                    <div className="text-[10px] text-earth-400 uppercase tracking-wide">{it.days === 1 ? 'day' : 'days'}</div>
                  </>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  {it.kind === 'janma' ? <Cake size={14} className="text-rose-500 flex-shrink-0" /> : <Star size={14} className="text-saffron-500 flex-shrink-0" />}
                  <span className="font-display font-semibold text-earth-900 truncate">{it.title}</span>
                </div>
                {it.kashmiri && <div className="font-devanagari text-saffron-600 text-sm">{it.kashmiri}</div>}
                <div className="text-xs text-earth-500">
                  {it.date
                    ? it.date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                    : 'Date unavailable'}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
                {it.date && (
                  <button
                    onClick={() => downloadICS({ title: it.title, description: it.kashmiri || '', date: it.date! })}
                    className="inline-flex items-center gap-1 text-xs font-ui font-medium text-saffron-700 hover:text-saffron-900 bg-saffron-50 border border-saffron-100 rounded-full px-2.5 py-1.5 transition-colors"
                    title="Add to calendar"
                  >
                    <CalendarPlus size={13} /> <span className="hidden sm:inline">Calendar</span>
                  </button>
                )}
                <button
                  onClick={() => { removeMyDay(it.id); setItems((prev) => prev.filter((x) => x.id !== it.id)); }}
                  className="p-1.5 rounded-full text-earth-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Remove"
                  aria-label={`Remove ${it.title}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
