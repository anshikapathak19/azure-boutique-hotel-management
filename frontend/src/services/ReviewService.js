import api from './api.js'

export const ReviewService = {
  /**
   * Fetch reviews for a specific hotel.
   */
  getReviewsByHotel: async (hotelId) => {
    const response = await api.get(`/reviews/hotel/${hotelId}`)
    return response.data;
  },

  /**
   * Fetch reviews written by a specific guest.
   */
  getReviewsByGuest: async (guestId) => {
    const response = await api.get(`/reviews/guest/${guestId}`)
    return response.data;
  },

  /**
   * Submit a new guest review.
   */
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData)
    return response.data;
  },

  /**
   * Remove a review record.
   */
  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`)
    return response.data;
  },

  /**
   * Get all reviews (for Admin Dashboard).
   */
  getAllReviews: async () => {
    const response = await api.get('/reviews')
    return response.data;
  },
}
