import { useEffect, useState } from 'react'
import { communityApi } from '../../api/community'
import LoadingScreen from '../../components/common/LoadingScreen'
import toast from 'react-hot-toast'
import {
  PlusCircle,
  FileCheck,
  AlertCircle,
  User,
  Clock,
  Briefcase,
  HelpCircle,
  MessageSquare
} from 'lucide-react'
import { formatDate } from '../../utils/format'

export default function TasksAndHelpDesk() {
  const [tasks, setTasks] = useState([])
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  // Forms modals visibility
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showTicketModal, setShowTicketModal] = useState(false)

  // Task form state
  const [taskTitle, setTaskTitle] = useState('')
  const [taskPriority, setTaskPriority] = useState('medium')
  const [taskDueDate, setTaskDueDate] = useState('')
  const [taskAssignee, setTaskAssignee] = useState('')

  // Ticket form state
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketDept, setTicketDept] = useState('membership')
  const [ticketPriority, setTicketPriority] = useState('medium')

  const loadData = () => {
    Promise.all([
      communityApi.getTasks(),
      communityApi.getTickets()
    ])
      .then(([tasksRes, ticketsRes]) => {
        setTasks(tasksRes.data?.data || [])
        setTickets(ticketsRes.data?.data || [])
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    setLoading(true)
    loadData()
  }, [])

  const handleCreateTask = (e) => {
    e.preventDefault()
    communityApi.createTask({ title: taskTitle, priority: taskPriority, dueDate: taskDueDate, assignee: taskAssignee })
      .then(() => {
        toast.success('Task created successfully')
        setShowTaskModal(false)
        setTaskTitle('')
        setTaskDueDate('')
        setTaskAssignee('')
        loadData()
      })
      .catch(() => {
        toast.error('Failed to create task')
      })
  }

  const handleCreateTicket = (e) => {
    e.preventDefault()
    communityApi.createTicket({ subject: ticketSubject, department: ticketDept, priority: ticketPriority })
      .then(() => {
        toast.success('Support ticket logged successfully')
        setShowTicketModal(false)
        setTicketSubject('')
        loadData()
      })
      .catch(() => {
        toast.error('Failed to submit ticket')
      })
  }

  const toggleTaskStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
    communityApi.updateTask(id, { status: newStatus })
      .then(() => {
        toast.success(`Task status updated`)
        loadData()
      })
      .catch(() => {})
  }

  if (loading) {
    return <LoadingScreen label="Loading tasks & help desk..." />
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Task Management Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-[#0d4697]" />
            Official Tasks Assignment
          </h3>
          <button 
            onClick={() => setShowTaskModal(true)}
            className="inline-flex items-center gap-1 text-xs font-extrabold text-[#0d4697] hover:underline"
          >
            <PlusCircle className="h-4 w-4" />
            Add Task
          </button>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {tasks.map(task => {
            const isCompleted = task.metadata?.status === 'completed'
            return (
              <div key={task._id} className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2 relative group hover:border-[#0d4697]/40 transition">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2">
                    <input 
                      type="checkbox" 
                      checked={isCompleted}
                      onChange={() => toggleTaskStatus(task._id, task.metadata?.status)}
                      className="mt-0.5 rounded text-[#0d4697] focus:ring-[#0d4697] shrink-0 cursor-pointer"
                    />
                    <h4 className={`text-xs font-extrabold text-slate-800 leading-snug ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                      {task.name}
                    </h4>
                  </div>
                  <span className="rounded bg-blue-50 border border-blue-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-[#0d4697]">
                    {task.metadata?.priority}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold pt-1 border-t border-slate-200/50">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Assignee: {task.metadata?.assignee || 'Unassigned'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Due: {formatDate(task.metadata?.dueDate)}
                  </span>
                </div>
              </div>
            )
          })}
          {!tasks.length && (
            <p className="text-xs font-semibold text-slate-400 text-center py-6">No tasks currently assigned.</p>
          )}
        </div>
      </section>

      {/* Help Desk Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#0d4697]" />
            Help Desk Support Tickets
          </h3>
          <button 
            onClick={() => setShowTicketModal(true)}
            className="inline-flex items-center gap-1 text-xs font-extrabold text-[#0d4697] hover:underline"
          >
            <PlusCircle className="h-4 w-4" />
            File Ticket
          </button>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {tickets.map(ticket => (
            <div key={ticket._id} className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2 relative hover:border-[#0d4697]/40 transition">
              <div className="flex justify-between items-start">
                <h4 className="text-xs font-extrabold text-slate-800 leading-snug">{ticket.name}</h4>
                <span className="rounded bg-yellow-50 border border-yellow-200 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-yellow-700">
                  {ticket.metadata?.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold pt-1 border-t border-slate-200/50">
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  Dept: {ticket.metadata?.department}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Created: {formatDate(ticket.createdAt)}
                </span>
              </div>
            </div>
          ))}
          {!tickets.length && (
            <p className="text-xs font-semibold text-slate-400 text-center py-6">No active support tickets logged.</p>
          )}
        </div>
      </section>

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-4">Assign Official Task</h3>
            
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Task Title</label>
                <input 
                  type="text" 
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                  placeholder="e.g. Verify visitor registrations" 
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#0d4697]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Priority</label>
                  <select 
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Due Date</label>
                  <input 
                    type="date" 
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#0d4697]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Assignee Name</label>
                <input 
                  type="text" 
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  required
                  placeholder="e.g. Arun Dev" 
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#0d4697]"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowTaskModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-extrabold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="rounded-lg bg-[#0d4697] px-4 py-2 text-xs font-extrabold text-white hover:bg-blue-800"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Creation Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-4">Submit Support Ticket</h3>
            
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Subject</label>
                <input 
                  type="text" 
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  required
                  placeholder="Describe your issue..." 
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#0d4697]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Department</label>
                  <select 
                    value={ticketDept}
                    onChange={(e) => setTicketDept(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 outline-none"
                  >
                    <option value="membership">Membership Operations</option>
                    <option value="billing">Billing & Finance</option>
                    <option value="directory">Directory Listings</option>
                    <option value="technical">Technical Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Priority</label>
                  <select 
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowTicketModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-extrabold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="rounded-lg bg-[#0d4697] px-4 py-2 text-xs font-extrabold text-white hover:bg-blue-800"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
