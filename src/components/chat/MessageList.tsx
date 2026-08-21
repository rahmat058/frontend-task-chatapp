'use client';

import { ChevronUp, MessagesSquare } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { ScrollToBottom } from './ScrollToBottom';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';
import { useMessages } from '@/lib/hooks/useMessages';
import { useAuthStore } from '@/lib/store/authStore';
import { useScrollBehavior } from '@/lib/hooks/useScrollBehavior';
import { getSenderId, isOwnMessage } from '@/lib/utils/message';
import type { Conversation } from '@/types/models';

interface MessageListProps {
  conversation: Conversation;
}

export function MessageList({ conversation }: MessageListProps) {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useMessages(conversation._id);

  const messages = data?.allMessages ?? [];
  const { scrollRef, showScrollButton, hasNewMessages, scrollToBottom } =
    useScrollBehavior(messages.length);

  const isGroup = conversation.type === 'group';

  if (isLoading) {
    return <SkeletonLoader variant="message" count={8} />;
  }

  return (
    <div className="relative flex flex-col h-full">
      {hasNextPage && (
        <div className="flex justify-center py-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            leftIcon={<ChevronUp className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            {isFetchingNextPage ? 'Loading…' : 'Load older messages'}
          </Button>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2"
      >
        {messages.length === 0 ? (
          <EmptyState
            icon={<MessagesSquare className="w-6 h-6" />}
            title="No messages yet"
            description="Say hello to start the conversation."
          />
        ) : (
          messages.map((message, index) => {
            const previous = messages[index - 1];
            return (
              <MessageBubble
                key={message._id}
                message={message}
                isMine={isOwnMessage(message, user?._id)}
                isGroup={isGroup}
                showSender={getSenderId(previous) !== getSenderId(message)}
              />
            );
          })
        )}
      </div>

      {showScrollButton && (
        <ScrollToBottom
          onClick={() => scrollToBottom('smooth')}
          hasNewMessages={hasNewMessages}
        />
      )}
    </div>
  );
}
