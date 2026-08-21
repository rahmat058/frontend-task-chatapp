'use client'

import { WifiOff } from 'lucide-react'
import { useSocket } from '@/lib/hooks/useSocket'

export function ConnectionBanner() {
  const { socket, isConnected } = useSocket()

  if (!socket || isConnected) return null

  return (
    <div
      className="animate-fade-in flex shrink-0 items-center justify-center gap-2 border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-300"
      role="status"
      aria-live="polite">
      <WifiOff className="animate-pulse-soft h-3.5 w-3.5" aria-hidden="true" />
      Connection lost. Reconnecting…
    </div>
  )
}
