# 🕉️ Kashmiri Pandit Digital Companion

A full-stack Next.js + Supabase web application for preserving and sharing Kashmiri Pandit cultural heritage, traditions, and religious practices — built on the **Sapta Rishi Samvat** (KP Panchang).

---

## ✨ Features

- 🗓 **Festival Calendar** — KP festivals per Sapta Rishi Samvat (Navreh, Herath, Zyeth Atham, etc.)
- 📚 **Ritual Library** — Devgon, Vyah, Yagnopavit, Shraddha, Havan, and more
- 💍 **Wedding Guide** — Complete KP wedding timeline, ceremonies, and interactive checklist
- 🌙 **Janma Tithi Finder** — Birth Tithi, Nakshatra, Rashi per KP Panchang
- ⏰ **Muhurat Finder** — Auspicious timings per Kashmiri Pandit Panchang
- 🏛️ **Family Heritage** — Save Gotra, Kuldevta, native village, traditions
- 📖 **KP Archive** — Articles, history, temples, culture
- 🤖 **AI Knowledge Guide** — Claude-powered Q&A about KP traditions

---

## 🛠️ VS Code Setup Instructions (Step by Step)

### Prerequisites
Make sure you have these installed:
- **Node.js 18+**: Download from https://nodejs.org
- **VS Code**: Download from https://code.visualstudio.com
- **Git**: Download from https://git-scm.com

---

### Step 1: Open Project in VS Code

1. Open **VS Code**
2. Go to `File → Open Folder`
3. Select the `kp-companion` folder you received
4. VS Code will open the project

**Recommended VS Code Extensions** (install from Extensions tab):
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- TypeScript Vue Plugin (Volar)

---

### Step 2: Install Dependencies

1. In VS Code, open the **Terminal**: `Terminal → New Terminal` (or `` Ctrl+` ``)
2. Run this command:

```bash
npm install
```

Wait for all packages to install (may take 1-2 minutes).

---

### Step 3: Set Up Supabase (Database)

#### 3a. Create a Supabase account
1. Go to https://supabase.com
2. Click **"Start your project"** → Sign up with GitHub or email
3. Click **"New Project"**
4. Fill in:
   - **Project name**: `kp-companion`
   - **Database password**: Choose a strong password (save it!)
   - **Region**: Select nearest to you (e.g., ap-south-1 for India)
5. Click **"Create new project"** — wait ~2 minutes for setup

#### 3b. Get your Supabase credentials
1. In your Supabase project dashboard, go to **Settings → API**
2. Copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)
   - **service_role key** (keep this secret!)

#### 3c. Run the database schema
1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Open the file `supabase/migrations/001_initial_schema.sql` in VS Code
4. Copy ALL the contents
5. Paste into the Supabase SQL Editor
6. Click **"Run"** (green play button)
7. You should see "Success" for each statement

---

### Step 4: Configure Environment Variables

1. In VS Code, look at the file `.env.local.example`
2. Create a NEW file in the project root called `.env.local`
3. Copy the contents from `.env.local.example` into `.env.local`
4. Fill in your values:

```bash
# From Supabase Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# From Supabase Settings → API (service_role key — keep secret!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# From https://console.anthropic.com — for AI Guide feature
ANTHROPIC_API_KEY=sk-ant-...

# App URL (leave as-is for local development)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Getting Anthropic API Key:**
1. Go to https://console.anthropic.com
2. Sign up / log in
3. Go to **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-`)

> ⚠️ IMPORTANT: Never commit `.env.local` to git. It's already in `.gitignore`.

---

### Step 5: Run the Development Server

In the VS Code terminal, run:

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
- Ready in Xs
```

---

### Step 6: Open in Browser

1. Open your web browser
2. Go to: **http://localhost:3000**
3. You should see the Kashmiri Pandit Digital Companion!

---

## 📱 Features That Work Without Supabase

Even without Supabase configured, these features work fully:
- ✅ Festival Calendar
- ✅ Ritual Library
- ✅ Wedding Guide & Checklist (saves to browser)
- ✅ Janma Tithi Finder
- ✅ Muhurat Finder
- ✅ KP Archive
- ✅ Family Heritage (saves locally to browser)

The AI Knowledge Guide requires the `ANTHROPIC_API_KEY`.

---

## 🗂️ Project Structure

```
kp-companion/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home page
│   ├── festivals/          # Festival Calendar
│   ├── rituals/            # Ritual Library
│   ├── wedding/            # Wedding Guide
│   ├── janma-tithi/        # Janma Tithi Finder
│   ├── muhurat/            # Muhurat Finder
│   ├── heritage/           # Family Heritage
│   ├── archive/            # KP Archive
│   ├── knowledge-guide/    # AI Guide
│   ├── api/
│   │   └── ai-guide/       # AI API route
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/
│   └── layout/
│       ├── Navbar.tsx      # Navigation
│       └── Footer.tsx      # Footer
├── lib/
│   ├── kp-panchang.ts      # KP Panchang calculations & data
│   ├── kp-rituals.ts       # Ritual & wedding data
│   ├── utils.ts            # Utilities
│   └── supabase/           # Supabase client/server
├── supabase/
│   └── migrations/         # Database schema
├── .env.local.example      # Environment template
├── package.json
├── tailwind.config.js
└── next.config.mjs
```

---

## 🔧 Troubleshooting

### "Module not found" error
Run `npm install` again in the terminal.

### "Cannot connect to Supabase"
- Check your `.env.local` file has correct values
- Make sure there are no extra spaces in the keys
- Restart the dev server: `Ctrl+C` then `npm run dev`

### "AI Guide not working"
- Ensure `ANTHROPIC_API_KEY` is set in `.env.local`
- Check the key is valid at https://console.anthropic.com
- Restart the server after adding the key

### Port 3000 already in use
Run on a different port: `npm run dev -- --port 3001`

---

## 🚀 Building for Production

```bash
npm run build
npm start
```

## ☁️ Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard
5. Deploy!

---

## 📱 Future: React Native Mobile App

The architecture is designed to support a React Native app sharing:
- Business logic from `lib/kp-panchang.ts` and `lib/kp-rituals.ts`
- Supabase backend (already mobile-compatible)
- API routes (accessible from mobile)

---

## 🙏 Acknowledgements

This platform is dedicated to the Kashmiri Pandit community.
Content is intended to be reviewed by qualified KP scholars.
Built with respect for the traditions preserved by generations of KP families.

**ॐ नमः शिवाय**
