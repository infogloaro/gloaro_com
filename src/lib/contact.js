// Shared contact details for public CTAs.
export const WHATSAPP_PHONE = '917200537071'

export const whatsappLink = (message) =>
  `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`
