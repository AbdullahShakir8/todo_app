// src/components/todos/StatsBar.jsx
// Four stat cards at the top of the dashboard.

import React from 'react'

function StatCard({ label, value, icon, color }) {
  return (
    <div className="col-6 col-md-3">
      <div className={`card border-0 bg-${color} bg-opacity-10 h-100`}>
        <div className="card-body text-center py-3">
          <i className={`bi ${icon} fs-3 text-${color}`}></i>
          <div className={`fs-2 fw-bold text-${color} mt-1`}>{value ?? '—'}</div>
          <div className="text-muted small">{label}</div>
        </div>
      </div>
    </div>
  )
}

export default function StatsBar({ stats }) {
  if (!stats) return null

  return (
    <div className="row g-3 mb-4">
      <StatCard label="Total"         value={stats.total}         icon="bi-list-ul"            color="primary" />
      <StatCard label="Active"        value={stats.active}        icon="bi-clock"              color="warning" />
      <StatCard label="Completed"     value={stats.completed}     icon="bi-check-circle"       color="success" />
      <StatCard label="High Priority" value={stats.high_priority} icon="bi-exclamation-circle" color="danger"  />
    </div>
  )
}
