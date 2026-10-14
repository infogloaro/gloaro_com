import { useId } from 'react'

// The GLOARO AI robot, drawn from the logo: the four swoosh "figures" and their
// dots orbit a navy robot head (gold top dot = antenna tip, navy side dots =
// ear bolts), and the logo's globe sits on the robot's chin.
// Gold swooshes sit top-right/bottom-left like the logo, so a 180° spin of the
// ring (used on hover) lands back on the exact logo arrangement.
export default function GloaroBot({ className = '', title }) {
  const id = useId().replace(/:/g, '')
  const navy = `gloaro-ai-navy-${id}`
  const gold = `gloaro-ai-gold-${id}`

  return (
    <svg
      viewBox="0 0 64 64"
      className={`gloaro-ai-bot ${className}`}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      aria-label={title}
    >
      <defs>
        <linearGradient id={navy} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#24407f" />
          <stop offset="1" stopColor="#0e1c40" />
        </linearGradient>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6cd6a" />
          <stop offset="1" stopColor="#d4961f" />
        </linearGradient>
      </defs>

      {/* Logo ring: swooshes in the gaps between the four dots */}
      <g className="gloaro-ai-bot-ring" fill="none" strokeWidth="4.2" strokeLinecap="round">
        <path d="M44 9A26 26 0 0 1 58 27" stroke={`url(#${gold})`} />
        <path d="M20 55A26 26 0 0 1 6 37" stroke={`url(#${gold})`} />
        <path d="M6 27A26 26 0 0 1 20 9" stroke={`url(#${navy})`} />
        <path d="M58 37A26 26 0 0 1 44 55" stroke={`url(#${navy})`} />
      </g>

      {/* Antenna, ear stubs and the logo's four dots */}
      <path d="M32 9.5V16" stroke="#14244b" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="11.5" y="28.5" width="6" height="7" rx="2" fill="#14244b" />
      <rect x="46.5" y="28.5" width="6" height="7" rx="2" fill="#14244b" />
      <circle cx="32" cy="6" r="3.6" fill={`url(#${gold})`} className="gloaro-ai-bot-antenna" />
      <circle cx="32" cy="58" r="3.6" fill={`url(#${gold})`} />
      <circle cx="6" cy="32" r="3.6" fill={`url(#${navy})`} />
      <circle cx="58" cy="32" r="3.6" fill={`url(#${navy})`} />

      {/* Head */}
      <rect x="16" y="15" width="32" height="32" rx="11" fill={`url(#${navy})`} />
      <rect x="16.8" y="15.8" width="30.4" height="30.4" rx="10.3" fill="none" stroke="#fff" strokeOpacity="0.14" />

      {/* Visor + blinking gold eyes */}
      <rect x="20.5" y="20.5" width="23" height="14" rx="7" fill="#070f26" />
      <g className="gloaro-ai-bot-eyes" fill={`url(#${gold})`}>
        <rect x="25" y="24.5" width="4.4" height="6" rx="2.2" />
        <rect x="34.6" y="24.5" width="4.4" height="6" rx="2.2" />
      </g>

      {/* Globe on the chin */}
      <g fill="none" stroke="#f6cd6a" strokeWidth="1.1">
        <circle cx="32" cy="40.5" r="3.6" />
        <ellipse cx="32" cy="40.5" rx="1.5" ry="3.6" />
        <path d="M28.4 40.5h7.2" />
      </g>
    </svg>
  )
}
