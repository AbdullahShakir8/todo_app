// src/services/api.js
// All API calls live here. Components never use axios directly.
// Two interceptors handle token injection and 401 redirects automatically.

import axios from 'axios'

const api = axios.create({
  baseURL: '/api',  // proxied to http://localhost:5000/api by vite.config.js
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor ──────────────────────────────────────────────────────
// Runs before every request — attaches JWT from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor ─────────────────────────────────────────────────────
// Runs after every response — redirects to /login on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ── Auth endpoints ───────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getMe:    ()     => api.get('/auth/me'),
}

// ── Todo endpoints ───────────────────────────────────────────────────────────
export const todoAPI = {
  getAll:  (params)    => api.get('/todos', { params }),
  getStats: ()         => api.get('/todos/stats'),
  getOne:  (id)        => api.get(`/todos/${id}`),
  create:  (data)      => api.post('/todos', data),
  update:  (id, data)  => api.put(`/todos/${id}`, data),
  toggle:  (id)        => api.patch(`/todos/${id}/toggle`),
  delete:  (id)        => api.delete(`/todos/${id}`),
}

export default api
