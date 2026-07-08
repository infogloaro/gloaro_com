import { Navigate } from 'react-router-dom'
import LoadingScreen from '../components/common/LoadingScreen'
import { useAuth } from '../hooks/useAuth'
import { isAdminRole } from '../constants/adminRoles'
import { storage } from '../utils/storage'

export default function RoleRedirect() {
  const { loading, user } = useAuth()
  const isHydrating = loading || (storage.getAccessToken() && !user)
  if (isHydrating) return <LoadingScreen label="Loading dashboard..." />
  if (!user) return <Navigate to="/" replace />
  const role = String(user.role || '').toLowerCase().replace(/\s+/g, '')

  if (role === 'state_director') return <Navigate to="/state-director/dashboard" replace />
  if (role === 'district_director') return <Navigate to="/district-director/dashboard" replace />
  if (role === 'executive_director') return <Navigate to="/chapter-director/dashboard" replace />
  if (role === 'chapter_president') return <Navigate to="/president/dashboard" replace />
  if (role === 'vice_president') return <Navigate to="/vice-president/dashboard" replace />
  if (role === 'secretary') return <Navigate to="/secretary/dashboard" replace />
  if (isAdminRole(role)) return <Navigate to="/admin" replace />

  if (role === 'vendor') return <Navigate to="/vendor" replace />
  if (role === 'customer' && user.memberId && (user.isActive || user.status === 'approved' || user.status === 'active')) {
    return <Navigate to="/member/dashboard" replace />
  }
  return <Navigate to="/customer/profile" replace />
}
