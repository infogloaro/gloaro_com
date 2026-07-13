const OPERATION_TO_PERMISSION = {
  view: 'canView',
  create: 'canCreate',
  edit: 'canEdit',
  delete: 'canDelete',
  approve: 'canApprove',
  export: 'canExport',
  print: 'canPrint',
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
  vendors: 'vendors',
  vendor_settings: 'vendors',
  vendor_approval: 'vendors',
  business: 'business_wall',
  business_wall: 'business_wall',
  categories: 'settings',
  products: 'marketplace',
  services: 'marketplace',
  marketplace_settings: 'marketplace',
  marketplace_approval: 'marketplace',
  events: 'events',
  training: 'training',
  testimonials: 'reports',
  banners: 'settings',
  faqs: 'settings',
  support: 'settings',
  reports: 'reports',
  reports_center: 'reports',
  analytics: 'reports',
  scorecards: 'reports',
  executive_dashboard: 'reports',
  activity_center: 'reports',
  global_search: 'settings',
  notification_center: 'settings',
  notification_automation: 'settings',
  ai_insights: 'reports',
  settings: 'settings',
  audit_logs: 'reports',
  system_logs: 'settings',
}

const ADMIN_ROUTE_RULES = [
  { path: '/admin', module: 'dashboard', section: 'dashboard' },
  { path: '/admin/legacy-dashboard', module: 'dashboard', section: 'dashboard' },
  { path: '/admin/admin-management', module: 'settings', section: 'admin_management', superadminOnly: true },
  { path: '/admin/organization', module: 'settings', section: 'organization', superadminOnly: true },
  { path: '/admin/assignments', module: 'settings', section: 'assignments', superadminOnly: true },
  { path: '/admin/roles', module: 'settings', section: 'roles', superadminOnly: true },
  { path: '/admin/permissions', module: 'settings', section: 'permissions', superadminOnly: true },
  { path: '/admin/features', module: 'settings', section: 'features', superadminOnly: true },
  { path: '/admin/dashboard-config', module: 'dashboard', section: 'dashboard_config', superadminOnly: true },
  { path: '/admin/module-config', module: 'settings', section: 'module_config', superadminOnly: true },
  { path: '/admin/membership-workflow', module: 'settings', section: 'workflow_settings', superadminOnly: true },
  { path: '/admin/workflow-engine', module: 'settings', section: 'workflow_engine', superadminOnly: true },
  { path: '/admin/users', module: 'members', section: 'users' },
  { path: '/admin/vendors', module: 'vendors', section: 'vendors' },
  { path: '/admin/vendor-settings', module: 'vendors', section: 'vendor_settings' },
  { path: '/admin/vendor-approval-workflow', module: 'vendors', section: 'vendor_approval' },
  { path: '/admin/categories', module: 'settings', section: 'categories' },
  { path: '/admin/business', module: 'business_wall', section: 'business' },
  { path: '/admin/business-wall', module: 'business_wall', section: 'business_wall' },
  { path: '/admin/products', module: 'marketplace', section: 'products' },
  { path: '/admin/services', module: 'marketplace', section: 'services' },
  { path: '/admin/marketplace-settings', module: 'marketplace', section: 'marketplace_settings' },
  { path: '/admin/marketplace-approval', module: 'marketplace', section: 'marketplace_approval' },
  { path: '/admin/memberships', module: 'members', section: 'memberships' },
  { path: '/admin/visitors', module: 'visitors', section: 'visitors' },
  { path: '/admin/visitor-conversion', module: 'visitors', section: 'visitor_conversion' },
  { path: '/admin/attendance', module: 'attendance', section: 'attendance' },
  { path: '/admin/meetings', module: 'meetings', section: 'meetings' },
  { path: '/admin/chapters', module: 'members', section: 'chapters' },
  { path: '/admin/chapter-dashboard', module: 'members', section: 'chapter_dashboard' },
  { path: '/admin/applications', module: 'members', section: 'applications' },
  { path: '/admin/applications/membership', module: 'members', section: 'applications' },
  { path: '/admin/applications/franchise', module: 'members', section: 'applications' },
  { path: '/admin/applications/business-network', module: 'members', section: 'applications' },
  { path: '/admin/applications/vendor', module: 'members', section: 'applications' },
  { path: '/admin/membership-applications', module: 'members', section: 'applications' },
  { path: '/admin/plans', module: 'members', section: 'plans' },
  { path: '/admin/meeting-settings', module: 'meetings', section: 'meetings' },
  { path: '/admin/events', module: 'events', section: 'events' },
  { path: '/admin/training', module: 'training', section: 'training' },
  { path: '/admin/testimonials', module: 'reports', section: 'testimonials' },
  { path: '/admin/referrals', module: 'referrals', section: 'referrals' },
  { path: '/admin/referrals-table', module: 'referrals', section: 'referrals' },
  { path: '/admin/payments', module: 'reports', section: 'payments' },
  { path: '/admin/reviews', module: 'marketplace', section: 'reviews' },
  { path: '/admin/banners', module: 'settings', section: 'banners' },
  { path: '/admin/faqs', module: 'settings', section: 'faqs' },
  { path: '/admin/settings', module: 'settings', section: 'settings' },
  { path: '/admin/support', module: 'settings', section: 'support' },
  { path: '/admin/reports', module: 'reports', section: 'reports' },
  { path: '/admin/reports-center', module: 'reports', section: 'reports_center' },
  { path: '/admin/analytics', module: 'reports', section: 'analytics' },
  { path: '/admin/legacy-analytics', module: 'reports', section: 'analytics' },
  { path: '/admin/scorecards', module: 'reports', section: 'scorecards' },
  { path: '/admin/executive-dashboard', module: 'reports', section: 'executive_dashboard' },
  { path: '/admin/activity', module: 'reports', section: 'activity_center' },
  { path: '/admin/global-search', module: 'settings', section: 'global_search' },
  { path: '/admin/notifications', module: 'settings', section: 'notifications' },
  { path: '/admin/notification-automation', module: 'settings', section: 'notification_automation' },
  { path: '/admin/tasks', module: 'settings', section: 'tasks' },
  { path: '/admin/calendar', module: 'events', section: 'calendar' },
  { path: '/admin/member-journey', module: 'members', section: 'member_journey' },
  { path: '/admin/ai-insights', module: 'reports', section: 'ai_insights' },
  { path: '/admin/broadcast-notifications', module: 'settings', section: 'notifications' },
  { path: '/admin/audit-logs', module: 'reports', section: 'audit_logs' },
  { path: '/admin/system-logs', module: 'settings', section: 'system_logs', superadminOnly: true },
]

const normalizeKey = (value = '') => String(value).trim().toLowerCase().replace(/&/g, '').replace(/\s+/g, '_').replace(/[^a-z0-9_/-]/g, '')

const normalizePath = (pathname = '') => String(pathname).replace(/\/+$/, '') || '/'

export function getRouteRule(pathname = '') {
  const path = normalizePath(pathname)
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
  const isSuperAdmin = user?.role === 'superadmin'
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
    if (!pathname?.startsWith('/admin')) return true

    const rule = getRouteRule(pathname)
    if (!rule) return true
    if (rule.superadminOnly) return false
    if (rule.module && !hasModule(rule.module)) return false
    if (rule.section && !hasSection(rule.module, rule.section)) return false
    return true
  }

  return {
    isSuperAdmin,
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

export function getDashboardRoute(role) {
  const cleanRole = String(role || '').toLowerCase().replace(/\s+/g, '')
  if (cleanRole === 'state_director') return '/state-director/dashboard'
  if (cleanRole === 'district_director') return '/district-director/dashboard'
  if (cleanRole === 'executive_director') return '/chapter-director/dashboard'
  if (cleanRole === 'chapter_president') return '/president/dashboard'
  if (cleanRole === 'vice_president') return '/vice-president/dashboard'
  if (cleanRole === 'secretary') return '/secretary/dashboard'
  if (cleanRole === 'vendor') return '/vendor'
  
  const adminRoles = [
    'superadmin', 'admin', 'franchise_admin', 'ecommerce_admin', 'marketplace_admin',
    'digital_marketing_admin', 'training_admin', 'finance_admin', 'region_director',
    'launch_director', 'direct_consultant', 'operation_vice_president',
    'membership_verification_admin', 'custom_admin'
  ]
  if (adminRoles.includes(cleanRole)) return '/admin'

  return '/member/dashboard'
}

