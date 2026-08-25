import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import FormField from '../../components/forms/FormField'
import { authApi } from '../../api/auth'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()

  const onRequestOtp = async (values) => {
    try {
      const response = await authApi.forgotPassword(values)
      const nextEmail = String(values.email || '').trim().toLowerCase()
      setEmail(nextEmail)
      setStep('otp')
      toast.success(response.data?.message || 'OTP sent to your email')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to send OTP')
    }
  }

  const onVerifyOtp = async () => {
    setIsVerifying(true)
    try {
      const response = await authApi.verifyForgotPasswordOtp({ email, otp })
      const payload = { email: response.data?.data?.email || email, otp }
      sessionStorage.setItem('gloaro_forgot_password', JSON.stringify(payload))
      reset({ email: payload.email })
      navigate('/reset-password', { state: payload })
      toast.success(response.data?.message || 'OTP verified')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="w-full rounded-lg bg-white p-6 shadow-xl">
      <h2 className="font-playfair text-4xl font-bold text-[#0d4697]">Forgot Password</h2>
      <p className="mt-2 text-sm text-slate-600">
        {step === 'email' ? 'Enter your email and we’ll send you a one-time password.' : 'Enter the OTP sent to your email.'}
      </p>

      {step === 'email' ? (
        <form onSubmit={handleSubmit(onRequestOtp)}>
          <FormField label="Email">
            <input {...register('email', { required: true })} type="email" className="h-11 w-full rounded-md border border-slate-300 px-3" />
          </FormField>
          <button disabled={isSubmitting} className="mt-5 h-12 w-full rounded-md bg-[#0d4697] font-extrabold text-white">Send OTP</button>
        </form>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            OTP sent to <span className="font-bold">{email}</span>
          </div>
          <FormField label="OTP">
            <input value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" maxLength={6} type="text" className="h-11 w-full rounded-md border border-slate-300 px-3 tracking-[0.35em]" />
          </FormField>
          <div className="flex gap-3">
            <button type="button" onClick={() => { setStep('email'); setOtp('') }} className="h-12 flex-1 rounded-md border border-slate-300 font-extrabold text-slate-700">
              Change Email
            </button>
            <button type="button" disabled={isVerifying || otp.length !== 6} onClick={onVerifyOtp} className="h-12 flex-1 rounded-md bg-[#0d4697] font-extrabold text-white disabled:opacity-60">
              {isVerifying ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
