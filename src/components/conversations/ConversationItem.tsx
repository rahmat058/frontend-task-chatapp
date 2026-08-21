'use client';

import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { useAuthStore } from '@/lib/store/authStore';
import { useUIStore } from '@/lib/store/uiStore';
import { formatConversationTime } from '@/lib/utils/formatDate';
import { getConversationName, getLastActivity } from '@/lib/utils/conversation';
import { cn } from '@/lib/utils/cn';
import type { Conversation } from '@/types/models';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
}

export function ConversationItem({ conversation, isActive }: ConversationItemProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setActiveConversation = useUIStore((s) => s.setActiveConversation);

  const isGroup = conversation.type === 'group';
  const displayName = getConversationName(conversation, user?._id);
  const lastMessage = conversation.lastMessage;
  const timestamp = formatConversationTime(getLastActivity(conversation));

  const handleClick = () => {
    setActiveConversation(conversation._id);
    router.push(`/chat/${conversation._id}`);
  };

  return (
    <button
      id={`conversation-${conversation._id}`}
      onClick={handleClick}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        // Flush edges: these rows tile a list rather than read as buttons.
        'w-full flex items-center gap-3 px-4 py-3 text-left rounded-none transition-colors duration-150',
        isActive
          ? 'bg-[var(--color-primary-soft)] border-r-2 border-[var(--color-primary)]'
          : 'hover:bg-[var(--color-surface-2)]'
      )}
    >
      <Avatar name={displayName} size="md" isGroup={isGroup} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 min-w-0">
            {isGroup && (
              <Users
                className="w-3 h-3 shrink-0 text-[var(--color-text-muted)]"
                aria-label="Group conversation"
              />
            )}
            <span className="text-sm font-medium truncate text-[var(--color-text-primary)]">
              {displayName}
            </span>
          </span>
          {timestamp && (
            <span className="text-xs text-[var(--color-text-muted)] shrink-0">
              {timestamp}
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--color-text-secondary)] truncate mt-0.5">
          {lastMessage?.text || 'No messages yet'}
        </p>
      </div>
    </button>
  );
}
