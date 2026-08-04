import { useEffect, useState } from 'react'
import { fetchWhyChooseData } from '../../api/about'
import SectionWrapper from './SectionWrapper'
import SectionTitle from './SectionTitle'
import Card from './Card'
import { CheckCircle2 } from 'lucide-react'

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const WhyChoose = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchWhyChooseData().then(setData).catch(console.error)
  }, [])

  if (!data) return null

  return (
    <SectionWrapper
      id="why-choose"
      bg="bg-[#081a43]"
      className="relative overflow-hidden text-white !py-16 md:!py-20"
    >
      <SectionTitle title="Why Choose GLOARO" subtitle="WHY CHOOSE GLOARO" centered light />

      <div className="absolute -right-32 top-0 h-[26rem] w-[26rem] rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute -left-40 bottom-0 h-[22rem] w-[22rem] rounded-full bg-white/5 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,174,19,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_32%)]" />

      {/* <div className="relative z-10 mb-8 mt-2 flex flex-col items-center gap-8">
        <div className="w-full max-w-4xl">
          <h3 className="mb-3 text-2xl font-bold leading-tight text-white md:text-3xl">
            {data.title}
          </h3>
          <p className="mb-0 text-base leading-relaxed text-white/80 md:text-lg">
            {data.description}
          </p>
        </div>
      </div> */}

      <div className="relative z-10 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
        {data.strengths.map((item, idx) => (
          <Card
            key={idx}
            className="group min-h-[140px] border-2 border-[#f6a71f] !bg-[#d0d3db] !px-5 !py-5 text-[#0a1f4d] shadow-[0_10px_24px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#ffbf3b] hover:!bg-[#d9dce4] hover:shadow-[0_18px_36px_rgba(0,0,0,0.20)] md:min-h-[160px] md:!px-6 md:!py-6"
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 text-2xl leading-none text-secondary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="mb-1.5 text-base font-bold text-[#0a1f4d] md:text-lg">
                  {item.title}
                </h4>
                <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="relative mt-12 overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,28,70,0.97),rgba(7,23,58,0.98))] p-6 shadow-[0_30px_80px_rgba(2,8,23,0.38)] transition-transform duration-300 hover:-translate-y-1 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,174,19,0.10),transparent_30%)] opacity-80" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h3 className="mb-2 text-2xl font-bold !text-white md:text-3xl">
              Membership Investment
            </h3>
            <p className="mb-3 text-sm !text-white/80 md:text-base">
              A clear, transparent pricing structure for long-term growth.
            </p>
            <div className="mb-1 text-4xl font-extrabold leading-none text-secondary md:text-5xl">
              {currencyFormatter.format(data.investment.fee)}
            </div>
            <div className="mb-4 text-xs text-white/60 md:text-sm">
              + {data.investment.gst.toLocaleString('en-IN')} GST
            </div>
            <button className="btn-secondary rounded-full px-6 py-3 text-sm">
              Apply for Membership
            </button>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm transition-colors duration-300 hover:bg-white/12 md:p-6">
            <h4 className="mb-3 font-bold text-white">What&apos;s Included:</h4>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {data.investment.includes.map((inc, idx) => (
                <li key={idx} className="flex items-center gap-2 text-white/90">
                  <CheckCircle2 className="shrink-0 h-4 w-4 text-secondary" />
                  <span className="text-sm leading-tight">{inc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

export default WhyChoose
