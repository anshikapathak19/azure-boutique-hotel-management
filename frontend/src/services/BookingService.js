import api from './api.js'

// Default mock bookings to seed local storage on first load
const SEED_BOOKINGS = [
  {
    id: 'bk-amalfi-01',
    hotelId: 'amalfi-retreat',
    hotelName: 'Amalfi Coast Retreat',
    guestId: 'usr-guest-01',
    guestName: 'Eleanor Whitfield',
    guestEmail: 'guest@azurestay.com',
    roomType: 'Deluxe Courtyard Suite',
    checkIn: '2026-08-15',
    checkOut: '2026-08-20',
    guestsCount: 2,
    totalPrice: 2100,
    status: 'Confirmed',
    createdAt: '2026-07-01T10:30:00Z',
  },
  {
    id: 'bk-kyoto-02',
    hotelId: 'kyoto-machiya',
    hotelName: 'Kyoto Machiya',
    guestId: 'usr-guest-01',
    guestName: 'Eleanor Whitfield',
    guestEmail: 'guest@azurestay.com',
    roomType: 'Traditional Tatami Suite',
    checkIn: '2026-05-10',
    checkOut: '2026-05-14',
    guestsCount: 1,
    totalPrice: 1240,
    status: 'Checked Out',
    createdAt: '2026-04-12T14:22:00Z',
  },
  {
    id: 'bk-santorini-03',
    hotelId: 'santorini-cliffside',
    hotelName: 'Santorini Cliffside',
    guestId: 'usr-guest-02',
    guestName: 'Haruto Sato',
    guestEmail: 'haruto@example.com',
    roomType: 'Signature Terrace Suite',
    checkIn: '2026-07-10',
    checkOut: '2026-07-15',
    guestsCount: 2,
    totalPrice: 2835,
    status: 'Pending',
    createdAt: '2026-07-08T09:15:00Z',
  },
  {
    id: 'bk-zermatt-04',
    hotelId: 'zermatt-alpine',
    hotelName: 'Alpine Chalet Collection',
    guestId: 'usr-guest-03',
    guestName: 'Sofia Marchetti',
    guestEmail: 'sofia@example.com',
    roomType: 'Presidential Penthouse',
    checkIn: '2026-07-09',
    checkOut: '2026-07-16',
    guestsCount: 4,
    totalPrice: 9625,
    status: 'Checked In',
    createdAt: '2026-06-20T18:40:00Z',
  },
]

function getStoredBookings() {
  const data = localStorage.getItem('azurestay_bookings')
  if (!data) {
    localStorage.setItem('azurestay_bookings', JSON.stringify(SEED_BOOKINGS))
    return SEED_BOOKINGS
  }
  try {
    return JSON.parse(data)
  } catch (e) {
    return SEED_BOOKINGS
  }
}

function saveBookings(bookings) {
  localStorage.setItem('azurestay_bookings', JSON.stringify(bookings))
}

export const BookingService = {
  /**
   * Create a new booking.
   */
  createBooking: async (bookingData) => {
    // API request:
    // const response = await api.post('/bookings', bookingData)
    // return response.data

    return new Promise((resolve) => {
      setTimeout(() => {
        const bookings = getStoredBookings()
        const newBooking = {
          id: 'bk-' + Math.random().toString(36).substr(2, 9),
          ...bookingData,
          status: 'Pending',
          createdAt: new Date().toISOString(),
        }
        bookings.unshift(newBooking)
        saveBookings(bookings)
        resolve(newBooking)
      }, 400)
    })
  },

  /**
   * Fetch all bookings (for Admin / Staff panels).
   */
  getAllBookings: async () => {
    // API request:
    // const response = await api.get('/bookings')
    // return response.data

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredBookings())
      }, 300)
    })
  },

  /**
   * Fetch bookings filtered by Guest ID.
   */
  getBookingsByGuestId: async (guestId) => {
    // API request:
    // const response = await api.get(`/bookings/guest/${guestId}`)
    // return response.data

    return new Promise((resolve) => {
      setTimeout(() => {
        const bookings = getStoredBookings()
        const filtered = bookings.filter((b) => b.guestId === guestId)
        resolve(filtered)
      }, 250)
    })
  },

  /**
   * Update booking status.
   */
  updateBookingStatus: async (id, status) => {
    // API request:
    // const response = await api.patch(`/bookings/${id}/status`, { status })
    // return response.data

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const bookings = getStoredBookings()
        const index = bookings.findIndex((b) => b.id === id)
        if (index === -1) {
          reject(new Error('Booking record not found'))
          return
        }
        bookings[index].status = status
        saveBookings(bookings)
        resolve(bookings[index])
      }, 300)
    })
  },

  /**
   * Cancel booking (soft-delete or update status to 'Cancelled').
   */
  cancelBooking: async (id) => {
    // API request:
    // const response = await api.post(`/bookings/${id}/cancel`)
    // return response.data

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const bookings = getStoredBookings()
        const index = bookings.findIndex((b) => b.id === id)
        if (index === -1) {
          reject(new Error('Booking record not found'))
          return
        }
        bookings[index].status = 'Cancelled'
        saveBookings(bookings)
        resolve(bookings[index])
      }, 300)
    })
  },
}
