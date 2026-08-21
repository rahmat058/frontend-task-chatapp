'use client'

import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ScrollToBottomProps {
  onClick: () => void
  hasNewMessages?: boolean
}

export function ScrollToBottom({ onClick, hasNewMessages = false }: ScrollToBottomProps) {
  return (
    <button
      onClick={onClick}
      aria-label={hasNewMessages ? 'Jump to new messages' : 'Scroll to latest message'}
      className={cn(
        'absolute right-4 bottom-4 z-10 flex min-h-11 items-center gap-1.5 rounded-[var(--radius-md)]',
        'border border-[var(--border-default)] bg-[var(--surface-2)] text-[var(--text-primary)]',
        'hover:bg-[var(--surface-hover)] focus-visible:shadow-[var(--focus-ring)]',
        hasNewMessages ? 'h-11 px-3 text-xs font-medium' : 'h-11 w-11 justify-center',
      )}>
      <ChevronDown className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
      {hasNewMessages && <span>New message</span>}
    </button>
  )
}
