import api from './api.js'

export const UserService = {
  /**
   * Fetch guest profile.
   */
  getProfile: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response.data;
  },

  /**
   * Update profile information. Updates cached session block as well.
   */
  updateProfile: async (id, profileData) => {
    const response = await api.put(`/users/${id}`, profileData)
    const updated = response.data

    // Cache registration details
    localStorage.setItem('azurestay_user', JSON.stringify(updated))

    return updated;
  },

  /**
   * Fetch wishlist for specific guest.
   */
  getWishlist: async (guestId) => {
    const response = await api.get(`/users/${guestId}/wishlist`)
    return response.data;
  },

  /**
   * Toggle a hotel ID in a user's wishlist.
   */
  toggleWishlist: async (guestId, hotelId) => {
    const response = await api.post(`/users/${guestId}/wishlist/toggle`, { hotelId })
    return response.data;
  },
}
