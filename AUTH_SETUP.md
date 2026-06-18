# Authentication Setup (Supabase)

The app's auth runs on **Supabase Auth (GoTrue)** — a production-grade, mobile-ready
system. It already provides JWT access + refresh tokens, bcrypt hashing, secure OTP
storage, rate limiting, account protection, and a REST API. This guide enables each
sign-in method.

> First run `supabase/schema.sql`, then `supabase/auth-upgrade.sql` (adds profile
> fields + Google/phone metadata handling).

## 1. Email + Password / Email OTP  ✅ works out of the box
Already enabled. For **reliable** email delivery (the built-in sender is rate-limited),
add your own SMTP under **Project Settings → Authentication → SMTP Settings**:
- SendGrid, Mailgun, Amazon SES, or Gmail SMTP — host, port, user, password, sender.
- Set **Authentication → URL Configuration → Site URL** = `https://kp-companion-smriti.vercel.app`
  and add it to **Redirect URLs** (so confirmation + password-reset links land on the live site).
- Password reset links return to **`/community/reset`** (already implemented).

## 2. Continue with Google (OAuth)
1. **Google Cloud Console** → APIs & Services → **Credentials** → Create **OAuth client ID** (Web).
   - Authorized redirect URI: `https://wyrzxbufrgmgxewstdkc.supabase.co/auth/v1/callback`
2. Copy the **Client ID** and **Client secret**.
3. Supabase → **Authentication → Providers → Google** → enable, paste Client ID/secret → Save.
4. Make sure your Vercel domain is in **URL Configuration → Redirect URLs**.

The "Continue with Google" button is already wired (`signInWithOAuth`).

## 3. Mobile number + SMS OTP
1. Create an SMS provider account — **Twilio** (or MSG91 / Vonage / MessageBird).
2. Supabase → **Authentication → Providers → Phone** → enable → choose the provider →
   paste its credentials (e.g. Twilio Account SID, Auth Token, Message Service SID).
3. Optional: set OTP length/expiry under Auth settings (default 6 digits, sensible expiry).

The Mobile tab (send code → verify) is already wired (`signInWithOtp` / `verifyOtp`).
Users enter numbers in **E.164** format (e.g. `+9198XXXXXXXX`).

## 4. Security (already enforced by Supabase)
JWT access + refresh tokens, bcrypt password hashing, server-side OTP with expiry +
rate limits, leaked-password protection (toggle in Auth settings), and Row-Level
Security on all data tables. Tune rate limits under **Authentication → Rate Limits**.

## 5. Mobile apps (Android / iOS / React Native / Flutter)
Use the official Supabase SDK with the **same** Project URL + anon key:
- `supabase-js` (React Native/Expo), `supabase-flutter`, `supabase-swift`, `supabase-kt` (Android).
- Same methods: `signInWithOAuth`, `signInWithOtp`, `verifyOtp`, `signInWithPassword`,
  `resetPasswordForEmail`, `updateUser`, `getUser`, `refreshSession`, `signOut`.
- These map directly to the requested REST endpoints (GoTrue exposes them at
  `https://<project>.supabase.co/auth/v1/...`), so the mobile apps and the web app share
  one identity system.
