import { Suspense } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getPrototypeComponent } from './registry'

// Minimal, neutral chrome so every prototype keeps its own identity.
export default function PrototypeShell() {
  const { businessId, themeId } = useParams()
  const navigate = useNavigate()
  // Cached per prototype at module level, so it is not re-created between renders.
  const Prototype = getPrototypeComponent(businessId, themeId)
  const themeKey = `${businessId}/${themeId}`

  if (!Prototype) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Prototype not found</h1>
          <Link to="/">Back to GLOARO</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0b0b0c' }} />}>
        {/* eslint-disable-next-line react-hooks/static-components */}
        <Prototype />
      </Suspense>
      <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 9999, display: 'flex', gap: 8, font: '600 13px sans-serif' }}>
        <button
          type="button"
          onClick={() => ((window.history.state?.idx ?? 0) > 0 ? navigate(-1) : navigate('/', { replace: true }))}
          style={{ padding: '10px 14px', borderRadius: 999, border: 0, background: '#fff', color: '#111', font: 'inherit', cursor: 'pointer', boxShadow: '0 4px 20px #0004' }}
        >
          ← Back
        </button>
        <Link to="/" style={{ padding: '10px 14px', borderRadius: 999, background: '#fff', color: '#111', boxShadow: '0 4px 20px #0004' }}>
          GLOARO
        </Link>
        <Link
          to={`/contact?theme=${encodeURIComponent(themeKey)}`}
          style={{ padding: '10px 14px', borderRadius: 999, background: '#111', color: '#fff', boxShadow: '0 4px 20px #0004' }}
        >
          Book this theme
        </Link>
      </div>
    </>
  )
}
