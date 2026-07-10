import { Outlet } from 'react-router-dom'
import { LayoutDashboard, Calendar, Heart, Star, Settings, User } from 'lucide-react'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.jsx'
import { ROUTES } from '@/config/routes.js'

const GUEST_NAV = [
  { label: 'Overview', path: ROUTES.guest, icon: LayoutDashboard },
  { label: 'My Bookings', path: `${ROUTES.guest}/bookings`, icon: Calendar },
  { label: 'Wishlist', path: `${ROUTES.guest}/wishlist`, icon: Heart },
  { label: 'My Reviews', path: `${ROUTES.guest}/reviews`, icon: Star },
  { label: 'Profile', path: `${ROUTES.guest}/profile`, icon: User },
  { label: 'Settings', path: `${ROUTES.guest}/settings`, icon: Settings },
]

export default function GuestLayout() {
  return (
    <div className="min-h-screen bg-ivory text-navy font-body flex">
      <DashboardSidebar navItems={GUEST_NAV} title="Guest Portal" />
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}