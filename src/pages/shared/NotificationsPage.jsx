import { notificationApi } from '../../api/notification'
import StatusBadge from '../../components/common/StatusBadge'
import ResourceListPage from './ResourceListPage'

export default function NotificationsPage({ module, section = 'list' }) {
  return (
    <ResourceListPage
      module={module}
      section={section}
      title="Notifications"
      description="Your notification center"
      fetcher={notificationApi.list}
      columns={[
        { key: 'title', header: 'Title' },
        { key: 'type', header: 'Type' },
        { key: 'isRead', header: 'Read', render: (row) => <StatusBadge value={row.isRead ? 'completed' : 'pending'} /> },
      ]}
    />
  )
}
