'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/auth/LoginForm'
import { useAuthStore } from '@/lib/store/authStore'
import { Spinner } from '@/components/common/Spinner'

export default function LoginPage() {
  const status = useAuthStore((s) => s.status)
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/chat')
    }
  }, [status, router])

  if (status === 'restoring') {
    return (
      <div className="flex items-center justify-center py-10" role="status">
        <Spinner size="md" />
      </div>
    )
  }

  return <LoginForm />
}
