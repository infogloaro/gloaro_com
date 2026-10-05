import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import api from '../api/axios'
import { useAuth } from '../hooks/useAuth'
import { getDashboardRoute } from '../utils/permissions'
import {
  BriefcaseBusiness,
  CalendarDays,
  CircleHelp,
  ChevronDown,
  Heart,
  Handshake,
  Network,
  Package,
  Rocket,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  ShoppingCart,
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

const getSearchItems = (response) => Array.isArray(response?.data?.data) ? response.data.data : []

const getSearchResultTitle = (item) => item?.title || item?.businessName || item?.name || 'Untitled'

const getSearchResultImage = (item) => item?.images?.[0]?.url || item?.gallery?.[0]?.url || item?.logo?.url || item?.logo || '/logo.png'

const getSearchResultPrice = (item) => item?.pricing?.sellingPrice ?? item?.pricing?.minPrice ?? item?.pricing?.basePrice ?? 0

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
      const [productsResult, servicesResult] = await Promise.allSettled([
        api.get('/products', { params: { search: query, limit: 1 }, silent: true }),
        api.get('/services', { params: { search: query, limit: 1 }, silent: true }),
      ])
      const firstProduct = productsResult.status === 'fulfilled' ? getSearchItems(productsResult.value)[0] : null
      const firstService = servicesResult.status === 'fulfilled' ? getSearchItems(servicesResult.value)[0] : null
      if (firstProduct) openSearchResult({ ...firstProduct, searchType: 'product' })
      else if (firstService) openSearchResult({ ...firstService, searchType: 'service' })
      else {
        setSearchOpen(false)
        navigate(`/products?search=${encodeURIComponent(query)}`)
      }
    } catch {
      setSearchOpen(true)
    } finally {
      setSearchLoading(false)
    }
  }

  const navItems = [
    // [shopIcon, 'Shop', '/products', 'border border-amber-200/80 bg-gradient-to-r from-amber-300 to-amber-200 text-[#073b7a] shadow-[0_12px_24px_rgba(255,174,19,0.16)] hover:shadow-[0_16px_30px_rgba(255,174,19,0.22)]', 'brightness-0 contrast-125'],
    // [brandIcon, 'B2B Services', '/services', 'border border-emerald-200/80 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-[0_12px_24px_rgba(16,185,129,0.18)] hover:shadow-[0_16px_30px_rgba(16,185,129,0.24)]', 'brightness-0 invert'],
    // [nearMeIcon, 'Near Me', '/nearby', 'border border-slate-200/80 bg-white/70 text-slate-700 hover:border-slate-300 hover:bg-white', 'group-hover:-translate-y-0.5'],
    // [aboutIcon, 'About', '/about', 'border border-amber-200/80 bg-white/80 text-[#073b7a] hover:border-amber-300 hover:bg-amber-50/90', ''],
  ]

  const shopQuickLinks = [
    [ShoppingCart, 'Cart', '/cart'],
    [Heart, 'Wishlist', '/wishlist'],
    [Package, 'Orders', '/orders'],
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
            <div className="relative flex min-w-0 items-center gap-2 xl:gap-3">
              <Link to="/" aria-label="Go to home page" className="group flex w-24 shrink-0 items-center lg:w-20 xl:w-28">
                <img src={logo} alt="Gloaro Business Network" className="h-auto w-full origin-left object-contain transition duration-300 group-hover:scale-[1.03] group-hover:drop-shadow-[0_8px_20px_rgba(11,70,158,0.12)]" />
              </Link>

              <div className="hidden min-w-0 flex-1 items-center gap-1.5 lg:flex xl:gap-3">
                <div className="relative shrink-0">
                  <a href="https://www.gloaro.in" target="_blank" rel="noopener noreferrer" className="group relative flex h-11 items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-full border border-indigo-900/10 bg-[linear-gradient(135deg,#4f46e5_0%,#6366f1_48%,#4f46e5_100%)] px-3 text-xs font-semibold text-white shadow-[0_16px_30px_rgba(79,70,229,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(79,70,229,0.28)] xl:gap-2 xl:px-5 xl:text-sm">
                    <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.3),transparent)] bg-[length:200%_100%] opacity-0 transition duration-500 group-hover:animate-[navbar-shine_1.8s_linear_infinite] group-hover:opacity-100" />
                    <span className="relative flex items-center gap-1.5 xl:gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 ring-1 ring-white/25">
                        <Rocket className="h-4 w-4" />
                      </span>
                      <span>Gloaro Tech</span>
                      <span className="hidden rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/90 xl:inline">Visit</span>
                    </span>
                  </a>
                </div>

                <div className="relative shrink-0">
                  <button type="button" onClick={() => setNetworkOpen(true)} className="group relative flex h-11 items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-full border border-blue-900/10 bg-[linear-gradient(135deg,#0b469e_0%,#1b6fe0_48%,#0b469e_100%)] px-3 text-xs font-semibold text-white shadow-[0_16px_30px_rgba(11,70,158,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(11,70,158,0.28)] xl:gap-2 xl:px-5 xl:text-sm" aria-expanded={networkOpen} aria-haspopup="true">
                    <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.3),transparent)] bg-[length:200%_100%] opacity-0 transition duration-500 group-hover:animate-[navbar-shine_1.8s_linear_infinite] group-hover:opacity-100" />
                    <span className="relative flex items-center gap-1.5 xl:gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 ring-1 ring-white/25">
                        <img src={networkIcon} alt="" className="h-4 w-4 object-contain" />
                      </span>
                      <span>Gloaro Network</span>
                      <span className="hidden rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/90 xl:inline">Explore</span>
                    </span>
                  </button>
                </div>

                <div className="relative shrink-0">
                  <Link to="/mart" className="group relative flex h-11 items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-full border border-amber-200/80 bg-[linear-gradient(135deg,#ffd36e_0%,#ffae13_55%,#ffc43d_100%)] px-3 text-xs font-semibold text-[#0b2451] shadow-[0_16px_30px_rgba(255,174,19,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(255,174,19,0.3)] xl:gap-2 xl:px-5 xl:text-sm">
                    <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.45),transparent)] bg-[length:200%_100%] opacity-0 transition duration-500 group-hover:animate-[navbar-shine_1.8s_linear_infinite] group-hover:opacity-100" />
                    <span className="relative flex items-center gap-1.5 xl:gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-white/50 ring-1 ring-white/70">
                        <ShoppingBag className="h-4 w-4" />
                      </span>
                      <span>Gloaro Mart</span>
                      <span className="hidden rounded-full bg-[#0b2451]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.22em] xl:inline">New</span>
                    </span>
                  </Link>
                </div>
                {navItems.map(([icon, label, href, colors, iconClass = '']) => (
                  <Link key={label} to={href} className={`group flex h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2 text-[11px] font-semibold transition duration-300 hover:-translate-y-0.5 xl:gap-2 xl:px-4 xl:text-sm ${colors}`}>
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-white/70 ring-1 ring-black/5 xl:h-7 xl:w-7">
                      <img src={icon} alt="" className={`h-3.5 w-3.5 object-contain transition duration-300 group-hover:scale-110 ${iconClass}`} />
                    </span>
                    <span className="relative">
                      {label}
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-current transition-all duration-300 group-hover:w-full" />
                    </span>
                  </Link>
                ))}
              </div>

              <div className="ml-auto hidden shrink-0 items-center gap-2 text-[#0b469e] lg:flex xl:gap-4">
                {isAuthenticated ? (
                  <Link to={getDashboardRoute(user?.role, user)} aria-label="Open account dashboard" className="group flex h-11 items-center gap-2.5 rounded-full border border-[#0b469e]/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(239,246,255,0.95))] px-2.5 pr-4 text-[#0b469e] shadow-[0_10px_24px_rgba(11,70,158,0.12)] transition duration-300 hover:-translate-y-0.5 hover:border-[#0b469e]/30 hover:shadow-[0_16px_30px_rgba(11,70,158,0.18)]">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[linear-gradient(135deg,#0b469e,#1b6fe0)] ring-2 ring-blue-100">
                      <img src={loginIcon} alt="" className="h-4 w-4 object-contain brightness-0 invert" />
                    </span>
                    <span className="max-w-32 truncate text-sm font-bold">{user?.name || 'Account'}</span>
                    <span className="text-xs transition duration-300 group-hover:translate-x-1">›</span>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="group flex items-center gap-1 text-xs font-semibold transition duration-300 hover:-translate-y-0.5 hover:text-[#0b469e] xl:gap-1.5 xl:text-sm">
                      <img src={loginIcon} alt="" className="h-4 w-4 object-contain xl:h-5 xl:w-5" />
                      <span className="relative">
                        Login
                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-[#0b469e] transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                    <Link to="/register" className="rounded-full border border-[#0b469e]/15 bg-[linear-gradient(135deg,#0b469e,#1b6fe0)] px-3 py-2 text-xs font-semibold text-white shadow-[0_12px_26px_rgba(11,70,158,0.2)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(11,70,158,0.26)] xl:px-4 xl:text-sm">
                      Register
                    </Link>
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

            <div className="relative mt-3 flex w-full flex-col gap-3 lg:mt-4 lg:flex-row lg:items-center">
              <form onSubmit={submitSearch} className="relative w-full flex-1">
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

              <div className="hidden items-center gap-2 lg:flex">
                {shopQuickLinks.map(([Icon, label, href]) => (
                  <Link
                    key={label}
                    to={href}
                    className="group flex h-11 items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-3 text-sm font-semibold text-slate-700 shadow-[0_10px_22px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-[#0b469e]/20 hover:text-[#0b469e] hover:shadow-[0_16px_28px_rgba(11,70,158,0.12)]"
                  >
                    <Icon className="h-4 w-4 transition duration-300 group-hover:scale-110" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {networkOpen && <GloaroNetworkMenu key="network-menu" onClose={() => setNetworkOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            {...dropdownMotion}
            className="mx-auto max-w-[1440px] px-3 pt-3 sm:px-5 lg:hidden"
          >
            <div className="max-h-[calc(100vh-116px)] overflow-y-auto rounded-[30px] border border-white/70 bg-white/95 px-4 py-4 shadow-[0_24px_70px_rgba(15,23,42,0.18)] backdrop-blur-xl">
              <div className="grid gap-3">
                <a href="https://www.gloaro.in" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-[22px] bg-[linear-gradient(135deg,#4f46e5,#6366f1)] px-4 py-4 font-semibold text-white shadow-[0_14px_28px_rgba(79,70,229,0.22)]">
                  <span className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 ring-1 ring-white/20">
                      <Rocket className="h-5 w-5" />
                    </span>
                    <span className="text-left">
                      <span className="block text-sm font-black uppercase tracking-[0.18em]">Gloaro Tech</span>
                      <span className="block text-xs font-medium text-white/75">Visit Gloaro Technologies</span>
                    </span>
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-lg">
                    →
                  </span>
                </a>

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

                <Link to="/mart" onClick={() => setOpen(false)} className="flex items-center justify-between rounded-[22px] bg-[linear-gradient(135deg,#ffd36e,#ffae13)] px-4 py-4 font-semibold text-[#0b2451] shadow-[0_14px_28px_rgba(255,174,19,0.25)]">
                  <span className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white/50 ring-1 ring-white/70">
                      <ShoppingBag className="h-5 w-5" />
                    </span>
                    <span className="text-left">
                      <span className="block text-sm font-black uppercase tracking-[0.18em]">Gloaro Mart</span>
                      <span className="block text-xs font-medium text-[#0b2451]/70">B2B + B2C marketplace</span>
                    </span>
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white/50 text-lg">→</span>
                </Link>

                <div className="grid gap-2 sm:grid-cols-2">
                  {navItems.flatMap(([icon, label, href, colors, iconClass = '']) => {
                    const mainItem = (
                      <Link onClick={() => setOpen(false)} key={label} to={href} className={`flex items-center rounded-2xl px-4 py-3 font-semibold transition duration-300 ${colors}`}>
                        <img src={icon} alt="" className={`mr-2 h-4 w-4 object-contain ${iconClass}`} />
                        {label}
                      </Link>
                    )

                    if (label === 'Shop') {
                      const subItems = shopQuickLinks.map(([Icon, subLabel, subHref]) => (
                        <Link
                          key={subLabel}
                          onClick={() => setOpen(false)}
                          to={subHref}
                          className="flex items-center rounded-2xl border border-slate-200/80 bg-white px-4 py-3 font-semibold text-slate-700 shadow-sm transition hover:border-[#0b469e]/20 hover:text-[#0b469e] ml-6 sm:ml-8"
                        >
                          <Icon className="mr-2 h-4 w-4 text-slate-400" />
                          {subLabel}
                        </Link>
                      ))
                      return [mainItem, ...subItems]
                    }

                    return [mainItem]
                  })}

                  {isAuthenticated ? (
                    <Link onClick={() => setOpen(false)} to={getDashboardRoute(user?.role, user)} className="flex items-center rounded-2xl border border-[#0b469e]/10 bg-white px-4 py-3 font-semibold text-[#0b469e] shadow-sm sm:col-span-2">
                      <img src={loginIcon} alt="" className="mr-2 h-4 w-4 object-contain brightness-0 filter" />
                      {user?.name || 'Account'}
                    </Link>
                  ) : (
                    <>
                      <Link onClick={() => setOpen(false)} to="/login" className="flex items-center rounded-2xl border border-[#0b469e]/10 bg-white px-4 py-3 font-semibold text-[#0b469e] shadow-sm sm:col-span-2">
                        <img src={loginIcon} alt="" className="mr-2 h-4 w-4 object-contain brightness-0 filter" />
                        Login
                      </Link>
                      <Link onClick={() => setOpen(false)} to="/register" className="flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0b469e,#1b6fe0)] px-4 py-3 font-semibold text-white shadow-[0_14px_28px_rgba(11,70,158,0.2)] sm:col-span-2">
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
