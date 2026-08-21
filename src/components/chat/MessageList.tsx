'use client';

import { useRef, forwardRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';
import { Spinner } from '@/components/common/Spinner';
import { useMessages } from '@/lib/hooks/useMessages';
import { useAuthStore } from '@/lib/store/authStore';
import { useScrollBehavior } from '@/lib/hooks/useScrollBehavior';
import type { Conversation } from '@/types/models';
import { ScrollToBottom } from './ScrollToBottom';

interface MessageListProps {
  conversation: Conversation;
}

export function MessageList({ conversation }: MessageListProps) {
  const { user } = useAuthStore();
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useMessages(conversation._id);

  const messages = data?.allMessages ?? [];
  const messageCount = messages.length;

  const { scrollRef, showScrollButton, scrollToBottom } = useScrollBehavior([messageCount]);

  const isGroup = conversation.type === 'group';

  if (isLoading) {
    return <SkeletonLoader variant="message" count={8} />;
  }

  return (
    <div className="relative flex flex-col h-full">
      {/* Load more button (older messages) */}
      {hasNextPage && (
        <div className="flex justify-center py-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            className="text-xs"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load older messages'}
          </Button>
        </div>
      )}

      {/* Scrollable message area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2"
      >
        {messages.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            }
            title="No messages yet"
            description="Be the first to say something!"
          />
        ) : (
          messages.map((message, index) => {
            const isMine = message.sender._id === user?._id;
            // Show sender name if this message is from a different sender than the previous one
            const prevMessage = messages[index - 1];
            const showSender =
              !prevMessage || prevMessage.sender._id !== message.sender._id;
            return (
              <MessageBubble
                key={message._id}
                message={message}
                isMine={isMine}
                isGroup={isGroup}
                showSender={showSender}
              />
            );
          })
        )}
      </div>

      {/* Scroll to bottom FAB */}
      {showScrollButton && (
        <ScrollToBottom onClick={() => scrollToBottom('smooth')} />
      )}
    </div>
  );
}
