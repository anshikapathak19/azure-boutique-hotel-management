import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Gem, LogOut, Menu, X } from 'lucide-react'

import Avatar from '@/components/ui/Avatar.jsx'
import { useAuth } from '@/context/AuthContext.jsx'
import { useToast } from '@/context/ToastContext.jsx'
import { ROUTES } from '@/config/routes.js'

// ─── Sub-components extracted outside to prevent remount on every render ──────

function SidebarNav({ navItems, location, onLinkClick }) {
  return (
    <nav
      className="flex-1 px-3 py-4 space-y-1 overflow-y-auto"
      aria-label="Dashboard navigation"
    >
      {navItems.map((item) => {
        const isActive =
          location.pathname === item.path ||
          (item.path !== ROUTES.guest &&
            item.path !== ROUTES.staff &&
            item.path !== ROUTES.admin &&
            location.pathname.startsWith(item.path))
        const Icon = item.icon
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onLinkClick}
            className={[
              'flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm transition-all duration-200',
              isActive
                ? 'bg-gold/10 text-gold font-semibold'
                : 'text-navy/70 hover:bg-navy/5 hover:text-navy',
            ].join(' ')}
          >
            {Icon && <Icon className="w-4 h-4 shrink-0" />}
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function UserCard({ user }) {
  if (!user) return null
  return (
    <div className="px-6 py-5 border-b border-navy/10">
      <div className="flex items-center gap-3">
        <Avatar src={user.avatar} alt={user.name} size="md" />
        <div className="min-w-0">
          <p className="font-body text-sm font-semibold text-navy truncate">{user.name}</p>
          <p className="font-body text-xs text-navy/50 truncate">{user.email}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Main Sidebar component ────────────────────────────────────────────────────

export default function DashboardSidebar({ navItems = [], title = 'Dashboard' }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { addToast } = useToast()

  const handleLogout = async () => {
    setMobileOpen(false)
    await logout()
    addToast('Signed out successfully.', 'success')
    navigate(ROUTES.home)
  }

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-navy/10 min-h-screen fixed top-0 left-0 z-40">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-6 border-b border-navy/10">
            <Link
              to={ROUTES.home}
              className="flex items-center gap-2.5 font-display text-xl text-navy font-medium"
            >
              <Gem className="w-4 h-4 text-gold" />
              AzureStay
            </Link>
            <p className="font-body text-[11px] text-navy/40 uppercase tracking-widest mt-1">
              {title}
            </p>
          </div>

          <UserCard user={user} />

          <SidebarNav
            navItems={navItems}
            location={location}
            onLinkClick={undefined}
          />

          {/* Logout */}
          <div className="px-3 pb-6 border-t border-navy/10 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl font-body text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 bg-white border-b border-navy/10 h-16 flex items-center justify-between px-4">
        <Link
          to={ROUTES.home}
          className="flex items-center gap-2 font-display text-lg text-navy font-medium"
        >
          <Gem className="w-4 h-4 text-gold" />
          AzureStay
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="p-2 text-navy hover:text-gold transition-colors"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobile}
              className="lg:hidden fixed inset-0 bg-navy/40 z-40"
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.26, ease: 'easeOut' }}
              className="lg:hidden fixed top-0 left-0 h-full w-72 bg-white z-50 border-r border-navy/10 flex flex-col"
            >
              {/* Logo */}
              <div className="px-6 py-6 border-b border-navy/10">
                <Link
                  to={ROUTES.home}
                  onClick={closeMobile}
                  className="flex items-center gap-2.5 font-display text-xl text-navy font-medium"
                >
                  <Gem className="w-4 h-4 text-gold" />
                  AzureStay
                </Link>
                <p className="font-body text-[11px] text-navy/40 uppercase tracking-widest mt-1">
                  {title}
                </p>
              </div>

              <UserCard user={user} />

              <SidebarNav
                navItems={navItems}
                location={location}
                onLinkClick={closeMobile}
              />

              {/* Logout */}
              <div className="px-3 pb-6 border-t border-navy/10 pt-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl font-body text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
