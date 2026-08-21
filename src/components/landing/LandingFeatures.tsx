import { MessageSquare, Users, Zap } from 'lucide-react'
import { LandingContainer } from './LandingContainer'
import { Reveal } from './Reveal'

const capabilities = [
  {
    icon: MessageSquare,
    title: 'Direct messages',
    body: 'Search by name or phone and open a 1:1 thread. Names stay attached even when the API only returns ids.',
  },
  {
    icon: Users,
    title: 'Groups',
    body: 'Create a group, then rename, add, promote, remove, or leave — including Manage group for admins.',
  },
  {
    icon: Zap,
    title: 'Real-time delivery',
    body: 'Messages land over Socket.io. If you are in another thread, the unread mark lights instead of stealing your scroll.',
  },
]

export function LandingFeatures() {
  return (
    <section id="features" className="scroll-mt-24 border-t border-[var(--border-subtle)]">
      <LandingContainer className="py-20">
        <h2 className="sr-only">What ChatApp does</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {capabilities.map((item, index) => (
            <Reveal key={item.title} delay={index * 70}>
              <article className="h-full rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-1)] p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--green-border)] bg-[var(--bg-canvas)] text-[var(--green-400)]">
                  <item.icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-[22px] leading-[1.3] font-semibold">{item.title}</h3>
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-[var(--text-secondary)]">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </LandingContainer>
    </section>
  )
}
