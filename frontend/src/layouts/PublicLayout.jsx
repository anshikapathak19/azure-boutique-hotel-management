import { Outlet } from 'react-router-dom'
import Navbar from '@/components/common/Navbar.jsx'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory text-navy font-body">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {/* TODO: <Footer /> */}
    </div>
  )
}