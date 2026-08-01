import api from './axios'

export const scorecardApi = {
  enterprise(params = {}) {
    return api.get('/scorecard/enterprise', { params })
  },
}
