'use client'

import { AlertTriangle, Check, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { ToastTone } from '@/lib/store/toastStore'

const tones: Record<
  ToastTone,
  {
    icon: typeof Check
    iconClass: string
    rail: string
    border: string
    label: string
  }
> = {
  success: {
    icon: Check,
    iconClass: 'bg-[var(--green-soft)] text-[var(--green-400)]',
    rail: 'bg-[var(--green-400)]',
    border: 'border-[var(--green-border)]',
    label: 'Success',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'bg-[color-mix(in_srgb,var(--warning)_14%,transparent)] text-[var(--warning)]',
    rail: 'bg-[var(--warning)]',
    border: 'border-[color-mix(in_srgb,var(--warning)_35%,transparent)]',
    label: 'Warning',
  },
  info: {
    icon: Info,
    iconClass: 'bg-[color-mix(in_srgb,var(--info)_14%,transparent)] text-[var(--info)]',
    rail: 'bg-[var(--info)]',
    border: 'border-[color-mix(in_srgb,var(--info)_35%,transparent)]',
    label: 'Info',
  },
  error: {
    icon: AlertTriangle,
    iconClass: 'bg-[var(--danger-soft)] text-[var(--danger)]',
    rail: 'bg-[var(--danger)]',
    border: 'border-[color-mix(in_srgb,var(--danger)_35%,transparent)]',
    label: 'Error',
  },
}

interface ToastProps {
  message: string
  tone?: ToastTone
  onDismiss?: () => void
}

export function Toast({ message, tone = 'success', onDismiss }: ToastProps) {
  const config = tones[tone]
  const Icon = config.icon
  const assertive = tone === 'error' || tone === 'warning'

  return (
    <div
      role={assertive ? 'alert' : 'status'}
      aria-live={assertive ? 'assertive' : 'polite'}
      className={cn(
        'animate-fade-in relative flex min-h-12 w-[min(360px,calc(100vw-2rem))] overflow-hidden',
        'rounded-[var(--radius-md)] border bg-[var(--surface-2)] shadow-[var(--shadow-card)]',
        config.border,
      )}>
      <span className={cn('w-[3px] shrink-0', config.rail)} aria-hidden="true" />
      <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5">
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)]',
            config.iconClass,
          )}
          aria-hidden="true">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium tracking-wide text-[var(--text-muted)] uppercase">{config.label}</p>
          <p className="mt-0.5 text-sm leading-snug text-[var(--text-primary)]">{message}</p>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss notification"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-visible:shadow-[var(--focus-ring)]">
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        )}
      </div>
    </div>
  )
}
