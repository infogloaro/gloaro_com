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
    if (!original?.silent) toast.error(message)
    return Promise.reject(error)
  }
)

export default api
