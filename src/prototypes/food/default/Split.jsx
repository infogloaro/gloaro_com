/** Splits text into word and character spans for GSAP. Screen readers get the plain text. */
export function Split({ text, className = '', chars = true }) {
  const words = text.split(' ')
  return (
    <span className={className} aria-label={text} role="text">
      {words.map((w, wi) => (
        <span key={wi}>
          <span className="me-w" aria-hidden="true">
            {chars ? [...w].map((c, ci) => <span key={ci} className="me-c">{c}</span>) : w}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  )
}
