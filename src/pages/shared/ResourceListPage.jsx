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
  detailFetcher,
  renderDetails,
  renderForm,
  defaultParams = {},
  readOnly = false,
  retainRowsOnEmptySearch = false,
}) {
  const { hasSection, hasOperation } = useAuth()
  const [payload, setPayload] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filterValues, setFilterValues] = useState(defaultParams)
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [details, setDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const canViewSection = readOnly ? true : (module ? hasSection(module, section) && hasOperation(module, 'view') : true)
  const canCreate = readOnly ? false : (module ? hasOperation(module, 'create') : true)
  const canEdit = readOnly ? false : (module ? hasOperation(module, 'edit') : true)
  const canDelete = readOnly ? false : (module ? hasOperation(module, 'delete') : true)

  useEffect(() => {
    console.log({
      pathname: window.location.pathname,
      module,
      section,
      title,
      fetcher,
    })
  }, [module, section, title, fetcher])

  useEffect(() => {
    setDebouncedSearch(search.trim())
  }, [search])

  const params = useMemo(() => ({ page, limit: 10, search: debouncedSearch || undefined, ...filterValues }), [page, debouncedSearch, filterValues])

  const load = useCallback(async () => {
    if (!canViewSection) {
      setPayload(null)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const response = await fetcher(params)
      const nextPayload = response.data
      setPayload((current) => {
        const shouldRetainRows = retainRowsOnEmptySearch && debouncedSearch && current && getList(nextPayload).length === 0
        return shouldRetainRows ? current : nextPayload
      })
    } finally {
      setLoading(false)
    }
  }, [canViewSection, debouncedSearch, fetcher, params, retainRowsOnEmptySearch])

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
  const hasActions = Boolean(renderActions || detailFetcher || (updateAction && renderForm && canEdit) || (deleteAction && canDelete))

  const openDetails = async (row) => {
    setDetailsLoading(true)
    try {
      const response = detailFetcher ? await detailFetcher(row._id) : { data: row }
      setDetails(response.data?.data || response.data || row)
    } finally {
      setDetailsLoading(false)
    }
  }

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
          {filters.filter((filter) => filter.key !== 'status' && filter.label?.toLowerCase() !== 'status').map((filter) => (
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
        loading={loading && !payload}
        pagination={pagination}
        onPageChange={setPage}
        actions={hasActions ? (row) => (
          <div className="flex gap-2">
            {renderActions?.(row, { reload: load }, { canViewSection, canCreate, canEdit, canDelete, hasOperation })}
            {detailFetcher && <button onClick={() => openDetails(row)} className="rounded-md border border-[#0d4697] bg-white px-3 py-1.5 text-xs font-bold text-[#0d4697] hover:bg-blue-50 transition duration-150">View</button>}
            {updateAction && renderForm && canEdit && <button onClick={() => { setEditing(row); setFormOpen(true) }} className="rounded-md border border-[#0d4697] bg-white px-3 py-1.5 text-xs font-bold text-[#0d4697] hover:bg-blue-50 transition duration-150">Edit</button>}
            {deleteAction && canDelete && <button onClick={() => remove(row)} className="rounded-md border border-red-500 bg-white px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 transition duration-150">Delete</button>}
          </div>
        ) : undefined}
      />
      <Modal open={Boolean(details)} title={details?.title || `${title} details`} onClose={() => setDetails(null)}>
        {detailsLoading ? <p className="py-8 text-center text-sm font-semibold text-slate-500">Loading details...</p> : details ? renderDetails?.(details) : null}
      </Modal>
      <Modal open={formOpen} title={editing ? `Edit ${title}` : `Add ${title}`} onClose={() => setFormOpen(false)}>
        {renderForm?.({ initialValues: editing, onSubmit: submitForm })}
      </Modal>
    </section>
  )
}
