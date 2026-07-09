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
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: ROUTES.guest,
    element: <GuestLayout />,
    errorElement: <NotFoundPage />,
    children: [{ index: true, element: withSuspense(GuestDashboard) }],
  },
  {
    path: ROUTES.staff,
    element: <StaffLayout />,
    errorElement: <NotFoundPage />,
    children: [{ index: true, element: withSuspense(StaffDashboard) }],
  },
  {
    path: ROUTES.admin,
    element: <AdminLayout />,
    errorElement: <NotFoundPage />,
    children: [{ index: true, element: withSuspense(AdminDashboard) }],
  },
])

export default router