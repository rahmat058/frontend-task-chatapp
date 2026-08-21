'use client';

import { Avatar } from '@/components/common/Avatar';
import type { Conversation } from '@/types/models';
import { useAuthStore } from '@/lib/store/authStore';
import {
  getConversationName,
  getParticipantCount,
} from '@/lib/utils/conversation';

interface ChatHeaderProps {
  conversation: Conversation;
}

export function ChatHeader({ conversation }: ChatHeaderProps) {
  const { user } = useAuthStore();
  const isGroup = conversation.type === 'group';

  const displayName = getConversationName(conversation, user?._id);

  const memberCount = getParticipantCount(conversation);
  const subtitle = isGroup
    ? `${memberCount} ${memberCount === 1 ? 'member' : 'members'}`
    : 'Direct message';

  return (
    <header className="flex items-center gap-3 px-5 py-3.5 bg-[var(--color-surface-1)] border-b border-[var(--color-border)] shrink-0">
      <Avatar name={displayName} size="md" isGroup={isGroup} />
      <div className="min-w-0">
        <h1 className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
          {displayName}
        </h1>
        <p className="text-xs text-[var(--color-text-muted)]">{subtitle}</p>
      </div>
    </header>
  );
}
