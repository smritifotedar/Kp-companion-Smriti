'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { addMyDay, removeMyDay, isSaved, type SavedDay } from '@/lib/my-days';

export function SaveDayButton({
  item,
  variant = 'light',
}: {
  item: SavedDay;
  variant?: 'light' | 'dark';
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isSaved(item.id));
    const sync = () => setSaved(isSaved(item.id));
    window.addEventListener('my-days-changed', sync);
    return () => window.removeEventListener('my-days-changed', sync);
  }, [item.id]);

  const toggle = () => {
    if (saved) {
      removeMyDay(item.id);
      setSaved(false);
    } else {
      addMyDay(item);
      setSaved(true);
    }
  };

  const base =
    'inline-flex items-center gap-1.5 text-xs font-ui font-medium rounded-full px-3 py-1.5 transition-colors';
  const styles = saved
    ? 'bg-saffron-500 text-white border border-saffron-500'
    : variant === 'dark'
    ? 'text-white bg-white/15 border border-white/20 hover:bg-white/25'
    : 'text-saffron-700 bg-white/70 border border-saffron-200 hover:bg-white';

  return (
    <button onClick={toggle} className={`${base} ${styles}`} aria-pressed={saved}>
      {saved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
