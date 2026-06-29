import api from './axios'

export const reportApi = {
  dashboard: () => api.get('/reports/dashboard'),
  analytics: (params) => api.get('/reports/analytics', { params }),
  users: (params) => api.get('/reports/users', { params }),
  vendors: (params) => api.get('/reports/vendors', { params }),
  revenue: (params) => api.get('/reports/revenue', { params }),
}
