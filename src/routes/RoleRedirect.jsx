import { Navigate } from 'react-router-dom'
import LoadingScreen from '../components/common/LoadingScreen'
import { useAuth } from '../hooks/useAuth'
import { getDashboardRoute } from '../utils/permissions'
import { storage } from '../utils/storage'

export default function RoleRedirect() {
  const { loading, user } = useAuth()
  const isHydrating = loading || (storage.getAccessToken() && !user)
  if (isHydrating) return <LoadingScreen label="Loading dashboard..." />
  if (!user) return <Navigate to="/" replace />

  const targetPath = getDashboardRoute(user.role)
  return <Navigate to={targetPath} replace />
}
