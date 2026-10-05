import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { CreditCard, PackageCheck, Scale, Search } from 'lucide-react'
import { SectionHeading } from './primitives'
import { staggerChild, staggerParent } from './martData'

const steps = [
  { no: '01', title: 'Discover', icon: Search, text: 'Find products, categories and nearby vendors.' },
  { no: '02', title: 'Compare', icon: Scale, text: 'Explore products, sellers, ratings and offers.' },
  { no: '03', title: 'Order', icon: CreditCard, text: 'Add to cart and complete checkout securely.' },
  { no: '04', title: 'Track', icon: PackageCheck, text: 'Follow your order until delivery.' },
]

export default function MartHowItWorks() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 25 })

  return (
    <section id="how-it-works" className="relative py-20 sm:py-28" aria-labelledby="mart-how-title">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading id="mart-how-title" eyebrow="How it works" title="Four Steps." accent="From Search to Doorstep.">
          Shopping on GLOARO MART is designed to feel effortless — whether you are buying one item or restocking a store.
        </SectionHeading>

        <div ref={ref} className="relative mt-16">
          {/* desktop horizontal track */}
          <div className="absolute left-[12.5%] right-[12.5%] top-[38px] hidden h-[3px] rounded-full bg-[#0b469e]/10 lg:block" aria-hidden="true">
            <motion.div style={{ scaleX: fill }} className="h-full origin-left rounded-full bg-[linear-gradient(90deg,#0b469e,#1b6fe0,#ffae13)]" />
          </div>
          {/* mobile vertical track */}
          <div className="absolute bottom-10 left-[38px] top-10 w-[3px] rounded-full bg-[#0b469e]/10 lg:hidden" aria-hidden="true">
            <motion.div style={{ scaleY: fill }} className="h-full w-full origin-top rounded-full bg-[linear-gradient(180deg,#0b469e,#1b6fe0,#ffae13)]" />
          </div>

          <motion.ol variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="relative grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-6">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <motion.li key={step.no} variants={staggerChild} className="group flex gap-5 lg:flex-col lg:items-center lg:text-center">
                  <span className="relative grid h-[78px] w-[78px] shrink-0 place-items-center rounded-full bg-white shadow-[0_18px_40px_-18px_rgba(11,36,81,0.5)] ring-8 ring-[#f7faff] transition-transform duration-500 group-hover:scale-105">
                    <span className="absolute inset-1.5 rounded-full bg-[linear-gradient(145deg,#1f4590,#0b2451)]" />
                    <Icon className="relative h-7 w-7 text-[#ffd36e]" aria-hidden="true" />
                  </span>
                  <div className="m-glass flex-1 rounded-[22px] p-5 transition duration-500 group-hover:-translate-y-1 lg:mt-6 lg:w-full">
                    <span className="text-xs font-extrabold tracking-[0.2em] text-[#ffae13]">STEP {step.no}</span>
                    <h3 className="m-display mt-1 text-2xl uppercase tracking-[0.06em] text-[#0b2451]">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#51627f]">{step.text}</p>
                  </div>
                </motion.li>
              )
            })}
          </motion.ol>
        </div>
      </div>
    </section>
  )
}
