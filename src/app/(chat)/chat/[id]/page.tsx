'use client';

import { use } from 'react';
import { useConversations } from '@/lib/hooks/useConversations';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { ErrorState } from '@/components/common/ErrorState';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { id } = use(params);
  const { data: conversations, isLoading, error, refetch } = useConversations();

  if (isLoading) {
    return <SkeletonLoader variant="message" count={6} />;
  }

  if (error) {
    return (
      <ErrorState
        description="Failed to load this conversation."
        onRetry={() => refetch()}
      />
    );
  }

  const conversation = conversations?.find((c) => c._id === id);

  if (!conversation) {
    return (
      <ErrorState
        title="Conversation not found"
        description="This conversation may have been deleted or you don't have access."
      />
    );
  }

  return <ChatPanel conversation={conversation} />;
}
