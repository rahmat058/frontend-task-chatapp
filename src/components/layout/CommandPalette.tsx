'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquarePlus, Search, UsersRound } from 'lucide-react'
import { Dialog } from '@/components/common/Dialog'
import { Input } from '@/components/common/Input'
import { useConversations } from '@/lib/hooks/useConversations'
import { useAuthStore } from '@/lib/store/authStore'
import { useUIStore } from '@/lib/store/uiStore'
import { useUserDirectory } from '@/lib/store/userDirectory'
import { getConversationName } from '@/lib/utils/conversation'
import { commandPaletteShortcutLabel } from '@/lib/utils/modKey'
import { cn } from '@/lib/utils/cn'
import type { Conversation } from '@/types/models'

type PaletteItem = {
  id: string
  group: 'Actions' | 'Chats'
  label: string
  description?: string
  keywords: string
  run: () => void
}

const MAX_CHATS = 12

export function CommandPalette() {
  const open = useUIStore((s) => s.isCommandPaletteOpen)
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen)
  const setNewChatOpen = useUIStore((s) => s.setNewChatOpen)
  const setNewGroupOpen = useUIStore((s) => s.setNewGroupOpen)
  const setActiveConversation = useUIStore((s) => s.setActiveConversation)

  const { data: conversations } = useConversations()
  const userId = useAuthStore((s) => s.user?._id)
  const knownUsers = useUserDirectory((s) => s.byId)
  const peers = useUserDirectory((s) => s.byConversationId)
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const listId = useId()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey) || event.altKey) return
      event.preventDefault()

      const blockingDialog = document.querySelector('[role="dialog"], [role="alertdialog"]')
      if (blockingDialog && !open) return

      setOpen(!open)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, setOpen])

  useEffect(() => {
    if (!open) {
      setQuery('')
      setActiveIndex(0)
    }
  }, [open])

  const close = () => setOpen(false)

  const items = useMemo(() => {
    const term = query.trim().toLowerCase()
    const go = (run: () => void) => {
      setOpen(false)
      run()
    }

    const actions: PaletteItem[] = [
      {
        id: 'action-new-chat',
        group: 'Actions',
        label: 'New conversation',
        description: 'Search people and start a direct chat',
        keywords: 'new chat dm message person',
        run: () => go(() => setNewChatOpen(true)),
      },
      {
        id: 'action-new-group',
        group: 'Actions',
        label: 'New group',
        description: 'Create a group with at least two people',
        keywords: 'new group team members',
        run: () => go(() => setNewGroupOpen(true)),
      },
    ]

    const chats: PaletteItem[] = (conversations ?? []).map((conversation: Conversation) => {
      const name = getConversationName(conversation, userId, knownUsers, peers[conversation._id])
      const snippet = conversation.lastMessage?.text ?? ''
      return {
        id: `chat-${conversation._id}`,
        group: 'Chats' as const,
        label: name,
        description: conversation.type === 'group' ? 'Group' : snippet || 'Direct message',
        keywords: `${name} ${snippet}`.toLowerCase(),
        run: () =>
          go(() => {
            setActiveConversation(conversation._id)
            router.push(`/chat/${conversation._id}`)
          }),
      }
    })

    const matches = (item: PaletteItem) =>
      !term || item.label.toLowerCase().includes(term) || item.keywords.includes(term)

    const visibleActions = actions.filter(matches)
    const visibleChats = chats.filter(matches).slice(0, term ? MAX_CHATS : Math.min(MAX_CHATS, chats.length))
    return [...visibleActions, ...visibleChats]
  }, [
    conversations,
    knownUsers,
    peers,
    query,
    router,
    setActiveConversation,
    setNewChatOpen,
    setNewGroupOpen,
    setOpen,
    userId,
  ])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    if (activeIndex >= items.length) setActiveIndex(0)
  }, [activeIndex, items.length])

  const active = items[activeIndex]

  useEffect(() => {
    if (!open || !active) return
    const option = document.getElementById(`${listId}-${active.id}`)
    option?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [active, listId, open])

  const shortcut = commandPaletteShortcutLabel()

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (items.length === 0 ? 0 : (index + 1) % items.length))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => (items.length === 0 ? 0 : (index - 1 + items.length) % items.length))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      active?.run()
    }
  }

  let lastGroup: PaletteItem['group'] | null = null

  if (!open) return null

  return (
    <Dialog
      title="Jump to"
      description={`Search chats or run an action. ${shortcut} toggles this dialog.`}
      onClose={close}
      className="max-w-lg">
      <div className="flex flex-col gap-2 p-3 pb-2">
        <Input
          id="command-palette-input"
          placeholder="Search chats and actions…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onInputKeyDown}
          autoFocus
          leftIcon={<Search className="h-4 w-4" strokeWidth={1.75} />}
          aria-label="Command palette"
          aria-controls={listId}
          aria-expanded="true"
          aria-activedescendant={active ? `${listId}-${active.id}` : undefined}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
        />
      </div>

      <ul id={listId} role="listbox" aria-label="Commands and chats" className="max-h-80 overflow-y-auto pb-2">
        {items.length === 0 && (
          <li className="px-5 py-6 text-center text-sm text-[var(--text-muted)]">No matching chats or actions</li>
        )}
        {items.map((item, index) => {
          const showGroup = item.group !== lastGroup
          lastGroup = item.group
          const selected = index === activeIndex
          return (
            <li key={item.id}>
              {showGroup && (
                <p className="px-5 pt-2 pb-1 text-[11px] font-medium tracking-wide text-[var(--text-muted)] uppercase">
                  {item.group}
                </p>
              )}
              <button
                id={`${listId}-${item.id}`}
                type="button"
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={item.run}
                className={cn(
                  'flex min-h-11 w-full items-center gap-3 px-5 py-2 text-left',
                  selected ? 'bg-[var(--surface-active)]' : 'hover:bg-[var(--surface-hover)]',
                )}>
                {item.group === 'Actions' ? (
                  item.id === 'action-new-group' ? (
                    <UsersRound className="h-4 w-4 shrink-0 text-[var(--text-muted)]" strokeWidth={1.75} />
                  ) : (
                    <MessageSquarePlus className="h-4 w-4 shrink-0 text-[var(--text-muted)]" strokeWidth={1.75} />
                  )
                ) : (
                  <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)]" strokeWidth={1.75} />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-[var(--text-primary)]">{item.label}</span>
                  {item.description && (
                    <span className="block truncate text-xs text-[var(--text-muted)]">{item.description}</span>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <p className="border-t border-[var(--border-subtle)] px-5 py-2.5 text-[11px] text-[var(--text-muted)]">
        ↑↓ to move · Enter to open · Esc to close
      </p>
    </Dialog>
  )
}
