import { useCallback, useEffect, useRef, useState } from 'react'
import './bolnaVoiceCall.css'

// "Talk to AI Voice" button above the robot. The Bolna SDK is loaded on the
// first click, and it gets its session from our own /api/bolna-session route
// (the Bolna key and agent id never reach the browser).
const ERROR_TEXT = {
  microphone_denied: 'Microphone blocked. Allow it in your browser settings and try again.',
  at_capacity: 'All voice lines are busy right now. Please try again shortly.',
  autoplay_blocked: 'Tap the button again to enable sound.',
}

function MicIcon({ size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v4" />
    </svg>
  )
}

function MuteIcon({ muted }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v4" />
      {muted && <path d="M3 3l18 18" />}
    </svg>
  )
}

function HangUpIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 9c-3.2 0-6.2.9-8.4 2.6a1.5 1.5 0 0 0-.2 2.2l1.3 1.5c.5.5 1.2.6 1.8.2l2.2-1.4c.4-.3.7-.7.7-1.2V11.6c1.2-.4 2.6-.4 3.8 0v.8c0 .5.3.9.7 1.2l2.2 1.4c.6.4 1.3.3 1.8-.2l1.3-1.5a1.5 1.5 0 0 0-.2-2.2C18.200 9.900 15.200 9 12 9z" />
    </svg>
  )
}

export default function BolnaVoiceCall() {
  const callRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | connecting | live
  const [muted, setMuted] = useState(false)
  const [error, setError] = useState('')

  const hangUp = useCallback(() => {
    try {
      callRef.current?.stop()
    } catch {
      /* already ended */
    }
  }, [])

  // Hang up if the visitor leaves the page's React tree.
  useEffect(() => () => callRef.current?.stop?.(), [])

  const start = async () => {
    if (status !== 'idle') return
    setError('')
    setStatus('connecting')
    try {
      if (!callRef.current) {
        const { BolnaWebCall } = await import('@bolna/web-call')
        const call = new BolnaWebCall({ sessionUrl: '/api/bolna-session' })
        call.on('call-start', () => setStatus('live'))
        call.on('call-end', () => {
          setStatus('idle')
          setMuted(false)
        })
        call.on('error', (e) => {
          setError((e?.code === 'at_capacity' && e?.scope === 'not_enabled' ? 'Voice calls are not enabled yet.' : ERROR_TEXT[e?.code]) || 'We could not start the voice call. Please try again.')
          setStatus('idle')
          setMuted(false)
        })
        callRef.current = call
      }
      await callRef.current.start()
    } catch (e) {
      const denied = e?.name === 'NotAllowedError' || e?.code === 'microphone_denied'
      setError(denied ? ERROR_TEXT.microphone_denied : 'We could not start the voice call. Please try again.')
      setStatus('idle')
    }
  }

  const toggleMute = () => {
    const call = callRef.current
    if (!call) return
    const next = !muted
    try {
      if (typeof call.setMuted === 'function') call.setMuted(next)
      else if (next && typeof call.mute === 'function') call.mute()
      else if (!next && typeof call.unmute === 'function') call.unmute()
      else return
      setMuted(next)
    } catch {
      /* mute unsupported by this SDK build */
    }
  }

  return (
    <div className="gloaro-voice-root" data-status={status}>
      {error && (
        <p className="gloaro-voice-error" role="alert">
          {error}
        </p>
      )}
      {status === 'live' ? (
        <div className="gloaro-voice-live" role="group" aria-label="Voice call controls">
          <span className="gloaro-voice-wave" aria-hidden="true">
            <i /><i /><i /><i />
          </span>
          <span className="gloaro-voice-live-text">{muted ? 'Muted' : 'Connected'}</span>
          <button type="button" className="gloaro-voice-ctl" onClick={toggleMute} aria-pressed={muted} aria-label={muted ? 'Unmute microphone' : 'Mute microphone'}>
            <MuteIcon muted={muted} />
          </button>
          <button type="button" className="gloaro-voice-ctl gloaro-voice-ctl--end" onClick={hangUp} aria-label="End call">
            <HangUpIcon />
          </button>
        </div>
      ) : (
        <button type="button" className="gloaro-voice-btn" onClick={start} disabled={status === 'connecting'} aria-label="Talk to GLOARO AI by voice">
          <span className="gloaro-voice-icon">
            <MicIcon />
          </span>
          <span>{status === 'connecting' ? 'Connecting…' : 'Talk to AI Voice'}</span>
        </button>
      )}
    </div>
  )
}
