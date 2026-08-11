import { ROLES } from './roleConfig.js'
export const dashboardConfig = {
  [ROLES.VICE_PRESIDENT]: {
    role: ROLES.VICE_PRESIDENT,
    cards: [
      "members",
      "attendance",
      "meetings",
      "referrals",
      "visitors",
      "business"
    ],
    quickActions: [
      { label: "Register Member", path: "/vice-president/register-member" },
      { label: "Vendor Applications", path: "/vice-president/vendor-applications" },
      { label: "Business Wall", path: "/vice-president/wall" },
      { label: "Invite Visitor", path: "/vice-president/visitors" }
    ],
    permissions: ["view_chapter", "manage_meetings"]
  },
  [ROLES.CHAPTER_PRESIDENT]: {
    role: ROLES.CHAPTER_PRESIDENT,
    cards: [
      "members",
      "meetings",
      "referrals",
      "visitors",
      "business"
    ],
    quickActions: [
      { label: "View Unit Vice Chairmen", path: "/president/vice-presidents" },
      { label: "Business Wall", path: "/president/wall" }
    ],
    permissions: ["view_chapter"]
  },
  [ROLES.SECRETARY]: {
    role: ROLES.SECRETARY,
    cards: [
      "attendance",
      "meetings",
      "documents"
    ],
    quickActions: [
      { label: "Manage Members", path: "/secretary/members" },
      { label: "Mark Attendance", path: "/secretary/attendance" }
    ],
    permissions: ["manage_attendance"]
  },
  [ROLES.LAUNCH_DIRECTOR]: {
    role: ROLES.LAUNCH_DIRECTOR,
    cards: [
      "assignedChapters",
      "chaptersReady",
      "chaptersPending",
      "presidentsAssigned",
      "membersRegistered",
      "pendingMemberships",
      "vendorsApproved",
      "meetingsScheduled",
      "referralsPassed",
      "visitorsInvited",
      "businessGenerated"
    ],
    quickActions: [
      { label: "Register Member", path: "/launch-director/register-member" },
      { label: "Assign Unit Chairman", path: "/launch-director/assign-president" },
      { label: "Approve Membership", path: "/launch-director/membership-applications" },
      { label: "Verify Vendor", path: "/launch-director/vendor-applications" },
      { label: "Schedule Meeting", path: "/launch-director/meetings" }
    ],
    permissions: ["manage_chapters", "verify_members", "verify_vendors"]
  },
  [ROLES.DIRECT_CONSULTANT]: {
    role: ROLES.DIRECT_CONSULTANT,
    cards: [
      "membersRegistered",
      "activeMembers",
      "pendingMemberships",
      "vendorsApproved",
      "pendingVendors",
      "referralsPassed",
      "visitorsInvited",
      "oneToOnes",
      "meetingsScheduled",
      "businessGenerated"
    ],
    quickActions: [
      { label: "Register Member", path: "/direct-consultant/register-member" },
      { label: "Review Membership", path: "/direct-consultant/membership-applications" },
      { label: "Approve Membership", path: "/direct-consultant/membership-applications" },
      { label: "Vendor Applications", path: "/direct-consultant/vendor-applications" },
      { label: "Approved Vendors", path: "/direct-consultant/approved-vendors" },
      { label: "Business Wall", path: "/direct-consultant/wall" },
      { label: "Referrals", path: "/direct-consultant/referrals" },
      { label: "Visitors", path: "/direct-consultant/visitors" },
      { label: "Meetings", path: "/direct-consultant/meetings" },
      { label: "Reports", path: "/direct-consultant/reports" }
    ],
    permissions: ["manage_membership", "view_vendors"]
  },
  [ROLES.EXECUTIVE_DIRECTOR]: {
    role: ROLES.EXECUTIVE_DIRECTOR,
    cards: [
      "assignedChapters",
      "chaptersReady",
      "membersRegistered",
      "pendingMemberships",
      "vendorsApproved",
      "referralsPassed",
      "visitorsInvited",
      "meetingsScheduled",
      "attendance",
      "businessGenerated"
    ],
    quickActions: [
      { label: "Approve Membership", path: "/chapter-director/memberships" },
      { label: "Marketplace Vendors", path: "/chapter-director/vendors" },
      { label: "Chapter Management", path: "/chapter-director/chapter-management" },
      { label: "Unit Chairmen List", path: "/chapter-director/president" },
      { label: "Members List", path: "/chapter-director/members" },
      { label: "Business Wall", path: "/chapter-director/wall" },
      { label: "Referrals Log", path: "/chapter-director/referrals" },
      { label: "Meetings Log", path: "/chapter-director/meetings" },
      { label: "Reports Builder", path: "/chapter-director/reports" }
    ],
    permissions: ["view_chapters", "verify_members"]
  },
  [ROLES.CHAPTER_DIRECTOR]: {
    role: ROLES.CHAPTER_DIRECTOR,
    cards: [
      "assignedChapters",
      "chaptersReady",
      "membersRegistered",
      "pendingMemberships",
      "vendorsApproved",
      "referralsPassed",
      "visitorsInvited",
      "meetingsScheduled",
      "attendance",
      "businessGenerated"
    ],
    quickActions: [
      { label: "Approve Membership", path: "/chapter-director/memberships" },
      { label: "Marketplace Vendors", path: "/chapter-director/vendors" },
      { label: "Chapter Management", path: "/chapter-director/chapter-management" },
      { label: "Unit Chairmen List", path: "/chapter-director/president" },
      { label: "Members List", path: "/chapter-director/members" },
      { label: "Business Wall", path: "/chapter-director/wall" },
      { label: "Referrals Log", path: "/chapter-director/referrals" },
      { label: "Meetings Log", path: "/chapter-director/meetings" },
      { label: "Reports Builder", path: "/chapter-director/reports" }
    ],
    permissions: ["view_chapters", "verify_members"]
  },
  [ROLES.DISTRICT_DIRECTOR]: {
    role: ROLES.DISTRICT_DIRECTOR,
    cards: [
      "assignedChapters",
      "chaptersReady",
      "chapterDirectors",
      "executiveDirectors",
      "membersRegistered",
      "activeMembers",
      "pendingMemberships",
      "vendorsApproved",
      "pendingVendors",
      "meetingsScheduled",
      "visitorsInvited",
      "referralsPassed",
      "businessGenerated",
      "attendance",
      "meetings"
    ],
    quickActions: [
      { label: "Register Member", path: "/district-director/register-member" },
      { label: "Review Membership", path: "/district-director/memberships" },
      { label: "Approve Membership", path: "/district-director/memberships" },
      { label: "Vendor Applications", path: "/district-director/vendor-applications" },
      { label: "Approved Vendors", path: "/district-director/approved-vendors" },
      { label: "Business Wall", path: "/district-director/wall" },
      { label: "Referrals Log", path: "/district-director/referrals" },
      { label: "Visitors Log", path: "/district-director/visitors" },
      { label: "Meetings Log", path: "/district-director/meetings" },
      { label: "Reports Builder", path: "/district-director/reports" }
    ],
    permissions: ["view_districts", "verify_members"]
  }
};
