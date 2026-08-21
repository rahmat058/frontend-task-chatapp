import { apiClient } from './client';
import { unwrapObject } from './normalize';
import type { SendMessageRequest, SendMessageResponse } from '@/types/api';
import type { Message } from '@/types/models';

export const messagesApi = {
  async send(data: SendMessageRequest): Promise<SendMessageResponse> {
    const res = await apiClient.post<unknown>('/messages', data);
    const message = unwrapObject<Message>(res.data, 'message');

    if (!message?._id) {
      throw new Error('Message was sent but no confirmation was returned.');
    }
    return message;
  },
};
