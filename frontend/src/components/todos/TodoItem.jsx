// src/components/todos/TodoItem.jsx
// Renders one todo. Has its own local state for edit mode and loading states.

import React, { useState } from 'react'
import TodoForm from './TodoForm.jsx'

const PRIORITY_COLOR = { high: 'danger', medium: 'warning', low: 'success' }

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [editing,  setEditing]  = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleEdit(data) {
    setSaving(true)
    try {
      await onEdit(todo.id, data)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this todo?')) return
    setDeleting(true)
    try {
      await onDelete(todo.id)
    } finally {
      setDeleting(false)
    }
  }

  const color    = PRIORITY_COLOR[todo.priority] || 'secondary'
  const isOverdue = todo.due_date && !todo.completed
    && new Date(todo.due_date) < new Date()

  return (
    <div className={`card mb-3 border-0 shadow-sm ${todo.completed ? 'opacity-75' : ''}`}>
      <div className="card-body">

        {editing ? (
          // ── Edit mode ──────────────────────────────────────────────────────
          <TodoForm
            todo={todo}
            onSubmit={handleEdit}
            onCancel={() => setEditing(false)}
            loading={saving}
          />
        ) : (
          // ── View mode ──────────────────────────────────────────────────────
          <div className="d-flex align-items-start gap-3">

            {/* Checkbox */}
            <input
              type="checkbox"
              className="form-check-input mt-1"
              style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
              title={todo.completed ? 'Mark active' : 'Mark complete'}
            />

            {/* Content */}
            <div className="flex-grow-1">
              <div className="d-flex align-items-center flex-wrap gap-2">
                <span className={`fw-semibold ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                  {todo.title}
                </span>
                <span className={`badge text-bg-${color}`}>{todo.priority}</span>
                {isOverdue && (
                  <span className="badge text-bg-danger">
                    <i className="bi bi-alarm me-1"></i>Overdue
                  </span>
                )}
              </div>

              {todo.description && (
                <p className="text-muted small mt-1 mb-1">{todo.description}</p>
              )}

              <div className="d-flex gap-3 mt-1">
                {todo.due_date && (
                  <span className={`small ${isOverdue ? 'text-danger' : 'text-muted'}`}>
                    <i className="bi bi-calendar3 me-1"></i>
                    {new Date(todo.due_date).toLocaleDateString()}
                  </span>
                )}
                <span className="small text-muted">
                  <i className="bi bi-clock me-1"></i>
                  {new Date(todo.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="d-flex gap-1 flex-shrink-0">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => setEditing(true)}
                title="Edit"
              >
                <i className="bi bi-pencil"></i>
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={handleDelete}
                disabled={deleting}
                title="Delete"
              >
                {deleting
                  ? <span className="spinner-border spinner-border-sm" />
                  : <i className="bi bi-trash3"></i>
                }
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
