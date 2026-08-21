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
    <div className={cn('flex flex-col items-center justify-center gap-4 p-8 text-center', className)}>
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--surface-2)] text-[var(--text-muted)]">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
        {description && <p className="max-w-xs text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>}
      </div>
      {action}
    </div>
  )
}
