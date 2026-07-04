import {
  BarChart3,
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
  ListTree,
  Network,
  Package,
  Settings,
  ShoppingBag,
  Star,
  Ticket,
  Users,
} from 'lucide-react'

export const adminNav = [
  ['Dashboard', '/admin', LayoutDashboard],
  ['Users', '/admin/users', Users],
  ['Vendors', '/admin/vendors', Building2],
  ['Categories', '/admin/categories', ListTree],
  ['Products', '/admin/products', Package],
  ['Services', '/admin/services', BriefcaseBusiness],
  ['Memberships', '/admin/memberships', CreditCard],
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
  ['Events', '/admin/events', CalendarDays],
  ['Referrals', '/admin/referrals', Ticket],
  ['Banners', '/admin/banners', FileText],
  ['FAQs', '/admin/faqs', HelpCircle],
  ['Settings', '/admin/settings', Settings],
  ['Support', '/admin/support', HelpCircle],
  ['Analytics', '/admin/analytics', BarChart3],
  ['Notifications', '/admin/notifications', Bell],
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

export const secretaryNav = [
  ['Dashboard', '/secretary/dashboard', LayoutDashboard],
  ['Members', '/secretary/members', Users],
  ['Minutes', '/secretary/minutes', FileText],
  ['Attendance', '/secretary/attendance', CalendarDays],
  ['Documents', '/secretary/documents', ShoppingBag],
  ['Reports', '/secretary/reports', BarChart3],
  ['Settings', '/secretary/settings', Settings],
]

