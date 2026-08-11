import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { notificationApi } from '../../api/notification'
import FormField from '../../components/forms/FormField'
import { useAuth } from '../../hooks/useAuth'
import { ROLES } from '../../constants/roleConfig'
import { normalizeRole } from '../../utils/permissions'
import NotificationsPage from '../shared/NotificationsPage'

export default function AdminNotifications() {
  const { hasSection, hasOperation, user } = useAuth()
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      type: 'announcement',
      category: 'broadcast',
      priority: 'normal',
      targetRoles: '',
      targetUsers: '',
    },
  })
  const isCoreAdmin = [ROLES.ADMIN, ROLES.SUPERADMIN].includes(normalizeRole(user?.role))
  const canViewNotifications = isCoreAdmin || (hasSection('settings', 'notifications') && hasOperation('settings', 'view'))
  const canCreateBroadcast = isCoreAdmin || hasOperation('settings', 'create')
  const onSubmit = async (values) => {
    const splitValues = (value) => String(value || '').split(',').map((item) => item.trim()).filter(Boolean)
    await notificationApi.broadcast({
      ...values,
      targetRoles: splitValues(values.targetRoles),
      targetUsers: splitValues(values.targetUsers),
    })
    toast.success('Broadcast sent')
    reset({ type: 'announcement', category: 'broadcast', priority: 'normal', targetRoles: '', targetUsers: '' })
  }

  if (!canViewNotifications) return null

  return (
    <div className="space-y-6">
      {canCreateBroadcast && <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-extrabold">Broadcast Notification</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <FormField label="Title"><input {...register('title', { required: true })} className="h-11 w-full rounded-md border border-slate-200 px-3" /></FormField>
          <FormField label="Type"><input {...register('type')} className="h-11 w-full rounded-md border border-slate-200 px-3" /></FormField>
          <FormField label="Message"><input {...register('message', { required: true })} className="h-11 w-full rounded-md border border-slate-200 px-3" /></FormField>
          <FormField label="Category">
            <select {...register('category')} className="h-11 w-full rounded-md border border-slate-200 px-3">
              {['broadcast', 'role', 'hierarchy', 'community', 'system'].map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </FormField>
          <FormField label="Priority">
            <select {...register('priority')} className="h-11 w-full rounded-md border border-slate-200 px-3">
              {['low', 'normal', 'high'].map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </FormField>
          <FormField label="Module"><input {...register('module')} className="h-11 w-full rounded-md border border-slate-200 px-3" placeholder="meetings, marketplace, training" /></FormField>
          <FormField label="Target Roles"><input {...register('targetRoles')} className="h-11 w-full rounded-md border border-slate-200 px-3" placeholder="admin,chapter_president" /></FormField>
          <FormField label="Target Users"><input {...register('targetUsers')} className="h-11 w-full rounded-md border border-slate-200 px-3" placeholder="User IDs separated by comma" /></FormField>
          <FormField label="Region ID"><input {...register('region')} className="h-11 w-full rounded-md border border-slate-200 px-3" /></FormField>
          <FormField label="State ID"><input {...register('state')} className="h-11 w-full rounded-md border border-slate-200 px-3" /></FormField>
          <FormField label="District ID"><input {...register('district')} className="h-11 w-full rounded-md border border-slate-200 px-3" /></FormField>
          <FormField label="Unit ID"><input {...register('chapter')} className="h-11 w-full rounded-md border border-slate-200 px-3" /></FormField>
          <FormField label="Action URL"><input {...register('actionUrl')} className="h-11 w-full rounded-md border border-slate-200 px-3" /></FormField>
        </div>
        <button disabled={isSubmitting} className="mt-4 h-10 rounded-md bg-[#0d4697] px-5 font-bold text-white">Send</button>
      </form>}
      <NotificationsPage module="settings" section="notifications" systemView />
    </div>
  )
}
