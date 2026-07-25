import { getApplicantSidebarNav, getMemberSidebarNav, getMemberVendorSidebarNav, getRoleBasedSidebarNav, getVendorApplicantSidebarNav, vendorNav, vendorOnboardingNav } from '../constants/navigation'
import { isAdminRole } from '../constants/adminRoles'
import { ROLES } from '../constants/roleConfig.js'
import { getEffectiveRegistrationType } from './onboarding'
import { normalizeRole } from './permissions'

export const NAVIGATION_MODES = Object.freeze({
  ROLE_BASED: 'ROLE_BASED',
  MEMBER: 'MEMBER',
  MEMBER_VENDOR: 'MEMBER_VENDOR',
  ONLINE_VENDOR_APPLICANT: 'ONLINE_VENDOR_APPLICANT',
  ONLINE_VENDOR_PENDING: 'ONLINE_VENDOR_PENDING',
  ONLINE_VENDOR_APPROVED: 'ONLINE_VENDOR_APPROVED',
})

const MEMBER_ROLES = new Set([ROLES.CUSTOMER, ROLES.USER, ROLES.VENDOR])

const isAdministrativeRole = (role) => isAdminRole(role) || !MEMBER_ROLES.has(normalizeRole(role))

export const isOnlineVendor = ({ user, marketplaceAccess, onboardingType } = {}) => {
  if (!user?.role) return false
  const membershipStatus = String(user?.onboardingStatus || user?.status || '').toLowerCase()
  const isApprovedMarketplaceAccount = marketplaceAccess === 'APPROVED' || user?.vendorProfile?.status === 'approved'
  return MEMBER_ROLES.has(normalizeRole(user.role)) &&
    getEffectiveRegistrationType(user, onboardingType) === ROLES.VENDOR &&
    membershipStatus === 'approved' &&
    isApprovedMarketplaceAccount
}

export const isVendorApplicant = ({ user, marketplaceAccess, onboardingType } = {}) => {
  if (!user?.role) return false
  const role = normalizeRole(user.role)
  const isApprovedMarketplaceAccount = marketplaceAccess === 'APPROVED' || user?.vendorProfile?.status === 'approved'
  return getEffectiveRegistrationType(user, onboardingType) === ROLES.VENDOR &&
    !isApprovedMarketplaceAccount &&
    ([ROLES.CUSTOMER, ROLES.USER, ROLES.VENDOR].includes(role))
}

export const isMemberVendor = ({ user, marketplaceAccess, onboardingType } = {}) => {
  if (!user?.role) return false
  const membershipStatus = String(user?.onboardingStatus || user?.status || '').toLowerCase()
  const isApprovedMarketplaceAccount = marketplaceAccess === 'APPROVED' || user?.vendorProfile?.status === 'approved'
  return MEMBER_ROLES.has(normalizeRole(user.role)) &&
    getEffectiveRegistrationType(user, onboardingType) !== ROLES.VENDOR &&
    membershipStatus === 'approved' &&
    isApprovedMarketplaceAccount
}

export const isMemberOnly = ({ user, marketplaceAccess, onboardingType } = {}) => {
  if (!user?.role) return false
  const membershipStatus = String(user?.onboardingStatus || user?.status || '').toLowerCase()
  return MEMBER_ROLES.has(normalizeRole(user.role)) &&
    getEffectiveRegistrationType(user, onboardingType) !== ROLES.VENDOR &&
    membershipStatus === 'approved' &&
    marketplaceAccess !== 'APPROVED'
}

export const isMembershipApplicant = ({ user, onboardingType } = {}) => {
  if (!user?.role) return false
  const membershipStatus = String(user?.onboardingStatus || user?.status || '').toLowerCase()
  return MEMBER_ROLES.has(normalizeRole(user.role)) &&
    getEffectiveRegistrationType(user, onboardingType) !== ROLES.VENDOR &&
    membershipStatus !== 'approved'
}

export function resolveNavigation({ user, marketplaceAccess, navItems = [], onboardingType: onboardingTypeOverride = '' } = {}) {
  const role = normalizeRole(user?.role)
  const onboardingType = getEffectiveRegistrationType(
    user,
    onboardingTypeOverride || user?.meta?.onboarding?.registrationType
  )

  if (!user?.role) {
    return {
      mode: NAVIGATION_MODES.ROLE_BASED,
      items: navItems,
      title: 'Dashboard',
    }
  }

  if (isAdministrativeRole(role)) {
    return {
      mode: NAVIGATION_MODES.ROLE_BASED,
      items: getRoleBasedSidebarNav(user.role),
      title: 'Dashboard',
    }
  }

  if (isVendorApplicant({ user, marketplaceAccess, onboardingType })) {
    return {
      mode: NAVIGATION_MODES.ONLINE_VENDOR_APPLICANT,
      items: getVendorApplicantSidebarNav(),
      title: 'Vendor Application Status',
    }
  }

  if (isOnlineVendor({ user, marketplaceAccess, onboardingType })) {
    if (marketplaceAccess === 'APPROVED') {
      return {
        mode: NAVIGATION_MODES.ONLINE_VENDOR_APPROVED,
        items: vendorNav,
        title: 'Vendor Marketplace',
      }
    }

    return {
      mode: NAVIGATION_MODES.ONLINE_VENDOR_PENDING,
      items: vendorOnboardingNav,
      title: 'Vendor Onboarding',
    }
  }

  if (isMembershipApplicant({ user, onboardingType })) {
    return {
      mode: NAVIGATION_MODES.MEMBER,
      items: getApplicantSidebarNav(),
      title: 'Membership Application Status',
    }
  }

  if (isMemberVendor({ user, marketplaceAccess, onboardingType })) {
    return {
      mode: NAVIGATION_MODES.MEMBER_VENDOR,
      items: getMemberVendorSidebarNav(user.role),
      title: 'Dashboard',
    }
  }

  if (isMemberOnly({ user, marketplaceAccess, onboardingType })) {
    return {
      mode: NAVIGATION_MODES.MEMBER,
      items: getMemberSidebarNav(user.role),
      title: 'Dashboard',
    }
  }

  return {
    mode: NAVIGATION_MODES.ROLE_BASED,
    items: getRoleBasedSidebarNav(user.role),
    title: 'Dashboard',
  }
}
