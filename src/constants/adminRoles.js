import { ROLES } from './roleConfig.js'
export const ADMIN_ROLE_OPTIONS = [
  [ROLES.SUPERADMIN, 'Super Admin'],
  [ROLES.ADMIN, 'Admin'],
  [ROLES.REGION_DIRECTOR, 'Region Director'],
  [ROLES.STATE_DIRECTOR, 'State Director'],
  [ROLES.DISTRICT_DIRECTOR, 'District Director'],
  [ROLES.EXECUTIVE_DIRECTOR, 'District Unit Chairman'],
  [ROLES.LAUNCH_DIRECTOR, 'Direct Consultant'],
  [ROLES.DIRECT_CONSULTANT, 'Launch Director'],
  [ROLES.CHAPTER_PRESIDENT, 'Unit Chairman'],
  [ROLES.VICE_PRESIDENT, 'Unit Vice Chairman'],
  [ROLES.SECRETARY, 'Coordinator'],
  [ROLES.FRANCHISE_ADMIN, 'Franchise Admin'],
  [ROLES.ECOMMERCE_ADMIN, 'Ecommerce Admin'],
  [ROLES.MARKETPLACE_ADMIN, 'Marketplace Admin'],
  [ROLES.DIGITAL_MARKETING_ADMIN, 'Digital Marketing Admin'],
  [ROLES.TRAINING_ADMIN, 'Training Admin'],
  [ROLES.FINANCE_ADMIN, 'Finance Admin'],
  [ROLES.OPERATION_VICE_PRESIDENT, 'Operation Unit Vice Chairman'],
  [ROLES.MEMBERSHIP_VERIFICATION_ADMIN, 'Membership Verification Admin'],
  [ROLES.CUSTOM_ADMIN, 'Custom Admin'],
]

export const ADMIN_ROLE_VALUES = [ROLES.ADMIN, ...ADMIN_ROLE_OPTIONS.map(([value]) => value)]

export const isAdminRole = (role) => ADMIN_ROLE_VALUES.includes(String(role || '').toLowerCase())

export const roleLabel = (role = '') => ADMIN_ROLE_OPTIONS.find(([value]) => value === role)?.[1] || String(role).replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
