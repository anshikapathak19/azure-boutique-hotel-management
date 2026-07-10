import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import PublicLayout from '@/layouts/PublicLayout.jsx'
import GuestLayout from '@/layouts/GuestLayout.jsx'
import StaffLayout from '@/layouts/StaffLayout.jsx'
import AdminLayout from '@/layouts/AdminLayout.jsx'
import LoadingSpinner from '@/components/ui/LoadingSpinner.jsx'
import NotFoundPage from '@/pages/public/NotFoundPage.jsx'

import { ROUTES } from '@/config/routes.js'

const LandingPage = lazy(() => import('@/pages/public/LandingPage.jsx'))
const LoginPage = lazy(() => import('@/pages/public/LoginPage.jsx'))
const RegisterPage = lazy(() => import('@/pages/public/RegisterPage.jsx'))
const ForgotPasswordPage = lazy(() => import('@/pages/public/ForgotPasswordPage.jsx'))
const ResetPasswordPage = lazy(() => import('@/pages/public/ResetPasswordPage.jsx'))
const EmailVerificationPage = lazy(() => import('@/pages/public/EmailVerificationPage.jsx'))
const HotelListingPage = lazy(() => import('@/pages/public/HotelListingPage.jsx'))
const HotelDetailPage = lazy(() => import('@/pages/public/HotelDetailPage.jsx'))
const AboutPage = lazy(() => import('@/pages/public/AboutPage.jsx'))
const ContactPage = lazy(() => import('@/pages/public/ContactPage.jsx'))
const GuestDashboard = lazy(() => import('@/pages/guest/GuestDashboard.jsx'))
const StaffDashboard = lazy(() => import('@/pages/staff/StaffDashboard.jsx'))
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard.jsx'))

const withSuspense = (Component) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
)

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: ROUTES.home, element: withSuspense(LandingPage) },
      { path: ROUTES.login, element: withSuspense(LoginPage) },
      { path: ROUTES.register, element: withSuspense(RegisterPage) },
      { path: '/forgot-password', element: withSuspense(ForgotPasswordPage) },
      { path: '/reset-password', element: withSuspense(ResetPasswordPage) },
      { path: '/verify-email', element: withSuspense(EmailVerificationPage) },
      { path: ROUTES.hotels, element: withSuspense(HotelListingPage) },
      { path: '/hotels/:id', element: withSuspense(HotelDetailPage) },
      { path: ROUTES.about, element: withSuspense(AboutPage) },
      { path: ROUTES.contact, element: withSuspense(ContactPage) },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: ROUTES.guest,
    element: <GuestLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: withSuspense(GuestDashboard) },
      { path: 'bookings', element: withSuspense(GuestDashboard) },
      { path: 'wishlist', element: withSuspense(GuestDashboard) },
      { path: 'reviews', element: withSuspense(GuestDashboard) },
      { path: 'profile', element: withSuspense(GuestDashboard) },
      { path: 'settings', element: withSuspense(GuestDashboard) },
    ],
  },
  {
    path: ROUTES.staff,
    element: <StaffLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: withSuspense(StaffDashboard) },
      { path: 'reservations', element: withSuspense(StaffDashboard) },
      { path: 'checkin', element: withSuspense(StaffDashboard) },
      { path: 'rooms', element: withSuspense(StaffDashboard) },
      { path: 'requests', element: withSuspense(StaffDashboard) },
      { path: 'messages', element: withSuspense(StaffDashboard) },
    ],
  },
  {
    path: ROUTES.admin,
    element: <AdminLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: withSuspense(AdminDashboard) },
      { path: 'analytics', element: withSuspense(AdminDashboard) },
      { path: 'bookings', element: withSuspense(AdminDashboard) },
      { path: 'users', element: withSuspense(AdminDashboard) },
      { path: 'hotels', element: withSuspense(AdminDashboard) },
      { path: 'reviews', element: withSuspense(AdminDashboard) },
      { path: 'settings', element: withSuspense(AdminDashboard) },
    ],
  },
])

export default router