'use client'

import { ChatHeader } from './ChatHeader'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { ConnectionBanner } from '@/components/layout/ConnectionBanner'
import type { Conversation } from '@/types/models'

interface ChatPanelProps {
  conversation: Conversation
}

export function ChatPanel({ conversation }: ChatPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <ConnectionBanner />
      <ChatHeader conversation={conversation} />
      <div className="flex-1 overflow-hidden">
        <MessageList conversation={conversation} />
      </div>
      <MessageInput conversation={conversation} />
    </div>
  )
}
