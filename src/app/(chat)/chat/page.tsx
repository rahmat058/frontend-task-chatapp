import { MessagesSquare } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'

/** Gated behind client-side session restore; see the chat layout. */
export const instant = false

export default function ChatIndexPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <EmptyState
        icon={<MessagesSquare className="h-7 w-7" />}
        title="Select a conversation"
        description="Choose an existing conversation from the sidebar, or start a new one."
      />
    </div>
  )
}
