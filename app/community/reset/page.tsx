'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/community/AuthProvider';
import { KeyRound } from 'lucide-react';

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = async () => {
    setError('');
    if (pw.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (pw !== pw2) { setError('Passwords do not match.'); return; }
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) { setError(error.message); return; }
    setDone(true);
    setTimeout(() => router.push('/community'), 1500);
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-3xl border border-saffron-200 shadow-premium p-6 sm:p-8">
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-saffron-100 text-saffron-600 flex items-center justify-center mx-auto mb-2"><KeyRound size={22} /></div>
          <h1 className="font-display font-bold text-xl text-earth-900">Set a new password</h1>
        </div>

        {loading ? (
          <p className="text-center text-earth-400 text-sm">Loading…</p>
        ) : !user ? (
          <p className="text-center text-sm text-earth-500">
            Open this page from the <strong>password-reset link</strong> in your email. If the link expired, request a new one from the sign-in screen.
          </p>
        ) : done ? (
          <p className="text-center text-sm text-green-700 bg-green-50 rounded-lg p-3">Password updated! Redirecting…</p>
        ) : (
          <div className="space-y-3">
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password" className={inputCls} />
            <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Confirm new password"
              onKeyDown={(e) => e.key === 'Enter' && submit()} className={inputCls} />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button onClick={submit} disabled={busy} className="btn-primary w-full py-3 disabled:opacity-50">{busy ? 'Updating…' : 'Update password'}</button>
          </div>
        )}
      </div>
    </div>
  );
}
