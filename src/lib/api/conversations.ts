import { apiClient } from './client';
import { unwrapArray, unwrapObject } from './normalize';
import type {
  ListConversationsResponse,
  StartConversationRequest,
  StartConversationResponse,
  MessageHistoryResponse,
} from '@/types/api';
import type { Conversation, Message } from '@/types/models';

export const conversationsApi = {
  async list(): Promise<ListConversationsResponse> {
    const res = await apiClient.get<unknown>('/conversations');
    return unwrapArray<Conversation>(res.data);
  },

  async startDirect(
    data: StartConversationRequest
  ): Promise<StartConversationResponse> {
    const res = await apiClient.post<unknown>('/conversations', data);
    const conversation = unwrapObject<Conversation>(res.data, 'conversation');

    if (!conversation?._id) {
      throw new Error('Conversation was created but no id was returned.');
    }
    return conversation;
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
    const messages = unwrapArray<Message>(raw);
    const body = (raw && typeof raw === 'object' ? raw : {}) as Record<
      string,
      unknown
    >;

    const nextCursor =
      typeof body.nextCursor === 'string' ? body.nextCursor : null;

    return {
      messages,
      // Never report another page without a cursor to fetch it with, or the
      // "load older" control paginates forever against the same response.
      hasMore: Boolean(body.hasMore) && nextCursor !== null,
      nextCursor,
    };
  },
};
