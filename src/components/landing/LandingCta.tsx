import Link from 'next/link'
import { LandingContainer } from './LandingContainer'
import { Reveal } from './Reveal'
import { buttonClassName } from '@/components/common/buttonStyles'

export function LandingCta() {
  return (
    <section className="border-t border-[var(--border-subtle)]">
      <LandingContainer className="py-16 md:py-20">
        <Reveal>
          <div className="flex flex-col gap-6 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-1)] px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-10">
            <div>
              <h2 className="text-[30px] leading-[1.2] font-[620] tracking-[-0.02em]">Ready to start a thread?</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                Sign in with your phone and name. No password.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/login" className={buttonClassName({ size: 'lg' })}>
                Open ChatApp
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--green-400)] hover:text-[var(--green-300)]">
                See how it works →
              </a>
            </div>
          </div>
        </Reveal>
      </LandingContainer>
    </section>
  )
}
