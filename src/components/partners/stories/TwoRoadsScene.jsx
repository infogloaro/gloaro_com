// Landing scroll story "Two roads" (storyboard frames R1–R3; R4 is the FitPicker).
const GOLD = '#F5A900'
const ROYAL = '#1558B0'
const label = { fontFamily: 'Work Sans, sans-serif', fontWeight: 600 }
const heading = { fontFamily: 'Outfit, sans-serif', fontWeight: 600 }

const LEFT = 'M300 420 L300 250 C 300 180 200 140 110 30'
const RIGHT = 'M300 250 C 300 180 400 140 490 30'
const nodes = [[540, 200], [566, 290], [520, 362], [404, 346], [392, 262]]
const YOU = [480, 280]

export default function TwoRoadsScene() {
  return (
    <svg viewBox="0 0 600 400" className="h-full w-full" role="img" aria-label="Animated illustration of one road splitting into the Franchise and Channel Partner paths">
      <rect width="600" height="400" fill="#0B2451" />
      <rect data-s="leftBg" width="300" height="400" fill="#061A3A" />
      <rect data-s="rightBg" x="300" width="300" height="400" fill="#EAF2FD" />

      <path data-s="road" d={LEFT} pathLength="1" strokeDasharray="1" fill="none" stroke="#8EA3C2" strokeWidth="38" strokeLinecap="round" />
      <path data-s="road" d={RIGHT} pathLength="1" strokeDasharray="1" fill="none" stroke="#8EA3C2" strokeWidth="38" strokeLinecap="round" />
      <path data-s="lineL" d={LEFT} pathLength="1" strokeDasharray="1" fill="none" stroke={GOLD} strokeWidth="4" strokeLinecap="round" />
      <path data-s="lineR" d={RIGHT} pathLength="1" strokeDasharray="1" fill="none" stroke={ROYAL} strokeWidth="4" strokeLinecap="round" />
      <circle data-s="fork" cx="300" cy="250" r="10" fill="#FFFFFF" stroke="#0B2451" strokeWidth="3" />

      {/* Franchise: an office built floor by floor. */}
      <rect data-s="ground" x="30" y="352" width="168" height="5" rx="2.5" fill={GOLD} />
      {[296, 240, 184].map((y, floor) => (
        <g key={y} data-s="floor">
          <rect x="40" y={y} width="150" height="54" rx="5" fill="#123368" stroke={GOLD} strokeWidth="2" />
          {[56, 90, 124, 158].map((x) => (
            floor === 0 && x === 124
              ? <rect key={x} x={x - 2} y={y + 18} width="22" height="36" fill={GOLD} />
              : <rect key={x} data-s="window" x={x} y={y + 16} width="20" height="16" fill={GOLD} opacity="0.65" />
          ))}
        </g>
      ))}
      <rect data-s="dimR" x="300" width="300" height="400" fill="#EAF2FD" opacity="0.6" />

      {/* Channel Partner: a network that connects through you to GLOARO. */}
      <g data-s="nlines" stroke={ROYAL} strokeWidth="2.5">
        {nodes.map(([x, y]) => <line key={`${x}-${y}`} x1={YOU[0]} y1={YOU[1]} x2={x} y2={y} pathLength="1" strokeDasharray="1" />)}
        <line x1={YOU[0]} y1={YOU[1]} x2="520" y2="122" pathLength="1" strokeDasharray="1" />
      </g>
      {nodes.map(([x, y]) => <circle key={`${x}-${y}`} data-s="node" cx={x} cy={y} r="12" fill="#FFFFFF" stroke={ROYAL} strokeWidth="3" />)}
      <g data-s="you">
        <circle cx={YOU[0]} cy={YOU[1]} r="24" fill={ROYAL} />
        <text x={YOU[0]} y={YOU[1] + 5} textAnchor="middle" fontSize="14" fill="#FFFFFF" style={heading}>You</text>
      </g>
      <g data-s="gloaro">
        <rect x="466" y="96" width="112" height="32" rx="10" fill="#0B2451" />
        <text x="522" y="117" textAnchor="middle" fontSize="14" fill="#FFFFFF" style={heading} letterSpacing="1.5">GLOARO</text>
      </g>
      <rect data-s="dimL" width="300" height="400" fill="#061A3A" opacity="0.6" />

      <g data-s="labelF">
        <rect x="24" y="22" width="128" height="34" rx="17" fill={GOLD} />
        <text x="88" y="45" textAnchor="middle" fontSize="16" fill="#061A3A" style={heading}>Franchise</text>
        <text x="24" y="384" fontSize="13" fill="#B8C5D9" style={label}>build and operate</text>
      </g>
      <g data-s="labelC">
        <rect x="406" y="22" width="170" height="34" rx="17" fill={ROYAL} />
        <text x="491" y="45" textAnchor="middle" fontSize="16" fill="#FFFFFF" style={heading}>Channel Partner</text>
        <text x="576" y="384" textAnchor="end" fontSize="13" fill="#4A5874" style={label}>connect and refer</text>
      </g>
    </svg>
  )
}
