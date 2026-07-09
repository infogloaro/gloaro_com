import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { adminNav, customerNav, membershipNav, memberNav, vendorNav, secretaryNav, stateDirectorNav, districtDirectorNav, chapterDirectorNav, presidentNav, vicePresidentNav } from './constants/navigation'
import DashboardLayout from './layouts/DashboardLayout'
import PublicLayout from './layouts/PublicLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleRedirect from './routes/RoleRedirect'
import LoadingScreen from './components/common/LoadingScreen'
import { useAuth } from './hooks/useAuth'
import AuthLayout from './pages/auth/AuthLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import VerifyEmail from './pages/auth/VerifyEmail'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminNotifications from './pages/admin/AdminNotifications'
import AdminManagementPage from './pages/admin/AdminManagementPage'
import AdminVendorApplicationsPage from './pages/admin/AdminVendorApplicationsPage'
import ApprovedVendorsPage from './pages/shared/ApprovedVendorsPage'
import {
  AuditLogsPage,
  DashboardConfigurationPage,
  FeatureManagementPage,
  ModuleConfigurationPage,
  NotificationsConfigPage,
  PermissionMatrixPage,
  ReportsCenterPage,
  SuperAdminDashboardPage,
  SuperAdminModulePage,
  SystemLogsPage,
} from './pages/admin/SuperAdminPages'
import { superAdminModuleConfigs } from './constants/superAdminModuleConfigs'
import {
  ActivityCenterPage,
  AIInsightsPage,
  AttendanceEnginePage,
  BusinessWallManagementPage,
  BusinessNetworkingPage,
  ChapterManagementPage,
  ChapterDashboardPage,
  EnterpriseAnalyticsPage,
  EnterpriseCalendarPage,
  EnterpriseReportBuilderPage,
  ExecutiveDashboardPage,
  GlobalSearchPage,
  HierarchyAssignmentPage,
  MarketplaceApprovalPage,
  MeetingManagementPage,
  MemberJourneyPage,
  NotificationAutomationPage,
  OrganizationManagementPage,
  PerformanceScorecardPage,
  ReferralPipelinePage,
  TestimonialsManagementPage,
  TaskManagementPage,
  TrainingManagementPage,
  VendorApprovalWorkflowPage,
  VisitorConversionEnginePage,
  VisitorManagementPage,
  WorkflowEnginePage,
} from './pages/admin/EnterpriseManagementPages'
import {
  AdminBannersPage,
  AdminCategoriesPage,
  AdminEventsPage,
  AdminFaqsPage,
  AdminModuleApplicationsPage,
  AdminMembershipApplicationsPage,
  AdminMembershipsPage,
  AdminPaymentsPage,
  AdminPlansPage,
  AdminProductsPage,
  AdminReferralsPage,
  AdminReviewsPage,
  AdminServicesPage,
  AdminSettingsPage,
  AdminSupportPage,
  AdminUsersPage,
  AdminVendorsPage,
} from './pages/admin/AdminResourcePages'
import LocationsManagementPage from './pages/admin/LocationsManagementPage'
import VendorDashboard from './pages/vendor/VendorDashboard'
import {
  VendorLeadsPage,
  VendorMembershipPage,
  VendorNotificationsPage,
  VendorPaymentsPage,
  VendorProductsPage,
  VendorProfilePage,
  VendorReviewsPage,
  VendorServicesPage,
  VendorSupportPage,
} from './pages/vendor/VendorPages'
import {
  CategoriesPage,
  CustomerNotificationsPage,
  CustomerProfilePage,
  CustomerSupportPage,
  DetailPage,
  EventsPage,
  NearbyPage,
  ProductsPage,
  ReferralPage,
  ReviewsPage,
  ServicesPage,
  VendorsPage,
  WishlistPage,
} from './pages/customer/ListingPages'
import NotificationsPage from './pages/shared/NotificationsPage'
import Home from './pages/Home'
import MembershipAgreement from './pages/public/MembershipAgreement'
import MembershipApplication from './pages/public/MembershipApplication'
import MembershipQualification from './pages/public/MembershipQualification'
import MembershipApplicationTrack from './pages/public/MembershipApplicationTrack'
import MembershipDashboard from './pages/membership/MembershipDashboard'
import MemberDashboard from './pages/membership/MemberDashboard'
import VendorApplicationForm from './pages/membership/VendorApplicationForm'
import VendorApplicationStatus from './pages/membership/VendorApplicationStatus'
import MemberProductsPage from './pages/membership/MemberProductsPage'
import {
  MembershipBenefitsPage,
  MembershipEventsPage,
  MembershipNotificationsPage,
  MembershipProfilePage,
  MembershipReferralPage,
  MembershipSupportPage,
} from './pages/membership/MembershipPages'
import SecretaryDashboard from './pages/secretary/SecretaryDashboard'
import MembersPage from './pages/secretary/MembersPage'
import MinutesPage from './pages/secretary/MinutesPage'
import AttendancePage from './pages/secretary/AttendancePage'
import DocumentsPage from './pages/secretary/DocumentsPage'
import ReportsPage from './pages/secretary/ReportsPage'
import SettingsPage from './pages/secretary/SettingsPage'
import StateDirectorDashboard from './pages/state-director/StateDirectorDashboard'
import DistrictDirectorDashboard from './pages/district-director/DistrictDirectorDashboard'
import ChapterDirectorDashboard from './pages/chapter-director/ChapterDirectorDashboard'
import PresidentDashboard from './pages/president/PresidentDashboard'
import VicePresidentDashboard from './pages/vice-president/VicePresidentDashboard'

function App() {
  const { role, permissionsLoading, canAccessPath } = useAuth()
  const isAdminSession = ['superadmin', 'admin', 'franchise_admin', 'ecommerce_admin', 'marketplace_admin', 'digital_marketing_admin', 'training_admin', 'finance_admin', 'region_director', 'state_director', 'district_director', 'executive_director', 'launch_director', 'direct_consultant', 'chapter_president', 'vice_president', 'secretary', 'operation_vice_president', 'membership_verification_admin', 'custom_admin'].includes(role)

  const adminRouteDefs = [
    { path: '/admin', element: <SuperAdminDashboardPage /> },
    { path: '/admin/legacy-dashboard', element: <AdminDashboard /> },
    { path: '/admin/admin-management', element: <AdminManagementPage />, roles: ['superadmin'] },
    { path: '/admin/organization', element: <OrganizationManagementPage />, roles: ['superadmin'] },
    { path: '/admin/assignments', element: <HierarchyAssignmentPage />, roles: ['superadmin'] },
    { path: '/admin/roles', element: <SuperAdminModulePage {...superAdminModuleConfigs.roles} />, roles: ['superadmin'] },
    { path: '/admin/permissions', element: <PermissionMatrixPage />, roles: ['superadmin'] },
    { path: '/admin/features', element: <FeatureManagementPage />, roles: ['superadmin'] },
    { path: '/admin/dashboard-config', element: <DashboardConfigurationPage />, roles: ['superadmin'] },
    { path: '/admin/module-config', element: <ModuleConfigurationPage />, roles: ['superadmin'] },
    { path: '/admin/membership-workflow', element: <WorkflowEnginePage />, roles: ['superadmin'] },
    { path: '/admin/workflow-engine', element: <WorkflowEnginePage />, roles: ['superadmin'] },
    { path: '/admin/users', element: <AdminManagementPage /> },
    { path: '/admin/vendors', element: <AdminVendorsPage /> },
    { path: '/admin/approved-vendors', element: <ApprovedVendorsPage /> },
    { path: '/admin/vendor-settings', element: <SuperAdminModulePage {...superAdminModuleConfigs.vendor} /> },
    { path: '/admin/vendor-approval-workflow', element: <VendorApprovalWorkflowPage /> },
    { path: '/admin/locations', element: <LocationsManagementPage /> },
    { path: '/admin/categories', element: <AdminCategoriesPage /> },
    { path: '/admin/business', element: <BusinessNetworkingPage /> },
    { path: '/admin/business-wall', element: <BusinessWallManagementPage /> },
    { path: '/admin/products', element: <AdminProductsPage /> },
    { path: '/admin/services', element: <AdminServicesPage /> },
    { path: '/admin/marketplace-settings', element: <SuperAdminModulePage {...superAdminModuleConfigs.marketplace} /> },
    { path: '/admin/marketplace-approval', element: <MarketplaceApprovalPage /> },
    { path: '/admin/memberships', element: <AdminMembershipsPage /> },
    { path: '/admin/visitors', element: <VisitorManagementPage /> },
    { path: '/admin/visitor-conversion', element: <VisitorConversionEnginePage /> },
    { path: '/admin/attendance', element: <AttendanceEnginePage /> },
    { path: '/admin/meetings', element: <MeetingManagementPage /> },
    { path: '/admin/chapters', element: <ChapterManagementPage /> },
    { path: '/admin/chapter-dashboard', element: <ChapterDashboardPage /> },
    { path: '/admin/applications', element: <AdminMembershipApplicationsPage /> },
    { path: '/admin/applications/membership', element: <AdminMembershipApplicationsPage /> },
    { path: '/admin/applications/franchise', element: <AdminModuleApplicationsPage title="Franchise Applications" /> },
    { path: '/admin/applications/business-network', element: <AdminModuleApplicationsPage title="Business Network Applications" /> },
    { path: '/admin/applications/vendor', element: <AdminVendorApplicationsPage /> },
    { path: '/admin/membership-applications', element: <AdminMembershipApplicationsPage /> },
    { path: '/admin/plans', element: <AdminPlansPage /> },
    { path: '/admin/meeting-settings', element: <MeetingManagementPage /> },
    { path: '/admin/events', element: <AdminEventsPage /> },
    { path: '/admin/training', element: <TrainingManagementPage /> },
    { path: '/admin/testimonials', element: <TestimonialsManagementPage /> },
    { path: '/admin/referrals', element: <ReferralPipelinePage /> },
    { path: '/admin/referrals-table', element: <AdminReferralsPage /> },
    { path: '/admin/payments', element: <AdminPaymentsPage /> },
    { path: '/admin/reviews', element: <AdminReviewsPage /> },
    { path: '/admin/banners', element: <AdminBannersPage /> },
    { path: '/admin/faqs', element: <AdminFaqsPage /> },
    { path: '/admin/settings', element: <AdminSettingsPage /> },
    { path: '/admin/support', element: <AdminSupportPage /> },
    { path: '/admin/reports', element: <EnterpriseReportBuilderPage /> },
    { path: '/admin/reports-center', element: <ReportsCenterPage /> },
    { path: '/admin/analytics', element: <EnterpriseAnalyticsPage /> },
    { path: '/admin/legacy-analytics', element: <AdminAnalytics /> },
    { path: '/admin/scorecards', element: <PerformanceScorecardPage /> },
    { path: '/admin/executive-dashboard', element: <ExecutiveDashboardPage /> },
    { path: '/admin/activity', element: <ActivityCenterPage /> },
    { path: '/admin/global-search', element: <GlobalSearchPage /> },
    { path: '/admin/notifications', element: <NotificationsConfigPage /> },
    { path: '/admin/notification-automation', element: <NotificationAutomationPage /> },
    { path: '/admin/tasks', element: <TaskManagementPage /> },
    { path: '/admin/calendar', element: <EnterpriseCalendarPage /> },
    { path: '/admin/member-journey', element: <MemberJourneyPage /> },
    { path: '/admin/ai-insights', element: <AIInsightsPage /> },
    { path: '/admin/broadcast-notifications', element: <AdminNotifications /> },
    { path: '/admin/audit-logs', element: <AuditLogsPage /> },
    { path: '/admin/system-logs', element: <SystemLogsPage />, roles: ['superadmin'] },
  ]

  const allowedAdminRoutes = adminRouteDefs.filter((route) => {
    if (route.roles?.length && !route.roles.includes(role)) return false
    return canAccessPath(route.path)
  })
  const adminHomePath = allowedAdminRoutes[0]?.path || '/dashboard'

  if (isAdminSession && permissionsLoading) return <LoadingScreen label="Loading access..." />

  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signup" element={<Navigate to="/register" replace />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/nearby" element={<NearbyPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/vendors" element={<VendorsPage />} />
          <Route path="/vendors/:id" element={<DetailPage type="vendors" />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<DetailPage type="products" />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<DetailPage type="services" />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/membership-agreement" element={<MembershipAgreement />} />
          <Route path="/membership-application" element={<MembershipApplication />} />
          <Route path="/membership-qualification" element={<MembershipQualification />} />
          <Route path="/membership-application/track" element={<MembershipApplicationTrack />} />
        </Route>

        <Route element={<ProtectedRoute roles={['admin', 'superadmin']} />}>
          <Route element={<DashboardLayout navItems={adminNav} title="Admin Console" />}>
            {allowedAdminRoutes.map((route) => <Route key={route.path} path={route.path} element={route.element} />)}
            <Route path="/admin/*" element={<Navigate to={adminHomePath} replace />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['vendor']} />}>
          <Route element={<DashboardLayout navItems={vendorNav} title="Vendor Console" />}>
            <Route path="/vendor" element={<VendorDashboard />} />
            <Route path="/vendor/profile" element={<VendorProfilePage />} />
            <Route path="/vendor/products" element={<VendorProductsPage />} />
            <Route path="/vendor/services" element={<VendorServicesPage />} />
            <Route path="/vendor/leads" element={<VendorLeadsPage />} />
            <Route path="/vendor/reviews" element={<VendorReviewsPage />} />
            <Route path="/vendor/membership" element={<VendorMembershipPage />} />
            <Route path="/vendor/payments" element={<VendorPaymentsPage />} />
            <Route path="/vendor/notifications" element={<VendorNotificationsPage />} />
            <Route path="/vendor/support" element={<VendorSupportPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['customer', 'user']} />}>
          <Route element={<DashboardLayout navItems={customerNav} title="Customer Portal" />}>
            <Route path="/customer/wishlist" element={<WishlistPage />} />
            <Route path="/customer/referral" element={<ReferralPage />} />
            <Route path="/customer/notifications" element={<CustomerNotificationsPage />} />
            <Route path="/customer/profile" element={<CustomerProfilePage />} />
            <Route path="/customer/support" element={<CustomerSupportPage />} />
            <Route path="/customer/events" element={<EventsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['customer', 'user', 'vendor']} />}>
          <Route element={<DashboardLayout navItems={membershipNav} title="Membership Console" />}>
            <Route path="/membership/dashboard" element={<MembershipDashboard />} />
            <Route path="/membership/benefits" element={<MembershipBenefitsPage />} />
            <Route path="/membership/events" element={<MembershipEventsPage />} />
            <Route path="/membership/referral" element={<MembershipReferralPage />} />
            <Route path="/membership/notifications" element={<MembershipNotificationsPage />} />
            <Route path="/membership/profile" element={<MembershipProfilePage />} />
            <Route path="/membership/support" element={<MembershipSupportPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['customer', 'user']} />}>
          <Route element={<DashboardLayout navItems={memberNav} title="Member Console" />}>
            <Route path="/member/dashboard" element={<MemberDashboard />} />
            <Route path="/member/vendor-application" element={<VendorApplicationForm />} />
            <Route path="/member/vendor-application-status" element={<VendorApplicationStatus />} />
            <Route path="/member/products" element={<MemberProductsPage />} />
            <Route path="/member/profile" element={<MembershipProfilePage />} />
            <Route path="/member/settings" element={<MembershipProfilePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['secretary']} />}>
          <Route element={<DashboardLayout navItems={secretaryNav} title="Secretary Console" />}>
            <Route path="/secretary" element={<Navigate to="/secretary/dashboard" replace />} />
            <Route path="/secretary/dashboard" element={<SecretaryDashboard />} />
            <Route path="/secretary/members" element={<MembersPage />} />
            <Route path="/secretary/minutes" element={<MinutesPage />} />
            <Route path="/secretary/attendance" element={<AttendancePage />} />
            <Route path="/secretary/documents" element={<DocumentsPage />} />
            <Route path="/secretary/reports" element={<ReportsPage />} />
            <Route path="/secretary/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['state_director']} />}>
          <Route element={<DashboardLayout navItems={stateDirectorNav} title="State Director Console" />}>
            <Route path="/state-director" element={<Navigate to="/state-director/dashboard" replace />} />
            <Route path="/state-director/dashboard" element={<StateDirectorDashboard />} />
            <Route path="/state-director/districts" element={<LocationsManagementPage />} />
            <Route path="/state-director/district-directors" element={<AdminManagementPage />} />
            <Route path="/state-director/memberships" element={<AdminMembershipsPage />} />
            <Route path="/state-director/reports" element={<EnterpriseReportBuilderPage />} />
            <Route path="/state-director/settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['district_director']} />}>
          <Route element={<DashboardLayout navItems={districtDirectorNav} title="District Director Console" />}>
            <Route path="/district-director" element={<Navigate to="/district-director/dashboard" replace />} />
            <Route path="/district-director/dashboard" element={<DistrictDirectorDashboard />} />
            <Route path="/district-director/chapters" element={<LocationsManagementPage />} />
            <Route path="/district-director/executive-directors" element={<AdminManagementPage />} />
            <Route path="/district-director/memberships" element={<AdminMembershipsPage />} />
            <Route path="/district-director/reports" element={<EnterpriseReportBuilderPage />} />
            <Route path="/district-director/settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['executive_director']} />}>
          <Route element={<DashboardLayout navItems={chapterDirectorNav} title="Chapter Director Console" />}>
            <Route path="/chapter-director" element={<Navigate to="/chapter-director/dashboard" replace />} />
            <Route path="/chapter-director/dashboard" element={<ChapterDirectorDashboard />} />
            <Route path="/chapter-director/president" element={<AdminManagementPage />} />
            <Route path="/chapter-director/members" element={<AdminManagementPage role="customer" />} />
            <Route path="/chapter-director/launch-directors" element={<AdminManagementPage />} />
            <Route path="/chapter-director/memberships" element={<AdminMembershipsPage />} />
            <Route path="/chapter-director/reports" element={<EnterpriseReportBuilderPage />} />
            <Route path="/chapter-director/settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['chapter_president']} />}>
          <Route element={<DashboardLayout navItems={presidentNav} title="President Console" />}>
            <Route path="/president" element={<Navigate to="/president/dashboard" replace />} />
            <Route path="/president/dashboard" element={<PresidentDashboard />} />
            <Route path="/president/vice-presidents" element={<AdminManagementPage />} />
            <Route path="/president/memberships" element={<AdminMembershipsPage />} />
            <Route path="/president/reports" element={<EnterpriseReportBuilderPage />} />
            <Route path="/president/settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['vice_president']} />}>
          <Route element={<DashboardLayout navItems={vicePresidentNav} title="Vice President Console" />}>
            <Route path="/vice-president" element={<Navigate to="/vice-president/dashboard" replace />} />
            <Route path="/vice-president/dashboard" element={<VicePresidentDashboard />} />
            <Route path="/vice-president/secretaries" element={<AdminManagementPage />} />
            <Route path="/vice-president/members" element={<AdminManagementPage role="customer" />} />
            <Route path="/vice-president/register-member" element={<AdminManagementPage role="customer" />} />
            <Route path="/vice-president/memberships" element={<AdminMembershipsPage />} />
            <Route path="/vice-president/reports" element={<EnterpriseReportBuilderPage />} />
            <Route path="/vice-president/settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/dashboard" element={<RoleRedirect />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  )
}

export default App
