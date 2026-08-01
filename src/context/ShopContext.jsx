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
const RETURNABLE_ORDER_STATUSES = new Set(['delivered'])

const canCancelOrder = (order) => Boolean(order?._id) && CANCELABLE_ORDER_STATUSES.has(order.status) && !order.returnRequest
const canReturnOrder = (order) => Boolean(order?._id) && RETURNABLE_ORDER_STATUSES.has(order.status) && !order.returnRequest

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
  const shipping = subtotal >= 1499 ? 0 : shippingBase
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

  const submitReturnRequest = useCallback((orderId, { items, reason, reasonLabel, details, returnMethod, refundMethod, evidence = [] }) => {
    if (!orderId || !items?.length || !reason) {
      toast.error('Please complete all required fields')
      return false
    }
    const currentOrder = state.orders.find((order) => String(order._id) === String(orderId))
    if (!canReturnOrder(currentOrder)) {
      toast.error('Returns are available only after delivery')
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
      returnMethod: returnMethod || 'pickup',
      refundMethod: refundMethod || 'original',
      evidence,
      requestedAt: now,
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
    setState((current) => ({
      ...current,
      orders: current.orders.map((order) => {
        if (order._id !== orderId) return order
        return { ...order, returnRequest }
      }),
    }))
    toast.success('Return request submitted successfully')
    return returnRequest
  }, [state.orders])

  const submitRefundRequest = useCallback((orderId, { reason, reasonLabel, details, refundMethod, evidence = [] }) => {
    if (!orderId || !reason) {
      toast.error('Please complete all required fields')
      return false
    }
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
    setState((current) => ({
      ...current,
      orders: current.orders.map((order) => {
        if (order._id !== orderId) return order
        return { ...order, refund }
      }),
    }))
    toast.success('Refund request submitted successfully')
    return refund
  }, [])

  const cancelOrder = useCallback((orderId) => {
    const currentOrder = state.orders.find((order) => String(order._id) === String(orderId))
    if (!canCancelOrder(currentOrder)) {
      toast.error('You can only cancel an order before it ships')
      return false
    }

    setState((current) => ({
      ...current,
      orders: current.orders.map((order) => {
        if (order._id !== orderId) return order
        if (!canCancelOrder(order)) return order
        return {
          ...order,
          status: 'cancelled',
          paymentStatus: order.paymentStatus === 'paid' ? 'refunded' : order.paymentStatus,
          updatedAt: new Date().toISOString(),
          tracking: [
            ...order.tracking.map((step) => (step.status === 'placed' ? { ...step, label: 'Cancelled', at: step.at || new Date().toISOString() } : step)),
            { status: 'cancelled', label: 'Order cancelled', at: new Date().toISOString() },
          ],
        }
      }),
    }))
    toast.success('Order cancelled')
    return true
  }, [state.orders])

  const downloadInvoice = useCallback((order) => {
    const blob = new Blob([JSON.stringify(order, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${order.orderNumber || 'invoice'}.json`
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
