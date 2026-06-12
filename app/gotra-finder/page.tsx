'use client';

import { useState, useMemo } from 'react';
import { findGotraBySurname, KP_SURNAME_GOTRA, type SurnameGotra } from '@/lib/kp-surname-gotra';
import { KP_GOTRA_DATA } from '@/lib/kp-gotras';
import { Reveal } from '@/components/ui/Reveal';
import { Search, Info, GitFork } from 'lucide-react';

// Optional enrichment: rishi/lineage for gotras we have detail on
const GOTRA_RISHI: Record<string, string> = Object.fromEntries(
  KP_GOTRA_DATA.map((g) => [g.name.toLowerCase(), g.rishi])
);

export default function GotraFinderPage() {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const results = useMemo(() => (query.trim() ? findGotraBySurname(query) : []), [query]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="font-devanagari text-saffron-500 text-xl mb-2">गोत्र</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-earth-900 mb-3">
          Find Your Gotra by Surname
        </h1>
        <p className="text-earth-600 max-w-2xl mx-auto">
          Search your Kashmiri Pandit family surname (kram) to see the gotra(s) commonly associated with it.
        </p>
      </div>

      {/* Important disclaimer */}
      <div className="glass-saffron border border-amber-200 rounded-2xl px-4 py-3 text-sm text-amber-900 shadow-sm mb-8 flex items-start gap-2 max-w-2xl mx-auto">
        <Info size={18} className="flex-shrink-0 mt-0.5 text-amber-600" />
        <p>
          <strong>Please note:</strong> a surname does <strong>not</strong> definitively determine gotra — families
          with the same surname often belong to <strong>different</strong> gotras. These are <strong>indicative</strong>{' '}
          associations from community genealogies. Always confirm your true gotra with your family records or purohit.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSearched(true); }}
          placeholder="Enter your surname — e.g., Koul, Bhat, Dhar, Razdan…"
          className="w-full pl-11 pr-4 py-3.5 rounded-full border border-earth-200 bg-white focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100 text-earth-800 shadow-sm"
        />
      </div>

      {/* Results */}
      {query.trim() && results.length > 0 && (
        <div className="space-y-4">
          {results.map((r, i) => (
            <Reveal key={r.surname} delay={(i % 4) * 60}>
              <SurnameCard data={r} />
            </Reveal>
          ))}
        </div>
      )}

      {query.trim() && results.length === 0 && (
        <div className="bg-white rounded-3xl border border-earth-100 shadow-premium p-8 text-center max-w-xl mx-auto">
          <GitFork size={36} className="mx-auto text-saffron-400 mb-3" />
          <h2 className="font-display font-bold text-earth-900 text-lg mb-2">
            &ldquo;{query.trim()}&rdquo; isn&apos;t in our indicative list
          </h2>
          <p className="text-earth-600 text-sm">
            Many KP surnames aren&apos;t covered here, and gotra is ultimately determined by family lineage rather than
            surname. Please consult your family elders or purohit for your authentic gotra.
          </p>
        </div>
      )}

      {/* Browse hint when nothing typed */}
      {!query.trim() && (
        <div className="text-center text-earth-500 text-sm">
          <p className="mb-3">Start typing a surname above, or pick a common one:</p>
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {KP_SURNAME_GOTRA.slice(0, 12).map((s) => (
              <button
                key={s.surname}
                onClick={() => { setQuery(s.surname); setSearched(true); }}
                className="px-3 py-1.5 rounded-full bg-white border border-earth-200 text-earth-700 text-sm hover:border-saffron-300 hover:-translate-y-0.5 hover:shadow-premium transition-all duration-300 ease-premium"
              >
                {s.surname}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Explainer */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          {
            q: 'What is a Gotra?',
            a: 'A gotra is a patrilineal clan tracing descent from an ancient Rishi (sage). It is inherited father-to-child and is used in rituals (sankalpa), and to ensure marriage partners are not of the same lineage.',
          },
          {
            q: 'Why doesn’t surname fix the gotra?',
            a: 'Kashmiri Pandit surnames (kram names like Koul, Bhat, Dhar) are occupational or place-based titles adopted over time. Different families adopted the same kram independently, so one surname spans several gotras. Your gotra comes from your family’s recorded lineage.',
          },
        ].map((item) => (
          <div key={item.q} className="bg-white rounded-2xl border border-earth-100 shadow-premium p-5">
            <h3 className="font-display font-semibold text-earth-900 mb-2">{item.q}</h3>
            <p className="text-sm text-earth-600 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SurnameCard({ data }: { data: SurnameGotra }) {
  return (
    <div className="bg-white rounded-3xl border border-earth-100 shadow-premium p-6 transition-all duration-300 ease-premium hover:shadow-premium-lg">
      <div className="flex flex-wrap items-baseline gap-2 mb-1">
        <h3 className="font-display font-bold text-earth-900 text-xl">{data.surname}</h3>
        <span className="text-sm text-earth-400">
          {data.gotras.length} recorded {data.gotras.length === 1 ? 'gotra' : 'gotras'}
        </span>
      </div>

      <div className="text-xs text-earth-500 uppercase tracking-wide mt-3 mb-2">Gotra(s) recorded for this surname</div>
      <div className="flex flex-wrap gap-2">
        {data.gotras.map((g) => {
          const rishi = GOTRA_RISHI[g.toLowerCase()];
          return (
            <span
              key={g}
              className="px-3 py-1.5 rounded-xl bg-saffron-50 border border-saffron-100 text-saffron-800 text-sm font-semibold"
              title={rishi ? `Lineage of ${rishi}` : undefined}
            >
              {g}
              {rishi && <span className="block text-[10px] font-normal text-saffron-600">{rishi}</span>}
            </span>
          );
        })}
      </div>

      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-3">
        ⚠ Indicative only — families with the surname <strong>{data.surname}</strong> may belong to other gotras.
        Confirm with your family or purohit.
      </p>
    </div>
  );
}
