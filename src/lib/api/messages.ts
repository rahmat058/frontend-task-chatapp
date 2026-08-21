import { apiClient } from './client';
import type {
  SendMessageRequest,
  SendMessageResponse,
} from '@/types/api';

export const messagesApi = {
  async send(data: SendMessageRequest): Promise<SendMessageResponse> {
    const res = await apiClient.post<SendMessageResponse>('/messages', data);
    return res.data;
  },
};
