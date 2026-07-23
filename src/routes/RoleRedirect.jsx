import { Navigate } from 'react-router-dom'
import LoadingScreen from '../components/common/LoadingScreen'
import { useAuth } from '../hooks/useAuth'
import { getDashboardRoute } from '../utils/permissions'
import { storage } from '../utils/storage'
import { ROLES } from '../constants/roleConfig.js'

export default function RoleRedirect() {
  const { loading, user } = useAuth()
  const isHydrating = loading || (storage.getAccessToken() && !user)
  if (isHydrating) return <LoadingScreen label="Loading dashboard..." />
  if (!user) return <Navigate to="/" replace />

  if (user.status === 'pending_approval' && user.role === ROLES.CUSTOMER) {
    return <Navigate to="/membership-agreement" replace />
  }

  const targetPath = getDashboardRoute(user.role)
  return <Navigate to={targetPath} replace />
}
