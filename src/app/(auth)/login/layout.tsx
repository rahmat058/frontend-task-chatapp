import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Lock, User, Zap } from 'lucide-react'
import { BrandMark } from '@/components/common/BrandMark'

export const metadata: Metadata = {
  title: 'Sign in — ChatApp',
  description: 'Sign in with your phone number to access your chats.',
}

const points = [
  {
    icon: User,
    title: 'Phone and name',
    body: 'A new number registers. A known number signs you back in.',
  },
  {
    icon: Zap,
    title: 'Real-time delivery',
    body: 'Messages arrive over a live socket. No refresh required.',
  },
  {
    icon: Lock,
    title: 'No password',
    body: 'This browser keeps the session. Reload restores it.',
  },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <header className="mx-auto flex h-16 max-w-[1200px] items-center gap-6 px-5 md:px-10 lg:px-16">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandMark size="sm" />
          <span className="text-[16px] font-semibold">ChatApp</span>
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          Back to home
        </Link>
      </header>

      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 py-10 md:px-10 lg:grid-cols-[1fr_440px] lg:gap-16 lg:px-16 lg:py-16">
        <div className="hidden max-w-lg lg:block">
          <h1 className="text-[40px] leading-[1.12] font-[650] tracking-[-0.03em] text-balance">
            Chat that stays simple.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
            Direct threads and groups on a hosted API. Sign in with your phone — no password, no extra accounts.
          </p>
          <ul className="mt-10 flex flex-col gap-6">
            {points.map((item) => (
              <li key={item.title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--green-soft)] text-[var(--green-400)]">
                  <item.icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-[440px]">
          <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-1)] p-8 shadow-[var(--shadow-card)]">
            <div className="mb-8">
              <BrandMark size="sm" />
              <h2 className="mt-4 text-[22px] leading-[1.3] font-semibold">Sign in</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                Phone and name. New numbers register; existing ones continue.
              </p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
