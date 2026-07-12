import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { AuthService } from '../services/AuthService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state from local storage on mount
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const loggedUser = await AuthService.login(credentials)
      setUser(loggedUser)
      return loggedUser
    } catch (e) {
      throw e
    }
  }

  const logout = async () => {
    await AuthService.logout()
    setUser(null)
  }

  const updateUser = (updated) => {
    setUser(updated)
    localStorage.setItem('azurestay_user', JSON.stringify(updated))
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      updateUser,
    }),
    [user, loading],
  )

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}