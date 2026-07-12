import dotenv from 'dotenv';
import { initCosmos, cosmosDb } from '../config/cosmosDb.js';
import { supabase } from '../config/supabase.js';

dotenv.config();

const mockHotelsData = [
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
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    badge: 'Most Popular',
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
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    badge: null,
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
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80',
    badge: 'Signature',
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
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    badge: 'New',
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
    image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80',
    badge: 'Exclusive',
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
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
    badge: 'Exclusive',
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
    image: 'https://images.unsplash.com/photo-1505916383359-2d1c58b7884e?auto=format&fit=crop&w=800&q=80',
    badge: null,
  },
];

const mockReviews = [
  {
    id: 'rev-amalfi-01',
    hotelId: 'amalfi-retreat',
    hotelName: 'Amalfi Coast Retreat',
    guestName: 'Eleanor Whitfield',
    avatar: 'https://i.pravatar.cc/150?img=47',
    rating: 5,
    comment: 'The cliffside terraces are absolutely stunning. Outstanding rooftop meals and butler service.',
  },
  {
    id: 'rev-kyoto-02',
    hotelId: 'kyoto-machiya',
    hotelName: 'Kyoto Machiya',
    guestName: 'Eleanor Whitfield',
    avatar: 'https://i.pravatar.cc/150?img=47',
    rating: 4,
    comment: 'An incredibly peaceful sanctuary in Kyoto. Quiet joinery, authentic garden, though stairs were steep.',
  },
];

const mockSettings = {
  id: 'global-settings',
  globalBookingFee: 15,
  taxRatePercent: 12,
  allowInstantBookings: true,
  enableEmailAlerts: true,
  maintenanceMode: false,
};

const runSeed = async () => {
  try {
    console.log('Initializing Azure Cosmos DB Client...');
    await initCosmos();
    console.log('Connected to Cosmos DB.');

    // Clear Cosmos Containers
    const containersList = ['users', 'hotels', 'bookings', 'reviews', 'settings'];
    for (const containerId of containersList) {
      console.log(`Clearing container '${containerId}'...`);
      const items = await cosmosDb.find(containerId);
      for (const item of items) {
        await cosmosDb.deleteOne(containerId, item.id);
      }
      console.log(`Cleared container '${containerId}'.`);
    }

    // Seed Supabase Auth Users
    console.log('Seeding Supabase Auth Credentials...');
    const seedUsers = [
      {
        email: 'guest@azurestay.com',
        password: 'password123',
        name: 'Eleanor Whitfield',
        role: 'guest',
        memberTier: 'Gold Elite',
        points: 12450,
        phone: '+1 (555) 019-9231',
        preferences: { pillowType: 'Goose Down', roomLocation: 'High Floor', dietary: 'Gluten Free' },
        wishlist: ['santorini-cliffside', 'amalfi-retreat'],
      },
      {
        email: 'staff@azurestay.com',
        password: 'password123',
        name: 'Marcus Vance',
        role: 'staff',
        department: 'Guest Relations',
        employeeId: 'EMP-9082',
      },
      {
        email: 'admin@azurestay.com',
        password: 'password123',
        name: 'Sophia Sterling',
        role: 'admin',
        department: 'Executive Director',
      },
    ];

    const usersMap = {}; // mapping of email to supabase ID

    for (const u of seedUsers) {
      // Check if user already exists in Supabase
      const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
      let supabaseUser = listData?.users?.find(item => item.email === u.email);

      if (!supabaseUser) {
        console.log(`Creating auth record for ${u.email}...`);
        const { data: createData, error: createError } = await supabase.auth.admin.createUser({
          email: u.email,
          password: u.password,
          email_confirm: true,
          user_metadata: { name: u.name },
        });

        if (createError) {
          console.error(`Failed to register ${u.email} in Supabase Auth:`, createError.message);
          continue;
        }
        supabaseUser = createData.user;
      }

      usersMap[u.email] = supabaseUser.id;

      // Seed Custom Profile Details in Cosmos DB
      const profile = {
        id: supabaseUser.id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.role === 'guest' ? 'https://i.pravatar.cc/150?img=47' : (u.role === 'staff' ? 'https://i.pravatar.cc/150?img=12' : 'https://i.pravatar.cc/150?img=32'),
        memberTier: u.memberTier || 'Club Member',
        points: u.points || 0,
        phone: u.phone || '',
        preferences: u.preferences || { pillowType: 'Standard', roomLocation: 'Standard', dietary: 'None' },
        wishlist: u.wishlist || [],
        department: u.department,
        employeeId: u.employeeId,
        memberSince: new Date().getFullYear().toString(),
        isVerified: true,
      };

      await cosmosDb.create('users', profile);
      console.log(`Cosmos profile registered for ${u.email} (${supabaseUser.id}).`);
    }

    // Insert Hotels
    console.log('Seeding hotels to Cosmos...');
    for (const h of mockHotelsData) {
      const roomsConfig = [
        {
          id: `${h.id}-deluxe`,
          name: 'Deluxe Courtyard Suite',
          size: '48 m²',
          capacity: '2 Adults',
          price: h.startingPrice,
          description: 'Spacious suite overlooking our landscaped gardens, with fine linens and a marble bath.',
          amenities: ['Garden View', 'King Bed', 'Rain Shower', 'Espresso Machine'],
          image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        },
        {
          id: `${h.id}-signature`,
          name: 'Signature Terrace Suite',
          size: '65 m²',
          capacity: '2 Adults, 1 Child',
          price: Math.round(h.startingPrice * 1.35),
          description: 'Luxury suite featuring an expansive private sun terrace, plunge pool, and dedicated butler call service.',
          amenities: ['Private Terrace', 'Plunge Pool', 'Butler Service', 'King Bed'],
          image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        },
        {
          id: `${h.id}-presidential`,
          name: 'Presidential Penthouse',
          size: '120 m²',
          capacity: '4 Guests',
          price: Math.round(h.startingPrice * 2.5),
          description: 'Our top floor residence. Panoramic views, architectural fireplace, private chef service, and separate dining salon.',
          amenities: ['Panoramic View', 'Chef Service', 'Fireplace', 'Living Room'],
          image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
        },
      ];

      await cosmosDb.create('hotels', {
        ...h,
        rooms: roomsConfig,
      });
    }
    console.log('Hotels seeded.');

    // Insert Reviews
    console.log('Seeding reviews...');
    for (const r of mockReviews) {
      const guestId = usersMap['guest@azurestay.com'] || 'mock-guest-id';
      await cosmosDb.create('reviews', {
        ...r,
        guestId,
      });
    }
    console.log('Reviews seeded.');

    // Insert Settings
    console.log('Seeding settings...');
    await cosmosDb.create('settings', mockSettings);
    console.log('Settings seeded.');

    // Seed sample bookings
    console.log('Seeding bookings...');
    const sampleBookings = [
      {
        id: 'bk-amalfi-01',
        hotelId: 'amalfi-retreat',
        hotelName: 'Amalfi Coast Retreat',
        guestId: usersMap['guest@azurestay.com'] || 'mock-guest-id',
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
    ];

    for (const b of sampleBookings) {
      await cosmosDb.create('bookings', b);
    }
    console.log('Bookings seeded.');

    console.log('Database Seeding Completed Successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error.message);
    process.exit(1);
  }
};

runSeed();
