'use client';

interface ScrollToBottomProps {
  onClick: () => void;
  hasNewMessages?: boolean;
}

export function ScrollToBottom({ onClick, hasNewMessages = false }: ScrollToBottomProps) {
  return (
    <button
      onClick={onClick}
      aria-label={hasNewMessages ? 'Jump to new messages' : 'Scroll to latest message'}
      className={`
        absolute bottom-4 right-4 z-10
        flex items-center gap-1.5 rounded-full shadow-lg
        bg-[var(--color-primary)] text-white
        hover:bg-[var(--color-primary-hover)]
        transition-all duration-150 animate-fade-in
        active:scale-95
        ${hasNewMessages ? 'px-3 h-9 text-xs font-medium' : 'w-9 h-9 justify-center'}
      `}
    >
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
      </svg>
      {hasNewMessages && <span>New message</span>}
    </button>
  );
}
