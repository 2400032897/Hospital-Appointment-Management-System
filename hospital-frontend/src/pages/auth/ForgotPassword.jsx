import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authApi } from '../../api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('PATIENT')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authApi.forgotPassword(email, role)
      setSent(true)
      toast.success('Password reset email sent!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{
          background: 'white', borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)', padding: '2.5rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔒</div>
            <h1 style={{ fontSize: '1.5rem', fontFamily: 'Outfit', fontWeight: 800 }}>Forgot Password</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
              Enter your email to receive a reset link
            </p>
          </div>

          {sent ? (
            <div style={{
              background: 'var(--success-light)', border: '1px solid var(--success)',
              borderRadius: 'var(--radius)', padding: '1.5rem', textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
              <p style={{ color: '#065f46', fontWeight: 600 }}>Reset link sent!</p>
              <p style={{ color: '#065f46', fontSize: '0.875rem', marginTop: 4 }}>
                Check your email inbox and follow the instructions.
              </p>
              <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Account Type</label>
                <select className="form-control" value={role} onChange={e => setRole(e.target.value)}>
                  <option value="PATIENT">Patient</option>
                  <option value="DOCTOR">Doctor</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-control" placeholder="your@email.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? '⏳ Sending...' : '📧 Send Reset Link'}
              </button>
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link to="/login" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
