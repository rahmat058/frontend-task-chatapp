import { apiClient } from './client';
import { unwrapArray, unwrapObject } from './normalize';
import { useAuthStore } from '@/lib/store/authStore';
import { useUserDirectory } from '@/lib/store/userDirectory';
import { normalizeMessage } from '@/lib/utils/message';
import {
  hydrateConversation,
  normalizeConversation,
} from '@/lib/utils/conversation';
import type {
  ListConversationsResponse,
  StartConversationRequest,
  StartConversationResponse,
  MessageHistoryResponse,
} from '@/types/api';
import type { Conversation, Message } from '@/types/models';

function attachKnownNames(conversation: Conversation): Conversation {
  const directory = useUserDirectory.getState();
  return hydrateConversation(
    conversation,
    useAuthStore.getState().user?._id,
    directory.byId,
    directory.byConversationId[conversation._id]
  );
}

export const conversationsApi = {
  async list(): Promise<ListConversationsResponse> {
    const res = await apiClient.get<unknown>('/conversations');
    const conversations = unwrapArray<unknown>(res.data)
      .map(normalizeConversation)
      .filter((item): item is Conversation => item !== null);

    useUserDirectory.getState().remember(
      conversations.flatMap((conversation) => [
        ...conversation.participants,
        conversation.lastMessage?.sender,
      ])
    );

    return conversations.map(attachKnownNames);
  },

  async startDirect(
    data: StartConversationRequest
  ): Promise<StartConversationResponse> {
    const res = await apiClient.post<unknown>('/conversations', data);
    const conversation = normalizeConversation(
      unwrapObject(res.data, 'conversation')
    );

    if (!conversation?._id) {
      throw new Error('Conversation was created but no id was returned.');
    }
    return attachKnownNames(conversation);
  },

  async getMessages(
    conversationId: string,
    params?: { limit?: number; before?: string }
  ): Promise<MessageHistoryResponse> {
    const res = await apiClient.get<unknown>(
      `/conversations/${conversationId}/messages`,
      { params }
    );

    const raw = res.data;
    const currentUser = useAuthStore.getState().user;
    const messages = unwrapArray<Message>(raw)
      .map((item) => normalizeMessage(item, currentUser))
      .filter((item): item is Message => item !== null);
    useUserDirectory.getState().remember(messages.map((m) => m.sender));
    const body = (raw && typeof raw === 'object' ? raw : {}) as Record<
      string,
      unknown
    >;

    const nextCursor =
      typeof body.nextCursor === 'string' ? body.nextCursor : null;

    return {
      messages,
      hasMore: Boolean(body.hasMore) && nextCursor !== null,
      nextCursor,
    };
  },
};
