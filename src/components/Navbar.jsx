import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { spring } from '../lib/motion'
import api from '../api/axios'
import { useAuth } from '../hooks/useAuth'
import { getDashboardRoute } from '../utils/permissions'
import {
  ArrowRight,
  Boxes,
  BriefcaseBusiness,
  CalendarDays,
  CircleHelp,
  ChevronDown,
  Code2,
  Handshake,
  LayoutGrid,
  Mail,
  Network,
  Phone,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Trophy,
  TrendingUp,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import logo from '../assets/logo-transparent.webp'
import networkIcon from '../assets/network_icon.png'
import loginIcon from '../assets/login_icon.png'

const networkMenu = [
  [Users, 'Membership', ['Join Gloaro Network', 'Membership Benefits', 'Member Access']],
  [Network, 'Business Network', ['360 Gloaro Network', 'Global Business Network', 'Business Growth', 'Business Opportunities']],
  [Handshake, 'Connect Program', ['Connect Meeting', 'Connect Join', 'Connect Benefits']],
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
  'Connect Meeting': 'referral-meeting',
  'Connect Join': 'referral-join',
  'Connect Benefits': 'referral-benefits',
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

const getNetworkHref = (label) => label === 'Join Gloaro Network' ? '/register' : `/network#${networkTargets[label]}`

const dropdownMotion = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 12, scale: 0.985 },
  transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
}

const panelMotion = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.2, ease: 'easeOut' },
}

const navItems = [
  [Rocket, 'Home', '/'],
  [Code2, 'Services', '/#services'],
  [Boxes, 'Products', '/#products'],
  [LayoutGrid, 'Portfolio', '/#portfolio'],
  [UserRound, 'About', '/about'],
  [Mail, 'Contact', '/contact'],
]

const getSearchItems = (response) => Array.isArray(response?.data?.data) ? response.data.data : []

export default function Navbar() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const { pathname, hash } = useLocation()
  const searchInputRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [networkOpen, setNetworkOpen] = useState(false)
  const [mobileNetworkOpen, setMobileNetworkOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchPanelOpen, setSearchPanelOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)

  const isActive = (href) => {
    const [path, fragment] = href.split('#')
    if (fragment) return pathname === (path || '/') && hash === `#${fragment}`
    if (href === '/') return pathname === '/' && !hash
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!networkOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [networkOpen])

  useEffect(() => {
    if (!searchPanelOpen) return undefined
    searchInputRef.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') setSearchPanelOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [searchPanelOpen])

  useEffect(() => {
    const query = searchQuery.trim()
    if (query.length < 2) return undefined

    let active = true
    const timer = window.setTimeout(() => {
      if (active) setSearchLoading(true)
      Promise.allSettled([
        api.get('/products', { params: { search: query, limit: 4 }, silent: true }),
        api.get('/services', { params: { search: query, limit: 4 }, silent: true }),
      ])
        .then(([productsResult, servicesResult]) => {
          if (!active) return
          const products = productsResult.status === 'fulfilled' ? getSearchItems(productsResult.value).map((item) => ({ ...item, searchType: 'product' })) : []
          const services = servicesResult.status === 'fulfilled' ? getSearchItems(servicesResult.value).map((item) => ({ ...item, searchType: 'service' })) : []
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

  const closeSearch = () => {
    setSearchPanelOpen(false)
    setSearchQuery('')
    setSearchResults([])
  }

  const openSearchResult = (item) => {
    if (!item?._id) return
    closeSearch()
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
      const [productsResult, servicesResult] = await Promise.allSettled([
        api.get('/products', { params: { search: query, limit: 1 }, silent: true }),
        api.get('/services', { params: { search: query, limit: 1 }, silent: true }),
      ])
      const firstProduct = productsResult.status === 'fulfilled' ? getSearchItems(productsResult.value)[0] : null
      const firstService = servicesResult.status === 'fulfilled' ? getSearchItems(servicesResult.value)[0] : null
      if (firstProduct) openSearchResult({ ...firstProduct, searchType: 'product' })
      else if (firstService) openSearchResult({ ...firstService, searchType: 'service' })
      else {
        closeSearch()
        navigate(`/products?search=${encodeURIComponent(query)}`)
      }
    } finally {
      setSearchLoading(false)
    }
  }

  const iconButton = 'grid h-11 w-11 cursor-pointer place-items-center rounded-full text-slate-600 transition duration-200 hover:bg-[#0b469e]/10 hover:text-[#0b469e]'

  return (
    <>
      {/* Utility bar: in normal flow above the sticky header, so it scrolls
          away on its own instead of collapsing (which would shift the page). */}
      <div className="hidden bg-[#061633] font-jakarta text-white/80 lg:block">
        <div className="mx-auto flex h-10 max-w-[1440px] items-center justify-between px-5 text-xs font-medium lg:px-8">
          <div className="flex items-center gap-6">
            <a href="mailto:info@gloaro.com" className="flex items-center gap-2 transition hover:text-white">
              <Mail className="h-3.5 w-3.5 text-[#ffae13]" /> info@gloaro.com
            </a>
            <a href="tel:+917200073704" className="flex items-center gap-2 transition hover:text-white">
              <Phone className="h-3.5 w-3.5 text-[#ffae13]" /> +91 72000 73704
            </a>
          </div>
          <p className="hidden text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70 xl:block">Software · Web · Mobile · AI · Marketplace · Network</p>
          <div className="flex items-center gap-5">
            {isAuthenticated ? (
              <Link to={getDashboardRoute(user?.role, user)} className="flex items-center gap-2 font-semibold text-white transition hover:text-[#ffd36e]">
                <img src={loginIcon} alt="" className="h-3.5 w-3.5 object-contain brightness-0 invert" />
                <span className="max-w-40 truncate">{user?.name || 'Account'}</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-2 transition hover:text-white">
                  <img src={loginIcon} alt="" className="h-3.5 w-3.5 object-contain brightness-0 invert" /> Login
                </Link>
                <Link to="/register" className="rounded-full border border-white/20 px-3 py-0.5 font-semibold text-white transition hover:border-[#ffae13] hover:text-[#ffd36e]">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>

    <header className="sticky top-0 z-50 font-jakarta">
      {/* Main bar (floating). Constant height; only colours and the logo's
          transform change on scroll, so nothing below it reflows. */}
      <div className="px-3 pt-2 sm:px-5">
      <div className={`relative mx-auto max-w-[1440px] rounded-2xl border transition-[background-color,border-color,box-shadow] duration-300 ${scrolled ? 'border-slate-200 bg-white/90 shadow-[0_16px_44px_rgba(11,70,158,0.16)] backdrop-blur-xl' : 'border-white/70 bg-white/80 shadow-[0_10px_34px_rgba(11,70,158,0.1)] backdrop-blur-md'}`}>
        <div className="absolute inset-x-6 top-0 h-[2px] rounded-full bg-[linear-gradient(90deg,#0b469e,#10b981,#ffb20c,#0b469e)]" />
        <div className="flex h-[68px] items-center gap-3 px-4 sm:px-5 lg:px-6">
          <Link to="/" aria-label="Go to home page" className="group flex shrink-0 items-center">
            <img src={logo} alt="Gloaro" className={`h-14 w-auto origin-left object-contain transition-transform duration-300 ${scrolled ? 'scale-[0.8]' : 'group-hover:scale-[1.04]'}`} />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
            {navItems.map(([, label, href]) => {
              const active = isActive(href)
              return (
                <Link key={label} to={href} aria-current={active ? 'page' : undefined} className={`relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-200 xl:px-4 ${active ? 'text-[#0b469e]' : 'text-slate-600 hover:text-[#0b469e]'}`}>
                  {active && <motion.span layoutId="nav-active" className="absolute inset-0 -z-10 rounded-full bg-[#0b469e]/10" transition={spring.interactive} />}
                  {label}
                  {active && <motion.span layoutId="nav-dot" transition={spring.interactive} className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#ffae13]" />}
                </Link>
              )
            })}

            <span aria-hidden="true" className="mx-2 h-6 w-px bg-slate-200" />

            <div className={`flex items-center overflow-hidden rounded-full border transition duration-200 ${isActive('/network') ? 'border-[#0b469e]/30 bg-[#0b469e]/10' : 'border-slate-200 bg-white hover:border-[#0b469e]/30'}`}>
              <Link to="/network" className="flex items-center gap-2 py-2 pl-3 pr-2 text-sm font-semibold text-[#0b469e]">
                <img src={networkIcon} alt="" className="h-4 w-4 object-contain" />
                Network
              </Link>
              <button
                type="button"
                onClick={() => setNetworkOpen(true)}
                aria-label="Open Gloaro Network quick menu"
                aria-haspopup="dialog"
                aria-expanded={networkOpen}
                className="flex h-full items-center border-l border-slate-200 px-2 py-2.5 text-[#0b469e] transition hover:bg-[#0b469e]/10"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <Link to="/mart" className={`group relative ml-1.5 flex items-center gap-2 overflow-hidden rounded-full border px-3.5 py-2 text-sm font-bold text-[#0b2451] shadow-[0_8px_20px_rgba(255,174,19,0.25)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(255,174,19,0.35)] ${isActive('/mart') ? 'border-[#ffae13] bg-[#ffae13]' : 'border-amber-200 bg-[linear-gradient(135deg,#ffd36e,#ffae13)]'}`}>
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.5),transparent)] bg-[length:200%_100%] opacity-0 transition duration-500 group-hover:animate-[navbar-shine_1.8s_linear_infinite] group-hover:opacity-100" />
              <ShoppingBag className="relative h-4 w-4" />
              <span className="relative">Gloaro Mart</span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <button type="button" onClick={() => setSearchPanelOpen((value) => !value)} aria-label="Search products and services" aria-expanded={searchPanelOpen} className={iconButton}>
              {searchPanelOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>
            <Link to="/contact" className="group ml-2 hidden items-center gap-2 rounded-full bg-[linear-gradient(135deg,#0b469e,#1b6fe0)] px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,70,158,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(11,70,158,0.36)] lg:flex">
              Start a Project
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="ml-1 grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,#0b469e,#1b6fe0)] text-white shadow-[0_8px_20px_rgba(11,70,158,0.25)] lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <span className="flex flex-col gap-1">
                <span className={`h-0.5 w-4 rounded-full bg-white transition duration-300 ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
                <span className={`h-0.5 w-4 rounded-full bg-white transition duration-300 ${open ? 'opacity-0' : ''}`} />
                <span className={`h-0.5 w-4 rounded-full bg-white transition duration-300 ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
        </div>

        {/* Search panel */}
        <AnimatePresence>
          {searchPanelOpen && (
            <motion.div {...panelMotion} className="absolute inset-x-0 top-full z-[60] mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-[0_24px_50px_rgba(15,23,42,0.14)] backdrop-blur-xl">
              <form onSubmit={submitSearch} className="mx-auto max-w-3xl px-4 py-5">
                <label className="flex h-12 items-center gap-3 rounded-full border border-slate-200 bg-white px-5 text-[#0b469e] shadow-sm transition focus-within:border-[#0b469e]/40 focus-within:shadow-[0_8px_24px_rgba(11,70,158,0.14)]">
                  <Search className="h-5 w-5 shrink-0" />
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(event) => {
                      const nextQuery = event.target.value
                      setSearchQuery(nextQuery)
                      if (nextQuery.trim().length < 2) {
                        setSearchResults([])
                        setSearchLoading(false)
                      }
                    }}
                    className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-500"
                    placeholder="Search for products and services"
                    aria-label="Search products and services"
                    autoComplete="off"
                  />
                  <kbd className="hidden rounded-md border border-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 sm:block">ESC</kbd>
                </label>

                {searchQuery.trim().length >= 2 && (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    {searchLoading ? (
                      <p className="px-4 py-4 text-sm font-medium text-slate-500">Searching...</p>
                    ) : searchResults.length ? (
                      searchResults.map((item) => (
                        <button
                          key={`${item.searchType}-${item._id}`}
                          type="button"
                          onClick={() => openSearchResult(item)}
                          className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-0 hover:bg-slate-50"
                        >
                          <img src={item.images?.[0]?.url || item.gallery?.[0]?.url || '/logo.png'} alt="" className="h-11 w-11 rounded-xl bg-slate-100 object-cover ring-1 ring-slate-200" />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold text-slate-900">{item.title}</span>
                            <span className="block text-xs font-semibold text-[#0b469e]">
                              {item.searchType === 'service' ? 'Service' : 'Product'} · ₹{item.pricing?.sellingPrice ?? item.pricing?.minPrice ?? 0}
                            </span>
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="px-4 py-4 text-sm font-medium text-slate-500">No products or services found</p>
                    )}
                  </div>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>

      <AnimatePresence>
        {networkOpen && <GloaroNetworkMenu key="network-menu" onClose={() => setNetworkOpen(false)} />}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div {...dropdownMotion} className="absolute inset-x-0 top-full px-3 pt-1 sm:px-5 lg:hidden">
            <div className="max-h-[calc(100vh-90px)] overflow-y-auto rounded-[28px] border border-white/70 bg-white/95 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.2)] backdrop-blur-xl">
              <div className="grid grid-cols-2 gap-2">
                {navItems.map(([Icon, label, href]) => {
                  const active = isActive(href)
                  return (
                    <Link key={label} to={href} onClick={() => setOpen(false)} className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${active ? 'border-[#0b469e]/30 bg-[#0b469e]/10 text-[#0b469e]' : 'border-slate-200/80 bg-white text-slate-700 hover:border-[#0b469e]/20 hover:text-[#0b469e]'}`}>
                      <Icon className={`h-4 w-4 ${active ? 'text-[#0b469e]' : 'text-slate-400'}`} />
                      {label}
                    </Link>
                  )
                })}
              </div>

              <div className="mt-3 grid gap-3">
                <div className="flex items-stretch overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,#0b469e,#1b6fe0)] shadow-[0_14px_28px_rgba(11,70,158,0.22)]">
                  <Link to="/network" onClick={() => setOpen(false)} className="flex flex-1 items-center gap-3 px-4 py-3.5 font-semibold text-white">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 ring-1 ring-white/20">
                      <img src={networkIcon} alt="" className="h-5 w-5 object-contain" />
                    </span>
                    <span className="text-left">
                      <span className="block text-sm font-black uppercase tracking-[0.18em]">Gloaro Network</span>
                      <span className="block text-xs font-medium text-white/75">Open the network page</span>
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileNetworkOpen((value) => !value)}
                    aria-label="Toggle Gloaro Network quick menu"
                    aria-expanded={mobileNetworkOpen}
                    className="flex items-center justify-center border-l border-white/15 px-4 text-xl leading-none text-white transition hover:bg-white/10"
                  >
                    {mobileNetworkOpen ? '−' : '+'}
                  </button>
                </div>
                <AnimatePresence>{mobileNetworkOpen && <MobileGloaroNetworkMenu key="mobile-network" onNavigate={() => setOpen(false)} />}</AnimatePresence>

                <Link to="/mart" onClick={() => setOpen(false)} className="flex items-center justify-between rounded-[22px] bg-[linear-gradient(135deg,#ffd36e,#ffae13)] px-4 py-3.5 font-semibold text-[#0b2451] shadow-[0_14px_28px_rgba(255,174,19,0.25)]">
                  <span className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white/50 ring-1 ring-white/70">
                      <ShoppingBag className="h-5 w-5" />
                    </span>
                    <span className="text-left">
                      <span className="block text-sm font-black uppercase tracking-[0.18em]">Gloaro Mart</span>
                      <span className="block text-xs font-medium text-[#0b2451]/70">B2B + B2C marketplace</span>
                    </span>
                  </span>
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <Link to="/contact" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 rounded-2xl bg-[#061633] px-4 py-3.5 text-sm font-bold text-white">
                  Start a Project <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  {isAuthenticated ? (
                    <Link onClick={() => setOpen(false)} to={getDashboardRoute(user?.role, user)} className="col-span-2 flex items-center justify-center gap-2 rounded-2xl border border-[#0b469e]/10 bg-white px-4 py-3 text-sm font-semibold text-[#0b469e] shadow-sm">
                      <img src={loginIcon} alt="" className="h-4 w-4 object-contain" />
                      {user?.name || 'Account'}
                    </Link>
                  ) : (
                    <>
                      <Link onClick={() => setOpen(false)} to="/login" className="flex items-center justify-center gap-2 rounded-2xl border border-[#0b469e]/10 bg-white px-4 py-3 text-sm font-semibold text-[#0b469e] shadow-sm">
                        <img src={loginIcon} alt="" className="h-4 w-4 object-contain" />
                        Login
                      </Link>
                      <Link onClick={() => setOpen(false)} to="/register" className="flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0b469e,#1b6fe0)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(11,70,158,0.2)]">
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    </>
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
                    <Link to={getNetworkHref(link)} onClick={onNavigate} className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition hover:bg-[#f5f8ff] hover:text-[#0b469e] ${link === 'Join Gloaro Network' ? 'font-semibold text-[#0b469e]' : ''}`}>
                      <span className="grid h-4 w-4 place-items-center rounded-full bg-[#0b469e]/10 text-[10px] text-[#0b469e]">›</span>
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        <Link to="/register" onClick={onNavigate} className="mt-5 flex items-center justify-between rounded-[22px] bg-[linear-gradient(135deg,#0b469e,#1b6fe0)] px-4 py-4 text-white shadow-[0_14px_28px_rgba(11,70,158,0.2)]">
          <span>
            <span className="block text-xs font-black uppercase tracking-[0.18em] text-[#ffd36e]">Start here</span>
            <span className="mt-1 block text-sm font-semibold">Explore Membership</span>
          </span>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-lg">→</span>
        </Link>
      </div>
    </motion.div>
  )
}

function GloaroNetworkMenu({ onClose }) {
  return (
    <motion.div
      {...dropdownMotion}
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/20 px-2 py-4 pt-24 sm:px-4 sm:py-6 sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label="Gloaro Network information"
    >
      <motion.div
        {...dropdownMotion}
        className="relative mx-auto grid max-h-[90vh] w-[calc(100%-1rem)] max-w-none grid-cols-1 overflow-y-auto rounded-xl bg-white shadow-lg sm:w-[calc(100%-2rem)] sm:rounded-2xl md:max-w-4xl lg:max-w-6xl lg:grid-cols-[minmax(0,1fr)_240px]"
      >
        <button type="button" onClick={onClose} className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:text-[#0b469e]" aria-label="Close Gloaro Network menu">
          <X className="h-4 w-4" />
        </button>
        <div className="min-w-0 p-5 pb-6 md:p-6 lg:p-8 lg:pb-9">
          <div className="pr-12">
            <h2 className="font-playfair text-2xl font-black italic leading-tight text-[#0b469e] sm:text-3xl lg:text-4xl">Gloaro Network</h2>
            <p className="mt-2 text-sm font-extrabold italic text-[#ff8a00] sm:text-base">"Connect. Collaborate. Grow Globally."</p>
            <p className="mt-3 max-w-3xl text-sm font-medium leading-5 text-black sm:text-base sm:leading-6">Explore membership, business opportunities, services and global networking in our comprehensive enterprise ecosystem.</p>
            <Link to="/network" onClick={onClose} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#0b469e] hover:underline">
              Open the full Gloaro Network page
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-8">
            {networkMenu.map(([Icon, title, links]) => (
              <div key={title} className="min-w-0 w-full">
                <h3 className="flex min-w-0 items-center gap-2 font-playfair text-lg font-black italic leading-tight text-[#0b469e]"><Icon className="h-4 w-4 shrink-0" /><span className="min-w-0 break-words">{title}</span></h3>
                <ul className="mt-3 space-y-3">
                  {links.map((link) => (
                    <li key={link} className="text-sm font-medium text-black">
                      <Link to={getNetworkHref(link)} onClick={onClose} className={`transition hover:text-[#0b469e] hover:underline ${link === 'Join Gloaro Network' ? 'font-semibold text-[#0b469e]' : ''}`}>{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <aside className="flex min-w-0 flex-col bg-[linear-gradient(180deg,#fff8e7,#fff2d4)] p-5 md:p-6 lg:min-h-full lg:p-8">
          <h3 className="font-playfair text-base font-black text-[#0b469e]">Become a GLOARO Member</h3>
          <div className="mt-6 space-y-5 lg:mt-7 lg:space-y-7">
            {networkHighlights.map(([Icon, title, text]) => (
              <div key={title} className="flex gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#ff9f00]" />
                <div className="min-w-0">
                  <p className="text-xs font-black text-[#0b469e]">{title}</p>
                  <p className="mt-0.5 text-[10px] font-semibold leading-3 text-black">{text}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/register" onClick={onClose} className="mt-6 block w-full rounded-lg bg-[#0b469e] px-4 py-3 text-center text-xs font-extrabold text-white shadow-lg shadow-blue-950/20 lg:mt-auto">Explore Membership</Link>
        </aside>
      </motion.div>
    </motion.div>
  )
}
