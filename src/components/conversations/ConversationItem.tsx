'use client';

import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/common/Avatar';
import { useAuthStore } from '@/lib/store/authStore';
import { useUIStore } from '@/lib/store/uiStore';
import { formatConversationTime } from '@/lib/utils/formatDate';
import { getConversationName, getLastActivity } from '@/lib/utils/conversation';
import type { Conversation } from '@/types/models';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
}

export function ConversationItem({ conversation, isActive }: ConversationItemProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { setActiveConversation } = useUIStore();

  const isGroup = conversation.type === 'group';
  const displayName = getConversationName(conversation, user?._id);

  const lastMsg = conversation.lastMessage;
  const timestamp = formatConversationTime(getLastActivity(conversation));

  const handleClick = () => {
    setActiveConversation(conversation._id);
    router.push(`/chat/${conversation._id}`);
  };

  return (
    <button
      id={`conversation-${conversation._id}`}
      onClick={handleClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 text-left
        transition-all duration-150 group relative
        ${isActive
          ? 'bg-[var(--color-primary-soft)] border-r-2 border-[var(--color-primary)]'
          : 'hover:bg-[var(--color-surface-2)]'}
      `}
    >
      <Avatar
        name={displayName}
        size="md"
        isGroup={isGroup}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-sm font-medium truncate ${isActive ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-primary)]'}`}
          >
            {displayName}
          </span>
          {timestamp && (
            <span className="text-xs text-[var(--color-text-muted)] shrink-0">
              {timestamp}
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--color-text-secondary)] truncate mt-0.5">
          {lastMsg?.text || 'No messages yet'}
        </p>
      </div>

      {isGroup && (
        <span className="absolute right-4 top-2 text-[9px] text-[var(--color-text-muted)] bg-[var(--color-surface-3)] rounded-full px-1.5 py-0.5">
          group
        </span>
      )}
    </button>
  );
}
