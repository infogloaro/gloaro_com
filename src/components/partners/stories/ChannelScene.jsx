// Channel Partner scroll story "Introduce and we deliver" (storyboard frames C1–C6).
const NAVY = '#0B2451'
const ROYAL = '#1558B0'
const ORANGE = '#F28C00'
const GREEN = '#1B7A4A'
const label = { fontFamily: 'Work Sans, sans-serif', fontWeight: 600 }
const heading = { fontFamily: 'Outfit, sans-serif', fontWeight: 600 }

const PHONE_CENTER = [300, 180]
const contacts = [[90, 64], [120, 236], [58, 150], [176, 340], [512, 260], [470, 344], [420, 26], [178, 34], [548, 190], [486, 116]]
const TARGET = contacts[contacts.length - 1]
const trackerNodes = [[232, 'Under review'], [385, 'Discussion'], [538, 'Proposal']]

function Tick({ x, y }) {
  return <path d={`M${x - 6} ${y} L${x - 1} ${y + 5} L${x + 7} ${y - 5}`} fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
}

export default function ChannelScene() {
  return (
    <svg viewBox="0 0 600 400" className="h-full w-full" role="img" aria-label="Animated illustration of a Channel Partner introducing a business to GLOARO">
      <rect width="600" height="400" fill="#EAF2FD" />

      <g data-s="clines" stroke="#B8D3F5" strokeWidth="1.5">
        {contacts.map(([x, y]) => (
          <line key={`${x}-${y}`} x1={PHONE_CENTER[0]} y1={PHONE_CENTER[1]} x2={x} y2={y} pathLength="1" strokeDasharray="1" />
        ))}
      </g>
      {contacts.map(([x, y], index) => (
        <circle key={`${x}-${y}`} data-s="dot" cx={x} cy={y} r={7 + (index % 3) * 2} fill={ROYAL} />
      ))}
      <circle data-s="halo" cx={TARGET[0]} cy={TARGET[1]} r="30" fill={ORANGE} opacity="0.22" />
      <circle data-s="targetOn" cx={TARGET[0]} cy={TARGET[1]} r="13" fill={ORANGE} />
      <g data-s="tag">
        <rect x="390" y="40" width="196" height="38" rx="10" fill={NAVY} />
        <path d="M478 78 L486 88 L494 78 Z" fill={NAVY} />
        <text x="488" y="64" textAnchor="middle" fontSize="14" fill="#FFFFFF" style={label}>Needs school software</text>
      </g>

      <g data-s="phone">
        <rect x="250" y="70" width="100" height="220" rx="20" fill="#FFFFFF" stroke={NAVY} strokeWidth="3" />
        <rect x="282" y="80" width="36" height="6" rx="3" fill={NAVY} />
        <circle cx="300" cy="126" r="22" fill={ROYAL} />
        <text x="300" y="131" textAnchor="middle" fontSize="13" fill="#FFFFFF" style={heading}>You</text>
        <g fill="#D9E1EC">
          <rect x="264" y="162" width="72" height="9" rx="4.5" />
          <rect x="264" y="180" width="56" height="9" rx="4.5" />
          <rect x="264" y="198" width="64" height="9" rx="4.5" />
        </g>
        <circle data-s="press" cx="300" cy="252" r="30" fill="none" stroke={ROYAL} strokeWidth="2" opacity="0" />
        <g data-s="introBtn">
          <rect x="260" y="236" width="80" height="32" rx="16" fill={ROYAL} />
          <text x="300" y="257" textAnchor="middle" fontSize="13" fill="#FFFFFF" style={heading}>Introduce</text>
        </g>
      </g>

      <g data-s="gloaro">
        <rect x="420" y="30" width="164" height="60" rx="14" fill={NAVY} />
        <text x="502" y="58" textAnchor="middle" fontSize="18" fill="#FFFFFF" style={heading} letterSpacing="2">GLOARO</text>
        <text x="502" y="77" textAnchor="middle" fontSize="11" fill="#B8C5D9" style={label}>partnerships team</text>
      </g>
      <path data-s="arc" d="M160 170 C 240 60 360 70 420 120" pathLength="1" strokeDasharray="1" fill="none" stroke={ROYAL} strokeWidth="2.5" strokeLinecap="round" />
      <g data-s="card">
        <rect x="420" y="104" width="164" height="92" rx="12" fill="#FFFFFF" stroke={ROYAL} strokeWidth="2" />
        <text x="434" y="126" fontSize="10" fill="#4A5874" style={label} letterSpacing="1">OPPORTUNITY</text>
        <text x="434" y="148" fontSize="16" fill={NAVY} style={heading}>School software</text>
        <text x="434" y="167" fontSize="11" fill="#4A5874" style={label}>Example school</text>
        <text x="434" y="185" fontSize="11" fill={ROYAL} style={label}>Introduced by you</text>
      </g>

      <g data-s="tracker">
        <rect x="186" y="210" width="398" height="176" rx="18" fill="#FFFFFF" stroke="#D9E1EC" />
        <text x="208" y="242" fontSize="16" fill={NAVY} style={heading}>School software</text>
        <text x="208" y="261" fontSize="11" fill="#4A5874" style={label}>Introduced by you · example data</text>
        <rect x="466" y="228" width="100" height="24" rx="12" fill="#FFF4D6" />
        <text x="516" y="244" textAnchor="middle" fontSize="10.5" fill="#6B4200" style={label}>DEMO PREVIEW</text>
        <line x1="232" y1="304" x2="538" y2="304" stroke="#D9E1EC" strokeWidth="5" strokeLinecap="round" />
        <line data-s="tfill" x1="232" y1="304" x2="538" y2="304" stroke={ROYAL} strokeWidth="5" strokeLinecap="round" />
        {trackerNodes.map(([x, name], index) => (
          <g key={name}>
            <circle cx={x} cy="304" r="13" fill="#FFFFFF" stroke="#C3CEDD" strokeWidth="2" />
            <g data-s={`tnode${index}`}>
              <circle cx={x} cy="304" r="13" fill={index === 2 ? ROYAL : GREEN} />
              <Tick x={x} y={304} />
            </g>
            <text x={x} y="338" textAnchor="middle" fontSize="12" fill="#14213D" style={label}>{name}</text>
          </g>
        ))}
        {trackerNodes.map(([, name], index) => (
          <text key={name} data-s={`tstat${index}`} x="208" y="372" fontSize="12" fill={ROYAL} style={label}>Now: {name}</text>
        ))}
      </g>

      <g data-s="win">
        <rect x="180" y="118" width="268" height="206" rx="12" fill="#FFFFFF" stroke={NAVY} strokeWidth="2" />
        <path d="M180 130 a12 12 0 0 1 12 -12 h244 a12 12 0 0 1 12 12 v14 h-268 Z" fill={ROYAL} />
        <circle cx="196" cy="131" r="4" fill="#FFFFFF" />
        <circle cx="208" cy="131" r="4" fill="#FFFFFF" />
        <rect data-s="panel" x="192" y="156" width="58" height="156" rx="6" fill="#EAF2FD" />
        <rect data-s="panel" x="260" y="156" width="84" height="64" rx="6" fill="#D6E6FA" />
        <rect data-s="panel" x="352" y="156" width="84" height="64" rx="6" fill="#D6E6FA" />
        <rect data-s="panel" x="260" y="228" width="176" height="84" rx="6" fill={ROYAL} opacity="0.85" />
        <rect x="364" y="334" width="84" height="20" rx="10" fill="#FFF4D6" />
        <text x="406" y="348" textAnchor="middle" fontSize="9.5" fill="#6B4200" style={label}>DEMO PREVIEW</text>
      </g>
      <g data-s="customer">
        <g fill="none" stroke={NAVY} strokeWidth="3" strokeLinejoin="round">
          <path d="M486 290 V256 L520 236 L554 256 V290 Z" />
          <rect x="512" y="266" width="16" height="24" />
          <path d="M520 236 V220 L534 224 L520 228" />
        </g>
        <text x="520" y="318" textAnchor="middle" fontSize="14" fill="#14213D" style={label}>The customer</text>
      </g>
      {/* Notification sits on top of everything, over the phone after it slides left. */}
      <g data-s="notif">
        <rect x="8" y="96" width="232" height="64" rx="14" fill={NAVY} />
        <g data-s="bell" fill="none" stroke="#F5A900" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M26 124 a10 10 0 0 1 20 0 v7 l4 5 h-28 l4 -5 Z" />
          <path d="M32 141 a4 4 0 0 0 8 0" />
        </g>
        <text x="62" y="120" fontSize="11" fill="#B8C5D9" style={label} letterSpacing="1">GLOARO</text>
        <text x="62" y="142" fontSize="14" fill="#FFFFFF" style={label}>Outcome shared with you</text>
      </g>
    </svg>
  )
}
