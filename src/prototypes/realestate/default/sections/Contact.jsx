import { useRef, useState } from 'react'
import { gsap, useMotion } from '../motion'
import { BRAND } from '../data'

export default function Contact() {
  const root = useRef(null)
  const [submitted, setSubmitted] = useState(false)

  useMotion(root, () => {
    gsap.from('.re-contact-info > *', {
      x: -50,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: root.current, start: 'top 75%' },
    })

    gsap.from('.re-contact-form', {
      x: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: root.current, start: 'top 75%' },
    })
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section id="contact" ref={root} className="re-contact">
      <div className="re-contact-grid">
        <div className="re-contact-info">
          <span className="re-eyebrow">Get In Touch</span>
          <h2 className="re-display re-display-lg">
            Your Dream Home <span className="re-gradient-text">Awaits</span>
          </h2>
          <p className="re-body">
            Ready to find your perfect home? Our property consultants are here to guide you through every step of your journey.
          </p>

          <div className="re-contact-details">
            <div className="re-contact-detail">
              <div className="re-contact-detail-icon">📍</div>
              <div>
                <div className="re-contact-detail-label">Visit Us</div>
                <div className="re-contact-detail-value">{BRAND.address.join(', ')}</div>
              </div>
            </div>
            <div className="re-contact-detail">
              <div className="re-contact-detail-icon">📞</div>
              <div>
                <div className="re-contact-detail-label">Call Us</div>
                <div className="re-contact-detail-value">{BRAND.phone}</div>
              </div>
            </div>
            <div className="re-contact-detail">
              <div className="re-contact-detail-icon">✉️</div>
              <div>
                <div className="re-contact-detail-label">Email Us</div>
                <div className="re-contact-detail-value">{BRAND.email}</div>
              </div>
            </div>
            <div className="re-contact-detail">
              <div className="re-contact-detail-icon">🕐</div>
              <div>
                <div className="re-contact-detail-label">Working Hours</div>
                <div className="re-contact-detail-value">Mon – Sat: 10:00 AM – 7:00 PM</div>
              </div>
            </div>
          </div>
        </div>

        <form className="re-contact-form" onSubmit={handleSubmit}>
          <h3 className="re-contact-form-title">Schedule a Property Visit</h3>

          <div className="re-form-row">
            <div className="re-form-group">
              <label className="re-form-label">First Name</label>
              <input className="re-form-input" type="text" placeholder="Rajesh" required />
            </div>
            <div className="re-form-group">
              <label className="re-form-label">Last Name</label>
              <input className="re-form-input" type="text" placeholder="Sharma" required />
            </div>
          </div>

          <div className="re-form-row">
            <div className="re-form-group">
              <label className="re-form-label">Phone</label>
              <input className="re-form-input" type="tel" placeholder="+91 98765 43210" required />
            </div>
            <div className="re-form-group">
              <label className="re-form-label">Email</label>
              <input className="re-form-input" type="email" placeholder="you@example.com" required />
            </div>
          </div>

          <div className="re-form-group">
            <label className="re-form-label">Interested In</label>
            <select className="re-form-select" defaultValue="">
              <option value="" disabled>Select a property</option>
              <option>Skyline Towers – Mumbai</option>
              <option>Green Valley Estate – Bangalore</option>
              <option>Royal Heritage – Gurgaon</option>
              <option>Marina Bay Residences – Chennai</option>
              <option>Tech Park Residency – Hyderabad</option>
              <option>Palm Gardens – Noida</option>
            </select>
          </div>

          <div className="re-form-group">
            <label className="re-form-label">Message</label>
            <textarea className="re-form-textarea" placeholder="Tell us about your requirements..." rows="4" />
          </div>

          <button type="submit" className="re-form-submit">
            {submitted ? '✓ Request Sent!' : 'Request Callback'}
          </button>
        </form>
      </div>
    </section>
  )
}
