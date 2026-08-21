'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { RotateCw, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { buttonClassName } from '@/components/common/buttonStyles'

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-canvas)] px-4 py-12">
      <div className="flex w-full max-w-sm flex-col items-center gap-5 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--danger-soft)] text-[var(--danger)]">
          <TriangleAlert className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-[22px] font-semibold text-[var(--text-primary)]">Something went wrong</h1>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            This screen failed to load. Trying again will re-fetch it.
          </p>
          {error.digest && <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">Reference: {error.digest}</p>}
        </div>

        <div className="flex items-center gap-2">
          <Button size="lg" onClick={() => retry()} leftIcon={<RotateCw className="h-4 w-4" />}>
            Try again
          </Button>
          <Link href="/chat" className={buttonClassName({ variant: 'secondary', size: 'lg' })}>
            Back to chats
          </Link>
        </div>
      </div>
    </main>
  )
}
