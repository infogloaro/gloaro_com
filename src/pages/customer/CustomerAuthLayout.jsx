import { Link, Outlet } from 'react-router-dom'
import signupLogo from '../../assets/signup_logo.png'

export default function CustomerAuthLayout() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fef3c7,_#fff7ed_42%,_#fff_72%)] font-urbanist text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-8 lg:flex-row lg:items-center lg:gap-12">
        <div className="lg:w-1/2">
          <Link to="/" className="text-sm font-extrabold text-[#0d4697]">Back to home</Link>
          <div className="mt-10 max-w-xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-amber-200 bg-white px-4 py-2 shadow-sm">
              <img src={signupLogo} alt="Gloaro" className="h-8 w-8 object-contain" />
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-700">Customer Portal</span>
            </div>
            <h1 className="mt-6 font-playfair text-5xl font-bold leading-tight text-slate-900">Customer access built for direct account management.</h1>
            <p className="mt-4 max-w-lg text-base font-medium leading-7 text-slate-600">
              Use the dedicated customer portal to manage your account, personal profile, and delivery addresses without entering the member or vendor workflows.
            </p>
          </div>
        </div>
        <div className="mt-10 w-full lg:mt-0 lg:w-1/2">
          <div className="mx-auto w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </section>
    </main>
  )
}
