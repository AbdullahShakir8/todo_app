// src/context/AuthContext.jsx
// Provides auth state (user, login, logout) to every component in the app.
// Any component can call useAuth() instead of prop drilling.

import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  // On first load — check if a token already exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authAPI.getMe()
        .then((res) => setUser(res.data.user))
        .catch(()   => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  // Save token + user after login or register
  function login(token, userData) {
    localStorage.setItem('token', token)
    setUser(userData)
  }

  // Clear everything on logout
  function logout() {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — cleaner than calling useContext(AuthContext) directly
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
