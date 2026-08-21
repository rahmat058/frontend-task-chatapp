'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, UserX } from 'lucide-react'
import { Input } from '@/components/common/Input'
import { Avatar } from '@/components/common/Avatar'
import { Dialog } from '@/components/common/Dialog'
import { Spinner } from '@/components/common/Spinner'
import { ErrorState } from '@/components/common/ErrorState'
import { useUserSearch } from '@/lib/hooks/useUsers'
import { useStartConversation } from '@/lib/hooks/useConversations'
import { useUIStore } from '@/lib/store/uiStore'
import { getApiErrorMessage } from '@/lib/api/normalize'
import type { User } from '@/types/models'

export function ConversationSearch() {
  const [query, setQuery] = useState('')
  const [error, setError] = useState<string | null>(null)

  const setNewChatOpen = useUIStore((s) => s.setNewChatOpen)
  const setActiveConversation = useUIStore((s) => s.setActiveConversation)
  const router = useRouter()

  const { data: users, isFetching } = useUserSearch(query)
  const { mutateAsync: startConversation, isPending } = useStartConversation()

  const close = () => setNewChatOpen(false)

  const handleSelectUser = async (selected: User) => {
    setError(null)
    try {
      const conversation = await startConversation({
        userId: selected._id,
        peer: selected,
      })
      setActiveConversation(conversation._id)
      close()
      router.push(`/chat/${conversation._id}`)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not start that conversation.'))
    }
  }

  const hasSearched = query.trim().length > 0
  const noResults = hasSearched && !isFetching && users?.length === 0

  return (
    <Dialog title="New conversation" onClose={close}>
      <div className="p-4">
        <Input
          id="user-search-input"
          placeholder="Search by name or phone…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          leftIcon={isFetching ? <Spinner size="sm" /> : <Search className="h-4 w-4" />}
        />
      </div>

      <div className="max-h-72 overflow-y-auto pb-2">
        {error && <ErrorState title="Couldn't start chat" description={error} />}

        {noResults && (
          <p className="flex flex-col items-center gap-2 py-6 text-center text-sm text-[var(--color-text-secondary)]">
            <UserX className="h-5 w-5 text-[var(--color-text-muted)]" />
            No users found for &ldquo;{query}&rdquo;
          </p>
        )}

        {users?.map((u) => (
          <button
            key={u._id}
            id={`user-result-${u._id}`}
            onClick={() => handleSelectUser(u)}
            disabled={isPending}
            className="flex w-full items-center gap-3 rounded-none px-5 py-3 text-left transition-colors hover:bg-[var(--color-surface-2)] disabled:opacity-50">
            <Avatar name={u.name} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">{u.name}</p>
              <p className="truncate text-xs text-[var(--color-text-muted)]">{u.phone}</p>
            </div>
          </button>
        ))}
      </div>
    </Dialog>
  )
}
