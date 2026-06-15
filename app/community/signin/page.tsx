'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/community/AuthProvider';
import { AuthPanel } from '@/components/community/AuthPanel';

export default function SignInPage() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => { if (user) router.push('/community'); }, [user, router]);
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <AuthPanel />
    </div>
  );
}
