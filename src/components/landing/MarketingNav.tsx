'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { Menu, X } from 'lucide-react'
import { useAuthStore } from '@/lib/store/authStore'
import { scrollToHash } from '@/lib/utils/scrollToHash'
import { BrandMark } from '@/components/common/BrandMark'
import { buttonClassName } from '@/components/common/buttonStyles'

const links = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#faq', label: 'FAQ' },
]

export function MarketingNav() {
  const status = useAuthStore((s) => s.status)
  const signedIn = status === 'authenticated'
  const [open, setOpen] = useState(false)
  const appHref = signedIn ? '/chat' : '/login'

  return (
    <nav className="fixed inset-x-4 top-4 z-50 mx-auto max-w-6xl">
      <div className={cn('landing-nav-glass', open ? 'rounded-[1.25rem]' : 'rounded-2xl')}>
        <div className="flex h-14 items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <BrandMark size="sm" />
            <span className="text-base font-semibold text-[var(--text-primary)] sm:text-lg">ChatApp</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex lg:gap-8" aria-label="Landing">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--text-secondary)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--text-primary)] focus-visible:shadow-[var(--focus-ring)]"
                onClick={(event) => scrollToHash(event, link.href)}>
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-2 sm:gap-4 md:flex">
            {!signedIn && (
              <Link href="/login" className={cn(buttonClassName({ size: 'md' }), 'landing-btn-primary')}>
                Log in
              </Link>
            )}
          </div>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] focus-visible:shadow-[var(--focus-ring)] md:hidden"
            aria-expanded={open}
            aria-controls="landing-menu"
            onClick={() => setOpen((v) => !v)}>
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            {open ? (
              <X className="h-[18px] w-[18px]" strokeWidth={1.75} />
            ) : (
              <Menu className="h-[18px] w-[18px]" strokeWidth={1.75} />
            )}
          </button>
        </div>

        {open && (
          <div id="landing-menu" className="border-t border-white/10 px-4 pt-2 pb-4 sm:px-6 md:hidden">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex min-h-11 items-center text-sm text-[var(--text-secondary)]"
                  onClick={(event) => scrollToHash(event, link.href, () => setOpen(false))}>
                  {link.label}
                </a>
              ))}
              {!signedIn && (
                <Link
                  href="/login"
                  className="flex min-h-11 items-center text-sm text-[var(--text-secondary)]"
                  onClick={() => setOpen(false)}>
                  Log in
                </Link>
              )}
              <Link
                href={appHref}
                className={cn(buttonClassName({ size: 'lg' }), 'landing-btn-primary mt-2 w-full')}
                onClick={() => setOpen(false)}>
                {signedIn ? 'Open ChatApp' : 'Sign up'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
