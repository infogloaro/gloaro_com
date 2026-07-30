import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
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
        toast.success('Referral code verified!')
      })
      .catch((err) => {
        setReferralError(err.response?.data?.message || 'Invalid Referral Code')
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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-lg bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,.12)]">
      <h2 className="font-playfair text-4xl font-bold text-[#0d4697]">{title}</h2>
      <p className="mt-2 text-sm font-medium text-slate-500">{roleDescription}</p>

      <div className="mt-6 space-y-4">
        <FormField label="Role">
          <select
            value={role}
            onChange={(event) => handleRoleChange(event.target.value)}
            className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 outline-none focus:border-[#0d4697]"
          >
            {REGISTER_ROLES.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Name" error={errors.name?.message}>
          <input
            {...register('name', { required: 'Name is required' })}
            className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#0d4697]"
          />
        </FormField>

        <FormField label="Email" error={errors.email?.message}>
          <input
            {...register('email', { required: 'Email is required' })}
            type="email"
            className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#0d4697]"
          />
        </FormField>

        <FormField label="Phone" error={errors.phone?.message}>
          <input
            {...register('phone', { required: 'Phone is required' })}
            className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#0d4697]"
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
              className="h-11 w-full rounded-md border border-slate-300 px-3 pr-11 outline-none focus:border-[#0d4697]"
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

        {showReferralCode && (
          <FormField label="Do you have a Referral Code? (Optional)" error={referralError}>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralCode}
                onChange={(event) => setReferralCode(event.target.value)}
                placeholder="e.g. GLR-REF-000245"
                className="h-11 flex-1 rounded-md border border-slate-300 px-3 outline-none font-bold text-slate-800"
              />
              <button
                type="button"
                onClick={handleValidateReferral}
                disabled={validatingCode}
                className="h-11 shrink-0 rounded-md bg-[#0d4697] px-4 text-xs font-extrabold text-white transition hover:bg-blue-800 disabled:opacity-60"
              >
                {validatingCode ? 'Checking...' : 'Validate'}
              </button>
            </div>

            {referralInfo && (
              <div className="mt-2 space-y-1 rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800">
                <p className="flex items-center gap-1 font-extrabold">
                  <span className="text-emerald-600">+</span> Referred by: <span className="font-black">{referralInfo.referredBy}</span>
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

      <button disabled={isSubmitting} className="mt-5 h-12 w-full rounded-md bg-[#0d4697] font-extrabold text-white disabled:opacity-60">
        {isSubmitting ? 'Creating...' : 'Create Account'}
      </button>

      <p className="mt-6 text-center text-sm font-medium text-slate-500">
        Already have an account? <Link to="/login" className="font-extrabold text-[#0d4697]">Sign in</Link>
      </p>
    </form>
  )
}
