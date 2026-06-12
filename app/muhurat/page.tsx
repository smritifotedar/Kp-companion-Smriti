'use client';

import { useState } from 'react';
import { KP_MUHURAT_TYPES } from '@/lib/kp-panchang';
import { findMuhuratRange, type MuhuratDayResult } from '@/lib/kp-calendar';
import { Reveal } from '@/components/ui/Reveal';

// Parse a yyyy-mm-dd input string into a *local* Date (avoids UTC shift)
function parseLocalDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

export default function MuhuratPage() {
  const [selectedType, setSelectedType] = useState(KP_MUHURAT_TYPES[0]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [results, setResults] = useState<MuhuratDayResult[] | null>(null);
  const [error, setError] = useState('');
  const [onlyFavorable, setOnlyFavorable] = useState(true);

  const handleFind = () => {
    setError('');
    if (!startDate || !endDate) return;
    const start = parseLocalDate(startDate);
    const end = parseLocalDate(endDate);
    if (end < start) {
      setError('End date must be on or after the start date.');
      setResults(null);
      return;
    }
    const days = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
    if (days > 366) {
      setError('Please choose a range of one year or less.');
      setResults(null);
      return;
    }
    setResults(findMuhuratRange(start, end, selectedType));
  };

  const ratingStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`muhurat-star ${i < rating ? 'filled' : ''}`}>★</span>
    ));

  const shown = results?.filter((r) => (onlyFavorable ? r.isFavorable : true)) ?? [];
  const favorableCount = results?.filter((r) => r.isFavorable).length ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-10">
        <div className="font-devanagari text-saffron-500 text-xl mb-2">मुहूर्त</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-earth-900 mb-3">
          Muhurat Finder
        </h1>
        <p className="text-earth-600 max-w-xl mx-auto">
          Find the auspicious days within a date range for important decisions, as per the{' '}
          <strong>Kashmiri Pandit Panchang</strong> (Sapta Rishi Samvat).
        </p>
        <div className="mt-3 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-800">
          ⚠️ This tool is a guide. Always consult a KP scholar for major life decisions.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Type selector */}
        <div>
          <h2 className="font-display font-bold text-earth-900 text-lg mb-4">Select Activity Type</h2>
          <div className="grid grid-cols-2 gap-3">
            {KP_MUHURAT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => { setSelectedType(type); setResults(null); }}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-300 ease-premium hover:-translate-y-0.5 ${
                  selectedType.id === type.id
                    ? 'border-saffron-400 bg-saffron-50 shadow-premium'
                    : 'border-earth-200 bg-white hover:border-saffron-300 hover:shadow-premium'
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="font-semibold text-earth-800 text-sm">{type.name}</div>
                <div className="text-xs text-earth-500">{type.kashmiri}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Range picker */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-saffron-200 shadow-sm p-5">
            <h2 className="font-display font-bold text-earth-900 text-lg mb-4">Search a Date Range</h2>

            {/* Selected type info */}
            <div className="bg-saffron-50 rounded-xl p-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{selectedType.icon}</span>
                <span className="font-semibold text-earth-800">{selectedType.name}</span>
              </div>
              <p className="text-sm text-earth-600">{selectedType.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setResults(null); }}
                  className="w-full px-3 py-3 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => { setEndDate(e.target.value); setResults(null); }}
                  className="w-full px-3 py-3 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

            <button
              onClick={handleFind}
              disabled={!startDate || !endDate}
              className="btn-primary w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              Find Auspicious Days
            </button>
          </div>

          {/* Favorable periods reference */}
          {!results && (
            <div className="bg-white rounded-2xl border border-earth-100 p-5">
              <h3 className="font-display font-semibold text-earth-800 mb-3">
                Favorable for {selectedType.name}
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-earth-500 font-medium">Good Tithis: </span>
                  <span className="text-earth-700">{selectedType.favorableTithis.join(', ')}</span>
                </div>
                <div>
                  <span className="text-earth-500 font-medium">Good Nakshatras: </span>
                  <span className="text-earth-700">{selectedType.favorableNakshatras.join(', ')}</span>
                </div>
                <div>
                  <span className="text-red-500 font-medium">Avoid Tithis: </span>
                  <span className="text-red-700">{selectedType.unfavorableTithis.join(', ')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="mt-8 fade-in-up">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="font-display font-bold text-earth-900 text-xl">
              {favorableCount > 0
                ? `${favorableCount} auspicious ${favorableCount === 1 ? 'day' : 'days'} found`
                : 'No clearly auspicious days in this range'}
              <span className="text-earth-400 font-normal text-base"> · {selectedType.name}</span>
            </h2>
            <label className="flex items-center gap-2 text-sm text-earth-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyFavorable}
                onChange={(e) => setOnlyFavorable(e.target.checked)}
                className="accent-saffron-500 w-4 h-4"
              />
              Show only auspicious days
            </label>
          </div>

          {shown.length === 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-800 text-sm">
              No {onlyFavorable ? 'auspicious ' : ''}days matched in the selected range. Try a wider
              range or uncheck the filter to see every day.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shown.map((r, i) => (
                <Reveal
                  key={r.date.toISOString()}
                  delay={(i % 4) * 60}
                  className={`rounded-2xl border p-4 transition-all duration-300 ease-premium hover:-translate-y-1 hover:shadow-premium ${
                    r.isFavorable ? 'bg-green-50 border-green-200' : 'bg-white border-earth-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-earth-900">{formatDate(r.date)}</div>
                    <div className="text-2xl">{r.isFavorable ? '✅' : '➖'}</div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {ratingStars(r.rating)}
                    <span className="text-xs text-earth-500 ml-1">({r.rating}/5)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs mb-2">
                    <span className="bg-white/70 border border-earth-100 rounded px-2 py-0.5">
                      {r.tithi} · {r.paksha}
                    </span>
                    <span className="bg-white/70 border border-earth-100 rounded px-2 py-0.5">
                      {r.nakshatra}
                    </span>
                    <span className="bg-white/70 border border-earth-100 rounded px-2 py-0.5">
                      {r.weekday}
                    </span>
                  </div>
                  <p className="text-xs text-earth-600 leading-relaxed">{r.reasoning}</p>
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-4 text-xs text-earth-500">
            Per KP Panchang (Sapta Rishi Samvat), evaluated at sunrise. Consult a scholar for final confirmation.
          </div>
        </div>
      )}
    </div>
  );
}
