'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { LandingContainer } from './LandingContainer'
import { Reveal } from './Reveal'
import { cn } from '@/lib/utils/cn'

const items = [
  {
    q: 'Do I need a password?',
    a: 'No. Sign in with a name and a Bangladesh phone number. A new number registers; a known number returns.',
  },
  {
    q: 'How do I find people?',
    a: 'Search by name or phone, then open a direct thread. The inbox lists conversations you already have.',
  },
  {
    q: 'What can I do in a group?',
    a: 'Create a group, then rename it, add people, promote admins, remove members, or leave — including Manage group for admins.',
  },
  {
    q: 'What happens if the connection drops?',
    a: 'The client reconnects over Socket.io and restores the session on reload. Unread marks wait in other threads instead of jumping your scroll.',
  },
]

export function LandingFaq() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="scroll-mt-28">
      <LandingContainer className="py-16 md:py-24">
        <Reveal>
          <h2 className="text-center text-[30px] leading-[1.2] font-[620] tracking-[-0.02em] sm:text-[40px] md:text-[48px]">
            Frequently asked <span className="landing-text-gradient">questions</span>
          </h2>
          <p className="mt-3 text-center text-sm text-[var(--text-secondary)]">
            Still stuck?{' '}
            <Link href="/login" className="text-[var(--green-400)] hover:text-[var(--green-300)]">
              Open ChatApp
            </Link>{' '}
            and start a thread.
          </p>
        </Reveal>

        <div className="landing-panel-glass mx-auto mt-10 max-w-[760px] overflow-hidden rounded-[var(--radius-xl)] px-5 sm:px-6">
          {items.map((item, index) => {
            const expanded = open === index
            return (
              <div key={item.q} className="border-b border-[var(--border-subtle)]">
                <h3>
                  <button
                    type="button"
                    className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left text-base font-medium text-[var(--text-primary)] focus-visible:shadow-[var(--focus-ring)]"
                    aria-expanded={expanded}
                    onClick={() => setOpen(expanded ? -1 : index)}>
                    {item.q}
                    <ChevronDown
                      className={cn(
                        'h-[18px] w-[18px] shrink-0 text-[var(--text-muted)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-standard)]',
                        expanded && 'rotate-180',
                      )}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div hidden={!expanded} className="pb-5">
                  <p className="max-w-prose text-sm leading-relaxed text-[var(--text-secondary)]">{item.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </LandingContainer>
    </section>
  )
}
