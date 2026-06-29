import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'
import { authApi } from '../api/auth'
import { API_BASE_URL } from '../api/axios'
import { storage } from '../utils/storage'
import { AuthContext } from './AuthContextObject'

const socketUrl = API_BASE_URL.replace('/api/v1', '')

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser())
  const [loading, setLoading] = useState(true)
  const socketRef = useRef(null)

  const login = useCallback(async (payload, remember = true) => {
    const response = await authApi.login(payload)
    const data = response.data.data
    storage.setSession(data, remember)
    setUser(data.user)
    toast.success('Signed in successfully')
    return data.user
  }, [])

  const register = useCallback(async (payload) => {
    const response = await authApi.register(payload)
    toast.success(response.data.message || 'Registration successful')
    return response.data.data
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // session is cleared locally either way
    }
    storage.clearSession()
    setUser(null)
    socketRef.current?.disconnect()
    toast.success('Logged out')
  }, [])

  useEffect(() => {
    const hydrate = async () => {
      if (!storage.getAccessToken()) {
        setLoading(false)
        return
      }

      try {
        const response = await authApi.me()
        const nextUser = response.data.data?.user || response.data.data
        setUser(nextUser)
      } catch {
        storage.clearSession()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    hydrate()
  }, [])

  useEffect(() => {
    const token = storage.getAccessToken()
    if (!token || !user) return undefined

    const client = io(socketUrl, { auth: { token }, transports: ['websocket'] })
    client.on('notification', (notification) => toast(notification.title || notification.message || 'New notification'))
    client.on('new_lead', (lead) => toast.success(`New lead: ${lead.subject || lead.name}`))
    socketRef.current = client

    return () => {
      client.disconnect()
      if (socketRef.current === client) socketRef.current = null
    }
  }, [user])

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    role: user?.role,
    login,
    register,
    logout,
  }), [user, loading, login, register, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
