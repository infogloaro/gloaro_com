import { useRef } from 'react'
import { motion } from 'framer-motion'
import {
  BadgeCheck, BellRing, Check, Clapperboard, FileText, Globe, Image as ImageIcon, MapPin, MessageCircle,
  MousePointerClick, Navigation, Phone, Search, Star, Target, Users, Wallet,
} from 'lucide-react'
import { ease } from '../../../lib/motion'
import { useAmbient } from '../../../hooks/useMotionEnv'
import { mediaUrl } from '../media'

// Desktop-style product mockups for the service explorer. Everything is real
// markup; any figures are labelled as sample data, never as client results.

const stagger = (i, base = 0.08) => ({
  initial: { opacity: 0, y: 14, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: ease.entrance, delay: base * i },
})

export function BrowserFrame({ url, children, className = '' }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-[#08224B]/10 bg-white shadow-[0_30px_70px_-30px_rgba(8,34,75,0.45)] ${className}`}>
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffc94d]/90" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3ccf7a]/80" />
        </span>
        <span className="mx-auto max-w-[70%] truncate rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-slate-500 shadow-sm">{url}</span>
        <span className="w-10" aria-hidden="true" />
      </div>
      {children}
    </div>
  )
}

function SampleTag({ children = 'Sample data · illustrative' }) {
  return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-800">{children}</span>
}

const calendar = [
  ['Mon', 'school/post.webp', 'Post', 'Approved'],
  ['Tue', 'restaurant/post.webp', 'Reel', 'Scheduled'],
  ['Wed', 'furniture/post.webp', 'Carousel', 'Approved'],
  ['Thu', 'appliances/reel.webp', 'Reel', 'Draft'],
  ['Fri', 'wellness/post.webp', 'Story', 'Scheduled'],
  ['Sat', 'healthcare/post.webp', 'Post', 'Approved'],
  ['Sun', 'restaurant/ad.webp', 'Reel', 'Scheduled'],
]
const statusTone = { Approved: 'bg-emerald-100 text-emerald-700', Scheduled: 'bg-blue-100 text-blue-700', Draft: 'bg-slate-100 text-slate-600' }

export function ContentCalendar() {
  return (
    <BrowserFrame url="Content calendar · Week 2">
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <p className="font-outfit text-base font-semibold text-[#08224B]">This week’s content</p>
          <span className="flex gap-1.5 text-[10px] font-bold text-slate-500">
            <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1"><ImageIcon className="h-3 w-3" />Posts</span>
            <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1"><Clapperboard className="h-3 w-3" />Reels</span>
          </span>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
          {calendar.map(([day, image, type, status], i) => (
            <motion.div key={day} {...stagger(i, 0.06)} className={`overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm ${i > 3 ? 'hidden sm:block' : ''}`}>
              <p className="px-2 pt-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">{day}</p>
              <div className="relative mx-1.5 mt-1 overflow-hidden rounded-lg">
                <img src={mediaUrl(image)} alt="" loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover" />
                {type === 'Reel' && <Clapperboard className="absolute right-1 top-1 h-3.5 w-3.5 text-white drop-shadow" />}
              </div>
              <div className="flex flex-col gap-1 p-1.5">
                <span className="text-[10px] font-bold text-[#08224B]">{type}</span>
                <span className={`w-max rounded-full px-1.5 py-0.5 text-[9px] font-bold ${statusTone[status]}`}>{status}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div {...stagger(8)} className="mt-4 flex items-center gap-3 rounded-xl bg-[#fdf2f6] p-3">
          <BadgeCheck className="h-5 w-5 shrink-0 text-[#d6336c]" />
          <p className="text-xs font-semibold text-[#08224B]">You approve every post before it goes live. Festivals and offers are planned a month ahead.</p>
        </motion.div>
      </div>
    </BrowserFrame>
  )
}

const setup = [
  [Target, 'Objective', 'Leads · WhatsApp messages'],
  [Users, 'Audience', 'Within 10 km · Age 25–55 · Home décor'],
  [Wallet, 'Budget', 'Daily limit you approve'],
  [ImageIcon, 'Creatives', 'Feed, Story & Reel formats'],
]
const sampleBars = [['Reach', 0.92], ['Clicks', 0.55], ['Messages', 0.34], ['Enquiries', 0.22]]

export function AdsDashboard() {
  return (
    <BrowserFrame url="Ads Manager · Showroom campaign">
      <div className="grid gap-4 p-4 sm:grid-cols-[1.1fr_1fr] sm:p-5">
        <div>
          <p className="font-outfit text-base font-semibold text-[#08224B]">Campaign setup</p>
          <ol className="mt-3 space-y-2">
            {setup.map(([Icon, label, value], i) => (
              <motion.li key={label} {...stagger(i)} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#1b6fe0]/10 text-[#1b6fe0]"><Icon className="h-4 w-4" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
                  <span className="block truncate text-xs font-semibold text-[#08224B]">{value}</span>
                </span>
                <Check className="h-4 w-4 shrink-0 text-emerald-500" />
              </motion.li>
            ))}
          </ol>
          <motion.div {...stagger(5)} className="mt-4 rounded-xl border border-slate-100 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-[#08224B]">Weekly report</p>
              <SampleTag />
            </div>
            <div className="mt-3 space-y-2">
              {sampleBars.map(([label, value], i) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="w-16 text-[10px] font-semibold text-slate-500">{label}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <motion.span
                      className="block h-full origin-left rounded-full bg-[#1b6fe0]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: value }}
                      transition={{ duration: 0.9, ease: ease.entrance, delay: 0.6 + i * 0.12 }}
                    />
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <motion.div {...stagger(3)} className="mx-auto w-full max-w-[250px] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg">
          <div className="flex items-center gap-2 p-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#a0673a] text-[9px] font-black text-white">TS</span>
            <span className="leading-tight">
              <span className="block text-[11px] font-bold text-[#08224B]">Teakline Studio</span>
              <span className="block text-[9px] text-slate-400">Sponsored</span>
            </span>
          </div>
          <p className="px-2.5 pb-2 text-[11px] text-slate-700">Bedroom sets made to your size. Free design consultation this month.</p>
          <img src={mediaUrl('furniture/ad.webp')} alt="" loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover" />
          <div className="flex items-center justify-between gap-2 bg-slate-50 p-2.5">
            <span className="min-w-0">
              <span className="block truncate text-[9px] uppercase text-slate-400">teakline.example</span>
              <span className="block truncate text-[11px] font-bold text-[#08224B]">Book a showroom visit</span>
            </span>
            <span className="flex shrink-0 items-center gap-1 rounded-md bg-[#25D366] px-2 py-1.5 text-[10px] font-bold text-white"><MessageCircle className="h-3 w-3" />WhatsApp</span>
          </div>
          <p className="border-t border-slate-100 px-2.5 py-1.5 text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">Example ad · fictional brand</p>
        </motion.div>
      </div>
    </BrowserFrame>
  )
}

const profileChecks = ['Categories & services', 'Photos & opening hours', 'Weekly profile posts', 'Review replies']

export function SearchMockup() {
  return (
    <BrowserFrame url="Search · sofa showroom near me">
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-700 shadow-sm">
          <Search className="h-4 w-4 text-slate-400" />sofa showroom near me
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-[1.25fr_1fr]">
          <div className="space-y-2">
            <motion.div {...stagger(0)} className="relative h-28 overflow-hidden rounded-xl bg-[#e8eef3] [background-image:linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:20px_20px]">
              <span className="absolute -left-4 top-1/2 h-3 w-[130%] rotate-[-6deg] bg-white" />
              <span className="absolute left-[40%] top-0 h-full w-3 rotate-[12deg] bg-white" />
              {[[22, 30, false], [58, 55, true], [78, 25, false]].map(([x, y, mine]) => (
                <MapPin key={x} className={`absolute h-7 w-7 -translate-x-1/2 -translate-y-full drop-shadow ${mine ? 'fill-[#ea4335] text-white' : 'fill-slate-400 text-white'}`} style={{ left: `${x}%`, top: `${y + 30}%` }} />
              ))}
            </motion.div>
            {[['Your Business', 'Furniture store · Open now', true], ['Showroom B', 'Furniture store', false], ['Showroom C', 'Home décor', false]].map(([name, meta, mine], i) => (
              <motion.div key={name} {...stagger(i + 1)} className={`flex items-center justify-between rounded-xl p-2.5 ${mine ? 'border-2 border-[#188038]/40 bg-[#e6f4ea]/50' : 'border border-slate-100'}`}>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#1a0dab]">{name}{mine && <span className="rounded bg-[#188038] px-1.5 py-0.5 text-[8px] font-black uppercase text-white">Your listing</span>}</span>
                  <span className="block truncate text-[10px] text-slate-500">{meta}</span>
                </span>
                <span className="flex gap-1.5 text-[#1a73e8]"><Phone className="h-3.5 w-3.5" /><Navigation className="h-3.5 w-3.5" /></span>
              </motion.div>
            ))}
          </div>
          <motion.div {...stagger(2)} className="rounded-xl border border-slate-100 p-3 shadow-sm">
            <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-lg">
              {['furniture/post.webp', 'furniture/reel.webp', 'furniture/ad.webp'].map((image) => (
                <img key={image} src={mediaUrl(image)} alt="" loading="lazy" decoding="async" className="aspect-square w-full object-cover" />
              ))}
            </div>
            <p className="mt-2 text-sm font-bold text-[#08224B]">Your Business</p>
            <p className="flex items-center gap-1 text-[10px] text-slate-500"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />Reviews · Furniture store</p>
            <ul className="mt-3 space-y-1.5">
              {profileChecks.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.18, duration: 0.35 }}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-[#08224B]"
                >
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-[#188038] text-white"><Check className="h-2.5 w-2.5" /></span>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </BrowserFrame>
  )
}

const flow = [
  [MousePointerClick, 'Ad or post', 'Customer taps “Send message” or “Learn more”'],
  [FileText, 'Landing page', 'Short form: name, phone, requirement'],
  [MessageCircle, 'WhatsApp reply', '“Thanks! Here is our catalogue…” sent instantly'],
  [BellRing, 'Team follow-up', 'Reminder: call back at 4 PM'],
]

export function LeadFlow() {
  const ref = useRef(null)
  const active = useAmbient(ref, { priority: 1, amount: 0.4 })
  return (
    <BrowserFrame url="Lead journey · automation">
      <div ref={ref} className="p-4 sm:p-6">
        <p className="font-outfit text-base font-semibold text-[#08224B]">From first tap to follow-up</p>
        <div className="relative mt-5">
          <span aria-hidden="true" className="absolute left-5 top-5 h-[calc(100%-2.5rem)] w-0.5 bg-slate-200 sm:left-0 sm:top-5 sm:h-0.5 sm:w-full" />
          {active && (
            <motion.span
              aria-hidden="true"
              className="absolute left-[15px] top-5 hidden h-3 w-3 rounded-full bg-[#00a884] shadow-[0_0_0_6px_rgba(0,168,132,0.2)] sm:block"
              animate={{ left: ['0%', '100%'] }}
              transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.6 }}
              style={{ top: 14 }}
            />
          )}
          <ol className="relative grid gap-4 sm:grid-cols-4">
            {flow.map(([Icon, title, text], i) => (
              <motion.li key={title} {...stagger(i, 0.12)} className="flex gap-3 sm:flex-col">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-4 border-white bg-[#00a884] text-white shadow-md"><Icon className="h-4 w-4" /></span>
                <span>
                  <span className="block text-xs font-extrabold text-[#08224B]">{title}</span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">{text}</span>
                </span>
              </motion.li>
            ))}
          </ol>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <motion.div {...stagger(5)} className="rounded-xl bg-[#efeae2] p-3">
            <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-500">WhatsApp Business</p>
            <p className="ml-auto w-max max-w-[85%] rounded-xl rounded-tr-sm bg-[#d9fdd3] px-2.5 py-1.5 text-[11px] text-[#111b21]">Hi, I filled the form for the sofa offer</p>
            <p className="mt-1.5 w-max max-w-[85%] rounded-xl rounded-tl-sm bg-white px-2.5 py-1.5 text-[11px] text-[#111b21]">Thanks for reaching out! 😊 Here’s our catalogue. When would you like to visit?</p>
            <p className="mt-1 text-[9px] font-bold text-slate-500">Automated reply</p>
          </motion.div>
          <motion.div {...stagger(6)} className="rounded-xl border border-slate-100 p-3">
            <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-500">Follow-up list</p>
            {[['New enquiry · sofa set', 'Call back 4:00 PM', true], ['Catalogue sent', 'Follow up tomorrow', false], ['Showroom visit booked', 'Saturday 11 AM', false]].map(([title, when, urgent]) => (
              <p key={title} className="flex items-center justify-between border-b border-slate-100 py-1.5 text-[11px] last:border-0">
                <span className="font-semibold text-[#08224B]">{title}</span>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${urgent ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{when}</span>
              </p>
            ))}
          </motion.div>
        </div>
      </div>
    </BrowserFrame>
  )
}

const sources = [['WhatsApp', 0.48, '#00a884'], ['Calls', 0.3, '#1b6fe0'], ['Website forms', 0.22, '#CB9015']]

export function ReportMockup() {
  return (
    <BrowserFrame url="Monthly marketing report">
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-outfit text-base font-semibold text-[#08224B]">Monthly report</p>
          <SampleTag>Sample report · illustrative figures</SampleTag>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[['Content published', '16 posts · 6 Reels'], ['Profile actions', 'Calls · Directions · Website'], ['Ad campaigns', '2 active · 1 paused']].map(([label, value], i) => (
            <motion.div key={label} {...stagger(i)} className="rounded-xl border border-slate-100 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
              <p className="mt-1 text-xs font-bold text-[#08224B]">{value}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <motion.div {...stagger(3)} className="rounded-xl border border-slate-100 p-3">
            <p className="text-xs font-bold text-[#08224B]">Enquiries by source</p>
            <div className="mt-3 flex h-3 overflow-hidden rounded-full">
              {sources.map(([label, share, color], i) => (
                <motion.span
                  key={label}
                  initial={{ flexGrow: 0 }}
                  animate={{ flexGrow: share }}
                  transition={{ duration: 0.9, ease: ease.entrance, delay: 0.4 + i * 0.1 }}
                  style={{ background: color, flexBasis: 0 }}
                />
              ))}
            </div>
            <ul className="mt-2.5 space-y-1">
              {sources.map(([label, , color]) => (
                <li key={label} className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                  <span className="h-2 w-2 rounded-full" style={{ background: color }} />{label}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...stagger(4)} className="rounded-xl border border-slate-100 p-3">
            <p className="text-xs font-bold text-[#08224B]">Reviews &amp; reputation</p>
            <p className="mt-2 flex gap-0.5">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}</p>
            <p className="mt-1 text-[11px] text-slate-600">“Helpful staff and quick delivery.”</p>
            <p className="mt-1.5 rounded-lg bg-slate-50 p-2 text-[11px] text-[#08224B]"><span className="font-bold">Reply:</span> Thank you! We’re glad the delivery went smoothly.</p>
          </motion.div>
        </div>
        <motion.div {...stagger(5)} className="mt-3 flex items-start gap-3 rounded-xl bg-[#fdf9e9] p-3">
          <Globe className="mt-0.5 h-4 w-4 shrink-0 text-[#CB9015]" />
          <p className="text-xs font-semibold text-[#08224B]"><span className="font-extrabold">Next month:</span> test a new Reel format, refresh the offer creative and add FAQs to the landing page.</p>
        </motion.div>
      </div>
    </BrowserFrame>
  )
}

