// src/App.jsx
// Root component — sets up routing and wraps everything in AuthProvider

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { AuthProvider }   from './context/AuthContext.jsx'
import Navbar             from './components/layout/Navbar.jsx'
import ProtectedRoute     from './components/layout/ProtectedRoute.jsx'
import TodoPage           from './pages/TodoPage.jsx'
import LoginPage          from './pages/LoginPage.jsx'
import RegisterPage       from './pages/RegisterPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main>
          <Routes>
            {/* Protected — must be logged in */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TodoPage />
                </ProtectedRoute>
              }
            />

            {/* Public */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  )
}
