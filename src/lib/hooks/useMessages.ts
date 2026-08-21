'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { conversationsApi } from '@/lib/api/conversations';
import { messagesApi } from '@/lib/api/messages';
import type { Message } from '@/types/models';
import type { MessageHistoryResponse } from '@/types/api';

const PAGE_SIZE = 20;

export function messagesQueryKey(conversationId: string) {
  return ['messages', conversationId];
}

export function useMessages(conversationId: string) {
  return useInfiniteQuery({
    queryKey: messagesQueryKey(conversationId),
    queryFn: ({ pageParam }) =>
      conversationsApi.getMessages(conversationId, {
        limit: PAGE_SIZE,
        before: pageParam as string | undefined,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage: MessageHistoryResponse) =>
      lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined,
    select: (data) => ({
      ...data,
      // Flatten pages and reverse so newest is at the bottom
      allMessages: data.pages
        .flatMap((p) => p.messages)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ),
    }),
    staleTime: Infinity, // Messages are updated via socket, not polling
    enabled: !!conversationId,
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) =>
      messagesApi.send({ conversationId, text }),
    onMutate: async (text) => {
      // Optimistic update
      await queryClient.cancelQueries({
        queryKey: messagesQueryKey(conversationId),
      });

      const optimisticMessage: Message = {
        _id: `optimistic-${Date.now()}`,
        conversationId,
        sender: { _id: 'me', name: 'You' },
        text,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData(
        messagesQueryKey(conversationId),
        (old: { pages: { messages: Message[] }[] } | undefined) => {
          if (!old) return old;
          const newPages = [...old.pages];
          if (newPages.length > 0) {
            const lastPage = newPages[newPages.length - 1];
            newPages[newPages.length - 1] = {
              ...lastPage,
              messages: [...lastPage.messages, optimisticMessage],
            };
          }
          return { ...old, pages: newPages };
        }
      );

      return { optimisticMessage };
    },
    onError: (_err, _vars, context) => {
      // Rollback optimistic update
      if (context?.optimisticMessage) {
        queryClient.setQueryData(
          messagesQueryKey(conversationId),
          (old: { pages: { messages: Message[] }[] } | undefined) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                messages: page.messages.filter(
                  (m) => m._id !== context.optimisticMessage._id
                ),
              })),
            };
          }
        );
      }
    },
    onSuccess: (serverMessage, _text, context) => {
      // Replace the optimistic message with the real one
      queryClient.setQueryData(
        messagesQueryKey(conversationId),
        (old: { pages: { messages: Message[] }[] } | undefined) => {
          if (!old || !context?.optimisticMessage) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              messages: page.messages.map((m) =>
                m._id === context.optimisticMessage._id ? serverMessage : m
              ),
            })),
          };
        }
      );
    },
  });
}
