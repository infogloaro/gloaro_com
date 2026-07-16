import {
  Activity,
  Award,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Clock,
  CreditCard,
  FileBarChart,
  FileText,
  Folder,
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
      ['Membership Applications', '/admin/applications/membership', ClipboardList],
      ['Memberships', '/admin/memberships', CreditCard],
      ['Membership Plans', '/admin/plans', CreditCard],
      ['Members', '/admin/members', Users],
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

export const memberNav = [];
export const secretaryNav = [];
export const stateDirectorNav = [];
export const districtDirectorNav = [];
export const chapterDirectorNav = [];
export const presidentNav = [];
export const vicePresidentNav = [];
export const regionDirectorNav = [];

export const rolePrefixes = {
  superadmin: '/admin',
  admin: '/admin',
  customer: '/member/dashboard',
  user: '/member/dashboard',
  vendor: '/member/dashboard',
  secretary: '/secretary',
  vice_president: '/vice-president',
  chapter_president: '/president',
  executive_director: '/chapter-director',
  district_director: '/district-director',
  state_director: '/state-director',
  region_director: '/region-director',
  launch_director: '/launch-director',
  direct_consultant: '/direct-consultant'
};

const commonModules = [
  ['Dashboard', '', LayoutDashboard],
  {
    label: 'Community',
    icon: Network,
    children: [
      ['Business Wall', '/wall', Volume2],
      ['Referrals', '/referrals', Handshake],
      ['Business Directory', '/directory', Users],
      ['Leaderboard', '/leaderboard', Trophy],
      ['Visitors', '/visitors', Ticket]
    ]
  },
  {
    label: 'Marketplace',
    icon: ShoppingBag,
    children: [
      ['Products', '/products', Package],
      ['Services', '/services', BriefcaseBusiness],
      ['Vendors', '/vendors', Users],
      ['Orders', '/orders', ShoppingBag],
      ['Payments', '/payments', CreditCard],
      ['Subscription', '/subscription', ToggleLeft]
    ]
  },
  {
    label: 'Meetings',
    icon: CalendarDays,
    children: [
      ['Meetings', '/meetings', CalendarDays],
      ['Attendance', '/attendance', ClipboardList],
      ['One-to-Ones', '/one-to-ones', Clock]
    ]
  },
  {
    label: 'Chapter',
    icon: Building2,
    children: [
      ['My Chapter', '/chapter', Building2],
      ['AI Insights', '/ai-insights', Sparkles],
      ['Digital Member Card', '/digital-card', QrCode]
    ]
  },
  {
    label: 'Collaboration',
    icon: MessageSquare,
    children: [
      ['Tasks', '/tasks', ClipboardCheck],
      ['Chat', '/chat', MessageSquare],
      ['Help Desk', '/help-desk', HelpCircle]
    ]
  },
  {
    label: 'Account',
    icon: User,
    children: [
      ['Profile', '/profile', User],
      ['Settings', '/settings', Settings]
    ]
  }
];

const roleModules = {
  secretary: [
    ['Members', '/members', Users],
    ['Minutes', '/minutes', FileText],
    ['Documents', '/documents', Folder],
    ['Reports', '/reports', FileBarChart],
    ['Meeting Records', '/meeting-records', ClipboardList]
  ],
  vice_president: [
    ['Member Registration', '/register-member', Users],
    ['Membership Applications', '/membership-applications', FileText],
    ['Secretaries', '/secretaries', Users],
    ['Approved Vendors', '/admin/approved-vendors', Building2],
    ['Reports', '/reports', FileBarChart],
    ['Announcements', '/announcements', Bell]
  ],
  chapter_president: [
    ['Vice Presidents', '/vice-presidents', Users],
    ['Chapter Reports', '/reports', FileBarChart],
    ['Vendor Approvals', '/admin/applications/vendor', Building2],
    ['Leadership', '/leadership', Award]
  ],
  executive_director: [
    ['Chapter Management', '/chapter-management', Settings],
    ['Chapter Presidents', '/presidents', Users],
    ['Vice Presidents', '/vice-presidents', Users],
    ['Secretaries', '/secretaries', Users],
    ['Assigned Members', '/members', Users],
    ['Membership Applications', '/membership-applications', ClipboardList],
    ['Membership Status', '/memberships', CreditCard],
    ['Vendor Applications', '/vendor-applications', BriefcaseBusiness],
    ['Approved Vendors', '/approved-vendors', Building2]
  ],
  chapter_director: [
    ['Chapter Management', '/chapter-management', Settings],
    ['Chapter Presidents', '/presidents', Users],
    ['Vice Presidents', '/vice-presidents', Users],
    ['Secretaries', '/secretaries', Users],
    ['Assigned Members', '/members', Users],
    ['Membership Applications', '/membership-applications', ClipboardList],
    ['Membership Status', '/memberships', CreditCard],
    ['Vendor Applications', '/vendor-applications', BriefcaseBusiness],
    ['Approved Vendors', '/approved-vendors', Building2]
  ],
  district_director: [
    ['District Overview', '/district-management', Settings],
    ['Chapters', '/chapters', Building2],
    ['Chapter Directors', '/chapter-directors', Users],
    ['Executive Directors', '/executive-directors', Users],
    ['Membership Requests', '/memberships', CreditCard],
    ['Active Members', '/members', Users],
    ['Pending Members', '/memberships', CreditCard],
    ['Vendor Applications', '/vendor-applications', BriefcaseBusiness],
    ['Approved Vendors', '/approved-vendors', Building2]
  ],
  state_director: [
    ['District Directors', '/district-directors', Users],
    ['State Analytics', '/analytics', FileBarChart]
  ],
  region_director: [
    ['State Directors', '/state-directors', Users],
    ['Regional Analytics', '/analytics', FileBarChart]
  ],
  launch_director: [
    ['Assigned Chapters', '/chapters', Building2],
    ['Chapter Launch Status', '/chapter-launch', Settings],
    ['Membership Applications', '/membership-applications', CreditCard],
    ['Membership Verification', '/membership-verification', ShieldCheck],
    ['Chapter Presidents', '/presidents', Users],
    ['Vice Presidents', '/vice-presidents', Users],
    ['Approved Vendors', '/admin/approved-vendors', Building2],
    ['Vendor Applications', '/vendor-applications', BriefcaseBusiness],
    ['Launch Reports', '/launch-reports', FileBarChart],
    ['Membership Reports', '/membership-reports', FileBarChart],
    ['Vendor Reports', '/vendor-reports', FileBarChart]
  ],
  direct_consultant: [
    ['Vendor Applications', '/vendor-applications', BriefcaseBusiness],
    ['Approved Vendors', '/approved-vendors', Building2],
    ['Assigned Members', '/members', Users],
    ['Membership Status', '/membership-applications', CreditCard]
  ]
};

export function getSidebarNav(role) {
  if (['superadmin', 'admin'].includes(role)) {
    return adminNav;
  }

  const prefix = rolePrefixes[role] || '/member/dashboard';

  const prefixItem = (item) => {
    if (Array.isArray(item)) {
      const [label, to, icon] = item;
      const finalPath = (to.startsWith('/admin/') || to === '/admin' || to.startsWith('/member/') || to === '/member') ? to : `${prefix}${to}`;
      return [label, finalPath, icon];
    }
    return {
      ...item,
      children: item.children.map(prefixItem)
    };
  };

  const base = commonModules.map(item => {
    if (item.label === 'Account') {
      const children = [...item.children];
      if (['customer', 'user', 'vendor'].includes(role)) {
        children.splice(1, 0, ['Membership Application Status', '/member/membership-application-status', ClipboardCheck]);
      }
      return prefixItem({
        ...item,
        children
      });
    }
    return prefixItem(item);
  });

  const extra = (roleModules[role] || []).map(prefixItem);

  return [...base, ...extra];
}


