import { useTime, useTransform, motion } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import SectionTitle from './SectionTitle'
import {
  FaUserTie,
  FaUsersCog,
  FaCalendarCheck,
  FaUsers,
  FaBullhorn,
  FaStore,
  FaNetworkWired,
  FaCalendarAlt,
  FaHandshake,
  FaChartLine,
} from 'react-icons/fa'
import logo from '../../assets/logo.png'

const ecosystemNodes = [
  { title: 'Membership', icon: <FaUserTie /> },
  { title: 'Referrals', icon: <FaUsersCog /> },
  { title: 'Meetings', icon: <FaCalendarCheck /> },
  { title: 'Community', icon: <FaUsers /> },
  { title: 'Digital Marketing', icon: <FaBullhorn /> },
  { title: 'Marketplace', icon: <FaStore /> },
  { title: 'Technology', icon: <FaNetworkWired /> },
  { title: 'Events', icon: <FaCalendarAlt /> },
  { title: 'Franchise', icon: <FaHandshake /> },
  { title: 'Business Growth', icon: <FaChartLine /> },
]

const EcosystemNode = ({ node, i, center, radius, globalRotation }) => {
  const initialAngle = i * 36 - 90
  const angleRad = initialAngle * (Math.PI / 180)
  const x = center + radius * Math.cos(angleRad)
  const y = center + radius * Math.sin(angleRad)

  const isYellow = i % 2 === 0
  const borderColor = isYellow ? 'border-secondary' : 'border-primary'
  const iconColor = isYellow ? 'text-primary' : 'text-secondary'
  const lineColor = isYellow ? 'bg-secondary' : 'bg-primary'

  const scale = useTransform(globalRotation, (rot) => {
    let globalAngle = (initialAngle + rot) % 360
    if (globalAngle < 0) globalAngle += 360

    let distance = Math.abs(globalAngle - 0)
    if (distance > 180) distance = 360 - distance

    if (distance > 36) return 1

    const factor = (Math.cos((distance / 36) * Math.PI) + 1) / 2
    return 1 + 0.35 * factor
  })

  const highlightOpacity = useTransform(globalRotation, (rot) => {
    let globalAngle = (initialAngle + rot) % 360
    if (globalAngle < 0) globalAngle += 360
    let distance = Math.abs(globalAngle - 0)
    if (distance > 180) distance = 360 - distance

    if (distance > 24) return 0
    const factor = (Math.cos((distance / 24) * Math.PI) + 1) / 2
    return factor
  })

  const normalOpacity = useTransform(highlightOpacity, (op) => 1 - op)

  const zIndex = useTransform(globalRotation, (rot) => {
    let globalAngle = (initialAngle + rot) % 360
    if (globalAngle < 0) globalAngle += 360
    let distance = Math.abs(globalAngle - 0)
    if (distance > 180) distance = 360 - distance
    return distance < 18 ? 50 : 20
  })

  const counterRotation = useTransform(globalRotation, (rot) => -rot)

  return (
    <>
      <div
        className={`absolute left-1/2 top-1/2 h-[3px] origin-left ${lineColor}`}
        style={{
          width: `${radius}px`,
          transform: `translateY(-50%) rotate(${initialAngle}deg)`,
        }}
      >
        <div className={`absolute right-[-4px] top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white ${lineColor}`} />
        <div className={`absolute left-[142px] top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white ${lineColor}`} />
      </div>

      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${x}px`, top: `${y}px`, zIndex }}
      >
        <motion.div
          className={`relative flex h-[140px] w-[140px] flex-col items-center justify-center overflow-hidden rounded-full border-[4px] bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)] ${borderColor}`}
          style={{
            rotate: counterRotation,
            scale,
          }}
        >
          <motion.div
            className={`absolute inset-0 ${isYellow ? 'bg-secondary' : 'bg-primary'}`}
            style={{ opacity: highlightOpacity }}
          />

          <motion.div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-4"
            style={{ opacity: normalOpacity }}
          >
            <div className={`mb-2 text-4xl ${iconColor}`}>{node.icon}</div>
            <span className="text-center text-[13px] font-bold leading-tight text-primary">{node.title}</span>
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-4"
            style={{ opacity: highlightOpacity }}
          >
            <div className="mb-2 text-4xl text-white">{node.icon}</div>
            <span className="text-center text-[13px] font-bold leading-tight text-white">{node.title}</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  )
}

export default function WhatWeDo() {
  const radius = 320
  const center = 425
  const time = useTime()
  const globalRotation = useTransform(time, (t) => (t / 30000) * 360)

  return (
    <SectionWrapper id="what-we-do" bg="bg-white">
      <SectionTitle title="Empowering Businesses Through One Unified Ecosystem" subtitle="WHAT WE DO" />

      <div className="mb-6 flex h-[300px] w-full items-center justify-center overflow-hidden py-2 lg:h-[650px] lg:py-6 sm:h-[450px] md:h-[550px]">
        <div className="relative h-[850px] w-[850px] shrink-0 scale-[0.35] origin-center transition-transform duration-500 sm:scale-[0.45] md:scale-[0.65] lg:scale-[0.8]">
          <motion.div className="absolute inset-0 z-10" style={{ rotate: globalRotation }}>
            {ecosystemNodes.map((node, i) => (
              <EcosystemNode
                key={i}
                node={node}
                i={i}
                center={center}
                radius={radius}
                globalRotation={globalRotation}
              />
            ))}
          </motion.div>

          <div className="absolute left-1/2 top-1/2 z-30 flex h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[3px] border-secondary bg-white/50 shadow-2xl backdrop-blur-sm" />
            <div className="absolute inset-[10px] flex flex-col items-center justify-center rounded-full border-[10px] border-primary bg-white p-12 shadow-inner">
              <img src={logo} alt="GLOARO Logo" className="h-auto w-48 object-contain" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mb-6 max-w-4xl px-4 text-center text-lg font-medium leading-relaxed text-text/70 md:text-xl">
        GLOARO Digital Network brings together business networking, referrals, technology, leadership, and digital growth services into one complete ecosystem that helps entrepreneurs connect, collaborate, and grow together.
      </div>
    </SectionWrapper>
  )
}

