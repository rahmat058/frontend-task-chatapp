'use client';

interface ScrollToBottomProps {
  onClick: () => void;
}

export function ScrollToBottom({ onClick }: ScrollToBottomProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Scroll to latest message"
      className="
        absolute bottom-4 right-4 z-10
        w-9 h-9 rounded-full shadow-lg
        bg-[var(--color-primary)] text-white
        flex items-center justify-center
        hover:bg-[var(--color-primary-hover)]
        transition-all duration-150 animate-fade-in
        active:scale-95
      "
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}
