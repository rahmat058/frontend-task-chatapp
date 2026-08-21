'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import Link from 'next/link'
import { RotateCw, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/common/Button'

/**
 * Catches render errors in every route segment below the root layout.
 * Errors thrown by the root layout itself fall through to `global-error.tsx`.
 */
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 py-12">
      <div className="animate-fade-in flex w-full max-w-sm flex-col items-center gap-5 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
          <TriangleAlert className="h-7 w-7" aria-hidden="true" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Something went wrong</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            This screen failed to load. Trying again will re-fetch it.
          </p>
          {/* Server errors arrive with a generic message; the digest is the
              only way to correlate this screen with the server logs. */}
          {error.digest && (
            <p className="mt-1 font-mono text-xs text-[var(--color-text-muted)]">Reference: {error.digest}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button size="lg" onClick={() => retry()} leftIcon={<RotateCw className="h-4 w-4" />}>
            Try again
          </Button>
          <Link
            href="/chat"
            className="inline-flex h-11 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-6 text-base font-medium text-[var(--color-text-primary)] transition-colors duration-150 hover:bg-[var(--color-surface-3)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">
            Back to chats
          </Link>
        </div>
      </div>
    </main>
  )
}
