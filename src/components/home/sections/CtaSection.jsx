import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { AlertCircle, ArrowRight, CheckCircle2, Mail, MapPin, PhoneCall, Send } from 'lucide-react'
import { ease, spring, transition, viewportOnce } from '../../../lib/motion'
import { submitForm } from '../../../lib/submitForm'
import { Aurora } from '../../motion/Ambient'
import { Magnetic } from '../../motion/Interactive'
import { SplitWords } from '../../motion/Text'

const CONTACT_EMAIL = 'info@gloaro.com'

// Input that lifts on focus, with a reserved error line so validation
// messages never shift the layout.
function Field({ label, error, attempt, children }) {
  const shake = useAnimationControls()
  const hasError = Boolean(error)

  useEffect(() => {
    if (hasError) shake.start({ x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.4, ease: ease.entrance } })
  }, [attempt, hasError, shake])

  return (
    <label className="group block">
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">{label}</span>
      <motion.span
        animate={shake}
        className="relative mt-1.5 block transition-transform duration-200 group-focus-within:-translate-y-0.5"
      >
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-xl opacity-0 shadow-[0_12px_28px_rgba(255,174,19,0.28)] transition-opacity duration-200 group-focus-within:opacity-100" />
        {children}
      </motion.span>
      <span className="block h-5 pt-1">
        <AnimatePresence>
          {error && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4, transition: transition.exit }}
              transition={transition.micro}
              className="flex items-center gap-1 text-xs font-semibold text-[#ffb4b4]"
            >
              <AlertCircle className="h-3.5 w-3.5" />
              {error.message}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </label>
  )
}

const input = (hasError) => `relative w-full rounded-xl border bg-white px-4 py-3 text-sm font-medium outline-none transition-colors ${hasError ? 'border-[#ff6b6b]' : 'border-white/20 focus:border-[#ffae13]'}`

// Submitting saves the enquiry for the GloAro team. If that fails,
// it falls back to opening the visitor's email client with the details prefilled.
function EnquiryForm() {
  const [sent, setSent] = useState(null)
  const { register, handleSubmit, reset, formState: { errors, submitCount, isSubmitting } } = useForm()

  const onSubmit = async ({ name, email, message }) => {
    const delivered = await submitForm('Home page enquiry', { Name: name, Email: email, Project: message })
    if (!delivered) {
      const subject = encodeURIComponent(`Project enquiry from ${name}`)
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
      window.location.assign(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`)
    }
    setSent(delivered ? 'saved' : 'email')
    reset()
  }

  return (
    <div className="relative min-h-[460px] rounded-[28px] border border-white/15 bg-white/[0.07] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.25)] sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: transition.exit }}
            transition={spring.surface}
            className="flex h-full min-h-[400px] flex-col items-center justify-center text-center"
            role="status"
          >
            <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ ...spring.interactive, delay: 0.1 }}>
              <CheckCircle2 className="h-14 w-14 text-[#4ade80]" />
            </motion.span>
            <h3 className="mt-4 font-outfit text-2xl font-semibold text-white">
              {sent === 'saved' ? 'Enquiry sent' : 'Your email is ready to send'}
            </h3>
            <p className="mt-2 max-w-xs text-sm font-medium text-white/75">
              {sent === 'saved'
                ? "Our team has your details and will reply within one business day."
                : "We opened your email app with the details filled in. Hit send and we'll reply within one business day."}
            </p>
            <button type="button" onClick={() => setSent(null)} className="link-wipe mt-6 text-sm font-bold text-[#ffd36e]">
              Write another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: transition.exit }}
            className="space-y-1"
          >
            <h3 className="mb-4 font-outfit text-xl font-semibold text-white">Tell us about your project</h3>
            <Field label="Your name" error={errors.name} attempt={submitCount}>
              <input className={input(errors.name)} autoComplete="name" {...register('name', { required: 'Please tell us your name' })} />
            </Field>
            <Field label="Email" error={errors.email} attempt={submitCount}>
              <input type="email" className={input(errors.email)} autoComplete="email" {...register('email', { required: 'We need an email to reply', pattern: { value: /^\S+@\S+\.\S+$/, message: 'That email looks incomplete' } })} />
            </Field>
            <Field label="What do you want to build?" error={errors.message} attempt={submitCount}>
              <textarea rows={3} className={`${input(errors.message)} resize-none`} {...register('message', { required: 'A line or two is enough', maxLength: { value: 1000, message: 'Keep it under 1000 characters' } })} />
            </Field>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={spring.interactive}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#0d4697] disabled:opacity-60"
            >
              {isSubmitting ? 'Sending…' : 'Send enquiry'}
              <Send className="h-4 w-4" />
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function CtaSection() {
  return (
    <section id="contact" className="relative isolate scroll-mt-28 overflow-hidden bg-[#0a2a63] px-5 py-20 sm:py-28 lg:px-8">
      <Aurora tone="cta" priority={3} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffd36e]">Start your project</p>
          <SplitWords
            text="Let's Build Your Digital Future."
            highlight="Future"
            className="mt-4 font-outfit text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
          />
          <motion.span
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.9, ease: ease.entrance, delay: 0.7 }}
            className="mt-6 block h-1 w-24 origin-left rounded-full bg-gradient-to-r from-[#CB9015] to-[#ffd98a]"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ ...transition.entrance, delay: 0.5 }}
            className="mt-5 max-w-xl text-base font-medium leading-7 text-white/80 sm:text-lg"
          >
            Tell us about your business and we'll help you scope the right software, website, app or automation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ ...transition.entrance, delay: 0.65 }}
            className="mt-8"
          >
            <Magnetic className="relative">
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full bg-[#ffae13]"
                initial={{ scale: 1, opacity: 0 }}
                whileInView={{ scale: [1, 1.35], opacity: [0.55, 0] }}
                viewport={viewportOnce}
                transition={{ duration: 1.2, ease: ease.entrance, delay: 1.1 }}
              />
              <Link to="/contact" className="group relative inline-flex items-center gap-2 rounded-full bg-[#ffae13] px-8 py-4 text-base font-bold text-[#0b2451] shadow-[0_16px_30px_rgba(255,174,19,0.35)]">
                Get a Free Consultation
                {/* Arrow nudges once when the section reveals, then on hover. */}
                <motion.span
                  className="inline-flex"
                  initial={{ x: 0 }}
                  whileInView={{ x: [0, 6, 0, 6, 0] }}
                  viewport={viewportOnce}
                  transition={{ duration: 1.2, ease: 'easeInOut', delay: 1.3 }}
                >
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.span>
              </Link>
            </Magnetic>
          </motion.div>

          <div className="mt-8 flex flex-col gap-3 text-sm font-semibold text-white/85 sm:flex-row sm:flex-wrap sm:gap-6">
            <a href={`mailto:${CONTACT_EMAIL}`} className="link-wipe inline-flex items-center gap-2 self-start hover:text-white">
              <Mail className="h-4 w-4 text-[#ffae13]" /> {CONTACT_EMAIL}
            </a>
            <a href="tel:+917200073704" className="link-wipe inline-flex items-center gap-2 self-start hover:text-white">
              <PhoneCall className="h-4 w-4 text-[#ffae13]" /> +91 72000 73704
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#ffae13]" /> Tamil Nadu, India
            </span>
          </div>

          <p className="mt-8 flex flex-wrap items-center gap-3 text-xs font-bold text-white/60">
            <span>Part of the Gloaro ecosystem —</span>
            <Link to="/mart" className="link-wipe">Gloaro Mart</Link>
            <span>·</span>
            <Link to="/network" className="link-wipe">Gloaro Network</Link>
          </p>
        </div>

        <EnquiryForm />
      </div>
    </section>
  )
}
