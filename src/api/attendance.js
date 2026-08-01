import api from './axios'

export const attendanceApi = {
  list: (params) => api.get('/attendance', { params }),
  me: (params) => api.get('/attendance/me', { params }),
  byEvent: (eventId, params) => api.get(`/attendance/event/${eventId}`, { params }),
  byMember: (memberId, params) => api.get(`/attendance/member/${memberId}`, { params }),
}
