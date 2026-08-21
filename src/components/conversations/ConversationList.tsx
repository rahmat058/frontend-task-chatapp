'use client';

import { useParams } from 'next/navigation';
import { MessagesSquare } from 'lucide-react';
import { ConversationItem } from './ConversationItem';
import { ConversationSearch } from './ConversationSearch';
import { NewGroupDialog } from './NewGroupDialog';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { useConversations } from '@/lib/hooks/useConversations';
import { useUIStore } from '@/lib/store/uiStore';

export function ConversationList() {
  const { data: conversations, isLoading, error, refetch } = useConversations();
  const isNewChatOpen = useUIStore((s) => s.isNewChatOpen);
  const isNewGroupOpen = useUIStore((s) => s.isNewGroupOpen);

  const params = useParams();
  const activeId = params?.id as string | undefined;

  return (
    <>
      {isLoading && <SkeletonLoader variant="conversation" count={6} />}

      {error && (
        <ErrorState
          description="Could not load conversations."
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !error && conversations && (
        conversations.length === 0 ? (
          <EmptyState
            icon={<MessagesSquare className="w-6 h-6" />}
            title="No conversations yet"
            description="Start a new chat or create a group to get going."
          />
        ) : (
          <div className="flex flex-col">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation._id}
                conversation={conversation}
                isActive={conversation._id === activeId}
              />
            ))}
          </div>
        )
      )}

      {isNewChatOpen && <ConversationSearch />}
      {isNewGroupOpen && <NewGroupDialog />}
    </>
  );
}
