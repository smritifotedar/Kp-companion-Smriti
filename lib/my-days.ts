// "My Days" — user-saved festivals & Janma Tithis, persisted in localStorage.
// Next-occurrence dates are recomputed live so saved items always stay current.

import { getUpcomingFestivals, findJanmaBirthday } from './kp-calendar';

export interface SavedDay {
  id: string;                       // stable unique key
  kind: 'festival' | 'janma';
  title: string;
  kashmiri?: string;
  // festival
  eventId?: string;
  // janma
  dob?: string;                     // yyyy-mm-dd
  time?: string;                    // HH:mm
}

const KEY = 'kp-my-days';

export function loadMyDays(): SavedDay[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function persist(list: SavedDay[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    // notify listeners in the same tab
    window.dispatchEvent(new Event('my-days-changed'));
  } catch {
    /* ignore */
  }
}

export function addMyDay(item: SavedDay): SavedDay[] {
  const list = loadMyDays();
  if (list.some((x) => x.id === item.id)) return list;
  const next = [...list, item];
  persist(next);
  return next;
}

export function removeMyDay(id: string): SavedDay[] {
  const next = loadMyDays().filter((x) => x.id !== id);
  persist(next);
  return next;
}

export function isSaved(id: string): boolean {
  return loadMyDays().some((x) => x.id === id);
}

/** Resolve the next upcoming Gregorian date for a saved item. */
export function resolveNextDate(item: SavedDay): Date | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (item.kind === 'festival' && item.eventId) {
    const up = getUpcomingFestivals(today, 14).find((f) => f.event.id === item.eventId);
    return up?.date ?? null;
  }

  if (item.kind === 'janma' && item.dob) {
    const [y, m, d] = item.dob.split('-').map(Number);
    const birth = new Date(y, m - 1, d);
    const [h, mn] = (item.time || '12:00').split(':').map(Number);
    const hour = h + (mn || 0) / 60;
    let res = findJanmaBirthday(birth, today.getFullYear(), hour);
    if (res.birthdayDate && res.birthdayDate < today) {
      res = findJanmaBirthday(birth, today.getFullYear() + 1, hour);
    }
    return res.birthdayDate ?? null;
  }

  return null;
}
