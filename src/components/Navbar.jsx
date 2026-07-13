import { useState } from 'react'
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
import nearMeIcon from '../assets/nearme_icon.png'
import b2bIcon from '../assets/b2b_icon.png'
import loginIcon from '../assets/login_icon.png'

const SearchIcon = () => <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-none stroke-white stroke-[3.25]"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
const PinIcon = () => <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" /></svg>

const networkMenu = [
  [Users, 'Membership', ['Join Gloaro Network', 'Membership Benefits', 'Yearly Subscription', 'Member Access']],
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

const loginLink = (type, redirect) => `/login?type=${type}&redirect=${encodeURIComponent(redirect)}`

const getNetworkLink = (section) => {
  if (section === 'Membership') return loginLink('membership', '/membership-agreement')
  if (section === 'Franchise') return loginLink('franchise', '/membership-application')
  if (section === 'Business Network') return loginLink('b2b', '/vendors')
  return '#membership'
}

export default function Navbar() {
  const { isAuthenticated, user } = useAuth()
  const [open, setOpen] = useState(false)
  const [networkOpen, setNetworkOpen] = useState(false)
  const [mobileNetworkOpen, setMobileNetworkOpen] = useState(false)
  const navItems = [
    [shopIcon, 'Shop', '/products', 'bg-[#ffb20c] text-[#063a85]'],
    [nearMeIcon, 'Near Me', '/nearby', 'bg-[#ffb20c] text-[#063a85]'],
    [b2bIcon, 'B2B Marketplace', loginLink('b2b', '/vendors'), 'bg-[#ffb20c] text-[#063a85]'],
    [loginIcon, 'Become a Vendor', loginLink('vendor', '/vendor'), 'bg-[#0b469e] text-white', 'brightness-0 invert'],
  ]

  return (
    <header className="sticky top-0 z-50 border-t-4 border-black bg-white font-jakarta shadow-sm">
      <div className="mx-auto max-w-[1440px] px-4 py-3 sm:px-7">
        <div className="flex items-center gap-4 xl:gap-5">
          <a href="#top" className="flex w-24 shrink-0 items-center sm:w-28"><img src={logo} alt="Gloaro Business Network" className="h-auto w-full object-contain" /></a>

          <div className="hidden flex-1 items-center gap-3 lg:flex">
            <div className="relative" onMouseEnter={() => setNetworkOpen(true)}>
              <button type="button" onClick={() => setNetworkOpen(true)} className="flex h-10 items-center gap-2 whitespace-nowrap rounded-full bg-[#0b469e] px-5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-px" aria-expanded={networkOpen} aria-haspopup="true">
                <img src={networkIcon} alt="" className="h-4 w-4 object-contain" />
                Gloaro Network
              </button>
              {networkOpen && <GloaroNetworkMenu onClose={() => setNetworkOpen(false)} />}
            </div>
            {navItems.map(([icon, label, href, colors, iconClass = '']) => <a key={label} href={href} className={`flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-5 text-sm font-medium shadow-sm transition hover:-translate-y-px ${colors}`}><img src={icon} alt="" className={`h-4 w-4 object-contain ${iconClass}`} />{label}</a>)}
          </div>

          <div className="ml-auto hidden items-center gap-4 text-[#0b469e] lg:flex">
            {isAuthenticated ? (
              <a href={getDashboardRoute(user?.role)} aria-label="Account" className="flex items-center gap-1 text-sm font-medium"><img src={loginIcon} alt="" className="h-5 w-5 object-contain" /> {user?.name || 'Account'}</a>
            ) : (
              <a href={loginLink('user', '/member/dashboard')} aria-label="Account" className="flex items-center gap-1 text-sm font-medium"><img src={loginIcon} alt="" className="h-5 w-5 object-contain" /> Login</a>
            )}
            <div className="relative"><button onClick={() => setOpen(!open)} className="flex h-8 items-center gap-2 rounded-md bg-[#0b469e] px-3 text-xs font-medium text-white"><PinIcon />Kallakurichy <span className="border-l border-white/40 pl-2">⌄</span><SearchIcon /></button>{open && <div className="absolute right-0 top-10 w-52 rounded-b-md bg-white p-3 shadow-xl"><p className="mb-2 flex items-center gap-1 text-xs font-medium text-[#f3a900]"><PinIcon /> Kallakurichy</p><input placeholder="Search City..." className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-600 outline-none focus:border-[#0b469e]" /></div>}</div>
          </div>

          <button onClick={() => setOpen((value) => !value)} className="ml-auto rounded-md bg-[#0b469e] px-3 py-2 text-lg text-white lg:hidden" aria-label="Toggle menu">☰</button>
        </div>

        <div className="mt-3 flex items-center gap-3 lg:mt-4">
          <label className="flex h-8 w-full max-w-[420px] items-center gap-3 rounded-lg bg-[#0b469e] px-5 text-white shadow-sm"><SearchIcon /><input className="w-full bg-transparent text-xs outline-none placeholder:text-white" placeholder="Search for Products, Brands and More" /></label>
          <button onClick={() => setOpen(!open)} className="ml-auto flex items-center gap-1 text-xs font-medium text-[#f3a900] lg:hidden"><PinIcon /> Kallakurichy</button>
        </div>
      </div>

      {open && (
        <div className="max-h-[calc(100vh-116px)] overflow-y-auto border-t border-slate-100 bg-white px-5 py-4 lg:hidden">
          <div className="grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={() => setMobileNetworkOpen((value) => !value)} className="flex items-center justify-between rounded-lg bg-[#0b469e] px-4 py-3 font-medium text-white sm:col-span-2">
              <span className="flex items-center"><img src={networkIcon} alt="" className="mr-2 h-4 w-4 object-contain" />Gloaro Network</span>
              <span className="text-lg leading-none">{mobileNetworkOpen ? '−' : '+'}</span>
            </button>
            {mobileNetworkOpen && <MobileGloaroNetworkMenu onNavigate={() => setOpen(false)} />}
            {isAuthenticated ? (
              <a onClick={() => setOpen(false)} href={getDashboardRoute(user?.role)} className="flex items-center rounded-lg px-4 py-3 font-medium bg-[#0b469e]/10 text-[#0b469e] sm:col-span-2">
                <img src={loginIcon} alt="" className="mr-2 h-4 w-4 object-contain brightness-0 filter" />
                {user?.name || 'Account'}
              </a>
            ) : (
              <a onClick={() => setOpen(false)} href={loginLink('user', '/member/dashboard')} className="flex items-center rounded-lg px-4 py-3 font-medium bg-[#0b469e]/10 text-[#0b469e] sm:col-span-2">
                <img src={loginIcon} alt="" className="mr-2 h-4 w-4 object-contain brightness-0 filter" />
                Login
              </a>
            )}
            {navItems.map(([icon, label, href, colors, iconClass = '']) => <a onClick={() => setOpen(false)} key={label} href={href} className={`flex items-center rounded-lg px-4 py-3 font-medium ${colors}`}><img src={icon} alt="" className={`mr-2 h-4 w-4 object-contain ${iconClass}`} />{label}</a>)}
          </div>
          <div className="mt-4 rounded-lg border border-slate-200 p-3"><p className="mb-2 flex items-center gap-1 text-xs font-medium text-[#f3a900]"><PinIcon /> Kallakurichy</p><input placeholder="Search City..." className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none" /></div>
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
                {links.map((link) => <li key={link}><a onClick={onNavigate} href={getNetworkLink(title)} className="block text-sm font-medium text-black hover:text-[#0b469e]">{link}</a></li>)}
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
        <a onClick={onNavigate} href={loginLink('membership', '/membership-agreement')} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0b469e] px-4 py-3 text-xs font-extrabold text-white shadow-lg shadow-blue-950/20">Join Membership <span className="text-base leading-none">→</span></a>
      </aside>
    </div>
  )
}

function GloaroNetworkMenu({ onClose }) {
  return (
    <div className="absolute left-0 top-[calc(100%+10px)] hidden w-[min(1048px,calc(100vw-32px))] pb-4 lg:block">
      <div className="grid overflow-hidden rounded-b-md bg-white shadow-2xl ring-1 ring-slate-200 lg:grid-cols-[1fr_180px]">
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
                  {links.map((link) => <li key={link}><a href={getNetworkLink(title)} className="text-sm font-medium text-black hover:text-[#0b469e]">{link}</a></li>)}
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
          <a href={loginLink('membership', '/membership-agreement')} className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#0b469e] px-4 py-3 text-xs font-extrabold text-white shadow-lg shadow-blue-950/20">Join Membership <span className="text-base leading-none">→</span></a>
        </aside>
      </div>
    </div>
  )
}
