import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Placeholder for future auth token injection (Azure AD B2C / custom backend)
api.interceptors.request.use((config) => {
  // const token = getStoredToken()
  // if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling hook — extend once real endpoints exist.
    return Promise.reject(error)
  },
)

export default api