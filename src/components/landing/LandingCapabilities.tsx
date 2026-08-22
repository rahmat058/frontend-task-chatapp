import { Lock, MessageSquare, RefreshCw, Shield, Users, Zap } from 'lucide-react'
import { LandingContainer } from './LandingContainer'
import { Reveal } from './Reveal'

const capabilities = [
  {
    icon: MessageSquare,
    title: 'Direct threads',
    body: 'Search by name or phone and open a 1:1 conversation.',
  },
  {
    icon: Users,
    title: 'Groups with roles',
    body: 'Create, rename, add, promote, remove, or leave.',
  },
  {
    icon: Zap,
    title: 'Live delivery',
    body: 'Messages land over Socket.io while you stay in the thread.',
  },
  {
    icon: Lock,
    title: 'Phone sign-in',
    body: 'Name and a Bangladesh number. No password.',
  },
  {
    icon: Shield,
    title: 'Unread stays put',
    body: 'Other threads light a badge instead of stealing your scroll.',
  },
  {
    icon: RefreshCw,
    title: 'Session restore',
    body: 'Reload or reconnect without signing in again.',
  },
]

export function LandingCapabilities() {
  return (
    <section id="capabilities" className="scroll-mt-28">
      <LandingContainer className="py-12 md:py-16">
        <Reveal>
          <h2 className="text-center text-[30px] leading-[1.2] font-[620] tracking-[-0.02em] sm:text-[40px] md:text-[48px]">
            Built into the product, not the pitch
          </h2>
          <p className="mx-auto mt-3 max-w-[42ch] text-center text-sm leading-relaxed text-[var(--text-secondary)]">
            The same behaviors you get after you open ChatApp.
          </p>
        </Reveal>

        <Reveal delay={60}>
          <ul className="landing-panel-glass mt-8 grid overflow-hidden rounded-[var(--radius-xl)] sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => (
              <li
                key={item.title}
                className="flex gap-3 border-[var(--border-subtle)] p-5 not-last:border-b sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(n+4)]:border-b-0 sm:[&:nth-child(n+5)]:border-b-0">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--green-border)] bg-[var(--green-soft)] text-[var(--green-400)]">
                  <item.icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </LandingContainer>
    </section>
  )
}
