'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { UserCircle, CalendarDays } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/community/AuthProvider';
import { PostCard } from '@/components/community/PostCard';
import type { Post, Profile } from '@/lib/community/types';

export default function ProfilePage() {
  const params = useParams();
  const id = String(params.id);
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState('');

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
    setProfile((prof as Profile) ?? null);
    setBio((prof as Profile)?.bio ?? '');
    const { data: ps } = await supabase.from('posts').select('*, author:profiles(*)').eq('author_id', id).order('created_at', { ascending: false });
    const list = (ps as Post[]) ?? [];
    setPosts(list);
    const { count } = await supabase.from('comments').select('id', { count: 'exact', head: true }).eq('author_id', id);
    setCommentCount(count ?? 0);
    if (user && list.length) {
      const { data: likes } = await supabase.from('post_likes').select('post_id').eq('user_id', user.id).in('post_id', list.map((p) => p.id));
      setLikedIds(new Set((likes ?? []).map((x: { post_id: string }) => x.post_id)));
    }
    setLoading(false);
  }, [id, user]);

  useEffect(() => { load(); }, [load]);

  const saveBio = async () => {
    if (!supabase) return;
    await supabase.from('profiles').update({ bio: bio.trim() || null }).eq('id', id);
    setEditingBio(false);
    refreshProfile();
    load();
  };

  if (loading) return <p className="text-center text-earth-400 py-16">Loading…</p>;
  if (!profile) return <p className="text-center text-earth-500 py-16">Member not found.</p>;

  const isMe = user?.id === id;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-3xl border border-earth-100 shadow-premium p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-saffron-100 text-saffron-600 flex items-center justify-center"><UserCircle size={40} /></div>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-earth-900">{profile.full_name || profile.username}</h1>
            <div className="text-sm text-earth-500">@{profile.username}</div>
            <div className="flex items-center gap-1 text-xs text-earth-400 mt-1"><CalendarDays size={12} /> Joined {new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</div>
          </div>
        </div>

        <div className="flex gap-6 mt-4 text-sm">
          <div><span className="font-display font-bold text-earth-900 text-lg">{posts.length}</span> <span className="text-earth-500">posts</span></div>
          <div><span className="font-display font-bold text-earth-900 text-lg">{commentCount}</span> <span className="text-earth-500">comments</span></div>
        </div>

        {/* Bio */}
        <div className="mt-4">
          {editingBio ? (
            <div className="flex gap-2">
              <input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short bio…"
                className="flex-1 px-3 py-2 rounded-lg border border-earth-200 text-sm focus:border-saffron-400 focus:outline-none" />
              <button onClick={saveBio} className="btn-primary text-sm px-3 py-2">Save</button>
            </div>
          ) : (
            <p className="text-sm text-earth-600">
              {profile.bio || <span className="text-earth-400 italic">No bio yet.</span>}
              {isMe && <button onClick={() => setEditingBio(true)} className="text-saffron-600 text-xs ml-2 hover:underline">{profile.bio ? 'Edit' : 'Add bio'}</button>}
            </p>
          )}
        </div>
      </div>

      <h2 className="font-display font-bold text-earth-900 mb-3">{isMe ? 'Your posts' : `${profile.username}’s posts`}</h2>
      {posts.length === 0 ? (
        <p className="text-sm text-earth-400">No posts yet.</p>
      ) : (
        <div className="space-y-3">{posts.map((p) => <PostCard key={p.id} post={p} liked={likedIds.has(p.id)} />)}</div>
      )}
    </div>
  );
}
