import api from './axios'

export const secretaryApi = {
  dashboard: () => api.get('/secretary/dashboard'),
  members: (params) => api.get('/secretary/members', { params }),
  minutes: (params) => api.get('/secretary/minutes', { params }),
  attendance: (params) => api.get('/secretary/attendance', { params }),
  categories: (params) => api.get('/secretary/categories', { params }),
  createCategory: (payload) => api.post('/secretary/categories', payload),
  updateCategory: (id, payload) => api.put(`/secretary/categories/${id}`, payload),
  directory: (params) => api.get('/secretary/directory', { params }),
  createMember: (payload) => api.post('/secretary/members', payload),
  member: (id) => api.get(`/secretary/members/${id}`),
  updateMember: (id, payload) => api.put(`/secretary/members/${id}`, payload),
  deleteMember: (id) => api.delete(`/secretary/members/${id}`),
  events: (params) => api.get('/secretary/events', { params }),
  createEvent: (payload) => api.post('/secretary/events', payload),
  updateEvent: (id, payload) => api.patch(`/secretary/events/${id}`, payload),
  assignEventMember: (id, payload) => api.post(`/secretary/events/${id}/members`, payload),
  markEventAttendance: (id, attendeeId, payload) => api.patch(`/secretary/events/${id}/attendees/${attendeeId}/attendance`, payload),
}
