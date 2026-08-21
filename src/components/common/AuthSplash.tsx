'use client'

import { Spinner } from './Spinner'
import { BrandMark } from './BrandMark'

/** Shown while the stored session is being validated against `GET /auth/me`. */
export function AuthSplash({ label = 'Restoring your session…' }: { label?: string }) {
  return (
    <div
      className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-4 bg-[var(--bg-app)]"
      role="status"
      aria-live="polite">
      <BrandMark size="md" />
      <Spinner size="md" className="text-[var(--green-400)]" />
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
    </div>
  )
}
