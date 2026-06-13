// src/components/todos/TodoForm.jsx
// Used for BOTH creating and editing a todo.
// When the `todo` prop is passed → edit mode (pre-fills the form).
// When no `todo` prop → create mode (empty form).

import React, { useState, useEffect } from 'react'
import Alert from '../ui/Alert.jsx'

const EMPTY_FORM = { title: '', description: '', priority: 'medium', due_date: '' }

export default function TodoForm({ todo, onSubmit, onCancel, loading }) {
  const [form,  setForm]  = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  // Pre-fill when editing
  useEffect(() => {
    if (todo) {
      setForm({
        title:       todo.title       || '',
        description: todo.description || '',
        priority:    todo.priority    || 'medium',
        due_date:    todo.due_date    ? todo.due_date.split('T')[0] : '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [todo])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) {
      setError('Title is required')
      return
    }
    try {
      await onSubmit(form)
      if (!todo) setForm(EMPTY_FORM) // clear only in create mode
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Alert message={error} onClose={() => setError('')} />

      {/* Title */}
      <div className="mb-3">
        <label className="form-label fw-semibold">
          Title <span className="text-danger">*</span>
        </label>
        <input
          name="title"
          className="form-control"
          placeholder="What needs to be done?"
          value={form.title}
          onChange={handleChange}
          maxLength={255}
          autoFocus
        />
      </div>

      {/* Description */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Description</label>
        <textarea
          name="description"
          className="form-control"
          placeholder="Optional notes…"
          rows={2}
          value={form.description}
          onChange={handleChange}
        />
      </div>

      {/* Priority + Due date */}
      <div className="row g-3 mb-4">
        <div className="col-6">
          <label className="form-label fw-semibold">Priority</label>
          <select name="priority" className="form-select" value={form.priority} onChange={handleChange}>
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>
        <div className="col-6">
          <label className="form-label fw-semibold">Due date</label>
          <input
            type="date"
            name="due_date"
            className="form-control"
            value={form.due_date}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="d-flex gap-2 justify-content-end">
        {onCancel && (
          <button type="button" className="btn btn-light" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <><span className="spinner-border spinner-border-sm me-2" />Saving…</>
          ) : (
            <><i className={`bi ${todo ? 'bi-pencil' : 'bi-plus-lg'} me-1`}></i>
              {todo ? 'Save changes' : 'Add todo'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
