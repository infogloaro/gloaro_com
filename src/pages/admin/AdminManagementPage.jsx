import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Copy, Eye, EyeOff, KeyRound, LogIn, Plus, ShieldCheck, UserCog } from 'lucide-react'
import { adminApi } from '../../api/admin'
import api from '../../api/axios'
import Modal from '../../components/common/Modal'
import UserPermissionsModal from '../../components/common/UserPermissionsModal'
import LoadingScreen from '../../components/common/LoadingScreen'
import SearchBar from '../../components/common/SearchBar'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/tables/DataTable'
import { useAuth } from '../../hooks/useAuth'
import { ADMIN_ROLE_OPTIONS, roleLabel as originalRoleLabel } from '../../constants/adminRoles'
import { storage } from '../../utils/storage'
import { getDashboardRoute } from '../../utils/permissions'
import { formatDate, getList, getPagination } from '../../utils/format'
import { ROLES } from '../../constants/roleConfig.js'

const roleLabel = (role = '') => {
  const currentUser = storage.getUser()
  if (currentUser?.role === ROLES.DISTRICT_DIRECTOR && role === ROLES.EXECUTIVE_DIRECTOR) {
    return 'Chapter Director'
  }
  if (currentUser?.role === ROLES.EXECUTIVE_DIRECTOR && role === ROLES.CHAPTER_PRESIDENT) {
    return 'Unit Chairman'
  }
  if (currentUser?.role === ROLES.CHAPTER_PRESIDENT && role === ROLES.VICE_PRESIDENT) {
    return 'Unit Vice Chairman'
  }
  if (currentUser?.role === ROLES.VICE_PRESIDENT && role === ROLES.SECRETARY) {
    return 'Coordinator'
  }
  if (currentUser?.role === ROLES.VICE_PRESIDENT && role === ROLES.CUSTOMER) {
    return 'Member'
  }
  return originalRoleLabel(role)
}

const emptyReferralValidation = { status: 'idle', code: '', referrer: null, message: '' }

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  avatar: null,
  role: ROLES.REGION_DIRECTOR,
  customRoleName: '',
  referralCode: '',
  referralValidation: emptyReferralValidation,
  organization: { region: '', state: '', district: '', chapter: '' },
  forcePasswordChange: true,
  sessionTimeoutMinutes: 60,
}

export default function AdminManagementPage({ role: overrideRole }) {
  const { user } = useAuth()

  const [payload, setPayload] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [wizardOpen, setWizardOpen] = useState(false)
  const [viewing, setViewing] = useState(null)
  const [activity, setActivity] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [selectedPermUser, setSelectedPermUser] = useState(null)
  const requestSequence = useRef(0)

  const CREATOR_CHILD_ROLE = useMemo(() => ({
    [ROLES.SUPERADMIN]: ROLES.ADMIN,
    [ROLES.ADMIN]: ROLES.REGION_DIRECTOR,
    [ROLES.REGION_DIRECTOR]: ROLES.STATE_DIRECTOR,
    [ROLES.STATE_DIRECTOR]: ROLES.DISTRICT_DIRECTOR,
    [ROLES.DISTRICT_DIRECTOR]: ROLES.EXECUTIVE_DIRECTOR,
    [ROLES.EXECUTIVE_DIRECTOR]: ROLES.LAUNCH_DIRECTOR,
    [ROLES.LAUNCH_DIRECTOR]: ROLES.DIRECT_CONSULTANT,
    [ROLES.DIRECT_CONSULTANT]: ROLES.CHAPTER_PRESIDENT,
    [ROLES.CHAPTER_PRESIDENT]: ROLES.VICE_PRESIDENT,
    [ROLES.VICE_PRESIDENT]: ROLES.SECRETARY,
  }), []);

  const childRole = overrideRole || CREATOR_CHILD_ROLE[user?.role]
  const isRoleLocked = Boolean(overrideRole)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  const params = useMemo(() => {
    const filterRole = isRoleLocked
      ? childRole
      : (user?.role === ROLES.SUPERADMIN ? (role || undefined) : childRole)
    return {
      page,
      limit: 10,
      search: debouncedSearch || undefined,
      role: filterRole,
      status: status || undefined
    }
  }, [page, role, debouncedSearch, status, user?.role, childRole, isRoleLocked])

  const load = useCallback(async () => {
    const sequence = ++requestSequence.current
    setLoading(true)
    try {
      const response = await adminApi.adminAccounts(params)
      if (sequence === requestSequence.current) setPayload(response.data)
    } finally {
      if (sequence === requestSequence.current) setLoading(false)
    }
  }, [params])

  useEffect(() => {
    const timer = window.setTimeout(() => load(), 0)
    return () => window.clearTimeout(timer)
  }, [load])

  useEffect(() => {
    const refresh = () => load()
    window.addEventListener('focus', refresh)
    const interval = window.setInterval(refresh, 30000)
    return () => {
      window.removeEventListener('focus', refresh)
      window.clearInterval(interval)
    }
  }, [load])

  const rows = getList(payload)
  const pagination = getPagination(payload)
  const canCreateAdmin = user?.role === ROLES.SUPERADMIN || Boolean(childRole)

  const openCreate = () => {
    if (!canCreateAdmin) {
      toast.error('You are not authorized to create accounts')
      return
    }
    const userOrg = user?.meta?.adminProfile?.organization || user?.meta?.memberProfile?.organization || {}
    setEditing(null)
    setForm({
      ...emptyForm,
      role: childRole || ROLES.ADMIN,
      organization: {
        region: userOrg.region || '',
        state: userOrg.state || '',
        district: userOrg.district || '',
        chapter: userOrg.chapter || '',
      }
    })
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
      referralCode: '',
      role: childRole || admin.role || ROLES.ADMIN,
      ...profile,
      organization: profile.organization || emptyForm.organization,
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

    const typedReferralCode = form.referralCode?.trim().toUpperCase() || ''
    const validatedReferralCode = form.referralValidation?.status === 'valid' ? form.referralValidation?.code : ''
    if (!editing && form.role === ROLES.CUSTOMER && typedReferralCode && typedReferralCode !== validatedReferralCode) {
        toast.error("Please validate the referral code before creating the member")
        return
    }

    // Jurisdiction location validation to ensure "Location Master first -> Official account second"
    if (form.role === ROLES.REGION_DIRECTOR && !form.organization?.region) {
        toast.error("Please create the Region in the Organization Master before creating a Region Director account.")
        return
    }
    if (form.role === ROLES.STATE_DIRECTOR && !form.organization?.state) {
        toast.error("Please create the State in the Organization Master before creating a State Director account.")
        return
    }
    if (form.role === ROLES.DISTRICT_DIRECTOR && !form.organization?.district) {
        toast.error("Please create the District in the Organization Master before creating a District Director account.")
        return
    }
    if ([ROLES.EXECUTIVE_DIRECTOR, ROLES.LAUNCH_DIRECTOR, ROLES.DIRECT_CONSULTANT, ROLES.CHAPTER_PRESIDENT, ROLES.VICE_PRESIDENT, ROLES.SECRETARY].includes(form.role) && !form.organization?.chapter) {
        toast.error("Please create the Chapter in the Organization Master before creating this official account.")
        return
    }
    setSaving(true)
    try {
        const payloadData = buildPayload(form, Boolean(editing))
        if (import.meta.env.DEV && form.role === ROLES.CUSTOMER) {
            if (payloadData instanceof FormData) {
                console.info('[AdminManagementPage] create member FormData', Array.from(payloadData.entries()).map(([key, value]) => [key, value instanceof File ? value.name : value]))
            } else {
                console.info('[AdminManagementPage] create member payload', payloadData)
            }
        }

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
    } finally {
        setSaving(false)
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
    window.location.href = getDashboardRoute(admin.role)
  }

  const viewAdmin = async (admin) => {
    setViewing(admin)
    const response = await adminApi.adminActivity(admin._id, { limit: 8 })
    setActivity(getList(response.data))
  }

  const listData = getList(payload)
  const isCreateDisabled = (
    (user?.role === ROLES.EXECUTIVE_DIRECTOR && listData.length >= 1) ||
    (user?.role === ROLES.CHAPTER_PRESIDENT && listData.length >= 1) ||
    (user?.role === ROLES.VICE_PRESIDENT && childRole === ROLES.SECRETARY && listData.length >= 1) ||
    (user?.role === ROLES.LAUNCH_DIRECTOR && childRole === ROLES.DIRECT_CONSULTANT && listData.length >= 1) ||
    (user?.role === ROLES.DIRECT_CONSULTANT && childRole === ROLES.CHAPTER_PRESIDENT && listData.length >= 1)
  )

  const showCreateButton = canCreateAdmin && !(user?.role === ROLES.EXECUTIVE_DIRECTOR && childRole === ROLES.CUSTOMER) && !(user?.role === ROLES.DISTRICT_DIRECTOR && childRole === ROLES.CUSTOMER) && !(user?.role === ROLES.LAUNCH_DIRECTOR && childRole === ROLES.CUSTOMER) && !(user?.role === ROLES.DIRECT_CONSULTANT && childRole === ROLES.CUSTOMER) && !(user?.role === ROLES.CHAPTER_PRESIDENT && childRole === ROLES.CUSTOMER) && !isCreateDisabled

  const getDisabledTitle = () => {
    if (!isCreateDisabled) return ""
    if (user?.role === ROLES.EXECUTIVE_DIRECTOR) return "A Chapter Unit Chairman already exists for this Chapter"
    if (user?.role === ROLES.CHAPTER_PRESIDENT) return "A Unit Vice Chairman already exists for this Chapter"
    if (user?.role === ROLES.VICE_PRESIDENT) return "A Coordinator already exists for this Chapter"
    return ""
  }

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-white/60 bg-white/85 p-6 shadow-sm backdrop-blur">
        <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#0d4697]"><UserCog className="h-4 w-4" />{childRole ? `${roleLabel(childRole)} Management` : 'Admin Management'}</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">{childRole ? `Manage ${roleLabel(childRole)}s` : 'Admin Management & Access Control'}</h1>
        <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-slate-500">{childRole ? `Manage and assign organization jurisdictions for your subordinate ${roleLabel(childRole)}s.` : 'Create admin accounts, assign organization scope, security, and support impersonation.'}</p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid gap-2 md:grid-cols-[1fr_auto_auto] xl:min-w-[760px]">
            <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder={childRole ? `Search ${roleLabel(childRole)} accounts` : 'Search admin accounts'} />
            {!childRole && (
              <select value={role} onChange={(event) => { setRole(event.target.value); setPage(1) }} className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900">
                <option value="">All Roles</option>
                {ADMIN_ROLE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            )}
            <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }} className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900">
              <option value="">All Status</option>
              {childRole === ROLES.CUSTOMER ? (
                <>
                  <option value="approved">Approved</option>
                  <option value="pending_approval">Pending Approval</option>
                </>
              ) : (
                <>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="blocked">Locked</option>
                </>
              )}
            </select>
          </div>
          {showCreateButton && (
            <button
              type="button"
              onClick={openCreate}
              disabled={isCreateDisabled}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#0d4697] px-4 text-sm font-extrabold text-white disabled:opacity-50 disabled:cursor-not-allowed"
              title={getDisabledTitle()}
            >
              <Plus className="h-4 w-4" />
              {childRole === ROLES.CUSTOMER ? 'Add Member' : childRole ? `Create New ${roleLabel(childRole)}` : 'Create New Admin'}
            </button>
          )}
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'officialId', header: 'Official ID', render: (row) => row.officialId || '-' },
          { key: 'name', header: 'Name' },
          { key: 'email', header: 'Email' },
          { key: 'location', header: childRole === ROLES.REGION_DIRECTOR ? 'Assigned Region' : 'Location', render: (row) => getSubordinateLocation(row) },
          ...(childRole === ROLES.REGION_DIRECTOR ? [{ key: 'regionSource', header: 'Region Source', render: (row) => getRegionSource(row) }] : []),
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.role === ROLES.CUSTOMER ? row.status : (row.isBlocked ? 'locked' : row.isSuspended ? 'suspended' : row.isActive ? 'active' : 'inactive')} /> },
        ]}
        rows={rows}
        loading={loading && !payload}
        emptyTitle={debouncedSearch ? `No members found for "${debouncedSearch}"` : 'No members found'}
        emptyDescription={debouncedSearch ? 'No real member record in this chapter matches the entered name, email, phone, member ID, or official ID.' : 'No members have been added to this chapter yet.'}
        pagination={pagination}
        onPageChange={setPage}
        actions={(row) => {
          if ((user?.role === ROLES.DISTRICT_DIRECTOR || user?.role === ROLES.LAUNCH_DIRECTOR || user?.role === ROLES.DIRECT_CONSULTANT || user?.role === ROLES.CHAPTER_PRESIDENT || user?.role === ROLES.VICE_PRESIDENT) && childRole === ROLES.CUSTOMER) {
            return (
              <div className="flex flex-wrap gap-2">
                <button onClick={() => viewAdmin(row)} className="rounded-md border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-900" title="View Details"><Eye className="h-3.5 w-3.5" /></button>
              </div>
            )
          }
          if (user?.role === ROLES.EXECUTIVE_DIRECTOR && childRole === ROLES.CUSTOMER) {
            return (
              <div className="flex flex-wrap gap-2">
                <button onClick={() => viewAdmin(row)} className="rounded-md border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-900" title="View Details"><Eye className="h-3.5 w-3.5" /></button>
                {row.status === 'pending_approval' && (
                  <>
                    <button
                      onClick={() => setAdminStatus(row, 'approve')}
                      className="rounded-md border border-emerald-250 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setAdminStatus(row, 'reject')}
                      className="rounded-md border border-red-250 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            )
          }
          return (
            <div className="flex flex-wrap gap-2">
              <button onClick={() => viewAdmin(row)} className="rounded-md border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-900"><Eye className="h-3.5 w-3.5" /></button>
              <button onClick={() => openEdit(row)} className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-900">Edit</button>
              <button onClick={() => cloneAdmin(row)} className="rounded-md border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-900"><Copy className="h-3.5 w-3.5" /></button>
               <button onClick={() => setAdminStatus(row, row.isSuspended ? 'activate' : 'suspend')} className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-900">{row.isSuspended ? 'Activate' : 'Suspend'}</button>
              <button onClick={() => setSelectedPermUser(row)} className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-bold text-[#0d4697]">Permissions</button>
              <button onClick={() => resetPassword(row)} className="rounded-md border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-900"><KeyRound className="h-3.5 w-3.5" /></button>
              {row.role !== ROLES.SUPERADMIN && <button onClick={() => deleteAdmin(row)} className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600">Delete</button>}
            </div>
          )
        }}
      />

      <Modal open={wizardOpen} title={editing ? (childRole ? `Edit ${roleLabel(childRole)}` : 'Edit Admin') : (childRole ? `Create New ${roleLabel(childRole)} Wizard` : 'Create New Admin Wizard')} onClose={() => setWizardOpen(false)} maxWidth="max-w-6xl">
        <AdminWizard form={form} setForm={setForm} editing={Boolean(editing)} onSave={saveAdmin} user={user} saving={saving} isRoleLocked={isRoleLocked} childRole={childRole} />
      </Modal>

      <Modal open={Boolean(viewing)} title={childRole ? `${roleLabel(childRole)} Details` : 'Admin Details'} onClose={() => setViewing(null)} maxWidth="max-w-4xl">
        {viewing && <AdminDetails admin={viewing} activity={activity} />}
      </Modal>

      {selectedPermUser && (
        <UserPermissionsModal 
          userId={selectedPermUser._id} 
          userName={selectedPermUser.name} 
          onClose={() => setSelectedPermUser(null)} 
        />
      )}
    </section>
  )
}

function AdminWizard({ form, setForm, editing, onSave, user, saving, isRoleLocked, childRole }) {
  const [showPassword, setShowPassword] = useState(false)
  const [validatingReferral, setValidatingReferral] = useState(false)
  const update = (patch) => setForm((current) => ({ ...current, ...patch }))
  const updateOrg = (key, value) => setForm((current) => ({ ...current, organization: { ...current.organization, [key]: value } }))

  useEffect(() => {
    setShowPassword(false)
  }, [editing])

  const handleRoleChange = useCallback((role) => {
    setForm((current) => ({ ...current, role, referralCode: role === ROLES.CUSTOMER ? current.referralCode : '', referralValidation: emptyReferralValidation }))
  }, [setForm])

  const handleReferralCodeChange = (value) => {
    setForm((current) => ({
      ...current,
      referralCode: value.toUpperCase(),
      referralValidation: emptyReferralValidation,
    }))
  }

  const validateReferralCode = async () => {
    const code = form.referralCode?.trim().toUpperCase()
    if (!code) {
      setForm((current) => ({ ...current, referralValidation: emptyReferralValidation }))
      return
    }

    setValidatingReferral(true)
    try {
      const response = await api.get(`/auth/validate-referral/${encodeURIComponent(code)}`, { params: { scope: 'member' } })
      const data = response.data?.data || {}
      const referrer = response.data?.referrer || {}
      setForm((current) => ({
        ...current,
        referralCode: code,
        referralValidation: {
          status: 'valid',
          code,
          referrer: {
            id: referrer.id,
            name: data.referredBy || referrer.name,
          },
          message: 'Valid referral code',
        },
      }))
    } catch (error) {
      setForm((current) => ({
        ...current,
        referralValidation: {
          status: 'invalid',
          code,
          referrer: null,
          message: error.response?.data?.message || 'Invalid referral code',
        },
      }))
    } finally {
      setValidatingReferral(false)
    }
  }

  const referralValidation = form.referralValidation || emptyReferralValidation
  const referralCode = form.referralCode?.trim() || ''
  const isReferralValidated = referralValidation.status === 'valid' && referralValidation.code === referralCode.toUpperCase()

  return (
    <div className="relative space-y-6">
      {saving && (
        <LoadingScreen label={editing ? 'Updating admin...' : 'Creating admin...'} />
      )}
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
          {!editing && (
            <Input
              label="Password"
              value={form.password}
              type={showPassword ? 'text' : 'password'}
              onChange={(value) => update({ password: value })}
              showToggle
              isPasswordVisible={showPassword}
              onTogglePassword={() => setShowPassword((current) => !current)}
            />
          )}
          {!editing && form.role === ROLES.CUSTOMER && (
            <div className="block md:col-span-2">
              <span className="text-xs font-extrabold uppercase text-slate-500">Connect Code (Optional)</span>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={form.referralCode || ''}
                  onChange={(event) => handleReferralCodeChange(event.target.value)}
                  className="h-11 min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#0d4697]"
                  placeholder="Enter referral code"
                />
                <button
                  type="button"
                  onClick={validateReferralCode}
                  disabled={!referralCode || validatingReferral || isReferralValidated}
                  className="h-11 shrink-0 rounded-md bg-[#0d4697] px-4 text-sm font-extrabold text-white transition disabled:cursor-not-allowed disabled:bg-[#8aa7d4]"
                >
                  {validatingReferral ? 'Validating...' : isReferralValidated ? 'Validated' : 'Validate'}
                </button>
              </div>
              {referralValidation.status === 'valid' && (
                <div className="mt-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
                  <p>✓ Valid referral code</p>
                  <p>Referred by: {referralValidation.referrer?.name || 'Member'}</p>
                  <p>Connect Code: {referralValidation.code}</p>
                </div>
              )}
              {referralValidation.status === 'invalid' && (
                <p className="mt-2 text-sm font-bold text-red-600">✕ Invalid referral code</p>
              )}
            </div>
          )}
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
        {isRoleLocked ? (
          <div className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 flex items-center text-sm font-extrabold text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350">
            {roleLabel(childRole)} (Read Only)
          </div>
        ) : user?.role === ROLES.SUPERADMIN ? (
          <select
            value={form.role}
            onChange={(e)=>handleRoleChange(e.target.value)}
            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 focus:border-[#0d4697] focus:outline-none"
          >
            {ADMIN_ROLE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        ) : (
          <div className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 flex items-center text-sm font-extrabold text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350">
            {roleLabel(form.role)} (Read Only)
          </div>
        )}
        {!isRoleLocked && form.role === ROLES.CUSTOM_ADMIN && <Input label="Custom Role Name" value={form.customRoleName} onChange={(value) => update({ customRoleName: value })} />}
      </WizardSection>

      <WizardSection number="3" title="Organization Assignment">
        <OrganizationAssignmentSection organization={form.organization} onChangeOrg={updateOrg} user={user} targetRole={form.role} />
      </WizardSection>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex h-11 items-center gap-2 rounded-md bg-[#0d4697] px-5 text-sm font-extrabold text-white transition disabled:cursor-not-allowed disabled:bg-[#8aa7d4]"
        >
          {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <ShieldCheck className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save Admin Access'}
        </button>
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

function Input({ label, value, onChange, type = 'text', disabled, showToggle = false, isPasswordVisible = false, onTogglePassword }) {
  return (
    <label className="block">
      <span className="text-xs font-extrabold uppercase text-slate-500">{label}</span>
      <div className="relative mt-1">
        <input
          disabled={disabled}
          type={type}
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          className={`h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-[#0d4697] disabled:bg-slate-50 ${showToggle ? 'pr-11' : ''}`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            aria-label={isPasswordVisible ? `Hide ${label}` : `Show ${label}`}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 transition hover:text-slate-700"
          >
            {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </label>
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

function buildPayload(form, editing) {
  const referralCode = form.referralCode?.trim().toUpperCase() || ''
  const validatedReferralCode = form.referralValidation?.status === 'valid' && form.referralValidation?.code === referralCode
    ? form.referralValidation.code
    : ''
  const payload = {
    name: form.name,
    ...(editing ? {} : { email: form.email }),
    phone: form.phone,
    ...(!editing ? { password: form.password } : {}),
    role: form.role,
    customRoleName: form.customRoleName,
    ...(!editing && form.role === ROLES.CUSTOMER && validatedReferralCode ? { referralCode: validatedReferralCode } : {}),
    organization: form.organization,
    forcePasswordChange: form.forcePasswordChange,
    sessionTimeoutMinutes: form.sessionTimeoutMinutes,
  }
  if (!form.avatar) return payload

  const data = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    data.append(key, typeof value === 'object' ? JSON.stringify(value) : value)
  })
  if (!editing && form.role === ROLES.CUSTOMER && validatedReferralCode) {
    data.set('referralCode', validatedReferralCode)
    data.set('referral_code', validatedReferralCode)
  }
  data.append('avatar', form.avatar)
  return data
}

function organizationLabel(organization = {}) {
  return ['region', 'state', 'district', 'chapter']
    .map((key) => {
      const assigned = organization?.[`assigned${key.charAt(0).toUpperCase() + key.slice(1)}`];
      return assigned?.name || (typeof organization?.[key] === 'string' && organization[key].length !== 24 ? organization[key] : null);
    })
    .filter(Boolean)
    .join(' / ') || 'All Organization'
}

function SelectField({ label, value, onChange, placeholder, options = [], disabled, className = '', loading, error }) {
  let displayPlaceholder = placeholder
  if (loading) displayPlaceholder = `Loading ${label}...`
  else if (error) displayPlaceholder = error
  else if (!options || options.length === 0) displayPlaceholder = `No ${label} Found`

  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-extrabold uppercase text-slate-555">{label}</span>
      <select
        disabled={disabled || loading}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-[#0d4697] disabled:bg-slate-50 disabled:opacity-60"
      >
        <option value="">{displayPlaceholder}</option>
        {!loading && !error && options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function OrganizationAssignmentSection({ organization, onChangeOrg, user, targetRole = '' }) {
  const [regions, setRegions] = useState([])
  const [states, setStates] = useState([])
  const [districts, setDistricts] = useState([])
  const [chapters, setChapters] = useState([])

  const [loadingRegions, setLoadingRegions] = useState(false)
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingChapters, setLoadingChapters] = useState(false)

  const [errRegions, setErrRegions] = useState('')
  const [errStates, setErrStates] = useState('')
  const [errDistricts, setErrDistricts] = useState('')
  const [errChapters, setErrChapters] = useState('')

  const creatorRole = user?.role || ROLES.SUPERADMIN
  const creatorOrg = user?.meta?.adminProfile?.organization || {}
  const isGlobal = [ROLES.SUPERADMIN, ROLES.ADMIN].includes(creatorRole)

  const regionsList = useMemo(() => {
    if (creatorRole === ROLES.REGION_DIRECTOR) {
      const regId = creatorOrg.region
      const regName = creatorOrg.assignedRegion?.name || ''
      if (regId) {
        return [{ _id: regId, name: regName }]
      }
    }
    return regions
  }, [creatorRole, creatorOrg.region, creatorOrg.assignedRegion, regions])

  // Determine visibility of location selectors
  let showRegion = false
  let showState = false
  let showDistrict = false
  let showChapter = false

  if (targetRole === ROLES.REGION_DIRECTOR) {
    showRegion = true
  } else if (targetRole === ROLES.STATE_DIRECTOR) {
    showRegion = true
    showState = true
  } else if (targetRole === ROLES.DISTRICT_DIRECTOR) {
    showRegion = true
    showState = true
    showDistrict = true
  } else if (targetRole === ROLES.EXECUTIVE_DIRECTOR) {
    showRegion = true
    showState = true
    showDistrict = true
    showChapter = true
  } else {
    showRegion = true
    showState = true
    showDistrict = true
    showChapter = true
  }

  // Determine locking states
  const isRegionLocked = !isGlobal || (targetRole !== ROLES.REGION_DIRECTOR && organization.region)
  const isStateLocked = (!isGlobal && creatorRole !== ROLES.REGION_DIRECTOR) || (targetRole !== ROLES.STATE_DIRECTOR && organization.state)
  const isDistrictLocked = (!isGlobal && ![ROLES.REGION_DIRECTOR, ROLES.STATE_DIRECTOR].includes(creatorRole)) || (targetRole !== ROLES.DISTRICT_DIRECTOR && organization.district)
  const isChapterLocked = (!isGlobal && ![ROLES.REGION_DIRECTOR, ROLES.STATE_DIRECTOR, ROLES.DISTRICT_DIRECTOR].includes(creatorRole)) || (targetRole !== ROLES.EXECUTIVE_DIRECTOR && organization.chapter)

  // Auto-fill creator credentials once on mount
  useEffect(() => {
    if (!isGlobal) {
      console.log('[DEBUG] Auto-filling creator organization path:', creatorOrg)
      if (creatorOrg.region) onChangeOrg('region', creatorOrg.region)
      if (creatorOrg.state) onChangeOrg('state', creatorOrg.state)
      if (creatorOrg.district) onChangeOrg('district', creatorOrg.district)
      if (creatorOrg.chapter) onChangeOrg('chapter', creatorOrg.chapter)
    }
  }, [user, isGlobal])

  // 1. Fetch Regions
  useEffect(() => {
    if ([ROLES.REGION_DIRECTOR, ROLES.STATE_DIRECTOR, ROLES.DISTRICT_DIRECTOR, ROLES.EXECUTIVE_DIRECTOR, ROLES.CHAPTER_PRESIDENT, ROLES.VICE_PRESIDENT].includes(creatorRole)) {
      const assigned = creatorOrg.assignedRegion
      if (assigned) {
        setRegions([assigned])
        setLoadingRegions(false)
        return
      }
    }
    console.log('[DEBUG] API request: GET /organization/regions')
    setLoadingRegions(true)
    setErrRegions('')
    api.get('/organization/regions')
      .then(res => {
        const list = res.data?.data?.regions || []
        console.log('[DEBUG] API response: GET /organization/regions:', list)
        setRegions(list)
      })
      .catch(err => {
        console.error('[DEBUG] API failed: GET /organization/regions:', err)
        setErrRegions('Unable to load Regions. Please try again.')
      })
      .finally(() => setLoadingRegions(false))
  }, [creatorRole, creatorOrg.assignedRegion])

  // 2. Fetch States
  useEffect(() => {
    if ([ROLES.STATE_DIRECTOR, ROLES.DISTRICT_DIRECTOR, ROLES.EXECUTIVE_DIRECTOR, ROLES.CHAPTER_PRESIDENT, ROLES.VICE_PRESIDENT].includes(creatorRole)) {
      const assigned = creatorOrg.assignedState
      if (assigned) {
        setStates([assigned])
        setLoadingStates(false)
        return
      }
    }
    const currentReg = organization.region || creatorOrg.region
    if (!currentReg) {
      setStates([])
      return
    }
    console.log('[DEBUG] API request: GET /organization/states', { regionId: currentReg })
    setLoadingStates(true)
    setErrStates('')
    api.get('/organization/states', { params: { regionId: currentReg } })
      .then(res => {
        const list = res.data?.data?.states || []
        console.log('[DEBUG] API response: GET /organization/states:', list)
        setStates(list)
      })
      .catch(err => {
        console.error('[DEBUG] API failed: GET /organization/states:', err)
        setErrStates('Unable to load States. Please try again.')
      })
      .finally(() => setLoadingStates(false))
  }, [creatorRole, creatorOrg.assignedState, organization.region, creatorOrg.region])

  // 3. Fetch Districts
  useEffect(() => {
    if ([ROLES.DISTRICT_DIRECTOR, ROLES.EXECUTIVE_DIRECTOR, ROLES.CHAPTER_PRESIDENT, ROLES.VICE_PRESIDENT].includes(creatorRole)) {
      const assigned = creatorOrg.assignedDistrict
      if (assigned) {
        setDistricts([assigned])
        setLoadingDistricts(false)
        return
      }
    }
    const currentState = organization.state || creatorOrg.state
    if (!currentState) {
      setDistricts([])
      return
    }
    console.log('[DEBUG] API request: GET /organization/districts', { stateId: currentState })
    setLoadingDistricts(true)
    setErrDistricts('')
    api.get('/organization/districts', { params: { stateId: currentState } })
      .then(res => {
        const list = res.data?.data?.districts || []
        console.log('[DEBUG] API response: GET /organization/districts:', list)
        setDistricts(list)
      })
      .catch(err => {
        console.error('[DEBUG] API failed: GET /organization/districts:', err)
        setErrDistricts('Unable to load Districts. Please try again.')
      })
      .finally(() => setLoadingDistricts(false))
  }, [creatorRole, creatorOrg.assignedDistrict, organization.state, creatorOrg.state])

  // 4. Fetch Chapters
  useEffect(() => {
    if ([ROLES.EXECUTIVE_DIRECTOR, ROLES.CHAPTER_PRESIDENT, ROLES.VICE_PRESIDENT].includes(creatorRole)) {
      const assigned = creatorOrg.assignedChapter
      if (assigned) {
        setChapters([assigned])
        setLoadingChapters(false)
        return
      }
    }
    const currentDist = organization.district || creatorOrg.district
    if (!currentDist) {
      setChapters([])
      return
    }
    console.log('[DEBUG] API request: GET /organization/chapters', { districtId: currentDist })
    setLoadingChapters(true)
    setErrChapters('')
    api.get('/organization/chapters', { params: { districtId: currentDist } })
      .then(res => {
        const list = res.data?.data?.chapters || []
        console.log('[DEBUG] API response: GET /organization/chapters:', list)
        setChapters(list)
      })
      .catch(err => {
        console.error('[DEBUG] API failed: GET /organization/chapters:', err)
        setErrChapters('Unable to load Chapters. Please try again.')
      })
      .finally(() => setLoadingChapters(false))
  }, [organization.district, creatorOrg.district])

  const getSelectedLabel = (id, optionsList, lockedVal) => {
    if (!id && !lockedVal) return '-'
    if (creatorOrg.assignedRegion && (creatorOrg.assignedRegion._id === id || creatorOrg.assignedRegion.name === id)) {
      return creatorOrg.assignedRegion.name
    }
    if (creatorOrg.assignedState && (creatorOrg.assignedState._id === id || creatorOrg.assignedState.name === id)) {
      return creatorOrg.assignedState.name
    }
    if (creatorOrg.assignedDistrict && (creatorOrg.assignedDistrict._id === id || creatorOrg.assignedDistrict.name === id)) {
      return creatorOrg.assignedDistrict.name
    }
    if (creatorOrg.assignedChapter && (creatorOrg.assignedChapter._id === id || creatorOrg.assignedChapter.name === id)) {
      return creatorOrg.assignedChapter.name
    }
    const match = optionsList.find(opt => opt.value === id || opt._id === id || opt.label === id)
    return match ? match.label || match.name : (lockedVal || id)
  }

  return (
    <div className="space-y-6 w-full">
      <div className="grid gap-4 md:grid-cols-4 w-full">
        {showRegion && (
          <SelectField
            label="Region"
            value={organization.region || ''}
            placeholder="Select Region"
            disabled={isRegionLocked}
            loading={loadingRegions}
            error={errRegions}
            onChange={(val) => {
              onChangeOrg('region', val)
              onChangeOrg('state', '')
              onChangeOrg('district', '')
              onChangeOrg('chapter', '')
            }}
            options={regionsList.map(r => ({ label: r.name, value: r._id }))}
          />
        )}
        {showState && (
          <SelectField
            label="State"
            value={organization.state || ''}
            placeholder="Select State"
            disabled={isStateLocked || !organization.region}
            loading={loadingStates}
            error={errStates}
            onChange={(val) => {
              onChangeOrg('state', val)
              onChangeOrg('district', '')
              onChangeOrg('chapter', '')
            }}
            options={states.map(s => ({ label: s.name, value: s._id }))}
          />
        )}
        {showDistrict && (
          <SelectField
            label="District"
            value={organization.district || ''}
            placeholder="Select District"
            disabled={isDistrictLocked || !organization.state}
            loading={loadingDistricts}
            error={errDistricts}
            onChange={(val) => {
              onChangeOrg('district', val)
              onChangeOrg('chapter', '')
            }}
            options={districts.map(d => ({ label: d.name, value: d._id }))}
          />
        )}
        {showChapter && (
          <SelectField
            label="Chapter"
            value={organization.chapter || ''}
            placeholder="Select Chapter"
            disabled={isChapterLocked || !organization.district}
            loading={loadingChapters}
            error={errChapters}
            onChange={(val) => {
              onChangeOrg('chapter', val)
            }}
            options={chapters.map(c => ({ label: c.name, value: c._id }))}
          />
        )}
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 dark:border-slate-800 dark:bg-slate-900/60 shadow-inner">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#0d4697] dark:text-blue-400 mb-3">Assigned Hierarchy Summary</h4>
        <div className="grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
          {showRegion && <div><span className="text-slate-555 dark:text-slate-400 font-bold">Region:</span> {getSelectedLabel(organization.region, regionsList, creatorOrg.region)}</div>}
          {showState && <div><span className="text-slate-555 dark:text-slate-400 font-bold">State:</span> {getSelectedLabel(organization.state, states, creatorOrg.state)}</div>}
          {showDistrict && <div><span className="text-slate-555 dark:text-slate-400 font-bold">District:</span> {getSelectedLabel(organization.district, districts, creatorOrg.district)}</div>}
          {showChapter && <div><span className="text-slate-555 dark:text-slate-400 font-bold">Chapter:</span> {getSelectedLabel(organization.chapter, chapters, creatorOrg.chapter)}</div>}
        </div>
      </div>
    </div>
  )
}

function getSubordinateLocation(row) {
  const org = row.meta?.adminProfile?.organization || {}
  if (row.role === ROLES.REGION_DIRECTOR) return org.assignedRegion?.name || 'Not Assigned'
  if (row.role === ROLES.STATE_DIRECTOR) return org.assignedState?.name || 'Not Assigned'
  if (row.role === ROLES.DISTRICT_DIRECTOR) {
    return org.assignedDistrict?.name || 'Not Assigned'
  }
  return org.assignedChapter?.name || 'Not Assigned'
}

function getRegionSource(row) {
  const org = row.meta?.adminProfile?.organization || {}
  if (org.assignedRegion?.type === 'region') return 'Organization Locations'
  if (org.region) return 'Legacy / Manual'
  return '-'
}
