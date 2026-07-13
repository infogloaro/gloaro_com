import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'
import { adminApi } from '../api/admin'
import { authApi } from '../api/auth'
import api, { API_BASE_URL } from '../api/axios'
import { isAdminRole } from '../constants/adminRoles'
import { storage } from '../utils/storage'
import { createPermissionHelpers } from '../utils/permissions'
import { AuthContext } from './AuthContextObject'

const socketUrl = API_BASE_URL.replace('/api/v1', '')

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser())
  const [loading, setLoading] = useState(true)
  const [permissionConfig, setPermissionConfig] = useState(() => storage.getPermissions() || (storage.getUser() ? undefined : null))
  const socketRef = useRef(null)

  const login = useCallback(async (payload, remember = true) => {
    const response = await authApi.login(payload)
    const data = response.data.data
    storage.setSession(data, remember)
    setUser(data.user)
    setPermissionConfig(data.user ? undefined : null)
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
    setPermissionConfig(null)
    socketRef.current?.disconnect()
    toast.success('Logged out')
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const response = await authApi.me()
      const nextUser = response.data.data?.user || response.data.data
      setUser(nextUser)
      setPermissionConfig(nextUser ? undefined : null)
      return nextUser
    } catch (err) {
      console.error('Error refreshing user context:', err)
    }
  }, [])

  useEffect(() => {
    const hydrate = async () => {
      const initialToken = storage.getAccessToken()
      if (!initialToken) {
        setLoading(false)
        return
      }

      try {
        const response = await authApi.me()
        if (storage.getAccessToken() !== initialToken) {
          return
        }
        const nextUser = response.data.data?.user || response.data.data
        setUser(nextUser)
        setPermissionConfig(nextUser ? undefined : null)
      } catch {
        if (storage.getAccessToken() !== initialToken) {
          return
        }
        storage.clearSession()
        setUser(null)
        setPermissionConfig(null)
      } finally {
        if (storage.getAccessToken() === initialToken) {
          setLoading(false)
        }
      }
    }

    hydrate()
  }, [])

  useEffect(() => {
    if (!user?._id) return
    if (permissionConfig !== undefined) return

    let mounted = true

    api.get('/permissions/my')
      .then((response) => {
        if (!mounted) return
        const data = response.data?.data || null
        setPermissionConfig(data)
        storage.setPermissions(data)
      })
      .catch(() => {
        if (!mounted) return
        const cached = storage.getPermissions()
        if (cached) {
          setPermissionConfig(cached)
        } else {
          setPermissionConfig(null)
        }
      })

    return () => {
      mounted = false
    }
  }, [user?._id, permissionConfig])

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

  const permissionHelpers = useMemo(() => createPermissionHelpers(user, permissionConfig), [user, permissionConfig])
  const permissionsLoading = Boolean(user && permissionConfig === undefined)

  const value = useMemo(() => ({
    user,
    loading,
    permissionsLoading,
    permissionConfig,
    isAuthenticated: Boolean(user),
    role: user?.role,
    login,
    register,
    logout,
    refreshUser,
    socket: socketRef.current,
    ...permissionHelpers,
  }), [user, loading, permissionsLoading, permissionConfig, login, register, logout, refreshUser, permissionHelpers, socketRef.current])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
