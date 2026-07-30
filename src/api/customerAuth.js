import api from './axios'

export const customerAuthApi = {
  register: (payload) => api.post('/customer-auth/register', payload),
  login: (payload) => api.post('/customer-auth/login', payload),
  logout: () => api.post('/customer-auth/logout'),
  me: () => api.get('/customer-auth/me', { silent: true }),
}
