import { Outlet } from 'react-router-dom'
import { LayoutDashboard, Users, Hotel, Calendar, Star, Settings, BarChart2 } from 'lucide-react'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.jsx'
import { ROUTES } from '@/config/routes.js'

const ADMIN_NAV = [
  { label: 'Overview', path: ROUTES.admin, icon: LayoutDashboard },
  { label: 'Analytics', path: `${ROUTES.admin}/analytics`, icon: BarChart2 },
  { label: 'Bookings', path: `${ROUTES.admin}/bookings`, icon: Calendar },
  { label: 'Users', path: `${ROUTES.admin}/users`, icon: Users },
  { label: 'Hotels', path: `${ROUTES.admin}/hotels`, icon: Hotel },
  { label: 'Reviews', path: `${ROUTES.admin}/reviews`, icon: Star },
  { label: 'Settings', path: `${ROUTES.admin}/settings`, icon: Settings },
]

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-ivory text-navy font-body flex">
      <DashboardSidebar navItems={ADMIN_NAV} title="Admin Panel" />
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}