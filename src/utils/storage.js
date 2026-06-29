export const storage = {
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
  clearSession: () => {
    ;[localStorage, sessionStorage].forEach((store) => {
      store.removeItem('gloaro_user')
      store.removeItem('gloaro_access_token')
      store.removeItem('gloaro_refresh_token')
    })
  },
}
