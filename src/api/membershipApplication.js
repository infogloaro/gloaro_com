import api from './axios'

export const membershipApplicationApi = {
  submit: (formData) => api.post('/membership-applications', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  track: (params) => api.get('/membership-applications/track', { params }),
  getMyApplication: () => api.get('/membership-applications/my-application'),
}
