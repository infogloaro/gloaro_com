import Seo from '../../components/Seo'
import { About, Community, Services, WhatWeDo, WhyChoose } from '../../components/about'

export default function AboutPage() {
  return (
    <main className="overflow-x-hidden bg-white">
      <Seo
        title="About GLOARO | Verified Business Network in India"
        description="Learn how GLOARO connects entrepreneurs through verified membership, referrals, business services, leadership, and community growth."
        canonical="/about"
      />
      <About />
      <WhatWeDo />
      <Services />
      <WhyChoose />
      <Community />
    </main>
  )
}
