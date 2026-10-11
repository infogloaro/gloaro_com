// What the client gets at each journey step, in plain words. Used for the
// floating chips on the step pictures and, on phones, as tags under them.
import {
  BadgeCheck,
  CalendarCheck,
  FileText,
  Link2,
  LifeBuoy,
  ListChecks,
  MessageSquare,
  MousePointerClick,
  Palette,
  Phone,
  Rocket,
  ShieldCheck,
  Smartphone,
  Target,
} from 'lucide-react'

export const JOURNEY_CHIPS = {
  Discover: [
    { Icon: Phone, color: '#1b6fe0', label: 'We listen first', className: 'left-[6%] bottom-[24%]', delay: 0 },
    { Icon: Target, color: '#ff7a00', label: 'Your goals, written down', className: 'left-[34%] bottom-[8%]', delay: 0.1, float: '8s' },
    { Icon: ListChecks, color: '#17a589', label: 'Feature list', className: 'right-[4%] bottom-[26%]', delay: 0.2, float: '6.5s' },
    { Icon: FileText, color: '#7c5cff', label: 'Clear quote', className: 'right-[6%] top-[4%]', delay: 0.3, float: '7.5s' },
  ],
  Design: [
    { Icon: MousePointerClick, color: '#1b6fe0', label: 'Click through it yourself', className: 'left-[5%] bottom-[16%]', delay: 0 },
    { Icon: Palette, color: '#ff7a00', label: 'In your brand', className: 'left-[44%] bottom-[5%]', delay: 0.1, float: '8s' },
    { Icon: Smartphone, color: '#17a589', label: 'Mobile + web', className: 'right-[3%] top-[4%]', delay: 0.2, float: '6.5s' },
    { Icon: MessageSquare, color: '#7c5cff', label: 'Your feedback, then changes', className: 'left-[24%] top-[4%]', delay: 0.3, float: '7.5s' },
  ],
  Develop: [
    { Icon: Link2, color: '#1b6fe0', label: 'Preview link to try', className: 'left-[5%] bottom-[18%]', delay: 0 },
    { Icon: CalendarCheck, color: '#ff7a00', label: 'Regular demos', className: 'left-[40%] bottom-[6%]', delay: 0.1, float: '8s' },
    { Icon: BadgeCheck, color: '#17a589', label: 'Tested before release', className: 'right-[4%] bottom-[16%]', delay: 0.2, float: '6.5s' },
    { Icon: ShieldCheck, color: '#7c5cff', label: 'Secure by design', className: 'right-[8%] top-[4%]', delay: 0.3, float: '7.5s' },
  ],
  Deploy: [
    { Icon: Rocket, color: '#17a589', label: 'Live for your customers', className: 'left-[20%] top-[4%]', delay: 0 },
    { Icon: Smartphone, color: '#1b6fe0', label: 'Web + app stores', className: 'right-[4%] top-[4%]', delay: 0.1, float: '8s' },
    { Icon: ShieldCheck, color: '#7c5cff', label: 'Monitored after launch', className: 'left-[4%] bottom-[6%]', delay: 0.2, float: '6.5s' },
    { Icon: LifeBuoy, color: '#ff7a00', label: 'Ongoing support', className: 'right-[6%] bottom-[8%]', delay: 0.3, float: '7.5s' },
  ],
}
