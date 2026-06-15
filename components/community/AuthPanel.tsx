'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users } from 'lucide-react';

export function AuthPanel({ message }: { message?: string }) {
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const submit = async () => {
    if (!supabase) { setError('Community backend is not configured.'); return; }
    setError(''); setNotice(''); setBusy(true);
    try {
      if (mode === 'up') {
        if (!username.trim()) { setError('Please choose a username.'); setBusy(false); return; }
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { data: { username: username.trim(), full_name: fullName.trim() } },
        });
        if (error) throw error;
        if (data.session) {
          setNotice('Welcome! You are signed in.');           // confirmation off → logged in
        } else {
          setNotice('Account created! Check your email for a confirmation link, then come back and sign in.');
          setMode('in');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : typeof e === 'string' ? e : '';
      setError(msg || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl border border-saffron-200 shadow-premium p-6 sm:p-8">
      <div className="text-center mb-5">
        <div className="w-12 h-12 rounded-full bg-saffron-100 text-saffron-600 flex items-center justify-center mx-auto mb-2"><Users size={22} /></div>
        <h2 className="font-display font-bold text-xl text-earth-900">{mode === 'in' ? 'Welcome back' : 'Join the Community'}</h2>
        <p className="text-sm text-earth-500 mt-1">{message || 'Sign in to post, comment and connect with fellow Kashmiri Pandits.'}</p>
      </div>

      <div className="space-y-3">
        {mode === 'up' && (
          <>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name"
              className="w-full px-4 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100" />
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username (public)"
              className="w-full px-4 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100" />
          </>
        )}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
          className="w-full px-4 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          className="w-full px-4 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100" />

        {error && <p className="text-sm text-red-600">{error}</p>}
        {notice && <p className="text-sm text-green-700 bg-green-50 rounded-lg p-2">{notice}</p>}

        <button onClick={submit} disabled={busy || !email || !password} className="btn-primary w-full py-3 disabled:opacity-50">
          {busy ? 'Please wait…' : mode === 'in' ? 'Sign In' : 'Create Account'}
        </button>
      </div>

      <p className="text-center text-sm text-earth-500 mt-4">
        {mode === 'in' ? "New here? " : 'Already a member? '}
        <button onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setError(''); setNotice(''); }} className="text-saffron-600 font-semibold hover:underline">
          {mode === 'in' ? 'Create an account' : 'Sign in'}
        </button>
      </p>
    </div>
  );
}
