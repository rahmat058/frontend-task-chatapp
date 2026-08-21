'use client'

import { useRouter } from 'next/navigation'
import { Users } from 'lucide-react'
import { Avatar } from '@/components/common/Avatar'
import { useUIStore } from '@/lib/store/uiStore'
import { formatConversationTime } from '@/lib/utils/formatDate'
import { getLastActivity } from '@/lib/utils/conversation'
import { useConversationName } from '@/lib/hooks/useConversationName'
import { cn } from '@/lib/utils/cn'
import type { Conversation } from '@/types/models'

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
}

export function ConversationItem({ conversation, isActive }: ConversationItemProps) {
  const router = useRouter()
  const unread = useUIStore((s) => s.unreadById[conversation._id] ?? 0)
  const setActiveConversation = useUIStore((s) => s.setActiveConversation)

  const isGroup = conversation.type === 'group'
  const displayName = useConversationName(conversation)
  const lastMessage = conversation.lastMessage
  const timestamp = formatConversationTime(getLastActivity(conversation))

  const handleClick = () => {
    setActiveConversation(conversation._id)
    router.push(`/chat/${conversation._id}`)
  }

  return (
    <button
      id={`conversation-${conversation._id}`}
      onClick={handleClick}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        // Flush edges: these rows tile a list rather than read as buttons.
        'flex w-full items-center gap-3 rounded-none px-4 py-3 text-left transition-colors duration-150',
        isActive
          ? 'border-r-2 border-[var(--color-primary)] bg-[var(--color-primary-soft)]'
          : 'hover:bg-[var(--color-surface-2)]',
      )}>
      <Avatar name={displayName} size="md" isGroup={isGroup} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1.5">
            {isGroup && (
              <Users className="h-3 w-3 shrink-0 text-[var(--color-text-muted)]" aria-label="Group conversation" />
            )}
            <span className="truncate text-sm font-medium text-[var(--color-text-primary)]">{displayName}</span>
          </span>
          <span className="flex shrink-0 items-center gap-2">
            {timestamp && <span className="text-xs text-[var(--color-text-muted)]">{timestamp}</span>}
            {unread > 0 && !isActive && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-semibold text-white">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-[var(--color-text-secondary)]">
          {lastMessage?.text || 'No messages yet'}
        </p>
      </div>
    </button>
  )
}
