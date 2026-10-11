// Field definitions for the two partnership applications. Each path has its
// own steps and fields; they share field *types* only, never records.
import { channel, PENDING, serviceOptions } from '../partnerConfig'

export const countryCodes = ['+91', '+971', '+65', '+60', '+44', '+1']

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^[0-9\s-]{6,15}$/
const URL_PATTERN = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i

const contactFields = [
  { name: 'fullName', label: 'Full name', type: 'text', required: true, autoComplete: 'name', maxLength: 120 },
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email', pattern: EMAIL, patternMessage: 'Enter a valid email address, like name@example.com.' },
  { name: 'phone', label: 'Phone number', type: 'phone', required: true, autoComplete: 'tel-national', pattern: PHONE, patternMessage: 'Enter 6 to 15 digits.' },
  { name: 'city', label: 'City and state', type: 'text', required: true, autoComplete: 'address-level2', hint: 'For example: Salem, Tamil Nadu', maxLength: 120 },
]

const industries = ['Education', 'Healthcare', 'Retail', 'IT and software', 'Professional services', 'Manufacturing', 'Real estate', 'Hospitality', 'Other']

export const forms = {
  franchise: {
    type: 'FRANCHISE',
    steps: [
      { id: 'personal', title: 'Personal information', intro: 'Just the basics so we can reach you.', fields: contactFields },
      {
        id: 'business',
        title: 'Business profile',
        fields: [
          { name: 'applicantType', label: 'Applying as', type: 'cards', required: true, options: [['Individual', 'I am applying personally'], ['Business', 'I am applying for a company']] },
          { name: 'businessName', label: 'Existing business name (if any)', type: 'text', maxLength: 160 },
          { name: 'industry', label: 'Industry', type: 'select', required: true, options: industries },
          { name: 'currentRole', label: 'Current role', type: 'text', required: true, maxLength: 120 },
          { name: 'experience', label: 'Professional or business experience', type: 'textarea', required: true, maxLength: 1500, hint: 'A few lines about what you have done so far.' },
          { name: 'website', label: 'Website (optional)', type: 'url', pattern: URL_PATTERN, patternMessage: 'Enter a web address, like example.com.' },
        ],
      },
      {
        id: 'interest',
        title: 'Franchise interest',
        fields: [
          { name: 'territory', label: 'Preferred territory or service area', type: 'text', required: true, maxLength: 160, hint: 'The city or district you want to serve.' },
          { name: 'services', label: 'Solutions you are interested in', type: 'chips', required: true, options: serviceOptions },
          { name: 'involvement', label: 'How involved will you be?', type: 'cards', required: true, options: [['Hands-on owner', 'I will run it day to day'], ['Owner with a manager', 'A manager runs operations']] },
          { name: 'launchTimeframe', label: 'Expected launch timeframe', type: 'select', required: true, options: ['Within 3 months', '3 to 6 months', '6 to 12 months', 'Just exploring'] },
        ],
      },
      {
        id: 'readiness',
        title: 'Readiness',
        fields: [
          { name: 'readiness', label: 'Where are you today?', type: 'cards', required: true, options: [['Ready now', 'I have an office or team I can use'], ['Can set up', 'I can set up an office and team'], ['Need guidance', 'I would like guidance on setting up']] },
          { name: 'investmentNotice', label: 'Investment readiness', type: 'notice', value: PENDING, text: 'The investment range will be shared once it is approved. We do not ask about it yet.' },
          { name: 'documentsNotice', label: 'Business plan or documents', type: 'notice', text: 'Document upload is not available here. If needed, our team will ask for documents securely after the initial review.' },
          { name: 'questions', label: 'Questions for the GLOARO team (optional)', type: 'textarea', maxLength: 1500 },
        ],
      },
      { id: 'review', title: 'Review and submit', fields: [] },
    ],
  },
  channel: {
    type: 'CHANNEL_PARTNER',
    steps: [
      { id: 'contact', title: 'Contact information', intro: 'Just the basics so we can reach you.', fields: contactFields },
      {
        id: 'profile',
        title: 'Professional profile',
        fields: [
          { name: 'partnerCategory', label: 'Partner category', type: 'select', required: true, options: [...channel.partnerTypes, 'Other'] },
          { name: 'organization', label: 'Organisation name (if any)', type: 'text', maxLength: 160 },
          { name: 'profileUrl', label: 'Website or professional profile (optional)', type: 'url', pattern: URL_PATTERN, patternMessage: 'Enter a web address, like linkedin.com/in/yourname.' },
          { name: 'experience', label: 'Professional experience', type: 'textarea', required: true, maxLength: 1500 },
          { name: 'network', label: 'Your business network or target customers', type: 'textarea', required: true, maxLength: 1500, hint: 'Who do you know? For example: schools in Salem, clinics, retailers.' },
        ],
      },
      {
        id: 'interest',
        title: 'Partnership interest',
        fields: [
          { name: 'services', label: 'GLOARO services you could introduce', type: 'chips', required: true, options: serviceOptions },
          { name: 'industries', label: 'Industries you work with', type: 'chips', required: true, options: industries },
          { name: 'involvement', label: 'Expected involvement', type: 'cards', required: true, options: [['Occasional', 'A few introductions a year'], ['Regular', 'Introductions most months'], ['Active', 'Business development is my main work']] },
          { name: 'engagementNotice', label: 'Preferred engagement model', type: 'notice', value: PENDING, text: 'Engagement models will be offered once they are approved.' },
        ],
      },
      {
        id: 'additional',
        title: 'Additional information',
        fields: [
          { name: 'approach', label: 'How do you expect to introduce opportunities?', type: 'textarea', required: true, maxLength: 1500 },
          { name: 'questions', label: 'Questions or anything else (optional)', type: 'textarea', maxLength: 1500 },
          { name: 'referralSource', label: 'How did you hear about us? (optional)', type: 'select', options: ['Search engine', 'Social media', 'A GLOARO team member', 'Someone I know', 'An event', 'Other'] },
        ],
      },
      { id: 'review', title: 'Review and submit', fields: [] },
    ],
  },
}

// Field names that hold answers (notices are display-only).
export const answerFields = (step) => step.fields.filter((field) => field.type !== 'notice')

export const fieldId = (name) => `field-${name}`

export function buildRules(field) {
  const rules = {}
  if (field.type === 'chips') {
    if (field.required) rules.validate = (value) => (Array.isArray(value) && value.length > 0) || 'Choose at least one option.'
    return rules
  }
  if (field.required) rules.required = field.type === 'cards' || field.type === 'select' ? 'Choose an option.' : `Enter your ${field.label.toLowerCase()}.`
  if (field.maxLength) rules.maxLength = { value: field.maxLength, message: `Keep this under ${field.maxLength} characters.` }
  if (field.pattern) rules.pattern = { value: field.pattern, message: field.patternMessage }
  if (field.type !== 'select' && field.type !== 'cards') rules.setValueAs = (value) => (typeof value === 'string' ? value.trim() : value)
  return rules
}
