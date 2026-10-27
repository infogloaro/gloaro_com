import { previewCopy } from './previewCopy'

// A miniature website for a theme that has no screenshot yet: nav, hero,
// call to action and a content row, built from the theme's name, the
// business's copy and accent, and the theme's photo as imagery. Sized in em
// against the container width (1em = 1/120 of it), so it stays sharp at any
// card size. Layout varies by `variant` so sibling themes look distinct.

const PRICES = ['₹499', '₹1,299', '₹899', '₹2,450']

const SERIF = 'Georgia, "Times New Roman", serif'

function Logo({ name, accent, light }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8em', fontWeight: 800, fontSize: '1.9em', color: light ? '#fff' : '#0f172a', whiteSpace: 'nowrap' }}>
      <span style={{ flexShrink: 0, width: '0.9em', height: '0.9em', borderRadius: '0.25em', background: accent, transform: 'rotate(45deg)' }} />
      {name}
    </div>
  )
}

function Nav({ name, accent, copy, light, cta = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6em', height: '9em', borderBottom: light ? '1px solid rgba(255,255,255,0.15)' : '1px solid #eef0f4' }}>
      <Logo name={name} accent={accent} light={light} />
      <div style={{ display: 'flex', gap: '3em', fontSize: '1.5em', fontWeight: 600, color: light ? 'rgba(255,255,255,0.85)' : '#475569' }}>
        {copy.nav.map((label) => <span key={label}>{label}</span>)}
      </div>
      {cta && <Button accent={accent} small>{copy.cta}</Button>}
    </div>
  )
}

function Button({ accent, children, small, ghost, light }) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap', borderRadius: '99em',
        padding: small ? '0.9em 1.8em' : '1.3em 2.8em', fontSize: small ? '1.35em' : '1.7em', fontWeight: 700,
        background: ghost ? 'transparent' : accent, color: ghost ? (light ? '#fff' : '#0f172a') : '#fff',
        border: ghost ? `0.12em solid ${light ? 'rgba(255,255,255,0.6)' : '#cbd5e1'}` : '0.12em solid transparent',
      }}
    >
      {children}
    </span>
  )
}

const Photo = ({ src, style, position = 'center' }) => (
  <div style={{ backgroundColor: '#cbd5e1', backgroundImage: src ? `url(${src})` : undefined, backgroundSize: 'cover', backgroundPosition: position, ...style }} />
)

const Lines = ({ widths, color = '#cbd5e1', gap = '1.1em', height = '1.1em' }) => (
  <div style={{ display: 'grid', gap }}>
    {widths.map((w, i) => <span key={i} style={{ display: 'block', width: w, height, borderRadius: '99em', background: color }} />)}
  </div>
)

// Split hero: copy left, rounded photo right, stats row.
function Split({ name, tagline, accent, photo, copy }) {
  return (
    <div style={{ background: '#fff', height: '100%' }}>
      <Nav name={name} accent={accent} copy={copy} />
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: '5em', padding: '7em 6em 0' }}>
        <div>
          <p style={{ fontSize: '1.3em', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: accent }}>{copy.items[0]} · {copy.items[1]}</p>
          <div style={{ marginTop: '0.4em', fontSize: '5.4em', lineHeight: 1.05, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>{tagline}</div>
          <div style={{ marginTop: '2.4em' }}><Lines widths={['90%', '70%']} /></div>
          <div style={{ display: 'flex', gap: '1.4em', marginTop: '3.2em' }}>
            <Button accent={accent}>{copy.cta}</Button>
            <Button ghost>Learn more</Button>
          </div>
        </div>
        <Photo src={photo} style={{ height: '46em', borderRadius: '2.4em' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2em', padding: '5em 6em 0' }}>
        {copy.items.map((label) => (
          <div key={label} style={{ borderTop: `0.25em solid ${accent}`, paddingTop: '1.2em' }}>
            <p style={{ fontSize: '1.6em', fontWeight: 700, color: '#0f172a' }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Full-bleed photo hero with centred copy, then a row of cards.
function FullBleed({ name, tagline, accent, photo, copy }) {
  return (
    <div style={{ background: '#0b1220', height: '100%' }}>
      <div style={{ position: 'relative', height: '62em' }}>
        <Photo src={photo} style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,10,20,0.55), rgba(5,10,20,0.75))' }} />
        <div style={{ position: 'relative' }}>
          <Nav name={name} accent={accent} copy={copy} light cta={false} />
          <div style={{ textAlign: 'center', padding: '9em 12em 0' }}>
            <div style={{ fontSize: '5.6em', lineHeight: 1.05, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{tagline}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.4em', marginTop: '3.6em' }}>
              <Button accent={accent}>{copy.cta}</Button>
              <Button ghost light>View {copy.nav[0].toLowerCase()}</Button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.4em', padding: '4em 6em 0' }}>
        {copy.items.slice(0, 3).map((label) => (
          <div key={label} style={{ background: '#fff', borderRadius: '1.8em', padding: '2.2em' }}>
            <span style={{ display: 'block', width: '3.4em', height: '3.4em', borderRadius: '1em', background: `${accent}22` }} />
            <p style={{ marginTop: '1.2em', fontSize: '1.8em', fontWeight: 700, color: '#0f172a' }}>{label}</p>
            <div style={{ marginTop: '1em' }}><Lines widths={['85%']} color="#e2e8f0" /></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Editorial: serif headline, wide photo band, three columns.
function Editorial({ name, tagline, accent, photo, copy }) {
  return (
    <div style={{ background: '#f8f4ec', height: '100%' }}>
      <Nav name={name} accent={accent} copy={copy} />
      <div style={{ padding: '6em 6em 0', display: 'grid', gridTemplateColumns: '1.4fr 1fr', alignItems: 'end', gap: '4em' }}>
        <div style={{ fontFamily: SERIF, fontSize: '6em', lineHeight: 1.02, fontWeight: 400, color: '#1c1917' }}>{tagline}</div>
        <div>
          <Lines widths={['100%', '80%', '60%']} color="#d6cfc2" />
          <div style={{ marginTop: '2.4em' }}><Button accent="#1c1917">{copy.cta}</Button></div>
        </div>
      </div>
      <Photo src={photo} style={{ height: '30em', margin: '5em 6em 0', borderRadius: '1.6em' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3em', padding: '3.4em 6em 0' }}>
        {copy.items.slice(0, 3).map((label, i) => (
          <div key={label}>
            <p style={{ fontSize: '1.3em', fontWeight: 800, color: accent }}>0{i + 1}</p>
            <p style={{ fontFamily: SERIF, fontSize: '2em', color: '#1c1917' }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Shop: promo banner, then a grid of product tiles cut from the photo.
function Shop({ name, tagline, accent, photo, copy }) {
  const crops = ['20% 30%', '75% 40%', '40% 80%', '85% 85%']
  return (
    <div style={{ background: '#fff', height: '100%' }}>
      <Nav name={name} accent={accent} copy={copy} />
      <div style={{ margin: '4em 6em 0', borderRadius: '2.2em', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', height: '30em', background: accent }}>
        <div style={{ padding: '4.4em', color: '#fff' }}>
          <p style={{ color: 'inherit', fontSize: '1.3em', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.85 }}>New season</p>
          <div style={{ marginTop: '0.4em', fontSize: '4em', lineHeight: 1.08, fontWeight: 800 }}>{tagline}</div>
          <div style={{ marginTop: '2.4em' }}>
            <span style={{ display: 'inline-block', borderRadius: '99em', background: '#fff', color: '#0f172a', padding: '1.1em 2.4em', fontSize: '1.5em', fontWeight: 700 }}>{copy.cta}</span>
          </div>
        </div>
        <Photo src={photo} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2.2em', padding: '4em 6em 0' }}>
        {copy.items.map((label, i) => (
          <div key={label}>
            <Photo src={photo} position={crops[i]} style={{ height: '17em', borderRadius: '1.4em', backgroundSize: '260%' }} />
            <p style={{ marginTop: '1em', fontSize: '1.6em', fontWeight: 700, color: '#0f172a' }}>{label}</p>
            <p style={{ fontSize: '1.4em', fontWeight: 700, color: accent }}>{PRICES[i]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Software products: an app dashboard with sidebar, KPI cards and a chart.
function Dashboard({ name, accent, copy }) {
  const bars = [38, 55, 46, 70, 62, 84, 76, 92, 68, 88]
  return (
    <div style={{ background: '#f1f5f9', height: '100%', display: 'grid', gridTemplateColumns: '24em 1fr' }}>
      <div style={{ background: '#0f172a', padding: '4em 3em' }}>
        <Logo name={name} accent={accent} light />
        <div style={{ marginTop: '4em', display: 'grid', gap: '1.2em' }}>
          {['Dashboard', ...copy.items, 'Settings'].map((label, i) => (
            <div key={label} style={{ padding: '1em 1.4em', borderRadius: '1em', fontSize: '1.5em', fontWeight: 600, color: i === 0 ? '#fff' : 'rgba(255,255,255,0.6)', background: i === 0 ? accent : 'transparent' }}>{label}</div>
          ))}
        </div>
      </div>
      <div style={{ padding: '4em' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '2.6em', fontWeight: 800, color: '#0f172a' }}>Good morning</p>
          <Button accent={accent} small>{copy.cta}</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2em', marginTop: '3em' }}>
          {[['Revenue', '₹8.4L'], [copy.items[0], '1,284'], ['Growth', '+18%']].map(([label, value]) => (
            <div key={label} style={{ background: '#fff', borderRadius: '1.6em', padding: '2.2em' }}>
              <p style={{ fontSize: '1.4em', fontWeight: 600, color: '#64748b' }}>{label}</p>
              <p style={{ marginTop: '0.3em', fontSize: '3em', fontWeight: 800, color: '#0f172a' }}>{value}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '2.4em', background: '#fff', borderRadius: '1.6em', padding: '3em', height: '40em', display: 'flex', alignItems: 'flex-end', gap: '1.6em' }}>
          {bars.map((h, i) => <span key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '0.8em 0.8em 0 0', background: i === 7 ? accent : `${accent}40` }} />)}
        </div>
      </div>
    </div>
  )
}

const LAYOUTS = [Split, FullBleed, Editorial, Shop]

export default function ThemePreview({ business, theme, variant = 0, className = '' }) {
  const software = business.kind === 'software'
  const copy = previewCopy(business.id)
  const Layout = software ? Dashboard : LAYOUTS[variant % LAYOUTS.length]
  return (
    <div aria-hidden="true" className={`pointer-events-none select-none overflow-hidden text-left [container-type:inline-size] ${className}`}>
      <div style={{ fontSize: 'calc(100cqw / 120)', width: '120em', height: '100%', fontFamily: '"Work Sans", system-ui, sans-serif' }}>
        <Layout name={theme.name} tagline={business.tagline} accent={business.accent} photo={theme.photo} copy={copy} />
      </div>
    </div>
  )
}
