'use client';

import { useState, useMemo } from 'react';
import { generateKundli, RASHIS_EN, rashiLord, type Kundli } from '@/lib/kp-kundli';
import { KP_TITHIS } from '@/lib/kp-panchang';
import { searchCities, type City } from '@/lib/cities';
import { NorthIndianChart } from '@/components/ui/NorthIndianChart';
import { Reveal } from '@/components/ui/Reveal';
import { MapPin, Printer, Sparkles } from 'lucide-react';

const RASHI_TRAIT = [
  'energetic, pioneering and bold', 'steady, patient and grounded', 'curious, communicative and quick',
  'nurturing, emotional and intuitive', 'confident, warm and dignified', 'analytical, precise and helpful',
  'balanced, charming and fair', 'intense, focused and resourceful', 'optimistic, philosophical and free',
  'disciplined, ambitious and practical', 'original, independent and humane', 'compassionate, imaginative and gentle',
];
const DASHA_THEME: Record<string, string> = {
  Sun: 'authority, recognition and vitality', Moon: 'emotions, home and the mind',
  Mars: 'energy, courage and initiative', Mercury: 'learning, commerce and communication',
  Jupiter: 'wisdom, growth, fortune and dharma', Venus: 'relationships, comfort, art and prosperity',
  Saturn: 'discipline, responsibility and hard-won maturity', Rahu: 'ambition, change and worldly desire',
  Ketu: 'detachment, spirituality and inner work',
};

function parseLocalDate(s: string): Date { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function fmt(d: Date) { return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
function deg(v: number) { const d = Math.floor(v); const m = Math.round((v - d) * 60); return `${d}°${String(m).padStart(2, '0')}′`; }

export default function KundliPage() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [time, setTime] = useState('12:00');
  const [cityQuery, setCityQuery] = useState('');
  const [city, setCity] = useState<City | null>(null);
  const [showList, setShowList] = useState(false);
  const [result, setResult] = useState<{ kundli: Kundli; name: string; dob: string; time: string; place: string } | null>(null);
  const [error, setError] = useState('');

  const suggestions = useMemo(() => (showList ? searchCities(cityQuery) : []), [cityQuery, showList]);

  const handleGenerate = () => {
    setError('');
    if (!dob) { setError('Please enter your date of birth.'); return; }
    if (!city) { setError('Please choose your birth place from the list.'); return; }
    const birth = parseLocalDate(dob);
    const [h, m] = time.split(':').map(Number);
    const hourIST = h + (m || 0) / 60;
    const kundli = generateKundli(birth, hourIST, city.lat, city.lng, city.tz);
    setResult({ kundli, name: name.trim() || 'Birth Chart', dob, time, place: `${city.name}, ${city.region}` });
  };

  const k = result?.kundli;

  // Tithi at birth from Sun/Moon
  const tithi = useMemo(() => {
    if (!k) return '';
    const sun = k.grahas.find((g) => g.name === 'Sun')!;
    const moon = k.grahas.find((g) => g.name === 'Moon')!;
    const elong = ((moon.longitude - sun.longitude) % 360 + 360) % 360;
    const raw = Math.floor(elong / 12);
    const paksha = raw < 15 ? 'Shukla' : 'Krishna';
    const num = (raw % 15) + 1;
    const nm = num === 15 ? (paksha === 'Shukla' ? 'Purnima' : 'Amavasya') : KP_TITHIS[num - 1];
    return `${nm} · ${paksha} Paksha`;
  }, [k]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8 no-print">
        <div className="font-devanagari text-saffron-500 text-xl mb-2">जन्म कुंडली</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-earth-900 mb-3 flex items-center justify-center gap-2">
          <Sparkles className="text-saffron-500" size={26} /> Kundli (Birth Chart)
        </h1>
        <p className="text-earth-600 max-w-2xl mx-auto">
          Generate your Vedic birth chart — Lagna, planetary positions, Nakshatra, and Vimshottari Dasha — computed
          with sidereal (Lahiri) astronomy. Download a clean, personalized report.
        </p>
      </div>

      {/* Form */}
      <div className="no-print bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-saffron-200 shadow-premium p-6 sm:p-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-earth-700 mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name"
              className="w-full px-4 py-3 rounded-xl border border-earth-200 bg-white/80 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-earth-700 mb-1">Date of Birth</label>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-earth-200 bg-white/80 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-earth-700 mb-1">Time of Birth</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-earth-200 bg-white/80 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100" />
            <p className="text-xs text-earth-500 mt-1">Accurate time is essential for the Lagna (ascendant).</p>
          </div>
          <div className="relative">
            <label className="block text-sm font-semibold text-earth-700 mb-1">Birth Place</label>
            <div className="relative">
              <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
              <input
                value={cityQuery}
                onChange={(e) => { setCityQuery(e.target.value); setShowList(true); setCity(null); }}
                placeholder="Search city…"
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-earth-200 bg-white/80 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100"
              />
            </div>
            {suggestions.length > 0 && !city && (
              <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-earth-200 rounded-xl shadow-premium-lg max-h-52 overflow-y-auto">
                {suggestions.map((c) => (
                  <button key={`${c.name}-${c.lat}`} onClick={() => { setCity(c); setCityQuery(`${c.name}, ${c.region}`); setShowList(false); }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-saffron-50 text-earth-700">
                    {c.name} <span className="text-earth-400">· {c.region}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        <button onClick={handleGenerate} className="btn-primary w-full mt-5 py-3.5">Generate Kundli</button>
      </div>

      {/* Report */}
      {result && k && (
        <div className="bg-white rounded-3xl border border-saffron-200 shadow-premium-lg overflow-hidden fade-in-up" id="kundli-report">
          <div className="relative bg-gradient-to-r from-saffron-600 to-saffron-700 text-white p-5 flex items-start justify-between">
            <div>
              <div className="font-display text-2xl font-bold">{result.name}</div>
              <div className="text-saffron-100 text-sm mt-0.5">
                {fmt(parseLocalDate(result.dob))} · {result.time} · {result.place}
              </div>
            </div>
            <button onClick={() => window.print()} className="no-print inline-flex items-center gap-1.5 bg-white/15 border border-white/25 rounded-full px-3.5 py-2 text-sm font-medium hover:bg-white/25 transition-colors">
              <Printer size={15} /> Download / Print
            </button>
          </div>

          <div className="p-5 sm:p-7 space-y-7">
            {/* Summary chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { label: 'Lagna (Ascendant)', value: `${k.lagna.rashiName} (${RASHIS_EN[k.lagna.rashi]})` },
                { label: 'Rashi (Moon Sign)', value: `${RASHIS_EN[k.moonRashi]}` },
                { label: 'Janma Nakshatra', value: `${k.janmaNakshatra.name} · Pada ${k.janmaNakshatra.pada}` },
                { label: 'Sun Sign (Sidereal)', value: RASHIS_EN[k.sunRashi] },
                { label: 'Tithi at Birth', value: tithi },
                { label: 'Current Mahadasha', value: k.dasha.currentMaha?.lord ?? '—' },
                { label: 'Current Antardasha', value: k.dasha.currentAntar?.lord ?? '—' },
                { label: 'Ayanamsa (Lahiri)', value: `${k.ayanamsa.toFixed(2)}°` },
              ].map((c) => (
                <div key={c.label} className="rounded-2xl border border-saffron-100 bg-saffron-50/60 p-3">
                  <div className="text-[10px] text-earth-500 uppercase tracking-wide">{c.label}</div>
                  <div className="font-display font-bold text-earth-900 text-sm leading-tight mt-0.5">{c.value}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Chart */}
              <div className="rounded-2xl border border-earth-100 p-4 bg-white">
                <NorthIndianChart grahas={k.grahas} lagnaRashi={k.lagna.rashi} title="Lagna Chart (D-1)" />
                <p className="text-[11px] text-earth-400 text-center mt-2">Numbers = Rashi (1=Aries…12=Pisces) · La = Lagna · ʳ = retrograde</p>
              </div>

              {/* Planet table */}
              <div className="rounded-2xl border border-earth-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-earth-900 text-amber-100 text-xs">
                    <tr>
                      <th className="text-left px-3 py-2 font-ui font-semibold">Graha</th>
                      <th className="text-left px-2 py-2 font-ui font-semibold">Sign</th>
                      <th className="text-left px-2 py-2 font-ui font-semibold">Nakshatra</th>
                      <th className="text-center px-2 py-2 font-ui font-semibold">Ho.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {k.grahas.map((g, i) => (
                      <tr key={g.name} className={i % 2 ? 'bg-saffron-50/40' : 'bg-white'}>
                        <td className="px-3 py-1.5 font-semibold text-earth-800">
                          {g.name}{g.retro && <span className="text-red-500 text-xs" title="Retrograde"> ℞</span>}
                        </td>
                        <td className="px-2 py-1.5 text-earth-700">{g.rashiName} {deg(g.degInSign)}</td>
                        <td className="px-2 py-1.5 text-earth-600 text-xs">{g.nakshatra} ({g.pada})</td>
                        <td className="px-2 py-1.5 text-center text-earth-700">{g.house}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vimshottari Dasha */}
            <div>
              <h3 className="font-display font-bold text-earth-900 mb-3">Vimshottari Dasha</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {k.dasha.mahas.map((m) => {
                  const isCurrent = k.dasha.currentMaha?.lord === m.lord && +k.dasha.currentMaha.start === +m.start;
                  return (
                    <div key={m.lord + m.start.toISOString()} className={`rounded-xl border p-2.5 text-center ${isCurrent ? 'bg-saffron-500 text-white border-saffron-500 shadow-premium' : 'bg-white border-earth-100'}`}>
                      <div className="font-display font-bold text-sm">{m.lord}</div>
                      <div className={`text-[10px] ${isCurrent ? 'text-saffron-100' : 'text-earth-500'}`}>{m.start.getFullYear()}–{m.end.getFullYear()}</div>
                    </div>
                  );
                })}
              </div>
              {k.dasha.currentMaha && (
                <p className="text-sm text-earth-600 mt-3">
                  You are currently in <strong>{k.dasha.currentMaha.lord} Mahadasha</strong>
                  {k.dasha.currentAntar && <> with <strong>{k.dasha.currentAntar.lord} Antardasha</strong></>} — a period emphasising{' '}
                  {DASHA_THEME[k.dasha.currentMaha.lord]}.
                </p>
              )}
            </div>

            {/* Personalized notes */}
            <div className="bg-saffron-50 rounded-2xl p-4 text-sm text-earth-700 leading-relaxed">
              <h3 className="font-display font-semibold text-earth-800 mb-1">About Your Chart</h3>
              <p>
                With <strong>{k.lagna.rashiName} Lagna</strong>, your outward nature tends to be {RASHI_TRAIT[k.lagna.rashi]}
                (ruled by {rashiLord(k.lagna.rashi)}). Your Moon in <strong>{RASHIS_EN[k.moonRashi]}</strong> shapes an inner
                temperament that is {RASHI_TRAIT[k.moonRashi]}, born under <strong>{k.janmaNakshatra.name}</strong> nakshatra.
                {k.dasha.currentMaha && <> The current {k.dasha.currentMaha.lord} period highlights {DASHA_THEME[k.dasha.currentMaha.lord]}.</>}
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800">
              <strong>Note:</strong> Positions are computed with sidereal (Lahiri) astronomy and whole-sign houses
              (Rahu/Ketu = mean node). This is an informational chart — for detailed predictions and remedies, consult a
              qualified Jyotishi. Generated on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
