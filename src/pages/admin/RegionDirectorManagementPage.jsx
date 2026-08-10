import AdminManagementPage from './AdminManagementPage'
import { ROLES } from '../../constants/roleConfig.js'

export default function RegionDirectorManagementPage() {
  return <AdminManagementPage role={ROLES.REGION_DIRECTOR} />
}
