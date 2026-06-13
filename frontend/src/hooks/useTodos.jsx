// src/hooks/useTodos.jsx
// All todo state and logic in one custom hook.
// TodoPage just calls this — keeping the page component clean and simple.

import { useState, useEffect, useCallback } from 'react'
import { todoAPI } from '../services/api.js'

export function useTodos() {
  const [todos,   setTodos]   = useState([])
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' })

  // Fetch todos from API — re-runs whenever filters change
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const res = await todoAPI.getAll(filters)
      setTodos(res.data.todos)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load todos')
    } finally {
      setLoading(false)
    }
  }, [filters])

  const fetchStats = useCallback(async () => {
    try {
      const res = await todoAPI.getStats()
      setStats(res.data.stats)
    } catch {}
  }, [])

  useEffect(() => {
    fetchTodos()
    fetchStats()
  }, [fetchTodos, fetchStats])

  // ── CRUD actions ─────────────────────────────────────────────────────────

  async function addTodo(data) {
    const res = await todoAPI.create(data)
    setTodos((prev) => [res.data.todo, ...prev])
    fetchStats()
    return res.data.todo
  }

  async function editTodo(id, data) {
    const res = await todoAPI.update(id, data)
    setTodos((prev) => prev.map((t) => (t.id === id ? res.data.todo : t)))
    fetchStats()
    return res.data.todo
  }

  async function toggleTodo(id) {
    const res = await todoAPI.toggle(id)
    setTodos((prev) => prev.map((t) => (t.id === id ? res.data.todo : t)))
    fetchStats()
  }

  async function removeTodo(id) {
    await todoAPI.delete(id)
    setTodos((prev) => prev.filter((t) => t.id !== id))
    fetchStats()
  }

  function updateFilters(newFilters) {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  return {
    todos, stats, loading, error, filters,
    addTodo, editTodo, toggleTodo, removeTodo, updateFilters,
  }
}
