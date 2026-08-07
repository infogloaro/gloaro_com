import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Activity,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  GitBranch,
  Kanban,
  Network,
  Loader2,
  Plus,
  Search,
  Sparkles,
  Printer,
  Upload,
  Users,
  XCircle,
  Workflow,
} from 'lucide-react'
import { adminApi } from '../../api/admin'
import Modal from '../../components/common/Modal'
import SearchBar from '../../components/common/SearchBar'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/tables/DataTable'
import LoadingScreen from '../../components/common/LoadingScreen'
import { useAuth } from '../../hooks/useAuth'
import SimpleJsonForm from '../shared/SimpleJsonForm'
import { formatCurrency, formatDate, getList, getPagination } from '../../utils/format'
import AdminVendorApplicationsApproval from './AdminVendorApplicationsApproval'
import { ROLES } from '../../constants/roleConfig.js'

const statusOptions = ['draft', 'pending', 'pending_approval', 'under_review', 'active', 'inactive', 'approved', 'rejected', 'cancelled', 'archived', 'won', 'lost', 'closed', 'converted', 'completed']

const moduleConfig = {
  organization: {
    title: 'Organization Management',
    description: 'Manage India, regions, states, districts, chapters, and director assignments.',
    icon: GitBranch,
    types: ['country', 'region', 'state', 'district', 'chapter'],
    fields: ['code', 'type', 'director', 'parent', 'membersCount', 'meetingsCount'],
  },
  assignment: {
    title: 'Hierarchy Assignment',
    description: 'Assign and transfer state directors, executive directors, launch directors, direct consultants, and chapters.',
    icon: Network,
    types: [ROLES.STATE_DIRECTOR, ROLES.EXECUTIVE_DIRECTOR, ROLES.LAUNCH_DIRECTOR, ROLES.DIRECT_CONSULTANT, 'chapter_assignment'],
    fields: ['code', 'type', 'assignedTo', 'reportsTo', 'chapter'],
  },
  visitor: {
    title: 'Visitor Management',
    description: 'Track meeting, walk-in, business, and guest visitors through the conversion lifecycle.',
    icon: Users,
    types: ['meeting_visitor', 'walk_in_visitor', 'business_visitor', 'guest_visitor'],
    fields: ['code', 'type', 'chapter', 'assignedTo', 'metadata.company', 'metadata.contact'],
  },
  meeting: {
    title: 'Meeting Management',
    description: 'Manage national, state, executive, chapter, vendor, training, online, and offline meetings.',
    icon: CalendarDays,
    types: ['national', 'state', 'executive', 'chapter', ROLES.VENDOR, 'training', 'online', 'offline'],
    fields: ['code', 'type', 'chapter', 'attendanceCount', 'visitorsCount', 'businessValue'],
  },
  business: {
    title: 'Business Networking',
    description: 'Track referrals, business given, received, closed, value, pending, lost, won, and chapter performance.',
    icon: Building2,
    types: ['referral', 'business_given', 'business_received', 'business_closed', 'pending', 'lost', 'won'],
    fields: ['code', 'type', 'chapter', 'assignedTo', 'businessValue', 'referralValue', 'metadata.company', 'metadata.contact'],
  },
  chapter: {
    title: 'Chapter Management',
    description: 'Manage chapter leaders, members, meetings, visitors, attendance, performance, business, and referrals.',
    icon: Network,
    types: ['chapter'],
    fields: ['code', 'director', 'membersCount', 'meetingsCount', 'visitorsCount', 'businessValue'],
  },
  report: {
    title: 'Interactive Report Builder',
    description: 'Create reusable reports with date, chapter, role, and region filters plus export controls.',
    icon: BarChart3,
    types: ['membership', 'attendance', 'meeting', ROLES.VENDOR, 'business', 'marketplace'],
    fields: ['code', 'type', 'metadata.filters', 'metadata.exportFormat'],
  },
  scorecard: {
    title: 'Performance Scorecard',
    description: 'Track member meetings, attendance, business, visitors, referrals, members joined, training, events, and vendor activity.',
    icon: Activity,
    types: ['member', 'chapter', 'region'],
    fields: ['code', 'type', 'chapter', 'membersCount', 'meetingsCount', 'attendanceCount', 'visitorsCount', 'businessValue', 'referralValue'],
  },
  business_wall: {
    title: 'Business Wall',
    description: 'Moderate business posts, announcements, community updates, promotion content, comments, and visibility.',
    icon: Network,
    types: ['post', 'announcement', 'promotion', 'community_update'],
    fields: ['code', 'type', 'chapter', 'assignedTo', 'metadata.category'],
  },
  training: {
    title: 'Training Management',
    description: 'Create training programs, sessions, reminders, attendance, certificates, feedback, photos, and reports.',
    icon: CalendarDays,
    types: ['program', 'session', 'workshop', 'online', 'offline'],
    fields: [],
  },
  testimonial: {
    title: 'Success Stories',
    description: 'Manage the success stories displayed on the public Gloaro home page.',
    icon: Activity,
    types: ['member', ROLES.VENDOR, 'chapter', 'event', 'training'],
    fields: ['code', 'type', 'chapter', 'assignedTo', 'metadata.category'],
  },
  workflow: {
    title: 'Workflow Engine',
    description: 'Configure versioned workflows with steps, assigned roles, notifications, conditions, auto skip, escalation, and history.',
    icon: Workflow,
    types: ['membership', ROLES.VENDOR, 'marketplace', 'business', 'visitor', 'meeting'],
    fields: ['code', 'type', 'assignedTo', 'metadata.version', 'metadata.currentStage', 'metadata.condition', 'metadata.escalationHours'],
  },
  referral_pipeline: {
    title: 'Connect Pipeline',
    description: 'CRM style pipeline from new referral to contacted, meeting, application, member joined, closed, or lost.',
    icon: Kanban,
    types: ['new', 'contacted', 'meeting_scheduled', 'meeting_completed', 'interested', 'application_created', 'member_joined', 'closed', 'lost'],
    fields: ['code', 'type', 'assignedTo', 'chapter', 'metadata.company', 'metadata.contact', 'referralValue'],
  },
  visitor_conversion: {
    title: 'Visitor Conversion Engine',
    description: 'Track visitor lifecycle from visitor to meeting, follow-up, interested, membership, member, and optional vendor.',
    icon: Users,
    types: ['visitor', 'meeting', 'follow_up', 'interested', 'membership', 'member', ROLES.VENDOR],
    fields: ['code', 'type', 'assignedTo', 'chapter', 'metadata.owner', 'metadata.daysInStage'],
  },
  attendance: {
    title: 'Attendance Engine',
    description: 'Store present, absent, late, excused, guest, QR, manual, and future GPS attendance with analytics.',
    icon: CheckCircle2,
    types: ['present', 'absent', 'late', 'excused', 'guest', 'qr', 'manual'],
    fields: ['code', 'type', 'chapter', 'attendanceCount', 'meetingsCount', 'metadata.mode'],
  },
  vendor_approval: {
    title: 'Vendor Approval Workflow',
    description: 'Move member vendor applications through document verification, executive director, marketplace admin, and approval.',
    icon: Building2,
    types: ['application', 'document_verification', ROLES.EXECUTIVE_DIRECTOR, ROLES.MARKETPLACE_ADMIN, 'approved', 'rejected'],
    fields: ['code', 'type', 'assignedTo', 'chapter', 'metadata.gst', 'metadata.pan', 'metadata.license'],
  },
  marketplace_approval: {
    title: 'Marketplace Approval',
    description: 'Review products and services, approve, publish, feature, expire, and track listing analytics.',
    icon: Building2,
    types: ['product', 'service', 'review', 'approved', 'published', 'featured', 'expired'],
    fields: ['code', 'type', 'assignedTo', 'metadata.category', 'businessValue'],
  },
  notification_automation: {
    title: 'Notification Automation',
    description: 'Configure events, reminders, approvals, rejections, completions, and delivery channels.',
    icon: Activity,
    types: ['meeting_reminder', 'visitor_follow_up', 'referral_assigned', 'membership_pending', 'vendor_pending', 'business_assigned', 'training_reminder', 'event_reminder', 'birthday', 'anniversary', 'renewal_reminder', 'approval_pending', 'rejected', 'completed'],
    fields: ['code', 'type', 'assignedTo', 'metadata.channel', 'metadata.template'],
  },
  task: {
    title: 'Task Management',
    description: 'Every approval can create a task with assignee, due date, priority, status, board, calendar, and timeline.',
    icon: Kanban,
    types: ['approval', 'follow_up', 'meeting', 'renewal', 'verification', 'report'],
    fields: ['code', 'type', 'assignedTo', 'metadata.priority', 'metadata.dueDate', 'metadata.currentStage'],
  },
  calendar: {
    title: 'Enterprise Calendar',
    description: 'Calendar for meetings, events, training, tasks, birthdays, renewals, and follow-ups.',
    icon: CalendarDays,
    types: ['meeting', 'event', 'training', 'task', 'birthday', 'renewal', 'follow_up'],
    fields: ['code', 'type', 'assignedTo', 'chapter', 'metadata.startDate', 'metadata.endDate'],
  },
  member_journey: {
    title: 'Member Journey',
    description: 'Timeline from referral, meeting, visitor, application, approval, member, vendor, business, and awards.',
    icon: Sparkles,
    types: ['referral', 'meeting', 'visitor', 'application', 'approval', 'member', ROLES.VENDOR, 'business', 'award'],
    fields: ['code', 'type', 'assignedTo', 'chapter', 'metadata.currentStage'],
  },
  ai_insight: {
    title: 'AI Insights',
    description: 'Future-ready insight architecture for attendance prediction, member growth, business prediction, referral analysis, top performers, and risk members.',
    icon: Sparkles,
    types: ['attendance_prediction', 'member_growth', 'business_prediction', 'referral_analysis', 'top_performer', 'risk_member'],
    fields: ['code', 'type', 'metadata.signal', 'metadata.confidence'],
  },
}

export function OrganizationManagementPage() {
  return (
    <EnterpriseRecordsPage
      module="organization"
      extraPanel={<OrganizationTreePanel />}
    />
  )
}

export function HierarchyAssignmentPage() {
  return <EnterpriseRecordsPage module="assignment" wizardTitle="Assignment Wizard" />
}

export function VisitorManagementPage() {
  return <EnterpriseRecordsPage module="visitor" />
}

export function MeetingManagementPage() {
  return <EnterpriseRecordsPage module="meeting" />
}

export function BusinessNetworkingPage() {
  return <EnterpriseRecordsPage module="business" />
}

export function ChapterManagementPage() {
  return <ChapterApprovalQueuePage />
}

function ChapterApprovalQueuePage() {
  const [payload, setPayload] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [saving, setSaving] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const params = useMemo(() => ({
    page,
    limit: 10,
    search: search || undefined,
    status: status || undefined,
  }), [page, search, status])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [recordsResponse, statsResponse] = await Promise.all([
        adminApi.enterpriseRecords('organization', { ...params, type: 'chapter' }),
        adminApi.enterpriseStats('organization', { type: 'chapter' }),
      ])
      setPayload(recordsResponse.data)
      setStats(statsResponse.data?.data || null)
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    const timer = window.setTimeout(() => load(), 0)
    return () => window.clearTimeout(timer)
  }, [load])

  const rows = getList(payload)
  const pagination = getPagination(payload)

  const openDetails = async (row) => {
    setSelected(row)
    setRejectReason(row.rejectedReason || '')
    setLoadingDetails(true)
    try {
      const response = await adminApi.enterpriseRecord(row._id)
      const record = response.data?.data || row
      setSelected(record)
      setRejectReason(record.rejectedReason || '')
    } finally {
      setLoadingDetails(false)
    }
  }

  const refreshSelected = async (id) => {
    if (!selected?._id || selected._id !== id) return
    const response = await adminApi.enterpriseRecord(id)
    const record = response.data?.data || selected
    setSelected(record)
    setRejectReason(record.rejectedReason || '')
  }

  const approve = async (row) => {
    setSaving(true)
    try {
      await adminApi.approveChapter(row._id, {})
      toast.success('Chapter approved successfully')
      await load()
      await refreshSelected(row._id)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve chapter')
    } finally {
      setSaving(false)
    }
  }

  const reject = async (row, reasonValue = rejectReason) => {
    const reason = String(reasonValue || '').trim()
    if (!reason) {
      toast.error('Rejection reason is required')
      return
    }

    setSaving(true)
    try {
      await adminApi.rejectChapter(row._id, { reason })
      toast.success('Chapter rejected successfully')
      await load()
      await refreshSelected(row._id)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject chapter')
    } finally {
      setSaving(false)
    }
  }

  const toggleInactive = async (row) => {
    const nextStatus = row.status === 'inactive' ? 'active' : 'inactive'
    setSaving(true)
    try {
      await adminApi.updateEnterpriseStatus(row._id, nextStatus)
      toast.success(`Chapter ${nextStatus}`)
      await load()
      await refreshSelected(row._id)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update chapter status')
    } finally {
      setSaving(false)
    }
  }

  const chapterStats = useMemo(() => {
    const counts = Object.fromEntries((stats?.byStatus || []).map((item) => [item._id, item.count]))
    return [
      { label: 'Total Chapter Approvals', value: stats?.total || 0 },
      { label: 'Pending Approval', value: counts.pending_approval || 0 },
      { label: 'Active', value: counts.active || 0 },
      { label: 'Rejected', value: counts.rejected || 0 },
      { label: 'Inactive', value: counts.inactive || 0 },
    ]
  }, [stats])

  return (
    <section className="space-y-6">
      <EnterpriseHeader
        title="Chapter Approval Queue"
        description="Review chapter requests submitted by District Directors, then approve, reject, or deactivate them."
        icon={Building2}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {chapterStats.map((card) => (
          <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-extrabold uppercase text-slate-400">{card.label}</p>
            <p className="mt-2 text-2xl font-black text-slate-950">{card.value}</p>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder="Search chapter approvals" />
          <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold">
            <option value="">All Statuses</option>
            {['pending_approval', 'active', 'rejected', 'inactive'].map((value) => (
              <option key={value} value={value}>{formatLabel(value)}</option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'name', header: 'Chapter Name' },
          { key: 'region', header: 'Region', render: (row) => row.parent?.parent?.parent?.name || '-' },
          { key: 'state', header: 'State', render: (row) => row.parent?.parent?.name || '-' },
          { key: 'district', header: 'District', render: (row) => row.parent?.name || '-' },
          { key: 'createdBy', header: 'Created By', render: (row) => row.createdBy?.name || row.createdBy?.email || 'System' },
          { key: 'createdAt', header: 'Created Date', render: (row) => formatDate(row.createdAt) },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        ]}
        rows={rows}
        loading={loading}
        pagination={pagination}
        onPageChange={setPage}
        actions={(row) => (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => openDetails(row)}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#0d4697]/25 px-3 py-1.5 text-xs font-bold text-[#0d4697] hover:bg-blue-50"
            >
              <Eye className="h-3.5 w-3.5" />
              View
            </button>
            <button
              type="button"
              disabled={saving || row.status === 'active'}
              onClick={() => approve(row)}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-extrabold text-white disabled:opacity-50"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Approve
            </button>
            <button
              type="button"
              disabled={saving || row.status === 'active' || row.status === 'rejected'}
              onClick={() => {
                const reason = window.prompt('Enter a rejection reason')
                if (reason) reject(row, reason)
              }}
              className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-xs font-extrabold text-white disabled:opacity-50"
            >
              <XCircle className="h-3.5 w-3.5" />
              Reject
            </button>
            <button
              type="button"
              disabled={saving || !['active', 'inactive'].includes(row.status)}
              onClick={() => toggleInactive(row)}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 disabled:opacity-50"
            >
              {row.status === 'inactive' ? 'Activate' : 'Deactivate'}
            </button>
          </div>
        )}
      />

      <Modal open={Boolean(selected)} title="Chapter Details" onClose={() => setSelected(null)} maxWidth="max-w-5xl">
        {loadingDetails ? (
          <div className="grid min-h-40 place-items-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#0d4697]" />
          </div>
        ) : selected ? (
          <div className="space-y-5">
            <div className="flex flex-col justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Chapter</p>
                <h3 className="mt-1 text-xl font-black text-slate-950">{selected.name}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-600">
                  {selected.parent?.parent?.parent?.name || 'Region'} / {selected.parent?.parent?.name || 'State'} / {selected.parent?.name || 'District'}
                </p>
              </div>
              <StatusBadge value={selected.status} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <DetailSection title="Location Details" items={[
                ['Region', selected.parent?.parent?.parent?.name],
                ['State', selected.parent?.parent?.name],
                ['District', selected.parent?.name],
                ['Code', selected.code],
              ]} />
              <DetailSection title="Approval Audit" items={[
                ['Requested By', selected.requestedBy?.name || selected.createdBy?.name || 'System'],
                ['Requested At', formatDate(selected.requestedAt || selected.createdAt)],
                ['Approved By', selected.approvedBy?.name || '-'],
                ['Approved At', formatDate(selected.approvedAt)],
                ['Rejected By', selected.rejectedBy?.name || '-'],
                ['Rejected At', formatDate(selected.rejectedAt)],
              ]} />
            </div>

            <section className="rounded-lg border border-slate-200 bg-white p-4">
              <label className="text-sm font-extrabold text-slate-950">Rejection Reason</label>
              <textarea
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                rows={4}
                placeholder="Add a rejection reason before rejecting this chapter"
                className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#0d4697] focus:ring-2 focus:ring-blue-100"
              />
            </section>

            <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
              <button onClick={() => setSelected(null)} className="inline-flex items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50">
                Close
              </button>
              <button
                onClick={() => approve(selected)}
                disabled={saving || selected.status === 'active'}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-extrabold text-white disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve
              </button>
              <button
                onClick={() => reject(selected)}
                disabled={saving || selected.status === 'active' || selected.status === 'rejected'}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 px-4 py-2 text-sm font-extrabold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </button>
              <button
                onClick={() => toggleInactive(selected)}
                disabled={saving || !['active', 'inactive'].includes(selected.status)}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                {selected.status === 'inactive' ? 'Activate' : 'Deactivate'}
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  )
}

export function EnterpriseReportBuilderPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [dataList, setDataList] = useState([])
  const [reportType, setReportType] = useState('summary')

  const userRole = user?.role || ROLES.SUPERADMIN

  const loadReport = useCallback(async (type) => {
    setLoading(true)
    setReportType(type)
    try {
      if (type === 'hierarchy' || type === 'region' || type === 'state' || type === 'district') {
        const res = await api.get('/directory/organization-hierarchy')
        const allData = res.data?.data || []
        
        let filtered = allData
        if (type === 'region') {
          filtered = allData.filter(item => item.type === 'region')
        } else if (type === 'state') {
          filtered = allData.filter(item => item.type === 'state')
        } else if (type === 'district') {
          filtered = allData.filter(item => item.type === 'district')
        }

        setDataList(filtered.map(item => ({
          ID: item._id,
          Name: item.name,
          Code: item.code || '-',
          Type: item.type?.toUpperCase(),
          ParentID: item.parent || 'None'
        })))
      } else if (type === 'membership') {
        const res = await api.get('/membership-applications')
        const apps = res.data?.data || []
        setDataList(apps.map(item => ({
          Applicant: item.personal?.fullName || 'N/A',
          Company: item.professional?.companyName || 'N/A',
          Email: item.personal?.emailAddress || 'N/A',
          Status: item.status?.toUpperCase(),
          Submitted: formatDate(item.createdAt)
        })))
      } else {
        // default summary report
        const res = await api.get('/admin/dashboard')
        const stats = res.data || {}
        setDataList([
          { Metric: 'Total Officials', Value: stats.totalUsers || 0 },
          { Metric: 'Total Vendors', Value: stats.totalVendors || 0 },
          { Metric: 'Products Count', Value: stats.productsCount || 0 },
          { Metric: 'Services Count', Value: stats.servicesCount || 0 },
          { Metric: 'Membership Applications', Value: stats.membershipApplicationsCount || 0 },
          { Metric: 'Pending Applications', Value: stats.pendingMembershipApplications || 0 }
        ])
      }
    } catch {
      toast.error('Failed to generate report')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Determine default report based on role
    if ([ROLES.REGION_DIRECTOR].includes(userRole)) {
      loadReport('region')
    } else if ([ROLES.STATE_DIRECTOR].includes(userRole)) {
      loadReport('state')
    } else if ([ROLES.DISTRICT_DIRECTOR].includes(userRole)) {
      loadReport('district')
    } else if ([ROLES.EXECUTIVE_DIRECTOR].includes(userRole)) {
      loadReport('membership')
    } else {
      loadReport('summary')
    }
  }, [userRole, loadReport])

  const exportCSV = () => {
    if (dataList.length === 0) return
    const headers = Object.keys(dataList[0]).join(',')
    const rows = dataList.map(row => Object.values(row).map(v => `"${v}"`).join(','))
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${reportType}_report.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Report exported to CSV')
  }

  const printReport = () => {
    window.print()
  }

  const headers = dataList.length > 0 ? Object.keys(dataList[0]) : []

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/60 bg-white/85 p-6 shadow-sm backdrop-blur print:hidden dark:border-slate-800 dark:bg-slate-900">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#0d4697]">
            <Activity className="h-4 w-4" /> Reports Center
          </p>
          <h1 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">Role-Based Reports</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Generate and export location status, member directories, and administrative performance indicators.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportCSV}
            disabled={loading || dataList.length === 0}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-xs font-extrabold text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <Download className="h-3.5 w-3.5" /> Export Excel
          </button>
          <button
            onClick={printReport}
            disabled={loading || dataList.length === 0}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#0d4697] px-4 text-xs font-extrabold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            <Printer className="h-3.5 w-3.5" /> Print
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 print:hidden">
        {[ROLES.SUPERADMIN, ROLES.ADMIN].includes(userRole) && (
          <button
            onClick={() => loadReport('summary')}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition ${reportType === 'summary' ? 'border-[#0d4697] text-[#0d4697]' : 'border-transparent text-slate-500 hover:text-slate-850'}`}
          >
            Dashboard Summary
          </button>
        )}
        {[ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.REGION_DIRECTOR].includes(userRole) && (
          <button
            onClick={() => loadReport('region')}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition ${reportType === 'region' ? 'border-[#0d4697] text-[#0d4697]' : 'border-transparent text-slate-500 hover:text-slate-850'}`}
          >
            Region Performance
          </button>
        )}
        {[ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.REGION_DIRECTOR, ROLES.STATE_DIRECTOR].includes(userRole) && (
          <button
            onClick={() => loadReport('state')}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition ${reportType === 'state' ? 'border-[#0d4697] text-[#0d4697]' : 'border-transparent text-slate-500 hover:text-slate-850'}`}
          >
            State Summary
          </button>
        )}
        {[ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.REGION_DIRECTOR, ROLES.STATE_DIRECTOR, ROLES.DISTRICT_DIRECTOR].includes(userRole) && (
          <button
            onClick={() => loadReport('district')}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition ${reportType === 'district' ? 'border-[#0d4697] text-[#0d4697]' : 'border-transparent text-slate-500 hover:text-slate-850'}`}
          >
            District Chapters
          </button>
        )}
        <button
          onClick={() => loadReport('membership')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition ${reportType === 'membership' ? 'border-[#0d4697] text-[#0d4697]' : 'border-transparent text-slate-500 hover:text-slate-850'}`}
        >
          Membership Applications
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        {loading ? (
          <LoadingScreen label="Generating Report Data..." />
        ) : dataList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm print:text-black">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                <tr>
                  {headers.map(h => (
                    <th key={h} className="px-4 py-3 font-extrabold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {dataList.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                    {headers.map(h => (
                      <td key={h} className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">
                        {typeof row[h] === 'object' ? JSON.stringify(row[h]) : String(row[h] ?? '-')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm font-semibold text-slate-500 text-center py-12">No data retrieved for this report type.</p>
        )}
      </div>
    </div>
  )
}

export function PerformanceScorecardPage() {
  return <EnterpriseRecordsPage module="scorecard" />
}

export function ActivityCenterPage() {
  return (
    <EnterpriseRecordsPage
      module="activity"
      config={{
        title: 'Activity Center',
        description: 'Membership created, meeting created, referral added, vendor approved, business closed, chapter created, role updated, and settings changed.',
        icon: Activity,
        types: ['membership_created', 'meeting_created', 'referral_added', 'vendor_approved', 'business_closed', 'chapter_created', 'role_updated', 'settings_changed'],
        fields: ['code', 'type', 'assignedTo', 'metadata.module', 'metadata.action'],
      }}
    />
  )
}

export function BusinessWallManagementPage() {
  return <EnterpriseRecordsPage module="business_wall" />
}

export function TrainingManagementPage() {
  return <EnterpriseRecordsPage module="training" />
}

export function TestimonialsManagementPage() {
  const [search, setSearch] = useState('')
  const [stories, setStories] = useState([])
  const [formOpen, setFormOpen] = useState(false)
  const [editingStory, setEditingStory] = useState(null)
  const [form, setForm] = useState({ name: '', role: '', quote: '', rating: 5, status: 'active', avatar: '' })

  const loadDatabaseStories = useCallback(async () => {
    try {
      const response = await adminApi.enterpriseRecords('testimonial', { limit: 100, sort: '-createdAt' })
      const databaseStories = getList(response.data).map((record) => ({
        _id: record._id,
        name: record.name,
        role: record.metadata?.role || '',
        quote: record.metadata?.quote || '',
        rating: Number(record.metadata?.rating) || 5,
        avatar: record.metadata?.avatar || '',
        status: record.status || 'active',
      }))
      setStories(databaseStories)
    } catch (error) {
      setStories([])
      toast.error(error.response?.data?.message || 'Unable to load success stories')
    }
  }, [])

  useEffect(() => {
    loadDatabaseStories()
  }, [loadDatabaseStories])

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase()
    return stories.filter((story) => {
      return !query || [story.name, story.role, story.quote].some((value) => value.toLowerCase().includes(query))
    })
  }, [search, stories])

  const submitStory = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.role.trim() || !form.quote.trim()) {
      toast.error('Name, role/company, and success story are required')
      return
    }
    const values = {
      ...form,
      name: form.name.trim(),
      role: form.role.trim(),
      quote: form.quote.trim(),
      rating: Number(form.rating),
      avatar: form.avatar.trim() || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=96&q=80',
    }
    const wasEditing = Boolean(editingStory)
    const databasePayload = {
      name: values.name,
      type: 'success_story',
      status: values.status,
      metadata: {
        role: values.role,
        quote: values.quote,
        rating: values.rating,
        avatar: values.avatar,
      },
    }
    try {
      if (wasEditing) {
        await adminApi.updateEnterpriseRecord(editingStory._id, databasePayload)
      } else {
        await adminApi.createEnterpriseRecord('testimonial', databasePayload)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save success story')
      return
    }
    await loadDatabaseStories()
    setForm({ name: '', role: '', quote: '', rating: 5, status: 'active', avatar: '' })
    setEditingStory(null)
    setFormOpen(false)
    toast.success(values.status === 'active'
      ? (wasEditing ? 'Success story updated on the public home page' : 'Success story added to the public home page')
      : 'Success story saved as inactive')
    if (!wasEditing && values.status === 'active') {
      window.sessionStorage.setItem('gloaro_new_success_story', 'true')
      window.location.assign(`${window.location.origin}/#testimonials`)
    }
  }

  const openAddStory = () => {
    setEditingStory(null)
    setForm({ name: '', role: '', quote: '', rating: 5, status: 'active', avatar: '' })
    setFormOpen(true)
  }

  const openEditStory = (story) => {
    setEditingStory(story)
    setForm({
      name: story.name || '',
      role: story.role || '',
      quote: story.quote || '',
      rating: story.rating || 5,
      status: story.status || 'active',
      avatar: story.avatar || '',
    })
    setFormOpen(true)
  }

  const deleteStory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this success story?')) return
    try {
      await adminApi.deleteEnterpriseRecord(id)
      toast.success('Success story deleted')
      loadDatabaseStories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete success story')
    }
  }

  const selectProfileImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      event.target.value = ''
      return
    }
    if (file.size > 1024 * 1024) {
      toast.error('Profile image must be 1 MB or smaller')
      event.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => setForm((current) => ({ ...current, avatar: String(reader.result || '') }))
    reader.onerror = () => toast.error('Unable to read the selected image')
    reader.readAsDataURL(file)
  }

  return (
    <section className="space-y-6">
      <EnterpriseHeader
        title="Success Stories"
        description="View the same success stories currently displayed on the public Gloaro home page."
        icon={Activity}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ['Total Stories', stories.length],
          ['Active Stories', stories.filter((story) => story.status === 'active').length],
        ].map(([label, value]) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-extrabold uppercase text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black text-[#0d4697]">{value}</p>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search success stories" />
          <button type="button" onClick={openAddStory} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#0d4697] px-5 text-sm font-extrabold text-white shadow-sm hover:bg-[#093a80]"><Plus className="h-4 w-4" />Add Success Story</button>
        </div>
      </div>

      <DataTable
        columns={[
          {
            key: 'name',
            header: 'Person',
            render: (row) => (
              <div className="flex min-w-48 items-center gap-3">
                <img src={row.avatar} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-100" />
                <div><p className="font-extrabold text-slate-950">{row.name}</p><p className="text-xs font-semibold text-slate-500">{row.role}</p></div>
              </div>
            ),
          },
          { key: 'quote', header: 'Success Story', render: (row) => <p className="w-[34rem] max-w-[42vw] whitespace-normal break-words font-semibold leading-5 text-slate-700 [overflow-wrap:anywhere]">{row.quote}</p> },
          { key: 'rating', header: 'Rating', render: (row) => <span className="inline-block min-w-20 whitespace-nowrap font-black text-[#ffae13]">{'★'.repeat(row.rating)}</span> },
          { key: 'status', header: 'Status', render: (row) => <span className="inline-block min-w-16"><StatusBadge value={row.status} /></span> },
        ]}
        rows={rows}
        loading={false}
        actions={(row) => (
          <div className="flex gap-2">
            <button type="button" onClick={() => openEditStory(row)} className="rounded-md border border-[#0d4697]/25 bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-[#0d4697] hover:bg-blue-100">Edit</button>
            <button type="button" onClick={() => deleteStory(row._id)} className="rounded-md border border-red-500/25 bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-600 hover:bg-red-100">Delete</button>
          </div>
        )}
      />
      <Modal open={formOpen} title={editingStory ? 'Edit Success Story' : 'Add Success Story'} onClose={() => { setFormOpen(false); setEditingStory(null) }}>
        <form onSubmit={submitStory} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-extrabold text-slate-800">Person Name
              <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="e.g. Priya Kumar" className="mt-1.5 h-11 w-full rounded-md border border-slate-300 px-3 font-semibold outline-none focus:border-[#0d4697]" />
            </label>
            <label className="text-sm font-extrabold text-slate-800">Role / Company
              <input value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} placeholder="e.g. Founder, ABC Tech" className="mt-1.5 h-11 w-full rounded-md border border-slate-300 px-3 font-semibold outline-none focus:border-[#0d4697]" />
            </label>
          </div>
          <label className="block text-sm font-extrabold text-slate-800">Success Story
            <textarea value={form.quote} onChange={(event) => setForm((current) => ({ ...current, quote: event.target.value }))} rows={5} placeholder="Enter the customer success story" className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 font-semibold outline-none focus:border-[#0d4697]" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-extrabold text-slate-800">Status
              <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className="mt-1.5 h-11 w-full rounded-md border border-slate-300 bg-white px-3 font-semibold">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
            <label className="text-sm font-extrabold text-slate-800">Rating
              <select value={form.rating} onChange={(event) => setForm((current) => ({ ...current, rating: event.target.value }))} className="mt-1.5 h-11 w-full rounded-md border border-slate-300 bg-white px-3 font-semibold">
                {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} Stars</option>)}
              </select>
            </label>
          </div>
          <div>
            <p className="text-sm font-extrabold text-slate-800">Profile Image</p>
            <div className="mt-1.5 flex items-center gap-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">
              {form.avatar
                ? <img src={form.avatar} alt="Selected profile preview" className="h-16 w-16 rounded-full object-cover ring-4 ring-blue-100" />
                : <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-slate-200 text-xs font-black text-slate-500">PHOTO</div>}
              <div className="min-w-0 flex-1">
                <input id="success-story-avatar" type="file" accept="image/png,image/jpeg,image/webp" onChange={selectProfileImage} className="hidden" />
                <label htmlFor="success-story-avatar" className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-[#0d4697]/25 bg-white px-4 py-2 text-sm font-extrabold text-[#0d4697] hover:bg-blue-50"><Upload className="h-4 w-4" />{form.avatar ? 'Change Image' : 'Upload Image'}</label>
                <p className="mt-1.5 text-xs font-semibold text-slate-500">JPG, PNG or WebP — maximum 1 MB.</p>
              </div>
              {form.avatar && <button type="button" onClick={() => setForm((current) => ({ ...current, avatar: '' }))} className="text-xs font-extrabold text-red-600 hover:underline">Remove</button>}
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button type="button" onClick={() => { setFormOpen(false); setEditingStory(null) }} className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-extrabold text-slate-700">Cancel</button>
            <button type="submit" className="rounded-md bg-[#0d4697] px-5 py-2.5 text-sm font-extrabold text-white">{editingStory ? 'Save Changes' : 'Add Success Story'}</button>
          </div>
        </form>
      </Modal>
    </section>
  )
}

export function GlobalSearchPage() {
  const [query, setQuery] = useState('')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  const search = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const response = await adminApi.enterpriseSearch({ search: query })
      setRows(response.data?.data || [])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-6">
      <EnterpriseHeader title="Global Search" description="Search across members, meetings, business, visitors, vendors, marketplace, training, events, reports, and settings." icon={Search} />
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && search()} placeholder="Search everything" className="h-11 rounded-md border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-[#0d4697]" />
          <button type="button" onClick={search} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#0d4697] px-5 text-sm font-extrabold text-white">
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </div>
      <DataTable columns={enterpriseColumns()} rows={rows} loading={loading} />
    </section>
  )
}

export function WorkflowEnginePage() {
  return (
    <section className="space-y-6">
      <WorkflowBuilder />
      <EnterpriseRecordsPage module="workflow" />
    </section>
  )
}

export function ReferralPipelinePage() {
  return <PipelinePage module="referral_pipeline" stages={moduleConfig.referral_pipeline.types} />
}

export function VisitorConversionEnginePage() {
  return <PipelinePage module="visitor_conversion" stages={moduleConfig.visitor_conversion.types} />
}

export function AttendanceEnginePage() {
  return <EnterpriseRecordsPage module="attendance" />
}

export function VendorApprovalWorkflowPage() {
  return <PipelinePage module="vendor_approval" stages={moduleConfig.vendor_approval.types} />
}

export function MarketplaceApprovalPage() {
  const [activeTab, setActiveTab] = useState('vendor_applications')

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-200 dark:border-slate-800 print:hidden">
        <button
          onClick={() => setActiveTab('vendor_applications')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition ${activeTab === 'vendor_applications' ? 'border-[#0d4697] text-[#0d4697]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Vendor Applications
        </button>
        <button
          onClick={() => setActiveTab('products_services')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition ${activeTab === 'products_services' ? 'border-[#0d4697] text-[#0d4697]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Products & Services
        </button>
      </div>

      {activeTab === 'vendor_applications' ? (
        <AdminVendorApplicationsApproval />
      ) : (
        <PipelinePage module="marketplace_approval" stages={moduleConfig.marketplace_approval.types} />
      )}
    </div>
  )
}

export function NotificationAutomationPage() {
  return <EnterpriseRecordsPage module="notification_automation" />
}

export function TaskManagementPage() {
  return <PipelinePage module="task" stages={['pending', 'under_review', 'active', 'completed', 'archived']} />
}

export function EnterpriseCalendarPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.enterpriseCalendar().then((response) => setItems(response.data?.data || [])).finally(() => setLoading(false))
  }, [])

  return (
    <section className="space-y-6">
      <EnterpriseHeader title="Enterprise Calendar" description="Meetings, events, training, tasks, birthdays, renewals, and follow-ups in one responsive agenda." icon={CalendarDays} />
      <DataTable columns={enterpriseColumns()} rows={items} loading={loading} />
    </section>
  )
}

export function EnterpriseAnalyticsPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    adminApi.enterpriseAnalytics().then((response) => setData(response.data?.data || {}))
  }, [])

  const moduleRows = data?.byModule || []
  const statusRows = data?.byStatus || []
  return (
    <section className="space-y-6">
      <EnterpriseHeader title="Enterprise Analytics" description="Organization, chapter, attendance, referral, business, vendor, marketplace, meeting, and growth analytics." icon={BarChart3} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {moduleRows.slice(0, 8).map((row) => (
          <article key={row._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-extrabold uppercase text-slate-400">{formatLabel(row._id)}</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{row.count}</p>
            <p className="mt-1 text-xs font-bold text-emerald-600">{formatCurrency(row.businessValue || 0)}</p>
          </article>
        ))}
      </div>
      <DataTable columns={[{ key: '_id', header: 'Status', render: (row) => formatLabel(row._id) }, { key: 'count', header: 'Count' }]} rows={statusRows.map((row) => ({ ...row, id: row._id }))} />
    </section>
  )
}

export function ExecutiveDashboardPage() {
  return <EnterpriseRecordsPage module="executive_dashboard" config={{ title: 'Executive Dashboard', description: 'Director KPIs, meetings conducted, attendance, visitors, members joined, business generated, referrals, vendor approvals, score, and ranking.', icon: BarChart3, types: ['director', ROLES.EXECUTIVE_DIRECTOR, ROLES.STATE_DIRECTOR], fields: ['code', 'type', 'assignedTo', 'meetingsCount', 'attendanceCount', 'visitorsCount', 'membersCount', 'businessValue', 'referralValue'] }} />
}

export function ChapterDashboardPage() {
  return <EnterpriseRecordsPage module="chapter_dashboard" config={{ title: 'Chapter Dashboard', description: 'Chapter performance, visitors, attendance, meetings, business, referrals, members, top performers, and charts.', icon: Network, types: ['chapter'], fields: ['code', 'chapter', 'meetingsCount', 'attendanceCount', 'visitorsCount', 'membersCount', 'businessValue', 'referralValue'] }} />
}

export function MemberJourneyPage() {
  return <EnterpriseRecordsPage module="member_journey" />
}

export function AIInsightsPage() {
  return <EnterpriseRecordsPage module="ai_insight" />
}

function EnterpriseRecordsPage({ module, config: overrideConfig, extraPanel, wizardTitle }) {
  const { hasSection, hasOperation } = useAuth()
  const config = overrideConfig || moduleConfig[module] || moduleConfig.organization
  const activeStatusOptions = module === 'training' ? ['draft', 'active', 'inactive', 'completed'] : statusOptions
  const [payload, setPayload] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [viewingTraining, setViewingTraining] = useState(null)
  const [trainingMembers, setTrainingMembers] = useState([])

  useEffect(() => {
    if (module !== 'training') return
    adminApi.users({ limit: 100, status: 'active' }).then((response) => setTrainingMembers(getList(response.data))).catch(() => setTrainingMembers([]))
  }, [module])

  const params = useMemo(() => ({ page, limit: 10, search: search || undefined, type: type || undefined, status: status || undefined }), [page, search, status, type])

  const load = useCallback(async () => {
    if (!hasOperation(module, 'view')) {
      setPayload(null)
      setStats(null)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const [recordsResponse, statsResponse] = await Promise.all([
        adminApi.enterpriseRecords(module, params),
        adminApi.enterpriseStats(module),
      ])
      setPayload(recordsResponse.data)
      setStats(statsResponse.data?.data)
    } finally {
      setLoading(false)
    }
  }, [hasOperation, module, params])

  useEffect(() => {
    if (!hasOperation(module, 'view')) return undefined
    const timer = window.setTimeout(() => load(), 0)
    return () => window.clearTimeout(timer)
  }, [hasOperation, load, module])

  const rows = getList(payload)
  const pagination = getPagination(payload)
  const canView = hasOperation(module, 'view')
  const canCreate = hasOperation(module, 'create')
  const canEdit = hasOperation(module, 'edit')
  const canDelete = hasOperation(module, 'delete')
  const canApprove = hasOperation(module, 'approve')
  const showStats = hasSection(module, 'stats')
  const showList = hasSection(module, 'list')
  const showFilters = hasSection(module, 'filters')
  const showWizard = wizardTitle && hasSection(module, 'wizard')
  const showExtraPanel = extraPanel && hasSection(module, 'overview')

  const submit = async (values) => {
    const data = normalizeFormValues(values)
    const assignedMemberId = data.assignedMemberId
    if (module === 'training' && data.assignments) {
      data.metadata = { ...(data.metadata || {}), assignments: data.assignments.filter((assignment) => assignment.name || assignment.link) }
      delete data.assignments
    }
    delete data.assignedMemberId
    const response = editing ? await adminApi.updateEnterpriseRecord(editing._id, data) : await adminApi.createEnterpriseRecord(module, data)
    if (module === 'training' && Array.isArray(assignedMemberId)) {
      const targetId = editing?._id || response.data?.data?._id || response.data?._id
      if (targetId) await adminApi.assignTrainingMember(targetId, assignedMemberId)
    }
    toast.success(editing ? 'Record updated' : 'Record created')
    setFormOpen(false)
    setEditing(null)
    load()
  }

  const changeStatus = async (row, nextStatus) => {
    await adminApi.updateEnterpriseStatus(row._id, nextStatus)
    toast.success('Status updated')
    load()
  }

  const remove = async (row) => {
    await adminApi.deleteEnterpriseRecord(row._id)
    toast.success('Record deleted')
    load()
  }

  const viewTraining = async (row) => {
    const response = await adminApi.enterpriseRecord(row._id)
    setViewingTraining(response.data?.data || response.data || row)
  }

  const saveTrainingMark = async (progress) => {
    await adminApi.updateTrainingProgress(viewingTraining._id, progress._id, progress.marks || '')
    toast.success('Mark saved')
  }

  return (
    <section className="space-y-6">
      <EnterpriseHeader title={config.title} description={config.description} icon={config.icon} />
      {showStats && <StatsStrip stats={stats} />}
      {showExtraPanel ? extraPanel : null}
      {showWizard && canCreate && <AssignmentWizard title={wizardTitle} onCreate={() => { setEditing(null); setFormOpen(true) }} />}
      {showFilters && <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid gap-2 md:grid-cols-[1fr_auto_auto] xl:min-w-[720px]">
            <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder={`Search ${config.title.toLowerCase()}`} />
            <select value={type} onChange={(event) => { setType(event.target.value); setPage(1) }} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold">
              <option value="">All Types</option>
              {config.types.map((item) => <option key={item} value={item}>{formatLabel(item)}</option>)}
            </select>
            <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold">
              <option value="">All Status</option>
              {activeStatusOptions.map((item) => <option key={item} value={item}>{formatLabel(item)}</option>)}
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            {canCreate && <button type="button" onClick={() => { setEditing(null); setFormOpen(true) }} className="inline-flex h-10 items-center gap-2 rounded-md bg-[#0d4697] px-4 text-xs font-extrabold text-white"><Plus className="h-4 w-4" />Add</button>}
          </div>
        </div>
      </div>}
      {showList && canView && <DataTable
        columns={enterpriseColumns()}
        rows={rows}
        loading={loading}
        pagination={pagination}
        onPageChange={setPage}
        actions={(canEdit || canDelete || canApprove) ? (row) => (
          <div className="flex flex-wrap gap-2">
            {module === 'training' && <button type="button" onClick={() => viewTraining(row)} className="rounded-md border border-[#0d4697] px-3 py-1.5 text-xs font-bold text-[#0d4697]">View</button>}
            {canEdit && <button type="button" onClick={() => { setEditing(row); setFormOpen(true) }} className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-bold">Edit</button>}
            {canApprove && <select value={row.status} onChange={(event) => changeStatus(row, event.target.value)} className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs font-bold">
              {activeStatusOptions.map((item) => <option key={item} value={item}>{formatLabel(item)}</option>)}
            </select>}
            {canDelete && <button type="button" onClick={() => remove(row)} className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600">Delete</button>}
          </div>
        ) : undefined}
      />}
      <Modal open={Boolean(viewingTraining)} title={viewingTraining?.name || 'Training details'} onClose={() => setViewingTraining(null)}>
        {viewingTraining && <div className="space-y-5 text-sm">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-slate-50 p-3"><p className="text-[10px] font-extrabold uppercase text-slate-400">Type</p><p className="mt-1 font-bold capitalize text-slate-800">{formatLabel(viewingTraining.type)}</p></div>
            <div className="rounded-lg bg-slate-50 p-3"><p className="text-[10px] font-extrabold uppercase text-slate-400">Status</p><p className="mt-1 font-bold capitalize text-slate-800">{viewingTraining.status}</p></div>
            <div className="rounded-lg bg-slate-50 p-3"><p className="text-[10px] font-extrabold uppercase text-slate-400">Assigned members</p><p className="mt-1 font-bold text-slate-800">{viewingTraining.metadata?.assignedMemberIds?.length || 0}</p></div>
          </div>
          <div><p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Description</p><p className="mt-2 text-slate-600">{viewingTraining.metadata?.description || 'No description available.'}</p></div>
          <div className="border-t border-slate-100 pt-4"><p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Assignments and member status</p>{viewingTraining.metadata?.assignments?.length ? <div className="mt-3 space-y-3">{viewingTraining.metadata.assignments.map((assignment, index) => { const members = (viewingTraining.assignmentProgress || []).filter((item) => item.assignmentIndex === index); return <div key={`${assignment.link}-${index}`} className="rounded-lg border border-slate-200 p-3"><a href={assignment.link} target="_blank" rel="noreferrer" className="flex items-center justify-between hover:underline"><span><span className="block font-extrabold text-slate-800">{assignment.name || `Assignment ${index + 1}`}</span><span className="mt-1 block text-xs font-semibold text-[#0d4697]">{assignment.link}</span></span><span className="text-xs font-extrabold text-[#0d4697]">View</span></a>{members.length ? <div className="mt-3 space-y-1 border-t border-slate-100 pt-2">{members.map((member) => <div key={member._id} className="flex flex-wrap items-center justify-between gap-2 text-xs"><span className="font-semibold text-slate-600">{member.member?.name || member.member?.email || 'Member'}</span><span className={member.status === 'completed' ? 'font-extrabold text-emerald-700' : 'font-extrabold text-amber-700'}>{member.status === 'completed' ? 'Completed' : 'Pending'}</span><input type="number" min="0" max="999" step="1" value={member.marks || ''} onChange={(event) => setViewingTraining((course) => ({ ...course, assignmentProgress: course.assignmentProgress.map((item) => item._id === member._id ? { ...item, marks: event.target.value.slice(0, 3) } : item) }))} placeholder="0-999" className="h-8 w-24 rounded border border-slate-300 bg-white px-2 text-xs font-bold text-slate-800 outline-none focus:border-[#0d4697]" /><button type="button" onClick={() => saveTrainingMark(member)} className="rounded bg-[#0d4697] px-2 py-1 text-[10px] font-extrabold text-white">Save</button></div>)}</div> : <p className="mt-2 text-xs font-semibold text-slate-400">No completion recorded yet.</p>}</div> })}</div> : <p className="mt-2 text-slate-500">No assignments added.</p>}</div>
        </div>}
      </Modal>
      <Modal open={formOpen && (canCreate || canEdit)} title={editing ? `Edit ${config.title}` : `Add ${config.title}`} onClose={() => { setFormOpen(false); setEditing(null) }}>
        <SimpleJsonForm initialValues={editing ? flattenRecord(editing) : { type: config.types[0], status: 'active' }} fields={enterpriseFields(config, trainingMembers, module)} onSubmit={submit} />
      </Modal>
    </section>
  )
}

function OrganizationTreePanel() {
  const [tree, setTree] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    adminApi.organizationTree().then((response) => setTree(response.data?.data || [])).catch(() => setTree([]))
  }, [])

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="flex items-center gap-2 text-lg font-black text-slate-950 dark:text-white">
          <GitBranch className="h-5 w-5 text-[#0d4697]" />
          Hierarchy Tree
        </h2>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tree nodes..."
            className="h-10 w-full rounded-md border border-slate-250 bg-white pl-9 pr-4 text-sm font-semibold outline-none focus:border-[#0d4697] dark:border-slate-800 dark:bg-slate-900"
          />
        </div>
      </div>
      <div className="mt-4 space-y-2 overflow-x-auto">
        {tree.length ? (
          tree.map((node) => (
            <TreeNode key={node._id} node={node} searchQuery={searchQuery} />
          ))
        ) : (
          <p className="text-sm font-semibold text-slate-500">Create organization records to build the hierarchy tree.</p>
        )}
      </div>
    </section>
  )
}

function TreeNode({ node, depth = 0, searchQuery = '' }) {
  const hasChildren = Boolean(node.children && node.children.length)
  
  const isSelfMatched = searchQuery ? node.name.toLowerCase().includes(searchQuery.toLowerCase()) : false
  
  const anyChildMatches = (n) => {
    if (!searchQuery) return false
    if (n.name.toLowerCase().includes(searchQuery.toLowerCase())) return true
    return (n.children || []).some(anyChildMatches)
  }
  const isChildMatched = anyChildMatches(node)
  
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    if (searchQuery && (isSelfMatched || isChildMatched)) {
      setExpanded(true)
    }
  }, [searchQuery, isSelfMatched, isChildMatched])

  if (searchQuery && !isSelfMatched && !isChildMatched) {
    return null
  }

  return (
    <div style={{ marginLeft: depth > 0 ? 20 : 0 }} className="relative">
      {depth > 0 && (
        <span className="absolute -left-3.5 top-5 h-full w-px bg-slate-200 dark:bg-slate-800" />
      )}
      <div className="flex items-center gap-2 py-1">
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="grid h-6 w-6 place-items-center rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label={expanded ? 'Collapse node' : 'Expand node'}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-500" />
            )}
          </button>
        ) : (
          <span className="w-6 h-6 shrink-0" />
        )}
        <div className={`flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold shadow-sm transition ${isSelfMatched ? 'border-amber-400 bg-amber-50 text-amber-900 dark:border-amber-600 dark:bg-amber-955 dark:text-amber-100' : 'border-slate-100 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'}`}>
          <span>{node.name}</span>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            ({formatLabel(node.type)})
          </span>
        </div>
      </div>
      {hasChildren && expanded && (
        <div className="mt-1 space-y-1">
          {node.children.map((child) => (
            <TreeNode key={child._id} node={child} depth={depth + 1} searchQuery={searchQuery} />
          ))}
        </div>
      )}
    </div>
  )
}

function WorkflowBuilder() {
  const { user } = useAuth()
  const [workflows, setWorkflows] = useState({})
  const workflow = workflows.membership || []

  useEffect(() => {
    if (user?.role !== ROLES.SUPERADMIN) return
    adminApi.superConfigSection('workflows').then((response) => setWorkflows(response.data?.data || {}))
  }, [user?.role])

  if (user?.role !== ROLES.SUPERADMIN) {
    return (
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-xl font-black text-amber-950">Workflow Engine is Super Admin only</h2>
        <p className="mt-2 text-sm font-semibold text-amber-800">This global workflow configuration can only be managed by a Super Admin.</p>
      </section>
    )
  }

  const save = async (nextSteps) => {
    const next = { ...workflows, membership: nextSteps }
    setWorkflows(next)
    await adminApi.saveSuperConfigSection('workflows', next)
    toast.success('Workflow engine saved')
  }

  const addStep = async () => {
    const label = window.prompt('Workflow step name')
    if (!label) return
    await save([...workflow, {
      id: label.toLowerCase().replace(/\s+/g, '_'),
      label,
      order: workflow.length + 1,
      requiredRole: ROLES.ADMIN,
      conditional: false,
      autoSkip: false,
      autoAssignment: true,
      escalationHours: 24,
      notifications: ['in_app'],
      conditions: [],
    }])
  }

  const updateStep = async (stepId, patch) => {
    await save(workflow.map((step) => step.id === stepId ? { ...step, ...patch } : step))
  }

  const moveStep = async (stepId, direction) => {
    const steps = [...workflow].sort((a, b) => a.order - b.order)
    const index = steps.findIndex((step) => step.id === stepId)
    const swapIndex = index + direction
    if (index < 0 || swapIndex < 0 || swapIndex >= steps.length) return
    const [removed] = steps.splice(index, 1)
    steps.splice(swapIndex, 0, removed)
    await save(steps.map((step, order) => ({ ...step, order: order + 1 })))
  }

  const removeStep = async (stepId) => {
    await save(workflow.filter((step) => step.id !== stepId).map((step, order) => ({ ...step, order: order + 1 })))
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-black text-slate-950">Membership Workflow Engine</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">Add, delete, reorder, condition, auto-skip, auto-assign, escalate, and notify at every step.</p>
        </div>
        <button type="button" onClick={addStep} className="rounded-md bg-[#0d4697] px-4 py-2 text-sm font-extrabold text-white">Add Step</button>
      </div>
      <div className="mt-5 space-y-3">
        {[...workflow].sort((a, b) => a.order - b.order).map((step, index) => (
          <div key={step.id} className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#0d4697] text-sm font-black text-white">{index + 1}</span>
            <div>
              <p className="font-extrabold text-slate-900">{step.label}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold text-slate-600">
                <label><input type="checkbox" checked={Boolean(step.conditional)} onChange={() => updateStep(step.id, { conditional: !step.conditional })} className="mr-1 accent-[#0d4697]" />Conditional</label>
                <label><input type="checkbox" checked={Boolean(step.autoSkip)} onChange={() => updateStep(step.id, { autoSkip: !step.autoSkip })} className="mr-1 accent-[#0d4697]" />Auto Skip</label>
                <label><input type="checkbox" checked={Boolean(step.autoAssignment)} onChange={() => updateStep(step.id, { autoAssignment: !step.autoAssignment })} className="mr-1 accent-[#0d4697]" />Auto Assignment</label>
                <span>Escalation: {step.escalationHours || 24}h</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => moveStep(step.id, -1)} className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold">Up</button>
              <button type="button" onClick={() => moveStep(step.id, 1)} className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold">Down</button>
              <button type="button" onClick={() => removeStep(step.id)} className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-extrabold text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function PipelinePage({ module, stages }) {
  const { hasOperation, hasSection, hasWorkflow } = useAuth()
  const config = moduleConfig[module]
  const [columns, setColumns] = useState({})
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!hasOperation(module, 'view')) {
      setColumns({})
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const response = await adminApi.enterpriseKanban(module)
      setColumns(response.data?.data || {})
    } finally {
      setLoading(false)
    }
  }, [hasOperation, module])

  useEffect(() => {
    if (!hasOperation(module, 'view')) return undefined
    const timer = window.setTimeout(() => load(), 0)
    return () => window.clearTimeout(timer)
  }, [hasOperation, load, module])

  const canView = hasOperation(module, 'view')
  const canTransfer = hasWorkflow(module, 'transfer') || hasWorkflow(module, 'approve')
  const showPipeline = hasSection(module, 'pipeline')

  const transition = async (record, stage) => {
    await adminApi.transitionEnterpriseRecord(record._id, {
      stage,
      status: ['closed', 'lost', 'won', 'converted', 'approved'].includes(stage) ? stage : 'under_review',
      note: `Moved to ${formatLabel(stage)}`,
      createTask: { name: `${record.name} ${formatLabel(stage)}`, priority: 'medium' },
    })
    toast.success('Pipeline updated')
    load()
  }

  return (
    <section className="space-y-6">
      <EnterpriseHeader title={config.title} description={config.description} icon={config.icon} />
      {showPipeline && canView && (loading ? <p className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-bold text-slate-500">Loading pipeline...</p> : (
        <div className="grid gap-4 xl:grid-cols-4">
          {stages.map((stage) => (
            <section key={stage} className="min-h-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-black uppercase text-slate-500">{formatLabel(stage)}</h2>
              <div className="mt-4 space-y-3">
                {(columns[stage] || []).map((record) => (
                  <article key={record._id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <p className="font-extrabold text-slate-950">{record.name}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">{record.assignedTo?.name || record.metadata?.owner || 'Unassigned'}</p>
                    {canTransfer && <select value={stage} onChange={(event) => transition(record, event.target.value)} className="mt-3 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-xs font-bold">
                      {stages.map((item) => <option key={item} value={item}>{formatLabel(item)}</option>)}
                    </select>}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      ))}
      <EnterpriseRecordsPage module={module} />
    </section>
  )
}

function AssignmentWizard({ title, onCreate }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-extrabold text-slate-950">{title}</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">Create assignments, transfer ownership, bulk assign records, and retain history through the timeline.</p>
        </div>
        <button type="button" onClick={onCreate} className="rounded-md bg-[#0d4697] px-4 py-2 text-sm font-extrabold text-white">Start Assignment</button>
      </div>
    </section>
  )
}

function StatsStrip({ stats }) {
  const totals = stats?.totals || {}
  const cards = [
    ['Total', stats?.total || 0],
    ['Members', totals.membersCount || 0],
    ['Meetings', totals.meetingsCount || 0],
    ['Visitors', totals.visitorsCount || 0],
    ['Business', formatCurrency(totals.businessValue || 0)],
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map(([label, value]) => (
        <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-extrabold uppercase text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
        </article>
      ))}
    </div>
  )
}

function EnterpriseHeader({ title, description, icon: Icon = Building2 }) {
  return (
    <header className="rounded-2xl border border-white/60 bg-white/85 p-6 shadow-sm backdrop-blur">
      <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#0d4697]">
        <Icon className="h-4 w-4" />
        Enterprise Management
      </p>
      <h1 className="mt-3 text-3xl font-black text-slate-950">{title}</h1>
      <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-slate-500">{description}</p>
    </header>
  )
}

function enterpriseColumns() {
  return [
    { key: 'name', header: 'Name' },
    { key: 'code', header: 'Code', render: (row) => row.code || '-' },
    { key: 'type', header: 'Type', render: (row) => formatLabel(row.type) },
    { key: 'director', header: 'Director', render: (row) => row.director?.name || row.assignedTo?.name || '-' },
    { key: 'membersCount', header: 'Members' },
    { key: 'meetingsCount', header: 'Meetings' },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
    { key: 'createdAt', header: 'Created', render: (row) => formatDate(row.createdAt) },
  ]
}

function enterpriseFields(config, trainingMembers = [], module = '') {
  const activeStatusOptions = module === 'training' ? ['draft', 'active', 'inactive', 'completed'] : statusOptions

  const base = [
    { name: 'name', label: config.title === 'Training Management' ? 'Course Name' : 'Name', rules: { required: true } },
    ...(config.title === 'Training Management' ? [] : [{ name: 'code', label: 'Code' }]),
    { name: 'type', label: 'Type', type: 'select', options: config.types.map((value) => ({ value, label: formatLabel(value) })) },
    { name: 'status', label: 'Status', type: 'select', options: activeStatusOptions.map((value) => ({ value, label: formatLabel(value) })) },
  ]
  const extras = config.fields
    .filter((field) => !['code', 'type'].includes(field))
    .map((field) => ({ name: field, label: formatLabel(field), type: numericFields.has(field) ? 'number' : 'text' }))
  if (config.title === 'Training Management') {
    extras.unshift({ name: 'metadata.description', label: 'Course Description', type: 'textarea', rules: { required: true } })
    extras.push({ name: 'metadata.startDate', label: 'Start Date', type: 'date' })
    extras.push({ name: 'metadata.dailyTiming', label: 'Daily Timing', type: 'time' })
    extras.push({ name: 'metadata.dailyTaskUpdate', label: 'Daily Task Update', type: 'textarea' })
    extras.push({ name: 'assignments', label: 'Assignments', type: 'assignment-list' })
    extras.push({ name: 'assignedMemberId', label: 'Assign Members', type: 'multiselect', options: trainingMembers.map((member) => ({ value: member._id, label: `${member.name} · ${member.email || 'No email'} · ${formatLabel(member.role || 'member')}` })) })
  }
  return [...base, ...extras]
}

const numericFields = new Set(['membersCount', 'meetingsCount', 'attendanceCount', 'visitorsCount', 'businessValue', 'referralValue'])

function normalizeFormValues(values) {
  const normalized = {}
  Object.entries(values).forEach(([key, value]) => {
    if (value === '' || value === undefined) return
    if (key.startsWith('metadata.')) {
      normalized.metadata = normalized.metadata || {}
      normalized.metadata[key.replace('metadata.', '')] = value
    } else if (numericFields.has(key)) {
      normalized[key] = Number(value || 0)
    } else {
      normalized[key] = value
    }
  })
  return normalized
}

function flattenRecord(record) {
  const flattened = { ...record, metadata: record.metadata || {} }
  ;['parent', 'director', 'assignedTo', 'reportsTo', 'chapter', 'organization'].forEach((key) => {
    if (record[key]?._id) flattened[key] = record[key]._id
  })
  if (record.metadata?.assignedMemberIds) flattened.assignedMemberId = record.metadata.assignedMemberIds
  if (record.metadata?.description) flattened['metadata.description'] = record.metadata.description
  if (record.metadata?.startDate) flattened['metadata.startDate'] = record.metadata.startDate
  if (record.metadata?.dailyTiming) flattened['metadata.dailyTiming'] = record.metadata.dailyTiming
  if (record.metadata?.dailyTaskUpdate) flattened['metadata.dailyTaskUpdate'] = record.metadata.dailyTaskUpdate
  if (record.metadata?.assignmentLink) flattened['metadata.assignmentLink'] = record.metadata.assignmentLink
  if (record.metadata?.assignments) flattened.assignments = record.metadata.assignments
  return flattened
}

function formatLabel(value = '') {
  return String(value).replace(/\./g, ' ').replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}
