import { ChatShell } from '@/components/layout/ChatShell'

/**
 * Chat routes render only after the client has restored the session, so they
 * are dropped from the prerender that validates instant navigation.
 */
export const instant = false

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <ChatShell>{children}</ChatShell>
}
