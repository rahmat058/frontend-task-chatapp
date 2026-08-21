'use client'

import { useEffect } from 'react'
import { Check, X } from 'lucide-react'
import { useToastStore } from '@/lib/store/toastStore'

export function ToastHost() {
  const message = useToastStore((s) => s.message)
  const hide = useToastStore((s) => s.hide)

  useEffect(() => {
    if (!message) return
    const id = window.setTimeout(hide, 3200)
    return () => window.clearTimeout(id)
  }, [message, hide])

  if (!message) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-4 bottom-4 z-[60] flex min-h-12 w-[min(360px,calc(100vw-2rem))] items-center gap-3 rounded-[var(--radius-md)] border border-[var(--green-border)] bg-[var(--surface-1)] px-3 py-2.5 text-sm text-[var(--text-primary)] shadow-[var(--shadow-card)] max-sm:right-1/2 max-sm:bottom-6 max-sm:translate-x-1/2">
      <Check className="h-[18px] w-[18px] shrink-0 text-[var(--green-400)]" strokeWidth={1.75} aria-hidden="true" />
      <p className="min-w-0 flex-1">{message}</p>
      <button
        type="button"
        onClick={hide}
        aria-label="Dismiss notification"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-[var(--text-muted)] hover:text-[var(--text-primary)]">
        <X className="h-4 w-4" strokeWidth={1.75} />
      </button>
    </div>
  )
}
