import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FloatingWhatsApp from '../components/FloatingWhatsApp'
import BackButton from '../components/common/BackButton'
import { ScrollProgressBar } from '../components/motion/Scroll'
import CursorFollower from '../components/motion/CursorFollower'
import IntroSplash from '../components/motion/IntroSplash'
import SmoothScroll from '../components/motion/SmoothScroll'
import { ease, transition } from '../lib/motion'

export default function PublicLayout() {
  const { pathname } = useLocation()
  const outlet = useOutlet()
  // Skip the route fade only for the page the visitor landed on (keeps LCP
  // fast). Don't use AnimatePresence initial={false} for this: it propagates
  // to every motion element on the page and silently disables their entrances.
  const [landingPath] = useState(pathname)

  return (
    <MotionConfig reducedMotion="user">
      <IntroSplash />
      <SmoothScroll />
      <ScrollProgressBar />
      <Navbar />
      <BackButton />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={pathname === landingPath ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.entrance } }}
          exit={{ opacity: 0, transition: transition.exit }}
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
      <Footer />
      <FloatingWhatsApp />
      <CursorFollower />
    </MotionConfig>
  )
}
