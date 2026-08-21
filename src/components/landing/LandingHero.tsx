import Link from 'next/link'
import { HeroPreview } from './HeroPreview'
import { LandingContainer } from './LandingContainer'
import { Reveal } from './Reveal'
import { buttonClassName } from '@/components/common/buttonStyles'
import { cn } from '@/lib/utils/cn'

export function LandingHero() {
  return (
    <section
      id="offer"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16">
      <div className="landing-aurora pointer-events-none absolute inset-0 opacity-90" aria-hidden="true" />
      <div
        className="landing-orb pointer-events-none absolute top-1/4 left-1/4 h-64 w-64 bg-[rgb(7_148_85_/_30%)] sm:h-96 sm:w-96"
        aria-hidden="true"
      />
      <div
        className="landing-orb landing-orb-delay pointer-events-none absolute right-1/4 bottom-1/4 h-52 w-52 bg-[rgb(245_185_66_/_20%)] sm:h-80 sm:w-80"
        aria-hidden="true"
      />

      <LandingContainer className="relative z-10 text-center">
        <Reveal>
          <h1 className="text-balance text-[40px] leading-[1.08] font-[650] tracking-[-0.03em] sm:text-[56px] sm:leading-[1.06] lg:text-[64px]">
            <span className="landing-text-gradient">Conversation,</span>
            <br />
            <span className="text-[32px] sm:text-[44px] lg:text-[52px]">without the noise.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl px-4 text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            Private messages and groups that stay in sync — instantly.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/login" className={cn(buttonClassName({ size: 'lg' }), 'landing-btn-primary px-8')}>
              Open ChatApp
            </Link>
            <a
              href="#how-it-works"
              className={cn(
                buttonClassName({ variant: 'secondary', size: 'lg' }),
                'landing-panel-glass border-white/10 bg-transparent px-8',
              )}>
              How it works
            </a>
          </div>
        </Reveal>

        <Reveal delay={80} className="landing-hero-stage relative mt-12 md:mt-16">
          <HeroPreview />
        </Reveal>
      </LandingContainer>
    </section>
  )
}
