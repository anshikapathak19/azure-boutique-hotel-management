import api from './api.js'

// Pre-configured mock accounts for test logins
export const MOCK_USERS = {
  guest: {
    id: 'usr-guest-01',
    name: 'Eleanor Whitfield',
    email: 'guest@azurestay.com',
    role: 'guest',
    token: 'mock-jwt-token-guest-eleanor-whitfield-001',
    avatar: 'https://i.pravatar.cc/150?img=47',
    memberTier: 'Gold Elite',
    memberSince: '2024',
    points: 12450,
  },
  staff: {
    id: 'usr-staff-01',
    name: 'Marcus Vance',
    email: 'staff@azurestay.com',
    role: 'staff',
    token: 'mock-jwt-token-staff-marcus-vance-002',
    avatar: 'https://i.pravatar.cc/150?img=12',
    department: 'Guest Relations',
    employeeId: 'EMP-9082',
  },
  admin: {
    id: 'usr-admin-01',
    name: 'Sophia Sterling',
    email: 'admin@azurestay.com',
    role: 'admin',
    token: 'mock-jwt-token-admin-sophia-sterling-003',
    avatar: 'https://i.pravatar.cc/150?img=32',
    permissions: ['all'],
    adminSince: '2023',
  },
}

export const AuthService = {
  /**
   * Log in user with email & password.
   * Leverages pre-configured accounts for testing, storing a mock JWT.
   */
  login: async ({ email, password }) => {
    // Actual API endpoint:
    // const response = await api.post('/auth/login', { email, password })
    // return response.data

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const trimmedEmail = email.toLowerCase().trim()
        
        // Find if matches mock roles, otherwise default to a mock custom guest
        let matchedUser = Object.values(MOCK_USERS).find((u) => u.email === trimmedEmail)
        
        if (!matchedUser) {
          if (trimmedEmail.endsWith('@azurestay.com') || password.length >= 6) {
            matchedUser = {
              id: 'usr-custom-' + Date.now(),
              name: email.split('@')[0].toUpperCase(),
              email: trimmedEmail,
              role: 'guest',
              token: 'mock-jwt-token-custom-' + Date.now(),
              avatar: 'https://i.pravatar.cc/150?img=9',
              memberTier: 'Club Member',
              memberSince: '2026',
              points: 0,
            }
          } else {
            reject(new Error('Invalid email or password. Use guest@azurestay.com, staff@azurestay.com, or admin@azurestay.com.'))
            return
          }
        }

        // Cache mock JWT and user info
        localStorage.setItem('azurestay_token', matchedUser.token)
        localStorage.setItem('azurestay_user', JSON.stringify(matchedUser))

        resolve(matchedUser)
      }, 500)
    })
  },

  /**
   * Register a new user profile.
   */
  register: async ({ name, email, password }) => {
    // Actual API endpoint:
    // const response = await api.post('/auth/register', { name, email, password })
    // return response.data

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!name || !email || !password) {
          reject(new Error('All fields are required'))
          return
        }
        
        const newUser = {
          id: 'usr-reg-' + Date.now(),
          name,
          email: email.toLowerCase().trim(),
          role: 'guest',
          token: 'mock-jwt-token-reg-' + Date.now(),
          avatar: 'https://i.pravatar.cc/150?img=17',
          memberTier: 'Club Member',
          memberSince: '2026',
          points: 0,
        }

        // Cache registration details
        localStorage.setItem('azurestay_token', newUser.token)
        localStorage.setItem('azurestay_user', JSON.stringify(newUser))

        resolve(newUser)
      }, 600)
    })
  },

  /**
   * Forgot password request.
   */
  forgotPassword: async (email) => {
    // const response = await api.post('/auth/forgot-password', { email })
    // return response.data

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: `A password reset link has been dispatched to ${email}` })
      }, 400)
    })
  },

  /**
   * Reset Password request.
   */
  resetPassword: async ({ token, password }) => {
    // const response = await api.post('/auth/reset-password', { token, password })
    // return response.data

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Your credentials have been successfully updated.' })
      }, 400)
    })
  },

  /**
   * Verify email via token code.
   */
  verifyEmail: async (code) => {
    // const response = await api.post('/auth/verify-email', { code })
    // return response.data

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (code === '123456' || code.length === 6) {
          resolve({ message: 'Email address verified successfully.' })
        } else {
          reject(new Error('Invalid verification code. Please try again.'))
        }
      }, 450)
    })
  },

  /**
   * Log out active session. Clears tokens.
   */
  logout: async () => {
    return new Promise((resolve) => {
      localStorage.removeItem('azurestay_token')
      localStorage.removeItem('azurestay_user')
      resolve(true)
    })
  },

  /**
   * Retrieve cached current user.
   */
  getCurrentUser: () => {
    const cachedUser = localStorage.getItem('azurestay_user')
    const token = localStorage.getItem('azurestay_token')
    if (cachedUser && token) {
      try {
        return JSON.parse(cachedUser)
      } catch (e) {
        return null
      }
    }
    return null
  },
}
