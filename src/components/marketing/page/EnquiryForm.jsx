import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle2, Mail, MessageCircle, Phone, Send } from 'lucide-react'
import { whatsappLink } from '../../../lib/contact'
import { PHONES } from '../../../lib/seoConfig'
import { industries } from '../industries'
import { serviceGroups } from './content'

const EMAIL = 'info@gloaro.com'
const field = 'w-full rounded-xl border border-white/15 bg-white/[0.07] px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#ffae13] focus:bg-white/10'
const labelClass = 'text-[13px] font-bold text-white/85'

function Field({ label, error, children, optional }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}{optional && <span className="font-medium text-white/45"> (optional)</span>}</span>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs font-bold text-[#ff9b9b]">{error}</p>}
    </label>
  )
}

function buildMessage(values) {
  const services = serviceGroups.filter((g) => values.services?.includes(g.id)).map((g) => g.label)
  return [
    'Hi GloAro, I would like to discuss digital marketing for my business.',
    '',
    `Business: ${values.business}`,
    `Industry: ${values.industry}`,
    `Name: ${values.name}`,
    `Phone: ${values.phone}`,
    values.email ? `Email: ${values.email}` : null,
    services.length ? `Interested in: ${services.join(', ')}` : null,
    values.message ? `Requirements: ${values.message}` : null,
  ].filter((line) => line !== null).join('\n')
}

// There's no marketing-leads backend yet, so the enquiry is delivered through
// channels that already work: it opens WhatsApp to GloAro with every detail
// filled in, with email as a fallback. Nothing is stored by this page.
export default function EnquiryForm({ preset }) {
  const [sent, setSent] = useState(null)
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
    defaultValues: { business: '', industry: '', name: '', phone: '', email: '', services: [], message: '' },
  })

  // A CTA elsewhere on the page can pre-select an industry or service.
  useEffect(() => {
    if (!preset) return
    if (preset.industry) setValue('industry', preset.industry)
    if (preset.service) {
      const current = getValues('services') || []
      if (!current.includes(preset.service)) setValue('services', [...current, preset.service])
    }
  }, [preset, setValue, getValues])

  const onSubmit = (values) => {
    const message = buildMessage(values)
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer')
    setSent(message)
  }

  if (sent) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-white sm:p-8" role="status">
        <CheckCircle2 aria-hidden="true" className="h-10 w-10 text-emerald-300" />
        <h3 className="mt-4 font-outfit text-2xl font-semibold">Your enquiry is ready in WhatsApp</h3>
        <p className="mt-2 text-sm font-medium leading-6 text-white/70">
          Press send in WhatsApp and our team will reply there. If WhatsApp didn’t open, use one of these instead:
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={whatsappLink(sent)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white">
            <MessageCircle aria-hidden="true" className="h-4 w-4" />Open WhatsApp again
          </a>
          <a href={`mailto:${EMAIL}?subject=${encodeURIComponent('Digital marketing enquiry')}&body=${encodeURIComponent(sent)}`} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white hover:border-white/40">
            <Mail aria-hidden="true" className="h-4 w-4" />Send by email
          </a>
        </div>
        <button type="button" onClick={() => setSent(null)} className="mt-6 text-sm font-bold text-[#ffd36e] underline-offset-4 hover:underline">
          Edit my details
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.6)] backdrop-blur sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Business name" error={errors.business?.message}>
          <input className={field} autoComplete="organization" placeholder="e.g. Sri Murugan Furniture" {...register('business', { required: 'Please enter your business name' })} />
        </Field>
        <Field label="Industry" error={errors.industry?.message}>
          <select className={`${field} [&>option]:text-[#08224B]`} {...register('industry', { required: 'Please choose your industry' })}>
            <option value="">Select your industry</option>
            {industries.map(({ id, label }) => <option key={id} value={label}>{label}</option>)}
            <option value="Other">Other</option>
          </select>
        </Field>
        <Field label="Your name" error={errors.name?.message}>
          <input className={field} autoComplete="name" {...register('name', { required: 'Please enter your name', minLength: { value: 2, message: 'Name is too short' } })} />
        </Field>
        <Field label="Phone / WhatsApp" error={errors.phone?.message}>
          <input type="tel" inputMode="tel" autoComplete="tel" className={field} placeholder="+91" {...register('phone', { required: 'Please enter a phone number', pattern: { value: /^[+\d][\d\s-]{7,15}$/, message: 'Enter a valid phone number' } })} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Email" optional error={errors.email?.message}>
            <input type="email" autoComplete="email" className={field} {...register('email', { pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} />
          </Field>
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className={labelClass}>What would you like help with? <span className="font-medium text-white/45">(optional)</span></legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {serviceGroups.map(({ id, label, Icon }) => (
            <label key={id} className="cursor-pointer">
              <input type="checkbox" value={id} className="peer sr-only" {...register('services')} />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/75 transition peer-checked:border-[#ffae13] peer-checked:bg-[#ffae13] peer-checked:text-[#061633] peer-focus-visible:ring-2 peer-focus-visible:ring-[#ffae13]/60">
                <Icon aria-hidden="true" className="h-3.5 w-3.5" />{label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5">
        <Field label="Tell us about your requirements" optional error={errors.message?.message}>
          <textarea rows={3} className={field} placeholder="Your goals, current challenges, locations you serve…" {...register('message', { maxLength: { value: 600, message: 'Please keep it under 600 characters' } })} />
        </Field>
      </div>

      <button type="submit" className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ffae13] px-6 py-3.5 text-sm font-extrabold text-[#061633] shadow-[0_12px_28px_rgba(255,174,19,0.3)] transition hover:bg-[#ffbb38]">
        <Send aria-hidden="true" className="h-4 w-4" />
        Send my enquiry on WhatsApp
      </button>
      <p className="mt-3 text-center text-xs font-medium text-white/50">
        Opens WhatsApp with your details filled in. Prefer to talk? Call{' '}
        <a href={`tel:${PHONES[0].replace(/-/g, '')}`} className="font-bold text-white/80 hover:text-white"><Phone aria-hidden="true" className="mr-0.5 inline h-3 w-3" />{PHONES[0].replace('-', ' ')}</a>
      </p>
    </form>
  )
}
