import { vendorApi } from './vendor'

export const membershipApi = {
  plans: vendorApi.plans,
  purchase: vendorApi.purchase,
  renew: vendorApi.renew,
  current: vendorApi.membership,
  history: vendorApi.membershipHistory,
}
