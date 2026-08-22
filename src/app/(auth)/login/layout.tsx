import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Lock, Shield, User, Zap } from 'lucide-react'
import { BrandMark } from '@/components/common/BrandMark'

export const metadata: Metadata = {
  title: 'Sign in — ChatApp',
  description: 'Sign in with your phone number to access your chats.',
}

const points = [
  {
    icon: Shield,
    title: 'Private by default',
    body: 'Direct threads and groups stay in your account — not a public feed.',
  },
  {
    icon: Zap,
    title: 'Real-time conversations',
    body: 'Messages deliver instantly while you are connected. No refresh required.',
  },
  {
    icon: User,
    title: 'No password required',
    body: 'Sign in with your phone number and get started in seconds.',
  },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="login-canvas min-h-screen text-[var(--text-primary)]">
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

      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-[1200px] items-center gap-12 px-5 py-10 md:px-10 lg:grid-cols-[1.05fr_440px] lg:gap-20 lg:px-16 lg:py-8">
        <div className="hidden max-w-xl lg:block">
          <h1 className="text-[40px] leading-[1.08] font-[650] tracking-[-0.03em] text-balance xl:text-[56px] xl:leading-[1.06]">
            Chat that stays <span className="text-[var(--green-400)]">private</span> and simple.
          </h1>
          <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-[var(--text-secondary)]">
            ChatApp is the easy way to talk in real time. No passwords, no clutter — just conversations that stay
            between you and your people.
          </p>
          <ul className="mt-12 flex flex-col gap-7">
            {points.map((item) => (
              <li key={item.title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--green-border)] bg-[var(--surface-1)] text-[var(--green-400)]">
                  <item.icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[15px] font-semibold">{item.title}</p>
                  <p className="mt-1 max-w-[36ch] text-sm leading-relaxed text-[var(--text-secondary)]">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-[440px]">
          <div className="rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--surface-1)] p-8 shadow-[0_24px_64px_rgb(0_0_0_/_0.45),0_0_0_1px_rgb(53_208_127_/_0.08)] sm:p-10">
            <div className="mb-8 flex flex-col items-center text-center">
              <BrandMark size="sm" />
              <h2 className="mt-5 text-[22px] leading-[1.3] font-semibold">Welcome back</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                Enter your details to continue.
              </p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
