import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { authApi } from '../../api/auth'
import FormField from '../../components/forms/FormField'

export default function ResetPassword() {
  const { token } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()
  const [resetSession, setResetSession] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('gloaro_forgot_password') || 'null')
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (!resetSession && location.state?.email && location.state?.otp) {
      setResetSession({ email: location.state.email, otp: location.state.otp })
    }
  }, [location.state, resetSession])

  const onSubmit = async (values) => {
    try {
      if (token) {
        await authApi.resetPassword(token, values)
      } else {
        const session = resetSession
        if (!session?.email || !session?.otp) {
          toast.error('Your reset session expired. Please request a new OTP.')
          navigate('/forgot-password')
          return
        }
        await authApi.resetPasswordWithOtp({
          email: session.email,
          otp: session.otp,
          password: values.password,
        })
      }
      sessionStorage.removeItem('gloaro_forgot_password')
      toast.success('Password reset successful')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to reset password')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-lg bg-white p-6 shadow-xl">
      <h2 className="font-playfair text-4xl font-bold text-[#0d4697]">Reset Password</h2>
      {!token && resetSession ? (
        <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          Resetting password for <span className="font-bold">{resetSession.email}</span>
        </div>
      ) : null}
      <FormField label="New Password"><input {...register('password', { required: true, minLength: 8 })} type="password" className="h-11 w-full rounded-md border border-slate-300 px-3" /></FormField>
      <FormField label="Confirm Password"><input {...register('confirmPassword', { required: true })} type="password" className="h-11 w-full rounded-md border border-slate-300 px-3" /></FormField>
      <button disabled={isSubmitting} className="mt-5 h-12 w-full rounded-md bg-[#0d4697] font-extrabold text-white">Reset Password</button>
    </form>
  )
}
