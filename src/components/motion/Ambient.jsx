import { useRef } from 'react'
import { useAmbient } from '../../hooks/useMotionEnv'

const AURORA_TONES = {
  hero: ['bg-[#1f66d2]/45', 'bg-[#ffae13]/25', 'bg-[#17a589]/25'],
  cta: ['bg-[#ffae13]/30', 'bg-[#1b6fe0]/45', 'bg-[#7fa8f0]/25'],
  // Cream sections: soft gold, pale blue and mint at low alpha.
  industries: ['bg-[#ffd36e]/35', 'bg-[#9ec1ff]/30', 'bg-[#8fe3cf]/25'],
}

// Slow drifting mesh of blurred blobs (CSS transform keyframes, 20–30s).
// Pauses when off screen, when the tab is hidden, or when it loses the ambient budget.
export function Aurora({ tone = 'hero', priority = 1, className = '' }) {
  const ref = useRef(null)
  const active = useAmbient(ref, { priority, amount: 0.35 })
  const [a, b, c] = AURORA_TONES[tone]
  return (
    <div ref={ref} aria-hidden="true" data-paused={!active} className={`aurora pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <span className={`aurora-blob aurora-a left-[-10%] top-[-20%] h-[60%] w-[55%] ${a}`} />
      <span className={`aurora-blob aurora-b right-[-15%] top-[10%] h-[65%] w-[50%] ${b}`} />
      <span className={`aurora-blob aurora-c bottom-[-25%] left-[25%] h-[55%] w-[50%] ${c}`} />
    </div>
  )
}

// Infinite marquee with edge fade masks. Pauses on hover, off screen, and when
// the ambient budget is spent. `items` render twice for a seamless loop.
export function Marquee({ items, renderItem, priority = 1, className = '', duration = 45 }) {
  const ref = useRef(null)
  const active = useAmbient(ref, { priority, amount: 0.5 })
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] ${className}`}
    >
      <div data-paused={!active} style={{ animationDuration: `${duration}s` }} className="marquee-track flex w-max">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0 items-center">
            {items.map((item, index) => (
              <li key={`${copy}-${index}`} className="shrink-0">{renderItem(item)}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
