import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Monitor, Smartphone } from 'lucide-react'
import { BrowserFrame, PhoneFrame, SectionHeading } from './primitives'
import { MobileHomeScreen, MobileSearchScreen, MobileTrackScreen, WebHomeScreen } from './mockups'
import { EASE } from './martData'

const tabs = [
  {
    id: 'web',
    label: 'Web Experience',
    icon: Monitor,
    points: [
      ['Big-screen browsing', 'Compare products and sellers side by side.'],
      ['Faster for bulk', 'Ideal for business buyers placing larger orders.'],
      ['Same account', 'Your cart, wishlist and orders follow you.'],
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile Experience',
    icon: Smartphone,
    points: [
      ['Shop on the go', 'Search, browse and order from anywhere.'],
      ['Nearby, instantly', 'Discover vendors around your current location.'],
      ['Live updates', 'Order notifications and tracking in your pocket.'],
    ],
  },
]

const phones = [
  { screen: <MobileSearchScreen />, label: 'Smart Search screen', rotate: -6, y: 30 },
  { screen: <MobileHomeScreen />, label: 'Home screen', rotate: 0, y: 0 },
  { screen: <MobileTrackScreen />, label: 'Order tracking screen', rotate: 6, y: 30 },
]

export default function MartWebMobile() {
  const [active, setActive] = useState('web')
  const tabRefs = useRef([])
  const current = tabs.find((t) => t.id === active)

  const onKeyDown = (event, index) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
    setActive(tabs[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="web-mobile" className="relative overflow-hidden py-20 sm:py-28" aria-labelledby="mart-webmobile-title">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(27,111,224,0.14),transparent)]" aria-hidden="true" />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading id="mart-webmobile-title" eyebrow="Web + Mobile" title="Your Marketplace." accent="On Every Screen.">
          One GLOARO MART account, two beautifully matched experiences. Start on your laptop, finish on your phone.
        </SectionHeading>

        <div role="tablist" aria-label="Choose experience" className="m-glass mx-auto mt-10 flex w-fit gap-1 rounded-full p-1.5">
          {tabs.map((tab, i) => {
            const Icon = tab.icon
            const selected = tab.id === active
            return (
              <button
                key={tab.id}
                ref={(el) => { tabRefs.current[i] = el }}
                role="tab"
                id={`mart-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls="mart-tabpanel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(tab.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors sm:px-6 ${selected ? 'text-white' : 'text-[#51627f] hover:text-[#0b2451]'}`}
              >
                {selected && <motion.span layoutId="mart-tab-pill" className="m-btn-navy absolute inset-0 -z-10 rounded-full" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>
                  {tab.label.split(' ')[0]}
                  <span className="hidden sm:inline"> Experience</span>
                </span>
              </button>
            )
          })}
        </div>

        <div id="mart-tabpanel" role="tabpanel" aria-labelledby={`mart-tab-${active}`} className="relative mt-14">
          <AnimatePresence mode="wait">
            {active === 'web' ? (
              <motion.div
                key="web"
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="relative mx-auto max-w-[1040px]"
              >
                <BrowserFrame label="GLOARO MART web experience on desktop" className="shadow-[0_60px_120px_-50px_rgba(11,36,81,0.55)]">
                  <div className="md:[zoom:1.2] lg:[zoom:1.45]"><WebHomeScreen /></div>
                </BrowserFrame>
                <div className="absolute -bottom-16 -right-2 hidden md:block lg:-right-24">
                  <PhoneFrame className="h-[440px] w-[214px]" label="Matching GLOARO MART mobile app">
                    <MobileHomeScreen />
                  </PhoneFrame>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="mobile"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <ul className="m-no-scrollbar -mx-4 flex snap-x snap-mandatory items-start gap-6 overflow-x-auto px-4 pb-6 md:mx-0 md:justify-center md:overflow-visible md:px-0">
                  {phones.map((phone, i) => (
                    <motion.li
                      key={phone.label}
                      className="shrink-0 snap-center"
                      initial={{ opacity: 0, y: 50, rotate: 0 }}
                      animate={{ opacity: 1, y: phone.y, rotate: phone.rotate }}
                      transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                      style={{ zIndex: i === 1 ? 2 : 1 }}
                    >
                      <PhoneFrame className="h-[520px] w-[252px]" label={`GLOARO MART mobile app — ${phone.label}`}>
                        {phone.screen}
                      </PhoneFrame>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.ul
            key={current.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3"
          >
            {current.points.map(([title, text]) => (
              <li key={title} className="m-glass rounded-2xl p-5 text-center">
                <p className="font-extrabold text-[#0b2451]">{title}</p>
                <p className="mt-1 text-sm leading-6 text-[#51627f]">{text}</p>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </section>
  )
}
