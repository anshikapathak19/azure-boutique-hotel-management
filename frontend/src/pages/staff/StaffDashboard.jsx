import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Calendar, CheckSquare, Home, Package, Users, Clock, CheckCircle,
  AlertTriangle
} from 'lucide-react'

import StatCard from '@/components/ui/StatCard.jsx'
import DataTable from '@/components/ui/DataTable.jsx'
import Tabs from '@/components/ui/Tabs.jsx'
import Badge from '@/components/ui/Badge.jsx'
import LoadingSpinner from '@/components/ui/LoadingSpinner.jsx'

import { BookingService } from '@/services/BookingService.js'
import { useAuth } from '@/context/AuthContext.jsx'
import { useToast } from '@/context/ToastContext.jsx'
import { ROUTES } from '@/config/routes.js'

const TABS = [
  { id: 'overview', label: 'Overview', path: ROUTES.staff },
  { id: 'reservations', label: 'Reservations', path: `${ROUTES.staff}/reservations` },
  { id: 'checkin', label: 'Check-in Queue', path: `${ROUTES.staff}/checkin` },
  { id: 'rooms', label: 'Room Status', path: `${ROUTES.staff}/rooms` },
  { id: 'requests', label: 'Guest Requests', path: `${ROUTES.staff}/requests` },
]

function useActiveTab() {
  const location = useLocation()
  const seg = location.pathname.split('/').filter(Boolean).pop()
  const validIds = TABS.map((t) => t.id)
  return validIds.includes(seg) ? seg : 'overview'
}

const STATUS_BADGE = {
  Confirmed: 'success',
  Pending: 'warning',
  'Checked In': 'info',
  'Checked Out': 'default',
  Cancelled: 'danger',
}

// Mock room statuses for the housekeeping board
const MOCK_ROOMS = [
  { room: '101', type: 'Deluxe Suite', floor: '1', status: 'Occupied', guest: 'Eleanor Whitfield', checkout: '2026-07-15' },
  { room: '102', type: 'Standard Room', floor: '1', status: 'Vacant – Clean', guest: null, checkout: null },
  { room: '201', type: 'Signature Suite', floor: '2', status: 'Checkout Today', guest: 'Haruto Sato', checkout: '2026-07-10' },
  { room: '202', type: 'Standard Room', floor: '2', status: 'Vacant – Dirty', guest: null, checkout: null },
  { room: '301', type: 'Presidential Penthouse', floor: '3', status: 'Occupied', guest: 'Sofia Marchetti', checkout: '2026-07-16' },
  { room: '302', type: 'Deluxe Suite', floor: '3', status: 'Maintenance', guest: null, checkout: null },
  { room: '401', type: 'Standard Room', floor: '4', status: 'Check-in Today', guest: 'Daniel Okafor', checkout: '2026-07-13' },
  { room: '402', type: 'Signature Suite', floor: '4', status: 'Vacant – Clean', guest: null, checkout: null },
]

// Mock guest requests
const MOCK_REQUESTS = [
  { id: 'req-01', guestName: 'Eleanor Whitfield', room: '101', type: 'Housekeeping', description: 'Please provide extra pillows and blankets.', priority: 'Normal', status: 'Pending', time: '9:15 AM' },
  { id: 'req-02', guestName: 'Haruto Sato', room: '201', type: 'Room Service', description: 'Breakfast for 2 delivered to room at 8:00 AM.', priority: 'High', status: 'In Progress', time: '8:02 AM' },
  { id: 'req-03', guestName: 'Sofia Marchetti', room: '301', type: 'Maintenance', description: 'Air conditioning making unusual noise.', priority: 'Urgent', status: 'Assigned', time: '10:30 AM' },
  { id: 'req-04', guestName: 'Daniel Okafor', room: '401', type: 'Concierge', description: 'Request for restaurant reservation at La Maison for 7 PM.', priority: 'Normal', status: 'Completed', time: 'Yesterday' },
]

const ROOM_STATUS_BADGE = {
  'Occupied': 'info',
  'Vacant – Clean': 'success',
  'Vacant – Dirty': 'warning',
  'Checkout Today': 'danger',
  'Check-in Today': 'gold',
  'Maintenance': 'default',
}

const REQUEST_PRIORITY_BADGE = {
  'Normal': 'default',
  'High': 'warning',
  'Urgent': 'danger',
}

const REQUEST_STATUS_BADGE = {
  'Pending': 'warning',
  'In Progress': 'info',
  'Assigned': 'default',
  'Completed': 'success',
}

function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-3xl md:text-4xl text-navy font-medium">{title}</h1>
      {subtitle && <p className="font-body text-sm text-navy/55 mt-1">{subtitle}</p>}
    </div>
  )
}

export default function StaffDashboard() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const activeTab = useActiveTab()
  const [allBookings, setAllBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [requestStatuses, setRequestStatuses] = useState({})

  const handleTabChange = (tabId) => {
    const tab = TABS.find((t) => t.id === tabId)
    if (tab) navigate(tab.path)
  }

  useEffect(() => {
    BookingService.getAllBookings().then((bks) => {
      setAllBookings(bks)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const todayCheckins = allBookings.filter((b) => b.status === 'Confirmed' || b.status === 'Pending')
  const todayCheckouts = allBookings.filter((b) => b.status === 'Checked In')
  const pendingReservations = allBookings.filter((b) => b.status === 'Pending')

  const handleCheckIn = (bookingId) => {
    BookingService.updateBookingStatus(bookingId, 'Checked In').then(() => {
      setAllBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: 'Checked In' } : b))
      addToast('Guest checked in successfully.', 'success')
    }).catch(() => addToast('Failed to update status.', 'error'))
  }

  const handleCheckOut = (bookingId) => {
    BookingService.updateBookingStatus(bookingId, 'Checked Out').then(() => {
      setAllBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: 'Checked Out' } : b))
      addToast('Guest checked out successfully.', 'success')
    }).catch(() => addToast('Failed to update status.', 'error'))
  }

  const handleRequestStatus = (reqId, newStatus) => {
    setRequestStatuses((prev) => ({ ...prev, [reqId]: newStatus }))
    addToast(`Request marked as ${newStatus}.`, 'success')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner className="w-8 h-8 text-gold" />
      </div>
    )
  }

  const reservationColumns = [
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
          <p>{new Date(row.checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
          <p className="text-navy/40">– {new Date(row.checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
        </div>
      ),
    },
    {
      header: 'Total',
      key: 'totalPrice',
      render: (row) => <span className="font-semibold text-sm">${row.totalPrice.toLocaleString()}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <Badge variant={STATUS_BADGE[row.status] || 'default'}>{row.status}</Badge>,
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'Confirmed' && (
            <button
              type="button"
              onClick={() => handleCheckIn(row.id)}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer hover:underline"
            >
              Check In
            </button>
          )}
          {row.status === 'Checked In' && (
            <button
              type="button"
              onClick={() => handleCheckOut(row.id)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer hover:underline"
            >
              Check Out
            </button>
          )}
        </div>
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
          title={`Staff Dashboard`}
          subtitle={`Welcome, ${user?.name || 'Staff Member'}. Today's operations at a glance.`}
        />

        <Tabs items={TABS} activeTab={activeTab} onChange={handleTabChange} className="mb-8" />

        {/* ─── OVERVIEW ────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard title="Today's Arrivals" value={todayCheckins.length} icon={CheckSquare} />
              <StatCard title="Departures" value={todayCheckouts.length} icon={Users} />
              <StatCard title="Pending Requests" value={MOCK_REQUESTS.filter(r => r.status !== 'Completed').length} icon={Package} />
              <StatCard title="Total Bookings" value={allBookings.length} icon={Calendar} />
            </div>

            {/* Quick access panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Arrivals today */}
              <div className="bg-white rounded-2xl border border-navy/5 shadow-sm p-6">
                <h3 className="font-display text-lg text-navy font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Today's Check-ins
                </h3>
                {todayCheckins.length === 0 ? (
                  <p className="text-sm text-navy/50 font-body">No arrivals scheduled today.</p>
                ) : (
                  <div className="space-y-3">
                    {todayCheckins.slice(0, 4).map((bk) => (
                      <div key={bk.id} className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-body text-sm font-semibold text-navy">{bk.guestName}</p>
                          <p className="font-body text-xs text-navy/50">{bk.hotelName}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCheckIn(bk.id)}
                          className="font-body text-xs font-semibold text-emerald-600 border border-emerald-200 rounded-full px-3 py-1 hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                          Check In
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Departures */}
              <div className="bg-white rounded-2xl border border-navy/5 shadow-sm p-6">
                <h3 className="font-display text-lg text-navy font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  Today's Checkouts
                </h3>
                {todayCheckouts.length === 0 ? (
                  <p className="text-sm text-navy/50 font-body">No departures scheduled today.</p>
                ) : (
                  <div className="space-y-3">
                    {todayCheckouts.slice(0, 4).map((bk) => (
                      <div key={bk.id} className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-body text-sm font-semibold text-navy">{bk.guestName}</p>
                          <p className="font-body text-xs text-navy/50">{bk.hotelName}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCheckOut(bk.id)}
                          className="font-body text-xs font-semibold text-blue-600 border border-blue-200 rounded-full px-3 py-1 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          Check Out
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Urgent requests */}
            <div className="bg-white rounded-2xl border border-navy/5 shadow-sm p-6">
              <h3 className="font-display text-lg text-navy font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Open Guest Requests
              </h3>
              <div className="divide-y divide-navy/5">
                {MOCK_REQUESTS.filter(r => r.status !== 'Completed').map((req) => (
                  <div key={req.id} className="flex items-center justify-between gap-4 py-3 first:pt-0">
                    <div>
                      <p className="font-body text-sm font-semibold text-navy">{req.guestName} — Room {req.room}</p>
                      <p className="font-body text-xs text-navy/60 mt-0.5">{req.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={REQUEST_PRIORITY_BADGE[req.priority]}>{req.priority}</Badge>
                      <Badge variant={REQUEST_STATUS_BADGE[req.status]}>{req.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── RESERVATIONS ──────────────────────────── */}
        {activeTab === 'reservations' && (
          <DataTable
            columns={reservationColumns}
            data={allBookings}
            emptyMessage="No reservations found."
          />
        )}

        {/* ─── CHECK-IN QUEUE ─────────────────────────── */}
        {activeTab === 'checkin' && (
          <div className="space-y-4">
            <p className="font-body text-sm text-navy/60">Process arrivals and departures in real time.</p>
            <DataTable
              columns={[
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
                { header: 'Room', key: 'roomType', render: (row) => <span className="text-sm text-navy/70">{row.roomType}</span> },
                {
                  header: 'Check-in Date',
                  key: 'checkIn',
                  render: (row) => <span className="text-xs text-navy/70">{new Date(row.checkIn).toLocaleDateString('en-GB', { dateStyle: 'medium' })}</span>,
                },
                {
                  header: 'Status',
                  key: 'status',
                  render: (row) => <Badge variant={STATUS_BADGE[row.status] || 'default'}>{row.status}</Badge>,
                },
                {
                  header: 'Action',
                  key: 'action',
                  render: (row) => (
                    <div className="flex gap-2">
                      {row.status === 'Confirmed' && (
                        <button
                          type="button"
                          onClick={() => handleCheckIn(row.id)}
                          className="text-xs font-semibold text-emerald-600 border border-emerald-200 rounded-full px-3 py-1 hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                          Check In
                        </button>
                      )}
                      {row.status === 'Checked In' && (
                        <button
                          type="button"
                          onClick={() => handleCheckOut(row.id)}
                          className="text-xs font-semibold text-blue-600 border border-blue-200 rounded-full px-3 py-1 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          Check Out
                        </button>
                      )}
                    </div>
                  ),
                },
              ]}
              data={allBookings.filter(b => ['Confirmed', 'Pending', 'Checked In'].includes(b.status))}
              emptyMessage="No active arrivals or departures."
            />
          </div>
        )}

        {/* ─── ROOM STATUS ─────────────────────────────── */}
        {activeTab === 'rooms' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Occupied', count: MOCK_ROOMS.filter(r => r.status === 'Occupied').length, color: 'bg-blue-50 border-blue-100 text-blue-800' },
                { label: 'Vacant – Clean', count: MOCK_ROOMS.filter(r => r.status === 'Vacant – Clean').length, color: 'bg-emerald-50 border-emerald-100 text-emerald-800' },
                { label: 'Needs Cleaning', count: MOCK_ROOMS.filter(r => r.status === 'Vacant – Dirty').length, color: 'bg-amber-50 border-amber-100 text-amber-800' },
                { label: 'Maintenance', count: MOCK_ROOMS.filter(r => r.status === 'Maintenance').length, color: 'bg-rose-50 border-rose-100 text-rose-800' },
              ].map(({ label, count, color }) => (
                <div key={label} className={`rounded-xl border p-4 ${color}`}>
                  <p className="text-[11px] font-body font-semibold uppercase tracking-wider opacity-70">{label}</p>
                  <p className="font-display text-3xl font-semibold mt-1">{count}</p>
                </div>
              ))}
            </div>

            <DataTable
              columns={[
                { header: 'Room', key: 'room', render: (row) => <span className="font-semibold text-navy text-sm">#{row.room}</span> },
                { header: 'Type', key: 'type', render: (row) => <span className="text-sm text-navy/70">{row.type}</span> },
                { header: 'Floor', key: 'floor', render: (row) => <span className="text-sm text-navy/60">{row.floor}F</span> },
                {
                  header: 'Status',
                  key: 'status',
                  render: (row) => <Badge variant={ROOM_STATUS_BADGE[row.status] || 'default'}>{row.status}</Badge>,
                },
                { header: 'Current Guest', key: 'guest', render: (row) => <span className="text-sm text-navy/70">{row.guest || '—'}</span> },
                { header: 'Checkout', key: 'checkout', render: (row) => <span className="text-xs text-navy/50">{row.checkout || '—'}</span> },
              ]}
              data={MOCK_ROOMS}
            />
          </div>
        )}

        {/* ─── GUEST REQUESTS ──────────────────────────── */}
        {activeTab === 'requests' && (
          <DataTable
            columns={[
              {
                header: 'Guest',
                key: 'guestName',
                render: (row) => (
                  <div>
                    <p className="font-semibold text-sm text-navy">{row.guestName}</p>
                    <p className="text-xs text-navy/50">Room {row.room}</p>
                  </div>
                ),
              },
              { header: 'Type', key: 'type', render: (row) => <span className="text-sm text-navy/70">{row.type}</span> },
              { header: 'Description', key: 'description', render: (row) => <span className="text-xs text-navy/60 max-w-xs block">{row.description}</span> },
              { header: 'Time', key: 'time', render: (row) => <span className="text-xs text-navy/50">{row.time}</span> },
              { header: 'Priority', key: 'priority', render: (row) => <Badge variant={REQUEST_PRIORITY_BADGE[row.priority]}>{row.priority}</Badge> },
              {
                header: 'Status',
                key: 'status',
                render: (row) => {
                  const currentStatus = requestStatuses[row.id] || row.status
                  return <Badge variant={REQUEST_STATUS_BADGE[currentStatus]}>{currentStatus}</Badge>
                },
              },
              {
                header: 'Action',
                key: 'action',
                render: (row) => {
                  const currentStatus = requestStatuses[row.id] || row.status
                  if (currentStatus === 'Completed') return <span className="text-xs text-navy/40">Done</span>
                  return (
                    <button
                      type="button"
                      onClick={() => handleRequestStatus(row.id, 'Completed')}
                      className="text-xs font-semibold text-emerald-600 border border-emerald-200 rounded-full px-3 py-1 hover:bg-emerald-50 transition-colors cursor-pointer"
                    >
                      Mark Done
                    </button>
                  )
                },
              },
            ]}
            data={MOCK_REQUESTS}
          />
        )}
      </motion.div>
    </div>
  )
}