'use client';

import { WifiOff } from 'lucide-react';
import { useSocket } from '@/lib/hooks/useSocket';

export function ConnectionBanner() {
  const { socket, isConnected } = useSocket();

  if (!socket || isConnected) return null;

  return (
    <div
      className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-amber-300 bg-amber-500/10 border-b border-amber-500/20 animate-fade-in shrink-0"
      role="status"
      aria-live="polite"
    >
      <WifiOff className="w-3.5 h-3.5 animate-pulse-soft" aria-hidden="true" />
      Connection lost. Reconnecting…
    </div>
  );
}
