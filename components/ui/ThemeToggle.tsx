'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    const root = document.documentElement;
    root.classList.toggle('dark', next);
    try {
      localStorage.setItem('kp-theme', next ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className="relative p-2 rounded-lg text-earth-600 hover:text-saffron-600 hover:bg-saffron-50 transition-colors"
    >
      {/* Render a stable icon until mounted to avoid hydration mismatch */}
      {!mounted ? (
        <Moon size={18} />
      ) : dark ? (
        <Sun size={18} className="text-saffron-400" />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}
