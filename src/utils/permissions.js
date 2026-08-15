import { ROLES } from '../constants/roleConfig.js'
import { isAdminRole } from '../constants/adminRoles.js'
import { getEffectiveRegistrationType, resolveOnboardingType } from './onboarding'
const OPERATION_TO_PERMISSION = {
  view: 'canView',
  create: 'canCreate',
  edit: 'canEdit',
  delete: 'canDelete',
  approve: 'canApprove',
  export: 'canExport',
  print: 'canPrint',
}

export function normalizeRole(role = '') {
  const cleanRole = String(role || '').toLowerCase().replace(/\s+/g, '').replace(/-/g, '_')
  if (cleanRole === ROLES.CHAPTER_DIRECTOR) return ROLES.EXECUTIVE_DIRECTOR
  return cleanRole
}

const getOrganizationChapterId = (entity) => {
  return (
    entity?.meta?.adminProfile?.organization?.chapter ||
    entity?.meta?.memberProfile?.organization?.chapter ||
    entity?.chapterId?._id ||
    entity?.chapterId ||
    entity?.chapter ||
    null
  )
}

export function canReviewMembershipApplication(user, application = null, action = 'review') {
  const role = normalizeRole(user?.role)
  if ([ROLES.SUPERADMIN, ROLES.ADMIN].includes(role)) return true

  const userChapterId = getOrganizationChapterId(user)
  const applicationChapterId = getOrganizationChapterId(application)
  if (!userChapterId || !applicationChapterId) return false
  if (String(userChapterId) !== String(applicationChapterId)) return false

  if (role === ROLES.EXECUTIVE_DIRECTOR) {
    return ['review', 'status', 'approve', 'reject', 'changes_requested'].includes(action)
  }

  if (role === ROLES.VICE_PRESIDENT) {
    return ['review', 'status', 'documents_verified', 'under_review', 'approve', 'reject', 'changes_requested'].includes(action)
  }

  return false
}

const SIDEBAR_ALIASES = {
  dashboard: 'dashboard',
  organization: 'settings',
  admin_management: 'settings',
  assignments: 'settings',
  roles: 'settings',
  permissions: 'settings',
  feature_management: 'settings',
  dashboard_config: 'dashboard',
  module_config: 'settings',
  workflow_settings: 'settings',
  workflow_engine: 'settings',
  tasks: 'settings',
  calendar: 'events',
  memberships: 'members',
  membership_plans: 'members',
  visitors: 'visitors',
  visitor_conversion: 'visitors',
  attendance: 'attendance',
  meetings: 'meetings',
  chapters: 'members',
  referrals: 'referrals',
  users: 'members',
  vendors: 'marketplace',
  vendor_settings: 'marketplace',
  vendor_approval: 'marketplace',
  vendor_category_approvals: 'marketplace',
  business: 'business_wall',
  business_wall: 'business_wall',
  categories: 'settings',
  products: 'marketplace',
  services: 'marketplace',
  marketplace_approval: 'marketplace',
  events: 'events',
  training: 'training',
  testimonials: 'reports',
  banners: 'settings',
  faqs: 'settings',
  support: 'settings',
  reports: 'reports',
  reports_center: 'reports',
  scorecards: 'reports',
  enterprise_scorecard: 'reports',
  executive_dashboard: 'reports',
  activity_center: 'reports',
  global_search: 'settings',
  notification_center: 'settings',
  notification_automation: 'settings',
  ai_insights: 'reports',
  settings: 'settings',
  audit_logs: 'reports',
  system_logs: 'reports',
}

const ADMIN_ROUTE_RULES = [
  { path: '/dashboard', module: 'dashboard', section: 'dashboard' },
  { path: '/legacy-dashboard', module: 'dashboard', section: 'dashboard' },
  { path: '/admin-management', module: 'settings', section: 'admin_management', superadminOnly: true },
  { path: '/organization', module: 'settings', section: 'organization', superadminOnly: true },
  { path: '/assignments', module: 'settings', section: 'assignments', superadminOnly: true },
  { path: '/roles', module: 'settings', section: 'roles', superadminOnly: true },
  { path: '/permissions', module: 'settings', section: 'permissions', superadminOnly: true },
  { path: '/features', module: 'settings', section: 'features', superadminOnly: true },
  { path: '/dashboard-config', module: 'dashboard', section: 'dashboard_config', superadminOnly: true },
  { path: '/module-config', module: 'settings', section: 'module_config', superadminOnly: true },
  { path: '/membership-workflow', module: 'settings', section: 'workflow_settings', superadminOnly: true },
  { path: '/workflow-engine', module: 'settings', section: 'workflow_engine', superadminOnly: true },
  { path: '/users', module: 'members', section: 'users' },
  { path: '/vendors', module: 'marketplace', section: 'vendors' },
  { path: '/vendor-settings', module: 'marketplace', section: 'vendor_settings' },
  { path: '/vendor-approval-workflow', module: 'marketplace', section: 'vendor_approval' },
  { path: '/vendor-category-approvals', module: 'marketplace', section: 'vendor_category_approvals' },
  { path: '/marketplace/categories', module: 'settings', section: 'categories' },
  { path: '/business', module: 'business_wall', section: 'business' },
  { path: '/business-wall', module: 'business_wall', section: 'business_wall' },
  { path: '/products', module: 'marketplace', section: 'products' },
  { path: '/services', module: 'marketplace', section: 'services' },
  { path: '/marketplace-approval', module: 'marketplace', section: 'marketplace_approval' },
  { path: '/memberships', module: 'members', section: 'memberships' },
  { path: '/visitors', module: 'visitors', section: 'visitors' },
  { path: '/visitor-conversion', module: 'visitors', section: 'visitor_conversion' },
  { path: '/attendance', module: 'attendance', section: 'attendance' },
  { path: '/meetings', module: 'meetings', section: 'meetings' },
  { path: '/chapters', module: 'members', section: 'chapters' },
  { path: '/chapter-dashboard', module: 'members', section: 'chapter_dashboard' },
  { path: '/applications', module: 'members', section: 'applications' },
  { path: '/applications/membership', module: 'members', section: 'applications' },
  { path: '/applications/franchise', module: 'members', section: 'applications' },
  { path: '/applications/business-network', module: 'members', section: 'applications' },
  { path: '/applications/vendor', module: 'members', section: 'applications' },
  { path: '/membership-applications', module: 'members', section: 'applications' },
  { path: '/plans', module: 'members', section: 'plans' },
  { path: '/meeting-settings', module: 'meetings', section: 'meetings' },
  { path: '/events', module: 'events', section: 'events' },
  { path: '/training', module: 'training', section: 'training' },
  { path: '/testimonials', module: 'reports', section: 'testimonials' },
  { path: '/referral-management', module: 'referrals', section: 'referrals' },
  { path: '/referrals', module: 'referrals', section: 'referrals' },
  { path: '/referrals-table', module: 'referrals', section: 'referrals' },
  { path: '/payments', module: 'reports', section: 'payments' },
  { path: '/reviews', module: 'marketplace', section: 'reviews' },
  { path: '/banners', module: 'marketplace', section: 'banners' },
  { path: '/leaders', module: 'marketplace', section: 'leaders' },
  { path: '/gallery', module: 'marketplace', section: 'gallery' },
  { path: '/faqs', module: 'settings', section: 'faqs' },
  { path: '/settings', module: 'settings', section: 'settings' },
  { path: '/support', module: 'settings', section: 'support' },
  { path: '/reports', module: 'reports', section: 'reports' },
  { path: '/reports-center', module: 'reports', section: 'reports_center' },
  { path: '/analytics', module: 'analytics', section: 'analytics' },
  { path: '/legacy-analytics', module: 'analytics', section: 'analytics' },
  { path: '/scorecard', module: 'reports', section: 'enterprise_scorecard' },
  { path: '/scorecards', module: 'reports', section: 'scorecards' },
  { path: '/executive-dashboard', module: 'reports', section: 'executive_dashboard' },
  { path: '/activity', module: 'reports', section: 'activity_center' },
  { path: '/global-search', module: 'settings', section: 'global_search' },
  { path: '/notifications', module: 'settings', section: 'notifications' },
  { path: '/notification-automation', module: 'settings', section: 'notification_automation' },
  { path: '/network', module: 'community', section: 'network' },
  { path: '/wall', module: 'community', section: 'chapter' },
  { path: '/chat', module: 'chat', section: 'direct_messages' },
  { path: '/tasks', module: 'settings', section: 'tasks' },
  { path: '/calendar', module: 'events', section: 'calendar' },
  { path: '/member-journey', module: 'members', section: 'member_journey' },
  { path: '/ai-insights', module: 'reports', section: 'ai_insights' },
  { path: '/audit-logs', module: 'reports', section: 'audit_logs' },
  { path: '/system-logs', module: 'reports', section: 'audit_logs' },
]

const normalizeKey = (value = '') => String(value).trim().toLowerCase().replace(/&/g, '').replace(/\s+/g, '_').replace(/[^a-z0-9_/-]/g, '')

const normalizePath = (pathname = '') => String(pathname).replace(/\/+$/, '') || '/'

export function getRouteRule(pathname = '') {
  let path = normalizePath(pathname)
  if (path.startsWith('/super-admin')) {
    path = path.replace(/^\/super-admin/, '')
  } else if (path.startsWith('/admin')) {
    path = path.replace(/^\/admin/, '')
  }
  if (path === '') path = '/dashboard'
  return ADMIN_ROUTE_RULES.find((rule) => rule.path === path) || null
}

export function getSidebarModuleKey(label = '') {
  const key = normalizeKey(label)
  return SIDEBAR_ALIASES[key] || key
}

export function translatePermissionsToConfig(permissionsArray = []) {
  const modules = new Set()
  const sidebar = []
  const widgets = []
  const features = {}
  const operations = {}
  const permissions = {}

  for (const perm of permissionsArray) {
    const parts = perm.split('.')
    if (parts.length < 2) continue
    const [mod, act] = parts

    modules.add(mod)

    if (!features[mod]) {
      features[mod] = {}
    }
    if (!operations[mod]) {
      operations[mod] = {}
    }
    if (!permissions[mod]) {
      permissions[mod] = {}
    }

    const canKey = OPERATION_TO_PERMISSION[act] || `can${act.charAt(0).toUpperCase()}${act.slice(1)}`
    features[mod][canKey] = true
    permissions[mod][canKey] = true
    operations[mod][act] = true

    if (act === 'view') {
      features[mod].enabled = true
      sidebar.push({
        id: mod,
        label: mod.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
        enabled: true
      })
      widgets.push({
        id: mod,
        title: mod.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
        enabled: true
      })
    }
  }

  return {
    modules: Array.from(modules),
    sidebar,
    widgets,
    features,
    permissions,
    operations,
  }
}

export function createPermissionHelpers(user, permissionConfig = null) {
  const role = normalizeRole(user?.role)
  const isSuperAdmin = role === ROLES.SUPERADMIN
  const isCoreAdmin = role === ROLES.ADMIN || role === ROLES.SUPERADMIN
  let config = permissionConfig
  if (Array.isArray(permissionConfig)) {
    config = translatePermissionsToConfig(permissionConfig)
  }
  const features = config?.features || {}
  const modules = new Set((config?.modules || Object.keys(features || {})).map(normalizeKey))
  const sidebarItems = new Set(
    (config?.sidebar || [])
      .map((item) => normalizeKey(typeof item === 'string' ? item : item?.id))
      .filter(Boolean)
  )
  const widgets = new Set(
    (config?.widgets || [])
      .map((item) => normalizeKey(typeof item === 'string' ? item : item?.id))
      .filter(Boolean)
  )
  const hasConfigData = modules.size > 0
  const sections = config?.sections || {}
  const operations = config?.operations || {}
  const permissions = config?.permissions || {}
  const workflowPermissions = config?.workflowPermissions || {}

  const hasModule = (module) => {
    if (isSuperAdmin) return true
    return modules.has(normalizeKey(module))
  }

  const hasSection = (module, section) => {
    if (isSuperAdmin) return true
    if (!hasModule(module)) return false
    const allowedSections = sections?.[normalizeKey(module)]
    if (!Array.isArray(allowedSections) || !allowedSections.length) return true
    return allowedSections.map(normalizeKey).includes(normalizeKey(section))
  }

  const hasOperation = (module, operation) => {
    if (isSuperAdmin) return true
    if (!hasModule(module)) return false

    const normalizedModule = normalizeKey(module)
    const normalizedOperation = normalizeKey(operation)
    const operationValue = operations?.[normalizedModule]?.[normalizedOperation]
    if (typeof operationValue === 'boolean') return operationValue

    const permissionKey = OPERATION_TO_PERMISSION[normalizedOperation]
    if (permissionKey) {
      const permissionValue = permissions?.[normalizedModule]?.[permissionKey]
      if (typeof permissionValue === 'boolean') return permissionValue
      const featureValue = features?.[normalizedModule]?.[permissionKey]
      if (typeof featureValue === 'boolean') return featureValue
    }

    return normalizedOperation === 'view'
  }

  const hasPermission = (module, permissionKey) => {
    if (isSuperAdmin) return true
    if (!hasModule(module)) return false
    const normalizedModule = normalizeKey(module)
    const key = String(permissionKey || '')
    if (typeof permissions?.[normalizedModule]?.[key] === 'boolean') return permissions[normalizedModule][key]
    if (typeof features?.[normalizedModule]?.[key] === 'boolean') return features[normalizedModule][key]
    const normalizedOperation = normalizeKey(permissionKey).replace(/^can_?/, '')
    return hasOperation(module, normalizedOperation)
  }

  const hasWorkflow = (workflow, action) => {
    if (isSuperAdmin) return true
    const allowedWorkflow = workflowPermissions?.[normalizeKey(workflow)]
    if (!allowedWorkflow) return hasModule(workflow)
    return allowedWorkflow?.[normalizeKey(action)] === true
  }

  const hasWidget = (widget) => {
    if (isSuperAdmin) return true
    if (!widgets.size) return true
    return widgets.has(normalizeKey(widget))
  }

  const hasSidebar = (item) => {
    if (isSuperAdmin) return true
    if (!sidebarItems.size) return true
    return sidebarItems.has(normalizeKey(item)) || sidebarItems.has(getSidebarModuleKey(item))
  }

  const canAccessPath = (pathname) => {
    if (isSuperAdmin) return true
    if (!pathname?.startsWith('/admin') && !pathname?.startsWith('/super-admin')) return true

    const rule = getRouteRule(pathname)
    if (!rule) return true
    if (isCoreAdmin && ['/network', '/wall', '/chat', '/notifications'].includes(rule.path)) return true
    if (rule.superadminOnly) return false
    if (hasConfigData) {
      if (rule.module && !hasModule(rule.module)) return false
      if (rule.section && !hasSection(rule.module, rule.section)) return false
    }
    return true
  }

  return {
    isSuperAdmin,
    hasConfigData,
    hasModule,
    hasSection,
    hasPermission,
    hasOperation,
    hasWorkflow,
    hasWidget,
    hasSidebar,
    canAccessPath,
  }
}

export function getAdminBasePath(role) {
  const cleanRole = normalizeRole(role)
  if (cleanRole === ROLES.SUPERADMIN) return '/super-admin'
  return '/admin'
}

export function buildAdminRoute(role, relativePath) {
  const basePath = getAdminBasePath(role)
  const normalizedRel = relativePath.startsWith('/') ? relativePath : `/${relativePath}`
  return `${basePath}${normalizedRel}`
}

export function getExplicitRegistrationType(user = null) {
  return (
    resolveOnboardingType(user?.registrationType) ||
    resolveOnboardingType(user?.onboardingType) ||
    resolveOnboardingType(user?.meta?.onboarding?.registrationType) ||
    resolveOnboardingType(user?.meta?.onboarding?.onboardingType) ||
    (normalizeRole(user?.role) === ROLES.VENDOR ? 'vendor' : 'member')
  )
}

export function getAccountClassification(user = null) {
  const isCustomerPortal = Boolean(user?.meta?.customerPortal?.isolated)
  const registrationType = getExplicitRegistrationType(user)
  const vendorProfileStatus = String(user?.vendorProfile?.status || '').toLowerCase()
  const onboardingStatus = String(user?.onboardingStatus || '').toLowerCase()
  const vendorApproved = vendorProfileStatus === 'approved'
  const isMemberApproved = onboardingStatus === 'approved'
  const isAdminOrLeadership = isAdminRole(user?.role)

  return {
    registrationType,
    vendorApproved,
    onboardingStatus,
    isCustomerPortal,
    isOnlineVendor: !isCustomerPortal && registrationType === 'vendor' && vendorApproved,
    isVendorApplicant: !isCustomerPortal && registrationType === 'vendor' && !vendorApproved,
    isMemberVendor: !isCustomerPortal && registrationType === 'member' && vendorApproved,
    isMemberOnly: !isCustomerPortal && (isAdminOrLeadership || (registrationType === 'member' && !vendorApproved && isMemberApproved)),
    isMemberApplicant: !isCustomerPortal && !isAdminOrLeadership && registrationType === 'member' && !vendorApproved && !isMemberApproved,
  }
}

export function getDashboardRoute(role, user = null) {
  const cleanRole = normalizeRole(role)
  const account = getAccountClassification(user)
  if (account.isCustomerPortal) return '/customer/dashboard'

  const adminRoles = [
    ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.FRANCHISE_ADMIN, ROLES.ECOMMERCE_ADMIN, ROLES.MARKETPLACE_ADMIN,
    ROLES.DIGITAL_MARKETING_ADMIN, ROLES.TRAINING_ADMIN, ROLES.FINANCE_ADMIN,
    ROLES.OPERATION_VICE_PRESIDENT,
    ROLES.MEMBERSHIP_VERIFICATION_ADMIN, ROLES.CUSTOM_ADMIN
  ]
  if (adminRoles.includes(cleanRole)) {
    return buildAdminRoute(cleanRole, '/dashboard')
  }

  if (cleanRole === ROLES.REGION_DIRECTOR) return '/region-director/dashboard'
  if (cleanRole === ROLES.STATE_DIRECTOR) return '/state-director/dashboard'
  if (cleanRole === ROLES.DISTRICT_DIRECTOR) return '/district-director/dashboard'
  if (cleanRole === ROLES.EXECUTIVE_DIRECTOR) return '/chapter-director/dashboard'
  if (cleanRole === ROLES.CHAPTER_PRESIDENT) return '/president/dashboard'
  if (cleanRole === ROLES.VICE_PRESIDENT) return '/vice-president/dashboard'
  if (cleanRole === ROLES.SECRETARY) return '/secretary/dashboard'
  if (cleanRole === ROLES.LAUNCH_DIRECTOR) return '/launch-director/dashboard'
  if (cleanRole === ROLES.DIRECT_CONSULTANT) return '/direct-consultant/dashboard'
  if (account.isOnlineVendor) return '/vendor'
  if (account.isVendorApplicant) return '/vendor/onboarding-status'
  if (account.isMemberVendor || account.isMemberOnly) return '/member/dashboard'
  if (account.isMemberApplicant || ([ROLES.CUSTOMER, ROLES.USER].includes(cleanRole) && account.onboardingStatus !== 'approved')) {
    const status = String(account.onboardingStatus || '').toLowerCase()
    if (['pending', 'rejected', 'changes_requested'].includes(status)) {
      return '/member/membership-application-status'
    }
    return '/member/membership-agreement'
  }

  return '/member/dashboard'
}
