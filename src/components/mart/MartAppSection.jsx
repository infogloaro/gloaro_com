import { motion } from 'framer-motion'
import { Bell, MapPin, Package, Search, Smartphone } from 'lucide-react'
import { FaApple, FaGooglePlay } from 'react-icons/fa'
import { PhoneFrame, Reveal, SectionHeading } from './primitives'
import { MobileHomeScreen, MobileLoginScreen, MobileTrackScreen } from './mockups'
import { EASE } from './martData'

const perks = [
  [Search, 'Search & browse anywhere'],
  [MapPin, 'Find vendors near you'],
  [Package, 'Track orders live'],
  [Bell, 'Get order & offer alerts'],
]

// Store listings are not live yet — these badges are intentionally non-functional.
const stores = [
  { icon: FaApple, top: 'Coming soon on the', name: 'App Store' },
  { icon: FaGooglePlay, top: 'Coming soon on', name: 'Google Play' },
]

export default function MartAppSection() {
  return (
    <section id="app" className="relative overflow-hidden py-20 sm:py-28" aria-labelledby="mart-app-title">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_500px_at_75%_50%,rgba(27,111,224,0.14),transparent_70%),radial-gradient(600px_400px_at_20%_80%,rgba(255,211,110,0.18),transparent_70%)]" aria-hidden="true" />
      <div className="mx-auto grid grid-cols-1 max-w-[1280px] items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionHeading id="mart-app-title" align="left" eyebrow="Mobile app" eyebrowIcon={Smartphone} title="Take GLOARO MART" accent="With You.">
            Everything you love about GLOARO MART, in your pocket. Browse, search, check out and follow your orders wherever you are.
          </SectionHeading>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {perks.map(([Icon, label], i) => (
              <Reveal as="li" key={label} delay={i * 0.06} className="m-glass flex items-center gap-3 rounded-2xl px-4 py-3">
                <span className="m-icon-well grid h-9 w-9 place-items-center rounded-xl text-[#0b469e]"><Icon className="h-4 w-4" aria-hidden="true" /></span>
                <span className="text-sm font-bold text-[#0b2451]">{label}</span>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.2} className="mt-10">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#0b469e]">Get the GLOARO MART App</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {stores.map(({ icon: Icon, top, name }) => (
                <span
                  key={name}
                  role="button"
                  aria-disabled="true"
                  tabIndex={0}
                  title="Store links will be available at launch"
                  className="flex cursor-not-allowed items-center gap-3 rounded-2xl bg-[#0b2451] px-5 py-3 text-white shadow-[0_16px_30px_-14px_rgba(11,36,81,0.7)] ring-1 ring-white/10"
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                  <span className="leading-tight">
                    <span className="block text-[10px] font-medium text-white/70">{top}</span>
                    <span className="block text-base font-bold">{name}</span>
                  </span>
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-[#7a8aa6]">Store listings will be linked here when the app launches.</p>
          </Reveal>
        </div>

        <div className="relative mx-auto flex h-[560px] w-full max-w-[560px] items-center justify-center">
          <div className="pointer-events-none absolute h-[420px] w-[420px] rounded-full bg-[conic-gradient(from_180deg,rgba(255,174,19,0.25),rgba(27,111,224,0.25),rgba(255,174,19,0.25))] blur-3xl" aria-hidden="true" />
          {[
            { screen: <MobileTrackScreen />, label: 'Order tracking', cls: 'hidden sm:block absolute left-0 top-12', rotate: -8, x: -30 },
            { screen: <MobileHomeScreen />, label: 'Home', cls: 'hidden sm:block absolute right-0 top-12', rotate: 8, x: 30 },
            { screen: <MobileLoginScreen />, label: 'Sign in', cls: 'relative z-10', rotate: 0, x: 0 },
          ].map((phone, i) => (
            <motion.div
              key={phone.label}
              className={phone.cls}
              initial={{ opacity: 0, y: 60, rotate: 0, x: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: phone.rotate, x: phone.x }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: EASE }}
            >
              <PhoneFrame className={i === 2 ? 'h-[530px] w-[258px]' : 'h-[460px] w-[224px] opacity-95'} label={`GLOARO MART app — ${phone.label} screen`}>
                {phone.screen}
              </PhoneFrame>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
