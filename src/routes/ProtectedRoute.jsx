import { Navigate, Outlet, useLocation } from 'react-router-dom'
import LoadingScreen from '../components/common/LoadingScreen'
import { useAuth } from '../hooks/useAuth'
import { isAdminRole } from '../constants/adminRoles'
import { storage } from '../utils/storage'
import { ROLES } from '../constants/roleConfig.js'

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

export default function ProtectedRoute({ roles, requirePathAccess = false, fallback = '/dashboard' }) {
  const { loading, isAuthenticated, role, permissionsLoading, canAccessPath, user } = useAuth()
  const location = useLocation()

  const isHydrating = loading || (storage.getAccessToken() && !user)
  if (isHydrating) return <LoadingScreen label="Checking session..." />
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />

  if (user?.role === ROLES.CUSTOMER && user?.onboardingStatus !== 'Approved') {
    const isOnboardingPath = ['/membership-agreement', '/membership-application', '/membership-qualification', '/member/membership-application-status'].includes(location.pathname);
    
    if (user?.onboardingStatus === 'Pending') {
      if (location.pathname !== '/member/membership-application-status') {
        return <Navigate to="/member/membership-application-status" replace />
      }
      return <Outlet />
    } else { // Draft, Rejected, ChangesRequested
      if (!isOnboardingPath || location.pathname === '/member/membership-application-status') {
        return <Navigate to="/membership-agreement" replace />
      }
      return <Outlet />
    }
  }

  if (roles?.length && !roles.some((allowed) => roleMatches(allowed, role))) return <Navigate to="/" replace />
  if (requirePathAccess && permissionsLoading) return <LoadingScreen label="Loading access..." />
  if (requirePathAccess && !canAccessPath(location.pathname)) return <Navigate to={fallback} replace state={{ from: location }} />
  return <Outlet />
}
