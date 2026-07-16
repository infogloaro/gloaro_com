import { Navigate, Outlet, useLocation } from 'react-router-dom'
import LoadingScreen from '../components/common/LoadingScreen'
import { useAuth } from '../hooks/useAuth'
import { isAdminRole } from '../constants/adminRoles'
import { storage } from '../utils/storage'

const roleMatches = (allowed, actual) => {
  const allowedRole = String(allowed || '').toLowerCase().replace(/\s+/g, '')
  const actualRole = String(actual || '').toLowerCase().replace(/\s+/g, '')
  if (allowedRole === actualRole) return true
  if (allowedRole === 'admin' && isAdminRole(actualRole)) return true
  if (allowedRole === 'superadmin' && actualRole === 'super_admin') return true
  if (allowedRole === 'customer' && actualRole === 'user') return true
  if (allowedRole === 'user' && actualRole === 'customer') return true
  return false
}

export default function ProtectedRoute({ roles, requirePathAccess = false, fallback = '/dashboard' }) {
  const { loading, isAuthenticated, role, permissionsLoading, canAccessPath, user } = useAuth()
  const location = useLocation()

  const isHydrating = loading || (storage.getAccessToken() && !user)
  if (isHydrating) return <LoadingScreen label="Checking session..." />
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />

  if (user?.status === 'pending_approval' && user?.role === 'customer' && location.pathname !== '/member/membership-application-status') {
    return <Navigate to="/membership-agreement" replace />
  }

  if (roles?.length && !roles.some((allowed) => roleMatches(allowed, role))) return <Navigate to="/" replace />
  if (requirePathAccess && permissionsLoading) return <LoadingScreen label="Loading access..." />
  if (requirePathAccess && !canAccessPath(location.pathname)) return <Navigate to={fallback} replace state={{ from: location }} />
  return <Outlet />
}
