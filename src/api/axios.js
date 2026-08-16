import axios from 'axios'
import toast from 'react-hot-toast'
import { storage } from '../utils/storage'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 20000,
})

let refreshing = null

api.interceptors.request.use((config) => {
  const token = storage.getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const status = error.response?.status
    const method = String(original?.method || 'get').toLowerCase()

    if (status === 401 && !original?._retry && storage.getRefreshToken()) {
      original._retry = true
      refreshing ||= axios
        .post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken: storage.getRefreshToken() }, { withCredentials: true })
        .then((response) => response.data?.data)
        .finally(() => {
          refreshing = null
        })

      try {
        const tokens = await refreshing
        const user = storage.getUser()
        storage.setSession({ user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }, true)
        original.headers.Authorization = `Bearer ${tokens.accessToken}`
        return api(original)
      } catch {
        storage.clearSession()
        window.location.href = '/login'
      }
    }

    const message = error.response?.data?.message || error.message || 'Something went wrong'
    const isExpectedBackgroundForbidden = status === 403 && method === 'get'
    const isTimeout = error.code === 'ECONNABORTED'

    // Keep authorization failures visible for user actions, but avoid alarming toasts
    // for background data-loading GET requests that are denied by backend scope rules.
    // Suppress timeout toasts — the request may have succeeded server-side or simply be slow.
    if (!original?.silent && !isExpectedBackgroundForbidden && !isTimeout) toast.error(message)
    return Promise.reject(error)
  }
)

export default api
