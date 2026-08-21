import { apiClient } from './client';
import { unwrapObject } from './normalize';
import type {
  CreateGroupRequest,
  CreateGroupResponse,
  AddParticipantsRequest,
  PromoteAdminRequest,
  RenameGroupRequest,
} from '@/types/api';
import type { Conversation } from '@/types/models';

export const groupsApi = {
  async create(data: CreateGroupRequest): Promise<CreateGroupResponse> {
    const res = await apiClient.post<unknown>('/conversations/group', data);
    const group = unwrapObject<Conversation>(res.data, 'conversation');

    if (!group?._id) {
      throw new Error('Group was created but no id was returned.');
    }
    return group;
  },

  async addParticipants(
    conversationId: string,
    data: AddParticipantsRequest
  ): Promise<Conversation> {
    const res = await apiClient.post<Conversation>(
      `/conversations/${conversationId}/participants`,
      data
    );
    return res.data;
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
    const res = await apiClient.post<Conversation>(
      `/conversations/${conversationId}/admins`,
      data
    );
    return res.data;
  },

  async rename(
    conversationId: string,
    data: RenameGroupRequest
  ): Promise<Conversation> {
    const res = await apiClient.patch<Conversation>(
      `/conversations/${conversationId}`,
      data
    );
    return res.data;
  },
};
