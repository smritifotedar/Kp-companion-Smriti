'use client';

import { useState, useEffect } from 'react';
import { findJanmaBirthday, type JanmaBirthdayResult } from '@/lib/kp-calendar';
import { getNamakaran } from '@/lib/kp-namakaran';
import { downloadICS } from '@/lib/ics';
import { SaveDayButton } from '@/components/ui/SaveDayButton';
import { Reveal } from '@/components/ui/Reveal';
import { CalendarPlus } from 'lucide-react';

const PROFILES_KEY = 'kp-janma-profiles';

interface Profile {
  id: string;
  name: string;
  dob: string;       // yyyy-mm-dd
  time?: string;     // HH:mm
  place?: string;
}

function parseLocalDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatFull(d: Date): string {
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

const FAQS = [
  {
    q: 'What is a Tithi?',
    a: 'A Tithi is a lunar day — the time it takes for the Moon to gain 12° on the Sun. There are 30 Tithis in a lunar month, split into Shukla Paksha (waxing) and Krishna Paksha (waning). Your Janma Tithi is the Tithi current at your birth.',
  },
  {
    q: 'What is a Nakshatra?',
    a: 'A Nakshatra is one of the 27 lunar mansions — segments of the sky the Moon passes through. Your birth Nakshatra (Janma Nakshatra) is the one the Moon occupied at your birth, and it carries deep significance in Kashmiri Pandit tradition.',
  },
  {
    q: 'What is a Rashi?',
    a: 'A Rashi is your Moon sign — one of the 12 zodiac signs the Moon was in at birth. It is the basis for the naming ceremony (Namakaran) and is used widely in horoscope matching and rituals.',
  },
];

export default function JanmaTithiPage() {
  const [dob, setDob] = useState('');
  const [time, setTime] = useState('12:00');
  const [place, setPlace] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [result, setResult] = useState<JanmaBirthdayResult | null>(null);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [newName, setNewName] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Load saved family profiles
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILES_KEY);
      if (raw) setProfiles(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const persist = (list: Profile[]) => {
    setProfiles(list);
    try { localStorage.setItem(PROFILES_KEY, JSON.stringify(list)); } catch { /* ignore */ }
  };

  const handleCalculate = () => {
    if (!dob) return;
    const birthDate = parseLocalDate(dob);
    const [h, m] = (time || '12:00').split(':').map(Number);
    const birthHourIST = h + (m || 0) / 60;
    setResult(findJanmaBirthday(birthDate, year, birthHourIST));
  };

  const loadProfile = (p: Profile) => {
    setDob(p.dob);
    setTime(p.time || '12:00');
    setPlace(p.place || '');
    setResult(null);
  };

  const addProfile = () => {
    if (!newName.trim() || !dob) return;
    const p: Profile = {
      id: Date.now().toString(),
      name: newName.trim(),
      dob,
      time,
      place,
    };
    persist([...profiles, p]);
    setNewName('');
    setShowAddProfile(false);
  };

  const removeProfile = (id: string) => persist(profiles.filter((p) => p.id !== id));

  const birth = result?.birth;
  const yearOptions = Array.from({ length: 21 }, (_, i) => new Date().getFullYear() - 5 + i);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-10">
        <div className="font-devanagari text-saffron-500 text-xl mb-2">जन्म तिथि</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-earth-900 mb-3">
          Janma Tithi Finder
        </h1>
        <p className="text-earth-600 max-w-2xl mx-auto">
          Find your birth Tithi, Nakshatra and Rashi as per the <strong>Kashmiri Pandit Panchang</strong>,
          and see the Gregorian date of your <strong>Hindu (lunar) birthday</strong> for any chosen year.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Left: Form ── */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-saffron-200 shadow-sm p-6 sm:p-8">
          {/* Family profiles */}
          {profiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {profiles.map((p) => (
                <span key={p.id} className="inline-flex items-center gap-1 bg-white border border-saffron-200 rounded-full pl-3 pr-1 py-1 text-sm">
                  <button onClick={() => loadProfile(p)} className="font-medium text-earth-700 hover:text-saffron-600">
                    {p.name}
                  </button>
                  <button
                    onClick={() => removeProfile(p.id)}
                    className="w-5 h-5 rounded-full text-earth-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center"
                    aria-label={`Remove ${p.name}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowAddProfile((v) => !v)}
            className="w-full mb-6 py-3 border-2 border-dashed border-saffron-300 rounded-xl text-saffron-700 font-medium hover:bg-saffron-50 transition-colors"
          >
            + Add a Family Profile
          </button>

          {showAddProfile && (
            <div className="mb-6 bg-white rounded-xl border border-saffron-200 p-4">
              <label className="block text-sm font-medium text-earth-700 mb-1">Profile Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., Father, Aanya"
                className="w-full px-4 py-2.5 rounded-lg border border-earth-200 focus:border-saffron-400 focus:outline-none mb-3"
              />
              <p className="text-xs text-earth-500 mb-3">
                Saves the birth details entered below for quick reuse (stored on this device only).
              </p>
              <button
                onClick={addProfile}
                disabled={!newName.trim() || !dob}
                className="w-full py-2.5 bg-saffron-500 text-white font-semibold rounded-lg hover:bg-saffron-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Profile
              </button>
            </div>
          )}

          <h2 className="font-display font-bold text-earth-900 text-2xl mb-5">🎂 Enter Birth Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-earth-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => { setDob(e.target.value); setResult(null); }}
                className="w-full px-4 py-3 rounded-xl border border-earth-200 bg-white/80 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100 text-earth-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-earth-700 mb-1">Time of Birth (optional)</label>
              <input
                type="time"
                value={time}
                onChange={(e) => { setTime(e.target.value); setResult(null); }}
                className="w-full px-4 py-3 rounded-xl border border-earth-200 bg-white/80 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100 text-earth-800"
              />
              <p className="text-xs text-earth-500 mt-1">Improves accuracy on days where the Tithi changes.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-earth-700 mb-1">Place of Birth (optional)</label>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="e.g., Srinagar, Jammu, Delhi"
                className="w-full px-4 py-3 rounded-xl border border-earth-200 bg-white/80 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100 text-earth-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-earth-700 mb-1">Show Hindu Birthday For Year</label>
              <select
                value={year}
                onChange={(e) => { setYear(Number(e.target.value)); setResult(null); }}
                className="w-full px-4 py-3 rounded-xl border border-earth-200 bg-white/80 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100 text-earth-800"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleCalculate}
              disabled={!dob}
              className="w-full py-3.5 bg-gradient-to-r from-red-700 to-red-800 text-white font-semibold rounded-xl shadow-premium hover:from-red-800 hover:to-red-900 hover:-translate-y-0.5 hover:shadow-premium-lg transition-all duration-300 ease-premium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              Find My Janma Tithi
            </button>
          </div>
        </div>

        {/* ── Right: Explainer ── */}
        <div className="bg-amber-50/60 rounded-2xl border border-saffron-200 p-6 sm:p-8">
          <h2 className="font-display font-bold text-earth-900 text-2xl mb-4">📖 What is Janma Tithi?</h2>
          <p className="text-earth-700 leading-relaxed mb-4">
            In the Hindu tradition, birthdays are often celebrated according to the lunar calendar (Panchang)
            rather than the Gregorian calendar.
          </p>
          <p className="text-earth-700 leading-relaxed mb-6">
            Your Janma Tithi is the lunar day on which you were born. The Hindu birthday falls on the same
            Tithi each year, but the corresponding Gregorian date changes.
          </p>

          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={f.q} className="bg-white rounded-xl border border-saffron-100 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-earth-800 hover:bg-saffron-50 transition-colors"
                >
                  {f.q}
                  <span className={`transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>▾</span>
                </button>
                {openFaq === i && (
                  <p className="px-4 pb-4 text-sm text-earth-600 leading-relaxed">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Result ── */}
      {result && birth && (
        <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-saffron-200 shadow-sm overflow-hidden fade-in-up">
          <div className="bg-gradient-to-r from-saffron-600 to-saffron-700 p-5 text-center text-white">
            <div className="text-4xl mb-2">🌙</div>
            <h3 className="font-display text-2xl font-bold">Your Janma Tithi</h3>
            <div className="font-devanagari text-saffron-200 mt-1">जन्म तिथि विवरण</div>
          </div>

          <div className="p-6">
            {/* Hindu birthday highlight */}
            <div className="bg-white rounded-2xl border-2 border-saffron-300 p-5 mb-6 text-center shadow-sm">
              <div className="text-sm font-medium text-earth-500 uppercase tracking-wide mb-1">
                Hindu Birthday in {result.targetYear}
              </div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-saffron-700">
                {result.birthdayDate ? formatFull(result.birthdayDate) : 'Not found in this year'}
              </div>
              {result.birthdayDate && (
                <div className="text-earth-600 mt-2 text-sm">
                  {birth.tithiName} · {birth.pakshaLabel} Paksha · {birth.kpLunarMonthName} ({birth.kpLunarMonthKashmiri})
                  {!result.exact && (
                    <span className="block text-amber-700 mt-1">
                      ⚠ Exact Tithi is skipped (kshaya) this year — showing the nearest matching day.
                    </span>
                  )}
                </div>
              )}
              {result.birthdayDate && (
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() =>
                      downloadICS({
                        title: `Janma Tithi — ${birth.tithiName} (${birth.kpLunarMonthName})`,
                        description: `Hindu (lunar) birthday: ${birth.tithiName} of ${birth.pakshaLabel} Paksha, ${birth.kpLunarMonthName}. Nakshatra ${birth.nakshatra}, Rashi ${birth.moonRashi}.`,
                        date: result.birthdayDate!,
                      })
                    }
                    className="inline-flex items-center gap-1.5 text-sm font-ui font-medium text-white bg-gradient-to-br from-saffron-500 to-saffron-600 rounded-full px-4 py-2 shadow-premium hover:shadow-glow-saffron hover:-translate-y-0.5 transition-all duration-300 ease-premium"
                  >
                    <CalendarPlus size={15} /> Add to Calendar
                  </button>
                  <SaveDayButton
                    item={{
                      id: `janma-${dob}-${time}`,
                      kind: 'janma',
                      title: `Janma Tithi — ${birth.tithiName} (${birth.kpLunarMonthName})`,
                      kashmiri: birth.kpLunarMonthKashmiri,
                      dob,
                      time,
                    }}
                  />
                </div>
              )}
            </div>

            <h4 className="font-display font-semibold text-earth-800 mb-3">Birth Panchang Details</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Tithi', value: birth.tithiName, icon: '🌙', sub: 'Lunar Day' },
                { label: 'Paksha', value: birth.pakshaLabel, icon: '☀️', sub: 'Lunar Phase' },
                { label: 'Nakshatra', value: birth.nakshatra, icon: '⭐', sub: 'Birth Star' },
                { label: 'Rashi', value: birth.moonRashi, icon: '♈', sub: 'Moon Sign' },
                { label: 'KP Month', value: `${birth.kpLunarMonthName}`, icon: '📅', sub: birth.kpLunarMonthKashmiri || 'Lunar Month' },
                { label: 'Samvat Year', value: birth.samvatYear.toString(), icon: '🕰️', sub: 'Sapta Rishi Samvat' },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-saffron-100 transition-all duration-300 ease-premium hover:-translate-y-1 hover:shadow-premium hover:border-saffron-300">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="font-display font-bold text-earth-900">{item.value}</div>
                  <div className="text-xs text-earth-500 mt-0.5">{item.label}</div>
                  <div className="text-xs text-earth-400">{item.sub}</div>
                </div>
              ))}
            </div>

            {/* Namakaran — naming syllables by Nakshatra */}
            {(() => {
              const nm = getNamakaran(birth.nakshatraIndex, birth.nakshatraPada);
              if (!nm.all.length) return null;
              return (
                <div className="bg-white rounded-2xl border border-saffron-100 shadow-sm p-5 mb-6">
                  <h4 className="font-display font-semibold text-earth-800 mb-1 flex items-center gap-2">
                    🔤 Namakaran — Naming Syllables
                  </h4>
                  <p className="text-xs text-earth-500 mb-3">
                    By tradition, a name beginning with the syllable for the birth Nakshatra pada is auspicious.
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {nm.all.map((syl, i) => {
                      const isBirth = i === birth.nakshatraPada - 1;
                      return (
                        <span
                          key={i}
                          className={`px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
                            isBirth
                              ? 'bg-saffron-500 text-white border-saffron-500 shadow-premium scale-105'
                              : 'bg-saffron-50 text-saffron-800 border-saffron-100'
                          }`}
                          title={`Pada ${i + 1}`}
                        >
                          {syl}
                          {isBirth && <span className="ml-1 text-[10px] opacity-90">(your pada)</span>}
                        </span>
                      );
                    })}
                  </div>
                  <p className="text-xs text-earth-400 mt-3">
                    Birth Nakshatra <strong className="text-earth-600">{birth.nakshatra}</strong>, Pada {birth.nakshatraPada}.
                    The highlighted syllable matches your exact pada; the others are the remaining padas of the same Nakshatra.
                  </p>
                </div>
              );
            })()}

            <div className="bg-saffron-50 rounded-xl p-4 text-sm text-earth-700">
              <p className="font-semibold text-earth-800 mb-1">About Your Janma Tithi</p>
              <p className="leading-relaxed">
                Your Janma Tithi is <strong>{birth.tithiName}</strong> of <strong>{birth.pakshaLabel} Paksha</strong> in
                the lunar month of <strong>{birth.kpLunarMonthName}</strong>. Many Kashmiri Pandit families celebrate
                birthdays on this lunar day each year — in {result.targetYear} it falls on{' '}
                <strong>{result.birthdayDate ? formatFull(result.birthdayDate) : '—'}</strong>.
              </p>
            </div>

            <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-800">
              <strong>Note:</strong> Calculations use Jean Meeus astronomical formulas with Lahiri ayanamsa,
              evaluated at sunrise (IST). For precise ritual timing always verify against the official
              Vijayeshwar Panchang or a qualified KP Jyotishi.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
