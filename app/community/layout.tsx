'use client';

import Link from 'next/link';
import { isSupabaseConfigured } from '@/lib/supabase';
import { AuthProvider, useAuth } from '@/components/community/AuthProvider';
import { Users, PenSquare, LogOut, Database } from 'lucide-react';

function Header() {
  const { user, profile, signOut } = useAuth();
  return (
    <div className="border-b border-earth-100 bg-white/70 backdrop-blur sticky top-16 z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
        <Link href="/community" className="font-display font-bold text-earth-900 flex items-center gap-2">
          <Users size={18} className="text-saffron-500" /> Community Hub
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/community/new" className="inline-flex items-center gap-1.5 btn-primary text-sm px-3.5 py-2">
            <PenSquare size={15} /> New Post
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/community/account" className="text-sm font-medium text-earth-700 hover:text-saffron-600 hidden sm:block">
                {profile?.username || 'Account'}
              </Link>
              <button onClick={signOut} title="Sign out" className="text-earth-400 hover:text-red-500 p-1.5"><LogOut size={16} /></button>
            </div>
          ) : (
            <Link href="/community/signin" className="text-sm font-medium text-saffron-600 hover:underline">Sign in</Link>
          )}
        </div>
      </div>
    </div>
  );
}

function SetupNotice() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4"><Database size={26} /></div>
      <h1 className="font-display text-2xl font-bold text-earth-900 mb-2">Community Hub — almost ready</h1>
      <p className="text-earth-600 mb-4">
        The Community Hub needs its backend connected (a free Supabase project) so members can
        actually connect with each other. It&apos;s a one-time, ~5-minute setup.
      </p>
      <div className="bg-white border border-earth-100 rounded-2xl p-5 text-left text-sm text-earth-700 shadow-sm">
        <ol className="list-decimal pl-5 space-y-1.5">
          <li>Create a free project at <a className="text-saffron-600 underline" href="https://supabase.com" target="_blank" rel="noreferrer">supabase.com</a>.</li>
          <li>Run <code className="bg-earth-100 px-1 rounded">supabase/schema.sql</code> in the SQL editor.</li>
          <li>Add <code className="bg-earth-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-earth-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code className="bg-earth-100 px-1 rounded">.env.local</code>.</li>
          <li>Restart the app — see <code className="bg-earth-100 px-1 rounded">COMMUNITY_SETUP.md</code>.</li>
        </ol>
      </div>
    </div>
  );
}

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) return <SetupNotice />;
  return (
    <AuthProvider>
      <Header />
      {children}
    </AuthProvider>
  );
}
