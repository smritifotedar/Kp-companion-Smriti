'use client';

import { useState } from 'react';
import { KP_RITUALS, type Ritual } from '@/lib/kp-rituals';
import { ChevronDown, ChevronUp, Play, Clock, User, CalendarClock, Quote } from 'lucide-react';

const CATEGORIES = ['All', 'Annual Ritual', 'Marriage Ceremony', 'Samskara', 'Ancestral Ritual', 'Vedic Ritual'];

function VideoPlayer({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  if (play) {
    return (
      <div className="relative w-full overflow-hidden rounded-2xl shadow-premium" style={{ aspectRatio: '16 / 9' }}>
        <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
    );
  }
  return (
    <button onClick={() => setPlay(true)} aria-label={`Play ${title}`}
      className="relative w-full overflow-hidden rounded-2xl shadow-premium group/cover block" style={{ aspectRatio: '16 / 9' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt={title}
        className="w-full h-full object-cover transition-transform duration-500 ease-premium group-hover/cover:scale-105" />
      <span className="absolute inset-0 bg-gradient-to-t from-black/45 to-black/10 group-hover/cover:from-black/30 transition-colors" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="w-16 h-16 rounded-full bg-saffron-600/90 text-white flex items-center justify-center shadow-lg group-hover/cover:scale-110 transition-transform">
          <Play className="fill-current ml-0.5" size={26} />
        </span>
      </span>
      <span className="absolute bottom-2 left-3 text-white text-xs font-ui bg-black/40 rounded-full px-2.5 py-1">▶ Watch the vidhi</span>
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display font-bold text-earth-900 text-base mb-3 pb-1.5 border-b border-saffron-100">{title}</h3>
      {children}
    </div>
  );
}

function RitualDetail({ r }: { r: Ritual }) {
  return (
    <div className="px-5 pb-7 border-t border-saffron-100 pt-6 space-y-7">
      {/* Video */}
      {r.youtubeId && (
        <div className="max-w-2xl mx-auto">
          <VideoPlayer id={r.youtubeId} title={`${r.name} vidhi`} />
          <p className="text-[11px] text-earth-400 text-center mt-1.5">Reference video — actual family vidhi may vary.</p>
        </div>
      )}

      {/* Quick facts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: <User size={15} />, label: 'Performed by', value: r.quickFacts.performedBy },
          { icon: <Clock size={15} />, label: 'Duration', value: r.quickFacts.duration },
          { icon: <CalendarClock size={15} />, label: 'When', value: r.quickFacts.timing },
        ].map((f) => (
          <div key={f.label} className="rounded-2xl border border-saffron-100 bg-saffron-50/60 p-3">
            <div className="flex items-center gap-1.5 text-[10px] text-saffron-700 uppercase tracking-wide font-semibold">{f.icon}{f.label}</div>
            <div className="text-sm text-earth-800 mt-1 leading-tight">{f.value}</div>
          </div>
        ))}
      </div>

      {/* Purpose & significance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Section title="🎯 Purpose"><p className="text-sm text-earth-600 leading-relaxed">{r.purpose}</p></Section>
        <Section title="🕉️ Significance"><p className="text-sm text-earth-600 leading-relaxed">{r.religiousSignificance}</p></Section>
      </div>

      {/* Step-by-step vidhi */}
      <Section title="📋 Step-by-Step Vidhi">
        <ol className="space-y-3">
          {r.procedure.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-saffron-500 to-saffron-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
              <div>
                <div className="font-semibold text-earth-900 text-sm">{s.title}</div>
                <p className="text-sm text-earth-600 leading-relaxed">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Mantras */}
      <Section title="🔱 Mantras & Shlokas">
        <div className="space-y-3">
          {r.mantras.map((m, i) => (
            <div key={i} className="rounded-2xl border border-saffron-100 bg-gradient-to-br from-amber-50 to-orange-50/60 p-4">
              <div className="flex items-start gap-2">
                <Quote size={14} className="text-saffron-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="font-devanagari text-earth-900 text-base leading-relaxed">{m.sanskrit}</div>
                  <div className="text-saffron-700 text-xs italic mt-1">{m.transliteration}</div>
                  <div className="text-earth-600 text-sm mt-1.5">{m.meaning}</div>
                  {m.when && <div className="text-[10px] text-earth-400 mt-1.5 uppercase tracking-wide">↳ {m.when}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Samagri */}
      <Section title="🧺 Samagri (Materials Needed)">
        <div className="flex flex-wrap gap-1.5">
          {r.materials.map((item, i) => (
            <span key={i} className="px-3 py-1.5 bg-white border border-saffron-100 rounded-lg text-xs text-earth-700 shadow-sm">{item}</span>
          ))}
        </div>
      </Section>

      {/* Tips + history */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Section title="✅ Tips & Things to Remember">
          <ul className="space-y-1.5">
            {r.tips.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-earth-600">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span> {t}
              </li>
            ))}
          </ul>
        </Section>
        <Section title="📜 History & Origin"><p className="text-sm text-earth-600 leading-relaxed">{r.historicalBackground}</p></Section>
      </div>

      {/* Variations & misconceptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <h4 className="font-display font-semibold text-blue-800 mb-1.5 text-sm">🗺️ Regional Variations</h4>
          <p className="text-blue-700 text-sm leading-relaxed">{r.regionalVariations}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4">
          <h4 className="font-display font-semibold text-amber-800 mb-1.5 text-sm">💡 Common Misconception</h4>
          <p className="text-amber-700 text-sm leading-relaxed">{r.commonMisconceptions}</p>
        </div>
      </div>

      <div className="text-xs text-earth-400 border-t border-earth-100 pt-3">
        📌 This is an educational guide. The exact vidhi, mantras and sequence are family- and purohit-specific — always
        perform major rituals under the guidance of a qualified Kashmiri Pandit priest.
      </div>
    </div>
  );
}

export default function RitualsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(KP_RITUALS[0]?.id ?? null);
  const [category, setCategory] = useState('All');

  const filtered = category === 'All' ? KP_RITUALS : KP_RITUALS.filter((r) => r.category === category);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <div className="font-devanagari text-saffron-500 text-xl mb-2">कर्मकांड ज्ञान</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-earth-900 mb-3">Kashmiri Pandit Ritual Library</h1>
        <p className="text-earth-600 max-w-2xl mx-auto">
          A complete, easy-to-follow guide to KP rituals — with the <strong>vidhi</strong> step by step, the{' '}
          <strong>mantras &amp; shlokas</strong> to chant, the <strong>samagri</strong> you need, and a reference video for each.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-ui font-medium transition-all duration-300 ease-premium ${
              category === cat ? 'bg-saffron-600 text-white shadow-premium scale-105'
                : 'bg-white border border-earth-200 text-earth-600 hover:border-saffron-300 hover:-translate-y-0.5 hover:shadow-sm'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((ritual) => {
          const isExpanded = expandedId === ritual.id;
          return (
            <div key={ritual.id}
              className={`bg-white rounded-3xl border shadow-premium overflow-hidden transition-all duration-300 ease-premium ${
                isExpanded ? 'border-saffron-300 sacred-glow' : 'border-earth-100 hover:border-saffron-200 hover:-translate-y-1 hover:shadow-premium-lg'
              }`}>
              <button onClick={() => setExpandedId(isExpanded ? null : ritual.id)} className="w-full text-left p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{ritual.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-display font-bold text-earth-900 text-lg">{ritual.name}</h2>
                      <span className="font-devanagari text-saffron-600">{ritual.kashmiri}</span>
                      <span className="festival-badge bg-earth-50 text-earth-600">{ritual.category}</span>
                      {ritual.youtubeId && <span className="festival-badge bg-saffron-50 text-saffron-700">▶ Video</span>}
                    </div>
                    <p className="text-sm text-earth-500 mt-0.5">{ritual.description}</p>
                  </div>
                </div>
                <div className="text-saffron-400 flex-shrink-0">{isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
              </button>
              {isExpanded && <RitualDetail r={ritual} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
