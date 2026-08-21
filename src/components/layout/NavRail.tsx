'use client'

import Link from 'next/link'
import { LogOut, MessageSquare } from 'lucide-react'
import { BrandMark } from '@/components/common/BrandMark'
import { Avatar } from '@/components/common/Avatar'
import { useAuth } from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils/cn'

export function NavRail() {
  const { user, logout } = useAuth()

  return (
    <nav
      aria-label="App"
      className="hidden h-full w-[72px] shrink-0 flex-col items-center border-r border-[var(--border-subtle)] bg-[var(--surface-1)] py-3 md:flex">
      <Link href="/" className="flex h-11 w-11 items-center justify-center" aria-label="ChatApp home">
        <BrandMark size="sm" />
      </Link>

      <div className="mt-6 flex flex-1 flex-col items-center gap-1">
        <Link
          href="/chat"
          aria-current="page"
          aria-label="Inbox"
          title="Inbox"
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)]',
            'bg-[var(--surface-active)] text-[var(--green-400)]',
            'focus-visible:shadow-[var(--focus-ring)]',
          )}>
          <MessageSquare className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        </Link>
      </div>

      {user && (
        <button
          type="button"
          onClick={logout}
          title="Sign out"
          aria-label={`Sign out ${user.name}`}
          className="flex flex-col items-center gap-2 rounded-[var(--radius-md)] p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-visible:shadow-[var(--focus-ring)]">
          <Avatar name={user.name} size="sm" />
          <LogOut className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </button>
      )}
    </nav>
  )
}
