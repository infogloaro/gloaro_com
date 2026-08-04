import { useEffect, useState } from 'react'
import { fetchServicesData } from '../../api/about'
import SectionWrapper from './SectionWrapper'
import SectionTitle from './SectionTitle'
import { FiUsers, FiCalendar, FiBriefcase } from 'react-icons/fi'
import { FaHandshake, FaUserCheck, FaBookOpen, FaBullhorn } from 'react-icons/fa'

const iconMap = {
  handshake: <FaHandshake />,
  users: <FiUsers />,
  mentorship: <FaUserCheck />,
  training: <FaBookOpen />,
  events: <FiCalendar />,
  promotion: <FaBullhorn />,
  consulting: <FiBriefcase />,
}

export default function Services() {
  const [data, setData] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    let mounted = true
    fetchServicesData()
      .then((response) => {
        if (mounted) setData(response)
      })
      .catch(console.error)

    const updateIsMobile = () => setIsMobile(window.innerWidth <= 768)
    updateIsMobile()
    window.addEventListener('resize', updateIsMobile)

    return () => {
      mounted = false
      window.removeEventListener('resize', updateIsMobile)
    }
  }, [])

  if (!data) return null

  const servicesToShow = data.services.slice(0, 6)

  return (
    <SectionWrapper id="services" bg="bg-white">
      <SectionTitle title={data.title} subtitle="OUR SERVICES" description={data.introduction} />

      <div className="mt-14 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
        {servicesToShow.map((service, idx) => (
          <ServiceCard
            key={service.title}
            service={service}
            index={idx}
            isMobile={isMobile}
            iconMap={iconMap}
          />
        ))}
      </div>
    </SectionWrapper>
  )
}

function ServiceCard({ service, index, isMobile, iconMap: icons }) {
  return (
    <div
      className="
                group
                relative
                flex
                min-h-[330px]
                flex-col
                overflow-hidden
                rounded-[22px]
                border
                border-[#E7E9EF]
                bg-white
                px-10
                pt-10
                pb-9
                shadow-[0_14px_36px_rgba(15,23,42,0.08)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-secondary
                "
    >
      <div
        className="absolute right-0 top-0 z-0 h-28 w-28 -mr-10 -mt-10 rounded-bl-full bg-slate-50 transition-colors duration-300 group-hover:bg-slate-100"
      />

      {/* <div className="relative z-10 flex h-full flex-col">
        <div
          className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl text-[#8b95a7] transition-colors duration-300 group-hover:bg-[#0b2451] group-hover:text-white"
        >
          {icons[service.icon]}
        </div>

        <h3
          className="mb-5 text-[1.7rem] font-bold leading-tight text-[#0b2451] transition-colors duration-300 group-hover:text-secondary md:text-2xl"
        >
          {service.title}
        </h3>

        <p className="max-w-md text-sm leading-7 text-slate-500 md:text-[1.02rem]">
          {service.description}
        </p>
      </div> */}
<div className="relative z-10 mb-8 flex items-center gap-5">
  <div
    className="
      flex
      h-[62px]
      w-[62px]
      shrink-0
      items-center
      justify-center
      rounded-full
      bg-[#EEF1F5]
      text-[30px]
      text-[#10224E]
      transition-all
      duration-300
      group-hover:bg-[#10224E]
      group-hover:text-white
    "
  >
    {icons[service.icon]}
  </div>

  <h3
    className="
      text-[34px]
      font-bold
      leading-tight
      text-[#10224E]
      transition-colors
      duration-300
      group-hover:text-secondary
      lg:text-[18px]
      xl:text-[20px]
    "
  >
    {service.title}
  </h3>
</div>

<p className="text-[16px]  text-[!#1e293bb3;] lg:text-[17px]">
  {service.description}
</p>
    </div>
  )
}
