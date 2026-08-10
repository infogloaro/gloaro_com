import { useEffect, useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import {
  MapPinned,
  Plus,
  Search,
  GitBranch,
  Trash2,
  Edit2,
  ChevronRight,
  ChevronDown,
  Activity,
  PlusCircle,
  EyeOff,
  Eye,
  Info,
  Layers,
  Map,
  Home,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import api from '../../api/axios'
import { adminApi } from '../../api/admin'
import StatusBadge from '../../components/common/StatusBadge'
import Modal from '../../components/common/Modal'
import { formatDate } from '../../utils/format'
import { useAuth } from '../../hooks/useAuth'
import { ROLES } from '../../constants/roleConfig.js'

export default function LocationsManagementPage() {
  const { user } = useAuth()
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedNodes, setExpandedNodes] = useState({})
  const [selectedNode, setSelectedNode] = useState(null)

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  // Form states
  const [form, setForm] = useState({
    name: '',
    code: '',
    type: 'region',
    parent: '',
    status: 'active'
  })
  const isGlobalAdmin = [ROLES.SUPERADMIN, ROLES.ADMIN].includes(user?.role)
  
  const unitLabel = user?.role === ROLES.DIRECT_CONSULTANT ? 'unit' : 'chapter'
  const UnitLabel = user?.role === ROLES.DIRECT_CONSULTANT ? 'Unit' : 'Chapter'
  const UnitsLabel = user?.role === ROLES.DIRECT_CONSULTANT ? 'Units' : 'Chapters'

  const loadLocations = async () => {
    setLoading(true)
    try {
      const res = await api.get('/organization/locations')
      const nextLocations = res.data?.data?.locations || []
      setLocations(nextLocations)
      return nextLocations
    } catch {
      toast.error('Failed to load locations master list')
      return []
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLocations()
  }, [])

  // Build tree representation
  const treeData = useMemo(() => {
    const byParent = {}
    const roots = []
    
    const idSet = new Set(locations.map(loc => loc._id))

    locations.forEach(loc => {
      const parentVal = loc.parent?._id || loc.parent
      const parentId = (parentVal && idSet.has(parentVal)) ? parentVal : 'root'
      
      if (!byParent[parentId]) {
        byParent[parentId] = []
      }
      byParent[parentId].push({ ...loc, children: [] })
    })

    const build = (node) => {
      node.children = (byParent[node._id] || []).map(build)
      return node
    }

    (byParent['root'] || []).forEach(rootNode => {
      roots.push(build(rootNode))
    })

    return roots
  }, [locations])

  useEffect(() => {
    if (!loading && treeData.length === 1 && !selectedNode) {
      setSelectedNode(treeData[0])
    }
  }, [loading, treeData, selectedNode])
  const getSubHierarchyCounts = (nodeId, nodeType) => {
    let statesCount = 0
    let districtsCount = 0
    let chaptersCount = 0

    if (nodeType === 'region') {
      const regionStates = locations.filter(l => l.type === 'state' && (l.parent?._id === nodeId || l.parent === nodeId))
      statesCount = regionStates.length

      const stateIds = regionStates.map(s => s._id)
      const regionDistricts = locations.filter(l => l.type === 'district' && stateIds.includes(l.parent?._id || l.parent))
      districtsCount = regionDistricts.length

      const districtIds = regionDistricts.map(d => d._id)
      chaptersCount = locations.filter(l => l.type === 'chapter' && districtIds.includes(l.parent?._id || l.parent)).length
    } else if (nodeType === 'state') {
      const stateDistricts = locations.filter(l => l.type === 'district' && (l.parent?._id === nodeId || l.parent === nodeId))
      districtsCount = stateDistricts.length

      const districtIds = stateDistricts.map(d => d._id)
      chaptersCount = locations.filter(l => l.type === 'chapter' && districtIds.includes(l.parent?._id || l.parent)).length
    } else if (nodeType === 'district') {
      chaptersCount = locations.filter(l => l.type === 'chapter' && (l.parent?._id === nodeId || l.parent === nodeId)).length
    }

    return { statesCount, districtsCount, chaptersCount }
  }

  // Find location details path (Breadcrumbs)
  const getLocationPath = (node) => {
    if (!node) return []
    const path = [node]
    let parentId = node.parent?._id || node.parent

    while (parentId) {
      const parent = locations.find(l => l._id === parentId)
      if (parent) {
        path.unshift(parent)
        parentId = parent.parent?._id || parent.parent
      } else {
        break
      }
    }
    return path
  }

  const toggleExpand = (id) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const openCreate = (type = 'region', parentId = '') => {
    setForm({
      name: '',
      code: '',
      type,
      parent: parentId,
      status: type === 'chapter' && user?.role === ROLES.DIRECT_CONSULTANT ? 'pending_approval' : 'active'
    })
    setIsCreateOpen(true)
  }

  const openEdit = (loc) => {
    setForm({
      name: loc.name,
      code: loc.code || '',
      type: loc.type,
      parent: loc.parent?._id || loc.parent || '',
      status: loc.status
    })
    setIsEditOpen(true)
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Name is required')

    try {
      await api.post('/organization/location', form, { silent: true })
      toast.success('Location node added successfully')
      setIsCreateOpen(false)

      // Auto expand parent
      if (form.parent) {
        setExpandedNodes(prev => ({ ...prev, [form.parent]: true }))
      }

      loadLocations()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add location node')
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Name is required')

    try {
      const res = await api.put(`/organization/location/${selectedNode._id}`, {
        name: form.name,
        code: form.code,
        status: form.status
      })
      toast.success('Location node updated successfully')
      setIsEditOpen(false)
      setSelectedNode(res.data?.data?.location)
      loadLocations()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update location node')
    }
  }

  const handleDelete = async (node) => {
    if (!node?._id) return

    if (node.type === 'chapter' && !isGlobalAdmin) {
      toast.error('Only Super Admin and Admin can delete chapter records')
      return
    }

    if (!window.confirm('Are you sure you want to delete this location?')) return

    try {
      await api.delete(`/organization/location/${node._id}`)
      toast.success('Location node deleted')
      const refreshedLocations = await loadLocations()
      const nextSelectedId = node.parent?._id || node.parent || null
      setSelectedNode(nextSelectedId ? refreshedLocations.find((item) => item._id === nextSelectedId) || null : null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete location')
    }
  }

  const toggleStatus = async (loc) => {
    const nextStatus = loc.status === 'active' ? 'inactive' : 'active'
    try {
      const res = await api.put(`/organization/location/${loc._id}`, {
        status: nextStatus
      })
      toast.success(`Location ${loc.name} is now ${nextStatus}`)
      if (selectedNode?._id === loc._id) {
        setSelectedNode(res.data?.data?.location)
      }
      loadLocations()
    } catch {
      toast.error('Failed to toggle location status')
    }
  }

  const resubmitChapter = async (node) => {
    try {
      const response = await adminApi.resubmitChapter(node._id)
      toast.success('Chapter resubmitted for approval')
      setSelectedNode(response.data?.data || node)
      loadLocations()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resubmit chapter')
    }
  }

  // Recursive Tree Node Renderer
  const renderTreeNode = (node, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expandedNodes[node._id] ?? true
    const isSelected = selectedNode?._id === node._id

    const isMatched = searchQuery
      ? node.name.toLowerCase().includes(searchQuery.toLowerCase())
      : false

    return (
      <div key={node._id} style={{ marginLeft: depth > 0 ? 16 : 0 }} className="relative mt-1">
        {depth > 0 && (
          <span className="absolute -left-3 top-5 h-full w-px bg-slate-200 dark:bg-slate-800" />
        )}
        <div
          onClick={() => setSelectedNode(node)}
          className={`flex items-center justify-between gap-3 py-1.5 group rounded-lg px-2 cursor-pointer transition ${
            isSelected
              ? 'bg-blue-50/80 border-l-4 border-[#0d4697] dark:bg-slate-900/60'
              : 'hover:bg-slate-55/40 dark:hover:bg-slate-900/40'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleExpand(node._id)
                }}
                className="grid h-6 w-6 place-items-center rounded text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            ) : (
              <span className="w-6 h-6 shrink-0" />
            )}
            <div className={`flex flex-wrap items-center gap-1.5 rounded-md px-2 py-1 text-sm font-semibold truncate ${
              isMatched
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100'
                : isSelected
                ? 'text-[#0d4697] dark:text-blue-400 font-extrabold'
                : 'text-slate-700 dark:text-slate-355'
            }`}>
              <span>{node.name}</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                ({node.type})
              </span>
            </div>
            {node.status === 'inactive' && (
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-red-100 text-red-700 shrink-0">INACTIVE</span>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {node.children.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  // Dynamic Add Button Config
  const addActionConfig = useMemo(() => {
    const role = user?.role
    const org = user?.meta?.adminProfile?.organization || {}

    if (role === ROLES.REGION_DIRECTOR) {
      return { label: 'Add State', type: 'state', parentId: org.region || '' }
    }
    if (role === ROLES.STATE_DIRECTOR) {
      return { label: 'Add District', type: 'district', parentId: org.state || '' }
    }
    if (role === ROLES.DIRECT_CONSULTANT) {
      return { label: 'Add Unit', type: 'chapter', parentId: org.district || '' }
    }

    if (!selectedNode) {
      return { label: 'Add Region', type: 'region', parentId: '' }
    }
    if (selectedNode.type === 'region') {
      return { label: 'Add State', type: 'state', parentId: selectedNode._id }
    }
    if (selectedNode.type === 'state') {
      return { label: 'Add District', type: 'district', parentId: selectedNode._id }
    }
    if (selectedNode.type === 'district') {
      return { label: 'Add Chapter', type: 'chapter', parentId: selectedNode._id }
    }
    return null
  }, [selectedNode, user])

  const canModifySelectedNode = useMemo(() => {
    if (!selectedNode) return false
    const role = user?.role
    const isGlobal = [ROLES.SUPERADMIN, ROLES.ADMIN].includes(role)
    if (isGlobal) return true

    if (role === ROLES.REGION_DIRECTOR && selectedNode.type === 'region') return false
    if (role === ROLES.STATE_DIRECTOR && selectedNode.type === 'state') return false
    if (role === ROLES.DISTRICT_DIRECTOR && selectedNode.type === 'district') return false
    if (role === ROLES.DIRECT_CONSULTANT && selectedNode.type === 'district') return false

    return true
  }, [selectedNode, user])

  const pathList = useMemo(() => getLocationPath(selectedNode), [selectedNode, locations])
  const stats = useMemo(() => {
    if (!selectedNode) return null
    return getSubHierarchyCounts(selectedNode._id, selectedNode.type)
  }, [selectedNode, locations])

  let pageTitle = "Organization Master Management"
  let pageDesc = "Establish and maintain the single source of truth for geographical hierarchies."

  if (user?.role === ROLES.REGION_DIRECTOR) {
    pageTitle = "Organization States Master"
    pageDesc = "Manage geographical States under your assigned Region."
  } else if (user?.role === ROLES.STATE_DIRECTOR) {
    pageTitle = "Organization Districts Master"
    pageDesc = "Manage geographical Districts under your assigned State."
  } else if (user?.role === ROLES.DISTRICT_DIRECTOR) {
    pageTitle = "Organization Chapters Master"
    pageDesc = "Manage geographical Chapters under your assigned District."
  } else if (user?.role === ROLES.DIRECT_CONSULTANT) {
    pageTitle = "Organization Units Master"
    pageDesc = "Manage geographical Units under your assigned District."
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/60 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#0d4697]">
            <MapPinned className="h-4 w-4" /> Master Configuration
          </p>
          <h1 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">{pageTitle}</h1>
          <p className="mt-2 text-sm font-semibold text-slate-555">
            {pageDesc}
          </p>
        </div>
        <div className="flex gap-2">
          {selectedNode && (
            <button
              onClick={() => setSelectedNode(null)}
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-xs font-extrabold text-slate-700 hover:bg-slate-50"
            >
              Clear Selection
            </button>
          )}
          {addActionConfig && (
            <button
              onClick={() => openCreate(addActionConfig.type, addActionConfig.parentId)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#0d4697] px-4 text-xs font-extrabold text-white hover:bg-blue-800"
            >
              <PlusCircle className="h-4 w-4" /> {addActionConfig.label}
            </button>
          )}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Tree */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="flex items-center gap-2 text-lg font-black text-slate-950 dark:text-white">
              <GitBranch className="h-5 w-5 text-[#0d4697]" />
              Hierarchy Tree
            </h2>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search nodes..."
                className="h-10 w-full rounded-md border border-slate-250 bg-white pl-9 pr-4 text-sm font-semibold outline-none focus:border-[#0d4697] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350"
              />
            </div>
          </div>
          <div className="mt-4 space-y-2 overflow-y-auto max-h-[600px] min-h-[300px]">
            {loading ? (
              <p className="text-sm font-semibold text-slate-400">Loading tree structure...</p>
            ) : treeData.length ? (
              treeData.map(root => renderTreeNode(root))
            ) : (
              <p className="text-sm font-semibold text-slate-555 py-12 text-center">
                Add Region nodes to begin building the organization hierarchy.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Node Details Panel */}
        <div className="lg:col-span-7 space-y-6">
          {selectedNode ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-955 space-y-6">
              {/* Path Breadcrumbs */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Map className="h-3.5 w-3.5" />
                {pathList.map((item, idx) => (
                  <span key={item._id} className="flex items-center gap-1.5">
                    {idx > 0 && <ChevronRight className="h-3 w-3" />}
                    <span className={idx === pathList.length - 1 ? 'text-[#0d4697] dark:text-blue-400 font-black' : ''}>{item.name}</span>
                  </span>
                ))}
              </div>

              {/* Header Info */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded">
                    {selectedNode.type} Level
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{selectedNode.name}</h2>
                </div>
                <StatusBadge value={selectedNode.status} />
              </div>

              {/* Specifications Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/40">
                  <span className="text-xs font-extrabold text-slate-400 uppercase">Code</span>
                  <p className="mt-1 font-mono text-sm font-bold text-slate-800 dark:text-slate-200">{selectedNode.code || '-'}</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-855 bg-slate-50/40">
                  <span className="text-xs font-extrabold text-slate-400 uppercase">Created Date</span>
                  <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">{formatDate(selectedNode.createdAt)}</p>
                </div>
              </div>

              {/* Sub-hierarchy Statistics */}
              {stats && (
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Layers className="h-4 w-4" /> Subordinate Statistics
                  </h3>
                  <div className="grid gap-4 grid-cols-3">
                    {selectedNode.type === 'region' && (
                      <div className="p-4 rounded-xl border border-blue-50 bg-blue-50/30 text-center">
                        <span className="text-2xl font-black text-blue-900 dark:text-blue-300">{stats.statesCount}</span>
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-500 mt-1">States</p>
                      </div>
                    )}
                    {['region', 'state'].includes(selectedNode.type) && (
                      <div className="p-4 rounded-xl border border-blue-50 bg-blue-50/30 text-center">
                        <span className="text-2xl font-black text-blue-900 dark:text-blue-300">{stats.districtsCount}</span>
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-500 mt-1">Districts</p>
                      </div>
                    )}
                    {['region', 'state', 'district'].includes(selectedNode.type) && (
                      <div className="p-4 rounded-xl border border-blue-50 bg-blue-50/30 text-center col-span-1">
                        <span className="text-2xl font-black text-blue-900 dark:text-blue-300">{stats.chaptersCount}</span>
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-500 mt-1">{UnitLabel}s</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedNode.type === 'chapter' && selectedNode.status === 'pending_approval' && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/20">
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                    This {unitLabel} is pending approval. {UnitLabel} status updates are handled through the approval workflow.
                  </p>
                </div>
              )}

              {selectedNode.type === 'chapter' && selectedNode.status === 'rejected' && user?.role === ROLES.DIRECT_CONSULTANT && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
                  <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                    This {unitLabel} was rejected. You can edit it, then resubmit after correcting the details.
                  </p>
                </div>
              )}

              {/* Actions Panel */}
              {canModifySelectedNode && (
                <div className="flex gap-2 justify-end border-t border-slate-100 dark:border-slate-800 pt-4">
                  <button
                    onClick={() => openEdit(selectedNode)}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-xs font-extrabold text-slate-700 hover:bg-slate-50"
                  >
                    <Edit2 className="h-4 w-4" /> Edit details
                  </button>
                  {!((selectedNode.type === 'chapter') && user?.role === ROLES.DIRECT_CONSULTANT) && (
                    <button
                      onClick={() => toggleStatus(selectedNode)}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-xs font-extrabold text-slate-700 hover:bg-slate-50"
                    >
                      {selectedNode.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {selectedNode.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                  {(selectedNode.type !== 'chapter' || isGlobalAdmin) && (
                    <button
                      onClick={() => handleDelete(selectedNode)}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-red-50 px-4 text-xs font-extrabold text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" /> Delete Location
                    </button>
                  )}
                  {selectedNode.type === 'chapter' && selectedNode.status === 'rejected' && user?.role === ROLES.DIRECT_CONSULTANT && (
                    <button
                      onClick={() => resubmitChapter(selectedNode)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Resubmit {UnitLabel}
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center dark:border-slate-800 min-h-[300px] flex flex-col justify-center items-center">
              <Info className="h-10 w-10 text-slate-350 mb-3" />
              <h3 className="text-base font-black text-slate-800 dark:text-slate-200">No Location Selected</h3>
              <p className="text-sm font-semibold text-slate-400 mt-1 max-w-sm">
                Select a node from the left tree hierarchy to view statistics, specifications, and manage child nodes.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Location Modal */}
      <Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} title={`Add New ${form.type === 'chapter' ? UnitLabel.toUpperCase() : form.type?.toUpperCase()}`}>
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {form.parent && (
            <div className="space-y-4">
              {form.type === 'state' && (
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-500">Region (Read Only)</label>
                  <input
                    type="text"
                    disabled
                    value={user?.role === ROLES.REGION_DIRECTOR ? (user?.meta?.adminProfile?.organization?.assignedRegion?.name || 'Not Assigned') : (selectedNode?.name || '')}
                    className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-500"
                  />
                </div>
              )}

              {form.type === 'district' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-555">Region (Read Only)</label>
                    <input
                      type="text"
                      disabled
                      value={user?.role === ROLES.STATE_DIRECTOR ? (user?.meta?.adminProfile?.organization?.assignedRegion?.name || '') : (pathList[pathList.length - 2]?.name || '')}
                      className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-500">State (Read Only)</label>
                    <input
                      type="text"
                      disabled
                      value={user?.role === ROLES.STATE_DIRECTOR ? (user?.meta?.adminProfile?.organization?.assignedState?.name || '') : (selectedNode?.name || '')}
                      className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-500"
                    />
                  </div>
                </div>
              )}

              {form.type === 'chapter' && (
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-555">Region (Read Only)</label>
                    <input
                      type="text"
                      disabled
                      value={user?.role === ROLES.DIRECT_CONSULTANT ? (user?.meta?.adminProfile?.organization?.assignedRegion?.name || '') : (pathList[pathList.length - 3]?.name || '')}
                      className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-555">State (Read Only)</label>
                    <input
                      type="text"
                      disabled
                      value={user?.role === ROLES.DIRECT_CONSULTANT ? (user?.meta?.adminProfile?.organization?.assignedState?.name || '') : (pathList[pathList.length - 2]?.name || '')}
                      className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-555">District (Read Only)</label>
                    <input
                      type="text"
                      disabled
                      value={user?.role === ROLES.DIRECT_CONSULTANT ? (user?.meta?.adminProfile?.organization?.assignedDistrict?.name || '') : (selectedNode?.name || '')}
                      className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-500">{form.type === 'chapter' ? UnitLabel.toUpperCase() : form.type?.toUpperCase()} Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder={`Enter ${form.type === 'chapter' ? unitLabel : form.type} name`}
              className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-900 focus:outline-none focus:border-[#0d4697]"
            />
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-555">Code (Optional)</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value }))}
              placeholder={`Enter ${form.type} code`}
              className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-900 focus:outline-none focus:border-[#0d4697]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-xs font-extrabold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-md bg-[#0d4697] px-4 text-xs font-extrabold text-white hover:bg-blue-800"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Location Modal */}
      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)} title={`Edit ${selectedNode?.type?.toUpperCase()}`}>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-500">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter name"
              className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-900 focus:outline-none focus:border-[#0d4697]"
            />
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-555">Code (Optional)</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value }))}
              placeholder="Enter code"
              className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-900 focus:outline-none focus:border-[#0d4697]"
            />
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-500">Status</label>
            {form.type === 'chapter' && user?.role === ROLES.DIRECT_CONSULTANT ? (
              <p className="text-sm font-bold text-slate-500 text-center">
                {UnitLabel} status is controlled by the approval workflow. Edit details and resubmit when ready.
              </p>
            ) : (
              <select
                value={form.status}
                onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-xs font-extrabold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-md bg-[#0d4697] px-4 text-xs font-extrabold text-white hover:bg-blue-800"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

    </div>
  )
}
