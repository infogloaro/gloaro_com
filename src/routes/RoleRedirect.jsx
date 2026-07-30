import { Navigate } from 'react-router-dom'
import LoadingScreen from '../components/common/LoadingScreen'
import { useAuth } from '../hooks/useAuth'
import { getAccountClassification, getDashboardRoute } from '../utils/permissions'
import { storage } from '../utils/storage'
import { ROLES } from '../constants/roleConfig.js'

export default function RoleRedirect() {
  const { loading, user } = useAuth()
  const isHydrating = loading || (storage.getAccessToken() && !user)
  if (isHydrating) return <LoadingScreen label="Loading dashboard..." />
  if (!user) return <Navigate to="/" replace />
  const account = getAccountClassification(user)

  if (account.isVendorApplicant) {
    return <Navigate to="/vendor/onboarding" replace />
  }

  const targetPath = getDashboardRoute(user.role, user)
  return <Navigate to={targetPath} replace />
}
