import { useCallback, useEffect, useRef, useState } from 'react'
import { ShoppingBag, ShoppingCart, Store, UserRound, UsersRound } from 'lucide-react'
import heroNetworkIcon from '../assets/hero_net_icon.png'
import heroBackground from '../assets/herobg-1.png'
import businessImage from '../assets/business_img.png'
import benefitImage1 from '../assets/img1.png'
import benefitImage2 from '../assets/img2.png'
import benefitImage3 from '../assets/img3.png'
import benefitImage4 from '../assets/img4.png'
import benefitImage5 from '../assets/img5.png'
import benefitImage6 from '../assets/img6.png'
import benefitImage7 from '../assets/img7.png'
import benefitImage8 from '../assets/img8.png'
import benefitImage9 from '../assets/img9.png'
import brandIcon from '../assets/brand_icon.png'
import analyticsIcon from '../assets/analytics.png'
import programIcon from '../assets/program.png'
import offerIcon from '../assets/offers.png'
import growthIcon from '../assets/growth.png'
import rocketIcon from '../assets/rocket.png'
import whyImage from '../assets/why_img.png'
import awardsImage from '../assets/awards_img.png'
import api from '../api/axios'

import leaderImage1 from '../assets/ceo.jpeg'
import leaderImage2 from '../assets/Digital_Network.png'

import { ROLES } from '../constants/roleConfig.js'



// Add future hero background assets to this list to create additional slides.
const heroSlides = [
  heroBackground,
]

const getLeaderCardsPerView = () => {
  if (typeof window === 'undefined') return 4
  if (window.innerWidth >= 1024) return 4
  if (window.innerWidth >= 640) return 2
  return 1
}

const loginLink = (type, redirect) => `/login?type=${type}&redirect=${encodeURIComponent(redirect)}`

const whyGloaroPoints = [
  { title: 'Grow Your Network', description: 'GLOARO is not just a business network; it is a growth ecosystem where entrepreneurs find opportunities, investors discover potential, and together they create sustainable success' },
  { title: 'Generate Referrals', description: 'Structured networking meetings designed to build strong business relationships and create referral partnerships.' },
  { title: 'Scale Your Business', description: 'Access tools, resources and opportunities to automate and scale your growth. Increase your online presence by listing your business in networking directories and business platforms' },
]

const serviceItems = [
  'Membership', 'Referrals', 'Events', 'Meetings', 'Mobile App',
  'Analytics', 'Franchise', 'B2B solutions', 'Digital Marketing', 'Resources',
]

const ecosystemActions = [
  { Icon: UserRound, title: 'Membership', description: 'Join Gloaro Network and get exclusive member benefits', action: 'Learn More', href: '/register', color: 'text-[#ffb21a]', bg: '#fff3d0' },
  { Icon: Store, title: 'Franchise', description: 'Run your own Gloaro franchise and grow together', action: 'Apply Now', href: '/register', color: 'text-[#7b4df1]', bg: '#f0eaff' },
  { Icon: UsersRound, title: 'Business Network', description: 'Connect with global businesses and professionals', action: 'Apply Now', href: '/register', color: 'text-[#20b15a]', bg: '#e6f8ed' },
  { Icon: ShoppingCart, title: 'B2B Marketplace', description: 'Buy quality products and services from trusted sellers', action: 'Shop Now', href: '/register', color: 'text-[#1377f2]', bg: '#e8f1ff' },
  { Icon: ShoppingBag, title: 'Vendor (Sell)', description: 'Sell your products and services to global buyers', action: 'Explore Benefits', href: '/register', color: 'text-[#ff7a1a]', bg: '#fff0e6' },
]

const memberBenefits = [
  ['One to One Business Referrals', benefitImage1],
  ['Referral Meetings', benefitImage2],
  ['Global business visits with leaders', benefitImage3],
  ['Social Media Marketing', benefitImage4],
  ['Business Directory Listing', benefitImage5],
  ['Digital Marketing support', benefitImage6],
  ['Business Expo & Trade Events', benefitImage7],
  ['MR.360 lead champion award', benefitImage8],
  ['E-Commerce Business & App Sales Support', benefitImage9],
]

const premiumBenefits = [
  [growthIcon, 'Business Growth Training & Workshops', 'Learn from industry experts and enhance your professional skills.'],
  [programIcon, 'Entrepreneur Development Programs', 'Programs designed to strengthen your business mindset and strategy.'],
  [analyticsIcon, 'Business Networking Opportunities', 'Connect with entrepreneurs, business leaders, and industry experts to expand your professional network.'],
  [brandIcon, 'Brand Building & Personal Branding', 'Create a powerful brand identity and build your market presence.'],
  [offerIcon, 'Exclusive Member-to-Member Offers', 'Enjoy special offers and discounts from fellow community members.'],
  [rocketIcon, 'Startup & SME Growth Guidance', 'Special support for startups and small-to-medium businesses.'],
]

const eventCards = [
  ['NETWORKING', 'CEO Roundtable 2024', 'Exclusive monthly gathering for executive-level leadership and strategy sharing.', 'Leadership insights • Peer networking', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80'],
  ['MEETINGS', 'Vendor Matchmaking', '1-on-1 scheduled sessions between verified suppliers and procurement officers.', 'Verified vendors • Buyer connections', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80'],
  ['WORKSHOPS', 'SaaS Growth Hacking', 'Interactive deep-dive into scalable software marketing and sales strategies.', 'Practical workshop • Growth strategies', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80'],
  ['TRAINING', 'Compliance Essentials', 'Certified training module on regional B2B regulations and trade laws.', 'Certified learning • Trade compliance', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80'],
]

const leaders = [
  {
    name: 'G.MANI VANNAN',
    role: 'Founder & CEO',
    bio: 'Visionary leader with 15+ years of experience in business strategy and growth.',
    image: leaderImage1,
  },
  {
    name: 'Yuvaraj',
    role: 'Digital Network Director',
    bio: 'Operations expert focused on delivering excellence and scaling impact.',
    image: leaderImage2,
  },
  
  
]

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [leaderCardsPerView, setLeaderCardsPerView] = useState(getLeaderCardsPerView)
  const [featuredBusinessesPaused, setFeaturedBusinessesPaused] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState('')
  const [publicSuccessStories, setPublicSuccessStories] = useState([])
  const [publicFaqs, setPublicFaqs] = useState([])
  const featuredBusinessesRef = useRef(null)
  const leadersRef = useRef(null)
  const successStoriesRef = useRef(null)

  useEffect(() => {
    let active = true
    api.get('/success-stories', { silent: true }).then((response) => {
      if (!active) return
      const databaseStories = Array.isArray(response.data?.data) ? response.data.data : []
      setPublicSuccessStories(databaseStories)
    }).catch(() => {
      if (active) setPublicSuccessStories([])
    })
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true
    api.get('/faqs', { silent: true }).then((response) => {
      if (active) setPublicFaqs(Array.isArray(response.data?.data) ? response.data.data : [])
    }).catch(() => {
      if (active) setPublicFaqs([])
    })
    return () => { active = false }
  }, [])

  useEffect(() => {
    const targetId = window.location.hash.slice(1)
    if (!targetId) return

    const scrollToTarget = () => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const hasNewStory = targetId === 'testimonials' && window.sessionStorage.getItem('gloaro_new_success_story')
    const frameId = window.requestAnimationFrame(scrollToTarget)
    const timeoutId = window.setTimeout(() => {
      scrollToTarget()
      if (hasNewStory) {
        successStoriesRef.current?.scrollTo({ left: 0, behavior: 'smooth' })
        window.sessionStorage.removeItem('gloaro_new_success_story')
      }
    }, 150)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(timeoutId)
    }
  }, [])
  const businesses = [
    ['Google India Pvt. Ltd.', 'Technology', 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=600&q=80', 'G', 'text-[#4285f4]'],
    ['Eco-Manu Corp', 'Manufacturing', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80', '⌂', 'text-[#03a66a]'],
    ['Financial Advisors', 'Finance', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80', '⌁', 'text-[#2f68d8]'],
    ['DesignTech Solutions', 'IT Services', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80', 'D', 'text-[#ff5a16]'],
    ['Marketing Masters', 'Digital Marketing', 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=600&q=80', '▱', 'text-[#f7a600]'],
    ['Urban Build Group', 'Construction', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80', 'U', 'text-[#0d4697]'],
    ['BrightCare Clinics', 'Healthcare', 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=600&q=80', '+', 'text-[#12a26a]'],
    ['Vista Legal Partners', 'Legal Services', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80', 'V', 'text-[#7346d6]'],
  ]
  const scrollFeaturedBusinesses = useCallback((direction) => {
    const carousel = featuredBusinessesRef.current
    if (!carousel) return

    const card = carousel.querySelector('[data-featured-business-card]')
    const gap = window.innerWidth >= 1024 ? 24 : 20
    const scrollAmount = card ? card.getBoundingClientRect().width + gap : 260
    const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - scrollAmount / 2
    const atStart = carousel.scrollLeft <= 0

    if (direction > 0 && atEnd) {
      carousel.scrollTo({ left: 0, behavior: 'smooth' })
      return
    }

    if (direction < 0 && atStart) {
      carousel.scrollTo({ left: carousel.scrollWidth, behavior: 'smooth' })
      return
    }

    carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' })
  }, [])
  const scrollLeaders = useCallback((direction) => {
    const carousel = leadersRef.current
    if (!carousel || leaders.length <= getLeaderCardsPerView()) return

    const card = carousel.querySelector('[data-leader-card]')
    const gap = Number.parseFloat(window.getComputedStyle(carousel).columnGap) || 20
    const scrollAmount = card ? card.getBoundingClientRect().width + gap : 280
    const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - scrollAmount / 2
    const atStart = carousel.scrollLeft <= 0

    if (direction > 0 && atEnd) {
      carousel.scrollTo({ left: 0, behavior: 'smooth' })
      return
    }

    if (direction < 0 && atStart) {
      carousel.scrollTo({ left: carousel.scrollWidth, behavior: 'smooth' })
      return
    }

    carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' })
  }, [])
  const scrollSuccessStories = useCallback((direction) => {
    const carousel = successStoriesRef.current
    if (!carousel) return

    const card = carousel.querySelector('[data-success-story-card]')
    const gap = window.innerWidth >= 1024 ? 32 : 20
    const scrollAmount = card ? card.getBoundingClientRect().width + gap : 300
    carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' })
  }, [])
  useEffect(() => {
    const slider = window.setInterval(() => setActiveSlide((current) => (current + 1) % heroSlides.length), 5000)
    return () => window.clearInterval(slider)
  }, [])
  useEffect(() => {
    if (featuredBusinessesPaused) return undefined
    const featuredSlider = window.setInterval(() => scrollFeaturedBusinesses(1), 5000)
    return () => window.clearInterval(featuredSlider)
  }, [featuredBusinessesPaused, scrollFeaturedBusinesses])
  useEffect(() => {
    const updateLeaderCardsPerView = () => setLeaderCardsPerView(getLeaderCardsPerView())

    updateLeaderCardsPerView()
    window.addEventListener('resize', updateLeaderCardsPerView)
    return () => window.removeEventListener('resize', updateLeaderCardsPerView)
  }, [])

  const canScrollLeaders = leaders.length > leaderCardsPerView
  const hasCompactLeaderList = leaders.length <= 2
  const leadersCarouselWidth = hasCompactLeaderList ? 'lg:max-w-[564px]' : 'lg:max-w-[1152px]'
  const leadersContentLayout = hasCompactLeaderList
    ? 'lg:grid-cols-[auto_minmax(280px,1fr)] lg:items-center lg:gap-12'
    : 'lg:grid-cols-1 lg:gap-8'

  return <main id="top">
    {/* 1. Hero Banner */}
    <section className="relative isolate overflow-visible bg-[#fdf9e9] pb-24 sm:pb-28">
      <div className="relative min-h-[530px] overflow-hidden rounded-b-[28px] bg-[#061633] sm:min-h-[610px]">
        {heroSlides.map((slide, index) => <img key={slide} src={slide} alt="Gloaro business network" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`} />)}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,18,50,.78),rgba(3,19,52,.5),rgba(2,12,35,.8))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(31,102,210,.28),transparent_45%)]" />
        <div className="relative mx-auto flex min-h-[530px] max-w-7xl flex-col items-center px-5 pb-32 pt-12 text-center sm:min-h-[610px] sm:pt-10 lg:px-8">
          <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-slate-400/40 px-4 py-2 shadow-xl backdrop-blur sm:px-7 sm:py-3"><img src={heroNetworkIcon} alt="Gloaro network" className="h-7 w-7 object-contain sm:h-8 sm:w-8" /><span className="text-base font-semibold tracking-tight text-white sm:text-2xl">GLOARO BUSINESS NETWORK</span></div>
          <h1 className="mt-7 max-w-5xl font-playfair text-5xl font-medium italic leading-[0.92] tracking-tight text-white sm:mt-8 sm:text-7xl lg:text-8xl"><span className="block">We Give. <span className="text-[#ffa900]">We Grow.</span></span><span className="mt-3 block sm:mt-4"><span className="text-[#ff9515]">We</span> Win Together.</span></h1>
          <p className="mt-6 max-w-7xl font-urbanist text-base font-medium leading-7 tracking-[0.05em] text-white sm:text-lg">A trusted network of professionals and entrepreneurs building relationships, creating opportunities,<br className="hidden md:block" /> and shaping future success together.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3"><a href="/register?type=membership" className="rounded-lg bg-[#10499b] px-6 py-3 text-lg font-bold text-white shadow-lg shadow-black/30">Become a Member&nbsp; ↗</a><a href="#why-gloaro" className="rounded-lg border border-white/15 bg-slate-700/70 px-6 py-3 text-lg font-bold text-white shadow-lg shadow-black/30 backdrop-blur">Explore Network&nbsp; ↗</a></div>
          <p className="mt-5 font-serif text-2xl font-bold text-[#f6a600]">Connect. Collaborate. Grow Globally</p>
          <div className="mt-5 flex gap-2">{heroSlides.map((_, index) => <button key={index} onClick={() => setActiveSlide(index)} aria-label={`Show slide ${index + 1}`} className={`h-1.5 rounded-full transition-all ${index === activeSlide ? 'w-7 bg-[#ffad16]' : 'w-1.5 bg-white/50'}`} />)}</div>
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 z-10 grid w-[calc(100%-2.5rem)] max-w-5xl -translate-x-1/2 grid-cols-2 overflow-hidden rounded-3xl border border-white/70 bg-[#0d4697] text-center text-white shadow-xl shadow-slate-800/25 lg:grid-cols-4">
        {[['10,000+', 'Active Members'], ['5,000+', 'Businesses'], ['25+', 'Cities'], ['1,000+', 'Successful Referrals']].map(([value, label], index) => <div key={label} className={`px-3 py-5 sm:px-4 sm:py-7 ${index === 1 ? 'border-l border-white/35' : ''} ${index === 2 ? 'border-t border-white/35 lg:border-l lg:border-t-0' : ''} ${index === 3 ? 'border-l border-t border-white/35 lg:border-t-0' : ''}`}><p className="font-dm-serif text-3xl sm:text-4xl">{value}</p><p className="mt-1 font-playfair text-base italic sm:text-2xl">{label}</p></div>)}
      </div>
    </section>

    {/* 2. Why Gloaro */}
    <section id="why-gloaro" className="bg-[#fdf9e9] py-12 sm:py-16 lg:py-20"><div className="mx-auto grid max-w-6xl items-center gap-8 px-5 sm:gap-10 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-14 lg:px-8"><img className="h-auto w-full max-w-[400px] justify-self-center rounded-lg object-cover shadow-sm lg:h-[400px] lg:w-[400px] lg:justify-self-start" src={businessImage} alt="Business professionals collaborating" /><div className="text-center lg:text-left"><h2 className="font-playfair text-3xl font-semibold italic leading-tight text-[#0d4697] sm:text-4xl lg:text-[38px]">Why <span className="text-[#ffae13]">Gloaro</span></h2><p className="mx-auto mt-4 max-w-[670px] text-left font-urbanist text-base font-medium leading-relaxed text-[#151515] sm:text-lg lg:mx-0">GLOARO is more than just a business network; it is a powerful growth ecosystem designed to connect entrepreneurs, investors, and innovators. It creates a platform where businesses can discover new opportunities, build meaningful partnerships, and unlock their full potential. By bringing the right people together, GLOARO helps transform ideas into impactful ventures and supports the journey toward sustainable success.</p><a href="/register" className="mt-5 inline-block rounded-lg bg-[#0d4697] px-6 py-3 font-urbanist text-base font-semibold text-white shadow-sm sm:text-lg">Explore Network&nbsp; ↗</a></div></div></section>

    {/* 3. Business Categories */}
    <section id="business-categories" className="bg-[#0d4697] px-5 py-12 sm:py-16 lg:px-8 lg:py-12"><div className="mx-auto max-w-7xl"><div className="text-center text-white"><h2 className="font-playfair text-4xl font-semibold italic sm:text-5xl"><span className="mr-3 align-middle text-xl not-italic sm:mr-6">—</span><span className="text-[#ffae13]">Business</span> Categories<span className="ml-3 align-middle text-xl not-italic sm:ml-6">—</span></h2><p className="mt-1 font-urbanist text-base font-medium sm:text-lg">Explore business opportunities across the Gloaro network</p></div><div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-6 lg:gap-y-5">{serviceItems.map((service) => <article key={service} className="group flex min-h-20 items-center justify-between rounded-2xl border border-white/25 bg-white/15 px-7 text-left font-playfair text-xl font-semibold italic text-white shadow-[inset_0_1px_12px_rgba(255,255,255,.12)] transition duration-200 hover:-translate-y-1 hover:border-[#ffae13] hover:bg-white/30 hover:ring-2 hover:ring-[#ffae13]"><span className={service === 'B2B solutions' || service === 'Digital Marketing' ? 'max-w-[88px] leading-5' : ''}>{service}</span><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-sm not-italic text-[#0d4697] transition group-hover:bg-[#ffae13] group-hover:text-white">›</span></article>)}</div></div></section>

    {/* 4. Features */}
    <section id="features" className="border-t-4 border-[#0d4697] bg-[#fdf9e9] py-12 sm:py-16 lg:py-18"><div className="mx-auto grid max-w-5xl items-center gap-10 px-5 lg:grid-cols-[1.15fr_.85fr] lg:gap-16 lg:px-8"><div><h2 className="font-playfair text-4xl font-semibold leading-tight sm:text-5xl"><span className="italic text-[#ffae13]">Features</span> of <span className="italic text-[#0d4697]">Gloaro</span> <span className="font-play not-italic text-[#0d4697]">360</span></h2><div className="mt-4 space-y-5 font-urbanist">{whyGloaroPoints.map((point, index) => <div key={point.title}><h3 className="text-xl font-bold text-[#0d4697]">{index + 1}. {point.title}</h3><p className="mt-1 text-base font-semibold leading-[1.28] text-[#161616]">{point.description}</p></div>)}</div></div><img src={whyImage} alt="Business team in a strategy meeting" className="h-72 w-full rounded-[28px] object-cover shadow-sm sm:h-96 lg:h-[330px]" /></div></section>

    {/* 5. Gloaro 360 Ecosystem */}
    <section id="marketplace" className="bg-white px-5 py-10 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="font-playfair text-4xl font-semibold italic leading-tight text-[#0d4697] sm:text-5xl"><span>Explore </span><span className="text-[#ffae13]">Gloaro</span> <span className="font-play not-italic text-[#ffae13]">360</span> Ecosystem</h2>
          <p className="mt-2 font-urbanist text-lg font-semibold text-[#1f2937]">We Give. We Grow. We Win Together.</p>
          <p className="mt-7 font-urbanist text-base font-semibold text-[#4b5563] sm:text-lg">Everything you need to grow your business</p>
        </div>
        <div className="mx-auto mt-5 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {ecosystemActions.map(({ Icon, title, description, action, href, color, bg }) => (
            <a key={title} href={href} className="group flex min-h-[190px] flex-col items-center rounded-lg border border-[#e6ebf2] bg-white px-4 py-5 text-center shadow-[0_8px_24px_rgba(15,23,42,.06)] transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,23,42,.12)]">
              <span className="relative grid h-12 w-12 place-items-center rounded-full" style={{ backgroundColor: bg }}>
                <Icon className={`h-10 w-10 ${color}`} strokeWidth={2.4} />
              </span>
              <h3 className="mt-3 font-urbanist text-base font-extrabold text-[#111827]">{title}</h3>
              <p className="mt-2 min-h-[58px] max-w-[145px] font-urbanist text-xs font-semibold leading-5 text-[#4b5563]">{description}</p>
              <span className="mt-2 inline-flex items-center gap-2 font-urbanist text-xs font-extrabold text-[#1366d6]">{action} <span className="transition group-hover:translate-x-1">→</span></span>
            </a>
          ))}
        </div>
      </div>
    </section>

    {/* 6. Member Benefits */}
    <section id="membership" className="border-t-2 border-[#0d4697] bg-[#fdf9e9] px-5 py-12 sm:py-16 lg:px-8"><div className="mx-auto max-w-7xl"><div className="text-center"><p className="font-inter text-sm font-medium tracking-[0.16em] text-[#0d4697] sm:text-base">GLOARO 360 MEMBER BENEFITS</p><h2 className="mt-1 font-playfair text-3xl font-semibold italic leading-tight text-[#0d4697] sm:text-4xl">Everything you need to <span className="text-[#ff7e15]">grow your business</span></h2><p className="mt-1 font-urbanist text-sm font-medium text-[#161616] sm:text-base">Our membership opens the door to powerful connections, global exposure and<br className="hidden sm:block" /> resources that help you build, scale and succeed.</p></div><div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{memberBenefits.map(([title, image]) => <div key={title} className="group relative h-48 overflow-hidden rounded-xl bg-slate-700 sm:h-52"><img src={image} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-xl border border-white/35 bg-slate-100/10 px-4 py-2.5 text-white backdrop-blur-sm"><span className="max-w-[210px] font-urbanist text-base font-semibold leading-5">{title}</span><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-xl leading-none text-[#0d4697]">›</span></div></div>)}</div></div></section>

    {/* 7. Premium Membership */}
    <section id="premium" className="bg-[#104694] px-5 py-10 text-white sm:py-14 lg:px-8"><div className="mx-auto max-w-7xl"><div className="text-center"><h2 className="font-playfair text-3xl font-semibold italic sm:text-4xl"><span>Premium </span><span className="text-[#ffae13]">Membership Benefits</span></h2></div><div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{premiumBenefits.map(([icon, title, description]) => <article key={`${title}-${description}`} className="flex min-h-[88px] gap-3 rounded-lg border border-white/25 bg-white/10 p-4 text-left shadow-[inset_0_1px_10px_rgba(255,255,255,.06)] transition duration-200 hover:-translate-y-1 hover:border-[#ffae13] hover:bg-white/20 hover:ring-2 hover:ring-[#ffae13]"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white p-1 text-[#104694]"><img src={icon} alt="" className="h-full w-full object-contain" /></span><span><span className="block font-playfair text-sm font-semibold">{title}</span><span className="mt-1 block font-urbanist text-[11px] leading-3.5 text-slate-100">{description}</span></span></article>)}</div></div></section>

    {/* 9. Featured Businesses */}
    <section id="directory" onMouseEnter={() => setFeaturedBusinessesPaused(true)} onMouseLeave={() => setFeaturedBusinessesPaused(false)} onTouchStart={() => setFeaturedBusinessesPaused(true)} onTouchEnd={() => setFeaturedBusinessesPaused(false)} className="border-b-4 border-[#163960] bg-[#fdf9e9] px-5 py-12 sm:py-16 lg:px-8"><div className="mx-auto max-w-7xl"><div><h2 className="font-playfair text-4xl font-semibold italic leading-none text-[#0d4697] sm:text-5xl"><span>Featured </span><span className="text-[#ffae13]">Businesses</span></h2></div><div className="relative mt-8"><button type="button" onClick={() => scrollFeaturedBusinesses(-1)} aria-label="Previous featured businesses" className="absolute -left-4 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-xl font-bold text-[#1c2433] shadow-md lg:-left-7">‹</button><div ref={featuredBusinessesRef} className="flex snap-x gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] lg:gap-6 [&::-webkit-scrollbar]:hidden">{businesses.map(([name, type, image, icon, iconColor]) => <article key={name} data-featured-business-card className="w-[min(230px,78vw)] shrink-0 snap-start overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-6rem)/5)]"><div className="relative h-[110px] overflow-hidden"><img src={image} className="h-full w-full object-cover" alt={`${name} business`} /><div className="absolute -bottom-8 left-1/2 grid h-16 w-16 -translate-x-1/2 place-items-center rounded-full border border-slate-100 bg-white shadow-lg"><span className={`font-play text-3xl font-bold ${iconColor}`}>{icon}</span></div></div><div className="px-4 pb-5 pt-9 text-center"><h3 className="font-urbanist text-base font-extrabold leading-tight text-[#1f2937]">{name}</h3><p className="mt-0.5 font-urbanist text-xs font-semibold text-[#151515]">{type}</p><p className="mt-1 text-sm leading-none text-[#ffc400]">★★★★★</p><button type="button" className="mt-5 block w-full rounded bg-[#0d4697] px-4 py-2.5 font-urbanist text-xs font-extrabold text-white">Connect Now</button></div></article>)}</div><button type="button" onClick={() => scrollFeaturedBusinesses(1)} aria-label="Next featured businesses" className="absolute -right-4 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-xl font-bold text-[#1c2433] shadow-md lg:-right-7">›</button></div></div></section>

    {/* 10. Our Leaders */}
    <section id="leaders" className="border-b-4 border-[#163960] bg-[#fdf9e9] px-5 py-12 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-playfair text-4xl font-semibold italic leading-none text-[#0d4697] sm:text-5xl"><span>Our </span><span className="text-[#ffae13]">Leaders</span></h2>
            <p className="mt-3 font-urbanist text-base font-semibold text-[#26364d] sm:text-lg">Visionary leaders driving innovation and excellence</p>
          </div>
          <a href="#join" className="shrink-0 font-urbanist text-lg font-extrabold text-[#0d4697] sm:text-2xl">View All →</a>
        </div>
        <div className={`mt-10 grid gap-8 ${leadersContentLayout}`}>
          <div className={`relative w-full max-w-[270px] sm:max-w-[560px] ${leadersCarouselWidth}`}>
            {canScrollLeaders && <button type="button" onClick={() => scrollLeaders(-1)} aria-label="Previous leaders" className="absolute -left-4 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white text-2xl font-bold text-[#1c2433] shadow-md lg:-left-7">‹</button>}
            <div ref={leadersRef} className="flex snap-x gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] lg:gap-6 [&::-webkit-scrollbar]:hidden">
              {leaders.map((leader) => (
                <article key={leader.name} data-leader-card className="w-full shrink-0 snap-start overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_8px_20px_rgba(15,23,42,.12)] sm:w-[270px] lg:w-[270px]">
                  <div className="relative h-[210px] overflow-hidden bg-slate-200 sm:h-[230px] lg:h-[220px]">
                    <img src={leader.image} alt={leader.name} className="h-full w-full object-cover object-top" />
                    <div className="absolute -bottom-9 left-1/2 grid h-[74px] w-[74px] -translate-x-1/2 place-items-center rounded-full border-[3px] border-white bg-[#10223d] shadow-lg">
                      <UserRound className="h-9 w-9 text-white" strokeWidth={1.8} />
                    </div>
                  </div>
                  <div className="px-5 pb-7 pt-14 text-center">
                    <h3 className="font-urbanist text-xl font-extrabold leading-tight text-[#172338]">{leader.name}</h3>
                    <p className="mt-2 font-urbanist text-sm font-extrabold text-[#0d4697]">{leader.role}</p>
                    <p className="mx-auto mt-5 min-h-[72px] max-w-[210px] font-urbanist text-sm font-semibold leading-6 text-[#1f2937]">{leader.bio}</p>
                    <a href="#join" aria-label={`${leader.name} LinkedIn profile`} className="mx-auto mt-5 grid h-6 w-6 place-items-center rounded bg-[#0878b9] font-urbanist text-sm font-black leading-none text-white">in</a>
                  </div>
                </article>
              ))}
            </div>
            {canScrollLeaders && <button type="button" onClick={() => scrollLeaders(1)} aria-label="Next leaders" className="absolute -right-4 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white text-2xl font-bold text-[#1c2433] shadow-md lg:-right-7">›</button>}
          </div>
          <div className="max-w-xl lg:justify-self-end">
            <h3 className="font-playfair text-3xl font-semibold italic leading-tight text-[#0d4697] sm:text-4xl">Leadership That <span className="text-[#ffae13]">Drives Growth</span></h3>
            <p className="mt-4 font-urbanist text-base font-semibold leading-7 text-[#26364d] sm:text-lg">Our leadership team brings vision, innovation, and disciplined execution together to help businesses grow with confidence. Their commitment to excellence shapes every connection, opportunity, and partnership across the Gloaro network.</p>
            <a href="#join" className="mt-6 inline-flex items-center rounded-lg bg-[#0d4697] px-6 py-3 font-urbanist text-base font-extrabold text-white shadow-sm transition hover:bg-[#0a3b81]">Meet Our Leadership&nbsp; →</a>
          </div>
        </div>
      </div>
    </section>

    {/* 10. Awards */}
    <section className="bg-[#08213d] px-5 py-12 text-white sm:py-16 lg:px-8"><div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2 lg:gap-12"><div className="rounded-lg border border-white/15 bg-white/10 px-6 py-7 text-center shadow-[inset_0_1px_12px_rgba(255,255,255,.04)] sm:px-10"><h2 className="font-playfair text-3xl font-bold leading-[0.95] sm:text-4xl">Weekly Awards<br />Ceremony</h2><h3 className="mt-4 font-urbanist text-lg font-medium">Celebrating Excellence Every Month</h3><p className="mx-auto mt-4 max-w-[390px] font-urbanist text-base font-normal leading-7 text-white/90">Recognizing outstanding members, business leaders, and top performers for their contributions, growth, and achievements within the Gloaro Network community.</p><a href="#join" className="mt-4 inline-flex items-center gap-8 rounded-md bg-[#ffc400] px-8 py-2.5 font-urbanist text-base font-extrabold text-black">View Awards <span className="text-sm">↗</span></a></div><img src={awardsImage} alt="Business award ceremony" className="h-80 w-full rounded-[22px] object-cover object-center shadow-sm sm:h-96 lg:h-[390px]" /></div></section>

    {/* 11. Meetings & Events */}
    <section id="events" className="scroll-mt-48 bg-[#fdf9e9] px-5 py-12 sm:py-16 lg:scroll-mt-52 lg:px-8"><div className="mx-auto max-w-6xl"><div className="text-center"><h2 className="font-playfair text-4xl font-semibold italic leading-none text-[#0d4697] sm:text-5xl"><span>Meetings </span><span className="text-[#ffae13]">and Events</span></h2><p className="mt-1 font-urbanist text-base font-extrabold text-[#0d4697] sm:text-lg">Find curated vendor products across multiple industries.</p></div><div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{eventCards.map(([category, title, description, details, image]) => <article key={category} onClick={() => setSelectedEvent(title)} className={`cursor-pointer overflow-hidden rounded-lg border bg-white shadow-sm transition duration-200 ${selectedEvent === title ? '-translate-y-1 border-[#ffae13] ring-2 ring-[#ffae13] shadow-lg' : 'border-slate-200 hover:-translate-y-0.5 hover:border-[#ffae13]/70 hover:shadow-md'}`}><img src={image} alt={`${title} event`} className="h-32 w-full object-cover" /><div className="px-4 pb-5 pt-4"><p className="font-play text-sm font-bold uppercase text-[#0d4697]">{category}</p><h3 className="mt-3 font-playfair text-sm font-semibold text-black">{title}</h3><p className="mt-3 min-h-[54px] font-urbanist text-xs font-semibold leading-5 text-black">{description}</p><div className={`mt-4 rounded-md border px-3 py-2.5 font-urbanist text-xs font-bold transition ${selectedEvent === title ? 'border-[#ffae13] bg-[#fff5d8] text-[#9a5800]' : 'border-[#dbe5f2] bg-[#f5f8fc] text-[#0d4697]'}`}>{details}</div></div></article>)}</div></div></section>

    {/* 12. Success Stories / Testimonials */}
    <section id="testimonials" className="relative scroll-mt-48 overflow-hidden border-b-4 border-white bg-[radial-gradient(circle_at_top_left,#2563a9_0,#0d4697_38%,#082e70_100%)] px-5 py-12 text-white sm:py-16 lg:scroll-mt-52 lg:px-8">
      <div aria-hidden="true" className="absolute -left-24 top-16 h-64 w-64 rounded-full border border-white/10" />
      <div aria-hidden="true" className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#ffae13]/10 blur-2xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <span className="mb-2 inline-flex rounded-full border border-[#ffae13]/50 bg-[#ffae13]/10 px-4 py-1.5 font-urbanist text-[11px] font-black uppercase tracking-[0.22em] text-[#ffd36e]">Real people. Real growth.</span>
          <h2 className="font-playfair text-4xl font-semibold italic leading-tight sm:text-5xl"><span>Success </span><span className="text-[#ffae13]">Stories</span></h2>
          <p className="mt-1 font-urbanist text-base font-semibold sm:text-lg">Hear from the businesses that scaled their operations through our professional ecosystem.</p>
        </div>
        <div className="relative mt-8 lg:mt-10">
          <button type="button" onClick={() => scrollSuccessStories(-1)} aria-label="Previous success stories" className="absolute -left-1 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-xl font-bold text-white shadow-md backdrop-blur transition hover:bg-white/25 sm:-left-3 lg:-left-8">‹</button>
          <div ref={successStoriesRef} className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-4 [scrollbar-width:none] lg:gap-8 lg:px-8 [&::-webkit-scrollbar]:hidden">
            {publicSuccessStories.map((story, index) => <figure key={story._id || story.name} data-success-story-card className={`group relative flex min-h-[270px] w-[min(290px,82vw)] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border p-6 transition duration-300 hover:-translate-y-2 sm:w-[350px] lg:w-[calc((100%_-_4rem)/3)] ${story.featured ? 'border-[#ffca51]/70 bg-gradient-to-br from-[#356bb0] to-[#174b92] text-white shadow-[0_20px_45px_rgba(3,25,67,.35)]' : 'border-white/60 bg-white text-[#081b38] shadow-[0_18px_40px_rgba(3,25,67,.28)]'}`}>
              <span className={`absolute right-5 top-4 font-playfair text-7xl font-black leading-none opacity-10 ${story.featured ? 'text-white' : 'text-[#0d4697]'}`}>“</span>
              <span className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-[#ffae13] transition-transform duration-300 group-hover:scale-x-100" />
              <span className={`absolute right-5 top-5 rounded-full px-2.5 py-1 font-urbanist text-[10px] font-black uppercase tracking-wider ${story.featured ? 'bg-[#ffae13] text-[#082e70]' : 'bg-[#eaf2ff] text-[#0d4697]'}`}>Story 0{index + 1}</span>
              <div className="text-lg leading-none text-[#ffc400]">{'★'.repeat(story.rating || 5)}</div>
              <blockquote className="mt-3 flex-1 break-words font-urbanist text-sm font-extrabold italic leading-5 [overflow-wrap:anywhere]">“{story.quote}”</blockquote>
              <figcaption className={`mt-6 flex items-center gap-4 border-t pt-5 ${story.featured ? 'border-white/20' : 'border-slate-200'}`}>
                <img src={story.avatar} alt={`${story.name} profile`} className={`h-12 w-12 rounded-full object-cover ring-4 ${story.featured ? 'ring-white/15' : 'ring-[#eaf2ff]'}`} />
                <div>
                  <p className={`font-urbanist text-sm font-extrabold ${story.featured ? 'text-[#ffae13]' : 'text-[#0d4697]'}`}>{story.name}</p>
                  <p className={`font-urbanist text-sm font-extrabold leading-5 ${story.featured ? 'text-white' : 'text-[#303846]'}`}>{story.role}</p>
                </div>
              </figcaption>
            </figure>)}
          </div>
          <button type="button" onClick={() => scrollSuccessStories(1)} aria-label="Next success stories" className="absolute -right-1 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-xl font-bold text-white shadow-md backdrop-blur transition hover:bg-white/25 sm:-right-3 lg:-right-8">›</button>
        </div>
      </div>
    </section>

    {/* 13. FAQ */}
    <section id="join" className="bg-[#fdf9e9] px-5 py-12 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <h2 className="font-playfair text-4xl font-bold italic leading-[0.92] text-[#0d4697] sm:text-5xl">
            <span className="block">Frequently <span className="text-[#ff9515]">Asked</span></span>
            <span className="block">questions</span>
          </h2>
          <p className="mt-9 font-urbanist text-sm font-extrabold leading-5 text-[#5e6572]">Can't find the answer you're looking for?</p>
          <p className="mt-1 max-w-[290px] font-urbanist text-base font-semibold leading-6 text-black">Our team is here to help you navigate the Gloaro ecosystem.</p>
        </div>

        <div className="font-urbanist">
          <div>
            {publicFaqs.map((faq) => <details key={faq._id || faq.question} className="group border-b border-slate-300">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-extrabold text-[#151515] [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <span className="shrink-0 text-lg font-normal leading-none text-slate-400 transition group-open:rotate-180">⌄</span>
              </summary>
              <p className="pb-4 pr-8 text-sm font-semibold leading-6 text-[#5e6572]">{faq.answer}</p>
            </details>)}
          </div>
        </div>
      </div>
    </section>
  </main>
}
