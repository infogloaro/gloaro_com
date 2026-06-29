import toast from 'react-hot-toast'
import { vendorApi } from '../../api/vendor'
import { customerApi } from '../../api/customer'
import StatusBadge from '../../components/common/StatusBadge'
import { formatCurrency, formatDate } from '../../utils/format'
import NotificationsPage from '../shared/NotificationsPage'
import ProfilePage from '../shared/ProfilePage'
import ResourceListPage from '../shared/ResourceListPage'
import SimpleJsonForm from '../shared/SimpleJsonForm'

export function VendorProfilePage() {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <ResourceListPage title="Business Profile" fetcher={async () => {
        try {
          const response = await vendorApi.profile()
          return { data: { data: response.data.data ? [response.data.data] : [] } }
        } catch (error) {
          if (error.response?.status === 404) return { data: { data: [] } }
          throw error
        }
      }} columns={[{ key: 'businessName', header: 'Business' }, { key: 'status', header: 'Verification', render: (row) => <StatusBadge value={row.status} /> }, { key: 'plan', header: 'Plan', render: (row) => row.membership?.plan || 'free' }]} />
      <ProfilePage />
    </div>
  )
}

export function VendorProductsPage() {
  return <ResourceListPage title="Products" fetcher={vendorApi.products} createAction={vendorApi.createProduct} updateAction={vendorApi.updateProduct} deleteAction={vendorApi.deleteProduct} columns={[
    { key: 'title', header: 'Product' }, { key: 'price', header: 'Price', render: (row) => formatCurrency(row.pricing?.sellingPrice) }, { key: 'inventory', header: 'Stock', render: (row) => row.inventory?.quantity ?? 0 }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
  ]} renderForm={(props) => <SimpleJsonForm {...props} fields={[{ name: 'title' }, { name: 'description', type: 'textarea' }, { name: 'category' }, { name: 'pricing.mrp', type: 'number' }, { name: 'pricing.sellingPrice', type: 'number' }]} />} />
}

export function VendorServicesPage() {
  return <ResourceListPage title="Services" fetcher={vendorApi.services} createAction={vendorApi.createService} updateAction={vendorApi.updateService} deleteAction={vendorApi.deleteService} columns={[
    { key: 'title', header: 'Service' }, { key: 'category', header: 'Category', render: (row) => row.category?.name || 'Category' }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
  ]} renderForm={(props) => <SimpleJsonForm {...props} fields={[{ name: 'title' }, { name: 'description', type: 'textarea' }, { name: 'category' }, { name: 'pricing.minPrice', type: 'number' }]} />} />
}

export function VendorLeadsPage() {
  return <ResourceListPage title="Lead Management" fetcher={vendorApi.leads} filters={[{ key: 'status', label: 'Status', options: ['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'].map((value) => ({ value, label: value })) }]} columns={[
    { key: 'name', header: 'Customer' }, { key: 'phone', header: 'Phone' }, { key: 'subject', header: 'Subject' }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
  ]} updateAction={(id, data) => vendorApi.updateLead(id, { status: data.status })} renderForm={(props) => <SimpleJsonForm {...props} fields={[{ name: 'status', type: 'select', options: ['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'].map((value) => ({ value, label: value })) }]} />} />
}

export function VendorReviewsPage() {
  return <ResourceListPage title="Reviews" fetcher={vendorApi.reviews} columns={[{ key: 'user', header: 'User', render: (row) => row.user?.name || 'Customer' }, { key: 'rating', header: 'Rating' }, { key: 'comment', header: 'Comment' }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> }]} />
}

export function VendorMembershipPage() {
  return <ResourceListPage title="Membership" fetcher={vendorApi.membershipHistory} columns={[{ key: 'plan', header: 'Plan' }, { key: 'billingCycle', header: 'Billing' }, { key: 'price', header: 'Price', render: (row) => formatCurrency(row.price) }, { key: 'endDate', header: 'Expires', render: (row) => formatDate(row.endDate) }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> }]} />
}

export function VendorPaymentsPage() {
  return <ResourceListPage title="Payment History" fetcher={vendorApi.payments} columns={[{ key: 'type', header: 'Type' }, { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount, row.currency) }, { key: 'gateway', header: 'Gateway' }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> }]} />
}

export function VendorNotificationsPage() {
  return <NotificationsPage />
}

export function VendorSupportPage() {
  return <ResourceListPage title="Support Tickets" fetcher={customerApi.support} createAction={async (data) => { await customerApi.createTicket(data); toast.success('Ticket created') }} columns={[{ key: 'ticketNumber', header: 'Ticket' }, { key: 'subject', header: 'Subject' }, { key: 'priority', header: 'Priority' }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> }]} renderForm={(props) => <SimpleJsonForm {...props} fields={[{ name: 'subject' }, { name: 'description', type: 'textarea' }, { name: 'category' }, { name: 'priority', type: 'select', options: ['low', 'medium', 'high', 'critical'].map((value) => ({ value, label: value })) }]} />} />
}
