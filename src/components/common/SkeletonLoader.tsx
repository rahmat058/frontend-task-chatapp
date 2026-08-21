'use client'

import { cn } from '@/lib/utils/cn'

interface SkeletonLoaderProps {
  variant?: 'conversation' | 'message'
  count?: number
  className?: string
}

function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5">
      <div className="h-10 w-10 shrink-0 rounded-full bg-[var(--surface-3)]" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-3.5 w-2/3 rounded bg-[var(--surface-3)]" />
        <div className="h-2.5 w-4/5 rounded bg-[var(--surface-3)] opacity-60" />
      </div>
    </div>
  )
}

function MessageSkeleton({ isMine = false }: { isMine?: boolean }) {
  return (
    <div className={cn('flex', isMine ? 'justify-end' : 'justify-start')}>
      <div className={cn('h-10 rounded-[10px] bg-[var(--surface-3)]', isMine ? 'w-48' : 'w-56')} />
    </div>
  )
}

export function SkeletonLoader({ variant = 'conversation', count = 5, className }: SkeletonLoaderProps) {
  if (variant === 'message') {
    return (
      <div className={cn('flex flex-col gap-3 p-4', className)} aria-hidden="true">
        {Array.from({ length: count }).map((_, i) => (
          <MessageSkeleton key={i} isMine={i % 3 === 0} />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col', className)} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <ConversationSkeleton key={i} />
      ))}
    </div>
  )
}
