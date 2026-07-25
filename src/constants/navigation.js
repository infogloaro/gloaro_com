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
  UserCheck,
  LogOut,
} from 'lucide-react'

import { buildAdminRoute, normalizeRole } from '../utils/permissions'
import { ROLES } from './roleConfig.js'

export const adminNav = [
  ['Dashboard', '/dashboard', LayoutDashboard],
  {
    label: 'Organization Management',
    icon: Building2,
    children: [
      ['Locations', '/locations', MapPinned],
    ],
  },
  {
    label: 'Super Admin',
    icon: ShieldCheck,
    children: [
      ['Admin Management', '/admin-management', Users],
      ['Assignments', '/assignments', Workflow],
      ['Roles', '/roles', ShieldCheck],
      ['Permissions', '/permissions', KeyRound],
      ['Feature Management', '/features', ToggleLeft],
      ['Dashboard Config', '/dashboard-config', LayoutGrid],
      ['Module Config', '/module-config', Settings],
      ['Workflow Settings', '/membership-workflow', Workflow],
      ['Workflow Engine', '/workflow-engine', Workflow],
      ['Tasks', '/tasks', Activity],
      ['Calendar', '/calendar', CalendarDays],
    ],
  },
  {
    label: 'Membership',
    icon: CreditCard,
    children: [
      ['Member Approval', '/applications/membership', ClipboardList],
      ['Membership Plans', '/plans', CreditCard],
      ['Members', '/members', Users],
      ['Visitors', '/visitors', Users],
      ['Visitor Conversion', '/visitor-conversion', Workflow],
      ['Attendance', '/attendance', Activity],
      ['Meetings', '/meetings', CalendarDays],
      ['Chapter Approvals', '/chapters', Network],
      ['Referrals', '/referrals', Ticket],
    ],
  },
  {
    label: 'Directory',
    icon: Building2,
    children: [
      ['Users', '/users', Users],
      ['Vendor Settings', '/vendor-settings', Settings],
      ['Business', '/business', BriefcaseBusiness],
      ['Business Wall', '/business-wall', Network],
      ['Categories', '/categories', ListTree],
    ],
  },
  {
    label: 'Marketplace',
    icon: ShoppingBag,
    children: [
      ['Vendors', '/vendors', Building2],
      ['Products', '/products', Package],
      ['Services', '/services', BriefcaseBusiness],
      ['Marketplace Approval', '/marketplace-approval', Workflow],
    ],
  },
  {
    label: 'Applications',
    icon: FileText,
    children: [
      ['All Applications', '/applications', FileText],
      ['Membership', '/applications/membership', CreditCard],
      ['Franchise', '/applications/franchise', BriefcaseBusiness],
      ['Business Network', '/applications/business-network', Network],
      ['Vendor', '/applications/vendor', Building2],
    ],
  },
  ['Meetings', '/meeting-settings', CalendarDays],
  ['Events', '/events', CalendarDays],
  ['Training', '/training', Star],
  ['Testimonials', '/testimonials', FileText],
  ['Banners', '/banners', FileText],
  ['FAQs', '/faqs', HelpCircle],
  ['Support', '/support', HelpCircle],
  ['Reports', '/reports', FileBarChart],
  ['Analytics', '/analytics', BarChart3],
  ['Executive Dashboard', '/executive-dashboard', BarChart3],
  ['Scorecards', '/scorecards', Activity],
  ['Member Journey', '/member-journey', Workflow],
  ['Activity Center', '/activity', Activity],
  ['Global Search', '/global-search', Search],
  ['Notification Center', '/notifications', Bell],
  ['Notification Automation', '/notification-automation', Workflow],
  ['AI Insights', '/ai-insights', Star],
  ['Settings', '/settings', Settings],
  ['Audit Logs', '/audit-logs', FileText],
  ['System Logs', '/system-logs', Lock],
]

export const vendorNav = [
  ['Dashboard', '/vendor', LayoutDashboard],
  ['Business Profile', '/vendor/profile', Building2],
  ['Products', '/vendor/products', Package],
  ['Services', '/vendor/services', BriefcaseBusiness],
  ['Orders', '/vendor/orders', ShoppingBag],
  ['Leads', '/vendor/leads', Ticket],
  ['Reviews', '/vendor/reviews', Star],
  ['Membership', '/vendor/membership', CreditCard],
  ['Payments', '/vendor/payments', CreditCard],
  ['Analytics', '/vendor/analytics', BarChart3],
  ['Notifications', '/vendor/notifications', Bell],
  ['Support', '/vendor/support', HelpCircle],
]

export const memberVendorNav = [
  ['Dashboard', '/member/dashboard', LayoutDashboard],
  ['Business Profile', '/member/dashboard/my-business', Building2],
  ['My Products', '/member/dashboard/products', Package],
  ['My Services', '/member/dashboard/services', BriefcaseBusiness],
  ['Orders', '/member/dashboard/orders', ShoppingBag],
  ['Leads', '/member/dashboard/leads', Ticket],
  ['Reviews', '/member/dashboard/reviews', Star],
  ['Payments', '/member/dashboard/payments', CreditCard],
  ['Membership', '/member/dashboard/subscription', ToggleLeft],
  ['Analytics', '/member/dashboard/vendor-analytics', BarChart3],
]

export const applicantNav = [
  ['Dashboard', '/member/membership-application-status', LayoutDashboard],
  ['Membership Application Status', '/member/membership-application-status', ClipboardCheck],
  ['Profile', '/member/profile', Users],
  ['Settings', '/member/settings', Settings],
  ['Logout', '__logout__', LogOut],
]

export const vendorApplicantNav = [
  ['Dashboard', '/vendor/onboarding-status', LayoutDashboard],
  ['Vendor Application Status', '/vendor/onboarding-status', ClipboardList],
  ['Profile', '/vendor/account', User],
  ['Settings', '/vendor/settings', Settings],
  ['Logout', '__logout__', LogOut],
]

export const vendorOnboardingNav = [
  ['Vendor Onboarding', '/vendor/onboarding', FileText],
  ['Application Status', '/vendor/onboarding-status', ClipboardList],
  ['Account', '/vendor/account', User],
]

export const memberOnboardingNav = [
  ['Membership Status', '/member/membership-application-status', ClipboardCheck],
  ['Profile', '/member/profile', User],
  ['Account', '/member/settings', Settings],
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
export const secretaryNav = [{ label: 'Secretary Dashboard', icon: ClipboardList, children: [['Events', '/events', CalendarDays], ['Reports', '/reports', FileBarChart]] }];
export const stateDirectorNav = [];
export const districtDirectorNav = [];
export const chapterDirectorNav = [];
export const presidentNav = [];
export const vicePresidentNav = [];
export const regionDirectorNav = [];

const removeMarketplaceSection = (navItems = []) => navItems.filter((_, index) => index !== 2)

const memberVendorMarketplaceChildren = [
  ['Business Profile', '/member/dashboard/my-business', Building2],
  ['Products', '/member/dashboard/products', Package],
  ['Services', '/member/dashboard/services', BriefcaseBusiness],
  ['Orders', '/member/dashboard/orders', ShoppingBag],
  ['Leads', '/member/dashboard/leads', Ticket],
  ['Reviews', '/member/dashboard/reviews', Star],
  ['Payments', '/member/dashboard/payments', CreditCard],
  ['Subscription', '/member/dashboard/subscription', ToggleLeft],
  ['Analytics', '/member/dashboard/vendor-analytics', BarChart3],
]

export function getMemberVendorSidebarNav(role) {
  return getSidebarNav(role).map((item) => {
    if (Array.isArray(item) || item.label !== 'Marketplace') {
      return item
    }

    return {
      ...item,
      children: memberVendorMarketplaceChildren,
    }
  })
}

export function getMemberSidebarNav(role) {
  return removeMarketplaceSection(getSidebarNav(role))
}

export function getApplicantSidebarNav() {
  return applicantNav
}

export function getVendorApplicantSidebarNav() {
  return vendorApplicantNav
}

export function getRoleBasedSidebarNav(role) {
  return getSidebarNav(role)
}

export const rolePrefixes = {
  [ROLES.SUPERADMIN]: '/admin',
  [ROLES.ADMIN]: '/admin',
  [ROLES.CUSTOMER]: '/member/dashboard',
  [ROLES.USER]: '/member/dashboard',
  [ROLES.VENDOR]: '/member/dashboard',
  [ROLES.SECRETARY]: '/secretary',
  [ROLES.VICE_PRESIDENT]: '/vice-president',
  [ROLES.CHAPTER_DIRECTOR]: '/chapter-director',
  [ROLES.CHAPTER_PRESIDENT]: '/president',
  [ROLES.EXECUTIVE_DIRECTOR]: '/chapter-director',
  [ROLES.DISTRICT_DIRECTOR]: '/district-director',
  [ROLES.STATE_DIRECTOR]: '/state-director',
  [ROLES.REGION_DIRECTOR]: '/region-director',
  [ROLES.LAUNCH_DIRECTOR]: '/launch-director',
  [ROLES.DIRECT_CONSULTANT]: '/direct-consultant'
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
      ['Vendor Applications', '/vendor-applications', Building2],
      ['Marketplace Approval', '/marketplace-approval', ShieldCheck],
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
  [ROLES.SECRETARY]: [
    ['Members', '/members', Users],
    ['Minutes', '/minutes', FileText],
    ['Documents', '/documents', Folder],
    ['Reports', '/reports', FileBarChart],
    ['Meeting Records', '/meeting-records', ClipboardList]
  ],
  [ROLES.VICE_PRESIDENT]: [
    ['Member Registration', '/register-member', Users],
    ['Membership Applications', '/membership-applications', ClipboardList],
    ['Approved Members', '/members', Users],
    ['Secretaries', '/secretaries', Users],
    ['Reports', '/reports', FileBarChart],
    ['Announcements', '/announcements', Bell]
  ],
  [ROLES.CHAPTER_PRESIDENT]: [
    ['Approved Members', '/members', Users],
    ['Vice Presidents', '/vice-presidents', Users],
    ['Chapter Reports', '/reports', FileBarChart],
    ['Leadership', '/leadership', Award]
  ],
  [ROLES.EXECUTIVE_DIRECTOR]: [
    ['Launch Directors', '/launch-directors', UserCheck],
    ['Approved Members', '/members', Users],
    ['Membership Applications', '/membership-applications', ClipboardList]
  ],
  [ROLES.CHAPTER_DIRECTOR]: [
    ['Launch Directors', '/launch-directors', UserCheck],
    ['Approved Members', '/members', Users],
    ['Membership Applications', '/membership-applications', ClipboardList]
  ],
  [ROLES.DISTRICT_DIRECTOR]: [
    ['Executive Directors', '/executive-directors', Users],
    ['Approved Members', '/members', Users]
  ],
  [ROLES.STATE_DIRECTOR]: [
    ['District Directors', '/district-directors', Users],
    ['Approved Members', '/members', Users],
    ['State Analytics', '/analytics', FileBarChart]
  ],
  [ROLES.REGION_DIRECTOR]: [
    ['State Directors', '/state-directors', Users],
    ['Approved Members', '/members', Users],
    ['Regional Analytics', '/analytics', FileBarChart]
  ],
  [ROLES.LAUNCH_DIRECTOR]: [
    ['Direct Consultants', '/direct-consultants', Users],
    ['Approved Members', '/members', Users],
    ['Launch Reports', '/launch-reports', FileBarChart],
    ['Membership Reports', '/membership-reports', FileBarChart]
  ],
  [ROLES.DIRECT_CONSULTANT]: [
    ['Chapter Presidents', '/presidents', Users],
    ['Approved Members', '/members', Users]
  ]
};

export function getSidebarNav(role) {
  const normalizedRole = normalizeRole(role)

  if ([ROLES.SUPERADMIN, ROLES.ADMIN].includes(role)) {
    const prefixPath = (item) => {
      if (Array.isArray(item)) {
        const [label, to, icon] = item;
        return [label, buildAdminRoute(role, to), icon];
      }
      return {
        ...item,
        children: item.children.map(prefixPath)
      };
    };
    return adminNav.map(prefixPath);
  }

  const prefix = rolePrefixes[normalizedRole] || '/member/dashboard';

  const prefixItem = (item) => {
    if (Array.isArray(item)) {
      const [label, to, icon] = item;
      const finalPath = (to.startsWith('/admin/') || to === '/admin' || to.startsWith('/member/') || to === '/member') || to.startsWith('/super-admin') ? to : `${prefix}${to}`;
      return [label, finalPath, icon];
    }
    let children = item.children;
    if (item.label === 'Marketplace') {
      if ([ROLES.REGION_DIRECTOR, ROLES.STATE_DIRECTOR, ROLES.DISTRICT_DIRECTOR, ROLES.EXECUTIVE_DIRECTOR, ROLES.LAUNCH_DIRECTOR, ROLES.DIRECT_CONSULTANT, ROLES.CHAPTER_PRESIDENT, ROLES.VICE_PRESIDENT, ROLES.SECRETARY, ROLES.CUSTOMER, ROLES.USER, ROLES.VENDOR].includes(normalizedRole)) {
        children = children.filter(([label]) => !['Orders', 'Payments', 'Subscription'].includes(label));
      }
      if (normalizedRole === ROLES.VICE_PRESIDENT) {
        children = children.filter(([label]) => label !== 'Marketplace Approval');
      } else if (normalizedRole === ROLES.EXECUTIVE_DIRECTOR) {
        children = children.filter(([label]) => label !== 'Vendor Applications');
      } else {
        children = children.filter(([label]) => !['Vendor Applications', 'Marketplace Approval'].includes(label));
      }
    }
    return {
      ...item,
      children: children.map(prefixItem)
    };
  };


let base = commonModules.map(item => {
  if (item.label === 'Account') {
    const children = [...item.children];

    if ([ROLES.CUSTOMER, ROLES.USER, ROLES.VENDOR].includes(role)) {
      children.splice(1, 0, [
        'Membership Application Status',
        '/member/membership-application-status',
        ClipboardCheck,
      ]);
    }

    return prefixItem({
      ...item,
      children,
    });
  }

  return prefixItem(item);
});

if (
  [ROLES.REGION_DIRECTOR, ROLES.STATE_DIRECTOR, ROLES.DISTRICT_DIRECTOR].includes(normalizedRole)
) {
  const orgMgmt = {
    label: 'Organization Management',
    icon: Building2,
    children: [
      ['Locations', '/locations', MapPinned],
    ].map(prefixItem),
  };

  if (normalizedRole === ROLES.DISTRICT_DIRECTOR) {
    base = [
      base[0], // Dashboard
      orgMgmt,
      base[2], // Marketplace
      base[3], // Meetings
      base[4], // Chapter
      base[5], // Collaboration
      base[6], // Account
    ];
  } else {
    base = [
      base[0], // Dashboard
      orgMgmt,
      base[2], // Marketplace
      base[3], // Meetings
      base[1], // Community
      base[4], // Chapter
      base[5], // Collaboration
      base[6], // Account
    ];
  }
}

const extra = (roleModules[normalizedRole] || []).map(prefixItem);

if (normalizedRole === 'secretary') {
  return [...base, ...secretaryNav.map(prefixItem), ...extra.filter(([label]) => !['Members', 'Reports'].includes(label))];
}

return [...base, ...extra];
}

//   const base = commonModules.map(item => {
//     if (item.label === 'Account') {
//       const children = [...item.children];
//       if ([ROLES.CUSTOMER, ROLES.USER, ROLES.VENDOR].includes(role)) {
//         children.splice(1, 0, ['Membership Application Status', '/member/membership-application-status', ClipboardCheck]);
//       }
//       return prefixItem({
//         ...item,
//         children
//       });
//     }
//     return prefixItem(item);
//   });
// =======
//   let base = commonModules.map(prefixItem);

//   if (role === ROLES.REGION_DIRECTOR) {
//     const orgMgmt = {
//       label: 'Organization Management',
//       icon: Building2,
//       children: [
//         ['Locations', '/locations', MapPinned]
//       ].map(prefixItem)
//     };

//     const newBase = [];
//     newBase.push(base[0]); // Dashboard
//     newBase.push(orgMgmt); // Organization Management
//     newBase.push(base[2]); // Marketplace
//     newBase.push(base[3]); // Meetings
//     newBase.push(base[1]); // Community
//     newBase.push(base[4]); // Profile
//     base = newBase;
//   } else if (role === ROLES.STATE_DIRECTOR) {
//     const orgMgmt = {
//       label: 'Organization Management',
//       icon: Building2,
//       children: [
//         ['Locations', '/locations', MapPinned]
//       ].map(prefixItem)
//     };

//     const newBase = [];
//     newBase.push(base[0]); // Dashboard
//     newBase.push(orgMgmt); // Organization Management
//     newBase.push(base[2]); // Marketplace
//     newBase.push(base[3]); // Meetings
//     newBase.push(base[1]); // Community
//     newBase.push(base[4]); // Profile
//     base = newBase;
//   } else if (role === ROLES.DISTRICT_DIRECTOR) {
//     const orgMgmt = {
//       label: 'Organization Management',
//       icon: Building2,
//       children: [
//         ['Locations', '/locations', MapPinned]
//       ].map(prefixItem)
//     };

//     const newBase = [];
//     newBase.push(base[0]); // Dashboard
//     newBase.push(orgMgmt); // Organization Management
//     newBase.push(base[2]); // Marketplace
//     newBase.push(base[3]); // Meetings
//     base = newBase;
//   }
// >>>>>>> main

//   const extra = (roleModules[role] || []).map(prefixItem);

//   return [...base, ...extra];
// }
