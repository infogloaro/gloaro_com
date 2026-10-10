import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  BadgeIndianRupee,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  Cloud,
  CreditCard,
  Headset,
  Menu,
  Package,
  QrCode,
  Quote,
  ReceiptText,
  ShieldCheck,
  Smartphone,
  Star,
  Store,
  WifiOff,
  X,
  Zap,
} from 'lucide-react'
import PosTerminal from './PosTerminal'
import './pos.css'

const pages = [
  { id: 'home', label: 'Home' },
  { id: 'product', label: 'Product' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'contact', label: 'Get a demo' },
]

const features = [
  { icon: QrCode, title: 'UPI, cards & more', text: 'Give customers familiar ways to pay, from UPI QR to cards and cash.' },
  { icon: ReceiptText, title: 'GST-ready billing', text: 'Create clear invoices, apply tax settings and share digital receipts.' },
  { icon: Package, title: 'Stock that stays in sync', text: 'Track items, variants and low stock while you serve the next customer.' },
  { icon: BarChart3, title: 'Know your numbers', text: 'See sales, bestsellers and daily summaries in one simple dashboard.' },
]

const testimonials = [
  { quote: 'Switching from a paper ledger to CounterFlow cut our billing time in half. The GST reports alone save me a day every month.', name: 'Anita Deshmukh', context: 'Owner, Chai Point Boutique Cafe' },
  { quote: 'Low-stock alerts mean I never run out of our best-selling fabrics anymore. My staff picked it up in a single afternoon.', name: 'Rahul Varma', context: 'Founder, Varma Textiles' },
  { quote: 'Even when our Wi-Fi drops mid-afternoon, billing keeps going. That alone was worth switching for.', name: 'Simran Kaur', context: 'Owner, Glow Salon & Spa' },
]

const paymentPartners = ['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'Visa', 'Mastercard', 'RuPay']

const faqs = [
  { q: 'Do I need special hardware to get started?', a: 'No. CounterFlow runs on a phone, tablet or basic Android POS device. A receipt printer and barcode scanner are optional add-ons.' },
  { q: 'What happens if my internet connection drops?', a: 'Billing keeps working offline and syncs automatically once you are back online. Live payment confirmation depends on your payment provider’s connectivity.' },
  { q: 'Can I manage more than one store location?', a: 'Yes, the Multi-store plan gives you centralised reporting and inventory across every counter you run.' },
]

const plans = [
  { name: 'Starter', price: '₹ 799', description: 'A simple start for a single counter.', items: ['1 store location', 'Billing & digital receipts', 'UPI QR payment support', 'Daily sales summary'] },
  { name: 'Growth', price: '₹ 1,499', description: 'More visibility as your business grows.', items: ['Everything in Starter', 'Inventory & low-stock alerts', 'GST reports & exports', 'Staff roles & permissions'], featured: true },
  { name: 'Multi-store', price: 'Let’s talk', description: 'Connected operations across locations.', items: ['Everything in Growth', 'Multiple store locations', 'Centralised reporting', 'Guided onboarding'] },
]

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

function Intro({ eyebrow, title, text }) {
  return <div className="cf-intro"><span className="cf-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>
}

function FeatureCards({ compact = false }) {
  const reduceMotion = useReducedMotion()
  return (
    <div className={`cf-feature-grid${compact ? ' cf-feature-grid-compact' : ''}`}>
      {features.map(({ icon: Icon, title, text }, index) => (
        <motion.article
          className="cf-feature-card"
          key={title}
          initial={reduceMotion ? false : { opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={reduceMotion ? undefined : { y: -4 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: index * 0.06 }}
        >
          <span className="cf-feature-icon"><Icon size={22} /></span><h3>{title}</h3><p>{text}</p>
          {!compact && <span className="cf-feature-arrow"><ArrowRight size={15} /></span>}
        </motion.article>
      ))}
    </div>
  )
}

function HomePage({ navigate }) {
  const reduceMotion = useReducedMotion()
  const [demoPaid, setDemoPaid] = useState(false)
  const heroItems = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }
  const item = { hidden: { opacity: 0, y: 19 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }
  return (
    <>
      <section className="cf-hero">
        <div className="cf-container cf-hero-grid">
          <motion.div className="cf-hero-copy" variants={heroItems} initial={reduceMotion ? false : 'hidden'} animate="show">
            <motion.span className="cf-eyebrow" variants={item}><i /> SMART POS FOR EVERYDAY INDIA</motion.span>
            <motion.h1 variants={item}>Your business,<br /><em>in a better flow.</em></motion.h1>
            <motion.p variants={item}>Billing, UPI payments, GST reports and inventory—one easy counter system that helps you spend less time managing and more time growing.</motion.p>
            <motion.div className="cf-hero-actions" variants={item}>
              <motion.button className="cf-button cf-button-primary" type="button" onClick={() => navigate('contact')} whileHover={reduceMotion ? undefined : { y: -3 }} whileTap={reduceMotion ? undefined : { scale: .98 }}>Book a free demo <ArrowRight size={17} /></motion.button>
              <button className="cf-button cf-button-secondary" type="button" onClick={() => navigate('product')}>Explore the POS <ChevronDown size={16} /></button>
            </motion.div>
            <motion.div className="cf-trust" variants={item}><span><ShieldCheck size={18} /></span><div><b>Made for the way India does business</b><small>Simple setup · Helpful support · Clear pricing</small></div></motion.div>
          </motion.div>
          <motion.div className="cf-hero-product" initial={reduceMotion ? false : { opacity: 0, scale: .94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: .75, delay: .2, ease: [0.22, 1, 0.36, 1] }}>
            <div className="cf-orbit cf-orbit-one" /><div className="cf-orbit cf-orbit-two" />
            <PosTerminal />
            <motion.div className="cf-payment-approved" animate={reduceMotion ? undefined : { y: [0, -5, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}><CheckCircle2 size={17} /><span><b>Payment approved</b><small>UPI · ₹ 45.00</small></span></motion.div>
            <motion.div className="cf-gst-float" animate={reduceMotion ? undefined : { y: [0, 5, 0] }} transition={{ duration: 4, delay: .4, repeat: Infinity, ease: 'easeInOut' }}><ReceiptText size={16} /><span><b>GST invoice</b><small>Ready to share</small></span></motion.div>
            <span className="cf-product-note">A little more flow at every counter.</span>
          </motion.div>
        </div>
      </section>

      <section className="cf-trustbar"><div className="cf-container cf-trustbar-inner"><span><QrCode /> UPI & QR payments</span><i /><span><BadgeIndianRupee /> GST-ready billing</span><i /><span><WifiOff /> Works through network hiccups</span><i /><span><Smartphone /> Digital receipts</span></div></section>

      <Reveal className="cf-section cf-for">
        <div className="cf-container">
          <div className="cf-section-head"><span className="cf-eyebrow">ONE COUNTER, A LOT LESS CHAOS</span><h2>Everything you need to<br /><em>serve the next customer.</em></h2><p>From a neighbourhood cafe to a growing retail shop, CounterFlow keeps the everyday essentials together.</p></div>
          <FeatureCards />
        </div>
      </Reveal>

      <Reveal className="cf-demo-section">
        <div className="cf-container cf-demo-grid">
          <div className="cf-demo-copy"><span className="cf-eyebrow">A CHECKOUT THAT FEELS EASY</span><h2>From “what’ll it be?”<br />to paid in a few taps.</h2><p>See how a clean, quick counter flow can feel. This interactive preview is a product demo—not a payment terminal.</p><ul><li><Check size={16} /> Add items and apply tax</li><li><Check size={16} /> Choose UPI, card or cash</li><li><Check size={16} /> Share a digital receipt</li></ul><button className="cf-text-button" type="button" onClick={() => navigate('product')}>Explore the product <ArrowRight size={16} /></button></div>
          <motion.div className="cf-demo-screen" initial={reduceMotion ? false : { opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .55 }}>
            <div className="cf-demo-screen-top"><span><i /> COUNTERFLOW · CAFE</span><span>TABLE 04</span></div>
            <div className="cf-demo-items"><div><span>Filter coffee <small>Regular · 1 × ₹ 45</small></span><b>₹ 45</b></div><div><span>Masala bun <small>1 × ₹ 35</small></span><b>₹ 35</b></div></div>
            <div className="cf-demo-total"><span>Subtotal</span><b>₹ 80.00</b><span>GST (5%)</span><b>₹ 4.00</b><strong>Total due</strong><strong>₹ 84.00</strong></div>
            <button className={demoPaid ? 'cf-demo-pay cf-demo-pay-done' : 'cf-demo-pay'} type="button" onClick={() => setDemoPaid(!demoPaid)}>{demoPaid ? <><CheckCircle2 size={18} /> Demo payment approved</> : <><QrCode size={18} /> Pay with UPI · ₹ 84.00</>}</button>
            <small className="cf-demo-disclaimer">Simulation only · No money is collected</small>
          </motion.div>
        </div>
      </Reveal>

      <Reveal className="cf-industries">
        <div className="cf-container">
          <div className="cf-section-head cf-section-head-row"><div><span className="cf-eyebrow">FITS RIGHT IN</span><h2>Made for your kind<br />of busy.</h2></div><p>Keep the line moving whether you’re pouring a flat white, ringing up a new outfit or welcoming a salon client.</p></div>
          <div className="cf-industry-grid"><article><span>01</span><Store /><h3>Retail & boutiques</h3><p>Variants, stock levels and smoother checkout for every sale.</p></article><article><span>02</span><Cloud /><h3>Cafes & restaurants</h3><p>Quick billing, menu items and a clear view of your day.</p></article><article><span>03</span><Zap /><h3>Salons & services</h3><p>Simple billing, customer history and easy staff access.</p></article></div>
        </div>
      </Reveal>

      <Reveal className="cf-section cf-testimonials">
        <div className="cf-container">
          <div className="cf-section-head"><span className="cf-eyebrow">TRUSTED AT THE COUNTER</span><h2>Loved by shops,<br /><em>cafes and salons.</em></h2><p>Real feedback from small business owners using CounterFlow every day.</p></div>
          <div className="cf-testimonial-grid">
            {testimonials.map(({ quote, name, context }, index) => (
              <motion.figure className="cf-testimonial-card" key={name} initial={reduceMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.42, delay: index * 0.08 }}>
                <Quote className="cf-quote-mark" size={22} aria-hidden="true" />
                <div className="cf-stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, starIndex) => <Star key={starIndex} size={12} />)}</div>
                <blockquote>{quote}</blockquote>
                <figcaption><b>{name}</b><small>{context}</small></figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="cf-payment-strip">
        <div className="cf-container cf-payment-strip-inner">
          <span className="cf-payment-label"><ShieldCheck size={16} /> Accept payments via</span>
          <ul>{paymentPartners.map((name) => <li key={name}>{name}</li>)}</ul>
        </div>
      </Reveal>

      <Reveal className="cf-cta-band"><div className="cf-container"><span className="cf-eyebrow">YOUR NEXT SALE CAN FEEL SIMPLER</span><h2>Let’s make your counter<br />work a little smarter.</h2><p>Take a look at CounterFlow with a friendly, no-pressure demo.</p><button className="cf-button cf-button-primary" type="button" onClick={() => navigate('contact')}>See a free demo <ArrowRight size={16} /></button></div></Reveal>
    </>
  )
}

function ProductPage({ navigate }) {
  return (
    <section className="cf-page cf-container">
      <Intro eyebrow="THE COUNTERFLOW TOOLKIT" title={<>Your daily operations,<br /><em>finally in sync.</em></>} text="A practical point-of-sale toolkit for billing, payments, inventory and business insights—with an interface that feels easy from day one." />
      <div className="cf-product-feature-grid">
        <article><span><CreditCard /></span><h2>Billing without the bottleneck</h2><p>Search products, adjust quantities, apply discounts and finish a sale without slowing the queue.</p><small>Fast item lookup · Discounts · Returns</small></article>
        <article><span><QrCode /></span><h2>Payments customers already use</h2><p>Offer UPI QR, card and cash options in a clear checkout. Reconcile payments alongside each sale.</p><small>UPI QR · Card · Cash · Split tender</small></article>
        <article><span><Package /></span><h2>Inventory that keeps up</h2><p>See what is selling, spot low stock and keep product information organised across your counter.</p><small>Stock levels · Variants · Alerts</small></article>
        <article><span><BarChart3 /></span><h2>Useful answers, not more spreadsheets</h2><p>Understand daily totals, bestsellers and tax summaries from one straightforward view.</p><small>Daily report · GST summaries · Exports</small></article>
      </div>
      <div className="cf-product-banner"><div><span className="cf-eyebrow">BUSINESS DOESN’T ALWAYS HAVE PERFECT WI-FI</span><h2>Keep the counter moving through a network hiccup.</h2><p>Designed with an offline-friendly checkout experience. Payment availability can depend on the payment provider and connection.</p><button className="cf-button cf-button-primary" type="button" onClick={() => navigate('contact')}>Talk through your setup <ArrowRight size={16} /></button></div><div className="cf-offline-card"><WifiOff /><span><b>Connection is unstable</b><small>Keep building the bill</small></span><CheckCircle2 /></div></div>
    </section>
  )
}

function PricingPage({ navigate }) {
  return (
    <section className="cf-page cf-container">
      <Intro eyebrow="STRAIGHTFORWARD PLANS" title={<>The right plan for<br /><em>your next chapter.</em></>} text="Start with the essentials and move up when your business needs more. These illustrative prices are website demo content, not a live offer." />
      <div className="cf-pricing-grid">{plans.map((plan, index) => <motion.article className={`cf-price-card${plan.featured ? ' cf-price-featured' : ''}`} key={plan.name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .42, delay: index * .07 }}>{plan.featured && <span className="cf-popular">MOST POPULAR</span>}<span className="cf-plan-name">{plan.name}</span><h2>{plan.price}<small>{plan.price.startsWith('₹') ? '/ month / device' : ''}</small></h2><p>{plan.description}</p><button className={plan.featured ? 'cf-button cf-button-primary' : 'cf-button cf-button-outline'} type="button" onClick={() => navigate('contact')}>{plan.price.startsWith('₹') ? 'Try it with a demo' : 'Talk to our team'} <ArrowRight size={15} /></button><ul>{plan.items.map((line) => <li key={line}><Check size={15} /> {line}</li>)}</ul></motion.article>)}</div>
      <p className="cf-pricing-note">All prices shown are illustrative demo content. Final pricing, payment hardware and applicable taxes would be confirmed with a real provider.</p>
      <div className="cf-faq"><span className="cf-eyebrow">GOOD TO KNOW</span><h2>Frequently asked questions</h2>{faqs.map(({ q, a }) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
    </section>
  )
}

function ContactPage({ submitted, onSubmit }) {
  return (
    <section className="cf-page cf-container">
      <Intro eyebrow="LET’S TALK POS" title={<>Show us how you work.<br /><em>We’ll show what fits.</em></>} text="Tell us a little about your counter and our team can walk you through a tailored demo. This form is a local prototype and does not send data." />
      <div className="cf-contact-layout">
        <div className="cf-contact-aside"><span className="cf-contact-icon"><Headset /></span><h2>Friendly help, from first look to setup.</h2><p>Bring your questions about billing, UPI, GST settings, inventory or multiple counters. We’ll take it one step at a time.</p><div><span><BadgeIndianRupee /><b>Built for India</b><small>Rupees, GST and familiar payment options</small></span><span><ShieldCheck /><b>Your business stays yours</b><small>Access and roles designed around your team</small></span></div></div>
        <form className="cf-contact-form" onSubmit={onSubmit}><h3>Request a product demo</h3><p>We’ll help you explore the right features.</p><label>Your name<input name="name" autoComplete="name" placeholder="Full name" required /></label><div className="cf-form-row"><label>Business email<input name="email" type="email" autoComplete="email" placeholder="you@business.in" required /></label><label>Phone number<input name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" required /></label></div><label>What kind of business do you run?<select name="business" defaultValue="" required><option value="" disabled>Select your business</option><option>Retail or boutique</option><option>Cafe or restaurant</option><option>Salon or services</option><option>Other</option></select></label><label>Anything you’d like us to know?<textarea name="message" rows="3" placeholder="A little about your setup (optional)" /></label>{submitted && <p className="cf-form-success" role="status">Demo preview only. Your details have not been sent anywhere.</p>}<button className="cf-button cf-button-primary" type="submit">Request a demo <ArrowRight size={16} /></button><small>Please don’t enter real or sensitive personal information into this demo form.</small></form>
      </div>
    </section>
  )
}

export default function PosPrototype() {
  const [params, setParams] = useSearchParams()
  const [menuOpen, setMenuOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const reduceMotion = useReducedMotion()
  const pageIds = pages.map(({ id }) => id)
  const page = pageIds.includes(params.get('page')) ? params.get('page') : 'home'

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'CounterFlow POS | A better flow for business'
    return () => { document.title = previousTitle }
  }, [])

  function navigate(nextPage) {
    setParams(nextPage === 'home' ? {} : { page: nextPage })
    setMenuOpen(false)
    setSubmitted(false)
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  function submitDemo(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="cf">
      <div className="cf-topbar"><div className="cf-container cf-topbar-inner"><span>POINT OF SALE, MADE PRACTICAL</span><span>For shops, cafes & growing teams <ArrowRight size={13} /></span></div></div>
      <header className="cf-header"><div className="cf-container cf-nav"><button className="cf-logo" type="button" onClick={() => navigate('home')} aria-label="CounterFlow home"><span className="cf-logo-mark"><Zap size={20} fill="currentColor" /></span><span>counter<span>flow</span><small>POS THAT KEEPS UP</small></span></button><button className="cf-menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button><nav className={menuOpen ? 'cf-links cf-links-open' : 'cf-links'} aria-label="Main navigation">{pages.slice(1, 3).map(({ id, label }) => <button type="button" key={id} className={page === id ? 'is-active' : ''} onClick={() => navigate(id)}>{label}</button>)}<button className="cf-nav-demo" type="button" onClick={() => navigate('contact')}>Book a demo <ArrowRight size={15} /></button></nav></div></header>
      <main><AnimatePresence mode="wait" initial={false}><motion.div key={page} initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: .28, ease: 'easeOut' }}>{page === 'home' && <HomePage navigate={navigate} />}{page === 'product' && <ProductPage navigate={navigate} />}{page === 'pricing' && <PricingPage navigate={navigate} />}{page === 'contact' && <ContactPage submitted={submitted} onSubmit={submitDemo} />}</motion.div></AnimatePresence></main>
      <footer className="cf-footer"><div className="cf-container cf-footer-inner"><button className="cf-logo" type="button" onClick={() => navigate('home')}><span className="cf-logo-mark"><Zap size={20} fill="currentColor" /></span><span>counter<span>flow</span><small>POS THAT KEEPS UP</small></span></button><p>A little more flow at every counter.</p><nav aria-label="Footer navigation">{pages.slice(1).map(({ id, label }) => <button type="button" key={id} onClick={() => navigate(id)}>{label}</button>)}</nav><small>Fictional POS website concept · All product details, pricing and demonstrations are illustrative.</small></div></footer>
    </div>
  )
}
