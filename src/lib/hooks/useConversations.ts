'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { conversationsApi } from '@/lib/api/conversations';
import { groupsApi } from '@/lib/api/groups';
import { sortByRecency } from '@/lib/utils/conversation';
import { useAuthStore } from '@/lib/store/authStore';
import type { CreateGroupRequest, StartConversationRequest } from '@/types/api';

export const CONVERSATIONS_QUERY_KEY = ['conversations'];

export function useConversations() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: CONVERSATIONS_QUERY_KEY,
    queryFn: () => conversationsApi.list(),
    select: sortByRecency,
    staleTime: 15_000,
    enabled: isAuthenticated,
  });
}

export function useStartConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: StartConversationRequest) =>
      conversationsApi.startDirect(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
    },
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGroupRequest) => groupsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
    },
  });
}
