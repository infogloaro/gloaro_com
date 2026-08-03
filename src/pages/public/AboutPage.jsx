import { useEffect } from 'react'
import { About, Community, Services, WhatWeDo, WhyChoose } from '../../components/about'

export default function AboutPage() {
  useEffect(() => {
    const previousTitle = document.title
    const meta = document.querySelector('meta[name="description"]') || document.createElement('meta')
    const createdMeta = !meta.isConnected
    const previousDescription = meta.getAttribute('content')

    if (createdMeta) {
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }

    document.title = 'About GLOARO Digital Network'
    meta.setAttribute(
      'content',
      'Learn how GLOARO Digital Network connects entrepreneurs through verified membership, referrals, business services, leadership, and community growth.',
    )

    return () => {
      document.title = previousTitle
      if (previousDescription != null) meta.setAttribute('content', previousDescription)
      else if (createdMeta && meta.isConnected) meta.remove()
    }
  }, [])

  return (
    <main className="overflow-x-hidden bg-white">
      <About />
      <WhatWeDo />
      <Services />
      <WhyChoose />
      <Community />
    </main>
  )
}

