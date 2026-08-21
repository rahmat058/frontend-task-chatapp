import type { Metadata } from 'next'
import Link from 'next/link'
import { Compass, MoveLeft } from 'lucide-react'
import { buttonClassName } from '@/components/common/buttonStyles'

export const metadata: Metadata = {
  title: 'Page not found — ChatApp',
}

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-canvas)] px-4 py-12">
      <div className="flex w-full max-w-sm flex-col items-center gap-5 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--surface-2)] text-[var(--text-muted)]">
          <Compass className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-[22px] font-semibold text-[var(--text-primary)]">This page doesn&apos;t exist</h1>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            The link may be broken, or the conversation may have been deleted.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:flex-row">
          <Link href="/" className={buttonClassName({ variant: 'secondary', size: 'lg' })}>
            ChatApp home
          </Link>
          <Link href="/chat" className={buttonClassName({ size: 'lg' })}>
            <MoveLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            Back to your chats
          </Link>
        </div>
      </div>
    </main>
  )
}
