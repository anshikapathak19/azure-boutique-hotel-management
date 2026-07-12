import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
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
  avatar: {
    type: String,
    default: 'https://i.pravatar.cc/150?img=9',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Review = mongoose.model('Review', ReviewSchema);
export default Review;
