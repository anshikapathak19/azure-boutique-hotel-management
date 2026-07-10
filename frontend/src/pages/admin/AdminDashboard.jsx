import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign, Users, Calendar, Star, BarChart2, Hotel, Settings,
  TrendingUp, Eye, Trash2, CheckCircle, XCircle, Shield
} from 'lucide-react'

import StatCard from '@/components/ui/StatCard.jsx'
import DataTable from '@/components/ui/DataTable.jsx'
import Tabs from '@/components/ui/Tabs.jsx'
import Badge from '@/components/ui/Badge.jsx'
import Button from '@/components/ui/Button.jsx'
import Input from '@/components/ui/Input.jsx'
import LoadingSpinner from '@/components/ui/LoadingSpinner.jsx'
import ConfirmationDialog from '@/components/ui/ConfirmationDialog.jsx'

import { AdminService } from '@/services/AdminService.js'
import { BookingService } from '@/services/BookingService.js'
import { ReviewService } from '@/services/ReviewService.js'
import { HotelService } from '@/services/HotelService.js'
import { useAuth } from '@/context/AuthContext.jsx'
import { useToast } from '@/context/ToastContext.jsx'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'users', label: 'Users' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'settings', label: 'Settings' },
]

const BOOKING_STATUS_BADGE = {
  Confirmed: 'success',
  Pending: 'warning',
  'Checked In': 'info',
  'Checked Out': 'default',
  Cancelled: 'danger',
}

const USER_ROLE_BADGE = {
  guest: 'default',
  staff: 'info',
  admin: 'gold',
}

function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-3xl md:text-4xl text-navy font-medium">{title}</h1>
      {subtitle && <p className="font-body text-sm text-navy/55 mt-1">{subtitle}</p>}
    </div>
  )
}

// Simple SVG bar chart — no external dependency
function BarChart({ data = [], color = '#C8A96E', height = 160, label = '' }) {
  const maxVal = Math.max(...data.map(d => d.amount || d.rate || 0), 1)
  const barWidth = 100 / (data.length * 2)

  return (
    <div>
      {label && <p className="font-body text-xs text-navy/50 uppercase tracking-widest mb-3">{label}</p>}
      <svg
        viewBox={`0 0 100 ${height}`}
        className="w-full"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        {data.map((d, i) => {
          const val = d.amount || d.rate || 0
          const barH = (val / maxVal) * (height - 20)
          const x = i * (100 / data.length) + barWidth / 2
          return (
            <g key={i}>
              <rect
                x={`${x}%`}
                y={height - 20 - barH}
                width={`${barWidth}%`}
                height={barH}
                rx="2"
                fill={color}
                fillOpacity={0.85}
                className="transition-all"
              />
              <text
                x={`${x + barWidth / 2}%`}
                y={height - 4}
                textAnchor="middle"
                fontSize="6"
                fill="#1a2b4a"
                fillOpacity={0.5}
                fontFamily="Inter, sans-serif"
              >
                {d.month}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState('overview')
  const [analytics, setAnalytics] = useState(null)
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])
  const [reviews, setReviews] = useState([])
  const [hotels, setHotels] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [deleteReviewDialog, setDeleteReviewDialog] = useState({ open: false, id: null })
  const [deleteReviewLoading, setDeleteReviewLoading] = useState(false)

  useEffect(() => {
    let active = true
    Promise.all([
      AdminService.getAnalytics(),
      BookingService.getAllBookings(),
      AdminService.getUsers(),
      ReviewService.getAllReviews(),
      HotelService.getHotels({}),
      AdminService.getSettings(),
    ]).then(([analytics, bks, usrs, revs, hotelsRes, stgs]) => {
      if (!active) return
      setAnalytics(analytics)
      setBookings(bks)
      setUsers(usrs)
      setReviews(revs)
      setHotels(hotelsRes.data)
      setSettings(stgs)
      setLoading(false)
    }).catch(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [])

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    setSettingsSaving(true)
    try {
      await AdminService.updateSettings(settings)
      addToast('Settings saved successfully.', 'success')
    } catch {
      addToast('Failed to save settings.', 'error')
    } finally {
      setSettingsSaving(false)
    }
  }

  const handleDeleteReview = async () => {
    setDeleteReviewLoading(true)
    try {
      await ReviewService.deleteReview(deleteReviewDialog.id)
      setReviews((prev) => prev.filter((r) => r.id !== deleteReviewDialog.id))
      addToast('Review removed.', 'success')
    } catch {
      addToast('Failed to delete review.', 'error')
    } finally {
      setDeleteReviewLoading(false)
      setDeleteReviewDialog({ open: false, id: null })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner className="w-8 h-8 text-gold" />
      </div>
    )
  }

  const bookingColumns = [
    {
      header: 'Guest',
      key: 'guestName',
      render: (row) => (
        <div>
          <p className="font-semibold text-sm text-navy">{row.guestName}</p>
          <p className="text-xs text-navy/50">{row.guestEmail}</p>
        </div>
      ),
    },
    { header: 'Hotel', key: 'hotelName', render: (row) => <span className="text-sm">{row.hotelName}</span> },
    {
      header: 'Dates',
      key: 'checkIn',
      render: (row) => (
        <div className="text-xs text-navy/70">
          {new Date(row.checkIn).toLocaleDateString('en-GB', { dateStyle: 'medium' })}
          {' – '}
          {new Date(row.checkOut).toLocaleDateString('en-GB', { dateStyle: 'medium' })}
        </div>
      ),
    },
    {
      header: 'Amount',
      key: 'totalPrice',
      render: (row) => <span className="font-semibold text-sm">${row.totalPrice.toLocaleString()}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <Badge variant={BOOKING_STATUS_BADGE[row.status] || 'default'}>{row.status}</Badge>,
    },
  ]

  const userColumns = [
    {
      header: 'User',
      key: 'name',
      render: (row) => (
        <div>
          <p className="font-semibold text-sm text-navy">{row.name}</p>
          <p className="text-xs text-navy/50">{row.email}</p>
        </div>
      ),
    },
    {
      header: 'Role',
      key: 'role',
      render: (row) => <Badge variant={USER_ROLE_BADGE[row.role] || 'default'}>{row.role}</Badge>,
    },
    { header: 'Tier / Dept', key: 'tier', render: (row) => <span className="text-xs text-navy/60">{row.tier || row.department || '—'}</span> },
    {
      header: 'Joined',
      key: 'joined',
      render: (row) => <span className="text-xs text-navy/50">{new Date(row.joined).toLocaleDateString('en-GB', { dateStyle: 'medium' })}</span>,
    },
  ]

  const reviewColumns = [
    {
      header: 'Guest',
      key: 'guestName',
      render: (row) => (
        <div>
          <p className="font-semibold text-sm text-navy">{row.guestName}</p>
          <p className="text-xs text-navy/50">{row.hotelName}</p>
        </div>
      ),
    },
    {
      header: 'Rating',
      key: 'rating',
      render: (row) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < row.rating ? 'fill-gold text-gold' : 'text-navy/15'}`}
            />
          ))}
        </div>
      ),
    },
    {
      header: 'Comment',
      key: 'comment',
      render: (row) => <span className="text-xs text-navy/60 max-w-xs block line-clamp-2">{row.comment}</span>,
    },
    {
      header: 'Date',
      key: 'createdAt',
      render: (row) => <span className="text-xs text-navy/50">{new Date(row.createdAt).toLocaleDateString('en-GB', { dateStyle: 'medium' })}</span>,
    },
    {
      header: '',
      key: 'delete',
      render: (row) => (
        <button
          type="button"
          onClick={() => setDeleteReviewDialog({ open: true, id: row.id })}
          className="p-1.5 text-navy/30 hover:text-rose-500 transition-colors cursor-pointer rounded"
          aria-label="Remove review"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ]

  return (
    <div className="p-6 md:p-8 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <PageHeader
          title="Admin Dashboard"
          subtitle={`Signed in as ${user?.name || 'Administrator'}. Full platform visibility.`}
        />

        <Tabs items={TABS} activeTab={activeTab} onChange={setActiveTab} className="mb-8" />

        {/* ─── OVERVIEW ─────────────────────────────────── */}
        {activeTab === 'overview' && analytics && (
          <div className="space-y-8">
            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard
                title="Total Revenue"
                value={`$${analytics.stats.totalRevenue.toLocaleString()}`}
                change={analytics.stats.revenueChange}
                icon={DollarSign}
              />
              <StatCard
                title="Occupancy Rate"
                value={`${analytics.stats.occupancyRate}%`}
                change={analytics.stats.occupancyChange}
                icon={Hotel}
              />
              <StatCard
                title="Active Bookings"
                value={analytics.stats.activeBookings}
                change={analytics.stats.bookingsChange}
                icon={Calendar}
              />
              <StatCard
                title="Avg Review Score"
                value={analytics.stats.avgReviewScore}
                icon={Star}
              />
            </div>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-navy/5 shadow-sm p-6">
                <h3 className="font-display text-lg text-navy font-semibold mb-1">Revenue Trend</h3>
                <p className="font-body text-xs text-navy/40 mb-4">Monthly revenue performance</p>
                <BarChart data={analytics.revenueChart} color="#C8A96E" label="USD Revenue" />
              </div>

              <div className="bg-white rounded-2xl border border-navy/5 shadow-sm p-6">
                <h3 className="font-display text-lg text-navy font-semibold mb-1">Occupancy Rate</h3>
                <p className="font-body text-xs text-navy/40 mb-4">Monthly occupancy percentage</p>
                <BarChart data={analytics.occupancyChart} color="#1a2b4a" label="% Occupancy" />
              </div>
            </div>

            {/* Summary blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-navy/5 shadow-sm p-6 text-center">
                <p className="font-body text-xs text-navy/50 uppercase tracking-widest mb-2">Total Guests</p>
                <p className="font-display text-3xl text-navy font-semibold">{users.filter(u => u.role === 'guest').length}</p>
              </div>
              <div className="bg-white rounded-2xl border border-navy/5 shadow-sm p-6 text-center">
                <p className="font-body text-xs text-navy/50 uppercase tracking-widest mb-2">Portfolio Hotels</p>
                <p className="font-display text-3xl text-navy font-semibold">{hotels.length}</p>
              </div>
              <div className="bg-white rounded-2xl border border-navy/5 shadow-sm p-6 text-center">
                <p className="font-body text-xs text-navy/50 uppercase tracking-widest mb-2">Total Reviews</p>
                <p className="font-display text-3xl text-navy font-semibold">{reviews.length}</p>
              </div>
            </div>

            {/* Recent bookings preview */}
            <div className="bg-white rounded-2xl border border-navy/5 shadow-sm p-6">
              <h3 className="font-display text-lg text-navy font-semibold mb-4">Recent Bookings</h3>
              <DataTable
                columns={bookingColumns}
                data={bookings.slice(0, 5)}
              />
              <button
                type="button"
                onClick={() => setActiveTab('bookings')}
                className="mt-4 font-body text-xs text-gold hover:underline cursor-pointer"
              >
                View all bookings →
              </button>
            </div>
          </div>
        )}

        {/* ─── BOOKINGS ─────────────────────────────────── */}
        {activeTab === 'bookings' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Confirmed', value: bookings.filter(b => b.status === 'Confirmed').length, variant: 'success' },
                { label: 'Pending', value: bookings.filter(b => b.status === 'Pending').length, variant: 'warning' },
                { label: 'Checked In', value: bookings.filter(b => b.status === 'Checked In').length, variant: 'info' },
                { label: 'Cancelled', value: bookings.filter(b => b.status === 'Cancelled').length, variant: 'danger' },
              ].map(({ label, value, variant }) => (
                <div key={label} className="bg-white rounded-xl border border-navy/5 shadow-sm p-4 text-center">
                  <Badge variant={variant}>{label}</Badge>
                  <p className="font-display text-3xl text-navy font-semibold mt-2">{value}</p>
                </div>
              ))}
            </div>
            <DataTable columns={bookingColumns} data={bookings} emptyMessage="No bookings found." />
          </div>
        )}

        {/* ─── USERS ──────────────────────────────────── */}
        {activeTab === 'users' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Guests', value: users.filter(u => u.role === 'guest').length, icon: Users },
                { label: 'Staff', value: users.filter(u => u.role === 'staff').length, icon: Shield },
                { label: 'Admins', value: users.filter(u => u.role === 'admin').length, icon: Settings },
              ].map(({ label, value, icon: Icon }) => (
                <StatCard key={label} title={label} value={value} icon={Icon} />
              ))}
            </div>
            <DataTable columns={userColumns} data={users} emptyMessage="No users found." />
          </div>
        )}

        {/* ─── REVIEWS ──────────────────────────────────── */}
        {activeTab === 'reviews' && (
          <DataTable columns={reviewColumns} data={reviews} emptyMessage="No reviews found." />
        )}

        {/* ─── SETTINGS ────────────────────────────────── */}
        {activeTab === 'settings' && settings && (
          <div className="max-w-lg">
            <div className="bg-white rounded-2xl border border-navy/5 shadow-sm p-8">
              <h2 className="font-display text-xl text-navy font-semibold mb-6">Platform Settings</h2>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-navy/5">
                    <div>
                      <p className="font-body text-sm font-semibold text-navy">Tax Rate</p>
                      <p className="font-body text-xs text-navy/50">Applied to all reservation totals</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={settings.taxRatePercent}
                        min="0"
                        max="50"
                        onChange={(e) => setSettings(prev => ({ ...prev, taxRatePercent: Number(e.target.value) }))}
                        className="w-16 text-center border border-navy/15 rounded-lg px-2 py-1 font-body text-sm text-navy focus:outline-none focus:border-gold"
                      />
                      <span className="font-body text-sm text-navy/50">%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-navy/5">
                    <div>
                      <p className="font-body text-sm font-semibold text-navy">Global Booking Fee</p>
                      <p className="font-body text-xs text-navy/50">Fixed fee per reservation</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-body text-sm text-navy/50">$</span>
                      <input
                        type="number"
                        value={settings.globalBookingFee}
                        min="0"
                        onChange={(e) => setSettings(prev => ({ ...prev, globalBookingFee: Number(e.target.value) }))}
                        className="w-16 text-center border border-navy/15 rounded-lg px-2 py-1 font-body text-sm text-navy focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  {[
                    { key: 'allowInstantBookings', label: 'Allow Instant Bookings', desc: 'Skip manual approval for new reservations' },
                    { key: 'enableEmailAlerts', label: 'Email Alerts', desc: 'Send confirmation and reminder emails to guests' },
                    { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Disable public booking while under maintenance' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-navy/5 last:border-0">
                      <div>
                        <p className="font-body text-sm font-semibold text-navy">{label}</p>
                        <p className="font-body text-xs text-navy/50">{desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSettings(prev => ({ ...prev, [key]: !prev[key] }))}
                        className={[
                          'w-11 h-6 rounded-full transition-colors duration-200 relative cursor-pointer',
                          settings[key] ? 'bg-gold' : 'bg-navy/15',
                        ].join(' ')}
                        aria-checked={settings[key]}
                        role="switch"
                      >
                        <span
                          className={[
                            'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
                            settings[key] ? 'translate-x-5' : 'translate-x-0.5',
                          ].join(' ')}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <Button type="submit" variant="gold" size="md" disabled={settingsSaving} className="w-full cursor-pointer">
                  {settingsSaving ? 'Saving...' : 'Save Settings'}
                </Button>
              </form>
            </div>
          </div>
        )}
      </motion.div>

      {/* Delete Review Dialog */}
      <ConfirmationDialog
        isOpen={deleteReviewDialog.open}
        onClose={() => setDeleteReviewDialog({ open: false, id: null })}
        onConfirm={handleDeleteReview}
        title="Remove Review"
        message="This review will be permanently deleted from the platform."
        confirmText="Delete Review"
        cancelText="Cancel"
        isDanger
        isLoading={deleteReviewLoading}
      />
    </div>
  )
}