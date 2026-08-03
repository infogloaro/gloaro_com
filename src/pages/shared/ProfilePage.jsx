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
import { ROLES } from '../../constants/roleConfig.js'

const REPORTING_STRUCTURE = {
  [ROLES.ADMIN]: 'Super Admin',
  [ROLES.REGION_DIRECTOR]: 'Admin',
  [ROLES.STATE_DIRECTOR]: 'Region Director',
  [ROLES.DISTRICT_DIRECTOR]: 'State Director',
  [ROLES.EXECUTIVE_DIRECTOR]: 'District Director',
  [ROLES.LAUNCH_DIRECTOR]: 'Executive Director',
  [ROLES.DIRECT_CONSULTANT]: 'Launch Director',
  [ROLES.CHAPTER_PRESIDENT]: 'Direct Consultant',
  [ROLES.VICE_PRESIDENT]: 'Chapter President',
  [ROLES.SECRETARY]: 'Vice President',
}

const VIEW_ONLY_PROFILE_ROLES = [
  ROLES.SUPERADMIN,
  ROLES.ADMIN,
  ROLES.REGION_DIRECTOR,
  ROLES.STATE_DIRECTOR,
  ROLES.DISTRICT_DIRECTOR,
  ROLES.EXECUTIVE_DIRECTOR,
  ROLES.LAUNCH_DIRECTOR,
  ROLES.DIRECT_CONSULTANT,
  ROLES.CHAPTER_PRESIDENT,
  ROLES.VICE_PRESIDENT,
  ROLES.SECRETARY,
  ROLES.USER,
]

export default function ProfilePage() {
  const { data, loading, execute } = useApi(() => api.get('/users/profile'))
  const user = data?.data || data?.user || data
  const isViewOnlyProfile = VIEW_ONLY_PROFILE_ROLES.includes(user?.role) && !user?.meta?.customerPortal?.isolated
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
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          country: user.address?.country || 'India',
          pincode: user.address?.pincode || '',
        },
      })

      // Fetch user's activity logs
      const loadingTimer = window.setTimeout(() => setLoadingActivity(true), 0)
      const fetchActivity = [ROLES.ADMIN, ROLES.SUPERADMIN].includes(user.role)
        ? adminApi.adminActivity(user._id, { limit: 6 })
        : api.get('/users/activity', { params: { limit: 6 } })

      fetchActivity
        .then((res) => {
          setActivity(res.data?.data || [])
        })
        .catch(() => {})
        .finally(() => {
          window.clearTimeout(loadingTimer)
          setLoadingActivity(false)
        })
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
      .map((key) => org[key]?.name || org[key]?.code || (typeof org[key] === 'string' ? org[key] : ''))
      .filter(Boolean)
      .join(' / ') || 'None assigned'
  }, [user])

  if (loading) return <LoadingScreen label="Loading Profile..." />

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#0d4697] text-2xl font-black text-white shadow-md">
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950">{user?.name}</h2>
            <p className="text-sm font-bold text-slate-500">{user?.email} • {roleLabel(user?.role)}</p>
            {user?.officialId && (
              <p className="mt-1 inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-extrabold text-slate-700">
                Official ID: {user.officialId}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Forms / Details */}
        <div className="space-y-6 lg:col-span-2">
          {isViewOnlyProfile ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-lg font-black text-slate-950">
                <User className="h-5 w-5 text-[#0d4697]" />
                Personal Details
              </h3>
              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Full Name</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{user?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Email Address</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{user?.email || '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Mobile Number</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{user?.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Official ID</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{user?.officialId || '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Role</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{roleLabel(user?.role)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Address</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {[user?.address?.street, user?.address?.city, user?.address?.state, user?.address?.pincode, user?.address?.country].filter(Boolean).join(', ') || '-'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Personal Info Form */}
              <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-black text-slate-950">
                  <User className="h-5 w-5 text-[#0d4697]" />
                  Personal Details
                </h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <FormField label="Full Name">
                    <input {...regProfile('name')} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-800 outline-none focus:border-[#0d4697]" />
                  </FormField>
                  <FormField label="Email (Read-only)">
                    <input {...regProfile('email')} disabled className="h-11 w-full rounded-md border border-slate-300 bg-slate-50 px-3 text-slate-500 outline-none" />
                  </FormField>
                  <FormField label="Mobile Number">
                    <input {...regProfile('phone')} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-800 outline-none focus:border-[#0d4697]" />
                  </FormField>
                </div>
                <button disabled={isSubmitting} type="submit" className="mt-5 h-11 rounded-md bg-[#0d4697] px-5 text-sm font-extrabold text-white hover:bg-blue-800 transition">
                  Update Profile
                </button>
              </form>

              {/* Change Password Form */}
              <form onSubmit={handlePasswordSubmit(onUpdatePassword)} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-black text-slate-950">
                  <Lock className="h-5 w-5 text-[#0d4697]" />
                  Change Password
                </h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <FormField label="Old Password">
                    <input type="password" {...regPassword('oldPassword', { required: true })} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-800 outline-none focus:border-[#0d4697]" />
                  </FormField>
                  <FormField label="New Password">
                    <input type="password" {...regPassword('newPassword', { required: true })} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-800 outline-none focus:border-[#0d4697]" />
                  </FormField>
                  <FormField label="Confirm New Password">
                    <input type="password" {...regPassword('confirmPassword', { required: true })} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-800 outline-none focus:border-[#0d4697]" />
                  </FormField>
                </div>
                <button disabled={updatingPassword} type="submit" className="mt-5 h-11 rounded-md bg-slate-950 px-5 text-sm font-extrabold text-white hover:bg-slate-800 transition">
                  Change Password
                </button>
              </form>
            </>
          )}
        </div>

        {/* Right: metadata & Timeline */}
        <div className="space-y-6">
          {/* Organization metadata Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-black text-slate-950">
              <Shield className="h-5 w-5 text-[#0d4697]" />
              Organization & Role Context
            </h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-[#0d4697]" />
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Assigned Location</p>
                  <p className="text-sm font-bold text-slate-800">{orgLabel}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <UserCheck className="h-5 w-5 shrink-0 text-[#0d4697]" />
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Reporting Manager</p>
                  <p className="text-sm font-bold text-slate-800">
                    {REPORTING_STRUCTURE[user?.role] || 'None'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 shrink-0 text-[#0d4697]" />
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Created By</p>
                  <p className="text-sm font-bold text-slate-800">
                    {user?.createdBy?.name || user?.createdBy?.email || 'System / Onboarding'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 shrink-0 text-[#0d4697]" />
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Created Date</p>
                  <p className="text-sm font-bold text-slate-800">{formatDate(user?.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-black text-slate-950">
              <Activity className="h-5 w-5 text-[#0d4697]" />
              Activity History
            </h3>
            <div className="mt-4 space-y-3">
              {loadingActivity ? (
                <div className="py-4 text-center text-xs font-semibold text-slate-500">Loading activity...</div>
              ) : activity.length > 0 ? (
                activity.map((item) => (
                  <div key={item._id} className="relative border-l border-slate-100 pb-2 pl-4 last:pb-0">
                    <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-[#0d4697]" />
                    <p className="text-xs font-bold text-slate-800">{item.action}</p>
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
