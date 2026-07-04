import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '../../components/common/Modal'
import SearchBar from '../../components/common/SearchBar'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/tables/DataTable'
import { useAuth } from '../../hooks/useAuth'
import { getList, getPagination, formatDate } from '../../utils/format'

export default function ResourceListPage({
  title,
  description,
  module,
  section = 'list',
  fetcher,
  columns,
  filters = [],
  createAction,
  updateAction,
  deleteAction,
  renderActions,
  renderForm,
  defaultParams = {},
}) {
  const { hasSection, hasOperation } = useAuth()
  const [payload, setPayload] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filterValues, setFilterValues] = useState(defaultParams)
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const canViewSection = module ? hasSection(module, section) && hasOperation(module, 'view') : true
  const canCreate = module ? hasOperation(module, 'create') : true
  const canEdit = module ? hasOperation(module, 'edit') : true
  const canDelete = module ? hasOperation(module, 'delete') : true

  const params = useMemo(() => ({ page, limit: 10, search: search || undefined, ...filterValues }), [page, search, filterValues])

  const load = useCallback(async () => {
    if (!canViewSection) {
      setPayload(null)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const response = await fetcher(params)
      setPayload(response.data)
    } finally {
      setLoading(false)
    }
  }, [canViewSection, fetcher, params])

  useEffect(() => {
    if (!canViewSection) return undefined
    const timer = window.setTimeout(() => load(), 0)
    return () => window.clearTimeout(timer)
  }, [canViewSection, load])

  const rows = getList(payload)
  const pagination = getPagination(payload)

  const submitForm = async (data) => {
    if (editing && updateAction) await updateAction(editing._id, data)
    else if (createAction) await createAction(data)
    toast.success(editing ? 'Updated successfully' : 'Created successfully')
    setFormOpen(false)
    setEditing(null)
    load()
  }

  const remove = async (row) => {
    if (!deleteAction) return
    await deleteAction(row._id)
    toast.success('Deleted successfully')
    load()
  }

  const tableColumns = columns || [
    { key: 'name', header: 'Name', render: (row) => row.name || row.title || row.businessName || row.subject || row.email || row._id },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status || (row.isActive ? 'active' : 'inactive')} /> },
    { key: 'createdAt', header: 'Created', render: (row) => formatDate(row.createdAt) },
  ]
  const hasActions = Boolean(renderActions || (updateAction && renderForm && canEdit) || (deleteAction && canDelete))

  if (!canViewSection) return null

  return (
    <section>
      <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">{title}</h2>
          {description && <p className="mt-1 text-sm font-semibold text-slate-500">{description}</p>}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder={`Search ${title.toLowerCase()}`} />
          {filters.map((filter) => (
            <select key={filter.key} value={filterValues[filter.key] || ''} onChange={(event) => setFilterValues((current) => ({ ...current, [filter.key]: event.target.value || undefined }))} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800">
              <option value="">{filter.label}</option>
              {filter.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          ))}
          {createAction && renderForm && canCreate && <button onClick={() => { setEditing(null); setFormOpen(true) }} className="h-10 rounded-md bg-[#0d4697] px-4 text-sm font-extrabold text-white">Add</button>}
        </div>
      </div>
      <DataTable
        columns={tableColumns}
        rows={rows}
        loading={loading}
        pagination={pagination}
        onPageChange={setPage}
        actions={hasActions ? (row) => (
          <div className="flex gap-2">
            {renderActions?.(row, { reload: load }, { canViewSection, canCreate, canEdit, canDelete, hasOperation })}
            {updateAction && renderForm && canEdit && <button onClick={() => { setEditing(row); setFormOpen(true) }} className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-bold">Edit</button>}
            {deleteAction && canDelete && <button onClick={() => remove(row)} className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600">Delete</button>}
          </div>
        ) : undefined}
      />
      <Modal open={formOpen} title={editing ? `Edit ${title}` : `Add ${title}`} onClose={() => setFormOpen(false)}>
        {renderForm?.({ initialValues: editing, onSubmit: submitForm })}
      </Modal>
    </section>
  )
}
