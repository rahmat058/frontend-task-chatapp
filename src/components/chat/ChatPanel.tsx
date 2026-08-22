'use client'

import { useState } from 'react'
import { ChatHeader } from './ChatHeader'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { GroupSettingsDialog } from './GroupSettingsDialog'
import { ConnectionBanner } from '@/components/layout/ConnectionBanner'
import type { Conversation } from '@/types/models'

interface ChatPanelProps {
  conversation: Conversation
}

export function ChatPanel({ conversation }: ChatPanelProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="flex h-full flex-col">
      <ConnectionBanner />
      <ChatHeader conversation={conversation} onManageGroup={() => setSettingsOpen(true)} />
      <div className="flex-1 overflow-hidden">
        <MessageList conversation={conversation} onManageGroup={() => setSettingsOpen(true)} />
      </div>
      <MessageInput conversation={conversation} />
      {settingsOpen && conversation.type === 'group' && (
        <GroupSettingsDialog conversation={conversation} onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  )
}
