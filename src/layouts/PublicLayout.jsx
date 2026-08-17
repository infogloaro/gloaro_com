import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FloatingWhatsApp from '../components/FloatingWhatsApp'

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
