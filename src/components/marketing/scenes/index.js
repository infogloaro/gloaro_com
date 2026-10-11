import Reel from './Reel'
import SearchResult from './SearchResult'
import SocialPost from './SocialPost'
import WhatsAppEnquiry from './WhatsAppEnquiry'

// scene.type -> screen template, and the status-bar tone it needs.
export const sceneComponents = {
  'social-post': { Component: SocialPost, statusTone: 'dark' },
  reel: { Component: Reel, statusTone: 'light' },
  search: { Component: SearchResult, statusTone: 'dark' },
  enquiry: { Component: WhatsAppEnquiry, statusTone: 'light' },
}
