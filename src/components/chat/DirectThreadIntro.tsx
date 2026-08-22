'use client'

import { useState } from 'react'
import { Settings2, Shield, User } from 'lucide-react'
import { Avatar } from '@/components/common/Avatar'
import { Button } from '@/components/common/Button'
import { Dialog } from '@/components/common/Dialog'
import type { User as ChatUser } from '@/types/models'

export function DirectThreadIntro({
  name,
  isGroup,
  peer,
  onManageGroup,
  empty = false,
}: {
  name: string
  isGroup: boolean
  peer?: ChatUser | null
  onManageGroup?: () => void
  empty?: boolean
}) {
  const [dialog, setDialog] = useState<'profile' | 'safety' | null>(null)

  return (
    <div className="flex flex-col items-center px-4 pt-10 pb-8 text-center">
      <Avatar name={name} size="2xl" isGroup={isGroup} />
      <h2 className="mt-5 text-[28px] leading-[1.15] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
        {name}
      </h2>
      <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-[var(--text-secondary)]">
        {empty ? 'No messages yet — say hello!' : 'This is the beginning of your conversation'}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {isGroup ? (
          <Button type="button" variant="secondary" size="sm" onClick={onManageGroup}>
            <Settings2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            Manage group
          </Button>
        ) : (
          <>
            <Button type="button" variant="secondary" size="sm" onClick={() => setDialog('profile')}>
              <User className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              View profile
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => setDialog('safety')}>
              <Shield className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Safety tools
            </Button>
          </>
        )}
      </div>

      {dialog === 'profile' && (
        <Dialog title="Profile" onClose={() => setDialog(null)}>
          <div className="flex flex-col items-center gap-3 px-5 py-6">
            <Avatar name={peer?.name ?? name} size="xl" />
            <div className="text-center">
              <p className="text-base font-semibold text-[var(--text-primary)]">{peer?.name ?? name}</p>
              {peer?.phone ? (
                <p className="mt-1 text-sm text-[var(--text-secondary)] tabular-nums">{peer.phone}</p>
              ) : (
                <p className="mt-1 text-sm text-[var(--text-muted)]">No phone on file for this person.</p>
              )}
            </div>
          </div>
        </Dialog>
      )}

      {dialog === 'safety' && (
        <Dialog
          title="Safety tools"
          description="This is a private 1:1 thread."
          onClose={() => setDialog(null)}
          footer={
            <Button type="button" variant="secondary" onClick={() => setDialog(null)}>
              Close
            </Button>
          }>
          <div className="space-y-3 px-5 py-4 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>Only you and {name} can see this conversation. ChatApp has no public feed and no public profile page.</p>
            <p>There is no block or report endpoint in this product yet, so those actions are not offered here.</p>
          </div>
        </Dialog>
      )}
    </div>
  )
}

export function DayDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-3" role="separator" aria-label={label}>
      <span className="h-px flex-1 bg-[var(--border-subtle)]" />
      <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-1)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--text-muted)]">
        {label}
      </span>
      <span className="h-px flex-1 bg-[var(--border-subtle)]" />
    </div>
  )
}
