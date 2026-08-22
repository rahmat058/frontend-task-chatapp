'use client'

import Link from 'next/link'
import { useEffect, useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
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

const ease = [0.2, 0.8, 0.2, 1] as const

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return reduced
}

export function LandingFaq() {
  const [open, setOpen] = useState(0)
  const reduce = usePrefersReducedMotion()
  const baseId = useId()

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

        <div className="landing-panel-glass mx-auto mt-10 max-w-[760px] overflow-hidden rounded-[var(--radius-xl)]">
          {items.map((item, index) => {
            const expanded = open === index
            const panelId = `${baseId}-panel-${index}`
            const headerId = `${baseId}-header-${index}`

            return (
              <div key={item.q} className="border-b border-[var(--border-subtle)] last:border-b-0">
                <h3>
                  <button
                    type="button"
                    id={headerId}
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    className="group flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:shadow-[var(--focus-ring)] sm:px-6"
                    onClick={() => setOpen(expanded ? -1 : index)}>
                    <span
                      className={cn(
                        'text-base font-medium transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
                        expanded
                          ? 'text-[var(--text-primary)]'
                          : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]',
                      )}>
                      {item.q}
                    </span>
                    <motion.span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                        expanded
                          ? 'border-[var(--green-border)] bg-[var(--green-soft)] text-[var(--green-400)]'
                          : 'border-[var(--border-subtle)] bg-[var(--surface-2)] text-[var(--text-muted)] group-hover:border-[var(--border-default)] group-hover:text-[var(--text-secondary)]',
                      )}
                      animate={reduce ? undefined : { rotate: expanded ? 180 : 0 }}
                      transition={{ duration: 0.22, ease }}
                      aria-hidden="true">
                      <ChevronDown className="h-[16px] w-[16px]" strokeWidth={1.75} />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={headerId}
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.28, ease }}
                      className="overflow-hidden">
                      <p className="max-w-prose px-5 pb-5 text-sm leading-relaxed text-[var(--text-secondary)] sm:px-6">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </LandingContainer>
    </section>
  )
}
