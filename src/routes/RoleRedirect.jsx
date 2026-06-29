import { Navigate } from 'react-router-dom'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'

export default function RoleRedirect() {
  const { loading, user } = useAuth()
  if (loading) return <LoadingSpinner />
  if (!user) return <Navigate to="/" replace />
  if (['admin', 'superadmin'].includes(user.role)) return <Navigate to="/admin" replace />
  if (user.role === 'vendor') return <Navigate to="/vendor" replace />
  return <Navigate to="/customer/profile" replace />
}
