import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import HospitalPages from './HospitalPages'
import { doctors, insurancePartners, testimonials } from './hospitalData'
import {
  Activity,
  ArrowRight,
  Baby,
  CalendarDays,
  CheckCircle2,
  Clock3,
  HeartPulse,
  MapPin,
  Menu,
  Microscope,
  Phone,
  Quote,
  ShieldCheck,
  Star,
  UsersRound,
  X,
} from 'lucide-react'
import './healthcare.css'

const services = [
  { icon: HeartPulse, name: 'Heart & vascular', text: 'Expert care for your heart, from prevention to recovery.' },
  { icon: Baby, name: 'Maternity & children', text: 'Thoughtful support for every little milestone and new beginning.' },
  { icon: Microscope, name: 'Diagnostics & imaging', text: 'Clear answers with advanced imaging and laboratory services.' },
  { icon: Activity, name: 'Emergency care', text: 'A skilled emergency team, here for you around the clock.' },
]

const pageLinks = [
  { id: 'home', label: 'Home' },
  { id: 'specialties', label: 'Specialities' },
  { id: 'doctors', label: 'Our doctors' },
  { id: 'patients', label: 'Patient guide' },
  { id: 'about', label: 'About us' },
  { id: 'contact', label: 'Contact' },
]

function imageUrl(id, width = 900) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`
}

const heroCopyVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.12 } },
}

const heroItemVariants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

function CountUp({ value, suffix = '', reduceMotion }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.7 })
  const count = useMotionValue(0)
  const spring = useSpring(count, { stiffness: 55, damping: 18, mass: 0.8 })
  const display = useTransform(spring, (latest) => `${Math.round(latest)}${suffix}`)

  useEffect(() => {
    if (!inView) return
    if (reduceMotion) count.jump(value)
    else count.set(value)
  }, [count, inView, reduceMotion, value])

  return <motion.span ref={ref} aria-label={`${value}${suffix}`}>{reduceMotion ? `${value}${suffix}` : display}</motion.span>
}

export default function HealthcarePrototype() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [params, setParams] = useSearchParams()
  const page = pageLinks.some(({ id }) => id === params.get('page')) ? params.get('page') : 'home'
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const originalTitle = document.title
    document.title = 'Swasthya Care Hospitals | Chennai'
    return () => {
      document.title = originalTitle
    }
  }, [])

  const navigate = (pageId, specialty = '') => {
    const next = new URLSearchParams()
    if (pageId !== 'home') next.set('page', pageId)
    if (specialty) next.set('specialty', specialty)
    setParams(next)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="ew">
      <div className="ew-topbar">
        <div className="ew-container ew-topbar-inner">
          <span><Clock3 size={15} /> Open 24 hours, every day</span>
          <a href="tel:112"><Phone size={15} /> Emergency: Call 112</a>
        </div>
      </div>

      <header className="ew-header">
        <div className="ew-container ew-nav">
          <a className="ew-brand" href="?page=home" onClick={(event) => { event.preventDefault(); navigate('home') }} aria-label="Swasthya Care Hospitals home">
            <span className="ew-brand-mark"><HeartPulse size={24} /></span>
            <span>swasthya<small>CARE HOSPITALS</small></span>
          </a>
          <button className="ew-menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}>
            {menuOpen ? <X /> : <Menu />}
          </button>
          <nav className={menuOpen ? 'ew-links ew-links-open' : 'ew-links'} aria-label="Main navigation">
            {pageLinks.slice(1).map(({ id, label }) => <a key={id} className={page === id ? 'ew-nav-active' : ''} href={`?page=${id}`} aria-current={page === id ? 'page' : undefined} onClick={(event) => { event.preventDefault(); navigate(id) }}>{label}</a>)}
            <a className="ew-nav-cta" href="?page=contact" onClick={(event) => { event.preventDefault(); navigate('contact') }}>Book an appointment <ArrowRight size={16} /></a>
          </nav>
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page}
            className="ew-page-transition"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
          {page === 'home' ? (
            <>
        <section className="ew-hero" id="home">
          <div className="ew-container ew-hero-grid">
            <motion.div className="ew-hero-copy" variants={heroCopyVariants} initial={reduceMotion ? false : 'hidden'} animate="show">
              <motion.span className="ew-eyebrow" variants={heroItemVariants}><span /> HERE FOR YOUR HEALTH</motion.span>
              <motion.h1 variants={heroItemVariants}>Care that sees <em>all of you.</em></motion.h1>
              <motion.p variants={heroItemVariants}>Advanced medical expertise with the warmth of Indian hospitality. Find compassionate, connected care for every stage of life.</motion.p>
              <motion.div className="ew-hero-actions" variants={heroItemVariants}>
                <motion.a className="ew-button ew-button-primary" href="?page=contact" onClick={(event) => { event.preventDefault(); navigate('contact') }} whileHover={reduceMotion ? undefined : { y: -3, scale: 1.02 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>Book an appointment <ArrowRight size={17} /></motion.a>
                <a className="ew-text-link" href="?page=specialties" onClick={(event) => { event.preventDefault(); navigate('specialties') }}>Explore our specialities <ArrowRight size={16} /></a>
              </motion.div>
              <motion.div className="ew-hero-trust" variants={heroItemVariants}><span className="ew-avatar-stack"><i>A</i><i>M</i><i>R</i></span><span><b>Rooted in care. Here for you.</b><small>Serving Chennai and Tamil Nadu</small></span></motion.div>
            </motion.div>
            <motion.div className="ew-hero-visual" initial={reduceMotion ? false : { opacity: 0, x: 26 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
              <motion.img src={imageUrl('photo-1538108149393-fbbd81895907', 1200)} alt="Bright, welcoming modern hospital room" fetchPriority="high" initial={reduceMotion ? false : { opacity: 0, scale: 1.035 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }} />
              <motion.div className="ew-float-card" animate={reduceMotion ? undefined : { y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}><span className="ew-float-icon"><ShieldCheck size={22} /></span><span><b>Care you can count on</b><small>One team, by your side</small></span><CheckCircle2 className="ew-float-check" size={19} /></motion.div>
              <span className="ew-image-caption">A healthier tomorrow starts here.</span>
            </motion.div>
          </div>
        </section>

        <section className="ew-highlights" aria-label="Hospital highlights">
          <div className="ew-container ew-highlights-grid">
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.02 }}><b><CountUp value={35} suffix="+" reduceMotion={reduceMotion} /></b><span>years caring for our community</span></motion.div>
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}><b><CountUp value={120} suffix="+" reduceMotion={reduceMotion} /></b><span>trusted doctors and specialists</span></motion.div>
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.18 }}><b>24/7</b><span>emergency care, always open</span></motion.div>
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.26 }}><b>One team</b><span>coordinated around your needs</span></motion.div>
          </div>
        </section>

        <motion.section className="ew-section ew-care" id="care" initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.6 }}>
          <div className="ew-container">
            <div className="ew-section-heading">
              <div><span className="ew-eyebrow">CARE FOR EVERY CHAPTER</span><h2>Here for what<br />matters most.</h2></div>
              <p>From your first checkup to more complex care, our teams bring the right expertise together—so you can focus on feeling better.</p>
            </div>
            <div className="ew-services">
              {services.map(({ icon: Icon, name, text }, index) => (
                <motion.a className="ew-service-card" href="?page=specialties" key={name} onClick={(event) => { event.preventDefault(); navigate('specialties') }} initial={reduceMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.42, delay: index * 0.07 }}>
                  <span className="ew-service-icon"><Icon size={24} /></span>
                  <h3>{name}</h3><p>{text}</p>
                  <span className="ew-card-link">Explore care <ArrowRight size={15} /></span>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section className="ew-about" id="about" initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.6 }}>
          <div className="ew-container ew-about-grid">
            <div className="ew-about-image"><img src={imageUrl('photo-1576091160399-112ba8d25d1d', 1000)} alt="Care team member speaking with a patient" loading="lazy" /><span><UsersRound size={19} /> Care, built around you</span></div>
            <div className="ew-about-copy"><span className="ew-eyebrow">GOOD MEDICINE STARTS WITH LISTENING</span><h2>More than a hospital.<br /><em>A partner in your health.</em></h2><p>Healthcare can feel complicated. We make it more human—with a connected team, clear answers, and a plan shaped around what matters to you.</p><ul><li><CheckCircle2 size={18} /> Personal care plans, made together</li><li><CheckCircle2 size={18} /> Specialists who work as one team</li><li><CheckCircle2 size={18} /> Support for the whole journey</li></ul><a className="ew-text-link" href="#doctors">Meet the people behind your care <ArrowRight size={16} /></a></div>
          </div>
        </motion.section>

        <motion.section className="ew-section ew-doctors" id="doctors" initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.6 }}>
          <div className="ew-container">
            <div className="ew-section-heading"><div><span className="ew-eyebrow">EXPERTISE WITH A HUMAN TOUCH</span><h2>Meet your care team.</h2></div><a className="ew-text-link" href="?page=doctors" onClick={(event) => { event.preventDefault(); navigate('doctors') }}>Find the right doctor <ArrowRight size={16} /></a></div>
            <div className="ew-doctor-grid">
              {doctors.slice(0, 3).map((doctor, index) => <motion.article className="ew-doctor" key={doctor.name} initial={reduceMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.42, delay: index * 0.07 }}><img src={imageUrl(doctor.image, 700)} alt={doctor.name} loading="lazy" /><div><span>{doctor.specialty}</span><h3>{doctor.name}</h3><button type="button" onClick={() => navigate('contact', doctor.specialty)}>Request a visit <ArrowRight size={14} /></button></div></motion.article>)}
            </div>
            <div className="ew-center-action"><a className="ew-button ew-button-outline" href="?page=doctors" onClick={(event) => { event.preventDefault(); navigate('doctors') }}>Meet all our doctors <ArrowRight size={16} /></a></div>
          </div>
        </motion.section>

        <motion.section className="ew-section ew-testimonials" id="testimonials" initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.6 }}>
          <div className="ew-container">
            <div className="ew-section-heading"><div><span className="ew-eyebrow">IN THEIR OWN WORDS</span><h2>Stories from<br />patients like you.</h2></div><p>Real experiences, shared with permission—because trust is earned one visit at a time.</p></div>
            <div className="ew-testimonial-grid">
              {testimonials.map(({ quote, name, context, rating }, index) => (
                <motion.figure className="ew-testimonial-card" key={name} initial={reduceMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.42, delay: index * 0.08 }}>
                  <Quote className="ew-quote-mark" size={26} aria-hidden="true" />
                  <div className="ew-stars" aria-label={`${rating} out of 5 stars`}>{Array.from({ length: rating }).map((_, starIndex) => <Star key={starIndex} size={14} />)}</div>
                  <blockquote>{quote}</blockquote>
                  <figcaption><b>{name}</b><small>{context}</small></figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section className="ew-insurance-strip" initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }}>
          <div className="ew-container ew-insurance-inner">
            <span className="ew-insurance-label"><ShieldCheck size={17} /> Cashless claims accepted from</span>
            <ul>{insurancePartners.map((name) => <li key={name}>{name}</li>)}</ul>
          </div>
        </motion.section>

        <motion.section className="ew-home-gallery" initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.6 }}>
          <div className="ew-container">
            <div className="ew-section-heading"><div><span className="ew-eyebrow">A SPACE TO HEAL</span><h2>Thoughtful care,<br />in every detail.</h2></div><p>Modern facilities and reassuring people help make every visit feel a little easier.</p></div>
            <div className="ew-gallery-grid">
              <motion.img whileHover={reduceMotion ? undefined : { scale: 1.035 }} transition={{ duration: 0.35 }} src={imageUrl('photo-1538108149393-fbbd81895907', 900)} alt="Bright, welcoming patient room" loading="lazy" />
              <motion.img whileHover={reduceMotion ? undefined : { scale: 1.035 }} transition={{ duration: 0.35 }} src={imageUrl('photo-1586773860418-d37222d8fce3', 700)} alt="Modern diagnostic equipment in a clinical setting" loading="lazy" />
              <motion.img whileHover={reduceMotion ? undefined : { scale: 1.035 }} transition={{ duration: 0.35 }} src={imageUrl('photo-1579684385127-1ef15d508118', 700)} alt="Doctor caring for a patient in a clinic" loading="lazy" />
              <motion.img whileHover={reduceMotion ? undefined : { scale: 1.035 }} transition={{ duration: 0.35 }} src={imageUrl('photo-1551601651-2a8555f1a136', 700)} alt="Hospital care team working together" loading="lazy" />
            </div>
            <div className="ew-home-gallery-link"><button className="ew-text-link" type="button" onClick={() => navigate('about')}>Discover Swasthya Care <ArrowRight size={16} /></button></div>
          </div>
        </motion.section>

        <motion.section className="ew-appointment" id="appointment" initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.6 }}>
          <div className="ew-container ew-appointment-grid">
            <div className="ew-appointment-copy"><span className="ew-eyebrow">YOUR NEXT STEP, MADE SIMPLE</span><h2>Let’s get you<br />feeling your best.</h2><p>Tell us what you need and our care team will help you find the right place to start.</p><a href="tel:+914440001080"><Phone size={18} /> Prefer to call? +91 44 4000 1080</a><div className="ew-location"><MapPin size={18} /><span><b>Swasthya Care Hospitals</b><small>18 Health Avenue, Anna Nagar, Chennai</small></span></div></div>
            <form className="ew-form" onSubmit={handleSubmit}>
              <h3>Request an appointment</h3><p>Share a few details to get started.</p>
              <label>Full name<input name="name" autoComplete="name" placeholder="Your name" required /></label>
              <div className="ew-form-row"><label>Mobile number<input name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" required /></label><label>Type of care<select name="department" defaultValue="" required><option value="" disabled>Select a service</option><option>General medicine</option><option>Cardiology</option><option>Orthopaedics</option><option>Paediatrics</option><option>Other speciality</option></select></label></div>
              {submitted && <p className="ew-form-note" role="status">This is a website preview. Your request has not been sent to a hospital.</p>}
              <button className="ew-button ew-button-primary" type="submit"><CalendarDays size={17} /> Request a call back</button>
              <small className="ew-form-privacy">For medical emergencies in India, call 112 or visit your nearest emergency department.</small>
            </form>
          </div>
        </motion.section>

            </>
          ) : <HospitalPages page={page} navigate={navigate} submitted={submitted} onSubmit={handleSubmit} preferredSpecialty={params.get('specialty')} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="ew-footer"><div className="ew-container ew-footer-inner"><a className="ew-brand ew-footer-brand" href="?page=home" onClick={(event) => { event.preventDefault(); navigate('home') }}><span className="ew-brand-mark"><HeartPulse size={23} /></span><span>swasthya<small>CARE HOSPITALS</small></span></a><nav aria-label="Footer navigation">{pageLinks.slice(1).map(({ id, label }) => <a key={id} href={`?page=${id}`} onClick={(event) => { event.preventDefault(); navigate(id) }}>{label}</a>)}</nav><span>Fictional website concept. Names, contact details, figures and imagery are illustrative only.</span></div></footer>
    </div>
  )
}
