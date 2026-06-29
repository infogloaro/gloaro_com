import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import FormField from '../../components/forms/FormField'
import { authApi } from '../../api/auth'

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()
  const onSubmit = async (values) => {
    const response = await authApi.forgotPassword(values)
    toast.success(response.data.message || 'Reset link sent')
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-lg bg-white p-6 shadow-xl">
      <h2 className="font-playfair text-4xl font-bold text-[#0d4697]">Forgot Password</h2>
      <FormField label="Email"><input {...register('email', { required: true })} type="email" className="h-11 w-full rounded-md border border-slate-300 px-3" /></FormField>
      <button disabled={isSubmitting} className="mt-5 h-12 w-full rounded-md bg-[#0d4697] font-extrabold text-white">Send Reset Link</button>
    </form>
  )
}
