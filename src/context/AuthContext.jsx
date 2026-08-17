import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'
import { adminApi } from '../api/admin'
import { authApi } from '../api/auth'
import { customerAuthApi } from '../api/customerAuth'
import api, { API_BASE_URL } from '../api/axios'
import { isAdminRole } from '../constants/adminRoles'
import { storage } from '../utils/storage'
import { createPermissionHelpers, getExplicitRegistrationType } from '../utils/permissions'
import { AuthContext } from './AuthContextObject'
import { getMarketplaceAccess } from '../utils/marketplaceAccess'
import { ROLES } from '../constants/roleConfig.js'

const socketUrl = API_BASE_URL.replace('/api/v1', '')

const isCustomerPortalSession = (candidateUser = null) => {
  const user = candidateUser || storage.getUser()
  const onboardingContext = storage.getOnboardingContext()
  return Boolean(user?.meta?.customerPortal?.isolated || onboardingContext?.registrationType === 'customer_portal')
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser())
  const [loading, setLoading] = useState(true)
  const [permissionConfig, setPermissionConfig] = useState(() => storage.getPermissions() || (storage.getUser() ? undefined : null))
  const socketRef = useRef(null)
  const [socket, setSocket] = useState(null)

  const [vendorApplication, setVendorApplication] = useState(null)
  const [loadingVendorApp, setLoadingVendorApp] = useState(false)

  const fetchVendorApplication = useCallback(async () => {
    if (!user || ![ROLES.CUSTOMER, ROLES.USER, ROLES.VENDOR].includes(user.role)) {
      setVendorApplication(null)
      return null
    }
    setLoadingVendorApp(true)
    try {
      const res = await api.get('/vendor-applications/my-application')
      const appData = res.data?.data || null
      setVendorApplication(appData)
      return appData
    } catch {
      setVendorApplication(null)
      return null
    } finally {
      setLoadingVendorApp(false)
    }
  }, [user])

  const syncOnboardingContext = useCallback((nextUser, remember = true) => {
    if (!nextUser) {
      storage.clearOnboardingContext()
      return nextUser
    }

    const registrationType = getExplicitRegistrationType(nextUser)
    const normalizedUser = registrationType
      ? {
          ...nextUser,
          registrationType,
          onboardingType: registrationType,
        }
      : { ...nextUser }

    if (registrationType) {
      storage.setOnboardingContext({ registrationType }, remember)
    } else {
      storage.clearOnboardingContext()
    }
    return normalizedUser
  }, [])

  useEffect(() => {
    fetchVendorApplication()
  }, [user, fetchVendorApplication])

  const marketplaceAccess = useMemo(() => {
    return getMarketplaceAccess(user, vendorApplication)
  }, [user, vendorApplication])

  const login = useCallback(async (payload, remember = true) => {
    const persistSession = (data) => {
      const nextUser = syncOnboardingContext(data.user, remember)
      storage.setSession({ ...data, user: nextUser }, remember)
      setUser(nextUser)
      setPermissionConfig(nextUser ? undefined : null)
      return nextUser
    }

    try {
      const response = await authApi.login(payload)
      const nextUser = persistSession(response.data.data)
      toast.success('Signed in successfully')
      return nextUser
    } catch (authError) {
      try {
        const response = await customerAuthApi.login(payload)
        const nextUser = persistSession(response.data?.data || {})
        toast.success('Signed in successfully')
        return nextUser
      } catch (customerError) {
        toast.error(customerError.response?.data?.message || authError.response?.data?.message || 'Invalid email or password')
        throw customerError
      }
    }
  }, [syncOnboardingContext])

  const register = useCallback(async (payload) => {
    const response = await authApi.register(payload)
    const data = response.data?.data || {}
    const nextUser = syncOnboardingContext(data.user, true)
    toast.success(response.data.message || 'Registration successful')
    return { ...data, user: nextUser }
  }, [syncOnboardingContext])

  const logout = useCallback(async () => {
    const isCustomerSession = isCustomerPortalSession(user)
    try {
      const sessionApi = isCustomerSession ? customerAuthApi : authApi
      await sessionApi.logout()
    } catch {
      // session is cleared locally either way
    }
    storage.clearSession()
    storage.clearOnboardingContext()
    setUser(null)
    setPermissionConfig(null)
    socketRef.current?.disconnect()
    setSocket(null)
    toast.success('Logged out')
    if (isCustomerSession) {
      window.location.href = '/'
    }
  }, [user])

  const refreshUser = useCallback(async () => {
    try {
      const sessionApi = isCustomerPortalSession(user) ? customerAuthApi : authApi
      const response = await sessionApi.me()
      const nextUser = syncOnboardingContext(response.data.data?.user || response.data.data, true)
      setUser(nextUser)
      setPermissionConfig(nextUser ? undefined : null)
      return nextUser
    } catch (err) {
      console.error('Error refreshing user context:', err)
    }
  }, [syncOnboardingContext])

  useEffect(() => {
    const hydrate = async () => {
      const initialToken = storage.getAccessToken()
      if (!initialToken) {
        setLoading(false)
        return
      }

      try {
        const sessionApi = isCustomerPortalSession()
          ? customerAuthApi
          : authApi
        const response = await sessionApi.me()
        if (storage.getAccessToken() !== initialToken) {
          return
        }
        const nextUser = syncOnboardingContext(response.data.data?.user || response.data.data, true)
        setUser(nextUser)
        setPermissionConfig(nextUser ? undefined : null)
      } catch {
        if (storage.getAccessToken() !== initialToken) {
          return
        }
        storage.clearSession()
        storage.clearOnboardingContext()
        setUser(null)
        setPermissionConfig(null)
        setLoading(false)
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
    setSocket(client)

    return () => {
      client.disconnect()
      if (socketRef.current === client) socketRef.current = null
      setSocket(null)
    }
  }, [user?._id])

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
    socket,
    vendorApplication,
    loadingVendorApp,
    marketplaceAccess,
    refreshVendorApplication: fetchVendorApplication,
    ...permissionHelpers,
  }), [user, loading, permissionsLoading, permissionConfig, login, register, logout, refreshUser, permissionHelpers, socket, vendorApplication, loadingVendorApp, marketplaceAccess, fetchVendorApplication])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
