import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import GloaroBot from './GloaroBot'
import { useCapabilities } from '../../prototypes/core/useCapabilities'
import { createChat, describeError, sendMessage } from '../../lib/retellChat'
import './gloaroAiChat.css'

const BOT_NAME = 'GLOARO AI Assistant'
// Shown locally the moment the panel opens; it is never sent to the agent.
const WELCOME = [
  '👋 Welcome to GLOARO!',
  "🚀 I'm your AI assistant, here to help you explore our services, AI solutions, and digital innovations.",
  '💡✨ How can I help you today?',
]
const SUGGESTIONS = ['Explore GLOARO Services', 'AI Automation Solutions', 'Website Development', 'Talk to the GLOARO Team']
// One conversation per browser tab: survives close/reopen and page navigation,
// starts fresh in a new tab.
const SESSION_KEY = 'gloaro-ai-chat'

function loadSession() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY))
    if (saved && Array.isArray(saved.messages)) return saved
  } catch {
    /* no saved session */
  }
  return { chatId: null, messages: [] }
}

function saveSession(session) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    /* storage unavailable: the chat still works for this page view */
  }
}

let nextId = 0
const makeMessage = (role, content) => ({
  id: `${Date.now()}-${nextId++}`,
  role,
  content,
})

// Agent replies use light markdown (**bold**, line breaks, "- " lists).
// Rendered to React nodes, never as raw HTML.
function RichText({ text }) {
  return text.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => (part.startsWith('**') && part.endsWith('**') ? <strong key={j}>{part.slice(2, -2)}</strong> : part))
    return (
      <span key={i} className="gloaro-ai-line">
        {parts}
      </span>
    )
  })
}

// Loaded on demand so three.js stays out of the first paint.
const GloaroBot3D = lazy(() => import('./GloaroBot3D'))

// 3D robot where the device can handle it; the SVG robot while it loads and on
// static-tier devices (no WebGL2 or reduced motion).
function BotAvatar({ hovered = false, caps, wake, framing }) {
  if (caps.tier === 'static') return <GloaroBot />
  return (
    <div className="gloaro-ai-bot3d">
      <Suspense fallback={<GloaroBot />}>
        <GloaroBot3D hovered={hovered} animate={!caps.reducedMotion} dpr={caps.dpr} wake={wake} {...framing} />
      </Suspense>
    </div>
  )
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export default function GloaroAiChat() {
  // closed → opening (robot jumps) → portal (rings + panel emerges) → open → closing → closed
  const [phase, setPhase] = useState('closed')
  const open = phase === 'portal' || phase === 'open'
  const [hovered, setHovered] = useState(false)
  const [wake, setWake] = useState(0) // each increment = one wake-up reaction from the robot
  const caps = useCapabilities()
  const instant = caps.tier === 'static' || caps.reducedMotion // no wake-up, no portal
  const [session, setSession] = useState(loadSession)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null) // { text, retry: content }
  const sessionRef = useRef(session)
  const fabRef = useRef(null)
  const closeRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const wasOpenRef = useRef(false)
  const stickToBottomRef = useRef(true)

  useEffect(() => {
    if (phase === 'portal') {
      const timer = setTimeout(() => setPhase('open'), 1500) // unfold + content stagger
      return () => clearTimeout(timer)
    }
    if (phase === 'closing') {
      const timer = setTimeout(() => setPhase('closed'), instant ? 0 : 900) // fold + robot drops home
      return () => clearTimeout(timer)
    }
    if (phase === 'opening') {
      // The robot launches and flies off (~0.65s), then the hologram screen unfolds.
      const timer = setTimeout(() => setPhase(instant ? 'open' : 'portal'), instant ? 0 : 620)
      return () => clearTimeout(timer)
    }
  }, [phase, instant])

  // Closing is allowed from any visible phase, so a quick second click always works.
  const close = useCallback(() => {
    setPhase((current) => (current === 'portal' || current === 'open' ? 'closing' : current))
  }, [])

  const onFabClick = () => {
    if (phase === 'closed') {
      setPhase('opening')
      if (!instant) setWake((value) => value + 1)
    } else close()
  }

  // Escape closes; focus moves into the panel on open and back to the robot on close.
  useEffect(() => {
    if (open) {
      wasOpenRef.current = true
      closeRef.current?.focus()
      const onKey = (event) => {
        if (event.key === 'Escape') close()
      }
      document.addEventListener('keydown', onKey)
      return () => document.removeEventListener('keydown', onKey)
    }
    if (wasOpenRef.current) fabRef.current?.focus()
  }, [open, close])

  // Lock background scroll while the full-screen mobile panel is open.
  useEffect(() => {
    if (!open || !window.matchMedia('(max-width: 639px)').matches) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    sessionRef.current = session
    saveSession(session)
  }, [session])

  // Keep the newest message in view, unless the visitor has scrolled up to read.
  const scrollToBottom = useCallback((force) => {
    const list = listRef.current
    if (!list) return
    if (force || stickToBottomRef.current) list.scrollTop = list.scrollHeight
  }, [])

  const onListScroll = () => {
    const list = listRef.current
    stickToBottomRef.current = list.scrollHeight - list.scrollTop - list.clientHeight < 40
  }

  useEffect(() => {
    scrollToBottom()
  }, [session.messages, sending, error, scrollToBottom])

  useEffect(() => {
    if (!open) return
    stickToBottomRef.current = true
    // After the slide-in: jump to the latest message and ready the composer.
    const timer = setTimeout(() => {
      scrollToBottom(true)
      if (!window.matchMedia('(max-width: 639px)').matches) inputRef.current?.focus()
    }, 380)
    return () => clearTimeout(timer)
  }, [open, scrollToBottom])

  // Sends one user message to the real Retell agent. The session is created on
  // the first message, so opening the panel never starts an unused chat.
  const send = useCallback(
    async (content) => {
      const text = content.trim()
      if (!text || sending) return
      setError(null)
      setSending(true)
      stickToBottomRef.current = true
      setSession((prev) => ({
        ...prev,
        messages: [...prev.messages, makeMessage('user', text)],
      }))
      try {
        let chatId = sessionRef.current.chatId
        if (!chatId) {
          chatId = await createChat()
          setSession((prev) => ({ ...prev, chatId }))
        }
        const replies = await sendMessage(chatId, text)
        setSession((prev) => ({
          ...prev,
          messages: [...prev.messages, ...replies.map((reply) => makeMessage('agent', reply))],
        }))
      } catch (err) {
        setError({ text: describeError(err), retry: text })
        // A dead session (e.g. ended server-side) gets a fresh one on retry.
        if (err?.status === 400 || err?.status === 404) setSession((prev) => ({ ...prev, chatId: null }))
      } finally {
        setSending(false)
      }
    },
    [sending],
  )

  const submit = (event) => {
    event?.preventDefault()
    if (!draft.trim()) return
    const text = draft
    setDraft('')
    send(text)
  }

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  const retry = () => {
    const content = error?.retry
    // Drop the failed user bubble so the retry doesn't show the message twice.
    setSession((prev) => {
      const last = prev.messages[prev.messages.length - 1]
      return last?.role === 'user' && last.content === content ? { ...prev, messages: prev.messages.slice(0, -1) } : prev
    })
    send(content)
  }

  const hasConversation = session.messages.length > 0
  // Only claim "connected" once the agent has actually answered in this session.
  const status = error ? 'error' : session.chatId && session.messages.some((m) => m.role === 'agent') ? 'connected' : 'idle'

  return (
    <div className="gloaro-ai-root">
      <button
        ref={fabRef}
        type="button"
        className="gloaro-ai-fab"
        aria-label="Open GLOARO AI Assistant"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="gloaro-ai-panel"
        onClick={onFabClick}
        data-phase={phase}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <span className="gloaro-ai-energy" aria-hidden="true">
          <span className="gloaro-ai-energy-glow" />
          <span className="gloaro-ai-energy-ring" />
        </span>
        <BotAvatar hovered={hovered} caps={caps} wake={wake} framing={{ cameraZ: 8.2, offsetY: -0.6 }} />
        <span className="gloaro-ai-sweep" aria-hidden="true" />
        <span className="gloaro-ai-thruster" aria-hidden="true" />
        {/* Energy rings: keyed to the open count so the keyframes restart on every open. */}
        <span className="gloaro-ai-rings" aria-hidden="true" key={wake}>
          <span className="gloaro-ai-ring" />
          <span className="gloaro-ai-ring" />
          <span className="gloaro-ai-ring" />
          <span className="gloaro-ai-ring gloaro-ai-ring--pulse" />
        </span>
        <span className="gloaro-ai-tooltip" aria-hidden="true">
          Chat with GLOARO AI
        </span>
      </button>

      {createPortal(
        <div className="gloaro-ai-root">
          <div className="gloaro-ai-backdrop" data-phase={phase} onClick={close} aria-hidden="true" />
          <div className="gloaro-ai-stage">
            <aside
              id="gloaro-ai-panel"
              className="gloaro-ai-panel"
              data-phase={phase}
              role="dialog"
              aria-modal="true"
              aria-labelledby="gloaro-ai-title"
              aria-hidden={!open}
              data-lenis-prevent
            >
              <header className="gloaro-ai-header">
                <span className="gloaro-ai-avatar">{open ? <BotAvatar caps={caps} /> : <GloaroBot />}</span>
                <div className="gloaro-ai-heading">
                  <h2 id="gloaro-ai-title" className="gloaro-ai-title">
                    {BOT_NAME}
                  </h2>
                  <p className="gloaro-ai-subtitle">
                    {status === 'connected' && <span className="gloaro-ai-dot" aria-hidden="true" />}
                    {status === 'error' && <span className="gloaro-ai-dot gloaro-ai-dot--error" aria-hidden="true" />}
                    {status === 'connected' ? 'Connected · live assistant' : status === 'error' ? 'Connection issue' : 'Your AI-powered business assistant'}
                  </p>
                </div>
                <button ref={closeRef} type="button" className="gloaro-ai-close" onClick={close} aria-label="Close chat" tabIndex={open ? 0 : -1}>
                  <CloseIcon />
                </button>
              </header>

              <div ref={listRef} className="gloaro-ai-body" onScroll={onListScroll}>
                <div className="gloaro-ai-message">
                  <span className="gloaro-ai-avatar gloaro-ai-avatar--small">
                    <GloaroBot />
                  </span>
                  <div className="gloaro-ai-bubble">
                    {WELCOME.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>

                {!hasConversation && (
                  <div className="gloaro-ai-topics">
                    <p className="gloaro-ai-label">Try asking</p>
                    <ul className="gloaro-ai-topic-list">
                      {SUGGESTIONS.map((topic) => (
                        <li key={topic}>
                          <button type="button" className="gloaro-ai-topic" onClick={() => send(topic)} disabled={sending} tabIndex={open ? 0 : -1}>
                            {topic}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div aria-live="polite">
                  {session.messages.map((message) => (
                    <div key={message.id} className={`gloaro-ai-message gloaro-ai-message--${message.role}`}>
                      {message.role === 'agent' && (
                        <span className="gloaro-ai-avatar gloaro-ai-avatar--small">
                          <GloaroBot />
                        </span>
                      )}
                      <div className="gloaro-ai-bubble">
                        <RichText text={message.content} />
                      </div>
                    </div>
                  ))}

                  {sending && (
                    <div className="gloaro-ai-message" role="status" aria-label="GLOARO AI is typing">
                      <span className="gloaro-ai-avatar gloaro-ai-avatar--small">
                        <GloaroBot />
                      </span>
                      <div className="gloaro-ai-bubble gloaro-ai-bubble--typing">
                        <span className="gloaro-ai-dots" aria-hidden="true">
                          <span />
                          <span />
                          <span />
                        </span>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="gloaro-ai-status gloaro-ai-status--error" role="alert">
                      <strong>{error.text}</strong>
                      <span className="gloaro-ai-status-actions">
                        <button type="button" className="gloaro-ai-retry" onClick={retry} tabIndex={open ? 0 : -1}>
                          Try again
                        </button>
                        <span>or message us on WhatsApp using the green button.</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <form className="gloaro-ai-footer" onSubmit={submit}>
                <div className="gloaro-ai-composer">
                  <textarea
                    ref={inputRef}
                    className="gloaro-ai-input"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Type your message…"
                    aria-label="Your message"
                    rows={1}
                    maxLength={2000}
                    tabIndex={open ? 0 : -1}
                  />
                  <button type="submit" className="gloaro-ai-send" aria-label="Send message" disabled={sending || !draft.trim()} tabIndex={open ? 0 : -1}>
                    <SendIcon />
                  </button>
                </div>
                <p className="gloaro-ai-contact">
                  <a className="gloaro-ai-link" href="mailto:info@gloaro.com" tabIndex={open ? 0 : -1}>
                    info@gloaro.com
                  </a>
                  <a className="gloaro-ai-link" href="tel:+917200537033" tabIndex={open ? 0 : -1}>
                    +91 72005 37033
                  </a>
                  <a className="gloaro-ai-link" href="tel:+917200073704" tabIndex={open ? 0 : -1}>
                    +91 72000 73704
                  </a>
                </p>
              </form>
            </aside>
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
