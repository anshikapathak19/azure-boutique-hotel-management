import { cosmosDb } from '../config/cosmosDb.js';

// @desc    Get user profile details
// @route   GET /api/users/:id
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role === 'guest' && req.user.id !== id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await cosmosDb.findById('users', id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile preferences
// @route   PUT /api/users/:id
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const { name, phone, avatar, preferences } = req.body;
    
    const userObj = await cosmosDb.findById('users', id);
    if (!userObj) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    if (name) userObj.name = name;
    if (phone !== undefined) userObj.phone = phone;
    if (avatar) userObj.avatar = avatar;
    if (preferences) {
      userObj.preferences = {
        ...userObj.preferences,
        ...preferences,
      };
    }

    const updatedUser = await cosmosDb.save('users', userObj);

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      memberTier: updatedUser.memberTier,
      memberSince: updatedUser.memberSince,
      points: updatedUser.points,
      phone: updatedUser.phone,
      preferences: updatedUser.preferences,
      department: updatedUser.department,
      employeeId: updatedUser.employeeId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get guest wishlist
// @route   GET /api/users/:guestId/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    const { guestId } = req.params;

    if (req.user.role === 'guest' && req.user.id !== guestId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const userObj = await cosmosDb.findById('users', guestId);
    if (!userObj) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(userObj.wishlist || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle hotel ID in guest wishlist
// @route   POST /api/users/:guestId/wishlist/toggle
// @access  Private
export const toggleWishlist = async (req, res) => {
  try {
    const { guestId } = req.params;
    const { hotelId } = req.body;

    if (!hotelId) {
      return res.status(400).json({ message: 'Hotel ID is required' });
    }

    if (req.user.id !== guestId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const userObj = await cosmosDb.findById('users', guestId);
    if (!userObj) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!userObj.wishlist) {
      userObj.wishlist = [];
    }

    if (userObj.wishlist.includes(hotelId)) {
      userObj.wishlist = userObj.wishlist.filter((id) => id !== hotelId);
    } else {
      userObj.wishlist.push(hotelId);
    }

    await cosmosDb.save('users', userObj);
    res.json(userObj.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
