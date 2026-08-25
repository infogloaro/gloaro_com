import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import FormField from '../../components/forms/FormField'
import { useAuth } from '../../hooks/useAuth'
import { getVendorOnboardingRoutes } from '../../utils/onboarding'
import { getAccountClassification, getDashboardRoute } from '../../utils/permissions'


export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { remember: true } })
  const redirectError = location.state?.error

  const onSubmit = async (values) => {
    try {
      const signedInUser = await login({
        email: values.email,
        password: values.password,
      }, values.remember)
      const account = getAccountClassification(signedInUser)
      const fromPath = location.state?.from?.pathname
      const redirectParam = new URLSearchParams(location.search).get('redirect')
      const vendorRoutes = getVendorOnboardingRoutes(true)
      const roleDashboard = getDashboardRoute(signedInUser.role, signedInUser)
      const requestedDest = redirectParam || fromPath || ''
      const normalizedDest = String(requestedDest || '').toLowerCase()
      const shouldUseRoleDashboard =
        !requestedDest ||
        normalizedDest === '/' ||
        normalizedDest === '/login' ||
        normalizedDest === '/dashboard' ||
        normalizedDest === '/admin' ||
        normalizedDest === '/super-admin' ||
        normalizedDest.startsWith('/admin/') ||
        normalizedDest.startsWith('/super-admin/') ||
        normalizedDest.startsWith('/member/dashboard')
      const finalDest = account.isCustomerPortal
        ? '/'
        : account.registrationType === 'vendor'
        ? (account.isOnlineVendor ? roleDashboard : vendorRoutes.application)
        : (shouldUseRoleDashboard ? roleDashboard : requestedDest)
      navigate(finalDest, { replace: true })
    } catch {
      // Handled gracefully in context
    }
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
        Secure sign in
      </div>
      <h2 className="mt-5 font-playfair text-4xl font-bold italic leading-[0.92] text-[#0d4697] sm:text-5xl">
        Welcome back
      </h2>
      <p className="mt-4 max-w-md text-sm font-medium leading-7 text-slate-600">
        Access your Gloaro account and continue your business journey with a premium, secure experience.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          ['Fast access', 'Jump back into your dashboard quickly'],
          ['Protected login', 'Your account stays secure'],
        ].map(([title, text]) => (
          <div key={title} className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,.05)]">
            <p className="text-sm font-extrabold text-[#0d4697]">{title}</p>
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{text}</p>
          </div>
        ))}
      </div>

      {redirectError ? (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          {redirectError}
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        <FormField label="Email" error={errors.email?.message}>
          <input {...register('email', { required: 'Email is required' })} type="email" className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition placeholder:text-slate-400 focus:border-[#0d4697] focus:ring-4 focus:ring-[#0d4697]/10" />
        </FormField>
        <FormField label="Password" error={errors.password?.message}>
          <div className="relative">
            <input
              {...register('password', { required: 'Password is required' })}
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
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <label className="flex items-center gap-2 font-semibold text-slate-600">
          <input type="checkbox" {...register('remember')} className="h-4 w-4 rounded border-slate-300 accent-[#0d4697]" />
          Remember me
        </label>
        <Link to="/forgot-password" className="font-bold text-[#0d4697] transition hover:text-[#082e70]">
          Forgot password?
        </Link>
      </div>

      <button
        disabled={isSubmitting}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#0d4697,#1b6fe0)] px-5 font-extrabold text-white shadow-[0_16px_34px_rgba(13,70,151,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(13,70,151,0.28)] disabled:translate-y-0 disabled:opacity-60"
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
        {!isSubmitting && <ArrowRight className="h-4 w-4" />}
      </button>

      <div className="mt-6 rounded-2xl border border-[#0d4697]/10 bg-[#f8fbff] p-4">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#0d4697]">
          <ShieldCheck className="h-4 w-4 text-[#ffae13]" />
          Trusted access
        </div>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
          Need an account? <Link to="/register" className="font-extrabold text-[#0d4697] transition hover:text-[#082e70]">Create one</Link> and join the network.
        </p>
      </div>
    </motion.form>
  )
}
