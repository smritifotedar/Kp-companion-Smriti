'use client';

import { useState, useMemo } from 'react';
import { KP_SONGS, SONG_CATEGORIES, listenSearchUrl, type KPSong, type SongCategory } from '@/lib/kp-bhajans';
import { Reveal } from '@/components/ui/Reveal';
import { Music, Quote, Play } from 'lucide-react';

const FILTERS: ('All' | SongCategory)[] = ['All', ...SONG_CATEGORIES];

const COVER_GRADIENT: Record<SongCategory, string> = {
  'Bhajan & Leela': 'from-amber-400 to-orange-600',
  'Stotra & Stuti': 'from-rose-400 to-pink-600',
  'Vakh & Shruk': 'from-violet-500 to-indigo-700',
  'Wanwun & Henzae': 'from-emerald-500 to-teal-700',
  'Kashmiri Folk & Song': 'from-sky-500 to-blue-700',
};

function YouTubePlayer({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  if (play) {
    return (
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <button
      onClick={() => setPlay(true)}
      aria-label={`Play ${title}`}
      className="relative w-full overflow-hidden group/cover block"
      style={{ aspectRatio: '16 / 9' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 ease-premium group-hover/cover:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/45 to-black/10 group-hover/cover:from-black/30 transition-colors" />
      <PlayBadge />
    </button>
  );
}

function GradientCover({ song }: { song: KPSong }) {
  return (
    <a
      href={listenSearchUrl(song)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Listen to ${song.title} on YouTube`}
      className={`relative w-full overflow-hidden group/cover block bg-gradient-to-br ${COVER_GRADIENT[song.category]}`}
      style={{ aspectRatio: '16 / 9' }}
    >
      {/* soft glow + big icon */}
      <span className="pointer-events-none absolute -top-6 -right-4 w-28 h-20 bg-white/20 blur-2xl" />
      <span className="absolute inset-0 flex items-center justify-center text-6xl opacity-90 transition-transform duration-500 ease-premium group-hover/cover:scale-110">
        {song.icon}
      </span>
      <span className="absolute inset-0 bg-black/10 group-hover/cover:bg-black/0 transition-colors" />
      <PlayBadge />
    </a>
  );
}

function PlayBadge() {
  return (
    <span className="absolute inset-0 flex items-center justify-center">
      <span className="w-14 h-14 rounded-full bg-saffron-600/90 text-white flex items-center justify-center shadow-lg group-hover/cover:scale-110 transition-transform">
        <Play className="fill-current ml-0.5" size={24} />
      </span>
    </span>
  );
}

export default function BhajansPage() {
  const [filter, setFilter] = useState<'All' | SongCategory>('All');

  const songs = useMemo(
    () => (filter === 'All' ? KP_SONGS : KP_SONGS.filter((s) => s.category === filter)),
    [filter]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="font-devanagari text-saffron-500 text-xl mb-2">भजन ते वनवुन</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-earth-900 mb-3">
          Bhajans &amp; Kashmiri Wanwun
        </h1>
        <p className="text-earth-600 max-w-2xl mx-auto">
          The living sound of Kashmiri Pandit devotion — leelas and bhajans, sacred stotras, the mystic vakhs of
          Lal Ded and Roopa Bhawani, ceremonial <strong>wanwun</strong>, and treasured Kashmiri folk songs.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-ui font-medium transition-all duration-300 ease-premium ${
              filter === f
                ? 'bg-saffron-600 text-white shadow-premium scale-105'
                : 'bg-white border border-earth-200 text-earth-600 hover:border-saffron-300 hover:-translate-y-0.5 hover:shadow-sm'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {songs.map((s, i) => (
          <Reveal
            key={s.id}
            delay={(i % 3) * 60}
            className="kp-card card-ring bg-white rounded-3xl border border-earth-100 shadow-premium overflow-hidden flex flex-col"
          >
            {/* Cover with play */}
            {s.youtubeId ? <YouTubePlayer id={s.youtubeId} title={s.title} /> : <GradientCover song={s} />}

            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-display font-bold text-earth-900 text-lg leading-tight">{s.title}</h3>
              {s.kashmiri && <div className="font-devanagari text-saffron-600 text-sm mb-2">{s.kashmiri}</div>}

              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="festival-badge bg-saffron-50 text-saffron-700">{s.category}</span>
                {s.deity && <span className="festival-badge bg-earth-50 text-earth-600">{s.deity}</span>}
              </div>

              <p className="text-earth-600 text-sm leading-relaxed mb-3 flex-1">{s.about}</p>

              {s.refrain && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-saffron-100 rounded-2xl p-3 mb-3">
                  <div className="flex items-start gap-2">
                    <Quote size={14} className="text-saffron-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-display text-earth-800 italic">{s.refrain}</div>
                      {s.refrainMeaning && <div className="text-xs text-earth-500 mt-1">{s.refrainMeaning}</div>}
                    </div>
                  </div>
                </div>
              )}

              <div className="text-xs text-earth-500 border-t border-earth-100 pt-2 flex items-center gap-1.5">
                <Music size={12} className="text-saffron-400 flex-shrink-0" />
                <span className="truncate"><span className="text-earth-400">Sung at:</span> {s.occasion}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Note */}
      <div className="mt-10 glass-saffron border border-amber-200 rounded-2xl p-5 text-sm text-amber-900 shadow-sm max-w-3xl mx-auto">
        <p>
          <strong>🎙 Listening &amp; preservation:</strong> recordings open on YouTube (folk &amp; bhajan tracks are
          courtesy of community channels such as Kashmir Heritage). Verses from Lal Ded, Roopa Bhawani and traditional
          wanwun are centuries old and shown for context. Have a full bhajan <em>playlist</em> you&apos;d like added?
          Share the playlist link and I&apos;ll bring every track in.
        </p>
      </div>
    </div>
  );
}
