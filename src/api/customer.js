import api from './axios'

function normalizeReviewPayload(data = {}) {
  const vendor = data.vendorId || data.vendor?._id || data.vendor?.id || data.vendor
  const product = data.productId || data.product?._id || data.product?.id || data.product
  const service = data.serviceId || data.service?._id || data.service?.id || data.service
  return {
    ...data,
    vendor: vendor?._id || vendor?.id ? String(vendor._id || vendor.id) : vendor,
    product: product?._id || product?.id ? String(product._id || product.id) : product || undefined,
    service: service?._id || service?.id ? String(service._id || service.id) : service || undefined,
    rating: Number(data.rating),
    title: String(data.title || '').trim(),
    comment: String(data.comment || '').trim(),
  }
}

function appendReviewImages(formData, images) {
  if (!images) return
  if (typeof FileList !== 'undefined' && images instanceof FileList) {
    Array.from(images).forEach((file) => formData.append('images', file))
    return
  }
  if (Array.isArray(images)) {
    images.filter(Boolean).forEach((file) => formData.append('images', file))
    return
  }
  formData.append('images', images)
}

function buildReviewFormData(data = {}) {
  const normalized = normalizeReviewPayload(data)
  const formData = new FormData()

  Object.entries(normalized).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (key === 'images') {
      appendReviewImages(formData, value)
      return
    }
    formData.append(key, value instanceof Blob ? value : String(value))
  })

  return formData
}

export const customerApi = {
  dashboard: () => api.get('/customers/dashboard'),
  profile: () => api.get('/customers/profile'),
  updateProfile: (payload) => api.patch('/customers/profile', payload),
  addresses: () => api.get('/customers/addresses'),
  createAddress: (payload) => api.post('/customers/addresses', payload),
  updateAddress: (id, payload) => api.patch(`/customers/addresses/${id}`, payload),
  deleteAddress: (id) => api.delete(`/customers/addresses/${id}`),
  setDefaultAddress: (id) => api.patch(`/customers/addresses/${id}/default`),
  vendors: (params) => api.get('/vendors', { params }),
  vendor: (id) => api.get(`/vendors/${id}`),
  vendorBySlug: (slug) => api.get(`/vendors/slug/${slug}`),
  nearby: (params) => api.get('/directory/nearby', { params }),
  nearbyBusinesses: (params) => api.get('/nearby/businesses', { params }),
  nearbyServices: (params) => api.get('/nearby/services', { params }),
  nearbyProducts: (params) => api.get('/nearby/products', { params }),
  categories: (params) => api.get('/categories', { params }),
  products: (params) => api.get('/products', { params }),
  product: (id) => api.get(`/products/${id}`),
  services: (params) => api.get('/services', { params }),
  service: (id) => api.get(`/services/${id}`),
  banners: (params) => api.get('/banners', { params }),
  organizationHierarchy: (config = {}) => api.get('/directory/organization-hierarchy', config),
  globalSearch: (params) => api.get('/directory/global-search', { params }),
  organizationHierarchy: () => api.get('/directory/organization-hierarchy'),
  leaders: () => api.get('/leaders'),
  submitEnquiry: (data) => api.post('/leads', data),
  wishlist: (params) => api.get('/customers/wishlist', { params }),
  addWishlist: (data, config = {}) => api.post('/customers/wishlist', data, config),
  removeWishlist: (id, itemType, config = {}) => api.delete(`/customers/wishlist/${id}`, { ...config, params: { itemType, ...(config.params || {}) } }),
  enquiries: (params) => api.get('/customers/enquiries', { params }),
  referrals: () => api.get('/referrals/my'),
  referralCode: () => api.get('/referrals/my/code'),
  referralStats: () => api.get('/referrals/my/stats'),
  events: (params) => api.get('/events', { params }),
  registerEvent: (id, data) => api.post(`/events/${id}/register`, data),
  myEvents: (params) => api.get('/customers/events', { params }),
  training: () => api.get('/customers/training', { silent: true }),
  completeTrainingAssignment: (courseId, assignmentIndex) => api.patch(`/customers/training/${courseId}/assignments/${assignmentIndex}/complete`),
  reviews: (vendorId, params) => api.get(`/reviews/vendor/${vendorId}`, { params }),
  createReview: (data) => api.post('/reviews', buildReviewFormData(data)),
  support: (params) => api.get('/support/my', { params }),
  createTicket: (data) => api.post('/support', data),
}
