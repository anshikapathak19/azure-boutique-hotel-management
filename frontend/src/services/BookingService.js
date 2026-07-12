import api from './api.js'

export const BookingService = {
  /**
   * Create a new booking.
   */
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData)
    return response.data;
  },

  /**
   * Create a Stripe PaymentIntent client secret.
   */
  createPaymentIntent: async (amount) => {
    const response = await api.post('/bookings/payment-intent', { amount })
    return response.data;
  },

  /**
   * Fetch all bookings (for Admin / Staff panels).
   */
  getAllBookings: async () => {
    const response = await api.get('/bookings')
    return response.data;
  },

  /**
   * Fetch bookings filtered by Guest ID.
   */
  getBookingsByGuestId: async (guestId) => {
    const response = await api.get(`/bookings/guest/${guestId}`)
    return response.data;
  },

  /**
   * Update booking status.
   */
  updateBookingStatus: async (id, status) => {
    const response = await api.patch(`/bookings/${id}/status`, { status })
    return response.data;
  },

  /**
   * Cancel booking (soft-delete or update status to 'Cancelled').
   */
  cancelBooking: async (id) => {
    const response = await api.post(`/bookings/${id}/cancel`)
    return response.data;
  },
}
