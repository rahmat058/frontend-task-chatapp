import Link from 'next/link'
import { Lock, MessageSquare, Play, Shield, Users, Zap } from 'lucide-react'
import { MarketingNav } from './MarketingNav'
import { HeroPreview } from './HeroPreview'
import { Reveal } from './Reveal'
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
    <div className="login-canvas min-h-screen text-[var(--text-primary)]">
      <a
        href="#offer"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-[var(--radius-md)] focus:bg-[var(--green-600)] focus:px-3 focus:py-2 focus:text-sm">
        Skip to offer
      </a>
      <MarketingNav />

      <main>
        <section
          id="offer"
          className="mx-auto max-w-[1200px] px-6 pt-16 pb-20 md:px-10 md:pt-24 md:pb-28">
          <div className="grid items-center gap-14 lg:grid-cols-[42%_1fr] lg:gap-16">
            <Reveal>
              <h1 className="text-[40px] leading-[1.08] font-[650] tracking-[-0.03em] sm:text-[56px] sm:leading-[1.06]">
                Conversation,
                <br />
                without the noise.
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
              <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3">
                {trust.map((item) => (
                  <li key={item.label} className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
                    <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] border border-[var(--green-border)] bg-[var(--surface-1)] text-[var(--green-400)]">
                      <item.icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={80}>
              <HeroPreview />
            </Reveal>
          </div>
        </section>

        <section id="features" className="border-t border-[var(--border-subtle)]">
          <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10">
            <h2 className="sr-only">What ChatApp does</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {capabilities.map((item, index) => (
                <Reveal key={item.title} delay={index * 70}>
                  <article className="h-full rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-1)] p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--green-border)] bg-[var(--bg-canvas)] text-[var(--green-400)]">
                      <item.icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-[22px] leading-[1.3] font-semibold">{item.title}</h3>
                    <p className="mt-3 max-w-prose text-sm leading-relaxed text-[var(--text-secondary)]">{item.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-t border-[var(--border-subtle)] bg-[var(--surface-1)]">
          <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10">
            <Reveal>
              <h2 className="max-w-[18ch] text-[30px] leading-[1.2] font-[620] tracking-[-0.02em]">
                Log in, find people, chat
              </h2>
            </Reveal>
            <ol className="relative mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
              <span
                className="absolute top-3 right-[16%] left-[16%] hidden h-px bg-[var(--border-default)] md:block"
                aria-hidden="true"
              />
              {trail.map((step, index) => (
                <Reveal key={step.title} delay={index * 80}>
                  <li className="relative">
                    <span className="relative z-10 inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-[var(--green-border)] bg-[var(--surface-1)] px-2 text-xs font-medium text-[var(--green-400)] tabular-nums">
                      {index + 1}
                    </span>
                    <h3 className="mt-4 text-base leading-[1.35] font-semibold">{step.title}</h3>
                    <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--text-secondary)]">{step.body}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-[var(--border-subtle)]">
          <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-20 lg:px-16">
            <Reveal>
              <div className="flex flex-col gap-6 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-1)] px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-10">
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
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface-1)]/80">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
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
