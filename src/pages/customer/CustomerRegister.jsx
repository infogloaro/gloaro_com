import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import FormField from '../../components/forms/FormField'
import { customerAuthApi } from '../../api/customerAuth'

export default function CustomerRegister() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (values) => {
    await customerAuthApi.register(values)
    navigate('/login', { replace: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-lg bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,.12)]">
      <h2 className="font-playfair text-4xl font-bold text-[#0d4697]">Customer Registration</h2>
      <p className="mt-2 text-sm font-medium text-slate-500">Create your isolated customer account.</p>
      <div className="mt-6 space-y-4">
        <FormField label="Full Name" error={errors.fullName?.message}>
          <input {...register('fullName', { required: 'Full name is required' })} className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#0d4697]" />
        </FormField>
        <FormField label="Email" error={errors.email?.message}>
          <input {...register('email', { required: 'Email is required' })} type="email" className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#0d4697]" />
        </FormField>
        <FormField label="Mobile Number" error={errors.mobileNumber?.message}>
          <input {...register('mobileNumber', { required: 'Mobile number is required' })} className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#0d4697]" />
        </FormField>
        <FormField label="Password" error={errors.password?.message}>
          <div className="relative">
            <input {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })} type={showPassword ? 'text' : 'password'} className="h-11 w-full rounded-md border border-slate-300 px-3 pr-11 outline-none focus:border-[#0d4697]" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </FormField>
        <FormField label="Confirm Password" error={errors.confirmPassword?.message}>
          <div className="relative">
            <input
              {...register('confirmPassword', {
                required: 'Confirm password is required',
                validate: (value) => value === watch('password') || 'Passwords do not match',
              })}
              type={showConfirmPassword ? 'text' : 'password'}
              className="h-11 w-full rounded-md border border-slate-300 px-3 pr-11 outline-none focus:border-[#0d4697]"
            />
            <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </FormField>
      </div>
      <button disabled={isSubmitting} className="mt-5 h-12 w-full rounded-md bg-[#0d4697] font-extrabold text-white disabled:opacity-60">
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>
      <p className="mt-6 text-center text-sm font-medium text-slate-500">
        Existing customer? <Link to="/login" className="font-extrabold text-[#0d4697]">Sign in</Link>
      </p>
    </form>
  )
}
