import { Outlet } from 'react-router-dom'
import { LayoutDashboard, Calendar, CheckSquare, Home, Package, MessageSquare } from 'lucide-react'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.jsx'
import { ROUTES } from '@/config/routes.js'

const STAFF_NAV = [
  { label: 'Overview', path: ROUTES.staff, icon: LayoutDashboard },
  { label: 'Reservations', path: `${ROUTES.staff}/reservations`, icon: Calendar },
  { label: 'Check-in Queue', path: `${ROUTES.staff}/checkin`, icon: CheckSquare },
  { label: 'Room Status', path: `${ROUTES.staff}/rooms`, icon: Home },
  { label: 'Guest Requests', path: `${ROUTES.staff}/requests`, icon: Package },
  { label: 'Messages', path: `${ROUTES.staff}/messages`, icon: MessageSquare },
]

export default function StaffLayout() {
  return (
    <div className="min-h-screen bg-ivory text-navy font-body flex">
      <DashboardSidebar navItems={STAFF_NAV} title="Staff Portal" />
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}