import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Star, MapPin, CalendarDays, Users, Shield, Coffee, Wifi, Waves, Wind, ChevronLeft, ChevronRight, Award, Key } from 'lucide-react'

import Container from '@/components/ui/Container.jsx'
import Button from '@/components/ui/Button.jsx'
import Breadcrumbs from '@/components/ui/Breadcrumbs.jsx'
import DatePicker from '@/components/ui/DatePicker.jsx'
import Select from '@/components/ui/Select.jsx'
import Textarea from '@/components/ui/Textarea.jsx'
import Avatar from '@/components/ui/Avatar.jsx'
import RoomCard from '@/components/ui/RoomCard.jsx'
import Badge from '@/components/ui/Badge.jsx'
import Modal from '@/components/ui/Modal.jsx'
import LoadingSpinner from '@/components/ui/LoadingSpinner.jsx'

import { HotelService } from '@/services/HotelService.js'
import { ReviewService } from '@/services/ReviewService.js'
import { BookingService } from '@/services/BookingService.js'
import { useAuth } from '@/context/AuthContext.jsx'
import { useToast } from '@/context/ToastContext.jsx'
import { ROUTES } from '@/config/routes.js'

const AMENITY_ICONS = {
  'Infinity Pool': Waves,
  'Private Pool': Waves,
  'Spa': Shield,
  'Fine Dining': Coffee,
  'Free WiFi': Wifi,
  'Butler Service': Award,
  'Traditional Onsen': Waves,
  'Tea Ceremony': Award,
  'Garden Courtyard': Wind,
  'Rooftop Terrace': Wind,
  'Mountain View': Wind,
  'Ski-in/Ski-out': Key,
  'Snorkeling': Waves,
  'Vineyard Tours': Award,
  'City View': Wind,
  'Courtyard Pool': Waves,
  'Beachfront': Waves,
  'Bonfire Deck': Wind,
  'Houseboat Access': Waves,
  'Ayurvedic Spa': Shield,
}

export default function HotelDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { addToast } = useToast()
  const shouldReduceMotion = useReducedMotion()

  const [hotel, setHotel] = useState(null)
  const [reviews, setReviews] = useState([])
  const [recommended, setRecommended] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Visual carousel state
  const [activeImgIdx, setActiveImgIdx] = useState(0)

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2',
    selectedRoomId: '',
  })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)

  // Review Form State
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  })
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewError, setReviewError] = useState('')

  // Fetch hotel details, reviews, and recommendations
  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    setActiveImgIdx(0)

    Promise.all([
      HotelService.getHotelById(id),
      ReviewService.getReviewsByHotel(id),
      HotelService.getFeaturedHotels(3),
    ])
      .then(([hotelData, reviewsData, recData]) => {
        if (active) {
          setHotel(hotelData)
          setReviews(reviewsData)
          setRecommended(recData.filter((h) => h.id !== id))
          setBookingForm((prev) => ({
            ...prev,
            selectedRoomId: hotelData.rooms?.[0]?.id || '',
          }))
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error('Failed to load detail page:', err)
        if (active) {
          setError(err.message || 'Hotel details could not be retrieved.')
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <LoadingSpinner className="w-10 h-10 text-gold" />
      </div>
    )
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-ivory">
        <h1 className="font-display text-4xl text-navy mb-4">Error</h1>
        <p className="font-body text-navy/70 mb-8 max-w-md">
          {error || 'The requested boutique hotel was not found.'}
        </p>
        <Link
          to={ROUTES.hotels}
          className="font-body px-6 py-3 bg-navy text-ivory rounded-full hover:bg-navy/90 transition-colors"
        >
          Back to Discovery
        </Link>
      </div>
    )
  }

  // Multi-image collection for gallery
  const galleryImages = [
    hotel.image,
    '/src/assets/images/gallery/gallery-01.jpg',
    '/src/assets/images/gallery/gallery-02.jpg',
    '/src/assets/images/gallery/gallery-03.jpg',
  ]

  const selectedRoom = hotel.rooms?.find((r) => r.id === bookingForm.selectedRoomId)

  // Booking pricing math
  const calculateNights = () => {
    if (!bookingForm.checkIn || !bookingForm.checkOut) return 0
    const start = new Date(bookingForm.checkIn)
    const end = new Date(bookingForm.checkOut)
    const diff = end.getTime() - start.getTime()
    if (diff <= 0) return 0
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const nights = calculateNights()
  const pricePerNight = selectedRoom ? selectedRoom.price : hotel.startingPrice
  const basePrice = pricePerNight * (nights || 1)
  const tax = Math.round(basePrice * 0.12)
  const serviceFee = nights ? 25 : 0
  const totalPrice = basePrice + tax + serviceFee

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    if (!bookingForm.checkIn || !bookingForm.checkOut) {
      setBookingError('Please specify check-in and check-out dates.')
      return
    }
    if (nights <= 0) {
      setBookingError('Check-out must be after check-in.')
      return
    }
    if (!selectedRoom) {
      setBookingError('Please select a room category.')
      return
    }

    if (!isAuthenticated) {
      addToast('Please login to request a booking.', 'info')
      navigate(ROUTES.login, { state: { from: `/hotels/${id}` } })
      return
    }

    setBookingLoading(true)
    setBookingError('')

    try {
      await BookingService.createBooking({
        hotelId: hotel.id,
        hotelName: hotel.name,
        guestId: user.id,
        guestName: user.name,
        guestEmail: user.email,
        roomType: selectedRoom.name,
        checkIn: bookingForm.checkIn,
        checkOut: bookingForm.checkOut,
        guestsCount: Number(bookingForm.guests),
        totalPrice,
      })
      setBookingSuccess(true)
      addToast('Your reservation request has been sent!', 'success')
    } catch (err) {
      setBookingError(err.message || 'Failed to complete booking request.')
    } finally {
      setBookingLoading(false)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!reviewForm.comment.trim()) {
      setReviewError('Review content cannot be empty.')
      return
    }

    if (!isAuthenticated) {
      addToast('Please login to submit a review.', 'info')
      navigate(ROUTES.login)
      return
    }

    setReviewLoading(true)
    setReviewError('')

    try {
      const reviewData = {
        hotelId: hotel.id,
        hotelName: hotel.name,
        guestId: user.id,
        guestName: user.name,
        avatar: user.avatar,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      }
      const newReview = await ReviewService.createReview(reviewData)
      setReviews((prev) => [newReview, ...prev])
      setReviewForm({ rating: 5, comment: '' })
      addToast('Review submitted successfully!', 'success')
    } catch (err) {
      setReviewError(err.message || 'Failed to post review.')
    } finally {
      setReviewLoading(false)
    }
  }

  return (
    <div className="pt-28 pb-24 md:pb-32 bg-ivory">
      <Container>
        {/* Navigation Breadcrumb */}
        <Breadcrumbs
          items={[
            { label: 'Home', path: ROUTES.home },
            { label: 'Discovery', path: ROUTES.hotels },
            { label: hotel.name, path: `/hotels/${id}` },
          ]}
          className="mb-8"
        />

        {/* Title area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-4xl md:text-5xl text-navy font-medium">
                {hotel.name}
              </h1>
              {hotel.badge && <Badge variant="gold">{hotel.badge}</Badge>}
            </div>
            <p className="mt-2 flex items-center gap-1.5 font-body text-sm text-navy/60">
              <MapPin className="w-4 h-4 text-gold shrink-0" />
              {hotel.location}, {hotel.country}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white border border-navy/5 rounded-full px-4 py-2 self-start md:self-auto shadow-sm">
            <Star className="w-4 h-4 fill-gold text-gold" />
            <span className="font-body text-sm font-semibold text-navy">
              {hotel.rating.toFixed(1)}
            </span>
            <span className="font-body text-xs text-navy/40">
              ({reviews.length} reviews)
            </span>
          </div>
        </div>

        {/* Gallery Carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-16">
          <div className="lg:col-span-3 relative aspect-[16/9] bg-navy/5 rounded-2xl overflow-hidden shadow-sm">
            <img
              src={galleryImages[activeImgIdx]}
              alt={`${hotel.name} gallery image ${activeImgIdx + 1}`}
              className="w-full h-full object-cover transition-all duration-500"
            />
            {/* Carousel navigation overlay */}
            <div className="absolute inset-x-4 bottom-4 flex justify-between items-center pointer-events-none">
              <button
                type="button"
                onClick={() => setActiveImgIdx((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
                className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-navy flex items-center justify-center shadow pointer-events-auto transition-colors cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="bg-navy/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                {activeImgIdx + 1} / {galleryImages.length}
              </div>
              <button
                type="button"
                onClick={() => setActiveImgIdx((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
                className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-navy flex items-center justify-center shadow pointer-events-auto transition-colors cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* Vertical thumbnails */}
          <div className="grid grid-cols-4 lg:grid-cols-1 gap-3">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImgIdx(idx)}
                className={[
                  'rounded-xl overflow-hidden aspect-[4/3] lg:aspect-[16/9] border-2 transition-all cursor-pointer relative',
                  activeImgIdx === idx ? 'border-gold' : 'border-transparent opacity-75 hover:opacity-100',
                ].join(' ')}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Content Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Main info (Left) */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div className="bg-white rounded-2xl p-8 border border-navy/5 shadow-sm">
              <h2 className="font-display text-2xl text-navy mb-4 font-semibold">Overview</h2>
              <p className="font-body text-navy/70 leading-relaxed">
                {hotel.description} Discover a serene refuge blending contextual architecture with quiet, meticulous hospitality. Every detail is balanced to capture the history and beauty of its surrounding landscape.
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-8 border border-navy/5 shadow-sm">
              <h2 className="font-display text-2xl text-navy mb-6 font-semibold">Luxury Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {hotel.amenities.map((amenity) => {
                  const Icon = AMENITY_ICONS[amenity] || Shield
                  return (
                    <div key={amenity} className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="font-body text-sm text-navy/80">{amenity}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Room Categories */}
            <div>
              <h2 className="font-display text-2xl text-navy mb-6 font-semibold">Suites & Villas</h2>
              <div className="space-y-6">
                {hotel.rooms?.map((room) => {
                  const isSelected = bookingForm.selectedRoomId === room.id
                  return (
                    <div
                      key={room.id}
                      className={[
                        'bg-white rounded-2xl border transition-all overflow-hidden flex flex-col md:flex-row shadow-sm',
                        isSelected ? 'border-gold shadow-md' : 'border-navy/5',
                      ].join(' ')}
                    >
                      <div className="w-full md:w-64 h-48 md:h-auto shrink-0 bg-navy/5 relative">
                        <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="font-display text-xl text-navy font-semibold">{room.name}</h3>
                            <span className="font-display text-lg text-gold font-semibold">${room.price} / night</span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs font-body text-navy/50 mb-4">
                            <span>Size: {room.size}</span>
                            <span>•</span>
                            <span>Occupancy: {room.capacity}</span>
                          </div>
                          <p className="font-body text-sm text-navy/70 mb-4">{room.description}</p>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {room.amenities.map((am) => (
                              <span key={am} className="text-xs bg-ivory text-navy/70 px-2.5 py-1 rounded-full border border-navy/5">
                                {am}
                              </span>
                            ))}
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant={isSelected ? 'gold' : 'outline'}
                          size="sm"
                          onClick={() => setBookingForm((prev) => ({ ...prev, selectedRoomId: room.id }))}
                          className="self-start cursor-pointer"
                        >
                          {isSelected ? 'Selected Suite' : 'Select Suite'}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Policies */}
            <div className="bg-white rounded-2xl p-8 border border-navy/5 shadow-sm space-y-6">
              <h2 className="font-display text-2xl text-navy font-semibold">Stays & Policies</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 font-body text-sm text-navy/70">
                <div className="space-y-3">
                  <h3 className="font-semibold text-navy">Check-in / Check-out</h3>
                  <p>• Check-in starts at 3:00 PM</p>
                  <p>• Check-out before 12:00 PM</p>
                  <p>• Pre-arrival luggage coordination available via concierge</p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-navy">Cancellation Guidelines</h3>
                  <p>• Free cancellation up to 48 hours prior to local check-in</p>
                  <p>• Late cancellations incur a fee equal to one night room rate</p>
                  <p>• Special peak season rates may feature customized terms</p>
                </div>
              </div>
            </div>

            {/* Location Map Placeholder */}
            <div className="bg-white rounded-2xl p-8 border border-navy/5 shadow-sm">
              <h2 className="font-display text-2xl text-navy mb-4 font-semibold">Location</h2>
              <div className="h-64 bg-navy/5 rounded-xl border border-navy/15 flex flex-col items-center justify-center text-center p-6">
                <MapPin className="w-10 h-10 text-gold mb-3 animate-bounce" />
                <h3 className="font-display text-lg text-navy font-semibold">{hotel.location}</h3>
                <p className="font-body text-xs text-navy/50 mt-1 max-w-sm">
                  {hotel.location}, {hotel.country}. Dynamic location map details will connect to Azure coordinates.
                </p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl p-8 border border-navy/5 shadow-sm space-y-8">
              <h2 className="font-display text-2xl text-navy font-semibold">Guest Feedback ({reviews.length})</h2>
              
              <div className="divide-y divide-navy/5 space-y-6">
                {reviews.map((rev) => (
                  <div key={rev.id} className="pt-6 first:pt-0 flex gap-4 items-start">
                    <Avatar src={rev.avatar} alt={rev.guestName} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="font-body font-semibold text-sm text-navy">{rev.guestName}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                          <span className="font-body text-xs font-semibold text-navy">{rev.rating}</span>
                        </div>
                      </div>
                      <p className="font-body text-xs text-navy/40 mt-1">
                        {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="font-body text-sm text-navy/70 mt-3 italic leading-relaxed">
                        “{rev.comment}”
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Feedback Form */}
              <form onSubmit={handleReviewSubmit} className="border-t border-navy/15 pt-8 space-y-5">
                <h3 className="font-display text-lg text-navy font-semibold">Share Your Stay Experience</h3>
                
                <div className="flex items-center gap-3">
                  <span className="font-body text-xs font-medium text-navy/60 uppercase tracking-wide">
                    Rating Score
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setReviewForm((prev) => ({ ...prev, rating: score }))}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                        aria-label={`Rate ${score} stars`}
                      >
                        <Star
                          className={[
                            'w-6 h-6',
                            score <= reviewForm.rating ? 'fill-gold text-gold' : 'text-navy/20',
                          ].join(' ')}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <Textarea
                  label="Your Review Details"
                  placeholder="Tell us about the service, dining, and accommodations..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                  required
                />

                {reviewError && (
                  <p className="font-body text-xs text-rose-500">
                    {reviewError}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  disabled={reviewLoading}
                  className="cursor-pointer"
                >
                  {reviewLoading ? 'Publishing...' : 'Publish Feedback'}
                </Button>
              </form>
            </div>
          </div>

          {/* Booking Card (Right) */}
          <div className="sticky top-28 space-y-6">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-navy/5 shadow-md flex flex-col">
              <h3 className="font-display text-2xl text-navy mb-6 font-semibold text-center border-b border-navy/5 pb-4">
                Reserve Suite
              </h3>

              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <DatePicker
                  label="Arrival Date"
                  value={bookingForm.checkIn}
                  onChange={(e) => {
                    setBookingForm((prev) => ({ ...prev, checkIn: e.target.value }))
                    if (bookingError) setBookingError('')
                  }}
                  required
                />

                <DatePicker
                  label="Departure Date"
                  value={bookingForm.checkOut}
                  onChange={(e) => {
                    setBookingForm((prev) => ({ ...prev, checkOut: e.target.value }))
                    if (bookingError) setBookingError('')
                  }}
                  required
                />

                <Select
                  label="Guests Number"
                  options={[
                    { value: '1', label: '1 Guest' },
                    { value: '2', label: '2 Guests' },
                    { value: '3', label: '3 Guests' },
                    { value: '4', label: '4 Guests' },
                  ]}
                  value={bookingForm.guests}
                  onChange={(e) => setBookingForm((prev) => ({ ...prev, guests: e.target.value }))}
                />

                <Select
                  label="Suite Variant"
                  options={hotel.rooms?.map((r) => ({ value: r.id, label: `${r.name} - $${r.price}/n` })) || []}
                  value={bookingForm.selectedRoomId}
                  onChange={(e) => setBookingForm((prev) => ({ ...prev, selectedRoomId: e.target.value }))}
                />

                {/* Booking summary pricing */}
                {nights > 0 && (
                  <div className="bg-ivory/50 rounded-xl p-4 space-y-2 border border-navy/5 font-body text-xs text-navy/70 mt-6">
                    <div className="flex justify-between">
                      <span>${pricePerNight} × {nights} nights</span>
                      <span className="font-semibold text-navy">${basePrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes & Tourism Fees (12%)</span>
                      <span className="font-semibold text-navy">${tax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Direct Reservation Fee</span>
                      <span className="font-semibold text-navy">${serviceFee}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-navy border-t border-navy/10 pt-2 mt-2">
                      <span>Estimated Price</span>
                      <span className="text-gold font-bold">${totalPrice}</span>
                    </div>
                  </div>
                )}

                {bookingError && (
                  <p className="font-body text-xs text-rose-500 text-center">
                    {bookingError}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  disabled={bookingLoading || bookingSuccess}
                  className="w-full mt-6 shadow-md cursor-pointer"
                >
                  {bookingLoading ? 'Requesting...' : bookingSuccess ? 'Request Sent' : 'Request Reservation'}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Recommended Hotels */}
        {recommended.length > 0 && (
          <div className="mt-24">
            <h2 className="font-display text-3xl text-navy mb-8 text-center font-semibold">Explore Other Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recommended.map((h) => (
                <RoomCard
                  key={h.id}
                  image={h.image}
                  name={h.name}
                  location={`${h.location}, ${h.country}`}
                  price={h.startingPrice}
                  rating={h.rating}
                  roomsCount={h.roomsCount}
                  amenities={h.amenities}
                  badge={h.badge}
                  to={`/hotels/${h.id}`}
                />
              ))}
            </div>
          </div>
        )}
      </Container>

      {/* Success Booking Dialog Modal */}
      <Modal
        isOpen={bookingSuccess}
        onClose={() => {
          setBookingSuccess(false)
          navigate(ROUTES.guest)
        }}
        title="Reservation Requested"
        className="max-w-md"
      >
        <div className="text-center py-4 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
            <Key className="w-6 h-6" />
          </div>
          <h3 className="font-display text-xl text-navy font-semibold mb-2">Thank You!</h3>
          <p className="font-body text-sm text-navy/70 leading-relaxed mb-6">
            Your booking request for the <strong>{selectedRoom?.name}</strong> at <strong>{hotel.name}</strong> has been received. Our concierge is reviewing room inventory and will send a confirmation summary code to your dashboard.
          </p>
          <Button
            type="button"
            variant="gold"
            size="sm"
            onClick={() => {
              setBookingSuccess(false)
              navigate(ROUTES.guest)
            }}
            className="w-full cursor-pointer"
          >
            Go to Guest Account
          </Button>
        </div>
      </Modal>
    </div>
  )
}