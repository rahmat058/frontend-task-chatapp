'use client'

import { useRouter } from 'next/navigation'
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
        'relative flex min-h-16 w-full items-center gap-3 rounded-none px-3 py-2.5 text-left transition-colors duration-[var(--duration-fast)]',
        isActive ? 'bg-[var(--surface-3)]' : 'hover:bg-[var(--surface-hover)]',
      )}>
      {isActive && (
        <span className="absolute top-2 bottom-2 left-0 w-0.5 rounded-r bg-[var(--green-500)]" aria-hidden="true" />
      )}
      <Avatar name={displayName} size="md" isGroup={isGroup} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-[var(--text-primary)]">{displayName}</span>
          {timestamp && <span className="shrink-0 text-xs text-[var(--text-muted)] tabular-nums">{timestamp}</span>}
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p className="truncate text-xs text-[var(--text-secondary)]">{lastMessage?.text || 'No messages yet'}</p>
          {unread > 0 && !isActive && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--green-600)] px-1.5 text-[11px] font-medium text-[var(--text-inverse)] tabular-nums">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
