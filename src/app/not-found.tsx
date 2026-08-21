import type { Metadata } from 'next'
import Link from 'next/link'
import { Compass, MoveLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Page not found — ChatApp',
}

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 py-12">
      <div className="animate-fade-in flex w-full max-w-sm flex-col items-center gap-5 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface-2)] text-[var(--color-text-muted)]">
          <Compass className="h-7 w-7" aria-hidden="true" />
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs tracking-widest text-[var(--color-text-muted)]">404</p>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">This page doesn&apos;t exist</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            The link may be broken, or the conversation may have been deleted.
          </p>
        </div>

        <Link
          href="/chat"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-6 text-base font-medium text-white transition-colors duration-150 hover:bg-[var(--color-primary-hover)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">
          <MoveLeft className="h-4 w-4" aria-hidden="true" />
          Back to your chats
        </Link>
      </div>
    </main>
  )
}
