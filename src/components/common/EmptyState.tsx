'use client'

import { cn } from '@/lib/utils/cn'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('animate-fade-in flex flex-col items-center justify-center gap-4 p-8 text-center', className)}>
      {icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface-2)] text-[var(--color-text-muted)]">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-[var(--color-text-primary)]">{title}</p>
        {description && <p className="max-w-xs text-sm text-[var(--color-text-secondary)]">{description}</p>}
      </div>
      {action}
    </div>
  )
}
