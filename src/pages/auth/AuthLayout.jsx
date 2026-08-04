import { Link, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, Sparkles, ShieldCheck } from 'lucide-react'
import signupImage from '../../assets/signup_img.png'
import signupLogo from '../../assets/signup_logo.png'

export default function AuthLayout() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dceafe_0,transparent_32%),radial-gradient(circle_at_bottom_right,#fff4ce_0,transparent_28%),linear-gradient(180deg,#f8fbff,#ffffff)] font-urbanist text-[#101827] lg:grid lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[linear-gradient(145deg,#071226_0%,#0b469e_52%,#081a43_100%)] lg:block">
        <img src={signupImage} alt="Gloaro workspace" className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-screen" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,174,19,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_28%)]" />

        <div className="relative flex min-h-screen items-center justify-center px-10 py-12">
          <div className="relative max-w-lg rounded-[36px] border border-white/15 bg-white/10 p-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#ffd36e]">
              <BadgeCheck className="h-4 w-4" />
              Secure access
            </div>
            <img src={signupLogo} alt="Gloaro" className="mt-6 h-20 w-20 rounded-3xl bg-white/10 object-contain shadow-lg shadow-black/20 ring-1 ring-white/15" />
            <h1 className="mt-6 font-playfair text-5xl font-semibold italic leading-[0.92]">
              Join the <span className="text-[#ffae13]">Gloaro</span> experience
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-white/78">
              A premium business network where verified entrepreneurs, professionals, and growth-minded teams connect through trust, referrals, and digital support.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                ['Verified', 'Trusted member access'],
                ['Premium', 'Polished digital journey'],
                ['Connected', 'Business growth ecosystem'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/8 p-4">
                  <p className="text-sm font-extrabold text-white">{title}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-white/70">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-bold text-white/85">
                <ShieldCheck className="h-4 w-4 text-[#ffd36e]" />
                Protected onboarding
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-bold text-white/85">
                <Sparkles className="h-4 w-4 text-[#ffd36e]" />
                Modern member experience
              </div>
            </div>

            <a href="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ffae13,#ffd36e)] px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#071226] shadow-[0_14px_30px_rgba(255,174,19,0.18)] transition duration-300 hover:-translate-y-0.5">
              Back to home
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[620px] items-center justify-between">
          <Link to="/" className="text-sm font-black uppercase tracking-[0.2em] text-[#0d4697] transition hover:text-[#082e70]">
            Back to home
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#0d4697]/10 bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-[#0d4697] shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#ffae13]" />
            Premium access
          </span>
        </div>

        <div className="mx-auto flex w-full max-w-[620px] flex-1 items-center py-6 sm:py-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </div>
      </section>
    </main>
  )
}
