import api from './api.js'
import { rooms as mockHotels } from '../data/rooms.js'

// Helper for price check
function matchesPriceRange(price, range) {
  if (!range || range === 'any') return true
  if (range === '800+') return price >= 800
  const [min, max] = range.split('-').map(Number)
  return price >= min && price <= max
}

// Helper for rating check
function matchesRating(rating, minRating) {
  if (!minRating || minRating === 'any') return true
  return rating >= Number(minRating)
}

export const HotelService = {
  /**
   * Get filtered, sorted, and paginated hotels.
   * Resolves asynchronously to prepare for backend integrations.
   */
  getHotels: async (filters = {}) => {
    // Under actual conditions, we would call:
    // const response = await api.get('/hotels', { params: filters })
    // return response.data
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const {
          destination = '',
          category = 'all',
          priceRange = 'any',
          rating = 'any',
          amenities = [],
          sortBy = 'newest',
        } = filters

        let result = mockHotels.filter((hotel) => {
          const matchesDestination =
            destination.trim() === '' ||
            `${hotel.name} ${hotel.location} ${hotel.country}`
              .toLowerCase()
              .includes(destination.trim().toLowerCase())

          const matchesCategory = category === 'all' || hotel.category === category

          const matchesAmenities =
            amenities.length === 0 ||
            amenities.every((amenity) => hotel.amenities.includes(amenity))

          return (
            matchesDestination &&
            matchesCategory &&
            matchesPriceRange(hotel.startingPrice, priceRange) &&
            matchesRating(hotel.rating, rating) &&
            matchesAmenities
          )
        })

        // Sorting
        switch (sortBy) {
          case 'rating':
            result = [...result].sort((a, b) => b.rating - a.rating)
            break
          case 'price-asc':
            result = [...result].sort((a, b) => a.startingPrice - b.startingPrice)
            break
          case 'price-desc':
            result = [...result].sort((a, b) => b.startingPrice - a.startingPrice)
            break
          default:
            // 'newest' / catalog default
            break
        }

        resolve({
          data: result,
          total: result.length,
        })
      }, 300)
    })
  },

  /**
   * Fetch single hotel by ID, including its configured room variants.
   */
  getHotelById: async (id) => {
    // Actual API request:
    // const response = await api.get(`/hotels/${id}`)
    // return response.data

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const hotel = mockHotels.find((h) => h.id === id)
        if (!hotel) {
          reject(new Error('Hotel not found'))
          return
        }

        // Return hotel with detailed room categories configuration for details page booking
        const roomsConfig = [
          {
            id: `${id}-deluxe`,
            name: 'Deluxe Courtyard Suite',
            size: '48 m²',
            capacity: '2 Adults',
            price: hotel.startingPrice,
            description: 'Spacious suite overlooking our landscaped gardens, with fine linens and a marble bath.',
            amenities: ['Garden View', 'King Bed', 'Rain Shower', 'Espresso Machine'],
            image: `/src/assets/images/rooms/suite-deluxe.jpg`,
          },
          {
            id: `${id}-signature`,
            name: 'Signature Terrace Suite',
            size: '65 m²',
            capacity: '2 Adults, 1 Child',
            price: Math.round(hotel.startingPrice * 1.35),
            description: 'Luxury suite featuring an expansive private sun terrace, plunge pool, and dedicated butler call service.',
            amenities: ['Private Terrace', 'Plunge Pool', 'Butler Service', 'King Bed'],
            image: `/src/assets/images/rooms/suite-signature.jpg`,
          },
          {
            id: `${id}-presidential`,
            name: 'Presidential Penthouse',
            size: '120 m²',
            capacity: '4 Guests',
            price: Math.round(hotel.startingPrice * 2.5),
            description: 'Our top floor residence. Panoramic views, architectural fireplace, private chef service, and separate dining salon.',
            amenities: ['Panoramic View', 'Chef Service', 'Fireplace', 'Living Room'],
            image: `/src/assets/images/rooms/suite-presidential.jpg`,
          },
        ]

        resolve({
          ...hotel,
          rooms: roomsConfig,
        })
      }, 250)
    })
  },

  /**
   * Get featured hotels for the Landing Page.
   */
  getFeaturedHotels: async (limit = 6) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockHotels.slice(0, limit))
      }, 200)
    })
  },
}
