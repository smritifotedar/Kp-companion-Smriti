'use client';

import { useState, useMemo } from 'react';
import {
  buildMonthCalendar,
  computeDayPanchang,
  getMonthHeaderInfo,
  getPakshaGradient,
  getSunTimes,
  getInauspiciousPeriods,
  getChoghadiya,
  KP_LOCATIONS,
  type CalendarDay,
  type DayPanchang,
  type KPCalendarEvent,
  type SunTimes,
} from '@/lib/kp-calendar';
import { KP_MONTHS } from '@/lib/kp-panchang';
import { downloadICS } from '@/lib/ics';
import { SaveDayButton } from '@/components/ui/SaveDayButton';
import { ChevronLeft, ChevronRight, X, Calendar, Sun, Moon, Star, Sunrise, Sunset, MapPin, CalendarPlus, AlertTriangle, Printer } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const GREGORIAN_MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

function EventDot({ event }: { event: KPCalendarEvent }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
      style={{ backgroundColor: event.color }}
      title={event.name}
    />
  );
}

function DayCell({
  cell,
  onClick,
  isSelected,
}: {
  cell: CalendarDay;
  onClick: () => void;
  isSelected: boolean;
}) {
  if (!cell.date || !cell.panchang) {
    return <div className="min-h-[112px] sm:min-h-[128px] bg-black/[0.015] rounded-2xl border border-transparent" />;
  }

  const p = cell.panchang;
  const hasFestival = p.festivals.length > 0;
  const majorFestival = p.festivals.find(f => f.type === 'major');

  let cellBg = 'bg-white';
  if (cell.isToday) cellBg = 'bg-amber-50 border-saffron-400';
  else if (isSelected) cellBg = 'bg-saffron-50 border-saffron-300';
  else if (majorFestival) cellBg = 'bg-gradient-to-br from-amber-50 to-orange-100/70';
  else if (hasFestival) cellBg = 'bg-gradient-to-br from-amber-50/80 to-amber-50';
  else if (p.isAmavasya) cellBg = 'bg-gray-100';
  else if (p.isPurnima) cellBg = 'bg-blue-50';
  else if (p.paksha === 'krishna') cellBg = 'bg-slate-50/80';

  return (
    <button
      onClick={onClick}
      className={`
        group/cell min-h-[112px] sm:min-h-[128px] w-full text-left rounded-2xl border p-2.5 relative overflow-hidden
        transition-all duration-300 ease-premium
        hover:border-saffron-300 hover:-translate-y-1.5 hover:scale-[1.05] hover:shadow-premium-xl hover:z-10
        ${hasFestival ? 'shine-on-hover' : ''}
        ${cellBg}
        ${cell.isToday ? 'border-saffron-400 shadow-premium ring-2 ring-saffron-300/70 sacred-glow-pulse' : 'border-earth-100'}
        ${isSelected ? 'border-saffron-500 shadow-premium-lg ring-2 ring-saffron-300' : ''}
      `}
    >
      {/* hover sheen */}
      <span className="pointer-events-none absolute inset-0 opacity-0 group-hover/cell:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/40 via-transparent to-transparent" />

      {majorFestival && (
        <span className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-saffron-400 via-orange-500 to-saffron-400" />
      )}

      {/* Date number */}
      <div className="relative flex items-start justify-between mb-1">
        <span
          className={`
            text-base font-bold leading-none rounded-full w-8 h-8 flex items-center justify-center transition-transform duration-300 group-hover/cell:scale-110
            ${cell.isToday ? 'bg-gradient-to-br from-saffron-500 to-saffron-600 text-white shadow-md' : isSelected ? 'bg-saffron-100 text-saffron-700' : 'text-earth-900'}
          `}
        >
          {cell.date.getDate()}
        </span>
        <span className={`text-base leading-none mt-0.5 ${p.isPurnima || p.isAmavasya ? 'opacity-100' : 'opacity-45'}`}>
          {getPakshaGradient(p.elongation)}
        </span>
      </div>

      {/* Tithi name */}
      <div className="relative text-[11px] font-semibold text-earth-700 leading-tight truncate">
        {p.tithiName}
      </div>

      {/* Nakshatra */}
      <div className="relative text-[10px] text-kashmir-600 leading-tight truncate mb-1">
        {p.nakshatra}
      </div>

      {/* Festival events */}
      {hasFestival && (
        <div className="relative space-y-0.5 mt-0.5">
          {p.festivals.slice(0, 2).map(ev => (
            <div
              key={ev.id}
              className="text-[9px] font-semibold leading-tight flex items-center gap-1 truncate rounded-full px-1.5 py-0.5"
              style={{ color: ev.color, backgroundColor: ev.color + '14' }}
            >
              <EventDot event={ev} />
              <span className="truncate">{ev.name.split('—')[0].trim()}</span>
            </div>
          ))}
          {p.festivals.length > 2 && (
            <div className="text-[9px] text-earth-400 pl-1">+{p.festivals.length - 2} more</div>
          )}
        </div>
      )}
    </button>
  );
}

const NATURE_STYLE: Record<'good' | 'bad' | 'neutral', { box: string; dot: string }> = {
  good:    { box: 'bg-green-50 border-green-200 text-green-800', dot: '#16a34a' },
  bad:     { box: 'bg-red-50 border-red-200 text-red-800',       dot: '#dc2626' },
  neutral: { box: 'bg-amber-50 border-amber-200 text-amber-800', dot: '#d97706' },
};

function DayTimings({ p, sun }: { p: DayPanchang; sun: SunTimes }) {
  const [showNight, setShowNight] = useState(false);
  const weekday = p.date.getDay();
  const periods = getInauspiciousPeriods(sun, weekday);
  const chog = getChoghadiya(sun, weekday);
  const list = chog ? (showNight ? chog.night : chog.day) : [];

  return (
    <div className="mb-4">
      <div className="text-xs font-semibold text-earth-700 mb-2 uppercase tracking-wide">Day Timings</div>

      {/* Inauspicious periods to avoid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[periods.rahu, periods.yamaganda, periods.gulika].map(
          (per) =>
            per && (
              <div key={per.name} className="rounded-xl bg-red-50 border border-red-100 p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-[10px] text-red-600 font-semibold uppercase tracking-wide">
                  <AlertTriangle size={10} /> {per.name}
                </div>
                <div className="text-[11px] text-red-800 font-medium mt-0.5 leading-tight tabular-nums">
                  {per.start} – {per.end}
                </div>
              </div>
            )
        )}
      </div>

      {/* Choghadiya */}
      {chog && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-earth-600 uppercase tracking-wide">Choghadiya</span>
            <div className="inline-flex rounded-lg border border-earth-200 overflow-hidden text-[10px] font-medium">
              <button
                onClick={() => setShowNight(false)}
                className={`px-2.5 py-0.5 transition-colors ${!showNight ? 'bg-saffron-500 text-white' : 'text-earth-600 hover:bg-saffron-50'}`}
              >
                Day
              </button>
              <button
                onClick={() => setShowNight(true)}
                className={`px-2.5 py-0.5 transition-colors ${showNight ? 'bg-saffron-500 text-white' : 'text-earth-600 hover:bg-saffron-50'}`}
              >
                Night
              </button>
            </div>
          </div>
          <div className="space-y-1">
            {list.map((c, i) => (
              <div
                key={i}
                title={c.meaning}
                className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[11px] ${NATURE_STYLE[c.nature].box}`}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: NATURE_STYLE[c.nature].dot }} />
                <span className="font-semibold w-14 flex-shrink-0">{c.name}</span>
                <span className="opacity-70 flex-1 truncate hidden sm:block">{c.meaning}</span>
                <span className="font-medium tabular-nums">{c.start} – {c.end}</span>
              </div>
            ))}
          </div>
          <div className="mt-1.5 flex items-center gap-3 text-[10px] text-earth-500">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-600" /> Good</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-600" /> Neutral</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-600" /> Avoid</span>
          </div>
        </div>
      )}
    </div>
  );
}

function PanchangPanel({ p, onClose, sun, locationName }: { p: DayPanchang; onClose: () => void; sun: SunTimes; locationName: string }) {
  const dateStr = p.date.toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const rows = [
    { label: 'Tithi', value: `${p.tithiName} (${p.pakshaLabel} Paksha, ${p.tithiNumber})`, icon: '🌙' },
    { label: 'Paksha', value: `${p.pakshaLabel} Paksha ${p.paksha === 'shukla' ? '(Bright Half)' : '(Dark Half)'}`, icon: p.paksha === 'shukla' ? '☀️' : '🌑' },
    { label: 'Nakshatra', value: `${p.nakshatra} (Pada ${p.nakshatraPada})`, icon: '⭐' },
    { label: 'Moon Rashi', value: p.moonRashi, icon: '♈' },
    { label: 'Yoga', value: p.yoga, icon: '🕉' },
    { label: 'Karana', value: p.karana, icon: '🪔' },
    { label: 'Vara', value: `${p.vara.name} (${p.vara.kashmiri}) — ${p.vara.deity}`, icon: '📅' },
    { label: 'KP Solar Month', value: `${p.kpMonthName} (${p.kpMonthKashmiri})`, icon: '🗓' },
    { label: 'Sapta Rishi Samvat', value: String(p.samvatYear), icon: '📜' },
    { label: 'Moon Phase', value: getPakshaGradient(p.elongation), icon: '' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-saffron-200 shadow-premium-xl overflow-hidden fade-in-up">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-saffron-600 to-saffron-700 px-4 py-3.5 flex items-start justify-between">
        <div className="pointer-events-none absolute -top-10 right-8 w-40 h-20 bg-white/15 blur-2xl" />
        <div className="relative z-10">
          <div className="text-white font-display font-bold text-base leading-tight">
            {dateStr}
          </div>
          <div className="text-saffron-200 text-xs mt-0.5 font-devanagari">
            {p.kpMonthName} {p.tithiNumber} — Samvat {p.samvatYear}
          </div>
        </div>
        <button
          onClick={onClose}
          className="relative z-10 p-1 rounded-full text-saffron-200 hover:text-white hover:bg-saffron-500 transition-colors flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-4">
        {/* Panchang grid */}
        <div className="grid grid-cols-1 gap-2 mb-4">
          {rows.map(row => (
            <div key={row.label} className="flex items-start gap-2 text-sm">
              <span className="w-5 text-center flex-shrink-0">{row.icon}</span>
              <span className="text-earth-500 w-28 flex-shrink-0 text-xs pt-0.5">{row.label}</span>
              <span className="text-earth-900 font-medium text-xs leading-tight">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Sunrise / Sunset */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-earth-700 uppercase tracking-wide">Sun Timings</span>
            <span className="text-[10px] text-earth-400 flex items-center gap-1">
              <MapPin size={10} /> {locationName}
            </span>
          </div>
          {sun.note === 'normal' ? (
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-2.5 text-center">
                <Sunrise size={16} className="mx-auto text-amber-500 mb-1" />
                <div className="font-display font-bold text-earth-900 text-sm leading-none">{sun.sunrise}</div>
                <div className="text-[10px] text-earth-500 mt-1">Sunrise</div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-orange-50 to-rose-50 border border-orange-100 p-2.5 text-center">
                <Sunset size={16} className="mx-auto text-orange-500 mb-1" />
                <div className="font-display font-bold text-earth-900 text-sm leading-none">{sun.sunset}</div>
                <div className="text-[10px] text-earth-500 mt-1">Sunset</div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-saffron-50 to-amber-50 border border-saffron-100 p-2.5 text-center">
                <Sun size={16} className="mx-auto text-saffron-500 mb-1" />
                <div className="font-display font-bold text-earth-900 text-sm leading-none">{sun.dayLength}</div>
                <div className="text-[10px] text-earth-500 mt-1">Day Length</div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 text-center">
              {sun.note === 'no-sunrise' ? 'Polar night — sun does not rise at this location/date.' : 'Midnight sun — sun does not set at this location/date.'}
            </div>
          )}
        </div>

        {/* Day timings: Rahu/Yama/Gulika + Choghadiya */}
        {sun.note === 'normal' && <DayTimings p={p} sun={sun} />}

        {/* Festivals */}
        {p.festivals.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-earth-700 mb-2 uppercase tracking-wide">
              Festivals & Observances
            </div>
            <div className="space-y-2">
              {p.festivals.map(ev => (
                <div
                  key={ev.id}
                  className="rounded-xl p-3 border"
                  style={{ borderColor: ev.color + '40', backgroundColor: ev.color + '10' }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-bold uppercase tracking-wide"
                      style={{ color: ev.color }}
                    >
                      {ev.type === 'major' ? '★ Major' : ev.type === 'monthly' ? '◉ Monthly' : ev.type === 'vrat' ? '⊛ Vrat' : ev.type === 'solar' ? '☀ Solar' : '◎ Auspicious'}
                    </span>
                    {ev.uniqueToKP && (
                      <span className="text-[9px] bg-saffron-100 text-saffron-700 px-1.5 py-0.5 rounded-full font-semibold uppercase">
                        KP Unique
                      </span>
                    )}
                  </div>
                  <div className="font-display font-semibold text-earth-900 text-sm">{ev.name}</div>
                  <div className="font-devanagari text-saffron-600 text-xs mb-1">{ev.kashmiri}</div>
                  <p className="text-earth-600 text-xs leading-relaxed">{ev.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() =>
                        downloadICS({
                          title: ev.name,
                          description: `${ev.kashmiri} — ${ev.description}`,
                          date: p.date,
                          location: locationName,
                        })
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-ui font-medium text-saffron-700 hover:text-saffron-900 bg-white/70 border border-saffron-200 rounded-full px-2.5 py-1.5 hover:bg-white transition-colors"
                    >
                      <CalendarPlus size={13} /> Add to Calendar
                    </button>
                    <SaveDayButton
                      item={{ id: `festival-${ev.id}`, kind: 'festival', title: ev.name, kashmiri: ev.kashmiri, eventId: ev.id }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Auspiciousness */}
        <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
          <div className="text-xs font-semibold text-amber-800 mb-1">KP Panchang Note</div>
          <div className="text-xs text-amber-700 space-y-0.5">
            {p.isAmavasya && <p>• Amavasya — day of ancestor veneration. Avoid new beginnings.</p>}
            {p.isPurnima && <p>• Purnima — highly auspicious. Sacred bathing, charity, prayers.</p>}
            {p.isEkadashi && <p>• Ekadashi — fasting day. Auspicious for Vishnu worship.</p>}
            {p.isAshtami && <p>• Ashtami — Sharika Devi worship. Sindoor and marigold offerings.</p>}
            {p.isChaturdashi && <p>• Chaturdashi — monthly Shivaratri. Evening Shiva puja.</p>}
            {!p.isAmavasya && !p.isPurnima && !p.isEkadashi && !p.isAshtami && !p.isChaturdashi && (
              <p>• Regular day as per KP Panchang. Consult a KP scholar for muhurat guidance.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TodayPanchangBar({ p, sun }: { p: DayPanchang; sun: SunTimes }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-earth-900 via-[#5a2f17] to-earth-900 text-white rounded-3xl p-5 mb-6 shadow-premium-lg ring-1 ring-saffron-500/20">
      {/* soft glow accent */}
      <div className="pointer-events-none absolute -top-16 right-10 w-64 h-32 bg-saffron-500/15 blur-3xl" />
      <div className="relative flex flex-wrap items-center gap-x-6 gap-y-3 [&>div]:relative [&>div:not(:first-child)]:pl-6 [&>div:not(:first-child)]:before:absolute [&>div:not(:first-child)]:before:left-0 [&>div:not(:first-child)]:before:top-1/2 [&>div:not(:first-child)]:before:-translate-y-1/2 [&>div:not(:first-child)]:before:h-8 [&>div:not(:first-child)]:before:w-px [&>div:not(:first-child)]:before:bg-white/10">
        <div className="flex items-center gap-2">
          <span className="text-saffron-400 text-lg">{getPakshaGradient(p.elongation)}</span>
          <div>
            <div className="text-xs text-earth-400 uppercase tracking-wide">Today's Tithi</div>
            <div className="text-saffron-300 font-display font-semibold text-sm">
              {p.tithiName} · {p.pakshaLabel} {p.tithiNumber}
            </div>
          </div>
        </div>
        <div>
          <div className="text-xs text-earth-400 uppercase tracking-wide">Nakshatra</div>
          <div className="text-white font-semibold text-sm">{p.nakshatra} P{p.nakshatraPada}</div>
        </div>
        <div>
          <div className="text-xs text-earth-400 uppercase tracking-wide">Yoga</div>
          <div className="text-white font-semibold text-sm">{p.yoga}</div>
        </div>
        <div>
          <div className="text-xs text-earth-400 uppercase tracking-wide">Vara</div>
          <div className="text-white font-semibold text-sm">{p.vara.name}</div>
        </div>
        <div>
          <div className="text-xs text-earth-400 uppercase tracking-wide">KP Month</div>
          <div className="text-white font-semibold text-sm">
            {p.kpMonthName} <span className="font-devanagari text-saffron-300 text-xs">({p.kpMonthKashmiri})</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-earth-400 uppercase tracking-wide">Samvat</div>
          <div className="text-saffron-300 font-display font-bold text-sm">{p.samvatYear}</div>
        </div>
        {sun.note === 'normal' && (
          <>
            <div>
              <div className="text-xs text-earth-400 uppercase tracking-wide flex items-center gap-1">
                <Sunrise size={11} className="text-amber-300" /> Sunrise
              </div>
              <div className="text-white font-semibold text-sm">{sun.sunrise}</div>
            </div>
            <div>
              <div className="text-xs text-earth-400 uppercase tracking-wide flex items-center gap-1">
                <Sunset size={11} className="text-orange-300" /> Sunset
              </div>
              <div className="text-white font-semibold text-sm">{sun.sunset}</div>
            </div>
          </>
        )}
        {p.festivals.length > 0 && (
          <div>
            <div className="text-xs text-earth-400 uppercase tracking-wide">Today</div>
            <div className="flex flex-wrap gap-1">
              {p.festivals.slice(0, 3).map(ev => (
                <span
                  key={ev.id}
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: ev.color + '30', color: ev.color, border: `1px solid ${ev.color}50` }}
                >
                  {ev.name.split('—')[0].trim().split('/')[0].trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PakshaLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-earth-600 mb-4">
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-sm bg-amber-50 border border-amber-200 inline-block" />
        Shukla Paksha (bright half)
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-200 inline-block" />
        Krishna Paksha (dark half)
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-sm bg-blue-50 border border-blue-200 inline-block" />
        Purnima (full moon)
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-300 inline-block" />
        Amavasya (new moon)
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-sm bg-amber-50 border border-saffron-400 inline-block ring-1 ring-saffron-300" />
        Today
      </div>
    </div>
  );
}

function MiniMonthNav({
  year,
  month,
  onChange,
}: {
  year: number;
  month: number;
  onChange: (y: number, m: number) => void;
}) {
  const today = new Date();
  const header = getMonthHeaderInfo(year, month);

  return (
    <div className="bg-white border border-earth-100 rounded-2xl p-4 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg">
      <div className="text-center mb-3">
        {header.kpMonthName2 ? (
          <div className="font-devanagari text-saffron-500 text-sm">
            {header.kpMonthKashmiri} → {header.kpMonthKashmiri2}
          </div>
        ) : (
          <div className="font-devanagari text-saffron-500 text-sm">{header.kpMonthKashmiri}</div>
        )}
        <div className="font-display font-bold text-earth-900 text-base">
          {header.kpMonthName}{header.kpMonthName2 ? ` / ${header.kpMonthName2}` : ''}
        </div>
        <div className="text-earth-500 text-xs">Samvat {header.samvatYear}</div>
      </div>
      <div className="flex items-center justify-between text-xs text-earth-600 mb-2">
        <button
          onClick={() => onChange(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1)}
          className="p-1 hover:text-saffron-600 hover:bg-saffron-50 rounded"
        >
          ‹
        </button>
        <span className="font-semibold">{GREGORIAN_MONTHS[month]} {year}</span>
        <button
          onClick={() => onChange(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1)}
          className="p-1 hover:text-saffron-600 hover:bg-saffron-50 rounded"
        >
          ›
        </button>
      </div>
    </div>
  );
}

function MonthLegend({ year, month }: { year: number; month: number }) {
  // Show all KP months for context
  const header = getMonthHeaderInfo(year, month);
  return (
    <div className="bg-white border border-earth-100 rounded-2xl p-4 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg mt-4">
      <div className="text-xs font-semibold text-earth-700 uppercase tracking-wide mb-3">KP Months</div>
      <div className="space-y-1">
        {KP_MONTHS.map(m => (
          <div
            key={m.number}
            className={`flex items-center gap-2 px-2 py-1 rounded-lg text-xs ${
              m.number === header.kpSolarMonth || m.number === (header.kpMonthName2 ? KP_MONTHS.find(km => km.name === header.kpMonthName2)?.number : -1)
                ? 'bg-saffron-50 text-saffron-700 font-semibold' : 'text-earth-600'
            }`}
          >
            <span className="w-4 text-center text-earth-400">{m.number}</span>
            <span>{m.name}</span>
            <span className="font-devanagari text-saffron-400 text-[10px] ml-auto">{m.kashmiri}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingEvents({ cells }: { cells: CalendarDay[] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = cells
    .filter(c => c.date && c.panchang && c.date >= today && c.panchang.festivals.length > 0)
    .slice(0, 6);

  if (upcoming.length === 0) return null;

  return (
    <div className="bg-white border border-earth-100 rounded-2xl p-4 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg mt-4">
      <div className="text-xs font-semibold text-earth-700 uppercase tracking-wide mb-3">
        Upcoming This Month
      </div>
      <div className="space-y-2">
        {upcoming.map(c => (
          <div key={c.date!.toISOString()} className="text-xs">
            <div className="text-earth-500 text-[10px]">
              {c.date!.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            </div>
            {c.panchang!.festivals.slice(0, 2).map(ev => (
              <div key={ev.id} className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: ev.color }} />
                <span className="text-earth-800 font-medium leading-tight">{ev.name.split('—')[0].trim()}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function KPCalendarPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize to midnight so it matches calendar cell dates
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);

  // Sunrise/sunset follow the Kashmiri Pandit Panchang (Srinagar reference), not the user's location.
  const loc = KP_LOCATIONS[0];
  const cells = useMemo(() => buildMonthCalendar(viewYear, viewMonth), [viewYear, viewMonth]);
  const header = useMemo(() => getMonthHeaderInfo(viewYear, viewMonth), [viewYear, viewMonth]);
  const todayPanchang = useMemo(() => computeDayPanchang(today), []);
  const todaySun = useMemo(() => getSunTimes(today, loc.lat, loc.lng, loc.tz, loc.sunZenith, loc.sunsetZenith), [loc]);

  const selectedPanchang = useMemo(() => {
    if (!selectedDate) return null;
    const cell = cells.find(c => c.date?.getTime() === selectedDate.getTime());
    return cell?.panchang ?? null;
  }, [selectedDate, cells]);
  const selectedSun = useMemo(
    () => (selectedDate ? getSunTimes(selectedDate, loc.lat, loc.lng, loc.tz, loc.sunZenith, loc.sunsetZenith) : null),
    [selectedDate, loc]
  );

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }
  function goToday() {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDate(today);
  }

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-6">
      {/* Page header */}
      <div className="text-center mb-6">
        <div className="font-devanagari text-saffron-500 text-xl mb-1">कश्मीरी पंचांग</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-earth-900 mb-2">
          Kashmiri Pandit Panchang Calendar
        </h1>
        <p className="text-earth-600 max-w-2xl mx-auto text-sm">
          Full daily panchang — Tithi, Nakshatra, Yoga, Karana, Vara — as per{' '}
          <strong>Sapta Rishi Samvat (Laukika Samvat)</strong>. All festivals follow the{' '}
          <strong>KP Panchang</strong>, distinct from standard Hindu Panchang.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 glass-saffron border border-amber-200 rounded-2xl px-4 py-2 text-xs text-amber-900 shadow-sm">
          <span>⚠️</span>
          <span>
            Calculations use Jean Meeus astronomical formulas (Lahiri ayanamsa). For exact muhurat and ritual timing,
            always verify against the official <strong>Vijayeshwar Panchang</strong>.
          </span>
        </div>
      </div>

      {/* Today's panchang bar */}
      <TodayPanchangBar p={todayPanchang} sun={todaySun} />

      <div className="flex flex-col xl:flex-row gap-6">
        {/* ── Main calendar ─────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Month navigation */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <button
              onClick={prevMonth}
              className="no-print p-2 rounded-xl border border-earth-200 text-earth-600 hover:text-saffron-600 hover:border-saffron-300 hover:bg-saffron-50 hover:-translate-y-0.5 hover:shadow-premium transition-all duration-300 ease-premium active:translate-y-0"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex-1 text-center">
              <div className="font-display font-bold text-xl sm:text-2xl bg-gradient-to-r from-saffron-600 via-amber-600 to-saffron-700 bg-clip-text text-transparent">
                {GREGORIAN_MONTHS[viewMonth]} {viewYear}
              </div>
              <div className="flex items-center justify-center gap-2 mt-0.5 flex-wrap">
                {header.kpMonthName2 ? (
                  <>
                    <span className="font-devanagari text-saffron-500 text-sm">{header.kpMonthKashmiri}</span>
                    <span className="text-earth-400 text-xs">→</span>
                    <span className="font-devanagari text-saffron-500 text-sm">{header.kpMonthKashmiri2}</span>
                  </>
                ) : (
                  <>
                    <span className="font-devanagari text-saffron-500 text-sm">{header.kpMonthKashmiri}</span>
                    <span className="text-earth-400 text-xs">·</span>
                    <span className="text-earth-600 text-sm">{header.kpMonthName}</span>
                  </>
                )}
                <span className="text-earth-400 text-xs">·</span>
                <span className="text-earth-500 text-sm font-semibold">Samvat {header.samvatYear}</span>
              </div>
            </div>

            <button
              onClick={nextMonth}
              className="no-print p-2 rounded-xl border border-earth-200 text-earth-600 hover:text-saffron-600 hover:border-saffron-300 hover:bg-saffron-50 hover:-translate-y-0.5 hover:shadow-premium transition-all duration-300 ease-premium active:translate-y-0"
            >
              <ChevronRight size={18} />
            </button>

            <button
              onClick={goToday}
              className="no-print px-4 py-2 text-sm font-ui font-medium text-saffron-600 border border-saffron-300 rounded-xl hover:bg-saffron-50 hover:-translate-y-0.5 hover:shadow-premium transition-all duration-300 ease-premium active:translate-y-0"
            >
              Today
            </button>

            <button
              onClick={() => window.print()}
              className="no-print inline-flex items-center gap-1.5 px-4 py-2 text-sm font-ui font-medium text-earth-600 border border-earth-200 rounded-xl hover:text-saffron-600 hover:border-saffron-300 hover:bg-saffron-50 hover:-translate-y-0.5 hover:shadow-premium transition-all duration-300 ease-premium active:translate-y-0"
              title="Print or save this month as PDF"
            >
              <Printer size={16} /> Print
            </button>
          </div>

          {/* Legend */}
          <PakshaLegend />

          {/* Calendar frame */}
          <div className="rounded-3xl overflow-hidden shadow-premium-lg border border-saffron-100">
            {/* Weekday header strip */}
            <div className="grid grid-cols-7 bg-gradient-to-r from-earth-900 via-[#5a2f17] to-earth-900">
              {WEEKDAYS.map((d, i) => (
                <div
                  key={d}
                  className={`text-center text-[11px] font-ui font-semibold uppercase tracking-[0.14em] py-2.5 ${
                    i === 0 || i === 6 ? 'text-saffron-300' : 'text-amber-100/85'
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-2 p-2 sm:p-3 bg-gradient-to-b from-amber-50/50 to-white">
              {cells.map((cell, i) => (
                <DayCell
                  key={i}
                  cell={cell}
                  isSelected={!!(selectedDate && cell.date?.getTime() === selectedDate.getTime())}
                  onClick={() => {
                    if (cell.date) setSelectedDate(cell.date);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Panchang detail panel below calendar (mobile & desktop) */}
          {selectedPanchang && (
            <div className="no-print mt-4">
              <PanchangPanel
                p={selectedPanchang}
                onClose={() => setSelectedDate(null)}
                sun={selectedSun ?? getSunTimes(selectedPanchang.date, loc.lat, loc.lng, loc.tz, loc.sunZenith, loc.sunsetZenith)}
                locationName="KP Panchang"
              />
            </div>
          )}
        </div>

        {/* ── Right sidebar ─────────────────────────────────────────────── */}
        <div className="no-print xl:w-64 flex-shrink-0 space-y-0">
          <MiniMonthNav year={viewYear} month={viewMonth} onChange={(y, m) => { setViewYear(y); setViewMonth(m); }} />
          <MonthLegend year={viewYear} month={viewMonth} />
          <UpcomingEvents cells={cells} />

          {/* Panchang guide */}
          <div className="bg-white border border-earth-100 rounded-2xl p-4 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg mt-4">
            <div className="text-xs font-semibold text-earth-700 uppercase tracking-wide mb-3">
              Reading the Calendar
            </div>
            <div className="space-y-2 text-xs text-earth-600">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-sm bg-amber-50 border border-amber-200 inline-block mt-0.5 flex-shrink-0" />
                <span>Amber cells — Shukla Paksha (waxing / bright fortnight)</span>
              </div>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-200 inline-block mt-0.5 flex-shrink-0" />
                <span>Grey cells — Krishna Paksha (waning / dark fortnight)</span>
              </div>
              <div className="flex gap-2">
                <span>📅</span>
                <span>Each cell shows the Tithi name &amp; Nakshatra — tap for full details</span>
              </div>
              <div className="flex gap-2">
                <span>⭐</span>
                <span>Nakshatra of the day</span>
              </div>
              <div className="flex gap-2">
                <span>🌕</span>
                <span>Moon phase indicator</span>
              </div>
              <div className="mt-2 p-2 bg-amber-50 rounded-lg text-amber-700">
                <strong>KP Panchang</strong> (Sapta Rishi Samvat) differs from Vikram Samvat. Always consult a qualified KP scholar for muhurat and ritual timing.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Tithi reference */}
      <div className="no-print mt-8">
        <div className="kp-divider max-w-2xl mx-auto mb-6 px-8">
          <span className="text-saffron-400 text-xs font-display tracking-widest uppercase">Panchang Reference</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Tithis */}
          <Reveal className="bg-white border border-earth-100 rounded-2xl p-4 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg">
            <h3 className="font-display font-semibold text-earth-800 mb-3 flex items-center gap-2">
              <Moon size={14} className="text-saffron-500" /> Tithis (Lunar Days)
            </h3>
            <div className="grid grid-cols-2 gap-1">
              {[
                'Pratipada','Dwitiya','Tritiya','Chaturthi','Panchami',
                'Shashthi','Saptami','Ashtami','Navami','Dashami',
                'Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima/Amavasya',
              ].map((t, i) => (
                <div key={t} className="text-xs text-earth-600 flex gap-1">
                  <span className="text-saffron-400 font-bold">{i + 1}.</span> {t}
                </div>
              ))}
            </div>
          </Reveal>

          {/* Nakshatras */}
          <Reveal delay={80} className="bg-white border border-earth-100 rounded-2xl p-4 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg">
            <h3 className="font-display font-semibold text-earth-800 mb-3 flex items-center gap-2">
              <Star size={14} className="text-saffron-500" /> 27 Nakshatras
            </h3>
            <div className="grid grid-cols-2 gap-1">
              {[
                'Ashwini','Bharani','Krittika','Rohini','Mrigashirsha','Ardra',
                'Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni',
                'Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha',
                'Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha',
                'Purva Bhadrapada','Uttara Bhadrapada','Revati',
              ].map((n, i) => (
                <div key={n} className="text-xs text-earth-600 flex gap-1">
                  <span className="text-kashmir-400 font-bold">{i + 1}.</span> {n}
                </div>
              ))}
            </div>
          </Reveal>

          {/* KP Months + Yogas */}
          <Reveal delay={160} className="space-y-4">
            <div className="bg-white border border-earth-100 rounded-2xl p-4 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg">
              <h3 className="font-display font-semibold text-earth-800 mb-3 flex items-center gap-2">
                <Calendar size={14} className="text-saffron-500" /> KP Solar Months
              </h3>
              <div className="space-y-1">
                {KP_MONTHS.map(m => (
                  <div key={m.number} className="text-xs text-earth-600 flex gap-2">
                    <span className="text-saffron-400 font-bold w-4">{m.number}.</span>
                    <span>{m.name}</span>
                    <span className="font-devanagari text-saffron-400 ml-auto text-[10px]">{m.kashmiri}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-earth-100 rounded-2xl p-4 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg">
              <h3 className="font-display font-semibold text-earth-800 mb-3 flex items-center gap-2">
                <Sun size={14} className="text-saffron-500" /> Sapta Rishi Samvat
              </h3>
              <div className="text-xs text-earth-600 space-y-1">
                <p>Sapta Rishi Samvat = Gregorian Year + <strong>3076</strong></p>
                <p>Also called <em>Laukika Samvat</em></p>
                <p>~25 years ahead of Vikram Samvat</p>
                <p className="text-saffron-700 font-semibold mt-2">
                  Current year: {today.getFullYear()} CE = Samvat {today.getFullYear() + 3076}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
