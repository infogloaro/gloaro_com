import { motion } from 'framer-motion'
import { CircleCheck, Heart, LayoutGrid, Lock, MapPin, Package, Search, ShoppingCart, Star } from 'lucide-react'
import { MIcon, PhoneFrame, SectionHeading, Stars } from './primitives'
import { MobileCartScreen } from './mockups'
import { categories, formatINR, products, staggerChild, staggerParent, vendors } from './martData'

function Tile({ icon: Icon, title, text, children, className = '' }) {
  return (
    <motion.li variants={staggerChild} className={`group m-glass relative flex flex-col overflow-hidden rounded-[26px] p-6 transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(11,36,81,0.4)] ${className}`}>
      <div className="flex items-center gap-3">
        <span className="m-icon-well grid h-10 w-10 place-items-center rounded-xl text-[#0b469e] transition-transform duration-500 group-hover:scale-110">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="text-lg font-extrabold text-[#0b2451]">{title}</h3>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#51627f]">{text}</p>
      <div className="mt-5 flex-1" aria-hidden="true">{children}</div>
    </motion.li>
  )
}

export default function MartCustomerFeatures() {
  return (
    <section id="features" className="relative py-20 sm:py-28" aria-labelledby="mart-features-title">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(800px_400px_at_50%_30%,rgba(255,211,110,0.16),transparent_70%)]" aria-hidden="true" />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading id="mart-features-title" eyebrow="For shoppers" title="Built Around" accent="the Way You Shop.">
          Find it faster, buy it with confidence and follow it to your door. Every part of GLOARO MART is designed around the customer journey.
        </SectionHeading>

        <motion.ul
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          <Tile icon={Search} title="Smart Search" text="Find products quickly with search that understands what you mean.">
            <div className="m-field flex items-center gap-2 rounded-full px-4 py-3">
              <Search className="h-4 w-4 text-[#0b469e]" />
              <span className="text-sm font-semibold text-[#0b2451]">organic rice near me</span>
              <span className="m-caret ml-[-4px] h-4 w-[2px] bg-[#0b469e]" />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['Organic', 'Rice', 'Within 3 km'].map((chip) => <span key={chip} className="rounded-full bg-[#ffae13]/15 px-2.5 py-1 text-[11px] font-bold text-[#b45309]">{chip}</span>)}
            </div>
          </Tile>

          {/* Centre phone */}
          <motion.li variants={staggerChild} className="relative order-first overflow-hidden rounded-[30px] bg-[linear-gradient(160deg,#0b2451,#0b469e_70%,#1b6fe0)] p-6 md:col-span-2 lg:order-none lg:col-span-1 lg:row-span-2">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#ffae13]/30 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-[#1b6fe0]/50 blur-3xl" aria-hidden="true" />
            <p className="relative text-xs font-extrabold uppercase tracking-[0.2em] text-[#ffd36e]">Easy cart & checkout</p>
            <h3 className="relative mt-2 font-urbanist text-2xl font-extrabold text-white">A simple flow, start to finish.</h3>
            <p className="relative mt-2 text-sm leading-6 text-white/70">Add from multiple sellers, apply a coupon and pay securely in a few taps.</p>
            <div className="relative mt-6 flex justify-center">
              <PhoneFrame className="h-[470px] w-[230px]" label="GLOARO MART cart screen with secure checkout">
                <MobileCartScreen />
              </PhoneFrame>
              <div className="m-glass-gold m-float-sm absolute bottom-16 left-0 flex items-center gap-2 rounded-2xl px-3 py-2 sm:left-4" aria-hidden="true">
                <Lock className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-extrabold text-[#0b2451]">Secure payment</span>
              </div>
            </div>
          </motion.li>

          <Tile icon={MapPin} title="Nearby Vendors" text="Discover sellers around you — your local market, online.">
            <div className="space-y-2">
              {vendors.slice(0, 2).map((v) => (
                <div key={v.name} className="flex items-center gap-3 rounded-2xl bg-white/80 p-2.5">
                  <span className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${v.tone}`}><MIcon name={v.icon} className={`h-4 w-4 ${v.ink}`} /></span>
                  <span className="flex-1 text-sm font-bold text-[#0b2451]">{v.name}</span>
                  <span className="text-xs font-semibold text-[#51627f]">{v.distance}</span>
                </div>
              ))}
            </div>
          </Tile>

          <Tile icon={LayoutGrid} title="Wide Product Discovery" text="Multiple categories, multiple brands, multiple vendors.">
            <div className="flex flex-wrap gap-1.5">
              {categories.slice(0, 8).map((c) => (
                <span key={c.label} className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1.5 text-[11px] font-bold text-[#0b2451] shadow-sm transition group-hover:shadow-md">
                  <MIcon name={c.icon} className="h-3.5 w-3.5 text-[#0b469e]" />{c.label}
                </span>
              ))}
            </div>
          </Tile>

          <Tile icon={ShoppingCart} title="Easy Checkout" text="Address, coupon and payment — all in one clear step.">
            <div className="space-y-2 rounded-2xl bg-white/80 p-3 text-sm">
              <p className="flex justify-between text-[#51627f]"><span>2 items</span><span className="font-bold text-[#0b2451]">{formatINR(3148)}</span></p>
              <p className="flex justify-between text-[#51627f]"><span>Coupon</span><span className="font-bold text-emerald-600">−{formatINR(100)}</span></p>
              <p className="flex justify-between border-t border-slate-100 pt-2 font-extrabold text-[#0b2451]"><span>Total</span><span>{formatINR(3048)}</span></p>
            </div>
          </Tile>

          <Tile icon={Package} title="Order Tracking" text="Follow every order from placed to delivered.">
            <div className="flex items-center gap-1">
              {['Placed', 'Packed', 'On the way', 'Delivered'].map((step, i) => (
                <div key={step} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className={`h-1.5 w-full rounded-full ${i < 3 ? 'bg-[linear-gradient(90deg,#0b469e,#1b6fe0)]' : 'bg-slate-200'}`} />
                  <span className={`text-[10px] font-bold ${i < 3 ? 'text-[#0b2451]' : 'text-[#94a3b8]'}`}>{step}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700"><CircleCheck className="h-3.5 w-3.5" />Out for delivery</p>
          </Tile>

          <Tile icon={Heart} title="Wishlist" text="Save products for later and come back when you are ready.">
            <div className="flex gap-2">
              {[products[1], products[4]].map((p) => (
                <div key={p.id} className="relative flex-1 rounded-2xl bg-white/80 p-2">
                  <span className={`grid h-14 place-items-center rounded-xl bg-gradient-to-br ${p.tone}`}><MIcon name={p.icon} className={`h-6 w-6 ${p.ink}`} /></span>
                  <Heart className="absolute right-3 top-3 h-3.5 w-3.5 fill-[#ff5a5f] text-[#ff5a5f] transition-transform duration-300 group-hover:scale-125" />
                  <p className="mt-1.5 truncate text-[11px] font-bold text-[#0b2451]">{p.name}</p>
                </div>
              ))}
            </div>
          </Tile>

          <Tile icon={Star} title="Reviews & Ratings" text="Make confident decisions with feedback from real buyers.">
            <div className="rounded-2xl bg-white/80 p-3">
              <div className="flex items-center justify-between">
                <span className="flex gap-0.5">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-[#ffae13] text-[#ffae13]' : 'fill-[#ffae13]/40 text-[#ffae13]/40'}`} />)}</span>
                <Stars value={4.6} className="text-xs" />
              </div>
              <p className="mt-2 text-xs leading-5 text-[#51627f]">“Good sound, packed well and arrived on time.”</p>
            </div>
          </Tile>
        </motion.ul>
      </div>
    </section>
  )
}
