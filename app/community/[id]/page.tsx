'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/community/AuthProvider';
import { LikeButton } from '@/components/community/LikeButton';
import { Comments } from '@/components/community/Comments';
import { TYPE_LABEL } from '@/lib/community/categories';
import { timeAgo, TYPE_BADGE } from '@/lib/community/format';
import type { Post } from '@/lib/community/types';

export default function PostDetail() {
  const params = useParams();
  const id = String(params.id);
  const { user } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase.from('posts').select('*, author:profiles(*)').eq('id', id).maybeSingle();
    setPost((data as Post) ?? null);
    if (data && user) {
      const { data: like } = await supabase.from('post_likes').select('post_id').eq('user_id', user.id).eq('post_id', id).maybeSingle();
      setLiked(!!like);
    }
    setLoading(false);
  }, [id, user]);

  useEffect(() => { load(); }, [load]);

  const del = async () => {
    if (!supabase) return;
    await supabase.from('posts').delete().eq('id', id);
    router.push('/community');
  };

  if (loading) return <p className="text-center text-earth-400 py-16">Loading…</p>;
  if (!post) return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-earth-500">Post not found. <Link href="/community" className="text-saffron-600 underline">Back to feed</Link></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/community" className="inline-flex items-center gap-1 text-sm text-earth-500 hover:text-saffron-600 mb-4"><ArrowLeft size={15} /> Back to community</Link>

      <article className="bg-white rounded-3xl border border-earth-100 shadow-premium p-5 sm:p-7">
        <div className="flex items-center gap-2 text-xs mb-2 flex-wrap">
          <span className={`font-semibold px-2 py-0.5 rounded-full ${TYPE_BADGE[post.type]}`}>{TYPE_LABEL[post.type]}</span>
          <span className="text-earth-500">{post.category}</span>
          <span className="text-earth-300">·</span>
          <span className="text-earth-400">{timeAgo(post.created_at)}</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-earth-900 leading-snug">{post.title}</h1>
        <div className="text-sm text-earth-400 mt-1">
          by <Link href={`/community/u/${post.author_id}`} className="text-saffron-600 hover:underline">{post.author?.username ?? 'member'}</Link>
        </div>
        <p className="text-earth-800 leading-relaxed whitespace-pre-wrap mt-4">{post.content}</p>
        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-earth-100">
          <LikeButton kind="post" id={post.id} count={post.like_count} liked={liked} />
          <span className="text-sm text-earth-400">{post.comment_count} {post.type === 'question' ? 'answers' : 'comments'}</span>
          {user?.id === post.author_id && (
            <button onClick={del} className="ml-auto inline-flex items-center gap-1 text-sm text-earth-400 hover:text-red-500"><Trash2 size={14} /> Delete</button>
          )}
        </div>
      </article>

      <div className="mt-6">
        <Comments post={post} />
      </div>
    </div>
  );
}
