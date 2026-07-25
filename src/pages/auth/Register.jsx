import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import FormField from '../../components/forms/FormField'
import { useAuth } from '../../hooks/useAuth'
import { normalizeRegistrationType, getRegistrationTypeLabel } from '../../utils/onboarding'

const typeRoleMap = {
  membership: ROLES.CUSTOMER,
  franchise: ROLES.CUSTOMER,
  b2b: ROLES.CUSTOMER,
  [ROLES.USER]: ROLES.CUSTOMER,
  [ROLES.VENDOR]: ROLES.CUSTOMER,
}

import api from '../../api/axios'
import toast from 'react-hot-toast'
import { ROLES } from '../../constants/roleConfig.js'

export default function Register() {
  const { register: createAccount } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const query = new URLSearchParams(location.search)
  const type = query.get('type') || ROLES.USER
  const registrationType = normalizeRegistrationType(type)
  const role = typeRoleMap[type] || ROLES.CUSTOMER
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { role, registrationType } })

  const [referralCode, setReferralCode] = useState('')
  const [validatingCode, setValidatingCode] = useState(false)
  const [referralInfo, setReferralInfo] = useState(null)
  const [referralError, setReferralError] = useState(null)

  const handleValidateReferral = () => {
    if (!referralCode.trim()) {
      setReferralError('Please enter a referral code')
      return
    }
    setValidatingCode(true)
    setReferralError(null)
    setReferralInfo(null)

    api.get(`/auth/validate-referral/${referralCode.trim()}`)
      .then(res => {
        setReferralInfo(res.data?.data || null)
        toast.success('Referral code verified!')
      })
      .catch((err) => {
        setReferralError(err.response?.data?.message || 'Invalid Referral Code')
      })
      .finally(() => {
        setValidatingCode(false)
      })
  }

  const onSubmit = async (values) => {
    await createAccount({
      ...values,
      role,
      registrationType,
      onboardingType: registrationType,
      referralCode: referralCode.trim() || undefined,
    })
    navigate(`/login?type=${type}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-lg bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,.12)]">
      <h2 className="font-playfair text-4xl font-bold text-[#0d4697]">Create {getRegistrationTypeLabel(registrationType)} Account</h2>
      <div className="mt-6 space-y-4">
        <FormField label="Name" error={errors.name?.message}><input {...register('name', { required: 'Name is required' })} className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none" /></FormField>
        <FormField label="Email" error={errors.email?.message}><input {...register('email', { required: 'Email is required' })} type="email" className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none" /></FormField>
        <FormField label="Phone"><input {...register('phone')} className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none" /></FormField>
        <input type="hidden" {...register('role')} value={role} />
        <input type="hidden" {...register('registrationType')} value={registrationType} />
        <FormField label="Password" error={errors.password?.message}>
          <div className="relative">
            <input
              {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
              type={showPassword ? 'text' : 'password'}
              className="h-11 w-full rounded-md border border-slate-300 px-3 pr-11 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 transition hover:text-slate-700"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </FormField>
        <FormField label="Do you have a Referral Code? (Optional)" error={referralError}>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="e.g. GLR-REF-000245"
              className="h-11 flex-1 rounded-md border border-slate-300 px-3 outline-none font-bold text-slate-800"
            />
            <button
              type="button"
              onClick={handleValidateReferral}
              disabled={validatingCode}
              className="h-11 px-4 rounded-md bg-[#0d4697] text-white text-xs font-extrabold hover:bg-blue-800 disabled:opacity-60 transition shrink-0"
            >
              {validatingCode ? 'Checking...' : 'Validate'}
            </button>
          </div>
          {referralInfo && (
            <div className="mt-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800 space-y-1">
              <p className="font-extrabold flex items-center gap-1">
                <span className="text-emerald-600">✓</span> Referred by: <span className="font-black">{referralInfo.referredBy}</span>
              </p>
              <p className="font-extrabold">Assigned Vendor: <span className="font-black text-slate-800">{referralInfo.assignedVendor}</span></p>
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-emerald-200 font-bold text-emerald-700">
                <p>Chapter: {referralInfo.chapter}</p>
                <p>Member ID: {referralInfo.memberId}</p>
              </div>
            </div>
          )}
        </FormField>
      </div>
      <button disabled={isSubmitting} className="mt-5 h-12 w-full rounded-md bg-[#0d4697] font-extrabold text-white disabled:opacity-60">{isSubmitting ? 'Creating...' : 'Create Account'}</button>
      <p className="mt-6 text-center text-sm font-medium text-slate-500">Already have an account? <Link to={`/login?type=${type}`} className="font-extrabold text-[#0d4697]">Sign in</Link></p>
    </form>
  )
}
