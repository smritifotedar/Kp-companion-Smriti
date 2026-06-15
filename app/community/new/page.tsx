'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/community/AuthProvider';
import { AuthPanel } from '@/components/community/AuthPanel';
import { CATEGORIES, POST_TYPES, type PostType } from '@/lib/community/categories';

export default function NewPostPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [type, setType] = useState<PostType>('question');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12"><AuthPanel message="Sign in to create a post." /></div>;
  }

  const submit = async () => {
    setError('');
    if (!title.trim() || !content.trim()) { setError('Please add a title and some content.'); return; }
    if (!supabase) return;
    setBusy(true);
    const { data, error } = await supabase.from('posts')
      .insert({ author_id: user.id, type, category, title: title.trim(), content: content.trim() })
      .select('id').single();
    setBusy(false);
    if (error) { setError(error.message); return; }
    router.push(`/community/${data!.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-earth-900 mb-5">Create a Post</h1>

      <div className="bg-white rounded-3xl border border-earth-100 shadow-premium p-5 sm:p-6 space-y-4">
        {/* Type */}
        <div className="grid grid-cols-3 gap-2">
          {POST_TYPES.map((t) => (
            <button key={t.value} onClick={() => setType(t.value)}
              className={`p-3 rounded-xl border text-left transition-all ${type === t.value ? 'border-saffron-500 bg-saffron-50' : 'border-earth-200 hover:border-saffron-300'}`}>
              <div className="font-semibold text-sm text-earth-800">{t.label}</div>
              <div className="text-[11px] text-earth-500">{t.blurb}</div>
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-semibold text-earth-700 mb-1">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-earth-700 mb-1">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder={type === 'question' ? 'e.g., How is Herath puja performed?' : type === 'story' ? 'e.g., My family’s journey from Srinagar' : 'e.g., How can we keep Kashmiri alive?'}
            className="w-full px-4 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-earth-700 mb-1">Content</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={type === 'story' ? 10 : 6}
            placeholder="Share the details…"
            className="w-full px-4 py-3 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100 text-sm leading-relaxed" />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button onClick={submit} disabled={busy} className="btn-primary px-6 py-2.5 disabled:opacity-50">{busy ? 'Posting…' : 'Publish'}</button>
          <button onClick={() => router.push('/community')} className="px-5 py-2.5 rounded-full border border-earth-200 text-earth-600 hover:border-saffron-300">Cancel</button>
        </div>
      </div>
    </div>
  );
}
