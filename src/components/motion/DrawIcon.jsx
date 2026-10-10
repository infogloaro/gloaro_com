import { useLayoutEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

const SHAPES = 'path, circle, rect, line, polyline, polygon, ellipse'

// Draws a lucide icon's strokes in (SVG pathLength) when it scrolls into view.
// Every shape is normalised to pathLength=1 so one CSS rule drives them all.
export default function DrawIcon({ icon: Icon, className = '', delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.8 })

  useLayoutEffect(() => {
    ref.current?.querySelectorAll(SHAPES).forEach((shape) => shape.setAttribute('pathLength', '1'))
  }, [])

  return (
    <span ref={ref} data-drawn={inView} style={{ '--draw-delay': `${delay}ms` }} className="draw-icon inline-flex">
      <Icon aria-hidden="true" className={className} />
    </span>
  )
}
