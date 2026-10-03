import { motion } from 'framer-motion'
import { findProduct } from '../data/catalog'
import { addDays, discountPct, inr } from '../data/commerce'
import { imageOf } from '../data/images'
import { useNav, useStore } from '../store'
import { Price, Rating } from '../ui/bits'

const ease = [0.16, 1, 0.3, 1]

export function Wishlist() {
  const { state, dispatch } = useStore()
  const nav = useNav()
  const items = state.wishlist.map(findProduct)
  if (!items.length) {
    return (
      <div className="gx-page gx-empty big">
        <h1>Your wishlist is empty</h1>
        <p>Tap ♡ on anything you would like to come back to.</p>
        <button className="gx-btn dark" onClick={() => nav.go('shop')}>Explore products</button>
      </div>
    )
  }
  return (
    <div className="gx-page">
      <h1>Wishlist <small>{items.length}</small></h1>
      <div className="gx-results wish">
        {items.map((p, i) => (
          <motion.article key={p.id} className="gx-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.5, ease }}>
            <button className="gx-card-img" onClick={() => nav.go('product', { id: p.id })} aria-label={`Open ${p.name}`}><img src={imageOf(p.id)} alt="" /></button>
            <div className="gx-card-meta">
              <h3>{p.name}</h3>
              <Price p={p} />
              <Rating p={p} />
              <div className="gx-row wrap">
                <button className="gx-btn sm" onClick={() => {
                  if (p.sizes) { nav.go('product', { id: p.id }); return }
                  dispatch({ type: 'add', line: { id: p.id, color: 0 } })
                  dispatch({ type: 'wish', id: p.id })
                  dispatch({ type: 'toast', text: 'Moved to bag' })
                }}>{p.sizes ? 'Choose size' : 'Move to bag'}</button>
                <button className="gx-link" onClick={() => dispatch({ type: 'wish', id: p.id })}>Remove</button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  )
}

export function Compare() {
  const { state, dispatch } = useStore()
  const nav = useNav()
  const items = state.compare.map(findProduct)
  if (items.length < 2) {
    return (
      <div className="gx-page gx-empty big">
        <h1>Pick at least two products</h1>
        <p>Use ⇄ Compare on any product, up to three at a time.</p>
        <button className="gx-btn dark" onClick={() => nav.go('shop')}>Browse products</button>
      </div>
    )
  }
  const keys = [...new Set(items.flatMap((p) => Object.keys(p.compare || {})))]
  const best = {
    price: Math.min(...items.map((p) => p.price)),
    rating: Math.max(...items.map((p) => p.rating)),
    discount: Math.max(...items.map(discountPct)),
  }
  const rows = [
    ['Price', (p) => <><b>{inr(p.price)}</b>{p.price === best.price && <em className="gx-best">Lowest price</em>}</>],
    ['Discount', (p) => <>{discountPct(p)}% off MRP {inr(p.mrp)}{discountPct(p) === best.discount && <em className="gx-best">Best deal</em>}</>],
    ['Rating', (p) => (
      <span className="gx-cmp-rating"><i><b style={{ width: `${(p.rating / 5) * 100}%` }} /></i>{p.rating} ★ · {p.reviews.toLocaleString('en-IN')}{p.rating === best.rating && <em className="gx-best">Top rated</em>}</span>
    )],
    ...keys.map((k) => [k, (p) => p.compare?.[k] || '—']),
    ['Delivery', (p) => `Free, by ${addDays(p.deliveryDays)}`],
    ['Returns', (p) => p.returns],
    ['Variants', (p) => (
      <span className="gx-cmp-sw">
        {(p.variants?.colors || []).map((v) => <i key={v.name} title={v.name} style={{ background: v.swatch }} />)}
        {p.sizes && <small>{p.sizes.length} sizes</small>}
        {!p.variants?.colors && !p.sizes && 'One option'}
      </span>
    )],
  ]
  return (
    <div className="gx-page gx-compare">
      <div className="gx-row between"><h1>Compare</h1><button className="gx-link" onClick={() => { dispatch({ type: 'clearCompare' }); nav.go('shop') }}>Clear comparison</button></div>
      <div className="gx-cmp" style={{ '--cols': items.length }}>
        {items.map((p, i) => (
          <motion.section key={p.id} className="gx-cmp-col" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.6, ease }}>
            <button className="gx-cmp-x" onClick={() => dispatch({ type: 'compare', id: p.id })} aria-label={`Remove ${p.name}`}>×</button>
            <button className="gx-cmp-img" onClick={() => nav.go('product', { id: p.id })}><img src={imageOf(p.id)} alt="" /></button>
            <span className="gx-eyebrow">{p.brand}</span>
            <h2>{p.name}</h2>
            <dl>
              {rows.map(([label, render]) => <div key={label}><dt>{label}</dt><dd>{render(p)}</dd></div>)}
            </dl>
            <div className="gx-row wrap">
              <button className="gx-btn sm dark" onClick={() => nav.go('product', { id: p.id })}>View &amp; buy</button>
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  )
}
