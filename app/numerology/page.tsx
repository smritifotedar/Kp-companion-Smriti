'use client';

import { useState } from 'react';
import {
  computeNumerology, NUMBER_MEANING, NUMBER_ATTR, NUMBER_COMPAT, PERSONAL_YEAR_THEME, reduceToSingle,
  type NumerologyResult,
} from '@/lib/numerology';
import { Printer, Hash, Sparkles, Gem, Heart, User, Star, CalendarClock, Briefcase, Activity, Lightbulb, Users } from 'lucide-react';

function parseLocalDate(s: string): Date { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function fmt(d: Date) { return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }); }

export default function NumerologyPage() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [result, setResult] = useState<{ r: NumerologyResult; name: string; dob: string } | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = () => {
    setError('');
    if (!dob) { setError('Please enter your date of birth.'); return; }
    const r = computeNumerology(name, dob);
    setResult({ r, name: name.trim() || 'Your Numerology', dob });
  };

  const r = result?.r;
  const attr = r ? NUMBER_ATTR[r.mulank] : null;

  const CORE = r ? [
    { label: 'Life Path', value: r.lifePath, icon: <Star size={14} />, hint: 'Your life’s purpose & journey' },
    { label: 'Mulank (Psychic)', value: r.mulank, icon: <Hash size={14} />, hint: 'Your driving inner nature' },
    { label: 'Bhagyank (Destiny)', value: r.bhagyank, icon: <Sparkles size={14} />, hint: 'What life brings to you' },
    ...(r.hasName ? [
      { label: 'Expression', value: r.expression, icon: <User size={14} />, hint: 'Your natural talents' },
      { label: 'Soul Urge', value: r.soulUrge, icon: <Heart size={14} />, hint: 'Your heart’s desire' },
      { label: 'Personality', value: r.personality, icon: <User size={14} />, hint: 'How others see you' },
    ] : []),
    { label: 'Birthday No.', value: r.birthdayNumber, icon: <CalendarClock size={14} />, hint: 'A special gift' },
    { label: 'Personal Year', value: r.personalYear, icon: <CalendarClock size={14} />, hint: 'This year’s theme' },
  ] : [];

  const Section = ({ title, num, body, icon }: { title: string; num: number; body: string; icon: React.ReactNode }) => (
    <div className="rounded-2xl border border-earth-100 bg-white p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-saffron-500 to-amber-500 text-white flex items-center justify-center font-display font-bold text-lg shrink-0">{num}</div>
        <div>
          <div className="flex items-center gap-1.5 text-saffron-600 text-[11px] font-ui font-semibold uppercase tracking-wide">{icon}{title}</div>
          <div className="font-display font-bold text-earth-900 leading-tight">{NUMBER_MEANING[num]?.title}</div>
        </div>
      </div>
      <p className="text-sm text-earth-700 leading-relaxed">{body}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8 no-print">
        <div className="font-devanagari text-saffron-500 text-xl mb-2">अंक ज्योतिष</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-earth-900 mb-3 flex items-center justify-center gap-2">
          <Hash className="text-saffron-500" size={26} /> Numerology Report
        </h1>
        <p className="text-earth-600 max-w-2xl mx-auto">
          A detailed reading of your numbers — Life Path, Mulank &amp; Bhagyank (Vedic), and your name numbers
          (Expression, Soul Urge, Personality) — with planetary associations and lucky attributes.
        </p>
      </div>

      {/* Form */}
      <div className="no-print bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-saffron-200 shadow-premium p-6 sm:p-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-earth-700 mb-1">Full Name (as commonly used)</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Aanya Kaul"
              className="w-full px-4 py-3 rounded-xl border border-earth-200 bg-white/80 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100" />
            <p className="text-xs text-earth-500 mt-1">Used for Expression, Soul Urge &amp; Personality numbers.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-earth-700 mb-1">Date of Birth</label>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-earth-200 bg-white/80 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100" />
          </div>
        </div>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        <button onClick={handleGenerate} className="btn-primary w-full mt-5 py-3.5">Generate Numerology Report</button>
      </div>

      {/* Report */}
      {result && r && (
        <div className="bg-white rounded-3xl border border-saffron-200 shadow-premium-lg overflow-hidden fade-in-up" id="numerology-report">
          <div className="relative bg-gradient-to-r from-saffron-600 to-saffron-700 text-white p-5 flex items-start justify-between">
            <div>
              <div className="font-display text-2xl font-bold">{result.name}</div>
              <div className="text-saffron-100 text-sm mt-0.5">{fmt(parseLocalDate(result.dob))}</div>
            </div>
            <button onClick={() => window.print()} className="no-print inline-flex items-center gap-1.5 bg-white/15 border border-white/25 rounded-full px-3.5 py-2 text-sm font-medium hover:bg-white/25 transition-colors">
              <Printer size={15} /> Download / Print
            </button>
          </div>

          <div className="p-5 sm:p-7 space-y-7">
            {/* Core numbers grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CORE.map((c) => (
                <div key={c.label} className="rounded-2xl border border-saffron-100 bg-saffron-50/60 p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-earth-500 uppercase tracking-wide">{c.icon}{c.label}</div>
                  <div className="font-display font-bold text-saffron-700 text-3xl leading-none mt-1">{c.value}</div>
                  <div className="text-[10px] text-earth-400 mt-1">{c.hint}</div>
                </div>
              ))}
            </div>

            {/* Life Path */}
            <Section title="Life Path Number" num={r.lifePath} body={NUMBER_MEANING[r.lifePath].lifePath} icon={<Star size={13} />} />

            {/* Strengths & challenges for Life Path */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                <h3 className="font-display font-bold text-green-800 mb-1 text-sm">Strengths</h3>
                <p className="text-xs text-earth-700 leading-relaxed">{NUMBER_MEANING[r.lifePath].strengths}</p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <h3 className="font-display font-bold text-amber-800 mb-1 text-sm">Watch-outs</h3>
                <p className="text-xs text-earth-700 leading-relaxed">{NUMBER_MEANING[r.lifePath].challenges}</p>
              </div>
            </div>

            {/* Life in detail — career, love, health */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: <Briefcase size={15} />, label: 'Career & Work', text: NUMBER_MEANING[r.lifePath].careers },
                { icon: <Heart size={15} />, label: 'Love & Relationships', text: NUMBER_MEANING[r.lifePath].love },
                { icon: <Activity size={15} />, label: 'Health & Wellbeing', text: NUMBER_MEANING[r.lifePath].health },
              ].map((c) => (
                <div key={c.label} className="rounded-2xl border border-earth-100 bg-white p-4">
                  <div className="flex items-center gap-1.5 text-saffron-600 text-[11px] font-ui font-semibold uppercase tracking-wide mb-1">{c.icon}{c.label}</div>
                  <p className="text-xs text-earth-700 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>

            {/* Affirmation */}
            <div className="rounded-2xl bg-gradient-to-r from-saffron-500 to-amber-500 text-white p-5 text-center">
              <div className="text-[11px] uppercase tracking-widest opacity-80">Your Affirmation</div>
              <p className="font-display text-lg sm:text-xl mt-1">“{NUMBER_MEANING[r.lifePath].affirmation}”</p>
            </div>

            {/* Vedic: Mulank & Bhagyank with planetary attributes */}
            <div>
              <h3 className="font-display font-bold text-earth-900 flex items-center gap-2 mb-3"><Sparkles size={18} className="text-saffron-500" /> Vedic Numbers &amp; Planets</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-earth-100 bg-white p-4">
                  <div className="font-display font-bold text-earth-900">Mulank {r.mulank} · {NUMBER_MEANING[r.mulank].title}</div>
                  <div className="text-xs text-earth-400 mb-1">Psychic / Driver — ruled by {NUMBER_ATTR[r.mulank].planet}</div>
                  <p className="text-sm text-earth-700 leading-relaxed">Your inner drive is shaped by {NUMBER_MEANING[r.mulank].keywords}. {NUMBER_MEANING[r.mulank].lifePath.split('. ')[0]}.</p>
                </div>
                <div className="rounded-2xl border border-earth-100 bg-white p-4">
                  <div className="font-display font-bold text-earth-900">Bhagyank {r.bhagyank} · {NUMBER_MEANING[r.bhagyank].title}</div>
                  <div className="text-xs text-earth-400 mb-1">Destiny / Conductor — ruled by {NUMBER_ATTR[r.bhagyank].planet}</div>
                  <p className="text-sm text-earth-700 leading-relaxed">Life tends to bring you {NUMBER_MEANING[r.bhagyank].keywords}. {NUMBER_MEANING[r.bhagyank].soulUrge}</p>
                </div>
              </div>
            </div>

            {/* Lucky attributes */}
            {attr && (
              <div className="rounded-2xl border border-saffron-100 bg-gradient-to-br from-saffron-50 to-amber-50 p-5">
                <h3 className="font-display font-bold text-earth-900 flex items-center gap-2 mb-3"><Gem size={18} className="text-saffron-500" /> Your Lucky Attributes <span className="text-xs font-normal text-earth-400">(by Mulank {r.mulank})</span></h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    ['Ruling Planet', attr.planet], ['Lucky Gem', attr.gem], ['Lucky Colour', attr.color], ['Lucky Day', attr.day],
                    ['Lucky Numbers', NUMBER_MEANING[r.lifePath].luckyNumbers.join(', ')], ['Lucky Metal', attr.metal], ['Favourable Direction', attr.direction],
                    ['Mantra', attr.mantra],
                  ].map(([l, v]) => (
                    <div key={l} className="rounded-xl bg-white border border-saffron-100 p-3 text-center">
                      <div className="text-[10px] text-earth-500 uppercase tracking-wide">{l}</div>
                      <div className="text-sm font-semibold text-earth-800 mt-0.5">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions & remedies */}
            <div className="rounded-2xl border border-earth-100 bg-white p-5">
              <h3 className="font-display font-bold text-earth-900 flex items-center gap-2 mb-3"><Lightbulb size={18} className="text-saffron-500" /> Suggestions &amp; Remedies</h3>
              <ul className="space-y-1.5 text-sm text-earth-700 mb-3">
                {NUMBER_MEANING[r.lifePath].suggestions.map((s, i) => (
                  <li key={i} className="flex gap-2"><span className="text-saffron-500 mt-0.5">›</span><span>{s}</span></li>
                ))}
              </ul>
              {attr && (
                <div className="rounded-xl bg-saffron-50 border border-saffron-100 p-3 text-sm text-earth-700">
                  <strong>Vedic remedy ({attr.planet}):</strong> {attr.remedy} Chant <em>{attr.mantra}</em>, and the {attr.gem} is your supportive gemstone (consult an astrologer before wearing one).
                </div>
              )}
            </div>

            {/* Compatibility */}
            <div className="rounded-2xl border border-earth-100 bg-white p-5">
              <h3 className="font-display font-bold text-earth-900 flex items-center gap-2 mb-3"><Users size={18} className="text-saffron-500" /> Number Compatibility <span className="text-xs font-normal text-earth-400">(by Mulank {r.mulank})</span></h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-green-50 border border-green-100 p-3">
                  <div className="text-xs font-semibold text-green-700 mb-1">Harmonious with</div>
                  <div className="flex flex-wrap gap-1.5">
                    {NUMBER_COMPAT[r.mulank].harmonious.map((n) => (
                      <span key={n} className="text-xs bg-white border border-green-200 rounded-full px-2 py-0.5 text-earth-700"><strong>{n}</strong> · {NUMBER_MEANING[n].title}</span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                  <div className="text-xs font-semibold text-amber-700 mb-1">Handle with care</div>
                  <div className="flex flex-wrap gap-1.5">
                    {NUMBER_COMPAT[r.mulank].caution.length ? NUMBER_COMPAT[r.mulank].caution.map((n) => (
                      <span key={n} className="text-xs bg-white border border-amber-200 rounded-full px-2 py-0.5 text-earth-700"><strong>{n}</strong> · {NUMBER_MEANING[n].title}</span>
                    )) : <span className="text-xs text-earth-500">You get along easily with most numbers.</span>}
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-earth-400 mt-2">A gentle guide for friendships, partnerships and marriage — chemistry depends on the whole chart, not one number alone.</p>
            </div>

            {/* Name numbers */}
            {r.hasName ? (
              <div>
                <h3 className="font-display font-bold text-earth-900 flex items-center gap-2 mb-3"><User size={18} className="text-saffron-500" /> Your Name Numbers</h3>
                <div className="space-y-3">
                  <Section title="Expression / Destiny Number" num={r.expression} body={`${NUMBER_MEANING[r.expression].expression} (${NUMBER_MEANING[r.expression].keywords})`} icon={<Sparkles size={13} />} />
                  <Section title="Soul Urge / Heart’s Desire" num={r.soulUrge} body={NUMBER_MEANING[r.soulUrge].soulUrge} icon={<Heart size={13} />} />
                  <Section title="Personality Number" num={r.personality} body={NUMBER_MEANING[r.personality].personality} icon={<User size={13} />} />
                </div>
              </div>
            ) : (
              <p className="text-sm text-earth-500 bg-earth-50 rounded-xl p-3">Add your name above to also see your Expression, Soul Urge and Personality numbers.</p>
            )}

            {/* Personal Year */}
            <div className="rounded-2xl border border-earth-100 bg-white p-5">
              <h3 className="font-display font-bold text-earth-900 flex items-center gap-2 mb-1"><CalendarClock size={18} className="text-saffron-500" /> Personal Year {r.personalYear} ({new Date().getFullYear()})</h3>
              <p className="text-sm text-earth-700 leading-relaxed">This year for you is about {PERSONAL_YEAR_THEME[r.personalYear]}</p>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800">
              <strong>How this is calculated:</strong> Life Path, Expression, Soul Urge and Personality use the Pythagorean
              system (master numbers 11/22/33 preserved); Mulank &amp; Bhagyank use Vedic numerology reduced to a single
              digit with classical planetary rulers. Numerology is for reflection and guidance, not certainty.
              Generated on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.
              {r.lifePath !== reduceToSingle(r.lifePath) && <> Your Life Path reduces to {reduceToSingle(r.lifePath)} at its root.</>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
