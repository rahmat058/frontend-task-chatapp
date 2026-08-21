'use client'

import { AlertTriangle, RotateCw } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/utils/cn'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Failed to load data. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 p-8 text-center', className)} role="alert">
      <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--danger-soft)] text-[var(--danger)]">
        <AlertTriangle className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
        <p className="max-w-xs text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} leftIcon={<RotateCw className="h-3.5 w-3.5" />}>
          Try again
        </Button>
      )}
    </div>
  )
}
