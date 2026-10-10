import { useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap, useMotion } from '../motion'
import { TESTIMONIALS } from '../data'

export default function Testimonials() {
  const root = useRef(null)

  useMotion(root, () => {
    gsap.from('.re-testimonials .re-section-header > *', {
      y: 40,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.re-testimonials .re-section-header', start: 'top 80%' },
    })

    gsap.from('.re-testimonial-card', {
      y: 50,
      opacity: 0,
      stagger: 0.12,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.re-testimonials-track', start: 'top 85%' },
    })
  })

  return (
    <section id="testimonials" ref={root} className="re-testimonials">
      <div className="re-section-header">
        <span className="re-eyebrow">Happy Homeowners</span>
        <h2 className="re-display re-display-lg">What Our <span className="re-gradient-text">Families</span> Say</h2>
        <p className="re-body">
          Real stories from real families who chose Prestige Horizon for their dream homes.
        </p>
      </div>

      <div className="re-testimonials-track">
        {TESTIMONIALS.map((t) => (
          <motion.div
            key={t.id}
            className="re-testimonial-card"
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <span className="re-testimonial-quote">"</span>
            <div className="re-testimonial-stars">
              {Array.from({ length: t.rating }, (_, i) => <span key={i}>★</span>)}
            </div>
            <p className="re-testimonial-text">"{t.text}"</p>
            <div className="re-testimonial-author">
              <div className="re-testimonial-avatar">
                {t.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
              </div>
              <div>
                <div className="re-testimonial-name">{t.name}</div>
                <div className="re-testimonial-role">{t.role} · {t.location}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
