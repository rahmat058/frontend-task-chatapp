import { LandingContainer } from './LandingContainer'
import { Reveal } from './Reveal'

const steps = [
  {
    title: 'Sign in with a phone number',
    body: 'Enter a name and a Bangladesh number. A new number registers; a known number returns. No password.',
  },
  {
    title: 'Find people',
    body: 'Search, open a direct thread, or start a group. The inbox is the list of conversations you already have.',
  },
  {
    title: 'Stay on the line',
    body: 'Send immediately, reconnect if the socket drops, and reload without losing the session.',
  },
]

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-[var(--border-subtle)] bg-[var(--surface-1)]">
      <LandingContainer className="py-20">
        <Reveal>
          <h2 className="max-w-[18ch] text-[30px] leading-[1.2] font-[620] tracking-[-0.02em]">
            Log in, find people, chat
          </h2>
        </Reveal>
        <ol className="relative mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          <span
            className="absolute top-3 right-[16%] left-[16%] hidden h-px bg-[var(--border-default)] md:block"
            aria-hidden="true"
          />
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 80}>
              <li className="relative">
                <span className="relative z-10 inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-[var(--green-border)] bg-[var(--surface-1)] px-2 text-xs font-medium text-[var(--green-400)] tabular-nums">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-base leading-[1.35] font-semibold">{step.title}</h3>
                <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--text-secondary)]">{step.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </LandingContainer>
    </section>
  )
}
