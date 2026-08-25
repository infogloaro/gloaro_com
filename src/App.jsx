
import { useEffect } from 'react'
import { Navigate, Route, Routes, Outlet, useLocation } from 'react-router-dom'

import { lazy, Suspense } from 'react'

import { Toaster } from 'react-hot-toast'
import { adminNav, customerNav, membershipNav, memberNav, vendorNav, secretaryNav, regionDirectorNav, stateDirectorNav, districtDirectorNav, chapterDirectorNav, presidentNav, vicePresidentNav } from './constants/navigation'
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
import AnalyticsPage from './pages/analytics/AnalyticsPage'
import AdminManagementPage from './pages/admin/AdminManagementPage'
import RegionDirectorManagementPage from './pages/admin/RegionDirectorManagementPage'
import AdminVendorApplicationsPage from './pages/admin/AdminVendorApplicationsPage'
import AdminVendorCategoryApprovalsPage from './pages/admin/AdminVendorCategoryApprovalsPage'
import AdminShippingPage from './pages/admin/AdminShippingPage'
import ApprovedVendorsPage from './pages/shared/ApprovedVendorsPage'
import {
  AdminReferralTrackingPage,
  AuditLogsPage,
  DashboardConfigurationPage,
  FeatureManagementPage,
  // PermissionMatrixPage,
  ReferralManagementPage,

  ReportsCenterPage,
  AdminEnterpriseDashboard,
  SuperAdminDashboardPage,
  SuperAdminModulePage,
  SystemLogsPage,
} from './pages/admin/SuperAdminPages'
import { superAdminModuleConfigs } from './constants/superAdminModuleConfigs'
import { buildAdminRoute } from './utils/permissions'
import {
  ActivityCenterPage,
  AIInsightsPage,
  BusinessWallManagementPage,
  BusinessNetworkingPage,
  ChapterManagementPage,
  ChapterDashboardPage,
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
  AdminLeadersPage,
  AdminGalleryPage,
  AdminCategoriesPage,
  AdminEventsPage,
  AdminFaqsPage,
  AdminModuleApplicationsPage,
  AdminMembershipApplicationsPage,
  AdminMembershipsPage,
  AdminMembersPage,
  AdminPaymentsPage,
  AdminOrdersPage,
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
import VendorCategoryApprovalsPage from './pages/vendor/VendorCategoryApprovalsPage'
import {
  VendorLeadsPage,
  VendorNotificationsPage,
  VendorPaymentsPage,
  VendorAnalyticsPage,
  VendorProductsPage,
  VendorProfilePage,
  VendorServiceEnquiriesPage,
  VendorReviewsPage,
  VendorServicesPage,
  VendorOrdersPage,
} from './pages/vendor/VendorPages'
import {
  CategoriesPage,
  CustomerNotificationsPage,
  CustomerSupportPage,
  EventsPage,
  NearbyPage,
  ReferralPage,
  ReviewsPage,
  ServicesPage,
  VendorsPage,
} from './pages/customer/ListingPages'
import { CartPage, CheckoutPage, DetailPage, OrderDetailPage, OrdersPage, ProductsPage, WishlistPage as ShopWishlistPage } from './pages/customer/ShopPages'
import { CustomerAddressesPage, CustomerDashboardPage, CustomerProfileFoundationPage } from './pages/customer/CustomerFoundationPages'
import CustomerBusinessPage from './pages/customer/CustomerBusinessPage'
import NotificationsPage from './pages/shared/NotificationsPage'
import ProfilePage from './pages/shared/ProfilePage'
import EnterpriseScorecardPage from './pages/shared/EnterpriseScorecardPage'
import Home from './pages/Home'
import MembershipAgreement from './pages/public/MembershipAgreement'
import MembershipApplication from './pages/public/MembershipApplication'
import MembershipQualification from './pages/public/MembershipQualification'
import MembershipApplicationTrack from './pages/public/MembershipApplicationTrack'
import LegalPage from './pages/public/LegalPage'
const AboutPage = lazy(() => import('./pages/public/AboutPage'))
import MembershipDashboard from './pages/membership/MembershipDashboard'
import MemberDashboard from './pages/membership/MemberDashboard'
import VendorApplicationForm from './pages/membership/VendorApplicationForm'
import VendorApplicationStatus from './pages/membership/VendorApplicationStatus'
import MembershipApplicationStatus from './pages/membership/MembershipApplicationStatus'
import MemberProductsPage from './pages/membership/MemberProductsPage'
import { RegionDirectorProductsPage, RegionDirectorServicesPage, RegionDirectorVendorsPage } from './pages/region-director/RegionDirectorPages'
import { StateDirectorProductsPage, StateDirectorServicesPage, StateDirectorVendorsPage } from './pages/state-director/StateDirectorPages'
import { DistrictDirectorProductsPage, DistrictDirectorServicesPage, DistrictDirectorVendorsPage } from './pages/district-director/DistrictDirectorPages'
import { LaunchDirectorProductsPage, LaunchDirectorServicesPage, LaunchDirectorVendorsPage } from './pages/launch-director/LaunchDirectorPages'
import { DirectConsultantProductsPage, DirectConsultantServicesPage, DirectConsultantVendorsPage } from './pages/direct-consultant/DirectConsultantPages'
import { PresidentProductsPage, PresidentServicesPage, PresidentVendorsPage } from './pages/president/PresidentPages'
import { VicePresidentProductsPage, VicePresidentServicesPage, VicePresidentVendorsPage } from './pages/vice-president/VicePresidentPages'
import VicePresidentVendorApplicationsPage from './pages/vice-president/VicePresidentVendorApplicationsPage'
import { SecretaryProductsPage, SecretaryServicesPage, SecretaryVendorsPage } from './pages/secretary/SecretaryPages'
import {
  MembershipBenefitsPage,
  MembershipEventsPage,
  MembershipNotificationsPage,
  MembershipProfilePage,
  MembershipReferralPage,
  MembershipSupportPage,
} from './pages/membership/MembershipPages'
import MemberProfilePage from './pages/membership/MemberProfilePage'
import SecretaryDashboard from './pages/secretary/SecretaryDashboard'
import MembersPage from './pages/secretary/MembersPage'
import MinutesPage from './pages/secretary/MinutesPage'
import AttendancePage from './pages/secretary/AttendancePage'
import DocumentsPage from './pages/secretary/DocumentsPage'
import ReportsPage from './pages/secretary/ReportsPage'
import SettingsPage from './pages/secretary/SettingsPage'
import SecretaryCategoriesPage from './pages/secretary/SecretaryCategoriesPage'
import SecretaryMemberDetailsPage from './pages/secretary/SecretaryMemberDetailsPage'
import SecretaryEventsPage from './pages/secretary/SecretaryEventsPage'
import StateDirectorDashboard from './pages/state-director/StateDirectorDashboard'
import DistrictDirectorDashboard from './pages/district-director/DistrictDirectorDashboard'
import ChapterDirectorDashboard from './pages/chapter-director/ChapterDirectorDashboard'
import UnitApprovalsPage from './pages/chapter-director/UnitApprovalsPage'
import { ChapterDirectorProductsPage, ChapterDirectorServicesPage, ChapterDirectorVendorsPage } from './pages/chapter-director/ChapterDirectorPages'
import LaunchDirectorDashboard from './pages/launch-director/LaunchDirectorDashboard'
import DirectConsultantDashboard from './pages/direct-consultant/DirectConsultantDashboard'
import PresidentDashboard from './pages/president/PresidentDashboard'
import VicePresidentDashboard from './pages/vice-president/VicePresidentDashboard'
import DynamicDashboard from './pages/shared/DynamicDashboard'

import MyChapter from './pages/membership/MyChapter'
import BusinessWall from './pages/membership/BusinessWall'
import CommunityPage from './pages/membership/community/CommunityPage'
import ChatSystem from './pages/membership/ChatSystem'
import ReferralsPipeline from './pages/membership/ReferralsPipeline'
import BusinessConnectPage from './pages/member/BusinessConnectPage'
import ReceivedBusinessPage from './pages/member/ReceivedBusinessPage'
import MeetingsAttendance from './pages/membership/MeetingsAttendance'
import AssignedTrainingPage from './pages/membership/AssignedTrainingPage'
import OneToOnesPage from './pages/membership/OneToOnesPage'
import VisitorsPage from './pages/membership/VisitorsPage'
import BusinessDirectory from './pages/membership/BusinessDirectory'
import { ROLES } from './constants/roleConfig.js'
import { getAccountClassification, normalizeRole } from './utils/permissions'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  const { role: rawRole, permissionsLoading, canAccessPath } = useAuth()
  const role = normalizeRole(rawRole)
  const isAdminSession = [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.FRANCHISE_ADMIN, ROLES.ECOMMERCE_ADMIN, ROLES.MARKETPLACE_ADMIN, ROLES.DIGITAL_MARKETING_ADMIN, ROLES.TRAINING_ADMIN, ROLES.FINANCE_ADMIN, ROLES.REGION_DIRECTOR, ROLES.STATE_DIRECTOR, ROLES.DISTRICT_DIRECTOR, ROLES.EXECUTIVE_DIRECTOR, ROLES.LAUNCH_DIRECTOR, ROLES.DIRECT_CONSULTANT, ROLES.CHAPTER_PRESIDENT, ROLES.VICE_PRESIDENT, ROLES.SECRETARY, ROLES.OPERATION_VICE_PRESIDENT, ROLES.MEMBERSHIP_VERIFICATION_ADMIN, ROLES.CUSTOM_ADMIN].includes(role)

  const adminRouteDefs = [
    { path: '/dashboard', element: <SuperAdminDashboardPage /> },
    { path: '/scorecard', element: <EnterpriseScorecardPage /> },
    { path: '/legacy-dashboard', element: <AdminDashboard /> },
    { path: '/admin-management', element: <AdminManagementPage />, roles: [ROLES.SUPERADMIN] },
    { path: '/organization', element: <OrganizationManagementPage />, roles: [ROLES.SUPERADMIN] },
    { path: '/region-directors', element: <RegionDirectorManagementPage />, roles: [ROLES.ADMIN, ROLES.SUPERADMIN] },
    { path: '/organization/region-directors', element: <RegionDirectorManagementPage />, roles: [ROLES.ADMIN, ROLES.SUPERADMIN] },
    { path: '/assignments', element: <HierarchyAssignmentPage />, roles: [ROLES.SUPERADMIN] },
    { path: '/features', element: <FeatureManagementPage />, roles: [ROLES.SUPERADMIN] },
    { path: '/dashboard-config', element: <DashboardConfigurationPage />, roles: [ROLES.SUPERADMIN] },
    { path: '/banners', element: <AdminBannersPage />, roles: [ROLES.SUPERADMIN, ROLES.ADMIN] },
    { path: '/leaders', element: <AdminLeadersPage />, roles: [ROLES.SUPERADMIN, ROLES.ADMIN] },
    { path: '/gallery', element: <AdminGalleryPage />, roles: [ROLES.SUPERADMIN, ROLES.ADMIN] },
    { path: '/membership-workflow', element: <WorkflowEnginePage />, roles: [ROLES.SUPERADMIN] },
    { path: '/users', element: <AdminManagementPage /> },
    { path: '/vendors', element: <ApprovedVendorsPage /> },
    { path: '/approved-vendors', element: <ApprovedVendorsPage /> },
    { path: '/vendor-settings', element: <SuperAdminModulePage {...superAdminModuleConfigs.vendor} /> },
    { path: '/vendor-approval-workflow', element: <VendorApprovalWorkflowPage /> },
    { path: '/vendor-category-approvals', element: <AdminVendorCategoryApprovalsPage /> },
    { path: '/locations', element: <LocationsManagementPage /> },
    { path: '/marketplace/categories', element: <AdminCategoriesPage /> },
    { path: '/business', element: <BusinessNetworkingPage /> },
    { path: '/business-wall', element: <BusinessWallManagementPage /> },
    { path: '/products', element: <AdminProductsPage /> },
    { path: '/services', element: <AdminServicesPage /> },
    { path: '/marketplace-approval', element: <MarketplaceApprovalPage /> },
    { path: '/members', element: <AdminMembersPage /> },
    { path: '/visitors', element: <VisitorManagementPage /> },
    { path: '/visitor-conversion', element: <VisitorConversionEnginePage /> },
    { path: '/attendance', element: <AttendancePage /> },
    { path: '/meetings', element: <MeetingManagementPage /> },
    { path: '/chapters', element: <ChapterManagementPage />, roles: [ROLES.ADMIN, ROLES.SUPERADMIN] },
    { path: '/chapter-dashboard', element: <ChapterDashboardPage /> },
    { path: '/membership-applications', element: <AdminMembershipApplicationsPage /> },
    { path: '/events', element: <AdminEventsPage /> },
    { path: '/training', element: <TrainingManagementPage /> },
    { path: '/testimonials', element: <TestimonialsManagementPage /> },
    { path: '/my-referrals', element: <ReferralsPipeline /> },
    { path: '/business-connects', element: <BusinessConnectPage /> },
    { path: '/received-business', element: <ReceivedBusinessPage /> },
    { path: '/referral-management', element: <ReferralManagementPage />, roles: [ROLES.SUPERADMIN] },
    { path: '/referral-management', element: <AdminReferralTrackingPage /> },
    { path: '/referrals', element: <ReferralPipelinePage /> },
    { path: '/referrals-table', element: <AdminReferralsPage /> },
    { path: '/payments', element: <AdminPaymentsPage /> },
    { path: '/orders', element: <AdminOrdersPage /> },
    { path: '/shipments', element: <AdminShippingPage /> },
    { path: '/reviews', element: <AdminReviewsPage /> },
    { path: '/faqs', element: <AdminFaqsPage /> },
    { path: '/settings', element: <AdminSettingsPage /> },
    { path: '/analytics', element: <AnalyticsPage /> },
    { path: '/legacy-analytics', element: <AdminAnalytics /> },
    { path: '/notifications', element: <NotificationsPage /> },
    { path: '/tasks', element: <TaskManagementPage /> },
    { path: '/calendar', element: <EnterpriseCalendarPage /> },
    { path: '/network', element: <CommunityPage scope="network" />, roles: [ROLES.ADMIN, ROLES.SUPERADMIN] },
    { path: '/wall', element: <BusinessWall />, roles: [ROLES.ADMIN, ROLES.SUPERADMIN] },
    { path: '/chat', element: <ChatSystem />, roles: [ROLES.ADMIN, ROLES.SUPERADMIN] },
    { path: '/audit-logs', element: <AuditLogsPage /> },
    { path: '/system-logs', element: <SystemLogsPage />, roles: [ROLES.SUPERADMIN, ROLES.ADMIN] },
    { path: '/profile', element: <MembershipProfilePage /> },
  ]

  const superAdminRoutes = adminRouteDefs.filter((route) => {
    if (route.path === '/settings') return false
    if (route.roles?.length && !route.roles.includes(role)) return false
    return canAccessPath(buildAdminRoute(ROLES.SUPERADMIN, route.path))
  }).map((route) => ({
    ...route,
    path: buildAdminRoute(ROLES.SUPERADMIN, route.path)
  }))

  const regularAdminRoutes = adminRouteDefs.filter((route) => {
    if (route.path === '/settings') return false
    if (route.roles?.length && !route.roles.includes(role)) return false
    return canAccessPath(buildAdminRoute(ROLES.ADMIN, route.path))
  }).map((route) => ({
    ...route,
    path: buildAdminRoute(ROLES.ADMIN, route.path),
    element: route.path === '/dashboard' ? <AdminEnterpriseDashboard /> : route.element,
  }))

  const adminDashboardPath = buildAdminRoute(ROLES.ADMIN, '/dashboard')
  const adminHomePath = regularAdminRoutes.some((route) => route.path === adminDashboardPath)
    ? adminDashboardPath
    : (regularAdminRoutes[0]?.path || adminDashboardPath)

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signup" element={<Navigate to="/register" replace />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
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
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<ShopWishlistPage />} />
          <Route path="/customer/wishlist" element={<Navigate to="/wishlist" replace />} />
          <Route element={<ProtectedRoute unauthenticatedMessage="Please sign in before checkout." />}>
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:orderId" element={<OrderDetailPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<DetailPage type="services" />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/membership-agreement" element={<MembershipAgreement />} />
          <Route path="/membership-application" element={<MembershipApplication />} />
          <Route path="/membership-applications" element={<MembershipApplicationsRedirect />} />
          <Route path="/membership-qualification" element={<MembershipQualification />} />
          <Route path="/membership-application/track" element={<MembershipApplicationTrack />} />
          <Route path="/about" element={<Suspense fallback={<LoadingScreen />}><AboutPage /></Suspense>} />
          <Route path="/terms-and-conditions" element={<LegalPage type="terms" />} />
          <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />
          <Route path="/shipping-policy" element={<LegalPage type="shipping" />} />
          <Route path="/cancellation-refund-policy" element={<LegalPage type="refund" />} />
        </Route>

        <Route element={<ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.REGION_DIRECTOR, ROLES.STATE_DIRECTOR, ROLES.DISTRICT_DIRECTOR, ROLES.EXECUTIVE_DIRECTOR, ROLES.LAUNCH_DIRECTOR, ROLES.DIRECT_CONSULTANT, ROLES.CHAPTER_PRESIDENT, ROLES.VICE_PRESIDENT, ROLES.SECRETARY, ROLES.CUSTOMER, ROLES.USER, ROLES.VENDOR]} />}>
          <Route element={<DashboardLayout title="Gloaro Portal" />}>
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            {[
              '/scorecard',
              '/membership/scorecard',
              '/member/dashboard/scorecard',
              '/customer/scorecard',
              '/vendor/scorecard',
              '/secretary/scorecard',
              '/vice-president/scorecard',
              '/president/scorecard',
              '/chapter-director/scorecard',
              '/district-director/scorecard',
              '/state-director/scorecard',
              '/region-director/scorecard',
              '/launch-director/scorecard',
              '/direct-consultant/scorecard',
            ].map((path) => <Route key={path} path={path} element={<EnterpriseScorecardPage />} />)}
            
            {/* Super Admin Console Route Group */}
            <Route element={<ProtectedRoute roles={[ROLES.SUPERADMIN]} />}>
              {superAdminRoutes.map((route) => <Route key={route.path} path={route.path} element={route.element} />)}
              <Route path="/super-admin/*" element={<Navigate to="/super-admin/dashboard" replace />} />
            </Route>

            {/* Admin Console Route Group */}
            <Route element={<ProtectedRoute roles={[ROLES.ADMIN, ROLES.REGION_DIRECTOR, ROLES.STATE_DIRECTOR, ROLES.DISTRICT_DIRECTOR, ROLES.EXECUTIVE_DIRECTOR, ROLES.LAUNCH_DIRECTOR, ROLES.DIRECT_CONSULTANT, ROLES.CHAPTER_PRESIDENT, ROLES.VICE_PRESIDENT, ROLES.SECRETARY]} />}>
              {regularAdminRoutes.map((route) => <Route key={route.path} path={route.path} element={route.element} />)}
              <Route path="/admin/*" element={<Navigate to={adminHomePath} replace />} />
            </Route>

            {/* Vendor Console Route Group */}
            <Route element={<ProtectedRoute roles={[ROLES.VENDOR]} />}>
              <Route path="/vendor" element={<VendorDashboard />} />
              <Route path="/vendor/profile" element={<VendorProfilePage />} />
              <Route path="/vendor/settings" element={<ProfilePage />} />
              <Route path="/vendor/business-categories" element={<VendorCategoryApprovalsPage />} />
              <Route path="/vendor/products" element={<VendorProductsPage />} />
              <Route path="/vendor/services" element={<VendorServicesPage />} />
              <Route path="/vendor/orders" element={<VendorOrdersPage />} />
              <Route path="/vendor/leads" element={<VendorLeadsPage />} />
              <Route path="/vendor/service-enquiries" element={<VendorServiceEnquiriesPage />} />
              <Route path="/vendor/reviews" element={<VendorReviewsPage />} />
              <Route path="/vendor/payments" element={<VendorPaymentsPage />} />
              <Route path="/vendor/analytics" element={<VendorAnalyticsPage />} />
              <Route path="/vendor/notifications" element={<VendorNotificationsPage />} />
            </Route>

            {/* Customer Portal Route Group */}
            <Route element={<ProtectedRoute roles={[ROLES.CUSTOMER, ROLES.USER]} />}>
              <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
              <Route path="/customer/business-opportunities" element={<CustomerBusinessPage />} />
              <Route path="/customer/addresses" element={<CustomerAddressesPage />} />
              <Route path="/customer/wishlist" element={<ShopWishlistPage />} />
              <Route path="/customer/referral" element={<ReferralPage />} />
              <Route path="/customer/notifications" element={<CustomerNotificationsPage />} />
              <Route path="/customer/profile" element={<CustomerProfileFoundationPage />} />
              <Route path="/customer/support" element={<CustomerSupportPage />} />
              <Route path="/customer/events" element={<EventsPage />} />
            </Route>

            {/* Membership Console Route Group */}
            <Route element={<ProtectedRoute roles={[ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.FRANCHISE_ADMIN, ROLES.ECOMMERCE_ADMIN, ROLES.MARKETPLACE_ADMIN, ROLES.DIGITAL_MARKETING_ADMIN, ROLES.TRAINING_ADMIN, ROLES.FINANCE_ADMIN, ROLES.REGION_DIRECTOR, ROLES.STATE_DIRECTOR, ROLES.DISTRICT_DIRECTOR, ROLES.EXECUTIVE_DIRECTOR, ROLES.LAUNCH_DIRECTOR, ROLES.DIRECT_CONSULTANT, ROLES.CHAPTER_PRESIDENT, ROLES.VICE_PRESIDENT, ROLES.SECRETARY, ROLES.CUSTOMER, ROLES.USER, ROLES.VENDOR]} />}>
              <Route path="/membership/dashboard" element={<MembershipDashboard />} />
              <Route path="/membership/benefits" element={<MembershipBenefitsPage />} />
              <Route path="/membership/events" element={<MembershipEventsPage />} />
              <Route path="/membership/referral" element={<MembershipReferralPage />} />
              <Route path="/membership/notifications" element={<MembershipNotificationsPage />} />
              <Route path="/membership/training" element={<AssignedTrainingPage />} />
              <Route path="/membership/profile" element={<MembershipProfilePage />} />
              <Route path="/membership/support" element={<MembershipSupportPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
            </Route>

            {/* Member Console Route Group */}
            <Route element={<ProtectedRoute roles={[ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.FRANCHISE_ADMIN, ROLES.ECOMMERCE_ADMIN, ROLES.MARKETPLACE_ADMIN, ROLES.DIGITAL_MARKETING_ADMIN, ROLES.TRAINING_ADMIN, ROLES.FINANCE_ADMIN, ROLES.REGION_DIRECTOR, ROLES.STATE_DIRECTOR, ROLES.DISTRICT_DIRECTOR, ROLES.EXECUTIVE_DIRECTOR, ROLES.LAUNCH_DIRECTOR, ROLES.DIRECT_CONSULTANT, ROLES.CHAPTER_PRESIDENT, ROLES.VICE_PRESIDENT, ROLES.SECRETARY, ROLES.CUSTOMER, ROLES.USER, ROLES.VENDOR]} />}>
              <Route path="/member/vendor-application" element={<VendorApplicationForm />} />
              <Route path="/member/vendor-application-status" element={<VendorApplicationStatus />} />
              <Route path="/member/membership-agreement" element={<MembershipAgreement />} />
              <Route path="/member/membership-application" element={<MembershipApplication />} />
              <Route path="/member/membership-qualification" element={<MembershipQualification />} />
              <Route path="/member/profile" element={<MemberProfilePage />} />
              <Route path="/member/dashboard/profile" element={<MemberProfilePage />} />
              
              {/* Parameterized main dashboard sub-views */}
              <Route path="/member/dashboard" element={<MemberDashboard />} />
              <Route path="/member/dashboard/:tab" element={<MemberDashboard />} />
              <Route path="/member/wall" element={<BusinessWall />} />
              <Route path="/member/network" element={<CommunityPage scope="network" />} />
              <Route path="/member/chat" element={<ChatSystem />} />
              <Route path="/member/referrals" element={<ReferralsPipeline />} />
              <Route path="/member/business-connects" element={<BusinessConnectPage />} />
              <Route path="/member/received-business" element={<ReceivedBusinessPage />} />
              <Route path="/member/training" element={<AssignedTrainingPage />} />
              <Route path="/member/attendance" element={<AttendancePage />} />
              <Route path="/member/dashboard/attendance" element={<AttendancePage />} />

              {/* Protected Marketplace routes */}
              <Route element={<MarketplaceRoute />}>
                <Route path="/member/products" element={<MemberProductsPage />} />
                <Route path="/member/dashboard/my-business" element={<VendorProfilePage />} />
              <Route path="/member/dashboard/business-categories" element={<VendorCategoryApprovalsPage />} />
              <Route path="/member/dashboard/products" element={<VendorProductsPage />} />
              <Route path="/member/dashboard/products-mgmt" element={<VendorProductsPage />} />
              <Route path="/member/dashboard/services" element={<VendorServicesPage />} />
              <Route path="/member/dashboard/services-mgmt" element={<VendorServicesPage />} />
              <Route path="/member/dashboard/orders" element={<VendorOrdersPage />} />
              <Route path="/member/dashboard/leads" element={<VendorLeadsPage />} />
              <Route path="/member/dashboard/reviews" element={<VendorReviewsPage />} />
              <Route path="/member/dashboard/payments" element={<VendorPaymentsPage />} />
              <Route path="/member/dashboard/notifications" element={<VendorNotificationsPage />} />
              <Route path="/member/dashboard/vendor-analytics" element={<VendorAnalyticsPage />} />
            </Route>
            </Route>

            {/* Online Vendor Onboarding Route Group */}
            <Route element={<ProtectedRoute roles={[ROLES.CUSTOMER, ROLES.USER, ROLES.VENDOR]} />}>
              <Route path="/vendor/onboarding" element={<VendorApplicationForm />} />
              <Route path="/vendor/onboarding-status" element={<VendorApplicationStatus />} />
              <Route path="/vendor/account" element={<ProfilePage />} />
            </Route>

            <Route path="/member/membership-application-status" element={<MembershipApplicationStatus />} />

            {/* Coordinator Console Route Group */}
            <Route element={<ProtectedRoute roles={[ROLES.SECRETARY]} />}>
              <Route path="/secretary" element={<Navigate to="/secretary/dashboard" replace />} />
              <Route path="/secretary/dashboard" element={<SecretaryDashboard />} />
              <Route path="/secretary/members" element={<MembersPage />} />
              <Route path="/secretary/members/:id" element={<SecretaryMemberDetailsPage />} />
              <Route path="/secretary/categories" element={<SecretaryCategoriesPage />} />
              <Route path="/secretary/events" element={<SecretaryEventsPage />} />
              <Route path="/secretary/minutes" element={<MinutesPage />} />
              <Route path="/secretary/attendance" element={<AttendancePage />} />
              <Route path="/secretary/documents" element={<DocumentsPage />} />
              <Route path="/secretary/reports" element={<ReportsPage />} />
              <Route path="/secretary/settings" element={<SettingsPage />} />
              {/* Inherited Base Member Modules */}
              <Route path="/secretary/chapter" element={<MyChapter />} />
              <Route path="/secretary/wall" element={<BusinessWall />} />
              <Route path="/secretary/network" element={<CommunityPage scope="network" />} />
              <Route path="/secretary/chat" element={<ChatSystem />} />
              <Route path="/secretary/referrals" element={<ReferralsPipeline />} />
              <Route path="/secretary/business-connects" element={<BusinessConnectPage />} />
              <Route path="/secretary/received-business" element={<ReceivedBusinessPage />} />
              <Route path="/secretary/meetings" element={<MeetingsAttendance />} />
              <Route path="/secretary/one-to-ones" element={<OneToOnesPage />} />
              <Route path="/secretary/visitors" element={<VisitorsPage />} />
              <Route path="/secretary/directory" element={<BusinessDirectory />} />
              <Route path="/secretary/products" element={<SecretaryProductsPage />} />
              <Route path="/secretary/services" element={<SecretaryServicesPage />} />
              <Route path="/secretary/vendors" element={<SecretaryVendorsPage />} />
              <Route path="/secretary/profile" element={<MembershipProfilePage />} />
            </Route>

            {/* Region Director Console */}
            <Route element={<ProtectedRoute roles={[ROLES.REGION_DIRECTOR]} />}>
              <Route path="/region-director" element={<Navigate to="/region-director/dashboard" replace />} />
              <Route path="/region-director/dashboard" element={<AdminDashboard />} />
              <Route path="/region-director/locations" element={<LocationsManagementPage />} />
              <Route path="/region-director/state-directors" element={<AdminManagementPage />} />
              <Route path="/region-director/members" element={<AdminMembersPage />} />
              <Route path="/region-director/memberships" element={<AdminMembershipsPage />} />
              <Route path="/region-director/approved-vendors" element={<ApprovedVendorsPage />} />
              <Route path="/region-director/reports" element={<EnterpriseReportBuilderPage />} />
              <Route path="/region-director/settings" element={<AdminSettingsPage />} />
              {/* Inherited Base Member Modules */}
              <Route path="/region-director/chapter" element={<MyChapter />} />
              <Route path="/region-director/wall" element={<BusinessWall />} />
              <Route path="/region-director/network" element={<CommunityPage scope="network" />} />
              <Route path="/region-director/chat" element={<ChatSystem />} />
              <Route path="/region-director/referrals" element={<ReferralsPipeline />} />
              <Route path="/region-director/business-connects" element={<BusinessConnectPage />} />
              <Route path="/region-director/received-business" element={<ReceivedBusinessPage />} />
              <Route path="/region-director/meetings" element={<MeetingsAttendance />} />
              <Route path="/region-director/attendance" element={<AttendancePage />} />
              <Route path="/region-director/one-to-ones" element={<OneToOnesPage />} />
              <Route path="/region-director/visitors" element={<VisitorsPage />} />
              <Route path="/region-director/directory" element={<BusinessDirectory />} />
              <Route path="/region-director/products" element={<RegionDirectorProductsPage />} />
              <Route path="/region-director/services" element={<RegionDirectorServicesPage />} />
              <Route path="/region-director/vendors" element={<RegionDirectorVendorsPage />} />
              <Route path="/region-director/profile" element={<MembershipProfilePage />} />
            </Route>

            {/* State Director Console */}
            <Route element={<ProtectedRoute roles={[ROLES.STATE_DIRECTOR]} />}>
              <Route path="/state-director" element={<Navigate to="/state-director/dashboard" replace />} />
              <Route path="/state-director/dashboard" element={<StateDirectorDashboard />} />
              <Route path="/state-director/districts" element={<LocationsManagementPage />} />
              <Route path="/state-director/locations" element={<LocationsManagementPage />} />
              <Route path="/state-director/district-directors" element={<AdminManagementPage />} />
              <Route path="/state-director/members" element={<AdminMembersPage />} />
              <Route path="/state-director/memberships" element={<AdminMembershipsPage />} />
              <Route path="/state-director/reports" element={<EnterpriseReportBuilderPage />} />
              <Route path="/state-director/settings" element={<AdminSettingsPage />} />
              {/* Inherited Base Member Modules */}
              <Route path="/state-director/chapter" element={<MyChapter />} />
              <Route path="/state-director/wall" element={<BusinessWall />} />
              <Route path="/state-director/network" element={<CommunityPage scope="network" />} />
              <Route path="/state-director/chat" element={<ChatSystem />} />
              <Route path="/state-director/referrals" element={<ReferralsPipeline />} />
              <Route path="/state-director/business-connects" element={<BusinessConnectPage />} />
              <Route path="/state-director/received-business" element={<ReceivedBusinessPage />} />
              <Route path="/state-director/meetings" element={<MeetingsAttendance />} />
              <Route path="/state-director/attendance" element={<AttendancePage />} />
              <Route path="/state-director/one-to-ones" element={<OneToOnesPage />} />
              <Route path="/state-director/visitors" element={<VisitorsPage />} />
              <Route path="/state-director/directory" element={<BusinessDirectory />} />
              <Route path="/state-director/products" element={<StateDirectorProductsPage />} />
              <Route path="/state-director/services" element={<StateDirectorServicesPage />} />
              <Route path="/state-director/vendors" element={<StateDirectorVendorsPage />} />
              <Route path="/state-director/profile" element={<MembershipProfilePage />} />
            </Route>

            {/* District Director Console */}
            <Route element={<ProtectedRoute roles={[ROLES.DISTRICT_DIRECTOR]} />}>
              <Route path="/district-director" element={<Navigate to="/district-director/dashboard" replace />} />
              <Route path="/district-director/dashboard" element={<DistrictDirectorDashboard />} />
              <Route path="/district-director/chapters" element={<LocationsManagementPage />} />
              <Route path="/district-director/locations" element={<LocationsManagementPage />} />
              <Route path="/district-director/chapter" element={<MyChapter />} />
              <Route path="/district-director/executive-directors" element={<AdminManagementPage role={ROLES.EXECUTIVE_DIRECTOR} />} />
              <Route path="/district-director/reports" element={<EnterpriseReportBuilderPage />} />
              <Route path="/district-director/settings" element={<AdminSettingsPage />} />
              
              {/* Inherited Base Member Modules */}
              <Route path="/district-director/wall" element={<BusinessWall />} />
              <Route path="/district-director/network" element={<CommunityPage scope="network" />} />
              <Route path="/district-director/chat" element={<ChatSystem />} />
              <Route path="/district-director/referrals" element={<ReferralsPipeline />} />
              <Route path="/district-director/business-connects" element={<BusinessConnectPage />} />
              <Route path="/district-director/received-business" element={<ReceivedBusinessPage />} />
              <Route path="/district-director/meetings" element={<MeetingsAttendance />} />
              <Route path="/district-director/attendance" element={<AttendancePage />} />
              <Route path="/district-director/one-to-ones" element={<OneToOnesPage />} />
              <Route path="/district-director/visitors" element={<VisitorsPage />} />
              <Route path="/district-director/directory" element={<BusinessDirectory />} />
              <Route path="/district-director/products" element={<DistrictDirectorProductsPage />} />
              <Route path="/district-director/services" element={<DistrictDirectorServicesPage />} />
              <Route path="/district-director/vendors" element={<DistrictDirectorVendorsPage />} />
              <Route path="/district-director/profile" element={<MembershipProfilePage />} />

              {/* District Director Custom Operations */}
              <Route path="/district-director/members" element={<AdminMembersPage />} />
            </Route>

            {/* Unit Director Console */}
            <Route element={<ProtectedRoute roles={[ROLES.EXECUTIVE_DIRECTOR]} />}>
              <Route path="/chapter-director" element={<Navigate to="/chapter-director/dashboard" replace />} />
              <Route path="/chapter-director/dashboard" element={<ChapterDirectorDashboard />} />
              <Route path="/chapter-director/vendor-category-approvals" element={<AdminVendorCategoryApprovalsPage />} />
              <Route path="/chapter-director/president" element={<AdminManagementPage />} />
              <Route path="/chapter-director/members" element={<AdminMembersPage />} />
              <Route path="/chapter-director/launch-directors" element={<AdminManagementPage />} />
              <Route path="/chapter-director/memberships" element={<AdminMembershipsPage />} />
              <Route path="/chapter-director/membership-applications" element={<AdminMembershipApplicationsPage />} />
              <Route path="/chapter-director/unit-approvals" element={<UnitApprovalsPage />} />
              <Route path="/chapter-director/reports" element={<EnterpriseReportBuilderPage />} />
              <Route path="/chapter-director/settings" element={<AdminSettingsPage />} />
              {/* Inherited Base Member Modules */}
              <Route path="/chapter-director/chapter" element={<MyChapter />} />
              <Route path="/chapter-director/wall" element={<Navigate to="/chapter-director/dashboard" replace />} />
              <Route path="/chapter-director/business-wall" element={<Navigate to="/chapter-director/dashboard" replace />} />
              <Route path="/chapter-director/network" element={<CommunityPage scope="network" />} />
              <Route path="/chapter-director/chat" element={<ChatSystem />} />
              <Route path="/chapter-director/referrals" element={<ReferralsPipeline />} />
              <Route path="/chapter-director/business-connects" element={<BusinessConnectPage />} />
              <Route path="/chapter-director/received-business" element={<ReceivedBusinessPage />} />
              <Route path="/chapter-director/meetings" element={<MeetingsAttendance />} />
              <Route path="/chapter-director/attendance" element={<AttendancePage />} />
              <Route path="/chapter-director/one-to-ones" element={<OneToOnesPage />} />
              <Route path="/chapter-director/visitors" element={<VisitorsPage />} />
              <Route path="/chapter-director/directory" element={<BusinessDirectory />} />
              <Route path="/chapter-director/products" element={<ChapterDirectorProductsPage />} />
              <Route path="/chapter-director/services" element={<ChapterDirectorServicesPage />} />
              <Route path="/chapter-director/vendors" element={<ChapterDirectorVendorsPage />} />
              <Route path="/chapter-director/profile" element={<MembershipProfilePage />} />

              {/* Unit Director specific sub-routes */}
              <Route path="/chapter-director/launch-directors" element={<AdminManagementPage role={ROLES.LAUNCH_DIRECTOR} />} />
              <Route path="/chapter-director/vendor-applications" element={<AdminVendorApplicationsPage />} />
              <Route path="/chapter-director/marketplace-approval" element={<AdminVendorApplicationsPage title="Marketplace Approval" description="Review and manage vendor marketplace applications for your chapter." />} />
              <Route path="/chapter-director/approved-vendors" element={<ApprovedVendorsPage />} />
            </Route>

            {/* Unit Chairman Console */}
            <Route element={<ProtectedRoute roles={[ROLES.CHAPTER_PRESIDENT]} />}>
              <Route path="/president" element={<Navigate to="/president/dashboard" replace />} />
              <Route path="/president/dashboard" element={<PresidentDashboard />} />
              <Route path="/president/vice-presidents" element={<AdminManagementPage />} />
              <Route path="/president/members" element={<AdminMembersPage />} />
              <Route path="/president/approved-vendors" element={<ApprovedVendorsPage />} />
              <Route path="/president/reports" element={<EnterpriseReportBuilderPage />} />
              <Route path="/president/settings" element={<AdminSettingsPage />} />
              {/* Inherited Base Member Modules */}
              <Route path="/president/chapter" element={<MyChapter />} />
              <Route path="/president/wall" element={<BusinessWall />} />
              <Route path="/president/network" element={<CommunityPage scope="network" />} />
              <Route path="/president/chat" element={<ChatSystem />} />
              <Route path="/president/referrals" element={<ReferralsPipeline />} />
              <Route path="/president/business-connects" element={<BusinessConnectPage />} />
              <Route path="/president/received-business" element={<ReceivedBusinessPage />} />
              <Route path="/president/meetings" element={<MeetingsAttendance />} />
              <Route path="/president/attendance" element={<AttendancePage />} />
              <Route path="/president/one-to-ones" element={<OneToOnesPage />} />
              <Route path="/president/visitors" element={<VisitorsPage />} />
              <Route path="/president/directory" element={<BusinessDirectory />} />
              <Route path="/president/products" element={<PresidentProductsPage />} />
              <Route path="/president/services" element={<PresidentServicesPage />} />
              <Route path="/president/vendors" element={<PresidentVendorsPage />} />
              <Route path="/president/profile" element={<MembershipProfilePage />} />
            </Route>

            {/* Unit Vice Chairman Console */}
            <Route element={<ProtectedRoute roles={[ROLES.VICE_PRESIDENT]} />}>
              <Route path="/vice-president" element={<Navigate to="/vice-president/dashboard" replace />} />
              <Route path="/vice-president/dashboard" element={<VicePresidentDashboard />} />
              <Route path="/vice-president/secretaries" element={<AdminManagementPage />} />
              <Route path="/vice-president/members" element={<AdminMembersPage />} />
              <Route path="/vice-president/register-member" element={<AdminManagementPage role={ROLES.CUSTOMER} />} />
              <Route path="/vice-president/memberships" element={<AdminMembershipsPage />} />
              <Route path="/vice-president/membership-applications" element={<AdminMembershipApplicationsPage />} />
              <Route path="/vice-president/vendor-applications" element={<VicePresidentVendorApplicationsPage />} />
              <Route path="/vice-president/vendor-category-approvals" element={<AdminVendorCategoryApprovalsPage />} />
              <Route path="/vice-president/approved-vendors" element={<ApprovedVendorsPage />} />
              <Route path="/vice-president/reports" element={<EnterpriseReportBuilderPage />} />
              <Route path="/vice-president/settings" element={<AdminSettingsPage />} />
              {/* Inherited Base Member Modules */}
              <Route path="/vice-president/chapter" element={<MyChapter />} />
              <Route path="/vice-president/wall" element={<BusinessWall />} />
              <Route path="/vice-president/network" element={<CommunityPage scope="network" />} />
              <Route path="/vice-president/chat" element={<ChatSystem />} />
              <Route path="/vice-president/referrals" element={<ReferralsPipeline />} />
              <Route path="/vice-president/business-connects" element={<BusinessConnectPage />} />
              <Route path="/vice-president/received-business" element={<ReceivedBusinessPage />} />
              <Route path="/vice-president/meetings" element={<MeetingsAttendance />} />
              <Route path="/vice-president/attendance" element={<AttendancePage />} />
              <Route path="/vice-president/one-to-ones" element={<OneToOnesPage />} />
              <Route path="/vice-president/visitors" element={<VisitorsPage />} />
              <Route path="/vice-president/directory" element={<BusinessDirectory />} />
              <Route path="/vice-president/products" element={<VicePresidentProductsPage />} />
              <Route path="/vice-president/services" element={<VicePresidentServicesPage />} />
              <Route path="/vice-president/vendors" element={<VicePresidentVendorsPage />} />
              <Route path="/vice-president/profile" element={<MembershipProfilePage />} />
            </Route>

            {/* Launch Director Console (Backend: Direct Consultant) */}
            <Route element={<ProtectedRoute roles={[ROLES.LAUNCH_DIRECTOR]} />}>
              <Route path="/launch-director" element={<Navigate to="/launch-director/dashboard" replace />} />
              <Route path="/launch-director/dashboard" element={<LaunchDirectorDashboard />} />
              
              {/* Inherited Base Member Modules */}
              <Route path="/launch-director/chapter" element={<MyChapter />} />
              <Route path="/launch-director/wall" element={<Navigate to="/launch-director/dashboard" replace />} />
              <Route path="/launch-director/network" element={<CommunityPage scope="network" />} />
              <Route path="/launch-director/chat" element={<ChatSystem />} />
              <Route path="/launch-director/referrals" element={<ReferralsPipeline />} />
              <Route path="/launch-director/business-connects" element={<BusinessConnectPage />} />
              <Route path="/launch-director/received-business" element={<ReceivedBusinessPage />} />
              <Route path="/launch-director/meetings" element={<MeetingsAttendance />} />
              <Route path="/launch-director/attendance" element={<AttendancePage />} />
              <Route path="/launch-director/one-to-ones" element={<OneToOnesPage />} />
              <Route path="/launch-director/visitors" element={<VisitorsPage />} />
              <Route path="/launch-director/directory" element={<BusinessDirectory />} />
              <Route path="/launch-director/products" element={<LaunchDirectorProductsPage />} />
              <Route path="/launch-director/services" element={<LaunchDirectorServicesPage />} />
              <Route path="/launch-director/vendors" element={<LaunchDirectorVendorsPage />} />
              <Route path="/launch-director/profile" element={<MembershipProfilePage />} />

              {/* Launch Director Specific Modules */}
              <Route path="/launch-director/members" element={<AdminManagementPage role={ROLES.CUSTOMER} />} />
              <Route path="/launch-director/direct-consultants" element={<AdminManagementPage role={ROLES.DIRECT_CONSULTANT} />} />
              <Route path="/launch-director/launch-reports" element={<EnterpriseReportBuilderPage />} />
              <Route path="/launch-director/membership-reports" element={<EnterpriseReportBuilderPage />} />
            </Route>

            {/* Direct Consultant Console (Backend: Launch Director) */}
            <Route element={<ProtectedRoute roles={[ROLES.DIRECT_CONSULTANT]} />}>
              <Route path="/direct-consultant" element={<Navigate to="/direct-consultant/dashboard" replace />} />
              <Route path="/direct-consultant/dashboard" element={<DirectConsultantDashboard />} />
              
              {/* Inherited Base Member Modules */}
              <Route path="/direct-consultant/chapter" element={<MyChapter />} />
              <Route path="/direct-consultant/wall" element={<Navigate to="/direct-consultant/dashboard" replace />} />
              <Route path="/direct-consultant/network" element={<CommunityPage scope="network" />} />
              <Route path="/direct-consultant/chat" element={<ChatSystem />} />
              <Route path="/direct-consultant/referrals" element={<ReferralsPipeline />} />
              <Route path="/direct-consultant/business-connects" element={<BusinessConnectPage />} />
              <Route path="/direct-consultant/received-business" element={<ReceivedBusinessPage />} />
              <Route path="/direct-consultant/meetings" element={<MeetingsAttendance />} />
              <Route path="/direct-consultant/attendance" element={<AttendancePage />} />
              <Route path="/direct-consultant/one-to-ones" element={<OneToOnesPage />} />
              <Route path="/direct-consultant/visitors" element={<VisitorsPage />} />
              <Route path="/direct-consultant/directory" element={<BusinessDirectory />} />
              <Route path="/direct-consultant/products" element={<DirectConsultantProductsPage />} />
              <Route path="/direct-consultant/services" element={<DirectConsultantServicesPage />} />
              <Route path="/direct-consultant/vendors" element={<DirectConsultantVendorsPage />} />
              <Route path="/direct-consultant/profile" element={<MembershipProfilePage />} />

              {/* Direct Consultant Specific Modules */}
              <Route path="/direct-consultant/members" element={<AdminManagementPage role={ROLES.CUSTOMER} />} />
              <Route path="/direct-consultant/units" element={<LocationsManagementPage />} />
              <Route path="/direct-consultant/presidents" element={<AdminManagementPage role={ROLES.CHAPTER_PRESIDENT} />} />
            </Route>

          </Route>

          <Route element={<DashboardLayout title="Gloaro Portal" theme="light" />}>
            <Route element={<ProtectedRoute roles={[ROLES.SUPERADMIN]} />}>
              {superAdminRoutes.map((route) => <Route key={route.path} path={route.path} element={route.element} />)}
              <Route path="/super-admin/*" element={<Navigate to="/super-admin/dashboard" replace />} />
            </Route>
          </Route>
        </Route>

        <Route path="/dashboard" element={<RoleRedirect />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  )
}

function MarketplaceRoute() {
  const { marketplaceAccess, vendorApplication, user } = useAuth()
  const account = getAccountClassification(user)

  if (marketplaceAccess === 'NOT_APPLIED') {
    return <Navigate to={account.isOnlineVendor ? '/vendor' : '/member/dashboard'} replace />
  }

  if (marketplaceAccess === 'PENDING') {
    if (vendorApplication?.status === 'draft') {
      return <Navigate to={account.isOnlineVendor ? '/vendor/onboarding' : '/member/vendor-application'} replace />
    }
    return <Navigate to={account.isOnlineVendor ? '/vendor/onboarding-status' : '/member/vendor-application-status'} replace />
  }

  return <Outlet />
}

function MembershipApplicationsRedirect() {
  const { user } = useAuth()
  const account = getAccountClassification(user)

  return <Navigate to={account.registrationType === 'vendor' ? '/vendor/onboarding' : '/membership-application'} replace />
}

export default App
