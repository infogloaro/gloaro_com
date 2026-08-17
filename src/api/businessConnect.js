import api from './axios'

export const businessConnectApi = {
  searchPeople: (params) => api.get('/business-connects/search-people', { params }),
  create: (payload) => api.post('/business-connects', payload),
  getMy: (params) => api.get('/business-connects/my', { params }),
  getReceived: (params) => api.get('/business-connects/received', { params }),
  getDetail: (id) => api.get(`/business-connects/${id}`),
  updateStatus: (id, payload) => api.patch(`/business-connects/${id}/status`, payload),
  getSummary: () => api.get('/business-connects/summary'),
  linkOrder: (id, payload) => api.post(`/business-connects/${id}/link-order`, payload),
  adminOverview: (params) => api.get('/business-connects/admin/overview', { params }),
  adminList: (params) => api.get('/business-connects/admin/list', { params }),
  getCustomerOpportunities: (params) => api.get('/business-connects/customer', { params }),
  getCustomerDetail: (id) => api.get(`/business-connects/customer/${id}`),
}
