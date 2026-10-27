import { previewCopy } from './previewCopy'

// A miniature mobile app screen for an app template: status bar, app header,
// content built from the business's copy, the app's photo and accent, and a tab
// bar. Sized in em against the container width (1em = 1/40 of it). `variant`
// picks one of five layouts so neighbouring apps look distinct.

const PRICES = ['₹249', '₹499', '₹1,199', '₹799']
const TIMES = ['10:30 AM', '12:00 PM', '4:15 PM', '6:45 PM']
// Businesses whose tracker follows a delivery rather than an appointment.
const DELIVERS = new Set(['food', 'retail', 'pos', 'logistics', 'pharmacy', 'jewellery'])

const Photo = ({ src, style, position = 'center', size = 'cover' }) => (
  <div style={{ backgroundColor: '#cbd5e1', backgroundImage: src ? `url(${src})` : undefined, backgroundSize: size, backgroundPosition: position, ...style }} />
)

function StatusBar({ light }) {
  const color = light ? '#fff' : '#0f172a'
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.6em 2.6em 0', fontSize: '1.3em', fontWeight: 700, color }}>
      <span>9:41</span>
      <span style={{ display: 'flex', gap: '0.3em', alignItems: 'flex-end' }}>
        {[0.5, 0.7, 0.9, 1.1].map((h) => <span key={h} style={{ width: '0.25em', height: `${h}em`, borderRadius: '0.1em', background: color }} />)}
        <span style={{ marginLeft: '0.4em', width: '1.9em', height: '0.95em', borderRadius: '0.25em', border: `0.1em solid ${color}`, padding: '0.1em' }}>
          <span style={{ display: 'block', width: '75%', height: '100%', borderRadius: '0.1em', background: color }} />
        </span>
      </span>
    </div>
  )
}

function TabBar({ accent, labels }) {
  return (
    <div style={{ position: 'absolute', insetInline: 0, bottom: 0, display: 'flex', justifyContent: 'space-around', padding: '1.4em 1em 2.6em', background: '#fff', borderTop: '0.1em solid #eef0f4' }}>
      {labels.map((label, i) => (
        <div key={label} style={{ display: 'grid', justifyItems: 'center', gap: '0.4em' }}>
          <span style={{ width: '2em', height: '2em', borderRadius: '0.6em', background: i === 0 ? accent : '#cbd5e1' }} />
          <span style={{ fontSize: '1em', fontWeight: 700, color: i === 0 ? accent : '#94a3b8' }}>{label}</span>
        </div>
      ))}
    </div>
  )
}

const Title = ({ children, style }) => <p style={{ fontSize: '1.7em', fontWeight: 800, color: '#0f172a', ...style }}>{children}</p>

// Home feed: greeting, search, photo promo card, quick actions, a list.
function Feed({ app, copy }) {
  const { accent, thumb, name } = app
  return (
    <div style={{ background: '#f6f7fb', height: '100%', position: 'relative' }}>
      <StatusBar />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2em 2.6em 0' }}>
        <div>
          <p style={{ fontSize: '1.2em', fontWeight: 600, color: '#64748b' }}>Hello, Priya</p>
          <Title style={{ fontSize: '2.2em' }}>{name.replace(/ App$/, '')}</Title>
        </div>
        <span style={{ width: '3.6em', height: '3.6em', borderRadius: '50%', background: `${accent}33`, border: `0.2em solid ${accent}` }} />
      </div>
      <div style={{ margin: '1.8em 2.6em 0', padding: '1.2em 1.6em', borderRadius: '1.4em', background: '#fff', fontSize: '1.25em', color: '#94a3b8', fontWeight: 600 }}>Search {copy.items[0].toLowerCase()}…</div>
      <div style={{ position: 'relative', margin: '1.8em 2.6em 0', height: '15em', borderRadius: '1.8em', overflow: 'hidden' }}>
        <Photo src={thumb} style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.65), rgba(0,0,0,0))' }} />
        <div style={{ position: 'absolute', left: '1.8em', bottom: '1.6em', color: '#fff' }}>
          <p style={{ color: 'inherit', fontSize: '1.1em', fontWeight: 700, opacity: 0.85 }}>Today only</p>
          <p style={{ color: 'inherit', fontSize: '1.9em', fontWeight: 800, lineHeight: 1.1 }}>20% off<br />{copy.items[1]}</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1em', padding: '2em 2.6em 0' }}>
        {copy.items.map((label) => (
          <div key={label} style={{ display: 'grid', justifyItems: 'center', gap: '0.5em' }}>
            <span style={{ width: '4.4em', height: '4.4em', borderRadius: '1.3em', background: `${accent}22`, border: `0.15em solid ${accent}55` }} />
            <span style={{ fontSize: '1em', fontWeight: 700, color: '#334155', whiteSpace: 'nowrap' }}>{label.length > 9 ? `${label.slice(0, 8)}…` : label}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: '2.2em 2.6em 0' }}>
        <Title>Popular</Title>
        {copy.items.slice(0, 2).map((label, i) => (
          <div key={label} style={{ display: 'flex', gap: '1.2em', alignItems: 'center', marginTop: '1.2em', padding: '1em', borderRadius: '1.4em', background: '#fff' }}>
            <Photo src={thumb} position={i ? '80% 70%' : '20% 30%'} size="300%" style={{ width: '5em', height: '5em', borderRadius: '1em', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '1.35em', fontWeight: 700, color: '#0f172a' }}>{label}</p>
              <p style={{ fontSize: '1.15em', fontWeight: 700, color: accent }}>{PRICES[i]}</p>
            </div>
          </div>
        ))}
      </div>
      <TabBar accent={accent} labels={['Home', 'Explore', 'Orders', 'Profile']} />
    </div>
  )
}

// Booking: full-bleed photo header, a raised card with slots and a CTA.
function Booking({ app, copy }) {
  const { accent, thumb, name } = app
  return (
    <div style={{ background: '#fff', height: '100%', position: 'relative' }}>
      <div style={{ position: 'relative', height: '30em' }}>
        <Photo src={thumb} style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.55))' }} />
        <div style={{ position: 'relative' }}><StatusBar light /></div>
        <div style={{ position: 'absolute', left: '2.6em', bottom: '4em', color: '#fff' }}>
          <p style={{ color: 'inherit', fontSize: '1.2em', fontWeight: 700, opacity: 0.85 }}>{copy.nav[0]}</p>
          <p style={{ color: 'inherit', fontSize: '2.4em', fontWeight: 800 }}>{name.replace(/ App$/, '')}</p>
        </div>
      </div>
      <div style={{ position: 'relative', marginTop: '-2.6em', borderRadius: '2.6em 2.6em 0 0', background: '#fff', padding: '2.6em' }}>
        <Title>Choose a service</Title>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8em', marginTop: '1.2em' }}>
          {copy.items.map((label, i) => (
            <span key={label} style={{ padding: '0.7em 1.3em', borderRadius: '99em', fontSize: '1.15em', fontWeight: 700, background: i === 0 ? accent : '#f1f5f9', color: i === 0 ? '#fff' : '#334155' }}>{label}</span>
          ))}
        </div>
        <Title style={{ marginTop: '2em' }}>Pick a time</Title>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.9em', marginTop: '1.2em' }}>
          {TIMES.map((time, i) => (
            <span key={time} style={{ padding: '1em 0', textAlign: 'center', borderRadius: '1.1em', fontSize: '1.2em', fontWeight: 700, border: `0.15em solid ${i === 1 ? accent : '#e2e8f0'}`, color: i === 1 ? accent : '#475569', background: i === 1 ? `${accent}12` : '#fff' }}>{time}</span>
          ))}
        </div>
        <div style={{ marginTop: '2.2em', padding: '1.3em', borderRadius: '99em', textAlign: 'center', background: accent, color: '#fff', fontSize: '1.4em', fontWeight: 800 }}>{copy.cta}</div>
      </div>
    </div>
  )
}

// Catalogue: header with tabs, a 2-column grid of photo tiles, cart bar.
function Catalogue({ app, copy }) {
  const { accent, thumb, name } = app
  const crops = ['15% 25%', '85% 30%', '25% 85%', '80% 80%']
  return (
    <div style={{ background: '#fff', height: '100%', position: 'relative' }}>
      <div style={{ background: accent, paddingBottom: '1.8em' }}>
        <StatusBar light />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.8em 2.6em 0', color: '#fff' }}>
          <p style={{ color: 'inherit', fontSize: '2.1em', fontWeight: 800 }}>{name.replace(/ App$/, '')}</p>
          <span style={{ width: '2.8em', height: '2.8em', borderRadius: '0.9em', background: 'rgba(255,255,255,0.25)' }} />
        </div>
        <div style={{ display: 'flex', gap: '1.6em', padding: '1.6em 2.6em 0', fontSize: '1.2em', fontWeight: 700, color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {copy.nav.map((label, i) => <span key={label} style={i === 0 ? { color: '#fff', borderBottom: '0.15em solid #fff', paddingBottom: '0.3em' } : undefined}>{label}</span>)}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.4em', padding: '2em 2.6em 0' }}>
        {copy.items.map((label, i) => (
          <div key={label}>
            <Photo src={thumb} position={crops[i]} size="260%" style={{ height: '12em', borderRadius: '1.4em' }} />
            <p style={{ marginTop: '0.7em', fontSize: '1.3em', fontWeight: 700, color: '#0f172a' }}>{label}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.2em', fontWeight: 800, color: accent }}>{PRICES[i]}</span>
              <span style={{ width: '2.2em', height: '2.2em', borderRadius: '0.7em', background: accent, color: '#fff', display: 'grid', placeItems: 'center', fontSize: '1.3em', fontWeight: 800 }}>+</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: '2.6em', right: '2.6em', bottom: '3em', display: 'flex', justifyContent: 'space-between', padding: '1.3em 1.8em', borderRadius: '1.6em', background: '#0f172a', color: '#fff', fontSize: '1.3em', fontWeight: 700 }}>
        <span>2 items · {PRICES[1]}</span><span>View cart →</span>
      </div>
    </div>
  )
}

// Tracker: live status card with a photo, progress steps and a detail sheet.
function Tracker({ app, copy }) {
  const { accent, thumb, name } = app
  const steps = ['Confirmed', 'In progress', 'On the way', 'Done']
  return (
    <div style={{ background: '#eef2f7', height: '100%', position: 'relative' }}>
      <StatusBar />
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2em', padding: '2em 2.6em 0' }}>
        <span style={{ width: '3em', height: '3em', borderRadius: '1em', background: '#fff', display: 'grid', placeItems: 'center', fontSize: '1.4em', fontWeight: 800, color: '#0f172a' }}>‹</span>
        <Title style={{ fontSize: '2em' }}>{name.replace(/ App$/, '')}</Title>
      </div>
      <div style={{ position: 'relative', margin: '2em 2.6em 0', height: '19em', borderRadius: '2em', overflow: 'hidden' }}>
        <Photo src={thumb} style={{ position: 'absolute', inset: 0 }} />
        <span style={{ position: 'absolute', left: '1.4em', top: '1.4em', padding: '0.5em 1.1em', borderRadius: '99em', background: '#fff', fontSize: '1.1em', fontWeight: 800, color: accent }}>● Live</span>
      </div>
      <div style={{ margin: '-3em 2.6em 0', position: 'relative', background: '#fff', borderRadius: '2em', padding: '2.2em', boxShadow: '0 1em 2.4em rgba(15,23,42,0.12)' }}>
        <p style={{ fontSize: '1.15em', fontWeight: 700, color: '#64748b' }}>{copy.items[0]} · #GL2041</p>
        <Title style={{ fontSize: '2.1em', marginTop: '0.2em' }}>{DELIVERS.has(app.industry) ? 'Arriving' : 'Starts'} in 18 min</Title>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.8em' }}>
          {steps.map((step, i) => (
            <span key={step} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
              <span style={{ width: '1.6em', height: '1.6em', borderRadius: '50%', background: i < 3 ? accent : '#e2e8f0', boxShadow: i === 2 ? `0 0 0 0.45em ${accent}33` : 'none' }} />
              {i < steps.length - 1 && <span style={{ flex: 1, height: '0.3em', background: i < 2 ? accent : '#e2e8f0' }} />}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.8em', fontSize: '0.95em', fontWeight: 700, color: '#94a3b8' }}>
          {steps.map((step) => <span key={step}>{step}</span>)}
        </div>
      </div>
      <div style={{ display: 'grid', gap: '1em', padding: '2em 2.6em 0' }}>
        {copy.items.slice(1, 3).map((label, i) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.3em 1.6em', borderRadius: '1.4em', background: '#fff' }}>
            <span style={{ fontSize: '1.3em', fontWeight: 700, color: '#0f172a' }}>{label}</span>
            <span style={{ fontSize: '1.2em', fontWeight: 800, color: accent }}>{TIMES[i + 1]}</span>
          </div>
        ))}
      </div>
      <TabBar accent={accent} labels={['Track', 'History', 'Support', 'Account']} />
    </div>
  )
}

// Membership: dark profile header with a plan card, stats and a schedule.
function Membership({ app, copy }) {
  const { accent, thumb, name } = app
  return (
    <div style={{ background: '#0f172a', height: '100%', position: 'relative', color: '#fff' }}>
      <StatusBar light />
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.4em', padding: '2.2em 2.6em 0' }}>
        <Photo src={thumb} style={{ width: '5.4em', height: '5.4em', borderRadius: '50%', border: `0.25em solid ${accent}`, flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: '1.2em', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Welcome back</p>
          <p style={{ fontSize: '2em', fontWeight: 800, color: '#fff' }}>Priya Sharma</p>
        </div>
      </div>
      <div style={{ margin: '2.2em 2.6em 0', padding: '2.2em', borderRadius: '2em', background: `linear-gradient(135deg, ${accent}, ${accent}99)` }}>
        <p style={{ fontSize: '1.1em', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>{name.replace(/ App$/, '')}</p>
        <p style={{ marginTop: '0.4em', fontSize: '2.4em', fontWeight: 800, color: '#fff' }}>Gold member</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.6em', fontSize: '1.15em', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
          <span>2,450 points</span><span>Valid till Mar</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1em', padding: '2em 2.6em 0' }}>
        {[['12', 'Visits'], ['3', 'Upcoming'], ['₹640', 'Saved']].map(([value, label]) => (
          <div key={label} style={{ padding: '1.4em 1em', borderRadius: '1.4em', background: 'rgba(255,255,255,0.07)', textAlign: 'center' }}>
            <p style={{ fontSize: '1.9em', fontWeight: 800, color: '#fff' }}>{value}</p>
            <p style={{ fontSize: '1em', fontWeight: 700, color: 'rgba(255,255,255,0.55)' }}>{label}</p>
          </div>
        ))}
      </div>
      <div style={{ padding: '2.2em 2.6em 0' }}>
        <p style={{ fontSize: '1.6em', fontWeight: 800, color: '#fff' }}>Upcoming</p>
        {copy.items.slice(0, 2).map((label, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1.2em', marginTop: '1.1em', padding: '1.2em', borderRadius: '1.4em', background: 'rgba(255,255,255,0.07)' }}>
            <span style={{ width: '3.6em', padding: '0.5em 0', borderRadius: '1em', background: '#fff', color: '#0f172a', textAlign: 'center', fontSize: '1em', fontWeight: 800, lineHeight: 1.2 }}>{12 + i * 3}<br />OCT</span>
            <div>
              <p style={{ fontSize: '1.3em', fontWeight: 700, color: '#fff' }}>{label}</p>
              <p style={{ fontSize: '1.1em', fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>{TIMES[i]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const LAYOUTS = [Feed, Booking, Catalogue, Tracker, Membership]

export default function AppPreview({ app, variant = 0, className = '' }) {
  const Layout = LAYOUTS[variant % LAYOUTS.length]
  return (
    <div aria-hidden="true" className={`pointer-events-none select-none overflow-hidden text-left [container-type:inline-size] ${className}`}>
      <div style={{ fontSize: 'calc(100cqw / 40)', width: '40em', height: '100%', fontFamily: '"Work Sans", system-ui, sans-serif' }}>
        <Layout app={app} copy={previewCopy(app.industry)} />
      </div>
    </div>
  )
}
