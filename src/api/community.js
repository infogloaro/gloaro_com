import api from './axios'

export const communityApi = {
  // 1. Business Wall Feed
  getPosts: (params) => api.get('/community/posts', { params }),
  createPost: (payload) => api.post('/community/posts', payload),
  likePost: (id) => api.post(`/community/posts/${id}/like`),
  commentPost: (id, payload) => api.post(`/community/posts/${id}/comment`, payload),
  getPostAnalytics: () => api.get('/community/posts/analytics'),

  // 2. Referrals
  getReferrals: () => api.get('/community/referrals'),
  createReferral: (payload) => api.post('/community/referrals', payload),
  updateReferralStatus: (id, payload) => api.patch(`/community/referrals/${id}`, payload),
  getMySignupReferrals: () => api.get('/referrals/my'),

  // 3. One-to-Ones
  getOneToOnes: () => api.get('/community/one-to-ones'),
  createOneToOne: (payload) => api.post('/community/one-to-ones', payload),
  updateOneToOne: (id, payload) => api.patch(`/community/one-to-ones/${id}`, payload),

  // 4. Visitors
  getVisitors: () => api.get('/community/visitors'),
  inviteVisitor: (payload) => api.post('/community/visitors', payload),

  // 5. Member Stats & KPIs
  getMemberStats: () => api.get('/community/member-stats'),

  // 6. Business Directory Search
  getDirectory: (params) => api.get('/community/directory', { params }),

  // 7. Leaderboards
  getLeaderboards: () => api.get('/community/leaderboards'),

  // 8. Chapter Performance Dashboard
  getChapterStats: () => api.get('/community/chapter-stats'),

  // 9. Unified Calendar
  getCalendar: () => api.get('/community/calendar'),

  // 10. Task Management
  getTasks: () => api.get('/community/tasks'),
  createTask: (payload) => api.post('/community/tasks', payload),
  updateTask: (id, payload) => api.patch(`/community/tasks/${id}`, payload),

  // 11. Help Desk (Tickets)
  getTickets: () => api.get('/community/tickets'),
  createTicket: (payload) => api.post('/community/tickets', payload),

  // 12. AI Insights
  getAIInsights: () => api.get('/community/ai-insights'),

  // 13. QR Attendance mark
  markQRAttendance: (payload) => api.post('/community/meetings/qr-attendance', payload),

  // 14. Chat Messages
  getChatMessages: () => api.get('/community/chat/messages'),
  sendChatMessage: (payload) => api.post('/community/chat/messages', payload),
}
