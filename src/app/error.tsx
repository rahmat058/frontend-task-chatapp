'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCw, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/common/Button';

/**
 * Catches render errors in every route segment below the root layout.
 * Errors thrown by the root layout itself fall through to `global-error.tsx`.
 */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--color-bg)]">
      <div className="w-full max-w-sm flex flex-col items-center text-center gap-5 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400">
          <TriangleAlert className="w-7 h-7" aria-hidden="true" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
            Something went wrong
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            This screen failed to load. Trying again will re-fetch it.
          </p>
          {/* Server errors arrive with a generic message; the digest is the
              only way to correlate this screen with the server logs. */}
          {error.digest && (
            <p className="text-xs font-mono text-[var(--color-text-muted)] mt-1">
              Reference: {error.digest}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="lg"
            onClick={() => retry()}
            leftIcon={<RotateCw className="w-4 h-4" />}
          >
            Try again
          </Button>
          <Link
            href="/chat"
            className="inline-flex items-center justify-center h-11 px-6 rounded-md text-base font-medium bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-3)] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            Back to chats
          </Link>
        </div>
      </div>
    </main>
  );
}
