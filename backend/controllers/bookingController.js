import { cosmosDb } from '../config/cosmosDb.js';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock';
const stripe = new Stripe(stripeSecretKey);

// @desc    Create a Stripe PaymentIntent for room reservations
// @route   POST /api/bookings/payment-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Valid payment amount is required.' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100), // Stripe expects cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    });
  } catch (error) {
    console.error('Stripe PaymentIntent Creation Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new booking in Cosmos DB
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const {
      hotelId,
      hotelName,
      guestId,
      guestName,
      guestEmail,
      roomType,
      checkIn,
      checkOut,
      guestsCount,
      totalPrice,
      paymentMethod = 'card', // 'card' (stripe) or 'cash' (cash on delivery)
    } = req.body;

    if (!hotelId || !roomType || !checkIn || !checkOut || !guestsCount || !totalPrice) {
      return res.status(400).json({ message: 'Missing required booking fields.' });
    }

    const bookingId = 'bk-' + Math.random().toString(36).substring(2, 11);
    const pointsEarned = Math.round(totalPrice * 10);
    const targetGuestId = guestId || req.user.id;

    // Determine starting status based on payment option selected
    const status = paymentMethod === 'card' ? 'Confirmed' : 'Pending';

    // Create the booking document
    const newBooking = await cosmosDb.create('bookings', {
      id: bookingId,
      hotelId,
      hotelName,
      guestId: targetGuestId,
      guestName: guestName || req.user.name,
      guestEmail: guestEmail || req.user.email,
      roomType,
      checkIn,
      checkOut,
      guestsCount: Number(guestsCount),
      totalPrice: Number(totalPrice),
      paymentMethod,
      status,
      createdAt: new Date().toISOString(),
    });

    // Update User points and rewards in Cosmos DB users container
    let updatedUser;
    const userObj = await cosmosDb.findById('users', targetGuestId);
    if (userObj) {
      userObj.points = (userObj.points || 0) + pointsEarned;
      if (userObj.points >= 20000) {
        userObj.memberTier = 'Platinum Elite';
      } else if (userObj.points >= 10000) {
        userObj.memberTier = 'Gold Elite';
      } else {
        userObj.memberTier = 'Club Member';
      }
      updatedUser = await cosmosDb.save('users', userObj);
    }

    res.status(201).json({
      booking: newBooking,
      user: updatedUser || req.user,
    });
  } catch (error) {
    console.error('Failed to create booking in Cosmos DB:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin/Staff only)
// @route   GET /api/bookings
// @access  Private
export const getAllBookings = async (req, res) => {
  try {
    const querySpec = {
      query: 'SELECT * FROM c ORDER BY c.createdAt DESC',
    };
    const bookings = await cosmosDb.find('bookings', querySpec);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get guest bookings
// @route   GET /api/bookings/guest/:guestId
// @access  Private
export const getBookingsByGuestId = async (req, res) => {
  try {
    const { guestId } = req.params;

    if (req.user.role === 'guest' && req.user.id !== guestId) {
      return res.status(403).json({ message: 'Access denied to other guest bookings.' });
    }

    const querySpec = {
      query: 'SELECT * FROM c WHERE c.guestId = @guestId ORDER BY c.createdAt DESC',
      parameters: [{ name: '@guestId', value: guestId }],
    };

    const bookings = await cosmosDb.find('bookings', querySpec);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (Staff/Admin only)
// @route   PATCH /api/bookings/:id/status
// @access  Private
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const booking = await cosmosDb.findById('bookings', id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    const updated = await cosmosDb.save('bookings', booking);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   POST /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await cosmosDb.findById('bookings', id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.user.role === 'guest' && req.user.id !== booking.guestId) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'Cancelled';
    const updated = await cosmosDb.save('bookings', booking);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
