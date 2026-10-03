import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BRANDS, CATEGORIES, PRODUCTS } from '../data/catalog'
import { addDays, discountPct } from '../data/commerce'
import { useNav, useStore } from '../store'
import { Price, ProductImage, Rating } from '../ui/bits'

const PRICE = [['u1k', 'Under ₹1,000', 0, 999], ['1k10k', '₹1,000 – ₹10,000', 1000, 10000], ['10k50k', '₹10,000 – ₹50,000', 10001, 50000], ['50k', 'Above ₹50,000', 50001, Infinity]]
const SORTS = [['relevance', 'Relevance'], ['new', 'New arrivals'], ['low', 'Price: low to high'], ['high', 'Price: high to low'], ['rating', 'Customer rating'], ['popular', 'Popularity']]

function score(p, q) {
  if (!q) return 1
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
  let s = 0
  for (const t of terms) {
    if (p.name.toLowerCase().includes(t)) s += 4
    if (p.brand.toLowerCase().includes(t)) s += 3
    if (p.category.includes(t) || CATEGORIES.find((c) => c.id === p.category).label.toLowerCase().includes(t)) s += 2
    if (p.tags.some((x) => x.includes(t))) s += 2
    if (p.specs.some(([k, v]) => `${k} ${v}`.toLowerCase().includes(t))) s += 1
  }
  return s
}

const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

export default function Shop() {
  const nav = useNav()
  const { state, dispatch } = useStore()
  const urlCat = nav.params.get('cat')
  const [q, setQ] = useState('')
  const [cats, setCats] = useState(urlCat ? [urlCat] : [])
  const [prices, setPrices] = useState([])
  const [rating, setRating] = useState(0)
  const [disc, setDisc] = useState(0)
  const [brands, setBrands] = useState([])
  const [inStock, setInStock] = useState(false)
  const [sort, setSort] = useState('relevance')
  const [sheet, setSheet] = useState(false)

  const results = useMemo(() => {
    const out = PRODUCTS.map((p) => ({ p, s: score(p, q.trim()) }))
      .filter(({ p, s }) => s > 0
        && (!cats.length || cats.includes(p.category))
        && (!prices.length || prices.some((id) => { const r = PRICE.find((x) => x[0] === id); return p.price >= r[2] && p.price <= r[3] }))
        && p.rating >= rating
        && discountPct(p) >= disc
        && (!brands.length || brands.includes(p.brand))
        && (!inStock || p.stock !== 'Out of stock'))
    const by = {
      relevance: (a, b) => b.s - a.s || b.p.popularity - a.p.popularity,
      new: (a, b) => Number(b.p.isNew) - Number(a.p.isNew) || b.p.popularity - a.p.popularity,
      low: (a, b) => a.p.price - b.p.price,
      high: (a, b) => b.p.price - a.p.price,
      rating: (a, b) => b.p.rating - a.p.rating,
      popular: (a, b) => b.p.reviews - a.p.reviews,
    }[sort]
    return out.sort(by).map((x) => x.p)
  }, [q, cats, prices, rating, disc, brands, inStock, sort])

  const active = cats.length + prices.length + brands.length + (rating ? 1 : 0) + (disc ? 1 : 0) + (inStock ? 1 : 0)
  const clear = () => { setCats([]); setPrices([]); setRating(0); setDisc(0); setBrands([]); setInStock(false); setQ('') }
  const env = cats.length === 1 ? CATEGORIES.find((c) => c.id === cats[0]) : null

  const filters = (
    <div className="gx-filters">
      <fieldset><legend>Category</legend>
        {CATEGORIES.map((c) => <label key={c.id} className="gx-check"><input type="checkbox" checked={cats.includes(c.id)} onChange={() => setCats(toggle(cats, c.id))} />{c.label}</label>)}
      </fieldset>
      <fieldset><legend>Price</legend>
        {PRICE.map(([id, label]) => <label key={id} className="gx-check"><input type="checkbox" checked={prices.includes(id)} onChange={() => setPrices(toggle(prices, id))} />{label}</label>)}
      </fieldset>
      <fieldset><legend>Customer rating</legend>
        {[[0, 'Any'], [4, '4★ & above'], [4.5, '4.5★ & above']].map(([v, l]) => <label key={v} className="gx-check"><input type="radio" name="rating" checked={rating === v} onChange={() => setRating(v)} />{l}</label>)}
      </fieldset>
      <fieldset><legend>Discount</legend>
        {[[0, 'Any'], [10, '10% or more'], [20, '20% or more'], [30, '30% or more']].map(([v, l]) => <label key={v} className="gx-check"><input type="radio" name="disc" checked={disc === v} onChange={() => setDisc(v)} />{l}</label>)}
      </fieldset>
      <fieldset><legend>Brand</legend>
        {BRANDS.map((b) => <label key={b} className="gx-check"><input type="checkbox" checked={brands.includes(b)} onChange={() => setBrands(toggle(brands, b))} />{b}</label>)}
      </fieldset>
      <fieldset><legend>Availability</legend>
        <label className="gx-check"><input type="checkbox" checked={inStock} onChange={() => setInStock(!inStock)} />In stock only</label>
      </fieldset>
    </div>
  )

  return (
    <div className="gx-shop" data-env={env?.env || 'precision'}>
      <div className="gx-env" aria-hidden="true" />
      <div className="gx-shop-head">
        <span className="gx-eyebrow">{env ? env.line : 'Shop all'}</span>
        <h1>{env ? env.label : 'Everything, explorable.'}</h1>
        <label className="gx-search">
          <span>Search</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Product, brand, category or feature…" autoFocus={Boolean(nav.params.get('focus'))} />
          {q && <button className="gx-link" onClick={() => setQ('')}>Clear</button>}
        </label>
      </div>

      <div className="gx-shop-bar">
        <span>{results.length} result{results.length === 1 ? '' : 's'}{q && <> for “{q}”</>}</span>
        <button className="gx-btn sm ghost gx-filter-btn" onClick={() => setSheet(true)}>Filters{active ? ` (${active})` : ''}</button>
        {active > 0 && <button className="gx-link" onClick={clear}>Clear all</button>}
        <label className="gx-sort">Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value)}>{SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        </label>
      </div>

      <div className="gx-shop-body">
        <aside className="gx-shop-side">{filters}</aside>
        <motion.div layout className="gx-results">
          <AnimatePresence mode="popLayout">
            {results.map((p) => (
              <motion.article
                layout
                key={p.id}
                className="gx-card"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              >
                <button className="gx-card-img" onClick={() => nav.go('product', { id: p.id })} aria-label={`Open ${p.name}`}>
                  <ProductImage id={p.id} peek={Boolean(p.hero)} />
                  {p.isNew && <span className="gx-badge">New</span>}
                </button>
                <div className="gx-card-meta">
                  <span className="gx-eyebrow">{p.brand}</span>
                  <h3>{p.name}</h3>
                  <Price p={p} />
                  <div className="gx-row"><Rating p={p} /><span className={`gx-avail ${p.stock !== 'In stock' ? 'low' : ''}`}>{p.stock}</span></div>
                  <small>Free delivery by {addDays(p.deliveryDays)}</small>
                  <div className="gx-row">
                    <button className={`gx-icon ${state.wishlist.includes(p.id) ? 'on' : ''}`} aria-pressed={state.wishlist.includes(p.id)} aria-label="Wishlist" onClick={() => dispatch({ type: 'wish', id: p.id })}>{state.wishlist.includes(p.id) ? '♥' : '♡'}</button>
                    <button className={`gx-icon ${state.compare.includes(p.id) ? 'on' : ''}`} aria-pressed={state.compare.includes(p.id)} aria-label="Compare" onClick={() => dispatch({ type: 'compare', id: p.id })}>⇄</button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
          {results.length === 0 && (
            <div className="gx-empty">
              <h3>No products match</h3>
              <p>Try a different word or remove a filter.</p>
              <button className="gx-btn" onClick={clear}>Clear filters</button>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {sheet && (
          <>
            <motion.div className="gx-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)} />
            <motion.div className="gx-sheet" role="dialog" aria-modal="true" aria-label="Filters" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
              <div className="gx-sheet-head"><h2>Filters</h2><button className="gx-link" onClick={clear}>Clear</button></div>
              {filters}
              <button className="gx-btn dark wide" onClick={() => setSheet(false)}>Show {results.length} results</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
