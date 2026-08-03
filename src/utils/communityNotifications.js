import { ROLES } from '../constants/roleConfig'

const communityRoutePrefixes = {
  [ROLES.SUPERADMIN]: '/super-admin',
  [ROLES.ADMIN]: '/admin',
  [ROLES.REGION_DIRECTOR]: '/region-director',
  [ROLES.STATE_DIRECTOR]: '/state-director',
  [ROLES.DISTRICT_DIRECTOR]: '/district-director',
  [ROLES.EXECUTIVE_DIRECTOR]: '/chapter-director',
  [ROLES.LAUNCH_DIRECTOR]: '/launch-director',
  [ROLES.DIRECT_CONSULTANT]: '/direct-consultant',
  [ROLES.CHAPTER_PRESIDENT]: '/president',
  [ROLES.VICE_PRESIDENT]: '/vice-president',
  [ROLES.SECRETARY]: '/secretary',
  [ROLES.CUSTOMER]: '/member',
  [ROLES.USER]: '/member',
  [ROLES.VENDOR]: '/member',
}

export const getCommunityNotificationPath = (item, user) => {
  const data = item?.data || {}
  if (!['community_post', 'community_mention'].includes(item?.type) || !data.postId || !data.communityScope) {
    return item?.link || ''
  }

  const prefix = communityRoutePrefixes[user?.role] || '/member'
  const page = data.communityScope === 'network' ? 'network' : 'wall'
  return `${prefix}/${page}?post=${data.postId}`
}
