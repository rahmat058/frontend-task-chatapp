'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Search } from 'lucide-react';
import { Dialog } from '@/components/common/Dialog';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Avatar } from '@/components/common/Avatar';
import { Spinner } from '@/components/common/Spinner';
import { useAuthStore } from '@/lib/store/authStore';
import { useUserDirectory } from '@/lib/store/userDirectory';
import { useUserSearch } from '@/lib/hooks/useUsers';
import {
  useAddParticipants,
  usePromoteAdmin,
  useRemoveParticipant,
  useRenameGroup,
} from '@/lib/hooks/useConversations';
import { getApiErrorMessage } from '@/lib/api/normalize';
import { isAdmin, resolveMembers } from '@/lib/utils/conversation';
import type { Conversation } from '@/types/models';

interface GroupSettingsDialogProps {
  conversation: Conversation;
  onClose: () => void;
}

export function GroupSettingsDialog({
  conversation,
  onClose,
}: GroupSettingsDialogProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const knownUsers = useUserDirectory((s) => s.byId);

  const members = resolveMembers(conversation, knownUsers);
  const admin = isAdmin(conversation, user?._id);

  const [name, setName] = useState(conversation.name ?? '');
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data: searchResults, isFetching } = useUserSearch(query);
  const rename = useRenameGroup(conversation._id);
  const addMembers = useAddParticipants(conversation._id);
  const removeMember = useRemoveParticipant(conversation._id);
  const promote = usePromoteAdmin(conversation._id);

  const memberIds = new Set(members.map((m) => m._id));
  const candidates = (searchResults ?? []).filter((u) => !memberIds.has(u._id));

  const run = async (action: () => Promise<unknown>, fallback: string) => {
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(getApiErrorMessage(err, fallback));
    }
  };

  const handleRename = () => {
    const next = name.trim();
    if (!next || next === conversation.name) return;
    void run(() => rename.mutateAsync(next), 'Could not rename the group.');
  };

  const handleLeave = async () => {
    if (!user?._id) return;
    setError(null);
    try {
      await removeMember.mutateAsync(user._id);
      onClose();
      router.push('/chat');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not leave the group.'));
    }
  };

  return (
    <Dialog title="Group settings" onClose={onClose}>
      <div className="p-4 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
        {admin && (
          <div className="flex gap-2">
            <Input
              id="rename-group-input"
              label="Group name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        {admin && (
          <Button
            size="sm"
            variant="secondary"
            onClick={handleRename}
            isLoading={rename.isPending}
            disabled={!name.trim() || name.trim() === conversation.name}
          >
            Save name
          </Button>
        )}

        {admin && (
          <Input
            id="add-member-search"
            label="Add members"
            placeholder="Search by name or phone…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={
              isFetching ? <Spinner size="sm" /> : <Search className="w-4 h-4" />
            }
          />
        )}

        {admin && candidates.length > 0 && (
          <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
            {candidates.map((candidate) => (
              <div
                key={candidate._id}
                className="flex items-center gap-3 px-3 py-2 border-b border-[var(--color-border)] last:border-b-0"
              >
                <Avatar name={candidate.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm truncate">{candidate.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)] truncate">
                    {candidate.phone}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    run(
                      () => addMembers.mutateAsync([candidate._id]),
                      'Could not add that member.'
                    )
                  }
                  isLoading={addMembers.isPending}
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
        )}

        <div>
          <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2">
            Members · {members.length}
          </p>
          <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
            {members.map((member) => {
              const memberIsAdmin = isAdmin(conversation, member._id);
              const isSelf = member._id === user?._id;
              return (
                <div
                  key={member._id}
                  className="flex items-center gap-3 px-3 py-2 border-b border-[var(--color-border)] last:border-b-0"
                >
                  <Avatar name={member.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate">
                      {member.name}
                      {isSelf ? ' (you)' : ''}
                    </p>
                    {memberIsAdmin && (
                      <p className="text-[10px] text-[var(--color-primary)] flex items-center gap-1">
                        <Crown className="w-3 h-3" aria-hidden="true" />
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
                            () => promote.mutateAsync(member._id),
                            'Could not promote that member.'
                          )
                        }
                        isLoading={promote.isPending}
                      >
                        Promote
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={!admin}
                        title={
                          admin
                            ? 'Remove from group'
                            : 'Only group admins can remove members'
                        }
                        onClick={() =>
                          run(
                            () => removeMember.mutateAsync(member._id),
                            'Could not remove that member.'
                          )
                        }
                        isLoading={removeMember.isPending}
                      >
                        Remove
                      </Button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400" role="alert">
            {error}
          </p>
        )}

        <Button variant="danger" onClick={handleLeave} isLoading={removeMember.isPending}>
          Leave group
        </Button>
      </div>
    </Dialog>
  );
}
