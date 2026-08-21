'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings2 } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { GroupSettingsDialog } from './GroupSettingsDialog';
import { useConversationName } from '@/lib/hooks/useConversationName';
import { getParticipantCount } from '@/lib/utils/conversation';
import type { Conversation } from '@/types/models';

interface ChatHeaderProps {
  conversation: Conversation;
}

export function ChatHeader({ conversation }: ChatHeaderProps) {
  const isGroup = conversation.type === 'group';
  const [settingsOpen, setSettingsOpen] = useState(false);

  const displayName = useConversationName(conversation);
  const memberCount = getParticipantCount(conversation);
  const subtitle = isGroup
    ? `${memberCount} ${memberCount === 1 ? 'member' : 'members'}`
    : 'Direct message';

  return (
    <header className="flex items-center gap-3 px-5 py-3.5 bg-[var(--color-surface-1)] border-b border-[var(--color-border)] shrink-0">
      {/* The sidebar is hidden on small screens, so this is the only way back. */}
      <Link
        href="/chat"
        aria-label="Back to conversations"
        className="sm:hidden -ml-1 p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
      </Link>

      <Avatar name={displayName} size="md" isGroup={isGroup} />
      <div className="min-w-0 flex-1">
        <h1 className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
          {displayName}
        </h1>
        <p className="text-xs text-[var(--color-text-muted)]">{subtitle}</p>
      </div>

      {isGroup && (
        <Button
          variant="secondary"
          size="sm"
          className="shrink-0"
          aria-label="Manage group"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings2 className="w-3.5 h-3.5" aria-hidden="true" />
          Manage group
        </Button>
      )}

      {settingsOpen && (
        <GroupSettingsDialog
          conversation={conversation}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </header>
  );
}
