'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { connectSocket, disconnectSocket } from '@/lib/socket/socket';
import { useAuthStore } from '@/lib/store/authStore';
import { SOCKET_EVENTS } from '@/types/socket';
import type { SocketNewMessagePayload } from '@/types/socket';
import { messagesQueryKey } from '@/lib/hooks/useMessages';
import type { MessageHistoryResponse } from '@/types/api';

/**
 * Owns the socket lifecycle and keeps the React Query cache in sync with
 * server events. Connection state itself is read via `useSocket`.
 */
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket();

    const handleNewMessage = (message: SocketNewMessagePayload) => {
      if (!message?.conversationId) return;

      queryClient.setQueryData(
        messagesQueryKey(message.conversationId),
        (old: { pages: MessageHistoryResponse[] } | undefined) => {
          if (!old?.pages?.length) return old;

          const alreadyPresent = old.pages.some((page) =>
            page.messages.some((m) => m._id === message._id)
          );
          if (alreadyPresent) return old;

          const pages = [...old.pages];
          const last = pages[pages.length - 1];
          pages[pages.length - 1] = {
            ...last,
            messages: [...last.messages, message],
          };
          return { ...old, pages };
        }
      );

      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };

    const handleConversationUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };

    // Re-fetch on (re)connect to close any gap opened while the socket was down.
    const handleConnect = () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };

    socket.on('connect', handleConnect);
    socket.on(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
    socket.on(SOCKET_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);

    return () => {
      socket.off('connect', handleConnect);
      socket.off(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
      socket.off(SOCKET_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);
    };
  }, [isAuthenticated, queryClient]);

  return <>{children}</>;
}
