const STORAGE_KEY = 'gloaro_membership_onboarding'
const fileStore = {}

export const getMembershipDraft = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export const saveMembershipDraft = (section, values) => {
  const current = getMembershipDraft()
  const next = { ...current, [section]: { ...(current[section] || {}), ...values } }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export const clearMembershipDraft = () => {
  localStorage.removeItem(STORAGE_KEY)
  Object.keys(fileStore).forEach((key) => delete fileStore[key])
}

export const setMembershipFile = (field, file) => {
  if (file) fileStore[field] = file
}

export const getMembershipFiles = () => fileStore
