'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { AuthSplash } from '@/components/common/AuthSplash'

/**
 * The session lives in localStorage, so the destination can only be decided
 * on the client. Redirecting from the server here would also abort the
 * prerender that `cacheComponents` uses to validate instant navigation.
 */
export default function RootPage() {
  const status = useAuthStore((s) => s.status)
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/chat')
    } else if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  return <AuthSplash />
}
