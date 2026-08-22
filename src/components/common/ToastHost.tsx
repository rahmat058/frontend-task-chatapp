'use client'

import { useEffect } from 'react'
import { Toast } from './Toast'
import { useToastStore } from '@/lib/store/toastStore'

const TOAST_MS = 3600

export function ToastHost() {
  const message = useToastStore((s) => s.message)
  const tone = useToastStore((s) => s.tone)
  const hide = useToastStore((s) => s.hide)

  useEffect(() => {
    if (!message) return
    const id = window.setTimeout(hide, TOAST_MS)
    return () => window.clearTimeout(id)
  }, [message, hide])

  if (!message) return null

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[80] pb-[env(safe-area-inset-bottom)]">
      <div className="pointer-events-auto">
        <Toast key={`${tone}-${message}`} message={message} tone={tone} onDismiss={hide} />
      </div>
    </div>
  )
}
