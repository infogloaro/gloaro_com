import { motion } from 'framer-motion'
import { Bell, Heart, LayoutGrid, Lock, Package, RotateCcw, ScanSearch, Star, Store } from 'lucide-react'
import { SectionHeading } from './primitives'
import { staggerChild, staggerParent } from './martData'

const features = [
  [ScanSearch, 'Smart Search', 'Describe what you need and get results that fit.', 'group-hover:rotate-[-8deg]'],
  [Store, 'Nearby Stores', 'Shop from businesses in your own neighbourhood.', 'group-hover:-translate-y-1'],
  [LayoutGrid, 'Multiple Categories', 'Grocery to gadgets, fashion to home — in one place.', 'group-hover:rotate-90'],
  [Lock, 'Secure Checkout', 'A protected payment flow from cart to confirmation.', 'group-hover:scale-110'],
  [Package, 'Order Tracking', 'Know where your order is at every stage.', 'group-hover:translate-x-1'],
  [Heart, 'Wishlist', 'Save what you love and come back to it later.', 'group-hover:scale-125'],
  [Star, 'Reviews', 'Read and share honest feedback on products and sellers.', 'group-hover:rotate-[72deg]'],
  [Bell, 'Notifications', 'Timely updates on orders, offers and deliveries.', 'group-hover:rotate-12'],
  [RotateCcw, 'Easy Reordering', 'Buy your regulars again from your past orders.', 'group-hover:-rotate-180'],
]

export default function MartForCustomers() {
  return (
    <section id="for-customers" className="relative py-20 sm:py-28" aria-labelledby="mart-customers-title">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-[radial-gradient(700px_300px_at_50%_0%,rgba(255,211,110,0.18),transparent)]" aria-hidden="true" />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading id="mart-customers-title" eyebrow="For customers" title="Everything You Expect." accent="Nothing You Don't.">
          The essentials of great online shopping, done properly — without clutter getting in the way.
        </SectionHeading>

        <motion.ul variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([Icon, title, text, micro]) => (
            <motion.li
              key={title}
              variants={staggerChild}
              className="group m-glass relative overflow-hidden rounded-[24px] p-6 transition duration-500 hover:-translate-y-1.5 hover:bg-white/80 hover:shadow-[0_30px_60px_-30px_rgba(11,36,81,0.35)]"
            >
              <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,#ffae13,transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(145deg,#eaf2ff,#ffffff)] text-[#0b469e] shadow-[inset_0_1px_0_#fff,0_8px_20px_-10px_rgba(11,70,158,0.45)] ring-1 ring-[#0b469e]/10 transition-colors duration-500 group-hover:bg-[linear-gradient(145deg,#1f4590,#0b2451)] group-hover:text-[#ffd36e]">
                  <Icon className={`h-5 w-5 transition-transform duration-500 ${micro}`} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-extrabold text-[#0b2451]">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#51627f]">{text}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
