import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { findProduct } from '../data/catalog'
import {
  BANKS, COD_FEE, COD_LIMIT, DELIVERY_FEE, EXPRESS_FEE, FREE_DELIVERY_ABOVE, GST_RATE, PROMOS, STATES,
  addDays, checkPincode, emiPlans, expiryValid, inr, luhn, newOrderId,
} from '../data/commerce'
import { imageOf } from '../data/images'
import { lineKey, linePrice, useNav, useStore } from '../store'
import { Stepper } from '../ui/bits'

const ease = [0.16, 1, 0.3, 1]
const STEPS = [['bag', 'Bag'], ['address', 'Address'], ['delivery', 'Delivery'], ['payment', 'Payment']]

function useTotals(promoCode, extraFee = 0) {
  const { state } = useStore()
  return useMemo(() => {
    const lines = state.bag.map((l) => ({ ...l, p: findProduct(l.id), unit: linePrice(l) }))
    const mrp = lines.reduce((n, l) => n + (l.p.mrp + (l.unit - l.p.price)) * l.qty, 0)
    const subtotal = lines.reduce((n, l) => n + l.unit * l.qty, 0)
    const promo = promoCode && PROMOS[promoCode] ? Math.round(PROMOS[promoCode].apply(subtotal)) : 0
    const after = subtotal - promo
    const deliveryFee = subtotal === 0 ? 0 : (state.delivery === 'express' ? EXPRESS_FEE : after >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE)
    const total = after + deliveryFee + extraFee
    const gst = total - total / (1 + GST_RATE)
    const maxDays = Math.max(0, ...lines.map((l) => l.p.deliveryDays))
    return { lines, mrp, subtotal, savings: mrp - subtotal, promo, deliveryFee, total, gst, count: lines.reduce((n, l) => n + l.qty, 0), maxDays }
  }, [state.bag, state.delivery, promoCode, extraFee])
}

function Summary({ t, cta, onCta, disabled, extraFee = 0, extraLabel }) {
  return (
    <aside className="gx-summary">
      <h3>Price details</h3>
      <dl>
        <div><dt>Price ({t.count} item{t.count === 1 ? '' : 's'})</dt><dd>{inr(t.mrp)}</dd></div>
        <div className="save"><dt>Discount</dt><dd>−{inr(t.savings)}</dd></div>
        {t.promo > 0 && <div className="save"><dt>Coupon</dt><dd>−{inr(t.promo)}</dd></div>}
        <div><dt>Delivery charges</dt><dd>{t.deliveryFee ? inr(t.deliveryFee) : <span className="save">Free</span>}</dd></div>
        {extraFee > 0 && <div><dt>{extraLabel}</dt><dd>{inr(extraFee)}</dd></div>}
        <div className="total"><dt>Total amount</dt><dd>{inr(t.total)}</dd></div>
        <div className="gst"><dt>Includes GST (18%)</dt><dd>{inr(t.gst)}</dd></div>
      </dl>
      {t.savings + t.promo > 0 && <p className="gx-saving">You save {inr(t.savings + t.promo)} on this order</p>}
      {cta && <button className="gx-btn dark wide" disabled={disabled} onClick={onCta}>{cta}</button>}
      <p className="gx-secure">🔒 Safe and secure payments · 100% genuine products</p>
    </aside>
  )
}

function Steps({ step }) {
  const nav = useNav()
  const idx = STEPS.findIndex(([s]) => s === step)
  return (
    <ol className="gx-steps">
      {STEPS.map(([s, label], i) => (
        <li key={s} className={i === idx ? 'on' : i < idx ? 'done' : ''}>
          <button disabled={i > idx} onClick={() => (s === 'bag' ? nav.go('bag') : nav.go('checkout', { step: s }))}><i>{i < idx ? '✓' : i + 1}</i>{label}</button>
        </li>
      ))}
    </ol>
  )
}

export function Bag() {
  const { state, dispatch } = useStore()
  const nav = useNav()
  const [code, setCode] = useState('')
  const [applied, setApplied] = useState('')
  const [err, setErr] = useState('')
  const t = useTotals(applied)

  const apply = (e) => {
    e.preventDefault()
    const c = code.trim().toUpperCase()
    const promo = PROMOS[c]
    if (!promo) { setErr('This coupon is not valid'); setApplied(''); return }
    if (promo.min && t.subtotal < promo.min) { setErr(`Add items worth ${inr(promo.min - t.subtotal)} more to use this coupon`); return }
    setErr('')
    setApplied(c)
    dispatch({ type: 'toast', text: `${c} applied` })
  }

  if (!state.bag.length) {
    return (
      <div className="gx-page gx-empty big">
        <h1>Your bag is empty</h1>
        <p>Explore a product, take it apart, then add it here.</p>
        <button className="gx-btn dark" onClick={() => nav.go('shop')}>Start shopping</button>
        {state.wishlist.length > 0 && <button className="gx-link" onClick={() => nav.go('wishlist')}>View your wishlist ({state.wishlist.length})</button>}
      </div>
    )
  }

  return (
    <div className="gx-page">
      <Steps step="bag" />
      <div className="gx-checkout">
        <div>
          <h1>Your bag <small>{t.count} item{t.count === 1 ? '' : 's'}</small></h1>
          <ul className="gx-lines">
            <AnimatePresence>
              {t.lines.map((l) => {
                const key = lineKey(l)
                const variant = [l.p.variants?.colors?.[l.color]?.name, l.size, l.p.variants?.extra?.options?.[l.extra]?.name].filter(Boolean).join(' · ')
                return (
                  <motion.li key={key} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40, height: 0 }} transition={{ duration: 0.4, ease }}>
                    <button className="gx-line-img" onClick={() => nav.go('product', { id: l.id })}><img src={imageOf(l.id)} alt="" /></button>
                    <div className="gx-line-info">
                      <b>{l.p.name}</b>
                      <small>{variant || l.p.brand}</small>
                      <span className="gx-price sm"><b>{inr(l.unit)}</b>{l.p.mrp > l.p.price && <s>{inr(l.p.mrp + (l.unit - l.p.price))}</s>}</span>
                      <small className="gx-deliv">Delivery by {addDays(l.p.deliveryDays)} · {l.p.returns}</small>
                      <div className="gx-row">
                        <Stepper value={l.qty} onChange={(q) => dispatch({ type: 'qty', key, qty: q })} />
                        <button className="gx-link" onClick={() => { if (!state.wishlist.includes(l.id)) dispatch({ type: 'wish', id: l.id }); dispatch({ type: 'remove', key }); dispatch({ type: 'toast', text: 'Moved to wishlist' }) }}>Move to wishlist</button>
                        <button className="gx-link" onClick={() => dispatch({ type: 'remove', key })}>Remove</button>
                      </div>
                    </div>
                    <strong>{inr(l.unit * l.qty)}</strong>
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </ul>
          <form className="gx-coupon" onSubmit={apply}>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code (try GLOARO10 or FIRST500)" aria-label="Coupon code" />
            <button className="gx-btn sm">Apply</button>
            {applied && <span className="gx-ok">✓ {applied}: {PROMOS[applied].label}</span>}
            {err && <span className="gx-err">{err}</span>}
          </form>
        </div>
        <Summary t={t} cta="Place order" onCta={() => nav.go('checkout', { step: 'address', promo: applied })} />
      </div>
    </div>
  )
}

const EMPTY_ADDR = { name: '', phone: '', pincode: '', line1: '', line2: '', city: '', state: 'Tamil Nadu', type: 'Home' }

function AddressStep({ next }) {
  const { state, dispatch } = useStore()
  const [a, setA] = useState(() => state.address || { ...EMPTY_ADDR, pincode: state.pincode || '' })
  const [errors, setErrors] = useState({})
  const set = (k) => (e) => setA({ ...a, [k]: k === 'pincode' || k === 'phone' ? e.target.value.replace(/\D/g, '') : e.target.value })
  const submit = (e) => {
    e.preventDefault()
    const n = {}
    if (a.name.trim().length < 2) n.name = 'Enter the full name'
    if (!/^[6-9]\d{9}$/.test(a.phone)) n.phone = 'Enter a 10-digit mobile number'
    if (!checkPincode(a.pincode).ok) n.pincode = 'Enter a valid 6-digit pincode'
    if (a.line1.trim().length < 5) n.line1 = 'Enter house number and street'
    if (a.city.trim().length < 2) n.city = 'Enter the city'
    setErrors(n)
    if (Object.keys(n).length) return
    dispatch({ type: 'address', address: a })
    next()
  }
  const f = (k, label, props = {}) => (
    <label className={`gx-field ${errors[k] ? 'err' : ''}`}>
      <span>{label}</span>
      <input value={a[k]} onChange={set(k)} {...props} />
      {errors[k] && <em>{errors[k]}</em>}
    </label>
  )
  return (
    <form className="gx-form" onSubmit={submit} noValidate>
      <h2>Delivery address</h2>
      <div className="gx-grid2">
        {f('name', 'Full name', { autoComplete: 'name' })}
        {f('phone', 'Mobile number', { inputMode: 'numeric', maxLength: 10, autoComplete: 'tel' })}
        {f('pincode', 'Pincode', { inputMode: 'numeric', maxLength: 6, autoComplete: 'postal-code' })}
        {f('city', 'City / Town', { autoComplete: 'address-level2' })}
      </div>
      {f('line1', 'House no., building, street', { autoComplete: 'address-line1' })}
      {f('line2', 'Area, landmark (optional)', { autoComplete: 'address-line2' })}
      <label className="gx-field"><span>State</span><select value={a.state} onChange={set('state')}>{STATES.map((s) => <option key={s}>{s}</option>)}</select></label>
      <div className="gx-chips">
        {['Home', 'Work'].map((t) => <button type="button" key={t} className={a.type === t ? 'on' : ''} aria-pressed={a.type === t} onClick={() => setA({ ...a, type: t })}>{t}</button>)}
      </div>
      <button className="gx-btn dark wide">Deliver here</button>
    </form>
  )
}

function DeliveryStep({ next, t }) {
  const { state, dispatch } = useStore()
  const pin = checkPincode(state.address?.pincode || '', t.maxDays)
  const options = [
    ['standard', 'Standard delivery', pin.ok ? `By ${pin.date}` : '', t.subtotal - t.promo >= FREE_DELIVERY_ABOVE ? 'Free' : inr(DELIVERY_FEE)],
    ['express', 'Express delivery', `By ${addDays(Math.max(1, (pin.days || 2) - 1))}`, inr(EXPRESS_FEE)],
  ]
  return (
    <div className="gx-form">
      <h2>Delivery</h2>
      <div className="gx-addr-card">
        <b>{state.address.name} <span>{state.address.type}</span></b>
        <p>{state.address.line1}{state.address.line2 ? `, ${state.address.line2}` : ''}, {state.address.city}, {state.address.state} {state.address.pincode}</p>
        <small>+91 {state.address.phone}</small>
      </div>
      <div className="gx-radio-cards">
        {options.map(([id, label, when, fee]) => (
          <label key={id} className={state.delivery === id ? 'on' : ''}>
            <input type="radio" name="delivery" checked={state.delivery === id} onChange={() => dispatch({ type: 'delivery', delivery: id })} />
            <span><b>{label}</b><small>{when}</small></span><em>{fee}</em>
          </label>
        ))}
      </div>
      <ul className="gx-mini-lines">{t.lines.map((l) => <li key={lineKey(l)}><img src={imageOf(l.id)} alt="" /><span>{l.p.name} × {l.qty}</span></li>)}</ul>
      <button className="gx-btn dark wide" onClick={next}>Continue to payment</button>
    </div>
  )
}

function PaymentStep({ t, method, setMethod, onPlace, placing }) {
  const [upi, setUpi] = useState('')
  const [app, setApp] = useState('')
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [bank, setBank] = useState('')
  const [emi, setEmi] = useState({ bank: BANKS[0], months: 3 })
  const [err, setErr] = useState({})
  const plans = emiPlans(t.total)
  const codOk = t.total <= COD_LIMIT

  const pay = (e) => {
    e.preventDefault()
    const n = {}
    if (method === 'upi' && !app && !/^[\w.-]{2,}@[a-z]{2,}$/i.test(upi.trim())) n.upi = 'Enter a valid UPI ID (like name@okhdfc) or choose an app'
    if (method === 'card') {
      if (!luhn(card.number)) n.number = 'Enter a valid card number'
      if (card.name.trim().length < 2) n.name = 'Enter the name on the card'
      if (!expiryValid(card.expiry)) n.expiry = 'Enter a valid expiry (MM/YY)'
      if (!/^\d{3,4}$/.test(card.cvv)) n.cvv = 'Enter the CVV'
    }
    if (method === 'netbanking' && !bank) n.bank = 'Choose your bank'
    if (method === 'cod' && !codOk) n.cod = `Cash on Delivery is available for orders up to ${inr(COD_LIMIT)}`
    setErr(n)
    if (Object.keys(n).length) return
    const detail = { upi: app || upi.trim(), card: `Card ending ${card.number.replace(/\D/g, '').slice(-4)}`, netbanking: bank, emi: `${emi.bank} EMI · ${emi.months} months`, cod: 'Cash on Delivery' }[method]
    onPlace(detail)
  }

  const methods = [['upi', 'UPI', 'Google Pay, PhonePe, Paytm, any UPI app'], ['card', 'Credit / Debit card', 'Visa, Mastercard, RuPay, Amex'], ['netbanking', 'Net Banking', 'All major banks'], ['emi', 'EMI', 'No-cost EMI on 3 and 6 months'], ['cod', 'Cash on Delivery', codOk ? `₹${COD_FEE} handling fee` : 'Not available for this order']]
  const fmtCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

  return (
    <form className="gx-form" onSubmit={pay} noValidate>
      <h2>Payment</h2>
      <div className="gx-pay">
        <div className="gx-pay-tabs" role="tablist">
          {methods.map(([id, label, hint]) => (
            <button type="button" role="tab" key={id} aria-selected={method === id} className={method === id ? 'on' : ''} onClick={() => { setMethod(id); setErr({}) }}>
              <b>{label}</b><small>{hint}</small>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={method} className="gx-pay-body" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            {method === 'upi' && (
              <>
                <div className="gx-chips">{['Google Pay', 'PhonePe', 'Paytm'].map((a) => <button type="button" key={a} className={app === a ? 'on' : ''} aria-pressed={app === a} onClick={() => { setApp(app === a ? '' : a); setUpi('') }}>{a}</button>)}</div>
                <p className="gx-or">or pay with a UPI ID</p>
                <label className={`gx-field ${err.upi ? 'err' : ''}`}><span>UPI ID</span><input value={upi} onChange={(e) => { setUpi(e.target.value); setApp('') }} placeholder="yourname@okhdfc" />{err.upi && <em>{err.upi}</em>}</label>
              </>
            )}
            {method === 'card' && (
              <div className="gx-grid2">
                <label className={`gx-field span2 ${err.number ? 'err' : ''}`}><span>Card number</span><input inputMode="numeric" value={card.number} onChange={(e) => setCard({ ...card, number: fmtCard(e.target.value) })} placeholder="4111 1111 1111 1111" autoComplete="cc-number" />{err.number && <em>{err.number}</em>}</label>
                <label className={`gx-field span2 ${err.name ? 'err' : ''}`}><span>Name on card</span><input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} autoComplete="cc-name" />{err.name && <em>{err.name}</em>}</label>
                <label className={`gx-field ${err.expiry ? 'err' : ''}`}><span>Expiry (MM/YY)</span><input inputMode="numeric" value={card.expiry} maxLength={5} onChange={(e) => { const d = e.target.value.replace(/\D/g, '').slice(0, 4); setCard({ ...card, expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d }) }} placeholder="08/28" autoComplete="cc-exp" />{err.expiry && <em>{err.expiry}</em>}</label>
                <label className={`gx-field ${err.cvv ? 'err' : ''}`}><span>CVV</span><input inputMode="numeric" type="password" maxLength={4} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })} autoComplete="cc-csc" />{err.cvv && <em>{err.cvv}</em>}</label>
              </div>
            )}
            {method === 'netbanking' && (
              <>
                <div className="gx-bank-grid">{BANKS.map((b) => <button type="button" key={b} className={bank === b ? 'on' : ''} aria-pressed={bank === b} onClick={() => setBank(b)}>{b}</button>)}</div>
                {err.bank && <p className="gx-err">{err.bank}</p>}
              </>
            )}
            {method === 'emi' && (
              <>
                <label className="gx-field"><span>Card issuer</span><select value={emi.bank} onChange={(e) => setEmi({ ...emi, bank: e.target.value })}>{BANKS.map((b) => <option key={b}>{b}</option>)}</select></label>
                <div className="gx-radio-cards">
                  {plans.map((pl) => (
                    <label key={pl.months} className={emi.months === pl.months ? 'on' : ''}>
                      <input type="radio" name="emi" checked={emi.months === pl.months} onChange={() => setEmi({ ...emi, months: pl.months })} />
                      <span><b>{inr(pl.monthly)} × {pl.months} months</b><small>{pl.noCost ? 'No-cost EMI' : `Interest ${inr(pl.interest)} at 15% p.a.`}</small></span>
                      <em>{inr(pl.monthly * pl.months)}</em>
                    </label>
                  ))}
                </div>
              </>
            )}
            {method === 'cod' && (codOk
              ? <p className="gx-note">Pay {inr(t.total)} in cash or by UPI when your order arrives. A ₹{COD_FEE} handling fee applies.</p>
              : <p className="gx-err">{err.cod || `Cash on Delivery is available for orders up to ${inr(COD_LIMIT)}.`}</p>)}
          </motion.div>
        </AnimatePresence>
      </div>
      <button className="gx-btn dark wide" disabled={placing || (method === 'cod' && !codOk)}>
        {placing ? 'Processing payment…' : method === 'cod' ? `Place order · ${inr(t.total)}` : `Pay ${inr(t.total)}`}
      </button>
      <p className="gx-secure">This is a prototype: no real payment is taken.</p>
    </form>
  )
}

export function Checkout() {
  const nav = useNav()
  const { state, dispatch } = useStore()
  const step = nav.params.get('step') || 'address'
  const promo = nav.params.get('promo') || ''
  const [method, setMethod] = useState('upi')
  const [placing, setPlacing] = useState(false)
  const codFee = method === 'cod' ? COD_FEE : 0
  const t = useTotals(promo, step === 'payment' ? codFee : 0)

  if (!state.bag.length && step !== 'done') {
    return <div className="gx-page gx-empty big"><h1>Nothing to check out</h1><button className="gx-btn dark" onClick={() => nav.go('shop')}>Browse products</button></div>
  }
  if (step !== 'address' && !state.address) {
    return <div className="gx-page gx-empty big"><h1>Add a delivery address first</h1><button className="gx-btn dark" onClick={() => nav.go('checkout', { step: 'address', promo })}>Add address</button></div>
  }

  const place = (detail) => {
    setPlacing(true)
    setTimeout(() => {
      const order = { id: newOrderId(), total: t.total, count: t.count, lines: t.lines.map((l) => ({ id: l.id, qty: l.qty, name: l.p.name })), address: state.address, payment: detail, method, deliveryBy: addDays(state.delivery === 'express' ? 1 : Math.max(2, t.maxDays)) }
      dispatch({ type: 'order', order })
      setPlacing(false)
      nav.go('done', {}, { replace: true })
    }, 1500)
  }

  return (
    <div className="gx-page">
      <Steps step={step} />
      <div className="gx-checkout">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.45, ease }}>
            {step === 'address' && <AddressStep next={() => nav.go('checkout', { step: 'delivery', promo })} />}
            {step === 'delivery' && <DeliveryStep t={t} next={() => nav.go('checkout', { step: 'payment', promo })} />}
            {step === 'payment' && <PaymentStep t={t} method={method} setMethod={setMethod} onPlace={place} placing={placing} />}
          </motion.div>
        </AnimatePresence>
        <Summary t={t} extraFee={step === 'payment' ? codFee : 0} extraLabel="COD handling fee" />
      </div>
    </div>
  )
}

export function Confirmation() {
  const { state } = useStore()
  const nav = useNav()
  const o = state.order
  if (!o) return <div className="gx-page gx-empty big"><h1>No recent order</h1><button className="gx-btn dark" onClick={() => nav.go('home')}>Back to the exhibition</button></div>
  const timeline = [['Order placed', 'Just now', true], ['Packed', 'Within 24 hours', false], ['Shipped', 'Tracking link by SMS', false], ['Delivered', o.deliveryBy, false]]
  return (
    <div className="gx-page gx-done">
      <motion.div className="gx-done-tick" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>✓</motion.div>
      <span className="gx-eyebrow">Order {o.id}</span>
      <h1>Thank you, {o.address.name.split(' ')[0]}.</h1>
      <p>Your order of {o.count} item{o.count === 1 ? '' : 's'} ({inr(o.total)}) is confirmed and arrives by <b>{o.deliveryBy}</b>.</p>
      <div className="gx-done-grid">
        <div><h3>Items</h3><ul className="gx-mini-lines">{o.lines.map((l) => <li key={l.id}><img src={imageOf(l.id)} alt="" /><span>{l.name} × {l.qty}</span></li>)}</ul></div>
        <div><h3>Delivering to</h3><p>{o.address.name}<br />{o.address.line1}, {o.address.city}<br />{o.address.state} {o.address.pincode}<br />+91 {o.address.phone}</p></div>
        <div><h3>Payment</h3><p>{o.payment}</p></div>
      </div>
      <ol className="gx-timeline">{timeline.map(([label, when, done]) => <li key={label} className={done ? 'done' : ''}><i /><b>{label}</b><small>{when}</small></li>)}</ol>
      <div className="gx-row wrap center">
        <button className="gx-btn dark" onClick={() => nav.go('shop')}>Continue shopping</button>
        <button className="gx-btn ghost" onClick={() => nav.go('home')}>Back to the exhibition</button>
      </div>
    </div>
  )
}
