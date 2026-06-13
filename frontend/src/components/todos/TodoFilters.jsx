// src/components/todos/TodoFilters.jsx
// Search box + status + priority dropdowns.
// Calls onFilter() which updates the filters state in useTodos hook.

import React from 'react'

export default function TodoFilters({ filters, onFilter }) {
  return (
    <div className="row g-2 mb-4">

      {/* Search */}
      <div className="col-12 col-md-5">
        <div className="input-group">
          <span className="input-group-text bg-white">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search todos…"
            value={filters.search}
            onChange={(e) => onFilter({ search: e.target.value })}
          />
          {filters.search && (
            <button className="btn btn-outline-secondary" onClick={() => onFilter({ search: '' })}>
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="col-6 col-md-3">
        <select
          className="form-select"
          value={filters.status}
          onChange={(e) => onFilter({ status: e.target.value })}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Priority */}
      <div className="col-6 col-md-3">
        <select
          className="form-select"
          value={filters.priority}
          onChange={(e) => onFilter({ priority: e.target.value })}
        >
          <option value="">All priorities</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
      </div>

      {/* Clear filters */}
      <div className="col-12 col-md-1 d-grid">
        <button
          className="btn btn-outline-secondary"
          title="Clear all filters"
          onClick={() => onFilter({ status: '', priority: '', search: '' })}
        >
          <i className="bi bi-funnel"></i>
        </button>
      </div>

    </div>
  )
}
