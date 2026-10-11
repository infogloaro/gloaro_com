import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'framer-motion'
import { AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, CloudOff, Copy, Loader2, Lock, Pencil, RotateCcw } from 'lucide-react'
import logo from '../../../assets/logo-transparent.webp'
import { submitPartnershipApplication } from '../../../api/partnershipApplication'
import { whatsappLink } from '../../../lib/contact'
import { trackPartnerEvent } from '../../../lib/partnerAnalytics'
import { PARTNERSHIP_API_ENABLED, paths } from '../partnerConfig'
import { answerFields, fieldId, forms } from './formConfig'
import { Field } from './FormFields'

const DRAFT_VERSION = 1
const NOT_SAVED = ['privacyConsent', 'marketingConsent', 'website_hp']
const focusRing = 'focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#F5A900]'

const newKey = () => {
  try {
    return window.crypto.randomUUID()
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
  }
}

function loadDraft(storageKey) {
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return null
    const draft = JSON.parse(raw)
    if (draft?.v !== DRAFT_VERSION || typeof draft.values !== 'object') return null
    return draft
  } catch {
    return null
  }
}

function saveDraft(storageKey, draft) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify({ v: DRAFT_VERSION, ...draft }))
    return true
  } catch {
    return false
  }
}

function clearDraft(storageKey) {
  try {
    window.localStorage.removeItem(storageKey)
  } catch {
    // Storage unavailable: nothing to clear.
  }
}

const withoutUnsaved = (values) => Object.fromEntries(Object.entries(values).filter(([key]) => !NOT_SAVED.includes(key)))

const stepFieldNames = (step) => answerFields(step).flatMap((field) => (field.type === 'phone' ? [field.name, 'phoneCountryCode'] : [field.name]))

const formatValue = (field, values) => {
  const value = values[field.name]
  if (field.type === 'phone') return value ? `${values.phoneCountryCode || ''} ${value}`.trim() : ''
  if (Array.isArray(value)) return value.join(', ')
  return value || ''
}

function errorMessage(error) {
  const status = error?.response?.status
  if (status === 429) return 'Too many attempts in a short time. Please wait a minute and try again.'
  if (status === 409) return 'This application looks like it was already sent. Please contact us before sending it again.'
  if (status >= 400 && status < 500 && typeof error.response?.data?.message === 'string') return error.response.data.message
  if (error?.code === 'NO_REFERENCE') return 'We could not confirm your application was saved, so we are not showing it as received.'
  if (!error?.response) return 'We could not reach our server. Check your connection and try again.'
  return 'Something went wrong on our side. Please try again.'
}

export default function ApplicationForm({ pathKey }) {
  const config = forms[pathKey]
  const path = paths[pathKey]
  const storageKey = `gloaro-partner-draft-${pathKey}`
  const lastStep = config.steps.length - 1
  const reduce = useReducedMotion()
  const controls = useAnimationControls()

  const [initial] = useState(() => loadDraft(storageKey))
  const defaults = { phoneCountryCode: '+91', services: [], industries: [] }
  const { control, register, handleSubmit, trigger, getFieldState, reset, formState: { errors } } = useForm({
    mode: 'onTouched',
    defaultValues: { ...defaults, ...(initial?.values ?? {}) },
  })
  const values = useWatch({ control })

  const [step, setStep] = useState(() => Math.min(initial?.step ?? 0, lastStep))
  const [maxStep, setMaxStep] = useState(() => Math.min(initial?.maxStep ?? 0, lastStep))
  const [direction, setDirection] = useState(1)
  const [saveState, setSaveState] = useState(initial ? 'restored' : 'idle')
  const [announcement, setAnnouncement] = useState('')
  const [submit, setSubmit] = useState({ status: 'idle', error: '', reference: '' })
  const idempotencyKey = useRef(initial?.idempotencyKey || newKey())
  const started = useRef(Boolean(initial))
  const saveTimer = useRef(0)
  const topRef = useRef(null)
  const headingRef = useRef(null)
  const firstRender = useRef(true)
  const stepRef = useRef({ step, maxStep })
  useEffect(() => {
    stepRef.current = { step, maxStep }
  }, [step, maxStep])

  const persist = useCallback((formValues) => {
    window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => {
      const ok = saveDraft(storageKey, {
        values: withoutUnsaved(formValues),
        step: stepRef.current.step,
        maxStep: stepRef.current.maxStep,
        idempotencyKey: idempotencyKey.current,
      })
      setSaveState(ok ? 'saved' : 'unavailable')
    }, 400)
  }, [storageKey])

  // Autosave answers to this device as they change (skipping the initial render).
  const watched = useRef(false)
  useEffect(() => {
    if (!watched.current) {
      watched.current = true
      return
    }
    if (!started.current) {
      started.current = true
      trackPartnerEvent('form_started', { path: pathKey })
    }
    persist(values)
  }, [values, persist, pathKey])

  useEffect(() => () => window.clearTimeout(saveTimer.current), [])

  // Move focus to the new step's heading so keyboard and screen-reader users land in the right place.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus({ preventScroll: true })
  }, [step])

  const goTo = (target) => {
    setDirection(target > step ? 1 : -1)
    setStep(target)
    setMaxStep((current) => Math.max(current, target))
    persist({ ...values })
    topRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  const flagInvalid = (names) => {
    const invalid = names.filter((name) => getFieldState(name).invalid)
    if (!invalid.length) return
    setAnnouncement(`${invalid.length === 1 ? 'One field needs' : `${invalid.length} fields need`} your attention.`)
    invalid.forEach((name) => trackPartnerEvent('validation_error', { path: pathKey, step: step + 1, field: name }))
    if (!reduce) controls.start({ x: [0, -10, 10, -6, 6, -2, 0], transition: { duration: 0.42 } })
    window.setTimeout(() => document.getElementById(fieldId(invalid[0]))?.focus(), 30)
  }

  const next = async () => {
    const names = stepFieldNames(config.steps[step])
    const ok = await trigger(names)
    if (!ok) {
      flagInvalid(names)
      return
    }
    setAnnouncement('')
    trackPartnerEvent('step_completed', { path: pathKey, step: step + 1 })
    goTo(step + 1)
  }

  const startOver = () => {
    clearDraft(storageKey)
    reset(defaults)
    idempotencyKey.current = newKey()
    setStep(0)
    setMaxStep(0)
    setSaveState('idle')
    setSubmit({ status: 'idle', error: '', reference: '' })
  }

  const onSubmit = async (data) => {
    if (!PARTNERSHIP_API_ENABLED || submit.status === 'submitting') return
    setSubmit({ status: 'submitting', error: '', reference: '' })
    const now = new Date().toISOString()
    const answers = {}
    config.steps.slice(1).forEach((item) => answerFields(item).forEach((field) => { answers[field.name] = data[field.name] ?? '' }))
    const payload = {
      applicationType: config.type,
      contact: { fullName: data.fullName, email: data.email, phoneCountryCode: data.phoneCountryCode, phone: data.phone, city: data.city },
      answers,
      consents: {
        privacy: true,
        privacyAcceptedAt: now,
        marketing: Boolean(data.marketingConsent),
        marketingAcceptedAt: data.marketingConsent ? now : null,
      },
      honeypot: data.website_hp || '',
      source: window.location.pathname,
    }
    try {
      const result = await submitPartnershipApplication(payload, idempotencyKey.current)
      clearDraft(storageKey)
      setSubmit({ status: 'success', error: '', reference: result.reference })
      trackPartnerEvent('submitted', { path: pathKey })
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    } catch (error) {
      // Answers stay in the form and on the device; the same idempotency key is reused on retry.
      setSubmit({ status: 'error', error: errorMessage(error), reference: '' })
    }
  }

  const onFormSubmit = (event) => {
    if (step < lastStep) {
      event.preventDefault()
      next()
      return
    }
    handleSubmit(onSubmit, () => flagInvalid(['privacyConsent']))(event)
  }

  const current = config.steps[step]
  const isFranchise = pathKey === 'franchise'

  if (submit.status === 'success') {
    return <SuccessPanel path={path} reference={submit.reference} />
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-work text-[#14213D]">
      <header className="border-b border-[#D9E1EC] bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
          <Link to="/" aria-label="GLOARO home" className={focusRing}><img src={logo} alt="GLOARO" className="h-11 w-auto" /></Link>
          <span className={`rounded-full px-3 py-1.5 text-xs font-semibold sm:text-sm ${isFranchise ? 'bg-[#061A3A] text-[#F5A900]' : 'bg-[#1558B0] text-white'}`}>
            {path.short} application
          </span>
          <span className="ml-auto flex items-center gap-2 text-sm text-[#4A5874]" aria-live="polite">
            {saveState === 'saved' && <><Check aria-hidden="true" className="h-4 w-4 text-[#1B7A4A]" /> Saved on this device</>}
            {saveState === 'restored' && <><Check aria-hidden="true" className="h-4 w-4 text-[#1B7A4A]" /> Draft restored</>}
            {saveState === 'unavailable' && <><CloudOff aria-hidden="true" className="h-4 w-4" /> Not saved on this device</>}
          </span>
          <Link to={path.href} className={`min-h-11 content-center text-sm font-medium text-[#4A5874] underline-offset-4 hover:underline ${focusRing}`}>Exit</Link>
        </div>
      </header>

      <main ref={topRef} className="mx-auto flex max-w-6xl scroll-mt-4 flex-wrap items-start gap-8 px-4 py-8 sm:px-6 lg:gap-10 lg:py-12">
        <Stepper steps={config.steps} step={step} maxStep={maxStep} onGo={goTo} />

        <motion.form
          noValidate
          animate={controls}
          onSubmit={onFormSubmit}
          className="min-w-0 flex-[999_1_560px] rounded-[24px] border border-[#D9E1EC] bg-white p-5 sm:p-10"
          aria-labelledby="form-step-title"
        >
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-[#4A5874]">Step {step + 1} of {config.steps.length}</p>
            <div role="progressbar" aria-label="Application progress" aria-valuemin={0} aria-valuemax={config.steps.length} aria-valuenow={step + 1} className="h-1.5 overflow-hidden rounded-full bg-[#EEF2F7]">
              <motion.div className="h-full rounded-full bg-[#F5A900]" initial={false} animate={{ width: `${((step + 1) / config.steps.length) * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 22 }} />
            </div>
          </div>

          {initial && step === 0 && saveState === 'restored' && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#EAF2FD] px-4 py-3 text-sm text-[#0B2451]">
              We restored the answers you saved on this device.
              <button type="button" onClick={startOver} className={`inline-flex min-h-10 items-center gap-1.5 font-semibold underline-offset-4 hover:underline ${focusRing}`}>
                <RotateCcw aria-hidden="true" className="h-4 w-4" /> Start over
              </button>
            </div>
          )}

          <p className="sr-only" aria-live="assertive">{announcement}</p>

          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={current.id}
              custom={direction}
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: direction * 48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: direction * -48 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6"
            >
              <h1 id="form-step-title" ref={headingRef} tabIndex={-1} className="font-outfit text-3xl font-semibold text-[#061A3A] focus:outline-none sm:text-4xl">
                {current.title}
              </h1>
              <p className="mt-2 text-[#4A5874]">
                {current.intro ? `${current.intro} ` : ''}Fields marked <span className="text-[#B42318]">*</span> are required.
              </p>

              {step < lastStep ? (
                <div className="mt-8 space-y-7">
                  {current.fields.map((field) => <Field key={field.name} field={field} register={register} errors={errors} values={values} recheck={trigger} />)}
                </div>
              ) : (
                <Review config={config} values={values} register={register} errors={errors} onEdit={goTo} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Honeypot for bots: hidden from people and assistive technology. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="website_hp">Leave this field empty</label>
            <input id="website_hp" type="text" tabIndex={-1} autoComplete="off" {...register('website_hp')} />
          </div>

          {step === lastStep && <SubmitStatus submit={submit} path={path} />}

          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-[#EEF2F7] pt-6">
            {step > 0 && (
              <button type="button" onClick={() => goTo(step - 1)} className={`inline-flex min-h-13 items-center gap-2 rounded-full border border-[#C3CEDD] px-6 py-3 font-semibold text-[#14213D] transition-colors hover:border-[#0B2451] ${focusRing}`}>
                <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back
              </button>
            )}
            {step < lastStep ? (
              <motion.button whileTap={{ scale: 0.97 }} type="submit" className={`ml-auto inline-flex min-h-13 items-center gap-2 rounded-full bg-[#0B2451] px-7 py-3 font-semibold text-white transition-colors hover:bg-[#123368] ${focusRing}`}>
                Continue to {config.steps[step + 1].title}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </motion.button>
            ) : (
              <motion.button
                whileTap={PARTNERSHIP_API_ENABLED ? { scale: 0.97 } : undefined}
                type="submit"
                disabled={!PARTNERSHIP_API_ENABLED || submit.status === 'submitting'}
                aria-describedby={!PARTNERSHIP_API_ENABLED ? 'submit-unavailable' : undefined}
                className={`ml-auto inline-flex min-h-13 items-center gap-2 rounded-full px-7 py-3 font-semibold transition-colors disabled:cursor-not-allowed ${focusRing} ${
                  PARTNERSHIP_API_ENABLED ? 'bg-[#F5A900] text-[#061A3A] hover:bg-[#FFBE2E] disabled:opacity-70' : 'bg-[#D9E1EC] text-[#4A5874]'
                }`}
              >
                {submit.status === 'submitting' ? (
                  <><Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> Sending…</>
                ) : submit.status === 'error' ? (
                  <><RotateCcw aria-hidden="true" className="h-4 w-4" /> Try again</>
                ) : (
                  <>{!PARTNERSHIP_API_ENABLED && <Lock aria-hidden="true" className="h-4 w-4" />} Submit application</>
                )}
              </motion.button>
            )}
          </div>
        </motion.form>
      </main>
    </div>
  )
}

function Stepper({ steps, step, maxStep, onGo }) {
  return (
    <nav aria-label="Application steps" className="hidden flex-[1_1_240px] lg:block lg:max-w-[280px]">
      <ol className="space-y-1.5">
        {steps.map((item, index) => {
          const done = index < step || (index <= maxStep && index !== step)
          const isCurrent = index === step
          const canGo = index <= maxStep && !isCurrent
          const content = (
            <>
              <span className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${isCurrent ? 'bg-[#0B2451] text-[#F5A900]' : done ? 'bg-[#1B7A4A] text-white' : 'border-2 border-[#C3CEDD] text-[#4A5874]'}`}>
                {done && !isCurrent ? <Check aria-hidden="true" className="h-4 w-4" strokeWidth={3} /> : index + 1}
              </span>
              <span className="text-left">
                <span className={`block font-semibold ${isCurrent || done ? 'text-[#14213D]' : 'text-[#4A5874]'}`}>{item.title}</span>
                <span className={`text-[13px] ${isCurrent ? 'text-[#1558B0]' : 'text-[#4A5874]'}`}>{isCurrent ? 'In progress' : done ? 'Done' : 'Not started'}</span>
              </span>
            </>
          )
          return (
            <li key={item.id} className="relative">
              {isCurrent && <motion.span layoutId="stepper-current" className="absolute inset-0 rounded-2xl border border-[#D9E1EC] bg-white" transition={{ type: 'spring', stiffness: 260, damping: 26 }} />}
              {canGo ? (
                <button type="button" onClick={() => onGo(index)} className={`relative flex w-full items-center gap-3.5 rounded-2xl px-3.5 py-3 hover:bg-white/70 ${focusRing}`}>{content}</button>
              ) : (
                <div aria-current={isCurrent ? 'step' : undefined} className="relative flex items-center gap-3.5 px-3.5 py-3">{content}</div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function Review({ config, values, register, errors, onEdit }) {
  return (
    <div className="mt-8 space-y-5">
      {config.steps.slice(0, -1).map((item, index) => (
        <section key={item.id} className="rounded-2xl border border-[#D9E1EC] p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-outfit text-lg font-semibold text-[#061A3A]">{item.title}</h2>
            <button type="button" onClick={() => onEdit(index)} className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-[#1558B0] hover:bg-[#EAF2FD] ${focusRing}`}>
              <Pencil aria-hidden="true" className="h-3.5 w-3.5" /> Edit<span className="sr-only"> {item.title}</span>
            </button>
          </div>
          <dl className="mt-3 grid gap-x-6 gap-y-2 text-[15px] sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
            {answerFields(item).map((field) => (
              <div key={field.name} className="contents">
                <dt className="text-[#4A5874]">{field.label.replace(' (optional)', '')}</dt>
                <dd className="m-0 break-words font-medium text-[#14213D]">{formatValue(field, values) || <span className="font-normal text-[#4A5874]">Not provided</span>}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      <fieldset className="m-0 space-y-3 border-0 p-0">
        <legend className="sr-only">Consent</legend>
        <label className={`flex cursor-pointer gap-3 rounded-2xl border p-4 ${errors.privacyConsent ? 'border-2 border-[#B42318]' : 'border-[#D9E1EC]'}`}>
          <input
            id={fieldId('privacyConsent')}
            type="checkbox"
            aria-invalid={Boolean(errors.privacyConsent)}
            aria-describedby={errors.privacyConsent ? `${fieldId('privacyConsent')}-error` : undefined}
            {...register('privacyConsent', { required: 'Please agree to the privacy policy to submit your application.' })}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[#0B2451]"
          />
          <span className="text-[15px] leading-6">
            I agree that GLOARO may use the information in this application to review it and contact me, as described in the{' '}
            <a href="/privacy-policy" target="_blank" rel="noreferrer" className="font-semibold text-[#1558B0] underline">privacy policy</a>.
            <span aria-hidden="true" className="text-[#B42318]"> *</span>
          </span>
        </label>
        {errors.privacyConsent && <p id={`${fieldId('privacyConsent')}-error`} className="text-sm font-medium text-[#B42318]">{errors.privacyConsent.message}</p>}
        <label className="flex cursor-pointer gap-3 rounded-2xl border border-[#D9E1EC] p-4">
          <input type="checkbox" {...register('marketingConsent')} className="mt-0.5 h-5 w-5 shrink-0 accent-[#0B2451]" />
          <span className="text-[15px] leading-6">Optional: send me occasional updates about GLOARO partnerships. I can unsubscribe at any time.</span>
        </label>
      </fieldset>
    </div>
  )
}

function SubmitStatus({ submit, path }) {
  if (!PARTNERSHIP_API_ENABLED) {
    return (
      <div id="submit-unavailable" className="mt-8 flex gap-3 rounded-2xl border border-[#F2D27A] bg-[#FFFBF0] p-4 text-[15px] leading-6 text-[#14213D]">
        <Lock aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#C26A00]" />
        <div>
          <p className="font-semibold">Online submission is not open yet.</p>
          <p className="mt-1 text-[#4A5874]">
            Nothing has been sent. Your answers are saved on this device, so you can submit as soon as applications open.{' '}
            <a href={whatsappLink(`Hi GLOARO, I would like to apply for the ${path.name} programme.`)} target="_blank" rel="noreferrer" className="font-semibold text-[#1558B0] underline">Talk to us on WhatsApp</a> in the meantime.
          </p>
        </div>
      </div>
    )
  }
  if (submit.status !== 'error') return null
  return (
    <div role="alert" className="mt-8 flex gap-3 rounded-2xl border border-[#F4C7C3] bg-[#FEF3F2] p-4 text-[15px] leading-6">
      <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#B42318]" />
      <div>
        <p className="font-semibold text-[#B42318]">Your application was not sent.</p>
        <p className="mt-1 text-[#14213D]">{submit.error} All your answers are still here.</p>
      </div>
    </div>
  )
}

function SuccessPanel({ path, reference }) {
  const reduce = useReducedMotion()
  const [copied, setCopied] = useState(false)
  const headingRef = useRef(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reference)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const draw = (delay) => ({ initial: { pathLength: reduce ? 1 : 0 }, animate: { pathLength: 1 }, transition: { duration: reduce ? 0 : 0.5, delay: reduce ? 0 : delay, ease: [0.65, 0, 0.35, 1] } })

  return (
    <div className="min-h-screen bg-[#F7F9FC] px-4 py-12 font-work text-[#14213D] sm:py-20">
      <main className="mx-auto max-w-xl">
        <Link to="/" aria-label="GLOARO home"><img src={logo} alt="GLOARO" className="h-12 w-auto" /></Link>
        <svg viewBox="0 0 80 80" className="mt-10 h-20 w-20" aria-hidden="true">
          <motion.circle cx="40" cy="40" r="36" fill="#DCF2E6" stroke="#1B7A4A" strokeWidth="3" {...draw(0)} />
          <motion.path d="M24 41 L35 52 L57 29" fill="none" stroke="#1B7A4A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" {...draw(0.45)} />
        </svg>
        <h1 ref={headingRef} tabIndex={-1} className="mt-6 font-outfit text-4xl font-semibold focus:outline-none">Application received</h1>
        <p className="mt-3 text-lg leading-8 text-[#4A5874]">Thank you. Your {path.name} application has been saved and is now with our partnerships team.</p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : 0.9 }}
          className="mt-8 rounded-[20px] bg-[#061A3A] p-6 text-white"
        >
          <p className="text-sm text-[#B8C5D9]">Your reference</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="flex-1 font-outfit text-3xl font-semibold tracking-wide">{reference}</span>
            <button type="button" onClick={copy} className={`inline-flex min-h-11 items-center gap-2 rounded-full bg-[#F5A900] px-5 text-sm font-semibold text-[#061A3A] ${focusRing}`}>
              {copied ? <CheckCircle2 aria-hidden="true" className="h-4 w-4" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="mt-3 text-sm text-[#B8C5D9]" aria-live="polite">{copied ? 'Reference copied.' : 'Keep this to follow up on your application.'}</p>
        </motion.div>

        <div className="mt-6 rounded-[20px] border border-[#D9E1EC] bg-white p-6">
          <h2 className="font-outfit text-lg font-semibold">What happens next</h2>
          <ol className="mt-4 space-y-3 text-[15px]">
            <li className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#1B7A4A] text-sm font-semibold text-white">1</span>Submitted</li>
            <li className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0B2451] text-sm font-semibold text-[#F5A900]">2</span>Initial review by our partnerships team</li>
            <li className="flex gap-3 text-[#4A5874]"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-[#C3CEDD] text-sm font-semibold">3</span>A discussion, if your application is shortlisted</li>
          </ol>
        </div>

        <p className="mt-6 text-[15px] text-[#4A5874]">
          Questions? Email <a href="mailto:info@gloaro.com" className="font-semibold text-[#1558B0] underline">info@gloaro.com</a> or{' '}
          <a href={whatsappLink(`Hi GLOARO, my partnership application reference is ${reference}.`)} target="_blank" rel="noreferrer" className="font-semibold text-[#1558B0] underline">WhatsApp us</a>.
        </p>
        <Link to={path.href} className={`mt-8 flex min-h-12 items-center justify-center rounded-full border border-[#C3CEDD] font-semibold ${focusRing}`}>Back to {path.short}</Link>
      </main>
    </div>
  )
}
