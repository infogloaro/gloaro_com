import SectionWrapper from './SectionWrapper'
import SectionTitle from './SectionTitle'
import { FaCheckCircle } from 'react-icons/fa'

export default function Community() {
  const chapterBullets = [
    'Weekly Networking Meetings',
    'Trusted Business Referrals',
    'Local Business Community',
    'Leadership Development',
    'Accountability & Collaboration',
    'Business Growth Opportunities',
  ]

  const memberBullets = [
    'Verified Business Professional',
    'Trusted Referral Network',
    'Qualified Business Opportunities',
    'Digital Marketing Support',
    'Technology Solutions',
    'Leadership Development',
    'Business Promotion',
    'Community Collaboration',
    'Sustainable Business Growth',
  ]

  return (
    <SectionWrapper id="community" bg="bg-white">
      <div className="mb-8">
        <SectionTitle title="How GLOARO Community Works" subtitle="OUR COMMUNITY" />
        <p className="mx-auto max-w-3xl text-center text-lg font-medium leading-relaxed text-text/70 md:text-xl">
          A trusted, referral-based business ecosystem where entrepreneurs connect, collaborate, and grow together.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="space-y-10 md:hidden">
          <div>
            <h3 className="mb-4 text-2xl font-extrabold uppercase tracking-tight text-primary">What is a Chapter?</h3>
            <div className="mb-6 space-y-4 text-left text-base leading-relaxed text-text/80">
              <p>
                A GLOARO Chapter is a local business networking community where verified entrepreneurs and professionals meet regularly to build trusted relationships, exchange qualified business referrals, collaborate on opportunities, and support one another's business growth.
              </p>
              <p>
                Each chapter is designed to create a strong local ecosystem that encourages meaningful networking, accountability, and long-term professional success.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-y-3">
              {chapterBullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <FaCheckCircle className="mt-0.5 shrink-0 text-lg text-secondary" />
                  <span className="text-base font-medium text-text/90">{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full items-center justify-center">
            <div className="h-[1px] w-full bg-secondary/20" />
            <div className="mx-3 h-2 w-2 rounded-full bg-secondary" />
            <div className="h-[1px] w-full bg-secondary/20" />
          </div>

          <div>
            <h3 className="mb-4 text-2xl font-extrabold uppercase tracking-tight text-primary">Who is a GLOARO Member?</h3>
            <div className="mb-6 space-y-4 text-left text-base leading-relaxed text-text/80">
              <p>
                A GLOARO Member is a verified entrepreneur or business professional who becomes part of a trusted referral-based business ecosystem.
              </p>
              <p>
                Members gain access to structured networking, qualified business referrals, digital growth services, technology solutions, leadership opportunities, training programs, strategic partnerships, and a collaborative community focused on long-term business success.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-y-3">
              {memberBullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <FaCheckCircle className="mt-0.5 shrink-0 text-lg text-secondary" />
                  <span className="text-base font-medium text-text/90">{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative hidden pl-[80px] md:block lg:pl-[120px]">
          <div className="absolute left-[39px] top-4 bottom-4 w-[2px] bg-secondary/20 lg:left-[59px]" />
          <div className="absolute left-[39px] top-4 bottom-4 z-0 w-[2px] origin-top bg-secondary shadow-[0_0_10px_rgba(245,166,35,0.8)] lg:left-[59px]" />

          <div className="relative mb-6">
            <div className="absolute -left-[50px] top-3 z-10 h-5 w-5 rounded-full border-2 border-white bg-secondary shadow-[0_0_15px_rgba(245,166,35,0.8)] lg:-left-[70px]" />

            <h3 className="mb-4 text-3xl font-extrabold uppercase tracking-tight text-primary lg:text-4xl">What is a Chapter?</h3>
            <div className="mb-6 space-y-4 text-justify text-lg leading-relaxed text-text/80 md:text-left">
              <p>
                A GLOARO Chapter is a local business networking community where verified entrepreneurs and professionals meet regularly to build trusted relationships, exchange qualified business referrals, collaborate on opportunities, and support one another's business growth.
              </p>
              <p>
                Each chapter is designed to create a strong local ecosystem that encourages meaningful networking, accountability, and long-term professional success.
              </p>
            </div>

            <div className="grid gap-x-10 gap-y-3 md:grid-cols-2">
              {chapterBullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <FaCheckCircle className="mt-0.5 shrink-0 text-xl text-secondary" />
                  <span className="text-lg font-medium text-text/90">{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mb-6 mt-2 flex w-full items-center justify-center">
            <div className="absolute -left-[50px] top-1/2 z-10 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-white bg-secondary shadow-[0_0_15px_rgba(245,166,35,0.8)] lg:-left-[70px]" />

            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
            <div className="mx-4 h-2 w-2 shrink-0 rounded-full bg-secondary/50" />
            <div className="h-[1px] w-full bg-gradient-to-r from-secondary/40 via-secondary/40 to-transparent" />
          </div>

          <div className="relative">
            <div className="absolute -bottom-1 -left-[50px] z-10 h-5 w-5 rounded-full border-2 border-white bg-secondary shadow-[0_0_15px_rgba(245,166,35,0.8)] lg:-left-[70px]" />

            <h3 className="mb-4 text-3xl font-extrabold uppercase tracking-tight text-primary lg:text-4xl">Who is a GLOARO Member?</h3>
            <div className="mb-6 space-y-4 text-justify text-lg leading-relaxed text-text/80 md:text-left">
              <p>
                A GLOARO Member is a verified entrepreneur or business professional who becomes part of a trusted referral-based business ecosystem.
              </p>
              <p>
                Members gain access to structured networking, qualified business referrals, digital growth services, technology solutions, leadership opportunities, training programs, strategic partnerships, and a collaborative community focused on long-term business success.
              </p>
            </div>

            <div className="grid gap-x-10 gap-y-3 md:grid-cols-2">
              {memberBullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <FaCheckCircle className="mt-0.5 shrink-0 text-xl text-secondary" />
                  <span className="text-lg font-medium text-text/90">{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
