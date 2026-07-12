import fs from 'fs';
import path from 'path';

// Seed values
const SEED_USERS = [
  {
    _id: 'usr-guest-01',
    name: 'Eleanor Whitfield',
    email: 'guest@azurestay.com',
    password: '$2a$10$hashedpasswordplaceholder1', // bcrypt for 'password123'
    role: 'guest',
    avatar: 'https://i.pravatar.cc/150?img=47',
    memberTier: 'Gold Elite',
    memberSince: '2024',
    points: 12450,
    phone: '+1 (555) 019-9231',
    preferences: { pillowType: 'Goose Down', roomLocation: 'High Floor', dietary: 'Gluten Free' },
    wishlist: ['santorini-cliffside', 'amalfi-retreat'],
    isVerified: true,
  },
  {
    _id: 'usr-staff-01',
    name: 'Marcus Vance',
    email: 'staff@azurestay.com',
    password: '$2a$10$hashedpasswordplaceholder2',
    role: 'staff',
    avatar: 'https://i.pravatar.cc/150?img=12',
    department: 'Guest Relations',
    employeeId: 'EMP-9082',
    isVerified: true,
  },
  {
    _id: 'usr-admin-01',
    name: 'Sophia Sterling',
    email: 'admin@azurestay.com',
    password: '$2a$10$hashedpasswordplaceholder3',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=32',
    department: 'Executive Director',
    isVerified: true,
  },
];

const SEED_HOTELS = [
  {
    id: 'santorini-cliffside',
    name: 'Santorini Cliffside',
    location: 'Oia',
    country: 'Greece',
    category: 'Boutique Hotel',
    rating: 4.9,
    startingPrice: 420,
    roomsCount: 32,
    description: 'Whitewashed suites carved into the caldera cliffside, each opening onto uninterrupted Aegean sunsets.',
    amenities: ['Infinity Pool', 'Sea View', 'Fine Dining', 'Free WiFi'],
    image: '/src/assets/images/hotels/santorini-cliffside.jpg',
    badge: 'Most Popular',
    rooms: [
      { id: 'santorini-cliffside-deluxe', name: 'Deluxe Courtyard Suite', size: '48 m²', capacity: '2 Adults', price: 420, description: 'Spacious suite overlooking our landscaped gardens, with fine linens and a marble bath.', amenities: ['Garden View', 'King Bed', 'Rain Shower', 'Espresso Machine'], image: `/src/assets/images/rooms/suite-deluxe.jpg` },
      { id: 'santorini-cliffside-signature', name: 'Signature Terrace Suite', size: '65 m²', capacity: '2 Adults, 1 Child', price: 567, description: 'Luxury suite featuring an expansive private sun terrace, plunge pool, and dedicated butler call service.', amenities: ['Private Terrace', 'Plunge Pool', 'Butler Service', 'King Bed'], image: `/src/assets/images/rooms/suite-signature.jpg` },
      { id: 'santorini-cliffside-presidential', name: 'Presidential Penthouse', size: '120 m²', capacity: '4 Guests', price: 1050, description: 'Our top floor residence. Panoramic views, architectural fireplace, private chef service, and separate dining salon.', amenities: ['Panoramic View', 'Chef Service', 'Fireplace', 'Living Room'], image: `/src/assets/images/rooms/suite-presidential.jpg` }
    ]
  },
  {
    id: 'kyoto-machiya',
    name: 'Kyoto Machiya',
    location: 'Higashiyama, Kyoto',
    country: 'Japan',
    category: 'Heritage Stay',
    rating: 4.8,
    startingPrice: 310,
    roomsCount: 18,
    description: 'A restored merchant townhouse blending traditional joinery with quiet, modern comfort in old Kyoto.',
    amenities: ['Free WiFi', 'Traditional Onsen', 'Tea Ceremony', 'Garden Courtyard'],
    image: '/src/assets/images/hotels/kyoto-machiya.jpg',
    badge: null,
    rooms: [
      { id: 'kyoto-machiya-deluxe', name: 'Deluxe Courtyard Suite', size: '48 m²', capacity: '2 Adults', price: 310, description: 'Spacious suite overlooking our landscaped gardens, with fine linens and a marble bath.', amenities: ['Garden View', 'King Bed', 'Rain Shower', 'Espresso Machine'], image: `/src/assets/images/rooms/suite-deluxe.jpg` },
      { id: 'kyoto-machiya-signature', name: 'Signature Terrace Suite', size: '65 m²', capacity: '2 Adults, 1 Child', price: 419, description: 'Luxury suite featuring an expansive private sun terrace, plunge pool, and dedicated butler call service.', amenities: ['Private Terrace', 'Plunge Pool', 'Butler Service', 'King Bed'], image: `/src/assets/images/rooms/suite-signature.jpg` },
      { id: 'kyoto-machiya-presidential', name: 'Presidential Penthouse', size: '120 m²', capacity: '4 Guests', price: 775, description: 'Our top floor residence. Panoramic views, architectural fireplace, private chef service, and separate dining salon.', amenities: ['Panoramic View', 'Chef Service', 'Fireplace', 'Living Room'], image: `/src/assets/images/rooms/suite-presidential.jpg` }
    ]
  },
  {
    id: 'amalfi-retreat',
    name: 'Amalfi Coast Retreat',
    location: 'Positano',
    country: 'Italy',
    category: 'Boutique Hotel',
    rating: 4.9,
    startingPrice: 480,
    roomsCount: 24,
    description: 'Terraced suites tumbling down toward the Tyrrhenian Sea, with a private beach club and rooftop dining.',
    amenities: ['Private Pool', 'Fine Dining', 'Rooftop Terrace', 'Spa'],
    image: '/src/assets/images/hotels/amalfi-retreat.jpg',
    badge: 'Signature',
    rooms: [
      { id: 'amalfi-retreat-deluxe', name: 'Deluxe Courtyard Suite', size: '48 m²', capacity: '2 Adults', price: 480, description: 'Spacious suite overlooking our landscaped gardens, with fine linens and a marble bath.', amenities: ['Garden View', 'King Bed', 'Rain Shower', 'Espresso Machine'], image: `/src/assets/images/rooms/suite-deluxe.jpg` },
      { id: 'amalfi-retreat-signature', name: 'Signature Terrace Suite', size: '65 m²', capacity: '2 Adults, 1 Child', price: 648, description: 'Luxury suite featuring an expansive private sun terrace, plunge pool, and dedicated butler call service.', amenities: ['Private Terrace', 'Plunge Pool', 'Butler Service', 'King Bed'], image: `/src/assets/images/rooms/suite-signature.jpg` },
      { id: 'amalfi-retreat-presidential', name: 'Presidential Penthouse', size: '120 m²', capacity: '4 Guests', price: 1200, description: 'Our top floor residence. Panoramic views, architectural fireplace, private chef service, and separate dining salon.', amenities: ['Panoramic View', 'Chef Service', 'Fireplace', 'Living Room'], image: `/src/assets/images/rooms/suite-presidential.jpg` }
    ]
  },
  {
    id: 'bali-rainforest',
    name: 'Bali Rainforest Villas',
    location: 'Ubud',
    country: 'Indonesia',
    category: 'Villa',
    rating: 4.7,
    startingPrice: 260,
    roomsCount: 40,
    description: 'Private villas set among rice terraces and rainforest canopy, each with its own plunge pool and open-air pavilion.',
    amenities: ['Private Pool', 'Yoga Pavilion', 'Free WiFi', 'Rainforest View'],
    image: '/src/assets/images/hotels/bali-villas.jpg',
    badge: 'New',
    rooms: [
      { id: 'bali-rainforest-deluxe', name: 'Deluxe Courtyard Suite', size: '48 m²', capacity: '2 Adults', price: 260, description: 'Spacious suite overlooking our landscaped gardens, with fine linens and a marble bath.', amenities: ['Garden View', 'King Bed', 'Rain Shower', 'Espresso Machine'], image: `/src/assets/images/rooms/suite-deluxe.jpg` },
      { id: 'bali-rainforest-signature', name: 'Signature Terrace Suite', size: '65 m²', capacity: '2 Adults, 1 Child', price: 351, description: 'Luxury suite featuring an expansive private sun terrace, plunge pool, and dedicated butler call service.', amenities: ['Private Terrace', 'Plunge Pool', 'Butler Service', 'King Bed'], image: `/src/assets/images/rooms/suite-signature.jpg` },
      { id: 'bali-rainforest-presidential', name: 'Presidential Penthouse', size: '120 m²', capacity: '4 Guests', price: 650, description: 'Our top floor residence. Panoramic views, architectural fireplace, private chef service, and separate dining salon.', amenities: ['Panoramic View', 'Chef Service', 'Fireplace', 'Living Room'], image: `/src/assets/images/rooms/suite-presidential.jpg` }
    ]
  },
  {
    id: 'zermatt-alpine',
    name: 'Alpine Chalet Collection',
    location: 'Zermatt',
    country: 'Switzerland',
    category: 'Resort',
    rating: 4.9,
    startingPrice: 550,
    roomsCount: 15,
    description: 'Timber-clad chalets beneath the Matterhorn, with direct ski-in/ski-out access and a full-service alpine spa.',
    amenities: ['Spa', 'Mountain View', 'Ski-in/Ski-out', 'Fine Dining'],
    image: '/src/assets/images/hotels/alpine-chalet.jpg',
    badge: 'Exclusive',
    rooms: [
      { id: 'zermatt-alpine-deluxe', name: 'Deluxe Courtyard Suite', size: '48 m²', capacity: '2 Adults', price: 550, description: 'Spacious suite overlooking our landscaped gardens, with fine linens and a marble bath.', amenities: ['Garden View', 'King Bed', 'Rain Shower', 'Espresso Machine'], image: `/src/assets/images/rooms/suite-deluxe.jpg` },
      { id: 'zermatt-alpine-signature', name: 'Signature Terrace Suite', size: '65 m²', capacity: '2 Adults, 1 Child', price: 743, description: 'Luxury suite featuring an expansive private sun terrace, plunge pool, and dedicated butler call service.', amenities: ['Private Terrace', 'Plunge Pool', 'Butler Service', 'King Bed'], image: `/src/assets/images/rooms/suite-signature.jpg` },
      { id: 'zermatt-alpine-presidential', name: 'Presidential Penthouse', size: '120 m²', capacity: '4 Guests', price: 1375, description: 'Our top floor residence. Panoramic views, architectural fireplace, private chef service, and separate dining salon.', amenities: ['Panoramic View', 'Chef Service', 'Fireplace', 'Living Room'], image: `/src/assets/images/rooms/suite-presidential.jpg` }
    ]
  },
  {
    id: 'maldives-overwater',
    name: 'Maldives Overwater Villas',
    location: 'North Malé Atoll',
    country: 'Maldives',
    category: 'Villa',
    rating: 5.0,
    startingPrice: 890,
    roomsCount: 20,
    description: 'Overwater villas with private decks and direct lagoon access, paired with dedicated butler service.',
    amenities: ['Butler Service', 'Private Pool', 'Snorkeling', 'Free WiFi'],
    image: '/src/assets/images/hotels/overwater-villas.jpg',
    badge: 'Exclusive',
    rooms: [
      { id: 'maldives-overwater-deluxe', name: 'Deluxe Courtyard Suite', size: '48 m²', capacity: '2 Adults', price: 890, description: 'Spacious suite overlooking our landscaped gardens, with fine linens and a marble bath.', amenities: ['Garden View', 'King Bed', 'Rain Shower', 'Espresso Machine'], image: `/src/assets/images/rooms/suite-deluxe.jpg` },
      { id: 'maldives-overwater-signature', name: 'Signature Terrace Suite', size: '65 m²', capacity: '2 Adults, 1 Child', price: 1202, description: 'Luxury suite featuring an expansive private sun terrace, plunge pool, and dedicated butler call service.', amenities: ['Private Terrace', 'Plunge Pool', 'Butler Service', 'King Bed'], image: `/src/assets/images/rooms/suite-signature.jpg` },
      { id: 'maldives-overwater-presidential', name: 'Presidential Penthouse', size: '120 m²', capacity: '4 Guests', price: 2225, description: 'Our top floor residence. Panoramic views, architectural fireplace, private chef service, and separate dining salon.', amenities: ['Panoramic View', 'Chef Service', 'Fireplace', 'Living Room'], image: `/src/assets/images/rooms/suite-presidential.jpg` }
    ]
  },
  {
    id: 'tuscany-vineyard',
    name: 'Tuscany Vineyard Estate',
    location: 'Chianti',
    country: 'Italy',
    category: 'Heritage Stay',
    rating: 4.7,
    startingPrice: 340,
    roomsCount: 12,
    description: 'A restored 17th-century farmhouse on a working vineyard, with cellar tastings and rolling hillside views.',
    amenities: ['Fine Dining', 'Vineyard Tours', 'Free WiFi', 'Spa'],
    image: '/src/assets/images/hotels/tuscany-estate.jpg',
    badge: null,
    rooms: [
      { id: 'tuscany-vineyard-deluxe', name: 'Deluxe Courtyard Suite', size: '48 m²', capacity: '2 Adults', price: 340, description: 'Spacious suite overlooking our landscaped gardens, with fine linens and a marble bath.', amenities: ['Garden View', 'King Bed', 'Rain Shower', 'Espresso Machine'], image: `/src/assets/images/rooms/suite-deluxe.jpg` },
      { id: 'tuscany-vineyard-signature', name: 'Signature Terrace Suite', size: '65 m²', capacity: '2 Adults, 1 Child', price: 459, description: 'Luxury suite featuring an expansive private sun terrace, plunge pool, and dedicated butler call service.', amenities: ['Private Terrace', 'Plunge Pool', 'Butler Service', 'King Bed'], image: `/src/assets/images/rooms/suite-signature.jpg` },
      { id: 'tuscany-vineyard-presidential', name: 'Presidential Penthouse', size: '120 m²', capacity: '4 Guests', price: 850, description: 'Our top floor residence. Panoramic views, architectural fireplace, private chef service, and separate dining salon.', amenities: ['Panoramic View', 'Chef Service', 'Fireplace', 'Living Room'], image: `/src/assets/images/rooms/suite-presidential.jpg` }
    ]
  },
];

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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rev-santorini-03',
    hotelId: 'santorini-cliffside',
    hotelName: 'Santorini Cliffside',
    guestId: 'usr-custom-11111',
    guestName: 'Haruto Sato',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    comment: 'Whitewashed suites carved into the rock, with completely private pool and stunning sunsets. Perfection.',
    createdAt: new Date().toISOString(),
  },
];

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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bk-santorini-03',
    hotelId: 'santorini-cliffside',
    hotelName: 'Santorini Cliffside',
    guestId: 'usr-custom-11111',
    guestName: 'Haruto Sato',
    guestEmail: 'haruto@example.com',
    roomType: 'Signature Terrace Suite',
    checkIn: '2026-07-10',
    checkOut: '2026-07-15',
    guestsCount: 2,
    totalPrice: 2835,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  },
];

const SEED_SETTINGS = {
  globalBookingFee: 15,
  taxRatePercent: 12,
  allowInstantBookings: true,
  enableEmailAlerts: true,
  maintenanceMode: false,
};

// In-Memory databases
let db = {
  users: [...SEED_USERS],
  hotels: [...SEED_HOTELS],
  bookings: [...SEED_BOOKINGS],
  reviews: [...SEED_REVIEWS],
  settings: { ...SEED_SETTINGS },
};

export const jsonDb = {
  users: {
    find: async () => db.users,
    findById: async (id) => db.users.find((u) => u._id === id || u.id === id),
    findOne: async (query) => {
      if (query.email) {
        return db.users.find((u) => u.email === query.email.toLowerCase());
      }
      if (query.googleId) {
        return db.users.find((u) => u.googleId === query.googleId);
      }
      return null;
    },
    create: async (userData) => {
      const newUser = {
        _id: 'usr-' + Date.now(),
        avatar: 'https://i.pravatar.cc/150?img=9',
        memberTier: 'Club Member',
        memberSince: new Date().getFullYear().toString(),
        points: 0,
        wishlist: [],
        preferences: { pillowType: 'Standard', roomLocation: 'Standard', dietary: 'None' },
        isVerified: false,
        ...userData,
      };
      db.users.push(newUser);
      return newUser;
    },
    save: async (user) => {
      const idx = db.users.findIndex((u) => u._id === user._id);
      if (idx !== -1) {
        db.users[idx] = user;
      }
      return user;
    }
  },

  hotels: {
    find: async (query = {}, sort = {}) => {
      let result = [...db.hotels];
      // simple match simulation if queries occur
      return result;
    },
    findOne: async (query) => db.hotels.find((h) => h.id === query.id),
  },

  bookings: {
    find: async (query = {}) => {
      let result = [...db.bookings];
      if (query.guestId) {
        result = result.filter((b) => b.guestId === query.guestId);
      }
      return result;
    },
    findOne: async (query) => db.bookings.find((b) => b.id === query.id),
    countDocuments: async (query = {}) => {
      let result = [...db.bookings];
      if (query.status && query.status.$in) {
        result = result.filter((b) => query.status.$in.includes(b.status));
      }
      return result.length;
    },
    create: async (bookingData) => {
      const newBooking = {
        createdAt: new Date().toISOString(),
        status: 'Pending',
        ...bookingData,
      };
      db.bookings.push(newBooking);
      return newBooking;
    },
    save: async (booking) => {
      const idx = db.bookings.findIndex((b) => b.id === booking.id);
      if (idx !== -1) {
        db.bookings[idx] = booking;
      }
      return booking;
    }
  },

  reviews: {
    find: async (query = {}) => {
      let result = [...db.reviews];
      if (query.hotelId) {
        result = result.filter((r) => r.hotelId === query.hotelId);
      }
      if (query.guestId) {
        result = result.filter((r) => r.guestId === query.guestId);
      }
      return result;
    },
    findOne: async (query) => db.reviews.find((r) => r.id === query.id),
    create: async (reviewData) => {
      const newReview = {
        createdAt: new Date().toISOString(),
        ...reviewData,
      };
      db.reviews.unshift(newReview);
      return newReview;
    },
    deleteOne: async (query) => {
      db.reviews = db.reviews.filter((r) => r.id !== query.id);
      return { deletedCount: 1 };
    }
  },

  settings: {
    get: async () => db.settings,
    update: async (newSettings) => {
      db.settings = { ...db.settings, ...newSettings };
      return db.settings;
    }
  }
};
