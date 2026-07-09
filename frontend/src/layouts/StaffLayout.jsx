import { Outlet } from 'react-router-dom'

export default function StaffLayout() {
  return (
    <div className="min-h-screen bg-ivory text-navy font-body">
      <Outlet />
    </div>
  )
}