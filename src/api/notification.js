import api from './axios'

export const notificationApi = {
  list: (params, config) => api.get('/notifications/my', { params, ...config }),
  systemList: (params, config) => api.get('/notifications', { params, ...config }),
  unreadCount: () => api.get('/notifications/unread-count'),
  readAll: () => api.patch('/notifications/read-all'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markUnread: (id) => api.patch(`/notifications/${id}/unread`),
  remove: (id) => api.delete(`/notifications/${id}`),
  broadcast: (data) => api.post('/notifications/broadcast', data),
}
