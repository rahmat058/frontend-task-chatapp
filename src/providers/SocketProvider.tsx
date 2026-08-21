'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import type { Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { connectSocket, disconnectSocket } from '@/lib/socket/socket';
import { useAuthStore } from '@/lib/store/authStore';
import { SOCKET_EVENTS } from '@/types/socket';
import type {
  SocketNewMessagePayload,
  SocketConversationUpdatedPayload,
} from '@/types/socket';
import type { Message } from '@/types/models';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
});

export function useSocketContext() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  const handleNewMessage = useCallback(
    (message: SocketNewMessagePayload) => {
      // Update the infinite message cache for the relevant conversation
      queryClient.setQueryData(
        ['messages', message.conversationId],
        (old: { pages: { messages: Message[] }[] } | undefined) => {
          if (!old) return old;
          const newPages = [...old.pages];
          if (newPages.length > 0) {
            // Add to last page (most recent)
            const lastPage = newPages[newPages.length - 1];
            newPages[newPages.length - 1] = {
              ...lastPage,
              messages: [...lastPage.messages, message],
            };
          }
          return { ...old, pages: newPages };
        }
      );
      // Invalidate conversations list to update last message + ordering
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    [queryClient]
  );

  const handleConversationUpdated = useCallback(
    (_conversation: SocketConversationUpdatedPayload) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    [queryClient]
  );

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
      return;
    }

    const s = connectSocket();
    socketRef.current = s;
    setSocket(s);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);
    s.on(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
    s.on(SOCKET_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);

    if (s.connected) setIsConnected(true);

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      s.off(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
      s.off(SOCKET_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);
    };
  }, [isAuthenticated, handleNewMessage, handleConversationUpdated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
