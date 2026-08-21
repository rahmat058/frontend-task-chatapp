import Link from 'next/link'
import { Check } from 'lucide-react'
import { LandingContainer } from './LandingContainer'
import { Reveal } from './Reveal'
import { buttonClassName } from '@/components/common/buttonStyles'
import { cn } from '@/lib/utils/cn'

export function LandingCta() {
  return (
    <section className="relative overflow-hidden">
      <div className="landing-aurora pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div
        className="landing-orb pointer-events-none absolute top-0 left-1/4 h-96 w-96 bg-[rgb(7_148_85_/_20%)]"
        aria-hidden="true"
      />
      <div
        className="landing-orb landing-orb-delay pointer-events-none absolute right-1/4 bottom-0 h-80 w-80 bg-[rgb(245_185_66_/_16%)]"
        aria-hidden="true"
      />
      <LandingContainer className="relative py-20 md:py-28">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-[30px] leading-[1.2] font-[620] tracking-[-0.02em] sm:text-[40px] sm:leading-[1.12]">
            Ready to start a <span className="landing-text-gradient">thread?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[var(--text-secondary)]">
            Sign in with your phone and name. No password.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/login" className={cn(buttonClassName({ size: 'lg' }), 'landing-btn-primary px-8')}>
              Open ChatApp
            </Link>
            <a
              href="#features"
              className={cn(
                buttonClassName({ variant: 'secondary', size: 'lg' }),
                'landing-panel-glass border-white/10 bg-transparent px-8',
              )}>
              Learn more
            </a>
          </div>
          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[var(--text-muted)]">
            {['Phone sign-in', 'Real-time delivery', 'Session restore'].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[var(--green-400)]" strokeWidth={1.75} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </LandingContainer>
    </section>
  )
}
