import api from './axios'

export const ordersApi = {
  createOrder: (data) => api.post('/orders', data),
  orders: (params) => api.get('/orders', { params }),
  order: (id) => api.get(`/orders/${id}`),
}
