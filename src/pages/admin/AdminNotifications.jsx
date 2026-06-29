import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { adminApi } from '../../api/admin'
import FormField from '../../components/forms/FormField'
import NotificationsPage from '../shared/NotificationsPage'

export default function AdminNotifications() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({ defaultValues: { type: 'announcement' } })
  const onSubmit = async (values) => {
    await adminApi.broadcast(values)
    toast.success('Broadcast sent')
    reset({ type: 'announcement' })
  }
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-extrabold">Broadcast Notification</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <FormField label="Title"><input {...register('title', { required: true })} className="h-11 w-full rounded-md border border-slate-200 px-3" /></FormField>
          <FormField label="Type"><input {...register('type')} className="h-11 w-full rounded-md border border-slate-200 px-3" /></FormField>
          <FormField label="Message"><input {...register('message', { required: true })} className="h-11 w-full rounded-md border border-slate-200 px-3" /></FormField>
        </div>
        <button disabled={isSubmitting} className="mt-4 h-10 rounded-md bg-[#0d4697] px-5 font-bold text-white">Send</button>
      </form>
      <NotificationsPage />
    </div>
  )
}
