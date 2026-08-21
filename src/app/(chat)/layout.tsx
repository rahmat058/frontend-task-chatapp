'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { useUIStore } from '@/lib/store/uiStore';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)]">
      {/* Sidebar */}
      <div className="w-80 shrink-0 hidden sm:flex flex-col">
        <Sidebar />
      </div>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg)]">
        {children}
      </main>
    </div>
  );
}
