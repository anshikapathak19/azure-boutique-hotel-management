import mongoose from 'mongoose';

const RoomConfigSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  capacity: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amenities: [String],
  image: {
    type: String,
    required: true,
  },
});

const HotelSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  startingPrice: {
    type: Number,
    required: true,
  },
  roomsCount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amenities: [String],
  image: {
    type: String,
    required: true,
  },
  badge: {
    type: String,
    default: null,
  },
  rooms: [RoomConfigSchema],
}, { timestamps: true });

const Hotel = mongoose.model('Hotel', HotelSchema);
export default Hotel;
