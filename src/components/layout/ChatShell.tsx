'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import { Sidebar } from '@/components/layout/Sidebar'
import { NavRail } from '@/components/layout/NavRail'
import { AuthSplash } from '@/components/common/AuthSplash'
import { ToastHost } from '@/components/common/ToastHost'
import { cn } from '@/lib/utils/cn'

/**
 * Auth gate for every `/chat` route. Renders nothing but a splash until the
 * stored session has been validated, so a returning user is never bounced to
 * the login screen mid-restore.
 */
export function ChatShell({ children }: { children: React.ReactNode }) {
  const status = useAuthStore((s) => s.status)
  const router = useRouter()
  const pathname = usePathname()
  const isThread = Boolean(pathname && pathname.startsWith('/chat/') && pathname !== '/chat')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  if (status !== 'authenticated') {
    return <AuthSplash />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-app)]">
      <NavRail />
      <div className={cn('w-full shrink-0 flex-col md:flex md:w-[330px]', isThread ? 'hidden md:flex' : 'flex')}>
        <Sidebar />
      </div>
      <main className={cn('min-w-0 flex-1 flex-col bg-[var(--bg-app)]', isThread ? 'flex' : 'hidden md:flex')}>
        {children}
      </main>
      <ToastHost />
    </div>
  )
}
