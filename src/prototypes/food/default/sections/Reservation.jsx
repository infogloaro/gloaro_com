import { lazy, Suspense, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SceneCanvas from '../../../core/SceneCanvas'
import { gsap, useMotion } from '../motion'
import { Split } from '../Split'
import { BRAND, MEDIA, TIME_SLOTS, findDish, inr } from '../data'

const TableScene = lazy(() => import('./TableScene'))
const ease = [0.16, 1, 0.3, 1]
const WORDS = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']

function buildDays() {
  const out = []
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  for (let i = 0; out.length < 14; i++) {
    const day = new Date(d)
    day.setDate(d.getDate() + i)
    out.push({
      iso: day.toISOString().slice(0, 10),
      dow: day.toLocaleDateString('en-IN', { weekday: 'short' }),
      date: day.getDate(),
      month: day.toLocaleDateString('en-IN', { month: 'short' }),
      long: day.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }),
      closed: day.getDay() === 1,
    })
  }
  return out
}

// Deterministic "already booked" slots so the demo looks lived-in.
const isBooked = (iso, slot) => {
  let h = 0
  for (const ch of iso + slot) h = (h * 31 + ch.charCodeAt(0)) % 997
  return h % 4 === 0
}

const makeCode = () => `ME-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

function downloadIcs({ day, time, guests, name, code }) {
  const [hh, mm] = time.split(':').map(Number)
  const start = `${day.iso.replace(/-/g, '')}T${String(hh).padStart(2, '0')}${String(mm).padStart(2, '0')}00`
  const endH = hh + 2
  const end = `${day.iso.replace(/-/g, '')}T${String(endH).padStart(2, '0')}${String(mm).padStart(2, '0')}00`
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Maison Ember//Reservation//EN', 'BEGIN:VEVENT',
    `UID:${code}@maisonember.in`, `DTSTART;TZID=Asia/Kolkata:${start}`, `DTEND;TZID=Asia/Kolkata:${end}`,
    `SUMMARY:Dinner at Maison Ember (${guests})`, `LOCATION:${BRAND.address.join(', ')}`,
    `DESCRIPTION:Reservation ${code} for ${name}`, 'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `maison-ember-${code}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

export default function Reservation({ list, onRemove, go }) {
  const root = useRef(null)
  const [days] = useState(buildDays)
  const [nowHm] = useState(() => new Date().toTimeString().slice(0, 5))
  const unavailable = (iso, slot) => isBooked(iso, slot) || (iso === days[0].iso && slot <= nowHm)
  const [dayIso, setDayIso] = useState(() => days.find((d) => !d.closed).iso)
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState(2)
  const [form, setForm] = useState({ name: '', phone: '', email: '', note: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | done
  const [booking, setBooking] = useState(null)

  const day = days.find((d) => d.iso === dayIso)
  const dishes = list.map(findDish).filter(Boolean)

  useMotion(root, () => {
    gsap.from('.me-res-title .me-c', {
      yPercent: (i) => (i % 2 ? 120 : -120), opacity: 0, stagger: 0.03, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: root.current, start: 'top 70%', toggleActions: 'play none none reverse' },
    })
    gsap.fromTo('.me-res-stage', { clipPath: 'inset(12% 12% 12% 12% round 400px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'top 25%', scrub: 1 },
    })
  })

  const pickDay = (d) => {
    if (d.closed) return
    setDayIso(d.iso)
    if (time && unavailable(d.iso, time)) setTime('')
  }

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!time) next.time = 'Choose a time'
    if (form.name.trim().length < 2) next.name = 'Your name, please'
    if (!/^[+\d][\d\s-]{7,15}$/.test(form.phone.trim())) next.phone = 'A number we can reach you on'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'That email looks off'
    setErrors(next)
    if (Object.keys(next).length) return
    setStatus('sending')
    setTimeout(() => {
      setBooking({ day, time, guests, name: form.name.trim(), code: makeCode(), dishes })
      setStatus('done')
    }, 1100)
  }

  const field = (k, label, props = {}) => (
    <label className={`me-field ${errors[k] ? 'err' : ''}`}>
      <span>{label}</span>
      <input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} {...props} />
      {errors[k] && <em>{errors[k]}</em>}
    </label>
  )

  return (
    <section id="reserve" ref={root} className="me-res">
      <div className="me-res-head">
        <span className="me-eyebrow">Reservations · 42 seats</span>
        <h2 className="me-res-title"><Split text="Pull up a chair" /></h2>
      </div>

      <div className="me-res-grid">
        <div className="me-res-stage">
          <SceneCanvas
            className="me-res-canvas"
            camera={{ position: [0, 1.55, 1.35], fov: 34 }}
            fallback={<img className="me-res-fallback" src={MEDIA.pizzaSlices} alt="" />}
          >
            {({ tier }) => <Suspense fallback={null}><TableScene guests={guests} tier={tier} /></Suspense>}
          </SceneCanvas>
          <div className="me-res-caption" aria-live="polite">
            A table for{' '}
            <span className="me-roll">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.em key={guests} initial={{ y: '100%' }} animate={{ y: '0%' }} exit={{ y: '-100%' }} transition={{ duration: 0.6, ease }}>
                  {WORDS[guests]}
                </motion.em>
              </AnimatePresence>
            </span>
          </div>
        </div>

        <div className="me-res-panel">
          <AnimatePresence mode="wait">
            {status !== 'done' ? (
              <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.6, ease }}>
                <fieldset>
                  <legend>Guests</legend>
                  <div className="me-stepper">
                    <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} disabled={guests <= 1} aria-label="Fewer guests">−</button>
                    <b>{guests}</b>
                    <button type="button" onClick={() => setGuests(Math.min(8, guests + 1))} disabled={guests >= 8} aria-label="More guests">+</button>
                    <small>Larger party? Call {BRAND.phone}</small>
                  </div>
                </fieldset>

                <fieldset>
                  <legend>Date</legend>
                  <div className="me-days">
                    {days.map((d) => (
                      <button
                        type="button"
                        key={d.iso}
                        className={`me-day ${d.iso === dayIso ? 'on' : ''}`}
                        disabled={d.closed}
                        onClick={() => pickDay(d)}
                        aria-pressed={d.iso === dayIso}
                        title={d.closed ? 'Closed on Mondays' : d.long}
                      >
                        <small>{d.dow}</small><b>{d.date}</b><small>{d.closed ? 'Closed' : d.month}</small>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend>Time {errors.time && <em className="me-err-inline">{errors.time}</em>}</legend>
                  <div className="me-slots">
                    {TIME_SLOTS.map((s) => {
                      const booked = unavailable(dayIso, s)
                      return (
                        <button type="button" key={s} disabled={booked} className={`me-slot ${time === s ? 'on' : ''}`} onClick={() => setTime(s)} aria-pressed={time === s}>
                          {s}{booked && <small>{isBooked(dayIso, s) ? 'full' : 'passed'}</small>}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>

                <div className="me-fields">
                  {field('name', 'Name', { autoComplete: 'name' })}
                  {field('phone', 'Phone', { type: 'tel', autoComplete: 'tel' })}
                  {field('email', 'Email (optional)', { type: 'email', autoComplete: 'email' })}
                  {field('note', 'Occasion or request (optional)')}
                </div>

                <div className="me-res-list">
                  <span className="me-eyebrow">On your table</span>
                  {dishes.length ? (
                    <ul>
                      {dishes.map((d) => (
                        <li key={d.id}>
                          {d.name} <span>{inr(d.price)}</span>
                          <button type="button" onClick={() => onRemove(d.id)} aria-label={`Remove ${d.name}`}>×</button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Nothing pre-ordered. <button type="button" className="me-link-btn" onClick={() => go('menu')}>Browse the menu <i>→</i></button></p>
                  )}
                </div>

                <button className="me-pill dark big" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Holding your table…' : `Reserve · ${day.long}${time ? `, ${time}` : ''}`}
                </button>
              </motion.form>
            ) : (
              <motion.div key="done" className="me-res-done" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease }}>
                <span className="me-eyebrow">Confirmed · {booking.code}</span>
                <h3>See you {booking.day.long}, at {booking.time}.</h3>
                <p>A table for {WORDS[booking.guests]}, under {booking.name}. We&apos;ll hold it for fifteen minutes.</p>
                {booking.dishes.length > 0 && <p>We&apos;ll have {booking.dishes.map((d) => d.name).join(', ')} ready to fire.</p>}
                <div className="me-res-done-actions">
                  <button className="me-pill dark" onClick={() => downloadIcs(booking)}>Add to calendar</button>
                  <button className="me-link-btn" onClick={() => setStatus('idle')}>Modify reservation <i>→</i></button>
                  <button className="me-link-btn" onClick={() => go('visit')}>How to find us <i>→</i></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
