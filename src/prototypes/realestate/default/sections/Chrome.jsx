import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_ITEMS, BRAND } from '../data'

export function Nav({ go }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (id) => {
    setMobileOpen(false)
    go(id)
  }

  return (
    <>
      <nav className={`re-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="re-nav-logo">
          <div className="re-nav-logo-icon">PH</div>
          {BRAND.name}
        </div>
        <ul className="re-nav-links">
          {NAV_ITEMS.map(item => (
            <li key={item.id}>
              <button className="re-nav-link" onClick={() => go(item.id)}>{item.label}</button>
            </li>
          ))}
        </ul>
        <button className="re-nav-cta" onClick={() => go('contact')}>Schedule Visit</button>
        <button className="re-nav-toggle" onClick={() => setMobileOpen(true)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="re-mobile-menu open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button className="re-mobile-menu-close" onClick={() => setMobileOpen(false)}>✕</button>
            {NAV_ITEMS.map(item => (
              <motion.button
                key={item.id}
                className="re-mobile-menu-link"
                onClick={() => handleNav(item.id)}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: NAV_ITEMS.indexOf(item) * 0.05 + 0.1 }}
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
