import api from './api.js'

const SEED_USERS = [
  { id: 'usr-guest-01', name: 'Eleanor Whitfield', email: 'guest@azurestay.com', role: 'guest', tier: 'Gold Elite', joined: '2024-03-12' },
  { id: 'usr-guest-02', name: 'Haruto Sato', email: 'haruto@example.com', role: 'guest', tier: 'Club Member', joined: '2025-01-20' },
  { id: 'usr-guest-03', name: 'Sofia Marchetti', email: 'sofia@example.com', role: 'guest', tier: 'Platinum Elite', joined: '2024-08-05' },
  { id: 'usr-staff-01', name: 'Marcus Vance', email: 'staff@azurestay.com', role: 'staff', department: 'Guest Relations', joined: '2024-02-10' },
  { id: 'usr-staff-02', name: 'Leah Ross', email: 'leah@azurestay.com', role: 'staff', department: 'Housekeeping', joined: '2025-06-01' },
  { id: 'usr-admin-01', name: 'Sophia Sterling', email: 'admin@azurestay.com', role: 'admin', department: 'Executive Director', joined: '2023-01-15' },
]

const SEED_SETTINGS = {
  globalBookingFee: 15,
  taxRatePercent: 12,
  allowInstantBookings: true,
  enableEmailAlerts: true,
  maintenanceMode: false,
}

function getStoredUsers() {
  const data = localStorage.getItem('azurestay_admin_users')
  if (!data) {
    localStorage.setItem('azurestay_admin_users', JSON.stringify(SEED_USERS))
    return SEED_USERS
  }
  try {
    return JSON.parse(data)
  } catch (e) {
    return SEED_USERS
  }
}

function getStoredSettings() {
  const data = localStorage.getItem('azurestay_admin_settings')
  if (!data) {
    localStorage.setItem('azurestay_admin_settings', JSON.stringify(SEED_SETTINGS))
    return SEED_SETTINGS
  }
  try {
    return JSON.parse(data)
  } catch (e) {
    return SEED_SETTINGS
  }
}

export const AdminService = {
  /**
   * Fetch core analytics dashboard metrics (occupancy, revenue, stats).
   */
  getAnalytics: async () => {
    // API request:
    // const response = await api.get('/admin/analytics')
    // return response.data

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          stats: {
            totalRevenue: 34820,
            revenueChange: '+14%',
            occupancyRate: 82.4,
            occupancyChange: '+3.2%',
            activeBookings: 24,
            bookingsChange: '+8%',
            avgReviewScore: 4.8,
            reviewsCount: 145,
          },
          revenueChart: [
            { month: 'Jan', amount: 15000 },
            { month: 'Feb', amount: 18500 },
            { month: 'Mar', amount: 22000 },
            { month: 'Apr', amount: 20400 },
            { month: 'May', amount: 28000 },
            { month: 'Jun', amount: 34820 },
          ],
          occupancyChart: [
            { month: 'Jan', rate: 65 },
            { month: 'Feb', rate: 70 },
            { month: 'Mar', rate: 75 },
            { month: 'Apr', rate: 72 },
            { month: 'May', rate: 80 },
            { month: 'Jun', rate: 82.4 },
          ],
        })
      }, 300)
    })
  },

  /**
   * Get all registered users list.
   */
  getUsers: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredUsers())
      }, 200)
    })
  },

  /**
   * Fetch system settings.
   */
  getSettings: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredSettings())
      }, 200)
    })
  },

  /**
   * Save system settings.
   */
  updateSettings: async (settings) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const current = getStoredSettings()
        const updated = { ...current, ...settings }
        localStorage.setItem('azurestay_admin_settings', JSON.stringify(updated))
        resolve(updated)
      }, 350)
    })
  },
}
