import { useEffect, useState } from 'react'
import { BookOpen, CalendarDays, CheckCircle2, ExternalLink } from 'lucide-react'
import { customerApi } from '../../api/customer'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import Modal from '../../components/common/Modal'
import { formatDate } from '../../utils/format'

export default function AssignedTrainingPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [completedAssignments, setCompletedAssignments] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gloaro_completed_assignments') || '{}') } catch { return {} }
  })

  const completeAssignment = async (courseId, index) => {
    await customerApi.completeTrainingAssignment(courseId, index)
    const key = `${courseId}:${index}`
    setSelectedCourse((course) => course ? { ...course, assignmentProgress: (course.assignmentProgress || []).map((item, itemIndex) => itemIndex === index ? { ...item, status: 'completed' } : item) } : course)
    setCompletedAssignments((current) => {
      const next = { ...current, [key]: true }
      localStorage.setItem('gloaro_completed_assignments', JSON.stringify(next))
      return next
    })
  }

  useEffect(() => {
    customerApi.training().then((response) => setCourses(response.data?.data || [])).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingScreen label="Loading assigned courses..." />

  const assignmentsFor = (course) => {
    const assignments = course.metadata?.assignments
    if (Array.isArray(assignments)) return assignments
    if (assignments && typeof assignments === 'object') return Object.values(assignments)
    return course.metadata?.assignmentLink ? [{ name: 'Assignment', link: course.metadata.assignmentLink }] : []
  }

  return <div className="space-y-6">
    <div><h2 className="text-2xl font-extrabold text-slate-950">My Assigned Courses</h2><p className="mt-1 text-sm font-semibold text-slate-500">Access courses assigned to you by an administrator.</p></div>
    {courses.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{courses.map((course) => <button type="button" key={course._id} onClick={() => setSelectedCourse(course)} className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-[#0d4697] hover:shadow-md"><div className="flex items-start justify-between gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-[#0d4697]"><BookOpen className="h-5 w-5" /></span><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold capitalize text-emerald-700">{course.status || 'Active'}</span></div><h3 className="mt-4 text-lg font-extrabold text-slate-900">{course.name}</h3><p className="mt-2 text-sm text-slate-500">{course.metadata?.description || course.metadata?.summary || 'Course assigned by your administrator.'}</p><p className="mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-500"><CalendarDays className="h-4 w-4" /> Assigned {formatDate(course.createdAt)}</p></button>)}</div> : <EmptyState title="No courses assigned" description="Assigned courses will appear here after an administrator registers you." />}
    <Modal open={Boolean(selectedCourse)} title={selectedCourse?.name || 'Course details'} onClose={() => setSelectedCourse(null)}>
      {selectedCourse && <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-3"><p className="text-[10px] font-extrabold uppercase text-slate-400">Course type</p><p className="mt-1 font-bold capitalize text-slate-800">{selectedCourse.type || '—'}</p></div>
          <div className="rounded-lg bg-slate-50 p-3"><p className="text-[10px] font-extrabold uppercase text-slate-400">Status</p><p className="mt-1 font-bold capitalize text-slate-800">{selectedCourse.status || 'Active'}</p></div>
          <div className="rounded-lg bg-slate-50 p-3 sm:col-span-2"><p className="text-[10px] font-extrabold uppercase text-slate-400">Assigned date</p><p className="mt-1 font-bold text-slate-800">{formatDate(selectedCourse.createdAt)}</p></div>
        </div>
        <div><p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Description</p><p className="mt-2 text-sm leading-6 text-slate-600">{selectedCourse.metadata?.description || selectedCourse.metadata?.summary || 'No description available.'}</p></div>
        <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-lg bg-blue-50 p-3"><p className="text-[10px] font-extrabold uppercase text-[#0d4697]">Daily task update</p><p className="mt-1 text-sm font-semibold text-slate-700">{selectedCourse.metadata?.dailyTaskUpdate || 'No daily task update available.'}</p></div><div className="rounded-lg bg-amber-50 p-3"><p className="text-[10px] font-extrabold uppercase text-amber-700">Marks</p><div className="mt-1 space-y-1 text-sm font-bold text-slate-700">{selectedCourse.assignmentProgress?.some((item) => item.marks) ? selectedCourse.assignmentProgress.map((item, index) => item.marks ? <p key={item._id || index}>Assignment {index + 1}: {item.marks}</p> : null) : <p>No marks assigned yet.</p>}</div></div></div>
        <div className="border-t border-slate-100 pt-4"><p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Assignments</p>{assignmentsFor(selectedCourse).length ? <div className="mt-3 space-y-2">{assignmentsFor(selectedCourse).map((assignment, index) => { const completed = selectedCourse.assignmentProgress?.[index]?.status === 'completed' || completedAssignments[`${selectedCourse._id}:${index}`]; return <div key={`${assignment.link}-${index}`} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-3"><a href={assignment.link} target="_blank" rel="noreferrer" className="min-w-0 hover:underline"><span className="block text-sm font-extrabold text-slate-800">{assignment.name || `Assignment ${index + 1}`}</span><span className="mt-1 block truncate text-xs font-semibold text-[#0d4697]">{assignment.link}</span></a><div className="flex shrink-0 items-center gap-2"><a href={assignment.link} target="_blank" rel="noreferrer" aria-label="Open assignment" className="text-[#0d4697]"><ExternalLink className="h-4 w-4" /></a><button type="button" onClick={() => completeAssignment(selectedCourse._id, index)} disabled={completed} className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[10px] font-extrabold ${completed ? 'bg-emerald-50 text-emerald-700' : 'bg-[#0d4697] text-white hover:bg-blue-800'}`}>{completed && <CheckCircle2 className="h-3.5 w-3.5" />}{completed ? 'Completed' : 'Complete'}</button></div></div> })}</div> : <p className="mt-2 text-sm text-slate-500">No assignments added.</p>}</div>
      </div>}
    </Modal>
  </div>
}
