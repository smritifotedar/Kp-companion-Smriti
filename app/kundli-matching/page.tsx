'use client';

import { useState } from 'react';
import { generateKundli, RASHIS_EN, type Kundli } from '@/lib/kp-kundli';
import { matchKundlis, type MatchResult } from '@/lib/kp-kundli-match';
import { tzOffsetHours, type GeoCity } from '@/lib/geo';
import { CityAutocomplete } from '@/components/ui/CityAutocomplete';
import { Printer, Heart, Check, X } from 'lucide-react';

interface BirthData { name: string; dob: string; time: string; city: GeoCity | null }
const empty = (): BirthData => ({ name: '', dob: '', time: '12:00', city: null });
function parseLocalDate(s: string): Date { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }

function BirthForm({ title, accent, data, onChange }: { title: string; accent: string; data: BirthData; onChange: (d: BirthData) => void }) {
  return (
    <div className="bg-white rounded-3xl border border-earth-100 shadow-premium p-5">
      <h3 className={`font-display font-bold text-lg mb-4 ${accent}`}>{title}</h3>
      <div className="space-y-3">
        <input value={data.name} onChange={(e) => onChange({ ...data, name: e.target.value })} placeholder="Name"
          className="w-full px-4 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100" />
        <div className="grid grid-cols-2 gap-3">
          <input type="date" value={data.dob} onChange={(e) => onChange({ ...data, dob: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100" />
          <input type="time" value={data.time} onChange={(e) => onChange({ ...data, time: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100" />
        </div>
        <CityAutocomplete value={data.city} onSelect={(c) => onChange({ ...data, city: c })} placeholder="Birth place — any city/town…" />
        {data.city && <p className="text-[11px] text-earth-400">{data.city.lat.toFixed(2)}°, {data.city.lng.toFixed(2)}° · {data.city.timezone}</p>}
      </div>
    </div>
  );
}

const TONE: Record<MatchResult['verdictTone'], string> = {
  excellent: 'from-green-500 to-emerald-600',
  good: 'from-saffron-500 to-amber-600',
  average: 'from-amber-500 to-orange-600',
  poor: 'from-red-500 to-rose-600',
};

export default function KundliMatchingPage() {
  const [boy, setBoy] = useState<BirthData>(empty());
  const [girl, setGirl] = useState<BirthData>(empty());
  const [result, setResult] = useState<{ match: MatchResult; boy: Kundli; girl: Kundli; boyName: string; girlName: string } | null>(null);
  const [error, setError] = useState('');

  const handleMatch = () => {
    setError('');
    if (!boy.dob || !boy.city || !girl.dob || !girl.city) { setError('Please fill both birth details (date + place).'); return; }
    const mk = (d: BirthData): Kundli => {
      const [h, m] = d.time.split(':').map(Number);
      const birth = parseLocalDate(d.dob);
      const tz = tzOffsetHours(d.city!.timezone, birth);
      return generateKundli(birth, h + (m || 0) / 60, d.city!.lat, d.city!.lng, tz);
    };
    const bK = mk(boy), gK = mk(girl);
    setResult({ match: matchKundlis(bK, gK), boy: bK, girl: gK, boyName: boy.name.trim() || 'Boy', girlName: girl.name.trim() || 'Girl' });
  };

  const m = result?.match;
  const pct = m ? Math.round((m.total / 36) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8 no-print">
        <div className="font-devanagari text-saffron-500 text-xl mb-2">कुंडली मिलान</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-earth-900 mb-3 flex items-center justify-center gap-2">
          <Heart className="text-rose-500" size={26} /> Kundli Matching
        </h1>
        <p className="text-earth-600 max-w-2xl mx-auto">
          Ashtakoot Guna Milan — the classical 36-guna compatibility across eight kootas, with Mangal (Manglik) Dosha,
          on sidereal (Lahiri) positions. Download a clean, personalized report.
        </p>
      </div>

      <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <BirthForm title="🤵 Boy / Groom" accent="text-kashmir-600" data={boy} onChange={setBoy} />
        <BirthForm title="👰 Girl / Bride" accent="text-rose-600" data={girl} onChange={setGirl} />
      </div>
      {error && <p className="no-print text-sm text-red-600 mb-3 text-center">{error}</p>}
      <button onClick={handleMatch} className="no-print btn-primary w-full sm:w-auto sm:mx-auto sm:flex px-8 py-3.5 mb-8">Match Kundlis</button>

      {result && m && (
        <div className="bg-white rounded-3xl border border-saffron-200 shadow-premium-lg overflow-hidden fade-in-up" id="match-report">
          {/* Header / score */}
          <div className={`relative bg-gradient-to-r ${TONE[m.verdictTone]} text-white p-6 text-center`}>
            <div className="flex items-center justify-center gap-2 text-sm font-medium mb-1">
              <span>{result.boyName}</span> <Heart size={14} className="fill-current" /> <span>{result.girlName}</span>
            </div>
            <div className="font-display text-5xl font-bold">{m.total}<span className="text-2xl opacity-80">/36</span></div>
            <div className="font-display text-lg mt-1">{m.verdict}</div>
            <button onClick={() => window.print()} className="no-print absolute top-4 right-4 inline-flex items-center gap-1.5 bg-white/15 border border-white/25 rounded-full px-3 py-1.5 text-xs font-medium hover:bg-white/25 transition-colors">
              <Printer size={14} /> Print
            </button>
          </div>

          <div className="p-5 sm:p-7 space-y-6">
            {/* Score bar */}
            <div>
              <div className="h-3 rounded-full bg-earth-100 overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${TONE[m.verdictTone]} rounded-full`} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between text-[11px] text-earth-400 mt-1">
                <span>0</span><span>18 (min)</span><span>36</span>
              </div>
            </div>

            {/* Koota breakdown */}
            <div className="rounded-2xl border border-earth-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-earth-900 text-amber-100 text-xs">
                  <tr>
                    <th className="text-left px-3 py-2 font-ui font-semibold">Koota</th>
                    <th className="text-left px-2 py-2 font-ui font-semibold hidden sm:table-cell">Meaning</th>
                    <th className="text-center px-3 py-2 font-ui font-semibold">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {m.kootas.map((k, i) => (
                    <tr key={k.name} className={i % 2 ? 'bg-saffron-50/40' : 'bg-white'}>
                      <td className="px-3 py-2 font-semibold text-earth-800">{k.name}</td>
                      <td className="px-2 py-2 text-earth-500 text-xs hidden sm:table-cell">{k.meaning}</td>
                      <td className="px-3 py-2 text-center">
                        <span className={`font-semibold ${k.score === 0 ? 'text-red-500' : k.score === k.max ? 'text-green-600' : 'text-earth-700'}`}>
                          {k.score}/{k.max}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-saffron-100/60 font-bold">
                    <td className="px-3 py-2 text-earth-900" colSpan={2}>Total Guna Milan</td>
                    <td className="px-3 py-2 text-center text-saffron-700">{m.total}/36</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mangal Dosha */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[{ who: result.boyName, mg: m.boyManglik }, { who: result.girlName, mg: m.girlManglik }].map((x) => (
                <div key={x.who} className={`rounded-2xl border p-4 ${x.mg.manglik ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {x.mg.manglik ? <X size={16} className="text-red-500" /> : <Check size={16} className="text-green-600" />}
                    <span className="font-display font-semibold text-earth-900">{x.who}</span>
                  </div>
                  <div className={`text-sm ${x.mg.manglik ? 'text-red-700' : 'text-green-700'}`}>
                    {x.mg.manglik ? 'Manglik' : 'Non-Manglik'}
                    {x.mg.manglik && <span className="text-xs text-earth-500"> ({[x.mg.fromLagna && 'from Lagna', x.mg.fromMoon && 'from Moon'].filter(Boolean).join(', ')})</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm text-amber-800">
              <strong>Mangal Dosha:</strong> {m.manglikNote}
            </div>

            {/* Birth summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[{ n: result.boyName, k: result.boy }, { n: result.girlName, k: result.girl }].map((x) => (
                <div key={x.n} className="rounded-xl border border-earth-100 p-3">
                  <div className="font-semibold text-earth-800 mb-1">{x.n}</div>
                  <div className="text-earth-600">Rashi: {RASHIS_EN[x.k.moonRashi]} · Nakshatra: {x.k.janmaNakshatra.name} (Pada {x.k.janmaNakshatra.pada})</div>
                  <div className="text-earth-600">Lagna: {RASHIS_EN[x.k.lagna.rashi]}</div>
                </div>
              ))}
            </div>

            <div className="bg-earth-50 rounded-xl p-3 text-xs text-earth-500">
              Computed via classical Ashtakoot (Guna Milan) on sidereal positions. Bhakoot &amp; Nadi doshas and Manglik
              status should be reviewed by a qualified astrologer alongside the full charts before any decision.
              Generated on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
