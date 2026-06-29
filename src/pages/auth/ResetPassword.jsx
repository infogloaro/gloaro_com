import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { authApi } from '../../api/auth'
import FormField from '../../components/forms/FormField'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()
  const onSubmit = async (values) => {
    await authApi.resetPassword(token, values)
    toast.success('Password reset successful')
    navigate('/login')
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-lg bg-white p-6 shadow-xl">
      <h2 className="font-playfair text-4xl font-bold text-[#0d4697]">Reset Password</h2>
      <FormField label="New Password"><input {...register('password', { required: true, minLength: 8 })} type="password" className="h-11 w-full rounded-md border border-slate-300 px-3" /></FormField>
      <button disabled={isSubmitting} className="mt-5 h-12 w-full rounded-md bg-[#0d4697] font-extrabold text-white">Reset Password</button>
    </form>
  )
}
