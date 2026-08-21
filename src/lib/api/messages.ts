import { apiClient } from './client';
import { unwrapObject } from './normalize';
import { useAuthStore } from '@/lib/store/authStore';
import { normalizeMessage } from '@/lib/utils/message';
import type { SendMessageRequest, SendMessageResponse } from '@/types/api';

export const messagesApi = {
  async send(data: SendMessageRequest): Promise<SendMessageResponse> {
    const res = await apiClient.post<unknown>('/messages', data);
    const message = normalizeMessage(
      unwrapObject(res.data, 'message'),
      useAuthStore.getState().user
    );

    if (!message?._id) {
      throw new Error('Message was sent but no confirmation was returned.');
    }
    return message;
  },
};
