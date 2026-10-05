import { motion } from 'framer-motion'
import { BadgeCheck, FileText, Lock, Package, ServerCog, Star } from 'lucide-react'
import { Eyebrow } from './primitives'
import { staggerChild, staggerParent } from './martData'

const items = [
  [Lock, 'Secure Checkout', 'Payments run through a protected checkout flow.'],
  [BadgeCheck, 'Trusted Sellers', 'Vendors go through a review process before they sell.'],
  [FileText, 'Transparent Product Info', 'Clear pricing, details and seller information on every listing.'],
  [Package, 'Order Tracking', 'Status updates from the moment you place an order.'],
  [Star, 'Reviews & Ratings', 'Feedback from buyers helps everyone choose well.'],
  [ServerCog, 'Reliable Platform', 'One connected system for customers, sellers and support.'],
]

export default function MartTrustSection() {
  return (
    <section id="trust" className="relative px-3 py-12 sm:px-5 sm:py-16" aria-labelledby="mart-trust-title">
      <div className="relative mx-auto max-w-[1360px] overflow-hidden rounded-[36px] bg-[linear-gradient(160deg,#071a3d,#0b2451_45%,#0b3a86)] px-5 py-20 text-white sm:rounded-[44px] sm:px-10 sm:py-24 lg:px-16">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#ffae13]/15 blur-[100px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[#1b6fe0]/35 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]" aria-hidden="true" />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <Eyebrow icon={BadgeCheck} className="!bg-white/10 !text-[#ffd36e] ![box-shadow:none] !border-white/15">Trust</Eyebrow>
          <h2 id="mart-trust-title" className="m-display mt-5 text-[2.35rem] text-white sm:text-5xl lg:text-[3.6rem]">
            Designed for <span className="m-text-gold">Confidence.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
            Buying from someone new should not feel like a gamble. GLOARO MART is built to make every step clear.
          </p>
        </div>

        <motion.ul variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(([Icon, title, text]) => (
            <motion.li key={title} variants={staggerChild} className="group m-glass-dark rounded-[24px] p-6 transition duration-500 hover:-translate-y-1 hover:bg-white/10">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(180deg,#ffd36e,#ffae13)] text-[#0b2451] shadow-[0_0_30px_-6px_rgba(255,174,19,0.6)] transition-transform duration-500 group-hover:scale-110">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-extrabold text-white">{title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-white/65">{text}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
