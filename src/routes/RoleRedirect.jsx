import { Navigate } from 'react-router-dom'
import LoadingScreen from '../components/common/LoadingScreen'
import { useAuth } from '../hooks/useAuth'
import { getDashboardRoute } from '../utils/permissions'
import { storage } from '../utils/storage'
import { ROLES } from '../constants/roleConfig.js'
import { getEffectiveRegistrationType, getVendorOnboardingRoutes } from '../utils/onboarding'

export default function RoleRedirect() {
  const { loading, user } = useAuth()
  const isHydrating = loading || (storage.getAccessToken() && !user)
  if (isHydrating) return <LoadingScreen label="Loading dashboard..." />
  if (!user) return <Navigate to="/" replace />
  const onboardingType = getEffectiveRegistrationType(user, storage.getOnboardingContext()?.registrationType)
  const vendorRoutes = getVendorOnboardingRoutes(true)

  if (onboardingType === 'member' && user.status === 'pending_approval' && user.role === ROLES.CUSTOMER) {
    return <Navigate to="/membership-agreement" replace />
  }

  if (onboardingType === 'vendor' && user.role === ROLES.CUSTOMER) {
    return <Navigate to={vendorRoutes.application} replace />
  }

  const targetPath = getDashboardRoute(user.role, user)
  return <Navigate to={targetPath} replace />
}
