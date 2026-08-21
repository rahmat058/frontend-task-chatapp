'use client'

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { MessagesSquare, Search } from 'lucide-react'
import { ConversationItem } from './ConversationItem'
import { ConversationSearch } from './ConversationSearch'
import { NewGroupDialog } from './NewGroupDialog'
import { Input } from '@/components/common/Input'
import { SkeletonLoader } from '@/components/common/SkeletonLoader'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { useConversations } from '@/lib/hooks/useConversations'
import { SEARCH_DEBOUNCE_MS, useDebounce } from '@/lib/hooks/useDebounce'
import { useAuthStore } from '@/lib/store/authStore'
import { useUserDirectory } from '@/lib/store/userDirectory'
import { useUIStore } from '@/lib/store/uiStore'
import { getConversationName } from '@/lib/utils/conversation'
import { cn } from '@/lib/utils/cn'
import type { Conversation } from '@/types/models'

type Filter = 'all' | 'unread' | 'groups'

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'groups', label: 'Groups' },
]

export function ConversationList() {
  const { data: conversations, isLoading, error, refetch } = useConversations()
  const isNewChatOpen = useUIStore((s) => s.isNewChatOpen)
  const isNewGroupOpen = useUIStore((s) => s.isNewGroupOpen)
  const unreadById = useUIStore((s) => s.unreadById)
  const userId = useAuthStore((s) => s.user?._id)
  const knownUsers = useUserDirectory((s) => s.byId)
  const peers = useUserDirectory((s) => s.byConversationId)
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS)
  const searchTerm = query.trim().length === 0 ? '' : debouncedQuery.trim().toLowerCase()

  const params = useParams()
  const activeId = params?.id as string | undefined

  const visible = useMemo(() => {
    return (conversations ?? []).filter((conversation) => {
      if (filter === 'groups' && conversation.type !== 'group') return false
      if (filter === 'unread' && !(unreadById[conversation._id] > 0)) return false
      if (!searchTerm) return true
      const name = getConversationName(conversation, userId, knownUsers, peers[conversation._id]).toLowerCase()
      const snippet = (conversation.lastMessage?.text ?? '').toLowerCase()
      return name.includes(searchTerm) || snippet.includes(searchTerm)
    })
  }, [conversations, filter, knownUsers, peers, searchTerm, unreadById, userId])

  return (
    <>
      <div className="px-3 pt-3 pb-2">
        <Input
          id="conversation-search"
          placeholder="Search chats"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftIcon={<Search className="h-4 w-4" strokeWidth={1.75} />}
          aria-label="Search chats"
        />
        <div className="mt-3 flex gap-1" role="tablist" aria-label="Filter conversations">
          {filters.map((item) => {
            const selected = filter === item.id
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setFilter(item.id)}
                className={cn(
                  'h-8 rounded-[var(--radius-md)] px-3 text-xs font-medium',
                  selected
                    ? 'bg-[var(--surface-3)] text-[var(--text-primary)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]',
                )}>
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      {isLoading && <SkeletonLoader variant="conversation" count={6} />}

      {error && <ErrorState description="Could not load conversations." onRetry={() => refetch()} />}

      {!isLoading && !error && conversations && conversations.length === 0 && (
        <EmptyState
          icon={<MessagesSquare className="h-6 w-6" strokeWidth={1.75} />}
          title="No conversations yet"
          description="Start a new chat or create a group to get going."
        />
      )}

      {!isLoading && !error && conversations && conversations.length > 0 && visible.length === 0 && (
        <EmptyState
          icon={<MessagesSquare className="h-6 w-6" strokeWidth={1.75} />}
          title="No matching chats"
          description="Try a different filter or search."
        />
      )}

      {!isLoading && !error && visible.length > 0 && (
        <div className="flex flex-col pb-2">
          {visible.map((conversation: Conversation) => (
            <ConversationItem
              key={conversation._id}
              conversation={conversation}
              isActive={conversation._id === activeId}
            />
          ))}
        </div>
      )}

      {isNewChatOpen && <ConversationSearch />}
      {isNewGroupOpen && <NewGroupDialog />}
    </>
  )
}
