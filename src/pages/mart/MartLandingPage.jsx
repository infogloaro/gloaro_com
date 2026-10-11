import { MotionConfig } from 'framer-motion'
import '../../components/mart/mart.css'
import MartNavbar from '../../components/mart/MartNavbar'
import BackButton from '../../components/common/BackButton'
import MartHero from '../../components/mart/MartHero'
import MartProductShowcase from '../../components/mart/MartProductShowcase'
import MartCustomerFeatures from '../../components/mart/MartCustomerFeatures'
import MartNearbySection from '../../components/mart/MartNearbySection'
import MartSmartSearch from '../../components/mart/MartSmartSearch'
import MartWebMobile from '../../components/mart/MartWebMobile'
import MartHowItWorks from '../../components/mart/MartHowItWorks'
import MartForCustomers from '../../components/mart/MartForCustomers'
import MartBusinessSection from '../../components/mart/MartBusinessSection'
import MartB2BSection from '../../components/mart/MartB2BSection'
import MartTrustSection from '../../components/mart/MartTrustSection'
import MartEcosystem from '../../components/mart/MartEcosystem'
import MartAppSection from '../../components/mart/MartAppSection'
import MartCTA from '../../components/mart/MartCTA'
import MartFooter from '../../components/mart/MartFooter'

// GLOARO MART product showcase. Presentation only — the live marketplace lives at /products.
export default function MartLandingPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="mart-root min-h-screen">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[#0b2451] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white">
          Skip to content
        </a>
        <MartNavbar />
        <BackButton />
        <main id="main">
          <MartHero />
          <MartProductShowcase />
          <MartCustomerFeatures />
          <MartNearbySection />
          <MartSmartSearch />
          <MartWebMobile />
          <MartHowItWorks />
          <MartForCustomers />
          <MartBusinessSection />
          <MartB2BSection />
          <MartTrustSection />
          <MartEcosystem />
          <MartAppSection />
          <MartCTA />
        </main>
        <MartFooter />
      </div>
    </MotionConfig>
  )
}
