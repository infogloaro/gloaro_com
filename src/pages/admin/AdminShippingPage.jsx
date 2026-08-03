import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  BadgeCheck,
  Banknote,
  CheckCircle2,
  Clock3,
  Eye,
  Filter,
  FileText,
  MapPin,
  Package,
  RotateCcw,
  RefreshCw,
  Search,
  Truck,
  XCircle,
} from 'lucide-react'
import { adminApi } from '../../api/admin'
import LoadingScreen from '../../components/common/LoadingScreen'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/tables/DataTable'
import { formatCurrency, formatDate } from '../../utils/format'

const emptyFilters = {
  vendorId: '',
  customerId: '',
  status: 'all',
  awb: '',
  courier: '',
  from: '',
  to: '',
}

const STATUS_OPTIONS = [
  'all',
  'PENDING',
  'READY_TO_SHIP',
  'ORDER_CREATED',
  'COURIER_SELECTION_PENDING',
  'AWB_ASSIGNED',
  'PICKUP_SCHEDULED',
  'PICKED_UP',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'DELIVERY_FAILED',
  'NDR',
  'RTO_INITIATED',
  'RTO_IN_TRANSIT',
  'RTO_DELIVERED',
  'RETURN_REQUESTED',
  'RETURN_CREATED',
  'RETURN_PICKED_UP',
  'RETURN_DELIVERED',
  'CANCELLED',
  'SHIPROCKET_FAILED',
]

const formatAddress = (address) => {
  if (!address) return 'Address unavailable'
  if (typeof address === 'string') return address
  return [
    address.contactName || address.fullName,
    address.addressLine1 || address.line1 || address.street,
    address.addressLine2 || address.line2,
    address.landmark,
    address.city,
    address.state,
    address.pincode,
  ].filter(Boolean).join(', ')
}

const vendorName = (vendor) => vendor?.businessName || vendor?.ownerName || vendor?.email || String(vendor || 'Vendor')

export default function AdminShippingPage() {
  const [shipments, setShipments] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedShipmentId, setSelectedShipmentId] = useState(null)
  const [selectedShipment, setSelectedShipment] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [filters, setFilters] = useState(emptyFilters)
  const [serviceability, setServiceability] = useState(null)

  const loadShipments = async ({ silent = false, overrideFilters = null } = {}) => {
    if (silent) setRefreshing(true)
    else setLoading(true)

    try {
      const response = await adminApi.shipments({
        ...(overrideFilters || filters),
        page: 1,
        limit: 50,
      })
      const payload = response.data?.data || response.data || {}
      setShipments(payload.data || payload.shipments || [])
      setTotal(payload.total || 0)
      if (!selectedShipmentId && (payload.data || payload.shipments || [])[0]?._id) {
        setSelectedShipmentId((payload.data || payload.shipments || [])[0]._id)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load shipments')
    } finally {
      if (silent) setRefreshing(false)
      else setLoading(false)
    }
  }

  useEffect(() => {
    loadShipments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refreshSelectedShipment = async (shipmentId = selectedShipmentId) => {
    if (!shipmentId) return
    setDetailLoading(true)
    try {
      const response = await adminApi.shipment(shipmentId)
      const shipment = response.data?.data || response.data || null
      setSelectedShipment(shipment)
      setShipments((current) => current.map((item) => (item._id === shipment._id ? shipment : item)))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load shipment details')
    } finally {
      setDetailLoading(false)
    }
  }

  useEffect(() => {
    if (selectedShipmentId) refreshSelectedShipment(selectedShipmentId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShipmentId])

  const currentShipment = selectedShipment || shipments.find((shipment) => shipment._id === selectedShipmentId) || null

  const stats = useMemo(() => {
    const counts = shipments.reduce((acc, shipment) => {
      acc[shipment.shipmentStatus || 'PENDING'] = (acc[shipment.shipmentStatus || 'PENDING'] || 0) + 1
      return acc
    }, {})
    return {
      total: total || shipments.length,
      pending: counts.PENDING || 0,
      ready: counts.READY_TO_SHIP || 0,
      inTransit: (counts.IN_TRANSIT || 0) + (counts.OUT_FOR_DELIVERY || 0),
      delivered: counts.DELIVERED || 0,
      failed: counts.SHIPROCKET_FAILED || 0,
    }
  }, [shipments, total])

  const updateVendorApproval = async () => {
    const shipment = currentShipment
    const vendor = shipment?.vendorId
    if (!vendor?._id) {
      toast.error('Vendor information is unavailable')
      return
    }

    try {
      await adminApi.updateVendor(vendor._id, {
        shipping: {
          pickupAddress: shipment.pickupAddress || {},
          shiprocketPickupLocation: vendor.shipping?.shiprocketPickupLocation || shipment.pickupAddress?.city || vendor.businessName,
          shiprocketPickupLocationId: vendor.shipping?.shiprocketPickupLocationId || vendor.shipping?.shiprocketPickupLocation || shipment.pickupAddress?.city || vendor.businessName,
          shiprocketPickupApproved: true,
          shiprocketPickupStatus: 'ACTIVE',
          shiprocketPickupCreatedAt: vendor.shipping?.shiprocketPickupCreatedAt || new Date().toISOString(),
          shiprocketPickupError: '',
        },
      })
      toast.success('Pickup location approved')
      await refreshSelectedShipment()
      loadShipments({ silent: true })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve pickup location')
    }
  }

  const runShipmentAction = async (action, actionName, payload = {}) => {
    if (!currentShipment?._id) return
    try {
      await action(currentShipment._id, payload)
      toast.success(`${actionName} completed`)
      await refreshSelectedShipment()
      await loadShipments({ silent: true })
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${actionName.toLowerCase()}`)
    }
  }

  const checkServiceability = async () => {
    const shipment = currentShipment
    if (!shipment?._id) return
    try {
      const response = await adminApi.shipmentCheckServiceability(shipment._id)
      setServiceability(response.data?.data || response.data || null)
      toast.success('Serviceability checked')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to check serviceability')
    }
  }

  const filteredColumns = [
    { key: 'order', header: 'Order', render: (row) => row.mainOrderId?.orderNumber || row.mainOrderId?.orderNumber || row.mainOrderId || row.vendorOrderNumber },
    { key: 'vendor', header: 'Vendor', render: (row) => vendorName(row.vendorId) },
    { key: 'customer', header: 'Customer', render: (row) => row.customerId?.name || row.mainOrderId?.shippingAddressSnapshot?.fullName || 'Customer' },
    { key: 'pickup', header: 'Pickup', render: (row) => row.pickupAddress?.city || row.vendorId?.shipping?.pickupAddress?.city || '-' },
    { key: 'courier', header: 'Courier', render: (row) => row.courierName || '-' },
    { key: 'awb', header: 'AWB', render: (row) => row.awbCode || '-' },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.shipmentStatus || 'PENDING'} /> },
    { key: 'updated', header: 'Updated', render: (row) => formatDate(row.lastShiprocketSyncAt || row.updatedAt || row.createdAt) },
  ]

  if (loading) return <LoadingScreen label="Loading shiprocket shipments..." />

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Admin Shipping</p>
            <h2 className="mt-1 text-3xl font-black text-slate-900">Shiprocket Shipments</h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold text-slate-500">
              Monitor pickup locations, vendor-wise shipments, tracking, invoices, cancellation, returns, and retry-safe syncing from one console.
            </p>
          </div>
          <button
            type="button"
            onClick={() => loadShipments({ silent: false })}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 hover:border-[#0d4697] hover:text-[#0d4697]"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <Metric label="Total" value={stats.total} icon={Package} />
          <Metric label="Pending" value={stats.pending} icon={Clock3} accent="amber" />
          <Metric label="Ready" value={stats.ready} icon={CheckCircle2} accent="emerald" />
          <Metric label="In transit" value={stats.inTransit} icon={Truck} accent="blue" />
          <Metric label="Failed" value={stats.failed} icon={XCircle} accent="rose" />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900">Filters</h3>
            <p className="text-sm font-semibold text-slate-500">Filter by vendor, customer, AWB, courier, or date range.</p>
          </div>
          <button
            type="button"
          onClick={() => {
            setFilters(emptyFilters)
            loadShipments({ silent: false, overrideFilters: emptyFilters })
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-black text-slate-700 hover:bg-slate-50"
        >
            <Filter className="h-4 w-4" />
            Clear
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <InputField label="Vendor ID" value={filters.vendorId} onChange={(value) => setFilters((current) => ({ ...current, vendorId: value }))} />
          <InputField label="Customer ID" value={filters.customerId} onChange={(value) => setFilters((current) => ({ ...current, customerId: value }))} />
          <InputField label="AWB" value={filters.awb} onChange={(value) => setFilters((current) => ({ ...current, awb: value }))} />
          <InputField label="Courier" value={filters.courier} onChange={(value) => setFilters((current) => ({ ...current, courier: value }))} />
          <InputField label="From" type="date" value={filters.from} onChange={(value) => setFilters((current) => ({ ...current, from: value }))} />
          <InputField label="To" type="date" value={filters.to} onChange={(value) => setFilters((current) => ({ ...current, to: value }))} />
          <label className="block">
            <span className="text-sm font-bold text-slate-700">Status</span>
            <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0d4697]">
              {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => loadShipments({ silent: false })}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0d4697] px-4 text-sm font-black text-white hover:bg-blue-800"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-slate-900">Shipments Table</h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">{shipments.length} records shown</p>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
          <DataTable
            columns={filteredColumns}
            rows={shipments}
            actions={(row) => (
              <button
                type="button"
                onClick={() => setSelectedShipmentId(row._id)}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <Eye className="h-3 w-3" />
                View
              </button>
            )}
          />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          {!currentShipment ? (
            <div className="grid min-h-[420px] place-items-center text-center">
              <div>
                <Eye className="mx-auto h-10 w-10 text-slate-300" />
                <h4 className="mt-3 text-lg font-black text-slate-900">Select a shipment</h4>
                <p className="mt-1 text-sm font-semibold text-slate-500">Open one shipment to see vendor pickup, delivery address, tracking, and actions.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Shipment Details</p>
                  <h4 className="mt-1 text-2xl font-black text-slate-900">{currentShipment.vendorOrderNumber}</h4>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{currentShipment.mainOrderId?.orderNumber || 'Main order unavailable'}</p>
                </div>
                <StatusBadge value={currentShipment.shipmentStatus || 'PENDING'} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoBox label="Vendor" value={vendorName(currentShipment.vendorId)} />
                <InfoBox label="Customer" value={currentShipment.customerId?.name || currentShipment.mainOrderId?.shippingAddressSnapshot?.fullName || '-'} />
                <InfoBox label="AWB" value={currentShipment.awbCode || '-'} />
                <InfoBox label="Courier" value={currentShipment.courierName || '-'} />
                <InfoBox label="Pickup location" value={currentShipment.vendorId?.shipping?.shiprocketPickupLocation || currentShipment.pickupAddress?.city || '-'} />
                <InfoBox label="Pickup status" value={currentShipment.vendorId?.shipping?.shiprocketPickupStatus || 'NOT_CONFIGURED'} />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Pickup Address</p>
                <p className="mt-1 text-sm font-semibold text-slate-700">{formatAddress(currentShipment.pickupAddress)}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Delivery Address</p>
                <p className="mt-1 text-sm font-semibold text-slate-700">{formatAddress(currentShipment.deliveryAddress || currentShipment.mainOrderId?.shippingAddressSnapshot)}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoBox label="Subtotal" value={formatCurrency(currentShipment.subtotal)} />
                <InfoBox label="Shipping" value={formatCurrency(currentShipment.shippingCharge)} />
                <InfoBox label="Package Weight" value={`${Number(currentShipment.packageDetails?.weight || 0).toFixed(2)} kg`} />
                <InfoBox label="Expected Delivery" value={currentShipment.expectedDeliveryDate ? formatDate(currentShipment.expectedDeliveryDate) : '-'} />
              </div>

              <div className="space-y-3">
                <ActionButton label="Check Serviceability" icon={Truck} onClick={checkServiceability} />
                <ActionButton label="Assign Courier" icon={BadgeCheck} onClick={() => {
                  const courierId = window.prompt('Enter courier ID')
                  if (courierId) runShipmentAction(adminApi.shipmentAssignCourier, 'Courier assigned', { courierId })
                }} />
                <ActionButton label="Generate AWB" icon={FileText} onClick={() => {
                  const courierId = window.prompt('Enter courier ID for AWB generation (optional)') || ''
                  runShipmentAction(adminApi.shipmentGenerateAwb, 'AWB generated', courierId ? { courierId } : {})
                }} />
                <ActionButton label="Schedule Pickup" icon={Truck} onClick={() => {
                  const pickupDate = window.prompt('Enter pickup date (YYYY-MM-DD)')
                  if (pickupDate) runShipmentAction(adminApi.shipmentSchedulePickup, 'Pickup scheduled', { pickupDate })
                }} />
                <ActionButton label="Generate Label" icon={FileText} onClick={() => runShipmentAction(adminApi.shipmentGenerateLabel, 'Label generated')} />
                <ActionButton label="Generate Manifest" icon={FileText} onClick={() => runShipmentAction(adminApi.shipmentGenerateManifest, 'Manifest generated')} />
                <ActionButton label="Generate Invoice" icon={FileText} onClick={() => runShipmentAction(adminApi.shipmentGenerateInvoice, 'Invoice generated')} />
                <ActionButton label="Sync Shipment" icon={RefreshCw} onClick={() => runShipmentAction(adminApi.shipmentSync, 'Shipment synced')} />
                <ActionButton label="Cancel Shipment" icon={XCircle} danger onClick={() => {
                  if (window.confirm('Cancel this shipment?')) runShipmentAction(adminApi.shipmentCancel, 'Shipment cancelled')
                }} />
                <ActionButton label="Create Return" icon={RotateCcw} onClick={() => {
                  const reason = window.prompt('Return reason')
                  if (reason) runShipmentAction(adminApi.shipmentReturn, 'Return created', { reason, details: reason })
                }} />
                <ActionButton label="Retry Failed Request" icon={RefreshCw} onClick={() => runShipmentAction(adminApi.shipmentRetry, 'Retry queued')} />
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#0d4697]">Vendor Pickup Approval</p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {currentShipment.vendorId?.shipping?.shiprocketPickupApproved ? 'Approved for shipping' : 'Pickup address is pending approval'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={updateVendorApproval}
                    className="rounded-xl bg-[#0d4697] px-4 py-2 text-xs font-black text-white hover:bg-blue-800"
                  >
                    Approve Pickup
                  </button>
                </div>
              </div>

              {serviceability && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Serviceability Result</p>
                  <pre className="mt-2 overflow-auto rounded-xl bg-white p-3 text-[11px] font-mono text-slate-700">{JSON.stringify(serviceability, null, 2)}</pre>
                </div>
              )}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Tracking History</p>
                <div className="mt-3 space-y-3">
                  {(currentShipment.trackingHistory || []).map((step) => (
                    <div key={`${step.status}-${String(step.at || '')}`} className="rounded-xl bg-white p-3">
                      <p className="text-sm font-black text-slate-900">{step.label || step.status}</p>
                      <p className="text-xs font-semibold text-slate-500">{step.description || 'No description'}</p>
                      <p className="mt-1 text-[11px] font-bold text-slate-400">{step.at ? formatDate(step.at) : 'Waiting'}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Raw Shiprocket Response</p>
                <pre className="mt-2 max-h-72 overflow-auto rounded-xl bg-white p-3 text-[11px] font-mono text-slate-700">
                  {JSON.stringify(currentShipment.shiprocketRawResponse || currentShipment.shiprocket || {}, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function Metric({ label, value, icon: Icon, accent = 'slate' }) {
  const accentMap = {
    slate: 'bg-slate-50 text-slate-700',
    amber: 'bg-amber-50 text-amber-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    blue: 'bg-blue-50 text-blue-700',
    rose: 'bg-rose-50 text-rose-700',
  }
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${accentMap[accent] || accentMap.slate}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-xs font-black uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-black text-slate-900">{value}</p>
    </div>
  )
}

function InputField({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0d4697]"
      />
    </label>
  )
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-700">{value}</p>
    </div>
  )
}

function ActionButton({ label, onClick, icon: Icon, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-xl border px-4 py-3 text-left text-sm font-black transition ${
        danger
          ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
          : 'border-slate-200 bg-white text-slate-700 hover:border-[#0d4697] hover:text-[#0d4697]'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}
