import React from 'react'

export default function Loader({ fullPage = false }) {
  if (fullPage) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="loader-container">
      <div className="spinner"></div>
    </div>
  )
}
