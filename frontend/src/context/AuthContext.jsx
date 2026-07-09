import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // Placeholder only — real authentication (Azure AD B2C / custom backend)
  // replaces these stubs in a later milestone.
  const login = (credentials) => {
    console.warn('AuthContext.login: not implemented yet', credentials)
  }

  const logout = () => {
    console.warn('AuthContext.logout: not implemented yet')
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}