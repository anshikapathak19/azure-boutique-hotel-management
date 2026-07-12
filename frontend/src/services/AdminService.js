import api from './api.js'

export const AdminService = {
  /**
   * Fetch core analytics dashboard metrics (occupancy, revenue, stats).
   */
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics')
    return response.data;
  },

  /**
   * Get all registered users list.
   */
  getUsers: async () => {
    const response = await api.get('/admin/users')
    return response.data;
  },

  /**
   * Fetch system settings.
   */
  getSettings: async () => {
    const response = await api.get('/admin/settings')
    return response.data;
  },

  /**
   * Save system settings.
   */
  updateSettings: async (settings) => {
    const response = await api.put('/admin/settings', settings)
    return response.data;
  },
}
