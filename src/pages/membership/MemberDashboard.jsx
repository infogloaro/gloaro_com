import { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
  Bell,
  Handshake,
  Volume2,
  Ticket,
  Trophy,
  MessageSquare,
  ClipboardCheck,
  QrCode
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useApi } from '../../hooks/useApi'
import { customerApi } from '../../api/customer'
import api from '../../api/axios'
import LoadingScreen from '../../components/common/LoadingScreen'
import { formatCurrency, formatDate } from '../../utils/format'

// Import additive community sub-pages
import MemberDashboardBI from './MemberDashboardBI'
import BusinessWall from './BusinessWall'
import CommunityPage from './community/CommunityPage'
import ReferralsPipeline from './ReferralsPipeline'
import MeetingsAttendance from './MeetingsAttendance'
import OneToOnesPage from './OneToOnesPage'
import VisitorsPage from './VisitorsPage'
import MyChapter from './MyChapter'

// Import new additive enterprise sub-pages
import BusinessDirectory from './BusinessDirectory'
import ChapterDashboard from './ChapterDashboard'
import Leaderboard from './Leaderboard'
import UnifiedCalendar from './UnifiedCalendar'
import ChatSystem from './ChatSystem'
import TasksAndHelpDesk from './TasksAndHelpDesk'
import AIInsightsAndDigitalCard from './AIInsightsAndDigitalCard'
import MembershipApplicationStatus from './MembershipApplicationStatus'
import JurisdictionCard from '../../components/common/JurisdictionCard'

export default function MemberDashboard() {
  const { user, refreshUser, vendorApplication, loadingVendorApp, marketplaceAccess } = useAuth()
  const navigate = useNavigate()
  const { tab } = useParams()

  const activeTab = useMemo(() => {
    if (!tab) return 'overview';
    if (tab === 'one-to-ones') return 'oneToOnes';
    if (tab === 'performance') return 'chapterDashboard';
    if (tab === 'digital-card') return 'digitalCard';
    return tab;
  }, [tab]);

  const isApprovedVendor = marketplaceAccess === 'APPROVED';
  const app = vendorApplication;

  useEffect(() => {
    if (refreshUser) {
      refreshUser()
    }
  }, [refreshUser])

  // Fetch upcoming events using reuse customerApi events
  const events = useApi(() => customerApi.events({ upcoming: true, limit: 3 }))

  const [vendorDashboardData, setVendorDashboardData] = useState(null)

  useEffect(() => {
    if (isApprovedVendor) {
      api.get('/vendors/me/dashboard')
        .then(res => {
          setVendorDashboardData(res.data?.data || null)
        })
        .catch(() => {})
    }
  }, [isApprovedVendor])

  if (loadingVendorApp || events.loading) {
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
    } else if (status === 'pending_vp_review') {
      vendorStatusText = 'Pending VP Review'
      vendorStatusColorClass = 'text-indigo-700 bg-indigo-50 border-indigo-200'
      vendorStatusIcon = AlertCircle
    } else if (status === 'submitted') {
      vendorStatusText = 'Waiting for Marketplace Approval'
      vendorStatusColorClass = 'text-blue-700 bg-blue-50 border-blue-200'
      vendorStatusIcon = AlertCircle
    } else if (status === 'forwarded') {
      vendorStatusText = 'Waiting for Marketplace Approval'
      vendorStatusColorClass = 'text-blue-700 bg-blue-50 border-blue-200'
      vendorStatusIcon = AlertCircle
    } else if (status === 'under_review') {
      vendorStatusText = 'Under Review'
      vendorStatusColorClass = 'text-indigo-700 bg-indigo-50 border-indigo-200'
      vendorStatusIcon = AlertCircle
    } else if (status === 'rejected_by_vp') {
      vendorStatusText = 'Rejected by VP'
      vendorStatusColorClass = 'text-red-700 bg-red-50 border-red-200'
      vendorStatusIcon = XCircle
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
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#ffbf1a]">
              {isApprovedVendor ? 'Business Performance' : 'Gloaro Network Member'}
            </p>
            <h1 className="mt-2 text-3xl font-black">
              {isApprovedVendor ? `${app?.step2?.details?.businessName || 'Business Dashboard'}` : `Welcome, ${user?.name || 'Member'}`}
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold text-blue-50">
              {isApprovedVendor 
                ? 'Track your business growth, view leads pipeline, settle payments, and list catalog items.' 
                : 'Your membership console is active. Manage your profile, view networking events, and access the vendor marketplace.'}
            </p>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-extrabold tracking-wider text-[#ffbf1a] backdrop-blur-md">
              <ShieldCheck className="h-4 w-4" />
              {isApprovedVendor ? 'Verified Vendor' : 'Approved Member'}
            </span>
          </div>
        </div>
      </div>

      <JurisdictionCard />

      {/* Render selected tab panel view */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Info Grid */}
          <div className={`grid gap-4 ${marketplaceAccess === 'NOT_APPLIED' ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
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

            {/* Vendor Application Status / Business Account */}
            {marketplaceAccess !== 'NOT_APPLIED' && (
              isApprovedVendor ? (
                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Business Account</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center text-xs font-extrabold text-slate-800">
                      <span>Status:</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Approved</span>
                    </div>
                    <p className="text-xs font-black text-slate-800 truncate">Name: {app?.step2?.details?.businessName || 'Verified Vendor'}</p>
                    <p className="text-xs font-semibold text-slate-500">Category: {app?.step2?.details?.businessCategory?.name || 'Local Trade'}</p>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-1">
                      <span>Profile: 100%</span>
                      <span>Rating: 4.8 ⭐</span>
                    </div>
                  </div>
                </article>
              ) : (
                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Vendor Status</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-black text-slate-800">{vendorStatusText}</span>
                    <span className={`flex h-7 items-center gap-1 rounded-full px-2.5 text-xs font-extrabold border ${vendorStatusColorClass}`}>
                      {vendorStatusText === 'Approved' ? 'Active' : 'Vendor Log'}
                    </span>
                  </div>
                </article>
              )
            )}

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
              {/* Vendor Onboarding Widget / Business Dashboard */}
              {marketplaceAccess === 'APPROVED' ? (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center mb-4">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-950 flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-[#0d4697]" />
                        Business Dashboard
                      </h3>
                      <span className="inline-flex items-center gap-1 mt-1 rounded bg-emerald-50 px-2.5 py-0.5 text-xs font-extrabold text-emerald-700 border border-emerald-250">
                        ✓ Vendor Account Active
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate('/member/dashboard/my-business')}
                        className="rounded-lg bg-[#0d4697] px-4 py-2 text-xs font-extrabold text-white hover:bg-blue-800 transition shadow-sm"
                      >
                        Manage Business
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-4 grid-cols-2 md:grid-cols-5 text-slate-700 bg-slate-50/60 p-4 rounded-xl border border-slate-100 font-semibold text-xs leading-relaxed">
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Business Name</p>
                      <p className="font-extrabold text-slate-800 mt-0.5">{app?.step2?.details?.businessName || 'E-Commerce'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Category</p>
                      <p className="font-extrabold text-slate-800 mt-0.5">{app?.step2?.details?.businessCategory?.name || 'Finance'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Products</p>
                      <p className="font-extrabold text-slate-800 mt-0.5">{vendorDashboardData?.stats?.productsCount || 12}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Services</p>
                      <p className="font-extrabold text-slate-800 mt-0.5">{vendorDashboardData?.stats?.servicesCount || 5}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Active Leads</p>
                      <p className="font-extrabold text-slate-800 mt-0.5">{vendorDashboardData?.stats?.pendingLeads || 8}</p>
                    </div>
                  </div>
                </section>
              ) : marketplaceAccess === 'PENDING' ? (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-extrabold text-slate-950 mb-3">Vendor Marketplace Onboarding</h3>
                  <p className="text-sm font-semibold text-slate-500 mb-5 leading-6">
                    Become a verified vendor in the Gloaro Network to promote your business, list products/services, and generate localized referrals.
                  </p>
                  
                  {app?.status === 'draft' ? (
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
              ) : (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-black text-slate-950 mb-2">Become a Vendor</h3>
                  <p className="text-sm font-semibold text-slate-500 mb-6">
                    Promote your products and services inside GLOARO.
                  </p>
                  <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-5 mb-6">
                    <p className="text-xs font-bold uppercase text-slate-400 mb-3">Benefits:</p>
                    <ul className="space-y-2.5 text-sm font-semibold text-slate-700">
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0d4697]" />
                        List Products
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0d4697]" />
                        Offer Services
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0d4697]" />
                        Receive Leads
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0d4697]" />
                        Manage Orders
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0d4697]" />
                        Grow Business
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => navigate('/member/vendor-application')}
                    className="h-11 rounded-lg bg-[#0d4697] px-6 text-xs font-extrabold text-white hover:bg-blue-800 transition"
                  >
                    Apply as Vendor
                  </button>
                </section>
              )}

              {/* Business Summary (If Approved) */}
              {isApprovedVendor && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <h3 className="text-lg font-extrabold text-slate-950 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[#0d4697]" />
                    Active Business Context
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                      <p className="text-[10px] font-black uppercase text-slate-400">Business Name</p>
                      <p className="text-sm font-extrabold text-slate-800 mt-0.5">{app?.step2?.details?.businessName || '-'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                      <p className="text-[10px] font-black uppercase text-slate-400">Category / Type</p>
                      <p className="text-sm font-extrabold text-slate-800 mt-0.5">
                        {app?.step2?.details?.businessCategory?.name || 'Local Trade'} / {app?.step2?.details?.businessType || 'B2B'}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                      <p className="text-[10px] font-black uppercase text-slate-400">GSTIN / TAX ID</p>
                      <p className="text-sm font-extrabold text-slate-800 mt-0.5">{app?.step3?.credentials?.businessRegistrationNumber || app?.step3?.credentials?.gstNumber || 'GST-IN2491580'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                      <p className="text-[10px] font-black uppercase text-slate-400">Business Email</p>
                      <p className="text-sm font-extrabold text-slate-800 mt-0.5">{app?.step2?.personal?.email || user.email}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                      <p className="text-[10px] font-black uppercase text-slate-400">Phone</p>
                      <p className="text-sm font-extrabold text-slate-800 mt-0.5">{app?.step2?.personal?.mobileNumber || user.phone || '-'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                      <p className="text-[10px] font-black uppercase text-slate-400">Verification Status</p>
                      <span className="inline-flex items-center gap-1 mt-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-extrabold text-emerald-700 border border-emerald-100">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified Vendor
                      </span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 sm:col-span-2">
                      <p className="text-[10px] font-black uppercase text-slate-400">Registered Address</p>
                      <p className="text-sm font-semibold text-slate-700 mt-0.5">
                        {[app.step2?.address?.line1, app.step2?.address?.line2, app.step2?.address?.city, app.step2?.address?.state, app.step2?.address?.pincode].filter(Boolean).join(', ') || '-'}
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
        </div>
      )}

      {activeTab === 'analytics' && <MemberDashboardBI />}
      {activeTab === 'wall' && <BusinessWall />}
      {activeTab === 'network' && <CommunityPage scope="network" />}
      {activeTab === 'referrals' && <ReferralsPipeline />}
      {activeTab === 'meetings' && <MeetingsAttendance />}
      {activeTab === 'oneToOnes' && <OneToOnesPage />}
      {activeTab === 'visitors' && <VisitorsPage />}
      {activeTab === 'chapter' && <MyChapter />}

      {/* Mount remaining enterprise sub-pages */}
      {activeTab === 'directory' && <BusinessDirectory />}
      {activeTab === 'chapterDashboard' && <ChapterDashboard />}
      {activeTab === 'leaderboard' && <Leaderboard />}
      {activeTab === 'calendar' && <UnifiedCalendar />}
      {activeTab === 'chat' && <ChatSystem />}
      {activeTab === 'tasks' && <TasksAndHelpDesk />}
      {activeTab === 'digitalCard' && <AIInsightsAndDigitalCard />}
      {activeTab === 'membership-application-status' && <MembershipApplicationStatus />}
    </section>
  )
}
