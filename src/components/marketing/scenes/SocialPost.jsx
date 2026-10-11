import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bookmark, Ellipsis, Heart, House, MessageCircle, Plus, Search, Send, Video } from 'lucide-react'
import { spring } from '../../../lib/motion'
import { Avatar, MediaSlot } from './parts'

// A post in a generic social feed. No like or comment counts: we never show
// engagement numbers we can't back up.
export default function SocialPost({ scene, industry, playing }) {
  const [liked, setLiked] = useState(false)

  // A beat after the post lands, the viewer double-taps it.
  useEffect(() => {
    if (!playing || liked) return undefined
    const id = window.setTimeout(() => setLiked(true), 1600)
    return () => window.clearTimeout(id)
  }, [playing, liked])

  return (
    <div className="flex h-full flex-col bg-white pt-11 text-[#0f172a]">
      <div className="flex items-center justify-between px-4 pb-1.5">
        <span className="font-outfit text-[17px] font-semibold tracking-tight">Feed</span>
        <span className="flex gap-3.5 text-slate-700"><Heart className="h-[18px] w-[18px]" /><Send className="h-[18px] w-[18px]" /></span>
      </div>

      <div className="flex items-center gap-2 px-3 py-2">
        <Avatar industry={industry} size={30} />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[12px] font-bold">{industry.brand.name}</p>
          <p className="truncate text-[10px] text-slate-500">{industry.brand.location}</p>
        </div>
        <Ellipsis className="h-4 w-4 text-slate-500" />
      </div>

      <div className="relative min-h-0 flex-1 bg-slate-100">
        <MediaSlot path={scene.image} label={scene.alt} industry={industry} fit={scene.fit} className="absolute inset-0 h-full w-full" />
        {liked && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.25, 1, 1], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.1, times: [0, 0.25, 0.4, 1] }}
            className="absolute inset-0 grid place-items-center"
          >
            <Heart className="h-20 w-20 fill-white text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]" />
          </motion.span>
        )}
      </div>

      <div className="flex items-center gap-3.5 px-3 pb-1.5 pt-2.5 text-slate-800">
        <motion.span animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }} transition={spring.interactive}>
          <Heart className={`h-[19px] w-[19px] ${liked ? 'fill-[#ff3040] text-[#ff3040]' : ''}`} />
        </motion.span>
        <MessageCircle className="h-[19px] w-[19px]" />
        <Send className="h-[19px] w-[19px]" />
        <Bookmark className="ml-auto h-[19px] w-[19px]" />
      </div>
      <p className="mb-2 line-clamp-3 px-3 text-[11px] leading-snug">
        <span className="font-bold">{industry.brand.short}</span> {scene.caption}{' '}
        <span className="text-[#1d4ed8]">{scene.tags?.join(' ')}</span>
      </p>

      <div className="flex items-center justify-around border-t border-slate-200 px-2 pb-4 pt-2.5 text-slate-800">
        <House className="h-5 w-5" />
        <Search className="h-5 w-5" />
        <Plus className="h-5 w-5" />
        <Video className="h-5 w-5" />
        <span className="h-5 w-5 rounded-full bg-slate-300" />
      </div>
    </div>
  )
}
