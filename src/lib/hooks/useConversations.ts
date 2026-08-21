'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { conversationsApi } from '@/lib/api/conversations'
import { groupsApi } from '@/lib/api/groups'
import { sortByRecency, hydrateConversation } from '@/lib/utils/conversation'
import { useAuthStore } from '@/lib/store/authStore'
import { useUserDirectory } from '@/lib/store/userDirectory'
import type { CreateGroupRequest, StartConversationRequest } from '@/types/api'
import type { Conversation, User } from '@/types/models'

export const CONVERSATIONS_QUERY_KEY = ['conversations']

export function useConversations() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: CONVERSATIONS_QUERY_KEY,
    queryFn: () => conversationsApi.list(),
    select: sortByRecency,
    staleTime: 15_000,
    enabled: isAuthenticated,
  })
}

export function useStartConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ userId, peer }: StartConversationRequest & { peer: User }) => {
      const conversation = await conversationsApi.startDirect({ userId })
      const directory = useUserDirectory.getState()
      directory.rememberPeer(conversation._id, peer)
      return hydrateConversation(conversation, useAuthStore.getState().user?._id, directory.byId, peer)
    },
    onSuccess: (conversation) => {
      queryClient.setQueryData(CONVERSATIONS_QUERY_KEY, (old: Conversation[] | undefined) => {
        const list = Array.isArray(old) ? old : []
        return [conversation, ...list.filter((item) => item._id !== conversation._id)]
      })
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY })
    },
  })
}

export function useCreateGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateGroupRequest) => groupsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY })
    },
  })
}

function useInvalidateConversations() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY })
}

export function useAddParticipants(conversationId: string) {
  const invalidate = useInvalidateConversations()
  return useMutation({
    mutationFn: (userIds: string[]) => groupsApi.addParticipants(conversationId, { userIds }),
    onSuccess: invalidate,
  })
}

export function useRemoveParticipant(conversationId: string) {
  const invalidate = useInvalidateConversations()
  return useMutation({
    mutationFn: (userId: string) => groupsApi.removeParticipant(conversationId, userId),
    onSuccess: invalidate,
  })
}

export function usePromoteAdmin(conversationId: string) {
  const invalidate = useInvalidateConversations()
  return useMutation({
    mutationFn: (userId: string) => groupsApi.promoteAdmin(conversationId, { userId }),
    onSuccess: invalidate,
  })
}

export function useRenameGroup(conversationId: string) {
  const invalidate = useInvalidateConversations()
  return useMutation({
    mutationFn: (name: string) => groupsApi.rename(conversationId, { name }),
    onSuccess: invalidate,
  })
}
