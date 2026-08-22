'use client'

import Link from 'next/link'
import { ArrowLeft, Settings2 } from 'lucide-react'
import { Avatar } from '@/components/common/Avatar'
import { Button } from '@/components/common/Button'
import { useConversationName } from '@/lib/hooks/useConversationName'
import { getParticipantCount } from '@/lib/utils/conversation'
import type { Conversation } from '@/types/models'

interface ChatHeaderProps {
  conversation: Conversation
  onManageGroup?: () => void
}

export function ChatHeader({ conversation, onManageGroup }: ChatHeaderProps) {
  const isGroup = conversation.type === 'group'
  const displayName = useConversationName(conversation)
  const memberCount = getParticipantCount(conversation)
  const subtitle = isGroup ? `${memberCount} ${memberCount === 1 ? 'member' : 'members'}` : 'Direct message'

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-[var(--border-subtle)] bg-[var(--surface-1)] px-4">
      <Link
        href="/chat"
        aria-label="Back to conversations"
        className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] md:hidden">
        <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
      </Link>

      <Avatar name={displayName} size="md" isGroup={isGroup} />
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base leading-[1.35] font-semibold text-[var(--text-primary)]">{displayName}</h1>
        <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>
      </div>

      {isGroup && (
        <Button variant="secondary" size="sm" className="shrink-0" aria-label="Manage group" onClick={onManageGroup}>
          <Settings2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          Manage group
        </Button>
      )}
    </header>
  )
}
