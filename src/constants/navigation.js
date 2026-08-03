import {
  Activity,
  BarChart3,
  BookOpen,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CreditCard,
  FileText,
  Heart,
  HelpCircle,
  Home,
  LayoutDashboard,
  LayoutGrid,
  ListTree,
  Lock,
  MapPinned,
  Network,
  Package,
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
  Volume2,
  Handshake,
  Trophy,
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
  ['Enterprise Scorecard', '/scorecard', BarChart3],
  {
    label: 'Communication',
    icon: MessageSquare,
    children: [
      ['Gloaro Community', '/network', Network],
      ['Chapter Community', '/wall', Volume2],
      ['Direct Messages', '/chat', MessageSquare],
      ['Notifications', '/notifications', Bell],
    ],
  },
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
      ['Tasks', '/tasks', Activity],
      ['Calendar', '/calendar', CalendarDays],
    ],
  },
  {
    label: 'Referrals',
    icon: Handshake,
    children: [
      ['My Referrals', '/my-referrals', User],
      ['Referral Management', '/referral-management', Handshake],
    ],
  },
  {
    label: 'Membership',
    icon: CreditCard,
    children: [
      ['Member Approval', '/membership-applications', ClipboardList],
      ['Members', '/members', Users],
      ['Attendance', '/attendance', Activity],
      ['Chapter Approvals', '/chapters', Network],
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
    ],
  },
  {
    label: 'Marketplace',
    icon: ShoppingBag,
    children: [
      ['Categories', '/marketplace/categories', ListTree],
      ['Vendors', '/vendors', Building2],
      ['Products', '/products', Package],
      ['Services', '/services', BriefcaseBusiness],
      ['Marketplace Approval', '/marketplace-approval', Workflow],
      ['Vendor Category Requests', '/vendor-category-approvals', Workflow],
    ],
  },
  ['Events', '/events', CalendarDays],
  ['Training', '/training', Star],

  ['Success Stories', '/testimonials', FileText],
  ['FAQs', '/faqs', HelpCircle],
  ['Analytics', '/analytics', BarChart3],
  ['Profile', '/profile', User],
  ['Audit Logs', '/audit-logs', FileText],
  ['System Logs', '/system-logs', Lock],
]

export const vendorNav = [
  ['Dashboard', '/vendor', LayoutDashboard],
  ['Enterprise Scorecard', '/vendor/scorecard', BarChart3],
  { label: 'Communication', icon: MessageSquare, children: [['Notifications', '/notifications', Bell]] },
  ['Business Profile', '/vendor/profile', Building2],
  ['Business Categories', '/vendor/business-categories', PlusCircle],
  ['Products', '/vendor/products', Package],
  ['Services', '/vendor/services', BriefcaseBusiness],
  ['Orders', '/vendor/orders', ShoppingBag],
  ['Leads', '/vendor/leads', Ticket],
  ['Reviews', '/vendor/reviews', Star],
  ['Membership', '/vendor/membership', CreditCard],
  ['Payments', '/vendor/payments', CreditCard],
  ['Analytics', '/vendor/analytics', BarChart3],
  ['Support', '/vendor/support', HelpCircle],
]

export const memberVendorNav = [
  ['Dashboard', '/member/dashboard', LayoutDashboard],
  ['Enterprise Scorecard', '/member/dashboard/scorecard', BarChart3],
  { label: 'Communication', icon: MessageSquare, children: [['Notifications', '/notifications', Bell]] },
  ['Business Profile', '/member/dashboard/my-business', Building2],
  ['Business Categories', '/member/dashboard/business-categories', PlusCircle],
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
  ['Enterprise Scorecard', '/member/dashboard/scorecard', BarChart3],
  { label: 'Communication', icon: MessageSquare, children: [['Notifications', '/notifications', Bell]] },
  ['Profile', '/member/profile', User],
  ['Membership Application Status', '/member/membership-application-status', ClipboardCheck],
]

export const vendorApplicantNav = [
  ['Dashboard', '/vendor/onboarding-status', LayoutDashboard],
  ['Enterprise Scorecard', '/vendor/scorecard', BarChart3],
  { label: 'Communication', icon: MessageSquare, children: [['Notifications', '/notifications', Bell]] },
  ['Vendor Application Status', '/vendor/onboarding-status', ClipboardList],
  ['Profile', '/vendor/account', User],
  ['Settings', '/vendor/settings', Settings],
  ['Logout', '__logout__', LogOut],
]

export const vendorOnboardingNav = [
  ['Enterprise Scorecard', '/vendor/scorecard', BarChart3],
  { label: 'Communication', icon: MessageSquare, children: [['Notifications', '/notifications', Bell]] },
  ['Vendor Onboarding', '/vendor/onboarding', FileText],
  ['Application Status', '/vendor/onboarding-status', ClipboardList],
  ['Account', '/vendor/account', User],
]

export const memberOnboardingNav = [
  ['Membership Status', '/member/membership-application-status', ClipboardCheck],
  ['Profile', '/member/profile', User],
]

export const customerNav = [
  ['Home', '/', Home],
  ['Nearby', '/nearby', Building2],
  ['Categories', '/marketplace/categories', ListTree],
  ['Vendors', '/vendors', Building2],
  ['Products', '/products', ShoppingBag],
  ['Services', '/services', BriefcaseBusiness],
  ['Wishlist', '/customer/wishlist', Heart],
  ['Referral', '/customer/referral', Ticket],
  ['Events', '/events', CalendarDays],
  ['Profile', '/customer/profile', Users],
  ['Support', '/customer/support', HelpCircle],
]

export const customerFoundationNav = [
  ['Dashboard', '/customer/dashboard', LayoutDashboard],
  ['Enterprise Scorecard', '/customer/scorecard', BarChart3],
  { label: 'Communication', icon: MessageSquare, children: [['Notifications', '/notifications', Bell]] },
  ['Profile', '/customer/profile', User],
  ['Addresses', '/customer/addresses', MapPinned],
  ['Logout', '__logout__', LogOut],
]

export const membershipNav = [
  ['Dashboard', '/membership/dashboard', LayoutDashboard],
  ['Enterprise Scorecard', '/membership/scorecard', BarChart3],
  { label: 'Communication', icon: MessageSquare, children: [['Notifications', '/notifications', Bell]] },
  ['Benefits', '/membership/benefits', Star],
  ['Events', '/membership/events', CalendarDays],
  ['Assigned Courses', '/membership/training', BookOpen],
  ['Referral', '/membership/referral', Ticket],
  ['Profile', '/membership/profile', Users],
  ['Support', '/membership/support', HelpCircle],
]

export const memberNav = [['Assigned Courses', '/member/training', BookOpen]];
export const secretaryNav = [{ label: 'Secretary Dashboard', icon: ClipboardList, children: [['Events', '/events', CalendarDays]] }];
export const stateDirectorNav = [];
export const districtDirectorNav = [];
export const chapterDirectorNav = [];
export const presidentNav = [];
export const vicePresidentNav = [];
export const regionDirectorNav = [];

const removeMarketplaceSection = (navItems = []) => navItems.filter((item) => Array.isArray(item) || item.label !== 'Marketplace')

const getUserOrganization = (user) => (
  user?.meta?.adminProfile?.organization ||
  user?.meta?.memberProfile?.organization ||
  user?.organization ||
  user?.meta?.organization ||
  {}
)

const hasChapterAssignment = (user) => {
  const org = getUserOrganization(user)
  return Boolean(org.chapter || org.assignedChapter?._id || org.assignedChapter?.name)
}

const memberVendorMarketplaceChildren = [
  ['Business Profile', '/member/dashboard/my-business', Building2],
  ['Business Categories', '/member/dashboard/business-categories', PlusCircle],
  ['Products', '/member/dashboard/products', Package],
  ['Services', '/member/dashboard/services', BriefcaseBusiness],
  ['Orders', '/member/dashboard/orders', ShoppingBag],
  ['Leads', '/member/dashboard/leads', Ticket],
  ['Reviews', '/member/dashboard/reviews', Star],
  ['Payments', '/member/dashboard/payments', CreditCard],
  ['Subscription', '/member/dashboard/subscription', ToggleLeft],
  ['Analytics', '/member/dashboard/vendor-analytics', BarChart3],
]

export function getMemberVendorSidebarNav(role, user) {
  return getSidebarNav(role, { user }).map((item) => {
    if (Array.isArray(item) || item.label !== 'Marketplace') {
      return item
    }

    return {
      ...item,
      children: memberVendorMarketplaceChildren,
    }
  })
}

export function getMemberSidebarNav(role, user) {
  return removeMarketplaceSection(getSidebarNav(role, { user }))
}

export function getApplicantSidebarNav() {
  return applicantNav
}

export function getVendorApplicantSidebarNav() {
  return vendorApplicantNav
}

export function getRoleBasedSidebarNav(role, user) {
  return getSidebarNav(role, { user })
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
  ['Enterprise Scorecard', '/scorecard', BarChart3],
  {
    label: 'Communication',
    icon: MessageSquare,
    children: [
      ['Notifications', '/notifications', Bell],
    ]
  },
  {
    label: 'Community',
    icon: Network,
    children: [
      ['Chapter Community', '/wall', Volume2],
      ['Gloaro Network', '/network', Network],
      ['Messages', '/chat', MessageSquare],
      ['Referrals', '/referrals', Handshake],
      ['Business Directory', '/directory', Users],
      ['Leaderboard', '/leaderboard', Trophy]
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
      ['Vendor Category Requests', '/vendor-category-approvals', Workflow],
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
      ['Attendance', '/attendance', ClipboardList]
    ]
  },
  ['Training', '/member/training', BookOpen],
  ['My Chapter', '/chapter', Building2],
  ['Profile', '/profile', User]
];

const roleModules = {
  [ROLES.SECRETARY]: [
    ['Members', '/members', Users]
  ],
  [ROLES.VICE_PRESIDENT]: [
    ['Member Registration', '/register-member', Users],
    ['Membership Applications', '/membership-applications', ClipboardList],
    ['Approved Members', '/members', Users],
    ['Secretaries', '/secretaries', Users]
  ],
  [ROLES.CHAPTER_PRESIDENT]: [
    ['Approved Members', '/members', Users],
    ['Vice Presidents', '/vice-presidents', Users]
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
    ['Approved Members', '/members', Users]
  ],
  [ROLES.REGION_DIRECTOR]: [
    ['State Directors', '/state-directors', Users],
    ['Approved Members', '/members', Users]
  ],
  [ROLES.LAUNCH_DIRECTOR]: [
    ['Direct Consultants', '/direct-consultants', Users],
    ['Approved Members', '/members', Users]
  ],
  [ROLES.DIRECT_CONSULTANT]: [
    ['Chapter Presidents', '/presidents', Users],
    ['Approved Members', '/members', Users]
  ]
};

export function getSidebarNav(role, options = {}) {
  const normalizedRole = normalizeRole(role)
  const user = options.user || null

  if ([ROLES.SUPERADMIN, ROLES.ADMIN].includes(role)) {
    const prefixPath = (item) => {
      if (Array.isArray(item)) {
        const [label, to, icon] = item;
        if (to === '/notifications') return [label, to, icon];
        return [label, buildAdminRoute(role, to), icon];
      }
      return {
        ...item,
        children: item.children.map(prefixPath)
      };
    };

    let filteredAdminNav = adminNav
      .filter((item) => {
        if (Array.isArray(item)) {
          return item[0] !== 'Settings';
        }
        if (normalizedRole === ROLES.ADMIN && item.label === 'Super Admin') {
          return false;
        }
        return true;
      })
      .map((item) => {
        if (Array.isArray(item)) {
          return item;
        }

        if (item.label === 'Directory') {
          return {
            ...item,
            children: item.children.filter(
              ([label]) => !['Users', 'Vendor Settings', 'Business', 'Business Wall'].includes(label)
            ),
          };
        }

        if (item.label === 'Super Admin') {
          return {
            ...item,
            children: item.children.filter(
              ([label]) => !['Assignments', 'Tasks'].includes(label)
            ),
          };
        }

        return item;
      });

    if (normalizedRole === ROLES.ADMIN) {
      filteredAdminNav.push(['Calendar', '/calendar', CalendarDays]);
    }

    return filteredAdminNav.map(prefixPath);
  }

  const prefix = rolePrefixes[normalizedRole] || '/member/dashboard';

  const prefixItem = (item) => {
    if (Array.isArray(item)) {
      let [label, to, icon] = item;
      if (to === '/chapter') {
        if (normalizedRole === ROLES.REGION_DIRECTOR) label = 'My Region';
        else if (normalizedRole === ROLES.STATE_DIRECTOR) label = 'My State';
        else if (normalizedRole === ROLES.DISTRICT_DIRECTOR) label = 'My District';
        else label = 'My Chapter';
      }
      const memberReferralPath = label === 'Referrals' && to === '/referrals' && [ROLES.CUSTOMER, ROLES.USER, ROLES.VENDOR].includes(normalizedRole);
      const finalPath = memberReferralPath
        ? '/member/referrals'
        : (to === '/notifications' || to.startsWith('/admin/') || to === '/admin' || to.startsWith('/member/') || to === '/member') || to.startsWith('/super-admin') ? to : `${prefix}${to}`;
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
        children = children.filter(([label]) => !['Vendor Applications', 'Marketplace Approval', 'Vendor Category Requests'].includes(label));
      }
    }
    if (item.label === 'Community') {
      if ([ROLES.REGION_DIRECTOR, ROLES.STATE_DIRECTOR, ROLES.DISTRICT_DIRECTOR].includes(normalizedRole)) {
        children = children.filter(([label]) => {
          if (label === 'Chapter Community') return hasChapterAssignment(user)
          return ['Gloaro Network', 'Messages', 'Referrals'].includes(label)
        })
      } else if ([ROLES.CUSTOMER, ROLES.USER, ROLES.VENDOR].includes(normalizedRole)) {
        children = children.filter(([label]) => ['Chapter Community', 'Gloaro Network', 'Messages', 'Referrals'].includes(label))
      }
    }
    return {
      ...item,
      children: children.map(prefixItem)
    };
  };


let base = commonModules.map(item => {
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
      base[1], // Enterprise Scorecard
      base[2], // Communication
      base[4], // Marketplace
      base[5], // Meetings
      base[3], // Community
      base[6], // Training
      base[7], // Chapter
      base[8], // Collaboration
      base[9], // Profile
    ];
  } else {
    base = [
      base[0], // Dashboard
      orgMgmt,
      base[1], // Enterprise Scorecard
      base[2], // Communication
      base[4], // Marketplace
      base[5], // Meetings
      base[3], // Community
      base[6], // Training
      base[7], // Chapter
      base[8], // Collaboration
      base[9], // Profile
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
