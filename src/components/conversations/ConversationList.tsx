'use client';

import { useParams } from 'next/navigation';
import { useConversations } from '@/lib/hooks/useConversations';
import { ConversationItem } from './ConversationItem';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { ConversationSearch } from './ConversationSearch';
import { NewGroupDialog } from './NewGroupDialog';
import { useUIStore } from '@/lib/store/uiStore';

export function ConversationList() {
  const { data: conversations, isLoading, error, refetch } = useConversations();
  const { isNewChatOpen, isNewGroupOpen } = useUIStore();
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
        <>
          {conversations.length === 0 ? (
            <EmptyState
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              }
              title="No conversations yet"
              description="Start a new chat or create a group to get started."
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
          )}
        </>
      )}

      {isNewChatOpen && <ConversationSearch />}
      {isNewGroupOpen && <NewGroupDialog />}
    </>
  );
}
