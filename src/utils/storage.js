export const storage = {
  getOnboardingContext: () => {
    const raw = localStorage.getItem('gloaro_onboarding_context') || sessionStorage.getItem('gloaro_onboarding_context')
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },
  getAccessToken: () => localStorage.getItem('gloaro_access_token') || sessionStorage.getItem('gloaro_access_token'),
  getRefreshToken: () => localStorage.getItem('gloaro_refresh_token') || sessionStorage.getItem('gloaro_refresh_token'),
  getUser: () => {
    const raw = localStorage.getItem('gloaro_user') || sessionStorage.getItem('gloaro_user')
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },
  getPermissions: () => {
    const raw = localStorage.getItem('gloaro_permissions') || sessionStorage.getItem('gloaro_permissions')
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },
  setPermissions: (permissions, remember = true) => {
    const primary = remember ? localStorage : sessionStorage
    const secondary = remember ? sessionStorage : localStorage
    secondary.removeItem('gloaro_permissions')
    primary.setItem('gloaro_permissions', JSON.stringify(permissions))
  },
  setSession: ({ user, accessToken, refreshToken }, remember = true) => {
    const primary = remember ? localStorage : sessionStorage
    const secondary = remember ? sessionStorage : localStorage
    secondary.removeItem('gloaro_user')
    secondary.removeItem('gloaro_access_token')
    secondary.removeItem('gloaro_refresh_token')
    primary.setItem('gloaro_user', JSON.stringify(user))
    primary.setItem('gloaro_access_token', accessToken)
    primary.setItem('gloaro_refresh_token', refreshToken)
  },
  setOnboardingContext: (context, remember = true) => {
    const primary = remember ? localStorage : sessionStorage
    const secondary = remember ? sessionStorage : localStorage
    secondary.removeItem('gloaro_onboarding_context')
    if (!context) {
      primary.removeItem('gloaro_onboarding_context')
      return
    }
    primary.setItem('gloaro_onboarding_context', JSON.stringify(context))
  },
  clearOnboardingContext: () => {
    localStorage.removeItem('gloaro_onboarding_context')
    sessionStorage.removeItem('gloaro_onboarding_context')
  },
  clearSession: () => {
    ;[localStorage, sessionStorage].forEach((store) => {
      store.removeItem('gloaro_user')
      store.removeItem('gloaro_access_token')
      store.removeItem('gloaro_refresh_token')
      store.removeItem('gloaro_permissions')
      store.removeItem('gloaro_onboarding_context')
    })
  },
}
