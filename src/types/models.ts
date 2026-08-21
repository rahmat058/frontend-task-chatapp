export interface User {
  _id: string;
  name: string;
  phone: string;
}

export type ConversationType = 'direct' | 'group';

export interface Conversation {
  _id: string;
  type: ConversationType;
  name?: string; // group only
  participants: User[];
  admins?: string[]; // group only — array of user IDs
  lastMessage?: {
    _id: string;
    text: string;
    sender: Pick<User, '_id' | 'name'>;
    createdAt: string;
  };
  updatedAt: string;
  createdAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: Pick<User, '_id' | 'name'>;
  text: string;
  createdAt: string;
  updatedAt: string;
}
