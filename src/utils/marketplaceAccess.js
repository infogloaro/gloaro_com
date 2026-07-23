import { ROLES } from '../constants/roleConfig.js'
export function getMarketplaceAccess(user, vendorApplication, vendorProfile) {
  if (!user) return 'NOT_APPLIED'
  
  // Only apply constraint checks to member roles (customer, user, vendor)
  if (![ROLES.CUSTOMER, ROLES.USER, ROLES.VENDOR].includes(user.role)) {
    return 'APPROVED'
  }

  const profile = vendorProfile || user.vendorProfile || {}
  const profileStatus = profile.status || ''

  const isApproved = 
    user.role === ROLES.VENDOR || 
    profileStatus === 'approved' || 
    vendorApplication?.status === 'approved' || 
    vendorApplication?.status === 'verified'

  if (isApproved) {
    return 'APPROVED'
  }

  if (vendorApplication && vendorApplication.status) {
    return 'PENDING'
  }

  return 'NOT_APPLIED'
}
