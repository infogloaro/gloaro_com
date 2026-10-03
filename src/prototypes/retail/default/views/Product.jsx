import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import SceneCanvas from '../../../core/SceneCanvas'
import { useCapabilities } from '../../../core/useCapabilities'
import { PartLabels, ProductScene } from '../engine/ProductStage'
import { MODELS } from '../models'
import { CATEGORIES, PRODUCTS, findProduct, reviewsFor } from '../data/catalog'
import { COD_LIMIT, checkPincode, discountPct, emiPlans, inr } from '../data/commerce'
import { explodedImageOf, imageOf } from '../data/images'
import { linePrice, useNav, useStore } from '../store'
import { Magnetic, Price, ProductImage, Rating, Stepper } from '../ui/bits'

const ease = [0.16, 1, 0.3, 1]

function ratingSpread(r) {
  const five = Math.round((r - 3.6) * 55)
  const four = Math.round((100 - five) * 0.62)
  const three = Math.round((100 - five - four) * 0.6)
  const two = Math.round((100 - five - four - three) * 0.6)
  return [five, four, three, two, 100 - five - four - three - two]
}

export default function ProductView({ id, initialPart = null }) {
  const p = findProduct(id)
  const def = MODELS[p.model]
  const { state, dispatch } = useStore()
  const nav = useNav()
  const caps = useCapabilities()
  const [color, setColor] = useState(0)
  const [extra, setExtra] = useState(0)
  const [size, setSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [selected, setSelected] = useState(initialPart)
  const [hover, setHover] = useState(null)
  const [exploded, setExploded] = useState(false)
  const [scrub, setScrub] = useState(0)
  const [ready, setReady] = useState(false)
  const [sizeError, setSizeError] = useState(false)
  const [pin, setPin] = useState(state.pincode || '')
  const [pinResult, setPinResult] = useState(() => (state.pincode ? checkPincode(state.pincode, p.deliveryDays) : null))
  const [hud] = useState(() => ({ labels: {}, anchors: {} }))
  const progress = useRef(0)
  const ctl = useRef({ yaw: 0, pitch: 0, zoom: 1, touched: 0, wheel: true })
  const specsRef = useRef(null)
  const reviewsRef = useRef(null)
  const isStatic = caps.tier === 'static'

  const colors = useMemo(() => ({
    ...(p.variants?.colors?.[color]?.colors || {}),
    ...(p.variants?.extra?.options?.[extra]?.colors || {}),
  }), [p, color, extra])
  const delta = p.variants?.extra?.options?.[extra]?.priceDelta || 0
  const part = def.parts.find((x) => x.id === (selected || hover))
  const wished = state.wishlist.includes(p.id)
  const comparing = state.compare.includes(p.id)
  const similar = PRODUCTS.filter((x) => x.id !== p.id && (x.category === p.category || x.hero)).slice(0, 4)
  const cat = CATEGORIES.find((c) => c.id === p.category)
  const emiFrom = emiPlans(p.price + delta)[1].monthly

  // The shared-element flight finishes before the live 3D model takes over from the render.
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 700)
    return () => clearTimeout(t)
  }, [])

  // Arriving from a component link (e.g. the hero film): open exploded, with that part in focus.
  useEffect(() => {
    if (!initialPart) return undefined
    const t = setTimeout(() => {
      setExploded(true)
      gsap.to(progress, { current: 1, duration: 1.9, ease: 'power2.inOut', onUpdate: () => setScrub(progress.current) })
    }, 800)
    return () => clearTimeout(t)
  }, [initialPart])

  const setExplode = (on) => {
    setExploded(on)
    setSelected(null)
    gsap.to(progress, {
      current: on ? 1 : 0,
      duration: caps.reducedMotion ? 0 : 1.9,
      ease: 'power2.inOut',
      onUpdate: () => setScrub(progress.current),
    })
  }

  const onScrub = (v) => {
    gsap.killTweensOf(progress)
    progress.current = v
    setScrub(v)
    setExploded(v > 0.5)
  }

  const add = (thenCheckout) => {
    if (p.sizes && !size) { setSizeError(true); return false }
    dispatch({ type: 'add', line: { id: p.id, color, size, extra, qty } })
    dispatch({ type: 'toast', text: `${p.name} added to bag` })
    if (thenCheckout) nav.go('checkout', { step: 'address' })
    return true
  }

  const doPin = (e) => {
    e.preventDefault()
    const r = checkPincode(pin.trim(), p.deliveryDays)
    setPinResult(r)
    if (r.ok) dispatch({ type: 'pincode', pincode: pin.trim() })
  }

  const showLabels = scrub > 0.55 && !isStatic

  return (
    <div className="gx-product">
      <section className="gx-stage" aria-label={`${p.name}, interactive 3D view`}>
        <div className="gx-stage-crumbs">
          <button className="gx-link" onClick={() => nav.back()}>← Back</button>
          <span>/</span>
          <button className="gx-link" onClick={() => nav.go('shop', { cat: p.category })}>{cat.label}</button>
        </div>

        <div className="gx-stage-view">
          <motion.div className="gx-stage-poster" animate={{ opacity: ready && !isStatic ? 0 : 1 }} transition={{ duration: 0.6 }}>
            {isStatic && exploded && explodedImageOf(p.id)
              ? <img src={explodedImageOf(p.id)} alt={`${p.name}, exploded view`} />
              : <ProductImage id={p.id} />}
          </motion.div>
          {!isStatic && (
            <motion.div className="gx-stage-canvas" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ duration: 0.8 }}>
              <SceneCanvas camera={{ position: def.view.pos, fov: def.view.fov }} fallback={null}>
                {({ tier }) => (
                  <ProductScene
                    def={def}
                    colors={colors}
                    progress={progress}
                    focus={selected || hover}
                    hud={hud}
                    ctlRef={ctl}
                    tier={tier}
                    onHover={setHover}
                    onSelect={(pid) => setSelected((cur) => (cur === pid ? null : pid))}
                  />
                )}
              </SceneCanvas>
              <PartLabels def={def} hud={hud} show={showLabels} focus={selected || hover} onSelect={(pid) => setSelected((cur) => (cur === pid ? null : pid))} />
            </motion.div>
          )}
        </div>

        <div className="gx-stage-tools">
          <Magnetic className={`gx-btn ${exploded ? 'ghost' : ''}`} onClick={() => setExplode(!exploded)}>
            {exploded ? 'Assemble' : 'Explode'}
          </Magnetic>
          {!isStatic && (
            <label className="gx-scrub">
              <span>Assembled</span>
              <input type="range" min="0" max="1" step="0.001" value={scrub} onChange={(e) => onScrub(Number(e.target.value))} aria-label="Explode amount" />
              <span>Exploded</span>
            </label>
          )}
          {!isStatic && <button className="gx-link" onClick={() => { ctl.current.yaw = 0; ctl.current.pitch = 0; ctl.current.zoom = 1 }}>Reset view</button>}
        </div>
        {!isStatic && <p className="gx-stage-hint">Drag to rotate · scroll or pinch to zoom · tap a part to inspect it</p>}

        <div className="gx-parts" role="list" aria-label="Components">
          {def.parts.filter((x, i, a) => a.findIndex((y) => y.name === x.name) === i).map((x) => {
            const ids = def.parts.filter((y) => y.name === x.name).map((y) => y.id)
            const on = ids.includes(selected)
            return (
              <button key={x.id} role="listitem" className={on ? 'on' : ''} onClick={() => { setSelected(on ? null : x.id); if (!exploded && !on) setExplode(true) }} onPointerEnter={() => setHover(x.id)} onPointerLeave={() => setHover(null)}>
                {x.name}
              </button>
            )
          })}
        </div>

        <AnimatePresence>
          {part && (
            <motion.div key={part.id} className="gx-partcard" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.35, ease }}>
              <span className="gx-eyebrow">Component</span>
              <h3>{part.name}</h3>
              <p>{part.info}</p>
              {selected && <button className="gx-link" onClick={() => setSelected(null)}>Close</button>}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <aside className="gx-info">
        <span className="gx-eyebrow">{p.brand} · {cat.label}</span>
        <h1>{p.name}</h1>
        <p className="gx-tagline">{p.tagline}</p>
        <button className="gx-rating-row" onClick={() => reviewsRef.current?.scrollIntoView({ behavior: 'smooth' })}><Rating p={p} /></button>

        <AnimatePresence mode="wait">
          <motion.div key={exploded ? 'x' : 'a'} className="gx-buybox" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
            <Price p={p} size="lg" delta={delta} />
            <small className="gx-tax">Inclusive of all taxes · No-cost EMI from {inr(emiFrom)}/month</small>
          </motion.div>
        </AnimatePresence>

        <ul className="gx-offers">
          <li><b>Bank offer</b> 10% instant discount on HDFC credit cards, up to ₹3,000</li>
          <li><b>Coupon</b> Use <code>GLOARO10</code> at checkout for 10% off (max ₹2,000)</li>
        </ul>

        {p.variants?.colors && (
          <div className="gx-opt">
            <span>Colour <b>{p.variants.colors[color].name}</b></span>
            <div className="gx-swatches" role="radiogroup" aria-label="Colour">
              {p.variants.colors.map((v, i) => <button key={v.name} role="radio" aria-checked={color === i} aria-label={v.name} className={color === i ? 'on' : ''} style={{ '--c': v.swatch }} onClick={() => setColor(i)} />)}
            </div>
          </div>
        )}
        {p.variants?.extra && (
          <div className="gx-opt">
            <span>{p.variants.extra.label} <b>{p.variants.extra.options[extra].name}</b></span>
            <div className="gx-chips">
              {p.variants.extra.options.map((o, i) => (
                <button key={o.name} className={extra === i ? 'on' : ''} aria-pressed={extra === i} onClick={() => setExtra(i)}>
                  {o.swatch && <i style={{ background: o.swatch }} />}{o.name}{o.priceDelta ? ` (+${inr(o.priceDelta)})` : ''}
                </button>
              ))}
            </div>
          </div>
        )}
        {p.sizes && (
          <div className="gx-opt">
            <span>Size {sizeError && <em className="gx-err">Please select a size</em>}</span>
            <div className="gx-sizes">
              {p.sizes.map((s) => {
                const out = p.soldOutSizes?.includes(s)
                return <button key={s} disabled={out} className={size === s ? 'on' : ''} aria-pressed={size === s} onClick={() => { setSize(s); setSizeError(false) }}>{s}{out && <small>Sold out</small>}</button>
              })}
            </div>
          </div>
        )}

        <div className="gx-cta-row">
          <Stepper value={qty} onChange={setQty} />
          <button className="gx-btn wide" onClick={() => add(false)} disabled={p.stock === 'Out of stock'}>Add to Bag</button>
          <button className="gx-btn dark wide" onClick={() => add(true)} disabled={p.stock === 'Out of stock'}>Buy Now</button>
        </div>
        <div className="gx-cta-sub">
          <button className={`gx-link ${wished ? 'on' : ''}`} aria-pressed={wished} onClick={() => { dispatch({ type: 'wish', id: p.id }); dispatch({ type: 'toast', text: wished ? 'Removed from wishlist' : 'Saved to wishlist' }) }}>{wished ? '♥ Saved' : '♡ Wishlist'}</button>
          <button className={`gx-link ${comparing ? 'on' : ''}`} aria-pressed={comparing} onClick={() => dispatch({ type: 'compare', id: p.id })}>{comparing ? '✓ Comparing' : '⇄ Compare'}</button>
          <button className="gx-link" onClick={() => specsRef.current?.scrollIntoView({ behavior: 'smooth' })}>Explore specifications</button>
        </div>
        <p className={`gx-stock ${p.stock !== 'In stock' ? 'low' : ''}`}>{p.stock}</p>

        <form className="gx-pin" onSubmit={doPin}>
          <span className="gx-eyebrow">Delivery</span>
          <div>
            <input inputMode="numeric" maxLength={6} placeholder="Enter pincode" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} aria-label="Pincode" />
            <button className="gx-link">Check</button>
          </div>
          {pinResult && (pinResult.ok ? (
            <p className="ok">Delivery by <b>{pinResult.date}</b> · {p.price >= 499 ? 'Free delivery' : '₹49 delivery'}{pinResult.cod && p.price < COD_LIMIT ? ' · Cash on Delivery available' : ''}</p>
          ) : <p className="gx-err">{pinResult.message}</p>)}
        </form>

        <ul className="gx-trust">
          <li><b>Genuine product</b><span>Sourced directly from {p.brand}</span></li>
          <li><b>{p.warranty}</b><span>Warranty</span></li>
          <li><b>{p.returns}</b><span>Returns</span></li>
        </ul>

        <section ref={specsRef} className="gx-specs">
          <h2>Specifications</h2>
          <dl>{p.specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          <h3>What&apos;s included</h3>
          <ul className="gx-included">{p.included.map((x) => <li key={x}>{x}</li>)}</ul>
        </section>

        <section ref={reviewsRef} className="gx-reviews">
          <h2>Ratings & reviews</h2>
          <div className="gx-review-head">
            <b>{p.rating}</b><span>★</span>
            <small>{p.reviews.toLocaleString('en-IN')} verified ratings</small>
          </div>
          <div className="gx-spread">
            {ratingSpread(p.rating).map((pct, i) => <div key={i}><span>{5 - i}★</span><i><b style={{ width: `${Math.max(pct, 1)}%` }} /></i><em>{pct}%</em></div>)}
          </div>
          {reviewsFor(p.id).map(([who, stars, text]) => (
            <article key={who + text} className="gx-review">
              <div><b>{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</b><small>{who} · Verified purchase</small></div>
              <p>{text}</p>
            </article>
          ))}
        </section>

        <section className="gx-similar">
          <h2>You may also like</h2>
          <div>
            {similar.map((s) => (
              <button key={s.id} onClick={() => nav.go('product', { id: s.id })}>
                <img src={imageOf(s.id)} alt="" />
                <b>{s.name}</b>
                <span>{inr(linePrice({ id: s.id }))} {discountPct(s) > 0 && <em>{discountPct(s)}% off</em>}</span>
              </button>
            ))}
          </div>
        </section>
      </aside>
    </div>
  )
}
