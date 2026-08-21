'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Settings2 } from 'lucide-react'
import { Avatar } from '@/components/common/Avatar'
import { Button } from '@/components/common/Button'
import { GroupSettingsDialog } from './GroupSettingsDialog'
import { useConversationName } from '@/lib/hooks/useConversationName'
import { getParticipantCount } from '@/lib/utils/conversation'
import type { Conversation } from '@/types/models'

interface ChatHeaderProps {
  conversation: Conversation
}

export function ChatHeader({ conversation }: ChatHeaderProps) {
  const isGroup = conversation.type === 'group'
  const [settingsOpen, setSettingsOpen] = useState(false)

  const displayName = useConversationName(conversation)
  const memberCount = getParticipantCount(conversation)
  const subtitle = isGroup ? `${memberCount} ${memberCount === 1 ? 'member' : 'members'}` : 'Direct message'

  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface-1)] px-5 py-3.5">
      {/* The sidebar is hidden on small screens, so this is the only way back. */}
      <Link
        href="/chat"
        aria-label="Back to conversations"
        className="-ml-1 rounded-lg p-1.5 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)] sm:hidden">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      </Link>

      <Avatar name={displayName} size="md" isGroup={isGroup} />
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold text-[var(--color-text-primary)]">{displayName}</h1>
        <p className="text-xs text-[var(--color-text-muted)]">{subtitle}</p>
      </div>

      {isGroup && (
        <Button
          variant="secondary"
          size="sm"
          className="shrink-0"
          aria-label="Manage group"
          onClick={() => setSettingsOpen(true)}>
          <Settings2 className="h-3.5 w-3.5" aria-hidden="true" />
          Manage group
        </Button>
      )}

      {settingsOpen && <GroupSettingsDialog conversation={conversation} onClose={() => setSettingsOpen(false)} />}
    </header>
  )
}
