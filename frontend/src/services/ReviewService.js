import api from './api.js'

const SEED_REVIEWS = [
  {
    id: 'rev-amalfi-01',
    hotelId: 'amalfi-retreat',
    hotelName: 'Amalfi Coast Retreat',
    guestId: 'usr-guest-01',
    guestName: 'Eleanor Whitfield',
    avatar: 'https://i.pravatar.cc/150?img=47',
    rating: 5,
    comment: 'The cliffside terraces are absolutely stunning. Outstanding rooftop meals and butler service.',
    createdAt: '2026-06-21T09:12:00Z',
  },
  {
    id: 'rev-kyoto-02',
    hotelId: 'kyoto-machiya',
    hotelName: 'Kyoto Machiya',
    guestId: 'usr-guest-01',
    guestName: 'Eleanor Whitfield',
    avatar: 'https://i.pravatar.cc/150?img=47',
    rating: 4,
    comment: 'An incredibly peaceful sanctuary in Kyoto. Quiet joinery, authentic garden, though stairs were steep.',
    createdAt: '2026-05-15T16:45:00Z',
  },
  {
    id: 'rev-santorini-03',
    hotelId: 'santorini-cliffside',
    hotelName: 'Santorini Cliffside',
    guestId: 'usr-guest-02',
    guestName: 'Haruto Sato',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    comment: 'Whitewashed suites carved into the rock, with completely private pool and stunning sunsets. Perfection.',
    createdAt: '2026-07-02T11:30:00Z',
  },
]

function getStoredReviews() {
  const data = localStorage.getItem('azurestay_reviews')
  if (!data) {
    localStorage.setItem('azurestay_reviews', JSON.stringify(SEED_REVIEWS))
    return SEED_REVIEWS
  }
  try {
    return JSON.parse(data)
  } catch (e) {
    return SEED_REVIEWS
  }
}

function saveReviews(reviews) {
  localStorage.setItem('azurestay_reviews', JSON.stringify(reviews))
}

export const ReviewService = {
  /**
   * Fetch reviews for a specific hotel.
   */
  getReviewsByHotel: async (hotelId) => {
    // API request:
    // const response = await api.get(`/reviews/hotel/${hotelId}`)
    // return response.data

    return new Promise((resolve) => {
      setTimeout(() => {
        const reviews = getStoredReviews()
        const filtered = reviews.filter((r) => r.hotelId === hotelId)
        resolve(filtered)
      }, 200)
    })
  },

  /**
   * Fetch reviews written by a specific guest.
   */
  getReviewsByGuest: async (guestId) => {
    // API request:
    // const response = await api.get(`/reviews/guest/${guestId}`)
    // return response.data

    return new Promise((resolve) => {
      setTimeout(() => {
        const reviews = getStoredReviews()
        const filtered = reviews.filter((r) => r.guestId === guestId)
        resolve(filtered)
      }, 200)
    })
  },

  /**
   * Submit a new guest review.
   */
  createReview: async (reviewData) => {
    // API request:
    // const response = await api.post('/reviews', reviewData)
    // return response.data

    return new Promise((resolve) => {
      setTimeout(() => {
        const reviews = getStoredReviews()
        const newReview = {
          id: 'rev-' + Math.random().toString(36).substr(2, 9),
          ...reviewData,
          createdAt: new Date().toISOString(),
        }
        reviews.unshift(newReview)
        saveReviews(reviews)
        resolve(newReview)
      }, 300)
    })
  },

  /**
   * Remove a review record.
   */
  deleteReview: async (id) => {
    // API request:
    // const response = await api.delete(`/reviews/${id}`)
    // return response.data

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let reviews = getStoredReviews()
        const index = reviews.findIndex((r) => r.id === id)
        if (index === -1) {
          reject(new Error('Review not found'))
          return
        }
        reviews.splice(index, 1)
        saveReviews(reviews)
        resolve(true)
      }, 250)
    })
  },

  /**
   * Get all reviews (for Admin Dashboard).
   */
  getAllReviews: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredReviews())
      }, 250)
    })
  },
}
