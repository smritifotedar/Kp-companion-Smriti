'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { geocode, resolveTimezone, type GeoCity } from '@/lib/geo';

export function CityAutocomplete({
  value,
  onSelect,
  placeholder = 'Search any city or town…',
}: {
  value: GeoCity | null;
  onSelect: (c: GeoCity | null) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState(value ? `${value.name}, ${value.region}` : '');
  const [results, setResults] = useState<GeoCity[]>([]);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const choose = async (c: GeoCity) => {
    setQuery(`${c.name}, ${c.region}`);
    setOpen(false);
    if (c.timezone) { onSelect(c); return; }
    // Outside India: resolve the precise IANA timezone before selecting.
    setResolving(true);
    const tz = await resolveTimezone(c.lat, c.lng);
    setResolving(false);
    onSelect({ ...c, timezone: tz || 'UTC' });
  };

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < 2) { setResults([]); setLoading(false); return; }
    setLoading(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const r = await geocode(q);
      setResults(r);
      setLoading(false);
    }, 350);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [query, open]);

  return (
    <div className="relative">
      <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); if (value) onSelect(null); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-3 rounded-xl border border-earth-200 bg-white/80 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100"
      />
      {(loading || resolving) && <Loader2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-saffron-400 animate-spin" />}

      {open && query.trim().length >= 2 && (
        <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-earth-200 rounded-xl shadow-premium-lg max-h-56 overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-earth-400">{loading ? 'Searching…' : 'No matches — try a nearby town or a different spelling.'}</div>
          ) : (
            results.map((c, i) => (
              <button
                key={`${c.name}-${c.lat}-${i}`}
                onMouseDown={(e) => { e.preventDefault(); choose(c); }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-saffron-50 text-earth-700"
              >
                {c.name} <span className="text-earth-400">· {c.region}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
