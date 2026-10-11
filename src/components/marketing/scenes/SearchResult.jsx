import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, MapPin, MessageCircle, Navigation, Phone, Search } from 'lucide-react'
import { ease } from '../../../lib/motion'
import { Avatar } from './parts'

const TYPE_SPEED = 55

const appear = (delay) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: ease.entrance, delay },
})

// A local search: the query types itself, then the map pack and business
// profile appear with the call / directions / WhatsApp actions customers use.
// Illustrative only — it shows how a profile looks, not a ranking position.
export default function SearchResult({ scene, industry, playing, reduce }) {
  const { query } = scene
  const [typed, setTyped] = useState(0)
  const chars = reduce ? query.length : typed
  const done = chars >= query.length

  useEffect(() => {
    if (!playing || typed >= query.length) return undefined
    const id = window.setTimeout(() => setTyped((n) => n + 1), typed === 0 ? 400 : TYPE_SPEED)
    return () => window.clearTimeout(id)
  }, [playing, typed, query.length])

  const actions = [['Call', Phone], ['Directions', Navigation], ['WhatsApp', MessageCircle], ['Website', Globe]]

  return (
    <div className="flex h-full flex-col bg-[#f6f8fc] pt-11 text-[#202124]">
      <div className="px-3 pb-2">
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2.5 text-[12px] shadow-[0_1px_6px_rgba(32,33,36,0.18)]">
          <Search className="h-4 w-4 shrink-0 text-slate-500" />
          <span className="truncate">
            {query.slice(0, chars)}
            {!done && <span className="ml-px inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-[#1a73e8]" />}
          </span>
        </div>
        <div className="mt-2.5 flex gap-4 px-1 text-[11px] font-semibold text-slate-500">
          <span className="border-b-2 border-[#1a73e8] pb-1 text-[#1a73e8]">All</span>
          <span>Maps</span>
          <span>Images</span>
          <span>News</span>
        </div>
      </div>

      {done && (
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-3 pb-4">
          <motion.div {...appear(0.05)} className="relative h-24 shrink-0 overflow-hidden rounded-xl bg-[#e8eef3] [background-image:linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:18px_18px]">
            <span className="absolute -left-4 top-1/3 h-3 w-[130%] rotate-[-8deg] bg-white" />
            <span className="absolute left-1/3 top-0 h-full w-2.5 rotate-[14deg] bg-white" />
            <span className="absolute left-[18%] top-[62%] h-2.5 w-2.5 rounded-full bg-slate-400/70" />
            <span className="absolute left-[72%] top-[30%] h-2.5 w-2.5 rounded-full bg-slate-400/70" />
            <motion.span
              initial={{ y: -18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.35 }}
              className="absolute left-1/2 top-[22%] -translate-x-1/2"
            >
              <MapPin className="h-8 w-8 fill-[#ea4335] text-white drop-shadow" />
            </motion.span>
          </motion.div>

          <motion.div {...appear(0.25)} className="rounded-xl bg-white p-3 shadow-sm">
            <div className="flex items-start gap-2.5">
              <Avatar industry={industry} size={32} />
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-[13px] font-semibold text-[#1a0dab]">{industry.brand.name}</p>
                <p className="mt-0.5 truncate text-[10.5px] text-slate-600">{scene.category}</p>
                <p className="mt-0.5 text-[10.5px] font-semibold text-[#188038]">{scene.hours}</p>
              </div>
            </div>
            <div className="mt-2.5 grid grid-cols-4 gap-1">
              {actions.map(([label, Icon], i) => (
                <motion.span
                  key={label}
                  animate={playing && label === 'WhatsApp' ? { scale: [1, 0.9, 1] } : { scale: 1 }}
                  transition={{ delay: 1.6, duration: 0.35 }}
                  className={`flex flex-col items-center gap-1 rounded-lg py-1.5 text-[9.5px] font-semibold ${i === 2 ? 'bg-[#e6f4ea] text-[#137333]' : 'bg-[#e8f0fe] text-[#1a73e8]'}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div {...appear(0.45)} className="rounded-xl bg-white p-3 shadow-sm">
            <p className="truncate text-[10px] text-slate-600">{scene.url}</p>
            <p className="mt-0.5 truncate text-[12.5px] font-semibold text-[#1a0dab]">{industry.brand.name}</p>
            <p className="mt-1 line-clamp-2 text-[10.5px] leading-snug text-slate-600">{scene.snippet}</p>
          </motion.div>
          <span className="mt-auto self-center rounded-md bg-white/80 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-500 shadow-sm">
            Illustrative search
          </span>
        </div>
      )}
    </div>
  )
}
