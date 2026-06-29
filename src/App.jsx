import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { adminNav, customerNav, vendorNav } from './constants/navigation'
import DashboardLayout from './layouts/DashboardLayout'
import PublicLayout from './layouts/PublicLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleRedirect from './routes/RoleRedirect'
import AuthLayout from './pages/auth/AuthLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import VerifyEmail from './pages/auth/VerifyEmail'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminNotifications from './pages/admin/AdminNotifications'
import {
  AdminBannersPage,
  AdminCategoriesPage,
  AdminEventsPage,
  AdminFaqsPage,
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

function App() {
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
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/vendors" element={<AdminVendorsPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/services" element={<AdminServicesPage />} />
            <Route path="/admin/memberships" element={<AdminMembershipsPage />} />
            <Route path="/admin/membership-applications" element={<AdminMembershipApplicationsPage />} />
            <Route path="/admin/plans" element={<AdminPlansPage />} />
            <Route path="/admin/events" element={<AdminEventsPage />} />
            <Route path="/admin/referrals" element={<AdminReferralsPage />} />
            <Route path="/admin/payments" element={<AdminPaymentsPage />} />
            <Route path="/admin/reviews" element={<AdminReviewsPage />} />
            <Route path="/admin/banners" element={<AdminBannersPage />} />
            <Route path="/admin/faqs" element={<AdminFaqsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
            <Route path="/admin/support" element={<AdminSupportPage />} />
            <Route path="/admin/reports" element={<AdminAnalytics />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
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

        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/dashboard" element={<RoleRedirect />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  )
}

export default App
