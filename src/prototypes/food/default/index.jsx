import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ScrollTrigger, prefersReducedMotion, scrollToId } from './motion'
import { Cursor, LiveBackground, Nav } from './sections/Chrome'
import Hero from './sections/Hero'
import Signature from './sections/Signature'
import Story from './sections/Story'
import Menu from './sections/Menu'
import DishDetail from './sections/DishDetail'
import Reservation from './sections/Reservation'
import { Chef, FinalCta, Visit } from './sections/Closing'
import './food.css'

export default function FoodPrototype() {
  const [detail, setDetail] = useState(null) // { id, origin: { x, y } }
  const [list, setList] = useState([])

  const go = useCallback((id) => scrollToId(id, prefersReducedMotion()), [])

  const openDish = useCallback((id, e) => {
    const r = e?.currentTarget?.getBoundingClientRect()
    const origin = e?.clientX
      ? { x: e.clientX, y: e.clientY }
      : r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    setDetail({ id, origin })
  }, [])

  const closeDish = useCallback(() => setDetail(null), [])
  const navigateDish = useCallback((id) => setDetail((d) => ({ ...d, id })), [])
  const toggleList = useCallback((id) => setList((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id])), [])
  const removeFromList = useCallback((id) => setList((l) => l.filter((x) => x !== id)), [])

  const reserveWith = useCallback((id) => {
    setList((l) => (l.includes(id) ? l : [...l, id]))
    setDetail(null)
    setTimeout(() => go('reserve'), 450)
  }, [go])

  // Pinned sections change page height once media and fonts settle.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <div className="me">
      <LiveBackground />
      <Nav go={go} listCount={list.length} />
      <main>
        <Hero go={go} />
        <Signature openDish={openDish} />
        <Story />
        <Menu openDish={openDish} list={list} />
        <Reservation list={list} onRemove={removeFromList} go={go} />
        <Chef />
        <Visit />
        <FinalCta go={go} />
      </main>

      <AnimatePresence>
        {detail && (
          <DishDetail
            key="detail"
            id={detail.id}
            origin={detail.origin}
            onClose={closeDish}
            onNavigate={navigateDish}
            inList={list.includes(detail.id)}
            onToggleList={toggleList}
            onReserve={reserveWith}
          />
        )}
      </AnimatePresence>
      <Cursor />
    </div>
  )
}
