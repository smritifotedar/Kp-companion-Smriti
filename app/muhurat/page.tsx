'use client';

import { useState } from 'react';
import { MUHURTA_ACTIVITIES, findMuhurtaRange, type MuhurtaDay, type CheckStatus } from '@/lib/kp-muhurta';
import { Reveal } from '@/components/ui/Reveal';
import { Check, X, Minus, Clock, AlertTriangle } from 'lucide-react';

function parseLocalDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function formatDate(d: Date): string {
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS_ICON: Record<CheckStatus, React.ReactNode> = {
  good: <Check size={13} className="text-green-600" />,
  bad: <X size={13} className="text-red-500" />,
  neutral: <Minus size={13} className="text-earth-400" />,
};
const STATUS_TEXT: Record<CheckStatus, string> = {
  good: 'text-green-800',
  bad: 'text-red-700',
  neutral: 'text-earth-600',
};

function ratingStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`muhurat-star ${i < rating ? 'filled' : ''}`}>★</span>
  ));
}

const VERDICT_STYLE = (rating: number) =>
  rating >= 4 ? 'bg-green-50 border-green-200 text-green-800'
  : rating === 3 ? 'bg-amber-50 border-amber-200 text-amber-800'
  : 'bg-red-50 border-red-200 text-red-800';

export default function MuhuratPage() {
  const [activity, setActivity] = useState(MUHURTA_ACTIVITIES[0]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [results, setResults] = useState<MuhurtaDay[] | null>(null);
  const [error, setError] = useState('');
  const [onlyAuspicious, setOnlyAuspicious] = useState(true);

  const handleFind = () => {
    setError('');
    if (!startDate || !endDate) return;
    const start = parseLocalDate(startDate);
    const end = parseLocalDate(endDate);
    if (end < start) { setError('End date must be on or after the start date.'); setResults(null); return; }
    if (Math.round((end.getTime() - start.getTime()) / 86400000) + 1 > 366) {
      setError('Please choose a range of one year or less.'); setResults(null); return;
    }
    setResults(findMuhurtaRange(start, end, activity));
  };

  const shown = results?.filter((r) => (onlyAuspicious ? r.rating >= 4 : true)) ?? [];
  const auspiciousCount = results?.filter((r) => r.rating >= 4).length ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <div className="font-devanagari text-saffron-500 text-xl mb-2">मुहूर्त</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-earth-900 mb-3">Muhurat Finder</h1>
        <p className="text-earth-600 max-w-2xl mx-auto">
          Auspicious days judged by classical <strong>Muhurta-shastra</strong> — Tithi, Vara, Nakshatra, Yoga &amp; Karana
          shuddhi plus the day-doshas — on the <strong>Kashmiri Pandit Panchang</strong>.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 glass-saffron border border-amber-200 rounded-2xl px-4 py-2 text-xs text-amber-900 shadow-sm">
          ⚠️ Rule-based guidance. For the final muhurat (and Lagna / Tara-Bala for a specific person), verify with the
          <strong>&nbsp;Vijayeshwar Panchang</strong> and your purohit.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity selector */}
        <div>
          <h2 className="font-display font-bold text-earth-900 text-lg mb-4">Select Activity</h2>
          <div className="grid grid-cols-2 gap-3">
            {MUHURTA_ACTIVITIES.map((a) => (
              <button
                key={a.id}
                onClick={() => { setActivity(a); setResults(null); }}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-300 ease-premium hover:-translate-y-0.5 ${
                  activity.id === a.id
                    ? 'border-saffron-400 bg-saffron-50 shadow-premium'
                    : 'border-earth-200 bg-white hover:border-saffron-300 hover:shadow-premium'
                }`}
              >
                <div className="text-2xl mb-1">{a.icon}</div>
                <div className="font-semibold text-earth-800 text-sm leading-tight">{a.name}</div>
                <div className="font-devanagari text-saffron-500 text-xs">{a.kashmiri}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Range + rule note */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-saffron-200 shadow-premium p-5">
            <h2 className="font-display font-bold text-earth-900 text-lg mb-1">Search a Date Range</h2>
            <div className="bg-saffron-50 rounded-xl p-3 my-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{activity.icon}</span>
                <span className="font-semibold text-earth-800">{activity.name}</span>
              </div>
              <p className="text-sm text-earth-600">{activity.note}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">Start Date</label>
                <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setResults(null); }}
                  className="w-full px-3 py-3 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">End Date</label>
                <input type="date" value={endDate} min={startDate || undefined} onChange={(e) => { setEndDate(e.target.value); setResults(null); }}
                  className="w-full px-3 py-3 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100" />
              </div>
            </div>
            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
            <button onClick={handleFind} disabled={!startDate || !endDate}
              className="btn-primary w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
              Find Auspicious Days
            </button>
          </div>

          {!results && (
            <div className="bg-white rounded-2xl border border-earth-100 p-5 shadow-premium text-sm text-earth-600">
              <h3 className="font-display font-semibold text-earth-800 mb-2">How days are judged</h3>
              <ul className="space-y-1.5 list-disc list-inside">
                <li><strong>Tithi</strong> — Rikta (4/9/14) &amp; Amavasya avoided.</li>
                <li><strong>Vara</strong> — weekday matched to the activity.</li>
                <li><strong>Nakshatra</strong> — favourable star for the activity; Ugra/Tikshna avoided.</li>
                <li><strong>Yoga</strong> — Vyatipata, Vaidhriti, Parigha &amp; other bad yogas avoided.</li>
                <li><strong>Karana</strong> — Vishti (Bhadra) avoided.</li>
                <li><strong>Day-doshas</strong> — Rahu Kaal / Yamaganda / Gulika excluded from time-windows.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="mt-8 fade-in-up">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="font-display font-bold text-earth-900 text-xl">
              {auspiciousCount > 0
                ? `${auspiciousCount} auspicious ${auspiciousCount === 1 ? 'day' : 'days'} found`
                : 'No clearly auspicious days in this range'}
              <span className="text-earth-400 font-normal text-base"> · {activity.name}</span>
            </h2>
            <label className="flex items-center gap-2 text-sm text-earth-600 cursor-pointer select-none">
              <input type="checkbox" checked={onlyAuspicious} onChange={(e) => setOnlyAuspicious(e.target.checked)} className="accent-saffron-500 w-4 h-4" />
              Show only auspicious days
            </label>
          </div>

          {shown.length === 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-800 text-sm">
              No {onlyAuspicious ? 'auspicious ' : ''}days matched. Try a wider range or uncheck the filter to see every day with its rating.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {shown.map((r, i) => (
                <Reveal key={r.date.toISOString()} delay={(i % 4) * 60}
                  className={`rounded-2xl border p-4 bg-white shadow-premium transition-all duration-300 ease-premium hover:-translate-y-1 hover:shadow-premium-lg`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-display font-semibold text-earth-900">{formatDate(r.date)}</div>
                    <div className="flex items-center gap-1">{ratingStars(r.rating)}</div>
                  </div>

                  <div className={`inline-block text-xs font-semibold rounded-full px-2.5 py-0.5 border mb-3 ${VERDICT_STYLE(r.rating)}`}>
                    {r.verdict}
                  </div>

                  {/* Panchanga checks */}
                  <div className="space-y-1 mb-3">
                    {r.checks.map((c) => (
                      <div key={c.label} className="flex items-start gap-1.5 text-xs">
                        <span className="mt-0.5 flex-shrink-0">{STATUS_ICON[c.status]}</span>
                        <span className="text-earth-400 w-16 flex-shrink-0">{c.label}</span>
                        <span className={`${STATUS_TEXT[c.status]} leading-tight`}>{c.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Auspicious time windows */}
                  {r.windows.length > 0 && (
                    <div className="border-t border-earth-100 pt-2">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-earth-600 uppercase tracking-wide mb-1.5">
                        <Clock size={11} className="text-saffron-500" /> Auspicious windows (Choghadiya)
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {r.windows.map((w, wi) => (
                          <span key={wi} className={`text-[10px] rounded-full px-2 py-0.5 border ${w.nature === 'good' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                            {w.name} {w.start}–{w.end}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Warnings */}
                  {r.warnings.length > 0 && (
                    <div className="mt-2 space-y-0.5">
                      {r.warnings.map((w, wi) => (
                        <div key={wi} className="flex items-start gap-1 text-[10px] text-red-600 leading-tight">
                          <AlertTriangle size={10} className="flex-shrink-0 mt-0.5" /> {w}
                        </div>
                      ))}
                    </div>
                  )}
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-4 text-xs text-earth-500">
            Per classical Muhurta-shastra on the KP Panchang (Sapta Rishi Samvat), evaluated at Srinagar sunrise.
            Time-windows exclude Rahu Kaal, Yamaganda &amp; Gulika. Confirm the final muhurat with the Vijayeshwar Panchang.
          </div>
        </div>
      )}
    </div>
  );
}
