import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ease, variants, viewportOnce } from '../../../lib/motion'
import { useAmbient } from '../../../hooks/useMotionEnv'
import { TiltCard } from '../../motion/Interactive'
import { LineReveal } from '../../motion/Text'
import SectionHeading from './SectionHeading'

const QUOTE = 'Gloaro built us a clean, professional website that makes it easy for customers to check our products and reach out for orders. The whole process, from the first conversation to launch, was smooth and hassle-free.'

function QuoteMark() {
  const draw = { duration: 0.9, ease: ease.entrance }
  return (
    <svg aria-hidden="true" viewBox="0 0 48 40" className="mx-auto h-10 w-12" fill="none" stroke="#ffae13" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      {['M20 4C10 8 4 15 4 24v10h14V22H9c0-7 4-12 11-15', 'M44 4C34 8 28 15 28 24v10h14V22h-9c0-7 4-12 11-15'].map((d, index) => (
        <motion.path
          key={d}
          d={d}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={viewportOnce}
          transition={{ ...draw, delay: index * 0.15 }}
        />
      ))}
    </svg>
  )
}

export default function TestimonialSection() {
  const ref = useRef(null)
  const drifting = useAmbient(ref, { priority: 1, amount: 0.5 })

  return (
    <>
      <section id="testimonials" className="scroll-mt-28 bg-white px-5 py-16 sm:py-24 lg:px-8">
        <motion.figure
          ref={ref}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={variants.fadeUp}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-[28px] border border-[#0d4697]/10 bg-[#fbfdff] p-8 text-center shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:p-12"
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-1/2 bg-[radial-gradient(circle_at_30%_40%,rgba(255,174,19,0.14),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(27,111,224,0.12),transparent_40%)]"
            animate={drifting ? { x: ['-6%', '6%', '-6%'], y: ['-4%', '5%', '-4%'] } : { x: 0, y: 0 }}
            transition={drifting ? { duration: 24, ease: 'easeInOut', repeat: Infinity } : { duration: 0.6 }}
          />
          <div className="relative">
            <QuoteMark />
            <LineReveal
              as="blockquote"
              text={`“${QUOTE}”`}
              className="mt-5 font-outfit text-xl font-medium leading-relaxed tracking-tight text-[#0d4697] sm:text-2xl"
            />
            <motion.figcaption
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, ease: ease.entrance, delay: 1.2 }}
              className="mt-6"
            >
              <p className="text-sm font-extrabold text-[#0d4697]">Vinayaga Ready Mix Concrete</p>
              <p className="text-xs font-semibold text-slate-500">Ready-Mix Concrete Supplier · Kallakurichi, Tamil Nadu</p>
            </motion.figcaption>
          </div>
        </motion.figure>
      </section>

      <section id="insights" className="scroll-mt-28 border-t border-slate-200 bg-[#fdf9e9] px-5 py-16 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <SectionHeading eyebrow="Insights" title="From our blog" highlight="blog" />
          <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={variants.fadeUp} className="mx-auto mt-8 max-w-2xl">
            <TiltCard max={4} glow="rgba(13,70,151,0.12)" className="rounded-2xl bg-[#0d4697]/10 shadow-sm" innerClassName="bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-[#ff9515]">12 September 2026</p>
              <h3 className="mt-2 text-lg font-extrabold text-[#0d4697]">Why Custom Software Beats Off-the-Shelf Tools for Growing Businesses</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">Off-the-shelf software forces teams to work around limits; custom solutions pay off when growing businesses outgrow generic tools.</p>
              <a href="https://www.gloaro.in" target="_blank" rel="noopener noreferrer" className="group mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#0d4697]">
                <span className="link-wipe">Read more insights</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </TiltCard>
          </motion.div>
        </div>
      </section>
    </>
  )
}
