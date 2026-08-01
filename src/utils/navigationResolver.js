import { customerFoundationNav, getApplicantSidebarNav, getMemberSidebarNav, getMemberVendorSidebarNav, getRoleBasedSidebarNav, getVendorApplicantSidebarNav, vendorNav, vendorOnboardingNav } from '../constants/navigation'
import { isAdminRole } from '../constants/adminRoles'
import { ROLES } from '../constants/roleConfig.js'
import { getAccountClassification, normalizeRole } from './permissions'

export const NAVIGATION_MODES = Object.freeze({
  ROLE_BASED: 'ROLE_BASED',
  CUSTOMER_PORTAL: 'CUSTOMER_PORTAL',
  MEMBER: 'MEMBER',
  MEMBER_VENDOR: 'MEMBER_VENDOR',
  ONLINE_VENDOR_APPLICANT: 'ONLINE_VENDOR_APPLICANT',
  ONLINE_VENDOR_PENDING: 'ONLINE_VENDOR_PENDING',
  ONLINE_VENDOR_APPROVED: 'ONLINE_VENDOR_APPROVED',
})

const MEMBER_ROLES = new Set([ROLES.CUSTOMER, ROLES.USER, ROLES.VENDOR])

const isAdministrativeRole = (role) => isAdminRole(role) || !MEMBER_ROLES.has(normalizeRole(role))

export const isOnlineVendor = ({ user, marketplaceAccess, onboardingType } = {}) => {
  const account = getAccountClassification(user)
  return account.isOnlineVendor
}

export const isVendorApplicant = ({ user, marketplaceAccess, onboardingType } = {}) => {
  const account = getAccountClassification(user)
  return account.isVendorApplicant
}

export const isMemberVendor = ({ user, marketplaceAccess, onboardingType } = {}) => {
  const account = getAccountClassification(user)
  return account.isMemberVendor
}

export const isMemberOnly = ({ user, marketplaceAccess, onboardingType } = {}) => {
  const account = getAccountClassification(user)
  return account.isMemberOnly
}

export const isMembershipApplicant = ({ user, onboardingType } = {}) => {
  const account = getAccountClassification(user)
  return account.isMemberApplicant
}

export function resolveNavigation({ user, marketplaceAccess, navItems = [], onboardingType: onboardingTypeOverride = '' } = {}) {
  const role = normalizeRole(user?.role)
  const account = getAccountClassification(user)

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
      items: getRoleBasedSidebarNav(user.role, user),
      title: 'Dashboard',
    }
  }

  if (account.isCustomerPortal) {
    return {
      mode: NAVIGATION_MODES.CUSTOMER_PORTAL,
      items: customerFoundationNav,
      title: 'Customer Dashboard',
    }
  }

  if (account.isVendorApplicant) {
    return {
      mode: NAVIGATION_MODES.ONLINE_VENDOR_APPLICANT,
      items: getVendorApplicantSidebarNav(),
      title: 'Vendor Application Status',
    }
  }

  if (account.isOnlineVendor) {
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

  if (account.isMemberApplicant) {
    return {
      mode: NAVIGATION_MODES.MEMBER,
      items: getApplicantSidebarNav(),
      title: 'Membership Application Status',
    }
  }

  if (account.isMemberVendor) {
    return {
      mode: NAVIGATION_MODES.MEMBER_VENDOR,
      items: getMemberVendorSidebarNav(user.role, user),
      title: 'Dashboard',
    }
  }

  if (account.isMemberOnly) {
    return {
      mode: NAVIGATION_MODES.MEMBER,
      items: getMemberSidebarNav(user.role, user),
      title: 'Dashboard',
    }
  }

  return {
    mode: NAVIGATION_MODES.ROLE_BASED,
    items: getRoleBasedSidebarNav(user.role, user),
    title: 'Dashboard',
  }
}
