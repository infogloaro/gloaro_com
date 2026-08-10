import EmptyState from '../common/EmptyState'
import LoadingScreen from '../common/LoadingScreen'
import Pagination from '../common/Pagination'

export default function DataTable({ columns, rows = [], loading, pagination, onPageChange, actions, onRowClick, selectedId, emptyTitle, emptyDescription }) {
  if (loading) return <LoadingScreen label="Loading records..." />
  if (!rows.length) return <EmptyState title={emptyTitle} description={emptyDescription} />

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              {columns.map((column) => <th key={column.key} className="px-4 py-3 font-extrabold">{column.header}</th>)}
              {actions && <th className="px-4 py-3 font-extrabold">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => {
              const isSelected = selectedId && String(row._id || row.id) === String(selectedId)
              return (
              <tr
                key={row._id || row.id}
                className={[
                  isSelected ? 'bg-blue-50' : 'bg-white hover:bg-slate-50',
                  onRowClick ? 'cursor-pointer' : '',
                ].filter(Boolean).join(' ')}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 font-semibold text-slate-700">
                    {column.render ? column.render(row) : row[column.key] || 'Not available'}
                  </td>
                ))}
                {actions && <td className="px-4 py-3">{actions(row)}</td>}
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {pagination && <Pagination pagination={pagination} onPageChange={onPageChange} />}
    </div>
  )
}
