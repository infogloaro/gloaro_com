import api from './axios'

export const secretaryApi = {
  dashboard: () => api.get('/secretary/dashboard'),
  members: (params) => api.get('/secretary/members', { params }),
  minutes: (params) => api.get('/secretary/minutes', { params }),
  attendance: (params) => api.get('/secretary/attendance', { params }),
}
