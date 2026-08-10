/* eslint-disable react-hooks/set-state-in-effect, react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { customerApi } from '../api/customer'
import { paymentApi } from '../api/payment'
import { ordersApi } from '../api/orders'

const ShopContext = createContext(null)

const COUPONS = [
  { code: 'WELCOME10', label: '10% off first order', type: 'percentage', value: 10, minAmount: 999 },
  { code: 'BULK15', label: '15% off orders above 4999', type: 'percentage', value: 15, minAmount: 4999 },
  { code: 'FREESHIP', label: 'Free shipping above 1499', type: 'shipping', value: 100, minAmount: 1499 },
  { code: 'SAVE250', label: 'Flat 250 off', type: 'flat', value: 250, minAmount: 1999 },
]

const RETURN_REASONS = [
  { value: 'defective', label: 'Product is defective or not working' },
  { value: 'wrong_item', label: 'Wrong item delivered' },
  { value: 'not_as_described', label: 'Not as described / misleading' },
  { value: 'size_fit', label: 'Size or fit issue' },
  { value: 'quality', label: 'Quality not up to expectation' },
  { value: 'damaged', label: 'Damaged during shipping' },
  { value: 'missing_parts', label: 'Missing parts or accessories' },
  { value: 'duplicate', label: 'Accidental duplicate order' },
  { value: 'no_longer_needed', label: 'No longer needed' },
  { value: 'other', label: 'Other reason' },
]

const REFUND_REASONS = [
  { value: 'charged_twice', label: 'Charged twice for the same order' },
  { value: 'wrong_amount', label: 'Charged wrong amount' },
  { value: 'order_cancelled', label: 'Order was cancelled but not refunded' },
  { value: 'item_returned', label: 'Returned item not refunded yet' },
  { value: 'service_not_received', label: 'Service not received' },
  { value: 'other', label: 'Other reason' },
]

const RETURN_METHODS = [
  { value: 'pickup', label: 'Free Pickup', description: 'We will pick up the item from your address' },
  { value: 'self_ship', label: 'Self Ship', description: 'You ship the item back and we reimburse up to ₹100' },
]

const REFUND_METHODS = [
  { value: 'original', label: 'Original Payment Method', description: 'Refund to your original payment source (3-5 business days)' },
  { value: 'store_credit', label: 'Store Credit (Instant)', description: 'Instant credit to your Gloaro wallet for future purchases' },
]

const RETURN_STATUS_FLOW = [
  { status: 'requested', label: 'Return Requested', description: 'Your return request has been submitted' },
  { status: 'approved', label: 'Return Approved', description: 'Seller has approved your return request' },
  { status: 'pickup_scheduled', label: 'Pickup Scheduled', description: 'Pickup has been scheduled at your address' },
  { status: 'picked_up', label: 'Item Picked Up', description: 'Item has been picked up by the courier' },
  { status: 'processing', label: 'Processing at Warehouse', description: 'Item is being inspected at the warehouse' },
  { status: 'refund_initiated', label: 'Refund Initiated', description: 'Refund has been initiated' },
  { status: 'refund_completed', label: 'Refund Completed', description: 'Refund has been credited to your account' },
]

const REFUND_STATUS_FLOW = [
  { status: 'requested', label: 'Refund Requested', description: 'Your refund request has been submitted' },
  { status: 'approved', label: 'Refund Approved', description: 'Your refund request has been approved' },
  { status: 'processing', label: 'Processing', description: 'Refund is being processed' },
  { status: 'initiated', label: 'Refund Initiated', description: 'Refund has been initiated to your payment source' },
  { status: 'completed', label: 'Refund Completed', description: 'Refund has been credited to your account' },
]

export { RETURN_REASONS, REFUND_REASONS, RETURN_METHODS, REFUND_METHODS, RETURN_STATUS_FLOW, REFUND_STATUS_FLOW }

const EMPTY_STATE = {
  cart: [],
  savedForLater: [],
  recentlyViewed: [],
  localWishlist: [],
  orders: [],
  activeCoupon: null,
  selectedAddressId: null,
  deliveryMethod: 'standard',
  checkoutNotes: '',
  trackingOrderId: null,
}

const STORAGE_PREFIX = 'gloaro_shop_state'

const safeParse = (value, fallback = null) => {
  if (!value) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

const createStorageKey = (userId) => `${STORAGE_PREFIX}:${userId || 'guest'}`

const loadState = (key) => {
  const raw = localStorage.getItem(key) || sessionStorage.getItem(key)
  const parsed = safeParse(raw, null)
  return parsed ? { ...EMPTY_STATE, ...parsed } : { ...EMPTY_STATE }
}

const persistState = (key, state) => {
  const payload = JSON.stringify(state)
  localStorage.setItem(key, payload)
  sessionStorage.setItem(key, payload)
}

const normalizeVariant = (product, variant) => {
  if (!variant) return null
  return {
    name: variant.name || variant.label || 'Variant',
    option: variant.option || variant.value || variant.selected || variant.sku || '',
    sku: variant.sku || `${product.productId || product._id}-${variant.option || variant.value || variant.sku || 'default'}`,
    price: Number(variant.discountPrice ?? variant.price ?? product.pricing?.sellingPrice ?? 0),
    originalPrice: Number(variant.mrp ?? variant.originalPrice ?? product.pricing?.mrp ?? variant.price ?? product.pricing?.sellingPrice ?? 0),
    stock: Number(variant.stock ?? product.inventory?.quantity ?? 0),
    status: String(variant.status || (Number(variant.stock ?? product.inventory?.quantity ?? 0) > 0 ? 'in_stock' : 'out_of_stock')),
    images: Array.isArray(variant.images) ? variant.images : [],
  }
}

const deriveCartLine = (product, variant, quantity = 1) => {
  const selectedVariant = normalizeVariant(product, variant)
  const basePrice = Number(selectedVariant?.price ?? product.pricing?.sellingPrice ?? 0)
  const originalPrice = Number(selectedVariant?.originalPrice ?? product.pricing?.mrp ?? basePrice)
  const stock = Number.isFinite(selectedVariant?.stock) ? selectedVariant.stock : Number(product.inventory?.quantity || 0)
  const productSku = String(product.sku || product.productId || product._id || selectedVariant?.sku || 'SKU').toUpperCase()
  const shippingInfo = {
    ...(product.shippingInfo || {}),
    weight: Number(product.shippingInfo?.weight || product.weight || 1),
    dimensions: {
      length: Number(product.shippingInfo?.dimensions?.length || 10),
      breadth: Number(product.shippingInfo?.dimensions?.breadth || product.shippingInfo?.dimensions?.width || 10),
      width: Number(product.shippingInfo?.dimensions?.width || product.shippingInfo?.dimensions?.breadth || 10),
      height: Number(product.shippingInfo?.dimensions?.height || 10),
    },
  }
  const lineKey = `${product._id}:${selectedVariant?.sku || 'base'}`
  return {
    lineKey,
    productId: product._id,
    quantity: Math.max(1, Number(quantity || 1)),
    addedAt: new Date().toISOString(),
    productSnapshot: {
      _id: product._id,
      title: product.title,
      slug: product.slug,
      brand: product.brand,
      category: product.category,
      images: product.images || [],
      pricing: product.pricing || {},
      inventory: product.inventory || {},
      vendor: product.vendor || {},
      stats: product.stats || {},
      sku: productSku,
      shippingInfo,
      status: product.status,
      isFeatured: product.isFeatured,
    },
    variant: selectedVariant,
    unitPrice: basePrice,
    originalPrice,
    stock,
    lineTotal: basePrice * Math.max(1, Number(quantity || 1)),
  }
}

const recalculateLine = (line) => {
  const qty = Math.max(1, Number(line.quantity || 1))
  const unitPrice = Number(line.variant?.price ?? line.productSnapshot?.pricing?.sellingPrice ?? line.unitPrice ?? 0)
  const originalPrice = Number(line.variant?.originalPrice ?? line.productSnapshot?.pricing?.mrp ?? line.originalPrice ?? unitPrice)
  const stock = Number.isFinite(Number(line.variant?.stock)) ? Number(line.variant.stock) : Number(line.stock ?? line.productSnapshot?.inventory?.quantity ?? 0)
  return {
    ...line,
    quantity: qty,
    unitPrice,
    originalPrice,
    stock,
    lineTotal: unitPrice * qty,
  }
}

const mergeUniqueByKey = (items = [], incoming = [], keyField = 'lineKey') => {
  const map = new Map(items.map((item) => [item[keyField], item]))
  incoming.forEach((item) => {
    if (!item?.[keyField]) return
    map.set(item[keyField], item)
  })
  return [...map.values()]
}

const CANCELABLE_ORDER_STATUSES = new Set(['placed', 'confirmed'])
const RETURN_WINDOW_MS = 7 * 24 * 60 * 60 * 1000

const getDeliveredAt = (order) => {
  const deliveredAt = order?.deliveredAt || order?.tracking?.find((step) => step.status === 'delivered')?.at || null
  const date = deliveredAt ? new Date(deliveredAt) : null
  return date && !Number.isNaN(date.getTime()) ? date : null
}

const isWithinReturnWindow = (order) => {
  const deliveredAt = getDeliveredAt(order)
  if (!deliveredAt) return false
  return Date.now() - deliveredAt.getTime() <= RETURN_WINDOW_MS
}

const canCancelOrder = (order) => Boolean(order?._id) && CANCELABLE_ORDER_STATUSES.has(order.status) && !order.returnRequest
const canReturnOrder = (order) => Boolean(order?._id) && order.status === 'delivered' && !order.returnRequest && isWithinReturnWindow(order)

const mergeOrdersById = (currentOrders = [], incomingOrders = []) => {
  const map = new Map()

  currentOrders.forEach((order) => {
    if (order?._id) {
      map.set(String(order._id), order)
    }
  })

  incomingOrders.forEach((order) => {
    if (!order?._id) return
    const key = String(order._id)
    const existing = map.get(key)
    map.set(key, {
      ...existing,
      ...order,
      returnRequest: order.returnRequest ?? existing?.returnRequest ?? null,
      refund: order.refund ?? existing?.refund ?? null,
      tracking: Array.isArray(order.tracking) && order.tracking.length ? order.tracking : existing?.tracking || [],
    })
  })

  return [...map.values()].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
}

const buildOrderNumber = () => `GLO-${Date.now().toString(36).toUpperCase()}`

const computeTotals = (cart, activeCoupon, deliveryMethod) => {
  const subtotal = cart.reduce((sum, line) => sum + Number(line.unitPrice || 0) * Number(line.quantity || 0), 0)
  const mrpTotal = cart.reduce((sum, line) => sum + Number(line.originalPrice || line.unitPrice || 0) * Number(line.quantity || 0), 0)
  const productDiscount = Math.max(0, mrpTotal - subtotal)
  const taxRate = 0.12
  const taxableAmount = subtotal - productDiscount
  const tax = Math.max(0, taxableAmount * taxRate)
  const shippingBase = deliveryMethod === 'express' ? 149 : deliveryMethod === 'scheduled' ? 79 : 59
  const shipping = subtotal === 0 ? 0 : (subtotal >= 1499 ? 0 : shippingBase)
  const coupon = activeCoupon || null
  let couponDiscount = 0
  if (coupon?.code) {
    if (coupon.type === 'percentage') couponDiscount = Math.round(((subtotal - productDiscount) * coupon.value) / 100)
    if (coupon.type === 'flat') couponDiscount = Math.min(coupon.value, subtotal - productDiscount)
    if (coupon.type === 'shipping') couponDiscount = shipping
  }
  const total = Math.max(0, Math.round(subtotal - productDiscount + tax + shipping - couponDiscount))
  return {
    subtotal: Math.round(subtotal),
    mrpTotal: Math.round(mrpTotal),
    productDiscount: Math.round(productDiscount),
    tax: Math.round(tax),
    shipping: Math.round(shipping),
    couponDiscount: Math.round(couponDiscount),
    total,
  }
}

const createLocalOrder = ({ cart, address, deliveryMethod, activeCoupon, notes }) => {
  const totals = computeTotals(cart, activeCoupon, deliveryMethod)
  const createdAt = new Date().toISOString()
  const eta = deliveryMethod === 'express' ? 2 : deliveryMethod === 'scheduled' ? 4 : 5
  const order = {
    _id: crypto.randomUUID(),
    orderNumber: buildOrderNumber(),
    createdAt,
    updatedAt: createdAt,
    status: 'placed',
    paymentStatus: 'pending',
    paymentMethod: 'razorpay',
    deliveryMethod,
    address,
    notes: notes || '',
    items: cart.map((line) => ({
      productId: line.productId,
      productSnapshot: line.productSnapshot,
      variant: line.variant,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      originalPrice: line.originalPrice,
      lineTotal: line.lineTotal,
    })),
    tracking: [
      { status: 'placed', label: 'Order placed', at: createdAt },
      { status: 'processing', label: 'Packed by seller', at: null },
      { status: 'shipped', label: 'Out for delivery', at: null },
      { status: 'delivered', label: 'Delivered', at: null },
    ],
    refund: null,
    returnRequest: null,
    invoiceNumber: `INV-${buildOrderNumber()}`,
    estimatedDeliveryDate: new Date(Date.now() + eta * 24 * 60 * 60 * 1000).toISOString(),
    ...totals,
  }
  return order
}

const PDF_PAGE_WIDTH = 595.28
const PDF_PAGE_HEIGHT = 841.89
const PDF_MARGIN_X = 36
const PDF_TOP = 40
const PDF_BOTTOM = 42
const PDF_LINE_HEIGHT = 14
const PDF_BODY_FONT = 10
const PDF_SMALL_FONT = 8

const normalizePdfText = (value) => String(value ?? '')
  .replace(/\r?\n+/g, ' ')
  .replace(/[^\x20-\x7E]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const escapePdfText = (value) => normalizePdfText(value)
  .replace(/\\/g, '\\\\')
  .replace(/\(/g, '\\(')
  .replace(/\)/g, '\\)')

const formatPdfMoney = (value) => `INR ${Number(value || 0).toLocaleString('en-IN')}`

const formatPdfDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatPdfAddress = (address) => {
  if (!address) return '-'
  if (typeof address === 'string') return normalizePdfText(address)
  if (Array.isArray(address)) return address.map(formatPdfAddress).filter(Boolean).join(', ')
  if (typeof address !== 'object') return normalizePdfText(address)
  return [
    address.fullName,
    address.line1,
    address.line2,
    address.landmark,
    address.city,
    address.state,
    address.pincode,
  ].filter(Boolean).map(normalizePdfText).join(', ') || '-'
}

const wrapPdfText = (text, maxChars = 48) => {
  const words = normalizePdfText(text).split(' ').filter(Boolean)
  const lines = []
  let current = ''
  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word
    if (next.length > maxChars && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  })
  if (current) lines.push(current)
  return lines.length ? lines : ['']
}

const createPdfText = (x, y, text, size = PDF_BODY_FONT, font = 'F1', color = '0 0 0') => {
  const safe = escapePdfText(text)
  return [
    'BT',
    `/${font} ${size} Tf`,
    `${color} rg`,
    `1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm`,
    `(${safe}) Tj`,
    'ET',
  ].join('\n')
}

const estimatePdfTextWidth = (text, size = PDF_BODY_FONT) => normalizePdfText(text).length * size * 0.52

const createPdfTextRight = (xRight, y, text, size = PDF_BODY_FONT, font = 'F1', color = '0 0 0') => {
  const width = estimatePdfTextWidth(text, size)
  return createPdfText(Math.max(18, xRight - width), y, text, size, font, color)
}

const createPdfLine = (x1, y1, x2, y2, width = 1, color = '0 0 0') => [
  `${width} w`,
  `${color} RG`,
  `${x1.toFixed(2)} ${y1.toFixed(2)} m`,
  `${x2.toFixed(2)} ${y2.toFixed(2)} l`,
  'S',
].join('\n')

const createPdfRect = (x, y, width, height, fillColor = null, strokeColor = null, strokeWidth = 1) => {
  const parts = []
  if (fillColor) {
    parts.push(`${fillColor} rg`)
  }
  if (strokeColor) {
    parts.push(`${strokeWidth} w`)
    parts.push(`${strokeColor} RG`)
  }
  parts.push(`${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re`)
  parts.push(fillColor ? 'B' : strokeColor ? 'S' : 'n')
  return parts.join('\n')
}

const buildInvoicePdf = (order) => {
  const customerName = normalizePdfText(order.customerSnapshot?.name || order.user?.name || 'Guest Customer')
  const customerEmail = normalizePdfText(order.customerSnapshot?.email || order.user?.email || '-')
  const customerPhone = normalizePdfText(order.customerSnapshot?.phone || order.user?.phone || '-')
  const orderNumber = normalizePdfText(order.orderNumber || order._id)
  const invoiceNumber = normalizePdfText(order.invoiceNumber || `INV-${orderNumber}`)
  const createdAt = formatPdfDate(order.createdAt)
  const paymentMethod = normalizePdfText(order.paymentMethod || 'razorpay')
  const paymentStatus = normalizePdfText(order.paymentStatus || 'pending')
  const deliveryMethod = normalizePdfText(order.deliveryMethod || 'standard')
  const address = formatPdfAddress(order.address)
  const shiprocketStatus = normalizePdfText(order.shiprocket?.status || '-')
  const items = Array.isArray(order.items) ? order.items : []

  const objects = []
  const addObject = (body) => {
    objects.push(body)
    return objects.length
  }

  const buildPageContent = (pageItems, pageIndex, totalPages) => {
    const content = []
    const dark = '0.05 0.15 0.30'
    const navy = '0.08 0.23 0.44'
    const gold = '0.84 0.67 0.18'
    const soft = '0.97 0.98 0.99'
    const border = '0.86 0.89 0.93'
    const muted = '0.39 0.44 0.50'
    let y = PDF_PAGE_HEIGHT - PDF_TOP

    content.push(createPdfRect(0, 0, PDF_PAGE_WIDTH, PDF_PAGE_HEIGHT, '0.99 0.99 1.00'))
    content.push(createPdfRect(0, PDF_PAGE_HEIGHT - 104, PDF_PAGE_WIDTH, 104, dark))
    content.push(createPdfRect(PDF_MARGIN_X, PDF_PAGE_HEIGHT - 72, 110, 24, gold))
    content.push(createPdfText(PDF_MARGIN_X + 16, PDF_PAGE_HEIGHT - 56, 'GLOARO', 19, 'F2', '1 1 1'))
    content.push(createPdfText(PDF_MARGIN_X, PDF_PAGE_HEIGHT - 82, 'Premium Marketplace Invoice', 9, 'F1', '0.90 0.93 0.97'))
    content.push(createPdfTextRight(PDF_PAGE_WIDTH - 38, PDF_PAGE_HEIGHT - 40, `Invoice No: ${invoiceNumber}`, 11, 'F2', '1 1 1'))
    content.push(createPdfTextRight(PDF_PAGE_WIDTH - 38, PDF_PAGE_HEIGHT - 58, `Order No: ${orderNumber}`, 9, 'F1', '0.90 0.93 0.97'))

    y -= 122
    const topCardY = y
    const leftCardX = PDF_MARGIN_X
    const leftCardW = 260
    const rightCardX = 309
    const rightCardW = PDF_PAGE_WIDTH - rightCardX - PDF_MARGIN_X
    const cardH = 124

    content.push(createPdfRect(leftCardX, topCardY - cardH, leftCardW, cardH, '1 1 1', border, 1))
    content.push(createPdfRect(rightCardX, topCardY - cardH, rightCardW, cardH, '1 1 1', border, 1))
    content.push(createPdfRect(leftCardX, topCardY - 12, leftCardW, 12, soft))
    content.push(createPdfRect(rightCardX, topCardY - 12, rightCardW, 12, soft))
    content.push(createPdfText(leftCardX + 14, topCardY - 18, 'BILL TO', 8, 'F2', navy))
    content.push(createPdfText(leftCardX + 14, topCardY - 40, customerName, 15, 'F2', '0.09 0.12 0.20'))
    wrapPdfText(address, 40).slice(0, 3).forEach((line, index) => {
      content.push(createPdfText(leftCardX + 14, topCardY - 58 - (index * 12), line, 9, 'F1', muted))
    })
    content.push(createPdfText(leftCardX + 14, topCardY - 102, customerEmail, 9, 'F1', muted))
    content.push(createPdfText(leftCardX + 14, topCardY - 116, customerPhone, 9, 'F1', muted))

    content.push(createPdfText(rightCardX + 14, topCardY - 18, 'ORDER SUMMARY', 8, 'F2', navy))
    const summaryRows = [
      ['Placed on', createdAt],
      ['Payment', `${paymentMethod} · ${paymentStatus}`],
      ['Delivery', deliveryMethod],
      ['Shiprocket', shiprocketStatus],
    ]
    summaryRows.forEach((row, index) => {
      const rowTop = topCardY - 42 - (index * 18)
      content.push(createPdfText(rightCardX + 14, rowTop, row[0], 8, 'F2', muted))
      content.push(createPdfTextRight(rightCardX + rightCardW - 14, rowTop, row[1], 9, 'F1', '0.08 0.12 0.18'))
    })

    const tableTop = topCardY - cardH - 26
    const tableLeft = PDF_MARGIN_X
    const tableWidth = PDF_PAGE_WIDTH - (PDF_MARGIN_X * 2)
    const itemX = tableLeft + 14
    const qtyX = tableLeft + tableWidth - 232
    const unitX = tableLeft + tableWidth - 170
    const totalX = tableLeft + tableWidth - 64
    const rowHeight = 44

    content.push(createPdfRect(tableLeft, tableTop - 28, tableWidth, 28, navy))
    content.push(createPdfText(itemX, tableTop - 10, 'ITEM', 9, 'F2', '1 1 1'))
    content.push(createPdfText(qtyX, tableTop - 10, 'QTY', 9, 'F2', '1 1 1'))
    content.push(createPdfText(unitX, tableTop - 10, 'UNIT PRICE', 9, 'F2', '1 1 1'))
    content.push(createPdfText(totalX, tableTop - 10, 'AMOUNT', 9, 'F2', '1 1 1'))

    let rowY = tableTop - 40
    pageItems.forEach((item, index) => {
      const title = normalizePdfText(item.productSnapshot?.title || 'Product')
      const variant = normalizePdfText(item.variant?.option || item.variant?.name || 'Default')
      const rowFill = index % 2 === 0 ? '1 1 1' : '0.985 0.987 0.99'
      content.push(createPdfRect(tableLeft, rowY - 20, tableWidth, rowHeight, rowFill, border, 0.6))
      content.push(createPdfText(itemX, rowY, title.slice(0, 54), 10, 'F2', '0.09 0.12 0.20'))
      content.push(createPdfText(itemX, rowY - 13, variant.slice(0, 46), 8, 'F1', muted))
      content.push(createPdfTextRight(qtyX + 24, rowY, String(item.quantity || 1), 10, 'F2', '0.09 0.12 0.20'))
      content.push(createPdfTextRight(unitX + 64, rowY, formatPdfMoney(item.unitPrice), 10, 'F2', '0.09 0.12 0.20'))
      content.push(createPdfTextRight(totalX + 40, rowY, formatPdfMoney(item.lineTotal), 10, 'F2', navy))
      rowY -= rowHeight
    })

    const totalsBoxW = 214
    const totalsBoxX = PDF_PAGE_WIDTH - PDF_MARGIN_X - totalsBoxW
    const totalsBoxY = Math.max(rowY - 16, PDF_BOTTOM + 118)
    content.push(createPdfRect(totalsBoxX, totalsBoxY - 82, totalsBoxW, 96, '1 1 1', border, 1))
    content.push(createPdfRect(totalsBoxX, totalsBoxY + 14, totalsBoxW, 14, gold))
    content.push(createPdfText(totalsBoxX + 14, totalsBoxY + 28, 'SUBTOTAL', 8, 'F2', muted))
    content.push(createPdfTextRight(PDF_PAGE_WIDTH - PDF_MARGIN_X - 14, totalsBoxY + 28, formatPdfMoney(order.subtotal), 9, 'F2', '0.10 0.12 0.16'))
    content.push(createPdfText(totalsBoxX + 14, totalsBoxY + 12, 'TAX', 8, 'F2', muted))
    content.push(createPdfTextRight(PDF_PAGE_WIDTH - PDF_MARGIN_X - 14, totalsBoxY + 12, formatPdfMoney(order.tax), 9, 'F2', '0.10 0.12 0.16'))
    content.push(createPdfText(totalsBoxX + 14, totalsBoxY - 4, 'SHIPPING', 8, 'F2', muted))
    content.push(createPdfTextRight(PDF_PAGE_WIDTH - PDF_MARGIN_X - 14, totalsBoxY - 4, formatPdfMoney(order.shipping), 9, 'F2', '0.10 0.12 0.16'))
    content.push(createPdfText(totalsBoxX + 14, totalsBoxY - 20, 'COUPON', 8, 'F2', muted))
    content.push(createPdfTextRight(PDF_PAGE_WIDTH - PDF_MARGIN_X - 14, totalsBoxY - 20, `- ${formatPdfMoney(order.couponDiscount || 0)}`, 9, 'F2', '0.10 0.12 0.16'))
    content.push(createPdfLine(totalsBoxX + 14, totalsBoxY - 34, PDF_PAGE_WIDTH - PDF_MARGIN_X - 14, totalsBoxY - 34, 0.8, border))
    content.push(createPdfText(totalsBoxX + 14, totalsBoxY - 52, 'GRAND TOTAL', 11, 'F2', navy))
    content.push(createPdfTextRight(PDF_PAGE_WIDTH - PDF_MARGIN_X - 14, totalsBoxY - 52, formatPdfMoney(order.total), 14, 'F2', navy))

    content.push(createPdfRect(PDF_MARGIN_X, PDF_BOTTOM + 54, 188, 30, soft, border, 1))
    content.push(createPdfText(PDF_MARGIN_X + 12, PDF_BOTTOM + 72, 'Paid securely through Gloaro checkout', 9, 'F2', navy))
    content.push(createPdfLine(PDF_MARGIN_X, PDF_BOTTOM + 36, PDF_PAGE_WIDTH - PDF_MARGIN_X, PDF_BOTTOM + 36, 0.8, border))
    content.push(createPdfText(PDF_MARGIN_X, PDF_BOTTOM + 22, `Page ${pageIndex} of ${totalPages}`, 8, 'F1', muted))
    content.push(createPdfTextRight(PDF_PAGE_WIDTH - PDF_MARGIN_X, PDF_BOTTOM + 22, 'Thank you for shopping with Gloaro', 8, 'F2', navy))
    return content.join('\n')
  }

  const itemsPerPage = 5
  const pageCount = Math.max(1, Math.ceil(items.length / itemsPerPage))
  const pageObjectIds = []
  const contentObjectIds = []

  for (let index = 0; index < pageCount; index += 1) {
    const pageItems = items.slice(index * itemsPerPage, (index + 1) * itemsPerPage)
    const stream = buildPageContent(pageItems, index + 1, pageCount)
    const contentId = addObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`)
    const pageId = addObject(null)
    contentObjectIds.push(contentId)
    pageObjectIds.push(pageId)
  }

  const fontRegularId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')
  const fontBoldId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>')

  pageObjectIds.forEach((pageId, index) => {
    objects[pageId - 1] = `<< /Type /Page /Parent 0 0 R /MediaBox [0 0 ${PDF_PAGE_WIDTH} ${PDF_PAGE_HEIGHT}] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentObjectIds[index]} 0 R >>`
  })

  const pagesId = addObject(`<< /Type /Pages /Count ${pageObjectIds.length} /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] >>`)
  objects.forEach((body, index) => {
    if (body && body.includes('/Parent 0 0 R')) {
      objects[index] = body.replace('/Parent 0 0 R', `/Parent ${pagesId} 0 R`)
    }
  })

  const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`)

  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  objects.forEach((body, index) => {
    offsets.push(pdf.length)
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`
  })
  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (let index = 1; index <= objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

  return new Blob([pdf], { type: 'application/pdf' })
}

export function ShopProvider({ children }) {
  const { user, socket } = useAuth()
  const storageKey = useMemo(() => createStorageKey(user?._id), [user?._id])
  const guestKey = useMemo(() => createStorageKey(null), [])
  const [state, setState] = useState(() => loadState(storageKey))

  useEffect(() => {
    const nextState = loadState(storageKey)
    if (user?._id) {
      const guestState = loadState(guestKey)
      const hasGuestContent =
        guestState.cart.length ||
        guestState.savedForLater.length ||
        guestState.recentlyViewed.length ||
        guestState.localWishlist.length ||
        guestState.orders.length

      if (hasGuestContent) {
        const merged = {
          ...nextState,
          cart: mergeUniqueByKey(nextState.cart, guestState.cart),
          savedForLater: mergeUniqueByKey(nextState.savedForLater, guestState.savedForLater),
          recentlyViewed: mergeUniqueByKey(nextState.recentlyViewed, guestState.recentlyViewed, 'productId'),
          localWishlist: mergeUniqueByKey(nextState.localWishlist, guestState.localWishlist, 'productId'),
          orders: mergeUniqueByKey(nextState.orders, guestState.orders, '_id'),
        }
        setState(merged)
        persistState(storageKey, merged)
        persistState(guestKey, { ...EMPTY_STATE })
        return
      }
    }

    setState(nextState)
  }, [guestKey, storageKey, user?._id])

  useEffect(() => {
    persistState(storageKey, state)
  }, [state, storageKey])

  useEffect(() => {
    if (!socket) return undefined

    const handleOrderUpdated = (payload = {}) => {
      const orderId = payload.orderId || payload._id
      if (!orderId) return

      setState((current) => ({
        ...current,
        orders: current.orders.map((order) => {
          if (String(order._id) !== String(orderId)) return order
          return {
            ...order,
            status: payload.status || order.status,
            tracking: Array.isArray(payload.tracking) && payload.tracking.length ? payload.tracking : order.tracking,
            updatedAt: new Date().toISOString(),
          }
        }),
      }))
    }

    socket.on('order_updated', handleOrderUpdated)
    return () => {
      socket.off('order_updated', handleOrderUpdated)
    }
  }, [socket])

  useEffect(() => {
    if (!user?._id) return undefined

    let mounted = true

    const syncOrders = async () => {
      try {
        const response = await ordersApi.orders({ page: 1, limit: 200, status: 'all', paymentStatus: 'all' })
        const remoteOrders = response.data?.data || response.data || []
        if (!mounted || !Array.isArray(remoteOrders)) return

        setState((current) => ({
          ...current,
          orders: mergeOrdersById(current.orders, remoteOrders),
        }))
      } catch {
        // Keep the locally cached order list if the backend sync is temporarily unavailable.
      }
    }

    syncOrders()
    const timer = window.setInterval(syncOrders, 15000)

    return () => {
      mounted = false
      window.clearInterval(timer)
    }
  }, [user?._id])

  const upsertCartLine = useCallback((product, variant, quantity = 1) => {
    if (!product?._id) return
    const line = deriveCartLine(product, variant, quantity)
    setState((current) => {
      const existingIndex = current.cart.findIndex((item) => item.lineKey === line.lineKey)
      const nextCart = [...current.cart]
      if (existingIndex >= 0) {
        const currentLine = nextCart[existingIndex]
        const nextQuantity = Math.min(Number(currentLine.stock || line.stock || 999), Number(currentLine.quantity || 1) + Number(quantity || 1))
        nextCart[existingIndex] = { ...currentLine, ...line, quantity: nextQuantity, lineTotal: nextQuantity * line.unitPrice }
      } else {
        nextCart.push(line)
      }
      return { ...current, cart: nextCart }
    })
    toast.success('Added to cart')
  }, [])

  const updateCartQuantity = useCallback((lineKey, quantity) => {
    setState((current) => ({
      ...current,
      cart: current.cart
        .map((line) => line.lineKey === lineKey ? { ...line, quantity: Math.max(1, Number(quantity || 1)) } : line)
        .map(recalculateLine),
    }))
  }, [])

  const removeFromCart = useCallback((lineKey) => {
    setState((current) => ({ ...current, cart: current.cart.filter((line) => line.lineKey !== lineKey) }))
  }, [])

  const clearCart = useCallback(() => {
    setState((current) => ({ ...current, cart: [] }))
  }, [])

  const saveForLater = useCallback((lineKey) => {
    setState((current) => {
      const line = current.cart.find((item) => item.lineKey === lineKey)
      if (!line) return current
      return {
        ...current,
        cart: current.cart.filter((item) => item.lineKey !== lineKey),
        savedForLater: mergeUniqueByKey(current.savedForLater, [{ ...line, lineKey: `${line.lineKey}:saved` }]),
      }
    })
  }, [])

  const moveToCart = useCallback((savedKey) => {
    setState((current) => {
      const line = current.savedForLater.find((item) => item.lineKey === savedKey)
      if (!line) return current
      const nextLine = { ...line, lineKey: line.lineKey.replace(':saved', '') }
      return {
        ...current,
        savedForLater: current.savedForLater.filter((item) => item.lineKey !== savedKey),
        cart: mergeUniqueByKey(current.cart, [recalculateLine(nextLine)]),
      }
    })
  }, [])

  const removeSaved = useCallback((savedKey) => {
    setState((current) => ({ ...current, savedForLater: current.savedForLater.filter((item) => item.lineKey !== savedKey) }))
  }, [])

  const addRecentlyViewed = useCallback((product) => {
    if (!product?._id) return
    setState((current) => {
      const item = {
        productId: product._id,
        viewedAt: new Date().toISOString(),
        productSnapshot: {
          _id: product._id,
          title: product.title,
          images: product.images || [],
          pricing: product.pricing || {},
          category: product.category || {},
          vendor: product.vendor || {},
        },
      }
      const next = [item, ...current.recentlyViewed.filter((entry) => entry.productId !== product._id)].slice(0, 10)
      return { ...current, recentlyViewed: next }
    })
  }, [])

  const addLocalWishlist = useCallback((product) => {
    if (!product?._id) return
    let added = false
    setState((current) => {
      const existing = current.localWishlist.some((item) => item.productId === product._id)
      if (existing) return current
      added = true
      return {
        ...current,
        localWishlist: [{
          productId: product._id,
          addedAt: new Date().toISOString(),
          productSnapshot: {
            _id: product._id,
            title: product.title,
            images: product.images || [],
            pricing: product.pricing || {},
            vendor: product.vendor || {},
            category: product.category || {},
          },
        }, ...current.localWishlist].slice(0, 25),
      }
    })
    return added
  }, [])

  const removeLocalWishlist = useCallback((productId) => {
    setState((current) => ({ ...current, localWishlist: current.localWishlist.filter((item) => item.productId !== productId) }))
  }, [])

  const toggleWishlist = useCallback(async (product) => {
    if (!product?._id) return
    if (user?._id) {
      try {
        const itemType = 'product'
        const exists = state.localWishlist.some((item) => item.productId === product._id)
        if (exists) {
          await customerApi.removeWishlist(product._id, itemType, { silent: true })
          removeLocalWishlist(product._id)
          toast.success('Removed from wishlist')
          return
        }
        await customerApi.addWishlist({ itemType, itemId: product._id }, { silent: true })
        const added = addLocalWishlist(product)
        toast.success(added ? 'Saved to wishlist' : 'Already in wishlist')
        return
      } catch {
        // Fall back to the local wishlist path if the API call fails.
        const added = addLocalWishlist(product)
        if (added) toast.success('Saved to wishlist')
      }
    }

    const exists = state.localWishlist.some((item) => item.productId === product._id)
    if (exists) removeLocalWishlist(product._id)
    else if (addLocalWishlist(product)) toast.success('Saved to wishlist')
  }, [addLocalWishlist, removeLocalWishlist, state.localWishlist, user?._id])

  const applyCoupon = useCallback((couponCode, cartSnapshot = state.cart, deliveryMethod = state.deliveryMethod) => {
    const code = String(couponCode || '').trim().toUpperCase()
    const coupon = COUPONS.find((entry) => entry.code === code)
    if (!coupon) {
      toast.error('Invalid coupon code')
      return null
    }
    const totals = computeTotals(cartSnapshot, coupon, deliveryMethod)
    if (totals.subtotal < coupon.minAmount) {
      toast.error(`Spend at least ${coupon.minAmount} to use this coupon`)
      return null
    }
    setState((current) => ({ ...current, activeCoupon: coupon }))
    toast.success(`Coupon ${code} applied`)
    return coupon
  }, [state.cart, state.deliveryMethod])

  const removeCoupon = useCallback(() => {
    setState((current) => ({ ...current, activeCoupon: null }))
  }, [])

  const setCheckoutMeta = useCallback((payload) => {
    setState((current) => ({ ...current, ...payload }))
  }, [])

  const placeLocalOrder = useCallback(async ({ address, deliveryMethod, notes, paymentMethod = 'razorpay' } = {}) => {
    if (!state.cart.length) {
      toast.error('Your cart is empty')
      return null
    }
    const localDraft = createLocalOrder({
      cart: state.cart,
      address,
      deliveryMethod: deliveryMethod || state.deliveryMethod,
      activeCoupon: state.activeCoupon,
      notes: notes ?? state.checkoutNotes,
    })
    let order = localDraft

    const response = await ordersApi.createOrder({
      cart: state.cart,
      address,
      deliveryMethod: deliveryMethod || state.deliveryMethod,
      notes: notes ?? state.checkoutNotes,
      paymentMethod,
      activeCoupon: state.activeCoupon,
    })
    order = response.data?.data || response.data || localDraft

    order = {
      ...order,
      paymentMethod,
      paymentStatus: order.paymentStatus || 'pending',
    }

    setState((current) => ({
      ...current,
      orders: [order, ...current.orders],
      cart: [],
      activeCoupon: null,
      checkoutNotes: '',
      trackingOrderId: order._id,
    }))
    return order
  }, [state.activeCoupon, state.cart, state.checkoutNotes, state.deliveryMethod])

  const markOrderPaid = useCallback((orderId, paymentInfo = {}) => {
    setState((current) => ({
      ...current,
      orders: current.orders.map((order) => {
        if (order._id !== orderId) return order
        return {
          ...order,
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentReference: paymentInfo.paymentId || paymentInfo.razorpay_payment_id || paymentInfo.orderId || paymentInfo.reference,
          updatedAt: new Date().toISOString(),
          tracking: order.tracking.map((step) => (step.status === 'placed' ? { ...step, at: step.at || new Date().toISOString() } : step)),
        }
      }),
    }))
  }, [])

  const submitReturnRequest = useCallback(async (orderId, { items, reason, reasonLabel, details, upiId, returnMethod, refundMethod, evidence = [] }) => {
    if (!orderId || !items?.length || !reason) {
      toast.error('Please complete all required fields')
      return false
    }
    let currentOrder = state.orders.find((order) => String(order._id) === String(orderId))
    if (!canReturnOrder(currentOrder)) {
      toast.error('Returns are available only after delivery')
      return false
    }
    const normalizedUpiId = String(upiId || '').trim()
    if (!normalizedUpiId) {
      toast.error('Please enter a UPI ID for the return request')
      return false
    }
    const now = new Date().toISOString()
    const returnId = crypto.randomUUID()
    const returnRequest = {
      _id: returnId,
      status: 'requested',
      items: items.map((item) => ({
        productId: item.productId,
        productSnapshot: item.productSnapshot,
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || 0,
      })),
      reason,
      reasonLabel: reasonLabel || reason,
      details: details || '',
      upiId: normalizedUpiId,
      returnMethod: returnMethod || 'pickup',
      refundMethod: refundMethod || 'original',
      evidence,
      requestedAt: now,
      returnWindowEndsAt: currentOrder?.deliveredAt ? new Date(new Date(currentOrder.deliveredAt).getTime() + RETURN_WINDOW_MS).toISOString() : null,
      approvedAt: null,
      pickupScheduledAt: null,
      pickupSlot: null,
      pickedUpAt: null,
      processedAt: null,
      refundInitiatedAt: null,
      refundCompletedAt: null,
      rejectedAt: null,
      rejectionReason: null,
      tracking: [
        { status: 'requested', label: 'Return Requested', description: 'Your return request has been submitted', at: now },
        { status: 'approved', label: 'Return Approved', description: 'Seller has approved your return request', at: null },
        { status: 'pickup_scheduled', label: 'Pickup Scheduled', description: 'Pickup has been scheduled at your address', at: null },
        { status: 'picked_up', label: 'Item Picked Up', description: 'Item has been picked up by the courier', at: null },
        { status: 'processing', label: 'Processing at Warehouse', description: 'Item is being inspected at the warehouse', at: null },
        { status: 'refund_initiated', label: 'Refund Initiated', description: 'Refund has been initiated', at: null },
        { status: 'refund_completed', label: 'Refund Completed', description: 'Refund has been credited to your account', at: null },
      ],
      refundAmount: null,
    }
    try {
      const response = await ordersApi.return(orderId, {
        items: returnRequest.items,
        reason,
        reasonLabel,
        details,
        upiId: normalizedUpiId,
        returnMethod,
        refundMethod,
        evidence,
      })
      const updatedOrder = response.data?.data || response.data || null
      setState((current) => ({
        ...current,
        orders: current.orders.map((order) => (order._id === orderId ? { ...order, ...updatedOrder, returnRequest: updatedOrder?.returnRequest || returnRequest } : order)),
      }))
      toast.success('Return request submitted successfully')
      return updatedOrder?.returnRequest || returnRequest
    } catch (error) {
      setState((current) => ({
        ...current,
        orders: current.orders.map((order) => {
          if (order._id !== orderId) return order
          return { ...order, returnRequest }
        }),
      }))
      toast.error(error.response?.data?.message || 'Unable to submit return request')
      return returnRequest
    }
  }, [state.orders])

  const submitRefundRequest = useCallback(async (orderId, { reason, reasonLabel, details, refundMethod, evidence = [] }) => {
    if (!orderId || !reason) {
      toast.error('Please complete all required fields')
      return false
    }
    let currentOrder = state.orders.find((order) => String(order._id) === String(orderId))
    const now = new Date().toISOString()
    const refundId = crypto.randomUUID()
    const refund = {
      _id: refundId,
      status: 'requested',
      reason,
      reasonLabel: reasonLabel || reason,
      details: details || '',
      refundMethod: refundMethod || 'original',
      evidence,
      requestedAt: now,
      approvedAt: null,
      processedAt: null,
      initiatedAt: null,
      completedAt: null,
      rejectedAt: null,
      rejectionReason: null,
      tracking: [
        { status: 'requested', label: 'Refund Requested', description: 'Your refund request has been submitted', at: now },
        { status: 'approved', label: 'Refund Approved', description: 'Your refund request has been approved', at: null },
        { status: 'processing', label: 'Processing', description: 'Refund is being processed', at: null },
        { status: 'initiated', label: 'Refund Initiated', description: 'Refund has been initiated to your payment source', at: null },
        { status: 'completed', label: 'Refund Completed', description: 'Refund has been credited to your account', at: null },
      ],
      refundAmount: null,
    }
    try {
      if (!currentOrder?.paymentId) {
        const fetchedOrder = await ordersApi.order(orderId)
        currentOrder = fetchedOrder.data?.data || fetchedOrder.data || currentOrder
      }

      if (currentOrder?.paymentId) {
        const response = await paymentApi.requestRefund(currentOrder.paymentId, {
          reason,
          amount: currentOrder.total,
        })
        const updatedOrder = response.data?.data || response.data || null
        setState((current) => ({
          ...current,
          orders: current.orders.map((order) => (order._id === orderId ? { ...order, refund: updatedOrder?.refund || refund, paymentStatus: updatedOrder?.status === 'refunded' ? 'refunded' : order.paymentStatus } : order)),
        }))
        toast.success('Refund request submitted successfully')
        return updatedOrder?.refund || refund
      }
      throw new Error('No payment record available for refund')
    } catch (error) {
      setState((current) => ({
        ...current,
        orders: current.orders.map((order) => {
          if (order._id !== orderId) return order
          return { ...order, refund }
        }),
      }))
      toast.error(error.response?.data?.message || error.message || 'Unable to submit refund request')
      return refund
    }
  }, [state.orders])

  const cancelOrder = useCallback(async (orderId, { reason, upiId } = {}) => {
    const currentOrder = state.orders.find((order) => String(order._id) === String(orderId))
    if (!canCancelOrder(currentOrder)) {
      toast.error('You can only cancel an order before it ships')
      return false
    }

    try {
      const response = await ordersApi.cancel(orderId, {
        reason: reason || 'Customer cancelled order',
        upiId: upiId || '',
      })
      const updatedOrder = response.data?.data || response.data || null
      setState((current) => ({
        ...current,
        orders: current.orders.map((order) => (order._id === orderId ? { ...order, ...updatedOrder } : order)),
      }))
      toast.success('Order cancelled')
      return true
    } catch (error) {
      setState((current) => ({
        ...current,
        orders: current.orders.map((order) => {
          if (order._id !== orderId) return order
          if (!canCancelOrder(order)) return order
          const cancellationStatus = order.paymentStatus === 'paid' ? 'refund_processing' : 'cancelled'
          return {
            ...order,
            status: 'cancelled',
            paymentStatus: order.paymentStatus === 'paid' ? 'refunded' : order.paymentStatus,
            updatedAt: new Date().toISOString(),
            cancellationRequest: {
              status: cancellationStatus,
              reason: reason || 'Customer cancelled order',
              upiId: upiId || null,
              requiresUpi: order.paymentMethod === 'razorpay' && order.paymentStatus === 'paid',
              paymentMethod: order.paymentMethod,
              paymentStatus: order.paymentStatus,
              requestedAt: new Date().toISOString(),
              completedAt: new Date().toISOString(),
              tracking: [
                { status: 'requested', label: 'Cancellation Requested', description: 'Your cancellation request has been received', at: new Date().toISOString() },
                { status: 'cancelled', label: 'Order Cancelled', description: 'The order has been cancelled in the marketplace', at: new Date().toISOString() },
                { status: 'refund_processing', label: 'Refund Processing', description: 'Refund is being processed for this cancellation', at: order.paymentStatus === 'paid' ? new Date().toISOString() : null },
                { status: 'refunded', label: 'Refund Completed', description: 'Refund has been credited to the original payment source', at: order.paymentStatus === 'paid' ? new Date().toISOString() : null },
                { status: 'refund_failed', label: 'Refund Failed', description: 'Refund could not be completed and needs manual review', at: null },
              ],
            },
            refund: order.paymentStatus === 'paid' ? {
              _id: crypto.randomUUID(),
              status: 'completed',
              amount: order.total,
              reason: reason || 'Customer cancelled order',
              upiId: upiId || null,
              requiresUpi: order.paymentMethod === 'razorpay',
              refundedAt: new Date().toISOString(),
              tracking: [
                { status: 'requested', label: 'Refund Requested', description: 'Cancellation requested and refund queued', at: new Date().toISOString() },
                { status: 'approved', label: 'Refund Approved', description: 'Refund approved for processing', at: new Date().toISOString() },
                { status: 'processing', label: 'Processing', description: 'Refund is being processed', at: new Date().toISOString() },
                { status: 'initiated', label: 'Refund Initiated', description: 'Refund has been sent to the payment source', at: new Date().toISOString() },
                { status: 'completed', label: 'Refund Completed', description: 'Refund has been credited to your account', at: new Date().toISOString() },
              ],
            } : order.refund,
            tracking: [
              ...order.tracking.map((step) => (step.status === 'placed' ? { ...step, label: 'Cancelled', at: step.at || new Date().toISOString() } : step)),
              { status: 'cancelled', label: 'Order cancelled', at: new Date().toISOString() },
            ],
          }
        }),
      }))
      toast.error(error.response?.data?.message || 'Unable to cancel order')
      return false
    }
  }, [state.orders])

  const downloadInvoice = useCallback((order) => {
    const blob = buildInvoicePdf(order)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${order.orderNumber || 'invoice'}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }, [])

  const createRazorpayPayment = useCallback(async ({ amount, description, metadata }) => {
    const response = await paymentApi.createRazorpayOrder({
      type: 'other',
      amount,
      currency: 'INR',
      description,
      ...metadata,
    })
    return response.data?.data || response.data
  }, [])

  const value = useMemo(() => ({
    coupons: COUPONS,
    cart: state.cart.map(recalculateLine),
    savedForLater: state.savedForLater.map(recalculateLine),
    recentlyViewed: state.recentlyViewed,
    localWishlist: state.localWishlist,
    orders: state.orders,
    activeCoupon: state.activeCoupon,
    selectedAddressId: state.selectedAddressId,
    deliveryMethod: state.deliveryMethod,
    checkoutNotes: state.checkoutNotes,
    trackingOrderId: state.trackingOrderId,
    totals: computeTotals(state.cart, state.activeCoupon, state.deliveryMethod),
    upsertCartLine,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    saveForLater,
    moveToCart,
    removeSaved,
    addRecentlyViewed,
    toggleWishlist,
    addLocalWishlist,
    removeLocalWishlist,
    applyCoupon,
    removeCoupon,
    setCheckoutMeta,
    placeLocalOrder,
    markOrderPaid,
    submitReturnRequest,
    submitRefundRequest,
    cancelOrder,
    canCancelOrder,
    canReturnOrder,
    downloadInvoice,
    createRazorpayPayment,
  }), [
    state.activeCoupon,
    state.cart,
    state.checkoutNotes,
    state.deliveryMethod,
    state.localWishlist,
    state.orders,
    state.recentlyViewed,
    state.savedForLater,
    state.selectedAddressId,
    state.trackingOrderId,
    addRecentlyViewed,
    addLocalWishlist,
    applyCoupon,
    cancelOrder,
    clearCart,
    createRazorpayPayment,
    downloadInvoice,
    markOrderPaid,
    moveToCart,
    placeLocalOrder,
    removeCoupon,
    removeFromCart,
    removeLocalWishlist,
    removeSaved,
    saveForLater,
    submitRefundRequest,
    submitReturnRequest,
    setCheckoutMeta,
    toggleWishlist,
    updateCartQuantity,
    upsertCartLine,
  ])

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export const useShop = () => {
  const context = useContext(ShopContext)
  if (!context) throw new Error('useShop must be used within ShopProvider')
  return context
}
