import { Navigate, Outlet, useLocation } from 'react-router-dom'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'

const roleMatches = (allowed, actual) => {
  if (allowed === actual) return true
  if (allowed === 'customer' && actual === 'user') return true
  if (allowed === 'user' && actual === 'customer') return true
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
