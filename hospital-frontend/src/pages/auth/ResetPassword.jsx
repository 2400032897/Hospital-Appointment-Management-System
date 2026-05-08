import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authApi } from '../../api'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const role = searchParams.get('role') || 'PATIENT'
  const [form, setForm] = useState({ newPassword: '', confirm: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirm) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await authApi.resetPassword(token, form.newPassword, role)
      toast.success('Password reset successfully! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Token may have expired.')
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
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔑</div>
            <h1 style={{ fontSize: '1.5rem', fontFamily: 'Outfit', fontWeight: 800 }}>Reset Password</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
              Enter your new password below
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className="form-control" placeholder="Min 6 characters"
                value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })}
                required minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-control" placeholder="Repeat new password"
                value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })}
                required />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading || !token}>
              {loading ? '⏳ Resetting...' : '🔒 Reset Password'}
            </button>
            {!token && (
              <p style={{ color: 'var(--danger)', fontSize: '0.85rem', textAlign: 'center', marginTop: '0.75rem' }}>
                Invalid reset link. Please request a new one.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
