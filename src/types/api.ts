import type { User, Conversation, Message } from './models'

// ─── Auth ──────────────────────────────────────────────────────────────────

export interface LoginRequest {
  phone: string
  name: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface MeResponse {
  user: User
}

// ─── Users ─────────────────────────────────────────────────────────────────

export type SearchUsersResponse = User[]

// ─── Conversations ──────────────────────────────────────────────────────────

export type ListConversationsResponse = Conversation[]

export interface StartConversationRequest {
  userId: string
}

export type StartConversationResponse = Conversation

// ─── Messages ──────────────────────────────────────────────────────────────

export interface MessageHistoryResponse {
  messages: Message[]
  hasMore: boolean
  nextCursor: string | null
}

export interface SendMessageRequest {
  conversationId: string
  text: string
}

export type SendMessageResponse = Message

// ─── Groups ────────────────────────────────────────────────────────────────

export interface CreateGroupRequest {
  name: string
  participantIds: string[]
}

export type CreateGroupResponse = Conversation

export interface AddParticipantsRequest {
  userIds: string[]
}

export interface PromoteAdminRequest {
  userId: string
}

export interface RenameGroupRequest {
  name: string
}

// ─── Generic API wrapper ───────────────────────────────────────────────────

export interface ApiError {
  message: string
  statusCode?: number
}
