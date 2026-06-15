'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Trash2, CornerDownRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthProvider';
import { LikeButton } from './LikeButton';
import { timeAgo } from '@/lib/community/format';
import type { Comment, Post } from '@/lib/community/types';
import { AuthPanel } from './AuthPanel';

export function Comments({ post }: { post: Post }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [best, setBest] = useState<string | null>(post.best_comment_id);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [busy, setBusy] = useState(false);

  const isQuestion = post.type === 'question';
  const isOwner = user?.id === post.author_id;

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('comments').select('*, author:profiles(*)')
      .eq('post_id', post.id).order('created_at', { ascending: true });
    const list = (data as Comment[]) ?? [];
    setComments(list);
    if (user && list.length) {
      const { data: likes } = await supabase.from('comment_likes')
        .select('comment_id').eq('user_id', user.id).in('comment_id', list.map((c) => c.id));
      setLikedIds(new Set((likes ?? []).map((x: { comment_id: string }) => x.comment_id)));
    } else {
      setLikedIds(new Set());
    }
  }, [post.id, user]);

  useEffect(() => { load(); }, [load]);

  const addComment = async (content: string, parent_id: string | null) => {
    if (!supabase || !user || !content.trim()) return;
    setBusy(true);
    await supabase.from('comments').insert({ post_id: post.id, author_id: user.id, parent_id, content: content.trim() });
    setText(''); setReplyText(''); setReplyTo(null);
    await load();
    setBusy(false);
  };

  const del = async (id: string) => {
    if (!supabase) return;
    await supabase.from('comments').delete().eq('id', id);
    await load();
  };

  const markBest = async (id: string) => {
    if (!supabase || !isOwner) return;
    const next = best === id ? null : id;
    await supabase.from('posts').update({ best_comment_id: next }).eq('id', post.id);
    setBest(next);
  };

  const tops = comments.filter((c) => !c.parent_id);
  const repliesOf = (id: string) => comments.filter((c) => c.parent_id === id);
  // Best answer first for questions
  tops.sort((a, b) => (a.id === best ? -1 : b.id === best ? 1 : 0));

  const Item = ({ c, isReply }: { c: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-6 border-l-2 border-earth-100 pl-3' : ''}`}>
      <div className={`rounded-xl p-3 ${c.id === best ? 'bg-green-50 border border-green-200' : 'bg-earth-50/60'}`}>
        <div className="flex items-center gap-2 text-xs mb-1">
          <Link href={`/community/u/${c.author_id}`} className="font-semibold text-earth-700 hover:text-saffron-600">{c.author?.username ?? 'member'}</Link>
          <span className="text-earth-400">{timeAgo(c.created_at)}</span>
          {c.id === best && <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700"><CheckCircle2 size={12} /> Best answer</span>}
        </div>
        <p className="text-sm text-earth-800 whitespace-pre-wrap">{c.content}</p>
        <div className="flex items-center gap-3 mt-2 text-xs">
          <LikeButton kind="comment" id={c.id} count={c.like_count} liked={likedIds.has(c.id)} />
          {!isReply && user && <button onClick={() => { setReplyTo(replyTo === c.id ? null : c.id); setReplyText(''); }} className="inline-flex items-center gap-1 text-earth-400 hover:text-saffron-600"><CornerDownRight size={13} /> Reply</button>}
          {isQuestion && isOwner && <button onClick={() => markBest(c.id)} className={`inline-flex items-center gap-1 ${c.id === best ? 'text-green-600' : 'text-earth-400 hover:text-green-600'}`}><CheckCircle2 size={13} /> {c.id === best ? 'Unmark' : 'Mark best'}</button>}
          {user?.id === c.author_id && <button onClick={() => del(c.id)} className="inline-flex items-center gap-1 text-earth-400 hover:text-red-500 ml-auto"><Trash2 size={13} /> Delete</button>}
        </div>
      </div>
      {replyTo === c.id && (
        <div className="ml-6 mt-2 flex gap-2">
          <input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply…"
            onKeyDown={(e) => e.key === 'Enter' && addComment(replyText, c.id)}
            className="flex-1 px-3 py-2 rounded-lg border border-earth-200 text-sm focus:border-saffron-400 focus:outline-none" />
          <button onClick={() => addComment(replyText, c.id)} disabled={busy} className="btn-primary text-sm px-3 py-2">Reply</button>
        </div>
      )}
      {repliesOf(c.id).map((r) => <div key={r.id} className="mt-2"><Item c={r} isReply /></div>)}
    </div>
  );

  return (
    <div>
      <h3 className="font-display font-bold text-earth-900 mb-3">
        {isQuestion ? 'Answers' : 'Comments'} ({comments.length})
      </h3>

      {user ? (
        <div className="flex gap-2 mb-5">
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2}
            placeholder={isQuestion ? 'Share your answer…' : 'Add a comment…'}
            className="flex-1 px-3 py-2 rounded-xl border border-earth-200 text-sm focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100" />
          <button onClick={() => addComment(text, null)} disabled={busy || !text.trim()} className="btn-primary px-4 py-2 self-end disabled:opacity-50">Post</button>
        </div>
      ) : (
        <div className="mb-5"><AuthPanel message="Sign in to join the conversation." /></div>
      )}

      <div className="space-y-3">
        {tops.length === 0 && <p className="text-sm text-earth-400">No {isQuestion ? 'answers' : 'comments'} yet — be the first.</p>}
        {tops.map((c) => <Item key={c.id} c={c} />)}
      </div>
    </div>
  );
}
