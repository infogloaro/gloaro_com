import api from './axios'

export const customerAuthApi = {
  register: (payload) => api.post('/customer-auth/register', payload, { silent: true }),
  login: (payload) => api.post('/customer-auth/login', payload, { silent: true }),
  logout: () => api.post('/customer-auth/logout', undefined, { silent: true }),
  me: () => api.get('/customer-auth/me', { silent: true }),
}
