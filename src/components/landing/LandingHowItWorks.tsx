'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { ArrowRight, Check, Phone, Search, Wifi } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { LandingContainer } from './LandingContainer'
import { Reveal } from './Reveal'
import { cn } from '@/lib/utils/cn'

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

function SignInMock() {
  return (
    <div className="mx-auto w-full max-w-[320px] space-y-4">
      <div>
        <p className="text-xs font-medium text-[var(--text-muted)]">Name</p>
        <div className="mt-2 flex h-11 items-center rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-2)] px-3 text-sm text-[var(--text-primary)]">
          Nusrat Jahan
        </div>
      </div>
      <div>
        <p className="text-xs font-medium text-[var(--text-muted)]">Phone number</p>
        <div className="mt-2 flex h-11 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--green-400)] bg-[var(--surface-2)] px-3 text-sm shadow-[var(--focus-ring)]">
          <span className="text-[var(--text-muted)]">+880</span>
          <span className="text-[var(--text-primary)] tabular-nums">1712 345678</span>
          <span className="ml-auto h-4 w-px bg-[var(--green-400)]" />
        </div>
      </div>
      <div className="flex h-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--green-600)] text-sm font-medium text-[var(--text-primary)]">
        Continue
      </div>
      <p className="text-center text-xs text-[var(--text-muted)]">No password. No email.</p>
    </div>
  )
}

function SearchMock() {
  const results = [
    { name: 'Nusrat Jahan', meta: '+880 1712 345678', initials: 'NJ' },
    { name: 'Kamal Hossain', meta: '+880 1911 220044', initials: 'KH' },
  ]

  return (
    <div className="mx-auto w-full max-w-[360px]">
      <div className="flex h-11 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-2)] px-3">
        <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)]" strokeWidth={1.75} />
        <span className="text-sm text-[var(--text-primary)]">nus</span>
      </div>
      <ul className="mt-3 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-canvas)]">
        {results.map((row, index) => (
          <li
            key={row.name}
            className={cn(
              'flex items-center gap-3 px-3 py-3',
              index === 0 ? 'bg-[var(--surface-3)]' : 'border-t border-[var(--border-subtle)]',
            )}>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-2)] text-xs font-semibold text-[var(--text-primary)]">
              {row.initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-[var(--text-primary)]">{row.name}</span>
              <span className="block text-xs text-[var(--text-muted)] tabular-nums">{row.meta}</span>
            </span>
            {index === 0 && (
              <span className="ml-auto rounded-full bg-[var(--green-soft)] px-2 py-1 text-[11px] font-medium text-[var(--green-400)]">
                Open
              </span>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-center text-xs text-[var(--text-muted)]">Or start a group from the same search.</p>
    </div>
  )
}

function ThreadMock() {
  return (
    <div className="mx-auto w-full max-w-[360px] space-y-3">
      <div className="flex flex-col items-start">
        <span className="mb-1 px-1 text-xs font-medium text-[var(--text-secondary)]">Kamal</span>
        <p className="w-fit max-w-[80%] rounded-[10px] rounded-tl-md border border-[var(--border-subtle)] bg-[var(--color-bubble-received)] px-3 py-2.5 text-sm leading-relaxed text-[var(--text-primary)]">
          Are we still shipping tonight?
        </p>
        <span className="mt-1 px-1 text-xs text-[var(--text-muted)] tabular-nums">9:41 PM</span>
      </div>

      <div className="flex flex-col items-end">
        <p className="w-fit max-w-[80%] rounded-[10px] rounded-tr-md border border-[#22513d] bg-[var(--color-bubble-sent)] px-3 py-2.5 text-sm leading-relaxed text-[var(--color-bubble-sent-text)]">
          Yes — pushing the last change now.
        </p>
        <span className="mt-1 flex items-center gap-1 px-1 text-xs text-[var(--text-muted)] tabular-nums">
          9:42 PM
          <Check className="h-3 w-3" strokeWidth={2} />
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-2.5">
        <span className="truncate text-xs text-[var(--text-secondary)]">Design crew</span>
        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[var(--green-600)] px-1.5 text-[11px] font-medium text-[var(--text-inverse)] tabular-nums">
          3
        </span>
      </div>
      <p className="text-center text-xs text-[var(--text-muted)]">Another thread got busy. Your scroll stayed here.</p>
    </div>
  )
}

const steps = [
  {
    icon: Phone,
    label: 'Sign in',
    title: 'Sign in with a phone number',
    body: 'Enter a name and a Bangladesh number. A new number registers; a known number returns.',
    Mock: SignInMock,
  },
  {
    icon: Search,
    label: 'Find people',
    title: 'Search, then open a thread',
    body: 'Find someone by name or phone and open a direct conversation, or start a group from the same place.',
    Mock: SearchMock,
  },
  {
    icon: Wifi,
    label: 'Stay on the line',
    title: 'Send, reconnect, reload',
    body: 'Messages deliver over Socket.io. Unread activity waits as a badge in other threads instead of moving your scroll.',
    Mock: ThreadMock,
  },
]

export function LandingHowItWorks() {
  const [active, setActive] = useState(0)
  const reduce = usePrefersReducedMotion()
  const baseId = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const select = (index: number, focus = false) => {
    const next = (index + steps.length) % steps.length
    setActive(next)
    if (focus) tabRefs.current[next]?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const keys: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowRight: index + 1,
      ArrowUp: index - 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: steps.length - 1,
    }
    const next = keys[event.key]
    if (next === undefined) return
    event.preventDefault()
    select(next, true)
  }

  const step = steps[active]

  return (
    <section id="how-it-works" className="scroll-mt-28">
      <LandingContainer className="py-16 md:py-24">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <h2 className="text-[30px] leading-[1.2] font-[620] tracking-[-0.02em] sm:text-[40px] md:text-[48px]">
            How it <span className="landing-text-gradient">works</span>
          </h2>
          <p className="mt-3 text-base text-[var(--text-secondary)]">
            From a phone number to a live thread in three steps. Pick a step to see it.
          </p>
        </Reveal>

        <Reveal delay={60}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-8">
            <div role="tablist" aria-label="How ChatApp works" className="flex flex-col gap-2">
              {steps.map((item, index) => {
                const selected = active === index
                return (
                  <button
                    key={item.title}
                    ref={(node) => {
                      tabRefs.current[index] = node
                    }}
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${index}`}
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel-${index}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => select(index)}
                    onKeyDown={(event) => onKeyDown(event, index)}
                    className={cn(
                      'group relative flex items-center gap-4 rounded-[var(--radius-lg)] border p-4 text-left transition-colors duration-[var(--duration-base)] ease-[var(--ease-standard)] focus-visible:shadow-[var(--focus-ring)]',
                      selected
                        ? 'border-[var(--green-border)] bg-[var(--surface-2)]'
                        : 'border-[var(--border-subtle)] bg-transparent hover:border-[var(--border-default)] hover:bg-[var(--surface-1)]',
                    )}>
                    {selected && !reduce && (
                      <motion.span
                        layoutId={`${baseId}-indicator`}
                        className="absolute inset-y-3 left-0 w-[2px] rounded-full bg-[var(--green-500)]"
                        transition={{ duration: 0.28, ease }}
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] border transition-colors duration-[var(--duration-base)] ease-[var(--ease-standard)]',
                        selected
                          ? 'border-[var(--green-border)] bg-[var(--green-soft)] text-[var(--green-400)]'
                          : 'border-[var(--border-subtle)] bg-[var(--surface-2)] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]',
                      )}>
                      <item.icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-medium text-[var(--text-muted)] tabular-nums">
                        Step {index + 1} of {steps.length}
                      </span>
                      <span
                        className={cn(
                          'mt-0.5 block text-sm font-semibold',
                          selected ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]',
                        )}>
                        {item.label}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>

            <div
              role="tabpanel"
              id={`${baseId}-panel-${active}`}
              aria-labelledby={`${baseId}-tab-${active}`}
              tabIndex={0}
              className="landing-panel-glass rounded-[var(--radius-xl)] p-6 focus-visible:shadow-[var(--focus-ring)] md:p-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: reduce ? 0 : 0.26, ease }}
                  className="flex h-full flex-col">
                  <div className="lg:min-h-[6.5rem]">
                    <h3 className="text-xl font-semibold text-[var(--text-primary)]">{step.title}</h3>
                    <p className="mt-2 max-w-[54ch] text-sm leading-relaxed text-[var(--text-secondary)]">
                      {step.body}
                    </p>
                  </div>

                  <div
                    className="mt-6 flex min-h-[17rem] items-center rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-1)] p-5 md:p-6"
                    aria-hidden="true">
                    <div className="w-full">
                      <step.Mock />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-5">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  {steps.map((item, index) => (
                    <span
                      key={item.title}
                      className={cn(
                        'h-1.5 rounded-full transition-all duration-[var(--duration-base)] ease-[var(--ease-standard)]',
                        active === index ? 'w-6 bg-[var(--green-500)]' : 'w-1.5 bg-[var(--surface-3)]',
                      )}
                    />
                  ))}
                </div>

                {active < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => select(active + 1)}
                    className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--green-400)] hover:text-[var(--green-300)] focus-visible:shadow-[var(--focus-ring)]">
                    Next: {steps[active + 1].label}
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--green-400)] hover:text-[var(--green-300)] focus-visible:shadow-[var(--focus-ring)]">
                    Open ChatApp
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </LandingContainer>
    </section>
  )
}
