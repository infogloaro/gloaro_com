export const successStories = [
  {
    _id: 'success-story-01',
    quote: 'GLOARO transformed how we source vendors. In six months, we have reduced procurement costs by 15% through local networking.',
    name: 'David Chens',
    role: 'CEO, Zenith Logics',
    type: 'member',
    rating: 5,
    status: 'active',
    featured: false,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=96&q=80',
  },
  {
    _id: 'success-story-02',
    quote: 'A must-have tool for any modern business. The platform\'s efficiency in connecting us with verified vendors is amazing.',
    name: 'Sarah Mitchell',
    role: 'Founder, Bloom Tech',
    type: 'vendor',
    rating: 5,
    status: 'active',
    featured: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80',
  },
  {
    _id: 'success-story-03',
    quote: 'The premium networking events are unparalleled. I met our primary investment partner at the last roundtable session.',
    name: 'James Wilson',
    role: 'Principal, Wilson Consulting',
    type: 'event',
    rating: 5,
    status: 'active',
    featured: false,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80',
  },
]

const STORAGE_KEY = 'gloaro_success_stories'
const OVERRIDES_KEY = 'gloaro_success_story_overrides'

export const getSuccessStories = () => {
  if (typeof window === 'undefined') return successStories
  let saved = []
  let overrides = {}
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    if (Array.isArray(parsed)) saved = parsed
  } catch {
    saved = []
  }
  try {
    const parsed = JSON.parse(window.localStorage.getItem(OVERRIDES_KEY) || '{}')
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) overrides = parsed
  } catch {
    overrides = {}
  }
  const mockStories = successStories.map((story) => ({ ...story, ...(overrides[story._id] || {}) }))
  return [...saved].reverse().concat(mockStories)
}

export const addSuccessStory = (story) => {
  const currentCustomStories = getSuccessStories().filter((item) => !successStories.some((mock) => mock._id === item._id))
  const nextStory = {
    ...story,
    _id: `success-story-${Date.now()}`,
    status: 'active',
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...currentCustomStories, nextStory]))
  window.dispatchEvent(new CustomEvent('gloaro:success-stories-updated'))
  return nextStory
}

export const updateSuccessStory = (storyId, changes) => {
  const isMockStory = successStories.some((story) => story._id === storyId)
  if (isMockStory) {
    const overrides = JSON.parse(window.localStorage.getItem(OVERRIDES_KEY) || '{}')
    window.localStorage.setItem(OVERRIDES_KEY, JSON.stringify({
      ...overrides,
      [storyId]: { ...(overrides[storyId] || {}), ...changes, _id: storyId },
    }))
  } else {
    const customStories = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(
      customStories.map((story) => story._id === storyId ? { ...story, ...changes, _id: storyId } : story),
    ))
  }
  window.dispatchEvent(new CustomEvent('gloaro:success-stories-updated'))
}
