export interface User {
  _id: string
  name: string
  phone: string
}

export type ConversationType = 'direct' | 'group'

/** Responses return either a bare id or a populated user. */
export type Participant = User | string

export interface Conversation {
  _id: string
  type: ConversationType
  name?: string // group only
  participants: Participant[]
  admins?: Participant[] // group only
  lastMessage?: {
    _id?: string
    text: string
    sender?: Participant
    createdAt?: string
  }
  updatedAt?: string
  createdAt?: string
}

/** Sender is populated on some payloads and a bare user id on others. */
export type MessageSender = Pick<User, '_id' | 'name'> | string

export interface Message {
  _id: string
  conversationId: string
  sender: MessageSender
  senderId?: string
  text: string
  createdAt: string
  updatedAt?: string
}
