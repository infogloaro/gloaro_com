const toneMap = {
  approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  published: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  documents_verified: 'bg-blue-50 text-blue-700 ring-blue-200',
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  pending_approval: 'bg-amber-50 text-amber-700 ring-amber-200',
  pending_vp_review: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  in_progress: 'bg-blue-50 text-blue-700 ring-blue-200',
  under_review: 'bg-amber-50 text-amber-700 ring-amber-200',
  open: 'bg-blue-50 text-blue-700 ring-blue-200',
  rejected: 'bg-red-50 text-red-700 ring-red-200',
  rejected_by_vp: 'bg-red-50 text-red-700 ring-red-200',
  failed: 'bg-red-50 text-red-700 ring-red-200',
  suspended: 'bg-red-50 text-red-700 ring-red-200',
  closed: 'bg-slate-100 text-slate-600 ring-slate-200',
  default: 'bg-slate-100 text-slate-700 ring-slate-200',
}

export default function StatusBadge({ value }) {
  const status = String(value || 'unknown')
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-extrabold capitalize ring-1 ${toneMap[status] || toneMap.default}`}>
      {status.replaceAll('_', ' ')}
    </span>
  )
}
