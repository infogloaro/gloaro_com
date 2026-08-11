import { useState } from 'react'
import { Eye, ExternalLink, Globe, Phone, Mail, Building2, MapPin, ShieldCheck, Calendar } from 'lucide-react'
import api from '../../api/axios'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import { formatDate } from '../../utils/format'
import ResourceListPage from '../shared/ResourceListPage'

export default function ApprovedVendorsPage() {
  const [selected, setSelected] = useState(null)

  return (
    <>
      <ResourceListPage
        title="Approved Vendors"
        description="Browse the directory of active and verified marketplace vendors."
        fetcher={(params) => api.get('/vendors', { params: { ...params, status: 'approved' } })}
        columns={[
          { key: 'businessName', header: 'Business Name' },
          { key: 'ownerName', header: 'Vendor Name' },
          { key: 'category', header: 'Category', render: (row) => row.businessCategory?.name || '-' },
          { key: 'chapter', header: 'Unit', render: (row) => row.chapterId?.name || '-' },
          { key: 'district', header: 'District', render: (row) => row.districtId?.name || '-' },
          { key: 'state', header: 'State', render: (row) => row.stateId?.name || '-' },
          { key: 'region', header: 'Region', render: (row) => row.regionId?.name || '-' },
          { key: 'contact', header: 'Contact', render: (row) => row.phone || row.email || '-' },
          { key: 'approvedAt', header: 'Approval Date', render: (row) => formatDate(row.approvedAt || row.createdAt) },
          { key: 'approvedBy', header: 'Approved By', render: (row) => row.approvedBy?.name || row.approvedBy?.email || 'System' },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        ]}
        renderActions={(row) => (
          <button
            onClick={() => setSelected(row)}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#0d4697]/20 px-3 py-1.5 text-xs font-extrabold text-[#0d4697] hover:bg-blue-50"
          >
            <Eye className="h-3.5 w-3.5" />
            View Profile
          </button>
        )}
      />

      <Modal open={Boolean(selected)} title="Vendor Profile details" onClose={() => setSelected(null)} maxWidth="max-w-4xl">
        {selected && (
          <div className="space-y-6">
            {/* Banner card */}
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-slate-50 p-5 rounded-xl sm:flex-row sm:items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#0d4697]">Active Vendor</p>
                <h3 className="mt-1 text-xl font-extrabold text-slate-950">{selected.businessName}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">{selected.businessCategory?.name || 'Category'}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge value={selected.status} />
                <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-slate-600 ring-1 ring-slate-200">
                  ID: {selected.vendorId}
                </span>
              </div>
            </div>

            {/* Profile body grid */}
            <div className="grid gap-6 md:grid-cols-2">
              <section className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
                <h4 className="text-sm font-extrabold text-slate-950 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-[#0d4697]" />
                  Vendor Details
                </h4>
                <div className="space-y-3 text-xs font-bold text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Owner Name</span>
                    <span>{selected.ownerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone Number</span>
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {selected.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email Address</span>
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {selected.email}</span>
                  </div>
                  {selected.website && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Website</span>
                      <a href={selected.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#0d4697] hover:underline">
                        <Globe className="h-3 w-3" /> Visit Site
                      </a>
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
                <h4 className="text-sm font-extrabold text-slate-950 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#0d4697]" />
                  Business Address
                </h4>
                <div className="space-y-3 text-xs font-bold text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Street</span>
                    <span>{selected.address?.street}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">City / State</span>
                    <span>{selected.address?.city}, {selected.address?.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pincode</span>
                    <span>{selected.address?.pincode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Organization Context</span>
                    <span>
                      {[selected.regionId?.name, selected.stateId?.name, selected.districtId?.name, selected.chapterId?.name]
                        .filter(Boolean)
                        .join(' / ') || 'Global'}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <section className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
                <h4 className="text-sm font-extrabold text-slate-950 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#0d4697]" />
                  Verification Details
                </h4>
                <div className="space-y-3 text-xs font-bold text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">GST Number</span>
                    <span>{selected.gstNumber || 'Not added'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PAN Number</span>
                    <span>{selected.panNumber || '-'}</span>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
                <h4 className="text-sm font-extrabold text-slate-950 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[#0d4697]" />
                  History
                </h4>
                <div className="space-y-3 text-xs font-bold text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Approval Date</span>
                    <span>{formatDate(selected.approvedAt || selected.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Approved By</span>
                    <span>{selected.approvedBy?.name || selected.approvedBy?.email || 'System'}</span>
                  </div>
                </div>
              </section>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
              >
                Close Profile
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
