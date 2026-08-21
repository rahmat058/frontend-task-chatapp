'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Check, Search, X } from 'lucide-react'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { Avatar } from '@/components/common/Avatar'
import { Dialog } from '@/components/common/Dialog'
import { Spinner } from '@/components/common/Spinner'
import { useUserSearch } from '@/lib/hooks/useUsers'
import { useCreateGroup } from '@/lib/hooks/useConversations'
import { useUIStore } from '@/lib/store/uiStore'
import { getApiErrorMessage } from '@/lib/api/normalize'
import { cn } from '@/lib/utils/cn'
import type { User } from '@/types/models'

interface NewGroupValues {
  name: string
}

export function NewGroupDialog() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)

  const setNewGroupOpen = useUIStore((s) => s.setNewGroupOpen)
  const setActiveConversation = useUIStore((s) => s.setActiveConversation)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = useForm<NewGroupValues>({
    defaultValues: { name: '' },
    mode: 'onBlur',
  })

  const groupName = watch('name')
  const { data: searchResults, isFetching } = useUserSearch(searchQuery)
  const { mutateAsync: createGroup, isPending } = useCreateGroup()

  const close = () => setNewGroupOpen(false)

  const toggleUser = (u: User) => {
    setSelectedUsers((prev) =>
      prev.some((x) => x._id === u._id) ? prev.filter((x) => x._id !== u._id) : [...prev, u],
    )
    clearErrors('root')
  }

  const canCreate = groupName.trim().length > 0 && selectedUsers.length > 0

  const onCreate = async ({ name }: NewGroupValues) => {
    if (selectedUsers.length === 0) {
      setError('root', { message: 'Select at least one member' })
      return
    }
    setSubmitError(null)
    try {
      const group = await createGroup({
        name: name.trim(),
        participantIds: selectedUsers.map((u) => u._id),
      })
      setActiveConversation(group._id)
      close()
      router.push(`/chat/${group._id}`)
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, 'Could not create the group.'))
    }
  }

  return (
    <Dialog
      title="New group"
      onClose={close}
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button
            id="create-group-btn"
            type="submit"
            form="new-group-form"
            isLoading={isPending}
            disabled={!canCreate || isPending}
          >
            Create group
          </Button>
        </>
      }
    >
      <form id="new-group-form" onSubmit={handleSubmit(onCreate)} className="p-4 flex flex-col gap-4" noValidate>
        <Input
          id="group-name-input"
          label="Group name"
          placeholder="e.g. Project Team"
          autoFocus
          error={errors.name?.message}
          {...register('name', {
            required: 'Group name is required',
            validate: (value) => value.trim().length > 0 || 'Group name is required',
          })}
        />

        <Input
          id="group-search-input"
          label="Add participants"
          placeholder="Search by name or phone…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={isFetching ? <Spinner size="sm" /> : <Search className="w-4 h-4" />}
        />

        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((u) => (
              <span
                key={u._id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-primary-soft)] text-[var(--color-primary)] text-xs font-medium rounded-full border border-[var(--color-primary)]/20"
              >
                {u.name}
                <button
                  type="button"
                  onClick={() => toggleUser(u)}
                  className="hover:text-red-400 transition-colors"
                  aria-label={`Remove ${u.name}`}
                >
                  <X className="w-3 h-3" aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        )}

        {searchResults && searchResults.length > 0 && (
          <div className="max-h-44 overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)]">
            {searchResults.map((u) => {
              const isSelected = selectedUsers.some((x) => x._id === u._id)
              return (
                <button
                  key={u._id}
                  type="button"
                  onClick={() => toggleUser(u)}
                  aria-pressed={isSelected}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-left rounded-none transition-colors',
                    'hover:bg-[var(--color-surface-3)]',
                    isSelected && 'opacity-60',
                  )}
                >
                  <Avatar name={u.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{u.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)] truncate">{u.phone}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0" aria-hidden="true" />}
                </button>
              )
            })}
          </div>
        )}

        {(errors.root?.message || submitError) && (
          <p className="text-xs text-red-400" role="alert">
            {errors.root?.message || submitError}
          </p>
        )}
      </form>
    </Dialog>
  )
}
