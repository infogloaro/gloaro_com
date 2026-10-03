import { lazy, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import StoreProvider from './StoreProvider'
import { useNav } from './store'
import { CompareTray, Header, MobileNav, Toast } from './ui/bits'
import Home from './views/Home'
import Shop from './views/Shop'
import ProductView from './views/Product'
import { Bag, Checkout, Confirmation } from './views/Checkout'
import { Compare, Wishlist } from './views/Lists'
import { findProduct } from './data/catalog'
import './retail.css'

const Lab = lazy(() => import('./lab'))

function App() {
  const nav = useNav()
  const { view, params } = nav
  const id = params.get('id')
  // A key per page, so each view mounts fresh and AnimatePresence can transition between them.
  const key = view === 'product' ? `product-${id}` : view === 'shop' ? `shop-${params.get('cat') || ''}` : view
  let page
  if (view === 'product' && findProduct(id)) page = <ProductView id={id} initialPart={params.get('part')} />
  else if (view === 'shop') page = <Shop />
  else if (view === 'bag') page = <Bag />
  else if (view === 'checkout') page = <Checkout />
  else if (view === 'done') page = <Confirmation />
  else if (view === 'wishlist') page = <Wishlist />
  else if (view === 'compare') page = <Compare />
  else page = <Home />

  return (
    <div className="gx">
      <Header />
      <LayoutGroup>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.main
            key={key}
            className="gx-main"
            initial={{ opacity: 0, clipPath: 'inset(0 0 8% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {page}
          </motion.main>
        </AnimatePresence>
      </LayoutGroup>
      <CompareTray />
      <MobileNav />
      <Toast />
    </div>
  )
}

export default function RetailPrototype() {
  const [params] = useSearchParams()
  if (params.get('lab')) {
    return <Suspense fallback={null}><Lab id={params.get('lab')} explode={Number(params.get('x') || 0)} transparent={params.get('bg') === '0'} /></Suspense>
  }
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  )
}
