import { ROLES } from '../constants/roleConfig'
import { normalizeRole } from './permissions'
import { getCommunityNotificationPath } from './communityNotifications'

const rolePrefixes = {
  [ROLES.SUPERADMIN]: '/super-admin',
  [ROLES.ADMIN]: '/admin',
  [ROLES.REGION_DIRECTOR]: '/region-director',
  [ROLES.STATE_DIRECTOR]: '/state-director',
  [ROLES.DISTRICT_DIRECTOR]: '/district-director',
  [ROLES.EXECUTIVE_DIRECTOR]: '/chapter-director',
  [ROLES.LAUNCH_DIRECTOR]: '/launch-director',
  [ROLES.DIRECT_CONSULTANT]: '/direct-consultant',
  [ROLES.CHAPTER_PRESIDENT]: '/president',
  [ROLES.VICE_PRESIDENT]: '/vice-president',
  [ROLES.SECRETARY]: '/secretary',
  [ROLES.CUSTOMER]: '/member',
  [ROLES.USER]: '/member',
  [ROLES.VENDOR]: '/member',
}

const protectedPrefixes = Object.values(rolePrefixes)

const isAdminPath = (path = '') => path.startsWith('/admin') || path.startsWith('/super-admin')

const rawDestination = (item = {}, user) => {
  const data = item.data || item.metadata || {}
  const communityPath = getCommunityNotificationPath(item, user)
  return item.actionUrl || item.link || data.actionUrl || data.link || communityPath || ''
}

const prefixFor = (user) => rolePrefixes[normalizeRole(user?.role)] || '/member'

const routeForModule = (item = {}, user) => {
  const role = normalizeRole(user?.role)
  const prefix = prefixFor(user)
  const type = String(item.type || '')
  const module = String(item.module || item.category || '')

  if (type.includes('community') || module === 'community') {
    return getCommunityNotificationPath(item, user) || `${prefix}/wall`
  }

  if (type.includes('membership') || module === 'membership') {
    if ([ROLES.CUSTOMER, ROLES.USER, ROLES.VENDOR].includes(role)) return '/member/membership-application-status'
    if (role === ROLES.VICE_PRESIDENT) return '/vice-president/membership-applications'
    if (role === ROLES.EXECUTIVE_DIRECTOR) return '/chapter-director/membership-applications'
    if ([ROLES.SUPERADMIN, ROLES.ADMIN].includes(role)) return `${prefix}/membership-applications`
    return `${prefix}/members`
  }

  if (type.includes('vendor') || module === 'marketplace') {
    if (role === ROLES.VENDOR) return '/vendor/profile'
    if ([ROLES.CUSTOMER, ROLES.USER].includes(role)) return '/member/dashboard/my-business'
    if (role === ROLES.VICE_PRESIDENT) return '/vice-president/vendor-applications'
    if (role === ROLES.EXECUTIVE_DIRECTOR) return '/chapter-director/vendor-applications'
    if ([ROLES.SUPERADMIN, ROLES.ADMIN].includes(role)) return `${prefix}/vendors`
    return `${prefix}/vendors`
  }

  if (type.includes('meeting') || module === 'meetings') return `${prefix}/meetings`
  if (type.includes('attendance') || module === 'attendance') return `${prefix}/attendance`
  if (type.includes('payment') || module === 'payments') {
    if (role === ROLES.VENDOR) return '/vendor/payments'
    if ([ROLES.CUSTOMER, ROLES.USER].includes(role)) return '/member/dashboard/payments'
    if ([ROLES.SUPERADMIN, ROLES.ADMIN].includes(role)) return `${prefix}/payments`
  }
  if (type.includes('lead')) {
    if (role === ROLES.VENDOR) return '/vendor/leads'
    if ([ROLES.CUSTOMER, ROLES.USER].includes(role)) return '/member/dashboard/leads'
  }

  return ''
}

const pathMatchesRole = (path = '', user) => {
  const role = normalizeRole(user?.role)
  const currentPrefix = prefixFor(user)
  const matchingProtectedPrefix = protectedPrefixes.find((prefix) => path === prefix || path.startsWith(`${prefix}/`))

  if (!matchingProtectedPrefix) return true
  if (path.startsWith('/member/dashboard') && [ROLES.CUSTOMER, ROLES.USER, ROLES.VENDOR].includes(role)) return true
  if (path.startsWith('/membership') && [ROLES.CUSTOMER, ROLES.USER, ROLES.VENDOR].includes(role)) return true
  if (path.startsWith('/vendor') && role === ROLES.VENDOR) return true
  return matchingProtectedPrefix === currentPrefix
}

export function resolveNotificationNavigation(item, user, { canAccessPath } = {}) {
  const directPath = rawDestination(item, user)
  const fallbackPath = routeForModule(item, user)
  const candidates = [directPath, fallbackPath].filter(Boolean)

  for (const candidate of candidates) {
    if (!candidate || candidate === '#') continue
    if (/^https?:\/\//i.test(candidate)) return { action: 'navigate', path: candidate, external: true }
    if (!candidate.startsWith('/')) continue
    if (!pathMatchesRole(candidate, user)) continue
    if (isAdminPath(candidate) && canAccessPath && !canAccessPath(candidate)) continue
    return { action: 'navigate', path: candidate }
  }

  return {
    action: 'details',
    reason: directPath ? 'unavailable' : 'informational',
  }
}
