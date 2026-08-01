import { useMemo, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import {
  Activity,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Download,
  FileBarChart,
  Filter,
  GraduationCap,
  KeyRound,
  LayoutGrid,
  MapPinned,
  Plus,
  Printer,
  Search,
  Settings,
  ShieldCheck,
  Store,
  ToggleLeft,
  Users,
  Workflow,
} from 'lucide-react'
import { adminApi } from '../../api/admin'
import { notificationApi } from '../../api/notification'
import { reportApi } from '../../api/report'
import ChartCard from '../../components/charts/ChartCard'
import LoadingScreen from '../../components/common/LoadingScreen'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/tables/DataTable'
import { useAuth } from '../../hooks/useAuth'
import { useApi } from '../../hooks/useApi'
import { formatCurrency, formatDate } from '../../utils/format'
import ResourceListPage from '../shared/ResourceListPage'
import { ROLES } from '../../constants/roleConfig.js'

const modules = ['dashboard', 'members', 'meetings', 'visitors', 'reports', 'marketplace', 'vendors', 'training', 'events']
const roles = [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.FRANCHISE_ADMIN, ROLES.STATE_DIRECTOR, ROLES.EXECUTIVE_DIRECTOR, ROLES.DIRECT_CONSULTANT]
const permissions = ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Export', 'Print', 'Reports', 'Dashboard', 'Settings', 'Notifications']

function SuperAdminOnlyNotice({ title = 'Super Admin access required' }) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <h1 className="text-xl font-black text-amber-950">{title}</h1>
      <p className="mt-2 text-sm font-semibold text-amber-800">This configuration is global and can only be managed by a Super Admin.</p>
    </section>
  )
}

const moduleCards = [
  ['Organization', 'Regions, states, districts, chapters, and director assignment.', MapPinned],
  ['Users', 'Create admins, reset passwords, block users, and review activity.', Users],
  ['Roles & Permissions', 'Configure role access, clone permissions, and manage feature visibility.', ShieldCheck],
  ['Membership', 'Membership categories, workflow settings, approvals, and categories.', ClipboardList],
  ['Meetings', 'Meeting types, attendance rules, QR attendance, and templates.', CalendarDays],
  ['Marketplace', 'Products, services, vendor stores, enquiries, and category settings.', Store],
  ['Training', 'Training programs, sessions, reminders, and attendance.', GraduationCap],
  ['Reports', 'Membership, attendance, visitors, referrals, vendor, and marketplace reports.', FileBarChart],
]

export function SuperAdminDashboardPage() {
  const { hasSection, hasWidget } = useAuth()
  const dashboard = useApi(adminApi.dashboard)
  const analytics = useApi(() => reportApi.analytics({ from: '2025-01-01' }))
  const stats = dashboard.data || {}
  const report = analytics.data || {}

  const topCards = [
    ['members', 'Total Members', stats.totalUsers, `${stats.newUsersToday || 0} today`, Users],
    ['members', 'Active Members', stats.activeUsers || stats.totalUsers, 'Verified network', CheckCircle2],
    ['approvals', 'Pending Membership', stats.pendingMembershipApplications || 0, 'Needs review', ClipboardList],
    ['members', 'Total Chapters', stats.totalChapters || 0, 'Organization', MapPinned],
    ['vendors', 'Total Vendors', stats.totalVendors, `${stats.pendingVendors || 0} pending`, Building2],
    ['marketplace', 'Marketplace Listings', Number(stats.productsCount || 0) + Number(stats.servicesCount || 0), 'Products + services', Store],
    ['referrals', 'Referrals', stats.referralsCount || 0, 'Network growth', Workflow],
    ['business', 'Business Generated', formatCurrency(stats.revenue), 'Platform revenue', FileBarChart],
    ['events', 'Upcoming Events', stats.upcomingEvents || stats.eventsCount || 0, 'Calendar', CalendarDays],
    ['attendance', 'Attendance %', stats.attendancePercent || '0%', 'Attendance', Activity],
  ].filter(([widget]) => hasWidget(widget))

  return (
    <section className="space-y-6">
      <EnterpriseHeader
        eyebrow="Super Admin Command Center"
        title="Gloaro Network Enterprise Dashboard"
        description="Control organization hierarchy, users, memberships, vendors, marketplace, reports, permissions, and system configuration from one console."
      />

      {hasSection('dashboard', 'overview') && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {topCards.map(([, label, value, helper, Icon]) => <GlassStat key={label} label={label} value={value} helper={helper} icon={Icon} />)}
      </div>}

      {hasSection('dashboard', 'analytics') && <section className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Membership Growth" data={(report.monthlyUsers || []).map((item) => ({ label: monthLabel(item), members: item.users }))} dataKey="members" />
        <ChartCard title="Vendor Growth" type="bar" data={(report.monthlyVendors || []).map((item) => ({ label: monthLabel(item), vendors: item.vendors }))} dataKey="vendors" />
        <ChartCard title="Business Growth" data={(report.monthlyRevenue || []).map((item) => ({ label: monthLabel(item), revenue: item.revenue }))} dataKey="revenue" />
        <ChartCard title="Membership Sales" type="bar" data={(report.membershipSales || []).map((item) => ({ label: item._id, sales: item.sales }))} dataKey="sales" />
      </section>}

      {hasSection('dashboard', 'payments') && <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <DataTable
          columns={[
            { key: ROLES.USER, header: 'User', render: (row) => row.user?.name || row.user?.email || 'User' },
            { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount, row.currency) },
            { key: 'gateway', header: 'Gateway' },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          ]}
          rows={stats.recentPayments || []}
        />
        <ActivityTimeline />
      </section>}
    </section>
  )
}

export function SuperAdminModulePage({ title, description, icon: Icon = LayoutGrid, sections = moduleCards }) {
  return (
    <section className="space-y-6">
      <EnterpriseHeader eyebrow="Super Admin Module" title={title} description={description} icon={Icon} />
      <Toolbar />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {sections.map(([label, body, CardIcon]) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-[#0d4697]">
              <CardIcon className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-base font-extrabold text-slate-950">{label}</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{body}</p>
            <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-extrabold text-slate-700">
              Configure
            </button>
          </article>
        ))}
      </div>
      <ConfigTable title={`${title} Controls`} rows={sections.map(([label]) => ({ role: 'Super Admin', module: label, status: true }))} />
    </section>
  )
}

export function FeatureManagementPage() {
  const { user } = useAuth()
  const isSuperAdmin = user?.role === ROLES.SUPERADMIN
  const config = useApi(adminApi.superConfig, [isSuperAdmin], { immediate: isSuperAdmin })
  const roleList = config.data?.roles || roles
  const moduleList = config.data?.modules || modules
  const matrix = useMemo(() => config.data?.featureMatrix || {}, [config.data?.featureMatrix])

  const rows = useMemo(() => roleList.flatMap((role) => moduleList.map((module) => ({
    id: `${role}-${module}`,
    role,
    module,
    ...(matrix[role]?.[module] || {}),
  }))), [matrix, moduleList, roleList])

  const toggle = async (row, key) => {
    const nextValue = !row[key]
    const update = { [key]: nextValue }

    if (key === 'enabled' && !nextValue) {
      Object.assign(update, {
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canApprove: false,
        canExport: false,
        showSidebar: false,
        showDashboardCard: false,
        enableNotifications: false,
        apiAccess: false,
      })
    }

    config.setData((current) => ({
      ...current,
      featureMatrix: {
        ...(current?.featureMatrix || {}),
        [row.role]: {
          ...(current?.featureMatrix?.[row.role] || {}),
          [row.module]: { ...(current?.featureMatrix?.[row.role]?.[row.module] || {}), ...update },
        },
      },
    }))

    try {
      await adminApi.updateFeaturePermission(row.role, row.module, update)
      toast.success('Permission updated')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save permission')
      config.execute()
    }
  }

  if (!isSuperAdmin) return <SuperAdminOnlyNotice title="Feature Management is Super Admin only" />
  if (config.loading) return <LoadingScreen label="Loading feature matrix..." />

  return (
    <section className="space-y-6">
      <EnterpriseHeader
        eyebrow="Feature Toggle System"
        title="Feature Management"
        description="Enable or disable dashboard pages, sidebar visibility, notifications, and permission actions per admin role."
        icon={ToggleLeft}
      />
      <Toolbar />
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {['Role', 'Module', 'View', 'Create', 'Edit', 'Delete', 'Approve', 'Export', 'Dashboard Card', 'Sidebar', 'Notifications', 'API', 'Status'].map((heading) => <th key={heading} className="px-4 py-3 font-extrabold">{heading}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-extrabold text-slate-800">{formatLabel(row.role)}</td>
                  <td className="px-4 py-3 font-bold text-slate-600">{formatLabel(row.module)}</td>
                  {['canView', 'canCreate', 'canEdit', 'canDelete', 'canApprove', 'canExport', 'showDashboardCard', 'showSidebar', 'enableNotifications', 'apiAccess', 'enabled'].map((key) => (
                    <td key={key} className="px-4 py-3">
                      <Toggle checked={Boolean(row[key])} onChange={() => toggle(row, key)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}


export function DashboardConfigurationPage() {
  const { user } = useAuth()
  const isSuperAdmin = user?.role === ROLES.SUPERADMIN
  const config = useApi(() => adminApi.superConfigSection('dashboardWidgets'), [isSuperAdmin], { immediate: isSuperAdmin })
  const widgetsByRole = config.data || {}

  const saveWidgets = async (next) => {
    config.setData(next)
    await adminApi.saveSuperConfigSection('dashboardWidgets', next)
    toast.success('Dashboard configuration saved')
  }

  const updateWidget = async (role, widgetId, patch) => {
    const next = {
      ...widgetsByRole,
      [role]: (widgetsByRole[role] || []).map((widget) => widget.id === widgetId ? { ...widget, ...patch } : widget),
    }
    await saveWidgets(next)
  }

  const moveWidget = async (role, widgetId, direction) => {
    const widgets = [...(widgetsByRole[role] || [])].sort((a, b) => a.order - b.order)
    const index = widgets.findIndex((widget) => widget.id === widgetId)
    const swapIndex = index + direction
    if (index < 0 || swapIndex < 0 || swapIndex >= widgets.length) return
    const [removed] = widgets.splice(index, 1)
    widgets.splice(swapIndex, 0, removed)
    const reordered = widgets.map((widget, orderIndex) => ({ ...widget, order: orderIndex + 1 }))
    await saveWidgets({ ...widgetsByRole, [role]: reordered })
  }

  if (!isSuperAdmin) return <SuperAdminOnlyNotice title="Dashboard Builder is Super Admin only" />
  if (config.loading) return <LoadingScreen label="Loading dashboard builder..." />

  return (
    <section className="space-y-6">
      <EnterpriseHeader eyebrow="Dashboard Builder" title="Admin Dashboard Configuration" description="Decide which pages, cards, reports, and modules appear inside every dashboard." icon={LayoutGrid} />
      <div className="grid gap-5 xl:grid-cols-2">
        {Object.keys(widgetsByRole).map((role) => (
          <section key={role} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-950">{formatLabel(role)} Dashboard</h2>
            <div className="mt-4 space-y-3">
              {[...(widgetsByRole[role] || [])].sort((a, b) => a.order - b.order).map((widget) => (
                <div key={widget.id} className="grid gap-3 rounded-xl bg-slate-50 px-4 py-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center">
                  <span className="text-sm font-extrabold text-slate-700">{widget.title}</span>
                  <select value={widget.size} onChange={(event) => updateWidget(role, widget.id, { size: event.target.value })} className="h-9 rounded-md border border-slate-200 bg-white px-2 text-xs font-extrabold">
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => moveWidget(role, widget.id, -1)} className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-extrabold">Up</button>
                    <button type="button" onClick={() => moveWidget(role, widget.id, 1)} className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-extrabold">Down</button>
                  </div>
                  <Toggle checked={widget.enabled} onChange={() => updateWidget(role, widget.id, { enabled: !widget.enabled })} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}


export function MembershipWorkflowPage() {
  const { user } = useAuth()
  const isSuperAdmin = user?.role === ROLES.SUPERADMIN
  const config = useApi(() => adminApi.superConfigSection('workflows'), [isSuperAdmin], { immediate: isSuperAdmin })
  const workflows = config.data || {}
  const steps = [...(workflows.membership || [])].sort((a, b) => a.order - b.order)

  const saveWorkflows = async (next) => {
    config.setData(next)
    await adminApi.saveSuperConfigSection('workflows', next)
    toast.success('Workflow saved')
  }

  const addStep = async () => {
    const label = window.prompt('Step name')
    if (!label) return
    const nextSteps = [...steps, { id: label.toLowerCase().replace(/\s+/g, '_'), label, order: steps.length + 1, requiredRole: ROLES.ADMIN }]
    await saveWorkflows({ ...workflows, membership: nextSteps })
  }

  const removeStep = async (stepId) => {
    const nextSteps = steps.filter((step) => step.id !== stepId).map((step, index) => ({ ...step, order: index + 1 }))
    await saveWorkflows({ ...workflows, membership: nextSteps })
  }

  const moveStep = async (stepId, direction) => {
    const index = steps.findIndex((step) => step.id === stepId)
    const swapIndex = index + direction
    if (index < 0 || swapIndex < 0 || swapIndex >= steps.length) return
    const nextSteps = [...steps]
    const [removed] = nextSteps.splice(index, 1)
    nextSteps.splice(swapIndex, 0, removed)
    await saveWorkflows({ ...workflows, membership: nextSteps.map((step, orderIndex) => ({ ...step, order: orderIndex + 1 })) })
  }

  if (!isSuperAdmin) return <SuperAdminOnlyNotice title="Workflow Settings are Super Admin only" />
  if (config.loading) return <LoadingScreen label="Loading workflow builder..." />

  return (
    <section className="space-y-6">
      <EnterpriseHeader eyebrow="Membership Workflow" title="Membership Workflow Settings" description="Configure who can create memberships and define the approval flow." icon={Workflow} />
      <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-950">Who can create membership?</h2>
          <div className="mt-4 space-y-3">
            {['Executive Director', 'Launch Director', 'Direct Consultant', 'President', 'Secretary'].map((role, index) => (
              <label key={role} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-extrabold text-slate-700">
                {role}
                <input type="checkbox" defaultChecked={index < 3} className="h-4 w-4 accent-[#0d4697]" />
              </label>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-slate-950">Approval Flow</h2>
            <button type="button" onClick={addStep} className="rounded-md bg-[#0d4697] px-3 py-2 text-xs font-extrabold text-white">Add Step</button>
          </div>
          <div className="mt-4 space-y-3">
            {steps.map((step, index) => (
              <div key={step.id} className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#0d4697] text-xs font-black text-white">{index + 1}</span>
                <span>
                  <span className="block font-extrabold text-slate-800">{step.label}</span>
                  <span className="text-xs font-bold text-slate-500">{formatLabel(step.requiredRole)}</span>
                </span>
                <span className="flex flex-wrap gap-1">
                  <button type="button" onClick={() => moveStep(step.id, -1)} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-extrabold">Up</button>
                  <button type="button" onClick={() => moveStep(step.id, 1)} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-extrabold">Down</button>
                  <button type="button" onClick={() => removeStep(step.id)} className="rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-extrabold text-red-600">Remove</button>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  )
}

export function AuditLogsPage() {
  const { user } = useAuth()
  const isAuthorized = [ROLES.SUPERADMIN, ROLES.ADMIN].includes(user?.role)

  if (!isAuthorized) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-xl font-black text-red-950">Unauthorized Access</h2>
        <p className="mt-2 text-sm font-semibold text-red-800">You do not have permission to view the audit logs.</p>
      </div>
    )
  }

  const logFilters = [
    {
      key: 'action',
      label: 'Action Type',
      options: [
        { value: 'create_user', label: 'Created User' },
        { value: 'update_user', label: 'Updated User' },
        { value: 'membership_approved', label: 'Membership Approved' },
        { value: 'membership_rejected', label: 'Membership Rejected' },
        { value: 'login', label: 'Login' },
        { value: 'password_changed', label: 'Password Changed' }
      ]
    }
  ]

  return (
    <ResourceListPage
      title="Audit Logs"
      description="Every important action stored with user, action, module, date, IP address, and browser."
      fetcher={adminApi.auditLogs}
      filters={logFilters}
      columns={[
        { key: ROLES.USER, header: 'User', render: (row) => row.user?.name || row.user?.email || '-' },
        { key: 'action', header: 'Action', render: (row) => row.action?.replaceAll('_', ' ').toUpperCase() },
        { key: 'createdAt', header: 'Date', render: (row) => formatDate(row.createdAt) },
      ]}
    />
  )
}

export function SystemLogsPage() {
  return (
    <ResourceListPage
      title="System Logs"
      description="API logs, login logs, error logs, permission errors, and activity logs."
      fetcher={adminApi.systemLogs}
      filters={[{ key: 'type', label: 'Type', options: [{ value: 'errors', label: 'Errors only' }] }]}
      columns={[
        { key: 'action', header: 'Action' },
        { key: 'resource', header: 'Module' },
        { key: 'isSuccess', header: 'Result', render: (row) => <StatusBadge value={row.isSuccess ? 'success' : 'failed'} /> },
        { key: 'createdAt', header: 'Date', render: (row) => formatDate(row.createdAt) },
      ]}
    />
  )
}

export function NotificationsConfigPage() {
  return (
    <ResourceListPage
      title="Notification Center"
      description="Meeting reminders, visitor follow-up, membership approval, vendor approval, training reminders, referrals, and business assignments."
      fetcher={notificationApi.list}
      filters={[{ key: 'isRead', label: 'Read Status', options: [{ value: 'false', label: 'Unread' }, { value: 'true', label: 'Read' }] }]}
      columns={[
        { key: 'title', header: 'Title' },
        { key: 'message', header: 'Message' },
        { key: 'type', header: 'Type' },
        { key: 'isRead', header: 'Read', render: (row) => <StatusBadge value={row.isRead ? 'read' : 'unread'} /> },
        { key: 'createdAt', header: 'Date', render: (row) => formatDate(row.createdAt) },
      ]}
      renderActions={(row, { reload }) => (
        <>
          {!row.isRead && <button type="button" onClick={async () => { await notificationApi.markRead(row._id); toast.success('Marked read'); reload() }} className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-bold">Mark Read</button>}
          <button type="button" onClick={async () => { await notificationApi.remove(row._id); toast.success('Notification deleted'); reload() }} className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600">Delete</button>
        </>
      )}
    />
  )
}

export function ReportsCenterPage() {
  return <SuperAdminModulePage title="Reports Center" description="Export membership, attendance, visitors, meetings, business, referrals, vendor, marketplace, training, events, organization, and performance reports." icon={FileBarChart} sections={[
    ['Membership Reports', 'Membership applications, approvals, renewals, and category performance.', ClipboardList],
    ['Attendance Reports', 'Meeting attendance, late rules, guest attendance, and QR scans.', Activity],
    ['Business Reports', 'Revenue, referrals, business generated, and marketplace growth.', FileBarChart],
    ['Organization Reports', 'Regions, chapters, directors, and hierarchy performance.', MapPinned],
  ]} />
}

function ConfigTable({ title, rows, detailed = false }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-lg font-extrabold text-slate-950">{title}</h2>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-extrabold text-slate-700"><Download className="h-3.5 w-3.5" />Excel</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-extrabold text-slate-700"><Printer className="h-3.5 w-3.5" />Print</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[780px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-extrabold">Role</th>
              <th className="px-4 py-3 font-extrabold">Module</th>
              {detailed && ['Create', 'Edit', 'Delete', 'Approve', 'Export', 'Sidebar', 'Notifications'].map((heading) => <th key={heading} className="px-4 py-3 font-extrabold">{heading}</th>)}
              <th className="px-4 py-3 font-extrabold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr key={`${row.role}-${row.module}-${index}`}>
                <td className="px-4 py-3 font-extrabold text-slate-800">{row.role}</td>
                <td className="px-4 py-3 font-bold text-slate-600">{row.module}</td>
                {detailed && [0, 1, 2, 3, 4, 5, 6].map((item) => <td key={item} className="px-4 py-3"><Toggle checked={(index + item) % 4 !== 0} /></td>)}
                <td className="px-4 py-3"><Toggle checked={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function EnterpriseHeader({ eyebrow, title, description, icon: Icon = ShieldCheck }) {
  return (
    <header className="rounded-2xl border border-white/60 bg-white/85 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#0d4697]">
            <Icon className="h-4 w-4" />
            {eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">{title}</h1>
          <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-slate-500">{description}</p>
        </div>
        <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#0d4697] px-4 text-sm font-extrabold text-white">
          <Plus className="h-4 w-4" />
          Quick Action
        </button>
      </div>
    </header>
  )
}

function Toolbar() {
  return (
    <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
      <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-500">
        <Search className="h-4 w-4" />
        <input placeholder="Global search across members, users, meetings, vendors, marketplace, events, and training" className="w-full outline-none" />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-extrabold text-slate-700"><Filter className="h-3.5 w-3.5" />Filter</button>
        <button type="button" className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-extrabold text-slate-700"><Download className="h-3.5 w-3.5" />Export</button>
        <button type="button" className="inline-flex items-center gap-2 rounded-md bg-[#0d4697] px-3 py-2 text-xs font-extrabold text-white"><Plus className="h-3.5 w-3.5" />Create</button>
      </div>
    </div>
  )
}

function GlassStat({ label, value, helper, icon: Icon }) {
  return (
    <article className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-950">{value ?? 0}</p>
          <p className="mt-2 text-xs font-extrabold text-emerald-600">{helper}</p>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#eef4ff] text-[#1558b0]"><Icon className="h-5 w-5" /></span>
      </div>
    </article>
  )
}

function Toggle({ checked = false, onChange }) {
  const [local, setLocal] = useState(checked)
  const active = onChange ? checked : local
  const handleClick = () => {
    if (onChange) onChange()
    else setLocal((value) => !value)
  }

  return (
    <button type="button" onClick={handleClick} className={`relative h-6 w-11 rounded-full transition ${active ? 'bg-[#0d4697]' : 'bg-slate-300'}`} aria-pressed={active}>
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${active ? 'left-6' : 'left-1'}`} />
    </button>
  )
}

function formatTimeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function ActivityTimeline() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.auditLogs({ limit: 4 })
      .then(res => {
        setLogs(res.data?.data || res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-extrabold text-slate-950">Activity Timeline</h2>
        <div className="mt-5 text-sm font-semibold text-slate-450">Loading activity...</div>
      </section>
    );
  }

  const items = logs.map(log => [
    log.description || `${log.action?.replaceAll('_', ' ').toUpperCase()} by ${log.user?.name || log.user?.email || 'System'}`,
    log.module || 'System',
    formatTimeAgo(log.createdAt)
  ]);

  const displayItems = items.length ? items : [
    ['No recent actions logged', 'System', 'Just now']
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-extrabold text-slate-950">Activity Timeline</h2>
      <div className="mt-5 space-y-4">
        {displayItems.map(([title, module, time], idx) => (
          <div key={idx} className="flex gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#0d4697]" />
            <div>
              <p className="text-sm font-extrabold text-slate-800">{title}</p>
              <p className="text-xs font-bold text-slate-500">{module} • {time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function monthLabel(item) {
  return `${item._id?.month || ''}/${item._id?.year || ''}`
}

function formatLabel(value = '') {
  return String(value)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
