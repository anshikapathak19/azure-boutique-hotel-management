import api from './api.js'

const DEFAULT_WISHLIST = ['santorini-cliffside', 'amalfi-retreat']

function getWishlistData(guestId) {
  const key = `azurestay_wishlist_${guestId}`
  const data = localStorage.getItem(key)
  if (!data) {
    localStorage.setItem(key, JSON.stringify(DEFAULT_WISHLIST))
    return DEFAULT_WISHLIST
  }
  try {
    return JSON.parse(data)
  } catch (e) {
    return DEFAULT_WISHLIST
  }
}

function saveWishlistData(guestId, wishlist) {
  localStorage.setItem(`azurestay_wishlist_${guestId}`, JSON.stringify(wishlist))
}

export const UserService = {
  /**
   * Fetch guest profile.
   */
  getProfile: async (id) => {
    // API request:
    // const response = await api.get(`/users/${id}`)
    // return response.data

    return new Promise((resolve) => {
      setTimeout(() => {
        const cachedUser = localStorage.getItem('azurestay_user')
        if (cachedUser) {
          const user = JSON.parse(cachedUser)
          if (user.id === id) {
            resolve(user)
            return
          }
        }
        resolve({
          id,
          name: 'Eleanor Whitfield',
          email: 'guest@azurestay.com',
          role: 'guest',
          memberTier: 'Gold Elite',
          points: 12450,
          avatar: 'https://i.pravatar.cc/150?img=47',
          phone: '+1 (555) 019-9231',
          preferences: {
            pillowType: 'Goose Down',
            roomLocation: 'High Floor',
            dietary: 'Gluten Free',
          },
        })
      }, 200)
    })
  },

  /**
   * Update profile information. Updates cached session block as well.
   */
  updateProfile: async (id, profileData) => {
    // API request:
    // const response = await api.put(`/users/${id}`, profileData)
    // return response.data

    return new Promise((resolve) => {
      setTimeout(() => {
        const cachedUser = localStorage.getItem('azurestay_user')
        let user = {}
        if (cachedUser) {
          user = JSON.parse(cachedUser)
        }
        
        const updated = {
          ...user,
          ...profileData,
          id, // ensure ID is unchanged
        }

        localStorage.setItem('azurestay_user', JSON.stringify(updated))
        resolve(updated)
      }, 400)
    })
  },

  /**
   * Fetch wishlist for specific guest.
   */
  getWishlist: async (guestId) => {
    // API request:
    // const response = await api.get(`/users/${guestId}/wishlist`)
    // return response.data

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getWishlistData(guestId))
      }, 200)
    })
  },

  /**
   * Toggle a hotel ID in a user's wishlist.
   */
  toggleWishlist: async (guestId, hotelId) => {
    // API request:
    // const response = await api.post(`/users/${guestId}/wishlist/toggle`, { hotelId })
    // return response.data

    return new Promise((resolve) => {
      setTimeout(() => {
        const list = getWishlistData(guestId)
        let updated
        if (list.includes(hotelId)) {
          updated = list.filter((id) => id !== hotelId)
        } else {
          updated = [...list, hotelId]
        }
        saveWishlistData(guestId, updated)
        resolve(updated)
      }, 250)
    })
  },
}
