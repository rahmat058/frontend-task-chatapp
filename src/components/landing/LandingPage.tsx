import { LandingCta } from './LandingCta'
import { LandingFeatures } from './LandingFeatures'
import { LandingFooter } from './LandingFooter'
import { LandingHero } from './LandingHero'
import { LandingHowItWorks } from './LandingHowItWorks'
import { MarketingNav } from './MarketingNav'

export function LandingPage() {
  return (
    <div className="login-canvas min-h-screen text-[var(--text-primary)]">
      <MarketingNav />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  )
}
