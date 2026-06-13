// src/components/ui/Alert.jsx
// Reusable alert box. Used on login, register, and todo forms.

import React from 'react'

export default function Alert({ type = 'danger', message, onClose }) {
  if (!message) return null

  const icons = {
    danger:  'bi-exclamation-triangle-fill',
    success: 'bi-check-circle-fill',
    info:    'bi-info-circle-fill',
    warning: 'bi-exclamation-circle-fill',
  }

  return (
    <div
      className={`alert alert-${type} alert-dismissible d-flex align-items-center gap-2`}
      role="alert"
    >
      <i className={`bi ${icons[type]}`}></i>
      <span>{message}</span>
      {onClose && (
        <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
      )}
    </div>
  )
}
