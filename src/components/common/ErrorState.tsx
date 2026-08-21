'use client';

import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Failed to load data. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 text-2xl">
        ⚠️
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-[var(--color-text-primary)]">{title}</p>
        <p className="text-sm text-[var(--color-text-secondary)] max-w-xs">
          {description}
        </p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
