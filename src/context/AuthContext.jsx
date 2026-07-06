import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'
import { adminApi } from '../api/admin'
import { authApi } from '../api/auth'
import { API_BASE_URL } from '../api/axios'
import { isAdminRole } from '../constants/adminRoles'
import { storage } from '../utils/storage'
import { createPermissionHelpers } from '../utils/permissions'
import { AuthContext } from './AuthContextObject'

const socketUrl = API_BASE_URL.replace('/api/v1', '')

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser())
  const [loading, setLoading] = useState(true)
  const [permissionConfig, setPermissionConfig] = useState(() => (isAdminRole(storage.getUser()?.role) ? undefined : null))
  const socketRef = useRef(null)

  const login = useCallback(async (payload, remember = true) => {
    const response = await authApi.login(payload)
    const data = response.data.data
    storage.setSession(data, remember)
    setUser(data.user)
    setPermissionConfig(isAdminRole(data.user?.role) ? undefined : null)
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
        setPermissionConfig(isAdminRole(nextUser?.role) ? undefined : null)
      } catch {
        storage.clearSession()
        setUser(null)
        setPermissionConfig(null)
      } finally {
        setLoading(false)
      }
    }

    hydrate()
  }, [])

  useEffect(() => {
    if (!user || !isAdminRole(user.role)) return

    let mounted = true

    adminApi.roleConfiguration(user.role)
      .then((response) => {
        if (!mounted) return
        setPermissionConfig(response.data?.data || null)
      })
      .catch(() => {
        if (!mounted) return
        setPermissionConfig(null)
      })

    return () => {
      mounted = false
    }
  }, [user])

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
  const permissionsLoading = Boolean(user && isAdminRole(user.role) && permissionConfig === undefined)

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
    socket: socketRef.current,
    ...permissionHelpers,
  }), [user, loading, permissionsLoading, permissionConfig, login, register, logout, permissionHelpers, socketRef.current])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
