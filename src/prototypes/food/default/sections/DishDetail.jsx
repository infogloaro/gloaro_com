import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { MENU, CATEGORIES, inr } from '../data'

const ease = [0.76, 0, 0.24, 1]
const charIn = {
  hidden: { y: '110%', rotate: 8 },
  show: (i) => ({ y: '0%', rotate: 0, transition: { delay: 0.45 + i * 0.022, duration: 0.9, ease: [0.16, 1, 0.3, 1] } }),
}

/** Full-screen dish page that irises open from the exact point the visitor clicked. */
export default function DishDetail({ id, origin, onClose, onNavigate, inList, onToggleList, onReserve }) {
  const index = MENU.findIndex((m) => m.id === id)
  const dish = MENU[index]
  const prev = MENU[(index - 1 + MENU.length) % MENU.length]
  const next = MENU[(index + 1) % MENU.length]
  const at = `${origin.x}px ${origin.y}px`

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate(next.id)
      if (e.key === 'ArrowLeft') onNavigate(prev.id)
    }
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [onClose, onNavigate, next.id, prev.id])

  const cat = CATEGORIES.find((c) => c.id === dish.cat)

  return (
    <motion.div
      className="me-detail"
      role="dialog"
      aria-modal="true"
      aria-label={dish.name}
      initial={{ clipPath: `circle(0px at ${at})` }}
      animate={{ clipPath: `circle(150% at ${at})` }}
      exit={{ clipPath: `circle(0px at ${at})` }}
      transition={{ duration: 0.9, ease }}
    >
      <div className="me-detail-bar">
        <button className="me-link-btn" onClick={onClose}><i>←</i> Back</button>
        <span className="me-eyebrow">{cat.label} · {String(index + 1).padStart(2, '0')} / {MENU.length}</span>
        <div className="me-detail-pager">
          <button onClick={() => onNavigate(prev.id)} aria-label={`Previous: ${prev.name}`}>←</button>
          <button onClick={() => onNavigate(next.id)} aria-label={`Next: ${next.name}`}>→</button>
        </div>
      </div>

      <motion.div key={dish.id} className="me-detail-body" initial="hidden" animate="show">
        <div className="me-detail-media">
          {dish.img ? (
            <motion.img
              src={dish.img}
              alt={dish.name}
              initial={{ scale: 1.25, clipPath: 'inset(0 0 100% 0)' }}
              animate={{ scale: 1, clipPath: 'inset(0 0 0% 0)' }}
              transition={{ duration: 1.3, ease, delay: 0.2 }}
            />
          ) : (
            <div className="me-detail-type" aria-hidden="true">
              {dish.plate.map((p, i) => (
                <motion.span
                  key={p}
                  initial={{ opacity: 0, x: i % 2 ? 80 : -80 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  {p}
                </motion.span>
              ))}
            </div>
          )}
        </div>

        <div className="me-detail-copy">
          <h2 className="me-detail-name" aria-label={dish.name}>
            {[...dish.name].map((c, i) => (
              <span key={i} className="me-mask" aria-hidden="true">
                <motion.span custom={i} variants={charIn}>{c === ' ' ? ' ' : c}</motion.span>
              </span>
            ))}
          </h2>
          <motion.div
            className="me-detail-info"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="me-detail-desc">{dish.desc}</p>
            <dl>
              <div><dt>On the plate</dt><dd>{dish.plate.join(' · ')}</dd></div>
              <div><dt>We&apos;d pour</dt><dd>{dish.pairing}</dd></div>
              <div><dt>Allergens</dt><dd>{dish.allergens}</dd></div>
              <div><dt>Notes</dt><dd>{[dish.veg && 'Vegetarian', dish.spicy && 'Spicy'].filter(Boolean).join(' · ') || '—'}</dd></div>
            </dl>
            <div className="me-detail-actions">
              <span className="me-price big">{inr(dish.price)}</span>
              <button className={`me-pill dark ${inList ? 'on' : ''}`} onClick={() => onToggleList(dish.id)} aria-pressed={inList}>
                {inList ? 'On your table ✓' : 'Add to your table'}
              </button>
              <button className="me-link-btn" onClick={() => onReserve(dish.id)}>Reserve with this dish <i>→</i></button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
