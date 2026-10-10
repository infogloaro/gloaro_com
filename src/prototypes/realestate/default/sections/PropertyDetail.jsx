import { motion } from 'framer-motion'
import { findProperty, imageUrl, PROPERTY_GALLERY_PREVIEW } from '../data'

export default function PropertyDetail({ id, onClose }) {
  const property = findProperty(id)
  if (!property) return null

  return (
    <motion.div
      className="re-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="re-modal"
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="re-modal-close" onClick={onClose}>✕</button>

        <div className="re-modal-hero">
          <img className="re-modal-hero-photo" src={imageUrl(property.image, 1200)} alt={`${property.name}, ${property.location}`} />
          <div className="re-modal-hero-overlay">
            <span className="re-property-card-tag">{property.tag}</span>
          </div>
        </div>

        <div className="re-modal-gallery">
          {PROPERTY_GALLERY_PREVIEW.map((photoId) => (
            <img key={photoId} src={imageUrl(photoId, 500)} alt={`${property.name} interior preview`} loading="lazy" />
          ))}
        </div>

        <div className="re-modal-body">
          <span className="re-eyebrow">{property.type}</span>
          <h2>{property.name}</h2>
          <div className="re-modal-location">📍 {property.location}</div>
          <div className="re-modal-price">{property.price}</div>
          <p className="re-modal-desc">{property.description}</p>

          <div className="re-modal-highlight">
            <span className="re-modal-highlight-icon">✨</span>
            {property.highlight}
          </div>

          <div className="re-modal-specs">
            <div className="re-modal-spec">
              <div className="re-modal-spec-value">{property.beds}</div>
              <div className="re-modal-spec-label">Configuration</div>
            </div>
            <div className="re-modal-spec">
              <div className="re-modal-spec-value">{property.sqft}</div>
              <div className="re-modal-spec-label">Area</div>
            </div>
            <div className="re-modal-spec">
              <div className="re-modal-spec-value">{property.status}</div>
              <div className="re-modal-spec-label">Status</div>
            </div>
          </div>

          <div className="re-modal-features">
            {property.features.map((f) => (
              <span key={f} className="re-property-card-feature">{f}</span>
            ))}
          </div>

          <div className="re-modal-actions">
            <button className="re-btn-primary"><span>Schedule Site Visit</span></button>
            <button className="re-btn-outline">Download Brochure</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
