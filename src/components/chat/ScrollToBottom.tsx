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
        'absolute right-4 bottom-4 z-10 flex items-center gap-1.5 rounded-md shadow-lg',
        'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]',
        'animate-fade-in transition-all duration-150 active:scale-95',
        'focus-visible:ring-2 focus-visible:ring-white/70',
        hasNewMessages ? 'h-9 px-3 text-xs font-medium' : 'h-9 w-9 justify-center',
      )}>
      <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
      {hasNewMessages && <span>New message</span>}
    </button>
  )
}
