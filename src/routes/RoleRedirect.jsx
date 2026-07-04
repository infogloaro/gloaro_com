import { Navigate } from 'react-router-dom'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'

export default function RoleRedirect() {
  const { loading, user } = useAuth()
  if (loading) return <LoadingSpinner />
  if (!user) return <Navigate to="/" replace />
  const role = String(user.role || '').toLowerCase().replace(/\s+/g, '')
  if (['admin', 'superadmin'].includes(role)) return <Navigate to="/admin" replace />
  if (role === 'secretary') return <Navigate to="/secretary/dashboard" replace />
  if (role === 'vendor') return <Navigate to="/vendor" replace />
  return <Navigate to="/customer/profile" replace />
}
