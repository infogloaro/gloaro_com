import { mediaUrl } from '../media'

const fitClass = { cover: 'object-cover', contain: 'object-contain' }

// Image from the industry's media folder, or a tinted placeholder (with the
// intended subject as its caption) until the file is added.
export function MediaSlot({ path, label, industry, fit = 'cover', className = '', style }) {
  const src = mediaUrl(path)
  // Letterboxed images sit on a blurred copy of themselves, as social apps do.
  if (src && fit === 'contain') {
    return (
      <div className={`overflow-hidden ${className}`} style={style}>
        <img src={src} alt="" decoding="async" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-70 blur-xl" />
        <img src={src} alt="" decoding="async" className="absolute inset-0 h-full w-full object-contain" />
      </div>
    )
  }
  if (src) return <img src={src} alt="" decoding="async" className={`${fitClass[fit]} ${className}`} style={style} />
  const { accent, Icon } = industry
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 p-6 text-center ${className}`}
      style={{ ...style, background: `linear-gradient(155deg, ${accent}26, ${accent}80)` }}
    >
      <Icon aria-hidden="true" className="h-10 w-10 text-white/90" strokeWidth={1.5} />
      <span className="max-w-[85%] text-[10px] font-semibold leading-snug text-white/85">{label}</span>
    </div>
  )
}

export function Avatar({ industry, size = 30 }) {
  const { brand, accent } = industry
  const src = mediaUrl(brand.logo)
  return (
    <span
      className="grid shrink-0 place-items-center overflow-hidden rounded-full bg-white text-[10px] font-black text-white ring-2 ring-white/80"
      style={{ width: size, height: size, background: src ? '#fff' : accent }}
    >
      {src ? <img src={src} alt="" className="h-full w-full object-contain" /> : brand.short}
    </span>
  )
}

export function StatusBar({ tone = 'dark' }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 z-20 flex h-11 items-center justify-between px-7 pt-1 text-[12px] font-semibold ${tone === 'light' ? 'text-white' : 'text-[#0f172a]'}`}>
      <span>9:41</span>
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <span className="flex items-end gap-[1.5px]">
          {[4, 6, 8, 10].map((h) => <span key={h} className="w-[2.5px] rounded-sm bg-current" style={{ height: h }} />)}
        </span>
        <span className="h-[10px] w-[20px] rounded-[3px] border border-current p-[1.5px]"><span className="block h-full w-3/4 rounded-[1px] bg-current" /></span>
      </span>
    </div>
  )
}
