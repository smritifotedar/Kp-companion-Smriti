'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Mail, Phone } from 'lucide-react';

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100';

export function AuthPanel({ message }: { message?: string }) {
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [view, setView] = useState<'main' | 'forgot'>('main');

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const clear = () => { setError(''); setNotice(''); };
  const origin = () => (typeof window !== 'undefined' ? window.location.origin : '');
  const msg = (e: unknown) => {
    const m = e instanceof Error ? e.message : typeof e === 'string' ? e : '';
    return m || 'Something went wrong. Please try again.';
  };

  const google = async () => {
    if (!supabase) return;
    clear(); setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${origin()}/community` } });
    if (error) { setError(error.message); setBusy(false); }
  };

  const emailSubmit = async () => {
    if (!supabase) { setError('Community backend is not configured.'); return; }
    clear();
    if (mode === 'up' && !username.trim()) { setError('Please choose a username.'); return; }
    setBusy(true);
    try {
      if (mode === 'up') {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { username: username.trim(), full_name: fullName.trim() } } });
        if (error) throw error;
        if (data.session) setNotice('Welcome! You are signed in.');
        else { setNotice('Account created! Check your email for a confirmation link, then sign in.'); setMode('in'); }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e) { setError(msg(e)); } finally { setBusy(false); }
  };

  const sendPhoneOtp = async () => {
    if (!supabase) return;
    clear();
    if (!phone.trim().startsWith('+')) { setError('Enter your mobile number with country code, e.g. +9198…'); return; }
    if (mode === 'up' && !username.trim()) { setError('Please choose a username.'); return; }
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: phone.trim(), options: mode === 'up' ? { data: { username: username.trim(), full_name: fullName.trim() } } : undefined });
    if (error) setError(error.message); else { setOtpSent(true); setNotice('Code sent to your phone.'); }
    setBusy(false);
  };

  const verifyPhoneOtp = async () => {
    if (!supabase) return;
    clear(); setBusy(true);
    const { error } = await supabase.auth.verifyOtp({ phone: phone.trim(), token: otp.trim(), type: 'sms' });
    if (error) setError(error.message);
    setBusy(false);
  };

  const sendReset = async () => {
    if (!supabase) return;
    clear();
    if (!email.trim()) { setError('Enter your email address.'); return; }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${origin()}/community/reset` });
    if (error) setError(error.message); else setNotice('Password reset link sent — check your email.');
    setBusy(false);
  };

  // ── Forgot-password view ──
  if (view === 'forgot') {
    return (
      <Card title="Reset your password" subtitle="We'll email you a secure link to set a new password.">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={inputCls} />
        <Messages error={error} notice={notice} />
        <button onClick={sendReset} disabled={busy} className="btn-primary w-full py-3 disabled:opacity-50">{busy ? 'Sending…' : 'Send reset link'}</button>
        <p className="text-center text-sm text-earth-500 mt-2">
          <button onClick={() => { setView('main'); clear(); }} className="text-saffron-600 font-semibold hover:underline">Back to sign in</button>
        </p>
      </Card>
    );
  }

  return (
    <Card title={mode === 'in' ? 'Welcome back' : 'Join the Community'} subtitle={message || 'Sign in to post, comment and connect with fellow Kashmiri Pandits.'}>
      {/* Google */}
      <button onClick={google} disabled={busy} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-earth-200 hover:bg-earth-50 font-medium text-earth-700 disabled:opacity-50">
        <GoogleIcon /> Continue with Google
      </button>

      <div className="flex items-center gap-3 my-1">
        <span className="flex-1 h-px bg-earth-100" /><span className="text-xs text-earth-400">or</span><span className="flex-1 h-px bg-earth-100" />
      </div>

      {/* Method tabs */}
      <div className="grid grid-cols-2 gap-2">
        {([['email', 'Email', Mail], ['phone', 'Mobile', Phone]] as const).map(([m, label, Icon]) => (
          <button key={m} onClick={() => { setMethod(m); clear(); setOtpSent(false); }}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium border ${method === m ? 'border-saffron-500 bg-saffron-50 text-saffron-700' : 'border-earth-200 text-earth-500'}`}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Sign-up extra fields */}
      {mode === 'up' && (
        <>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className={inputCls} />
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username (public)" className={inputCls} />
        </>
      )}

      {method === 'email' ? (
        <>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={inputCls} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
            onKeyDown={(e) => e.key === 'Enter' && emailSubmit()} className={inputCls} />
          <Messages error={error} notice={notice} />
          {mode === 'in' && (
            <p className="text-right -mt-1"><button onClick={() => { setView('forgot'); clear(); }} className="text-xs text-saffron-600 hover:underline">Forgot password?</button></p>
          )}
          <button onClick={emailSubmit} disabled={busy || !email || !password} className="btn-primary w-full py-3 disabled:opacity-50">
            {busy ? 'Please wait…' : mode === 'in' ? 'Sign In' : 'Create Account'}
          </button>
        </>
      ) : (
        <>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Mobile (+country code, e.g. +9198…)" className={inputCls} disabled={otpSent} />
          {!otpSent ? (
            <>
              <Messages error={error} notice={notice} />
              <button onClick={sendPhoneOtp} disabled={busy || !phone} className="btn-primary w-full py-3 disabled:opacity-50">{busy ? 'Sending…' : 'Send code'}</button>
            </>
          ) : (
            <>
              <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit code" inputMode="numeric"
                onKeyDown={(e) => e.key === 'Enter' && verifyPhoneOtp()} className={inputCls} />
              <Messages error={error} notice={notice} />
              <button onClick={verifyPhoneOtp} disabled={busy || !otp} className="btn-primary w-full py-3 disabled:opacity-50">{busy ? 'Verifying…' : 'Verify & continue'}</button>
              <button onClick={sendPhoneOtp} disabled={busy} className="text-xs text-saffron-600 hover:underline w-full">Resend code</button>
            </>
          )}
        </>
      )}

      <p className="text-center text-sm text-earth-500 mt-2">
        {mode === 'in' ? "New here? " : 'Already a member? '}
        <button onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); clear(); setOtpSent(false); }} className="text-saffron-600 font-semibold hover:underline">
          {mode === 'in' ? 'Create an account' : 'Sign in'}
        </button>
      </p>
    </Card>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl border border-saffron-200 shadow-premium p-6 sm:p-8">
      <div className="text-center mb-5">
        <div className="w-12 h-12 rounded-full bg-saffron-100 text-saffron-600 flex items-center justify-center mx-auto mb-2"><Users size={22} /></div>
        <h2 className="font-display font-bold text-xl text-earth-900">{title}</h2>
        <p className="text-sm text-earth-500 mt-1">{subtitle}</p>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Messages({ error, notice }: { error: string; notice: string }) {
  return (
    <>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {notice ? <p className="text-sm text-green-700 bg-green-50 rounded-lg p-2">{notice}</p> : null}
    </>
  );
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.6-11.3-8.4l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.3C41.4 36.4 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}
