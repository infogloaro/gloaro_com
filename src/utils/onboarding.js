export const ONBOARDING_TYPES = Object.freeze({
  MEMBER: 'member',
  VENDOR: 'vendor',
})

export const resolveOnboardingType = (value) => {
  const normalized = String(value || '').toLowerCase()
  if (normalized === ONBOARDING_TYPES.VENDOR) return ONBOARDING_TYPES.VENDOR
  if (normalized === ONBOARDING_TYPES.MEMBER) return ONBOARDING_TYPES.MEMBER
  return null
}

export const normalizeRegistrationType = (value) => {
  return String(value || '').toLowerCase() === ONBOARDING_TYPES.VENDOR
    ? ONBOARDING_TYPES.VENDOR
    : ONBOARDING_TYPES.MEMBER
}

export const getEffectiveRegistrationType = (user, fallbackType = '') => {
  const explicitRegistrationType =
    resolveOnboardingType(user?.registrationType) ||
    resolveOnboardingType(user?.onboardingType) ||
    resolveOnboardingType(user?.meta?.onboarding?.registrationType) ||
    resolveOnboardingType(user?.meta?.onboarding?.onboardingType) ||
    resolveOnboardingType(fallbackType)

  if (explicitRegistrationType) {
    return explicitRegistrationType
  }

  const normalizedRole = String(user?.role || '').toLowerCase().replace(/\s+/g, '').replace(/-/g, '_')
  if (normalizedRole === ONBOARDING_TYPES.VENDOR) return ONBOARDING_TYPES.VENDOR
  return ONBOARDING_TYPES.MEMBER
}

export const isVendorOnboarding = (user, fallbackType = '') => {
  return getEffectiveRegistrationType(user, fallbackType) === ONBOARDING_TYPES.VENDOR
}

export const getVendorOnboardingRoutes = (isVendorFlow) => ({
  application: isVendorFlow ? '/vendor/onboarding' : '/member/vendor-application',
  status: isVendorFlow ? '/vendor/onboarding-status' : '/member/vendor-application-status',
})

export const getMemberOnboardingRoutes = (isMemberPortalFlow = false) => ({
  agreement: isMemberPortalFlow ? '/member/membership-agreement' : '/membership-agreement',
  application: isMemberPortalFlow ? '/member/membership-application' : '/membership-application',
  qualification: isMemberPortalFlow ? '/member/membership-qualification' : '/membership-qualification',
  status: '/member/membership-application-status',
})

export const getRegistrationTypeLabel = (registrationType) => {
  return normalizeRegistrationType(registrationType) === ONBOARDING_TYPES.VENDOR ? 'Vendor' : 'User'
}
