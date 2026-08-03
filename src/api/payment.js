import api from './axios'

export const paymentApi = {
  createRazorpayOrder: (data) => api.post('/payments/razorpay/order', data),
  verifyRazorpay: (data) => api.post('/payments/razorpay/verify', data),
  requestRefund: (id, data) => api.post(`/payments/${id}/refund`, data),
  payments: (params) => api.get('/payments', { params }),
  transactions: (params) => api.get('/payments/transactions', { params }),
  invoices: (params) => api.get('/payments/invoices', { params }),
}
