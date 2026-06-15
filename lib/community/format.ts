export function timeAgo(iso: string): string {
  const d = new Date(iso).getTime();
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24); if (days < 7) return `${days}d ago`;
  const w = Math.floor(days / 7); if (w < 5) return `${w}w ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const TYPE_BADGE: Record<string, string> = {
  question: 'bg-blue-100 text-blue-700',
  discussion: 'bg-saffron-100 text-saffron-700',
  story: 'bg-rose-100 text-rose-700',
};
