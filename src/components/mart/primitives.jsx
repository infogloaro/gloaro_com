import { motion } from 'framer-motion'
import {
  Baby,
  Boxes,
  Coffee,
  Dumbbell,
  Headphones,
  Lamp,
  Laptop,
  Pill,
  Shirt,
  ShoppingBasket,
  Smartphone,
  Sofa,
  Sparkles,
  Star,
  Watch,
  Wheat,
} from 'lucide-react'
import { EASE } from './martData'

const ICONS = { Baby, Boxes, Coffee, Dumbbell, Headphones, Lamp, Laptop, Pill, Shirt, ShoppingBasket, Smartphone, Sofa, Sparkles, Watch, Wheat }

export function MIcon({ name, className = 'h-4 w-4', ...rest }) {
  const Component = ICONS[name] || Sparkles
  return <Component className={className} aria-hidden="true" {...rest} />
}

/* GLOARO emblem: four swooshes around a globe, drawn as vector so it stays crisp everywhere. */
export function Emblem({ className = 'h-10 w-10', mono = false, ...rest }) {
  const navy = mono ? 'currentColor' : '#0b2451'
  const gold = mono ? 'currentColor' : '#ffae13'
  const swoosh = 'M27 47 C27 33 35 24 47 20 L41 31 C36 35 34 40 34 47 Z'
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" {...rest}>
      <g>
        <path d={swoosh} fill={navy} />
        <path d={swoosh} fill={gold} transform="rotate(90 50 50)" />
        <path d={swoosh} fill={navy} transform="rotate(180 50 50)" />
        <path d={swoosh} fill={gold} transform="rotate(270 50 50)" />
      </g>
      <circle cx="50" cy="9" r="6" fill={gold} />
      <circle cx="91" cy="50" r="6" fill={navy} />
      <circle cx="50" cy="91" r="6" fill={gold} />
      <circle cx="9" cy="50" r="6" fill={navy} />
      <g fill="none" stroke={navy} strokeWidth="2.6">
        <circle cx="50" cy="50" r="11.5" />
        <ellipse cx="50" cy="50" rx="5" ry="11.5" />
        <path d="M38.5 50h23M40 44h20M40 56h20" />
      </g>
    </svg>
  )
}

export function MartLogo({ compact = false, dark = false, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Emblem className={compact ? 'h-9 w-9' : 'h-11 w-11'} />
      <span className="flex flex-col leading-none">
        <span className={`font-urbanist font-extrabold tracking-[0.04em] ${compact ? 'text-[1.15rem]' : 'text-[1.35rem]'} ${dark ? 'text-white' : 'text-[#0b2451]'}`}>GLOARO</span>
        <span className="mt-1 flex items-center gap-1.5">
          <span className="h-[2px] w-3 rounded-full bg-[#ffae13]" />
          <span className={`font-urbanist font-extrabold tracking-[0.42em] text-[#ffae13] ${compact ? 'text-[0.62rem]' : 'text-[0.7rem]'}`}>MART</span>
          <span className="h-[2px] w-3 rounded-full bg-[#ffae13]" />
        </span>
      </span>
    </span>
  )
}

export function Reveal({ children, delay = 0, y = 24, className = '', as = 'div', amount = 0.25 }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </Tag>
  )
}

export function Eyebrow({ children, icon: Icon, className = '' }) {
  return (
    <span className={`m-eyebrow m-glass ${className}`}>
      <span className="grid h-6 w-6 place-items-center rounded-full bg-[linear-gradient(135deg,#ffd36e,#ffae13)] text-[#0b2451]">
        {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : <Emblem className="h-4 w-4" mono />}
      </span>
      {children}
    </span>
  )
}

export function SectionHeading({ id, eyebrow, eyebrowIcon, title, accent, children, align = 'center', className = '' }) {
  const alignment = align === 'center' ? 'mx-auto text-center items-center' : 'items-start text-left'
  return (
    <Reveal className={`flex max-w-3xl flex-col gap-5 ${alignment} ${className}`}>
      {eyebrow && <Eyebrow icon={eyebrowIcon}>{eyebrow}</Eyebrow>}
      <h2 id={id} className="m-display text-[2.35rem] text-[#0b2451] sm:text-5xl lg:text-[3.6rem]">
        {title}
        {accent && (
          <>
            <br />
            <span className="m-text-gradient">{accent}</span>
          </>
        )}
      </h2>
      {children && <p className="max-w-2xl text-base leading-7 text-[#51627f] sm:text-lg sm:leading-8">{children}</p>}
    </Reveal>
  )
}

export function Stars({ value, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 font-bold text-[#0b2451] ${className}`}>
      <Star className="h-3 w-3 fill-[#ffae13] text-[#ffae13]" aria-hidden="true" />
      {value.toFixed(1)}
    </span>
  )
}

export function StatusBar({ dark = false }) {
  const ink = dark ? 'text-white' : 'text-[#0b2451]'
  return (
    <div className={`flex items-center justify-between px-6 pt-3 text-[10px] font-bold ${ink}`} aria-hidden="true">
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <span className="flex items-end gap-[1.5px]">
          {[4, 6, 8, 10].map((h) => <span key={h} className="w-[2.5px] rounded-sm bg-current" style={{ height: h }} />)}
        </span>
        <span className="ml-1 h-[9px] w-[18px] rounded-[3px] border border-current p-[1px]"><span className="block h-full w-3/4 rounded-[1px] bg-current" /></span>
      </span>
    </div>
  )
}

export function PhoneFrame({ children, className = '', label }) {
  return (
    <div className={`m-phone ${className}`} role="img" aria-label={label}>
      <div className="m-phone-screen h-full w-full">
        <div className="absolute left-1/2 top-2 z-20 h-[18px] w-[76px] -translate-x-1/2 rounded-full bg-[#071a3d]" />
        {children}
      </div>
    </div>
  )
}

export function BrowserFrame({ children, className = '', url = 'mart.gloaro.com', label }) {
  return (
    <div className={`m-glass-strong overflow-hidden rounded-[22px] ${className}`} role="img" aria-label={label}>
      <div className="flex items-center gap-3 border-b border-white/80 bg-white/60 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffc94d]/90" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3ccf7a]/80" />
        </span>
        <span className="mx-auto flex max-w-[60%] flex-1 items-center justify-center gap-1.5 truncate rounded-full bg-[#eef4ff] px-3 py-1 text-[10px] font-semibold text-[#51627f]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          {url}
        </span>
        <span className="w-10" aria-hidden="true" />
      </div>
      {children}
    </div>
  )
}

/* Navy + gold wave, as used at the foot of the app's auth screens. */
export function Wave({ className = '', flip = false }) {
  return (
    <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className={`block w-full ${flip ? 'rotate-180' : ''} ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id="m-wave-navy" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#0b2451" />
          <stop offset="0.55" stopColor="#0d3a86" />
          <stop offset="1" stopColor="#0b2451" />
        </linearGradient>
        <linearGradient id="m-wave-gold" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ffae13" stopOpacity="0" />
          <stop offset="0.45" stopColor="#ffd36e" />
          <stop offset="1" stopColor="#ffae13" />
        </linearGradient>
        <linearGradient id="m-wave-blue" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#1b6fe0" stopOpacity="0.9" />
          <stop offset="0.6" stopColor="#1b6fe0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 40 C 360 150, 760 150, 1080 90 S 1380 30, 1440 20 L1440 160 L0 160 Z" fill="url(#m-wave-navy)" />
      <path d="M0 40 C 360 150, 760 150, 1080 90 S 1380 30, 1440 20" fill="none" stroke="url(#m-wave-blue)" strokeWidth="3" />
      <path d="M300 160 C 700 150, 1000 120, 1200 80 S 1400 30, 1440 26" fill="none" stroke="url(#m-wave-gold)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function Clouds() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="m-cloud left-[-8%] top-[8%] h-56 w-[38rem] opacity-90" />
      <div className="m-cloud right-[-6%] top-[2%] h-48 w-[30rem] opacity-80" />
      <div className="m-cloud left-[30%] top-[40%] h-40 w-[26rem] opacity-60" />
      <div className="m-cloud right-[10%] top-[58%] h-52 w-[34rem] opacity-70" />
    </div>
  )
}
