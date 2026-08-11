import { useEffect, useState } from 'react'
import { communityApi } from '../../api/community'
import { useAuth } from '../../hooks/useAuth'
import LoadingScreen from '../../components/common/LoadingScreen'
import toast from 'react-hot-toast'
import {
  Sparkles,
  QrCode,
  Download,
  ShieldCheck,
  Building,
  UserCheck,
  Camera,
  Compass
} from 'lucide-react'

export default function AIInsightsAndDigitalCard() {
  const { user } = useAuth()
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [qrToken, setQrToken] = useState('')
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    setLoading(true)
    communityApi.getAIInsights()
      .then(res => {
        setInsights(res.data?.data?.insights || [])
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleQRCheckIn = (e) => {
    e.preventDefault()
    if (!qrToken.trim()) return
    setScanning(true)

    communityApi.markQRAttendance({ meetingId: qrToken })
      .then(res => {
        toast.success(res.data?.message || 'Attendance registered successfully!')
        setQrToken('')
      })
      .catch(() => {
        toast.error('Invalid QR code token')
      })
      .finally(() => {
        setScanning(false)
      })
  }

  const handlePDFDownload = () => {
    toast.success('Compiling digital card layout into PDF binary...')
    setTimeout(() => {
      window.print()
    }, 1000)
  }

  if (loading) {
    return <LoadingScreen label="Consulting AI Copilot..." />
  }

  const org = user?.meta?.adminProfile?.organization || {}

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Left pane - Digital Card & Checkin */}
      <div className="space-y-6">
        {/* Digital Member Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <QrCode className="h-5 w-5 text-[#0d4697]" />
            Your Digital Membership Card
          </h3>

          {/* Credit Card mockup for Digital Membership */}
          <div className="rounded-2xl bg-gradient-to-br from-[#0b1f3d] via-[#0d4697] to-[#1e3a8a] p-6 text-white relative shadow-lg overflow-hidden h-52 flex flex-col justify-between select-none">
            {/* Glossy watermark background */}
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-6 translate-y-6 pointer-events-none">
              <QrCode className="h-48 w-48" />
            </div>

            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#ffbf1a]">Gloaro Network Member</p>
                <h4 className="text-base font-black mt-1">{user?.name}</h4>
              </div>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-[9px] font-extrabold uppercase text-emerald-300">
                {user?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <p className="font-semibold text-blue-200">ID: {user?.officialId || 'MEM-TN-0012'}</p>
              <p className="font-semibold text-blue-200">Unit: {org.assignedChapter?.name || org.chapter || 'Alpha chapter'}</p>
            </div>

            <div className="flex justify-between items-center text-[10px] text-blue-200 font-bold border-t border-white/10 pt-3">
              <span>Member Card</span>
              <span>Expires: 31-Dec-2026</span>
            </div>
          </div>

          <button
            onClick={handlePDFDownload}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#0d4697] px-4 py-2.5 text-xs font-extrabold text-white hover:bg-blue-800"
          >
            <Download className="h-4 w-4" />
            Download Card as PDF
          </button>
        </section>

        {/* QR Attendance checkin check box */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Camera className="h-5 w-5 text-[#0d4697]" />
            QR Session Check-In
          </h3>
          <p className="text-xs font-semibold text-slate-500">
            Coordinator will display meeting QR check-in codes. Scan or input token code below to mark present.
          </p>

          <form onSubmit={handleQRCheckIn} className="flex gap-2">
            <input 
              type="text" 
              value={qrToken}
              onChange={(e) => setQrToken(e.target.value)}
              placeholder="Input meeting QR token code..." 
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#0d4697]"
            />
            <button 
              type="submit" 
              disabled={scanning}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-700 disabled:opacity-50 shrink-0"
            >
              {scanning ? 'Validating...' : 'Mark Present'}
            </button>
          </form>
        </section>
      </div>

      {/* Right pane - AI Insights */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#ffbf1a] fill-[#ffbf1a]" />
          AI Performance Analytics Insights
        </h3>

        <div className="space-y-4">
          {insights.map((insight, idx) => (
            <div key={idx} className="rounded-xl bg-slate-50 border border-slate-100 p-4 flex gap-3 text-xs leading-relaxed">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-50 text-[#0d4697] shrink-0">
                <Compass className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="font-extrabold text-slate-800">Gloaro AI Recommendation</p>
                <p className="text-slate-500 mt-1 font-semibold">{insight}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
