import { useCallback, useEffect, useRef, useState } from 'react'
import BusinessCategories from '../components/common/BusinessCategories'
import { ArrowRight, BadgeCheck, CalendarDays, ChevronDown, Clock3, Mail, MapPin, PhoneCall, ShieldCheck, Sparkles, ShoppingBag, ShoppingCart, Store, Ticket, UserRound, UsersRound } from 'lucide-react'
import heroNetworkIcon from '../assets/signup_logo.png'
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
import api from '../api/axios'

const awardsHighlightImage = 'https://images.unsplash.com/photo-1764874299025-d8b2251f307d?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000'


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

const whyGloaroPoints = [
  { title: 'Grow Your Network', description: 'GLOARO is not just a business network; it is a growth ecosystem where entrepreneurs find opportunities, investors discover potential, and together they create sustainable success' },
  { title: 'Generate Connects', description: 'Structured networking meetings designed to build strong business relationships and create referral partnerships.' },
  { title: 'Scale Your Business', description: 'Access tools, resources and opportunities to automate and scale your growth. Increase your online presence by listing your business in networking directories and business platforms' },
]

const serviceItems = [
  'Membership', 'Connects', 'Events', 'Meetings', 'Mobile App',
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
  ['One to One Business Connects', benefitImage1],
  ['Connect Meetings', benefitImage2],
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

const networkDetailGroups = [
  {
    title: 'Membership',
    eyebrow: 'Connect & belong',
    items: [
      ['membership-benefits-detail', 'Membership Benefits', 'One-to-one referrals, verified networking, business promotion, digital support, training, leadership development, expos and recognition programs.'],
      ['membership-investment', 'Yearly Subscription', 'Annual membership is ₹30,000 plus ₹5,400 GST (18%), totaling ₹35,400. It includes the referral network, meetings, training, community access, digital support and business promotion.'],
      ['member-access', 'Member Access', 'Approved members enter a verified community with business directory visibility, structured meetings, referral opportunities and digital growth resources.'],
    ],
  },
  {
    title: 'Business Network',
    eyebrow: 'One complete ecosystem',
    items: [
      ['gloaro-360-network', '360 Gloaro Network', 'A unified ecosystem connecting entrepreneurs, businesses, technology, referrals, digital opportunities, marketplace access and community growth.'],
      ['global-business-network', 'Global Business Network', 'GLOARO is building toward international business communities and global visits with industry leaders as part of its future expansion.'],
      ['business-growth', 'Business Growth', 'Trusted relationships, qualified referrals, digital promotion, training, technology and marketplace visibility work together to support long-term growth.'],
      ['business-opportunities', 'Business Opportunities', 'Members can discover collaborations, strategic partnerships, marketplace opportunities, franchise growth and business expansion pathways.'],
    ],
  },
  {
    title: 'Connect Program',
    eyebrow: 'Trust-led opportunities',
    items: [
      ['referral-meeting', 'Connect Meeting', 'Members attend structured weekly and one-to-one business meetings designed to build trusted relationships and qualified opportunities.'],
      ['referral-join', 'Connect Join', 'A prospective member is referred by an existing verified member, completes offline verification and receives membership approval before joining.'],
      ['referral-benefits', 'Connect Benefits', 'The referral engine creates genuine introductions, business relationships, qualified leads and ongoing community support.'],
    ],
  },
  {
    title: 'Mobile App',
    eyebrow: 'Business on the move',
    items: [
      ['gloaro-app', 'Gloaro App', 'A planned mobile ecosystem for networking, referrals, community participation and access to GLOARO digital opportunities.'],
      ['member-app', 'Member App', 'A member-focused experience for profiles, connections, meeting updates, referrals and recognition activity.'],
      ['business-management-app', 'Business Management App', 'A proposed workspace to organize business activity, opportunities, customer follow-ups and performance insights.'],
    ],
  },
  {
    title: 'Business Services',
    eyebrow: 'Digital growth solutions',
    items: [
      ['technology-development', 'Technology Development', 'GLOARO supports digital transformation through websites, applications, e-commerce solutions and technology-led business enablement.'],
      ['mobile-app-development', 'Mobile App Development', 'Mobile application support helps businesses create accessible digital experiences and new sales channels.'],
      ['digital-marketing', 'Digital Marketing', 'Full-service digital growth support includes social media promotion, branding, promotional campaigns and marketplace visibility.'],
      ['it-solutions', 'IT Solutions', 'Practical technology solutions help businesses improve their digital presence, operations and customer reach.'],
      ['saas-solution', 'SaaS Solution', 'Scalable software solutions are planned to help growing businesses manage workflows, collaboration and performance.'],
    ],
  },
  {
    title: 'Events & Community',
    eyebrow: 'Learn & grow together',
    items: [
      ['monthly-meetings', 'Monthly Meetings', 'Regular networking meetings create space for referrals, learning, accountability and trusted business relationships.'],
      ['business-expo', 'Business Expo', 'Business expos and trade events give members opportunities to showcase, connect and discover new markets.'],
      ['social-events', 'Social Events', 'Community and cultural events strengthen relationships beyond formal business meetings.'],
      ['district-community', 'District Community', 'The district model supports five chapters per district, with approximately 45–70 members in each chapter.'],
      ['tamil-nadu-community', 'Tamil Nadu Community', 'A growing regional community connecting verified entrepreneurs and business leaders across Tamil Nadu districts.'],
      ['global-community', 'Global Community', 'The future roadmap includes international business communities, global visits and smart digital networking.'],
    ],
  },
  {
    title: 'Franchise',
    eyebrow: 'Lead regional expansion',
    items: [
      ['available-locations', 'Available Locations', 'District-wise expansion is planned across India, with regional opportunities organized around scalable local chapters.'],
      ['apply-franchise', 'Apply Franchise', 'The district franchise model is ₹21.30 lakhs, royalty-free, with a one-year agreement and 35% franchise commission.'],
      ['franchise-partners', 'Franchise Partners', 'Partners receive district control, chapter expansion opportunities, website access, regional leadership and recurring member-revenue potential.'],
    ],
  },
  {
    title: 'Leaders & Achievements',
    eyebrow: 'Recognize excellence',
    items: [
      ['network-leaders', 'Leaders', 'A structured multi-tier leadership ecosystem supports accountability, chapter growth, learning and community direction.'],
      ['network-coordinators', 'Coordinators', 'Community coordinators help organize meetings, member communication and local business activities.'],
      ['business-runner', 'Business Runner', 'A recognition pathway for members who demonstrate consistent participation, collaboration and business momentum.'],
      ['goal-achiever', 'Goal Achiever', 'A milestone-based recognition for members who make measurable progress toward referral, leadership and growth goals.'],
      ['member-achievements', 'Member Achievements', 'Programs include the Mr. 360° Lead Champion Award, Connect Excellence Awards, leadership recognition and Business Achievement Awards.'],
    ],
  },
  {
    title: 'Help Center',
    eyebrow: 'Support when needed',
    items: [
      ['ai-assistant', 'AI Assistant', 'A planned digital assistant to help members find platform information, services and common support answers.'],
      ['contact-support', 'Contact Support', 'Contact the GLOARO team at info@gloaro.com or +91 72002 38737 for membership and platform assistance.'],
      ['social-media-links', 'Social Media Links', 'Follow GLOARO social channels for business updates, event announcements, member stories and community news.'],
    ],
  },
]

// Removed fallbackLeaders
// Shared scroll-reveal styling primitive. Keeps every section's entrance
// consistent (fade + rise) without repeating IntersectionObserver wiring.
function useInViewOnce(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(() => typeof window === 'undefined' || !('IntersectionObserver' in window))
  useEffect(() => {
    if (inView) return undefined
    const el = ref.current
    if (!el) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.disconnect()
      }
    }, { threshold })
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, inView])
  return [ref, inView]
}

function Reveal({ children, className = '', delay = 0, direction = 'up' }) {
  const [ref, inView] = useInViewOnce()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}

// Animates a hero stat ("10,000+") from 0 once it scrolls into view.
function CountUpStat({ value }) {
  const match = /^([\d,]+)(.*)$/.exec(value)
  const numeric = match ? parseInt(match[1].replace(/,/g, ''), 10) : null
  const suffix = match ? match[2] : ''
  const [ref, inView] = useInViewOnce(0.4)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView || numeric === null) return undefined
    const duration = 1400
    const stepTime = 16
    const totalSteps = Math.max(1, Math.round(duration / stepTime))
    let step = 0
    const timer = window.setInterval(() => {
      step += 1
      const next = Math.min(Math.round((numeric / totalSteps) * step), numeric)
      setDisplay(next)
      if (next >= numeric) window.clearInterval(timer)
    }, stepTime)
    return () => window.clearInterval(timer)
  }, [inView, numeric])

  return (
    <p ref={ref} className="font-dm-serif text-3xl sm:text-4xl">
      {numeric === null ? value : `${display.toLocaleString('en-IN')}${suffix}`}
    </p>
  )
}

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [leaderCardsPerView, setLeaderCardsPerView] = useState(getLeaderCardsPerView)
  const [featuredBusinessesPaused, setFeaturedBusinessesPaused] = useState(false)
  const [leadersPaused, setLeadersPaused] = useState(false)
  const [storiesPaused, setStoriesPaused] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState('')
  const [publicSuccessStories, setPublicSuccessStories] = useState([])
  const [publicFaqs, setPublicFaqs] = useState([])
  const [publicLeaders, setPublicLeaders] = useState(null)
  const [galleryItems, setGalleryItems] = useState([])
  const [galleryPaused, setGalleryPaused] = useState(false)
  // Fetch leaders dynamically from backend API
  const visibleLeaders = publicLeaders || []
  const featuredBusinessesRef = useRef(null)
  const leadersRef = useRef(null)
  const successStoriesRef = useRef(null)
  const galleryRef = useRef(null)

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
    api.get('/gallery', { silent: true }).then((response) => {
      if (active) setGalleryItems(Array.isArray(response.data?.data) ? response.data.data : [])
    }).catch(() => {
      if (active) setGalleryItems([])
    })
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true
    api.get('/leaders', { silent: true }).then((response) => {
      if (active) setPublicLeaders(Array.isArray(response.data?.data) ? response.data.data : [])
    }).catch(() => {
      if (active) setPublicLeaders(null)
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
      if (targetId === 'top') {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        return
      }
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
    if (!carousel || visibleLeaders.length <= getLeaderCardsPerView()) return

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
  }, [visibleLeaders.length])
  const scrollSuccessStories = useCallback((direction) => {
    const carousel = successStoriesRef.current
    if (!carousel) return

    const card = carousel.querySelector('[data-success-story-card]')
    const gap = window.innerWidth >= 1024 ? 32 : 20
    const scrollAmount = card ? card.getBoundingClientRect().width + gap : 300
    carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' })
  }, [])
  const scrollGallery = useCallback((direction) => {
    const carousel = galleryRef.current
    if (!carousel || galleryItems.length <= 3) return
    const card = carousel.querySelector('[data-gallery-card]')
    const gap = Number.parseFloat(window.getComputedStyle(carousel).columnGap) || 20
    const scrollAmount = card ? card.getBoundingClientRect().width + gap : 320
    const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - scrollAmount / 2
    if (direction > 0 && atEnd) carousel.scrollTo({ left: 0, behavior: 'smooth' })
    else carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' })
  }, [galleryItems.length])
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
  useEffect(() => {
    if (leadersPaused || visibleLeaders.length <= leaderCardsPerView) return undefined
    const leadersSlider = window.setInterval(() => scrollLeaders(1), 4500)
    return () => window.clearInterval(leadersSlider)
  }, [leadersPaused, leaderCardsPerView, scrollLeaders, visibleLeaders.length])
  useEffect(() => {
    if (storiesPaused || publicSuccessStories.length < 2) return undefined
    const storiesSlider = window.setInterval(() => scrollSuccessStories(1), 5500)
    return () => window.clearInterval(storiesSlider)
  }, [storiesPaused, publicSuccessStories.length, scrollSuccessStories])
  useEffect(() => {
    if (galleryPaused || galleryItems.length <= 3) return undefined
    const timer = window.setInterval(() => scrollGallery(1), 4000)
    return () => window.clearInterval(timer)
  }, [galleryPaused, galleryItems.length, scrollGallery])

  const canScrollLeaders = visibleLeaders.length > leaderCardsPerView
  const showExecutiveVision = visibleLeaders.length < 3

  return <main id="top">
    {/* Global motion + premium type primitives shared across every section below */}
    <style>{`
      @keyframes gl-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      .gl-marquee { animation: gl-marquee 32s linear infinite; }
      .gl-marquee:hover { animation-play-state: paused; }
      @keyframes gl-float-a { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(12px, -20px); } }
      @keyframes gl-float-b { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-14px, 18px); } }
      .gl-float-a { animation: gl-float-a 9s ease-in-out infinite; }
      .gl-float-b { animation: gl-float-b 11s ease-in-out infinite; }
      @keyframes gl-shimmer { 0% { transform: translateX(-130%) skewX(-12deg); } 100% { transform: translateX(230%) skewX(-12deg); } }
      .gl-shimmer { position: relative; overflow: hidden; }
      .gl-shimmer::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent); transform: translateX(-130%) skewX(-12deg); animation: gl-shimmer 3.4s ease-in-out infinite; }
      @keyframes gl-gradient-pan { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
      .gl-gold-text { background: linear-gradient(90deg, #ffe3a3, #ffae13, #ffd98a, #ffae13); background-size: 250% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: gl-gradient-pan 6s ease-in-out infinite; }
      @keyframes gl-fade-up { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
      .gl-fade-up { animation: gl-fade-up .9s cubic-bezier(.16,1,.3,1) both; }
      @keyframes gl-pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(255,174,19,.45); } 70% { box-shadow: 0 0 0 14px rgba(255,174,19,0); } 100% { box-shadow: 0 0 0 0 rgba(255,174,19,0); } }
      .gl-pulse-ring { animation: gl-pulse-ring 2.6s ease-out infinite; }
      @media (prefers-reduced-motion: reduce) {
        .gl-float-a, .gl-float-b, .gl-shimmer::after, .gl-gold-text, .gl-fade-up, .gl-pulse-ring { animation: none !important; }
      }
    `}</style>

    {/* 1. Hero Banner */}
    <section className="relative isolate overflow-visible bg-[#fdf9e9] pb-24 sm:pb-28">
      <div className="relative min-h-[530px] overflow-hidden rounded-b-[28px] bg-[#061633] sm:min-h-[610px]">
        {heroSlides.map((slide, index) => <img key={slide} src={slide} alt="Gloaro business network" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`} />)}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,18,50,.78),rgba(3,19,52,.5),rgba(2,12,35,.8))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(31,102,210,.28),transparent_45%)]" />
        <div aria-hidden="true" className="gl-float-a pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-[#ffae13]/20 blur-3xl" />
        <div aria-hidden="true" className="gl-float-b pointer-events-none absolute right-0 bottom-6 h-64 w-64 rounded-full bg-[#1f66d2]/25 blur-3xl" />
        <div className="relative mx-auto flex min-h-[530px] max-w-7xl flex-col items-center px-4 pb-32 pt-9 text-center sm:min-h-[610px] sm:px-6 sm:pt-10 lg:px-8">
          <div className="gl-fade-up gl-pulse-ring flex max-w-full items-center gap-2 rounded-2xl border border-white/15 bg-slate-400/40 px-3 py-2 shadow-xl backdrop-blur sm:px-7 sm:py-3"><img src={heroNetworkIcon} alt="Gloaro network" className="h-6 w-6 object-contain sm:h-8 sm:w-8" /><span className="text-sm font-semibold tracking-tight text-white sm:text-2xl">GLOARO BUSINESS NETWORK</span></div>
          <div className="mt-4 flex w-full max-w-5xl flex-col items-center sm:mt-5">
            <h2 className="gl-fade-up max-w-full font-urbanist text-2xl font-extrabold uppercase leading-tight tracking-[0.06em] text-white sm:text-3xl md:text-4xl lg:text-5xl" style={{ animationDelay: '120ms' }}>GLOARO BUSINESS NETWORK</h2>
            <p className="gl-fade-up mt-1 font-playfair text-xl font-bold italic leading-tight text-[#f6a600] sm:text-2xl md:text-3xl lg:text-4xl" style={{ animationDelay: '220ms' }}>Innoviate digital future</p>
            <p className="gl-fade-up mt-3 max-w-full rounded-full border border-[#ffae13]/45 bg-[#061633]/45 px-4 py-2 font-urbanist text-[11px] font-bold uppercase leading-5 tracking-[0.08em] text-white shadow-lg shadow-black/20 backdrop-blur sm:px-5 sm:text-sm sm:tracking-[0.14em]" style={{ animationDelay: '320ms' }}>One echo system multiple business solution</p>
          </div>
          <h1 className="mt-5 max-w-5xl font-playfair text-3xl font-medium italic leading-[1.02] tracking-tight text-white sm:mt-6 sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="gl-fade-up block" style={{ animationDelay: '420ms' }}>We Give. <span className="gl-gold-text">We Grow.</span></span>
            <span className="gl-fade-up mt-2 block sm:mt-3" style={{ animationDelay: '540ms' }}><span className="text-[#ff9515]">We</span> Win Together.</span>
          </h1>
          <p className="gl-fade-up mt-5 max-w-4xl font-urbanist text-sm font-medium leading-6 tracking-[0.03em] text-white sm:text-base md:text-lg md:leading-7 md:tracking-[0.05em]" style={{ animationDelay: '660ms' }}>A trusted network of professionals and entrepreneurs building relationships, creating opportunities,<br className="hidden md:block" /> and shaping future success together.</p>
          <div className="gl-fade-up mt-5 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap" style={{ animationDelay: '780ms' }}>
            <a href="/register?type=membership" className="gl-shimmer w-full rounded-lg bg-[#10499b] px-6 py-3 text-base font-bold text-white shadow-lg shadow-black/30 transition duration-300 hover:-translate-y-0.5 hover:bg-[#12579c] hover:shadow-xl sm:w-auto sm:text-lg">Become a Member&nbsp; ↗</a>
            <a href="#why-gloaro" className="w-full rounded-lg border border-white/15 bg-slate-700/70 px-6 py-3 text-base font-bold text-white shadow-lg shadow-black/30 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-slate-700 sm:w-auto sm:text-lg">Explore Network&nbsp; ↗</a>
          </div>
          <p className="gl-fade-up mt-5 font-serif text-xl font-bold text-[#f6a600] sm:text-2xl" style={{ animationDelay: '900ms' }}>Connect. Collaborate. Grow Globally</p>
          <div className="mt-5 flex gap-2">{heroSlides.map((_, index) => <button key={index} onClick={() => setActiveSlide(index)} aria-label={`Show slide ${index + 1}`} className={`h-1.5 rounded-full transition-all duration-500 ${index === activeSlide ? 'w-7 bg-[#ffad16]' : 'w-1.5 bg-white/50'}`} />)}</div>
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 z-10 grid w-[calc(100%-2.5rem)] max-w-5xl -translate-x-1/2 grid-cols-2 overflow-hidden rounded-3xl border border-white/70 bg-[#0d4697] text-center text-white shadow-xl shadow-slate-800/25 lg:grid-cols-4">
        {[['10,000+', 'Active Members'], ['5,000+', 'Businesses'], ['25+', 'Cities'], ['1,000+', 'Successful Connects']].map(([value, label], index) => <div key={label} className={`px-3 py-5 transition-colors duration-300 hover:bg-white/10 sm:px-4 sm:py-7 ${index === 1 ? 'border-l border-white/35' : ''} ${index === 2 ? 'border-t border-white/35 lg:border-l lg:border-t-0' : ''} ${index === 3 ? 'border-l border-t border-white/35 lg:border-t-0' : ''}`}><CountUpStat value={value} /><p className="mt-1 font-playfair text-base italic sm:text-2xl">{label}</p></div>)}
      </div>
    </section>

    {/* Services marquee ticker — puts the full breadth of the network to work as a signature strip */}
    <div className="border-y border-[#0d4697]/10 bg-white">
      <div className="relative h-12 overflow-hidden sm:h-14">
        <div className="gl-marquee absolute left-0 top-1/2 flex w-max -translate-y-1/2 gap-8 whitespace-nowrap px-4 sm:gap-10 sm:px-6 lg:gap-12">
          {[...serviceItems, ...serviceItems].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-2 font-urbanist text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#0d4697]/70 sm:gap-3 sm:text-xs sm:tracking-[0.22em] lg:text-sm lg:tracking-[0.24em]">
              {item}<span className="text-[#ffae13]">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* 2. Why Gloaro */}
    <section id="why-gloaro" className="relative isolate overflow-hidden bg-[#fdf9e9] py-14 sm:py-18 lg:py-24">
      <div aria-hidden="true" className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-[#0d4697]/8 blur-3xl" />
      <div aria-hidden="true" className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-[#ffae13]/12 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(13,70,151,0.07),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,174,19,0.12),transparent_28%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 sm:gap-10 lg:grid-cols-[minmax(0,430px)_minmax(0,1fr)] lg:gap-14 lg:px-8">
        <Reveal direction="left">
          <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-white p-4 shadow-[0_24px_70px_rgba(13,70,151,0.12)]">
            <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-[#0d4697] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white shadow-lg shadow-blue-950/20">
              <BadgeCheck className="h-3.5 w-3.5" />
              Verified Ecosystem
            </div>
            <img className="h-auto w-full rounded-[26px] object-cover transition duration-700 hover:scale-[1.02]" src={businessImage} alt="Business professionals collaborating" />
            <div className="absolute inset-x-4 bottom-4 rounded-[24px] border border-white/60 bg-white/92 p-4 shadow-[0_18px_45px_rgba(13,70,151,0.16)] backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#0d4697]/70">Community-led growth</p>
                  <p className="mt-1 text-base font-bold text-[#0d4697]">Built for trust, referrals, and momentum.</p>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[#fff3d0] text-[#ff9515] shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal direction="right" delay={120} className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0d4697]/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#0d4697] shadow-sm">
            <ShieldCheck className="h-4 w-4 text-[#ffae13]" />
            Why Gloaro
          </div>
          <h2 className="mt-5 font-playfair text-4xl font-semibold italic leading-[0.94] text-[#0d4697] sm:text-5xl lg:text-[58px]">
            A premium business ecosystem <span className="text-[#ff9515]">designed to compound growth</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[720px] text-left font-urbanist text-base font-medium leading-relaxed text-[#151515] sm:text-lg lg:mx-0">
            GLOARO is more than just a business network; it is a powerful growth ecosystem designed to connect entrepreneurs, investors, and innovators. It creates a platform where businesses can discover new opportunities, build meaningful partnerships, and unlock their full potential. By bringing the right people together, GLOARO helps transform ideas into impactful ventures and supports the journey toward sustainable success.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {[
              ['Verified members', 'Trust-first networking'],
              ['Qualified referrals', 'Connections that convert'],
              ['Digital support', 'Growth beyond meetings'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-[#0d4697]/10 bg-white/90 p-4 text-left shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(13,70,151,0.12)]">
                <p className="text-sm font-extrabold text-[#0d4697]">{title}</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-[#5e6572]">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
            <a href="/register" className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#0d4697,#1b6fe0)] px-6 py-3 font-urbanist text-base font-bold text-white shadow-[0_14px_32px_rgba(13,70,151,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(13,70,151,0.28)]">
              Explore Network
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#join" className="inline-flex items-center gap-2 rounded-full border border-[#0d4697]/12 bg-white px-6 py-3 font-urbanist text-base font-bold text-[#0d4697] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#fff8e7]">
              Read FAQ
            </a>
          </div>
        </Reveal>
      </div>
    </section>

    {/* Gloaro Gallery — managed by Superadmin */}
    {galleryItems.length > 0 && <section id="gallery" className="relative isolate overflow-hidden bg-white px-5 py-14 sm:py-16 lg:px-8 lg:py-20">
      <div aria-hidden="true" className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-[#0d4697]/8 blur-3xl" />
      <div aria-hidden="true" className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-[#ffae13]/12 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0d4697]/10 bg-[#fdf9e9] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#0d4697] shadow-sm"><Sparkles className="h-4 w-4 text-[#ffae13]" />Gloaro Gallery</div>
          <h2 className="mt-4 font-playfair text-4xl font-semibold italic text-[#0d4697] sm:text-5xl">Moments that <span className="gl-gold-text">move us forward</span></h2>
        </Reveal>
        <div onMouseEnter={() => setGalleryPaused(true)} onMouseLeave={() => setGalleryPaused(false)} onTouchStart={() => setGalleryPaused(true)} onTouchEnd={() => setGalleryPaused(false)} className="relative mt-8">
          <div ref={galleryRef} className="flex snap-x gap-5 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {galleryItems.map((item) => <figure key={item._id} data-gallery-card className="group relative h-64 w-full shrink-0 snap-start overflow-hidden rounded-[28px] bg-slate-100 shadow-[0_16px_36px_rgba(15,23,42,0.12)] sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"><img src={item.image?.url} alt={item.title || 'Gloaro gallery image'} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />{item.title && <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgba(2,15,36,.82))] px-5 pb-4 pt-12 font-urbanist text-base font-bold text-white">{item.title}</figcaption>}</figure>)}
          </div>
          {galleryItems.length > 3 && <div className="mt-4 flex justify-center gap-2">{galleryItems.map((item, index) => <button key={item._id} type="button" aria-label={`Show gallery image ${index + 1}`} onClick={() => { const card = galleryRef.current?.querySelectorAll('[data-gallery-card]')[index]; card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' }) }} className="h-2 w-2 rounded-full bg-[#0d4697]/35 transition hover:bg-[#ffae13]" />)}</div>}
        </div>
      </div>
    </section>}

    {/* 3. Business Categories */}
    <BusinessCategories />
   

    {/* 4. Features */}
    <section id="features" className="border-t-4 border-[#0d4697] bg-[#fdf9e9] py-12 sm:py-16 lg:py-18"><div className="mx-auto grid max-w-5xl items-center gap-10 px-5 lg:grid-cols-[1.15fr_.85fr] lg:gap-16 lg:px-8"><div><Reveal><h2 className="font-playfair text-4xl font-semibold leading-tight sm:text-5xl"><span className="italic text-[#ffae13]">Features</span> of <span className="italic text-[#0d4697]">Gloaro</span> <span className="font-play not-italic text-[#0d4697]">360</span></h2></Reveal><div className="mt-4 space-y-5 font-urbanist">{whyGloaroPoints.map((point, index) => <Reveal key={point.title} delay={index * 120} direction="left" className="border-l-2 border-[#ffae13]/40 pl-4"><h3 className="text-xl font-bold text-[#0d4697]">{index + 1}. {point.title}</h3><p className="mt-1 text-base font-semibold leading-[1.28] text-[#161616]">{point.description}</p></Reveal>)}</div></div><Reveal direction="right" delay={150}><img src={whyImage} alt="Business team in a strategy meeting" className="h-72 w-full rounded-[28px] object-cover shadow-md transition duration-500 hover:shadow-2xl sm:h-96 lg:h-[330px]" /></Reveal></div></section>

    {/* 5. Gloaro 360 Ecosystem */}
    <section id="marketplace" className="bg-white px-5 py-10 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-center">
          <h2 className="font-playfair text-4xl font-semibold italic leading-tight text-[#0d4697] sm:text-5xl"><span>Explore </span><span className="gl-gold-text">Gloaro</span> <span className="font-play not-italic text-[#ffae13]">360</span> Ecosystem</h2>
          <p className="mt-2 font-urbanist text-lg font-semibold text-[#1f2937]">We Give. We Grow. We Win Together.</p>
          <p className="mt-7 font-urbanist text-base font-semibold text-[#4b5563] sm:text-lg">Everything you need to grow your business</p>
        </Reveal>
        <div className="mx-auto mt-5 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {ecosystemActions.map(({ Icon, title, description, action, href, color, bg }, index) => (
            <Reveal key={title} delay={index * 90}>
              <a href={href} className="group flex min-h-[190px] flex-col items-center rounded-lg border border-[#e6ebf2] bg-white px-4 py-5 text-center shadow-[0_8px_24px_rgba(15,23,42,.06)] transition duration-300 hover:-translate-y-1.5 hover:border-[#ffae13]/50 hover:shadow-[0_18px_36px_rgba(15,23,42,.14)]">
                <span className="relative grid h-12 w-12 place-items-center rounded-full transition duration-300 group-hover:scale-110" style={{ backgroundColor: bg }}>
                  <Icon className={`h-10 w-10 ${color}`} strokeWidth={2.4} />
                </span>
                <h3 className="mt-3 font-urbanist text-base font-extrabold text-[#111827]">{title}</h3>
                <p className="mt-2 min-h-[58px] max-w-[145px] font-urbanist text-xs font-semibold leading-5 text-[#4b5563]">{description}</p>
                <span className="mt-2 inline-flex items-center gap-2 font-urbanist text-xs font-extrabold text-[#1366d6]">{action} <span className="transition group-hover:translate-x-1">→</span></span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section id="network-details" className="relative isolate overflow-hidden border-y border-slate-200 bg-[linear-gradient(180deg,#fbfdff,#ffffff)] px-5 py-16 sm:py-18 lg:px-8 lg:py-24">
      <div aria-hidden="true" className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#0d4697]/8 blur-3xl" />
      <div aria-hidden="true" className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#ffae13]/12 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(13,70,151,0.06),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,174,19,0.10),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0d4697]/10 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#0d4697] shadow-sm">
            One platform. Complete ecosystem.
          </div>
          <h2 className="mt-5 font-playfair text-5xl font-semibold italic leading-[0.92] text-[#0d4697] sm:text-6xl lg:text-[68px]">
            Inside the <span className="gl-gold-text">GLOARO</span> Network
          </h2>
          <p className="mx-auto mt-5 max-w-3xl font-urbanist text-base font-medium leading-7 text-slate-600 sm:text-lg">
            A connected ecosystem where membership, trusted referrals, digital solutions, community, and leadership work together to create lasting business growth.
          </p>
        </Reveal>

        <Reveal className="grid gap-8 lg:items-end">
          {/* <div className="rounded-[34px] border border-[#0d4697]/10 bg-[linear-gradient(180deg,rgba(13,70,151,0.98),rgba(8,26,67,0.98))] p-7 text-white shadow-[0_24px_70px_rgba(13,70,151,0.18)] sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ffd36e]">Network overview</p>
            <h3 className="mt-3 font-playfair text-4xl font-semibold italic leading-[0.92] sm:text-5xl">
              Built to connect, <span className="text-[#ffae13]">grow</span>, and scale.
            </h3>
            <p className="mt-5 max-w-xl font-urbanist text-base font-medium leading-7 text-white/78 sm:text-lg">
              Every layer is designed to make discovery easier, relationships stronger, and growth more sustainable.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                ['Membership', 'Verified access and benefits'],
                ['Connects', 'Trusted opportunities that convert'],
                ['Leadership', 'Structure that drives momentum'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/8 p-4">
                  <p className="text-sm font-extrabold text-white">{title}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-white/70">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href="/register" className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ffae13,#ffd36e)] px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#081a43] shadow-[0_14px_30px_rgba(255,174,19,0.20)] transition duration-300 hover:-translate-y-0.5">
                Join Gloaro Network
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#membership" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10">
                View Benefits
              </a>
            </div>
          </div> */}

          <div className="rounded-[34px] border border-white/70 bg-white/90 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-5">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {networkDetailGroups.map((group, groupIndex) => (
                <Reveal key={group.title} delay={(groupIndex % 3) * 90} className="h-full">
                  <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] shadow-[0_12px_35px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:border-[#0d4697]/20 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                    <header className="relative overflow-hidden border-b border-slate-200/80 px-5 py-5">
                      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#0d4697,#ffae13,#0d4697)] bg-[length:200%_100%] opacity-80" />
                      <div className="inline-flex items-center gap-2 rounded-full bg-[#0d4697] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white shadow-sm">
                        {String(groupIndex + 1).padStart(2, '0')}
                      </div>
                      <p className="mt-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#ff9500]">{group.eyebrow}</p>
                      <h3 className="mt-2 font-playfair text-2xl font-semibold italic leading-tight text-[#0d4697]">
                        {group.title}
                      </h3>
                      <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
                        {group.items.length} core touchpoints in this part of the ecosystem.
                      </p>
                    </header>

                    <div className="flex-1 px-5 py-2">
                      <div className="space-y-3">
                        {group.items.map(([id, title, description], itemIndex) => (
                          <div id={id} key={id} className="scroll-mt-48 rounded-2xl border border-slate-100 bg-white px-4 py-4 transition duration-300 hover:border-[#0d4697]/15 hover:shadow-[0_10px_24px_rgba(13,70,151,0.08)] lg:scroll-mt-44">
                            <div className="flex items-start gap-3">
                              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#fff3d0] text-xs font-black text-[#0d4697]">
                                {String(itemIndex + 1).padStart(2, '0')}
                              </span>
                              <div className="min-w-0">
                                <h4 className="font-urbanist text-sm font-extrabold text-slate-950">{title}</h4>
                                <p className="mt-1.5 font-urbanist text-sm font-semibold leading-6 text-slate-700">{description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-10 flex flex-col items-center justify-between gap-5 rounded-[30px] border border-[#0d4697]/10 bg-[linear-gradient(135deg,#fff8e7,#ffffff)] px-6 py-7 text-center shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:flex-row sm:px-8 sm:text-left">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ff9500]">Ready to grow together?</p>
            <h3 className="mt-2 font-playfair text-2xl font-bold text-[#0b469e]">Join a verified ecosystem where relationships create opportunities.</h3>
          </div>
          <a href="/register" className="shrink-0 rounded-full bg-[linear-gradient(135deg,#0d4697,#1b6fe0)] px-7 py-3 font-urbanist text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(13,70,151,0.20)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(13,70,151,0.26)]">
            Join Gloaro Network
          </a>
        </Reveal>
      </div>
    </section>

    {/* 6. Member Benefits */}
    <section id="membership" className="relative isolate overflow-hidden border-t-2 border-[#0d4697] bg-[#fdf9e9] px-5 py-14 sm:py-16 lg:px-8 lg:py-20">
      <div aria-hidden="true" className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-[#0d4697]/8 blur-3xl" />
      <div aria-hidden="true" className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-[#ffae13]/12 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(13,70,151,0.06),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,174,19,0.10),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="font-inter text-sm font-black uppercase tracking-[0.24em] text-[#0d4697] sm:text-base">GLOARO 360 Member Benefits</p>
          <h2 className="mt-4 font-playfair text-4xl font-semibold italic leading-[0.92] text-[#0d4697] sm:text-5xl lg:text-[58px]">
            Everything you need to <span className="gl-gold-text">grow your business</span>
          </h2>
          <p className="mx-auto mt-5 max-w-3xl font-urbanist text-sm font-medium leading-7 text-[#161616] sm:text-base">
            Our membership opens the door to powerful connections, global exposure, and the tools you need to build, scale, and succeed.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{memberBenefits.map(([title, image], index) => <Reveal key={title} delay={(index % 3) * 90}><div className="group relative h-48 overflow-hidden rounded-[26px] bg-slate-700 shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.16)] sm:h-52"><img src={image} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" /><div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" /><div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-2xl border border-white/35 bg-slate-100/10 px-4 py-2.5 text-white backdrop-blur-sm transition duration-300 group-hover:border-[#ffae13]/70"><span className="max-w-[210px] font-urbanist text-base font-semibold leading-5">{title}</span><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-xl leading-none text-[#0d4697] transition duration-300 group-hover:bg-[#ffae13] group-hover:text-white">›</span></div></div></Reveal>)}</div>
      </div>
    </section>

    {/* 7. Premium Membership */}
    <section id="premium" className="bg-[#104694] px-5 py-10 text-white sm:py-14 lg:px-8"><div className="mx-auto max-w-7xl"><Reveal className="text-center"><h2 className="font-playfair text-3xl font-semibold italic sm:text-4xl"><span>Premium </span><span className="gl-gold-text">Membership Benefits</span></h2></Reveal><div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{premiumBenefits.map(([icon, title, description], index) => <Reveal key={`${title}-${description}`} delay={(index % 3) * 100}><article className="flex min-h-[88px] gap-3 rounded-lg border border-white/25 bg-white/10 p-4 text-left shadow-[inset_0_1px_10px_rgba(255,255,255,.06)] transition duration-300 hover:-translate-y-1 hover:border-[#ffae13] hover:bg-white/20 hover:ring-2 hover:ring-[#ffae13]"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white p-1 text-[#104694]"><img src={icon} alt="" className="h-full w-full object-contain" /></span><span><span className="block font-playfair text-sm font-semibold">{title}</span><span className="mt-1 block font-urbanist text-[11px] leading-3.5 text-slate-100">{description}</span></span></article></Reveal>)}</div></div></section>

    {/* 9. Featured Businesses */}
    <section id="directory" onMouseEnter={() => setFeaturedBusinessesPaused(true)} onMouseLeave={() => setFeaturedBusinessesPaused(false)} onTouchStart={() => setFeaturedBusinessesPaused(true)} onTouchEnd={() => setFeaturedBusinessesPaused(false)} className="hidden border-b-4 border-[#163960] bg-[#fdf9e9] px-5 py-12 sm:py-16 lg:px-8"><div className="mx-auto max-w-7xl"><div><h2 className="font-playfair text-4xl font-semibold italic leading-none text-[#0d4697] sm:text-5xl"><span>Featured </span><span className="text-[#ffae13]">Businesses</span></h2></div><div className="relative mt-8"><button type="button" onClick={() => scrollFeaturedBusinesses(-1)} aria-label="Previous featured businesses" className="absolute -left-4 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-xl font-bold text-[#1c2433] shadow-md lg:-left-7">‹</button><div ref={featuredBusinessesRef} className="flex snap-x gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] lg:gap-6 [&::-webkit-scrollbar]:hidden">{businesses.map(([name, type, image, icon, iconColor]) => <article key={name} data-featured-business-card className="w-[min(230px,78vw)] shrink-0 snap-start overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-6rem)/5)]"><div className="relative h-[110px] overflow-hidden"><img src={image} className="h-full w-full object-cover" alt={`${name} business`} /><div className="absolute -bottom-8 left-1/2 grid h-16 w-16 -translate-x-1/2 place-items-center rounded-full border border-slate-100 bg-white shadow-lg"><span className={`font-play text-3xl font-bold ${iconColor}`}>{icon}</span></div></div><div className="px-4 pb-5 pt-9 text-center"><h3 className="font-urbanist text-base font-extrabold leading-tight text-[#1f2937]">{name}</h3><p className="mt-0.5 font-urbanist text-xs font-semibold text-[#151515]">{type}</p><p className="mt-1 text-sm leading-none text-[#ffc400]">★★★★★</p><button type="button" className="mt-5 block w-full rounded bg-[#0d4697] px-4 py-2.5 font-urbanist text-xs font-extrabold text-white">Connect Now</button></div></article>)}</div><button type="button" onClick={() => scrollFeaturedBusinesses(1)} aria-label="Next featured businesses" className="absolute -right-4 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-xl font-bold text-[#1c2433] shadow-md lg:-right-7">›</button></div></div></section>

    {/* 10. Our Leaders */}
    <section id="leaders" onMouseEnter={() => setLeadersPaused(true)} onMouseLeave={() => setLeadersPaused(false)} onTouchStart={() => setLeadersPaused(true)} onTouchEnd={() => setLeadersPaused(false)} className="relative isolate overflow-hidden border-b-4 border-[#163960] bg-[#fdf9e9] px-5 py-14 sm:py-16 lg:px-8 lg:py-20">
      <div aria-hidden="true" className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-[#0d4697]/8 blur-3xl" />
      <div aria-hidden="true" className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-[#ffae13]/12 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(13,70,151,0.06),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,174,19,0.10),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0d4697]/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#0d4697] shadow-sm">
              <ShieldCheck className="h-4 w-4 text-[#ffae13]" />
              Leadership
            </div>
            <h2 className="mt-4 font-playfair text-4xl font-semibold italic leading-[0.92] text-[#0d4697] sm:text-5xl lg:text-[58px]">
              Our <span className="gl-gold-text">Leaders</span>
            </h2>
            <p className="mt-3.5 max-w-2xl font-urbanist text-base font-semibold leading-7 text-[#26364d] sm:text-lg">
              Visionary leaders driving innovation and excellence across the network with a clear focus on trust, momentum, and sustainable growth.
            </p>
          </div>
        </Reveal>

        <div className={`mt-7 ${showExecutiveVision ? 'flex flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:justify-between' : ''}`}>
          
          {visibleLeaders.length === 0 ? (
            <div className="flex w-full flex-col items-center justify-center rounded-[30px] border border-white/20 bg-white/5 py-16 text-center shadow-lg">
              <UserRound className="mb-4 h-12 w-12 text-white/30" />
              <p className="font-urbanist text-lg font-semibold text-white/60">Leadership profiles will be updated shortly.</p>
            </div>
          ) : (
            <>
              <Reveal direction="left" delay={100} className={`relative w-full ${showExecutiveVision ? 'shrink-0 lg:w-auto' : ''}`}>
                {canScrollLeaders && <button type="button" onClick={() => scrollLeaders(-1)} aria-label="Previous leaders" className="absolute -left-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/95 text-2xl font-bold text-[#1c2433] shadow-[0_12px_30px_rgba(15,23,42,0.16)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:scale-110 lg:-left-7">‹</button>}
                <div ref={leadersRef} className="flex snap-x gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] lg:gap-6 [&::-webkit-scrollbar]:hidden">
                  {visibleLeaders.map((leader) => (
                    <article key={leader._id || leader.name} data-leader-card className="group relative w-full shrink-0 snap-start overflow-hidden rounded-[30px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,251,255,0.98))] shadow-[0_18px_50px_rgba(15,23,42,.10)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(13,70,151,.16)] sm:w-[320px] lg:w-[340px]">
                      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#0d4697,#ffae13,#0d4697)] bg-[length:200%_100%] opacity-70" />
                      <div className="relative h-[250px] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(13,70,151,0.18),transparent_60%),linear-gradient(180deg,#10223d,#1f4f8f)] sm:h-[270px] lg:h-[265px]">
                        <img src={leader.image?.url || leader.image} alt={leader.name} className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-110 group-hover:contrast-105" />
                        <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,rgba(5,15,36,0.95))]" />
                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                          <div className="max-w-[75%]">
                            <p className="text-[11px] font-black uppercase tracking-[0.22em] !text-[#ffd36e]">{leader.role}</p>
                            <h3 className="mt-1 font-playfair text-2xl font-semibold italic leading-tight !text-white drop-shadow">{leader.name}</h3>
                          </div>
                          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur">
                            <UserRound className="h-6 w-6" strokeWidth={1.8} />
                          </div>
                        </div>
                      </div>
                      <div className="p-5 sm:p-6">
                        <p className="font-urbanist text-sm font-semibold leading-6 text-[#1f2937]">{leader.bio}</p>
                      </div>
                    </article>
                  ))}
                </div>
                {canScrollLeaders && <button type="button" onClick={() => scrollLeaders(1)} aria-label="Next leaders" className="absolute -right-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/95 text-2xl font-bold text-[#1c2433] shadow-[0_12px_30px_rgba(15,23,42,0.16)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:scale-110 lg:-right-7">›</button>}
              </Reveal>
              
              {showExecutiveVision && visibleLeaders[0]?.visionTitle && (
                <Reveal direction="right" delay={200} className="w-full min-w-0 flex-1">
                  <div className="flex h-full flex-col justify-between rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(8,26,67,0.98),rgba(11,41,94,0.98))] p-6 text-white shadow-[0_24px_70px_rgba(2,8,23,0.24)] sm:p-8">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#ffd36e]"><ShieldCheck className="h-4 w-4" />Executive Vision</div>
                      <h3 className="mt-5 font-playfair text-3xl font-semibold italic leading-tight sm:text-4xl">{visibleLeaders[0].visionTitle} {visibleLeaders[0].visionHighlight && <span className="text-[#ffae13]">{visibleLeaders[0].visionHighlight}</span>}</h3>
                      {visibleLeaders[0].visionDescription && <p className="mt-4 font-urbanist text-base font-semibold leading-7 text-white/82 sm:text-lg">{visibleLeaders[0].visionDescription}</p>}
                    </div>
                    {visibleLeaders[0].visionPoints?.length > 0 && (
                      <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        {visibleLeaders[0].visionPoints.filter(p => p.title || p.description).map((point, index) => (
                          <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            {point.title && <p className="text-sm font-extrabold text-white">{point.title}</p>}
                            {point.description && <p className="mt-1 text-xs font-semibold leading-5 text-white/70">{point.description}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Reveal>
              )}
            </>
          )}
        </div>
      </div>
    </section>

    {/* 10. Awards */}
    <section className="relative isolate overflow-hidden bg-[#08213d] px-5 py-14 text-white sm:py-16 lg:px-8 lg:py-20">
      <div aria-hidden="true" className="absolute -left-20 top-6 h-56 w-56 rounded-full bg-[#ffae13]/10 blur-3xl" />
      <div aria-hidden="true" className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,174,19,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_28%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-[0.92fr_1.08fr] lg:gap-12">
        <Reveal direction="left">
          <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.06))] p-6 text-center shadow-[0_24px_70px_rgba(2,8,23,0.26)] backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:border-[#ffae13]/35 hover:bg-white/[0.14] sm:px-10 sm:py-9">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#ffae13]/35 bg-[#ffae13]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#ffd36e] shadow-sm">
              <BadgeCheck className="h-4 w-4" />
              Recognition Night
            </div>
            <h2 className="mt-5 font-playfair text-4xl font-bold leading-[0.92] sm:text-5xl lg:text-[62px]">
              Weekly Awards <span className="block text-[#ffae13]">Ceremony</span>
            </h2>
            <h3 className="mt-4 font-urbanist text-lg font-semibold text-white/85 sm:text-xl">
              Celebrating excellence, leadership, and consistent growth.
            </h3>
            <p className="mx-auto mt-5 max-w-[460px] font-urbanist text-base font-medium leading-7 text-white/82 sm:text-lg">
              Recognizing outstanding members, business leaders, and top performers for their contributions, growth, and achievements within the Gloaro Network community.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                ['Top Performers', 'Recognize the people creating momentum'],
                ['Business Growth', 'Celebrate measurable progress and impact'],
                ['Community Pride', 'Make achievement visible and inspiring'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/8 p-4 text-left shadow-[0_10px_24px_rgba(2,8,23,0.12)]">
                  <p className="text-sm font-extrabold text-white">{title}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-white/70">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a href="#testimonials" className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ffae13,#ffd36e)] px-6 py-3 font-urbanist text-base font-bold text-[#08213d] shadow-[0_14px_30px_rgba(255,174,19,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(255,174,19,0.28)]">
                View Success Stories
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#leaders" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-urbanist text-base font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10">
                Meet Leaders
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal direction="right" delay={150}>
          <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/5 p-4 shadow-[0_24px_70px_rgba(2,8,23,0.24)] backdrop-blur-sm sm:p-5">
            <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full bg-white/92 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#0d4697] shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#ffae13]" />
              Celebration Highlights
            </div>
            <img src={awardsHighlightImage} alt="Award trophy at a ceremony" className="h-[320px] w-full rounded-[28px] object-cover object-center shadow-[0_18px_50px_rgba(0,0,0,0.28)] transition duration-500 hover:scale-[1.01] hover:shadow-[0_24px_60px_rgba(0,0,0,0.36)] sm:h-[420px] lg:h-[460px]" />
            <div className="absolute inset-x-4 bottom-4 rounded-[24px] border border-white/10 bg-[#081a43]/88 p-4 shadow-[0_18px_40px_rgba(2,8,23,0.25)] backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ffd36e]">Monthly recognition</p>
                  <p className="mt-1 text-base font-bold text-white">A stage for members who lead, grow, and inspire.</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-white/85">
                  <ShieldCheck className="h-4 w-4 text-[#ffae13]" />
                  Premium Community Event
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    {/* 11. Meetings & Events */}
    <section id="events" className="relative isolate overflow-hidden scroll-mt-48 bg-[#fdf9e9] px-5 py-14 sm:py-16 lg:scroll-mt-52 lg:px-8 lg:py-20">
      <div aria-hidden="true" className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-[#0d4697]/8 blur-3xl" />
      <div aria-hidden="true" className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-[#ffae13]/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(13,70,151,0.06),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,174,19,0.10),transparent_28%)]" />

      <div className="relative mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0d4697]/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#0d4697] shadow-sm">
            <CalendarDays className="h-4 w-4 text-[#ffae13]" />
            Meetings & Events
          </div>
          <h2 className="mt-5 font-playfair text-4xl font-semibold italic leading-[0.92] text-[#0d4697] sm:text-5xl lg:text-[58px]">
            Meetings <span className="text-[#ffae13]">and Events</span>
          </h2>
          <p className="mt-4 font-urbanist text-base font-extrabold text-[#0d4697] sm:text-lg">
            Discover high-value conversations, recognition moments, and curated community gatherings.
          </p>
          <p className="mt-4 font-urbanist text-sm font-semibold leading-7 text-[#5e6572] sm:text-base">
            From roundtables to workshops, every event is designed to spark relationships, visibility, and real business momentum.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <Reveal direction="left">
            <div className="relative h-full overflow-hidden rounded-[34px] border border-[#0d4697]/10 bg-[linear-gradient(180deg,#0d4697,#081a43)] p-6 text-white shadow-[0_24px_70px_rgba(13,70,151,0.18)] sm:p-8">
              <div className="absolute -right-16 top-0 h-44 w-44 rounded-full bg-[#ffae13]/12 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,174,19,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_30%)]" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#ffd36e]">
                  <Ticket className="h-4 w-4" />
                  Event Experience
                </div>
                <h3 className="mt-5 font-playfair text-4xl font-bold leading-[0.95] sm:text-5xl">
                  Built for <span className="text-[#ffae13]">connection</span>, learning, and recognition.
                </h3>
                <p className="mt-5 max-w-[440px] font-urbanist text-base font-medium leading-7 text-white/82 sm:text-lg">
                  Every meeting is more than a calendar entry. It is a chance to build trust, spotlight opportunity, and strengthen the Gloaro community.
                </p>

                <div className="mt-7 grid gap-3">
                  {[
                    ['Leadership sessions', 'Strategic gatherings with real business value'],
                    ['Community meetups', 'Build relationships that drive referrals'],
                    ['Showcase moments', 'Celebrate progress and member achievement'],
                  ].map(([title, text]) => (
                    <div key={title} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                      <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-[#ffd36e]">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-white">{title}</p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-white/70">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {[
                    ['Monthly', 'Recurring signature moments'],
                    ['Verified', 'Trusted member-led events'],
                    ['Premium', 'Designed for impact'],
                  ].map(([value, label]) => (
                    <div key={value} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                      <p className="text-xl font-black text-white">{value}</p>
                      <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal direction="right" delay={100}>
            <div className="grid h-full gap-4 sm:grid-cols-2">
              {eventCards.map(([category, title, description, details, image], index) => {
                const featured = selectedEvent === title
                return (
                  <article
                    key={category}
                    onClick={() => setSelectedEvent(title)}
                    className={`group relative cursor-pointer overflow-hidden rounded-[28px] border bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.14)] ${
                      featured ? 'border-[#ffae13] ring-2 ring-[#ffae13]/40' : 'border-slate-200/80 hover:border-[#ffae13]/50'
                    }`}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img src={image} alt={`${title} event`} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,15,36,0.08),rgba(5,15,36,0.72))]" />
                      <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/92 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#0d4697] shadow-sm">
                        <Clock3 className="h-3.5 w-3.5 text-[#ffae13]" />
                        {category}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                        <div className="max-w-[72%]">
                          <p className="text-[11px] font-black uppercase tracking-[0.22em] !text-[#ffd36e]">Event 0{index + 1}</p>
                          <h3 className="mt-1 font-playfair text-2xl font-semibold italic leading-tight !text-white drop-shadow">{title}</h3>
                        </div>
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-white/15 text-white backdrop-blur">
                          <MapPin className="h-5 w-5" />
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="min-h-[78px] font-urbanist text-sm font-semibold leading-6 text-[#1f2937]">{description}</p>
                      <div className={`mt-4 rounded-2xl border px-4 py-3 font-urbanist text-xs font-bold transition ${
                        featured ? 'border-[#ffae13] bg-[#fff5d8] text-[#9a5800]' : 'border-[#dbe5f2] bg-[#f5f8fc] text-[#0d4697]'
                      }`}>
                        {details}
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                        <span className="inline-flex items-center gap-2 text-xs font-bold text-[#0d4697]">
                          <UsersRound className="h-4 w-4 text-[#ffae13]" />
                          Community event
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0d4697] transition duration-300 group-hover:translate-x-0.5">
                          Explore
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>

    {/* 12. Success Stories / Testimonials */}
    <section id="testimonials" onMouseEnter={() => setStoriesPaused(true)} onMouseLeave={() => setStoriesPaused(false)} onTouchStart={() => setStoriesPaused(true)} onTouchEnd={() => setStoriesPaused(false)} className="relative scroll-mt-48 overflow-hidden border-b-4 border-white bg-[radial-gradient(circle_at_top_left,#2563a9_0,#0d4697_38%,#082e70_100%)] px-5 py-12 text-white sm:py-16 lg:scroll-mt-52 lg:px-8">
      <div aria-hidden="true" className="gl-float-a absolute -left-24 top-16 h-64 w-64 rounded-full border border-white/10" />
      <div aria-hidden="true" className="gl-float-b absolute right-0 -top-24 h-72 w-72 rounded-full bg-[#ffae13]/10 blur-2xl" />
      <div className="relative mx-auto max-w-7xl">
        <Reveal className="text-center">
          <span className="mb-2 inline-flex rounded-full border border-[#ffae13]/50 bg-[#ffae13]/10 px-4 py-1.5 font-urbanist text-[11px] font-black uppercase tracking-[0.22em] text-[#ffd36e]">Real people. Real growth.</span>
          <h2 className="font-playfair text-4xl font-semibold italic leading-tight sm:text-5xl"><span>Success </span><span className="gl-gold-text">Stories</span></h2>
          <p className="mt-1 font-urbanist text-base font-semibold sm:text-lg">Hear from the businesses that scaled their operations through our professional ecosystem.</p>
        </Reveal>
        <div className="relative mt-8 lg:mt-10">
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-10 bg-gradient-to-r from-[#0d4697] to-transparent lg:w-16" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-[5] w-10 bg-gradient-to-l from-[#082e70] to-transparent lg:w-16" />
          <button type="button" onClick={() => scrollSuccessStories(-1)} aria-label="Previous success stories" className="absolute -left-1 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-xl font-bold text-white shadow-md backdrop-blur transition hover:scale-110 hover:bg-white/25 sm:-left-3 lg:-left-8">‹</button>
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
          <button type="button" onClick={() => scrollSuccessStories(1)} aria-label="Next success stories" className="absolute -right-1 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-xl font-bold text-white shadow-md backdrop-blur transition hover:scale-110 hover:bg-white/25 sm:-right-3 lg:-right-8">›</button>
        </div>
      </div>
    </section>

    {/* 13. FAQ */}
    <section id="join" className="relative overflow-hidden bg-[#fdf9e9] px-5 py-14 sm:py-18 lg:px-8 lg:py-24">
      <div aria-hidden="true" className="absolute -left-16 top-0 h-56 w-56 rounded-full bg-[#0d4697]/8 blur-3xl" />
      <div aria-hidden="true" className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-[#ffae13]/12 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(13,70,151,0.07),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,174,19,0.10),transparent_26%)]" />

      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10">
        <Reveal direction="left">
          <div className="rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,248,230,0.96))] p-6 shadow-[0_18px_55px_rgba(13,70,151,0.10)]">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#0d4697] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white shadow-lg shadow-blue-950/20">
              <BadgeCheck className="h-4 w-4 text-[#ffae13]" />
              FAQ
            </div>
            <h2 className="mt-5 font-playfair text-4xl font-bold italic leading-[0.92] text-[#0d4697] sm:text-5xl">
              Frequently <span className="text-[#ff9515]">Asked</span> questions
            </h2>
            <p className="mt-5 max-w-[320px] font-urbanist text-base font-semibold leading-7 text-[#151515]">
              Can&apos;t find the answer you&apos;re looking for? Our team is here to help you navigate the Gloaro ecosystem.
            </p>

            <div className="mt-6 grid gap-3">
              {[
                ['Fast responses', 'Support for membership, referrals, and access questions.'],
                ['Premium guidance', 'Clear information for new members and business owners.'],
                ['Always connected', 'We help you move from curiosity to action quickly.'],
              ].map(([title, text]) => (
                <div key={title} className="flex gap-3 rounded-2xl border border-[#0d4697]/10 bg-white px-4 py-3 shadow-sm">
                  <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#fff3d0] text-[#ff9515]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-[#0d4697]">{title}</p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-[#5e6572]">{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[28px] border border-[#0d4697]/10 bg-[#081a43] p-5 text-white shadow-[0_20px_50px_rgba(2,8,23,0.18)]">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffd36e]">Need direct help?</p>
              <div className="mt-4 space-y-3">
                <a href="mailto:info@gloaro.com" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition duration-300 hover:-translate-y-0.5 hover:bg-white/10">
                  <Mail className="h-4 w-4 text-[#ffae13]" />
                  <span className="text-sm font-semibold">info@gloaro.com</span>
                </a>
                <a href="tel:+917200238737" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition duration-300 hover:-translate-y-0.5 hover:bg-white/10">
                  <PhoneCall className="h-4 w-4 text-[#ffae13]" />
                  <span className="text-sm font-semibold">+91 72002 38737</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal direction="right" delay={120} className="font-urbanist">
          <div className="rounded-[34px] border border-white/70 bg-white/90 p-4 shadow-[0_18px_55px_rgba(13,70,151,0.10)] backdrop-blur">
            {publicFaqs.length ? (
              <div className="space-y-3">
                {publicFaqs.map((faq, index) => (
                  <details key={faq._id || faq.question} className="group overflow-hidden rounded-[24px] border border-slate-200/80 bg-white transition duration-300 open:border-[#0d4697]/20 open:bg-[#fffaf0]">
                    <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 text-left text-base font-extrabold text-[#151515] transition duration-300 hover:text-[#0d4697] [&::-webkit-details-marker]:hidden">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0d4697] text-sm font-black text-white shadow-[0_10px_20px_rgba(13,70,151,0.18)]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 pr-2">{faq.question}</span>
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition duration-300 group-open:rotate-180 group-open:border-[#ffae13]/30 group-open:text-[#ff9515]">
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </summary>
                    <div className="px-5 pb-5 pl-[4.25rem] pr-5">
                      <p className="rounded-2xl border border-white/70 bg-white px-4 py-4 text-sm font-semibold leading-6 text-[#5e6572] shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                        {faq.answer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            ) : (
              <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                <p className="text-base font-bold text-[#0d4697]">FAQ content is loading.</p>
                <p className="mt-2 text-sm font-medium text-[#5e6572]">Questions and answers will appear here once available.</p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  </main>
}
