import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import FormField from '../../components/forms/FormField'
import { customerAuthApi } from '../../api/customerAuth'
import { storage } from '../../utils/storage'

export default function CustomerLogin() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { remember: true } })

  const onSubmit = async (values) => {
    const response = await customerAuthApi.login({
      email: values.email,
      password: values.password,
    })
    const data = response.data?.data || {}
    storage.setSession({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken }, values.remember)
    navigate('/', { replace: true })
    window.location.reload()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-lg bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,.12)]">
      <h2 className="font-playfair text-4xl font-bold text-[#0d4697]">Customer Sign In</h2>
      <p className="mt-2 text-sm font-medium text-slate-500">Access your dedicated customer dashboard.</p>
      <div className="mt-6 space-y-4">
        <FormField label="Email" error={errors.email?.message}>
          <input {...register('email', { required: 'Email is required' })} type="email" className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#0d4697]" />
        </FormField>
        <FormField label="Password" error={errors.password?.message}>
          <div className="relative">
            <input {...register('password', { required: 'Password is required' })} type={showPassword ? 'text' : 'password'} className="h-11 w-full rounded-md border border-slate-300 px-3 pr-11 outline-none focus:border-[#0d4697]" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </FormField>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-600">
        <input type="checkbox" {...register('remember')} className="accent-[#0d4697]" />
        Remember me
      </label>
      <button disabled={isSubmitting} className="mt-5 h-12 w-full rounded-md bg-[#0d4697] font-extrabold text-white disabled:opacity-60">
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>
      <p className="mt-6 text-center text-sm font-medium text-slate-500">
        New customer? <Link to="/customer/register" className="font-extrabold text-[#0d4697]">Create an account</Link>
      </p>
    </form>
  )
}
