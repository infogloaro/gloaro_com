import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import api from '../../api/axios'
import FormField from '../../components/forms/FormField'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useApi } from '../../hooks/useApi'

export default function ProfilePage() {
  const { data, loading, execute } = useApi(() => api.get('/users/profile'))
  const user = data?.user || data
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()

  useEffect(() => {
    if (user) reset(user)
  }, [user, reset])

  const onSubmit = async (values) => {
    await api.patch('/users/profile', values)
    toast.success('Profile updated')
    execute()
  }

  if (loading) return <LoadingSpinner />
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-extrabold">Profile</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <FormField label="Name"><input {...register('name')} className="h-11 w-full rounded-md border border-slate-200 px-3" /></FormField>
        <FormField label="Email"><input {...register('email')} disabled className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3" /></FormField>
        <FormField label="Phone"><input {...register('phone')} className="h-11 w-full rounded-md border border-slate-200 px-3" /></FormField>
      </div>
      <button disabled={isSubmitting} className="mt-5 h-11 rounded-md bg-[#0d4697] px-5 font-extrabold text-white">Update Profile</button>
    </form>
  )
}
