import {
  Bell,
  BarChart3,
  Boxes,
  ChevronRight,
  CircleCheck,
  ClipboardList,
  Eye,
  Heart,
  House,
  LayoutGrid,
  Lock,
  MapPin,
  Mic,
  Minus,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Smartphone,
  Truck,
  User,
  Wallet,
} from 'lucide-react'
import { Emblem, MartLogo, MIcon, Stars, StatusBar } from './primitives'
import { categories, formatINR, products, searchResults, vendors } from './martData'

/* ---------------- Small building blocks ---------------- */

export function ProductTile({ product, size = 'md' }) {
  const small = size === 'sm'
  return (
    <div className="overflow-hidden rounded-2xl border border-white bg-white/90 shadow-[0_10px_24px_-16px_rgba(11,36,81,0.35)]">
      <div className={`relative grid place-items-center bg-gradient-to-br ${product.tone} ${small ? 'h-16' : 'h-24'}`}>
        <MIcon name={product.icon} className={`${small ? 'h-7 w-7' : 'h-10 w-10'} ${product.ink} drop-shadow-sm`} strokeWidth={1.6} />
        <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-white/85">
          <Heart className="h-2.5 w-2.5 text-[#0b469e]" aria-hidden="true" />
        </span>
      </div>
      <div className={small ? 'p-1.5' : 'p-2.5'}>
        <p className={`truncate font-bold text-[#0b2451] ${small ? 'text-[8.5px]' : 'text-[11px]'}`}>{product.name}</p>
        <p className={`truncate text-[#51627f] ${small ? 'text-[7px]' : 'text-[9px]'}`}>{product.seller} · {product.distance}</p>
        <div className="mt-1 flex items-center justify-between">
          <span className={`font-extrabold text-[#0b2451] ${small ? 'text-[9px]' : 'text-xs'}`}>{formatINR(product.price)}</span>
          <Stars value={product.rating} className={small ? 'text-[7px]' : 'text-[9px]'} />
        </div>
      </div>
    </div>
  )
}

function MobileSearchField({ text = 'Search products, stores…', active = false }) {
  return (
    <div className={`m-field mx-4 flex items-center gap-2 rounded-full px-3 py-2 ${active ? 'ring-1 ring-[#ffae13]/70' : ''}`}>
      <Search className="h-3.5 w-3.5 text-[#0b469e]" aria-hidden="true" />
      <span className={`flex-1 truncate text-[9.5px] ${active ? 'font-semibold text-[#0b2451]' : 'text-[#7a8aa6]'}`}>{text}</span>
      <Mic className="h-3.5 w-3.5 text-[#0b469e]" aria-hidden="true" />
    </div>
  )
}

function TabBar({ active = 'Home' }) {
  const tabs = [
    [House, 'Home'],
    [LayoutGrid, 'Categories'],
    [ShoppingCart, 'Cart'],
    [Package, 'Orders'],
    [User, 'Profile'],
  ]
  return (
    <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl border border-white/90 bg-white/80 px-3 py-2 shadow-[0_10px_30px_-12px_rgba(11,36,81,0.35)] backdrop-blur-xl">
      {tabs.map(([Icon, label]) => (
        <span key={label} className={`flex flex-col items-center gap-0.5 text-[7px] font-bold ${label === active ? 'text-[#0b469e]' : 'text-[#94a3b8]'}`}>
          <span className={`grid h-6 w-6 place-items-center rounded-full ${label === active ? 'bg-[#0b469e]/10' : ''}`}>
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          {label}
        </span>
      ))}
    </div>
  )
}

function MobileHeader() {
  return (
    <div className="flex items-center justify-between px-4 pb-2 pt-4">
      <div className="flex items-center gap-1.5">
        <Emblem className="h-6 w-6" />
        <div className="leading-none">
          <p className="font-urbanist text-[11px] font-extrabold tracking-wide text-[#0b2451]">GLOARO <span className="text-[#ffae13]">MART</span></p>
          <p className="mt-0.5 flex items-center gap-0.5 text-[7.5px] font-semibold text-[#51627f]"><MapPin className="h-2 w-2" aria-hidden="true" />Anna Nagar, Chennai</p>
        </div>
      </div>
      <span className="relative grid h-7 w-7 place-items-center rounded-full bg-white/90 shadow-sm">
        <Bell className="h-3.5 w-3.5 text-[#0b2451]" aria-hidden="true" />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#ff8a00]" />
      </span>
    </div>
  )
}

/* ---------------- Mobile screens ---------------- */

export function MobileHomeScreen() {
  return (
    <div className="relative h-full">
      <StatusBar />
      <MobileHeader />
      <MobileSearchField />
      <div className="mt-3 grid grid-cols-4 gap-2 px-4">
        {categories.slice(0, 4).map((c) => (
          <span key={c.label} className="flex flex-col items-center gap-1 text-[7.5px] font-bold text-[#0b2451]">
            <span className="m-icon-well grid h-9 w-9 place-items-center rounded-2xl text-[#0b469e]"><MIcon name={c.icon} className="h-4 w-4" /></span>
            {c.label}
          </span>
        ))}
      </div>
      <div className="relative mx-4 mt-3 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#0b2451,#0b469e_60%,#1b6fe0)] p-3 text-white">
        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#ffae13]/30 blur-xl" />
        <p className="text-[7px] font-extrabold uppercase tracking-[0.2em] text-[#ffd36e]">This week</p>
        <p className="mt-1 font-urbanist text-[13px] font-extrabold leading-tight">Local favourites,<br />delivered to you</p>
        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#ffae13] px-2 py-0.5 text-[7.5px] font-extrabold text-[#0b2451]">Shop now <ChevronRight className="h-2 w-2" aria-hidden="true" /></span>
      </div>
      <div className="mt-3 flex items-center justify-between px-4">
        <p className="text-[10px] font-extrabold text-[#0b2451]">Popular near you</p>
        <p className="text-[8px] font-bold text-[#0b469e]">See all</p>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 px-4">
        <ProductTile product={products[0]} size="sm" />
        <ProductTile product={products[2]} size="sm" />
      </div>
      <TabBar />
    </div>
  )
}

export function MobileSearchScreen() {
  return (
    <div className="relative h-full">
      <StatusBar />
      <div className="px-4 pb-2 pt-4">
        <p className="font-urbanist text-sm font-extrabold text-[#0b2451]">Smart Search</p>
        <p className="text-[8px] text-[#51627f]">Describe what you need</p>
      </div>
      <MobileSearchField text="earbuds under ₹3,000 near me" active />
      <div className="mt-2 flex flex-wrap gap-1 px-4">
        {['Earbuds', 'Under ₹3,000', 'Within 5 km'].map((chip) => (
          <span key={chip} className="rounded-full bg-[#0b469e]/10 px-2 py-0.5 text-[7.5px] font-bold text-[#0b469e]">{chip}</span>
        ))}
      </div>
      <div className="mt-3 space-y-2 px-4">
        {searchResults.map((r) => (
          <div key={r.name} className="flex items-center gap-2 rounded-2xl border border-white bg-white/90 p-2 shadow-[0_8px_20px_-14px_rgba(11,36,81,0.4)]">
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${r.tone}`}><MIcon name={r.icon} className="h-5 w-5 text-[#0b469e]" /></span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[9px] font-bold text-[#0b2451]">{r.name}</span>
              <span className="block truncate text-[7.5px] text-[#51627f]">{r.seller} · {r.distance}</span>
              <span className="mt-0.5 flex items-center gap-2">
                <span className="text-[9.5px] font-extrabold text-[#0b2451]">{formatINR(r.price)}</span>
                <Stars value={r.rating} className="text-[7.5px]" />
              </span>
            </span>
          </div>
        ))}
      </div>
      <TabBar active="Categories" />
    </div>
  )
}

export function MobileCartScreen() {
  const items = [products[0], products[3]]
  return (
    <div className="relative h-full">
      <StatusBar />
      <div className="px-4 pb-2 pt-4">
        <p className="font-urbanist text-sm font-extrabold text-[#0b2451]">Your Cart</p>
        <p className="text-[8px] text-[#51627f]">2 items · 2 sellers</p>
      </div>
      <div className="space-y-2 px-4">
        {items.map((p) => (
          <div key={p.id} className="flex items-center gap-2 rounded-2xl border border-white bg-white/90 p-2 shadow-[0_8px_20px_-14px_rgba(11,36,81,0.4)]">
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${p.tone}`}><MIcon name={p.icon} className={`h-5 w-5 ${p.ink}`} /></span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[9px] font-bold text-[#0b2451]">{p.name}</span>
              <span className="block text-[7.5px] text-[#51627f]">{p.seller}</span>
              <span className="text-[9.5px] font-extrabold text-[#0b2451]">{formatINR(p.price)}</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-[#eef4ff] px-1.5 py-1 text-[8px] font-bold text-[#0b2451]">
              <Minus className="h-2.5 w-2.5" aria-hidden="true" />1<Plus className="h-2.5 w-2.5" aria-hidden="true" />
            </span>
          </div>
        ))}
      </div>
      <div className="mx-4 mt-3 rounded-2xl border border-dashed border-[#ffae13]/70 bg-[#fff8e7] px-3 py-2 text-[8px] font-bold text-[#b45309]">Coupon applied · WELCOME</div>
      <div className="mx-4 mt-3 space-y-1 rounded-2xl bg-white/90 p-3 text-[8.5px] text-[#51627f]">
        <p className="flex justify-between"><span>Subtotal</span><span className="font-bold text-[#0b2451]">{formatINR(3148)}</span></p>
        <p className="flex justify-between"><span>Delivery</span><span className="font-bold text-emerald-600">Free</span></p>
        <p className="flex justify-between border-t border-slate-100 pt-1 text-[10px]"><span className="font-bold text-[#0b2451]">Total</span><span className="font-extrabold text-[#0b2451]">{formatINR(3048)}</span></p>
      </div>
      <div className="m-btn m-btn-navy absolute inset-x-4 bottom-[4.6rem] py-2.5 text-[10px]"><Lock className="h-3 w-3" aria-hidden="true" />Secure Checkout</div>
      <TabBar active="Cart" />
    </div>
  )
}

export function MobileTrackScreen() {
  const steps = [
    ['Order placed', '10:12 AM', true],
    ['Packed by seller', '10:40 AM', true],
    ['Out for delivery', '11:05 AM', true],
    ['Delivered', 'Pending', false],
  ]
  return (
    <div className="relative h-full">
      <StatusBar />
      <div className="px-4 pb-2 pt-4">
        <p className="font-urbanist text-sm font-extrabold text-[#0b2451]">Track Order</p>
        <p className="text-[8px] text-[#51627f]">#GM-20481 · Fresh Mart</p>
      </div>
      <div className="relative mx-4 h-28 overflow-hidden rounded-2xl bg-[#e7f0ff]">
        <svg viewBox="0 0 200 110" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path d="M0 80 Q60 60 100 70 T200 40" stroke="#fff" strokeWidth="10" fill="none" />
          <path d="M40 0 Q50 60 30 110" stroke="#fff" strokeWidth="8" fill="none" />
          <path d="M20 88 Q70 60 110 66 T170 34" stroke="#0b469e" strokeWidth="2.5" strokeDasharray="4 4" fill="none" className="m-dash" />
          <circle cx="20" cy="88" r="5" fill="#0b2451" />
          <circle cx="170" cy="34" r="6" fill="#ffae13" stroke="#fff" strokeWidth="2" />
        </svg>
        <span className="absolute left-[46%] top-[42%] grid h-7 w-7 place-items-center rounded-full bg-white shadow-md"><Truck className="h-3.5 w-3.5 text-[#0b469e]" aria-hidden="true" /></span>
      </div>
      <div className="mx-4 mt-3 rounded-2xl bg-white/90 p-3">
        {steps.map(([label, time, done], i) => (
          <div key={label} className="relative flex gap-2 pb-2.5 last:pb-0">
            {i < steps.length - 1 && <span className={`absolute left-[6px] top-3.5 h-full w-[2px] ${steps[i + 1][2] ? 'bg-[#0b469e]' : 'bg-slate-200'}`} />}
            <span className={`relative z-10 mt-0.5 grid h-3.5 w-3.5 place-items-center rounded-full ${done ? 'bg-[#0b469e]' : 'border-2 border-slate-300 bg-white'}`}>
              {done && <CircleCheck className="h-2.5 w-2.5 text-white" aria-hidden="true" />}
            </span>
            <span className="flex-1">
              <span className={`block text-[9px] font-bold ${done ? 'text-[#0b2451]' : 'text-[#94a3b8]'}`}>{label}</span>
              <span className="block text-[7.5px] text-[#51627f]">{time}</span>
            </span>
          </div>
        ))}
      </div>
      <TabBar active="Orders" />
    </div>
  )
}

/* The GLOARO MART app sign-in, rendered as UI (not a working form). */
export function MobileLoginScreen() {
  return (
    <div className="relative h-full overflow-hidden bg-[linear-gradient(180deg,#e6f0ff_0%,#f6faff_45%,#ffffff_100%)]">
      <StatusBar />
      <div className="mt-4 flex flex-col items-center">
        <Emblem className="h-10 w-10" />
        <p className="mt-1 font-urbanist text-lg font-extrabold tracking-[0.06em] text-[#0b2451]">GLOARO</p>
        <p className="flex items-center gap-1 font-urbanist text-[9px] font-extrabold tracking-[0.4em] text-[#ffae13]"><span className="h-[1.5px] w-3 bg-[#ffae13]" />MART<span className="h-[1.5px] w-3 bg-[#ffae13]" /></p>
        <p className="mt-0.5 text-[7.5px] text-[#51627f]">One ecosystem</p>
      </div>
      <div className="px-5 pt-3">
        <p className="font-urbanist text-base font-extrabold text-[#0b2451]">Get Started</p>
        <p className="text-[9px] text-[#51627f]">Log in to your account</p>
      </div>
      <div className="m-glass-gold mx-4 mt-2.5 space-y-2 rounded-[20px] p-3">
        <div className="m-field flex items-center gap-2 rounded-full p-1">
          <span className="m-icon-well grid h-6 w-6 place-items-center rounded-full"><Smartphone className="h-3 w-3 text-[#0b2451]" aria-hidden="true" /></span>
          <span className="flex-1 text-[8.5px] text-[#7a8aa6]">Mobile Number</span>
          <span className="pr-2 text-[8.5px] font-bold text-[#0b2451]">+91</span>
        </div>
        <div className="m-field flex items-center gap-2 rounded-full p-1">
          <span className="m-icon-well grid h-6 w-6 place-items-center rounded-full"><Lock className="h-3 w-3 text-[#0b2451]" aria-hidden="true" /></span>
          <span className="flex-1 text-[8.5px] text-[#7a8aa6]">Password</span>
          <Eye className="mr-2 h-3 w-3 text-[#51627f]" aria-hidden="true" />
        </div>
        <div className="flex items-center justify-between text-[7.5px] font-semibold">
          <span className="flex items-center gap-1 text-[#0b2451]"><span className="grid h-3 w-3 place-items-center rounded bg-[#1b6fe0] text-[6px] text-white">✓</span>Remember me</span>
          <span className="text-[#ffae13]">Forgot Password?</span>
        </div>
        <div className="m-btn m-btn-navy w-full py-2 text-[10px]">Log In →</div>
        <p className="text-center text-[7px] font-bold text-[#94a3b8]">OR</p>
        <div className="m-btn m-btn-glass w-full py-1.5 text-[9px]">
          <span className="font-black text-[#4285F4]">G</span> Continue with Google
        </div>
      </div>
      <svg viewBox="0 0 300 70" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-14 w-full" aria-hidden="true">
        <path d="M0 30 C 80 70, 180 70, 300 10 L300 70 L0 70 Z" fill="#0b2451" />
        <path d="M90 70 C 170 64, 240 40, 300 14" stroke="#ffae13" strokeWidth="3" fill="none" />
      </svg>
    </div>
  )
}

/* ---------------- Web screens ---------------- */

export function WebHomeScreen() {
  return (
    <div className="bg-[linear-gradient(180deg,#f2f7ff,#ffffff)] p-3 sm:p-4">
      <div className="flex items-center gap-3">
        <MartLogo compact className="hidden shrink-0 scale-90 sm:inline-flex" />
        <Emblem className="h-7 w-7 sm:hidden" />
        <div className="m-field flex flex-1 items-center gap-2 rounded-full px-3 py-1.5">
          <Search className="h-3.5 w-3.5 text-[#0b469e]" aria-hidden="true" />
          <span className="flex-1 truncate text-[10px] text-[#7a8aa6]">Search products, brands and stores near you</span>
          <span className="hidden rounded-full bg-[#0b2451] px-2 py-0.5 text-[8px] font-bold text-white sm:inline">Search</span>
        </div>
        <span className="flex items-center gap-1.5 text-[#0b2451]">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white shadow-sm"><Heart className="h-3.5 w-3.5" aria-hidden="true" /></span>
          <span className="relative grid h-7 w-7 place-items-center rounded-full bg-white shadow-sm">
            <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="absolute -right-0.5 -top-0.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-[#ffae13] text-[7px] font-extrabold">2</span>
          </span>
        </span>
      </div>
      <div className="m-no-scrollbar mt-3 flex gap-1.5 overflow-hidden">
        {categories.slice(0, 8).map((c, i) => (
          <span key={c.label} className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold ${i === 0 ? 'bg-[#0b2451] text-white' : 'bg-white text-[#0b2451] shadow-sm'}`}>
            <MIcon name={c.icon} className="h-3 w-3" />{c.label}
          </span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div className="relative col-span-2 overflow-hidden rounded-2xl bg-[linear-gradient(120deg,#0b2451,#0b469e_55%,#1b6fe0)] p-4 text-white">
          <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[#ffae13]/25 blur-2xl" />
          <div className="absolute bottom-0 right-4 flex gap-2 opacity-90">
            {products.slice(0, 3).map((p) => (
              <span key={p.id} className={`grid h-14 w-12 place-items-center rounded-t-xl bg-gradient-to-br ${p.tone}`}><MIcon name={p.icon} className={`h-6 w-6 ${p.ink}`} /></span>
            ))}
          </div>
          <p className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-[#ffd36e]">GLOARO MART</p>
          <p className="mt-1 max-w-[55%] font-urbanist text-base font-extrabold leading-tight sm:text-lg">Everything you need, closer than you think.</p>
          <span className="mt-2 inline-flex rounded-full bg-[#ffae13] px-2.5 py-1 text-[8px] font-extrabold text-[#0b2451]">Explore deals</span>
        </div>
        <div className="rounded-2xl bg-white/90 p-2.5 shadow-sm">
          <p className="flex items-center gap-1 text-[9px] font-extrabold text-[#0b2451]"><MapPin className="h-3 w-3 text-[#ff8a00]" aria-hidden="true" />Nearby vendors</p>
          <div className="mt-2 space-y-1.5">
            {vendors.slice(0, 3).map((v) => (
              <div key={v.name} className="flex items-center gap-1.5">
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${v.tone}`}><MIcon name={v.icon} className={`h-3 w-3 ${v.ink}`} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[8.5px] font-bold text-[#0b2451]">{v.name}</span>
                  <span className="block text-[7px] text-[#51627f]">{v.distance}</span>
                </span>
                <Stars value={v.rating} className="text-[7px]" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {products.slice(0, 4).map((p) => <ProductTile key={p.id} product={p} size="sm" />)}
      </div>
    </div>
  )
}

export function VendorDashboardScreen() {
  const nav = [
    [LayoutGrid, 'Dashboard'],
    [Package, 'Products'],
    [Boxes, 'Inventory'],
    [ClipboardList, 'Orders'],
    [Wallet, 'Wallet'],
    [Settings, 'Settings'],
  ]
  const kpis = [
    ['Orders today', '28', '+12%'],
    ['Revenue', '₹48,250', '+8%'],
    ['Products', '132', '6 new'],
    ['Store rating', '4.8', '★'],
  ]
  const orders = [
    ['#GM-20481', 'Basmati Rice 5 kg', 'Packed', 'bg-sky-100 text-sky-700'],
    ['#GM-20479', 'Steel Bottle × 2', 'Shipped', 'bg-amber-100 text-amber-700'],
    ['#GM-20475', 'Organic Honey', 'Delivered', 'bg-emerald-100 text-emerald-700'],
  ]
  return (
    <div className="flex bg-[linear-gradient(180deg,#f2f7ff,#ffffff)]">
      <aside className="hidden w-36 shrink-0 flex-col gap-1 bg-[#0b2451] p-3 text-white sm:flex">
        <div className="mb-3 flex items-center gap-1.5">
          <Emblem className="h-6 w-6 rounded-full bg-white p-0.5" />
          <span className="font-urbanist text-[10px] font-extrabold tracking-wide">Seller Hub</span>
        </div>
        {nav.map(([Icon, label], i) => (
          <span key={label} className={`flex items-center gap-2 rounded-xl px-2 py-1.5 text-[9px] font-semibold ${i === 0 ? 'bg-white/12 text-white ring-1 ring-white/15' : 'text-white/60'}`}>
            <Icon className="h-3 w-3" aria-hidden="true" />{label}
          </span>
        ))}
      </aside>
      <div className="min-w-0 flex-1 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#ff8a00]">Fresh Mart</p>
            <p className="font-urbanist text-sm font-extrabold text-[#0b2451]">Good morning, Priya</p>
          </div>
          <span className="rounded-full bg-[#0b2451] px-2.5 py-1 text-[8px] font-bold text-white">+ Add product</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {kpis.map(([label, value, delta]) => (
            <div key={label} className="rounded-xl border border-white bg-white/90 p-2 shadow-sm">
              <p className="text-[7.5px] font-semibold text-[#51627f]">{label}</p>
              <p className="font-urbanist text-sm font-extrabold text-[#0b2451]">{value}</p>
              <p className="text-[7px] font-bold text-emerald-600">{delta}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-5 gap-2">
          <div className="col-span-3 rounded-xl bg-white/90 p-2 shadow-sm">
            <p className="flex items-center gap-1 text-[8.5px] font-extrabold text-[#0b2451]"><BarChart3 className="h-3 w-3 text-[#0b469e]" aria-hidden="true" />Sales this week</p>
            <svg viewBox="0 0 200 70" className="mt-1 h-16 w-full" aria-hidden="true">
              <defs>
                <linearGradient id="m-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#1b6fe0" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#1b6fe0" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 55 C 20 50, 30 40, 50 42 S 80 25, 100 30 S 140 12, 160 18 S 190 8, 200 6 L200 70 L0 70 Z" fill="url(#m-area)" />
              <path d="M0 55 C 20 50, 30 40, 50 42 S 80 25, 100 30 S 140 12, 160 18 S 190 8, 200 6" fill="none" stroke="#0b469e" strokeWidth="2" />
              <circle cx="160" cy="18" r="3.5" fill="#ffae13" stroke="#fff" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="col-span-2 rounded-xl bg-white/90 p-2 shadow-sm">
            <p className="text-[8.5px] font-extrabold text-[#0b2451]">Low stock</p>
            {[['Organic Honey', 3], ['Steel Bottle', 5], ['Green Tea', 2]].map(([n, q]) => (
              <div key={n} className="mt-1.5">
                <p className="flex justify-between text-[7.5px] text-[#51627f]"><span className="truncate">{n}</span><span className="font-bold text-[#ff8a00]">{q} left</span></p>
                <span className="mt-0.5 block h-1 rounded-full bg-slate-100"><span className="block h-full rounded-full bg-[#ffae13]" style={{ width: `${q * 15}%` }} /></span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 rounded-xl bg-white/90 p-2 shadow-sm">
          <p className="text-[8.5px] font-extrabold text-[#0b2451]">Recent orders</p>
          {orders.map(([id, item, status, tone]) => (
            <div key={id} className="mt-1.5 flex items-center gap-2 text-[8px]">
              <span className="w-14 shrink-0 font-bold text-[#0b2451]">{id}</span>
              <span className="flex-1 truncate text-[#51627f]">{item}</span>
              <span className={`rounded-full px-1.5 py-0.5 text-[7px] font-bold ${tone}`}>{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* Stylised GLOARO MART storefront — glass façade, warm interior, signage. */
export function Storefront({ className = '' }) {
  return (
    <svg viewBox="0 0 420 300" className={className} role="img" aria-label="Illustration of a GLOARO MART storefront">
      <defs>
        <linearGradient id="sf-glass" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#cfe1fb" />
          <stop offset="1" stopColor="#9fbde6" />
        </linearGradient>
        <linearGradient id="sf-warm" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffe3a3" />
          <stop offset="1" stopColor="#ffb547" />
        </linearGradient>
        <linearGradient id="sf-ground" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#e6eef9" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="262" width="420" height="38" fill="url(#sf-ground)" />
      {/* upper glass floors */}
      <rect x="60" y="40" width="320" height="110" rx="6" fill="url(#sf-glass)" />
      {Array.from({ length: 10 }).map((_, i) => <rect key={`v${i}`} x={60 + i * 32} y="40" width="2" height="110" fill="#ffffff" opacity="0.7" />)}
      <rect x="60" y="94" width="320" height="2" fill="#ffffff" opacity="0.7" />
      {/* sign */}
      <rect x="180" y="58" width="150" height="62" rx="6" fill="#ffffff" />
      <Emblem className="" x="188" y="70" width="36" height="36" />
      <text x="228" y="88" fontFamily="Urbanist, sans-serif" fontWeight="800" fontSize="20" fill="#0b2451">GLOARO</text>
      <text x="238" y="106" fontFamily="Urbanist, sans-serif" fontWeight="800" fontSize="10" letterSpacing="4" fill="#ffae13">MART</text>
      {/* canopy */}
      <rect x="50" y="150" width="340" height="10" rx="3" fill="#0b2451" />
      {/* lit ground floor */}
      <rect x="60" y="160" width="320" height="102" fill="url(#sf-warm)" />
      {Array.from({ length: 6 }).map((_, i) => <rect key={`g${i}`} x={60 + i * 64} y="160" width="3" height="102" fill="#0b2451" opacity="0.55" />)}
      {[[86, 205], [150, 215], [214, 205], [278, 215], [342, 208]].map(([x, y]) => (
        <g key={x} opacity="0.75">
          <rect x={x - 16} y={y} width="32" height="40" rx="3" fill="#ffffff" opacity="0.55" />
          <rect x={x - 12} y={y + 6} width="10" height="8" rx="1" fill="#0b469e" opacity="0.5" />
          <rect x={x + 2} y={y + 6} width="10" height="8" rx="1" fill="#ff8a00" opacity="0.5" />
          <rect x={x - 12} y={y + 20} width="24" height="8" rx="1" fill="#0b2451" opacity="0.35" />
        </g>
      ))}
      <rect x="196" y="196" width="48" height="66" rx="3" fill="#fff4dc" stroke="#0b2451" strokeWidth="3" />
      {/* trees */}
      {[[28, 236], [400, 232]].map(([x, y]) => (
        <g key={x}>
          <rect x={x - 3} y={y} width="6" height="30" fill="#7a5a3a" />
          <circle cx={x} cy={y - 10} r="22" fill="#5aa86b" />
          <circle cx={x - 10} cy={y - 2} r="14" fill="#6dbb7c" />
        </g>
      ))}
    </svg>
  )
}
