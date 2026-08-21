import Link from 'next/link'
import { LandingContainer } from './LandingContainer'
import { BrandMark } from '@/components/common/BrandMark'

const columns = [
  {
    title: 'Product',
    links: [
      { href: '#features', label: 'Features' },
      { href: '#how-it-works', label: 'How it works' },
      { href: '#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'App',
    links: [
      { href: '/login', label: 'Sign in' },
      { href: '/chat', label: 'Open app' },
    ],
  },
]

export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface-1)]">
      <LandingContainer className="grid gap-10 py-12 md:grid-cols-[1.4fr_repeat(2,minmax(0,1fr))_1.2fr] md:gap-8">
        <div>
          <div className="flex items-center gap-2.5">
            <BrandMark size="sm" />
            <p className="text-sm font-semibold">ChatApp</p>
          </div>
          <p className="mt-4 max-w-[32ch] text-sm leading-relaxed text-[var(--text-secondary)]">
            A realtime messaging client for direct threads and groups — quiet, capable, and fast.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <p className="text-xs font-medium tracking-wide text-[var(--text-muted)]">{column.title}</p>
            <nav className="mt-4 flex flex-col gap-2.5 text-sm text-[var(--text-secondary)]" aria-label={column.title}>
              {column.links.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-[var(--text-primary)]">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        ))}

        <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-2)] p-5">
          <p className="text-xs font-medium tracking-wide text-[var(--text-muted)]">Get in touch</p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            No password. Use a name and a Bangladesh phone number to start.
          </p>
          <Link href="/login" className="mt-4 inline-flex text-sm font-medium text-[var(--green-400)] hover:text-[var(--green-300)]">
            Sign in →
          </Link>
        </div>
      </LandingContainer>

      <div className="border-t border-[var(--border-subtle)]">
        <LandingContainer className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--text-muted)]">© 2026 ChatApp. Realtime messaging client.</p>
        </LandingContainer>
      </div>
    </footer>
  )
}
