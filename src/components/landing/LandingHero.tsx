import Link from 'next/link'
import { Lock, Play, Shield, Zap } from 'lucide-react'
import { HeroPreview } from './HeroPreview'
import { LandingContainer } from './LandingContainer'
import { Reveal } from './Reveal'
import { buttonClassName } from '@/components/common/buttonStyles'
import { cn } from '@/lib/utils/cn'

const trust = [
  { icon: Lock, label: 'Phone sign-in' },
  { icon: Zap, label: 'Real-time delivery' },
  { icon: Shield, label: 'Session restore' },
]

export function LandingHero() {
  return (
    <section id="offer" className="scroll-mt-24 pt-16 pb-20 md:pt-24 md:pb-28">
      <LandingContainer>
        <div className="grid items-center gap-14 lg:grid-cols-[42%_1fr] lg:gap-16">
          <Reveal>
            <h1 className="text-[40px] leading-[1.08] font-[650] tracking-[-0.03em] sm:text-[56px] sm:leading-[1.06]">
              Conversation,
              <br />
              without the noise.
            </h1>
            <p className="mt-5 max-w-[38ch] text-base leading-relaxed text-[var(--text-secondary)] sm:text-[18px] sm:leading-[1.55]">
              Private messages and groups that stay in sync — instantly.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/login" className={buttonClassName({ size: 'lg' })}>
                Open ChatApp
              </Link>
              <a href="#how-it-works" className={cn(buttonClassName({ variant: 'secondary', size: 'lg' }), 'gap-2')}>
                <Play className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                See how it works
              </a>
            </div>
            <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3">
              {trust.map((item) => (
                <li key={item.label} className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] border border-[var(--green-border)] bg-[var(--surface-1)] text-[var(--green-400)]">
                    <item.icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={80}>
            <HeroPreview />
          </Reveal>
        </div>
      </LandingContainer>
    </section>
  )
}
