import { useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap, useMotion } from '../motion'
import { imageUrl, PROPERTIES } from '../data'

export default function Properties({ onSelect }) {
  const root = useRef(null)

  useMotion(root, () => {
    // Section header reveal
    gsap.from('.re-properties .re-section-header > *', {
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.re-properties .re-section-header', start: 'top 80%' },
    })

    // Cards stagger reveal
    gsap.from('.re-property-card', {
      y: 60,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.re-properties-grid', start: 'top 85%' },
    })
  })

  return (
    <section id="properties" ref={root} className="re-properties">
      <div className="re-section-header">
        <span className="re-eyebrow">Our Portfolio</span>
        <h2 className="re-display re-display-lg">Featured <span className="re-gradient-text">Properties</span></h2>
        <p className="re-body">
          Handpicked luxury residences across India's most prestigious locations, designed for those who seek the extraordinary.
        </p>
      </div>

      <div className="re-properties-grid">
        {PROPERTIES.map((property) => (
          <motion.div
            key={property.id}
            className="re-property-card"
            onClick={() => onSelect(property.id)}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="re-property-card-image">
              <img className="re-property-card-visual" src={imageUrl(property.image, 900)} alt={`${property.name}, ${property.location}`} loading="lazy" />
              <div className="re-property-card-image-shade" />
              <span className="re-property-card-tag">{property.tag}</span>
              <span className="re-property-card-status">{property.status}</span>
            </div>
            <div className="re-property-card-body">
              <div className="re-property-card-type">{property.type}</div>
              <h3 className="re-property-card-name">{property.name}</h3>
              <div className="re-property-card-location">
                📍 {property.location}
              </div>
              <p className="re-property-card-desc">{property.description}</p>
              <div className="re-property-card-features">
                {property.features.map((f) => (
                  <span key={f} className="re-property-card-feature">{f}</span>
                ))}
              </div>
              <div className="re-property-card-footer">
                <span className="re-property-card-price">{property.price}</span>
                <div className="re-property-card-meta">
                  <span>🛏️ {property.beds}</span>
                  <span>📐 {property.sqft}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
