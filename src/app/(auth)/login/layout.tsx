import type { Metadata } from 'next'
import { MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sign in — ChatApp',
  description: 'Sign in with your phone number to access your chats.',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 py-12">
      <div className="animate-fade-in relative w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-8 shadow-2xl">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg">
            <MessageSquare className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Welcome to ChatApp</h1>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Enter your details to continue</p>
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}
