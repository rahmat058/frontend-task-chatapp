import type { Message, Conversation } from './models'

// ─── Client → Server ────────────────────────────────────────────────────────

export interface SocketSendMessagePayload {
  conversationId: string
  text: string
}

// ─── Server → Client ────────────────────────────────────────────────────────

export type SocketNewMessagePayload = Message

export type SocketConversationUpdatedPayload = Conversation

// ─── Event name constants ───────────────────────────────────────────────────

export const SOCKET_EVENTS = {
  // client → server
  MESSAGE_SEND: 'message:send',
  // server → client
  MESSAGE_NEW: 'message:new',
  CONVERSATION_UPDATED: 'conversation:updated',
} as const

export type SocketEventName = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS]
