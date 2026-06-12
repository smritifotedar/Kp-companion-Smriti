import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative mt-16 text-earth-200 bg-gradient-to-b from-earth-900 to-[#4a2512] overflow-hidden">
      {/* Decorative top hairline */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-saffron-500/60 to-transparent" />
      {/* Soft glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[40rem] h-48 bg-saffron-500/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center shadow-md">
                <span className="text-xl leading-none">🕉</span>
              </div>
              <div>
                <div className="font-display font-bold text-saffron-300 text-sm">KP Digital Companion</div>
                <div className="font-ui text-[10px] text-earth-400 tracking-[0.18em] uppercase">Sapta Rishi Samvat</div>
              </div>
            </div>
            <p className="text-sm text-earth-400 leading-relaxed">
              Preserving Kashmiri Pandit heritage through technology. Guided by scholars, for all generations.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-ui text-saffron-300 text-xs font-semibold mb-4 tracking-[0.14em] uppercase">Features</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/festivals', label: 'Festival Calendar' },
                { href: '/rituals', label: 'Ritual Library' },
                { href: '/bhajans', label: 'Bhajans & Wanwun' },
                { href: '/janma-tithi', label: 'Janma Tithi Finder' },
                { href: '/my-days', label: 'My Days' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-earth-400 hover:text-saffron-300 transition-colors group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-saffron-400 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <h3 className="font-ui text-saffron-300 text-xs font-semibold mb-4 tracking-[0.14em] uppercase">More</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/muhurat', label: 'Muhurat Finder' },
                { href: '/horoscope', label: 'Daily Horoscope' },
                { href: '/gotra-finder', label: 'Gotra Finder' },
                { href: '/heritage', label: 'Family Heritage' },
                { href: '/archive', label: 'KP Archive' },
                { href: '/knowledge-guide', label: 'AI Knowledge Guide' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-earth-400 hover:text-saffron-300 transition-colors group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-saffron-400 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Panchang note */}
          <div>
            <h3 className="font-ui text-saffron-300 text-xs font-semibold mb-4 tracking-[0.14em] uppercase">Panchang</h3>
            <p className="text-sm text-earth-400 leading-relaxed">
              This platform uses the <strong className="text-earth-200">Sapta Rishi Samvat</strong> (Laukika Samvat), the traditional Kashmiri Pandit calendar, distinct from the standard Vikram Samvat.
            </p>
            <div className="mt-4 p-4 rounded-2xl bg-earth-800/60 border border-earth-700/60 backdrop-blur-sm">
              <div className="text-xs text-earth-400 font-ui tracking-wide">Current Samvat</div>
              <div className="font-display text-saffron-300 text-2xl font-bold leading-tight">
                {new Date().getFullYear() + 3076}
              </div>
              <div className="text-xs text-earth-500">Sapta Rishi Samvat</div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-earth-700/70 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-earth-500">
            © {new Date().getFullYear()} KP Digital Companion. Content guided by Kashmiri Pandit scholars.
          </p>
          <p className="text-xs text-earth-500 font-devanagari text-center">
            ॐ नमः शिवाय • यत्र नार्यस्तु पूज्यन्ते रमन्ते तत्र देवताः
          </p>
        </div>
      </div>
    </footer>
  );
}
