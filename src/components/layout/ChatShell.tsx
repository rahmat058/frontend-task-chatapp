'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { AuthSplash } from '@/components/common/AuthSplash';

/**
 * Auth gate for every `/chat` route. Renders nothing but a splash until the
 * stored JWT has been validated, so a returning user is never bounced to
 * the login screen mid-restore.
 */
export function ChatShell({ children }: { children: React.ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status !== 'authenticated') {
    return <AuthSplash />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)]">
      <div className="w-80 shrink-0 hidden sm:flex flex-col">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg)]">
        {children}
      </main>
    </div>
  );
}
