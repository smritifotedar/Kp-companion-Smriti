# Community Hub — Setup (Supabase)

The Community Hub needs a shared backend so members can actually see and respond to
each other. We use **Supabase** (free tier: Postgres + Auth). One-time setup, ~5 minutes.

## 1. Create a Supabase project
1. Go to <https://supabase.com> and sign in (free).
2. **New project** → name it (e.g. `kp-community`), choose a region near your users, set a database password (keep it safe).
3. Wait ~1 minute for it to provision.

## 2. Create the database tables
1. In the project, open **SQL Editor → New query**.
2. Paste the entire contents of [`supabase/schema.sql`](./supabase/schema.sql) and click **Run**.
3. You should see "Success". (It creates profiles, posts, comments, likes, triggers and security policies.)

## 3. Get your API keys
1. Open **Project Settings → API**.
2. Copy the **Project URL** and the **anon public** key.

## 4. Add them to the app
Create a file named `.env.local` in the project root (copy `.env.local.example`) and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Then restart the dev server (`npm run dev`). On Vercel, add the same two variables under
**Project → Settings → Environment Variables** and redeploy.

## 5. (Recommended for testing) Email confirmation
By default Supabase emails a confirmation link on sign-up. To test quickly, you can turn it
off: **Authentication → Providers → Email → "Confirm email" = off**. For production, leave it
on (the app handles the "check your email" state).

---

That's it — visit **/community** and the hub goes live. Everything else (schema, auth, posts,
comments, likes, profiles) is already implemented in the app.

### What's included (MVP)
- Email/password accounts; auto-created public profile (with username)
- Feed with Latest / Top / Trending, category filter, type tabs and search
- Post types: **Question**, **Discussion**, **Story** (mark a best answer on questions)
- Likes on posts & comments; threaded comments (one reply level)
- Basic user profiles (posts, join date, bio)

### Planned next phases
Photos (Supabase Storage), Events & RSVP, Polls, notifications, reporting/moderation,
reputation & badges, Community Stories Archive, Family Roots, Heritage Map.
