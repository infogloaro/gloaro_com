import { useState } from 'react'
import signupImage from '../assets/signup_img.png'
import signupLogo from '../assets/signup_logo.png'

const EyeIcon = () => <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="3" /></svg>
const AppleIcon = () => <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M16.7 12.7c0-2.1 1.7-3.1 1.8-3.2-1-1.5-2.6-1.7-3.1-1.7-1.3-.1-2.5.8-3.2.8s-1.7-.8-2.8-.8c-1.4 0-2.7.8-3.5 2.1-1.5 2.7-.4 6.7 1.1 8.8.7 1 1.6 2.2 2.8 2.1 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 1.9-1 2.7-2.1.8-1.2 1.1-2.3 1.1-2.4 0 0-2.4-.9-2.5-3.6ZM14.6 6.4c.6-.8 1-1.8.9-2.8-.9 0-1.9.6-2.6 1.3-.6.7-1 1.7-.9 2.7 1 0 2-.5 2.6-1.2Z" /></svg>
const GoogleIcon = () => <span className="font-inter text-base font-bold text-[#4285f4]">G</span>
import { getDashboardRoute } from '../utils/permissions'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'

export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '', remember: false })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (event) => {
    const { name, value, checked, type } = event.target
    setFormData((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: '', message: '' })
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        const error = new Error(result.message || 'Unable to sign in. Please check your credentials.')
        error.status = response.status
        throw error
      }

      const storage = formData.remember ? localStorage : sessionStorage
      storage.setItem('gloaro_user', JSON.stringify(result.data.user))
      storage.setItem('gloaro_access_token', result.data.accessToken)
      storage.setItem('gloaro_refresh_token', result.data.refreshToken)

      setStatus({ type: 'success', message: 'Signed in successfully. Redirecting...' })
      window.setTimeout(() => {
        window.location.href = getDashboardRoute(result.data.user?.role, result.data.user)
      }, 700)
    } catch (error) {
      if (error.status === 429) {
        setStatus({ type: '', message: '' })
        return
      }
      setStatus({ type: 'error', message: error.message || 'Sign in failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-white font-urbanist text-[#101827] lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#111a22] lg:block">
        <img src={signupImage} alt="Gloaro business analytics workspace" className="absolute inset-0 h-full w-full object-cover opacity-40" />

        <div className="absolute left-1/2 top-1/2 grid h-64 w-[330px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[26px] border border-white/15 bg-white/20 shadow-2xl backdrop-blur-md">
          <div className="text-center text-white">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/15 p-2">
              <img src={signupLogo} alt="Gloaro Business Network" className="h-auto w-full" />
            </div>
            <h1 className="mt-5 font-inter text-4xl font-extrabold tracking-[0.22em]">GLOARO</h1>
            <p className="font-inter text-xs font-extrabold tracking-[0.2em]">BUSINESS NETWORK</p>
            <p className="mt-2 font-inter text-[8px] font-extrabold tracking-[0.12em]">360 CONNECT • CONNECT • GROW • COLLABORATE</p>
          </div>
        </div>

        <p className="absolute bottom-10 left-10 font-urbanist text-sm font-medium text-white">✦ Innovative Business Solutions</p>
      </section>

      <section className="flex min-h-screen flex-col bg-white px-5 py-8 sm:px-8">
        <div className="mx-auto flex w-full max-w-[430px] flex-1 items-center">
          <form className="w-full rounded-[28px] bg-white px-6 py-10 shadow-[0_22px_70px_rgba(15,23,42,.12)] sm:px-10" onSubmit={handleSubmit}>
            <div className="text-center">
              <img src={signupLogo} alt="Gloaro Business Network" className="mx-auto mb-4 h-auto w-20 lg:hidden" />
              <h2 className="font-playfair text-4xl font-bold text-[#0d4697]">Sign In</h2>
              <p className="mt-1 text-sm font-medium text-[#667085]">Access your Gloaro account to continue.</p>
            </div>

            <div className="mt-7 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-[#151515]">Mobile Number / Email</span>
                <input name="email" type="email" value={formData.email} onChange={updateField} placeholder="name@company.com" required className="mt-1 h-11 w-full rounded-md border border-[#aeb4c0] px-3 text-sm font-medium outline-none transition placeholder:text-[#7a8291] focus:border-[#0d4697]" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-[#151515]">Password</span>
                <span className="mt-1 flex h-11 items-center rounded-md border border-[#aeb4c0] px-3 focus-within:border-[#0d4697]">
                  <input name="password" type="password" value={formData.password} onChange={updateField} placeholder="••••••" required className="min-w-0 flex-1 text-sm font-medium outline-none placeholder:text-[#7a8291]" />
                  <button type="button" aria-label="Show password" className="text-[#283547]"><EyeIcon /></button>
                </span>
              </label>
            </div>

            <label className="mt-4 flex items-center gap-2 text-sm font-medium text-[#667085]">
              <input name="remember" type="checkbox" checked={formData.remember} onChange={updateField} className="h-4 w-4 rounded border-[#aeb4c0] accent-[#0d4697]" />
              Remember me for 30 days
            </label>

            {status.message && <p className={`mt-4 rounded-md px-3 py-2 text-sm font-semibold ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{status.message}</p>}

            <button disabled={isSubmitting} className="mt-5 h-12 w-full rounded-md bg-[#0d4697] text-base font-extrabold text-white shadow-[0_10px_18px_rgba(13,70,151,.25)] transition hover:bg-[#0a3d86] disabled:cursor-not-allowed disabled:bg-[#8aa7d4]">{isSubmitting ? 'Signing In...' : 'Sign In'}</button>

            <div className="my-5 text-center text-xs font-semibold uppercase text-[#667085]">Or continue with</div>
            <div className="grid grid-cols-2 gap-6">
              <button type="button" className="flex h-10 items-center justify-center gap-2 rounded-md border border-[#aeb4c0] text-sm font-semibold text-[#283547]"><GoogleIcon /> Google</button>
              <button type="button" className="flex h-10 items-center justify-center gap-2 rounded-md border border-[#aeb4c0] text-sm font-semibold text-[#283547]"><AppleIcon /> Apple</button>
            </div>

            <p className="mt-6 flex items-center justify-between text-sm font-medium text-[#667085]">
              <span>Don't have an account?</span>
              <a href="/signup" className="font-extrabold text-[#0d4697]">Sign Up</a>
            </p>
            <p className="mt-9 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-[#98a2b3]">♢ Secure encrypted login</p>
          </form>
        </div>

        <div className="mx-auto flex w-full max-w-[430px] justify-between pt-8 text-sm font-medium text-[#667085]">
          <a href="#help">Help Center</a>
          <a href="#privacy">Privacy Policy</a>
        </div>
      </section>
    </main>
  )
}
