import api from './axios'

export const ordersApi = {
  createOrder: (data) => api.post('/orders', data),
  orders: (params) => api.get('/orders', { params }),
  order: (id) => api.get(`/orders/${id}`),
  tracking: (id) => api.get(`/orders/${id}/tracking`),
  cancel: (id, data) => api.patch(`/orders/${id}/cancel`, data),
  return: (id, data) => api.post(`/orders/${id}/return`, data),
}
