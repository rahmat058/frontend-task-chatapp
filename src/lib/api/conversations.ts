import { apiClient } from './client';
import type {
  ListConversationsResponse,
  StartConversationRequest,
  StartConversationResponse,
  MessageHistoryResponse,
} from '@/types/api';

export const conversationsApi = {
  async list(): Promise<ListConversationsResponse> {
    const res = await apiClient.get<ListConversationsResponse>('/conversations');
    return res.data;
  },

  async startDirect(
    data: StartConversationRequest
  ): Promise<StartConversationResponse> {
    const res = await apiClient.post<StartConversationResponse>(
      '/conversations',
      data
    );
    return res.data;
  },

  async getMessages(
    conversationId: string,
    params?: { limit?: number; before?: string }
  ): Promise<MessageHistoryResponse> {
    const res = await apiClient.get<MessageHistoryResponse>(
      `/conversations/${conversationId}/messages`,
      { params }
    );
    return res.data;
  },
};
