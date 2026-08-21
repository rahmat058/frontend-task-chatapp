'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ScrollToBottomProps {
  onClick: () => void;
  hasNewMessages?: boolean;
}

export function ScrollToBottom({
  onClick,
  hasNewMessages = false,
}: ScrollToBottomProps) {
  return (
    <button
      onClick={onClick}
      aria-label={
        hasNewMessages ? 'Jump to new messages' : 'Scroll to latest message'
      }
      className={cn(
        'absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-md shadow-lg',
        'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]',
        'transition-all duration-150 animate-fade-in active:scale-95',
        'focus-visible:ring-2 focus-visible:ring-white/70',
        hasNewMessages ? 'px-3 h-9 text-xs font-medium' : 'w-9 h-9 justify-center'
      )}
    >
      <ChevronDown className="w-4 h-4 shrink-0" aria-hidden="true" />
      {hasNewMessages && <span>New message</span>}
    </button>
  );
}
