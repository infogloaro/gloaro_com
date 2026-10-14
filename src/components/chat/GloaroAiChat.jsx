import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import GloaroBot from './GloaroBot'
import { useCapabilities } from '../../prototypes/core/useCapabilities'
import './gloaroAiChat.css'

// Retell chat widget config. The public key is designed for browser use
// (https://docs.retellai.com/deploy/chat-widget); never put a secret key here.
const RETELL_SCRIPT_ID = 'retell-widget' // the widget reads its config from this id
const RETELL_SCRIPT_SRC = 'https://dashboard.retellai.com/retell-widget-v2.js'
const RETELL_ROOT_ID = 'retell-widget-root' // container the widget mounts itself into
const RETELL_AGENT_ID = 'agent_dd273451492112e295745d4928'
const RETELL_PUBLIC_KEY = 'public_key_ab1a6cd8f7b6ec60b3b7e' // "GLOARO AI Chatbot" key
const BOT_NAME = 'GLOARO AI Assistant'
const RETELL_BOT_NAME = 'GLOARO Assistant'
const CHAT_TITLE = 'GLOARO AI Assistant'
const MOUNT_TIMEOUT_MS = 10000

const TOPICS = ['Explore GLOARO Services', 'AI Automation Solutions', 'Website Development', 'Talk to the GLOARO Team']

// Load the official widget on demand, with documented attributes only.
// data-auto-open="true" is the supported way to open it from our own button.
function injectRetellScript(attempt) {
  const script = document.createElement('script')
  script.id = RETELL_SCRIPT_ID
  script.type = 'module'
  // A fresh URL on retry so the browser re-executes the module after a failure.
  script.src = attempt > 0 ? `${RETELL_SCRIPT_SRC}?retry=${attempt}` : RETELL_SCRIPT_SRC
  Object.entries({
    'data-public-key': RETELL_PUBLIC_KEY,
    'data-agent-id': RETELL_AGENT_ID,
    'data-title': CHAT_TITLE,
    'data-bot-name': RETELL_BOT_NAME,
    'data-fab-text': 'Chat with GLOARO',
    'data-theme-color': '#14244b',
    'data-component-color': '#1f3a7a',
    'data-show-ai-popup': 'false',
    'data-auto-open': 'true',
  }).forEach(([name, value]) => script.setAttribute(name, value))
  document.head.appendChild(script)
  return script
}

// Loaded on demand so three.js stays out of the first paint.
const GloaroBot3D = lazy(() => import('./GloaroBot3D'))

// 3D robot where the device can handle it; the SVG robot while it loads and on
// static-tier devices (no WebGL2 or reduced motion).
function BotAvatar({ hovered = false, caps, launch, onLand, framing }) {
  if (caps.tier === 'static') return <GloaroBot />
  return (
    <div className="gloaro-ai-bot3d">
      <Suspense fallback={<GloaroBot />}>
        <GloaroBot3D hovered={hovered} animate={!caps.reducedMotion} dpr={caps.dpr} launch={launch} onLand={onLand} {...framing} />
      </Suspense>
    </div>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
    </svg>
  )
}

export default function GloaroAiChat() {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  // Click → the robot jumps (launch counter) → on landing the panel bursts open.
  const [launch, setLaunch] = useState(0)
  const [boom, setBoom] = useState(false)
  const caps = useCapabilities()
  // idle → loading → ready | error. "ready" means the widget mounted on the page.
  const [status, setStatus] = useState(() =>
    typeof document !== 'undefined' && document.getElementById(RETELL_ROOT_ID) ? 'ready' : 'idle',
  )
  const attemptRef = useRef(0)
  const fabRef = useRef(null)
  const closeRef = useRef(null)
  const wasOpenRef = useRef(false)

  const close = useCallback(() => setOpen(false), [])

  const openWithBoom = useCallback(() => {
    setBoom(true)
    setOpen(true)
  }, [])

  // The boom is a one-shot entrance; clear the flag once it has played.
  useEffect(() => {
    if (!boom) return
    const timer = setTimeout(() => setBoom(false), 900)
    return () => clearTimeout(timer)
  }, [boom])

  // If the 3D robot never reports a landing (canvas hidden, tab in background),
  // open anyway so the button always works.
  useEffect(() => {
    if (!launch) return
    const timer = setTimeout(openWithBoom, 1400)
    return () => clearTimeout(timer)
  }, [launch, openWithBoom])

  const onFabClick = () => {
    if (open) return close()
    // No 3D robot to jump (static tier / reduced motion): open straight away.
    if (caps.tier === 'static' || caps.reducedMotion) return setOpen(true)
    setLaunch((value) => value + 1)
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

  // Once the script is requested, wait for the widget to actually mount itself.
  useEffect(() => {
    if (status !== 'loading') return
    let finished = false
    const finish = (next) => {
      if (finished) return
      finished = true
      observer.disconnect()
      clearTimeout(timer)
      setStatus(next)
      if (next === 'ready') setOpen(false) // reveal the Retell chat window
    }
    const observer = new MutationObserver(() => {
      if (document.getElementById(RETELL_ROOT_ID)) finish('ready')
    })
    observer.observe(document.body, { childList: true })
    const timer = setTimeout(() => finish('error'), MOUNT_TIMEOUT_MS)

    let script = document.getElementById(RETELL_SCRIPT_ID)
    if (!script) script = injectRetellScript(attemptRef.current)
    const onError = () => finish('error')
    script.addEventListener('error', onError)
    if (document.getElementById(RETELL_ROOT_ID)) finish('ready')

    return () => {
      script.removeEventListener('error', onError)
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [status])

  const startChat = () => {
    if (status === 'error') {
      // Drop the failed tag so a clean one is injected; never touches a mounted widget.
      document.getElementById(RETELL_SCRIPT_ID)?.remove()
      attemptRef.current += 1
    }
    setStatus('loading')
  }

  return (
    <div className="gloaro-ai-root">
      <button
        ref={fabRef}
        type="button"
        className="gloaro-ai-fab"
        aria-label="Chat with GLOARO AI"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="gloaro-ai-panel"
        onClick={onFabClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <BotAvatar hovered={hovered} caps={caps} launch={launch} onLand={openWithBoom} framing={{ cameraZ: 9.4, offsetY: -1.05 }} />
        <span className="gloaro-ai-burst" data-boom={boom} aria-hidden="true" />
        <span className="gloaro-ai-tooltip" aria-hidden="true">Chat with GLOARO AI</span>
      </button>

      {createPortal(
        <div className="gloaro-ai-root">
          <div className="gloaro-ai-backdrop" data-open={open} onClick={close} aria-hidden="true" />
          <aside
            id="gloaro-ai-panel"
            className="gloaro-ai-panel"
            data-open={open}
            data-boom={boom}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gloaro-ai-title"
            aria-hidden={!open}
            data-lenis-prevent
          >
            <header className="gloaro-ai-header">
              <span className="gloaro-ai-avatar">
                {open ? <BotAvatar caps={caps} /> : <GloaroBot />}
              </span>
              <div className="gloaro-ai-heading">
                <h2 id="gloaro-ai-title" className="gloaro-ai-title">{BOT_NAME}</h2>
                <p className="gloaro-ai-subtitle">Your AI-powered business assistant</p>
              </div>
              <button ref={closeRef} type="button" className="gloaro-ai-close" onClick={close} aria-label="Close chat" tabIndex={open ? 0 : -1}>
                <CloseIcon />
              </button>
            </header>

            <div className="gloaro-ai-body" aria-live="polite">
              {/* Local greeting only; it is not sent to the Retell agent. */}
              <div className="gloaro-ai-message">
                <span className="gloaro-ai-avatar gloaro-ai-avatar--small">
                  <GloaroBot />
                </span>
                <div className="gloaro-ai-bubble">
                  <p>👋 Welcome to GLOARO!</p>
                  <p>🚀I'm your AI assistant, here to help you explore our services, AI solutions, and digital innovations.</p>
                  <p>💡✨ How can I help you today?</p>
                </div>
              </div>

              <div className="gloaro-ai-topics">
                <p className="gloaro-ai-label">You can ask about</p>
                <ul className="gloaro-ai-topic-list">
                  {TOPICS.map((topic) => (
                    <li key={topic} className="gloaro-ai-topic">{topic}</li>
                  ))}
                </ul>
              </div>

              {status === 'loading' && (
                <div className="gloaro-ai-status" role="status">
                  <span className="gloaro-ai-dots" aria-hidden="true"><span /><span /><span /></span>
                  Connecting to the GLOARO AI Assistant…
                </div>
              )}
              {status === 'ready' && (
                <div className="gloaro-ai-status">
                  <strong>Your live chat runs in the GLOARO chat window.</strong> If it's closed, tap the
                  {' '}"{CHAT_TITLE}" button just above the WhatsApp icon to continue your conversation.
                </div>
              )}
              {status === 'error' && (
                <div className="gloaro-ai-status gloaro-ai-status--error" role="alert">
                  <strong>We couldn't start the AI chat right now.</strong> Please try again, or reach the
                  GLOARO team on the green WhatsApp button at the bottom of the page.
                </div>
              )}
            </div>

            <div className="gloaro-ai-footer">
              {status !== 'ready' && (
                <button type="button" className="gloaro-ai-button" onClick={startChat} disabled={status === 'loading'} tabIndex={open ? 0 : -1}>
                  <ChatIcon />
                  {status === 'error' ? 'Try again' : status === 'loading' ? 'Connecting…' : 'Start chatting'}
                </button>
              )}
              {status === 'ready' && (
                <button type="button" className="gloaro-ai-button" onClick={close} tabIndex={open ? 0 : -1}>
                  Back to the chat window
                </button>
              )}
              <p className="gloaro-ai-contact">
                <a className="gloaro-ai-link" href="mailto:info@gloaro.com" tabIndex={open ? 0 : -1}>info@gloaro.com</a>
                <a className="gloaro-ai-link" href="tel:+917200537033" tabIndex={open ? 0 : -1}>+91 72005 37033</a>
                <a className="gloaro-ai-link" href="tel:+917200073704" tabIndex={open ? 0 : -1}>+91 72000 73704</a>
              </p>
            </div>
          </aside>
        </div>,
        document.body,
      )}
    </div>
  )
}
