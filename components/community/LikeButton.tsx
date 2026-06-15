'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthProvider';

export function LikeButton({ kind, id, count, liked }: { kind: 'post' | 'comment'; id: string; count: number; liked: boolean }) {
  const { user } = useAuth();
  const router = useRouter();
  const [c, setC] = useState(count);
  const [l, setL] = useState(liked);
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    if (!user) { router.push('/community/signin'); return; }
    if (busy || !supabase) return;
    setBusy(true);
    const table = kind === 'post' ? 'post_likes' : 'comment_likes';
    const col = kind === 'post' ? 'post_id' : 'comment_id';
    try {
      if (l) {
        await supabase.from(table).delete().match({ user_id: user.id, [col]: id });
        setL(false); setC((x) => Math.max(0, x - 1));
      } else {
        await supabase.from(table).insert({ user_id: user.id, [col]: id });
        setL(true); setC((x) => x + 1);
      }
    } finally { setBusy(false); }
  };

  return (
    <button onClick={toggle} className={`inline-flex items-center gap-1 text-sm transition-colors ${l ? 'text-red-500' : 'text-earth-400 hover:text-red-400'}`}>
      <Heart size={15} className={l ? 'fill-current' : ''} /> {c}
    </button>
  );
}
