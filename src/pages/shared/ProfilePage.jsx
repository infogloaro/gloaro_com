import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useEffect, useState, useMemo } from 'react'
import api from '../../api/axios'
import { adminApi } from '../../api/admin'
import FormField from '../../components/forms/FormField'
import LoadingScreen from '../../components/common/LoadingScreen'
import { useApi } from '../../hooks/useApi'
import { roleLabel } from '../../constants/adminRoles'
import { formatDate } from '../../utils/format'
import { User, Lock, MapPin, Shield, Calendar, UserCheck, Activity } from 'lucide-react'

const REPORTING_STRUCTURE = {
  admin: 'Super Admin',
  region_director: 'Admin',
  state_director: 'Region Director',
  district_director: 'State Director',
  executive_director: 'District Director',
  launch_director: 'Executive Director',
  direct_consultant: 'Launch Director',
  chapter_president: 'Direct Consultant',
  vice_president: 'Chapter President',
  secretary: 'Vice President',
}

export default function ProfilePage() {
  const { data, loading, execute } = useApi(() => api.get('/users/profile'))
  const user = data?.data || data?.user || data
  const [activity, setActivity] = useState([])
  const [loadingActivity, setLoadingActivity] = useState(false)
  const [updatingPassword, setUpdatingPassword] = useState(false)

  const { register: regProfile, handleSubmit: handleProfileSubmit, reset: resetProfile, formState: { isSubmitting } } = useForm()
  const { register: regPassword, handleSubmit: handlePasswordSubmit, reset: resetPasswordForm } = useForm()

  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      })

      // Fetch user's activity logs
      setLoadingActivity(true)
      const fetchActivity = ['admin', 'superadmin'].includes(user.role)
        ? adminApi.adminActivity(user._id, { limit: 6 })
        : api.get('/users/activity', { params: { limit: 6 } })

      fetchActivity
        .then((res) => {
          setActivity(res.data?.data || [])
        })
        .catch(() => {})
        .finally(() => setLoadingActivity(false))
    }
  }, [user, resetProfile])

  const onUpdateProfile = async (values) => {
    try {
      await api.patch('/users/profile', values)
      toast.success('Profile updated successfully')
      execute()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    }
  }

  const onUpdatePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    setUpdatingPassword(true)
    try {
      await api.post('/auth/change-password', {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      })
      toast.success('Password changed successfully')
      resetPasswordForm()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setUpdatingPassword(false)
    }
  }

  const orgLabel = useMemo(() => {
    const org = user?.meta?.adminProfile?.organization || {}
    return ['region', 'state', 'area', 'district', 'chapter']
      .map((key) => org[key])
      .filter(Boolean)
      .join(' / ') || 'None assigned'
  }, [user])

  if (loading) return <LoadingScreen label="Loading Profile..." />

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#0d4697] text-2xl font-black text-white">
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">{user?.name}</h2>
            <p className="text-sm font-bold text-slate-500">{user?.email} • {roleLabel(user?.role)}</p>
            {user?.officialId && (
              <p className="mt-1 inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-extrabold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Official ID: {user.officialId}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Forms */}
        <div className="space-y-6 lg:col-span-2">
          {/* Personal Info Form */}
          <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="flex items-center gap-2 text-lg font-black text-slate-950 dark:text-white">
              <User className="h-5 w-5 text-[#0d4697]" />
              Personal Details
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <FormField label="Full Name">
                <input {...regProfile('name')} className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#0d4697] dark:border-slate-700 dark:bg-slate-800" />
              </FormField>
              <FormField label="Email (Read-only)">
                <input {...regProfile('email')} disabled className="h-11 w-full rounded-md border border-slate-300 bg-slate-50 px-3 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400" />
              </FormField>
              <FormField label="Mobile Number">
                <input {...regProfile('phone')} className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#0d4697] dark:border-slate-700 dark:bg-slate-800" />
              </FormField>
            </div>
            <button disabled={isSubmitting} type="submit" className="mt-5 h-11 rounded-md bg-[#0d4697] px-5 text-sm font-extrabold text-white hover:bg-blue-800">
              Update Profile
            </button>
          </form>

          {/* Change Password Form */}
          <form onSubmit={handlePasswordSubmit(onUpdatePassword)} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="flex items-center gap-2 text-lg font-black text-slate-950 dark:text-white">
              <Lock className="h-5 w-5 text-[#0d4697]" />
              Change Password
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <FormField label="Old Password">
                <input type="password" {...regPassword('oldPassword', { required: true })} className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#0d4697] dark:border-slate-700 dark:bg-slate-800" />
              </FormField>
              <FormField label="New Password">
                <input type="password" {...regPassword('newPassword', { required: true })} className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#0d4697] dark:border-slate-700 dark:bg-slate-800" />
              </FormField>
              <FormField label="Confirm New Password">
                <input type="password" {...regPassword('confirmPassword', { required: true })} className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#0d4697] dark:border-slate-700 dark:bg-slate-800" />
              </FormField>
            </div>
            <button disabled={updatingPassword} type="submit" className="mt-5 h-11 rounded-md bg-slate-950 px-5 text-sm font-extrabold text-white hover:bg-slate-800">
              Change Password
            </button>
          </form>
        </div>

        {/* Right: metadata & Timeline */}
        <div className="space-y-6">
          {/* Organization metadata Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="flex items-center gap-2 text-lg font-black text-slate-950 dark:text-white">
              <Shield className="h-5 w-5 text-[#0d4697]" />
              Organization & Role Context
            </h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-slate-400" />
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Assigned Location</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{orgLabel}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <UserCheck className="h-5 w-5 shrink-0 text-slate-400" />
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Reporting Manager</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {REPORTING_STRUCTURE[user?.role] || 'None'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 shrink-0 text-slate-400" />
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Created By</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {user?.createdBy?.name || user?.createdBy?.email || 'System / Onboarding'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 shrink-0 text-slate-400" />
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Created Date</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{formatDate(user?.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="flex items-center gap-2 text-lg font-black text-slate-950 dark:text-white">
              <Activity className="h-5 w-5 text-[#0d4697]" />
              Activity History
            </h3>
            <div className="mt-4 space-y-3">
              {loadingActivity ? (
                <div className="py-4 text-center text-xs font-semibold text-slate-500">Loading activity...</div>
              ) : activity.length > 0 ? (
                activity.map((item) => (
                  <div key={item._id} className="relative pl-4 border-l border-slate-100 dark:border-slate-800 pb-2 last:pb-0">
                    <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-[#0d4697]" />
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.action}</p>
                    <p className="text-[10px] font-semibold text-slate-400">{formatDate(item.createdAt)}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs font-semibold text-slate-500">No recent activity logged.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
