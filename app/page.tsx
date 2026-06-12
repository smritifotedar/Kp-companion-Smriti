import Link from 'next/link';
import { getSaptaRishiSamvat } from '@/lib/kp-panchang';
import { Calendar, BookOpen, Star, Clock, Archive, Users, MessageCircle, CalendarDays, GitFork, Music, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { TodayPanchangHero } from '@/components/home/TodayPanchangHero';

const currentYear = new Date().getFullYear();
const samvatYear = getSaptaRishiSamvat(currentYear);

const FEATURES = [
  {
    href: '/kp-calendar',
    icon: <CalendarDays size={24} />,
    title: 'KP Panchang Calendar',
    kashmiri: 'कश्मीरी पंचांग',
    description: 'Full daily Panchang — Tithi, Nakshatra, Yoga, Karana, Vara — for every day of the year. All festivals and observances per Sapta Rishi Samvat.',
    color: 'from-saffron-500 to-orange-600',
    tag: 'Full Panchang',
  },
  {
    href: '/festivals',
    icon: <Calendar size={24} />,
    title: 'Festival Calendar',
    kashmiri: 'त्योहार पंचांग',
    description: 'Navreh, Herath, Zyeth Atham and all KP festivals with complete rituals, significance, and preparations — per Sapta Rishi Samvat.',
    color: 'from-saffron-400 to-saffron-600',
    tag: 'Unique to KP',
  },
  {
    href: '/rituals',
    icon: <BookOpen size={24} />,
    title: 'Ritual Library',
    kashmiri: 'कर्मकांड ज्ञान',
    description: 'Comprehensive encyclopedia of Kashmiri Pandit rituals — Devgon, Herath, Lagan, Shraddha, and more.',
    color: 'from-kashmir-500 to-kashmir-700',
    tag: 'Scholar Reviewed',
  },
  {
    href: '/bhajans',
    icon: <Music size={24} />,
    title: 'Bhajans & Wanwun',
    kashmiri: 'भजन ते वनवुन',
    description: 'KP devotional music — leelas, stotras, the vakhs of Lal Ded & Roopa Bhawani, and ceremonial wanwun.',
    color: 'from-pink-500 to-rose-700',
    tag: 'Living Heritage',
  },
  {
    href: '/janma-tithi',
    icon: <Star size={24} />,
    title: 'Janma Tithi Finder',
    kashmiri: 'जन्म तिथि',
    description: 'Find your Tithi, Nakshatra, and Rashi as per the Kashmiri Pandit Panchang. Get yearly reminders.',
    color: 'from-amber-500 to-orange-600',
    tag: 'KP Panchang',
  },
  {
    href: '/horoscope',
    icon: <Sparkles size={24} />,
    title: 'Daily Horoscope',
    kashmiri: 'राशिफल',
    description: 'Today\'s guidance for all twelve Rashis — lucky colour, number, mood and energy.',
    color: 'from-violet-500 to-fuchsia-700',
    tag: 'Updated Daily',
  },
  {
    href: '/muhurat',
    icon: <Clock size={24} />,
    title: 'Muhurat Finder',
    kashmiri: 'मुहूर्त',
    description: 'Find auspicious timings for vehicle purchase, gold, new business, home entry, and more.',
    color: 'from-green-600 to-emerald-700',
    tag: 'Daily Use',
  },
  {
    href: '/gotra-finder',
    icon: <GitFork size={24} />,
    title: 'Gotra Finder',
    kashmiri: 'गोत्र',
    description: 'Find the gotra(s) commonly associated with your Kashmiri Pandit surname (kram).',
    color: 'from-rose-500 to-pink-700',
    tag: 'Lineage',
  },
  {
    href: '/heritage',
    icon: <Users size={24} />,
    title: 'Family Heritage',
    kashmiri: 'कुल परंपरा',
    description: 'Preserve your family\'s Gotra, Kuldevta, native village, and unique traditions for future generations.',
    color: 'from-earth-500 to-earth-700',
    tag: 'Your Legacy',
  },
  {
    href: '/archive',
    icon: <Archive size={24} />,
    title: 'KP Knowledge Archive',
    kashmiri: 'ज्ञान भंडार',
    description: 'Articles, oral histories, temple information, and cultural essays preserving Kashmiri Pandit heritage.',
    color: 'from-indigo-500 to-indigo-700',
    tag: 'Living Archive',
  },
  {
    href: '/knowledge-guide',
    icon: <MessageCircle size={24} />,
    title: 'AI Knowledge Guide',
    kashmiri: 'ज्ञान साथी',
    description: 'Ask questions about KP traditions in plain language. Powered by AI, grounded in authentic KP knowledge.',
    color: 'from-violet-500 to-purple-700',
    tag: 'AI Powered',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-orange-50/60 to-cream py-20 sm:py-28">
        {/* Decorative aurora blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-saffron-200/40 blur-3xl animate-float" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-200/40 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full bg-orange-100/30 blur-3xl" />
          {/* Faint mandala ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full border border-saffron-200/40 animate-spin-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[760px] rounded-full border border-saffron-100/40" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Om symbol */}
          <div className="flex justify-center mb-7 fade-in-up">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-700 flex items-center justify-center shadow-xl sacred-glow-pulse ring-4 ring-white/50">
              <span className="text-white text-5xl font-devanagari leading-none">ॐ</span>
            </div>
          </div>

          {/* Sanskrit greeting */}
          <div className="font-devanagari text-saffron-600 text-lg mb-3 tracking-wide fade-in-up">
            स्वागतम् • ज्ञानस्य द्वारम्
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-earth-900 mb-5 leading-[1.1] fade-in-up">
            Kashmiri Pandit
            <span className="block bg-gradient-to-r from-saffron-500 via-saffron-600 to-amber-600 bg-clip-text text-transparent animate-gradient">
              Digital Companion
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-earth-600 max-w-3xl mx-auto mb-5 font-body leading-relaxed fade-in-up">
            Your trusted digital guide to Kashmiri Pandit traditions, festivals, and heritage.
            Grounded in the <strong>Sapta Rishi Samvat</strong> — the authentic Kashmiri Pandit Panchang.
          </p>

          {/* Current Samvat */}
          <div className="inline-flex items-center gap-3 glass border border-saffron-200 rounded-full px-6 py-2.5 shadow-premium mb-7 fade-in-up">
            <span className="text-saffron-700 text-sm font-ui font-medium">Sapta Rishi Samvat</span>
            <span className="w-1 h-1 rounded-full bg-saffron-400" />
            <span className="font-display text-earth-800 font-bold text-lg">{samvatYear}</span>
            <span className="text-earth-300 text-sm">|</span>
            <span className="text-earth-500 text-sm font-ui">{currentYear} CE</span>
          </div>

          {/* Notice about KP Panchang */}
          <div className="mx-auto inline-block glass-saffron border border-amber-200 rounded-2xl px-5 py-3 text-sm text-amber-900 max-w-xl shadow-sm fade-in-up">
            <strong>🗓 Note:</strong> All dates and festivals on this platform follow the{' '}
            <strong>Kashmiri Pandit Panchang</strong> (Sapta Rishi / Laukika Samvat), not the standard Hindu Panchang.
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-9 fade-in-up">
            <Link href="/festivals" className="btn-primary px-8 py-3.5 text-sm">
              Explore Festivals
            </Link>
            <Link
              href="/knowledge-guide"
              className="px-8 py-3.5 bg-white/80 backdrop-blur text-saffron-700 border-2 border-saffron-300 font-semibold rounded-full shadow-sm hover:bg-white hover:border-saffron-400 hover:-translate-y-0.5 transition-all text-sm"
            >
              Ask Knowledge Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Today's panchang + next festival countdown */}
      <TodayPanchangHero />

      {/* Divider */}
      <div className="kp-divider max-w-2xl mx-auto my-10 px-8">
        <span className="text-saffron-500 text-sm font-display tracking-[0.2em] uppercase">Our Features</span>
      </div>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.href} delay={(i % 4) * 80}>
              <Link
                href={feature.href}
                className="kp-card card-ring relative overflow-hidden bg-white rounded-3xl border border-earth-100 p-6 shadow-premium hover:border-saffron-200 group shine-on-hover flex flex-col h-full"
              >
                {/* Gradient icon bg */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 ease-premium`}>
                  {feature.icon}
                </div>

                {/* Tag */}
                <div className="festival-badge bg-saffron-50 text-saffron-700 mb-3">
                  {feature.tag}
                </div>

                <h3 className="font-display font-semibold text-earth-900 text-base mb-1">
                  {feature.title}
                </h3>
                <div className="font-devanagari text-saffron-500 text-sm mb-2">
                  {feature.kashmiri}
                </div>
                <p className="text-earth-600 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Arrow */}
                <div className="mt-4 inline-flex items-center gap-1 text-saffron-400 group-hover:text-saffron-600 transition-all text-sm font-ui font-medium">
                  <span className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all">Open</span>
                  <span className="group-hover:translate-x-1 transition-transform text-lg">→</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Scholar note */}
      <section className="relative bg-gradient-to-b from-earth-900 to-[#4a2512] py-16 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-40 bg-saffron-500/10 blur-3xl" />
        </div>
        <Reveal className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-saffron-400 text-4xl mb-4 animate-float">🙏</div>
          <h2 className="font-display text-3xl text-white mb-3">Guided by Scholars</h2>
          <p className="text-earth-300 leading-relaxed max-w-2xl mx-auto">
            This platform is designed to complement, not replace, guidance from respected Kashmiri Pandit scholars and priests.
            All content is intended to be reviewed and validated by community scholars. For major life decisions and
            rituals, always consult a qualified Kashmiri Pandit priest.
          </p>
          <div className="mt-6 font-devanagari text-saffron-400 text-lg">
            आचार्यात् पादमादत्ते पादं शिष्यः स्वमेधया
          </div>
          <div className="text-earth-500 text-sm mt-1 italic">
            &ldquo;A quarter comes from the teacher, a quarter through one&apos;s own intelligence&rdquo;
          </div>
        </Reveal>
      </section>
    </div>
  );
}
