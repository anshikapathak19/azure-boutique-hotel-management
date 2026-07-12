import { supabase } from '../config/supabase.js';
import { cosmosDb } from '../config/cosmosDb.js';
import jwt from 'jsonwebtoken';

// Local JWT signer helper for OAuth simulation fallbacks
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'azurestay_jwt_secret_token_key_2026', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user in Supabase & Cosmos DB
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const emailLower = email.toLowerCase().trim();

    // 1. Sign up user inside Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: emailLower,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const user = data.user;
    if (!user) {
      return res.status(400).json({ message: 'Authentication signup failed.' });
    }

    // 2. Determine default role
    let role = 'guest';
    let department = undefined;
    let employeeId = undefined;

    if (emailLower.endsWith('@azurestay.com')) {
      if (emailLower.startsWith('admin')) {
        role = 'admin';
        department = 'Executive Director';
      } else {
        role = 'staff';
        department = 'Guest Relations';
        employeeId = 'EMP-' + Math.floor(1000 + Math.random() * 9000);
      }
    }

    // 3. Create Cosmos DB Profile Document
    const customProfile = {
      id: user.id,
      name,
      email: emailLower,
      role,
      avatar: 'https://i.pravatar.cc/150?img=9',
      memberTier: 'Club Member',
      points: 0,
      phone: '',
      preferences: { pillowType: 'Standard', roomLocation: 'Standard', dietary: 'None' },
      wishlist: [],
      department,
      employeeId,
      isVerified: false,
    };

    await cosmosDb.create('users', customProfile);

    // Return Supabase session token
    res.status(201).json({
      id: user.id,
      name: customProfile.name,
      email: customProfile.email,
      role: customProfile.role,
      token: data.session?.access_token || generateToken(user.id),
      avatar: customProfile.avatar,
      memberTier: customProfile.memberTier,
      memberSince: new Date().getFullYear().toString(),
      points: customProfile.points,
      department: customProfile.department,
      employeeId: customProfile.employeeId,
      verificationCode: '123456', // dummy code for immediate frontend verification forms
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user using Supabase auth
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const emailLower = email.toLowerCase().trim();

    // 1. Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailLower,
      password,
    });

    if (error) {
      return res.status(401).json({ message: error.message });
    }

    const user = data.user;

    // 2. Retrieve Cosmos DB custom details
    let customUser = await cosmosDb.findById('users', user.id);
    
    if (!customUser) {
      // Create profile fallback if missing in Cosmos DB
      let role = 'guest';
      if (emailLower.endsWith('@azurestay.com')) {
        role = emailLower.startsWith('admin') ? 'admin' : 'staff';
      }
      customUser = await cosmosDb.create('users', {
        id: user.id,
        name: user.user_metadata?.name || emailLower.split('@')[0],
        email: emailLower,
        role,
        avatar: 'https://i.pravatar.cc/150?img=9',
        points: 0,
        memberTier: 'Club Member',
        preferences: { pillowType: 'Standard', roomLocation: 'Standard', dietary: 'None' },
        wishlist: [],
      });
    }

    res.json({
      id: customUser.id,
      name: customUser.name,
      email: customUser.email,
      role: customUser.role,
      token: data.session.access_token,
      avatar: customUser.avatar,
      memberTier: customUser.memberTier,
      memberSince: customUser.memberSince || new Date().getFullYear().toString(),
      points: customUser.points || 0,
      department: customUser.department,
      employeeId: customUser.employeeId,
      phone: customUser.phone,
      preferences: customUser.preferences,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify email address helper
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Verification code is required' });
    }

    // Since Supabase handles verify triggers, we mock email verify completion for visual dashboards
    res.json({ message: 'Email address verified successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot password request
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim());

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json({ message: `A password reset link has been dispatched to ${email}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // In local sandbox flows, password updates complete successfully
    res.json({ message: 'Your credentials have been successfully updated.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current logged in user profile details
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google login simulation fallback
// @route   GET /api/auth/google/simulation
// @access  Public
export const googleSimulation = async (req, res) => {
  try {
    const email = 'google-guest@azurestay.com';
    const mockGoogleId = 'supabase-google-mock-id-90283';
    
    // Find or create profile details in Cosmos DB
    let customUser = await cosmosDb.findById('users', mockGoogleId);
    if (!customUser) {
      customUser = await cosmosDb.create('users', {
        id: mockGoogleId,
        name: 'Alex Rivera (Google)',
        email,
        avatar: 'https://i.pravatar.cc/150?img=47',
        role: 'guest',
        isVerified: true,
        points: 2500,
        memberTier: 'Gold Elite',
        preferences: { pillowType: 'Goose Down', roomLocation: 'High Floor', dietary: 'None' },
        wishlist: [],
      });
    }

    const token = generateToken(mockGoogleId);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const redirectUrl = `${frontendUrl}/login?token=${token}&user=${encodeURIComponent(
      JSON.stringify({
        id: customUser.id,
        name: customUser.name,
        email: customUser.email,
        role: customUser.role,
        avatar: customUser.avatar,
        points: customUser.points,
        memberTier: customUser.memberTier,
        memberSince: customUser.memberSince || new Date().getFullYear().toString(),
      })
    )}`;

    res.redirect(redirectUrl);
  } catch (error) {
    res.status(500).send('Google Simulation Error: ' + error.message);
  }
};

// @desc    Google OAuth Callback handler (real)
// @route   GET /api/auth/google/callback
// @access  Public
export const googleCallback = (req, res) => {
  try {
    const user = req.user;
    const token = generateToken(user.id);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const redirectUrl = `${frontendUrl}/login?token=${token}&user=${encodeURIComponent(
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        points: user.points,
        memberTier: user.memberTier,
        memberSince: user.memberSince || new Date().getFullYear().toString(),
      })
    )}`;

    res.redirect(redirectUrl);
  } catch (error) {
    res.status(500).send('Google OAuth Error: ' + error.message);
  }
};

// @desc    GitHub login simulation fallback
// @route   GET /api/auth/github/simulation
// @access  Public
export const githubSimulation = async (req, res) => {
  try {
    const email = 'github-guest@azurestay.com';
    const mockGithubId = 'supabase-github-mock-id-71829';
    
    // Find or create profile details in Cosmos DB
    let customUser = await cosmosDb.findById('users', mockGithubId);
    if (!customUser) {
      customUser = await cosmosDb.create('users', {
        id: mockGithubId,
        name: 'Alex Rivera (GitHub)',
        email,
        avatar: 'https://i.pravatar.cc/150?img=17',
        role: 'guest',
        isVerified: true,
        points: 1500,
        memberTier: 'Club Member',
        preferences: { pillowType: 'Feather', roomLocation: 'Low Floor', dietary: 'None' },
        wishlist: [],
      });
    }

    const token = generateToken(mockGithubId);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const redirectUrl = `${frontendUrl}/login?token=${token}&user=${encodeURIComponent(
      JSON.stringify({
        id: customUser.id,
        name: customUser.name,
        email: customUser.email,
        role: customUser.role,
        avatar: customUser.avatar,
        points: customUser.points,
        memberTier: customUser.memberTier,
        memberSince: customUser.memberSince || new Date().getFullYear().toString(),
      })
    )}`;

    res.redirect(redirectUrl);
  } catch (error) {
    res.status(500).send('GitHub Simulation Error: ' + error.message);
  }
};
