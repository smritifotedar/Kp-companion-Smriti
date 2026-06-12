'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Back-to-top button that fades in after scrolling down.
 * (The scroll-progress bar was removed by request.)
 */
export function ScrollProgress() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(document.documentElement.scrollTop > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`no-print fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-gradient-to-br from-saffron-500 to-saffron-600 text-white shadow-premium-lg flex items-center justify-center transition-all duration-300 ease-premium hover:shadow-glow-saffron hover:-translate-y-1 active:translate-y-0 ${
        showTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      <ArrowUp size={18} />
    </button>
  );
}
