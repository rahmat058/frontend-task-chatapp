import { LandingCta } from './LandingCta'
import { LandingFaq } from './LandingFaq'
import { LandingFeatures } from './LandingFeatures'
import { LandingFooter } from './LandingFooter'
import { LandingHero } from './LandingHero'
import { LandingHowItWorks } from './LandingHowItWorks'
import { MarketingNav } from './MarketingNav'

export function LandingPage() {
  return (
    <div className="landing-canvas min-h-screen text-[var(--text-primary)]">
      <div className="landing-mesh" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="relative z-10">
        <MarketingNav />
        <main>
          <LandingHero />
          <LandingFeatures />
          <LandingHowItWorks />
          <LandingFaq />
          <LandingCta />
        </main>
        <LandingFooter />
      </div>
    </div>
  )
}
