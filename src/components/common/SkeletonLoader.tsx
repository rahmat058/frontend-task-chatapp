'use client';

interface SkeletonLoaderProps {
  variant?: 'conversation' | 'message' | 'text';
  count?: number;
}

function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 animate-pulse-soft">
      <div className="w-10 h-10 rounded-full bg-[var(--color-surface-3)] shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3.5 bg-[var(--color-surface-3)] rounded-full w-2/3" />
        <div className="h-2.5 bg-[var(--color-surface-3)] rounded-full w-4/5 opacity-60" />
      </div>
      <div className="h-2 w-8 bg-[var(--color-surface-3)] rounded-full opacity-40" />
    </div>
  );
}

function MessageSkeleton({ isMe = false }: { isMe?: boolean }) {
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-pulse-soft`}>
      <div
        className={`
          h-10 rounded-2xl bg-[var(--color-surface-3)]
          ${isMe ? 'w-48' : 'w-56'}
        `}
      />
    </div>
  );
}

export function SkeletonLoader({ variant = 'conversation', count = 5 }: SkeletonLoaderProps) {
  if (variant === 'message') {
    return (
      <div className="flex flex-col gap-3 p-4">
        {Array.from({ length: count }).map((_, i) => (
          <MessageSkeleton key={i} isMe={i % 3 === 0} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {Array.from({ length: count }).map((_, i) => (
        <ConversationSkeleton key={i} />
      ))}
    </div>
  );
}
