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

import { buildAdminRoute } from '../utils/permissions'

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
      ['Chapters', '/chapters', Network],
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
    ['Reports', '/reports', FileBarChart],
    ['Announcements', '/announcements', Bell]
  ],
  chapter_president: [
    ['Approved Members', '/members', Users],
    ['Vice Presidents', '/vice-presidents', Users],
    ['Chapter Reports', '/reports', FileBarChart],
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
    ['Executive Directors', '/executive-directors', Users],
    ['Active Members', '/members', Users]
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
    ['Direct Consultants', '/direct-consultants', Users],
    ['Approved Members', '/members', Users],
    ['Launch Reports', '/launch-reports', FileBarChart],
    ['Membership Reports', '/membership-reports', FileBarChart]
  ],
  direct_consultant: [
    ['Chapter Presidents', '/presidents', Users],
    ['Approved Members', '/members', Users]
  ]
};

export function getSidebarNav(role) {
  if (['superadmin', 'admin'].includes(role)) {
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

  const prefix = rolePrefixes[role] || '/member/dashboard';

  const prefixItem = (item) => {
    if (Array.isArray(item)) {
      const [label, to, icon] = item;
      const finalPath = (to.startsWith('/admin/') || to === '/admin' || to.startsWith('/member/') || to === '/member') || to.startsWith('/super-admin') ? to : `${prefix}${to}`;
      return [label, finalPath, icon];
    }
    let children = item.children;
    if (['region_director', 'state_director', 'district_director', 'launch_director', 'direct_consultant', 'chapter_president', 'vice_president', 'secretary'].includes(role) && item.label === 'Marketplace') {
      children = children.filter(([label]) => !['Orders', 'Payments', 'Subscription'].includes(label));
    }
    return {
      ...item,
      children: children.map(prefixItem)
    };
  };


let base = commonModules.map(item => {
  if (item.label === 'Account') {
    const children = [...item.children];

    if (['customer', 'user', 'vendor'].includes(role)) {
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
  ['region_director', 'state_director', 'district_director'].includes(role)
) {
  const orgMgmt = {
    label: 'Organization Management',
    icon: Building2,
    children: [
      ['Locations', '/locations', MapPinned],
    ].map(prefixItem),
  };

  if (role === 'district_director') {
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

const extra = (roleModules[role] || []).map(prefixItem);

return [...base, ...extra];
}

//   const base = commonModules.map(item => {
//     if (item.label === 'Account') {
//       const children = [...item.children];
//       if (['customer', 'user', 'vendor'].includes(role)) {
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

//   if (role === 'region_director') {
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
//   } else if (role === 'state_director') {
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
//   } else if (role === 'district_director') {
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


