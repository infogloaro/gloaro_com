import api from './axios'

export const communityApi = {
  // 1. Business Wall Feed
  getPosts: (params, config) => api.get('/community/posts', { params, ...config }),
  createPost: (payload) => api.post('/community/posts', payload, payload instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined),
  deletePost: (id) => api.delete(`/community/posts/${id}`),
  likePost: (id, payload) => api.post(`/community/posts/${id}/like`, payload),
  commentPost: (id, payload) => api.post(`/community/posts/${id}/comment`, payload),
  sharePost: (id) => api.post(`/community/posts/${id}/share`),
  getPostAnalytics: () => api.get('/community/posts/analytics'),

  // 2. Referrals
  getReferrals: () => api.get('/community/referrals'),
  createReferral: (payload) => api.post('/community/referrals', payload),
  updateReferralStatus: (id, payload) => api.patch(`/community/referrals/${id}`, payload),
  getMySignupReferrals: (params) => api.get('/referrals/my', { params }),
  getMyReferralCode: () => api.get('/referrals/my/code'),
  getMySignupReferralDetail: (id) => api.get(`/referrals/my/${id}`),

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
  getDirectory: (params, config) => api.get('/community/directory', { params, ...config }),
  getMentions: (params) => api.get('/community/mentions', { params }),

  // 6b. Chapter Community switcher (Super Admin / Admin)
  getChapterList: () => api.get('/community/chapters'),
  getChapterCommunity: (chapterId) => api.get(`/community/chapter/${chapterId}`),
  getChapterMembers: (chapterId, params, config) => api.get(`/community/members/${chapterId}`, { params, ...config }),

  // 6b. Organization filters
  getRegions: (scope) => api.get('/organization/regions', { params: scope ? { scope } : undefined }),
  getStates: (regionId, scope) => api.get('/organization/states', { params: { regionId, ...(scope ? { scope } : {}) } }),
  getDistricts: (stateId, scope) => api.get('/organization/districts', { params: { stateId, ...(scope ? { scope } : {}) } }),
  getChapters: (districtId, scope) => api.get('/organization/chapters', { params: { districtId, ...(scope ? { scope } : {}) } }),

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
  getChatConversations: () => api.get('/community/chat/conversations'),
  getChatUnreadCount: () => api.get('/community/chat/unread-count'),
  markChatRead: (recipient) => api.patch(`/community/chat/read/${recipient}`),
  getChatMessages: (params) => api.get('/community/chat/messages', { params }),
  sendChatMessage: (payload) => api.post('/community/chat/messages', payload, payload instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined),
}
