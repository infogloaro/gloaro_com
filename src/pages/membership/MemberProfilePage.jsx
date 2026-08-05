import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  KeyRound,
  Lock,
  Mail,
  PencilLine,
  Phone,
  Shield,
  User,
} from 'lucide-react'
import api from '../../api/axios'
import { membershipApplicationApi } from '../../api/membershipApplication'
import FormField from '../../components/forms/FormField'
import LoadingScreen from '../../components/common/LoadingScreen'
import JurisdictionCard from '../../components/common/JurisdictionCard'
import { useApi } from '../../hooks/useApi'
import { useAuth } from '../../hooks/useAuth'
import { formatDate } from '../../utils/format'
import { roleLabel } from '../../constants/adminRoles'

const emptyValue = '-'

const textValue = (value) => {
  if (value === undefined || value === null) return emptyValue
  if (Array.isArray(value)) return value.length ? value.join(', ') : emptyValue
  if (typeof value === 'object') {
    return value?.name || value?.code || value?.label || value?.title || value?._id || emptyValue
  }
  const normalized = String(value).trim()
  return normalized || emptyValue
}

const dateValue = (value) => {
  if (!value) return emptyValue
  const parsed = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(parsed.getTime())) return emptyValue
  try {
    return formatDate(parsed)
  } catch {
    return emptyValue
  }
}

function DetailItem({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
        {Icon ? <Icon className="h-3.5 w-3.5 text-[#0d4697]" /> : null}
        {label}
      </div>
      <p className="mt-1.5 break-words text-sm font-bold leading-6 text-slate-800">{value}</p>
    </div>
  )
}

function SectionCard({ title, icon: Icon, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <h3 className="flex items-center gap-2 text-lg font-black text-slate-950">
        {Icon ? <Icon className="h-5 w-5 text-[#0d4697]" /> : null}
        {title}
      </h3>
      <div className="mt-5">{children}</div>
    </section>
  )
}

export default function MemberProfilePage() {
  const { user: sessionUser, refreshUser } = useAuth()
  const [activePanel, setActivePanel] = useState(null)
  const [vendorProfile, setVendorProfile] = useState(null)

  const profileRequest = useApi(() => api.get('/users/profile'))
  const applicationRequest = useApi(() => membershipApplicationApi.getMyApplication())

  const profile = profileRequest.data?.data?.user || profileRequest.data?.user || profileRequest.data || sessionUser || null
  const application = applicationRequest.data?.data || applicationRequest.data || null

  const vendorId = profile?.vendorProfile?.vendorId?._id || profile?.vendorProfile?.vendorId || null

  const { register: regProfile, handleSubmit: handleProfileSubmit, reset: resetProfile, formState: { isSubmitting: profileSubmitting } } = useForm()
  const { register: regPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { isSubmitting: passwordSubmitting } } = useForm()

  useEffect(() => {
    if (!profile) return

    resetProfile({
      name: profile.name || application?.personal?.fullName || '',
      phone: profile.phone || application?.personal?.mobileNumber || '',
      address: {
        street: profile.address?.street || application?.address?.line1 || '',
        city: profile.address?.city || application?.address?.city || '',
        state: profile.address?.state || application?.address?.state || '',
        country: profile.address?.country || 'India',
        pincode: profile.address?.pincode || application?.address?.pincode || '',
      },
    })
  }, [profile, application, resetProfile])

  useEffect(() => {
    if (!vendorId) {
      setVendorProfile(null)
      return
    }

    let mounted = true
    api.get(`/vendors/${vendorId}`, { silent: true })
      .then((response) => {
        if (!mounted) return
        setVendorProfile(response.data?.data || response.data || null)
      })
      .catch(() => {
        if (!mounted) return
        setVendorProfile(null)
      })
      .finally(() => {
        if (!mounted) return
      })

    return () => {
      mounted = false
    }
  }, [vendorId])

  const displayName = application?.personal?.fullName || profile?.name || emptyValue
  const displayEmail = application?.personal?.emailAddress || profile?.email || emptyValue
  const displayPhone = application?.personal?.mobileNumber || profile?.phone || emptyValue
  const avatarUrl = profile?.avatar?.url || application?.documents?.profilePhoto?.url || ''
  const initials = (displayName || 'M').trim().slice(0, 2).toUpperCase()
  const isMembershipApplicant = profile?.role === 'customer'
  let memberStatus = emptyValue
  if (isMembershipApplicant) {
    const appStatus = application?.status
    if (!appStatus) {
      memberStatus = 'Not Started'
    } else {
      if (appStatus === 'draft') memberStatus = 'Draft'
      else if (['submitted', 'pending_vp_review', 'pending_review'].includes(appStatus)) memberStatus = 'Pending'
      else if (['under_review', 'documents_verified', 'forwarded', 'changes_requested'].includes(appStatus)) memberStatus = 'Under Review'
      else if (appStatus === 'rejected') memberStatus = 'Rejected'
      else if (appStatus === 'approved') memberStatus = 'Approved'
      else memberStatus = appStatus
    }
  } else {
    memberStatus = profile?.status || profile?.onboardingStatus || emptyValue
  }
  const memberRole = roleLabel(profile?.role || '')
  const isApprovedVendor = vendorProfile?.status === 'approved'

  const onSaveProfile = async (values) => {
    try {
      await api.patch('/users/profile', values)
      toast.success('Profile updated successfully')
      await Promise.allSettled([
        refreshUser?.(),
        profileRequest.execute(),
      ])
      setActivePanel(null)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  }

  const onChangePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    try {
      await api.post('/auth/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      toast.success('Password changed successfully')
      resetPassword()
      setActivePanel(null)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    }
  }

  const canShowProfile = Boolean(profile)

  if (profileRequest.loading || applicationRequest.loading || !canShowProfile) {
    return <LoadingScreen label="Loading Member Profile..." />
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-[#0d4697] text-white shadow-md">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-2xl font-black">{initials}</div>
              )}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0d4697]">Member Profile</p>
              <h1 className="mt-1 text-3xl font-black text-slate-950">{displayName}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                  <Mail className="h-4 w-4" />
                  {displayEmail}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                  <Phone className="h-4 w-4" />
                  {displayPhone}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                  <Shield className="h-4 w-4" />
                  {memberRole}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                  <Shield className="h-4 w-4" />
                  {memberStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActivePanel(activePanel === 'edit' ? null : 'edit')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-700 shadow-sm transition hover:border-[#0d4697] hover:text-[#0d4697]"
            >
              <PencilLine className="h-4 w-4" />
              Edit Profile
            </button>
            <button
              type="button"
              onClick={() => setActivePanel(activePanel === 'password' ? null : 'password')}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0d4697] px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-800"
            >
              <KeyRound className="h-4 w-4" />
              Change Password
            </button>
          </div>
        </div>
      </header>

      <JurisdictionCard />

      <section className="space-y-6">
        <SectionCard title="Personal Information" icon={User}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem label="Member ID / Official ID" value={profile?.officialId || profile?.memberId || emptyValue} icon={BadgeCheck} />
            <DetailItem label="Gender" value={textValue(application?.personal?.gender || profile?.gender)} icon={Shield} />
            <DetailItem label="Date of Birth" value={dateValue(application?.personal?.dateOfBirth || profile?.dateOfBirth)} icon={CalendarDays} />
            <DetailItem label="Occupation / Profession" value={textValue(application?.professional?.businessType || application?.professional?.industry || profile?.occupation)} icon={BriefcaseBusiness} />
            <DetailItem label="Company / Business Name" value={textValue(vendorProfile?.businessName || application?.professional?.companyName || profile?.companyName)} icon={Building2} />
          </div>
        </SectionCard>

        {isApprovedVendor && (
          <SectionCard title="Business Information" icon={Building2}>
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="Business Name" value={textValue(vendorProfile.businessName)} icon={Building2} />
              <DetailItem label="Business Category" value={textValue(vendorProfile.businessCategory?.name || vendorProfile.businessCategory?.label)} icon={BriefcaseBusiness} />
              <DetailItem label="Vendor Status" value={textValue(vendorProfile.status)} icon={Shield} />
            </div>
          </SectionCard>
        )}
      </section>

      {activePanel === 'edit' && (
        <SectionCard title="Edit Profile" icon={PencilLine}>
          <form onSubmit={handleProfileSubmit(onSaveProfile)} className="grid gap-4 sm:grid-cols-2">
            <FormField label="Full Name">
              <input {...regProfile('name')} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-800 outline-none focus:border-[#0d4697]" />
            </FormField>
            <FormField label="Email (Read-only)">
              <input value={displayEmail} disabled className="h-11 w-full rounded-md border border-slate-300 bg-slate-50 px-3 text-slate-500 outline-none" />
            </FormField>
            <FormField label="Mobile Number">
              <input {...regProfile('phone')} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-800 outline-none focus:border-[#0d4697]" />
            </FormField>
            <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
              <FormField label="Street / Address Line 1">
                <input {...regProfile('address.street')} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-800 outline-none focus:border-[#0d4697]" />
              </FormField>
              <FormField label="City">
                <input {...regProfile('address.city')} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-800 outline-none focus:border-[#0d4697]" />
              </FormField>
              <FormField label="State">
                <input {...regProfile('address.state')} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-800 outline-none focus:border-[#0d4697]" />
              </FormField>
              <FormField label="Country">
                <input {...regProfile('address.country')} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-800 outline-none focus:border-[#0d4697]" />
              </FormField>
              <FormField label="Pincode">
                <input {...regProfile('address.pincode')} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-800 outline-none focus:border-[#0d4697]" />
              </FormField>
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={profileSubmitting} className="inline-flex h-11 items-center justify-center rounded-md bg-[#0d4697] px-5 text-sm font-extrabold text-white hover:bg-blue-800 transition">
                Save Changes
              </button>
            </div>
          </form>
        </SectionCard>
      )}

      {activePanel === 'password' && (
        <SectionCard title="Change Password" icon={Lock}>
          <form onSubmit={handlePasswordSubmit(onChangePassword)} className="grid gap-4 sm:grid-cols-3">
            <FormField label="Current Password">
              <input type="password" {...regPassword('currentPassword', { required: true })} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-800 outline-none focus:border-[#0d4697]" />
            </FormField>
            <FormField label="New Password">
              <input type="password" {...regPassword('newPassword', { required: true })} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-800 outline-none focus:border-[#0d4697]" />
            </FormField>
            <FormField label="Confirm New Password">
              <input type="password" {...regPassword('confirmPassword', { required: true })} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-800 outline-none focus:border-[#0d4697]" />
            </FormField>
            <div className="sm:col-span-3">
              <button type="submit" disabled={passwordSubmitting} className="inline-flex h-11 items-center justify-center rounded-md bg-slate-950 px-5 text-sm font-extrabold text-white hover:bg-slate-800 transition">
                Update Password
              </button>
            </div>
          </form>
        </SectionCard>
      )}
    </div>
  )
}
