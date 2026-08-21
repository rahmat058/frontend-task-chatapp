'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/common/Input';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { Spinner } from '@/components/common/Spinner';
import { useUserSearch } from '@/lib/hooks/useUsers';
import { useStartConversation } from '@/lib/hooks/useConversations';
import { useUIStore } from '@/lib/store/uiStore';
import type { User } from '@/types/models';

export function ConversationSearch() {
  const [query, setQuery] = useState('');
  const { setNewChatOpen, setActiveConversation } = useUIStore();
  const router = useRouter();

  const { data: users, isFetching } = useUserSearch(query);
  const { mutateAsync: startConversation, isPending } = useStartConversation();

  const handleSelectUser = async (selectedUser: User) => {
    const conversation = await startConversation({ userId: selectedUser._id });
    setActiveConversation(conversation._id);
    setNewChatOpen(false);
    router.push(`/chat/${conversation._id}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Start a new conversation"
      onClick={(e) => {
        if (e.target === e.currentTarget) setNewChatOpen(false);
      }}
    >
      <div className="w-full max-w-md bg-[var(--color-surface-1)] rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[var(--color-border)]">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
            New conversation
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => setNewChatOpen(false)}
            aria-label="Close"
          >
            ✕
          </Button>
        </div>

        {/* Search input */}
        <div className="p-4">
          <Input
            id="user-search-input"
            placeholder="Search by name or phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
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
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto pb-2">
          {query.trim().length > 0 && users?.length === 0 && !isFetching && (
            <p className="text-sm text-[var(--color-text-secondary)] text-center py-6">
              No users found for &ldquo;{query}&rdquo;
            </p>
          )}

          {users?.map((u) => (
            <button
              key={u._id}
              id={`user-result-${u._id}`}
              onClick={() => handleSelectUser(u)}
              disabled={isPending}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[var(--color-surface-2)] transition-colors text-left disabled:opacity-50"
            >
              <Avatar name={u.name} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {u.name}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] truncate">
                  {u.phone}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
