import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CircleCheck, Download } from 'lucide-react'
import { Clouds, MIcon, Stars } from './primitives'
import { Storefront } from './mockups'
import { EASE, formatINR, MARKETPLACE_URL, products } from './martData'

export default function MartCTA() {
  const product = products[0]
  return (
    <section id="get-started" className="relative px-3 pb-0 pt-12 sm:px-5" aria-labelledby="mart-cta-title">
      <div className="relative mx-auto max-w-[1360px] overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#e7f0ff_0%,#f6f9ff_40%,#fff5df_100%)] sm:rounded-[44px]">
        <Clouds />
        <div className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full bg-[#ffae13]/25 blur-[100px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-96 w-96 rounded-full bg-[#1b6fe0]/20 blur-[100px]" aria-hidden="true" />

        <div className="relative grid grid-cols-1 items-center gap-10 px-5 py-16 sm:px-10 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="m-glass-gold relative z-10 rounded-[30px] p-7 sm:p-10"
          >
            <h2 id="mart-cta-title" className="m-display text-[2.4rem] text-[#0b2451] sm:text-6xl lg:text-[4rem]">
              Your Marketplace.
              <br />
              <span className="m-text-gradient">Your Business.</span>
              <br />
              Your <span className="m-text-gold">GLOARO.</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-[#51627f]">Discover, shop, sell and grow with GLOARO MART.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={MARKETPLACE_URL} className="m-btn m-btn-navy px-7 py-4 text-base">
                Explore GLOARO MART <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <a href="#app" className="m-btn m-btn-glass px-7 py-4 text-base">
                <Download className="h-5 w-5 text-[#0b469e]" aria-hidden="true" /> Download App
              </a>
            </div>
          </motion.div>

          <div className="relative mx-auto w-full max-w-[520px]">
            <Storefront className="relative w-full drop-shadow-[0_30px_40px_rgba(11,36,81,0.18)]" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
              className="absolute -left-2 top-[-6%] sm:-left-8"
              aria-hidden="true"
            >
              <div className="m-glass-gold m-float-sm flex w-48 items-center gap-3 rounded-2xl p-2.5">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${product.tone}`}><MIcon name={product.icon} className={`h-6 w-6 ${product.ink}`} /></span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-extrabold text-[#0b2451]">{product.name}</span>
                  <span className="flex items-center gap-2 text-xs"><span className="font-extrabold text-[#0b2451]">{formatINR(product.price)}</span><Stars value={product.rating} className="text-[10px]" /></span>
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45, duration: 0.7, ease: EASE }}
              className="absolute -right-1 bottom-[8%] sm:-right-6"
              aria-hidden="true"
            >
              <div className="m-glass-gold m-float-sm flex items-center gap-2 rounded-full py-2 pl-2 pr-4 [animation-delay:1.4s]">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white"><CircleCheck className="h-4 w-4" /></span>
                <span className="text-xs font-extrabold text-[#0b2451]">Order delivered</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
