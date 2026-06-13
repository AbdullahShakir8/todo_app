// src/components/todos/TodoList.jsx
// Renders all TodoItems, or shows loading/empty/error states.

import React from 'react'
import TodoItem from './TodoItem.jsx'

export default function TodoList({ todos, loading, error, onToggle, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-3" role="status" />
        <p className="text-muted">Loading your todos…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <i className="bi bi-exclamation-triangle me-2"></i>{error}
      </div>
    )
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="bi bi-inbox display-4 d-block mb-3"></i>
        <p className="mb-0">No todos found. Add one above!</p>
      </div>
    )
  }

  return (
    <div>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
