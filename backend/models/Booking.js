import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  hotelId: {
    type: String,
    required: true,
  },
  hotelName: {
    type: String,
    required: true,
  },
  guestId: {
    type: String,
    required: true,
  },
  guestName: {
    type: String,
    required: true,
  },
  guestEmail: {
    type: String,
    required: true,
  },
  roomType: {
    type: String,
    required: true,
  },
  checkIn: {
    type: String, // 'YYYY-MM-DD'
    required: true,
  },
  checkOut: {
    type: String, // 'YYYY-MM-DD'
    required: true,
  },
  guestsCount: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled'],
    default: 'Pending',
  },
}, { timestamps: true });

const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;
