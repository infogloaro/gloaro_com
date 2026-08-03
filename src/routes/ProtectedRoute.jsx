import { Navigate, Outlet, useLocation } from 'react-router-dom'
import LoadingScreen from '../components/common/LoadingScreen'
import { useAuth } from '../hooks/useAuth'
import { isAdminRole } from '../constants/adminRoles'
import { storage } from '../utils/storage'
import { ROLES } from '../constants/roleConfig.js'
import { getAccountClassification } from '../utils/permissions'
import { getMemberOnboardingRoutes } from '../utils/onboarding'

const roleMatches = (allowed, actual) => {
  const allowedRole = String(allowed || '').toLowerCase().replace(/\s+/g, '')
  const actualRole = String(actual || '').toLowerCase().replace(/\s+/g, '')
  if (allowedRole === actualRole) return true
  if (allowedRole === ROLES.ADMIN && isAdminRole(actualRole)) return true
  if (allowedRole === ROLES.SUPERADMIN && actualRole === 'super_admin') return true
  if (allowedRole === ROLES.CUSTOMER && actualRole === ROLES.USER) return true
  if (allowedRole === ROLES.USER && actualRole === ROLES.CUSTOMER) return true
  return false
}

export default function ProtectedRoute({
  roles,
  requirePathAccess = false,
  fallback = '/dashboard',
  unauthenticatedMessage = '',
}) {
  const { loading, isAuthenticated, role, permissionsLoading, canAccessPath, user } = useAuth()
  const location = useLocation()
  const account = getAccountClassification(user)
  const memberRoutes = getMemberOnboardingRoutes(true)

  const isHydrating = loading || (storage.getAccessToken() && !user)
  if (isHydrating) return <LoadingScreen label="Checking session..." />
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          error: unauthenticatedMessage || 'Please sign in to continue.',
        }}
      />
    )
  }

  if (account.isOnlineVendor && location.pathname.startsWith('/member/')) {
    return <Navigate to="/vendor" replace />
  }

  if (account.isVendorApplicant && location.pathname === '/member/vendor-application') {
    return <Navigate to="/vendor/onboarding" replace />
  }

  if (account.isVendorApplicant && location.pathname === '/member/vendor-application-status') {
    return <Navigate to="/vendor/onboarding-status" replace />
  }

  if (account.isMemberApplicant) {
    const isAllowedApplicantPath = [
      memberRoutes.agreement,
      memberRoutes.application,
      memberRoutes.qualification,
      memberRoutes.status,
      '/member/profile',
    ].includes(location.pathname)

    if (!isAllowedApplicantPath) {
      const status = String(account.onboardingStatus || '').toLowerCase()
      if (['pending', 'rejected', 'changes_requested'].includes(status)) {
        return <Navigate to={memberRoutes.status} replace />
      }
      return <Navigate to={memberRoutes.agreement} replace />
    }

    const currentStatus = String(account.onboardingStatus || '').toLowerCase()
    if (currentStatus === 'pending' && location.pathname === memberRoutes.application) {
      return <Navigate to={memberRoutes.status} replace />
    }

    return <Outlet />
  }

  if (roles?.length && !roles.some((allowed) => roleMatches(allowed, role))) return <Navigate to="/" replace />
  if (requirePathAccess && permissionsLoading) return <LoadingScreen label="Loading access..." />
  if (requirePathAccess && !canAccessPath(location.pathname)) return <Navigate to={fallback} replace state={{ from: location }} />
  return <Outlet />
}
