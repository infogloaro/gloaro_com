export default function Pagination({ pagination = {}, onPageChange }) {
  const current = pagination.currentPage || 1
  const total = pagination.totalPages || 1
  return (
    <div className="mt-4 flex items-center justify-end gap-2">
      <span className="text-sm font-medium text-slate-600">Page {current} of {total}</span>
      <div className="flex items-center gap-2">
        <button disabled={current <= 1} onClick={() => onPageChange(current - 1)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium text-slate-700 transition-all duration-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-70 disabled:hover:border-slate-200 disabled:hover:bg-slate-100 disabled:hover:text-slate-400">Previous</button>
        <button disabled={current >= total} onClick={() => onPageChange(current + 1)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium text-slate-700 transition-all duration-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-70 disabled:hover:border-slate-200 disabled:hover:bg-slate-100 disabled:hover:text-slate-400">Next</button>
      </div>
    </div>
  )
}
