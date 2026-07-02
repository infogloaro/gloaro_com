import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FormField from '../../components/forms/FormField'
import { useAuth } from '../../hooks/useAuth'

const typeRoleMap = {
  vendor: 'vendor',
  membership: 'customer',
  franchise: 'customer',
  b2b: 'customer',
  user: 'customer',
}

export default function Register() {
  const { register: createAccount } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const type = query.get('type') || 'user'
  const role = typeRoleMap[type] || 'customer'
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { role } })

  const onSubmit = async (values) => {
    await createAccount({ ...values, role })
    navigate(`/login?type=${type}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-lg bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,.12)]">
      <h2 className="font-playfair text-4xl font-bold text-[#0d4697]">{role === 'vendor' ? 'Create Vendor Account' : 'Create User Account'}</h2>
      <div className="mt-6 space-y-4">
        <FormField label="Name" error={errors.name?.message}><input {...register('name', { required: 'Name is required' })} className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none" /></FormField>
        <FormField label="Email" error={errors.email?.message}><input {...register('email', { required: 'Email is required' })} type="email" className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none" /></FormField>
        <FormField label="Phone"><input {...register('phone')} className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none" /></FormField>
        <input type="hidden" {...register('role')} value={role} />
        <FormField label="Password" error={errors.password?.message}><input {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })} type="password" className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none" /></FormField>
      </div>
      <button disabled={isSubmitting} className="mt-5 h-12 w-full rounded-md bg-[#0d4697] font-extrabold text-white disabled:opacity-60">{isSubmitting ? 'Creating...' : 'Create Account'}</button>
      <p className="mt-6 text-center text-sm font-medium text-slate-500">Already have an account? <Link to={`/login?type=${type}`} className="font-extrabold text-[#0d4697]">Sign in</Link></p>
    </form>
  )
}
