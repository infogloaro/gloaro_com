import {
  Activity,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CreditCard,
  FileBarChart,
  FileText,
  Heart,
  HelpCircle,
  Home,
  KeyRound,
  LayoutDashboard,
  LayoutGrid,
  ListTree,
  Lock,
  MapPinned,
  Network,
  Package,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Star,
  Ticket,
  ToggleLeft,
  Users,
  Workflow,
  PlusCircle,
  ClipboardList,
  Gem,
  TrendingUp,
  Volume2,
  Handshake,
  Trophy,
  Calendar,
  Sparkles,
  QrCode,
  MessageSquare,
  ClipboardCheck,
  User,
} from 'lucide-react'

export const adminNav = [
  ['Dashboard', '/admin', LayoutDashboard],
  {
    label: 'Organization Management',
    icon: Building2,
    children: [
      ['Locations', '/admin/locations', MapPinned],
    ],
  },
  {
    label: 'Super Admin',
    icon: ShieldCheck,
    children: [
      ['Admin Management', '/admin/admin-management', Users],
      ['Assignments', '/admin/assignments', Workflow],
      ['Roles', '/admin/roles', ShieldCheck],
      ['Permissions', '/admin/permissions', KeyRound],
      ['Feature Management', '/admin/features', ToggleLeft],
      ['Dashboard Config', '/admin/dashboard-config', LayoutGrid],
      ['Module Config', '/admin/module-config', Settings],
      ['Workflow Settings', '/admin/membership-workflow', Workflow],
      ['Workflow Engine', '/admin/workflow-engine', Workflow],
      ['Tasks', '/admin/tasks', Activity],
      ['Calendar', '/admin/calendar', CalendarDays],
    ],
  },
  {
    label: 'Membership',
    icon: CreditCard,
    children: [
      ['Memberships', '/admin/memberships', CreditCard],
      ['Membership Plans', '/admin/plans', CreditCard],
      ['Visitors', '/admin/visitors', Users],
      ['Visitor Conversion', '/admin/visitor-conversion', Workflow],
      ['Attendance', '/admin/attendance', Activity],
      ['Meetings', '/admin/meetings', CalendarDays],
      ['Chapters', '/admin/chapters', Network],
      ['Referrals', '/admin/referrals', Ticket],
    ],
  },
  {
    label: 'Directory',
    icon: Building2,
    children: [
      ['Users', '/admin/users', Users],
      ['Vendors', '/admin/vendors', Building2],
      ['Vendor Settings', '/admin/vendor-settings', Settings],
      ['Vendor Approval', '/admin/vendor-approval-workflow', Workflow],
      ['Business', '/admin/business', BriefcaseBusiness],
      ['Business Wall', '/admin/business-wall', Network],
      ['Categories', '/admin/categories', ListTree],
    ],
  },
  {
    label: 'Marketplace',
    icon: ShoppingBag,
    children: [
      ['Products', '/admin/products', Package],
      ['Services', '/admin/services', BriefcaseBusiness],
      ['Marketplace Settings', '/admin/marketplace-settings', Settings],
      ['Marketplace Approval', '/admin/marketplace-approval', Workflow],
    ],
  },
  {
    label: 'Applications',
    icon: FileText,
    children: [
      ['All Applications', '/admin/applications', FileText],
      ['Membership', '/admin/applications/membership', CreditCard],
      ['Franchise', '/admin/applications/franchise', BriefcaseBusiness],
      ['Business Network', '/admin/applications/business-network', Network],
      ['Vendor', '/admin/applications/vendor', Building2],
    ],
  },
  ['Meetings', '/admin/meeting-settings', CalendarDays],
  ['Events', '/admin/events', CalendarDays],
  ['Training', '/admin/training', Star],
  ['Testimonials', '/admin/testimonials', FileText],
  ['Banners', '/admin/banners', FileText],
  ['FAQs', '/admin/faqs', HelpCircle],
  ['Support', '/admin/support', HelpCircle],
  ['Reports', '/admin/reports', FileBarChart],
  ['Analytics', '/admin/analytics', BarChart3],
  ['Executive Dashboard', '/admin/executive-dashboard', BarChart3],
  ['Scorecards', '/admin/scorecards', Activity],
  ['Member Journey', '/admin/member-journey', Workflow],
  ['Activity Center', '/admin/activity', Activity],
  ['Global Search', '/admin/global-search', Search],
  ['Notification Center', '/admin/notifications', Bell],
  ['Notification Automation', '/admin/notification-automation', Workflow],
  ['AI Insights', '/admin/ai-insights', Star],
  ['Settings', '/admin/settings', Settings],
  ['Audit Logs', '/admin/audit-logs', FileText],
  ['System Logs', '/admin/system-logs', Lock],
]

export const vendorNav = [
  ['Dashboard', '/vendor', LayoutDashboard],
  ['Business Profile', '/vendor/profile', Building2],
  ['Products', '/vendor/products', Package],
  ['Services', '/vendor/services', BriefcaseBusiness],
  ['Leads', '/vendor/leads', Ticket],
  ['Reviews', '/vendor/reviews', Star],
  ['Membership', '/vendor/membership', CreditCard],
  ['Payments', '/vendor/payments', CreditCard],
  ['Notifications', '/vendor/notifications', Bell],
  ['Support', '/vendor/support', HelpCircle],
]

export const customerNav = [
  ['Home', '/', Home],
  ['Nearby', '/nearby', Building2],
  ['Categories', '/categories', ListTree],
  ['Vendors', '/vendors', Building2],
  ['Products', '/products', ShoppingBag],
  ['Services', '/services', BriefcaseBusiness],
  ['Wishlist', '/customer/wishlist', Heart],
  ['Referral', '/customer/referral', Ticket],
  ['Events', '/events', CalendarDays],
  ['Notifications', '/customer/notifications', Bell],
  ['Profile', '/customer/profile', Users],
  ['Support', '/customer/support', HelpCircle],
]

export const membershipNav = [
  ['Dashboard', '/membership/dashboard', LayoutDashboard],
  ['Benefits', '/membership/benefits', Star],
  ['Events', '/membership/events', CalendarDays],
  ['Referral', '/membership/referral', Ticket],
  ['Notifications', '/membership/notifications', Bell],
  ['Profile', '/membership/profile', Users],
  ['Support', '/membership/support', HelpCircle],
]

export const memberNav = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    children: [
      ['Overview', '/member/dashboard', Gem],
      ['Analytics (BI)', '/member/dashboard/analytics', FileBarChart],
      ['Chapter Performance', '/member/dashboard/performance', TrendingUp],
    ],
  },
  {
    label: 'Community',
    icon: Network,
    children: [
      ['Business Wall', '/member/dashboard/wall', Volume2],
      ['Referrals', '/member/dashboard/referrals', Handshake],
      ['Business Directory', '/member/dashboard/directory', Users],
      ['Leaderboard', '/member/dashboard/leaderboard', Trophy],
      ['Visitors', '/member/dashboard/visitors', Ticket],
    ],
  },
  {
    label: 'Marketplace',
    icon: ShoppingBag,
    children: [
      ['Products', '/products', ShoppingBag],
      ['Services', '/services', BriefcaseBusiness],
      ['Vendors', '/vendors', Users],
      ['Become a Vendor', '/member/vendor-application', PlusCircle],
      ['My Vendor Application', '/member/vendor-application', FileText],
      ['Application Status', '/member/vendor-application-status', ClipboardList],
      ['Wishlist', '/customer/wishlist', Heart],
      ['Orders', '/customer/wishlist', ShoppingBag],
    ],
  },
  {
    label: 'Meetings',
    icon: CalendarDays,
    children: [
      ['Meetings & Attendance', '/member/dashboard/meetings', ClipboardList],
      ['One-to-Ones', '/member/dashboard/one-to-ones', Users],
      ['Unified Calendar', '/member/dashboard/calendar', Calendar],
    ],
  },
  {
    label: 'Chapter',
    icon: Building2,
    children: [
      ['My Chapter', '/member/dashboard/chapter', Building2],
      ['AI Insights', '/member/dashboard/digital-card', Sparkles],
      ['Digital Member Card', '/member/dashboard/digital-card', QrCode],
    ],
  },
  {
    label: 'Collaboration',
    icon: MessageSquare,
    children: [
      ['Lobby Chat', '/member/dashboard/chat', MessageSquare],
      ['Tasks', '/member/dashboard/tasks', ClipboardCheck],
      ['Support Tickets', '/customer/support', HelpCircle],
    ],
  },
  {
    label: 'Account',
    icon: User,
    children: [
      ['Profile', '/member/profile', User],
      ['Settings', '/member/settings', Settings],
    ],
  },
]

export const secretaryNav = [
  ['Dashboard', '/secretary/dashboard', LayoutDashboard],
  ['Members', '/secretary/members', Users],
  ['Minutes', '/secretary/minutes', FileText],
  ['Attendance', '/secretary/attendance', CalendarDays],
  ['Documents', '/secretary/documents', ShoppingBag],
  ['Reports', '/secretary/reports', BarChart3],
  ['Settings', '/secretary/settings', Settings],
]

export const stateDirectorNav = [
  ['Dashboard', '/state-director/dashboard', LayoutDashboard],
  {
    label: 'Organization Master',
    icon: Building2,
    children: [
      ['Districts', '/state-director/districts', MapPinned],
    ],
  },
  ['District Directors', '/state-director/district-directors', Users],
  ['Memberships', '/state-director/memberships', CreditCard],
  ['Reports', '/state-director/reports', FileBarChart],
]

export const districtDirectorNav = [
  ['Dashboard', '/district-director/dashboard', LayoutDashboard],
  {
    label: 'Organization Master',
    icon: Building2,
    children: [
      ['Chapters', '/district-director/chapters', MapPinned],
    ],
  },
  ['Executive Directors', '/district-director/executive-directors', Users],
  ['Memberships', '/district-director/memberships', CreditCard],
  ['Reports', '/district-director/reports', FileBarChart],
]

export const chapterDirectorNav = [
  ['Dashboard', '/chapter-director/dashboard', LayoutDashboard],
  ['President', '/chapter-director/president', Users],
  ['Members', '/chapter-director/members', Users],
  ['Memberships', '/chapter-director/memberships', CreditCard],
  ['Launch Directors', '/chapter-director/launch-directors', Users],
  ['Membership Approvals', '/chapter-director/memberships', CreditCard],
  ['Reports', '/chapter-director/reports', FileBarChart],
]

export const presidentNav = [
  ['Dashboard', '/president/dashboard', LayoutDashboard],
  ['Vice Presidents', '/president/vice-presidents', Users],
  ['Reports', '/president/reports', FileBarChart],
]

export const vicePresidentNav = [
  ['Dashboard', '/vice-president/dashboard', LayoutDashboard],
  ['Secretaries', '/vice-president/secretaries', Users],
  ['Members', '/vice-president/members', Users],
  ['Member Registration', '/vice-president/register-member', Users],
  ['Reports', '/vice-president/reports', FileBarChart],
]

