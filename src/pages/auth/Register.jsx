import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import { customerAuthApi } from '../../api/customerAuth'
import FormField from '../../components/forms/FormField'
import { useAuth } from '../../hooks/useAuth'
import { ROLES } from '../../constants/roleConfig.js'

const REGISTER_ROLES = [
  { value: 'customer', label: 'Customer' },
  { value: 'online_member', label: 'Online Member' },
  { value: 'online_vendor', label: 'Online Vendor' },
]

export default function Register() {
  const { register: createAccount } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('customer')
  const [referralCode, setReferralCode] = useState('')
  const [validatingCode, setValidatingCode] = useState(false)
  const [referralInfo, setReferralInfo] = useState(null)
  const [referralError, setReferralError] = useState(null)
  const showReferralCode = role === 'online_member' || role === 'online_vendor'

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      termsAccepted: false,
    },
  })
  const nameField = register('name', {
    required: 'Name is required',
    pattern: {
      value: /^[\p{L}\s]+$/u,
      message: 'Name can contain letters and spaces only',
    },
  })
  const phoneField = register('phone', {
    required: 'Phone is required',
    pattern: {
      value: /^\d{10}$/,
      message: 'Phone number must contain exactly 10 digits',
    },
  })

  const title = useMemo(() => {
    if (role === 'online_vendor') return 'Create Vendor Account'
    if (role === 'online_member') return 'Create Member Account'
    return 'Create Customer Account'
  }, [role])

  const roleDescription = useMemo(() => {
    if (role === 'online_vendor') return 'Register as an online vendor using the existing vendor registration flow.'
    if (role === 'online_member') return 'Register as an online member using the existing member registration flow.'
    return 'Create your isolated customer account using the existing customer registration flow.'
  }, [role])

  const handleValidateReferral = () => {
    if (!referralCode.trim()) {
      setReferralError('Please enter a referral code')
      return
    }

    setValidatingCode(true)
    setReferralError(null)
    setReferralInfo(null)

    api.get(`/auth/validate-referral/${referralCode.trim()}`)
      .then((res) => {
        setReferralInfo(res.data?.data || null)
        toast.success('Connect code verified!')
      })
      .catch((err) => {
        setReferralError(err.response?.data?.message || 'Invalid Connect Code')
      })
      .finally(() => {
        setValidatingCode(false)
      })
  }

  const handleRoleChange = (nextRole) => {
    setRole(nextRole)
    if (nextRole === 'customer') {
      setReferralCode('')
      setReferralInfo(null)
      setReferralError(null)
    }
  }

  const onSubmit = async (values) => {
    if (role === 'customer') {
      await customerAuthApi.register({
        fullName: values.name,
        email: values.email,
        mobileNumber: values.phone,
        password: values.password,
        confirmPassword: values.password,
      })
      navigate('/login', { replace: true })
      return
    }

    const isVendor = role === 'online_vendor'
    await createAccount({
      name: values.name,
      email: values.email,
      phone: values.phone,
      password: values.password,
      role: isVendor ? ROLES.VENDOR : ROLES.USER,
      registrationType: isVendor ? 'vendor' : 'member',
      onboardingType: isVendor ? 'vendor' : 'member',
      referralCode: referralCode.trim() || undefined,
    })
    navigate('/login', { replace: true })
  }

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="w-full overflow-hidden rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,250,255,0.98))] p-6 shadow-[0_28px_90px_rgba(15,23,42,.12)] sm:p-8"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-[#0d4697]/10 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#0d4697] shadow-sm">
        <BadgeCheck className="h-4 w-4 text-[#ffae13]" />
        Join the network
      </div>
      <h2 className="mt-5 font-playfair text-4xl font-bold italic leading-[0.92] text-[#0d4697] sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 max-w-md text-sm font-medium leading-7 text-slate-600">{roleDescription}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ['Secure signup', 'Protected onboarding flow'],
          ['Flexible roles', 'Choose customer, member, or vendor'],
          ['Growth ready', 'Start with networking support'],
        ].map(([label, text]) => (
          <div key={label} className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,.05)]">
            <p className="text-sm font-extrabold text-[#0d4697]">{label}</p>
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <FormField label="Role">
          <select
            value={role}
            onChange={(event) => handleRoleChange(event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-[#0d4697] focus:ring-4 focus:ring-[#0d4697]/10"
          >
            {REGISTER_ROLES.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Name" error={errors.name?.message}>
          <input
            {...nameField}
            onChange={(event) => {
              event.target.value = event.target.value.replace(/[^\p{L}\s]/gu, '')
              nameField.onChange(event)
            }}
            autoComplete="name"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition placeholder:text-slate-400 focus:border-[#0d4697] focus:ring-4 focus:ring-[#0d4697]/10"
          />
        </FormField>

        <FormField label="Email" error={errors.email?.message}>
          <input
            {...register('email', { required: 'Email is required' })}
            type="email"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition placeholder:text-slate-400 focus:border-[#0d4697] focus:ring-4 focus:ring-[#0d4697]/10"
          />
        </FormField>

        <FormField label="Phone" error={errors.phone?.message}>
          <input
            {...phoneField}
            onChange={(event) => {
              event.target.value = event.target.value.replace(/\D/g, '').slice(0, 10)
              phoneField.onChange(event)
            }}
            type="tel"
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition placeholder:text-slate-400 focus:border-[#0d4697] focus:ring-4 focus:ring-[#0d4697]/10"
          />
        </FormField>

        <FormField label="Password" error={errors.password?.message}>
          <div className="relative">
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
              })}
              type={showPassword ? 'text' : 'password'}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-12 outline-none transition placeholder:text-slate-400 focus:border-[#0d4697] focus:ring-4 focus:ring-[#0d4697]/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 transition hover:text-[#0d4697]"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </FormField>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-600">
          <input
            type="checkbox"
            {...register('termsAccepted', { required: 'Please accept the terms and conditions' })}
            className="mt-1 h-4 w-4 rounded border-slate-300 accent-[#0d4697]"
          />
          <span>
            I agree to the{' '}
            <Link to="/terms-and-conditions" className="font-extrabold text-[#0d4697] transition hover:text-[#082e70]">
              terms and conditions
            </Link>
            ,{' '}
            <Link to="/privacy-policy" className="font-extrabold text-[#0d4697] transition hover:text-[#082e70]">
              privacy policy
            </Link>
            , and marketplace guidelines.
          </span>
        </label>
        {errors.termsAccepted && <p className="text-xs font-semibold text-rose-600">{errors.termsAccepted.message}</p>}

        {showReferralCode && (
          <FormField label="Do you have a Connect Code? (Optional)" error={referralError}>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralCode}
                onChange={(event) => setReferralCode(event.target.value)}
                placeholder="e.g. GLR-REF-000245"
                className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 outline-none font-bold text-slate-800 transition placeholder:text-slate-400 focus:border-[#0d4697] focus:ring-4 focus:ring-[#0d4697]/10"
              />
              <button
                type="button"
                onClick={handleValidateReferral}
                disabled={validatingCode}
                className="h-12 shrink-0 rounded-full bg-[linear-gradient(135deg,#0d4697,#1b6fe0)] px-4 text-xs font-extrabold text-white shadow-[0_12px_26px_rgba(13,70,151,0.18)] transition duration-300 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
              >
                {validatingCode ? 'Checking...' : 'Validate'}
              </button>
            </div>

            {referralInfo && (
              <div className="mt-2 space-y-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800">
                <p className="flex items-center gap-1 font-extrabold">
                  <BadgeCheck className="h-4 w-4 text-emerald-600" />
                  Referred by: <span className="font-black">{referralInfo.referredBy}</span>
                </p>
                <p className="font-extrabold">Assigned Vendor: <span className="font-black text-slate-800">{referralInfo.assignedVendor}</span></p>
                <div className="mt-2 grid grid-cols-2 gap-2 border-t border-emerald-200 pt-2 font-bold text-emerald-700">
                  <p>Chapter: {referralInfo.chapter}</p>
                  <p>Member ID: {referralInfo.memberId}</p>
                </div>
              </div>
            )}
          </FormField>
        )}
      </div>

      <button
        disabled={isSubmitting}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#0d4697,#1b6fe0)] px-5 font-extrabold text-white shadow-[0_16px_34px_rgba(13,70,151,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(13,70,151,0.28)] disabled:translate-y-0 disabled:opacity-60"
      >
        {isSubmitting ? 'Creating...' : 'Create Account'}
        {!isSubmitting && <ArrowRight className="h-4 w-4" />}
      </button>

      <div className="mt-6 rounded-2xl border border-[#0d4697]/10 bg-[#f8fbff] p-4">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#0d4697]">
          <ShieldCheck className="h-4 w-4 text-[#ffae13]" />
          Guided onboarding
        </div>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
          Already have an account? <Link to="/login" className="font-extrabold text-[#0d4697] transition hover:text-[#082e70]">Sign in</Link>
        </p>
      </div>
    </motion.form>
  )
}
