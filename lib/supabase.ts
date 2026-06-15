import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// The Community Hub needs a shared backend. Configure these in .env.local (see
// COMMUNITY_SETUP.md). When absent, the community pages show a setup notice and the
// rest of the site keeps working.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && key);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, key as string, { auth: { persistSession: true, autoRefreshToken: true } })
  : null;

// Narrowing helper for handlers that only run after a configured check.
export function db(): SupabaseClient {
  if (!supabase) throw new Error('Supabase is not configured.');
  return supabase;
}
