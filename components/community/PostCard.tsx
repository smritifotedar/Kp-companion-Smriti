'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import type { Post } from '@/lib/community/types';
import { TYPE_LABEL } from '@/lib/community/categories';
import { timeAgo, TYPE_BADGE } from '@/lib/community/format';
import { LikeButton } from './LikeButton';

export function PostCard({ post, liked }: { post: Post; liked: boolean }) {
  return (
    <div className="rounded-2xl border border-earth-100 bg-white p-4 hover:shadow-premium transition-shadow">
      <div className="flex items-center gap-2 text-xs mb-1.5 flex-wrap">
        <span className={`font-semibold px-2 py-0.5 rounded-full ${TYPE_BADGE[post.type]}`}>{TYPE_LABEL[post.type]}</span>
        <span className="text-earth-500">{post.category}</span>
        <span className="text-earth-300">·</span>
        <span className="text-earth-400">{timeAgo(post.created_at)}</span>
      </div>
      <Link href={`/community/${post.id}`}>
        <h3 className="font-display font-bold text-earth-900 hover:text-saffron-600 transition-colors leading-snug">{post.title}</h3>
      </Link>
      <p className="text-sm text-earth-600 mt-1 line-clamp-2">{post.content}</p>
      <div className="flex items-center gap-4 mt-3">
        <LikeButton kind="post" id={post.id} count={post.like_count} liked={liked} />
        <Link href={`/community/${post.id}`} className="inline-flex items-center gap-1 text-sm text-earth-400 hover:text-saffron-600">
          <MessageCircle size={15} /> {post.comment_count}
        </Link>
        <Link href={`/community/u/${post.author_id}`} className="ml-auto text-xs text-earth-400 hover:text-saffron-600">
          by {post.author?.username ?? 'member'}
        </Link>
      </div>
    </div>
  );
}
