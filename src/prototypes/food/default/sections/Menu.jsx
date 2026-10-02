import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { gsap, useMotion } from '../motion'
import { CATEGORIES, MENU, inr } from '../data'

const ease = [0.16, 1, 0.3, 1]

export default function Menu({ openDish, list }) {
  const root = useRef(null)
  const [cat, setCat] = useState('fire')
  const [dir, setDir] = useState(1)
  const [query, setQuery] = useState('')
  const [veg, setVeg] = useState(false)
  const [spicy, setSpicy] = useState(false)
  const [hover, setHover] = useState(null)

  // Floating photograph that trails the cursor over rows that have one.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const fx = useSpring(mx, { stiffness: 180, damping: 22 })
  const fy = useSpring(my, { stiffness: 180, damping: 22 })

  useMotion(root, () => {
    gsap.fromTo('.me-menu-title .me-menu-title-in', { yPercent: 100 }, {
      yPercent: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 90%', end: 'top 40%', scrub: 1 },
    })
    gsap.fromTo('.me-menu-title', { letterSpacing: '0.2em' }, {
      letterSpacing: '-0.04em', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 90%', end: 'top 30%', scrub: 1 },
    })
  })

  const searching = query.trim().length > 0
  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    return MENU.filter((m) => (searching || m.cat === cat)
      && (!veg || m.veg) && (!spicy || m.spicy)
      && (!q || `${m.name} ${m.desc} ${m.plate.join(' ')}`.toLowerCase().includes(q)))
  }, [cat, query, veg, spicy, searching])

  const pick = (id) => {
    const from = CATEGORIES.findIndex((c) => c.id === cat)
    const to = CATEGORIES.findIndex((c) => c.id === id)
    setDir(to >= from ? 1 : -1)
    setCat(id)
    setQuery('')
  }

  const reset = () => { setQuery(''); setVeg(false); setSpicy(false) }
  const hovered = MENU.find((m) => m.id === hover)
  const activeCat = CATEGORIES.find((c) => c.id === cat)

  return (
    <section id="menu" ref={root} className="me-menu" onPointerMove={(e) => { mx.set(e.clientX); my.set(e.clientY) }}>
      <div className="me-menu-head">
        <span className="me-eyebrow">The menu · {MENU.length} plates</span>
        <h2 className="me-menu-title"><span className="me-menu-title-in">The Menu</span></h2>
      </div>

      <div className="me-menu-tabs" role="tablist" aria-label="Menu categories">
        {CATEGORIES.map((c, i) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={!searching && cat === c.id}
            className={`me-tab ${!searching && cat === c.id ? 'on' : ''}`}
            onClick={() => pick(c.id)}
          >
            <sup>0{i + 1}</sup>{c.label}
          </button>
        ))}
      </div>

      <div className="me-menu-tools">
        <label className="me-search">
          <span>Search</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="truffle, basil, chilli…" />
        </label>
        <button className={`me-toggle ${veg ? 'on' : ''}`} aria-pressed={veg} onClick={() => setVeg(!veg)}>Vegetarian</button>
        <button className={`me-toggle ${spicy ? 'on' : ''}`} aria-pressed={spicy} onClick={() => setSpicy(!spicy)}>Spicy</button>
        <span className="me-menu-note">{searching ? `Results for “${query.trim()}”` : activeCat.note}</span>
      </div>

      <div className="me-menu-list">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.ol
            key={searching ? `q-${query}-${veg}-${spicy}` : `${cat}-${veg}-${spicy}`}
            initial="enter"
            animate="show"
            exit="leave"
            custom={dir}
            variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          >
            {items.length === 0 && (
              <motion.li className="me-menu-empty" variants={{ enter: { opacity: 0 }, show: { opacity: 1 } }}>
                Nothing matches yet. <button className="me-link-btn" onClick={reset}>Clear filters <i>→</i></button>
              </motion.li>
            )}
            {items.map((m, i) => (
              <motion.li
                key={m.id}
                custom={dir}
                variants={{
                  enter: (d) => ({ x: d * 120, opacity: 0, clipPath: 'inset(0 0 0 100%)' }),
                  show: { x: 0, opacity: 1, clipPath: 'inset(0 0 0 0%)', transition: { duration: 0.8, ease } },
                  leave: (d) => ({ x: d * -80, opacity: 0, transition: { duration: 0.35, ease: 'easeIn' } }),
                }}
              >
                <button
                  className="me-row"
                  onClick={(e) => openDish(m.id, e)}
                  onPointerEnter={(e) => {
                    // Start the photograph at the pointer instead of springing in from the corner.
                    if (!hovered) { fx.jump(e.clientX); fy.jump(e.clientY) }
                    mx.set(e.clientX)
                    my.set(e.clientY)
                    setHover(m.id)
                  }}
                  onPointerLeave={() => setHover(null)}
                  onFocus={() => setHover(m.id)}
                  onBlur={() => setHover(null)}
                  data-cursor={m.img ? 'View' : 'Open'}
                >
                  <span className="me-row-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="me-row-name">
                    {m.name}
                    {list.includes(m.id) && <em className="me-row-added">on your table</em>}
                  </span>
                  <span className="me-row-desc">{m.desc}</span>
                  <span className="me-row-tags">{m.veg && 'V'}{m.spicy && ' · 🌶'}</span>
                  <span className="me-row-price">{inr(m.price)}</span>
                </button>
              </motion.li>
            ))}
          </motion.ol>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {hovered?.img && (
          <motion.div
            key={hovered.id}
            className="me-float"
            style={{ x: fx, y: fy }}
            initial={{ opacity: 0, scale: 0.7, rotate: -6, clipPath: 'inset(50% 50% 50% 50%)' }}
            animate={{ opacity: 1, scale: 1, rotate: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ opacity: 0, scale: 0.85, clipPath: 'inset(50% 50% 50% 50%)' }}
            transition={{ duration: 0.5, ease }}
            aria-hidden="true"
          >
            <img src={hovered.img} alt="" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
