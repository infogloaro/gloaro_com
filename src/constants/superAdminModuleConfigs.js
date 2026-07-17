import {
  Activity,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  LayoutGrid,
  MapPinned,
  MessageSquare,
  Plus,
  Settings,
  ShieldCheck,
  Store,
  Users,
  Workflow,
} from 'lucide-react'

export const superAdminModuleConfigs = {
  organization: {
    title: 'Organization',
    description: 'Create regions, states, areas, districts, chapters, assign directors, and inspect organization analytics.',
    icon: MapPinned,
    sections: [
      ['Regions', 'Create and manage Gloaro operating regions.', MapPinned],
      ['States', 'Group states under regions for clean hierarchy.', MapPinned],
      ['Areas', 'Assign area directors and business development ownership.', Users],
      ['Districts', 'Organize district-level network operations.', Building2],
      ['Chapters', 'Create chapters and assign chapter leaders.', Workflow],
      ['Hierarchy Tree', 'Visualize organization hierarchy from region to chapter.', LayoutGrid],
    ],
  },
  roles: {
    title: 'Roles',
    description: 'Create roles, edit roles, clone roles, assign users, and manage the permission matrix.',
    icon: ShieldCheck,
    sections: [
      ['Create Role', 'Add a new administrative role with scoped access.', Plus],
      ['Assign Users', 'Attach admins and directors to configured roles.', Users],
      ['Clone Role', 'Duplicate access from one role to another.', Workflow],
      ['Role Activity', 'Review role changes and assignments.', Activity],
    ],
  },
  meetings: {
    title: 'Meeting Settings',
    description: 'Configure meeting types, attendance rules, late rules, guest rules, QR attendance, duration, and templates.',
    icon: CalendarDays,
    sections: [
      ['Meeting Types', 'Define monthly meetings, referral meetings, chapter meetings, and events.', CalendarDays],
      ['Attendance Rules', 'Set attendance eligibility, late rules, and guest policy.', Activity],
      ['QR Attendance', 'Enable QR attendance and manual attendance fallback.', Workflow],
      ['Templates', 'Create reusable meeting templates and reminders.', ClipboardList],
    ],
  },
  vendor: {
    title: 'Vendor Settings',
    description: 'Configure vendor applications, required documents, approval rules, listings, ratings, and reviews.',
    icon: Store,
    sections: [
      ['Vendor Application', 'Allow vendor applications and document collection.', Store],
      ['Vendor Approval', 'Require approval before marketplace access.', CheckCircle2],
      ['Product Listing', 'Allow product listings with category controls.', Store],
      ['Service Listing', 'Allow service listings, ratings, and reviews.', MessageSquare],
    ],
  },

  settings: {
    title: 'System Settings',
    description: 'Manage module-level settings, admin visibility, notifications, exports, reports, and read-only mode.',
    icon: Settings,
  },
}
