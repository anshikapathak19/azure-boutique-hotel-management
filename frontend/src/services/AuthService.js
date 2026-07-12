import api from './api.js'

export const AuthService = {
  /**
   * Log in user with email & password.
   */
  login: async ({ email, password }) => {
    const response = await api.post('/auth/login', { email, password })
    const user = response.data

    // Cache JWT token and user info
    localStorage.setItem('azurestay_token', user.token)
    localStorage.setItem('azurestay_user', JSON.stringify(user))

    return user;
  },

  /**
   * Register a new user profile.
   */
  register: async ({ name, email, password }) => {
    const response = await api.post('/auth/register', { name, email, password })
    const user = response.data

    // Cache JWT token and user info
    localStorage.setItem('azurestay_token', user.token)
    localStorage.setItem('azurestay_user', JSON.stringify(user))

    return user;
  },

  /**
   * Forgot password request.
   */
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data;
  },

  /**
   * Reset Password request.
   */
  resetPassword: async ({ token, password }) => {
    const response = await api.post('/auth/reset-password', { token, password })
    return response.data;
  },

  /**
   * Verify email via token code.
   */
  verifyEmail: async (code) => {
    const response = await api.post('/auth/verify-email', { code })
    return response.data;
  },

  /**
   * Log out active session. Clears tokens.
   */
  logout: async () => {
    localStorage.removeItem('azurestay_token')
    localStorage.removeItem('azurestay_user')
    return true;
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
