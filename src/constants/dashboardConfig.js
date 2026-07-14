export const dashboardConfig = {
  vice_president: {
    role: "vice_president",
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
      { label: "Business Wall", path: "/vice-president/wall" },
      { label: "Invite Visitor", path: "/vice-president/visitors" }
    ],
    permissions: ["view_chapter", "manage_meetings"]
  },
  chapter_president: {
    role: "chapter_president",
    cards: [
      "members",
      "meetings",
      "referrals",
      "visitors",
      "business"
    ],
    quickActions: [
      { label: "View Vice Presidents", path: "/president/vice-presidents" },
      { label: "Business Wall", path: "/president/wall" }
    ],
    permissions: ["view_chapter"]
  },
  secretary: {
    role: "secretary",
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
  launch_director: {
    role: "launch_director",
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
      { label: "Assign President", path: "/launch-director/assign-president" },
      { label: "Approve Membership", path: "/launch-director/membership-applications" },
      { label: "Verify Vendor", path: "/launch-director/vendor-applications" },
      { label: "Schedule Meeting", path: "/launch-director/meetings" }
    ],
    permissions: ["manage_chapters", "verify_members", "verify_vendors"]
  },
  direct_consultant: {
    role: "direct_consultant",
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
  executive_director: {
    role: "executive_director",
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
      { label: "Approve Vendor", path: "/chapter-director/approved-vendors" },
      { label: "Chapter Management", path: "/chapter-director/chapter-management" },
      { label: "Presidents List", path: "/chapter-director/president" },
      { label: "Members List", path: "/chapter-director/members" },
      { label: "Business Wall", path: "/chapter-director/wall" },
      { label: "Referrals Log", path: "/chapter-director/referrals" },
      { label: "Meetings Log", path: "/chapter-director/meetings" },
      { label: "Reports Builder", path: "/chapter-director/reports" }
    ],
    permissions: ["view_chapters", "verify_members"]
  },
  chapter_director: {
    role: "chapter_director",
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
      { label: "Approve Vendor", path: "/chapter-director/approved-vendors" },
      { label: "Chapter Management", path: "/chapter-director/chapter-management" },
      { label: "Presidents List", path: "/chapter-director/president" },
      { label: "Members List", path: "/chapter-director/members" },
      { label: "Business Wall", path: "/chapter-director/wall" },
      { label: "Referrals Log", path: "/chapter-director/referrals" },
      { label: "Meetings Log", path: "/chapter-director/meetings" },
      { label: "Reports Builder", path: "/chapter-director/reports" }
    ],
    permissions: ["view_chapters", "verify_members"]
  },
  district_director: {
    role: "district_director",
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
