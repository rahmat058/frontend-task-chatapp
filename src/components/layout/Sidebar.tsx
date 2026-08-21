'use client'

import { LogOut, Plus, UsersRound } from 'lucide-react'
import { Avatar } from '@/components/common/Avatar'
import { Button } from '@/components/common/Button'
import { ConversationList } from '@/components/conversations/ConversationList'
import { useAuth } from '@/lib/hooks/useAuth'
import { useUIStore } from '@/lib/store/uiStore'

export function Sidebar() {
  const { user, logout } = useAuth()
  const setNewChatOpen = useUIStore((s) => s.setNewChatOpen)
  const setNewGroupOpen = useUIStore((s) => s.setNewGroupOpen)

  return (
    <aside className="flex h-full flex-col border-r border-[var(--border-subtle)] bg-[var(--surface-1)]">
      <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-[var(--border-subtle)] px-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {user && <Avatar name={user.name} size="sm" online />}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{user?.name ?? 'ChatApp'}</p>
            <p className="truncate text-xs text-[var(--text-muted)]">{user?.phone ?? 'Inbox'}</p>
          </div>
        </div>

        <div className="flex items-center">
          <Button
            id="new-group-btn"
            variant="ghost"
            size="icon"
            onClick={() => setNewGroupOpen(true)}
            title="New group"
            aria-label="Create a new group">
            <UsersRound className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
          </Button>
          <Button
            id="new-chat-btn"
            variant="ghost"
            size="icon"
            onClick={() => setNewChatOpen(true)}
            title="New chat"
            aria-label="Start a new chat">
            <Plus className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
          </Button>
          <Button
            id="logout-btn"
            variant="ghost"
            size="icon"
            onClick={logout}
            title="Sign out"
            aria-label="Sign out"
            className="md:hidden">
            <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <ConversationList />
      </div>
    </aside>
  )
}
