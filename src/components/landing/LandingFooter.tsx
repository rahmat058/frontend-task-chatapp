import Link from 'next/link'
import { LandingContainer } from './LandingContainer'
import { BrandMark } from '@/components/common/BrandMark'

export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface-1)]/80">
      <LandingContainer className="flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <BrandMark size="sm" />
          <div>
            <p className="text-sm font-semibold">ChatApp</p>
            <p className="text-xs text-[var(--text-muted)]">© 2026 ChatApp. Realtime messaging client.</p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)]" aria-label="Footer">
          <Link href="/login" className="hover:text-[var(--text-primary)]">
            Sign in
          </Link>
          <Link href="/chat" className="hover:text-[var(--text-primary)]">
            Open app
          </Link>
        </nav>
      </LandingContainer>
    </footer>
  )
}
