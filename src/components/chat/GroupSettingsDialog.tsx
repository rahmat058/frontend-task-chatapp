'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Search } from 'lucide-react'
import { Dialog } from '@/components/common/Dialog'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { Avatar } from '@/components/common/Avatar'
import { Spinner } from '@/components/common/Spinner'
import { OverflowMenu } from '@/components/common/OverflowMenu'
import { useAuthStore } from '@/lib/store/authStore'
import { useUserDirectory } from '@/lib/store/userDirectory'
import { useToastStore } from '@/lib/store/toastStore'
import { useUserSearch } from '@/lib/hooks/useUsers'
import { SEARCH_DEBOUNCE_MS } from '@/lib/hooks/useDebounce'
import { useAddParticipants, usePromoteAdmin, useRemoveParticipant, useRenameGroup } from '@/lib/hooks/useConversations'
import { getApiErrorMessage } from '@/lib/api/normalize'
import { getAdminIds, isAdmin, resolveMembers } from '@/lib/utils/conversation'
import { idsMatch } from '@/lib/utils/ids'
import { cn } from '@/lib/utils/cn'
import type { ToastTone } from '@/lib/store/toastStore'
import type { Conversation } from '@/types/models'

interface GroupSettingsDialogProps {
  conversation: Conversation
  onClose: () => void
}

function roleLabel(conversation: Conversation, memberId: string): 'Admin' | 'Member' {
  const ids = getAdminIds(conversation)
  if (ids.length === 0) return 'Member'
  return ids.some((id) => idsMatch(id, memberId)) ? 'Admin' : 'Member'
}

export function GroupSettingsDialog({ conversation, onClose }: GroupSettingsDialogProps) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const knownUsers = useUserDirectory((s) => s.byId)
  const toast = useToastStore((s) => s.show)

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
  const [confirm, setConfirm] = useState<null | { kind: 'remove'; id: string; name: string } | { kind: 'leave' }>(null)
  const [pending, setPending] = useState<{
    kind: 'add' | 'promote' | 'remove' | 'leave'
    id: string
  } | null>(null)

  const { data: searchResults, isSearching } = useUserSearch(query)
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
    success?: { message: string; tone?: ToastTone },
  ) => {
    setError(null)
    setPending({ kind, id })
    try {
      await action()
      setConfirm(null)
      if (success) toast(success.message, success.tone ?? 'success')
    } catch (err) {
      const description = getApiErrorMessage(err, fallback)
      setError(description)
      toast(description, 'error')
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
      toast('Group name updated', 'info')
    } catch (err) {
      const description = getApiErrorMessage(err, 'Could not rename the group.')
      setError(description)
      toast(description, 'error')
    }
  })

  const handleLeave = async () => {
    if (!user?._id) return
    setError(null)
    setPending({ kind: 'leave', id: user._id })
    try {
      await removeMember.mutateAsync(user._id)
      toast('You left the group', 'warning')
      onClose()
      router.push('/chat')
    } catch (err) {
      const description = getApiErrorMessage(err, 'Could not leave the group.')
      setError(description)
      toast(description, 'error')
      setPending(null)
    }
  }

  return (
    <>
      <Dialog
        title="Group settings"
        description={`${members.length} ${members.length === 1 ? 'member' : 'members'}`}
        onClose={onClose}
        className="max-w-[560px]">
        <div className="flex flex-col gap-6 p-5">
          {admin && (
            <form onSubmit={onRename} className="flex flex-wrap items-end gap-3" noValidate>
              <Avatar name={conversation.name || 'Group'} size="lg" isGroup className="mb-0.5" />
              <div className="min-w-0 flex-1">
                <Input
                  id="rename-group-input"
                  label="Group name"
                  error={renameErrors.name?.message}
                  {...register('name', {
                    required: 'Group name is required',
                    validate: (value) => value.trim().length > 0 || 'Group name is required',
                  })}
                />
              </div>
              <Button
                type="submit"
                size="md"
                isLoading={rename.isPending}
                disabled={!name.trim() || name.trim() === conversation.name}
                className="mb-0.5 ml-auto shrink-0">
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
              debounceMs={SEARCH_DEBOUNCE_MS}
              onChange={(e) => setQuery(e.target.value)}
              leftIcon={isSearching ? <Spinner size="sm" /> : <Search className="h-4 w-4" strokeWidth={1.75} />}
            />
          )}

          {admin && candidates.length > 0 && (
            <div className="max-h-40 shrink-0 overflow-y-auto rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
              {candidates.map((candidate) => (
                <div
                  key={candidate._id}
                  className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-3 py-2 last:border-b-0">
                  <Avatar name={candidate.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{candidate.name}</p>
                    <p className="truncate text-xs text-[var(--text-muted)]">{candidate.phone}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      run(
                        'add',
                        candidate._id,
                        () => {
                          useUserDirectory.getState().remember([candidate])
                          return addMembers.mutateAsync([candidate._id])
                        },
                        'Could not add that member.',
                        { message: `${candidate.name} added to the group`, tone: 'success' },
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
            <p className="mb-2 text-xs font-medium text-[var(--text-muted)]">Members</p>
            <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
              {members.map((member) => {
                const role = roleLabel(conversation, member._id)
                const memberIsAdmin = role === 'Admin'
                const isSelf = idsMatch(member._id, user?._id)
                return (
                  <div key={member._id} className="border-b border-[var(--border-subtle)] last:border-b-0">
                    <div className="flex items-center gap-3 px-3 py-2.5">
                      <Avatar name={isSelf ? (user?.name ?? member.name) : member.name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">
                          {isSelf ? (user?.name ?? member.name) : member.name}
                          {isSelf ? ' (you)' : ''}
                        </p>
                        <span
                          className={cn(
                            'mt-0.5 inline-flex rounded-[var(--radius-xs)] border px-1.5 py-0.5 text-[11px] font-medium',
                            memberIsAdmin
                              ? 'border-[var(--green-border)] text-[var(--green-400)]'
                              : 'border-[var(--border-default)] text-[var(--text-muted)]',
                          )}>
                          {role}
                        </span>
                      </div>
                      {!isSelf && admin && (
                        <OverflowMenu
                          label={`Actions for ${member.name}`}
                          disabled={isBusy('promote', member._id) || isBusy('remove', member._id)}
                          items={[
                            {
                              id: 'promote',
                              label: memberIsAdmin ? 'Already an admin' : 'Promote to admin',
                              disabled: memberIsAdmin || isBusy('promote', member._id),
                              onSelect: () =>
                                void run(
                                  'promote',
                                  member._id,
                                  () => promote.mutateAsync(member._id),
                                  'Could not promote that member.',
                                  { message: `${member.name} is now an admin`, tone: 'success' },
                                ),
                            },
                            {
                              id: 'remove',
                              label: 'Remove member',
                              danger: true,
                              disabled: isBusy('remove', member._id),
                              onSelect: () => setConfirm({ kind: 'remove', id: member._id, name: member.name }),
                            },
                          ]}
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {error && (
            <p className="text-xs text-[var(--danger)]" role="alert">
              {error}
            </p>
          )}

          <Button variant="danger" className="w-full" onClick={() => setConfirm({ kind: 'leave' })}>
            Leave group
          </Button>
        </div>
      </Dialog>

      {confirm?.kind === 'remove' && (
        <Dialog
          role="alertdialog"
          title="Remove member"
          description={`Remove ${confirm.name} from this group?`}
          onClose={() => setConfirm(null)}
          overlayClassName="z-[60]"
          captureEscape
          className="max-w-[400px]"
          footer={
            <>
              <Button variant="secondary" onClick={() => setConfirm(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                isLoading={isBusy('remove', confirm.id)}
                onClick={() =>
                  void run(
                    'remove',
                    confirm.id,
                    () => removeMember.mutateAsync(confirm.id),
                    'Could not remove that member.',
                    { message: `${confirm.name} was removed from the group`, tone: 'warning' },
                  )
                }>
                Remove
              </Button>
            </>
          }>
          <p className="px-5 py-4 text-sm leading-relaxed text-[var(--text-secondary)]">
            {confirm.name} will lose access to this conversation until an admin adds them again.
          </p>
        </Dialog>
      )}

      {confirm?.kind === 'leave' && (
        <Dialog
          role="alertdialog"
          title="Leave group"
          description="Leave this group?"
          onClose={() => setConfirm(null)}
          overlayClassName="z-[60]"
          captureEscape
          className="max-w-[400px]"
          footer={
            <>
              <Button variant="secondary" onClick={() => setConfirm(null)}>
                Cancel
              </Button>
              <Button variant="danger" isLoading={isBusy('leave', user?._id ?? '')} onClick={handleLeave}>
                Leave group
              </Button>
            </>
          }>
          <p className="px-5 py-4 text-sm leading-relaxed text-[var(--text-secondary)]">
            You will lose access until someone adds you again.
          </p>
        </Dialog>
      )}
    </>
  )
}
