import { useEffect, useState } from 'react'
import { fetchAboutData } from '../../api/about'
import SectionWrapper from './SectionWrapper'
import SectionTitle from './SectionTitle'
import Card from './Card'
import {
  FiShield,
  FiTrendingUp,
  FiZap,
  FiCheckCircle,
  FiAward,
  FiUsers,
  FiStar,
  FiGlobe,
  FiArrowLeft,
  FiArrowRight,
} from 'react-icons/fi'
import { FaCompass, FaBullseye } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'

const iconMap = {
  shield: <FiShield />,
  'trending-up': <FiTrendingUp />,
  zap: <FiZap />,
  'check-circle': <FiCheckCircle />,
  award: <FiAward />,
  users: <FiUsers />,
  star: <FiStar />,
  globe: <FiGlobe />,
}

export default function About() {
  const [data, setData] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    let mounted = true
    fetchAboutData()
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

  return (
    <SectionWrapper id="about" bg="bg-white">
      <SectionTitle title="About GLOARO Digital Network" subtitle="ABOUT GLOARO" />

      <div className="mx-auto mb-12 max-w-4xl text-center md:mb-16">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-2xl font-semibold text-[#0b2451]"
        >
          Company Overview
        </motion.h3>
        <div className="space-y-6 text-left text-lg leading-relaxed text-slate-600 md:text-justify">
          {data.overview.map((para, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, x: isMobile ? (idx % 2 === 0 ? 50 : -50) : 0, y: isMobile ? 0 : 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.5, margin: '0px 0px -50px 0px' }}
              transition={{ duration: 0.6, delay: isMobile ? 0 : idx * 0.1 }}
            >
              {para}
            </motion.p>
          ))}
        </div>
      </div>

      <div className="mb-14 md:mb-20">
        <SectionTitle title="Vision & Mission" subtitle="OUR PURPOSE" />

          <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-8 max-w-3xl text-center text-lg font-medium leading-relaxed text-slate-600 md:mb-12 md:text-xl"
        >
          Building India's most trusted digital business ecosystem through innovation, collaboration, and sustainable growth.
        </motion.p>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: isMobile ? 0.95 : 1 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="group relative flex flex-col rounded-[24px] border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-2"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}
          >
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-[24px] bg-gradient-to-b from-[#FAF8F5] to-transparent opacity-50" />
            <div className="flex-grow p-8 md:p-10">
              <div className="mb-5 flex items-center gap-5">
                <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-[#FDBA2D] shadow-lg shadow-secondary/20 transition-transform duration-300 group-hover:scale-105">
                  <FaCompass className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-[#0b2451] md:text-3xl">OUR VISION</h3>
              </div>
              <p className="text-[1.1rem] leading-[1.8] text-slate-600">{data.vision}</p>
            </div>
            <div className="rounded-b-[24px] border-t border-gray-100 bg-[#FAFAFA] px-6 py-4 text-center">
              <p className="italic font-medium text-[#0b2451]/80">"Empowering Every Entrepreneur."</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: isMobile ? 0.95 : 1 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: isMobile ? 0 : 0.2 }}
            className="group relative flex flex-col rounded-[24px] border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-2"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}
          >
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-[24px] bg-gradient-to-b from-[#FAF8F5] to-transparent opacity-50" />
            <div className="flex-grow p-8 md:p-10">
              <div className="mb-5 flex items-center gap-5">
                <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-[#FDBA2D] shadow-lg shadow-secondary/20 transition-transform duration-300 group-hover:scale-105">
                  <FaBullseye className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-[#0b2451] md:text-3xl">OUR MISSION</h3>
              </div>
              <p className="text-[1.1rem] leading-[1.8] text-slate-600">{data.mission}</p>
            </div>
            <div className="rounded-b-[24px] border-t border-gray-100 bg-[#FAFAFA] px-6 py-4 text-center">
              <p className="italic font-medium text-[#0b2451]/80">"Connecting Businesses Through Trust & Innovation."</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mb-16 overflow-hidden md:mb-22">
        <SectionTitle title="Core Values" subtitle="WHAT WE STAND FOR" />

        <div className="mx-auto h-[380px] max-w-6xl px-4 py-4 sm:h-[360px] md:h-[350px] lg:h-[440px]">
          <Swiper
            modules={[Autoplay, Navigation]}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            spaceBetween={32}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 3, centeredSlides: true },
            }}
            loop
            centeredSlides
            grabCursor
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={1000}
            className="h-full w-full !overflow-visible"
          >
            {data.coreValues.map((value, idx) => (
              <SwiperSlide key={idx} className="h-full pt-4 pb-6 md:pt-6 md:pb-10 lg:pt-8 lg:pb-12">
                {({ isActive }) => (
                  <div className={`h-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${isActive ? 'z-20 scale-110' : 'z-10 scale-90 opacity-50'}`}>
                    {/* <Card className={`h-full rounded-3xl border-none p-8 transition-all duration-700 ${isActive ? 'bg-[#0b1f4b] text-white shadow-[0_30px_80px_rgba(11,31,75,0.32)]' : 'bg-white text-[#0b2451] shadow-lg'}`}>
                      <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-sm transition-all duration-700 ${isActive ? 'bg-white text-[#0b1f4b]' : 'bg-accent text-primary'}`}> */}
                      <Card
  className={`h-full rounded-[30px] border-0 p-8 transition-all duration-700 ${
    isActive
      ? "!bg-[#0b1f4b] !text-white shadow-[0_30px_80px_rgba(11,31,75,0.35)] scale-105"
      : "bg-white text-[#0b2451] shadow-[0_10px_35px_rgba(0,0,0,0.08)] scale-95"
  }`}
><div
  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-all duration-700 ${
    isActive
      ? "!bg-white !text-[#0b1f4b]"
      : "bg-[#F8F9FC] text-[#0b1f4b]"
  }`}
>
                        {iconMap[value.icon]}
                      </div>
                      <h4 className={`mb-3 text-xl font-semibold transition-colors duration-700 ${isActive ? '!text-white' : 'text-[#0b2451]'}`}>{value.title}</h4>
                      <p className={`text-sm leading-relaxed transition-colors duration-700 ${isActive ? '!text-white/90' : 'text-slate-600'}`}>{value.description}</p>
                    </Card>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            type="button"
            className="swiper-button-prev-custom z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-primary/10 bg-white text-primary shadow-md transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg active:scale-95 md:h-12 md:w-12"
            aria-label="Previous Slide"
          >
            <FiArrowLeft size={18} className="md:h-5 md:w-5" />
          </button>
          <button
            type="button"
            className="swiper-button-next-custom z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-primary/10 bg-white text-primary shadow-md transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg active:scale-95 md:h-12 md:w-12"
            aria-label="Next Slide"
          >
            <FiArrowRight size={18} className="md:h-5 md:w-5" />
          </button>
        </div>
      </div>

      <div className="rounded-[34px] border border-slate-200/80 bg-[#f4f5f9] p-6 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset] md:p-12">
        <SectionTitle title="Founder & Leadership Message" subtitle="MESSAGES" />
        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-8">
          <Card className="relative flex h-full min-h-[560px] flex-col overflow-hidden rounded-[28px] border border-slate-100 bg-white px-8 py-10 shadow-[0_10px_30px_rgba(15,23,42,0.10)] md:px-10 md:py-12">
            <div className="absolute right-0 top-0 h-44 w-44 rounded-bl-[140px] bg-[#fff8e8]" />
            <h3 className="relative z-10 mb-6 text-[1.62rem] font-bold leading-tight text-[#0b2451] md:text-[1.95rem]">{data.founderMessage.title}</h3>
            <div className="relative z-10 flex-grow space-y-6 text-justify text-[0.96rem] leading-8 text-slate-500 md:text-[1.03rem]">
              {data.founderMessage.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
            <div className="relative z-10 mt-10 border-t border-slate-100 pt-9 text-center">
              <p className="mb-2 text-[1.12rem] font-bold italic leading-8 text-[#0b2451]">{data.founderMessage.quote}</p>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-secondary">{data.founderMessage.signature}</p>
            </div>
          </Card>

          <Card className="relative flex h-full min-h-[560px] flex-col overflow-hidden rounded-[28px] border border-[#0b1f4b] !bg-[#0b1f4b] px-8 py-10 text-white shadow-[0_30px_80px_rgba(11,31,75,0.28)] md:px-10 md:py-12">
            <div className="absolute bottom-0 right-0 h-64 w-64 rounded-tl-full bg-white/5" />
            <div className="relative z-10 flex flex-grow flex-col">
              <h3 className="mb-6 text-[1.62rem] font-bold leading-tight !text-white md:text-[1.95rem]">{data.leadershipMessage.title}</h3>
              <div className="flex-grow space-y-6 text-justify text-[0.96rem] leading-8 !text-white/85 md:text-[1.03rem]">
                {data.leadershipMessage.paragraphs.map((p, idx) => (
                  <p key={idx} className="!text-white/80">{p}</p>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  )
}
