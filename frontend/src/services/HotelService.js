import api from './api.js'

export const HotelService = {
  /**
   * Get filtered, sorted, and paginated hotels.
   */
  getHotels: async (filters = {}) => {
    const response = await api.get('/hotels', { params: filters })
    return response.data;
  },

  /**
   * Fetch single hotel by ID, including its configured room variants.
   */
  getHotelById: async (id) => {
    const response = await api.get(`/hotels/${id}`)
    return response.data;
  },

  /**
   * Get featured hotels for the Landing Page.
   */
  getFeaturedHotels: async (limit = 6) => {
    const response = await api.get('/hotels/featured', { params: { limit } })
    return response.data;
  },
}
