// Indian e-commerce conventions: MRP and discount, GST-inclusive pricing, pincode delivery.

export const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`
export const discountPct = (p) => (p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0)

export const GST_RATE = 0.18
export const FREE_DELIVERY_ABOVE = 499
export const DELIVERY_FEE = 49
export const EXPRESS_FEE = 99
export const COD_FEE = 49
export const COD_LIMIT = 50000

export const PROMOS = {
  GLOARO10: { label: '10% off, up to ₹2,000', apply: (sub) => Math.min(sub * 0.1, 2000) },
  FIRST500: { label: '₹500 off orders above ₹2,999', apply: (sub) => (sub >= 2999 ? 500 : 0), min: 2999 },
}

// Delivery speed by the first digit of the pincode (postal region). Deterministic, frontend-only.
const REGION_DAYS = { 1: 2, 2: 3, 3: 3, 4: 2, 5: 2, 6: 2, 7: 4, 8: 4 }
export function checkPincode(pin, baseDays = 2) {
  if (!/^[1-8]\d{5}$/.test(pin)) return { ok: false, message: 'Enter a valid 6-digit pincode' }
  const days = baseDays + (REGION_DAYS[pin[0]] ?? 3) - 2
  return { ok: true, days, date: addDays(days), cod: pin[0] !== '7' }
}

export function addDays(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function luhn(num) {
  const digits = num.replace(/\D/g, '')
  if (digits.length < 13 || digits.length > 19) return false
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i])
    if (i % 2) { d *= 2; if (d > 9) d -= 9 }
    sum += d
  }
  return sum % 10 === 0
}

export function expiryValid(mmyy) {
  const m = /^(\d{2})\/(\d{2})$/.exec(mmyy)
  if (!m) return false
  const month = Number(m[1])
  const year = 2000 + Number(m[2])
  if (month < 1 || month > 12) return false
  const now = new Date()
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1)
}

export const BANKS = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank', 'Yes Bank']
export const STATES = ['Tamil Nadu', 'Karnataka', 'Kerala', 'Maharashtra', 'Delhi', 'Telangana', 'Gujarat', 'West Bengal', 'Uttar Pradesh', 'Rajasthan']

export function emiPlans(total) {
  return [3, 6, 9, 12].map((months) => {
    const noCost = months <= 6
    const rate = noCost ? 0 : 0.15
    const monthly = noCost ? total / months : (total * (rate / 12)) / (1 - Math.pow(1 + rate / 12, -months))
    return { months, monthly, noCost, interest: monthly * months - total }
  })
}

export const newOrderId = () => `GL${Date.now().toString().slice(-8)}`
