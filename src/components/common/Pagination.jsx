export default function Pagination({ pagination = {}, onPageChange }) {
  const current = pagination.currentPage || 1
  const total = pagination.totalPages || 1
  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
      <span>Page {current} of {total}</span>
      <div className="flex gap-2">
        <button disabled={current <= 1} onClick={() => onPageChange(current - 1)} className="rounded-md border border-slate-200 px-3 py-1.5 disabled:opacity-40">Previous</button>
        <button disabled={current >= total} onClick={() => onPageChange(current + 1)} className="rounded-md border border-slate-200 px-3 py-1.5 disabled:opacity-40">Next</button>
      </div>
    </div>
  )
}
