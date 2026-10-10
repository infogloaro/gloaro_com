import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  Clock3,
  CreditCard,
  HeartPulse,
  Hospital,
  Languages,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  UserRoundSearch,
} from 'lucide-react'
import { doctors, insurancePartners, specialties } from './hospitalData'

const imageUrl = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

function PageHeading({ eyebrow, title, text }) {
  return (
    <motion.div className="ew-page-heading" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <span className="ew-eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </motion.div>
  )
}

function AppointmentForm({ submitted, onSubmit, preferredSpecialty }) {
  const department = specialties.some(({ name }) => name === preferredSpecialty) ? preferredSpecialty : ''
  return (
    <form className="ew-form" onSubmit={onSubmit}>
      <h3>Request an appointment</h3><p>Our care coordinator will call you to confirm a convenient time.</p>
      <label>Full name<input name="name" autoComplete="name" placeholder="Your name" required /></label>
      <div className="ew-form-row">
        <label>Mobile number<input name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" required /></label>
        <label>Type of care<select name="department" defaultValue={department} required><option value="" disabled>Select a speciality</option>{specialties.map(({ name }) => <option key={name}>{name}</option>)}</select></label>
      </div>
      {submitted && <p className="ew-form-note" role="status">This is a website preview. Your request has not been sent to a hospital.</p>}
      <button className="ew-button ew-button-primary" type="submit"><CalendarDays size={17} /> Request a call back</button>
      <small className="ew-form-privacy">For medical emergencies, call 112 or visit the nearest emergency department. Do not use this form for urgent care.</small>
    </form>
  )
}

function SpecialtyDirectory({ onBook }) {
  const reduceMotion = useReducedMotion()
  return (
    <div className="ew-services ew-specialty-grid">
      {specialties.map(({ icon: Icon, name, text }, index) => (
        <motion.article
          className="ew-service-card"
          key={name}
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4, delay: index * 0.045 }}
        >
          <span className="ew-service-icon"><Icon size={24} /></span><h3>{name}</h3><p>{text}</p>
          <button className="ew-card-link ew-card-button" type="button" onClick={() => onBook(name)}>Book a consultation <ArrowRight size={15} /></button>
        </motion.article>
      ))}
    </div>
  )
}

function DoctorDirectory({ onBook, preferredSpecialty }) {
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState(specialties.some(({ name }) => name === preferredSpecialty) ? preferredSpecialty : '')
  const reduceMotion = useReducedMotion()
  const results = doctors.filter((doctor) => `${doctor.name} ${doctor.specialty}`.toLowerCase().includes(search.toLowerCase()) && (!specialty || doctor.specialty === specialty))

  return (
    <>
      <div className="ew-directory-tools">
        <label className="ew-search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by doctor or speciality" aria-label="Search doctors" /></label>
        <select value={specialty} onChange={(event) => setSpecialty(event.target.value)} aria-label="Filter doctors by speciality">
          <option value="">All specialities</option>{[...new Set(doctors.map(({ specialty: name }) => name))].map((name) => <option key={name}>{name}</option>)}
        </select>
        <span>{results.length} specialists</span>
      </div>
      <div className="ew-doctor-grid ew-directory-grid">
        {results.map((doctor, index) => (
          <motion.article className="ew-doctor" key={doctor.name} initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.055 }}>
            <img src={imageUrl(doctor.image, 700)} alt={doctor.name} loading="lazy" />
            <div><span>{doctor.specialty}</span><h3>{doctor.name}</h3><p>{doctor.experience}</p><button type="button" onClick={() => onBook(doctor.specialty)}>Request a visit <ArrowRight size={14} /></button></div>
          </motion.article>
        ))}
        {!results.length && <p className="ew-empty-state">No doctors match that search. Try another name or speciality.</p>}
      </div>
    </>
  )
}

export default function HospitalPages({ page, navigate, submitted, onSubmit, preferredSpecialty }) {
  return (
    <>
      {page === 'specialties' && (
        <section className="ew-inner-page ew-container">
          <PageHeading eyebrow="COMPLETE CARE, CLOSE TO HOME" title={<>The right expertise.<br /><em>All in one place.</em></>} text="Explore our specialist departments and find a care team that understands your needs. Our coordinators can help you choose where to begin." />
          <SpecialtyDirectory onBook={(name) => navigate('contact', name)} />
          <div className="ew-photo-banner">
            <img src={imageUrl('photo-1579684385127-1ef15d508118', 1400)} alt="Doctor consulting with a patient" loading="lazy" />
            <div><span className="ew-eyebrow">PERSONALISED, COORDINATED CARE</span><h2>Your health story is unique.<br />Your care should be too.</h2><button className="ew-button ew-button-primary" type="button" onClick={() => navigate('contact')}>Talk to our care team <ArrowRight size={16} /></button></div>
          </div>
        </section>
      )}

      {page === 'doctors' && (
        <section className="ew-inner-page ew-container">
          <PageHeading eyebrow="MEET YOUR CARE TEAM" title={<>Experience you trust.<br /><em>People who listen.</em></>} text="Meet our doctors—experienced specialists committed to clear communication and care shaped around you." />
          <DoctorDirectory onBook={(name) => navigate('contact', name)} preferredSpecialty={preferredSpecialty} />
        </section>
      )}

      {page === 'patients' && (
        <section className="ew-inner-page ew-container">
          <PageHeading eyebrow="WE'RE WITH YOU AT EVERY STEP" title={<>Your visit, made<br /><em>a little easier.</em></>} text="From getting ready for your appointment to finding your way around, here are the essentials for patients and families." />
          <div className="ew-patient-grid">
            <article><span><CalendarDays /></span><h3>Before your visit</h3><p>Bring a photo ID, appointment confirmation, current medicines, insurance details and any recent reports or scans.</p><button onClick={() => navigate('contact')} type="button">Book a visit <ArrowRight size={15} /></button></article>
            <article><span><BedDouble /></span><h3>Inpatient care</h3><p>Our admissions team will guide you through registration, room options and the care plan with your doctor.</p><a href="tel:+914440001080">Call admissions <ArrowRight size={15} /></a></article>
            <article><span><Languages /></span><h3>Here to help</h3><p>Ask our patient desk about Tamil, English or Hindi language support, accessibility, visiting hours or help navigating the hospital.</p><button onClick={() => navigate('contact')} type="button">Contact patient services <ArrowRight size={15} /></button></article>
            <article><span><CreditCard /></span><h3>Insurance & billing</h3><p>We offer cashless treatment with major insurers and a transparent billing desk to help you understand every charge.</p><button onClick={() => navigate('contact')} type="button">Ask about coverage <ArrowRight size={15} /></button></article>
          </div>
          <div className="ew-insurance-strip ew-insurance-strip-inline">
            <div className="ew-insurance-inner">
              <span className="ew-insurance-label"><ShieldCheck size={17} /> Cashless claims accepted from</span>
              <ul>{insurancePartners.map((name) => <li key={name}>{name}</li>)}</ul>
            </div>
          </div>
          <div className="ew-visitor-feature">
            <img src={imageUrl('photo-1584982751601-97dcc096659c', 1100)} alt="Nurse supporting a patient at a hospital" loading="lazy" />
            <div><span className="ew-eyebrow">PATIENTS & FAMILIES</span><h2>We believe healing is a team effort.</h2><p>Families and caregivers are an important part of the journey. Our team is here to keep you informed and help you feel at home.</p><button className="ew-text-link" type="button" onClick={() => navigate('contact')}>Ask us a question <ArrowRight size={16} /></button></div>
          </div>
          <div className="ew-faq"><span className="ew-eyebrow">GOOD TO KNOW</span><h2>Frequently asked questions</h2><details><summary>What should I bring to my appointment?</summary><p>Bring a photo ID, appointment details, current medication list and relevant medical reports. Your care team will let you know if anything else is needed.</p></details><details><summary>Can I request a specific doctor?</summary><p>Yes. Share the speciality or doctor's name when you request an appointment and our team will help check availability.</p></details><details><summary>What number should I call for an emergency in India?</summary><p>For immediate emergencies in India, call 112. For ambulance assistance, you can also dial 108 where available. Do not use this demo website for urgent care.</p></details></div>
        </section>
      )}

      {page === 'about' && (
        <section className="ew-inner-page ew-container">
          <PageHeading eyebrow="ROOTED IN OUR COMMUNITY" title={<>A hospital with heart.<br /><em>Care with purpose.</em></>} text="Swasthya Care Hospitals is a fictional hospital brand concept, imagined for a contemporary Indian community hospital website." />
          <div className="ew-about-story"><img src={imageUrl('photo-1551190822-a9333d879b1f', 1200)} alt="Hospital doctor and nurse team" loading="lazy" /><div><span className="ew-eyebrow">OUR PROMISE TO YOU</span><h2>Better care begins with listening.</h2><p>We bring experienced clinicians, thoughtful technology and a warm welcome together—so patients and families can feel seen, informed and supported.</p><p>From routine check-ups to specialist treatment, we believe great healthcare should feel personal, clear and close to home.</p><button className="ew-button ew-button-primary" type="button" onClick={() => navigate('specialties')}>Explore our specialities <ArrowRight size={16} /></button></div></div>
          <div className="ew-values-grid"><div><ShieldCheck /><b>Safety, always</b><span>Thoughtful standards at every step of care.</span></div><div><HeartPulse /><b>People before process</b><span>Respect, empathy and clear conversations.</span></div><div><Hospital /><b>Care that connects</b><span>Specialists working together for you.</span></div></div>
          <div className="ew-photo-mosaic"><img src={imageUrl('photo-1576091160550-2173dba999ef', 900)} alt="Doctor discussing a care plan with a patient" loading="lazy" /><img src={imageUrl('photo-1581056771107-24ca5f033842', 900)} alt="Modern hospital corridor" loading="lazy" /><img src={imageUrl('photo-1551076805-e1869033e561', 900)} alt="Medical professional preparing for patient care" loading="lazy" /></div>
        </section>
      )}

      {page === 'contact' && (
        <section className="ew-inner-page ew-contact-page">
          <div className="ew-container">
            <PageHeading eyebrow="WE'RE HERE TO HELP" title={<>Let’s find your<br /><em>next step.</em></>} text="Book a consultation, ask a question or speak with our team. We’ll help you find the right department." />
            <div className="ew-appointment-grid ew-contact-grid">
              <div className="ew-contact-details">
                <div><span><Phone /></span><p><b>Appointments & enquiries</b><a href="tel:+914440001080">+91 44 4000 1080</a><small>Daily, 8:00 am – 8:00 pm</small></p></div>
                <div><span><MapPin /></span><p><b>Visit Swasthya Care Hospitals</b><small>18 Health Avenue, Anna Nagar<br />Chennai, Tamil Nadu 600040</small></p></div>
                <div><span><Clock3 /></span><p><b>Emergency department</b><small>Open 24 hours, every day</small><a href="tel:112">Emergency services: 112</a></p></div>
                <div><span><UserRoundSearch /></span><p><b>Patient support</b><small>Ask about accessibility, languages and visiting hours.</small></p></div>
              </div>
              <AppointmentForm submitted={submitted} onSubmit={onSubmit} preferredSpecialty={preferredSpecialty} />
            </div>
            <div className="ew-map-card"><img src={imageUrl('photo-1538108149393-fbbd81895907', 1400)} alt="Swasthya hospital patient room" loading="lazy" /><div><MapPin size={19} /><span><b>Find us in Chennai</b><small>Anna Nagar · Tamil Nadu</small></span></div></div>
          </div>
        </section>
      )}
    </>
  )
}
