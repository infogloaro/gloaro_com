import api from './axios'

// Separate endpoints and application types for the two partnership models.
// The backend for these routes does not exist yet; the forms keep submission
// disabled until VITE_PARTNERSHIP_API_ENABLED=true (see partnerConfig.js).
const endpoints = {
  FRANCHISE: '/partnership-applications/franchise',
  CHANNEL_PARTNER: '/partnership-applications/channel-partner',
}

// Resolves with the server-generated reference, or throws. A 2xx response
// without a reference is treated as a failure: success is only ever shown
// for an application the server confirms it saved.
export async function submitPartnershipApplication(payload, idempotencyKey) {
  const endpoint = endpoints[payload.applicationType]
  if (!endpoint) throw new Error('Unknown application type')
  const response = await api.post(endpoint, payload, {
    headers: { 'Idempotency-Key': idempotencyKey },
    silent: true,
  })
  const body = response?.data
  const reference = body?.data?.reference ?? body?.reference
  if (!reference) {
    const error = new Error('The server did not confirm the application was saved.')
    error.code = 'NO_REFERENCE'
    throw error
  }
  return { reference: String(reference), status: body?.data?.status ?? body?.status ?? 'SUBMITTED' }
}

// Admin review (role-protected on the server). `silent` keeps a missing
// backend from flooding the dashboard with error toasts.
export const partnershipAdminApi = {
  list: (params) => api.get('/admin/partnership-applications', { params, silent: true }),
  get: (id) => api.get(`/admin/partnership-applications/${id}`, { silent: true }),
  updateStatus: (id, data) => api.patch(`/admin/partnership-applications/${id}/status`, data),
}

export const PARTNERSHIP_STATUSES = ['SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'DISCUSSION', 'APPROVED', 'REJECTED']
