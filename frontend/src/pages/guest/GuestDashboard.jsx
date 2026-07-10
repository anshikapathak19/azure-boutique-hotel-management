import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Calendar, Star, Heart, MapPin, Clock,
  Trash2, Award, User, Phone, Mail, Save, Eye, XCircle
} from 'lucide-react'

import StatCard from '@/components/ui/StatCard.jsx'
import DataTable from '@/components/ui/DataTable.jsx'
import Tabs from '@/components/ui/Tabs.jsx'
import Badge from '@/components/ui/Badge.jsx'
import Avatar from '@/components/ui/Avatar.jsx'
import Button from '@/components/ui/Button.jsx'
import ConfirmationDialog from '@/components/ui/ConfirmationDialog.jsx'
import Input from '@/components/ui/Input.jsx'
import LoadingSpinner from '@/components/ui/LoadingSpinner.jsx'
import RoomCard from '@/components/ui/RoomCard.jsx'

import { BookingService } from '@/services/BookingService.js'
import { ReviewService } from '@/services/ReviewService.js'
import { UserService } from '@/services/UserService.js'
import { HotelService } from '@/services/HotelService.js'
import { useAuth } from '@/context/AuthContext.jsx'
import { useToast } from '@/context/ToastContext.jsx'
import { ROUTES } from '@/config/routes.js'

// ─── Constants ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'overview', label: 'Overview', path: ROUTES.guest },
  { id: 'bookings', label: 'My Bookings', path: `${ROUTES.guest}/bookings` },
  { id: 'wishlist', label: 'Wishlist', path: `${ROUTES.guest}/wishlist` },
  { id: 'reviews', label: 'My Reviews', path: `${ROUTES.guest}/reviews` },
  { id: 'profile', label: 'Profile', path: `${ROUTES.guest}/profile` },
]

const STATUS_BADGE = {
  Confirmed: 'success',
  Pending: 'warning',
  'Checked In': 'info',
  'Checked Out': 'default',
  Cancelled: 'danger',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-3xl md:text-4xl text-navy font-medium">{title}</h1>
      {subtitle && <p className="font-body text-sm text-navy/55 mt-1">{subtitle}</p>}
    </div>
  )
}

/** Derive active tab id from the current URL path segment */
function useActiveTab() {
  const location = useLocation()
  const seg = location.pathname.split('/').filter(Boolean).pop()
  const validIds = TABS.map((t) => t.id)
  // 'guest' itself maps to 'overview'
  return validIds.includes(seg) ? seg : 'overview'
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function GuestDashboard() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const activeTab = useActiveTab()

  const [bookings, setBookings] = useState([])
  const [reviews, setReviews] = useState([])
  const [wishlistIds, setWishlistIds] = useState([])
  const [wishlistHotels, setWishlistHotels] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Modal states
  const [cancelDialog, setCancelDialog] = useState({ open: false, bookingId: null })
  const [cancelLoading, setCancelLoading] = useState(false)
  const [deleteReviewDialog, setDeleteReviewDialog] = useState({ open: false, reviewId: null })
  const [deleteReviewLoading, setDeleteReviewLoading] = useState(false)

  // Profile edit state
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' })
  const [profileSaving, setProfileSaving] = useState(false)

  // ── Data loading ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!user) return
    let active = true

    Promise.all([
      BookingService.getBookingsByGuestId(user.id),
      ReviewService.getReviewsByGuest(user.id),
      UserService.getWishlist(user.id),
      UserService.getProfile(user.id),
    ])
      .then(([bks, revs, wl, prof]) => {
        if (!active) return
        setBookings(bks)
        setReviews(revs)
        setWishlistIds(wl)
        setProfile(prof)
        setProfileForm({ name: prof.name, email: prof.email, phone: prof.phone || '' })
        setLoading(false)

        if (wl.length > 0) {
          HotelService.getHotels({}).then((res) => {
            if (!active) return
            setWishlistHotels(res.data.filter((h) => wl.includes(h.id)))
          })
        }
      })
      .catch(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [user])

  // ── Handlers ──────────────────────────────────────────────────────────────

  /** Navigate to the sub-route that matches the clicked tab */
  const handleTabChange = (tabId) => {
    const tab = TABS.find((t) => t.id === tabId)
    if (tab) navigate(tab.path)
  }

  const handleCancelBooking = async () => {
    setCancelLoading(true)
    try {
      await BookingService.cancelBooking(cancelDialog.bookingId)
      setBookings((prev) =>
        prev.map((b) =>
          b.id === cancelDialog.bookingId ? { ...b, status: 'Cancelled' } : b
        )
      )
      addToast('Booking cancelled successfully.', 'success')
    } catch {
      addToast('Failed to cancel booking.', 'error')
    } finally {
      setCancelLoading(false)
      setCancelDialog({ open: false, bookingId: null })
    }
  }

  const handleDeleteReview = async () => {
    setDeleteReviewLoading(true)
    try {
      await ReviewService.deleteReview(deleteReviewDialog.reviewId)
      setReviews((prev) => prev.filter((r) => r.id !== deleteReviewDialog.reviewId))
      addToast('Review removed.', 'success')
    } catch {
      addToast('Failed to delete review.', 'error')
    } finally {
      setDeleteReviewLoading(false)
      setDeleteReviewDialog({ open: false, reviewId: null })
    }
  }

  const handleRemoveWishlist = async (hotelId) => {
    try {
      const updated = await UserService.toggleWishlist(user.id, hotelId)
      setWishlistIds(updated)
      setWishlistHotels((prev) => prev.filter((h) => h.id !== hotelId))
      addToast('Removed from wishlist.', 'success')
    } catch {
      addToast('Failed to update wishlist.', 'error')
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setProfileSaving(true)
    try {
      const updated = await UserService.updateProfile(user.id, profileForm)
      setProfile(updated)
      addToast('Profile updated successfully!', 'success')
    } catch {
      addToast('Failed to save profile.', 'error')
    } finally {
      setProfileSaving(false)
    }
  }

  // ── Derived data ──────────────────────────────────────────────────────────

  const upcomingBookings = bookings.filter((b) =>
    ['Confirmed', 'Pending', 'Checked In'].includes(b.status)
  )
  const pastBookings = bookings.filter((b) =>
    ['Checked Out', 'Cancelled'].includes(b.status)
  )

  // ── Loading state ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner className="w-8 h-8 text-gold" />
      </div>
    )
  }

  // ── Table column definitions ───────────────────────────────────────────────

  const bookingColumns = [
    {
      header: 'Hotel',
      key: 'hotelName',
      render: (row) => (
        <div>
          <p className="font-semibold text-navy text-sm">{row.hotelName}</p>
          <p className="text-navy/50 text-xs">{row.roomType}</p>
        </div>
      ),
    },
    {
      header: 'Dates',
      key: 'checkIn',
      render: (row) => (
        <div className="text-xs text-navy/70">
          <p>
            {new Date(row.checkIn).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
          <p className="text-navy/40">
            to{' '}
            {new Date(row.checkOut).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
            })}
          </p>
        </div>
      ),
    },
    {
      header: 'Total',
      key: 'totalPrice',
      render: (row) => (
        <span className="font-semibold text-navy">${row.totalPrice.toLocaleString()}</span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <Badge variant={STATUS_BADGE[row.status] || 'default'}>{row.status}</Badge>
      ),
    },
    {
      header: '',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Link
            to={`/hotels/${row.hotelId}`}
            className="text-xs text-navy/60 hover:text-gold transition-colors inline-flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </Link>
          {['Confirmed', 'Pending'].includes(row.status) && (
            <button
              type="button"
              onClick={() => setCancelDialog({ open: true, bookingId: row.id })}
              className="text-xs text-rose-500 hover:text-rose-700 transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              Cancel
            </button>
          )}
        </div>
      ),
    },
  ]

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 md:p-8 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <PageHeader
          title={`Welcome back, ${profile?.name?.split(' ')[0] || 'Guest'}`}
          subtitle="Manage your reservations, wishlist, and preferences."
        />

        {/* Tabs navigate via React Router */}
        <Tabs
          items={TABS}
          activeTab={activeTab}
          onChange={handleTabChange}
          className="mb-8"
        />

        {/* ─── OVERVIEW ─────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard title="Total Bookings" value={bookings.length} icon={Calendar} />
              <StatCard title="Upcoming Stays" value={upcomingBookings.length} icon={Clock} />
              <StatCard title="Reviews Written" value={reviews.length} icon={Star} />
              <StatCard title="Wishlist Hotels" value={wishlistIds.length} icon={Heart} />
            </div>

            {/* Member card */}
            {profile && (
              <div className="bg-white rounded-2xl border border-navy/5 shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <Avatar src={profile.avatar} alt={profile.name} size="lg" />
                  <div>
                    <h2 className="font-display text-xl text-navy font-semibold">
                      {profile.name}
                    </h2>
                    <p className="font-body text-sm text-navy/55">{profile.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Award className="w-4 h-4 text-gold" />
                      <span className="font-body text-xs font-semibold text-gold uppercase tracking-wider">
                        {profile.memberTier || 'Member'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-ivory rounded-xl px-6 py-4 text-center border border-navy/5">
                  <p className="font-body text-xs text-navy/50 uppercase tracking-widest">
                    Points Balance
                  </p>
                  <p className="font-display text-3xl text-navy font-semibold mt-1">
                    {(profile.points || 0).toLocaleString()}
                  </p>
                  <p className="font-body text-[11px] text-gold mt-1">AzureRewards Points</p>
                </div>
              </div>
            )}

            {/* Upcoming bookings preview */}
            {upcomingBookings.length > 0 && (
              <div>
                <h3 className="font-display text-xl text-navy mb-4 font-semibold">
                  Upcoming Stays
                </h3>
                <div className="space-y-3">
                  {upcomingBookings.slice(0, 3).map((bk) => (
                    <div
                      key={bk.id}
                      className="bg-white rounded-xl border border-navy/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-body text-sm font-semibold text-navy">
                            {bk.hotelName}
                          </p>
                          <p className="font-body text-xs text-navy/50">{bk.roomType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 pl-14 sm:pl-0">
                        <div className="text-xs font-body text-navy/60">
                          {new Date(bk.checkIn).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                          })}
                          {' – '}
                          {new Date(bk.checkOut).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                        <Badge variant={STATUS_BADGE[bk.status] || 'default'}>
                          {bk.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('bookings')}
                  className="mt-3 font-body text-xs text-gold hover:underline cursor-pointer"
                >
                  View all bookings →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── BOOKINGS ─────────────────────────────────── */}
        {activeTab === 'bookings' && (
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-xl text-navy mb-4 font-semibold">
                Upcoming Reservations
              </h2>
              <DataTable
                columns={bookingColumns}
                data={upcomingBookings}
                emptyMessage="No upcoming reservations. Explore our hotels to plan your next escape."
              />
            </div>
            <div>
              <h2 className="font-display text-xl text-navy mb-4 font-semibold">Past Stays</h2>
              <DataTable
                columns={bookingColumns}
                data={pastBookings}
                emptyMessage="No past stays found."
              />
            </div>
          </div>
        )}

        {/* ─── WISHLIST ─────────────────────────────────── */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistHotels.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-navy/5">
                <Heart className="w-12 h-12 text-navy/15 mx-auto mb-4" />
                <h3 className="font-display text-xl text-navy mb-2">Your wishlist is empty</h3>
                <p className="font-body text-sm text-navy/55 mb-6">
                  Browse our portfolio and save hotels you love.
                </p>
                <Link to={ROUTES.hotels}>
                  <Button variant="gold" size="sm">
                    Explore Hotels
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {wishlistHotels.map((hotel) => (
                  <div key={hotel.id} className="relative">
                    <RoomCard
                      image={hotel.image}
                      name={hotel.name}
                      location={`${hotel.location}, ${hotel.country}`}
                      price={hotel.startingPrice}
                      rating={hotel.rating}
                      amenities={hotel.amenities}
                      badge={hotel.badge}
                      to={`/hotels/${hotel.id}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveWishlist(hotel.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors shadow cursor-pointer"
                      aria-label="Remove from wishlist"
                    >
                      <Heart className="w-4 h-4 fill-rose-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── REVIEWS ──────────────────────────────────── */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-navy/5">
                <Star className="w-12 h-12 text-navy/15 mx-auto mb-4" />
                <h3 className="font-display text-xl text-navy mb-2">No reviews yet</h3>
                <p className="font-body text-sm text-navy/55">
                  After your stay, share your experience with other travellers.
                </p>
              </div>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl border border-navy/5 p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-body text-sm font-semibold text-navy">
                        {rev.hotelName}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-gold text-gold' : 'text-navy/15'
                            }`}
                          />
                        ))}
                        <span className="font-body text-xs text-navy/50 ml-1">
                          {new Date(rev.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteReviewDialog({ open: true, reviewId: rev.id })
                      }
                      className="p-1.5 text-navy/30 hover:text-rose-500 transition-colors cursor-pointer rounded"
                      aria-label="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="font-body text-sm text-navy/70 mt-3 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* ─── PROFILE ──────────────────────────────────── */}
        {activeTab === 'profile' && profile && (
          <div className="max-w-xl">
            <div className="bg-white rounded-2xl border border-navy/5 shadow-sm p-8">
              <div className="flex items-center gap-4 mb-8">
                <Avatar src={profile.avatar} alt={profile.name} size="lg" />
                <div>
                  <h2 className="font-display text-xl text-navy font-semibold">
                    {profile.name}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Award className="w-3.5 h-3.5 text-gold" />
                    <span className="font-body text-xs text-gold font-semibold">
                      {profile.memberTier || 'Member'}
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <Input
                  label="Full Name"
                  icon={User}
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  icon={Mail}
                  value={profileForm.email}
                  onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  icon={Phone}
                  value={profileForm.phone}
                  placeholder="+1 (555) 000-0000"
                  onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                />

                {profile.preferences && (
                  <div className="border-t border-navy/10 pt-5">
                    <h3 className="font-body text-sm font-semibold text-navy mb-3">
                      Stay Preferences
                    </h3>
                    <div className="grid grid-cols-2 gap-3 font-body text-xs text-navy/60">
                      <div>
                        <span className="text-navy/40 uppercase tracking-wider text-[10px] block">
                          Pillow Type
                        </span>
                        <span>{profile.preferences.pillowType}</span>
                      </div>
                      <div>
                        <span className="text-navy/40 uppercase tracking-wider text-[10px] block">
                          Room Location
                        </span>
                        <span>{profile.preferences.roomLocation}</span>
                      </div>
                      <div>
                        <span className="text-navy/40 uppercase tracking-wider text-[10px] block">
                          Dietary
                        </span>
                        <span>{profile.preferences.dietary}</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  disabled={profileSaving}
                  className="w-full cursor-pointer"
                >
                  {profileSaving ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Dialogs ─────────────────────────────────────── */}
      <ConfirmationDialog
        isOpen={cancelDialog.open}
        onClose={() => setCancelDialog({ open: false, bookingId: null })}
        onConfirm={handleCancelBooking}
        title="Cancel Reservation"
        message="Are you certain you want to cancel this reservation? Our standard cancellation policy will apply."
        confirmText="Cancel Reservation"
        cancelText="Keep Booking"
        isDanger
        isLoading={cancelLoading}
      />

      <ConfirmationDialog
        isOpen={deleteReviewDialog.open}
        onClose={() => setDeleteReviewDialog({ open: false, reviewId: null })}
        onConfirm={handleDeleteReview}
        title="Delete Review"
        message="This review will be permanently removed. This action cannot be undone."
        confirmText="Delete Review"
        cancelText="Keep Review"
        isDanger
        isLoading={deleteReviewLoading}
      />
    </div>
  )
}