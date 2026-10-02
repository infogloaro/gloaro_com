import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import Seo from '../../components/Seo'
import FormField from '../../components/forms/FormField'
import { allThemes, parseThemeKey } from '../../prototypes/catalog'

const inputClass = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#0d4697]'

export default function EnquiryPage() {
  const [params] = useSearchParams()
  const initialTheme = parseThemeKey(params.get('theme'))
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { themeKey: initialTheme?.key || '' },
  })
  const selected = parseThemeKey(useWatch({ control, name: 'themeKey' }))

  // Prototype only: no backend. Simulates a short send, then shows the thank-you screen.
  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-16">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <h1 className="font-playfair text-3xl font-bold text-[#0d4697]">Thank you!</h1>
          <p className="mt-3 text-slate-600">
            We received your enquiry{selected ? ` for ${selected.business.name} — ${selected.theme.name}` : ''}. Our team will contact you shortly.
          </p>
          <Link to="/solutions" className="mt-6 inline-block rounded-full bg-slate-900 px-5 py-2 text-sm font-bold text-white">
            Explore more solutions
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <Seo title="Book a Theme | GLOARO" description="Tell us about your business and we will get back to you." canonical="/contact" />
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-xl md:p-8">
        <h1 className="font-playfair text-3xl font-bold text-[#0d4697]">Book this theme</h1>
        {selected && <p className="mt-1 text-sm text-slate-600">{selected.business.name} · {selected.theme.name}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <FormField label="Theme" error={errors.themeKey?.message}>
            <select className={inputClass} {...register('themeKey', { required: 'Please choose a theme' })}>
              <option value="">Select a theme</option>
              {allThemes().map(({ business, theme, key }) => (
                <option key={key} value={key}>{business.name} — {theme.name}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Your name" error={errors.name?.message}>
            <input className={inputClass} {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name is too short' } })} />
          </FormField>
          <FormField label="Email" error={errors.email?.message}>
            <input type="email" className={inputClass} {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} />
          </FormField>
          <FormField label="Phone" error={errors.phone?.message}>
            <input type="tel" className={inputClass} {...register('phone', { required: 'Phone is required', pattern: { value: /^[+\d][\d\s-]{7,15}$/, message: 'Enter a valid phone number' } })} />
          </FormField>
          <FormField label="Company (optional)">
            <input className={inputClass} {...register('company')} />
          </FormField>
          <FormField label="Tell us about your project (optional)" error={errors.message?.message}>
            <textarea rows={4} className={inputClass} {...register('message', { maxLength: { value: 1000, message: 'Keep it under 1000 characters' } })} />
          </FormField>
          <button disabled={isSubmitting} className="w-full rounded-full bg-[#0d4697] px-5 py-3 text-sm font-bold text-white disabled:opacity-60">
            {isSubmitting ? 'Sending…' : 'Send enquiry'}
          </button>
        </form>
      </div>
    </main>
  )
}
