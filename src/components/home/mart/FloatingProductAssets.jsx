import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { img } from './martAssets'

const enter = {
  hidden: { opacity: 0, scale: 0.7, y: 24 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } },
}

// Photo cut into a rounded tile with a grounded shadow, drifting on its own
// CSS float. `style` holds the float variables (--dur, --dist, --rot, --delay).
function PhotoTile({ src, width = 240, height = 240, className = '', floatStyle, rounded = 'rounded-[22%]' }) {
  return (
    <motion.div variants={enter} className={`absolute ${className}`}>
      <div className="mart-float" style={floatStyle}>
        <img
          src={src}
          alt=""
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className={`w-full object-cover shadow-[0_30px_50px_-20px_rgba(7,26,61,0.45),0_0_0_3px_rgba(255,255,255,0.85)] ${rounded}`}
          style={{ aspectRatio: `${width} / ${height}` }}
        />
      </div>
    </motion.div>
  )
}

// Gold paper bag built from CSS: trapezoid body, rope handle, cart mark.
function ShoppingBag({ className = '' }) {
  return (
    <motion.div variants={enter} className={`absolute ${className}`}>
      <div className="mart-float relative aspect-[5/6] w-full" style={{ '--dur': '7.5s', '--dist': '-14px', '--rot': '8deg' }}>
        <span aria-hidden="true" className="absolute left-1/2 top-0 h-[42%] w-[46%] -translate-x-1/2 rounded-t-full border-[0.45em] border-[#c97a00] border-b-0" />
        <div className="absolute inset-x-0 bottom-0 h-[72%] rounded-[10%] bg-[linear-gradient(160deg,#ffd166_0%,#ffb000_55%,#f08a00_100%)] shadow-[0_30px_50px_-18px_rgba(240,138,0,0.55)] [clip-path:polygon(6%_0,94%_0,100%_100%,0_100%)]">
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[18%] bg-white/25" />
          <span className="absolute inset-0 grid place-items-center text-white drop-shadow">
            <ShoppingCart className="h-[38%] w-[38%]" strokeWidth={2.2} />
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// Kraft shipping box with the Gloaro label on its front face.
function ShippingBox({ className = '' }) {
  return (
    <motion.div variants={enter} className={`absolute ${className}`}>
      <div className="mart-float relative aspect-[5/4] w-full" style={{ '--dur': '8.5s', '--dist': '-10px', '--rot': '-4deg' }}>
        <img src={img('box')} alt="" width="500" height="333" loading="lazy" decoding="async" className="h-full w-full rounded-[14%] object-cover shadow-[0_30px_50px_-20px_rgba(7,26,61,0.45),0_0_0_3px_rgba(255,255,255,0.85)]" />
        <span className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 rounded-sm bg-white/90 px-[6%] py-[2%] font-outfit text-[0.55em] font-black uppercase tracking-[0.18em] text-[#071a3d] shadow">
          Gloaro
        </span>
      </div>
    </motion.div>
  )
}

// Map pin: rotated rounded square with a white core, bouncing gently.
function LocationPin({ className = '' }) {
  return (
    <motion.div variants={enter} className={`absolute ${className}`}>
      <div className="mart-bounce relative aspect-[3/4] w-full">
        <span aria-hidden="true" className="absolute left-1/2 top-0 aspect-square w-[78%] -translate-x-1/2 rotate-45 rounded-[45%_45%_12%_45%] bg-[linear-gradient(135deg,#3c86ff_0%,#0b5cff_60%,#0747c2_100%)] shadow-[0_24px_40px_-14px_rgba(11,92,255,0.6)]" />
        <span aria-hidden="true" className="absolute left-1/2 top-[18%] aspect-square w-[30%] -translate-x-1/2 rounded-full bg-white shadow-inner" />
        <span aria-hidden="true" className="absolute bottom-0 left-1/2 h-[8%] w-[50%] -translate-x-1/2 rounded-full bg-[#0b5cff]/25 blur-[3px]" />
      </div>
    </motion.div>
  )
}

const DOTS = [
  ['left-[4%] top-[8%] h-2.5 w-2.5', 6], ['left-[38%] top-[0%] h-3 w-3', 7.5], ['right-[6%] top-[46%] h-2 w-2', 5.5],
  ['left-[30%] bottom-[18%] h-3.5 w-3.5', 8], ['right-[30%] bottom-[2%] h-2.5 w-2.5', 6.5], ['left-[54%] top-[18%] h-2 w-2', 7],
]

// Everything around the devices: product photo tiles, the bag, the box, the
// pin and golden dots. `compact` keeps only a handful on small screens.
export default function FloatingProductAssets({ compact = false }) {
  return (
    <>
      <PhotoTile src={img('vegetables')} width={600} height={400} rounded="rounded-[18%/26%]" className="left-[-2%] top-[34%] w-[31%]" floatStyle={{ '--dur': '7s', '--dist': '-12px', '--rot': '-5deg' }} />
      <PhotoTile src={img('tomatoes')} width={300} height={300} rounded="rounded-full" className="left-[12%] top-[62%] w-[13%]" floatStyle={{ '--dur': '6.2s', '--dist': '-9px', '--delay': '-2s' }} />
      <PhotoTile src={img('sneaker')} width={600} height={480} rounded="rounded-[20%/24%]" className="bottom-[-2%] right-[18%] w-[27%]" floatStyle={{ '--dur': '8s', '--dist': '-12px', '--rot': '6deg', '--delay': '-1s' }} />
      <ShoppingBag className="right-[14%] top-[-2%] w-[13%]" />
      <LocationPin className="left-[16%] top-[2%] w-[9%]" />
      {!compact && (
        <>
          <PhotoTile src={img('oranges')} width={300} height={300} rounded="rounded-full" className="left-[2%] top-[70%] w-[11%]" floatStyle={{ '--dur': '7.2s', '--dist': '-10px', '--delay': '-3.5s' }} />
          <PhotoTile src={img('apparel')} width={600} height={400} rounded="rounded-[18%/26%]" className="bottom-[2%] right-[-3%] w-[24%]" floatStyle={{ '--dur': '9s', '--dist': '-10px', '--rot': '4deg', '--delay': '-4s' }} />
          <PhotoTile src={img('earbuds')} width={300} height={300} rounded="rounded-[26%]" className="bottom-[22%] right-[36%] w-[10%]" floatStyle={{ '--dur': '6.8s', '--dist': '-8px', '--rot': '-8deg', '--delay': '-1.5s' }} />
          <ShippingBox className="bottom-[8%] right-[36%] w-[16%]" />
        </>
      )}
      {DOTS.slice(0, compact ? 3 : DOTS.length).map(([position, duration], index) => (
        <motion.span key={index} variants={enter} aria-hidden="true" className={`absolute ${position}`}>
          <span className="mart-float block h-full w-full rounded-full bg-[radial-gradient(circle_at_35%_35%,#ffe08a,#ffb000_60%,#e08a00)] shadow-[0_6px_12px_-4px_rgba(240,138,0,0.6)]" style={{ '--dur': `${duration}s`, '--dist': '-10px', '--delay': `${-index}s` }} />
        </motion.span>
      ))}
    </>
  )
}
