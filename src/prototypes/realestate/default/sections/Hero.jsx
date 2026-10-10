import { useRef } from 'react'
import { gsap, useMotion } from '../motion'
import { BRAND, HERO_IMAGE, imageUrl } from '../data'

const Split = ({ text }) => (
  <>
    {text.split('').map((ch, i) => (
      <span key={i} className={`re-c ${ch === ' ' ? 're-c-space' : ''}`}>{ch === ' ' ? '\u00A0' : ch}</span>
    ))}
  </>
)

export default function Hero({ go }) {
  const root = useRef(null)

  useMotion(root, () => {
    const tl = gsap.timeline({ delay: 0.3 })

    // Badge reveal
    tl.from('.re-hero-badge', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })

    // Title chars stagger
    tl.from('.re-hero-title .re-c', {
      yPercent: 120,
      rotateX: -60,
      opacity: 0,
      stagger: 0.025,
      duration: 1,
      ease: 'expo.out',
    }, 0.3)

    // Subtitle
    tl.from('.re-hero-subtitle', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, 0.8)

    // Buttons
    tl.from('.re-hero-actions > *', {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power3.out',
    }, 1)

    // Scroll indicator
    tl.from('.re-hero-scroll', {
      opacity: 0,
      y: 20,
      duration: 0.6,
    }, 1.4)

    // Parallax on scroll
    gsap.to('.re-hero-orb-1', {
      y: -100,
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1 },
    })
    gsap.to('.re-hero-orb-2', {
      y: 80,
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1 },
    })
    gsap.to('.re-hero-content', {
      y: 100,
      opacity: 0.3,
      scrollTrigger: { trigger: root.current, start: 'top top', end: '60% top', scrub: 1 },
    })
  })

  return (
    <section id="home" ref={root} className="re-hero">
      <div className="re-hero-bg">
        <img className="re-hero-photo" src={imageUrl(HERO_IMAGE, 1920)} alt="Luxury residential tower at golden hour" fetchPriority="high" />
        <div className="re-hero-visual">
          <div className="re-hero-orb re-hero-orb-1" />
          <div className="re-hero-orb re-hero-orb-2" />
          <div className="re-hero-orb re-hero-orb-3" />
          <div className="re-hero-grid" />
        </div>
      </div>

      <div className="re-hero-content">
        <div className="re-hero-badge">
          <span className="re-hero-badge-dot" />
          India's Most Trusted Builder Since {BRAND.founded}
        </div>

        <h1 className="re-hero-title re-display re-display-xl">
          <span className="re-hero-title-line">
            <Split text="Building" />
          </span>
          <span className="re-hero-title-line re-gradient-text">
            <Split text="Dreams" />
          </span>
          <span className="re-hero-title-line">
            <Split text="Crafting Futures" />
          </span>
        </h1>

        <p className="re-hero-subtitle">
          Discover luxury residences across India's most coveted addresses. From sea-facing apartments in Mumbai to eco-villas in Bangalore.
        </p>

        <div className="re-hero-actions">
          <button className="re-btn-primary" onClick={() => go('properties')}>
            <span>Explore Properties</span>
          </button>
          <button className="re-btn-outline" onClick={() => go('contact')}>
            Schedule a Visit
          </button>
        </div>
      </div>

      <div className="re-hero-scroll">
        <span>Scroll</span>
        <div className="re-hero-scroll-line" />
      </div>
    </section>
  )
}
