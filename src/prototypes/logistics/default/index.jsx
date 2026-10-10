import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Check,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Globe2,
  Headset,
  MapPin,
  Menu,
  Package,
  PackageCheck,
  Plane,
  Quote,
  ScanLine,
  ShieldCheck,
  Star,
  Truck,
  Warehouse,
  X,
  Zap,
} from 'lucide-react'
import './logistics.css'

const navItems = [
  { id: 'services', label: 'Solutions' },
  { id: 'tracking', label: 'Track shipment' },
  { id: 'about', label: 'Our network' },
  { id: 'contact', label: 'Contact' },
]

const serviceCards = [
  { icon: Truck, title: 'Surface express', text: 'Reliable door-to-door movement for parcels, pallets and full truck loads.' },
  { icon: Plane, title: 'Air cargo', text: 'Time-sensitive domestic and international freight, handled with care.' },
  { icon: Warehouse, title: 'Warehousing', text: 'Flexible storage, fulfilment and inventory management built to scale.' },
  { icon: Boxes, title: 'E-commerce delivery', text: 'Last-mile delivery, returns and cash-on-delivery support for growing brands.' },
]

const testimonials = [
  { quote: 'We moved our entire fulfilment to Route One last year. Our return rate dropped and the dashboard actually tells us where a parcel is stuck.', name: 'Ritika Chhabria', context: 'Founder, Loomcraft Apparel' },
  { quote: 'Their Pune sorting hub turned our 3-day lane into next-day delivery. Customer complaints about late orders basically disappeared.', name: 'Faizan Ahmed', context: 'Ops Lead, Daftar Supplies' },
  { quote: 'Cash-on-delivery reconciliation used to take our finance team a full day each week. Now it is automatic and accurate.', name: 'Meenal Joshi', context: 'Finance Manager, Haldi & Co.' },
]

const carrierPartners = ['Own fleet network', 'India Post', 'Regional courier partners', 'Air cargo alliances', 'Last-mile gig partners']

const milestones = [
  { title: 'Shipment picked up', place: 'Origin facility · Mumbai', time: 'Today, 9:20 AM' },
  { title: 'In transit', place: 'Central sorting hub · Pune', time: 'Today, 2:45 PM' },
  { title: 'Out for delivery', place: 'Local delivery centre · Bengaluru', time: 'Expected tomorrow' },
  { title: 'Delivered', place: 'Your destination', time: 'Awaiting delivery' },
]

function imageUrl(id, width = 1000) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`
}

function Reveal({ children, className, delay = 0 }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function SectionIntro({ eyebrow, title, description }) {
  return (
    <div className="r1-intro">
      <span className="r1-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

function TrackingForm({ onTrack, compact = false }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    const normalized = code.trim().toUpperCase()
    if (!normalized) {
      setError('Enter a tracking number to continue.')
      return
    }
    if (normalized !== 'R1-48219') {
      setError('This preview only includes demo shipment R1-48219.')
      return
    }
    setError('')
    onTrack(normalized)
  }

  return (
    <form className={`r1-track-form${compact ? ' r1-track-form-compact' : ''}`} onSubmit={submit}>
      <label htmlFor={compact ? 'tracking-number-compact' : 'tracking-number'}>Tracking or AWB number</label>
      <div className="r1-track-field">
        <ScanLine size={18} aria-hidden="true" />
        <input
          id={compact ? 'tracking-number-compact' : 'tracking-number'}
          value={code}
          onChange={(event) => { setCode(event.target.value); setError('') }}
          placeholder="e.g. R1-48219"
          autoComplete="off"
        />
        <button type="submit" aria-label="Track shipment"><ArrowRight size={19} /></button>
      </div>
      {error && <span className="r1-track-error" role="alert">{error}</span>}
    </form>
  )
}

function TrackingResult({ code }) {
  const reduceMotion = useReducedMotion()
  const steps = milestones.map((item, index) => ({ ...item, done: index < 2, current: index === 2 }))
  return (
    <motion.article className="r1-tracking-result" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <div className="r1-result-head">
        <span className="r1-result-icon"><PackageCheck size={22} /></span>
        <div><small>DEMO SHIPMENT · {code}</small><h3>On its way</h3></div>
        <span className="r1-status-pill"><i /> In transit</span>
      </div>
      <div className="r1-route-summary"><span>Mumbai</span><span className="r1-route-dash"><i /><i /><i /><Truck size={18} /></span><span>Bengaluru</span></div>
      <p className="r1-delivery-estimate">Expected delivery <strong>Tomorrow, before 8:00 PM</strong></p>
      <ol className="r1-timeline">
        {steps.map((step) => (
          <li className={`${step.done ? 'is-done' : ''}${step.current ? ' is-current' : ''}`} key={step.title}>
            <span className="r1-timeline-marker">{step.done ? <Check size={13} /> : step.current ? <span /> : null}</span>
            <span className="r1-timeline-copy"><b>{step.title}</b><small>{step.place}</small></span>
            <time>{step.time}</time>
          </li>
        ))}
      </ol>
      <p className="r1-demo-note">Illustrative tracking preview only. This is not a live shipment update.</p>
    </motion.article>
  )
}

function HomePage({ navigate, onTrack }) {
  const reduceMotion = useReducedMotion()
  const variants = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } } }
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }
  return (
    <>
      <section className="r1-hero">
        <div className="r1-container r1-hero-grid">
          <motion.div className="r1-hero-copy" variants={variants} initial={reduceMotion ? false : 'hidden'} animate="show">
            <motion.span className="r1-eyebrow" variants={item}><i /> LOGISTICS, WITHOUT THE GUESSWORK</motion.span>
            <motion.h1 variants={item}>Move your world.<br /><em>We’ll move it forward.</em></motion.h1>
            <motion.p variants={item}>From your first parcel to your next thousand deliveries, connect every mile with one dependable logistics partner.</motion.p>
            <motion.div className="r1-hero-actions" variants={item}>
              <button className="r1-button r1-button-orange" type="button" onClick={() => navigate('contact')}>Get a shipping quote <ArrowRight size={17} /></button>
              <button className="r1-button r1-button-plain" type="button" onClick={() => navigate('tracking')}><Package size={17} /> Track a shipment</button>
            </motion.div>
            <motion.div className="r1-trust-line" variants={item}><span className="r1-trust-icon"><ShieldCheck size={19} /></span><span><b>Every delivery deserves a sure thing.</b><small>One connected network. People who care.</small></span></motion.div>
          </motion.div>
          <motion.div className="r1-hero-art" initial={reduceMotion ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .75, delay: .2 }}>
            <div className="r1-map-card" aria-label="Illustrated India-wide delivery network">
              <div className="r1-map-grid" />
              <svg className="r1-route-svg" viewBox="0 0 600 400" role="img" aria-label="Delivery route connecting Mumbai, Pune, Bengaluru and Chennai">
                <path className="r1-route-path r1-route-path-back" d="M151 215 C220 130 240 205 300 180 S392 206 439 92 M300 180 C334 253 403 275 481 300" />
                <path className="r1-route-path r1-route-path-front" d="M151 215 C220 130 240 205 300 180 S392 206 439 92 M300 180 C334 253 403 275 481 300" />
              </svg>
              <motion.div className="r1-map-pin r1-pin-mumbai" animate={reduceMotion ? undefined : { y: [0, -5, 0] }} transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut' }}><span><MapPin size={17} /></span><small>MUMBAI</small></motion.div>
              <motion.div className="r1-map-pin r1-pin-pune" animate={reduceMotion ? undefined : { y: [0, -4, 0] }} transition={{ duration: 3.4, delay: .2, repeat: Infinity, ease: 'easeInOut' }}><span><MapPin size={17} /></span><small>PUNE</small></motion.div>
              <motion.div className="r1-map-pin r1-pin-bengaluru" animate={reduceMotion ? undefined : { y: [0, -5, 0] }} transition={{ duration: 3.3, delay: .4, repeat: Infinity, ease: 'easeInOut' }}><span><MapPin size={17} /></span><small>BENGALURU</small></motion.div>
              <motion.div className="r1-map-pin r1-pin-chennai" animate={reduceMotion ? undefined : { y: [0, -4, 0] }} transition={{ duration: 3.5, delay: .6, repeat: Infinity, ease: 'easeInOut' }}><span><MapPin size={17} /></span><small>CHENNAI</small></motion.div>
              <motion.div className="r1-map-truck" animate={reduceMotion ? undefined : { offsetDistance: ['0%', '100%'] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}><Truck size={21} /></motion.div>
              <div className="r1-map-label"><Globe2 size={15} /><span><b>One network.</b><small>Across India and beyond.</small></span></div>
              <div className="r1-map-stats"><span><b>28</b><small>states reached</small></span><span><b>1,200+</b><small>delivery locations</small></span></div>
            </div>
            <div className="r1-hero-photo"><img src={imageUrl('photo-1586528116311-ad8dd3c8310d', 900)} alt="Logistics team preparing freight for dispatch" fetchPriority="high" /></div>
            <motion.div className="r1-delivery-toast" initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: .45 }}><span><CheckCircle2 size={18} /></span><div><b>Delivery complete</b><small>Right on schedule · Chennai</small></div></motion.div>
          </motion.div>
        </div>
      </section>

      <section className="r1-quick-track">
        <div className="r1-container r1-quick-track-inner">
          <div><span className="r1-eyebrow">ALREADY SENT IT?</span><h2>Know where it is.</h2><p>Enter your demo number <b>R1-48219</b> to preview shipment tracking.</p></div>
          <TrackingForm compact onTrack={onTrack} />
        </div>
      </section>

      <Reveal className="r1-proof-strip">
        <div className="r1-container r1-proof-grid"><div><b>15<span>+</span></b><small>years moving business forward</small></div><div><b>1,200<span>+</span></b><small>serviceable pin codes</small></div><div><b>98<span>%</span></b><small>on-time delivery commitment</small></div><div><b>24<span>/7</span></b><small>shipment visibility</small></div></div>
      </Reveal>

      <Reveal className="r1-section r1-home-services">
        <div className="r1-container">
          <SectionIntro eyebrow="A BETTER WAY TO MOVE" title={<>One partner.<br /><em>Every delivery need.</em></>} description="Flexible shipping and fulfilment services designed around your business, backed by people you can reach." />
          <div className="r1-service-grid">{serviceCards.map(({ icon: Icon, title, text }, index) => <motion.button className="r1-service-card" key={title} type="button" onClick={() => navigate('services')} initial={reduceMotion ? false : { opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} whileHover={reduceMotion ? undefined : { y: -5 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .4, delay: index * .06 }}><span className="r1-service-icon"><Icon size={22} /></span><h3>{title}</h3><p>{text}</p><span className="r1-learn">Discover the service <ArrowRight size={15} /></span></motion.button>)}</div>
          <div className="r1-center-link"><button className="r1-text-button" type="button" onClick={() => navigate('services')}>Explore all solutions <ArrowRight size={16} /></button></div>
        </div>
      </Reveal>

      <Reveal className="r1-story-section">
        <div className="r1-container r1-story-grid">
          <div className="r1-story-photo"><img src={imageUrl('photo-1566576912321-d58ddd7a6088', 1000)} alt="Freight workers coordinating a delivery at a distribution hub" loading="lazy" /><span><Zap size={16} /> Built for the pace of business</span></div>
          <div className="r1-story-copy"><span className="r1-eyebrow">MORE THAN A DELIVERY NETWORK</span><h2>We move goods.<br /><em>And business forward.</em></h2><p>Behind every consignment is a promise. Our teams, technology and connected hubs make that promise easier to keep—at every scale, across every mile.</p><ul><li><Check size={16} /> Clear shipment visibility</li><li><Check size={16} /> Flexible options for every load</li><li><Check size={16} /> Real people, ready to help</li></ul><button className="r1-text-button" type="button" onClick={() => navigate('about')}>Meet Route One <ArrowRight size={16} /></button></div>
        </div>
      </Reveal>

      <Reveal className="r1-section r1-testimonials">
        <div className="r1-container">
          <SectionIntro eyebrow="TRUSTED BY GROWING BUSINESSES" title={<>Businesses that<br /><em>move with us.</em></>} description="From first-time shippers to high-volume e-commerce brands, here’s how Route One shows up for our customers." />
          <div className="r1-testimonial-grid">
            {testimonials.map(({ quote, name, context }, index) => (
              <motion.figure className="r1-testimonial-card" key={name} initial={reduceMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.42, delay: index * 0.08 }}>
                <Quote className="r1-quote-mark" size={24} aria-hidden="true" />
                <div className="r1-stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, starIndex) => <Star key={starIndex} size={13} />)}</div>
                <blockquote>{quote}</blockquote>
                <figcaption><b>{name}</b><small>{context}</small></figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="r1-partner-strip">
        <div className="r1-container r1-partner-inner">
          <span className="r1-partner-label"><ShieldCheck size={16} /> Delivered through</span>
          <ul>{carrierPartners.map((name) => <li key={name}>{name}</li>)}</ul>
        </div>
      </Reveal>

      <Reveal className="r1-home-cta">
        <div className="r1-container r1-home-cta-inner"><span className="r1-eyebrow">READY WHEN YOU ARE</span><h2>Let’s get your next delivery moving.</h2><p>Tell us what you’re shipping. We’ll help you find the right route.</p><button className="r1-button r1-button-orange" type="button" onClick={() => navigate('contact')}>Talk to our team <ArrowRight size={17} /></button></div>
      </Reveal>
    </>
  )
}

function ServicesPage({ navigate }) {
  return (
    <section className="r1-page r1-container">
      <SectionIntro eyebrow="SOLUTIONS FOR EVERY MILE" title={<>The right route for<br /><em>what you move.</em></>} description="From a single package to a full supply chain, find the service that fits your timelines, cargo and customers." />
      <div className="r1-service-grid r1-services-page-grid">{serviceCards.map(({ icon: Icon, title, text }, index) => <Reveal className="r1-service-detail" key={title} delay={index * .04}><span className="r1-service-icon"><Icon size={23} /></span><h3>{title}</h3><p>{text}</p><ul><li><Check size={15} /> Flexible pickup options</li><li><Check size={15} /> Shipment visibility</li><li><Check size={15} /> Support when you need it</li></ul><button className="r1-text-button" type="button" onClick={() => navigate('contact')}>Request a quote <ArrowRight size={15} /></button></Reveal>)}</div>
      <div className="r1-services-photo"><img src={imageUrl('photo-1566576912321-d58ddd7a6088', 1300)} alt="Logistics operations team at a freight hub" loading="lazy" /><div><span className="r1-eyebrow">BUILT AROUND YOUR BUSINESS</span><h2>One network. Many ways forward.</h2><button className="r1-button r1-button-orange" type="button" onClick={() => navigate('contact')}>Plan your shipment <ArrowRight size={16} /></button></div></div>
    </section>
  )
}

function TrackingPage({ onTrack, trackingCode, navigate }) {
  return (
    <section className="r1-page r1-container">
      <SectionIntro eyebrow="SHIPMENT VISIBILITY" title={<>From pickup to<br /><em>right on your doorstep.</em></>} description="Get a clear view of your delivery journey. Try our illustrative demo tracking number to explore the experience." />
      <div className="r1-tracking-layout">
        <div className="r1-tracking-help"><span className="r1-big-icon"><ScanLine size={26} /></span><h2>Track your shipment.</h2><p>Your tracking or AWB number is in your booking confirmation. Enter it below to see the latest status.</p><TrackingForm onTrack={onTrack} /><div className="r1-demo-code"><Package size={16} /><span>Try demo number <b>R1-48219</b></span></div><div className="r1-help-call"><Headset size={17} /><span>Need a hand? <button type="button" onClick={() => navigate('contact')}>Talk to our support team</button></span></div></div>
        {trackingCode ? <TrackingResult code={trackingCode} /> : <div className="r1-track-placeholder"><div className="r1-placeholder-illustration"><PackageCheck size={46} /><span><MapPin /><i /><MapPin /></span></div><h3>Your delivery journey, at a glance.</h3><p>Enter a tracking number to see an illustrative delivery timeline.</p></div>}
      </div>
    </section>
  )
}

function AboutPage({ navigate }) {
  return (
    <section className="r1-page r1-container">
      <SectionIntro eyebrow="OUR NETWORK, YOUR NEXT MOVE" title={<>Local knowledge.<br /><em>Nationwide reach.</em></>} description="Route One is a fictional logistics brand concept designed to show how a modern delivery company could connect businesses and communities across India." />
      <div className="r1-about-story"><img src={imageUrl('photo-1580674285054-bed31e145f59', 1200)} alt="Logistics professional overseeing freight dispatch" loading="lazy" /><div><span className="r1-eyebrow">DELIVERY WITH PURPOSE</span><h2>Every mile matters to someone.</h2><p>We believe great logistics is about more than moving a package. It’s about showing up, keeping people informed, and helping businesses make good on their promises.</p><p>Our concept combines a connected network with practical, responsive service—from the first scan to the final hand-off.</p><button className="r1-button r1-button-orange" type="button" onClick={() => navigate('contact')}>Let’s work together <ArrowRight size={16} /></button></div></div>
      <div className="r1-value-grid"><div><Globe2 /><b>Connected reach</b><span>One view across hubs, routes and delivery partners.</span></div><div><ShieldCheck /><b>Handled with care</b><span>Thoughtful handling for every parcel and consignment.</span></div><div><Zap /><b>Built to keep moving</b><span>Smart operations that adapt when plans change.</span></div></div>
      <div className="r1-network-band"><span className="r1-eyebrow">A NETWORK THAT CONNECTS</span><h2>From metro hubs to emerging markets.</h2><div><span><b>28</b><small>states & territories</small></span><span><b>1,200+</b><small>delivery locations</small></span><span><b>24 / 7</b><small>shipment visibility</small></span></div></div>
    </section>
  )
}

function ContactPage({ submitted, onSubmit }) {
  return (
    <section className="r1-page r1-container">
      <SectionIntro eyebrow="LET’S GET THINGS MOVING" title={<>Tell us what you’re<br /><em>looking to move.</em></>} description="Share a few details and our logistics team will help you find a practical way forward. This demo does not submit your information." />
      <div className="r1-contact-layout">
        <div className="r1-contact-card"><span className="r1-big-icon"><Headset size={25} /></span><h2>Real help. No runaround.</h2><p>Whether you’re planning a regular route or sorting out a one-off delivery, we’ll help you work out the details.</p><div><span><Clock3 /><b>Monday – Saturday</b><small>9:00 AM – 6:00 PM IST</small></span><span><MapPin /><b>Mumbai operations desk</b><small>Serving customers across India</small></span><span><Package /><b>Existing shipment?</b><small>Have your tracking or AWB number ready</small></span><span><FileCheck2 /><b>Shipment protection</b><small>Ask about insured value cover for high-value cargo</small></span></div></div>
        <form className="r1-contact-form" onSubmit={onSubmit}>
          <h3>Request a shipping quote</h3><p>We’ll help you plan the right service.</p>
          <label>Your name<input name="name" autoComplete="name" placeholder="Full name" required /></label>
          <div className="r1-form-row"><label>Work email<input name="email" type="email" autoComplete="email" placeholder="you@company.com" required /></label><label>Phone number<input name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" required /></label></div>
          <label>What do you need to ship?<select name="service" defaultValue="" required><option value="" disabled>Select a service</option>{serviceCards.map(({ title }) => <option key={title}>{title}</option>)}</select></label>
          <label>Tell us a little more<textarea name="details" rows="3" placeholder="Pickup city, destination and shipment type" /></label>
          {submitted && <p className="r1-submit-note" role="status">This is a website concept. Your enquiry has not been sent.</p>}
          <button className="r1-button r1-button-orange" type="submit">Request a callback <ArrowRight size={16} /></button>
          <small>Demo form only. Please don’t enter sensitive or real customer data.</small>
        </form>
      </div>
    </section>
  )
}

export default function LogisticsPrototype() {
  const [params, setParams] = useSearchParams()
  const [menuOpen, setMenuOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [trackingCode, setTrackingCode] = useState('')
  const reduceMotion = useReducedMotion()
  const validPages = ['home', ...navItems.map(({ id }) => id)]
  const page = validPages.includes(params.get('page')) ? params.get('page') : 'home'

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Route One Logistics | Move your world forward'
    return () => { document.title = previousTitle }
  }, [])

  function navigate(nextPage) {
    setParams(nextPage === 'home' ? {} : { page: nextPage })
    setMenuOpen(false)
    setSubmitted(false)
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  function track(code) {
    setTrackingCode(code)
  }

  function submitQuote(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="r1">
      <div className="r1-topbar"><div className="r1-container r1-topbar-inner"><span><Globe2 size={14} /> Moving across India, together</span><span><Headset size={14} /> Need help? <a href="?page=contact">Talk to our team <ArrowUpRight size={13} /></a></span></div></div>
      <header className="r1-header">
        <div className="r1-container r1-nav">
          <button className="r1-logo" type="button" onClick={() => navigate('home')} aria-label="Route One home"><span className="r1-logo-symbol"><ArrowUpRight size={21} /></span><span>route<span>one</span><small>LOGISTICS, CONNECTED</small></span></button>
          <button className="r1-menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>{menuOpen ? <X /> : <Menu />}</button>
          <nav className={menuOpen ? 'r1-links r1-links-open' : 'r1-links'} aria-label="Main navigation">
            {navItems.map(({ id, label }) => <button type="button" key={id} className={page === id ? 'is-active' : ''} aria-current={page === id ? 'page' : undefined} onClick={() => navigate(id)}>{label}</button>)}
            <button className="r1-nav-cta" type="button" onClick={() => navigate('contact')}>Get a quote <ArrowRight size={15} /></button>
          </nav>
        </div>
      </header>
      <main>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={page} initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: .28, ease: 'easeOut' }}>
            {page === 'home' && <HomePage navigate={navigate} onTrack={(code) => { setTrackingCode(code); navigate('tracking') }} />}
            {page === 'services' && <ServicesPage navigate={navigate} />}
            {page === 'tracking' && <TrackingPage onTrack={track} trackingCode={trackingCode} navigate={navigate} />}
            {page === 'about' && <AboutPage navigate={navigate} />}
            {page === 'contact' && <ContactPage submitted={submitted} onSubmit={submitQuote} />}
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="r1-footer"><div className="r1-container r1-footer-inner"><button className="r1-logo" type="button" onClick={() => navigate('home')}><span className="r1-logo-symbol"><ArrowUpRight size={21} /></span><span>route<span>one</span><small>LOGISTICS, CONNECTED</small></span></button><p>Every delivery deserves a sure thing.</p><nav aria-label="Footer navigation">{navItems.map(({ id, label }) => <button type="button" key={id} onClick={() => navigate(id)}>{label}</button>)}</nav><small>Fictional brand website concept · Names, data and tracking are illustrative only.</small></div></footer>
    </div>
  )
}
