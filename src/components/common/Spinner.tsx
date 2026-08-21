'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
} as const;

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <Loader2
      aria-label="Loading"
      className={cn('animate-spin text-current', sizes[size], className)}
    />
  );
}
