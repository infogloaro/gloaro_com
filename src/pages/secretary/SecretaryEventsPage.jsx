import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CalendarDays, ClipboardCheck, Clock3, MapPin, Pencil, Plus, Users } from 'lucide-react'
import { secretaryApi } from '../../api/secretary'
import Modal from '../../components/common/Modal'
import SearchBar from '../../components/common/SearchBar'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import { getList } from '../../utils/format'

const field = 'mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#1558b0]'
const emptyForm = { name: '', description: '', date: '', startTime: '', endTime: '', venue: '', address: '' }
const emptyMember = { name: '', role: '', task: '', phone: '', assignedDate: '' }
const formatDate = (value) => value ? new Date(value).toLocaleDateString('en-IN') : '-'
const formatTime = (value) => value ? new Date(value).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '-'
const inputDate = (value) => { const date = new Date(value); const offset = date.getTimezoneOffset(); return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10) }
const inputTime = (value) => { const date = new Date(value); return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}` }

export default function SecretaryEventsPage() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [selected, setSelected] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [assignOpen, setAssignOpen] = useState(false)
  const [assignEvent, setAssignEvent] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [member, setMember] = useState(emptyMember)

  const load = useCallback(() => {
    setLoading(true)
    secretaryApi.events({ search, limit: 50 })
      .then((response) => setEvents(getList(response.data)))
      .catch((error) => toast.error(error.response?.data?.message || 'Unable to load events'))
      .finally(() => setLoading(false))
  }, [search])

  useEffect(() => {
    const timer = window.setTimeout(load, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  const saveEvent = async (event) => {
    event.preventDefault()
    try {
      if (editingEvent) await secretaryApi.updateEvent(editingEvent._id, form)
      else await secretaryApi.createEvent(form)
      setCreateOpen(false)
      setEditingEvent(null)
      setForm(emptyForm)
      toast.success(editingEvent ? 'Event updated' : 'Event created')
      load()
    } catch (error) {
      toast.error(error.response?.data?.message || `Unable to ${editingEvent ? 'update' : 'create'} event`)
    }
  }

  const openCreate = () => {
    setEditingEvent(null)
    setForm(emptyForm)
    setCreateOpen(true)
  }

  const openEdit = (event) => {
    setEditingEvent(event)
    setForm({
      name: event.title || '',
      description: event.description || '',
      date: inputDate(event.startDate),
      startTime: inputTime(event.startDate),
      endTime: inputTime(event.endDate),
      venue: event.venue?.name || '',
      address: event.venue?.address || '',
    })
    setSelected(null)
    setCreateOpen(true)
  }

  const openAssign = (event) => {
    setAssignEvent(event)
    setSelected(null)
    setMember(emptyMember)
    setAssignOpen(true)
  }

  const assignMember = async (event) => {
    event.preventDefault()
    if (!/^[A-Za-z ]+$/.test(member.name.trim())) {
      toast.error('Member name must contain only letters and spaces')
      return
    }
    if (!/^\d{10}$/.test(member.phone)) {
      toast.error('Phone number must contain exactly 10 digits')
      return
    }
    try {
      const response = await secretaryApi.assignEventMember(assignEvent._id, member)
      if (selected?._id === assignEvent._id) setSelected(response.data?.data)
      setAssignOpen(false)
      setAssignEvent(null)
      setMember(emptyMember)
      toast.success('Member assigned to event')
      load()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to assign member')
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><h2 className="text-2xl font-extrabold">Events</h2><p className="mt-1 text-sm font-semibold text-slate-500">Create events, assign members, and track attendance.</p></div>
        <div className="flex gap-2"><SearchBar value={search} onChange={setSearch} placeholder="Search events" /><button onClick={openCreate} className="inline-flex items-center gap-2 rounded-md bg-[#1558b0] px-4 text-sm font-bold text-white"><Plus className="h-4 w-4" />Create event</button></div>
      </header>

      {loading ? <LoadingScreen label="Loading events..." /> : events.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{events.map((event) => (
          <article key={event._id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-[#1558b0] hover:shadow-md">
            <button type="button" onClick={() => setSelected(event)} className="block w-full p-5 text-left">
              <h3 className="text-lg font-extrabold">{event.title}</h3><p className="mt-2 min-h-10 text-sm text-slate-500">{event.description}</p>
              <div className="mt-4 space-y-2 text-sm"><p className="flex items-center gap-2 font-bold text-[#1558b0]"><CalendarDays className="h-4 w-4" />{formatDate(event.startDate)}</p><p className="flex items-center gap-2 text-slate-600"><Clock3 className="h-4 w-4" />{formatTime(event.startDate)} - {formatTime(event.endDate)}</p><p className="flex items-center gap-2 text-slate-600"><MapPin className="h-4 w-4" />{event.venue?.name || 'Place not specified'}</p><p className="flex items-center gap-2 font-bold text-slate-600"><Users className="h-4 w-4" />{event.attendees?.length || 0} assigned members</p></div>
            </button>
            <div className="grid grid-cols-3 gap-2 border-t border-slate-200 px-4 py-3">
              <button type="button" onClick={() => openAssign(event)} className="inline-flex min-w-0 items-center justify-center gap-2 rounded-md bg-[#1558b0] px-3 py-2 text-sm font-extrabold text-white"><Plus className="h-4 w-4 shrink-0" /><span>Add member</span></button>
              <button type="button" onClick={() => navigate(`/secretary/attendance?event=${event._id}`)} title="Open attendance" className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-50 px-2 py-2 text-sm font-extrabold text-emerald-700"><ClipboardCheck className="h-4 w-4 shrink-0" /><span className="truncate">Attendance</span></button>
              <button type="button" onClick={() => openEdit(event)} title="Edit event" className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-md border border-slate-300 px-2 py-2 text-sm font-extrabold text-slate-700"><Pencil className="h-4 w-4 shrink-0" /><span>Edit</span></button>
            </div>
          </article>
        ))}</div>
      ) : <EmptyState title="No events yet" description="Create an event to assign members." />}

      <Modal open={createOpen} title={editingEvent ? 'Edit event' : 'Create event'} onClose={() => { setCreateOpen(false); setEditingEvent(null); setForm(emptyForm) }}>
        <form onSubmit={saveEvent} className="space-y-4">
          <label className="block text-sm font-bold">Event name<input required className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="block text-sm font-bold">Description<textarea required className={`${field} h-24 py-2`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <label className="block text-sm font-bold">Date<input required type="date" className={field} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
          <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-bold">Start time<input required type="time" className={field} value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} /></label><label className="block text-sm font-bold">End time<input required type="time" className={field} value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} /></label></div>
          <label className="block text-sm font-bold">Event place<input required className={field} value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></label>
          <label className="block text-sm font-bold">Address<input className={field} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
          <button className="h-11 w-full rounded-md bg-[#1558b0] font-bold text-white">{editingEvent ? 'Save changes' : 'Create event'}</button>
        </form>
      </Modal>

      <Modal open={Boolean(selected)} title={selected?.title || 'Event details'} onClose={() => setSelected(null)} maxWidth="max-w-4xl">
        <div className="space-y-5">
          <p className="text-sm text-slate-600">{selected?.description}</p>
          <div className="grid gap-3 border-y border-slate-200 py-4 sm:grid-cols-3"><p><b>Date</b><br />{formatDate(selected?.startDate)}</p><p><b>Time</b><br />{formatTime(selected?.startDate)} - {formatTime(selected?.endDate)}</p><p><b>Place</b><br />{selected?.venue?.name || 'Not specified'}</p></div>
          <div className="flex flex-wrap gap-2"><button onClick={() => openAssign(selected)} className="rounded-md bg-[#1558b0] px-4 py-2 text-sm font-bold text-white">Add member</button><button onClick={() => navigate(`/secretary/attendance?event=${selected._id}`)} className="rounded-md border border-[#1558b0] px-4 py-2 text-sm font-bold text-[#1558b0]">Open attendance page</button><button onClick={() => openEdit(selected)} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700"><Pencil className="h-4 w-4" />Edit event</button></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead><tr className="border-b text-xs uppercase text-slate-500"><th className="py-2">Member</th><th>Role</th><th>Phone</th><th>Task</th><th>Status</th></tr></thead><tbody>{selected?.attendees?.map((attendee) => <tr key={attendee._id} className="border-b"><td className="py-3 font-bold">{attendee.user?.name || attendee.name || 'Member'}</td><td>{attendee.role || '-'}</td><td>{attendee.user?.phone || attendee.phone || '-'}</td><td>{attendee.task || '-'}</td><td><StatusBadge value={attendee.status === 'attended' ? 'present' : attendee.status === 'no_show' ? 'absent' : 'pending'} /></td></tr>)}</tbody></table></div>
        </div>
      </Modal>

      <Modal open={assignOpen} title={`Add member${assignEvent?.title ? ` - ${assignEvent.title}` : ''}`} onClose={() => { setAssignOpen(false); setAssignEvent(null) }}>
        <form onSubmit={assignMember} className="space-y-4">
          <label className="block text-sm font-bold">Member name<input required pattern="[A-Za-z ]+" title="Enter letters and spaces only" placeholder="Enter member name" className={field} value={member.name} onChange={(e) => setMember({ ...member, name: e.target.value.replace(/[^A-Za-z ]/g, '') })} /></label>
          <label className="block text-sm font-bold">Role<input required className={field} value={member.role} onChange={(e) => setMember({ ...member, role: e.target.value })} /></label>
          <label className="block text-sm font-bold">Task<input className={field} value={member.task} onChange={(e) => setMember({ ...member, task: e.target.value })} /></label>
          <label className="block text-sm font-bold">Phone number<input required type="tel" inputMode="numeric" autoComplete="tel" minLength={10} maxLength={10} pattern="[0-9]{10}" title="Enter exactly 10 digits" className={field} value={member.phone} onChange={(e) => setMember({ ...member, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} /></label>
          <label className="block text-sm font-bold">Assigned date<input required type="date" className={field} value={member.assignedDate} onChange={(e) => setMember({ ...member, assignedDate: e.target.value })} /></label>
          <button className="h-11 w-full rounded-md bg-[#1558b0] font-bold text-white">Add member</button>
        </form>
      </Modal>
    </div>
  )
}
