# 🕉 Kashmiri Pandit Digital Companion

A modern, premium web platform for the **Kashmiri Pandit (KP) community** — a complete Panchang, festival, ritual, and heritage companion built on the **Sapta Rishi Samvat (Laukika Samvat)**, the traditional Kashmiri calendar.

> All dates, festivals and timings follow the **Kashmiri Pandit Panchang**, which is distinct from the standard Hindu (Vikram Samvat) Panchang.

🔗 **Repo:** https://github.com/smritifotedar/Kp-companion-Smriti

---

## ✨ Features

### 🗓 KP Panchang Calendar
- Full daily Panchang — **Tithi, Nakshatra, Yoga, Karana, Vara** — for every day, per Sapta Rishi Samvat.
- **Sunrise & Sunset** calibrated to the **Kashmiri Jantri** (mountain-horizon model for the Kashmir valley, with asymmetric east/west ridgelines).
- **Rahu Kaal, Yamaganda, Gulika Kaal** and full **day/night Choghadiya**.
- KP festivals & observances (Navreh, Herath, Zyeth Atham, Sharika Ashtami, Sangrandan…), with dual KP-month headers.
- **Add to Calendar (.ics)** for any festival, and **Print / Save-as-PDF** for the month.
- Moon-phase glyphs, festival ribbons, and a framed premium layout.

### 🔭 Tools
- **Janma Tithi Finder** — birth Tithi/Nakshatra/Rashi and the Gregorian date of the lunar birthday for any chosen year, plus **Namakaran** naming syllables.
- **Muhurat Finder** — scan a date range for auspicious days by activity.
- **Gotra Finder** — look up the gotra(s) associated with a Kashmiri Pandit surname (kram), compiled from the ikashmir.net gotra list.
- **My Days** — save festivals & Janma Tithis with live countdowns and calendar export.

### 🎵 Culture
- **Bhajans & Wanwun** — devotional leelas, stotras, the vakhs of Lal Ded & Roopa Bhawani, ceremonial wanwun, and Kashmiri folk songs, with **inline YouTube playback**.
- **Festival Calendar**, **Ritual Library** (Devgon, Herath, Lagan, Yagnopavit, Shraddha…), **Family Heritage** records, and the **KP Knowledge Archive**.

### 🔮 Horoscope
- Daily / Weekly / Monthly sun-sign horoscope via a **live astrology API**, with app-generated guidance for other periods.

### 🤖 AI Knowledge Guide
- Ask about KP traditions; the assistant is grounded in KP knowledge and receives the **live KP date context** (today's Tithi, Nakshatra, Samvat year).

### 🎨 Experience
- Astrological **animated celestial background** (starfield, constellations, shooting stars, zodiac rings).
- **Dark "temple" mode**, scroll-reveal animations, premium hover/micro-interactions, fully responsive, with grouped dropdown navigation.

---

## 🛠 Tech Stack

- **Next.js** (App Router) · **React** · **TypeScript**
- **Tailwind CSS** (custom saffron/earth design system)
- **lucide-react** icons
- Astronomy via **Jean Meeus** algorithms with the **Lahiri / Chitrapaksha ayanamsa** — no external ephemeris dependency
- Live horoscope API · optional **Supabase** client scaffolding

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file (.env.local — see below)

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables (`.env.local`)

```env
# Required for the AI Knowledge Guide — free key from https://console.groq.com
GROQ_API_KEY=your_groq_api_key

# Optional — only if you wire up Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> `.env.local` is git-ignored and is **never** committed. Everything except the AI Guide works without any keys.

---

## 📜 Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the project |

---

## 🗂 Project Structure

```
kp-companion/
├── app/
│   ├── page.tsx              # Home
│   ├── kp-calendar/          # KP Panchang calendar
│   ├── festivals/  rituals/  bhajans/  heritage/  archive/
│   ├── janma-tithi/  muhurat/  gotra-finder/  my-days/  horoscope/
│   ├── knowledge-guide/      # AI guide UI
│   ├── api/
│   │   ├── ai-guide/         # AI route (Groq) + live KP date context
│   │   └── horoscope/        # Live horoscope proxy
│   ├── globals.css           # Design system + animations
│   └── layout.tsx
├── components/
│   ├── layout/ (Navbar, Footer)
│   ├── home/ (TodayPanchangHero)
│   └── ui/ (CelestialBackground, ThemeToggle, Reveal, SaveDayButton, ScrollProgress)
├── lib/
│   ├── kp-calendar.ts        # Panchang engine (sun/moon, sunrise/sunset, choghadiya…)
│   ├── kp-panchang.ts        # Core KP data & helpers
│   ├── kp-bhajans.ts  kp-horoscope.ts  kp-gotras.ts
│   ├── kp-surname-gotra.ts   # Surname → gotra (ikashmir.net)
│   ├── kp-namakaran.ts  kp-rituals.ts  my-days.ts  ics.ts
│   └── supabase/
└── tailwind.config.js · next.config.mjs · tsconfig.json
```

---

## 📐 Accuracy & Sources

- **Panchang elements** use Jean Meeus astronomical formulas with the **Lahiri ayanamsa** (Indian standard). Accuracy is ±1 unit on boundary days.
- **Sunrise/Sunset** for Kashmir is calibrated to the **Kashmiri Jantri** (raised mountain horizon); plains cities use the standard refraction horizon.
- **Gotra-by-surname** data is compiled from [ikashmir.net/names/gotras.html](https://ikashmir.net/names/gotras.html) and is **indicative** — one surname can span many gotras; confirm with your family/purohit.
- Bhajan & folk recordings open on YouTube (courtesy of community channels such as Kashmir Heritage).
- Horoscope text comes from a public astrology API; the in-app fallback is for reflection only.

> ⚠️ This platform is a guide. For exact muhurat, ritual timing and major life decisions, always verify against the official **Vijayeshwar Panchang** and consult a qualified Kashmiri Pandit scholar/priest.

---

## ☁️ Deploy (Vercel)

1. Push to GitHub (done ✅).
2. Import the repo at [vercel.com](https://vercel.com).
3. Add `GROQ_API_KEY` (and optional Supabase vars) in the project's Environment Variables.
4. Deploy.

---

## 🙏 Acknowledgements

Built to preserve and share Kashmiri Pandit heritage. Content is intended to be reviewed and validated by community scholars.

*आचार्यात् पादमादत्ते पादं शिष्यः स्वमेधया* — “A quarter of learning comes from the teacher, a quarter through one's own intelligence.”

**ॐ नमः शिवाय**
