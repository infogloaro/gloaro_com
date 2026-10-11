// Franchise scroll story "Build your business" (storyboard frames F1–F6).
const GOLD = '#F5A900'
const MUTED = '#B8C5D9'
const label = { fontFamily: 'Work Sans, sans-serif', fontWeight: 600 }
const heading = { fontFamily: 'Outfit, sans-serif', fontWeight: 600 }

const cols = [16, 136, 256, 376, 496]
const rows = [[8, 58], [94, 92], [214, 92], [334, 58]]
const OFFICE = { col: 2, row: 1 }

const customers = [
  { name: 'School', x: 60, y: 258, screen: [26, 300] },
  { name: 'Clinic', x: 540, y: 138, screen: [506, 180] },
  { name: 'Shop', x: 420, y: 258, screen: [386, 300] },
]

const journey = ['Explore', 'Apply', 'Review', 'Discuss', 'Agreement*', 'Onboard', 'Launch']

function CustomerIcon({ name, stroke }) {
  if (name === 'School') {
    return (
      <g fill="none" stroke={stroke} strokeWidth="3" strokeLinejoin="round">
        <path d="M38 278 V252 L60 238 L82 252 V278 Z" />
        <rect x="54" y="262" width="12" height="16" />
        <path d="M60 238 V226 L72 230 L60 234" />
      </g>
    )
  }
  if (name === 'Clinic') {
    return (
      <g fill="none" stroke={stroke} strokeWidth="3" strokeLinejoin="round">
        <rect x="518" y="118" width="44" height="40" rx="5" />
        <path d="M540 126 V150 M528 138 H552" />
      </g>
    )
  }
  return (
    <g fill="none" stroke={stroke} strokeWidth="3" strokeLinejoin="round">
      <path d="M398 250 L402 238 H438 L442 250 Z" />
      <rect x="400" y="250" width="40" height="28" />
      <rect x="414" y="262" width="12" height="16" />
    </g>
  )
}

export default function FranchiseScene() {
  const officeX = cols[OFFICE.col]
  const [officeY, officeH] = rows[OFFICE.row]
  return (
    <svg viewBox="0 0 600 400" className="h-full w-full" role="img" aria-label="Animated illustration of a GLOARO franchise office working with GLOARO HQ and local customers">
      <rect width="600" height="400" fill="#061A3A" />
      <g data-s="world">
        <g data-s="map">
          <g stroke="#0E2E63" strokeWidth="12">
            {[80, 200, 320].map((y) => <line key={y} x1="0" y1={y} x2="600" y2={y} />)}
            {[120, 240, 360, 480].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="400" />)}
          </g>
          <g fill="#0B2451">
            {rows.flatMap(([y, h], r) => cols.map((x, c) => (
              r === OFFICE.row && c === OFFICE.col ? null : <rect key={`${r}-${c}`} x={x} y={y} width="88" height={h} rx="6" />
            )))}
          </g>
          <rect x={officeX} y={officeY} width="88" height={officeH} rx="6" fill="#123368" stroke={GOLD} strokeWidth="2.5" />
        </g>

        <ellipse data-s="ripple" cx="300" cy="154" rx="54" ry="13" fill="none" stroke={GOLD} strokeOpacity="0.35" strokeWidth="2" />
        <ellipse data-s="ripple" cx="300" cy="154" rx="30" ry="8" fill="none" stroke={GOLD} strokeOpacity="0.75" strokeWidth="2" />

        {/* Products docked inside the office (they fly in from HQ in step 2). */}
        {['School', 'Hospital', 'CRM'].map((name, index) => (
          <g key={name} data-s="prod">
            <rect x={262 + index * 26} y="104" width="24" height="18" rx="2.5" fill="#F7F9FC" />
            <rect x={262 + index * 26} y="104" width="24" height="5" rx="2" fill="#1558B0" />
            <text x={274 + index * 26} y="119" textAnchor="middle" fontSize="5" fill="#14213D" style={label}>{name}</text>
          </g>
        ))}

        <path data-s="pin" d="M300 152 C 288 134 279 124 279 110 A 21 21 0 1 1 321 110 C 321 124 312 134 300 152 Z" fill={GOLD} />
        <circle data-s="pin" cx="300" cy="110" r="7" fill="#061A3A" />

        <g data-s="officeLabel">
          <rect x="226" y="188" width="148" height="28" rx="14" fill={GOLD} />
          <text x="300" y="207" textAnchor="middle" fontSize="15" fill="#061A3A" style={heading}>Your GLOARO office</text>
        </g>

        <g data-s="hq">
          <rect x="20" y="16" width="156" height="56" rx="12" fill="#0B2A5B" stroke="#1558B0" strokeWidth="2" />
          <text x="98" y="42" textAnchor="middle" fontSize="17" fill="#FFFFFF" style={heading}>GLOARO HQ</text>
          <text x="98" y="61" textAnchor="middle" fontSize="11" fill={MUTED} style={label}>products and tech team</text>
        </g>
        <path data-s="hqLine" d="M176 48 C 225 48 252 70 262 98" pathLength="1" strokeDasharray="1" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />

        <circle data-s="ring" cx="300" cy="140" r="150" fill="none" stroke="#1B3A70" strokeWidth="2" strokeDasharray="5 7" />
        <circle data-s="ring" cx="300" cy="140" r="90" fill="none" stroke="#1B3A70" strokeWidth="2" strokeDasharray="5 7" />

        {customers.map((customer) => (
          <g key={customer.name}>
            <circle data-s="glow" cx={customer.x} cy={customer.y} r="44" fill={GOLD} opacity="0.16" />
            <CustomerIcon name={customer.name} stroke="#3A5280" />
            <g data-s="custLit"><CustomerIcon name={customer.name} stroke={GOLD} /></g>
            <text data-s="custLabel" x={customer.x} y={customer.name === 'Clinic' ? 106 : 220} textAnchor="middle" fontSize="15" fill="#FFFFFF" style={label}>{customer.name}</text>
          </g>
        ))}

        <path data-s="deliver" d="M70 72 C 60 130 50 180 52 232" pathLength="1" strokeDasharray="1" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
        <path data-s="deliver" d="M176 30 C 330 14 470 40 528 112" pathLength="1" strokeDasharray="1" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
        <path data-s="deliver" d="M160 72 C 230 150 360 170 410 232" pathLength="1" strokeDasharray="1" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
        {customers.map((customer) => (
          <g key={customer.name} data-s="custScreen">
            <rect x={customer.screen[0]} y={customer.screen[1]} width="68" height="42" rx="5" fill="#1558B0" stroke={GOLD} strokeWidth="2" />
            <rect x={customer.screen[0] + 8} y={customer.screen[1] + 9} width="30" height="5" rx="2.5" fill="#FFFFFF" />
            <rect x={customer.screen[0] + 8} y={customer.screen[1] + 20} width="50" height="5" rx="2.5" fill="#B8D3F5" />
            <rect x={customer.screen[0] + 8} y={customer.screen[1] + 30} width="40" height="5" rx="2.5" fill="#B8D3F5" />
          </g>
        ))}

        <path data-s="loop" d="M176 26 C 270 -6 340 40 336 96" pathLength="1" strokeDasharray="1" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
        <path data-s="loop" d="M262 182 C 190 210 120 150 100 74" pathLength="1" strokeDasharray="1" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
        <circle data-s="packet" cx="270" cy="20" r="7" fill={GOLD} />
        <circle data-s="packet" cx="160" cy="176" r="7" fill={GOLD} />
        <g data-s="support">
          <rect x="356" y="18" width="226" height="30" rx="15" fill="#FFF4D6" />
          <text x="469" y="38" textAnchor="middle" fontSize="12" fill="#6B4200" style={label}>Support scope: pending approval</text>
        </g>
      </g>

      <g data-s="journey">
        <rect x="30" y="236" width="540" height="140" rx="18" fill="#0B2451" stroke="#1B3A70" />
        <text x="52" y="266" fontSize="15" fill="#FFFFFF" style={heading}>Your journey to launch</text>
        <line x1="70" y1="312" x2="530" y2="312" stroke="#3A5280" strokeWidth="5" strokeLinecap="round" />
        <line data-s="journeyFill" x1="70" y1="312" x2="530" y2="312" stroke={GOLD} strokeWidth="5" strokeLinecap="round" />
        {journey.map((name, index) => {
          const x = 70 + index * (460 / 6)
          return (
            <g key={name}>
              <circle cx={x} cy="312" r="11" fill="#061A3A" stroke="#3A5280" strokeWidth="2" />
              <circle data-s="jdot" cx={x} cy="312" r="11" fill={GOLD} />
              <text x={x} y="346" textAnchor="middle" fontSize="12" fill="#FFFFFF" style={label}>{name}</text>
            </g>
          )
        })}
        <text x="52" y="366" fontSize="10" fill={MUTED} style={label}>*Agreement only if approved</text>
      </g>
    </svg>
  )
}
