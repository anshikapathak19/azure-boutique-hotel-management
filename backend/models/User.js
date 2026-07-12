import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    minlength: 6,
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ['guest', 'staff', 'admin'],
    default: 'guest',
  },
  avatar: {
    type: String,
    default: 'https://i.pravatar.cc/150?img=9',
  },
  googleId: {
    type: String,
    sparse: true, // Allow multiple nulls for local logins
    unique: true,
  },
  memberTier: {
    type: String,
    default: 'Club Member',
  },
  memberSince: {
    type: String,
    default: () => new Date().getFullYear().toString(),
  },
  points: {
    type: Number,
    default: 0,
  },
  department: {
    type: String,
  },
  employeeId: {
    type: String,
  },
  phone: {
    type: String,
    default: '',
  },
  preferences: {
    pillowType: { type: String, default: 'Standard' },
    roomLocation: { type: String, default: 'Standard' },
    dietary: { type: String, default: 'None' },
  },
  wishlist: [
    {
      type: String, // Storing hotelId as String (like 'santorini-cliffside')
    },
  ],
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

// Encrypt password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;
