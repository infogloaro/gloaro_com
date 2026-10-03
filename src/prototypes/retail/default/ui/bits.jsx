import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { discountPct, inr } from '../data/commerce'
import { CATEGORIES } from '../data/catalog'
import { explodedImageOf, imageOf } from '../data/images'
import { useNav, useStore } from '../store'

export function Price({ p, size = 'md', delta = 0 }) {
  const off = discountPct(p)
  return (
    <span className={`gx-price ${size}`}>
      <b>{inr(p.price + delta)}</b>
      {off > 0 && <s>{inr(p.mrp + delta)}</s>}
      {off > 0 && <em>{off}% OFF</em>}
    </span>
  )
}

export function Rating({ p, compact = false }) {
  return (
    <span className="gx-rating" aria-label={`Rated ${p.rating} out of 5 from ${p.reviews} reviews`}>
      <i>{p.rating} ★</i>{!compact && <span>{p.reviews.toLocaleString('en-IN')} reviews</span>}
    </span>
  )
}

/** Product render that can fly between views (shared layoutId) and peek its exploded view on hover. */
export function ProductImage({ id, layout = true, peek = false, className = '' }) {
  const [hover, setHover] = useState(false)
  const x = explodedImageOf(id)
  return (
    <span className={`gx-pimg ${className}`} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      <motion.img layoutId={layout ? `pimg-${id}` : undefined} src={imageOf(id)} alt="" draggable="false" style={{ opacity: peek && hover && x ? 0 : 1 }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
      {peek && x && <img className="gx-peek" src={x} alt="" draggable="false" style={{ opacity: hover ? 1 : 0 }} />}
    </span>
  )
}

export function Magnetic({ children, className = '', strength = 0.3, ...props }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 260, damping: 18 })
  const y = useSpring(my, { stiffness: 260, damping: 18 })
  return (
    <motion.button
      {...props}
      className={className}
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left - r.width / 2) * strength)
        my.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onPointerLeave={() => { mx.set(0); my.set(0) }}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.button>
  )
}

export function Header() {
  const { state } = useStore()
  const nav = useNav()
  const [open, setOpen] = useState(false)
  const count = state.bag.reduce((n, l) => n + l.qty, 0)
  const go = (v, extra) => { setOpen(false); nav.go(v, extra) }
  return (
    <header className="gx-header">
      <button className="gx-logo" onClick={() => go('home')} aria-label="GLOARO home">GLOARO<span>/BUILD</span></button>
      <nav className="gx-nav" aria-label="Primary">
        <button className={nav.view === 'home' ? 'on' : ''} onClick={() => go('home')}>Exhibition</button>
        <div className="gx-cat-menu">
          <button aria-expanded={open} onClick={() => setOpen(!open)}>Categories</button>
          <AnimatePresence>
            {open && (
              <motion.div className="gx-cat-pop" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                {CATEGORIES.map((c) => <button key={c.id} onClick={() => go('shop', { cat: c.id })}>{c.label}<small>{c.line}</small></button>)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button className={nav.view === 'shop' ? 'on' : ''} onClick={() => go('shop')}>Shop all</button>
      </nav>
      <div className="gx-actions">
        <button onClick={() => go('shop', { focus: 1 })} aria-label="Search">Search</button>
        <button onClick={() => go('wishlist')} aria-label={`Wishlist, ${state.wishlist.length} items`}>Wishlist{state.wishlist.length > 0 && <sup>{state.wishlist.length}</sup>}</button>
        <button className="gx-bagbtn" onClick={() => go('bag')} aria-label={`Bag, ${count} items`}>Bag<span>{count}</span></button>
      </div>
    </header>
  )
}

export function MobileNav() {
  const { state } = useStore()
  const nav = useNav()
  const count = state.bag.reduce((n, l) => n + l.qty, 0)
  const items = [['home', 'Home'], ['shop', 'Shop'], ['search', 'Search'], ['wishlist', 'Saved'], ['bag', 'Bag']]
  return (
    <nav className="gx-mnav" aria-label="Mobile">
      {items.map(([v, label]) => (
        <button key={v} className={nav.view === v || (v === 'search' && nav.params.get('focus')) ? 'on' : ''} onClick={() => (v === 'search' ? nav.go('shop', { focus: 1 }) : nav.go(v))}>
          <i aria-hidden="true">{{ home: '◎', shop: '▦', search: '⌕', wishlist: '♡', bag: '◫' }[v]}</i>
          {label}
          {v === 'bag' && count > 0 && <sup>{count}</sup>}
        </button>
      ))}
    </nav>
  )
}

export function CompareTray() {
  const { state, dispatch } = useStore()
  const nav = useNav()
  if (!state.compare.length || nav.view === 'compare' || nav.view === 'checkout') return null
  return (
    <motion.div className="gx-tray" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <span className="gx-tray-label">Compare</span>
      {state.compare.map((id) => (
        <button key={id} className="gx-tray-item" onClick={() => dispatch({ type: 'compare', id })} aria-label="Remove from compare">
          <img src={imageOf(id)} alt="" /><i>×</i>
        </button>
      ))}
      {Array.from({ length: 3 - state.compare.length }, (_, i) => <span key={i} className="gx-tray-slot" />)}
      <button className="gx-btn sm" disabled={state.compare.length < 2} onClick={() => nav.go('compare')}>Compare {state.compare.length}</button>
      <button className="gx-link" onClick={() => dispatch({ type: 'clearCompare' })}>Clear</button>
    </motion.div>
  )
}

export function Toast() {
  const { state, dispatch } = useStore()
  useEffect(() => {
    if (!state.toast) return undefined
    const t = setTimeout(() => dispatch({ type: 'toast', text: null }), 2200)
    return () => clearTimeout(t)
  }, [state.toast, dispatch])
  return (
    <AnimatePresence>
      {state.toast && (
        <motion.div key={state.toast.at} className="gx-toast" role="status" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
          {state.toast.text}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Stepper({ value, onChange, min = 1, max = 10, label = 'quantity' }) {
  return (
    <span className="gx-step">
      <button type="button" aria-label={`Decrease ${label}`} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>−</button>
      <b>{value}</b>
      <button type="button" aria-label={`Increase ${label}`} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>+</button>
    </span>
  )
}
