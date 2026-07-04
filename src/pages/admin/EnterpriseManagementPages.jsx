import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Activity,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  Download,
  GitBranch,
  Kanban,
  Network,
  Plus,
  Search,
  Sparkles,
  Upload,
  Users,
  Workflow,
} from 'lucide-react'
import { adminApi } from '../../api/admin'
import Modal from '../../components/common/Modal'
import SearchBar from '../../components/common/SearchBar'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/tables/DataTable'
import { useAuth } from '../../hooks/useAuth'
import SimpleJsonForm from '../shared/SimpleJsonForm'
import { formatCurrency, formatDate, getList, getPagination } from '../../utils/format'

const statusOptions = ['draft', 'pending', 'under_review', 'active', 'inactive', 'approved', 'rejected', 'cancelled', 'archived', 'won', 'lost', 'closed', 'converted', 'completed']

const moduleConfig = {
  organization: {
    title: 'Organization Management',
    description: 'Manage India, regions, states, areas, districts, chapters, and director assignments.',
    icon: GitBranch,
    types: ['country', 'region', 'state', 'area', 'district', 'chapter'],
    fields: ['code', 'type', 'director', 'parent', 'membersCount', 'meetingsCount'],
  },
  assignment: {
    title: 'Hierarchy Assignment',
    description: 'Assign and transfer state directors, area directors, executive directors, launch directors, direct consultants, and chapters.',
    icon: Network,
    types: ['state_director', 'area_director', 'executive_director', 'launch_director', 'direct_consultant', 'chapter_assignment'],
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
    description: 'Manage national, state, area, executive, chapter, vendor, training, online, and offline meetings.',
    icon: CalendarDays,
    types: ['national', 'state', 'area', 'executive', 'chapter', 'vendor', 'training', 'online', 'offline'],
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
    description: 'Create reusable reports with date, chapter, role, area, and region filters plus export controls.',
    icon: BarChart3,
    types: ['membership', 'attendance', 'meeting', 'vendor', 'business', 'marketplace'],
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
    fields: ['code', 'type', 'chapter', 'attendanceCount', 'visitorsCount', 'metadata.category'],
  },
  testimonial: {
    title: 'Testimonials',
    description: 'Manage testimonials, approvals, featured stories, public highlights, photos, and status.',
    icon: Activity,
    types: ['member', 'vendor', 'chapter', 'event', 'training'],
    fields: ['code', 'type', 'chapter', 'assignedTo', 'metadata.category'],
  },
  workflow: {
    title: 'Workflow Engine',
    description: 'Configure versioned workflows with steps, assigned roles, notifications, conditions, auto skip, escalation, and history.',
    icon: Workflow,
    types: ['membership', 'vendor', 'marketplace', 'business', 'visitor', 'meeting'],
    fields: ['code', 'type', 'assignedTo', 'metadata.version', 'metadata.currentStage', 'metadata.condition', 'metadata.escalationHours'],
  },
  referral_pipeline: {
    title: 'Referral Pipeline',
    description: 'CRM style pipeline from new referral to contacted, meeting, application, member joined, closed, or lost.',
    icon: Kanban,
    types: ['new', 'contacted', 'meeting_scheduled', 'meeting_completed', 'interested', 'application_created', 'member_joined', 'closed', 'lost'],
    fields: ['code', 'type', 'assignedTo', 'chapter', 'metadata.company', 'metadata.contact', 'referralValue'],
  },
  visitor_conversion: {
    title: 'Visitor Conversion Engine',
    description: 'Track visitor lifecycle from visitor to meeting, follow-up, interested, membership, member, and optional vendor.',
    icon: Users,
    types: ['visitor', 'meeting', 'follow_up', 'interested', 'membership', 'member', 'vendor'],
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
    types: ['application', 'document_verification', 'executive_director', 'marketplace_admin', 'approved', 'rejected'],
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
    types: ['referral', 'meeting', 'visitor', 'application', 'approval', 'member', 'vendor', 'business', 'award'],
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
  return <EnterpriseRecordsPage module="chapter" />
}

export function EnterpriseReportBuilderPage() {
  return <EnterpriseRecordsPage module="report" />
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
  return <EnterpriseRecordsPage module="testimonial" />
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
  return <PipelinePage module="marketplace_approval" stages={moduleConfig.marketplace_approval.types} />
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
  return <EnterpriseRecordsPage module="executive_dashboard" config={{ title: 'Executive Dashboard', description: 'Director KPIs, meetings conducted, attendance, visitors, members joined, business generated, referrals, vendor approvals, score, and ranking.', icon: BarChart3, types: ['director', 'executive_director', 'area_director', 'state_director'], fields: ['code', 'type', 'assignedTo', 'meetingsCount', 'attendanceCount', 'visitorsCount', 'membersCount', 'businessValue', 'referralValue'] }} />
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
  const [payload, setPayload] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)

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
  const canExport = hasOperation(module, 'export')
  const showStats = hasSection(module, 'stats')
  const showList = hasSection(module, 'list')
  const showFilters = hasSection(module, 'filters')
  const showWizard = wizardTitle && hasSection(module, 'wizard')
  const showExtraPanel = extraPanel && hasSection(module, 'overview')

  const submit = async (values) => {
    const data = normalizeFormValues(values)
    if (editing) await adminApi.updateEnterpriseRecord(editing._id, data)
    else await adminApi.createEnterpriseRecord(module, data)
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

  const importSample = async () => {
    const name = window.prompt('Record name to import')
    if (!name) return
    await adminApi.importEnterpriseRecords(module, [{ name, type: config.types[0], status: 'active' }])
    toast.success('Import completed')
    load()
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
              {statusOptions.map((item) => <option key={item} value={item}>{formatLabel(item)}</option>)}
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            {canCreate && <button type="button" onClick={importSample} className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-xs font-extrabold text-slate-700"><Upload className="h-4 w-4" />Import Excel</button>}
            {canExport && <button type="button" onClick={() => toast.success('Export prepared')} className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-xs font-extrabold text-slate-700"><Download className="h-4 w-4" />Export Excel</button>}
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
            {canEdit && <button type="button" onClick={() => { setEditing(row); setFormOpen(true) }} className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-bold">Edit</button>}
            {canApprove && <select value={row.status} onChange={(event) => changeStatus(row, event.target.value)} className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs font-bold">
              {statusOptions.map((item) => <option key={item} value={item}>{formatLabel(item)}</option>)}
            </select>}
            {canDelete && <button type="button" onClick={() => remove(row)} className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600">Delete</button>}
          </div>
        ) : undefined}
      />}
      <Modal open={formOpen && (canCreate || canEdit)} title={editing ? `Edit ${config.title}` : `Add ${config.title}`} onClose={() => setFormOpen(false)}>
        <SimpleJsonForm initialValues={editing ? flattenRecord(editing) : { type: config.types[0], status: 'active' }} fields={enterpriseFields(config)} onSubmit={submit} />
      </Modal>
    </section>
  )
}

function OrganizationTreePanel() {
  const [tree, setTree] = useState([])

  useEffect(() => {
    adminApi.organizationTree().then((response) => setTree(response.data?.data || [])).catch(() => setTree([]))
  }, [])

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-950"><GitBranch className="h-5 w-5 text-[#0d4697]" />Hierarchy Tree</h2>
      <div className="mt-4 space-y-2">
        {tree.length ? tree.map((node) => <TreeNode key={node._id} node={node} />) : <p className="text-sm font-semibold text-slate-500">Create organization records to build the hierarchy tree.</p>}
      </div>
    </section>
  )
}

function TreeNode({ node, depth = 0 }) {
  return (
    <div style={{ marginLeft: depth * 18 }}>
      <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700">
        {node.name} <span className="text-xs text-slate-400">({formatLabel(node.type)})</span>
      </div>
      <div className="mt-2 space-y-2">
        {(node.children || []).map((child) => <TreeNode key={child._id} node={child} depth={depth + 1} />)}
      </div>
    </div>
  )
}

function WorkflowBuilder() {
  const { user } = useAuth()
  const [workflows, setWorkflows] = useState({})
  const workflow = workflows.membership || []

  useEffect(() => {
    if (user?.role !== 'superadmin') return
    adminApi.superConfigSection('workflows').then((response) => setWorkflows(response.data?.data || {}))
  }, [user?.role])

  if (user?.role !== 'superadmin') {
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
      requiredRole: 'admin',
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

function enterpriseFields(config) {
  const base = [
    { name: 'name', label: 'Name', rules: { required: true } },
    { name: 'code', label: 'Code' },
    { name: 'type', label: 'Type', type: 'select', options: config.types.map((value) => ({ value, label: formatLabel(value) })) },
    { name: 'status', label: 'Status', type: 'select', options: statusOptions.map((value) => ({ value, label: formatLabel(value) })) },
  ]
  const extras = config.fields
    .filter((field) => !['code', 'type'].includes(field))
    .map((field) => ({ name: field, label: formatLabel(field), type: numericFields.has(field) ? 'number' : 'text' }))
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
  return flattened
}

function formatLabel(value = '') {
  return String(value).replace(/\./g, ' ').replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}
