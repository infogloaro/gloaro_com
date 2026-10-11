import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { ArrowLeft, ArrowRight, Download, Menu, X } from 'lucide-react'
import { MartLogo } from './primitives'
import { EASE, MARKETPLACE_URL, navLinks } from './martData'

export default function MartNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = navLinks.map((link) => document.getElementById(link.id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const glass = scrolled || open

  return (
    <header data-back-anchor className="fixed inset-x-0 top-0 z-50">
      <motion.div style={{ scaleX: progress }} className="absolute inset-x-0 top-0 h-[3px] origin-left bg-[linear-gradient(90deg,#0b469e,#1b6fe0,#ffae13)]" aria-hidden="true" />
      <motion.nav
        aria-label="GLOARO MART"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mx-auto max-w-[1360px] px-3 pt-3 sm:px-5"
      >
        <div
          className={`flex items-center gap-3 rounded-[24px] px-3 py-2.5 transition-all duration-500 sm:px-4 ${
            glass ? 'm-glass-strong' : 'border border-transparent bg-transparent'
          }`}
        >
          <a href="#top" aria-label="GLOARO MART — back to top" className="shrink-0 rounded-xl">
            <MartLogo compact />
          </a>

          <ul className="mx-auto hidden items-center gap-1 xl:flex">
            {navLinks.map((link) => {
              const isActive = active === link.id
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative block rounded-full px-4 py-2 text-sm font-semibold transition-colors ${isActive ? 'text-[#0b2451]' : 'text-[#51627f] hover:text-[#0b2451]'}`}
                  >
                    {isActive && (
                      <motion.span layoutId="mart-nav-pill" className="absolute inset-0 -z-10 rounded-full bg-white shadow-[0_6px_18px_-8px_rgba(11,36,81,0.35)] ring-1 ring-[#ffae13]/40" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                    )}
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="ml-auto flex items-center gap-2 xl:ml-0">
            <a href="#app" className="m-btn m-btn-glass hidden px-4 py-2.5 text-sm md:inline-flex">
              <Download className="h-4 w-4" aria-hidden="true" />
              Get App
            </a>
            <Link to={MARKETPLACE_URL} className="m-btn m-btn-navy hidden px-5 py-2.5 text-sm sm:inline-flex">
              Explore Marketplace
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="m-btn m-btn-glass h-11 w-11 xl:hidden"
              aria-expanded={open}
              aria-controls="mart-mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mart-mobile-menu"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="m-glass-strong mt-2 max-h-[calc(100dvh-100px)] overflow-y-auto rounded-[24px] p-3 xl:hidden"
            >
              <motion.ul initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05 } } }} className="grid gap-1">
                {navLinks.map((link, i) => (
                  <motion.li key={link.id} variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}>
                    <a
                      href={`#${link.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-semibold text-[#0b2451] transition hover:bg-white/80"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-xs font-extrabold text-[#ffae13]">0{i + 1}</span>
                        {link.label}
                      </span>
                      <ArrowRight className="h-4 w-4 text-[#0b469e]" aria-hidden="true" />
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
              <div className="mt-3 grid gap-2 border-t border-white/80 pt-3 sm:grid-cols-2">
                <Link to={MARKETPLACE_URL} onClick={() => setOpen(false)} className="m-btn m-btn-navy py-3.5 text-sm">
                  Explore Marketplace <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a href="#app" onClick={() => setOpen(false)} className="m-btn m-btn-glass py-3.5 text-sm">
                  <Download className="h-4 w-4" aria-hidden="true" /> Get the App
                </a>
              </div>
              <Link to="/" className="mt-3 flex items-center justify-center gap-2 py-2 text-xs font-semibold text-[#51627f] hover:text-[#0b2451]">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Back to GLOARO
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  )
}
