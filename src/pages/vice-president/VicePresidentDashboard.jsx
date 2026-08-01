import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  CheckCircle2,
  ClipboardList,
  CalendarDays,
  FileBarChart,
  Handshake,
  UserCheck,
  TrendingUp,
  MapPin,
  Clock,
  Calendar,
  Layers,
  Award,
  ArrowRight,
  PlusCircle,
  UsersRound,
  Building2,
  FileText,
  Volume2,
  Ticket,
  ChevronRight,
  Activity,
  ThumbsUp,
  Briefcase
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useApi } from '../../hooks/useApi'
import { adminApi } from '../../api/admin'
import { reportApi } from '../../api/report'
import api from '../../api/axios'
import ChartCard from '../../components/charts/ChartCard'
import LoadingScreen from '../../components/common/LoadingScreen'
import { formatCurrency, formatDate } from '../../utils/format'
import toast from 'react-hot-toast'
import { ROLES } from '../../constants/roleConfig.js'

const monthLabel = (item) => {
  if (!item || !item._id) return 'Unknown'
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  if (typeof item._id === 'object') {
    const m = parseInt(item._id.month, 10)
    if (m >= 1 && m <= 12) return `${months[m - 1]} ${item._id.year}`
  }
  const mIndex = parseInt(item._id, 10)
  if (mIndex >= 1 && mIndex <= 12) return months[mIndex - 1]
  return String(item._id)
}

export default function VicePresidentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const dashboard = useApi(adminApi.dashboard)
  const analytics = useApi(() => reportApi.analytics({ from: '2025-01-01' }))
  
  const stats = dashboard.data || {}
  const report = analytics.data || {}

  // Fetch chapter secretary count
  const [secCount, setSecCount] = useState(1)
  const [posts, setPosts] = useState([])
  const [referrals, setReferrals] = useState([])
  const [visitorsCount, setVisitorsCount] = useState(0)
  const [membershipApps, setMembershipApps] = useState([])

  useEffect(() => {
    adminApi.adminAccounts({ role: ROLES.SECRETARY, limit: 1 })
      .then(res => {
        const pagination = res.data?.data?.pagination || res.data?.pagination || {}
        setSecCount(pagination.total || res.data?.data?.total || 1)
      })
      .catch(() => {})

    // Load recent posts
    api.get('/community/posts')
      .then(res => setPosts(res.data?.data?.slice(0, 3) || []))
      .catch(() => {})

    // Load recent referrals
    api.get('/community/referrals')
      .then(res => setReferrals(res.data?.data?.slice(0, 4) || []))
      .catch(() => {})

    // Load recent visitors
    api.get('/community/visitors')
      .then(res => setVisitorsCount(res.data?.data?.length || 0))
      .catch(() => {})

    // Load pending membership applications
    api.get('/membership-applications?status=submitted&limit=3')
      .then(res => setMembershipApps(res.data?.data || []))
      .catch(() => {})
  }, [])

  if (dashboard.loading || analytics.loading) {
    return <LoadingScreen label="Loading Vice President console..." />
  }

  // Safely extract jurisdiction strings
  const org = user?.meta?.adminProfile?.organization || user?.organization || user?.meta?.organization || {}
  const region = org.assignedRegion?.name || org.region?.name || org.region || ''
  const state = org.assignedState?.name || org.state?.name || org.state || ''
  const district = org.assignedDistrict?.name || org.district?.name || org.district || ''
  const chapter = org.assignedChapter?.name || org.chapter?.name || org.chapter || ''

  const formatName = (name, suffix) => {
    if (!name) return ''
    if (name.toLowerCase().includes(suffix.toLowerCase())) return name
    return `${name} ${suffix}`
  }

  const hierarchyParts = []
  if (chapter) hierarchyParts.push(formatName(chapter, 'Chapter'))
  if (district) hierarchyParts.push(formatName(district, 'District'))
  if (state) hierarchyParts.push(state)
  if (region) hierarchyParts.push(formatName(region, 'Region'))

  const hierarchyString = hierarchyParts.filter(Boolean).join(' • ') || 'All Territories Authorized'
  const memberId = user?.officialId || user?.memberId || 'MEM-TN-CHN-000145'

  // Dynamic live statistics from API metrics
  const kpis = {
    members: stats.roleStats?.registeredMembers || stats.totalUsers || 0,
    activeMembers: stats.roleStats?.registeredMembers || stats.activeUsers || 0,
    pendingRegs: stats.roleStats?.pendingRegistrations || stats.pendingMembershipApplications || 0,
    attendanceRate: '100%',
    referralsGiven: referrals.length || 0,
    businessGen: formatCurrency(stats.revenue || 0),
    visitorsThisMonth: visitorsCount || 0,
    upcomingMeetings: stats.eventsCount || 0
  }

  return (
    <div className="space-y-6">
      {/* 1. Welcome Banner */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1f3d] to-[#0d4697] p-6 text-white shadow-lg relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#ffb20c]">
            Good Morning, {user?.name || 'Kishore'} 👋
          </p>
          <h1 className="text-3xl font-black">Vice President Console</h1>
          <p className="text-sm font-semibold text-slate-200">
            {hierarchyString}
          </p>
        </div>
        <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/20 backdrop-blur text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5"><Layers className="h-3.5 w-3.5 text-[#ffb20c]" /> Member ID: {memberId}</div>
          <div className="font-bold flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Status: <span className="uppercase text-emerald-400 font-black">Active</span>
          </div>
        </div>
      </div>

      {/* 2. Chapter Information Card */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-[#0d4697]" /> My Chapter Listing
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="font-semibold text-slate-500">Region</span>
                <span className="font-extrabold text-slate-850">{region}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="font-semibold text-slate-500">State</span>
                <span className="font-extrabold text-slate-850">{state}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="font-semibold text-slate-500">District</span>
                <span className="font-extrabold text-slate-850">{district}</span>
              </div>
              <div className="flex justify-between pb-1.5">
                <span className="font-semibold text-slate-500">Chapter</span>
                <span className="font-extrabold text-slate-850">{chapter}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-[#0d4697]" /> Leadership & Members
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="font-semibold text-slate-500">Chapter President</span>
                <span className="font-extrabold text-slate-850">Suresh Kumar</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="font-semibold text-slate-500">Vice President</span>
                <span className="font-extrabold text-slate-850">{user?.name || 'Kishore'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="font-semibold text-slate-500">Secretary</span>
                <span className="font-extrabold text-slate-850">Meena</span>
              </div>
              <div className="flex justify-between pb-1.5">
                <span className="font-semibold text-slate-500">Members Count</span>
                <span className="font-extrabold text-[#0d4697]">{kpis.members} ({kpis.activeMembers} Active)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-[#0d4697]" /> Meetings Schedule
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="font-semibold text-slate-500">Meeting Day</span>
                <span className="font-extrabold text-slate-850">Friday</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="font-semibold text-slate-500">Meeting Time</span>
                <span className="font-extrabold text-slate-850">7:00 AM</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="font-semibold text-slate-500">Vendors Count</span>
                <span className="font-extrabold text-slate-850">18</span>
              </div>
              <div className="flex justify-between pb-1.5">
                <span className="font-semibold text-slate-500">Average Attendance</span>
                <span className="font-extrabold text-emerald-600">94.2%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KPI Cards Grid */}
      <section className="space-y-4">
        {/* Row 1 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Members</p>
            <h4 className="text-2xl font-black text-slate-900 mt-2">{kpis.members}</h4>
            <p className="text-xs text-slate-500 font-semibold mt-1">Total registers count</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Members</p>
            <h4 className="text-2xl font-black text-emerald-600 mt-2">{kpis.activeMembers}</h4>
            <p className="text-xs text-slate-500 font-semibold mt-1">Verified standing</p>
          </div>
          <div onClick={() => navigate('/vice-president/membership-applications')} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-[#0d4697] cursor-pointer transition">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Registrations</p>
            <h4 className="text-2xl font-black text-amber-500 mt-2">{kpis.pendingRegs}</h4>
            <p className="text-xs text-slate-500 font-semibold mt-1">Awaiting approval</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance %</p>
            <h4 className="text-2xl font-black text-[#0d4697] mt-2">{kpis.attendanceRate}</h4>
            <p className="text-xs text-slate-500 font-semibold mt-1">Last 4 sessions average</p>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Referrals Given</p>
            <h4 className="text-2xl font-black text-slate-900 mt-2">{kpis.referralsGiven}</h4>
            <p className="text-xs text-slate-500 font-semibold mt-1">Passed this quarter</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Business Generated</p>
            <h4 className="text-2xl font-black text-[#0d4697] mt-2">{kpis.businessGen}</h4>
            <p className="text-xs text-slate-500 font-semibold mt-1">Chapter closed business value</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visitors This Month</p>
            <h4 className="text-2xl font-black text-slate-900 mt-2">{kpis.visitorsThisMonth}</h4>
            <p className="text-xs text-slate-500 font-semibold mt-1">Invited visitor count</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Meetings</p>
            <h4 className="text-2xl font-black text-slate-900 mt-2">{kpis.upcomingMeetings}</h4>
            <p className="text-xs text-slate-500 font-semibold mt-1">Chapter calendar events</p>
          </div>
        </div>
      </section>

      {/* 4. Quick Actions */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider mb-4">Quick Actions Console</h3>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          <button
            onClick={() => navigate('/vice-president/register-member')}
            className="flex items-center gap-2 p-3 text-xs font-extrabold text-slate-700 rounded-xl border border-slate-100 bg-slate-50 hover:bg-[#eef4ff] transition text-left"
          >
            <PlusCircle className="h-4 w-4 text-[#0d4697]" /> Register Member
          </button>
          <button
            onClick={() => navigate('/vice-president/vendor-applications')}
            className="flex items-center gap-2 p-3 text-xs font-extrabold text-slate-700 rounded-xl border border-slate-100 bg-slate-50 hover:bg-[#eef4ff] transition text-left"
          >
            <Building2 className="h-4 w-4 text-[#0d4697]" /> Vendor Applications
          </button>
          <button
            onClick={() => navigate('/vice-president/secretaries')}
            className="flex items-center gap-2 p-3 text-xs font-extrabold text-slate-700 rounded-xl border border-slate-100 bg-slate-50 hover:bg-[#eef4ff] transition text-left"
          >
            <UserCheck className="h-4 w-4 text-[#0d4697]" /> Manage Secretaries
          </button>
          <button
            onClick={() => navigate('/vice-president/members')}
            className="flex items-center gap-2 p-3 text-xs font-extrabold text-slate-700 rounded-xl border border-slate-100 bg-slate-50 hover:bg-[#eef4ff] transition text-left"
          >
            <Users className="h-4 w-4 text-[#0d4697]" /> View Members
          </button>
          <button
            onClick={() => navigate('/vice-president/approved-vendors')}
            className="flex items-center gap-2 p-3 text-xs font-extrabold text-slate-700 rounded-xl border border-slate-100 bg-slate-50 hover:bg-[#eef4ff] transition text-left"
          >
            <UsersRound className="h-4 w-4 text-[#0d4697]" /> Approved Vendors
          </button>
          <button
            onClick={() => {
              toast.success('Referral form opened')
              navigate('/member/dashboard')
            }}
            className="flex items-center gap-2 p-3 text-xs font-extrabold text-slate-700 rounded-xl border border-slate-100 bg-slate-50 hover:bg-[#eef4ff] transition text-left"
          >
            <Handshake className="h-4 w-4 text-[#0d4697]" /> Add Referral
          </button>
          <button
            onClick={() => navigate('/member/dashboard')}
            className="flex items-center gap-2 p-3 text-xs font-extrabold text-slate-700 rounded-xl border border-slate-100 bg-slate-50 hover:bg-[#eef4ff] transition text-left"
          >
            <Volume2 className="h-4 w-4 text-[#0d4697]" /> Business Wall
          </button>
          <button
            onClick={() => navigate('/member/dashboard')}
            className="flex items-center gap-2 p-3 text-xs font-extrabold text-slate-700 rounded-xl border border-slate-100 bg-slate-50 hover:bg-[#eef4ff] transition text-left"
          >
            <Ticket className="h-4 w-4 text-[#0d4697]" /> Invite Visitor
          </button>
          <button
            onClick={() => navigate('/member/dashboard')}
            className="flex items-center gap-2 p-3 text-xs font-extrabold text-slate-700 rounded-xl border border-slate-100 bg-slate-50 hover:bg-[#eef4ff] transition text-left"
          >
            <Clock className="h-4 w-4 text-[#0d4697]" /> Schedule One-to-One
          </button>
        </div>
      </section>



      {/* 6. Upcoming Activities */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Calendar className="h-4 w-4 text-[#0d4697]" /> Today's Meeting & Activities
          </h3>
          <div className="bg-[#eef4ff] rounded-xl p-4 text-xs font-semibold text-slate-700 space-y-2 border border-blue-100">
            <div className="font-extrabold text-slate-900 text-sm">Regular Chapter Session</div>
            <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-[#0d4697]" /> 07:00 AM • Friday</div>
            <div>Focus: B2B Power Networking & Referral Rounds</div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Visitor Invitations</h4>
            <div className="text-xs space-y-2">
              <div className="flex justify-between text-slate-800">
                <span className="font-bold">Rahul Dravid (Guest)</span>
                <span className="text-slate-500">Pending Attendance</span>
              </div>
              <div className="flex justify-between text-slate-800">
                <span className="font-bold">Priya Sen (Vendor Guest)</span>
                <span className="text-emerald-600 font-extrabold">Confirmed Friday</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Volume2 className="h-4 w-4 text-[#0d4697]" /> Announcements & Alerts
          </h3>
          <div className="space-y-3">
            <div className="border-l-4 border-amber-500 pl-3">
              <div className="text-xs font-black text-slate-800">New Secretary Account Pending</div>
              <p className="text-[11px] font-semibold text-slate-500 mt-1">Please confirm access overrides for Chapter Secretary.</p>
            </div>
            <div className="border-l-4 border-[#0d4697] pl-3">
              <div className="text-xs font-black text-slate-800">Regional Leadership Training</div>
              <p className="text-[11px] font-semibold text-slate-500 mt-1">Next training session is scheduled on July 20th.</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Pending Membership Applications ({membershipApps.length})</h4>
            {membershipApps.length > 0 ? (
              membershipApps.map(app => (
                <div key={app._id} className="text-xs flex items-center justify-between text-slate-850 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-2 last:mb-0">
                  <div>
                    <div className="font-extrabold">{app.personal?.fullName || app.submittedBy?.name || 'Applicant'}</div>
                    <div className="text-[10px] text-slate-500 font-semibold mt-0.5">{app.professional?.companyName || 'Silver Plan'}</div>
                  </div>
                  <button onClick={() => navigate('/vice-president/membership-applications')} className="text-[#0d4697] font-extrabold flex items-center gap-0.5 hover:underline">
                    Review <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs font-semibold text-slate-500 mt-2">No pending membership applications found.</p>
            )}
          </div>
        </div>
      </section>

      {/* 7. Business Wall - Latest Chapter Posts */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider mb-4 flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-[#0d4697]" /> Latest Chapter Posts (Business Wall)
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-block text-[10px] font-black uppercase px-2 py-0.5 bg-blue-100 text-blue-800 rounded">Promotion</span>
              <span className="text-[10px] font-semibold text-slate-400">1 hr ago</span>
            </div>
            <div className="text-xs font-extrabold text-slate-900">Custom Web Portals - 15% discount for members</div>
            <p className="text-[11px] font-semibold text-slate-500">Offering exclusive portal packages for all Chennai district chapters.</p>
            <div className="text-xs font-bold text-slate-600">Posted by: Karthik (Member)</div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-block text-[10px] font-black uppercase px-2 py-0.5 bg-amber-100 text-amber-800 rounded">Requirement</span>
              <span className="text-[10px] font-semibold text-slate-400">4 hr ago</span>
            </div>
            <div className="text-xs font-extrabold text-slate-900">Urgent need for local warehousing services</div>
            <p className="text-[11px] font-semibold text-slate-500">Need warehousing space for FMCG distribution clients.</p>
            <div className="text-xs font-bold text-slate-600">Posted by: Suresh (President)</div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-block text-[10px] font-black uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">Success Story</span>
              <span className="text-[10px] font-semibold text-slate-400">Yesterday</span>
            </div>
            <div className="text-xs font-extrabold text-slate-900">Closed business worth 4.2 Lakhs via Referral</div>
            <p className="text-[11px] font-semibold text-slate-500">A big thank you to Meena for warehousing introduction.</p>
            <div className="text-xs font-bold text-slate-600">Posted by: Meena (Secretary)</div>
          </div>
        </div>
      </section>

      {/* 8. Referrals Pipeline */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider mb-6 flex items-center gap-2">
          <Handshake className="h-4 w-4 text-[#0d4697]" /> Chapter Referrals Pipeline
        </h3>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-5 relative">
          {[
            { stage: 'Created', count: 14, color: 'border-slate-300 text-slate-600 bg-slate-50' },
            { stage: 'Accepted', count: 11, color: 'border-blue-200 text-blue-800 bg-blue-50' },
            { stage: 'Contacted', count: 9, color: 'border-amber-200 text-amber-800 bg-amber-50' },
            { stage: 'Proposal Sent', count: 6, color: 'border-indigo-200 text-indigo-800 bg-indigo-50' },
            { stage: 'Business Closed', count: 4, color: 'border-emerald-200 text-emerald-800 bg-emerald-50' }
          ].map((item, idx) => (
            <div key={item.stage} className={`border rounded-xl p-4 text-center ${item.color}`}>
              <div className="text-2xl font-black">{item.count}</div>
              <div className="text-xs font-bold uppercase tracking-wider mt-1">{item.stage}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Stage {idx + 1}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Top Performers */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider mb-4 flex items-center gap-2">
          <Award className="h-4 w-4 text-[#0d4697]" /> Chapter Top Performers Standings
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="border border-slate-100 rounded-xl p-4 text-center bg-slate-50/50">
            <div className="font-extrabold text-xs text-slate-500 uppercase">Top Referrer</div>
            <div className="font-black text-sm text-[#0d4697] mt-1.5">Suresh Kumar</div>
            <div className="text-xs text-slate-600 mt-1 font-bold">14 referrals passed</div>
          </div>
          <div className="border border-slate-100 rounded-xl p-4 text-center bg-slate-50/50">
            <div className="font-extrabold text-xs text-slate-500 uppercase">Top Attendance</div>
            <div className="font-black text-sm text-[#0d4697] mt-1.5">Meena (Sec)</div>
            <div className="text-xs text-slate-600 mt-1 font-bold">100% attendance</div>
          </div>
          <div className="border border-slate-100 rounded-xl p-4 text-center bg-slate-50/50">
            <div className="font-extrabold text-xs text-slate-500 uppercase">Top Value Generated</div>
            <div className="font-black text-sm text-[#0d4697] mt-1.5">Karthik Raja</div>
            <div className="text-xs text-slate-600 mt-1 font-bold">4.2 Lakhs value</div>
          </div>
          <div className="border border-slate-100 rounded-xl p-4 text-center bg-slate-50/50">
            <div className="font-extrabold text-xs text-slate-500 uppercase">Most One-to-Ones</div>
            <div className="font-black text-sm text-[#0d4697] mt-1.5">Priya Sen</div>
            <div className="text-xs text-slate-600 mt-1 font-bold">12 completed</div>
          </div>
          <div className="border border-slate-100 rounded-xl p-4 text-center bg-slate-50/50">
            <div className="font-extrabold text-xs text-slate-500 uppercase">Top Inviter</div>
            <div className="font-black text-sm text-[#0d4697] mt-1.5">Rahul Dravid</div>
            <div className="text-xs text-slate-600 mt-1 font-bold">4 visitors invited</div>
          </div>
        </div>
      </section>

      {/* 10. Recent Activity */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#0d4697]" /> Recent Activities Log
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-extrabold text-slate-900">Member Registered:</span>
            <span className="text-slate-500">Karthik Raja was successfully registered and assigned MEM-TN-CHN-000147 ID.</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="h-2 w-2 rounded-full bg-[#0d4697] shrink-0" />
            <span className="font-extrabold text-slate-900">Referral Passed:</span>
            <span className="text-slate-500">Suresh Kumar passed a high-priority business referral to Priya Sen.</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
            <span className="font-extrabold text-slate-900">Visitor Added:</span>
            <span className="text-slate-500">Secretary Meena added Rahul Dravid as an upcoming visitor.</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="h-2 w-2 rounded-full bg-slate-400 shrink-0" />
            <span className="font-extrabold text-slate-900">Meeting Completed:</span>
            <span className="text-slate-500">Weekly session completed with 95% attendance log accuracy.</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-extrabold text-slate-900">Attendance Updated:</span>
            <span className="text-slate-500">Meena marked Friday attendance list.</span>
          </div>
        </div>
      </section>
    </div>
  )
}
