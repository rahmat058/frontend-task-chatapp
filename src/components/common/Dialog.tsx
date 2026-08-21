'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/utils/cn'

interface DialogProps {
  title: string
  description?: string
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function Dialog({ title, description, onClose, children, footer, className }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    panelRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previous?.focus()
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--overlay)] px-0 sm:items-center sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby={description ? 'dialog-desc' : undefined}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}>
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          'flex w-full max-w-md flex-col overflow-hidden border border-[var(--border-default)] bg-[var(--surface-1)] shadow-[var(--shadow-dialog)]',
          'max-h-[min(92dvh,calc(100dvh-1rem))] rounded-t-[var(--radius-lg)] pb-[env(safe-area-inset-bottom)]',
          'sm:max-h-[min(85dvh,calc(100dvh-2rem))] sm:rounded-[var(--radius-lg)] sm:pb-0',
          'outline-none',
          className,
        )}>
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--border-subtle)] px-5 py-4">
          <div className="min-w-0">
            <h2 id="dialog-title" className="text-base leading-[1.35] font-semibold text-[var(--text-primary)]">
              {title}
            </h2>
            {description && (
              <p id="dialog-desc" className="mt-1 text-xs text-[var(--text-muted)]">
                {description}
              </p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close dialog" className="shrink-0">
            <X className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>

        {footer && (
          <div className="flex shrink-0 justify-end gap-2 border-t border-[var(--border-subtle)] px-5 py-4">{footer}</div>
        )}
      </div>
    </div>
  )
}
