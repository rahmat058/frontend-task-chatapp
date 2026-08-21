'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Crown, Search } from 'lucide-react'
import { Dialog } from '@/components/common/Dialog'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { Avatar } from '@/components/common/Avatar'
import { Spinner } from '@/components/common/Spinner'
import { useAuthStore } from '@/lib/store/authStore'
import { useUserDirectory } from '@/lib/store/userDirectory'
import { useUserSearch } from '@/lib/hooks/useUsers'
import { useAddParticipants, usePromoteAdmin, useRemoveParticipant, useRenameGroup } from '@/lib/hooks/useConversations'
import { getApiErrorMessage } from '@/lib/api/normalize'
import { isAdmin, resolveMembers } from '@/lib/utils/conversation'
import { idsMatch } from '@/lib/utils/ids'
import type { Conversation } from '@/types/models'

interface GroupSettingsDialogProps {
  conversation: Conversation
  onClose: () => void
}

export function GroupSettingsDialog({ conversation, onClose }: GroupSettingsDialogProps) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const knownUsers = useUserDirectory((s) => s.byId)

  const members = resolveMembers(conversation, knownUsers, user)
  const admin = isAdmin(conversation, user?._id)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors: renameErrors },
  } = useForm<{ name: string }>({
    defaultValues: { name: conversation.name ?? '' },
  })
  const name = watch('name')
  const [query, setQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState<{
    kind: 'add' | 'promote' | 'remove' | 'leave'
    id: string
  } | null>(null)

  const { data: searchResults, isFetching } = useUserSearch(query)
  const rename = useRenameGroup(conversation._id)
  const addMembers = useAddParticipants(conversation._id)
  const removeMember = useRemoveParticipant(conversation._id)
  const promote = usePromoteAdmin(conversation._id)

  const memberIds = new Set(members.map((m) => m._id))
  const candidates = (searchResults ?? []).filter((u) => !memberIds.has(u._id))

  const isBusy = (kind: 'add' | 'promote' | 'remove' | 'leave', id: string) =>
    pending?.kind === kind && pending.id === id

  const run = async (
    kind: 'add' | 'promote' | 'remove' | 'leave',
    id: string,
    action: () => Promise<unknown>,
    fallback: string,
  ) => {
    setError(null)
    setPending({ kind, id })
    try {
      await action()
    } catch (err) {
      setError(getApiErrorMessage(err, fallback))
    } finally {
      setPending(null)
    }
  }

  const onRename = handleSubmit(async ({ name: nextName }) => {
    const next = nextName.trim()
    if (!next || next === conversation.name) return
    setError(null)
    try {
      await rename.mutateAsync(next)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not rename the group.'))
    }
  })

  const handleLeave = async () => {
    if (!user?._id) return
    setError(null)
    setPending({ kind: 'leave', id: user._id })
    try {
      await removeMember.mutateAsync(user._id)
      onClose()
      router.push('/chat')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not leave the group.'))
      setPending(null)
    }
  }

  return (
    <Dialog title="Group settings" onClose={onClose} className="flex max-h-[85vh] flex-col">
      <div className="flex min-h-0 flex-col gap-4 overflow-y-auto p-4">
        {admin && (
          <form onSubmit={onRename} className="flex flex-col gap-2" noValidate>
            <Input
              id="rename-group-input"
              label="Group name"
              error={renameErrors.name?.message}
              {...register('name', {
                required: 'Group name is required',
                validate: (value) => value.trim().length > 0 || 'Group name is required',
              })}
            />
            <Button
              type="submit"
              size="sm"
              variant="secondary"
              isLoading={rename.isPending}
              disabled={!name.trim() || name.trim() === conversation.name}>
              Save name
            </Button>
          </form>
        )}

        {admin && (
          <Input
            id="add-member-search"
            label="Add members"
            placeholder="Search by name or phone…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={isFetching ? <Spinner size="sm" /> : <Search className="h-4 w-4" />}
          />
        )}

        {admin && candidates.length > 0 && (
          <div className="max-h-40 shrink-0 overflow-y-auto rounded-xl border border-[var(--color-border)]">
            {candidates.map((candidate) => (
              <div
                key={candidate._id}
                className="flex items-center gap-3 border-b border-[var(--color-border)] px-3 py-2 last:border-b-0">
                <Avatar name={candidate.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{candidate.name}</p>
                  <p className="truncate text-xs text-[var(--color-text-muted)]">{candidate.phone}</p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    run(
                      'add',
                      candidate._id,
                      () => addMembers.mutateAsync([candidate._id]),
                      'Could not add that member.',
                    )
                  }
                  isLoading={isBusy('add', candidate._id)}>
                  Add
                </Button>
              </div>
            ))}
          </div>
        )}

        <div>
          <p className="mb-2 text-xs font-medium text-[var(--color-text-muted)]">Members · {members.length}</p>
          <div className="max-h-52 overflow-y-auto rounded-xl border border-[var(--color-border)]">
            {members.map((member) => {
              const memberIsAdmin = isAdmin(conversation, member._id)
              const isSelf = idsMatch(member._id, user?._id)
              return (
                <div
                  key={member._id}
                  className="flex items-center gap-3 border-b border-[var(--color-border)] px-3 py-2 last:border-b-0">
                  <Avatar name={member.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">
                      {isSelf ? (user?.name ?? member.name) : member.name}
                      {isSelf ? ' (you)' : ''}
                    </p>
                    {memberIsAdmin && (
                      <p className="flex items-center gap-1 text-[10px] text-[var(--color-primary)]">
                        <Crown className="h-3 w-3" aria-hidden="true" />
                        Admin
                      </p>
                    )}
                  </div>
                  {isSelf ? null : (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={!admin || memberIsAdmin}
                        title={
                          !admin
                            ? 'Only group admins can promote members'
                            : memberIsAdmin
                              ? 'Already an admin'
                              : 'Promote to admin (POST /conversations/:id/admins)'
                        }
                        onClick={() =>
                          run(
                            'promote',
                            member._id,
                            () => promote.mutateAsync(member._id),
                            'Could not promote that member.',
                          )
                        }
                        isLoading={isBusy('promote', member._id)}>
                        Promote
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={!admin}
                        title={admin ? 'Remove from group' : 'Only group admins can remove members'}
                        onClick={() =>
                          run(
                            'remove',
                            member._id,
                            () => removeMember.mutateAsync(member._id),
                            'Could not remove that member.',
                          )
                        }
                        isLoading={isBusy('remove', member._id)}>
                        Remove
                      </Button>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400" role="alert">
            {error}
          </p>
        )}

        <Button variant="danger" onClick={handleLeave} isLoading={isBusy('leave', user?._id ?? '')}>
          Leave group
        </Button>
      </div>
    </Dialog>
  )
}
