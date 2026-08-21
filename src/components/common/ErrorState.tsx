'use client';

import { AlertTriangle, RotateCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils/cn';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Failed to load data. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 p-8 text-center animate-fade-in',
        className
      )}
      role="alert"
    >
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400">
        <AlertTriangle className="w-6 h-6" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-[var(--color-text-primary)]">{title}</p>
        <p className="text-sm text-[var(--color-text-secondary)] max-w-xs">
          {description}
        </p>
      </div>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RotateCw className="w-3.5 h-3.5" />}
        >
          Try again
        </Button>
      )}
    </div>
  );
}
