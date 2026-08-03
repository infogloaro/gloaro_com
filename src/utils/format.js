export const formatCurrency = (value, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(value || 0))

export const formatDate = (value) => {
  if (!value) return 'Not available'
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value))
}

export const getList = (responseData) => {
  if (!responseData) return []
  if (Array.isArray(responseData)) return responseData
  if (Array.isArray(responseData.items)) return responseData.items
  if (Array.isArray(responseData.data)) return responseData.data
  if (typeof responseData === 'object') {
    for (const key of ['products', 'results', 'records', 'list', 'docs']) {
      if (Array.isArray(responseData[key])) return responseData[key]
    }
    if (responseData.data && typeof responseData.data === 'object') {
      return getList(responseData.data)
    }
  }
  return []
}

export const getPagination = (payload) => payload?.pagination || {}
