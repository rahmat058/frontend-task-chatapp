import { apiClient } from './client';
import { unwrapObject } from './normalize';
import { normalizeConversation } from '@/lib/utils/conversation';
import type {
  CreateGroupRequest,
  CreateGroupResponse,
  AddParticipantsRequest,
  PromoteAdminRequest,
  RenameGroupRequest,
} from '@/types/api';
import type { Conversation } from '@/types/models';

function asConversation(raw: unknown, fallback: string): Conversation {
  const conversation = normalizeConversation(
    unwrapObject(raw, 'conversation') ?? raw
  );
  if (!conversation?._id) {
    throw new Error(fallback);
  }
  return conversation;
}

export const groupsApi = {
  async create(data: CreateGroupRequest): Promise<CreateGroupResponse> {
    const res = await apiClient.post<unknown>('/conversations/group', data);
    return asConversation(res.data, 'Group was created but no id was returned.');
  },

  async addParticipants(
    conversationId: string,
    data: AddParticipantsRequest
  ): Promise<Conversation> {
    const res = await apiClient.post<unknown>(
      `/conversations/${conversationId}/participants`,
      data
    );
    return asConversation(res.data, 'Could not add those members.');
  },

  async removeParticipant(
    conversationId: string,
    userId: string
  ): Promise<void> {
    await apiClient.delete(
      `/conversations/${conversationId}/participants/${userId}`
    );
  },

  async promoteAdmin(
    conversationId: string,
    data: PromoteAdminRequest
  ): Promise<Conversation> {
    const res = await apiClient.post<unknown>(
      `/conversations/${conversationId}/admins`,
      data
    );
    return asConversation(res.data, 'Could not promote that member.');
  },

  async rename(
    conversationId: string,
    data: RenameGroupRequest
  ): Promise<Conversation> {
    const res = await apiClient.patch<unknown>(
      `/conversations/${conversationId}`,
      data
    );
    return asConversation(res.data, 'Could not rename the group.');
  },
};
