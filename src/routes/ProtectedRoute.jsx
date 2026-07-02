import { Navigate, Outlet, useLocation } from 'react-router-dom'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'

const roleMatches = (allowed, actual) => {
  const allowedRole = String(allowed || '').toLowerCase().replace(/\s+/g, '')
  const actualRole = String(actual || '').toLowerCase().replace(/\s+/g, '')
  if (allowedRole === actualRole) return true
  if (allowedRole === 'superadmin' && actualRole === 'super_admin') return true
  if (allowedRole === 'customer' && actualRole === 'user') return true
  if (allowedRole === 'user' && actualRole === 'customer') return true
  return false
}

export default function ProtectedRoute({ roles }) {
  const { loading, isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingSpinner label="Checking session" />
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />
  if (roles?.length && !roles.some((allowed) => roleMatches(allowed, role))) return <Navigate to="/" replace />
  return <Outlet />
}
