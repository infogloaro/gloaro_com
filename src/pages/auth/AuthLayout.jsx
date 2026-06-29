import { Link, Outlet } from 'react-router-dom'
import signupImage from '../../assets/signup_img.png'
import signupLogo from '../../assets/signup_logo.png'

export default function AuthLayout() {
  return (
    <main className="min-h-screen bg-white font-urbanist text-[#101827] lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#111a22] lg:block">
        <img src={signupImage} alt="Gloaro workspace" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 grid place-items-center">
          <div className="rounded-lg border border-white/15 bg-white/15 p-8 text-center text-white shadow-2xl backdrop-blur">
            <img src={signupLogo} alt="Gloaro" className="mx-auto h-20 w-20 object-contain" />
            <h1 className="mt-5 font-inter text-4xl font-extrabold tracking-[0.22em]">GLOARO</h1>
            <p className="font-inter text-xs font-extrabold tracking-[0.2em]">BUSINESS NETWORK</p>
          </div>
        </div>
      </section>
      <section className="flex min-h-screen flex-col px-5 py-8">
        <Link to="/" className="text-sm font-extrabold text-[#0d4697]">Back to home</Link>
        <div className="mx-auto flex w-full max-w-md flex-1 items-center">
          <Outlet />
        </div>
      </section>
    </main>
  )
}
