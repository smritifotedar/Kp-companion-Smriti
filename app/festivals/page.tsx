'use client';

import { useState } from 'react';
import { KP_FESTIVALS, KP_MONTHS } from '@/lib/kp-panchang';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';

export default function FestivalsPage() {
  const [expandedId, setExpandedId] = useState<string | null>('navreh');
  const [selectedMonth, setSelectedMonth] = useState<number>(0);

  const filtered = selectedMonth === 0
    ? KP_FESTIVALS
    : KP_FESTIVALS.filter(f => f.month === selectedMonth || f.month === 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="font-devanagari text-saffron-500 text-xl mb-2">त्योहार पंचांग</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-earth-900 mb-3">
          Kashmiri Pandit Festival Calendar
        </h1>
        <p className="text-earth-600 max-w-2xl mx-auto">
          Festivals as observed per <strong>Sapta Rishi Samvat</strong> (Laukika Samvat) — the authentic
          Kashmiri Pandit Panchang. Dates here reflect KP traditions, which may differ from standard Hindu Panchang.
        </p>
        <div className="mt-4 inline-block glass-saffron border border-amber-200 rounded-2xl px-4 py-2 text-sm text-amber-900 shadow-sm">
          🗓 All timings follow the <strong>Kashmiri Pandit Panchang</strong>, not standard Vikram Samvat
        </div>
      </div>

      {/* Month filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <button
          onClick={() => setSelectedMonth(0)}
          className={`px-4 py-1.5 rounded-full text-sm font-ui font-medium transition-all duration-300 ease-premium ${
            selectedMonth === 0
              ? 'bg-saffron-600 text-white shadow-premium scale-105'
              : 'bg-white border border-earth-200 text-earth-600 hover:border-saffron-300 hover:-translate-y-0.5 hover:shadow-sm'
          }`}
        >
          All Festivals
        </button>
        {KP_MONTHS.map((month) => (
          <button
            key={month.number}
            onClick={() => setSelectedMonth(month.number)}
            className={`px-4 py-1.5 rounded-full text-sm font-ui font-medium transition-all duration-300 ease-premium ${
              selectedMonth === month.number
                ? 'bg-saffron-600 text-white'
                : 'bg-white border border-earth-200 text-earth-600 hover:border-saffron-300'
            }`}
          >
            {month.name}
            <span className="font-devanagari text-xs ml-1 opacity-70">({month.kashmiri})</span>
          </button>
        ))}
      </div>

      {/* Festivals */}
      <div className="space-y-4">
        {filtered.map((festival) => {
          const isExpanded = expandedId === festival.id;
          return (
            <div
              key={festival.id}
              className={`bg-white rounded-3xl border shadow-premium overflow-hidden transition-all duration-300 ease-premium ${
                isExpanded ? 'border-saffron-300 sacred-glow' : 'border-earth-100 hover:border-saffron-200 hover:-translate-y-1 hover:shadow-premium-lg'
              }`}
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : festival.id)}
                className="w-full text-left p-5 flex items-start justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{festival.category === 'major' ? '🪔' : festival.category === 'monthly' ? '🌙' : '⭐'}</div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-display font-bold text-earth-900 text-lg">{festival.name}</h2>
                      <span className="font-devanagari text-saffron-600 text-base">{festival.kashmiri}</span>
                      {festival.uniqueToKP && (
                        <span className="festival-badge bg-saffron-50 text-saffron-700 text-xs">
                          Unique to KP
                        </span>
                      )}
                      {festival.category === 'major' && (
                        <span className="festival-badge bg-amber-50 text-amber-700 text-xs">
                          Major Festival
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-earth-500 mt-0.5">
                      <span className="font-medium">Tithi:</span> {festival.tithi}
                    </div>
                  </div>
                </div>
                <div className="text-saffron-400 mt-1 flex-shrink-0">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-5 pb-6 border-t border-saffron-100 pt-5">
                  <p className="text-earth-700 mb-5 leading-relaxed">{festival.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Significance */}
                    <div>
                      <h3 className="font-display font-semibold text-earth-800 mb-2 flex items-center gap-2">
                        <Star size={14} className="text-saffron-500" /> Significance
                      </h3>
                      <p className="text-earth-600 text-sm leading-relaxed">{festival.significance}</p>
                    </div>

                    {/* Rituals */}
                    <div>
                      <h3 className="font-display font-semibold text-earth-800 mb-2 flex items-center gap-2">
                        🕉️ Rituals & Observances
                      </h3>
                      <ul className="space-y-1">
                        {festival.rituals.map((ritual, i) => (
                          <li key={i} className="text-sm text-earth-600 flex items-start gap-2">
                            <span className="text-saffron-400 mt-0.5 flex-shrink-0">•</span>
                            {ritual}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Traditional foods */}
                    <div>
                      <h3 className="font-display font-semibold text-earth-800 mb-2 flex items-center gap-2">
                        🍽️ Traditional Foods
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {festival.foods.map((food, i) => (
                          <span key={i} className="px-3 py-1 bg-orange-50 border border-orange-100 rounded-full text-sm text-orange-700">
                            {food}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* KP Panchang */}
                    <div>
                      <h3 className="font-display font-semibold text-earth-800 mb-2 flex items-center gap-2">
                        🗓 KP Panchang Details
                      </h3>
                      <div className="bg-saffron-50 rounded-xl p-4 text-sm space-y-1">
                        <div><span className="text-earth-500">Tithi:</span> <span className="font-medium text-earth-800">{festival.tithi}</span></div>
                        <div>
                          <span className="text-earth-500">Paksha:</span>{' '}
                          <span className="font-medium text-earth-800">
                            {festival.paksha === 'shukla' ? 'Shukla Paksha (Bright Half)' : 'Krishna Paksha (Dark Half)'}
                          </span>
                        </div>
                        <div>
                          <span className="text-earth-500">Month:</span>{' '}
                          <span className="font-medium text-earth-800">
                            {festival.month === 0 ? 'All months' : KP_MONTHS.find(m => m.number === festival.month)?.name}
                          </span>
                        </div>
                        <div className="text-xs text-amber-700 bg-amber-50 rounded p-2 mt-2">
                          Per Sapta Rishi Samvat / KP Panchang
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
