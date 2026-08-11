import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { communityApi } from '../../api/community'
import LoadingScreen from '../../components/common/LoadingScreen'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import {
  CheckCheck,
  Image,
  Paperclip,
  Send,
  UsersRound,
  X,
} from 'lucide-react'

const getInitial = (user) => user?.name?.charAt(0)?.toUpperCase() || 'M'

const roleLabel = (role) => String(role || 'Member')
  .split('_')
  .filter(Boolean)
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join(' ')

const withSuffix = (value, suffix = '') => {
  if (!value) return ''
  return suffix && !String(value).toLowerCase().includes(suffix.toLowerCase()) ? `${value} ${suffix}` : value
}

const getMemberMetaLine = (member) => [
  roleLabel(member?.role),
  withSuffix(member?.chapterName, 'Unit'),
  withSuffix(member?.districtName, 'District'),
  member?.stateName,
  withSuffix(member?.regionName, 'Region'),
].filter(Boolean).join(' • ')

const formatConversationTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return date.toLocaleDateString([], { day: '2-digit', month: 'short' })
}

const getMessagePreview = (message) => {
  if (message?.content) return message.content
  if (message?.attachments?.length) return 'Attachment'
  return 'New message'
}

export default function ChatSystem() {
  const [params] = useSearchParams()
  const { user, socket } = useAuth()
  const recipient = params.get('recipient')
  const [messages, setMessages] = useState([])
  const [members, setMembers] = useState([])
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [attachments, setAttachments] = useState([])
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  const messageScope = recipient ? 'direct' : 'chapter'
  const conversationTitle = useMemo(() => {
    if (!recipient) return 'Unit Lobby'
    const member = members.find((item) => item._id === recipient)
    const conversation = conversations.find((item) => String(item.partner?._id || item.partner) === String(recipient))
    return member || conversation?.partner ? `Direct Message: ${member?.name || conversation.partner?.name}` : 'Direct Message'
  }, [conversations, members, recipient])

  const selectedMember = useMemo(() => {
    const member = members.find((item) => item._id === recipient)
    if (member) return member
    return conversations.find((item) => String(item.partner?._id || item.partner) === String(recipient))?.partner
  }, [conversations, members, recipient])
  const directMembers = useMemo(() => members.filter((member) => member._id !== user?._id), [members, user?._id])
  const recentPartnerIds = useMemo(() => new Set(conversations.map((item) => String(item.partner?._id || item.partner))), [conversations])
  const availableMembers = useMemo(() => directMembers.filter((member) => !recentPartnerIds.has(String(member._id))), [directMembers, recentPartnerIds])

  const fetchMessages = useCallback(() => {
    return communityApi.getChatMessages({ scope: messageScope, recipient: recipient || undefined })
      .then(res => setMessages(res.data?.data || []))
  }, [messageScope, recipient])

  const fetchConversations = useCallback(() => {
    return communityApi.getChatConversations()
      .then((res) => setConversations(res.data?.data || []))
  }, [])

  useEffect(() => {
    let mounted = true

    Promise.all([
      fetchMessages(),
      fetchConversations(),
      communityApi.getDirectory({ scope: 'network' }).then((res) => {
        if (mounted) setMembers(res.data?.data || [])
      })
    ])
      .catch(() => {
        if (mounted) toast.error('Unable to establish chat server connection')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => { mounted = false }
  }, [fetchConversations, fetchMessages, recipient])

  useEffect(() => {
    if (!recipient) return

    communityApi.markChatRead(recipient)
      .then(() => {
        fetchConversations()
        window.dispatchEvent(new Event('gloaro:chat-unread-refresh'))
      })
      .catch(() => {})
  }, [fetchConversations, recipient])

  useEffect(() => {
    if (!socket) return undefined

    const refreshChatBadges = () => {
      fetchConversations()
      window.dispatchEvent(new Event('gloaro:chat-unread-refresh'))
    }

    const handleIncomingMessage = ({ message }) => {
      const senderId = String(message?.sender?._id || message?.sender || '')
      refreshChatBadges()

      if (senderId && String(recipient || '') === senderId) {
        fetchMessages()
        communityApi.markChatRead(senderId)
          .then(() => {
            fetchConversations()
            window.dispatchEvent(new Event('gloaro:chat-unread-refresh'))
          })
          .catch(() => {})
        return
      }
    }

    socket.on('direct_message', handleIncomingMessage)
    socket.on('direct_message_sent', refreshChatBadges)
    socket.on('direct_message_read', refreshChatBadges)

    return () => {
      socket.off('direct_message', handleIncomingMessage)
      socket.off('direct_message_sent', refreshChatBadges)
      socket.off('direct_message_read', refreshChatBadges)
    }
  }, [fetchConversations, fetchMessages, recipient, socket])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [messages.length, recipient])

  const handleFiles = (event) => {
    const files = Array.from(event.target.files || [])
    setAttachments((current) => [...current, ...files])
    event.target.value = ''
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!text.trim() && !attachments.length) return
    setSending(true)

    const form = new FormData()
    form.append('content', text.trim())
    form.append('scope', messageScope)
    if (recipient) form.append('recipient', recipient)
    attachments.forEach((file) => form.append('attachments', file))

    communityApi.sendChatMessage(form)
      .then((res) => {
        const savedMessage = res.data?.data
        setText('')
        setAttachments([])
        if (savedMessage?._id) {
          setMessages((current) => current.some((item) => item._id === savedMessage._id) ? current : [...current, savedMessage])
        }
        fetchMessages()
        fetchConversations()
        window.dispatchEvent(new Event('gloaro:chat-unread-refresh'))
      })
      .catch(() => {
        toast.error('Failed to dispatch message')
      })
      .finally(() => {
        setSending(false)
      })
  }

  const handleComposerKeyDown = (event) => {
    if (event.key !== 'Enter' || event.shiftKey) return
    event.preventDefault()
    if (!sending && (text.trim() || attachments.length)) {
      handleSend(event)
    }
  }

  if (loading) {
    return <LoadingScreen label="Establishing chat server session..." />
  }

  return (
    <div className="grid h-[calc(100vh-150px)] min-h-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:h-[min(720px,calc(100vh-180px))] md:grid-cols-[260px_1fr]">
      <aside className="flex min-h-0 flex-col border-r border-slate-200 bg-slate-50/50 p-4">
        <h4 className="shrink-0 text-xs font-black uppercase tracking-wider text-slate-400">Conversations</h4>

        <a href={window.location.pathname} className={`mt-4 flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 p-3 ${!recipient ? 'bg-white' : 'bg-slate-50 hover:bg-white'}`}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-[#0d4697]">
            <UsersRound className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-extrabold text-slate-800">Unit Lobby</p>
            <p className="mt-0.5 text-[10px] font-semibold text-slate-400">Same chapter members only</p>
          </div>
        </a>

        <div className="mt-4 flex min-h-0 flex-1 flex-col">
          <p className="shrink-0 text-[10px] font-black uppercase tracking-wider text-slate-400">Direct Messages</p>
          <div className="mt-2 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {conversations.map((conversation) => {
              const partner = conversation.partner
              const partnerId = partner?._id || partner
              const lastMessage = conversation.lastMessage

              return (
                <a key={partnerId} href={`${window.location.pathname}?recipient=${partnerId}`} className={`flex items-start gap-2 rounded-xl border border-slate-200 p-3 ${recipient === String(partnerId) ? 'bg-white' : 'bg-slate-50 hover:bg-white'}`}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-[#0d4697]">{getInitial(partner)}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-extrabold text-slate-800">{partner?.name || 'Member'}</p>
                        <p className="mt-0.5 truncate text-[10px] font-semibold text-slate-500">{roleLabel(partner?.role)}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="text-[10px] font-bold text-slate-400">{formatConversationTime(lastMessage?.createdAt)}</span>
                        {conversation.unreadCount > 0 && (
                          <span className="grid min-h-5 min-w-5 place-items-center rounded-full bg-[#0d4697] px-1.5 text-[10px] font-black text-white">{conversation.unreadCount}</span>
                        )}
                      </div>
                    </div>
                    <p className="mt-1 truncate text-[11px] font-semibold text-slate-400">{getMessagePreview(lastMessage)}</p>
                  </div>
                </a>
              )
            })}
            {!!conversations.length && !!availableMembers.length && (
              <p className="px-1 pt-2 text-[10px] font-black uppercase tracking-wider text-slate-400">Available Members</p>
            )}
            {availableMembers.map((member) => (
              <a key={member._id} href={`${window.location.pathname}?recipient=${member._id}`} className={`flex items-center gap-2 rounded-xl border border-slate-200 p-3 ${recipient === member._id ? 'bg-white' : 'bg-slate-50 hover:bg-white'}`}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-[#0d4697]">{getInitial(member)}</span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-extrabold text-slate-800">{member.name}</p>
                  <p className="mt-0.5 truncate text-[10px] font-semibold text-slate-400">{getMemberMetaLine(member)}</p>
                </div>
              </a>
            ))}
            {!directMembers.length && <p className="rounded-xl border border-dashed border-slate-200 p-3 text-xs font-semibold text-slate-400">No conversations yet.</p>}
          </div>
        </div>
      </aside>

      <main className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] bg-white">
        <header className="flex shrink-0 items-center justify-between border-b border-slate-100 p-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-extrabold text-slate-800">{conversationTitle}</h4>
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
          </div>
          <span className="text-[10px] font-bold text-slate-400">Persisted messages</span>
        </header>

        <section className="min-h-0 space-y-4 overflow-y-auto p-4">
          {messages.map((msg) => {
            const isMine = String(msg.sender?._id || msg.sender) === String(user?._id)

            return (
              <div key={msg._id} className={`flex items-start gap-2.5 ${isMine ? 'ml-auto max-w-[85%] flex-row-reverse' : 'mr-auto max-w-[85%]'}`}>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isMine ? 'bg-blue-100 text-[#0d4697]' : 'bg-slate-100 text-slate-700'}`}>
                  {getInitial(msg.sender)}
                </span>
                <div className={`rounded-2xl px-4 py-2.5 ${isMine ? 'bg-[#0d4697] !text-white' : 'bg-slate-100 text-slate-700'}`} style={isMine ? { backgroundColor: '#0d4697', color: '#ffffff' } : undefined}>
                  {!isMine && <p className="mb-1 text-[10px] font-black leading-none text-slate-900">{msg.sender?.name || 'Member'}</p>}
                  {msg.content && <p className={`text-xs font-semibold leading-normal ${isMine ? '!text-white' : 'text-slate-700'}`} style={isMine ? { color: '#ffffff' } : undefined}>{msg.content}</p>}
                  {!!msg.attachments?.length && (
                    <div className="mt-2 grid gap-2">
                      {msg.attachments.map((item, index) => (
                        item.mediaType === 'image'
                          ? <img key={`${item.url}-${index}`} src={item.url} alt={item.name || 'Attachment'} className="max-h-44 rounded-lg border border-white object-cover" />
                          : <a key={`${item.url}-${index}`} href={item.url} target="_blank" rel="noreferrer" className={`text-xs font-bold ${isMine ? '!text-blue-100' : 'text-[#0d4697]'}`} style={isMine ? { color: '#dbeafe' } : undefined}>{item.name || 'Document'}</a>
                      ))}
                    </div>
                  )}
                  <div className={`mt-1 flex items-center justify-end gap-1 text-[9px] font-bold ${isMine ? '!text-blue-100' : 'text-slate-400'}`} style={isMine ? { color: '#dbeafe' } : undefined}>
                    <span style={isMine ? { color: '#dbeafe' } : undefined}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isMine && <CheckCheck className="h-3 w-3 text-white" />}
                  </div>
                </div>
              </div>
            )
          })}
          {!messages.length && (
            <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
              <p className="text-sm font-semibold text-slate-400">{recipient ? 'No direct messages yet.' : 'No chapter lobby messages yet.'}</p>
              {recipient && <p className="mt-2 text-xs font-bold text-slate-400">Start a conversation with {selectedMember?.name || 'this member'}.</p>}
            </div>
          )}
          <div ref={messagesEndRef} />
        </section>

        <div className="shrink-0 border-t border-slate-100 bg-white shadow-[0_-8px_20px_rgba(15,23,42,0.04)]">
          {!!attachments.length && (
            <div className="flex max-h-20 flex-wrap gap-2 overflow-y-auto px-3 py-2">
              {attachments.map((file, index) => (
                <span key={`${file.name}-${index}`} className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#0d4697]">
                  <Image className="h-3.5 w-3.5" />
                  {file.name}
                  <button type="button" onClick={() => setAttachments((current) => current.filter((_, i) => i !== index))} aria-label="Remove attachment">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-end gap-2 p-3">
            <label className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-slate-400 hover:bg-slate-50">
              <Paperclip className="h-4.5 w-4.5" />
              <input type="file" multiple onChange={handleFiles} className="hidden" />
            </label>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleComposerKeyDown}
              placeholder={recipient ? 'Type a message...' : 'Type a message to chapter lobby...'}
              rows={1}
              className="max-h-28 min-h-9 w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-900 caret-[#0d4697] outline-none placeholder:text-slate-400 focus:border-[#0d4697] focus:ring-1 focus:ring-blue-100"
            />

            <button
              type="submit"
              disabled={sending || (!text.trim() && !attachments.length)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#0d4697] text-white transition hover:bg-blue-800 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
