import { useRef } from 'react'
import { gsap, useMotion } from '../motion'
import { JOURNEY } from '../data'

export default function Journey() {
  const root = useRef(null)

  useMotion(root, () => {
    // Header
    gsap.from('.re-journey .re-section-header > *', {
      y: 40,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.re-journey .re-section-header', start: 'top 80%' },
    })

    // Timeline line grow
    gsap.from('.re-journey-line::before', {
      scaleY: 0,
      transformOrigin: 'top',
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.re-journey-line', start: 'top 80%' },
    })

    // Items stagger
    gsap.from('.re-journey-item', {
      x: -40,
      opacity: 0,
      stagger: 0.15,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.re-journey-line', start: 'top 80%' },
    })
  })

  return (
    <section ref={root} className="re-journey">
      <div className="re-section-header">
        <span className="re-eyebrow">Our Journey</span>
        <h2 className="re-display re-display-lg">A Legacy of <span className="re-gradient-text">Excellence</span></h2>
        <p className="re-body">
          From our humble beginnings to becoming one of India's most trusted builders — every milestone tells a story.
        </p>
      </div>

      <div className="re-journey-line">
        {JOURNEY.map((item) => (
          <div key={item.year} className="re-journey-item">
            <span className="re-journey-year">{item.year}</span>
            <h3 className="re-journey-title">{item.title}</h3>
            <p className="re-journey-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
