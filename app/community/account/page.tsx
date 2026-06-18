'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/community/AuthProvider';
import { AuthPanel } from '@/components/community/AuthPanel';
import { UserCircle, ShieldCheck, ShieldAlert, KeyRound, LogOut } from 'lucide-react';

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100';

export default function AccountPage() {
  const { user, profile, loading, refreshProfile, signOut } = useAuth();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [savedMsg, setSavedMsg] = useState('');
  const [savingProfile, setSavingProfile] = useState('');

  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? ''); setUsername(profile.username ?? '');
      setPhone(profile.phone ?? ''); setAvatar(profile.avatar_url ?? ''); setBio(profile.bio ?? '');
    }
  }, [profile]);

  if (loading) return <p className="text-center text-earth-400 py-16">Loading…</p>;
  if (!user) return <div className="max-w-5xl mx-auto px-4 py-12"><AuthPanel message="Sign in to manage your account." /></div>;

  const saveProfile = async () => {
    if (!supabase) return;
    setSavedMsg(''); setSavingProfile('saving');
    const { error } = await supabase.from('profiles').update({
      full_name: fullName.trim() || null, username: username.trim(), phone: phone.trim() || null,
      avatar_url: avatar.trim() || null, bio: bio.trim() || null,
    }).eq('id', user.id);
    setSavingProfile('');
    if (error) setSavedMsg(error.message); else { setSavedMsg('Profile saved.'); refreshProfile(); }
  };

  const changePassword = async () => {
    setPwErr(''); setPwMsg('');
    if (pw.length < 6) { setPwErr('Password must be at least 6 characters.'); return; }
    if (pw !== pw2) { setPwErr('Passwords do not match.'); return; }
    if (!supabase) return;
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) setPwErr(error.message); else { setPwMsg('Password changed.'); setPw(''); setPw2(''); }
  };

  const provider = (user.app_metadata?.provider as string) || 'email';
  const lastLogin = user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('en-IN') : '—';
  const Verified = ({ ok, label }: { ok: boolean; label: string }) => (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${ok ? 'text-green-700' : 'text-earth-400'}`}>
      {ok ? <ShieldCheck size={13} /> : <ShieldAlert size={13} />} {label} {ok ? 'verified' : 'unverified'}
    </span>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <h1 className="font-display text-2xl font-bold text-earth-900 flex items-center gap-2"><UserCircle className="text-saffron-500" size={26} /> My Account</h1>

      {/* Status */}
      <div className="bg-white rounded-3xl border border-earth-100 shadow-premium p-5">
        <h2 className="font-display font-bold text-earth-900 mb-3">Account</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
          <div><span className="text-earth-400">Email:</span> {user.email || '—'}</div>
          <div><span className="text-earth-400">Mobile:</span> {user.phone || profile?.phone || '—'}</div>
          <div><span className="text-earth-400">Sign-in method:</span> <span className="capitalize">{provider}</span></div>
          <div><span className="text-earth-400">Last login:</span> {lastLogin}</div>
          <div className="flex gap-3"><Verified ok={!!user.email_confirmed_at} label="Email" /><Verified ok={!!user.phone_confirmed_at} label="Mobile" /></div>
        </div>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-3xl border border-earth-100 shadow-premium p-5">
        <h2 className="font-display font-bold text-earth-900 mb-3">Profile</h2>
        <div className="space-y-3">
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className={inputCls} />
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className={inputCls} />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Mobile (optional, +country code)" className={inputCls} />
          <input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="Avatar image URL (optional)" className={inputCls} />
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2} placeholder="Short bio (optional)" className={inputCls} />
          {savedMsg && <p className={`text-sm ${savedMsg === 'Profile saved.' ? 'text-green-700' : 'text-red-600'}`}>{savedMsg}</p>}
          <button onClick={saveProfile} disabled={savingProfile === 'saving' || !username.trim()} className="btn-primary px-5 py-2.5 disabled:opacity-50">{savingProfile === 'saving' ? 'Saving…' : 'Save profile'}</button>
        </div>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-3xl border border-earth-100 shadow-premium p-5">
        <h2 className="font-display font-bold text-earth-900 mb-3 flex items-center gap-2"><KeyRound size={18} className="text-saffron-500" /> Change password</h2>
        <div className="space-y-3">
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password" className={inputCls} />
          <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Confirm new password" className={inputCls} />
          {pwErr && <p className="text-sm text-red-600">{pwErr}</p>}
          {pwMsg && <p className="text-sm text-green-700">{pwMsg}</p>}
          <button onClick={changePassword} disabled={!pw || !pw2} className="btn-primary px-5 py-2.5 disabled:opacity-50">Update password</button>
        </div>
      </div>

      <button onClick={signOut} className="inline-flex items-center gap-1.5 text-sm text-earth-500 hover:text-red-500"><LogOut size={15} /> Sign out</button>
    </div>
  );
}
