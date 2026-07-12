import { supabase } from '../config/supabase.js';
import { cosmosDb } from '../config/cosmosDb.js';
import jwt from 'jsonwebtoken';

// Protect routes - Verify Supabase Session JWT or local developer simulation token
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('DEBUG AUTH: Received Authorization Token:', token.substring(0, 15) + '...');

      let userId;
      let email;
      let name;

      // 1. Try to verify token via Supabase client first
      try {
        const { data: supabaseData, error: supabaseError } = await supabase.auth.getUser(token);
        if (!supabaseError && supabaseData && supabaseData.user) {
          const supabaseUser = supabaseData.user;
          userId = supabaseUser.id;
          email = supabaseUser.email;
          name = supabaseUser.user_metadata?.name || email.split('@')[0];
          console.log('DEBUG AUTH: Supabase verification success for user:', email);
        } else {
          console.log('DEBUG AUTH: Supabase verification failed, trying local JWT verification...');
          if (supabaseError) {
            console.log('DEBUG AUTH: Supabase error:', supabaseError.message);
          }
        }
      } catch (subErr) {
        console.log('DEBUG AUTH: Supabase client check threw error:', subErr.message);
      }

      // 2. Fallback: Verify token locally if signed with local JWT_SECRET
      if (!userId) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'azurestay_jwt_secret_token_key_2026');
          userId = decoded.id;
          console.log('DEBUG AUTH: Local JWT verification success. Decoded ID:', userId);
          
          // Fetch user details from Cosmos DB to get email and name
          const customUser = await cosmosDb.findById('users', userId);
          if (customUser) {
            email = customUser.email;
            name = customUser.name;
          } else {
            email = 'simulation-guest@azurestay.com';
            name = 'Simulation Guest';
          }
        } catch (jwtErr) {
          console.error('DEBUG AUTH: Local JWT Decode Failed:', jwtErr.message);
          return res.status(401).json({ message: 'Not authorized, session expired or invalid.' });
        }
      }

      if (!userId) {
        console.log('DEBUG AUTH: Rejected request because userId was not set.');
        return res.status(401).json({ message: 'Not authorized, invalid session credentials.' });
      }

      // 3. Check if custom profile details exist in Cosmos DB users container
      let customUser = await cosmosDb.findById('users', userId);
      
      if (!customUser) {
        console.log('DEBUG AUTH: Cosmos profile not found. Creating profile for:', userId);
        customUser = await cosmosDb.create('users', {
          id: userId,
          name: name,
          email: email,
          role: email.endsWith('@azurestay.com') ? (email.startsWith('admin') ? 'admin' : 'staff') : 'guest',
          avatar: 'https://i.pravatar.cc/150?img=9',
          points: 0,
          memberTier: 'Club Member',
          preferences: { pillowType: 'Standard', roomLocation: 'Standard', dietary: 'None' },
          wishlist: []
        });
      }

      // Set user object on request
      req.user = {
        ...customUser,
        id: customUser.id,
        _id: customUser.id,
      };

      console.log('DEBUG AUTH: Auth check passed. req.user ID:', req.user.id);
      next();
    } catch (err) {
      console.error('DEBUG AUTH: Middleware exception:', err.message);
      return res.status(401).json({ message: 'Not authorized, token validation failed' });
    }
  }

  if (!token) {
    console.log('DEBUG AUTH: Rejected request because authorization header was missing.');
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Authorize roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${req.user?.role}' is not authorized to access this resource`,
      });
    }
    next();
  };
};
