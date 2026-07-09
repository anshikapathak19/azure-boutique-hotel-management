import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Inject JWT access tokens into request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('azurestay_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (e.g. token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('azurestay_token')
      localStorage.removeItem('azurestay_user')
    }
    return Promise.reject(error)
  },
)

export default api