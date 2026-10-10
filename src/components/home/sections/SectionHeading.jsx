import { motion } from 'framer-motion'
import { variants, viewportOnce } from '../../../lib/motion'
import { SplitWords } from '../../motion/Text'

// Eyebrow pill + word-split heading. `highlight` gets the gold shimmer.
export default function SectionHeading({ eyebrow, title, highlight, underline = false, dark = false, align = 'center', children }) {
  const centered = align === 'center'
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-xl'}>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={variants.fadeUp}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.24em] shadow-sm ${dark ? 'border-white/15 bg-white/10 text-white/90' : 'border-[#0d4697]/10 bg-white text-[#0d4697]'}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#ffae13]" />
        {eyebrow}
      </motion.div>
      <SplitWords
        text={title}
        highlight={highlight}
        underline={underline}
        tone={dark ? 'dark' : 'light'}
        className={`mt-4 font-outfit text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.6rem] ${dark ? 'text-white' : 'text-[#0d4697]'}`}
      />
      {children && (
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={variants.fadeUp}
          className={`mt-3 font-work text-sm font-medium sm:text-base ${dark ? 'text-white/70' : 'text-slate-600'}`}
        >
          {children}
        </motion.p>
      )}
    </div>
  )
}
