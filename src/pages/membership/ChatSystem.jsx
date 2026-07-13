import { useEffect, useState } from 'react'
import { communityApi } from '../../api/community'
import LoadingScreen from '../../components/common/LoadingScreen'
import toast from 'react-hot-toast'
import {
  Send,
  UsersRound,
  FileText,
  Building,
  Image,
  Paperclip,
  CheckCheck
} from 'lucide-react'

export default function ChatSystem() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  const fetchMessages = () => {
    communityApi.getChatMessages()
      .then(res => {
        setMessages(res.data?.data || [])
      })
      .catch(() => {})
  }

  useEffect(() => {
    setLoading(true)
    communityApi.getChatMessages()
      .then(res => {
        setMessages(res.data?.data || [])
      })
      .catch(() => {
        toast.error('Unable to establish chat server connection')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleSend = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setSending(true)

    communityApi.sendChatMessage({ content: text })
      .then(() => {
        setText('')
        fetchMessages()
      })
      .catch(() => {
        toast.error('Failed to dispatch message')
      })
      .finally(() => {
        setSending(false)
      })
  }

  if (loading) {
    return <LoadingScreen label="Establishing chat server session..." />
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden grid md:grid-cols-[250px_1fr] h-[500px]">
      {/* Sidebar - active conversations list */}
      <aside className="border-r border-slate-200 bg-slate-50/50 p-4 space-y-4">
        <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Conversations</h4>
        
        <div className="rounded-xl bg-white border border-slate-200 p-3 flex items-center gap-2 cursor-pointer hover:bg-slate-50">
          <span className="h-8 w-8 rounded-full bg-blue-100 text-[#0d4697] flex items-center justify-center font-bold text-xs shrink-0">
            C
          </span>
          <div className="min-w-0">
            <p className="text-xs font-extrabold text-slate-800 truncate">Chapter Lobby</p>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Online • active</p>
          </div>
        </div>
      </aside>

      {/* Message Pane */}
      <main className="flex flex-col h-full bg-white">
        {/* Lobby Header */}
        <header className="border-b border-slate-100 p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-extrabold text-slate-800">Chapter Lobby</h4>
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
          </div>
          <span className="text-[10px] font-bold text-slate-400">Read receipts active</span>
        </header>

        {/* Message registry stream */}
        <section className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className="flex items-start gap-2.5 max-w-[80%]">
              <span className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                {msg.sender?.charAt(0) || 'M'}
              </span>
              <div className="bg-slate-100 rounded-2xl px-4 py-2.5">
                <p className="text-[10px] font-black text-slate-900 leading-none mb-1">{msg.sender}</p>
                <p className="text-xs font-medium text-slate-700 leading-normal">{msg.content}</p>
                <div className="flex justify-end items-center gap-1 mt-1 text-[9px] text-slate-400 font-bold">
                  <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <CheckCheck className="h-3 w-3 text-blue-500" />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Action input panel */}
        <form onSubmit={handleSend} className="border-t border-slate-100 p-3 flex items-center gap-2 shrink-0">
          <button 
            type="button" 
            onClick={() => toast.success('Attachment file explorer opened (Mock)')}
            className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-50 text-slate-400 shrink-0"
          >
            <Paperclip className="h-4.5 w-4.5" />
          </button>
          
          <input 
            type="text" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message to lobby..." 
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-xs outline-none focus:border-[#0d4697] focus:ring-1 focus:ring-blue-100"
          />

          <button 
            type="submit" 
            disabled={sending || !text.trim()}
            className="grid h-9 w-9 place-items-center rounded-lg bg-[#0d4697] text-white hover:bg-blue-800 transition disabled:opacity-50 shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </main>
    </div>
  )
}
