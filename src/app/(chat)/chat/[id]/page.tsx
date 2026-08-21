import { ConversationView } from '@/components/chat/ConversationView';

/**
 * Rendered only after the client restores the session, so this segment is
 * dropped from the instant-navigation prerender by design.
 */
export const instant = false;

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;
  return <ConversationView conversationId={id} />;
}
