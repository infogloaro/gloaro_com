import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import api from '../api/axios'
import { useAuth } from '../hooks/useAuth'
import { getDashboardRoute } from '../utils/permissions'
import {
  BriefcaseBusiness,
  CalendarDays,
  CircleHelp,
  ChevronDown,
  Handshake,
  Network,
  Rocket,
  ShieldCheck,
  Smartphone,
  Trophy,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'
import logo from '../assets/logo.png'
import networkIcon from '../assets/network_icon.png'
import shopIcon from '../assets/shop_icon.png'
import brandIcon from '../assets/brand_icon.png'
import nearMeIcon from '../assets/nearme_icon.png'
import loginIcon from '../assets/login_icon.png'
import aboutIcon from '../assets/about_icon.svg'

const SearchIcon = () => <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-none stroke-current stroke-[3.25]"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>

const networkMenu = [
  [Users, 'Membership', ['Join Gloaro Network', 'Membership Benefits', 'Member Access']],
  [Network, 'Business Network', ['360 Gloaro Network', 'Global Business Network', 'Business Growth', 'Business Opportunities']],
  [Handshake, 'Referral Program', ['Referral Meeting', 'Referral Join', 'Referral Benefits']],
  [Smartphone, 'Mobile App', ['Gloaro App', 'Member App', 'Business Management App']],
  [BriefcaseBusiness, 'Business Services', ['Technology Development', 'Mobile App Development', 'Digital Marketing', 'IT Solutions', 'SaaS Solution']],
  [CalendarDays, 'Events & Community', ['Monthly Meetings', 'Business Expo', 'Social Events', 'District Community', 'Tamil Nadu Community', 'Global Community']],
  [Rocket, 'Franchise', ['Available Locations', 'Apply Franchise', 'Franchise Partners']],
  [Trophy, 'Leaders & Achievements', ['Leaders', 'Coordinators', 'Business Runner', 'Goal Achiever', 'Member Achievements']],
  [CircleHelp, 'Help Center', ['AI Assistant', 'Contact Support', 'Social Media Links']],
]

const networkHighlights = [
  [Network, 'Global Connections', 'Access 50+ countries network'],
  [TrendingUp, 'Business Growth', 'Scalable B2B resources'],
  [ShieldCheck, 'Verified Network', 'Trusted enterprise leaders'],
]

const networkTargets = {
  'Membership Benefits': 'membership-benefits-detail',
  'Yearly Subscription': 'membership-investment',
  'Member Access': 'member-access',
  '360 Gloaro Network': 'gloaro-360-network',
  'Global Business Network': 'global-business-network',
  'Business Growth': 'business-growth',
  'Business Opportunities': 'business-opportunities',
  'Referral Meeting': 'referral-meeting',
  'Referral Join': 'referral-join',
  'Referral Benefits': 'referral-benefits',
  'Gloaro App': 'gloaro-app',
  'Member App': 'member-app',
  'Business Management App': 'business-management-app',
  'Technology Development': 'technology-development',
  'Mobile App Development': 'mobile-app-development',
  'Digital Marketing': 'digital-marketing',
  'IT Solutions': 'it-solutions',
  'SaaS Solution': 'saas-solution',
  'Monthly Meetings': 'monthly-meetings',
  'Business Expo': 'business-expo',
  'Social Events': 'social-events',
  'District Community': 'district-community',
  'Tamil Nadu Community': 'tamil-nadu-community',
  'Global Community': 'global-community',
  'Available Locations': 'available-locations',
  'Apply Franchise': 'apply-franchise',
  'Franchise Partners': 'franchise-partners',
  Leaders: 'network-leaders',
  Coordinators: 'network-coordinators',
  'Business Runner': 'business-runner',
  'Goal Achiever': 'goal-achiever',
  'Member Achievements': 'member-achievements',
  'AI Assistant': 'ai-assistant',
  'Contact Support': 'contact-support',
  'Social Media Links': 'social-media-links',
}

const getNetworkHref = (label) => label === 'Join Gloaro Network' ? '/register' : `/#${networkTargets[label]}`

const headerMotion = {
  initial: { opacity: 0, y: -10, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.99 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
}

const dropdownMotion = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 12, scale: 0.985 },
  transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
}

const searchMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.18, ease: 'easeOut' },
}

export default function Navbar() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [networkOpen, setNetworkOpen] = useState(false)
  const [mobileNetworkOpen, setMobileNetworkOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    if (!networkOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [networkOpen])

  useEffect(() => {
    const query = searchQuery.trim()
    if (query.length < 2) {
      return undefined
    }

    let active = true
    const timer = window.setTimeout(() => {
      if (active) setSearchLoading(true)
      Promise.all([
        api.get('/products', { params: { search: query, limit: 4 } }),
        api.get('/services', { params: { search: query, limit: 4 } }),
      ])
        .then(([productsResponse, servicesResponse]) => {
          if (!active) return
          const products = (productsResponse.data?.data || []).map((item) => ({ ...item, searchType: 'product' }))
          const services = (servicesResponse.data?.data || []).map((item) => ({ ...item, searchType: 'service' }))
          setSearchResults([...products, ...services].slice(0, 6))
        })
        .catch(() => {
          if (active) setSearchResults([])
        })
        .finally(() => {
          if (active) setSearchLoading(false)
        })
    }, 300)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [searchQuery])

  const openSearchResult = (item) => {
    if (!item?._id) return
    setSearchOpen(false)
    setSearchQuery('')
    setSearchResults([])
    navigate(`/${item.searchType === 'service' ? 'services' : 'products'}/${item._id}`)
  }

  const submitSearch = async (event) => {
    event.preventDefault()
    const query = searchQuery.trim()
    if (!query) return
    if (searchResults.length) {
      openSearchResult(searchResults[0])
      return
    }

    setSearchLoading(true)
    try {
      const [productsResponse, servicesResponse] = await Promise.all([
        api.get('/products', { params: { search: query, limit: 1 } }),
        api.get('/services', { params: { search: query, limit: 1 } }),
      ])
      const firstProduct = productsResponse.data?.data?.[0]
      const firstService = servicesResponse.data?.data?.[0]
      if (firstProduct) openSearchResult({ ...firstProduct, searchType: 'product' })
      else if (firstService) openSearchResult({ ...firstService, searchType: 'service' })
      else setSearchOpen(true)
    } catch {
      setSearchOpen(true)
    } finally {
      setSearchLoading(false)
    }
  }

  const navItems = [
    [nearMeIcon, 'Near Me', '/nearby', 'hidden border border-slate-200/80 bg-white/70 text-slate-700 hover:border-slate-300 hover:bg-white', 'group-hover:-translate-y-0.5'],
    [shopIcon, 'Shop', '/products', 'border border-amber-200/80 bg-gradient-to-r from-amber-300 to-amber-200 text-[#073b7a] shadow-[0_12px_24px_rgba(255,174,19,0.16)] hover:shadow-[0_16px_30px_rgba(255,174,19,0.22)]', 'brightness-0 contrast-125'],
    [brandIcon, 'B2B Services', '/services', 'border border-emerald-200/80 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-[0_12px_24px_rgba(16,185,129,0.18)] hover:shadow-[0_16px_30px_rgba(16,185,129,0.24)]', 'brightness-0 invert'],
    [aboutIcon, 'About', '/about', 'border border-amber-200/80 bg-white/80 text-[#073b7a] hover:border-amber-300 hover:bg-amber-50/90', ''],
  ]

  return (
    <header className="sticky top-0 z-50 font-jakarta">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0b469e]/40 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#0b469e,#10b981,#ffb20c,#0b469e)] bg-[length:200%_100%] animate-[navbar-pan_12s_linear_infinite]" />
      <div className="mx-auto max-w-[1440px] px-3 py-3 sm:px-5 lg:px-7">
        <motion.div
          initial="initial"
          animate="animate"
          variants={headerMotion}
          className="relative"
        >
          <div className="rounded-[28px] border border-white/70 bg-white/80 px-3 py-3 shadow-[0_16px_60px_rgba(11,70,158,0.12)] backdrop-blur-xl sm:px-4">
            <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_top_left,rgba(11,70,158,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,178,12,0.16),transparent_24%)]" />
            <div className="relative flex items-center gap-2 xl:gap-3">
              <a href="/" aria-label="Go to home page" className="group flex w-24 shrink-0 items-center sm:w-28">
                <img src={logo} alt="Gloaro Business Network" className="h-auto w-full origin-left object-contain transition duration-300 group-hover:scale-[1.03] group-hover:drop-shadow-[0_8px_20px_rgba(11,70,158,0.12)]" />
              </a>

              <div className="hidden flex-1 items-center gap-3 lg:flex">
                <div className="relative">
                  <button type="button" onClick={() => setNetworkOpen(true)} className="group relative flex h-11 items-center gap-2 overflow-hidden whitespace-nowrap rounded-full border border-blue-900/10 bg-[linear-gradient(135deg,#0b469e_0%,#1b6fe0_48%,#0b469e_100%)] px-5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(11,70,158,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(11,70,158,0.28)]" aria-expanded={networkOpen} aria-haspopup="true">
                    <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.3),transparent)] bg-[length:200%_100%] opacity-0 transition duration-500 group-hover:animate-[navbar-shine_1.8s_linear_infinite] group-hover:opacity-100" />
                    <span className="relative flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 ring-1 ring-white/25">
                        <img src={networkIcon} alt="" className="h-4 w-4 object-contain" />
                      </span>
                      <span>Gloaro Network</span>
                      <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/90">Explore</span>
                    </span>
                  </button>
                  <AnimatePresence>
                    {networkOpen && <GloaroNetworkMenu key="network-menu" onClose={() => setNetworkOpen(false)} />}
                  </AnimatePresence>
                </div>
                {navItems.map(([icon, label, href, colors, iconClass = '']) => (
                  <a key={label} href={href} className={`group flex h-11 items-center gap-2 whitespace-nowrap rounded-full px-3 text-xs font-semibold transition duration-300 hover:-translate-y-0.5 xl:px-4 xl:text-sm ${colors}`}>
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-white/70 ring-1 ring-black/5">
                      <img src={icon} alt="" className={`h-3.5 w-3.5 object-contain transition duration-300 group-hover:scale-110 ${iconClass}`} />
                    </span>
                    <span className="relative">
                      {label}
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-current transition-all duration-300 group-hover:w-full" />
                    </span>
                  </a>
                ))}
              </div>

              <div className="ml-auto hidden items-center gap-4 text-[#0b469e] lg:flex">
                {isAuthenticated ? (
                  <a href={getDashboardRoute(user?.role, user)} aria-label="Open account dashboard" className="group flex h-11 items-center gap-2.5 rounded-full border border-[#0b469e]/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(239,246,255,0.95))] px-2.5 pr-4 text-[#0b469e] shadow-[0_10px_24px_rgba(11,70,158,0.12)] transition duration-300 hover:-translate-y-0.5 hover:border-[#0b469e]/30 hover:shadow-[0_16px_30px_rgba(11,70,158,0.18)]">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[linear-gradient(135deg,#0b469e,#1b6fe0)] ring-2 ring-blue-100">
                      <img src={loginIcon} alt="" className="h-4 w-4 object-contain brightness-0 invert" />
                    </span>
                    <span className="max-w-32 truncate text-sm font-bold">{user?.name || 'Account'}</span>
                    <span className="text-xs transition duration-300 group-hover:translate-x-1">›</span>
                  </a>
                ) : (
                  <>
                    <a href="/login" className="group flex items-center gap-1.5 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 hover:text-[#0b469e]">
                      <img src={loginIcon} alt="" className="h-5 w-5 object-contain" />
                      <span className="relative">
                        Login
                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-[#0b469e] transition-all duration-300 group-hover:w-full" />
                      </span>
                    </a>
                    <a href="/register" className="rounded-full border border-[#0b469e]/15 bg-[linear-gradient(135deg,#0b469e,#1b6fe0)] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(11,70,158,0.2)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(11,70,158,0.26)]">
                      Register
                    </a>
                  </>
                )}
              </div>

              <button
                onClick={() => setOpen((value) => !value)}
                className="ml-auto flex h-11 items-center gap-2 rounded-full border border-[#0b469e]/10 bg-[linear-gradient(135deg,#0b469e,#1b6fe0)] px-4 text-white shadow-[0_12px_26px_rgba(11,70,158,0.2)] transition duration-300 hover:-translate-y-0.5 lg:hidden"
                aria-label="Toggle menu"
                aria-expanded={open}
              >
                <span className="flex flex-col gap-1">
                  <span className={`h-0.5 w-4 rounded-full bg-white transition duration-300 ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
                  <span className={`h-0.5 w-4 rounded-full bg-white transition duration-300 ${open ? 'opacity-0' : ''}`} />
                  <span className={`h-0.5 w-4 rounded-full bg-white transition duration-300 ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
                </span>
                <span className="text-xs font-black uppercase tracking-[0.18em]">{open ? 'Close' : 'Menu'}</span>
              </button>
            </div>

            <form onSubmit={submitSearch} className="relative mt-3 w-full max-w-[640px] lg:mt-4">
              <label className="flex h-11 w-full items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-5 text-[#0b469e] shadow-[0_12px_28px_rgba(15,23,42,0.06)] transition duration-300 focus-within:border-[#0b469e]/30 focus-within:shadow-[0_16px_34px_rgba(11,70,158,0.14)]">
                <SearchIcon />
                <input
                  value={searchQuery}
                  onChange={(event) => {
                    const nextQuery = event.target.value
                    setSearchQuery(nextQuery)
                    if (nextQuery.trim().length < 2) {
                      setSearchResults([])
                      setSearchLoading(false)
                    }
                    setSearchOpen(true)
                  }}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => window.setTimeout(() => setSearchOpen(false), 150)}
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-500"
                  placeholder="Search for Products and Services"
                  aria-label="Search products and services"
                  autoComplete="off"
                />
              </label>

              <AnimatePresence>
                {searchOpen && searchQuery.trim().length >= 2 && (
                  <motion.div
                    key="search-results"
                    {...searchMotion}
                    className="absolute left-0 right-0 top-[calc(100%+8px)] z-[70] overflow-hidden rounded-2xl border border-white/70 bg-white/95 shadow-[0_24px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl"
                  >
                    {searchLoading ? (
                      <p className="px-4 py-4 text-sm font-medium text-slate-500">Searching products...</p>
                    ) : searchResults.length ? (
                      searchResults.map((product) => (
                        <button
                          key={product._id}
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => openSearchResult(product)}
                          className="flex w-full items-center gap-3 border-b border-slate-100/80 px-4 py-3 text-left transition hover:bg-slate-50 last:border-0"
                        >
                          <img src={product.images?.[0]?.url || product.gallery?.[0]?.url || '/logo.png'} alt="" className="h-11 w-11 rounded-xl bg-slate-100 object-cover ring-1 ring-slate-200" />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold text-slate-900">{product.title}</span>
                            <span className="block text-xs font-semibold text-[#0b469e]">
                              {product.searchType === 'service' ? 'Service' : 'Product'} · ₹{product.pricing?.sellingPrice ?? product.pricing?.minPrice ?? 0}
                            </span>
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="px-4 py-4 text-sm font-medium text-slate-500">No products or services found</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            {...dropdownMotion}
            className="mx-auto max-w-[1440px] px-3 pt-3 sm:px-5 lg:hidden"
          >
            <div className="max-h-[calc(100vh-116px)] overflow-y-auto rounded-[30px] border border-white/70 bg-white/95 px-4 py-4 shadow-[0_24px_70px_rgba(15,23,42,0.18)] backdrop-blur-xl">
              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={() => setMobileNetworkOpen((value) => !value)}
                  className="flex items-center justify-between rounded-[22px] bg-[linear-gradient(135deg,#0b469e,#1b6fe0)] px-4 py-4 font-semibold text-white shadow-[0_14px_28px_rgba(11,70,158,0.22)]"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 ring-1 ring-white/20">
                      <img src={networkIcon} alt="" className="h-5 w-5 object-contain" />
                    </span>
                    <span className="text-left">
                      <span className="block text-sm font-black uppercase tracking-[0.18em]">Gloaro Network</span>
                      <span className="block text-xs font-medium text-white/75">Tap to explore the network</span>
                    </span>
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-xl leading-none">
                    {mobileNetworkOpen ? '−' : '+'}
                  </span>
                </button>
                <AnimatePresence>{mobileNetworkOpen && <MobileGloaroNetworkMenu key="mobile-network" onNavigate={() => setOpen(false)} />}</AnimatePresence>

                <div className="grid gap-2 sm:grid-cols-2">
                  {isAuthenticated ? (
                    <a onClick={() => setOpen(false)} href={getDashboardRoute(user?.role, user)} className="flex items-center rounded-2xl border border-[#0b469e]/10 bg-white px-4 py-3 font-semibold text-[#0b469e] shadow-sm sm:col-span-2">
                      <img src={loginIcon} alt="" className="mr-2 h-4 w-4 object-contain brightness-0 filter" />
                      {user?.name || 'Account'}
                    </a>
                  ) : (
                    <>
                      <a onClick={() => setOpen(false)} href="/login" className="flex items-center rounded-2xl border border-[#0b469e]/10 bg-white px-4 py-3 font-semibold text-[#0b469e] shadow-sm sm:col-span-2">
                        <img src={loginIcon} alt="" className="mr-2 h-4 w-4 object-contain brightness-0 filter" />
                        Login
                      </a>
                      <a onClick={() => setOpen(false)} href="/register" className="flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0b469e,#1b6fe0)] px-4 py-3 font-semibold text-white shadow-[0_14px_28px_rgba(11,70,158,0.2)] sm:col-span-2">
                        Register
                      </a>
                    </>
                  )}
                  {navItems.map(([icon, label, href, colors, iconClass = '']) => (
                    <a onClick={() => setOpen(false)} key={label} href={href} className={`flex items-center rounded-2xl px-4 py-3 font-semibold transition duration-300 ${colors}`}>
                      <img src={icon} alt="" className={`mr-2 h-4 w-4 object-contain ${iconClass}`} />
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function MobileGloaroNetworkMenu({ onNavigate }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0, y: -6 }}
      animate={{ height: 'auto', opacity: 1, y: 0 }}
      exit={{ height: 0, opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff,#fffaf0)] shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
    >
      <div className="p-4">
        <div className="rounded-[24px] bg-[linear-gradient(135deg,#0b469e,#1b6fe0)] p-5 text-white shadow-[0_16px_34px_rgba(11,70,158,0.18)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#ffd36e]">
            Gloaro Network
          </div>
          <h2 className="mt-4 font-playfair text-3xl font-black italic leading-none">Connect. Collaborate. Grow.</h2>
          <p className="mt-3 text-sm leading-6 text-white/80">Explore membership, business opportunities, services and global networking in one premium ecosystem.</p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              ['Trusted', 'Members'],
              ['Global', 'Reach'],
              ['Premium', 'Support'],
            ].map(([title, label]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-center">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white">{title}</p>
                <p className="mt-1 text-[10px] font-medium text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          {networkMenu.map(([Icon, title, links]) => (
            <details key={title} className="group rounded-[22px] border border-slate-200/80 bg-white px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.05)]" open={title === 'Membership'}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#fff3d0] text-[#0b469e]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-left">
                    <span className="block font-playfair text-lg font-black italic text-[#0b469e]">{title}</span>
                    <span className="block text-[11px] font-semibold text-slate-500">{links.length} items</span>
                  </span>
                </span>
                <span className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition group-open:rotate-180">
                  <ChevronDown className="h-4 w-4" />
                </span>
              </summary>
              <ul className="mt-4 space-y-2 pl-[3.25rem]">
                {links.map((link) => (
                  <li key={link} className="text-sm font-medium text-black">
                    <a href={getNetworkHref(link)} onClick={onNavigate} className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition hover:bg-[#f5f8ff] hover:text-[#0b469e] ${link === 'Join Gloaro Network' ? 'font-semibold text-[#0b469e]' : ''}`}>
                      <span className="grid h-4 w-4 place-items-center rounded-full bg-[#0b469e]/10 text-[10px] text-[#0b469e]">›</span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        <a href="/register" onClick={onNavigate} className="mt-5 flex items-center justify-between rounded-[22px] bg-[linear-gradient(135deg,#0b469e,#1b6fe0)] px-4 py-4 text-white shadow-[0_14px_28px_rgba(11,70,158,0.2)]">
          <span>
            <span className="block text-xs font-black uppercase tracking-[0.18em] text-[#ffd36e]">Start here</span>
            <span className="mt-1 block text-sm font-semibold">Explore Membership</span>
          </span>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-lg">→</span>
        </a>
      </div>
    </motion.div>
  )
}

function GloaroNetworkMenu({ onClose }) {
  return (
    <motion.div
      {...dropdownMotion}
      className="fixed inset-x-0 top-[92px] z-[100] hidden h-[calc(100vh-92px)] bg-slate-950/45 px-4 py-6 backdrop-blur-[6px] lg:flex lg:items-start lg:justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Gloaro Network information"
    >
      <motion.div
        {...dropdownMotion}
        className="relative grid max-h-[calc(100vh-6rem)] w-full max-w-[1120px] overflow-y-auto rounded-[28px] border border-white/70 bg-white/95 shadow-[0_30px_90px_rgba(15,23,42,0.22)] ring-1 ring-slate-200/60 lg:grid-cols-[1fr_220px]"
      >
        <button type="button" onClick={onClose} className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:text-[#0b469e]" aria-label="Close Gloaro Network menu">
          <X className="h-4 w-4" />
        </button>
        <div className="p-8 pb-9">
          <h2 className="font-playfair text-3xl font-black italic leading-none text-[#0b469e]">Gloaro Network</h2>
          <p className="mt-2 text-sm font-extrabold italic text-[#ff8a00]">"Connect. Collaborate. Grow Globally."</p>
          <p className="mt-3 max-w-3xl text-sm font-medium leading-5 text-black">Explore membership, business opportunities, services and global networking in our comprehensive enterprise ecosystem.</p>

          <div className="mt-6 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {networkMenu.map(([Icon, title, links]) => (
              <div key={title}>
                <h3 className="flex items-center gap-2 font-playfair text-lg font-black italic text-[#0b469e]"><Icon className="h-4 w-4" />{title}</h3>
                <ul className="mt-3 space-y-3">
                  {links.map((link) => (
                    <li key={link} className="text-sm font-medium text-black">
                      <a href={getNetworkHref(link)} onClick={onClose} className={`transition hover:text-[#0b469e] hover:underline ${link === 'Join Gloaro Network' ? 'font-semibold text-[#0b469e]' : ''}`}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <aside className="flex flex-col bg-[linear-gradient(180deg,#fff8e7,#fff2d4)] p-8">
          <h3 className="font-playfair text-base font-black text-[#0b469e]">Become a GLOARO Member</h3>
          <div className="mt-7 space-y-7">
            {networkHighlights.map(([Icon, title, text]) => (
              <div key={title} className="flex gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#ff9f00]" />
                <div>
                  <p className="text-xs font-black text-[#0b469e]">{title}</p>
                  <p className="mt-0.5 text-[10px] font-semibold leading-3 text-black">{text}</p>
                </div>
              </div>
            ))}
          </div>
          <a href="/register" onClick={onClose} className="mt-auto block rounded-lg bg-[#0b469e] px-4 py-3 text-center text-xs font-extrabold text-white shadow-lg shadow-blue-950/20">Explore Membership</a>
        </aside>
      </motion.div>
    </motion.div>
  )
}
