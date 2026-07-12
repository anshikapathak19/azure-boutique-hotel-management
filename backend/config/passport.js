import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

const configurePassport = () => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientID || !clientSecret || clientID.startsWith('mock') || clientSecret.startsWith('mock')) {
    console.warn('WARNING: Google OAuth keys are missing or set to mock. A simulation endpoint will be used for Google Auth testing.');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: '/api/auth/google/callback',
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email found in Google profile'), null);
          }

          // Search user by googleId or email
          let user = await User.findOne({
            $or: [{ googleId: profile.id }, { email: email.toLowerCase() }],
          });

          if (user) {
            // Update googleId if missing (merged account)
            if (!user.googleId) {
              user.googleId = profile.id;
              await user.save();
            }
            return done(null, user);
          }

          // Create new user if not found
          user = await User.create({
            name: profile.displayName || profile.name?.givenName || 'Google User',
            email: email.toLowerCase(),
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value || 'https://i.pravatar.cc/150?img=9',
            role: 'guest',
            isVerified: true,
          });

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
};

export default configurePassport;
