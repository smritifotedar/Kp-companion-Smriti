'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface NavLeaf { label: string; href: string }
interface NavItem { label: string; href?: string; children?: NavLeaf[] }

const NAV: NavItem[] = [
  { label: 'Panchang', href: '/kp-calendar' },
  { label: 'Festivals', href: '/festivals' },
  {
    label: 'Horoscope',
    children: [
      { label: "Today's Horoscope", href: '/horoscope?period=daily' },
      { label: "Tomorrow's Horoscope", href: '/horoscope?period=tomorrow' },
      { label: "Yesterday's Horoscope", href: '/horoscope?period=yesterday' },
      { label: 'Weekly Horoscope', href: '/horoscope?period=weekly' },
      { label: 'Monthly Horoscope', href: '/horoscope?period=monthly' },
      { label: 'Yearly Horoscope', href: '/horoscope?period=yearly' },
    ],
  },
  {
    label: 'Tools',
    children: [
      { label: 'Kundli (Birth Chart)', href: '/kundli' },
      { label: 'Kundli Matching', href: '/kundli-matching' },
      { label: 'Numerology', href: '/numerology' },
      { label: 'Muhurat Finder', href: '/muhurat' },
      { label: 'Janma Tithi', href: '/janma-tithi' },
      { label: 'Gotra Finder', href: '/gotra-finder' },
      { label: 'Events & Reminders', href: '/events' },
      { label: 'My Days', href: '/my-days' },
    ],
  },
  {
    label: 'Culture',
    children: [
      { label: 'Rituals', href: '/rituals' },
      { label: 'Bhajans & Wanwun', href: '/bhajans' },
      { label: 'Heritage', href: '/heritage' },
      { label: 'KP Archive', href: '/archive' },
    ],
  },
  { label: 'Community', href: '/community' },
  { label: 'Ask Guide', href: '/knowledge-guide' },
];

const base = (href: string) => href.split('?')[0];

function DesktopItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);

  if (!item.children) {
    const active = pathname === item.href;
    return (
      <Link
        href={item.href!}
        className={cn(
          'font-ui px-3 py-2 text-sm font-medium rounded-lg transition-colors',
          active ? 'text-saffron-700 bg-saffron-100/70' : 'text-earth-700 hover:text-saffron-600 hover:bg-saffron-50'
        )}
      >
        {item.label}
      </Link>
    );
  }

  const active = item.children.some((c) => pathname === base(c.href));
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'font-ui px-3 py-2 text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-1',
          active || open ? 'text-saffron-700 bg-saffron-100/70' : 'text-earth-700 hover:text-saffron-600 hover:bg-saffron-50'
        )}
      >
        {item.label}
        <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      <div
        className={cn(
          'absolute left-0 top-full pt-2 w-56 origin-top transition-all duration-200 ease-premium',
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
        )}
      >
        <div className="glass-saffron rounded-2xl border border-saffron-200 shadow-premium-lg p-2">
          {item.children.map((c) => {
            const cActive = pathname === base(c.href);
            return (
              <Link
                key={c.href}
                href={c.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-xl text-sm font-ui transition-colors',
                  cActive ? 'text-saffron-700 bg-white shadow-sm' : 'text-earth-700 hover:text-saffron-700 hover:bg-white/70'
                )}
              >
                {c.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 glass-saffron border-b border-saffron-200/70 shadow-premium transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center shadow-md group-hover:shadow-glow-saffron transition-all duration-300 group-hover:scale-105">
              <span className="absolute inset-0 rounded-full ring-1 ring-white/40" />
              <span className="text-white text-xl leading-none">🕉</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-bold text-saffron-700 text-sm leading-tight tracking-wide">KP Digital</div>
              <div className="font-ui text-[10px] text-earth-500 tracking-[0.2em] uppercase">Companion</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => (
              <DesktopItem key={item.label} item={item} pathname={pathname} />
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-earth-600 hover:text-saffron-600 hover:bg-saffron-50 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-premium',
          isOpen ? 'max-h-[40rem] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="glass-saffron border-t border-saffron-100 shadow-premium-lg px-4 py-3 space-y-3 max-h-[36rem] overflow-y-auto">
          {NAV.map((item) => (
            <div key={item.label}>
              {item.href ? (
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'block px-3 py-2 rounded-xl text-sm font-ui font-semibold',
                    pathname === item.href ? 'text-saffron-700 bg-white shadow-sm' : 'text-earth-800 hover:bg-white/70'
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <>
                  <div className="px-3 pt-1 pb-1 text-[11px] font-ui font-semibold uppercase tracking-wider text-saffron-600">
                    {item.label}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {item.children!.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'block px-3 py-2 rounded-xl text-sm font-ui',
                          pathname === base(c.href) ? 'text-saffron-700 bg-white shadow-sm' : 'text-earth-700 hover:bg-white/70'
                        )}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
