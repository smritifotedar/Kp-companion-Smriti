'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Flame, Clock, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/community/AuthProvider';
import { PostCard } from '@/components/community/PostCard';
import { CATEGORIES, type PostType } from '@/lib/community/categories';
import type { Post } from '@/lib/community/types';

type Sort = 'latest' | 'top' | 'trending';
const TABS: { key: 'all' | PostType; label: string }[] = [
  { key: 'all', label: 'All' }, { key: 'question', label: 'Questions & Answers' },
  { key: 'discussion', label: 'Discussions' }, { key: 'story', label: 'Stories' },
];

export default function CommunityFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<'all' | PostType>('all');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<Sort>('latest');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    let query = supabase.from('posts').select('*, author:profiles(*)');
    if (tab !== 'all') query = query.eq('type', tab);
    if (category) query = query.eq('category', category);
    const term = q.trim().replace(/[,%]/g, '');
    if (term) query = query.or(`title.ilike.%${term}%,content.ilike.%${term}%`);
    if (sort === 'trending') {
      const since = new Date(Date.now() - 14 * 86400000).toISOString();
      query = query.gte('created_at', since).order('like_count', { ascending: false }).order('comment_count', { ascending: false });
    } else if (sort === 'top') {
      query = query.order('like_count', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    const { data } = await query.limit(50);
    const list = (data as Post[]) ?? [];
    setPosts(list);
    if (user && list.length) {
      const { data: likes } = await supabase.from('post_likes').select('post_id').eq('user_id', user.id).in('post_id', list.map((p) => p.id));
      setLikedIds(new Set((likes ?? []).map((x: { post_id: string }) => x.post_id)));
    } else { setLikedIds(new Set()); }
    setLoading(false);
  }, [tab, category, sort, q, user]);

  useEffect(() => { const t = setTimeout(fetchPosts, q ? 300 : 0); return () => clearTimeout(t); }, [fetchPosts, q]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-6">
        <div className="font-devanagari text-saffron-500 text-lg mb-1">समुदाय</div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-earth-900">A digital home for Kashmiri Pandits</h1>
        <p className="text-earth-600 text-sm mt-1 max-w-xl mx-auto">Ask, share, and preserve our culture together — questions, discussions and stories from the community.</p>
      </div>

      {/* Type tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${tab === t.key ? 'bg-saffron-600 text-white shadow-premium' : 'bg-white border border-earth-200 text-earth-600 hover:border-saffron-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search posts…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-earth-200 bg-white focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100 text-sm" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-earth-200 bg-white text-sm focus:border-saffron-400 focus:outline-none">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex gap-1 bg-white border border-earth-200 rounded-xl p-1">
          {([['latest', Clock], ['top', Flame], ['trending', TrendingUp]] as const).map(([s, Icon]) => (
            <button key={s} onClick={() => setSort(s)} title={s}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium capitalize inline-flex items-center gap-1 ${sort === s ? 'bg-saffron-100 text-saffron-700' : 'text-earth-500 hover:text-saffron-600'}`}>
              <Icon size={13} /> {s}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-center text-earth-400 py-10">Loading…</p>
      ) : posts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-earth-200 p-10 text-center text-earth-400">
          No posts yet{category || q || tab !== 'all' ? ' for this filter' : ''}. Be the first to start the conversation.
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => <PostCard key={p.id} post={p} liked={likedIds.has(p.id)} />)}
        </div>
      )}
    </div>
  );
}
