import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Ellipsis, Heart, MessageCircle, Send } from 'lucide-react'
import { ease } from '../../../lib/motion'
import { mediaUrl } from '../media'
import { Avatar, MediaSlot } from './parts'

const rise = (delay) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: ease.entrance, delay },
})

// Full-screen vertical video with the brand's hook and call to action. The
// video only downloads once this scene is on screen, and only plays while the
// showcase is playing.
export default function Reel({ scene, industry, playing }) {
  const videoRef = useRef(null)
  const video = mediaUrl(scene.video)

  useEffect(() => {
    const element = videoRef.current
    if (!element) return
    if (playing) element.play().catch(() => {})
    else element.pause()
  }, [playing])

  const focus = { objectPosition: scene.focus ?? '50% 50%' }

  return (
    <div className="relative h-full overflow-hidden bg-black text-white">
      {video ? (
        <video
          ref={videoRef}
          src={video}
          poster={mediaUrl(scene.poster) ?? undefined}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
          style={focus}
        />
      ) : (
        <MediaSlot path={scene.poster} label={scene.alt} industry={industry} className="absolute inset-0 h-full w-full" style={focus} />
      )}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-12">
        <span className="font-outfit text-[16px] font-semibold">Reels</span>
        <Camera className="h-5 w-5" />
      </div>

      <div className="absolute bottom-32 right-3 flex flex-col items-center gap-5">
        <Heart className="h-6 w-6" />
        <MessageCircle className="h-6 w-6" />
        <Send className="h-6 w-6" />
        <Ellipsis className="h-6 w-6" />
      </div>

      <div className="absolute inset-x-0 bottom-0 px-4 pb-7">
        <motion.div {...rise(0.15)} className="flex items-center gap-2 pr-12">
          <Avatar industry={industry} size={28} />
          <span className="truncate text-[12px] font-bold">{industry.brand.name}</span>
          <span className="shrink-0 rounded-md border border-white/60 px-2 py-0.5 text-[10px] font-semibold">Follow</span>
        </motion.div>
        <motion.p {...rise(0.35)} className="mt-3 pr-10 font-outfit text-[20px] font-semibold leading-[1.15] tracking-tight">{scene.headline}</motion.p>
        <motion.p {...rise(0.5)} className="mt-1.5 pr-10 text-[11px] font-medium text-white/80">{scene.sub}</motion.p>
        <motion.span
          {...rise(0.7)}
          className="mt-4 block rounded-lg py-2.5 text-center text-[12px] font-bold shadow-lg"
          style={{ background: industry.accent }}
        >
          {scene.cta}
        </motion.span>
      </div>
    </div>
  )
}
