import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Copy, Eye, KeyRound, LogIn, Plus, ShieldCheck, UserCog } from 'lucide-react'
import { adminApi } from '../../api/admin'
import Modal from '../../components/common/Modal'
import SearchBar from '../../components/common/SearchBar'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/tables/DataTable'
import { useAuth } from '../../hooks/useAuth'
import { ADMIN_ROLE_OPTIONS, roleLabel } from '../../constants/adminRoles'
import { storage } from '../../utils/storage'
import { formatDate, getList, getPagination } from '../../utils/format'

const moduleOptions = ['dashboard', 'members', 'meetings', 'attendance', 'vendors', 'marketplace', 'reports', 'visitors', 'business_wall', 'training', 'events', 'referrals', 'settings']
const permissionKeys = ['canView', 'canCreate', 'canEdit', 'canDelete', 'canApprove', 'canExport', 'canPrint']
const workflowOptions = ['membership', 'vendor', 'business', 'meeting', 'training', 'marketplace', 'referral']
const workflowActionKeys = ['create', 'review', 'approve', 'reject', 'transfer']
const widgetOptions = ['members', 'meetings', 'visitors', 'attendance', 'business', 'referrals', 'marketplace', 'vendors', 'tasks', 'approvals', 'notifications']

const allModules = moduleOptions
const allWorkflows = workflowOptions
const allWidgets = widgetOptions

const alwaysExtraWidgets = ['tasks', 'approvals', 'notifications']
const adminPermissionKeys = permissionKeys
const managerPermissionKeys = ['canView', 'canCreate', 'canEdit', 'canApprove', 'canExport', 'canPrint']
const operatorPermissionKeys = ['canView', 'canCreate', 'canEdit', 'canExport', 'canPrint']
const reviewerPermissionKeys = ['canView', 'canApprove', 'canExport', 'canPrint']
const readOnlyPermissionKeys = ['canView', 'canExport', 'canPrint']
const approvalWorkflowActions = ['review', 'approve', 'reject', 'transfer']
const reviewWorkflowActions = ['review', 'approve', 'reject']

const createRoleConfig = ({
  modules,
  workflows,
  widgets,
  sidebar,
  permissionFields = managerPermissionKeys,
  workflowActions = approvalWorkflowActions,
}) => ({ modules, workflows, widgets, sidebar, permissionFields, workflowActions })

const ROLE_CONFIGS = {
  superadmin: createRoleConfig({ modules: allModules, workflows: allWorkflows, widgets: allWidgets, sidebar: allModules, permissionFields: adminPermissionKeys, workflowActions: workflowActionKeys }),
  admin: createRoleConfig({ modules: allModules, workflows: allWorkflows, widgets: allWidgets, sidebar: allModules, permissionFields: adminPermissionKeys, workflowActions: workflowActionKeys }),
  franchise_admin: createRoleConfig({ modules: allModules, workflows: allWorkflows, widgets: allWidgets, sidebar: allModules, permissionFields: adminPermissionKeys, workflowActions: workflowActionKeys }),
  ecommerce_admin: createRoleConfig({ modules: ['dashboard', 'vendors', 'marketplace', 'reports', 'settings'], workflows: ['vendor', 'marketplace'], widgets: ['marketplace', 'vendors', ...alwaysExtraWidgets], sidebar: ['dashboard', 'vendors', 'marketplace', 'reports', 'settings'] }),
  marketplace_admin: createRoleConfig({ modules: ['dashboard', 'vendors', 'marketplace', 'reports', 'settings'], workflows: ['vendor', 'marketplace'], widgets: ['marketplace', 'vendors', ...alwaysExtraWidgets], sidebar: ['dashboard', 'vendors', 'marketplace', 'reports', 'settings'] }),
  digital_marketing_admin: createRoleConfig({ modules: ['dashboard', 'members', 'visitors', 'business_wall', 'events', 'reports', 'settings'], workflows: ['business'], widgets: ['members', 'visitors', 'business', ...alwaysExtraWidgets], sidebar: ['dashboard', 'members', 'visitors', 'business_wall', 'events', 'reports', 'settings'], permissionFields: operatorPermissionKeys, workflowActions: ['create', 'review', 'approve', 'reject'] }),
  training_admin: createRoleConfig({ modules: ['dashboard', 'members', 'training', 'events', 'attendance', 'reports', 'settings'], workflows: ['training'], widgets: ['members', 'attendance', ...alwaysExtraWidgets], sidebar: ['dashboard', 'members', 'training', 'events', 'attendance', 'reports', 'settings'], permissionFields: operatorPermissionKeys, workflowActions: ['create', 'review', 'approve', 'reject'] }),
  finance_admin: createRoleConfig({ modules: ['dashboard', 'members', 'reports', 'meetings', 'settings'], workflows: ['meeting'], widgets: ['members', 'meetings', ...alwaysExtraWidgets], sidebar: ['dashboard', 'members', 'reports', 'meetings', 'settings'], permissionFields: ['canView', 'canApprove', 'canExport', 'canPrint'], workflowActions: reviewWorkflowActions }),
  state_director: createRoleConfig({ modules: ['dashboard', 'members', 'meetings', 'attendance', 'visitors', 'events', 'reports', 'settings'], workflows: ['membership', 'meeting'], widgets: ['members', 'meetings', 'attendance', 'visitors', ...alwaysExtraWidgets], sidebar: ['dashboard', 'members', 'meetings', 'attendance', 'visitors', 'events', 'reports', 'settings'] }),
  area_director: createRoleConfig({ modules: ['dashboard', 'members', 'meetings', 'attendance'], workflows: ['membership', 'meeting'], widgets: ['members', 'meetings', 'attendance', 'visitors'], sidebar: ['dashboard', 'members', 'meetings', 'visitors'], permissionFields: operatorPermissionKeys, workflowActions: reviewWorkflowActions }),
  executive_director: createRoleConfig({ modules: ['dashboard', 'members', 'meetings', 'attendance', 'visitors', 'reports'], workflows: ['membership', 'meeting'], widgets: ['members', 'meetings', 'attendance', 'visitors', ...alwaysExtraWidgets], sidebar: ['dashboard', 'members', 'meetings', 'attendance', 'visitors', 'reports'] }),
  launch_director: createRoleConfig({ modules: ['dashboard', 'members', 'meetings', 'attendance'], workflows: ['membership', 'meeting'], widgets: ['members', 'meetings', 'attendance', 'visitors'], sidebar: ['dashboard', 'members', 'meetings', 'visitors'], permissionFields: operatorPermissionKeys, workflowActions: reviewWorkflowActions }),
  direct_consultant: createRoleConfig({ modules: ['dashboard', 'members', 'meetings'], workflows: ['membership', 'meeting'], widgets: ['members', 'meetings', 'attendance'], sidebar: ['dashboard', 'members', 'meetings'], permissionFields: readOnlyPermissionKeys, workflowActions: ['create', 'review'] }),
  operation_vice_president: createRoleConfig({ modules: ['dashboard', 'members', 'meetings', 'attendance', 'visitors', 'vendors', 'reports'], workflows: ['membership', 'meeting', 'vendor'], widgets: ['members', 'meetings', 'attendance', 'visitors', 'vendors', ...alwaysExtraWidgets], sidebar: ['dashboard', 'members', 'meetings', 'attendance', 'visitors', 'vendors', 'reports'] }),
  membership_verification_admin: createRoleConfig({ modules: ['dashboard', 'members', 'meetings', 'attendance'], workflows: ['membership'], widgets: ['members', 'meetings', 'attendance', 'visitors'], sidebar: ['dashboard', 'members', 'meetings', 'visitors'], permissionFields: reviewerPermissionKeys, workflowActions: reviewWorkflowActions }),
  custom_admin: createRoleConfig({ modules: allModules, workflows: allWorkflows, widgets: allWidgets, sidebar: allModules, permissionFields: adminPermissionKeys, workflowActions: workflowActionKeys }),
}

function getRoleConfig(role) {
  return ROLE_CONFIGS[role] || ROLE_CONFIGS.area_director
}

function applyRoleConfig(role, current) {
  const config = getRoleConfig(role)
  const filterModules = (arr) => (arr || []).filter((m) => config.modules.includes(m))
  const filterWidgets = (arr) => (arr || []).filter((w) => config.widgets.includes(w))
  const filterSidebar = (arr) => (arr || []).filter((s) => config.sidebar.includes(s))
  return {
    modules: filterModules(current.modules),
    permissions: filterPermissions(current.permissions, config),
    workflowPermissions: filterWorkflowPermissions(current.workflowPermissions, config),
    dashboardWidgets: filterWidgets(current.dashboardWidgets),
    sidebar: filterSidebar(current.sidebar),
  }
}

function filterPermissions(permissions = {}, config) {
  return Object.fromEntries(
    Object.entries(permissions || {})
      .filter(([module]) => config.modules.includes(module))
      .map(([module, values]) => [
        module,
        Object.fromEntries(Object.entries(values || {}).filter(([permission]) => config.permissionFields.includes(permission))),
      ])
  )
}

function filterWorkflowPermissions(workflowPermissions = {}, config) {
  return Object.fromEntries(
    Object.entries(workflowPermissions || {})
      .filter(([workflow]) => config.workflows.includes(workflow))
      .map(([workflow, values]) => [
        workflow,
        Object.fromEntries(Object.entries(values || {}).filter(([permission]) => config.workflowActions.includes(permission))),
      ])
  )
}

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  avatar: null,
  role: 'area_director',
  customRoleName: '',
  organization: { region: '', state: '', area: '', district: '', chapter: '' },
  modules: ['dashboard', 'members', 'meetings', 'visitors'],
  permissions: {},
  workflowPermissions: {},
  dashboardWidgets: ['members', 'meetings', 'attendance', 'visitors'],
  sidebar: ['dashboard', 'members', 'meetings', 'visitors'],
  forcePasswordChange: true,
  sessionTimeoutMinutes: 60,
}

export default function AdminManagementPage() {
  const { user } = useAuth()
  const [payload, setPayload] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [wizardOpen, setWizardOpen] = useState(false)
  const [viewing, setViewing] = useState(null)
  const [activity, setActivity] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const params = useMemo(() => ({ page, limit: 10, search: search || undefined, role: role || undefined, status: status || undefined }), [page, role, search, status])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await adminApi.adminAccounts(params)
      setPayload(response.data)
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
  const canCreateAdmin = user?.role === 'superadmin'

  const openCreate = () => {
    if (!canCreateAdmin) {
      toast.error('Only Super Admin can create admin accounts')
      return
    }
    setEditing(null)
    setForm(emptyForm)
    setWizardOpen(true)
  }

  const openEdit = (admin) => {
    const profile = admin.meta?.adminProfile || {}
    setEditing(admin)
    setForm({
      ...emptyForm,
      name: admin.name || '',
      email: admin.email || '',
      phone: admin.phone || '',
      password: '',
      role: admin.role || 'admin',
      ...profile,
      organization: profile.organization || emptyForm.organization,
      modules: profile.modules || [],
      permissions: profile.permissions || {},
      workflowPermissions: profile.workflowPermissions || {},
      dashboardWidgets: profile.dashboardWidgets || [],
      sidebar: profile.sidebar || [],
      sessionTimeoutMinutes: profile.security?.sessionTimeoutMinutes || 60,
      forcePasswordChange: profile.security?.forcePasswordChange || false,
    })
    setWizardOpen(true)
  }

  // const saveAdmin = async () => {
  //   const payloadData = buildPayload(form, Boolean(editing))
  //   if (editing) await adminApi.updateAdminAccount(editing._id, payloadData)
  //   else await adminApi.createAdminAccount(payloadData)
  //   toast.success(editing ? 'Admin updated' : 'Admin created')
  //   setWizardOpen(false)
  //   load()
  // }
const saveAdmin = async () => {
    if (!editing && !canCreateAdmin) {
        toast.error('Only Super Admin can create admin accounts')
        return
    }

    if(!/^[6-9]\d{9}$/.test(form.phone)){
        toast.error("Enter a valid 10-digit mobile number")
        return
    }

    try {
        const payloadData = buildPayload(form, Boolean(editing))

        if(editing)
            await adminApi.updateAdminAccount(editing._id,payloadData)
        else
            await adminApi.createAdminAccount(payloadData)

        toast.success(editing ? "Admin updated" : "Admin created")
        setWizardOpen(false)
        load()
    } catch (error) {
        const message = error.response?.data?.message || error.response?.data?.error || error.message
        console.error('Save failed:', JSON.stringify(error.response?.data, null, 2))
        toast.error(message || 'Failed to save admin')
    }
}
  const cloneAdmin = async (admin) => {
    const email = window.prompt('Email for cloned admin')
    const password = window.prompt('Temporary password for cloned admin')
    if (!email || !password) return
    await adminApi.cloneAdminAccount(admin._id, { email, password, name: `${admin.name} Copy` })
    toast.success('Admin cloned')
    load()
  }

  const resetPassword = async (admin) => {
    const password = window.prompt('New temporary password')
    if (!password) return
    await adminApi.resetAdminPassword(admin._id, { password })
    toast.success('Password reset')
  }

  const setAdminStatus = async (admin, action) => {
    await adminApi.updateAdminAccountStatus(admin._id, { action })
    toast.success(`Admin ${action}`)
    load()
  }

  const deleteAdmin = async (admin) => {
    await adminApi.deleteAdminAccount(admin._id)
    toast.success('Admin deleted')
    load()
  }

  const loginAs = async (admin) => {
    const response = await adminApi.loginAsAdmin(admin._id)
    const data = response.data?.data
    sessionStorage.setItem('gloaro_superadmin_session', JSON.stringify({ user: storage.getUser(), accessToken: storage.getAccessToken(), refreshToken: storage.getRefreshToken() }))
    storage.setSession(data, false)
    toast.success(`Logged in as ${admin.name}`)
    window.location.href = '/admin'
  }

  const viewAdmin = async (admin) => {
    setViewing(admin)
    const response = await adminApi.adminActivity(admin._id, { limit: 8 })
    setActivity(getList(response.data))
  }

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-white/60 bg-white/85 p-6 shadow-sm backdrop-blur">
        <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#0d4697]"><UserCog className="h-4 w-4" />Admin Management</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">Admin Management & Access Control</h1>
        <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-slate-500">Create admin accounts, assign organization scope, configure modules, permissions, workflows, widgets, sidebar, security, and support impersonation.</p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid gap-2 md:grid-cols-[1fr_auto_auto] xl:min-w-[760px]">
            <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder="Search admin accounts" />
            <select value={role} onChange={(event) => { setRole(event.target.value); setPage(1) }} className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900">
              <option value="">All Roles</option>
              {ADMIN_ROLE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }} className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="blocked">Locked</option>
            </select>
          </div>
          {canCreateAdmin && <button type="button" onClick={openCreate} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#0d4697] px-4 text-sm font-extrabold text-white"><Plus className="h-4 w-4" />Create New Admin</button>}
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'name', header: 'Admin' },
          { key: 'role', header: 'Role', render: (row) => roleLabel(row.role) },
          { key: 'organization', header: 'Organization', render: (row) => organizationLabel(row.meta?.adminProfile?.organization) },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.isBlocked ? 'locked' : row.isSuspended ? 'suspended' : row.isActive ? 'active' : 'inactive'} /> },
          { key: 'lastLogin', header: 'Last Login', render: (row) => formatDate(row.lastLogin) },
        ]}
        rows={rows}
        loading={loading}
        pagination={pagination}
        onPageChange={setPage}
        actions={(row) => (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => viewAdmin(row)} className="rounded-md border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-900"><Eye className="h-3.5 w-3.5" /></button>
            <button onClick={() => openEdit(row)} className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-900">Edit</button>
            <button onClick={() => cloneAdmin(row)} className="rounded-md border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-900"><Copy className="h-3.5 w-3.5" /></button>
            <button onClick={() => setAdminStatus(row, row.isSuspended ? 'activate' : 'suspend')} className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-900">{row.isSuspended ? 'Activate' : 'Suspend'}</button>
            <button onClick={() => resetPassword(row)} className="rounded-md border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-900"><KeyRound className="h-3.5 w-3.5" /></button>
            <button onClick={() => loginAs(row)} className="rounded-md border border-blue-200 px-2 py-1.5 text-xs font-bold text-[#0d4697]"><LogIn className="h-3.5 w-3.5" /></button>
            {row.role !== 'superadmin' && <button onClick={() => deleteAdmin(row)} className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600">Delete</button>}
          </div>
        )}
      />

      <Modal open={wizardOpen} title={editing ? 'Edit Admin' : 'Create New Admin Wizard'} onClose={() => setWizardOpen(false)} maxWidth="max-w-6xl">
        <AdminWizard form={form} setForm={setForm} editing={Boolean(editing)} onSave={saveAdmin} />
      </Modal>

      <Modal open={Boolean(viewing)} title="Admin Details" onClose={() => setViewing(null)} maxWidth="max-w-4xl">
        {viewing && <AdminDetails admin={viewing} activity={activity} />}
      </Modal>
    </section>
  )
}

function AdminWizard({ form, setForm, editing, onSave }) {
  const update = (patch) => setForm((current) => ({ ...current, ...patch }))
  const updateOrg = (key, value) => setForm((current) => ({ ...current, organization: { ...current.organization, [key]: value } }))
  const toggleArray = (key, value) => setForm((current) => ({ ...current, [key]: toggleValue(current[key] || [], value) }))
  const togglePermission = (module, permission) => setForm((current) => ({
    ...current,
    permissions: {
      ...current.permissions,
      [module]: { ...(current.permissions[module] || {}), [permission]: !current.permissions[module]?.[permission] },
    },
  }))
  const toggleWorkflow = (workflow, permission) => setForm((current) => ({
    ...current,
    workflowPermissions: {
      ...current.workflowPermissions,
      [workflow]: { ...(current.workflowPermissions[workflow] || {}), [permission]: !current.workflowPermissions[workflow]?.[permission] },
    },
  }))

  const roleConfig = useMemo(() => getRoleConfig(form.role), [form.role])

  const handleRoleChange = useCallback((role) => {
    setForm((current) => ({ ...current, role, ...applyRoleConfig(role, current) }))
  }, [setForm])

  const allowedModules = roleConfig.modules
  const allowedWorkflows = roleConfig.workflows
  const allowedWidgets = roleConfig.widgets
  const allowedSidebar = roleConfig.sidebar
  const allowedPermissionKeys = roleConfig.permissionFields
  const allowedWorkflowActions = roleConfig.workflowActions
  const visibleModules = form.modules.filter((m) => allowedModules.includes(m))

  return (
    <div className="space-y-6">
      <WizardSection number="1" title="Basic Information">
        <div className="grid gap-3 md:grid-cols-2">
          <Input label="Name" value={form.name} onChange={(value) => update({ name: value })} />
          <Input label="Email" value={form.email} disabled={editing} onChange={(value) => update({ email: value })} />
          <Input
    label="Mobile"
    type="tel"
    value={form.phone}
    onChange={(value)=>{
        const phone=value.replace(/\D/g,"").slice(0,10)
        update({phone})
    }}
/>
          {!editing && <Input label="Password" value={form.password} type="password" onChange={(value) => update({ password: value })} />}
          <label className="block">
            <span className="text-xs font-extrabold uppercase text-slate-500">Profile Photo</span>
            <input
  type="file"
  accept="image/*"
  onChange={(event) =>
    update({ avatar: event.target.files?.[0] || null })
  }
  className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
/>
          </label>
        </div>
      </WizardSection>

      <WizardSection number="2" title="Role Selection">
<select
    value={form.role}
    onChange={(e)=>handleRoleChange(e.target.value)}
    className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900"
>          {ADMIN_ROLE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        {form.role === 'custom_admin' && <Input label="Custom Role Name" value={form.customRoleName} onChange={(value) => update({ customRoleName: value })} />}
      </WizardSection>

      <WizardSection number="3" title="Organization Assignment">
        <div className="grid gap-3 md:grid-cols-5">
          {['region', 'state', 'area', 'district', 'chapter'].map((item) => <Input key={item} label={roleLabel(item)} value={form.organization[item] || ''} onChange={(value) => updateOrg(item, value)} />)}
        </div>
      </WizardSection>

      <WizardSection number="4" title="Module Access">
        <CheckGrid values={allowedModules} selected={form.modules} onToggle={(value) => toggleArray('modules', value)} />
      </WizardSection>

      <WizardSection number="5" title="Permission Matrix">
        <div className="space-y-3">
          {visibleModules.map((module) => (
            <div key={module} className="rounded-xl bg-slate-50 p-3">
              <p className="mb-2 text-sm font-extrabold text-slate-800">{roleLabel(module)}</p>
              <CheckGrid values={allowedPermissionKeys} selected={allowedPermissionKeys.filter((key) => form.permissions[module]?.[key])} onToggle={(permission) => togglePermission(module, permission)} />
            </div>
          ))}
        </div>
      </WizardSection>

      <WizardSection number="6" title="Workflow Permissions">
        <div className="space-y-3">
          {allowedWorkflows.map((workflow) => (
            <div key={workflow} className="rounded-xl bg-slate-50 p-3">
              <p className="mb-2 text-sm font-extrabold text-slate-800">{roleLabel(workflow)}</p>
              <CheckGrid values={allowedWorkflowActions} selected={allowedWorkflowActions.filter((key) => form.workflowPermissions[workflow]?.[key])} onToggle={(permission) => toggleWorkflow(workflow, permission)} />
            </div>
          ))}
        </div>
      </WizardSection>

      <WizardSection number="7" title="Dashboard Builder">
        <CheckGrid values={allowedWidgets} selected={form.dashboardWidgets} onToggle={(value) => toggleArray('dashboardWidgets', value)} />
      </WizardSection>

      <WizardSection number="8" title="Sidebar Builder">
        <CheckGrid values={allowedSidebar} selected={form.sidebar} onToggle={(value) => toggleArray('sidebar', value)} />
      </WizardSection>

      <div className="flex justify-end">
        <button type="button" onClick={onSave} className="inline-flex h-11 items-center gap-2 rounded-md bg-[#0d4697] px-5 text-sm font-extrabold text-white"><ShieldCheck className="h-4 w-4" />Save Admin Access</button>
      </div>
    </div>
  )
}

function WizardSection({ number, title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-slate-950"><span className="grid h-7 w-7 place-items-center rounded-md bg-[#0d4697] text-xs text-white">{number}</span>{title}</h3>
      {children}
    </section>
  )
}

function Input({ label, value, onChange, type = 'text', disabled }) {
  return (
    <label className="block">
      <span className="text-xs font-extrabold uppercase text-slate-500">{label}</span>
      <input disabled={disabled} type={type} value={value || ''} onChange={(event) => onChange(event.target.value)} className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-[#0d4697] disabled:bg-slate-50" />
    </label>
  )
}

function CheckGrid({ values, selected = [], onToggle }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {values.map((value) => (
        <label key={value} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700">
          <input type="checkbox" checked={selected.includes(value)} onChange={() => onToggle(value)} className="accent-[#0d4697]" />
          {roleLabel(value.replace(/^can/, ''))}
        </label>
      ))}
    </div>
  )
}

function AdminDetails({ admin, activity }) {
  const profile = admin.meta?.adminProfile || {}
  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-slate-50 p-4">
        <h3 className="text-xl font-black text-slate-950">{admin.name}</h3>
        <p className="text-sm font-bold text-slate-500">{admin.email} • {roleLabel(admin.role)}</p>
        <p className="mt-2 text-sm font-semibold text-slate-600">Organization: {organizationLabel(profile.organization)}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Mini label="Modules" value={(profile.modules || []).length} />
        <Mini label="Widgets" value={(profile.dashboardWidgets || []).length} />
        <Mini label="Sidebar Items" value={(profile.sidebar || []).length} />
      </div>
      <section>
        <h4 className="mb-3 text-sm font-extrabold uppercase text-slate-500">Activity Timeline</h4>
        <div className="space-y-2">
          {activity.map((item) => <p key={item._id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700">{item.action} • {formatDate(item.createdAt)}</p>)}
          {!activity.length && <p className="text-sm font-semibold text-slate-500">No activity yet.</p>}
        </div>
      </section>
    </div>
  )
}

function Mini({ label, value }) {
  return <div className="rounded-xl border border-slate-200 p-4"><p className="text-xs font-extrabold uppercase text-slate-400">{label}</p><p className="mt-1 text-2xl font-black text-slate-950">{value}</p></div>
}

function buildPayload(form, editing) {
  const config = getRoleConfig(form.role)
  const payload = {
    name: form.name,
    ...(editing ? {} : { email: form.email }),
    phone: form.phone,
    ...(!editing ? { password: form.password } : {}),
    role: form.role,
    customRoleName: form.customRoleName,
    organization: form.organization,
    modules: (form.modules || []).filter((m) => config.modules.includes(m)),
    permissions: filterPermissions(form.permissions, config),
    workflowPermissions: filterWorkflowPermissions(form.workflowPermissions, config),
    dashboardWidgets: (form.dashboardWidgets || []).filter((w) => config.widgets.includes(w)),
    sidebar: (form.sidebar || []).filter((s) => config.sidebar.includes(s)),
    forcePasswordChange: form.forcePasswordChange,
    sessionTimeoutMinutes: form.sessionTimeoutMinutes,
  }
  if (!form.avatar) return payload

  const data = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    data.append(key, typeof value === 'object' ? JSON.stringify(value) : value)
  })
  data.append('avatar', form.avatar)
  return data
}

function organizationLabel(organization = {}) {
  return ['region', 'state', 'area', 'district', 'chapter'].map((key) => organization?.[key]).filter(Boolean).join(' / ') || 'All Organization'
}

function toggleValue(values, value) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
}
