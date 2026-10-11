import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Check, ChevronDown, Info } from 'lucide-react'
import { spring } from '../../../lib/motion'
import { Pending } from '../PartnerUI'
import { buildRules, countryCodes, fieldId } from './formConfig'

const focus = 'focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F5A900]/40'
const boxBase = `peer w-full rounded-xl border bg-white px-4 text-base text-[#14213D] transition-[border-color,box-shadow] ${focus}`
const boxState = (error) => (error ? 'border-2 border-[#B42318]' : 'border-[#C3CEDD] hover:border-[#8EA3C2] focus:border-[#0B2451]')
const floatLabel =
  'pointer-events-none absolute left-4 origin-left text-[#4A5874] transition-all duration-200 peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-[#0B2451] peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-semibold'

function RequiredMark({ required }) {
  if (!required) return null
  return <span aria-hidden="true" className="text-[#B42318]"> *</span>
}

function FieldMessage({ name, error, hint }) {
  return (
    <AnimatePresence initial={false} mode="wait">
      {error ? (
        <motion.p
          key="error"
          id={`${fieldId(name)}-error`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[#B42318]"
        >
          <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
          {error.message}
        </motion.p>
      ) : hint ? (
        <motion.p key="hint" id={`${fieldId(name)}-hint`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-sm text-[#4A5874]">{hint}</motion.p>
      ) : null}
    </AnimatePresence>
  )
}

const describedBy = (name, error, hint) => (error ? `${fieldId(name)}-error` : hint ? `${fieldId(name)}-hint` : undefined)

export function TextField({ field, register, error }) {
  const id = fieldId(field.name)
  const common = {
    id,
    placeholder: ' ',
    autoComplete: field.autoComplete,
    'aria-invalid': Boolean(error),
    'aria-required': Boolean(field.required),
    'aria-describedby': describedBy(field.name, error, field.hint),
    ...register(field.name, buildRules(field)),
  }
  const isArea = field.type === 'textarea'
  return (
    <div>
      <div className="relative">
        {isArea ? (
          <textarea {...common} rows={4} className={`${boxBase} ${boxState(error)} min-h-32 resize-y pb-3 pt-7`} />
        ) : (
          <input {...common} type={field.type === 'url' ? 'url' : field.type === 'email' ? 'email' : 'text'} inputMode={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : undefined} className={`${boxBase} ${boxState(error)} h-14 pb-1.5 pt-5`} />
        )}
        <label htmlFor={id} className={`${floatLabel} ${isArea ? 'top-5 -translate-y-1/2' : 'top-1/2 -translate-y-1/2'}`}>
          {field.label}<RequiredMark required={field.required} />
        </label>
      </div>
      <FieldMessage name={field.name} error={error} hint={field.hint} />
    </div>
  )
}

export function PhoneField({ field, register, error }) {
  const id = fieldId(field.name)
  return (
    <div>
      <div className="flex gap-2">
        <div className="relative shrink-0">
          <label htmlFor={fieldId('phoneCountryCode')} className="sr-only">Country code</label>
          <select id={fieldId('phoneCountryCode')} autoComplete="tel-country-code" {...register('phoneCountryCode')} className={`h-14 appearance-none rounded-xl border border-[#C3CEDD] bg-white pl-4 pr-9 text-base text-[#14213D] hover:border-[#8EA3C2] ${focus}`}>
            {countryCodes.map((code) => <option key={code} value={code}>{code}</option>)}
          </select>
          <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A5874]" />
        </div>
        <div className="relative min-w-0 flex-1">
          <input
            id={id}
            type="tel"
            inputMode="tel"
            placeholder=" "
            autoComplete={field.autoComplete}
            aria-invalid={Boolean(error)}
            aria-required="true"
            aria-describedby={describedBy(field.name, error, field.hint)}
            {...register(field.name, buildRules(field))}
            className={`${boxBase} ${boxState(error)} h-14 pb-1.5 pt-5`}
          />
          <label htmlFor={id} className={`${floatLabel} top-1/2 -translate-y-1/2`}>
            {field.label}<RequiredMark required={field.required} />
          </label>
        </div>
      </div>
      <FieldMessage name={field.name} error={error} hint={field.hint} />
    </div>
  )
}

export function SelectField({ field, register, error, recheck }) {
  const id = fieldId(field.name)
  return (
    <div className="max-w-md">
      <div className="relative">
        <select
          id={id}
          aria-invalid={Boolean(error)}
          aria-required={Boolean(field.required)}
          aria-describedby={describedBy(field.name, error, field.hint)}
          {...register(field.name, { ...buildRules(field), onChange: () => error && recheck(field.name) })}
          className={`${boxBase} ${boxState(error)} h-14 appearance-none pb-1.5 pr-10 pt-5`}
        >
          <option value="">Select…</option>
          {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <label htmlFor={id} className="pointer-events-none absolute left-4 top-2.5 text-xs font-semibold text-[#0B2451]">
          {field.label}<RequiredMark required={field.required} />
        </label>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A5874]" />
      </div>
      <FieldMessage name={field.name} error={error} hint={field.hint} />
    </div>
  )
}

// Radio choices as cards; the selected card gets a sliding highlight.
export function CardsField({ field, register, error, value, recheck }) {
  const id = fieldId(field.name)
  return (
    <fieldset id={id} tabIndex={-1} aria-describedby={describedBy(field.name, error, field.hint)} className="m-0 border-0 p-0 focus:outline-none">
      <legend className="mb-3 font-semibold text-[#14213D]">{field.label}<RequiredMark required={field.required} /></legend>
      <div className="grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        {field.options.map(([title, text]) => {
          const checked = value === title
          return (
            <label key={title} className={`relative isolate flex min-h-16 cursor-pointer gap-3 rounded-2xl border p-4 transition-colors ${checked ? 'border-transparent' : error ? 'border-[#B42318]' : 'border-[#D9E1EC] hover:border-[#8EA3C2]'}`}>
              {checked && (
                <motion.span layoutId={`card-${field.name}`} transition={spring.interactive} className="absolute inset-0 -z-10 rounded-2xl border-2 border-[#0B2451] bg-[#EEF4FD]" />
              )}
              <input type="radio" value={title} {...register(field.name, { ...buildRules(field), onChange: () => error && recheck(field.name) })} className="peer sr-only" />
              <span aria-hidden="true" className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 peer-focus-visible:ring-4 peer-focus-visible:ring-[#F5A900]/40 ${checked ? 'border-[#0B2451]' : 'border-[#8EA3C2]'}`}>
                {checked && <motion.span layoutId={`dot-${field.name}`} className="h-2.5 w-2.5 rounded-full bg-[#0B2451]" />}
              </span>
              <span>
                <span className="block font-semibold text-[#14213D]">{title}</span>
                {text && <span className="block text-sm text-[#4A5874]">{text}</span>}
              </span>
            </label>
          )
        })}
      </div>
      <FieldMessage name={field.name} error={error} hint={field.hint} />
    </fieldset>
  )
}

// Multi-select chips (checkbox group).
export function ChipsField({ field, register, error, value = [], recheck }) {
  const id = fieldId(field.name)
  const selected = Array.isArray(value) ? value : []
  return (
    <fieldset id={id} tabIndex={-1} aria-describedby={describedBy(field.name, error, field.hint)} className="m-0 border-0 p-0 focus:outline-none">
      <legend className="mb-3 font-semibold text-[#14213D]">{field.label}<RequiredMark required={field.required} /></legend>
      <div className="flex flex-wrap gap-2.5">
        {field.options.map((option) => {
          const checked = selected.includes(option)
          return (
            <label key={option} className={`flex min-h-12 cursor-pointer items-center gap-2.5 rounded-xl border px-4 text-[15px] font-medium transition-colors ${checked ? 'border-2 border-[#0B2451] bg-[#EEF4FD] text-[#0B2451]' : error ? 'border-[#B42318]' : 'border-[#D9E1EC] text-[#14213D] hover:border-[#8EA3C2]'}`}>
              <input type="checkbox" value={option} {...register(field.name, { ...buildRules(field), onChange: () => error && recheck(field.name) })} className="peer sr-only" />
              <span aria-hidden="true" className={`grid h-5 w-5 place-items-center rounded-md border-2 peer-focus-visible:ring-4 peer-focus-visible:ring-[#F5A900]/40 ${checked ? 'border-[#0B2451] bg-[#0B2451]' : 'border-[#8EA3C2] bg-white'}`}>
                <AnimatePresence>
                  {checked && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring.interactive}>
                      <Check className="h-3.5 w-3.5 text-[#F5A900]" strokeWidth={3} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              {option}
            </label>
          )
        })}
      </div>
      <FieldMessage name={field.name} error={error} hint={field.hint} />
    </fieldset>
  )
}

export function NoticeField({ field }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-[#D9E1EC] bg-[#F7F9FC] p-4">
      <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#1558B0]" />
      <div className="text-sm leading-6 text-[#4A5874]">
        <p className="flex flex-wrap items-center gap-2 font-semibold text-[#14213D]">
          {field.label}
          {field.value && <Pending />}
        </p>
        <p className="mt-1">{field.text}</p>
      </div>
    </div>
  )
}

export function Field({ field, register, errors, values, recheck }) {
  const props = { field, register, error: errors[field.name], value: values?.[field.name], recheck }
  switch (field.type) {
    case 'phone': return <PhoneField {...props} />
    case 'select': return <SelectField {...props} />
    case 'cards': return <CardsField {...props} />
    case 'chips': return <ChipsField {...props} />
    case 'notice': return <NoticeField field={field} />
    default: return <TextField {...props} />
  }
}
