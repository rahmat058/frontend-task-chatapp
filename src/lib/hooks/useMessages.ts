'use client'

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { conversationsApi } from '@/lib/api/conversations'
import { messagesApi } from '@/lib/api/messages'
import { useAuthStore } from '@/lib/store/authStore'
import { toTimestamp } from '@/lib/utils/formatDate'
import { getSenderId, normalizeMessage } from '@/lib/utils/message'
import type { Message } from '@/types/models'
import type { MessageHistoryResponse } from '@/types/api'

const PAGE_SIZE = 20

export function messagesQueryKey(conversationId: string) {
  return ['messages', conversationId]
}

export function isOptimistic(message: Message): boolean {
  return message._id.startsWith('optimistic-')
}

/**
 * A message can arrive twice: once as the POST response and once over the
 * `message:new` socket event. Keep the confirmed copy and drop the pending
 * placeholder with the same author and text.
 */
export function mergeMessages(messages: Message[]): Message[] {
  const byId = new Map<string, Message>()
  const confirmed = new Set<string>()

  for (const message of messages) {
    if (!isOptimistic(message)) {
      confirmed.add(`${getSenderId(message)}|${message.text}`)
    }
  }

  for (const message of messages) {
    if (isOptimistic(message) && confirmed.has(`${getSenderId(message)}|${message.text}`)) {
      continue
    }
    byId.set(message._id, message)
  }

  return [...byId.values()].sort((a, b) => toTimestamp(a.createdAt) - toTimestamp(b.createdAt))
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
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
    select: (data) => ({
      ...data,
      allMessages: mergeMessages(data.pages.flatMap((p) => p.messages)),
    }),
    staleTime: Infinity, // kept fresh by the socket, not by polling
    enabled: !!conversationId,
  })
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (text: string) => messagesApi.send({ conversationId, text }),

    onMutate: async (text) => {
      await queryClient.cancelQueries({
        queryKey: messagesQueryKey(conversationId),
      })

      const currentUser = useAuthStore.getState().user
      const optimisticMessage: Message = {
        _id: `optimistic-${Date.now()}`,
        conversationId,
        // Must be the real user id, otherwise the pending bubble is treated
        // as an incoming message and renders on the wrong side.
        sender: {
          _id: currentUser?._id ?? '',
          name: currentUser?.name ?? 'You',
        },
        text,
        createdAt: new Date().toISOString(),
      }

      queryClient.setQueryData(
        messagesQueryKey(conversationId),
        (old: { pages: MessageHistoryResponse[] } | undefined) => {
          if (!old?.pages?.length) return old
          const pages = [...old.pages]
          const last = pages[pages.length - 1]
          pages[pages.length - 1] = {
            ...last,
            messages: [...last.messages, optimisticMessage],
          }
          return { ...old, pages }
        },
      )

      return { optimisticMessage }
    },

    onError: (_err, _text, context) => {
      if (!context?.optimisticMessage) return
      queryClient.setQueryData(
        messagesQueryKey(conversationId),
        (old: { pages: MessageHistoryResponse[] } | undefined) => {
          if (!old?.pages?.length) return old
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              messages: page.messages.filter((m) => m._id !== context.optimisticMessage._id),
            })),
          }
        },
      )
    },

    onSuccess: (serverMessage, _text, context) => {
      const confirmed = normalizeMessage(serverMessage, useAuthStore.getState().user) ?? serverMessage

      queryClient.setQueryData(
        messagesQueryKey(conversationId),
        (old: { pages: MessageHistoryResponse[] } | undefined) => {
          if (!old?.pages?.length || !context?.optimisticMessage) return old
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              messages: page.messages.map((m) => (m._id === context.optimisticMessage._id ? confirmed : m)),
            })),
          }
        },
      )
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}
