import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ScrollTrigger, prefersReducedMotion, scrollToId } from './motion'
import { Nav } from './sections/Chrome'
import Hero from './sections/Hero'
import Properties from './sections/Properties'
import PropertyDetail from './sections/PropertyDetail'
import About from './sections/About'
import Journey from './sections/Journey'
import Amenities from './sections/Amenities'
import Testimonials from './sections/Testimonials'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import { FINANCE_PARTNERS, STATS } from './data'
import './realestate.css'

function StatsBar() {
  return (
    <div className="re-stats">
      <div className="re-stats-inner">
        {STATS.map((s) => (
          <div key={s.label} className="re-stat">
            <div className="re-stat-value">{s.value}</div>
            <div className="re-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrustStrip() {
  return (
    <div className="re-trust-strip">
      <div className="re-trust-strip-inner">
        <span className="re-trust-badge">RERA Registered · All Projects</span>
        <span className="re-trust-divider" aria-hidden="true" />
        <span className="re-trust-label">Home loans facilitated with</span>
        <ul className="re-trust-partners">
          {FINANCE_PARTNERS.map((name) => <li key={name}>{name}</li>)}
        </ul>
      </div>
    </div>
  )
}

function CTABanner({ go }) {
  return (
    <div className="re-cta">
      <div className="re-cta-inner">
        <span className="re-eyebrow">Start Your Journey</span>
        <h2 className="re-display re-display-md">
          Ready to Find Your <span className="re-gradient-text">Dream Home</span>?
        </h2>
        <p className="re-body">
          Join 15,000+ happy families who trusted Prestige Horizon. Schedule a visit today and experience luxury living.
        </p>
        <div className="re-hero-actions">
          <button className="re-btn-primary" onClick={() => go('contact')}>
            <span>Schedule a Visit</span>
          </button>
          <button className="re-btn-outline" onClick={() => go('properties')}>
            View All Properties
          </button>
        </div>
      </div>
    </div>
  )
}

export default function RealEstatePrototype() {
  const [selectedProperty, setSelectedProperty] = useState(null)

  const go = useCallback((id) => scrollToId(id, prefersReducedMotion()), [])

  // Pinned sections change page height once media and fonts settle.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <div className="re">
      <Nav go={go} />
      <main>
        <Hero go={go} />
        <StatsBar />
        <TrustStrip />
        <Properties onSelect={setSelectedProperty} />
        <About go={go} />
        <Journey />
        <Amenities />
        <Testimonials />
        <CTABanner go={go} />
        <Contact />
      </main>
      <Footer />

      <AnimatePresence>
        {selectedProperty && (
          <PropertyDetail
            key="property-detail"
            id={selectedProperty}
            onClose={() => setSelectedProperty(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

