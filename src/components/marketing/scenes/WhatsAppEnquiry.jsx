import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Camera, CheckCheck, MapPin, Mic, Paperclip, Phone, Smile, Video } from 'lucide-react'
import { spring } from '../../../lib/motion'
import { MESSAGE_INTERVAL } from '../industries'
import { Avatar } from './parts'

const time = (i) => `10:${String(14 + i * 2).padStart(2, '0')}`

function Bubble({ message, index }) {
  const outgoing = message.from === 'customer'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={spring.interactive}
      className={`max-w-[82%] rounded-xl px-2.5 py-1.5 text-[11px] leading-snug text-[#111b21] shadow-[0_1px_1px_rgba(0,0,0,0.12)] ${outgoing ? 'self-end rounded-tr-sm bg-[#d9fdd3]' : 'self-start rounded-tl-sm bg-white'}`}
    >
      {message.type === 'location' ? (
        <span className="block w-40">
          <span className="relative mb-1 block h-20 overflow-hidden rounded-lg bg-[#e7efe3] [background-image:linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:16px_16px]">
            <span className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rotate-[-12deg] bg-white/90" />
            <MapPin className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-full fill-[#ea4335] text-white" />
          </span>
          <span className="font-semibold">{message.text}</span>
        </span>
      ) : (
        message.text
      )}
      <span className="mt-0.5 flex items-center justify-end gap-1 text-[9px] text-slate-500">
        {time(index)}
        {outgoing && <CheckCheck className="h-3 w-3 text-[#53bdeb]" />}
      </span>
    </motion.div>
  )
}

function Typing({ outgoing }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex gap-1 rounded-xl px-3 py-2.5 shadow-[0_1px_1px_rgba(0,0,0,0.12)] ${outgoing ? 'self-end bg-[#d9fdd3]' : 'self-start bg-white'}`}
    >
      {[0, 1, 2].map((i) => <span key={i} className="mk-typing h-1.5 w-1.5 rounded-full bg-slate-400" style={{ animationDelay: `${i * 0.15}s` }} />)}
    </motion.div>
  )
}

// The enquiry lands in a WhatsApp-style chat with the business. The phone is
// the customer's, so their messages are the outgoing (green) ones. Always
// labelled as illustrative: these are not real customer messages.
export default function WhatsAppEnquiry({ scene, industry, playing, reduce }) {
  const total = scene.messages.length
  const [count, setCount] = useState(0)
  const shown = reduce ? total : count

  useEffect(() => {
    if (!playing || count >= total) return undefined
    const id = window.setTimeout(() => setCount((c) => c + 1), count === 0 ? 700 : MESSAGE_INTERVAL * 1000)
    return () => window.clearTimeout(id)
  }, [playing, count, total])

  const upcoming = scene.messages[shown]

  return (
    <div className="flex h-full flex-col bg-[#efeae2]">
      <div className="flex items-center gap-2 bg-[#075e54] px-2.5 pb-2.5 pt-11 text-white">
        <ArrowLeft className="h-4 w-4 shrink-0" />
        <Avatar industry={industry} size={30} />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[12px] font-bold">{industry.brand.name}</p>
          <p className="text-[10px] text-white/75">online</p>
        </div>
        <Video className="h-4 w-4 shrink-0" />
        <Phone className="ml-2 h-4 w-4 shrink-0" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-end gap-1.5 overflow-hidden px-2.5 py-3">
        <span className="mb-1 self-center rounded-md bg-white/80 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-500 shadow-sm">
          Illustrative conversation
        </span>
        {scene.messages.slice(0, shown).map((message, i) => <Bubble key={i} message={message} index={i} />)}
        {playing && upcoming && shown > 0 && <Typing key={`typing-${shown}`} outgoing={upcoming.from === 'customer'} />}
      </div>

      <div className="flex items-center gap-1.5 bg-[#f0f2f5] px-2 pb-5 pt-2">
        <span className="flex flex-1 items-center gap-2 rounded-full bg-white px-3 py-2 text-[11px] text-slate-400">
          <Smile className="h-4 w-4" />
          <span className="flex-1">Message</span>
          <Paperclip className="h-4 w-4" />
          <Camera className="h-4 w-4" />
        </span>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#00a884] text-white"><Mic className="h-4 w-4" /></span>
      </div>
    </div>
  )
}
