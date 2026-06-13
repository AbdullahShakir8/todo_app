// src/pages/TodoPage.jsx
// Main dashboard page. Thin by design — all logic lives in useTodos().

import React, { useState } from 'react'
import { useAuth }      from '../context/AuthContext.jsx'
import { useTodos }     from '../hooks/useTodos.jsx'
import StatsBar         from '../components/todos/StatsBar.jsx'
import TodoFilters      from '../components/todos/TodoFilters.jsx'
import TodoForm         from '../components/todos/TodoForm.jsx'
import TodoList         from '../components/todos/TodoList.jsx'

export default function TodoPage() {
  const { user }                = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [saving,   setSaving]   = useState(false)

  const {
    todos, stats, loading, error, filters,
    addTodo, editTodo, toggleTodo, removeTodo, updateFilters,
  } = useTodos()

  async function handleAdd(data) {
    setSaving(true)
    try {
      await addTodo(data)
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container py-4">

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-0">My Todos</h2>
          <p className="text-muted small mb-0">Welcome back, {user?.name}!</p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => setShowForm((v) => !v)}
        >
          <i className={`bi ${showForm ? 'bi-dash-lg' : 'bi-plus-lg'}`}></i>
          {showForm ? 'Close' : 'Add todo'}
        </button>
      </div>

      {/* Stats */}
      <StatsBar stats={stats} />

      {/* Add todo form (toggle) */}
      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <h5 className="fw-semibold mb-3">
              <i className="bi bi-plus-circle text-primary me-2"></i>New todo
            </h5>
            <TodoForm
              onSubmit={handleAdd}
              onCancel={() => setShowForm(false)}
              loading={saving}
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <TodoFilters filters={filters} onFilter={updateFilters} />

      {/* List */}
      <TodoList
        todos={todos}
        loading={loading}
        error={error}
        onToggle={toggleTodo}
        onEdit={editTodo}
        onDelete={removeTodo}
      />

    </div>
  )
}
