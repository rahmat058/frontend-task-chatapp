'use client'

import { WifiOff } from 'lucide-react'
import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus'

/**
 * Shown only when the browser reports no network. A Socket.io handshake after
 * refresh is not "offline" and must not flash this banner.
 */
export function ConnectionBanner() {
  const online = useOnlineStatus()

  if (online) return null

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
