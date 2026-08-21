import { Lock, MessageSquare, RefreshCw, Shield, Users, Zap } from 'lucide-react'
import { LandingContainer } from './LandingContainer'
import { Reveal } from './Reveal'

const features = [
  {
    icon: MessageSquare,
    title: 'Direct messages',
    body: 'Search by name or phone and open a 1:1 thread. Names stay attached even when the API only returns ids.',
    tags: ['Search', '1:1', 'Identity'],
  },
  {
    icon: Users,
    title: 'Groups',
    body: 'Create a group, then rename, add, promote, remove, or leave — including Manage group for admins.',
    tags: ['Owner', 'Admin', 'Member'],
  },
  {
    icon: Zap,
    title: 'Real-time delivery',
    body: 'Messages land over Socket.io. If you are in another thread, the unread mark lights instead of stealing your scroll.',
    tags: ['Socket.io', 'Optimistic send'],
  },
  {
    icon: Lock,
    title: 'Phone sign-in',
    body: 'Enter a name and a Bangladesh number. A new number registers; a known number returns. No password.',
    tags: ['No password', 'Session'],
  },
  {
    icon: Shield,
    title: 'Unread, in place',
    body: 'Activity in other conversations stays as a badge. The thread you are reading does not jump.',
    tags: ['Badges', 'Focus'],
  },
  {
    icon: RefreshCw,
    title: 'Session restore',
    body: 'Reload or reconnect and pick up the same account, inbox, and delivery state without signing in again.',
    tags: ['Reconnect', 'Reload'],
  },
]

export function LandingFeatures() {
  return (
    <section id="features" className="scroll-mt-28">
      <LandingContainer className="py-16 md:py-24">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <h2 className="text-[30px] leading-[1.2] font-[620] tracking-[-0.02em] sm:text-[40px] sm:leading-[1.12] md:text-[48px]">
            Everything you need for a <span className="landing-text-gradient">quiet inbox</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
            Direct threads, groups, and live delivery — the same product you open after sign-in.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((item, index) => (
            <Reveal key={item.title} delay={index * 50}>
              <article className="landing-panel-glass landing-glass-hover h-full rounded-[var(--radius-xl)] p-6 md:p-8">
                <item.icon className="h-8 w-8 text-[var(--green-400)]" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{item.body}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[var(--green-soft)] px-3 py-1 text-xs font-medium text-[var(--green-400)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </LandingContainer>
    </section>
  )
}
