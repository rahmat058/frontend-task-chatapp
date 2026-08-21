'use client';

import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { ConversationList } from '@/components/conversations/ConversationList';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUIStore } from '@/lib/store/uiStore';

export function Sidebar() {
  const { user, logout } = useAuth();
  const { setNewChatOpen, setNewGroupOpen } = useUIStore();

  return (
    <aside className="flex flex-col h-full bg-[var(--color-surface-1)] border-r border-[var(--color-border)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
          <span className="font-bold text-sm text-[var(--color-text-primary)]">ChatApp</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            id="new-group-btn"
            variant="ghost"
            size="sm"
            onClick={() => setNewGroupOpen(true)}
            title="New group"
            className="w-8 h-8 p-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </Button>
          <Button
            id="new-chat-btn"
            variant="ghost"
            size="sm"
            onClick={() => setNewChatOpen(true)}
            title="New chat"
            className="w-8 h-8 p-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        <ConversationList />
      </div>

      {/* Footer — current user */}
      {user && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-surface-1)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar name={user.name} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                {user.name}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] truncate">{user.phone}</p>
            </div>
          </div>
          <Button
            id="logout-btn"
            variant="ghost"
            size="sm"
            onClick={logout}
            title="Sign out"
            className="w-8 h-8 p-0 text-[var(--color-text-muted)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </Button>
        </div>
      )}
    </aside>
  );
}
