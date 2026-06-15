// "Events & Reminders" — user-entered birthdays / anniversaries / custom events,
// persisted in localStorage (no backend, no login). Birthdays can be observed by the
// Kashmiri Pandit Panchang (Janma Tithi) so the reminder lands on the lunar birthday.
// Next-occurrence dates are recomputed live so saved items always stay current.

import { findJanmaBirthday } from './kp-calendar';

export type EventType = 'birthday' | 'anniversary' | 'custom';

export interface SavedEvent {
  id: string;
  type: EventType;
  name: string;            // person's name (birthday/anniversary) or event title (custom)
  relation?: string;       // e.g. "Father", "Sister", "Friend"
  date: string;            // yyyy-mm-dd — DOB / wedding date / event date
  time?: string;           // HH:mm — birth time (optional, sharpens the Janma Tithi)
  byPanchang: boolean;     // observe by KP Janma Tithi (true) vs the fixed Gregorian date (false)
  yearly: boolean;         // recurs every year (birthdays & anniversaries)
  reminderDays: number;    // remind this many days before (0 = on the day)
  note?: string;
  createdAt: number;
}

export interface BirthInfo {
  tithi: string;
  paksha: string;
  nakshatra: string;
  pada: number;
  rashi: string;
  lunarMonth: string;
}

export interface ResolvedEvent {
  event: SavedEvent;
  nextDate: Date | null;   // next upcoming occurrence (Gregorian)
  daysUntil: number;       // whole days from today (0 = today, negative = past)
  exact?: boolean;         // for panchang birthdays — was the exact tithi found this year
  birthInfo?: BirthInfo;   // panchang the person was born under (for cards & display)
}

const KEY = 'kp-events';

export function loadEvents(): SavedEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function persist(list: SavedEvent[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('kp-events-changed'));
  } catch {
    /* ignore */
  }
}

export function addEvent(item: SavedEvent): SavedEvent[] {
  const next = [...loadEvents(), item];
  persist(next);
  return next;
}

export function removeEvent(id: string): SavedEvent[] {
  const next = loadEvents().filter((x) => x.id !== id);
  persist(next);
  return next;
}

function startOfToday(): Date {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

function birthInfoFrom(p: { tithiName: string; pakshaLabel: string; nakshatra: string; nakshatraPada: number; moonRashi: string; kpLunarMonthName: string }): BirthInfo {
  return {
    tithi: p.tithiName,
    paksha: p.pakshaLabel,
    nakshatra: p.nakshatra,
    pada: p.nakshatraPada,
    rashi: p.moonRashi,
    lunarMonth: p.kpLunarMonthName,
  };
}

/** Resolve the next upcoming Gregorian date (and panchang details) for a saved event. */
export function resolveEvent(ev: SavedEvent, from: Date = startOfToday()): ResolvedEvent {
  // Birthday/anniversary observed by the KP Panchang → use the Janma Tithi.
  if (ev.byPanchang && (ev.type === 'birthday' || ev.type === 'anniversary')) {
    const birth = parseDate(ev.date);
    const [h, mn] = (ev.time || '12:00').split(':').map(Number);
    const hour = h + (mn || 0) / 60;
    let res = findJanmaBirthday(birth, from.getFullYear(), hour);
    if (!res.birthdayDate || res.birthdayDate < from) {
      res = findJanmaBirthday(birth, from.getFullYear() + 1, hour);
    }
    const nextDate = res.birthdayDate;
    return {
      event: ev,
      nextDate,
      daysUntil: nextDate ? Math.round((nextDate.getTime() - from.getTime()) / 86400000) : 0,
      exact: res.exact,
      birthInfo: birthInfoFrom(res.birth),
    };
  }

  // Fixed Gregorian date (yearly or one-off).
  const base = parseDate(ev.date);
  let nextDate = base;
  if (ev.yearly) {
    nextDate = new Date(from.getFullYear(), base.getMonth(), base.getDate());
    nextDate.setHours(0, 0, 0, 0);
    if (nextDate < from) nextDate = new Date(from.getFullYear() + 1, base.getMonth(), base.getDate());
  }
  return {
    event: ev,
    nextDate,
    daysUntil: Math.round((nextDate.getTime() - from.getTime()) / 86400000),
  };
}

/** All saved events resolved + sorted by next occurrence. Past one-offs are dropped. */
export function resolveAll(from: Date = startOfToday()): ResolvedEvent[] {
  return loadEvents()
    .map((e) => resolveEvent(e, from))
    .filter((r) => r.nextDate !== null && !( !r.event.yearly && r.daysUntil < 0))
    .sort((a, b) => (a.nextDate!.getTime() - b.nextDate!.getTime()));
}

export function formatCountdown(daysUntil: number): string {
  if (daysUntil < 0) return `${Math.abs(daysUntil)} day${Math.abs(daysUntil) === 1 ? '' : 's'} ago`;
  if (daysUntil === 0) return 'Today';
  if (daysUntil === 1) return 'Tomorrow';
  if (daysUntil < 7) return `in ${daysUntil} days`;
  if (daysUntil < 30) return `in ${Math.round(daysUntil / 7)} week${Math.round(daysUntil / 7) === 1 ? '' : 's'}`;
  return `in ${Math.round(daysUntil / 30)} month${Math.round(daysUntil / 30) === 1 ? '' : 's'}`;
}

export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
