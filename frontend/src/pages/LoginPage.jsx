// src/pages/LoginPage.jsx

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import Alert from '../components/ui/Alert.jsx'

export default function LoginPage() {
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate  = useNavigate()

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authAPI.login(form)
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-8 col-md-5 col-lg-4">

            {/* Header */}
            <div className="text-center mb-4">
              <i className="bi bi-check2-square text-primary display-4"></i>
              <h1 className="h3 fw-bold mt-2">Welcome back</h1>
              <p className="text-muted">Sign in to your TodoApp</p>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <Alert message={error} onClose={() => setError('')} />

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                      <input
                        type="email" name="email" className="form-control"
                        placeholder="you@example.com"
                        value={form.email} onChange={handleChange}
                        required autoFocus
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-lock"></i></span>
                      <input
                        type="password" name="password" className="form-control"
                        placeholder="Your password"
                        value={form.password} onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                    {loading
                      ? <><span className="spinner-border spinner-border-sm me-2" />Signing in…</>
                      : <><i className="bi bi-box-arrow-in-right me-2"></i>Sign in</>
                    }
                  </button>
                </form>
              </div>
            </div>

            <p className="text-center text-muted mt-3 small">
              No account?{' '}
              <Link to="/register" className="fw-semibold text-primary text-decoration-none">
                Create one free
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}
