'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { Sidebar } from '@/components/layout/Sidebar'
import { AuthSplash } from '@/components/common/AuthSplash'

/**
 * Auth gate for every `/chat` route. Renders nothing but a splash until the
 * stored JWT has been validated, so a returning user is never bounced to
 * the login screen mid-restore.
 */
export function ChatShell({ children }: { children: React.ReactNode }) {
  const status = useAuthStore((s) => s.status)
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  if (status !== 'authenticated') {
    return <AuthSplash />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)]">
      <div className="hidden w-80 shrink-0 flex-col sm:flex">
        <Sidebar />
      </div>

      <main className="flex min-w-0 flex-1 flex-col bg-[var(--color-bg)]">{children}</main>
    </div>
  )
}
