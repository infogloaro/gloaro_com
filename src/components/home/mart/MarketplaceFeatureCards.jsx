import { motion } from 'framer-motion'
import { ChevronRight, MapPin, ShieldCheck, Store, Truck, Users } from 'lucide-react'

const cards = [
  { label: 'Nearby stores', Icon: MapPin, color: '#ff7a00', className: 'right-[-4%] top-[12%]', delay: 0, float: '7s' },
  { label: 'Fast delivery', Icon: Truck, color: '#0b5cff', className: 'left-[-3%] bottom-[24%]', delay: 0.1, float: '8s' },
  { label: 'B2B deals', Icon: Users, color: '#17a589', className: 'right-[-2%] bottom-[30%]', delay: 0.2, float: '6.5s' },
  { label: 'Secure shopping', Icon: ShieldCheck, color: '#7c5cff', className: 'left-[2%] top-[6%]', delay: 0.3, float: '7.5s', compactHidden: true },
  { label: 'Multi-vendor marketplace', Icon: Store, color: '#ffb000', className: 'left-[34%] bottom-[-4%]', delay: 0.4, float: '8.5s', compactHidden: true },
]

// Glass chips that call out what the marketplace does. They enter one after
// another and then drift on their own float so they feel pinned in mid-air.
export default function MarketplaceFeatureCards({ compact = false }) {
  return (
    <>
      {cards.filter((card) => !(compact && card.compactHidden)).map(({ label, Icon, color, className, delay, float }) => (
        <motion.div
          key={label}
          variants={{
            hidden: { opacity: 0, y: 20, scale: 0.85 },
            show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 140, damping: 18, delay: 0.5 + delay } },
          }}
          className={`absolute z-30 ${className}`}
        >
          <div className="mart-float flex items-center gap-2 rounded-full border border-white/70 bg-white/75 py-1.5 pl-1.5 pr-3 text-[0.72rem] font-bold text-[#071a3d] shadow-[0_18px_40px_-16px_rgba(7,26,61,0.4)] backdrop-blur-md" style={{ '--dur': float, '--dist': '-8px', '--delay': `${-delay * 10}s` }}>
            <span className="grid h-7 w-7 place-items-center rounded-full text-white" style={{ background: color }}>
              <Icon className="h-3.5 w-3.5" />
            </span>
            <span className="whitespace-nowrap">{label}</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </div>
        </motion.div>
      ))}
    </>
  )
}
