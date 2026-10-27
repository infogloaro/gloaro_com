import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { BatteryFull, Bell, Bike, Check, ChevronLeft, Coffee, LayoutDashboard, MapPin, Minus, PackageCheck, Pizza, Plus, Sandwich, ShoppingBag, Signal, Smartphone, Soup, UtensilsCrossed, Wifi } from 'lucide-react'
import { ease, spring } from '../../../../lib/motion'

// Sample menu for a fictional restaurant.
const ITEMS = [
  { id: 'biryani', name: 'Veg biryani', cat: 'Meals', price: 180, Icon: Soup, tint: '#fde68a' },
  { id: 'dosa', name: 'Masala dosa', cat: 'Meals', price: 90, Icon: Sandwich, tint: '#fed7aa' },
  { id: 'pizza', name: 'Paneer pizza', cat: 'Snacks', price: 240, Icon: Pizza, tint: '#fecaca' },
  { id: 'coffee', name: 'Filter coffee', cat: 'Drinks', price: 40, Icon: Coffee, tint: '#e7d3c1' },
]
const CATS = ['All', 'Meals', 'Snacks', 'Drinks']
const DELIVERY = 30

const STATUSES = [
  { label: 'Confirmed', note: 'Restaurant accepted your order' },
  { label: 'Packed', note: 'Your food is packed and ready' },
  { label: 'Out for delivery', note: 'Rider is on the way' },
  { label: 'Delivered', note: 'Enjoy your meal!' },
]
const RIDER_AT = ['0%', '12%', '62%', '100%']
const ROUTE = 'M 14 70 C 50 70 46 24 92 26 S 140 64 186 22'
const STATUS_MS = 2200

// Older sample orders already in the admin feed.
const SEED = [
  { id: 1041, name: 'Arun', total: 270, status: 3 },
  { id: 1040, name: 'Meena', total: 130, status: 3 },
]

// Native-style screen push; `custom` is the direction so exits follow the latest one.
const SLIDE = {
  enter: (d) => ({ x: `${d * 100}%`, zIndex: 1 }),
  center: { x: '0%', opacity: 1, zIndex: 1 },
  exit: (d) => ({ x: `${d * -30}%`, opacity: 0.6, zIndex: 0 }),
}
const FADE = { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }

// Cart updater: change one item's quantity, dropping it at zero.
const bump = (id, delta) => (c) => {
  const qty = Math.max(0, (c[id] || 0) + delta)
  const next = { ...c, [id]: qty }
  if (!qty) delete next[id]
  return next
}

const TABS = [
  ['menu', 'Menu', UtensilsCrossed],
  ['cart', 'Cart', ShoppingBag],
  ['track', 'Orders', Bike],
]

export default function MobileDemo({ accent }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [platform, setPlatform] = useState('ios')
  const [screen, setScreen] = useState('menu')
  const [dir, setDir] = useState(1)
  const [cat, setCat] = useState('All')
  const [cart, setCart] = useState({})
  const [order, setOrder] = useState(null) // { id, total, status }
  const [feed, setFeed] = useState(SEED)
  const [toast, setToast] = useState(null)
  const script = useRef([])

  const stopScript = () => {
    script.current.forEach((id) => window.clearTimeout(id))
    script.current = []
  }

  const go = (next) => {
    const step = TABS.findIndex(([id]) => id === next) - TABS.findIndex(([id]) => id === screen)
    setDir(step >= 0 ? 1 : -1)
    setScreen(next)
  }

  const add = (id, delta = 1) => setCart(bump(id, delta))

  const count = Object.values(cart).reduce((a, b) => a + b, 0)
  const subtotal = ITEMS.reduce((sum, item) => sum + (cart[item.id] || 0) * item.price, 0)

  const placeOrder = () => {
    if (!count) return
    const placed = { id: (order?.id || 1041) + 1, total: subtotal + DELIVERY, status: 0 }
    setOrder(placed)
    setFeed((f) => [{ ...placed, name: 'You' }, ...f].slice(0, 4))
    setToast(STATUSES[0])
    setCart({})
    setDir(1)
    setScreen('track')
  }

  // Latest placeOrder for the scripted run (its timers outlive renders).
  const placeRef = useRef(placeOrder)
  useEffect(() => {
    placeRef.current = placeOrder
  })

  // Scripted first run: add two dishes, open the cart, place the order.
  useEffect(() => {
    if (!inView) return undefined
    const t = (ms, fn) => script.current.push(window.setTimeout(fn, reduce ? 0 : ms))
    t(700, () => setCart(bump('biryani', 1)))
    t(1400, () => setCart(bump('coffee', 1)))
    t(2300, () => { setDir(1); setScreen('cart') })
    t(3300, () => setCart(bump('coffee', 1)))
    t(4300, () => placeRef.current())
    return stopScript
  }, [inView, reduce])

  // Advance the live order status; the admin feed mirrors every change.
  useEffect(() => {
    if (!order || order.status >= STATUSES.length - 1) return undefined
    const id = window.setTimeout(() => {
      const status = order.status + 1
      setOrder((o) => ({ ...o, status }))
      setFeed((f) => f.map((row) => (row.id === order.id ? { ...row, status } : row)))
      setToast(STATUSES[status])
    }, reduce ? 0 : STATUS_MS)
    return () => window.clearTimeout(id)
  }, [order, reduce])

  // Push notifications hide on their own.
  useEffect(() => {
    if (!toast) return undefined
    const id = window.setTimeout(() => setToast(null), 1900)
    return () => window.clearTimeout(id)
  }, [toast])

  // Any tap from the visitor ends the scripted run.
  const user = (fn) => (...args) => { stopScript(); fn(...args) }

  const ios = platform === 'ios'
  const slide = reduce ? { duration: 0 } : { duration: 0.38, ease: ease.entrance }

  return (
    <div ref={ref} className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
      {/* Phone */}
      <div className="relative flex min-w-0 items-center justify-center overflow-hidden rounded-[28px] border border-[#08224B]/10 bg-white px-4 py-6 shadow-[0_30px_70px_-35px_rgba(8,34,75,0.55)]">
        <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(circle at 50% 40%, ${accent}26, transparent 65%)` }} />
        <motion.div
          layout
          transition={spring.surface}
          className={`relative h-[500px] w-[250px] shrink-0 bg-[#0b1220] p-[9px] shadow-[0_30px_60px_-25px_rgba(8,34,75,0.75)] ${ios ? 'rounded-[44px]' : 'rounded-[30px]'}`}
        >
          <div className={`relative flex h-full flex-col overflow-hidden bg-slate-50 ${ios ? 'rounded-[36px]' : 'rounded-[22px]'}`}>
            <StatusBar ios={ios} />

            <AnimatePresence>
              {toast && (
                <motion.div
                  key={toast.label}
                  initial={reduce ? { opacity: 0 } : { y: -70, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { y: -70, opacity: 0 }}
                  transition={reduce ? { duration: 0 } : spring.interactive}
                  className={`absolute inset-x-2 top-8 z-30 flex items-center gap-2 bg-white/95 px-2.5 py-2 shadow-lg backdrop-blur ${ios ? 'rounded-2xl' : 'rounded-xl'}`}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-white" style={{ background: accent }}><Bell className="h-3.5 w-3.5" /></span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-[#08224B]">Order {toast.label.toLowerCase()}</p>
                    <p className="truncate text-[9px] font-semibold text-slate-500">{toast.note}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative min-h-0 flex-1 overflow-hidden">
              <AnimatePresence initial={false} custom={dir}>
                <motion.div
                  key={screen}
                  custom={dir}
                  variants={reduce ? FADE : SLIDE}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={slide}
                  className="absolute inset-0 overflow-hidden bg-slate-50"
                >
                  {screen === 'menu' && <MenuScreen cat={cat} setCat={user(setCat)} cart={cart} add={user(add)} accent={accent} />}
                  {screen === 'cart' && <CartScreen cart={cart} add={user(add)} subtotal={subtotal} back={user(() => go('menu'))} place={placeOrder} accent={accent} />}
                  {screen === 'track' && <TrackScreen order={order} accent={accent} reduce={reduce} browse={user(() => go('menu'))} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Tab bar */}
            <nav className="relative z-10 grid grid-cols-3 border-t border-slate-200 bg-white">
              {TABS.map(([id, label, Icon]) => (
                <button key={id} type="button" onClick={user(() => go(id))} className="relative flex min-h-11 flex-col items-center justify-center gap-0.5 text-[9px] font-bold" style={{ color: screen === id ? accent : '#94a3b8' }}>
                  <span className="relative">
                    <Icon className="h-4 w-4" />
                    {id === 'cart' && count > 0 && (
                      <motion.span key={count} initial={{ scale: reduce ? 1 : 0.4 }} animate={{ scale: 1 }} transition={spring.interactive} className="absolute -right-2 -top-1.5 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-[#ffae13] px-0.5 text-[8px] font-black text-[#061633]">
                        {count}
                      </motion.span>
                    )}
                  </span>
                  {label}
                </button>
              ))}
            </nav>
            <SystemNav ios={ios} />
          </div>
        </motion.div>
      </div>

      {/* What powers it */}
      <div className="min-w-0 rounded-[28px] bg-[#061633] p-5 text-white shadow-[0_30px_70px_-35px_rgba(6,22,51,0.8)]">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ffd98a]">What powers it</p>
        <p className="mt-3 font-outfit text-lg font-extrabold">Android + iOS from one codebase</p>
        <p className="mt-1 text-xs font-semibold text-white/55">Switch the platform: the same app adapts to each system&apos;s status bar, navigation and shapes.</p>
        <div className="mt-4 inline-flex rounded-full bg-white/10 p-1" role="group" aria-label="Platform">
          {[['ios', 'iOS'], ['android', 'Android']].map(([id, label]) => (
            <button key={id} type="button" aria-pressed={platform === id} onClick={() => setPlatform(id)} className={`relative flex min-h-9 items-center gap-1.5 rounded-full px-4 text-xs font-bold transition active:scale-95 ${platform === id ? 'text-[#061633]' : 'text-white/70'}`}>
              {platform === id && <motion.span layoutId="mobile-platform-pill" transition={spring.interactive} className="absolute inset-0 rounded-full bg-[#ffae13]" />}
              <Smartphone className="relative h-3.5 w-3.5" />
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4 text-[#ffd98a]" />
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/50">Admin panel · live orders</p>
        </div>
        <ul className="mt-3 space-y-2">
          <AnimatePresence initial={false}>
            {feed.map((row) => {
              const fresh = order && row.id === order.id
              const delivered = row.status === STATUSES.length - 1
              return (
                <motion.li
                  key={row.id}
                  layout
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: -16, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={reduce ? { duration: 0 } : spring.interactive}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition-colors duration-300 ${fresh ? 'border-[#ffae13]/50 bg-[#ffae13]/10' : 'border-white/10 bg-white/5'}`}
                >
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${delivered ? 'bg-emerald-400 text-[#061633]' : 'bg-[#ffae13] text-[#061633]'}`}>
                    {delivered ? <PackageCheck className="h-4 w-4" /> : <Bike className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold">#{row.id} · {row.name}</p>
                    <p className={`text-[10px] font-semibold ${delivered ? 'text-emerald-300' : 'text-[#ffd98a]'}`}>{STATUSES[row.status].label}</p>
                  </div>
                  <span className="text-xs font-black tabular-nums">₹{row.total}</span>
                  {fresh && <span className="rounded-full bg-[#ffae13] px-1.5 py-0.5 text-[8px] font-black uppercase text-[#061633]">New</span>}
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>
        {!order && <p className="mt-3 text-[11px] font-semibold text-white/45">Place an order in the app to see it arrive here instantly.</p>}
      </div>
    </div>
  )
}

function StatusBar({ ios }) {
  return (
    <div className="relative z-20 flex h-7 shrink-0 items-center justify-between bg-white px-4 text-[10px] font-bold text-[#08224B]">
      <span>{ios ? '9:41' : '12:30'}</span>
      {ios ? (
        <span className="absolute left-1/2 top-1.5 h-[18px] w-[70px] -translate-x-1/2 rounded-full bg-[#0b1220]" />
      ) : (
        <span className="absolute left-1/2 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#0b1220]" />
      )}
      <span className="flex items-center gap-1">
        <Signal className="h-3 w-3" />
        <Wifi className="h-3 w-3" />
        <BatteryFull className={ios ? 'h-3.5 w-3.5' : 'h-3 w-3 rotate-[-90deg]'} />
      </span>
    </div>
  )
}

function SystemNav({ ios }) {
  if (ios) {
    return <div className="flex h-5 shrink-0 items-center justify-center bg-white"><span className="h-1 w-24 rounded-full bg-[#0b1220]" /></div>
  }
  return (
    <div className="flex h-6 shrink-0 items-center justify-around bg-white px-10 text-slate-500">
      <ChevronLeft className="h-3.5 w-3.5" />
      <span className="h-2.5 w-2.5 rounded-full border-2 border-current" />
      <span className="h-2.5 w-2.5 rounded-[3px] border-2 border-current" />
    </div>
  )
}

function MenuScreen({ cat, setCat, cart, add, accent }) {
  const items = ITEMS.filter((i) => cat === 'All' || i.cat === cat)
  return (
    <div className="h-full p-3">
      <p className="text-[9px] font-bold text-slate-400">Delivering to Fairlands</p>
      <p className="font-outfit text-base font-extrabold text-[#08224B]">Spice Route Kitchen</p>
      <div className="mt-2 flex gap-1.5 overflow-hidden">
        {CATS.map((c) => (
          <button key={c} type="button" onClick={() => setCat(c)} className={`min-h-7 shrink-0 rounded-full px-2.5 text-[10px] font-bold transition active:scale-95 ${cat === c ? 'text-white' : 'bg-white text-[#08224B] shadow-sm'}`} style={cat === c ? { background: accent } : undefined}>
            {c}
          </button>
        ))}
      </div>
      <div className="mt-3 space-y-2">
        <AnimatePresence initial={false}>
          {items.map(({ id, name, price, Icon, tint }) => (
            <motion.div key={id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="flex items-center gap-2.5 rounded-2xl bg-white p-2 shadow-sm">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[#08224B]/70" style={{ background: tint }}><Icon className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-extrabold text-[#08224B]">{name}</p>
                <p className="text-[10px] font-bold text-slate-500">₹{price}</p>
              </div>
              {cart[id] ? (
                <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-black text-emerald-600">×{cart[id]}</span>
              ) : null}
              <button type="button" aria-label={`Add ${name}`} onClick={() => add(id)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white transition active:scale-90" style={{ background: accent }}>
                <Plus className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function CartScreen({ cart, add, subtotal, back, place, accent }) {
  const lines = ITEMS.filter((i) => cart[i.id])
  return (
    <div className="flex h-full flex-col p-3">
      <div className="flex items-center gap-1">
        <button type="button" aria-label="Back to menu" onClick={back} className="grid h-8 w-8 place-items-center rounded-full text-[#08224B]"><ChevronLeft className="h-4 w-4" /></button>
        <p className="font-outfit text-base font-extrabold text-[#08224B]">Your cart</p>
      </div>
      {lines.length === 0 ? (
        <div className="grid flex-1 place-items-center text-center">
          <div>
            <ShoppingBag className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-2 text-[11px] font-bold text-slate-400">Your cart is empty</p>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-2 flex-1 space-y-2">
            {lines.map(({ id, name, price }) => (
              <motion.div key={id} layout className="flex items-center gap-2 rounded-2xl bg-white p-2.5 shadow-sm">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-extrabold text-[#08224B]">{name}</p>
                  <p className="text-[10px] font-bold text-slate-500">₹{price * cart[id]}</p>
                </div>
                <div className="flex items-center rounded-full border border-slate-200">
                  <button type="button" aria-label={`Remove one ${name}`} onClick={() => add(id, -1)} className="grid h-7 w-7 place-items-center text-[#08224B]"><Minus className="h-3 w-3" /></button>
                  <motion.span key={cart[id]} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-4 text-center text-[11px] font-black text-[#08224B]">{cart[id]}</motion.span>
                  <button type="button" aria-label={`Add one ${name}`} onClick={() => add(id)} className="grid h-7 w-7 place-items-center text-[#08224B]"><Plus className="h-3 w-3" /></button>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="space-y-1 rounded-2xl bg-white p-3 text-[10px] font-semibold text-slate-500 shadow-sm">
            <p className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></p>
            <p className="flex justify-between"><span>Delivery</span><span>₹{DELIVERY}</span></p>
            <p className="flex justify-between border-t border-slate-100 pt-1 text-xs font-black text-[#08224B]"><span>Total</span><span className="tabular-nums">₹{subtotal + DELIVERY}</span></p>
          </div>
          <button type="button" onClick={place} className="mt-2 min-h-10 rounded-full text-xs font-extrabold text-white transition active:scale-95" style={{ background: accent }}>
            Place order
          </button>
        </>
      )}
    </div>
  )
}

function TrackScreen({ order, accent, reduce, browse }) {
  if (!order) {
    return (
      <div className="grid h-full place-items-center p-4 text-center">
        <div>
          <Bike className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-2 text-[11px] font-bold text-slate-400">No orders yet</p>
          <button type="button" onClick={browse} className="mt-3 min-h-9 rounded-full px-4 text-[11px] font-bold text-white" style={{ background: accent }}>Browse menu</button>
        </div>
      </div>
    )
  }
  return (
    <div className="h-full p-3">
      <p className="text-[9px] font-bold text-slate-400">Order #{order.id} · ₹{order.total}</p>
      <p className="font-outfit text-base font-extrabold text-[#08224B]">{STATUSES[order.status].label}</p>

      {/* Map with the rider moving along the route */}
      <div className="relative mt-2 h-[92px] w-[200px] max-w-full overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#e0f2fe,#ecfdf5)]">
        <svg width="200" height="92" viewBox="0 0 200 92" className="absolute inset-0">
          <path d={ROUTE} fill="none" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
          <motion.path
            d={ROUTE}
            fill="none"
            stroke={accent}
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: parseFloat(RIDER_AT[order.status]) / 100 }}
            transition={reduce ? { duration: 0 } : { duration: 1.2, ease: ease.entrance }}
          />
        </svg>
        <MapPin className="absolute h-4 w-4 text-rose-500" style={{ left: 178, top: 6 }} />
        <motion.span
          className="absolute left-0 top-0 grid h-6 w-6 place-items-center rounded-full bg-[#08224B] text-white shadow-md"
          style={{ offsetPath: `path('${ROUTE}')`, offsetRotate: '0deg' }}
          initial={{ offsetDistance: '0%' }}
          animate={{ offsetDistance: RIDER_AT[order.status] }}
          transition={reduce ? { duration: 0 } : { duration: 1.2, ease: ease.entrance }}
        >
          <Bike className="h-3 w-3" />
        </motion.span>
      </div>

      <ol className="mt-3 space-y-0">
        {STATUSES.map((s, i) => {
          const done = order.status >= i
          return (
            <li key={s.label} className="relative flex gap-2.5 pb-2.5 last:pb-0">
              {i < STATUSES.length - 1 && <span className={`absolute left-[9px] top-5 h-[calc(100%-14px)] w-0.5 transition-colors duration-500 ${order.status > i ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
              <span className={`relative grid h-5 w-5 shrink-0 place-items-center rounded-full transition-colors duration-500 ${done ? 'bg-emerald-400 text-white' : 'bg-slate-200 text-transparent'}`}>
                {done && <motion.span initial={{ scale: reduce ? 1 : 0 }} animate={{ scale: 1 }} transition={spring.interactive}><Check className="h-3 w-3" /></motion.span>}
              </span>
              <div className="min-w-0">
                <p className={`text-[11px] font-extrabold ${done ? 'text-[#08224B]' : 'text-slate-400'}`}>{s.label}</p>
                {order.status === i && <p className="text-[9px] font-semibold text-slate-500">{s.note}</p>}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
