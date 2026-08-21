import { ChevronDown } from 'lucide-react'
import { LandingContainer } from './LandingContainer'
import { Reveal } from './Reveal'

const steps = [
  {
    title: 'Sign in with a phone number',
    body: 'Enter a name and a Bangladesh number. A new number registers; a known number returns.',
    hint: 'No password.',
  },
  {
    title: 'Find people',
    body: 'Search, open a direct thread, or start a group. The inbox is the list of conversations you already have.',
    hint: 'Names stay attached to ids.',
  },
  {
    title: 'Stay on the line',
    body: 'Send immediately, reconnect if the socket drops, and reload without losing the session.',
    hint: 'Unread waits in other threads.',
  },
]

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-28">
      <LandingContainer className="max-w-3xl py-16 md:py-24">
        <Reveal className="mb-10 text-center">
          <h2 className="text-[30px] leading-[1.2] font-[620] tracking-[-0.02em] sm:text-[40px] md:text-[48px]">
            How it <span className="landing-text-gradient">works</span>
          </h2>
          <p className="mt-3 text-base text-[var(--text-secondary)]">From phone number to a live thread in three steps.</p>
        </Reveal>

        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 60}>
                <article className="landing-panel-glass rounded-[var(--radius-xl)] p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--green-600)] text-xs font-semibold text-[var(--text-primary)] tabular-nums">
                      {index + 1}
                    </span>
                    <h3 className="text-base font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{step.body}</p>
                  <p className="mt-2 text-xs text-[var(--green-400)]">{step.hint}</p>
                </article>
              </Reveal>
              {index < steps.length - 1 && (
                <div className="flex justify-center py-1" aria-hidden="true">
                  <ChevronDown className="h-5 w-5 text-[var(--green-600)] opacity-50" strokeWidth={2} />
                </div>
              )}
            </li>
          ))}
        </ol>
      </LandingContainer>
    </section>
  )
}
