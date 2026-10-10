import { useRef } from 'react'
import { gsap, useMotion } from '../motion'
import { ABOUT_IMAGE, BRAND, imageUrl } from '../data'

export default function About({ go }) {
  const root = useRef(null)

  useMotion(root, () => {
    // Visual slide in
    gsap.from('.re-about-visual', {
      x: -80,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: root.current, start: 'top 75%' },
    })

    gsap.from('.re-about-visual-photo', {
      scale: 1.25,
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: { trigger: root.current, start: 'top 75%' },
    })

    // Content stagger
    gsap.from('.re-about-content > *', {
      y: 40,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.re-about-content', start: 'top 80%' },
    })

    // Highlights
    gsap.from('.re-about-highlight', {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.re-about-highlights', start: 'top 85%' },
    })
  })

  return (
    <section id="about" ref={root} className="re-about">
      <div className="re-about-grid">
        <div className="re-about-visual">
          <img className="re-about-visual-photo" src={imageUrl(ABOUT_IMAGE, 1100)} alt="Prestige Horizon headquarters building facade" loading="lazy" />
          <div className="re-about-visual-inner">
            <div className="re-about-visual-glow" />
          </div>
          <div className="re-about-visual-badge">
            <div className="re-about-visual-badge-value">25+</div>
            <div className="re-about-visual-badge-label">Years of Trust</div>
          </div>
        </div>

        <div className="re-about-content">
          <span className="re-eyebrow">Our Story</span>
          <h2 className="re-display re-display-lg">
            Crafting India's <span className="re-gradient-text">Finest Homes</span>
          </h2>
          <p className="re-body">
            Since {BRAND.founded}, {BRAND.name} has been at the forefront of India's real estate transformation.
            We don't just build structures — we craft living experiences that stand the test of time.
            Every project is a testament to our unwavering commitment to quality, innovation, and customer satisfaction.
          </p>

          <div className="re-about-highlights">
            <div className="re-about-highlight">
              <span className="re-about-highlight-icon">🏗️</span>
              <span className="re-about-highlight-text">RERA Registered & Compliant</span>
            </div>
            <div className="re-about-highlight">
              <span className="re-about-highlight-icon">🌿</span>
              <span className="re-about-highlight-text">IGBC Green Certified Projects</span>
            </div>
            <div className="re-about-highlight">
              <span className="re-about-highlight-icon">🏆</span>
              <span className="re-about-highlight-text">50+ Industry Awards</span>
            </div>
            <div className="re-about-highlight">
              <span className="re-about-highlight-icon">🤝</span>
              <span className="re-about-highlight-text">100% On-time Delivery</span>
            </div>
          </div>

          <button className="re-btn-outline" onClick={() => go('contact')}>
            Learn More About Us
          </button>
        </div>
      </div>
    </section>
  )
}
