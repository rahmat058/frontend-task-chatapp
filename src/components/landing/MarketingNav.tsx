'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { Menu, X } from 'lucide-react'
import { useAuthStore } from '@/lib/store/authStore'
import { scrollToHash } from '@/lib/utils/scrollToHash'
import { LandingContainer } from './LandingContainer'
import { BrandMark } from '@/components/common/BrandMark'
import { buttonClassName } from '@/components/common/buttonStyles'

const links = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
]

export function MarketingNav() {
  const status = useAuthStore((s) => s.status)
  const signedIn = status === 'authenticated'
  const [open, setOpen] = useState(false)
  const href = signedIn ? '/chat' : '/login'

  return (
    <header className="sticky top-0 z-40 pt-3">
      <LandingContainer>
        <div className={cn('landing-nav-glass', open ? 'rounded-[1.75rem] lg:rounded-full' : 'rounded-full')}>
          <div className="relative flex h-14 items-center justify-between gap-4 px-3 sm:px-4">
            <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
              <BrandMark size="sm" />
              <span className="text-[16px] leading-[1.35] font-semibold text-[var(--text-primary)]">ChatApp</span>
            </Link>

            <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex" aria-label="Landing">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-[var(--radius-sm)] text-sm text-[var(--text-secondary)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--text-primary)] focus-visible:shadow-[var(--focus-ring)]"
                  onClick={(event) => scrollToHash(event, link.href)}>
                  {link.label}
                </a>
              ))}
            </nav>

            <Link href={href} className={cn(buttonClassName({ size: 'md' }), 'hidden lg:inline-flex')}>
              Open ChatApp
            </Link>

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] focus-visible:shadow-[var(--focus-ring)] lg:hidden"
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
            <div id="landing-menu" className="border-t border-[var(--border-subtle)] px-3 pb-3 pt-1 sm:px-4 lg:hidden">
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
                <Link
                  href={href}
                  className={cn(buttonClassName({ size: 'lg' }), 'mt-2 w-full')}
                  onClick={() => setOpen(false)}>
                  Open ChatApp
                </Link>
              </div>
            </div>
          )}
        </div>
      </LandingContainer>
    </header>
  )
}
