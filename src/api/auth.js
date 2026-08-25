import api from './axios'

export const authApi = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me', { silent: true }),
  forgotPassword: (payload) => api.post('/auth/forgot-password', payload),
  verifyForgotPasswordOtp: (payload) => api.post('/auth/forgot-password/verify-otp', payload),
  resetPasswordWithOtp: (payload) => api.post('/auth/forgot-password/reset', payload),
  resetPassword: (token, payload) => api.post(`/auth/reset-password/${token}`, payload),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  changePassword: (payload) => api.post('/auth/change-password', payload),
}
