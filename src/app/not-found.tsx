import type { Metadata } from 'next';
import Link from 'next/link';
import { Compass, MoveLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page not found — ChatApp',
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--color-bg)]">
      <div className="w-full max-w-sm flex flex-col items-center text-center gap-5 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-2)] flex items-center justify-center text-[var(--color-text-muted)]">
          <Compass className="w-7 h-7" aria-hidden="true" />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-mono tracking-widest text-[var(--color-text-muted)]">
            404
          </p>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
            This page doesn&apos;t exist
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            The link may be broken, or the conversation may have been deleted.
          </p>
        </div>

        <Link
          href="/chat"
          className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md text-base font-medium bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          <MoveLeft className="w-4 h-4" aria-hidden="true" />
          Back to your chats
        </Link>
      </div>
    </main>
  );
}
