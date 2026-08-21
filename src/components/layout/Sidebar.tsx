'use client';

import { LogOut, MessageSquare, Plus, UsersRound } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { ConversationList } from '@/components/conversations/ConversationList';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUIStore } from '@/lib/store/uiStore';

export function Sidebar() {
  const { user, logout } = useAuth();
  const setNewChatOpen = useUIStore((s) => s.setNewChatOpen);
  const setNewGroupOpen = useUIStore((s) => s.setNewGroupOpen);

  return (
    <aside className="flex flex-col h-full bg-[var(--color-surface-1)] border-r border-[var(--color-border)]">
      <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <span className="font-bold text-sm text-[var(--color-text-primary)]">
            ChatApp
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            id="new-group-btn"
            variant="ghost"
            size="icon"
            onClick={() => setNewGroupOpen(true)}
            title="New group"
            aria-label="Create a new group"
          >
            <UsersRound className="w-4 h-4" aria-hidden="true" />
          </Button>
          <Button
            id="new-chat-btn"
            variant="ghost"
            size="icon"
            onClick={() => setNewChatOpen(true)}
            title="New chat"
            aria-label="Start a new chat"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ConversationList />
      </div>

      {user && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar name={user.name} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                {user.name}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] truncate">
                {user.phone}
              </p>
            </div>
          </div>
          <Button
            id="logout-btn"
            variant="ghost"
            size="icon"
            onClick={logout}
            title="Sign out"
            aria-label="Sign out"
            className="text-[var(--color-text-muted)]"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      )}
    </aside>
  );
}
