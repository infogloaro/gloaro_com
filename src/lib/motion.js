// Motion tokens for the public site. Every animated component imports from here
// so timing, easing and springs stay consistent across sections.

export const ease = {
  entrance: [0.22, 1, 0.36, 1],
  exit: [0.4, 0, 1, 1],
}

export const spring = {
  // Buttons, chips, cards, cursor: snappy and settles fast.
  interactive: { type: 'spring', stiffness: 260, damping: 24 },
  // Panels, device frames, page-sized layers: heavier and calmer.
  surface: { type: 'spring', stiffness: 120, damping: 20 },
}

// Seconds (framer-motion units).
export const duration = {
  micro: 0.2,
  entrance: 0.65,
  entranceLong: 0.8,
  heroTotal: 1.6,
}

export const stagger = {
  children: 0.075,
  words: 0.12,
}

export const perspective = 1200

export const transition = {
  entrance: { duration: duration.entrance, ease: ease.entrance },
  entranceLong: { duration: duration.entranceLong, ease: ease.entrance },
  exit: { duration: duration.micro, ease: ease.exit },
  micro: { duration: duration.micro, ease: ease.entrance },
}

export const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: transition.entrance },
  },
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: transition.entrance },
  },
  // Word/line that rises out of an overflow-hidden mask.
  maskRise: {
    hidden: { y: '110%' },
    show: { y: '0%', transition: transition.entranceLong },
  },
  container: (gap = stagger.children, delay = 0) => ({
    hidden: {},
    show: { transition: { staggerChildren: gap, delayChildren: delay } },
  }),
}

// Viewport config for one-shot entrances.
export const viewportOnce = { once: true, amount: 0.2 }

// Ambient loops: slow cycles (seconds).
export const ambient = {
  auroraCycle: 26,
  marqueeCycle: 45,
  orbitCycle: 60,
  // Hard cap from the motion guidelines: never more than this many ambient
  // effects running at the same time.
  maxConcurrent: 2,
}
