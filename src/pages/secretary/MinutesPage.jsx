import { secretaryApi } from '../../api/secretary'
import StatusBadge from '../../components/common/StatusBadge'
import { formatDate } from '../../utils/format'
import ResourceListPage from '../shared/ResourceListPage'

const columns = [
  { key: 'title', header: 'Meeting Title' },
  // TODO: When the MeetingMinutes schema is implemented,
  // ensure the backend returns meetingDate and recordedByName directly
  // to avoid nested object dependencies.
  { key: 'meetingDate', header: 'Meeting Date', render: (row) => formatDate(row.meetingDate) },
  { key: 'recordedByName', header: 'Recorded By', render: (row) => row.recordedByName || 'Unknown' },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
  { key: 'updatedAt', header: 'Last Updated', render: (row) => formatDate(row.updatedAt) }
]

const filters = [
  {
    key: 'status',
    label: 'Filter by Status',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' }
    ]
  }
]

export default function MinutesPage() {
  // TODO:
  // When the Chapter module and MeetingMinutes model are implemented,
  // scope queries using req.user.chapterId and retrieve
  // chapter-specific meeting minutes.
  return (
    <ResourceListPage
      title="Meeting Minutes"
      description="Record, review and manage chapter meeting minutes."
      fetcher={secretaryApi.minutes}
      columns={columns}
      filters={filters}
    />
  )
}
