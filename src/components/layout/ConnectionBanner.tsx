'use client'

import { WifiOff } from 'lucide-react'
import { useSocket } from '@/lib/hooks/useSocket'

export function ConnectionBanner() {
  const { socket, isConnected } = useSocket()

  if (!socket || isConnected) return null

  return (
    <div
      className="flex shrink-0 items-center justify-center gap-2 border-b border-[var(--warning)]/25 bg-[color-mix(in_srgb,var(--warning)_10%,transparent)] px-4 py-2 text-xs font-medium text-[var(--warning)]"
      role="status"
      aria-live="polite">
      <WifiOff className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
      Connection lost. Reconnecting…
    </div>
  )
}
