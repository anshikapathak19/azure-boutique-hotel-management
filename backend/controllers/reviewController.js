import { cosmosDb } from '../config/cosmosDb.js';

// @desc    Get reviews for a specific hotel
// @route   GET /api/reviews/hotel/:hotelId
// @access  Public
export const getReviewsByHotel = async (req, res) => {
  try {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.hotelId = @hotelId ORDER BY c._ts DESC',
      parameters: [{ name: '@hotelId', value: req.params.hotelId }]
    };
    const reviews = await cosmosDb.find('reviews', querySpec);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews written by a specific guest
// @route   GET /api/reviews/guest/:guestId
// @access  Public
export const getReviewsByGuest = async (req, res) => {
  try {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.guestId = @guestId ORDER BY c._ts DESC',
      parameters: [{ name: '@guestId', value: req.params.guestId }]
    };
    const reviews = await cosmosDb.find('reviews', querySpec);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new hotel review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { hotelId, hotelName, rating, comment } = req.body;

    if (!hotelId || !hotelName || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const reviewId = 'rev-' + Math.random().toString(36).substring(2, 11);

    const newReview = await cosmosDb.create('reviews', {
      id: reviewId,
      hotelId,
      hotelName,
      guestId: req.user.id,
      guestName: req.user.name,
      avatar: req.user.avatar || 'https://i.pravatar.cc/150?img=47',
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await cosmosDb.findById('reviews', id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (req.user.role === 'guest' && req.user.id !== review.guestId) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await cosmosDb.deleteOne('reviews', id);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews (Admin/Staff only)
// @route   GET /api/reviews
// @access  Private
export const getAllReviews = async (req, res) => {
  try {
    const querySpec = {
      query: 'SELECT * FROM c ORDER BY c._ts DESC'
    };
    const reviews = await cosmosDb.find('reviews', querySpec);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
