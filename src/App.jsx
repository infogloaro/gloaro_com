
import { useEffect } from 'react'
import { Navigate, Route, Routes, Outlet, useLocation } from 'react-router-dom'

import { lazy, Suspense } from 'react'

import { Toaster } from 'react-hot-toast'
import { adminNav, customerNav, membershipNav, memberNav, vendorNav, secretaryNav, regionDirectorNav, stateDirectorNav, districtDirectorNav, chapterDirectorNav, presidentNav, vicePresidentNav } from './constants/navigation'
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'))
import PublicLayout from './layouts/PublicLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleRedirect from './routes/RoleRedirect'
import LoadingScreen from './components/common/LoadingScreen'
import Seo from './components/Seo'
import GlobalExplore from './components/explore/GlobalExplore'
const SolutionsPage = lazy(() => import('./pages/solutions/SolutionsPage'))
const BusinessThemesPage = lazy(() => import('./pages/solutions/BusinessThemesPage'))
const EnquiryPage = lazy(() => import('./pages/solutions/EnquiryPage'))
const TechServicePage = lazy(() => import('./pages/tech/ServicePage'))
const DigitalMarketingPage = lazy(() => import('./pages/tech/DigitalMarketingPage'))
const PrototypeShell = lazy(() => import('./prototypes/PrototypeShell'))
const NetworkHome = lazy(() => import('./pages/public/NetworkHome'))
import { useAuth } from './hooks/useAuth'
const AuthLayout = lazy(() => import('./pages/auth/AuthLayout'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'))
const AnalyticsPage = lazy(() => import('./pages/analytics/AnalyticsPage'))
const AdminManagementPage = lazy(() => import('./pages/admin/AdminManagementPage'))
const RegionDirectorManagementPage = lazy(() => import('./pages/admin/RegionDirectorManagementPage'))
const AdminVendorApplicationsPage = lazy(() => import('./pages/admin/AdminVendorApplicationsPage'))
const AdminVendorCategoryApprovalsPage = lazy(() => import('./pages/admin/AdminVendorCategoryApprovalsPage'))
const AdminShippingPage = lazy(() => import('./pages/admin/AdminShippingPage'))
const ApprovedVendorsPage = lazy(() => import('./pages/shared/ApprovedVendorsPage'))
const AdminReferralTrackingPage = lazy(() => import('./pages/admin/SuperAdminPages').then((m) => ({ default: m.AdminReferralTrackingPage })))
const AuditLogsPage = lazy(() => import('./pages/admin/SuperAdminPages').then((m) => ({ default: m.AuditLogsPage })))
const DashboardConfigurationPage = lazy(() => import('./pages/admin/SuperAdminPages').then((m) => ({ default: m.DashboardConfigurationPage })))
const FeatureManagementPage = lazy(() => import('./pages/admin/SuperAdminPages').then((m) => ({ default: m.FeatureManagementPage })))
const ReferralManagementPage = lazy(() => import('./pages/admin/SuperAdminPages').then((m) => ({ default: m.ReferralManagementPage })))
const ReportsCenterPage = lazy(() => import('./pages/admin/SuperAdminPages').then((m) => ({ default: m.ReportsCenterPage })))
const AdminEnterpriseDashboard = lazy(() => import('./pages/admin/SuperAdminPages').then((m) => ({ default: m.AdminEnterpriseDashboard })))
const SuperAdminDashboardPage = lazy(() => import('./pages/admin/SuperAdminPages').then((m) => ({ default: m.SuperAdminDashboardPage })))
const SuperAdminModulePage = lazy(() => import('./pages/admin/SuperAdminPages').then((m) => ({ default: m.SuperAdminModulePage })))
const SystemLogsPage = lazy(() => import('./pages/admin/SuperAdminPages').then((m) => ({ default: m.SystemLogsPage })))
import { superAdminModuleConfigs } from './constants/superAdminModuleConfigs'
import { buildAdminRoute } from './utils/permissions'
const ActivityCenterPage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.ActivityCenterPage })))
const AIInsightsPage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.AIInsightsPage })))
const BusinessWallManagementPage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.BusinessWallManagementPage })))
const BusinessNetworkingPage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.BusinessNetworkingPage })))
const ChapterManagementPage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.ChapterManagementPage })))
const ChapterDashboardPage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.ChapterDashboardPage })))
const EnterpriseCalendarPage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.EnterpriseCalendarPage })))
const EnterpriseReportBuilderPage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.EnterpriseReportBuilderPage })))
const ExecutiveDashboardPage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.ExecutiveDashboardPage })))
const GlobalSearchPage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.GlobalSearchPage })))
const HierarchyAssignmentPage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.HierarchyAssignmentPage })))
const MarketplaceApprovalPage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.MarketplaceApprovalPage })))
const MeetingManagementPage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.MeetingManagementPage })))
const MemberJourneyPage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.MemberJourneyPage })))
const NotificationAutomationPage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.NotificationAutomationPage })))
const OrganizationManagementPage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.OrganizationManagementPage })))
const PerformanceScorecardPage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.PerformanceScorecardPage })))
const ReferralPipelinePage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.ReferralPipelinePage })))
const TestimonialsManagementPage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.TestimonialsManagementPage })))
const TaskManagementPage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.TaskManagementPage })))
const TrainingManagementPage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.TrainingManagementPage })))
const VendorApprovalWorkflowPage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.VendorApprovalWorkflowPage })))
const VisitorConversionEnginePage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.VisitorConversionEnginePage })))
const VisitorManagementPage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.VisitorManagementPage })))
const WorkflowEnginePage = lazy(() => import('./pages/admin/EnterpriseManagementPages').then((m) => ({ default: m.WorkflowEnginePage })))
const AdminBannersPage = lazy(() => import('./pages/admin/AdminResourcePages').then((m) => ({ default: m.AdminBannersPage })))
const AdminLeadersPage = lazy(() => import('./pages/admin/AdminResourcePages').then((m) => ({ default: m.AdminLeadersPage })))
const AdminGalleryPage = lazy(() => import('./pages/admin/AdminResourcePages').then((m) => ({ default: m.AdminGalleryPage })))
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminResourcePages').then((m) => ({ default: m.AdminCategoriesPage })))
const AdminEventsPage = lazy(() => import('./pages/admin/AdminResourcePages').then((m) => ({ default: m.AdminEventsPage })))
const AdminFaqsPage = lazy(() => import('./pages/admin/AdminResourcePages').then((m) => ({ default: m.AdminFaqsPage })))
const AdminModuleApplicationsPage = lazy(() => import('./pages/admin/AdminResourcePages').then((m) => ({ default: m.AdminModuleApplicationsPage })))
const AdminMembershipApplicationsPage = lazy(() => import('./pages/admin/AdminResourcePages').then((m) => ({ default: m.AdminMembershipApplicationsPage })))
const AdminMembershipsPage = lazy(() => import('./pages/admin/AdminResourcePages').then((m) => ({ default: m.AdminMembershipsPage })))
const AdminMembersPage = lazy(() => import('./pages/admin/AdminResourcePages').then((m) => ({ default: m.AdminMembersPage })))
const AdminPaymentsPage = lazy(() => import('./pages/admin/AdminResourcePages').then((m) => ({ default: m.AdminPaymentsPage })))
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminResourcePages').then((m) => ({ default: m.AdminOrdersPage })))
const AdminProductsPage = lazy(() => import('./pages/admin/AdminResourcePages').then((m) => ({ default: m.AdminProductsPage })))
const AdminReferralsPage = lazy(() => import('./pages/admin/AdminResourcePages').then((m) => ({ default: m.AdminReferralsPage })))
const AdminReviewsPage = lazy(() => import('./pages/admin/AdminResourcePages').then((m) => ({ default: m.AdminReviewsPage })))
const AdminServicesPage = lazy(() => import('./pages/admin/AdminResourcePages').then((m) => ({ default: m.AdminServicesPage })))
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminResourcePages').then((m) => ({ default: m.AdminSettingsPage })))
const AdminSupportPage = lazy(() => import('./pages/admin/AdminResourcePages').then((m) => ({ default: m.AdminSupportPage })))
const AdminUsersPage = lazy(() => import('./pages/admin/AdminResourcePages').then((m) => ({ default: m.AdminUsersPage })))
const AdminVendorsPage = lazy(() => import('./pages/admin/AdminResourcePages').then((m) => ({ default: m.AdminVendorsPage })))
const LocationsManagementPage = lazy(() => import('./pages/admin/LocationsManagementPage'))
const VendorDashboard = lazy(() => import('./pages/vendor/VendorDashboard'))
const VendorCategoryApprovalsPage = lazy(() => import('./pages/vendor/VendorCategoryApprovalsPage'))
const VendorLeadsPage = lazy(() => import('./pages/vendor/VendorPages').then((m) => ({ default: m.VendorLeadsPage })))
const VendorNotificationsPage = lazy(() => import('./pages/vendor/VendorPages').then((m) => ({ default: m.VendorNotificationsPage })))
const VendorPaymentsPage = lazy(() => import('./pages/vendor/VendorPages').then((m) => ({ default: m.VendorPaymentsPage })))
const VendorAnalyticsPage = lazy(() => import('./pages/vendor/VendorPages').then((m) => ({ default: m.VendorAnalyticsPage })))
const VendorProductsPage = lazy(() => import('./pages/vendor/VendorPages').then((m) => ({ default: m.VendorProductsPage })))
const VendorProfilePage = lazy(() => import('./pages/vendor/VendorPages').then((m) => ({ default: m.VendorProfilePage })))
const VendorServiceEnquiriesPage = lazy(() => import('./pages/vendor/VendorPages').then((m) => ({ default: m.VendorServiceEnquiriesPage })))
const VendorReviewsPage = lazy(() => import('./pages/vendor/VendorPages').then((m) => ({ default: m.VendorReviewsPage })))
const VendorServicesPage = lazy(() => import('./pages/vendor/VendorPages').then((m) => ({ default: m.VendorServicesPage })))
const VendorOrdersPage = lazy(() => import('./pages/vendor/VendorPages').then((m) => ({ default: m.VendorOrdersPage })))
const CategoriesPage = lazy(() => import('./pages/customer/ListingPages').then((m) => ({ default: m.CategoriesPage })))
const CustomerNotificationsPage = lazy(() => import('./pages/customer/ListingPages').then((m) => ({ default: m.CustomerNotificationsPage })))
const CustomerSupportPage = lazy(() => import('./pages/customer/ListingPages').then((m) => ({ default: m.CustomerSupportPage })))
const EventsPage = lazy(() => import('./pages/customer/ListingPages').then((m) => ({ default: m.EventsPage })))
const NearbyPage = lazy(() => import('./pages/customer/ListingPages').then((m) => ({ default: m.NearbyPage })))
const ReferralPage = lazy(() => import('./pages/customer/ListingPages').then((m) => ({ default: m.ReferralPage })))
const ReviewsPage = lazy(() => import('./pages/customer/ListingPages').then((m) => ({ default: m.ReviewsPage })))
const ServicesPage = lazy(() => import('./pages/customer/ListingPages').then((m) => ({ default: m.ServicesPage })))
const VendorsPage = lazy(() => import('./pages/customer/ListingPages').then((m) => ({ default: m.VendorsPage })))
const CartPage = lazy(() => import('./pages/customer/ShopPages').then((m) => ({ default: m.CartPage })))
const CheckoutPage = lazy(() => import('./pages/customer/ShopPages').then((m) => ({ default: m.CheckoutPage })))
const DetailPage = lazy(() => import('./pages/customer/ShopPages').then((m) => ({ default: m.DetailPage })))
const OrderDetailPage = lazy(() => import('./pages/customer/ShopPages').then((m) => ({ default: m.OrderDetailPage })))
const OrdersPage = lazy(() => import('./pages/customer/ShopPages').then((m) => ({ default: m.OrdersPage })))
const ProductsPage = lazy(() => import('./pages/customer/ShopPages').then((m) => ({ default: m.ProductsPage })))
const ShopWishlistPage = lazy(() => import('./pages/customer/ShopPages').then((m) => ({ default: m.WishlistPage })))
const CustomerAddressesPage = lazy(() => import('./pages/customer/CustomerFoundationPages').then((m) => ({ default: m.CustomerAddressesPage })))
const CustomerDashboardPage = lazy(() => import('./pages/customer/CustomerFoundationPages').then((m) => ({ default: m.CustomerDashboardPage })))
const CustomerProfileFoundationPage = lazy(() => import('./pages/customer/CustomerFoundationPages').then((m) => ({ default: m.CustomerProfileFoundationPage })))
const CustomerBusinessPage = lazy(() => import('./pages/customer/CustomerBusinessPage'))
const NotificationsPage = lazy(() => import('./pages/shared/NotificationsPage'))
const ProfilePage = lazy(() => import('./pages/shared/ProfilePage'))
const EnterpriseScorecardPage = lazy(() => import('./pages/shared/EnterpriseScorecardPage'))
import Home from './pages/Home'
const MembershipAgreement = lazy(() => import('./pages/public/MembershipAgreement'))
const MembershipApplication = lazy(() => import('./pages/public/MembershipApplication'))
const MembershipQualification = lazy(() => import('./pages/public/MembershipQualification'))
const MembershipApplicationTrack = lazy(() => import('./pages/public/MembershipApplicationTrack'))
const LegalPage = lazy(() => import('./pages/public/LegalPage'))
const AboutPage = lazy(() => import('./pages/public/AboutPage'))
const MartLandingPage = lazy(() => import('./pages/mart/MartLandingPage'))
const PartnersLanding = lazy(() => import('./pages/partners/PartnersLanding'))
const FranchisePage = lazy(() => import('./pages/partners/FranchisePage'))
const ChannelPartnerPage = lazy(() => import('./pages/partners/ChannelPartnerPage'))
const PartnerApplyPage = lazy(() => import('./pages/partners/PartnerApplyPage'))
const PartnershipApplicationsPage = lazy(() => import('./pages/admin/PartnershipApplicationsPage'))
const MembershipDashboard = lazy(() => import('./pages/membership/MembershipDashboard'))
const MemberDashboard = lazy(() => import('./pages/membership/MemberDashboard'))
const VendorApplicationForm = lazy(() => import('./pages/membership/VendorApplicationForm'))
const VendorApplicationStatus = lazy(() => import('./pages/membership/VendorApplicationStatus'))
const MembershipApplicationStatus = lazy(() => import('./pages/membership/MembershipApplicationStatus'))
const MemberProductsPage = lazy(() => import('./pages/membership/MemberProductsPage'))
const RegionDirectorProductsPage = lazy(() => import('./pages/region-director/RegionDirectorPages').then((m) => ({ default: m.RegionDirectorProductsPage })))
const RegionDirectorServicesPage = lazy(() => import('./pages/region-director/RegionDirectorPages').then((m) => ({ default: m.RegionDirectorServicesPage })))
const RegionDirectorVendorsPage = lazy(() => import('./pages/region-director/RegionDirectorPages').then((m) => ({ default: m.RegionDirectorVendorsPage })))
const StateDirectorProductsPage = lazy(() => import('./pages/state-director/StateDirectorPages').then((m) => ({ default: m.StateDirectorProductsPage })))
const StateDirectorServicesPage = lazy(() => import('./pages/state-director/StateDirectorPages').then((m) => ({ default: m.StateDirectorServicesPage })))
const StateDirectorVendorsPage = lazy(() => import('./pages/state-director/StateDirectorPages').then((m) => ({ default: m.StateDirectorVendorsPage })))
const DistrictDirectorProductsPage = lazy(() => import('./pages/district-director/DistrictDirectorPages').then((m) => ({ default: m.DistrictDirectorProductsPage })))
const DistrictDirectorServicesPage = lazy(() => import('./pages/district-director/DistrictDirectorPages').then((m) => ({ default: m.DistrictDirectorServicesPage })))
const DistrictDirectorVendorsPage = lazy(() => import('./pages/district-director/DistrictDirectorPages').then((m) => ({ default: m.DistrictDirectorVendorsPage })))
const LaunchDirectorProductsPage = lazy(() => import('./pages/launch-director/LaunchDirectorPages').then((m) => ({ default: m.LaunchDirectorProductsPage })))
const LaunchDirectorServicesPage = lazy(() => import('./pages/launch-director/LaunchDirectorPages').then((m) => ({ default: m.LaunchDirectorServicesPage })))
const LaunchDirectorVendorsPage = lazy(() => import('./pages/launch-director/LaunchDirectorPages').then((m) => ({ default: m.LaunchDirectorVendorsPage })))
const DirectConsultantProductsPage = lazy(() => import('./pages/direct-consultant/DirectConsultantPages').then((m) => ({ default: m.DirectConsultantProductsPage })))
const DirectConsultantServicesPage = lazy(() => import('./pages/direct-consultant/DirectConsultantPages').then((m) => ({ default: m.DirectConsultantServicesPage })))
const DirectConsultantVendorsPage = lazy(() => import('./pages/direct-consultant/DirectConsultantPages').then((m) => ({ default: m.DirectConsultantVendorsPage })))
const PresidentProductsPage = lazy(() => import('./pages/president/PresidentPages').then((m) => ({ default: m.PresidentProductsPage })))
const PresidentServicesPage = lazy(() => import('./pages/president/PresidentPages').then((m) => ({ default: m.PresidentServicesPage })))
const PresidentVendorsPage = lazy(() => import('./pages/president/PresidentPages').then((m) => ({ default: m.PresidentVendorsPage })))
const VicePresidentProductsPage = lazy(() => import('./pages/vice-president/VicePresidentPages').then((m) => ({ default: m.VicePresidentProductsPage })))
const VicePresidentServicesPage = lazy(() => import('./pages/vice-president/VicePresidentPages').then((m) => ({ default: m.VicePresidentServicesPage })))
const VicePresidentVendorsPage = lazy(() => import('./pages/vice-president/VicePresidentPages').then((m) => ({ default: m.VicePresidentVendorsPage })))
const VicePresidentVendorApplicationsPage = lazy(() => import('./pages/vice-president/VicePresidentVendorApplicationsPage'))
const SecretaryProductsPage = lazy(() => import('./pages/secretary/SecretaryPages').then((m) => ({ default: m.SecretaryProductsPage })))
const SecretaryServicesPage = lazy(() => import('./pages/secretary/SecretaryPages').then((m) => ({ default: m.SecretaryServicesPage })))
const SecretaryVendorsPage = lazy(() => import('./pages/secretary/SecretaryPages').then((m) => ({ default: m.SecretaryVendorsPage })))
const MembershipBenefitsPage = lazy(() => import('./pages/membership/MembershipPages').then((m) => ({ default: m.MembershipBenefitsPage })))
const MembershipEventsPage = lazy(() => import('./pages/membership/MembershipPages').then((m) => ({ default: m.MembershipEventsPage })))
const MembershipNotificationsPage = lazy(() => import('./pages/membership/MembershipPages').then((m) => ({ default: m.MembershipNotificationsPage })))
const MembershipProfilePage = lazy(() => import('./pages/membership/MembershipPages').then((m) => ({ default: m.MembershipProfilePage })))
const MembershipReferralPage = lazy(() => import('./pages/membership/MembershipPages').then((m) => ({ default: m.MembershipReferralPage })))
const MembershipSupportPage = lazy(() => import('./pages/membership/MembershipPages').then((m) => ({ default: m.MembershipSupportPage })))
const MemberProfilePage = lazy(() => import('./pages/membership/MemberProfilePage'))
const SecretaryDashboard = lazy(() => import('./pages/secretary/SecretaryDashboard'))
const MembersPage = lazy(() => import('./pages/secretary/MembersPage'))
const MinutesPage = lazy(() => import('./pages/secretary/MinutesPage'))
const AttendancePage = lazy(() => import('./pages/secretary/AttendancePage'))
const DocumentsPage = lazy(() => import('./pages/secretary/DocumentsPage'))
const ReportsPage = lazy(() => import('./pages/secretary/ReportsPage'))
const SettingsPage = lazy(() => import('./pages/secretary/SettingsPage'))
const SecretaryCategoriesPage = lazy(() => import('./pages/secretary/SecretaryCategoriesPage'))
const SecretaryMemberDetailsPage = lazy(() => import('./pages/secretary/SecretaryMemberDetailsPage'))
const SecretaryEventsPage = lazy(() => import('./pages/secretary/SecretaryEventsPage'))
const StateDirectorDashboard = lazy(() => import('./pages/state-director/StateDirectorDashboard'))
const DistrictDirectorDashboard = lazy(() => import('./pages/district-director/DistrictDirectorDashboard'))
const ChapterDirectorDashboard = lazy(() => import('./pages/chapter-director/ChapterDirectorDashboard'))
const UnitApprovalsPage = lazy(() => import('./pages/chapter-director/UnitApprovalsPage'))
const ChapterDirectorProductsPage = lazy(() => import('./pages/chapter-director/ChapterDirectorPages').then((m) => ({ default: m.ChapterDirectorProductsPage })))
const ChapterDirectorServicesPage = lazy(() => import('./pages/chapter-director/ChapterDirectorPages').then((m) => ({ default: m.ChapterDirectorServicesPage })))
const ChapterDirectorVendorsPage = lazy(() => import('./pages/chapter-director/ChapterDirectorPages').then((m) => ({ default: m.ChapterDirectorVendorsPage })))
const LaunchDirectorDashboard = lazy(() => import('./pages/launch-director/LaunchDirectorDashboard'))
const DirectConsultantDashboard = lazy(() => import('./pages/direct-consultant/DirectConsultantDashboard'))
const PresidentDashboard = lazy(() => import('./pages/president/PresidentDashboard'))
const VicePresidentDashboard = lazy(() => import('./pages/vice-president/VicePresidentDashboard'))
const DynamicDashboard = lazy(() => import('./pages/shared/DynamicDashboard'))

const MyChapter = lazy(() => import('./pages/membership/MyChapter'))
const BusinessWall = lazy(() => import('./pages/membership/BusinessWall'))
const CommunityPage = lazy(() => import('./pages/membership/community/CommunityPage'))
const ChatSystem = lazy(() => import('./pages/membership/ChatSystem'))
const ReferralsPipeline = lazy(() => import('./pages/membership/ReferralsPipeline'))
const BusinessConnectPage = lazy(() => import('./pages/member/BusinessConnectPage'))
const ReceivedBusinessPage = lazy(() => import('./pages/member/ReceivedBusinessPage'))
const MeetingsAttendance = lazy(() => import('./pages/membership/MeetingsAttendance'))
const AssignedTrainingPage = lazy(() => import('./pages/membership/AssignedTrainingPage'))
const OneToOnesPage = lazy(() => import('./pages/membership/OneToOnesPage'))
const VisitorsPage = lazy(() => import('./pages/membership/VisitorsPage'))
const BusinessDirectory = lazy(() => import('./pages/membership/BusinessDirectory'))
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
    { path: '/partnership-applications', element: <PartnershipApplicationsPage />, roles: [ROLES.SUPERADMIN, ROLES.ADMIN] },
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
      <Seo />
      <ScrollToTop />
      {/* Mounted once above the routes so it survives navigation between the
          public layout and the standalone /mart page. Hides itself elsewhere. */}
      <GlobalExplore />
      <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/mart" element={<Suspense fallback={<LoadingScreen />}><MartLandingPage /></Suspense>} />
        {/* Partner applications use a focused layout without the site navigation. */}
        <Route path="/partners/franchise/apply" element={<Suspense fallback={<LoadingScreen />}><PartnerApplyPage pathKey="franchise" /></Suspense>} />
        <Route path="/partners/channel-partner/apply" element={<Suspense fallback={<LoadingScreen />}><PartnerApplyPage pathKey="channel" /></Suspense>} />
        <Route path="/prototypes/:businessId/:themeId" element={<Suspense fallback={<LoadingScreen />}><PrototypeShell /></Suspense>} />
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
          <Route path="/network" element={<Suspense fallback={<LoadingScreen />}><NetworkHome /></Suspense>} />
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
          <Route path="/solutions" element={<Suspense fallback={<LoadingScreen />}><SolutionsPage /></Suspense>} />
          <Route path="/solutions/:businessId" element={<Suspense fallback={<LoadingScreen />}><BusinessThemesPage /></Suspense>} />
          <Route path="/tech/digital-marketing" element={<Suspense fallback={<LoadingScreen />}><DigitalMarketingPage /></Suspense>} />
          <Route path="/tech/:slug" element={<Suspense fallback={<LoadingScreen />}><TechServicePage /></Suspense>} />
          <Route path="/contact" element={<Suspense fallback={<LoadingScreen />}><EnquiryPage /></Suspense>} />
          <Route path="/about" element={<Suspense fallback={<LoadingScreen />}><AboutPage /></Suspense>} />
          <Route path="/partners" element={<Suspense fallback={<LoadingScreen />}><PartnersLanding /></Suspense>} />
          <Route path="/partners/franchise" element={<Suspense fallback={<LoadingScreen />}><FranchisePage /></Suspense>} />
          <Route path="/partners/channel-partner" element={<Suspense fallback={<LoadingScreen />}><ChannelPartnerPage /></Suspense>} />
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
      </Suspense>
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
