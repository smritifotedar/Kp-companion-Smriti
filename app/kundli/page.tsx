'use client';

import { useState, useMemo } from 'react';
import { generateKundli, RASHIS_EN, type Kundli } from '@/lib/kp-kundli';
import { interpretKundli } from '@/lib/kp-kundli-interpret';
import { KP_TITHIS } from '@/lib/kp-panchang';
import { tzOffsetHours, type GeoCity } from '@/lib/geo';
import { CityAutocomplete } from '@/components/ui/CityAutocomplete';
import { NorthIndianChart } from '@/components/ui/NorthIndianChart';
import { Printer, Sparkles, User, Moon as MoonIcon, Sun as SunIcon, Star, Orbit, Home, Gem, TrendingUp, ScrollText } from 'lucide-react';

function parseLocalDate(s: string): Date { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function fmt(d: Date) { return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
function deg(v: number) { const d = Math.floor(v); const m = Math.round((v - d) * 60); return `${d}°${String(m).padStart(2, '0')}′`; }

export default function KundliPage() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [time, setTime] = useState('12:00');
  const [city, setCity] = useState<GeoCity | null>(null);
  const [result, setResult] = useState<{ kundli: Kundli; name: string; dob: string; time: string; place: string } | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = () => {
    setError('');
    if (!dob) { setError('Please enter your date of birth.'); return; }
    if (!city) { setError('Please search and select your birth place.'); return; }
    const birth = parseLocalDate(dob);
    const [h, m] = time.split(':').map(Number);
    const hourIST = h + (m || 0) / 60;
    const tz = tzOffsetHours(city.timezone, birth); // actual UTC offset at the birth date (handles DST)
    const kundli = generateKundli(birth, hourIST, city.lat, city.lng, tz);
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

  const reading = useMemo(() => (k ? interpretKundli(k, result!.name) : null), [k, result]);

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
          <div>
            <label className="block text-sm font-semibold text-earth-700 mb-1">Birth Place</label>
            <CityAutocomplete value={city} onSelect={setCity} placeholder="Search any city or town…" />
            {city && <p className="text-[11px] text-earth-400 mt-1">{city.lat.toFixed(2)}°, {city.lng.toFixed(2)}° · {city.timezone}</p>}
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

            {/* Overview */}
            {reading && (
              <div className="rounded-2xl border border-saffron-100 bg-gradient-to-br from-saffron-50 to-amber-50 p-5">
                <h3 className="font-display font-bold text-earth-900 flex items-center gap-2 mb-2"><ScrollText size={18} className="text-saffron-500" /> Your Chart at a Glance</h3>
                <p className="text-sm text-earth-700 leading-relaxed">{reading.overview}</p>
              </div>
            )}

            {/* Three pillars: Lagna, Moon, Sun */}
            {reading && (
              <div>
                <h3 className="font-display font-bold text-earth-900 mb-3">The Three Pillars of You</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { icon: <User size={16} />, tag: 'Lagna · Body & Self', sign: `${reading.ascendant.sign} (${reading.ascendant.signEn})`, sub: `${reading.ascendant.element} · ${reading.ascendant.quality} · ${reading.ascendant.lord}`, text: reading.ascendant.text },
                    { icon: <MoonIcon size={16} />, tag: 'Moon · Mind & Emotions', sign: `${reading.moon.sign} (${reading.moon.signEn})`, sub: 'Your inner temperament', text: reading.moon.text },
                    { icon: <SunIcon size={16} />, tag: 'Sun · Soul & Vitality', sign: `${reading.sun.sign} (${reading.sun.signEn})`, sub: 'Your core identity', text: reading.sun.text },
                  ].map((p) => (
                    <div key={p.tag} className="rounded-2xl border border-earth-100 bg-white p-4">
                      <div className="flex items-center gap-1.5 text-saffron-600 text-[11px] font-ui font-semibold uppercase tracking-wide">{p.icon}{p.tag}</div>
                      <div className="font-display font-bold text-earth-900 mt-1">{p.sign}</div>
                      <div className="text-[11px] text-earth-400 mb-2">{p.sub}</div>
                      <p className="text-xs text-earth-600 leading-relaxed">{p.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Janma Nakshatra */}
            {reading && (
              <div className="rounded-2xl border border-earth-100 bg-white p-5">
                <h3 className="font-display font-bold text-earth-900 flex items-center gap-2 mb-3"><Star size={18} className="text-saffron-500" /> Janma Nakshatra — {reading.nakshatra.name}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {[['Deity', reading.nakshatra.deity], ['Symbol', reading.nakshatra.symbol], ['Ruler', reading.nakshatra.lord], ['Gana', reading.nakshatra.gana]].map(([l, v]) => (
                    <div key={l} className="rounded-xl bg-saffron-50/60 border border-saffron-100 p-2 text-center">
                      <div className="text-[10px] text-earth-500 uppercase tracking-wide">{l}</div>
                      <div className="text-xs font-semibold text-earth-800 mt-0.5">{v}</div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-earth-700 leading-relaxed">{reading.nakshatra.text}</p>
              </div>
            )}

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
              {reading?.dasha.text && (
                <p className="text-sm text-earth-600 mt-3 leading-relaxed">{reading.dasha.text}</p>
              )}
            </div>

            {/* Planet-by-planet reading */}
            {reading && (
              <div>
                <h3 className="font-display font-bold text-earth-900 flex items-center gap-2 mb-3"><Orbit size={18} className="text-saffron-500" /> Planetary Influences</h3>
                <div className="space-y-2">
                  {reading.planets.map((p) => (
                    <div key={p.name} className="rounded-xl border border-earth-100 bg-white p-3 flex gap-3">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-earth-900 text-amber-100 flex items-center justify-center font-display font-bold text-sm">{p.abbr}</div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display font-semibold text-earth-900">{p.name}</span>
                          <span className="text-xs text-earth-400">in {p.signEn} · House {p.house}</span>
                          {p.dignity && <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${p.dignity === 'Debilitated' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>{p.dignity}</span>}
                          {p.retro && !['Rahu', 'Ketu'].includes(p.name) && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">Retrograde</span>}
                        </div>
                        <p className="text-xs text-earth-600 leading-relaxed mt-0.5">{p.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Houses */}
            {reading && (
              <div>
                <h3 className="font-display font-bold text-earth-900 flex items-center gap-2 mb-3"><Home size={18} className="text-saffron-500" /> The Twelve Houses (Bhavas)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {reading.houses.map((h) => (
                    <div key={h.num} className="rounded-xl border border-earth-100 bg-white p-3">
                      <div className="font-display font-semibold text-earth-800 text-sm">{h.name} · {h.sign}</div>
                      <p className="text-[11px] text-earth-600 leading-relaxed mt-0.5">{h.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Yogas & Doshas */}
            {reading && reading.yogas.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-earth-900 flex items-center gap-2 mb-3"><Gem size={18} className="text-saffron-500" /> Yogas &amp; Doshas in Your Chart</h3>
                <div className="space-y-2">
                  {reading.yogas.map((y, i) => (
                    <div key={i} className={`rounded-xl border p-3 ${y.tone === 'good' ? 'bg-green-50 border-green-100' : y.tone === 'challenge' ? 'bg-amber-50 border-amber-100' : 'bg-earth-50 border-earth-100'}`}>
                      <div className={`font-display font-semibold text-sm ${y.tone === 'good' ? 'text-green-700' : y.tone === 'challenge' ? 'text-amber-700' : 'text-earth-700'}`}>{y.name}</div>
                      <p className="text-xs text-earth-600 leading-relaxed mt-0.5">{y.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths & Guidance */}
            {reading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                  <h3 className="font-display font-bold text-green-800 flex items-center gap-2 mb-2"><TrendingUp size={17} /> Key Strengths</h3>
                  <ul className="space-y-1.5 text-xs text-earth-700">
                    {reading.strengths.map((s, i) => <li key={i} className="flex gap-2"><span className="text-green-500 mt-0.5">✦</span><span>{s}</span></li>)}
                  </ul>
                </div>
                <div className="rounded-2xl border border-saffron-100 bg-saffron-50 p-4">
                  <h3 className="font-display font-bold text-saffron-800 flex items-center gap-2 mb-2"><ScrollText size={17} /> Guidance</h3>
                  <ul className="space-y-1.5 text-xs text-earth-700">
                    {reading.guidance.map((s, i) => <li key={i} className="flex gap-2"><span className="text-saffron-500 mt-0.5">›</span><span>{s}</span></li>)}
                  </ul>
                </div>
              </div>
            )}

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
