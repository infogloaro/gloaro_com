import { useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap, useMotion } from '../motion'
import { AMENITIES, AMENITY_PHOTOS, imageUrl } from '../data'

export default function Amenities() {
  const root = useRef(null)

  useMotion(root, () => {
    gsap.from('.re-amenities .re-section-header > *', {
      y: 40,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.re-amenities .re-section-header', start: 'top 80%' },
    })

    gsap.from('.re-amenity-card', {
      y: 50,
      opacity: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.re-amenities-grid', start: 'top 85%' },
    })

    gsap.from('.re-amenity-photo', {
      clipPath: 'inset(0 0 100% 0)',
      stagger: 0.1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.re-amenity-photos', start: 'top 85%' },
    })
  })

  return (
    <section id="amenities" ref={root} className="re-amenities">
      <div className="re-section-header">
        <span className="re-eyebrow">World-Class Living</span>
        <h2 className="re-display re-display-lg">Premium <span className="re-gradient-text">Amenities</span></h2>
        <p className="re-body">
          Every detail is designed to elevate your lifestyle. From wellness to entertainment, experience amenities that redefine modern living.
        </p>
      </div>

      <div className="re-amenity-photos">
        {AMENITY_PHOTOS.map((photo) => (
          <div className="re-amenity-photo-frame" key={photo.id}>
            <img className="re-amenity-photo" src={imageUrl(photo.id, 700)} alt={photo.caption} loading="lazy" />
            <span>{photo.caption}</span>
          </div>
        ))}
      </div>

      <div className="re-amenities-grid">
        {AMENITIES.map((amenity) => (
          <motion.div
            key={amenity.id}
            className="re-amenity-card"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <span className="re-amenity-icon">{amenity.icon}</span>
            <h3 className="re-amenity-title">{amenity.title}</h3>
            <p className="re-amenity-desc">{amenity.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
