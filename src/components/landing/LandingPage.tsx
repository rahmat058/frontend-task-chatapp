import Image from 'next/image'
import Link from 'next/link'
import { Lock, MessageSquare, Play, Shield, Users, Zap } from 'lucide-react'
import { MarketingNav } from './MarketingNav'
import { BrandMark } from '@/components/common/BrandMark'
import { buttonClassName } from '@/components/common/buttonStyles'
import { cn } from '@/lib/utils/cn'

const trust = [
  { icon: Lock, label: 'Phone sign-in' },
  { icon: Zap, label: 'Real-time delivery' },
  { icon: Shield, label: 'Session restore' },
]

const capabilities = [
  {
    icon: MessageSquare,
    title: 'Direct messages',
    body: 'Search by name or phone and open a 1:1 thread. Names stay attached even when the API only returns ids.',
  },
  {
    icon: Users,
    title: 'Groups',
    body: 'Create a group, then rename, add, promote, remove, or leave — including Manage group for admins.',
  },
  {
    icon: Zap,
    title: 'Real-time delivery',
    body: 'Messages land over Socket.io. If you are in another thread, the unread mark lights instead of stealing your scroll.',
  },
]

const trail = [
  {
    title: 'Sign in with a phone number',
    body: 'Enter a name and a Bangladesh number. A new number registers; a known number returns. No password.',
  },
  {
    title: 'Find people',
    body: 'Search, open a direct thread, or start a group. The inbox is the list of conversations you already have.',
  },
  {
    title: 'Stay on the line',
    body: 'Send immediately, reconnect if the socket drops, and reload without losing the session.',
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <a
        href="#offer"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-[var(--radius-md)] focus:bg-[var(--green-600)] focus:px-3 focus:py-2 focus:text-sm">
        Skip to offer
      </a>
      <MarketingNav />

      <main>
        <section
          id="offer"
          className="mx-auto max-w-[1200px] px-6 pt-16 pb-20 md:px-10 md:pt-20 md:pb-24 lg:px-16 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[42%_1fr] lg:gap-16">
            <div className="max-w-xl">
              <h1 className="text-[40px] leading-[1.12] font-[650] tracking-[-0.03em] text-balance sm:text-[56px] sm:leading-[1.06]">
                Conversation, without the noise.
              </h1>
              <p className="mt-5 max-w-[38ch] text-base leading-relaxed text-[var(--text-secondary)] sm:text-[18px] sm:leading-[1.55]">
                Private messages and groups that stay in sync — instantly.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/login" className={buttonClassName({ size: 'lg' })}>
                  Open ChatApp
                </Link>
                <a href="#how-it-works" className={cn(buttonClassName({ variant: 'secondary', size: 'lg' }), 'gap-2')}>
                  <Play className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                  See how it works
                </a>
              </div>
              <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
                {trust.map((item) => (
                  <li key={item.label} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <span className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--green-border)] text-[var(--green-400)]">
                      <item.icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            <figure className="relative">
              <div className="overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface-1)] shadow-[var(--shadow-card)]">
                <Image
                  src="/hero-illustration.png"
                  alt="ChatApp product preview: inbox, conversation list, and an active group thread."
                  width={786}
                  height={513}
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-3 text-center text-xs leading-[1.45] text-[var(--text-muted)]">
                Product preview. Authored mock — not a live session.
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="features" className="border-t border-[var(--border-subtle)]">
          <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-20 lg:px-16">
            <h2 className="sr-only">What ChatApp does</h2>
            <div className="grid gap-10 md:grid-cols-3 md:gap-8">
              {capabilities.map((item) => (
                <article key={item.title}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--green-soft)] text-[var(--green-400)]">
                    <item.icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-[22px] leading-[1.3] font-semibold">{item.title}</h3>
                  <p className="mt-3 max-w-prose text-sm leading-relaxed text-[var(--text-secondary)]">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-t border-[var(--border-subtle)] bg-[var(--surface-1)]">
          <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 lg:px-16">
            <h2 className="max-w-[18ch] text-[30px] leading-[1.2] font-[620] tracking-[-0.02em]">
              Log in, find people, chat
            </h2>
            <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
              {trail.map((step, index) => (
                <li key={step.title}>
                  <span className="text-xs font-medium text-[var(--green-400)] tabular-nums">{index + 1}</span>
                  <h3 className="mt-2 text-base leading-[1.35] font-semibold">{step.title}</h3>
                  <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--text-secondary)]">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-[var(--border-subtle)]">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between md:px-10 md:py-20 lg:px-16">
            <div>
              <h2 className="text-[30px] leading-[1.2] font-[620] tracking-[-0.02em]">Ready to start a thread?</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                Sign in with your phone and name. No password.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/login" className={buttonClassName({ size: 'lg' })}>
                Open ChatApp
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--green-400)] hover:text-[var(--green-300)]">
                See how it works →
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface-1)]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10 lg:px-16">
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
        </div>
      </footer>
    </div>
  )
}
