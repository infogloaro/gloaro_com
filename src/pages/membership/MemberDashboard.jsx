import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Gem,
  CalendarDays,
  ShieldCheck,
  PlusCircle,
  ArrowRight,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UsersRound,
  FileBarChart,
  Building2,
  HelpCircle,
  Bell
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useApi } from '../../hooks/useApi'
import { customerApi } from '../../api/customer'
import api from '../../api/axios'
import LoadingScreen from '../../components/common/LoadingScreen'
import { formatDate } from '../../utils/format'

export default function MemberDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [app, setApp] = useState(null)
  const [loadingApp, setLoadingApp] = useState(true)

  // Fetch upcoming events using reuse customerApi events
  const events = useApi(() => customerApi.events({ upcoming: true, limit: 3 }))

  useEffect(() => {
    setLoadingApp(true)
    api.get('/vendor-applications/my-application')
      .then((res) => {
        setApp(res.data?.data || null)
      })
      .catch(() => {
        setApp(null)
      })
      .finally(() => {
        setLoadingApp(false)
      })
  }, [])

  if (loadingApp || events.loading) {
    return <LoadingScreen label="Loading member command center..." />
  }

  // Determine vendor status display
  let vendorStatusText = 'Not Applied'
  let vendorStatusColorClass = 'text-slate-500 bg-slate-50 border-slate-200'
  let vendorStatusIcon = HelpCircle

  if (app) {
    const status = String(app.status).toLowerCase()
    if (status === 'draft') {
      vendorStatusText = 'Draft'
      vendorStatusColorClass = 'text-amber-700 bg-amber-50 border-amber-200'
      vendorStatusIcon = FileText
    } else if (status === 'submitted') {
      vendorStatusText = 'Submitted'
      vendorStatusColorClass = 'text-blue-700 bg-blue-50 border-blue-200'
      vendorStatusIcon = AlertCircle
    } else if (status === 'under_review') {
      vendorStatusText = 'Under Review'
      vendorStatusColorClass = 'text-indigo-700 bg-indigo-50 border-indigo-200'
      vendorStatusIcon = AlertCircle
    } else if (status === 'approved') {
      vendorStatusText = 'Approved'
      vendorStatusColorClass = 'text-emerald-700 bg-emerald-50 border-emerald-200'
      vendorStatusIcon = CheckCircle2
    } else if (status === 'rejected') {
      vendorStatusText = 'Rejected'
      vendorStatusColorClass = 'text-red-700 bg-red-50 border-red-200'
      vendorStatusIcon = XCircle
    }
  }

  const org = user?.meta?.adminProfile?.organization || {}
  const orgHierarchyText = [
    org.assignedRegion?.name || org.region,
    org.assignedState?.name || org.state,
    org.assignedDistrict?.name || org.district,
    org.assignedChapter?.name || org.chapter
  ].filter(Boolean).join(' / ') || 'Global'

  const upcomingEvents = events.data?.data || events.data || []

  return (
    <section className="space-y-6">
      {/* Welcome Banner */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d4697] to-[#082653] p-6 text-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#ffbf1a]">Gloaro Network Member</p>
            <h1 className="mt-2 text-3xl font-black">Welcome, {user?.name || 'Member'}</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold text-blue-50">
              Your membership console is active. Manage your profile, view networking events, and access the vendor marketplace.
            </p>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-extrabold tracking-wider text-[#ffbf1a] backdrop-blur-md">
              <ShieldCheck className="h-4 w-4" />
              Approved Member
            </span>
          </div>
        </div>
      </div>

      {/* KPI Info Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Membership Status */}
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Membership Status</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-black text-slate-800">Approved</span>
            <span className="flex h-7 items-center gap-1 rounded-full bg-emerald-50 px-2.5 text-xs font-extrabold text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Active
            </span>
          </div>
        </article>

        {/* Vendor Application Status */}
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Vendor Status</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-black text-slate-800">{vendorStatusText}</span>
            <span className={`flex h-7 items-center gap-1 rounded-full px-2.5 text-xs font-extrabold border ${vendorStatusColorClass}`}>
              {Object.create(vendorStatusIcon.prototype || null) && <span className="inline-block shrink-0"><CheckCircle2 className="h-3.5 w-3.5 hidden" /></span>}
              Vendor Log
            </span>
          </div>
        </article>

        {/* Profile Completion */}
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Profile Completion</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-black text-slate-800">100%</span>
            <span className="flex h-7 items-center gap-1 rounded-full bg-blue-50 px-2.5 text-xs font-extrabold text-blue-700 border border-blue-200">
              Completed
            </span>
          </div>
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Left Actions & Details */}
        <div className="space-y-6">
          {/* Vendor Onboarding Widget */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-950 mb-3">Vendor Marketplace Onboarding</h3>
            <p className="text-sm font-semibold text-slate-500 mb-5 leading-6">
              Become a verified vendor in the Gloaro Network to promote your business, list products/services, and generate localized referrals.
            </p>
            
            {!app ? (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 flex flex-col justify-between items-start gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="font-extrabold text-slate-800 text-sm">Start Onboarding</p>
                  <p className="text-xs font-semibold text-slate-500 mt-1">Submit your business registration details and logo.</p>
                </div>
                <button
                  onClick={() => navigate('/member/vendor-application')}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#0d4697] px-4 py-2 text-xs font-extrabold text-white hover:bg-blue-800"
                >
                  <PlusCircle className="h-4 w-4" />
                  Apply as Vendor
                </button>
              </div>
            ) : app.status === 'draft' ? (
              <div className="rounded-xl bg-amber-50/50 border border-amber-200 p-5 flex flex-col justify-between items-start gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="font-extrabold text-amber-900 text-sm">Resume Onboarding (Draft)</p>
                  <p className="text-xs font-semibold text-amber-700 mt-1">Your draft is saved at Step {app.step || 1} of the wizard.</p>
                </div>
                <button
                  onClick={() => navigate('/member/vendor-application')}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-amber-700"
                >
                  Resume Draft
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="rounded-xl bg-blue-50/50 border border-blue-200 p-5 flex flex-col justify-between items-start gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="font-extrabold text-blue-900 text-sm">Application Status: {vendorStatusText}</p>
                  <p className="text-xs font-semibold text-blue-700 mt-1">
                    Submitted on {formatDate(app.createdAt)}. Click below to view status and comments.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/member/vendor-application-status')}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#0d4697] px-4 py-2 text-xs font-extrabold text-white hover:bg-blue-800"
                >
                  View Status
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </section>

          {/* Business Summary (If Approved) */}
          {app && app.status === 'approved' && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-extrabold text-slate-950 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#0d4697]" />
                Active Business Context
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] font-extrabold uppercase text-slate-400">Business Name</p>
                  <p className="text-sm font-extrabold text-slate-800 mt-0.5">{app.step2?.details?.businessName || '-'}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] font-extrabold uppercase text-slate-400">Category / Type</p>
                  <p className="text-sm font-extrabold text-slate-800 mt-0.5">
                    {app.step2?.details?.businessCategory?.name || '-'} / {app.step2?.details?.businessType || '-'}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Membership Context details */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-950 mb-4">Membership Assignment</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-[#0d4697] shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[10px] font-extrabold uppercase text-slate-400">Member ID</p>
                  <p className="text-sm font-extrabold text-slate-800 mt-0.5">{user?.memberId || 'Pending allocation'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-[#0d4697] shrink-0">
                  <Gem className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[10px] font-extrabold uppercase text-slate-400">Organization Hierarchy</p>
                  <p className="text-sm font-extrabold text-slate-800 mt-0.5">{orgHierarchyText}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Calendar & Community Events */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-950 mb-4 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-[#0d4697]" />
              Upcoming Events
            </h3>
            
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((evt) => (
                  <div key={evt._id} className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-xs font-black text-[#0d4697] shrink-0">
                      {new Date(evt.startDate).getDate()}
                    </span>
                    <div>
                      <p className="text-sm font-extrabold text-slate-800 leading-tight">{evt.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1">
                        {formatDate(evt.startDate)} • {evt.type}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs font-semibold text-slate-500">No scheduled events found.</p>
              )}
            </div>
          </section>

          {/* Announcements */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-950 mb-3 flex items-center gap-2">
              <UsersRound className="h-5 w-5 text-[#0d4697]" />
              Announcements
            </h3>
            <p className="text-xs font-semibold text-slate-500 leading-5">
              Welcome to the new Gloaro Network member command console. Promote your business as a vendor and expand your local network presence.
            </p>
          </section>
        </div>
      </div>
    </section>
  )
}
