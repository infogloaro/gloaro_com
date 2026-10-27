import './bolnaVoiceCall.css'

// "Talk to AI" pill above the robot: a plain tel: link that opens the
// device's phone dialer. No SDK, no API call, no WhatsApp.
const PHONE_HREF = 'tel:+917200537071'

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v4" />
    </svg>
  )
}

export default function BolnaVoiceCall() {
  return (
    <div className="gloaro-voice-root">
      <a className="gloaro-voice-btn" href={PHONE_HREF} aria-label="Talk to AI: call +91 72005 37071">
        <span className="gloaro-voice-icon">
          <MicIcon />
        </span>
        <span>Talk to AI</span>
      </a>
    </div>
  )
}
