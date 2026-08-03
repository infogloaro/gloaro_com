import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../hooks/useAuth'
import { getDashboardRoute } from '../utils/permissions'
import {
  BriefcaseBusiness,
  CalendarDays,
  CircleHelp,
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
import b2bIcon from '../assets/b2b_icon.png'
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
      setSearchResults([])
      setSearchLoading(false)
      return undefined
    }

    let active = true
    setSearchLoading(true)
    const timer = window.setTimeout(() => {
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
    [nearMeIcon, 'Near Me', '/nearby', 'hidden bg-slate-100 text-slate-700 hover:bg-slate-200'],
    [shopIcon, 'Shop', '/products', 'bg-[#ffb20c] text-[#063a85] hover:brightness-95'],
    [brandIcon, 'Services', '/services', 'bg-[#10b981] text-white hover:bg-[#059669]', 'brightness-0 invert'],
    [b2bIcon, 'B2B Marketplace', '/vendors', 'bg-[#0b469e] text-white hover:bg-[#093a84]', 'brightness-0 invert'],
    [aboutIcon, 'About', '/about', 'bg-[#ffb20c] text-[#063a85] hover:brightness-95'],
  ]

  return (
    <header className="sticky top-0 z-50 border-t-4 border-black bg-white font-jakarta shadow-sm">
      <div className="mx-auto max-w-[1440px] px-4 py-3 sm:px-7">
        <div className="flex items-center gap-2 xl:gap-3">
          <a href="/" aria-label="Go to home page" className="flex w-24 shrink-0 items-center sm:w-28"><img src={logo} alt="Gloaro Business Network" className="h-auto w-full object-contain" /></a>

          <div className="hidden flex-1 items-center gap-3 lg:flex">
            <div className="relative">
              <button type="button" onClick={() => setNetworkOpen(true)} className="flex h-10 items-center gap-2 whitespace-nowrap rounded-full bg-[#0b469e] px-5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-px" aria-expanded={networkOpen} aria-haspopup="true">
                <img src={networkIcon} alt="" className="h-4 w-4 object-contain" />
                Gloaro Network
              </button>
              {networkOpen && <GloaroNetworkMenu onClose={() => setNetworkOpen(false)} />}
            </div>
            {navItems.map(([icon, label, href, colors, iconClass = '']) => <a key={label} href={href} className={`flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-xs font-semibold shadow-sm transition hover:-translate-y-px xl:px-4 xl:text-sm ${colors}`}><img src={icon} alt="" className={`h-3.5 w-3.5 object-contain ${iconClass}`} />{label}</a>)}
          </div>

          <div className="ml-auto hidden items-center gap-4 text-[#0b469e] lg:flex">
            {isAuthenticated ? (
              <a href={getDashboardRoute(user?.role, user)} aria-label="Open account dashboard" className="group flex h-10 items-center gap-2.5 rounded-full border border-[#0b469e]/20 bg-gradient-to-r from-white to-blue-50 px-2.5 pr-4 text-[#0b469e] shadow-sm transition hover:-translate-y-px hover:border-[#0b469e]/40 hover:shadow-md">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#0b469e] ring-2 ring-blue-100">
                  <img src={loginIcon} alt="" className="h-4 w-4 object-contain brightness-0 invert" />
                </span>
                <span className="max-w-32 truncate text-sm font-bold">{user?.name || 'Account'}</span>
                <span className="text-xs transition group-hover:translate-x-0.5">›</span>
              </a>
            ) : (
              <>
                <a href="/login" className="flex items-center gap-1.5 text-sm font-semibold transition hover:text-[#0b469e]">
                  <img src={loginIcon} alt="" className="h-5 w-5 object-contain" />
                  Login
                </a>
                <a href="/register" className="rounded-md border border-[#0b469e] px-3 py-1.5 text-sm font-semibold text-[#0b469e] transition hover:bg-[#0b469e] hover:text-white">
                  Register
                </a>
              </>
            )}
          </div>

          <button onClick={() => setOpen((value) => !value)} className="ml-auto rounded-md bg-[#0b469e] px-3 py-2 text-lg text-white lg:hidden" aria-label="Toggle menu">=</button>
        </div>

        <form onSubmit={submitSearch} className="relative mt-3 w-full max-w-[525px] lg:mt-4">
          <label className="flex h-9 w-full items-center gap-3 rounded-lg border border-slate-300 bg-white px-5 text-[#0b469e] shadow-sm">
            <SearchIcon />
            <input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value)
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

          {searchOpen && searchQuery.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[70] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
              {searchLoading ? (
                <p className="px-4 py-3 text-sm font-medium text-slate-500">Searching products...</p>
              ) : searchResults.length ? (
                searchResults.map((product) => (
                  <button
                    key={product._id}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => openSearchResult(product)}
                    className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-0 hover:bg-slate-50"
                  >
                    <img src={product.images?.[0]?.url || product.gallery?.[0]?.url || '/logo.png'} alt="" className="h-10 w-10 rounded-md bg-slate-100 object-cover" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-slate-900">{product.title}</span>
                      <span className="block text-xs font-semibold text-[#0b469e]">
                        {product.searchType === 'service' ? 'Service' : 'Product'} · ₹{product.pricing?.sellingPrice ?? product.pricing?.minPrice ?? 0}
                      </span>
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 text-sm font-medium text-slate-500">No products or services found</p>
              )}
            </div>
          )}
        </form>
      </div>

      {open && (
        <div className="max-h-[calc(100vh-116px)] overflow-y-auto border-t border-slate-100 bg-white px-5 py-4 lg:hidden">
          <div className="grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={() => setMobileNetworkOpen((value) => !value)} className="flex items-center justify-between rounded-lg bg-[#0b469e] px-4 py-3 font-medium text-white sm:col-span-2">
              <span className="flex items-center"><img src={networkIcon} alt="" className="mr-2 h-4 w-4 object-contain" />Gloaro Network</span>
              <span className="text-lg leading-none">{mobileNetworkOpen ? '-' : '+'}</span>
            </button>
            {mobileNetworkOpen && <MobileGloaroNetworkMenu onNavigate={() => setOpen(false)} />}
            {isAuthenticated ? (
              <a onClick={() => setOpen(false)} href={getDashboardRoute(user?.role, user)} className="flex items-center rounded-lg bg-[#0b469e]/10 px-4 py-3 font-medium text-[#0b469e] sm:col-span-2">
                <img src={loginIcon} alt="" className="mr-2 h-4 w-4 object-contain brightness-0 filter" />
                {user?.name || 'Account'}
              </a>
            ) : (
              <>
                <a onClick={() => setOpen(false)} href="/login" className="flex items-center rounded-lg bg-[#0b469e]/10 px-4 py-3 font-medium text-[#0b469e] sm:col-span-2">
                  <img src={loginIcon} alt="" className="mr-2 h-4 w-4 object-contain brightness-0 filter" />
                  Login
                </a>
                <a onClick={() => setOpen(false)} href="/register" className="flex items-center justify-center rounded-lg border border-[#0b469e] px-4 py-3 font-medium text-[#0b469e] sm:col-span-2">
                  Register
                </a>
              </>
            )}
            {navItems.map(([icon, label, href, colors, iconClass = '']) => <a onClick={() => setOpen(false)} key={label} href={href} className={`flex items-center rounded-lg px-4 py-3 font-medium ${colors}`}><img src={icon} alt="" className={`mr-2 h-4 w-4 object-contain ${iconClass}`} />{label}</a>)}
          </div>
        </div>
      )}
    </header>
  )
}

function MobileGloaroNetworkMenu({ onNavigate }) {
  return (
    <div className="sm:col-span-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
      <div className="p-5">
        <h2 className="font-playfair text-2xl font-black italic leading-none text-[#0b469e]">Gloaro Network</h2>
        <p className="mt-2 text-sm font-extrabold italic text-[#ff8a00]">"Connect. Collaborate. Grow Globally."</p>
        <p className="mt-3 text-sm font-medium leading-5 text-black">Explore membership, business opportunities, services and global networking in our comprehensive enterprise ecosystem.</p>

        <div className="mt-5 grid gap-5">
          {networkMenu.map(([Icon, title, links]) => (
            <details key={title} className="rounded-md border border-slate-100 bg-slate-50 px-4 py-3" open={title === 'Membership'}>
              <summary className="flex cursor-pointer list-none items-center gap-2 font-playfair text-lg font-black italic text-[#0b469e] [&::-webkit-details-marker]:hidden">
                <Icon className="h-4 w-4" />
                {title}
              </summary>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link} className="text-sm font-medium text-black">
                    <a href={getNetworkHref(link)} onClick={onNavigate} className={`transition hover:text-[#0b469e] hover:underline ${link === 'Join Gloaro Network' ? 'font-semibold text-[#0b469e]' : ''}`}>{link}</a>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>

      <aside className="bg-[#fff8e7] p-5">
        <h3 className="font-playfair text-base font-black text-[#0b469e]">Become a GLOARO Member</h3>
        <div className="mt-4 grid gap-4">
          {networkHighlights.map(([Icon, title, text]) => (
            <div key={title} className="flex gap-3">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#ff9f00]" />
              <div>
                <p className="text-xs font-black text-[#0b469e]">{title}</p>
                <p className="mt-0.5 text-[11px] font-semibold leading-4 text-black">{text}</p>
              </div>
            </div>
          ))}
        </div>
        <a href="/register" onClick={onNavigate} className="mt-5 block rounded-lg bg-[#0b469e] px-4 py-3 text-center text-xs font-extrabold text-white shadow-lg shadow-blue-950/20">Explore Membership</a>
      </aside>
    </div>
  )
}

function GloaroNetworkMenu({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] hidden bg-slate-950/45 px-4 py-20 backdrop-blur-[1px] lg:flex lg:items-start lg:justify-center" role="dialog" aria-modal="true" aria-label="Gloaro Network information">
      <div className="relative grid max-h-[calc(100vh-7rem)] w-full max-w-[1120px] overflow-y-auto rounded-md bg-white shadow-2xl ring-1 ring-slate-200 lg:grid-cols-[1fr_190px]">
        <button type="button" onClick={onClose} className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 hover:text-[#0b469e]" aria-label="Close Gloaro Network menu">
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

        <aside className="flex flex-col bg-[#fff8e7] p-8">
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
      </div>
    </div>
  )
}
