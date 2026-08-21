'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Avatar } from '@/components/common/Avatar';
import { Spinner } from '@/components/common/Spinner';
import { useUserSearch } from '@/lib/hooks/useUsers';
import { useCreateGroup } from '@/lib/hooks/useConversations';
import { useUIStore } from '@/lib/store/uiStore';
import type { User } from '@/types/models';

export function NewGroupDialog() {
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { setNewGroupOpen, setActiveConversation } = useUIStore();
  const router = useRouter();

  const { data: searchResults, isFetching } = useUserSearch(searchQuery);
  const { mutateAsync: createGroup, isPending } = useCreateGroup();

  const toggleUser = (u: User) => {
    setSelectedUsers((prev) =>
      prev.find((x) => x._id === u._id)
        ? prev.filter((x) => x._id !== u._id)
        : [...prev, u]
    );
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;
    const group = await createGroup({
      name: groupName.trim(),
      participantIds: selectedUsers.map((u) => u._id),
    });
    setActiveConversation(group._id);
    setNewGroupOpen(false);
    router.push(`/chat/${group._id}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Create a new group"
      onClick={(e) => {
        if (e.target === e.currentTarget) setNewGroupOpen(false);
      }}
    >
      <div className="w-full max-w-md bg-[var(--color-surface-1)] rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[var(--color-border)]">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
            New group
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => setNewGroupOpen(false)}
            aria-label="Close"
          >
            ✕
          </Button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          {/* Group name */}
          <Input
            id="group-name-input"
            label="Group name"
            placeholder="e.g. Project Team"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            autoFocus
          />

          {/* Search participants */}
          <Input
            id="group-search-input"
            label="Add participants"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={
              isFetching ? (
                <Spinner size="sm" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )
            }
          />

          {/* Selected users chips */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((u) => (
                <span
                  key={u._id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-primary-soft)] text-[var(--color-primary)] text-xs font-medium rounded-full border border-[var(--color-primary)]/20"
                >
                  {u.name}
                  <button
                    onClick={() => toggleUser(u)}
                    className="hover:text-red-400 transition-colors"
                    aria-label={`Remove ${u.name}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search results */}
          {searchResults && searchResults.length > 0 && (
            <div className="max-h-44 overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)]">
              {searchResults.map((u) => {
                const isSelected = selectedUsers.some((x) => x._id === u._id);
                return (
                  <button
                    key={u._id}
                    onClick={() => toggleUser(u)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--color-surface-3)] transition-colors text-left ${isSelected ? 'opacity-50' : ''}`}
                  >
                    <Avatar name={u.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                        {u.name}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">{u.phone}</p>
                    </div>
                    {isSelected && (
                      <span className="text-[var(--color-primary)] text-xs font-medium">
                        ✓ Added
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setNewGroupOpen(false)}>
            Cancel
          </Button>
          <Button
            id="create-group-btn"
            onClick={handleCreate}
            isLoading={isPending}
            disabled={!groupName.trim() || selectedUsers.length === 0 || isPending}
          >
            Create group
          </Button>
        </div>
      </div>
    </div>
  );
}
