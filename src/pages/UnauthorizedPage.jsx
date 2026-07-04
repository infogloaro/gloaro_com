import { Link } from 'react-router-dom'

export default function UnauthorizedPage() {
  return (
    <section className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0d4697]">Access Control</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">Unauthorized</h1>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
          You do not have permission to access this page.
        </p>
        <Link to="/" className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-[#0d4697] px-5 text-sm font-extrabold text-white">
          Go Home
        </Link>
      </div>
    </section>
  )
}
