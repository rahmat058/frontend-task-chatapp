'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { connectSocket, disconnectSocket } from '@/lib/socket/socket';
import { useAuthStore } from '@/lib/store/authStore';
import { SOCKET_EVENTS } from '@/types/socket';
import type { SocketNewMessagePayload } from '@/types/socket';
import { isOptimistic, messagesQueryKey } from '@/lib/hooks/useMessages';
import { getSenderId, normalizeMessage } from '@/lib/utils/message';
import type { Message } from '@/types/models';
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

    const handleNewMessage = (payload: SocketNewMessagePayload) => {
      const incoming = normalizeMessage(
        payload,
        useAuthStore.getState().user
      );
      if (!incoming?.conversationId) return;

      queryClient.setQueryData(
        messagesQueryKey(incoming.conversationId),
        (old: { pages: MessageHistoryResponse[] } | undefined) => {
          if (!old?.pages?.length) return old;

          const alreadyPresent = old.pages.some((page) =>
            page.messages.some((m) => m._id === incoming._id)
          );
          if (alreadyPresent) return old;

          const isEcho = (m: Message) =>
            isOptimistic(m) &&
            m.text === incoming.text &&
            getSenderId(m) === getSenderId(incoming);

          const pages = old.pages.map((page, index, all) => {
            const withoutEcho = page.messages.filter((m) => !isEcho(m));
            if (index !== all.length - 1) {
              return { ...page, messages: withoutEcho };
            }
            return { ...page, messages: [...withoutEcho, incoming] };
          });
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
