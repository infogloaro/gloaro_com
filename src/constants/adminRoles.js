export const ADMIN_ROLE_OPTIONS = [
  ['superadmin', 'Super Admin'],
  ['franchise_admin', 'Franchise Admin'],
  ['ecommerce_admin', 'Ecommerce Admin'],
  ['marketplace_admin', 'Marketplace Admin'],
  ['digital_marketing_admin', 'Digital Marketing Admin'],
  ['training_admin', 'Training Admin'],
  ['finance_admin', 'Finance Admin'],
  ['state_director', 'State Director'],
  ['area_director', 'Area Director'],
  ['executive_director', 'Executive Director'],
  ['launch_director', 'Launch Director'],
  ['direct_consultant', 'Direct Consultant'],
  ['operation_vice_president', 'Operation Vice President'],
  ['membership_verification_admin', 'Membership Verification Admin'],
  ['custom_admin', 'Custom Admin'],
]

export const ADMIN_ROLE_VALUES = ['admin', ...ADMIN_ROLE_OPTIONS.map(([value]) => value)]

export const isAdminRole = (role) => ADMIN_ROLE_VALUES.includes(String(role || '').toLowerCase())

export const roleLabel = (role = '') => ADMIN_ROLE_OPTIONS.find(([value]) => value === role)?.[1] || String(role).replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
