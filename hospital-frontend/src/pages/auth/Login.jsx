import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authApi } from '../../api'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', role: 'PATIENT' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authApi.login(form)
      const { token, role, userId, name, email } = res.data.data
      login({ id: userId, name, email, role }, token)
      toast.success(`Welcome back, ${name}!`)
      if (role === 'PATIENT') navigate('/patient/dashboard')
      else if (role === 'DOCTOR') navigate('/doctor/dashboard')
      else navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Card */}
        <div style={{
          background: 'white', borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)', overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
            padding: '2.5rem 2rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: 72, height: 72,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.2rem', margin: '0 auto 1rem'
            }}>🏥</div>
            <h1 style={{ color: 'white', fontSize: '1.75rem', fontFamily: 'Outfit', fontWeight: 800, marginBottom: 4 }}>
              MediCare
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>
              Hospital Appointment System
            </p>
          </div>

          {/* Form */}
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', textAlign: 'center' }}>
              Sign In to Your Account
            </h2>

            {/* Role selector */}
            <div style={{
              display: 'flex', gap: 8, marginBottom: '1.5rem',
              background: 'var(--gray-100)', borderRadius: 'var(--radius)', padding: 4
            }}>
              {['PATIENT', 'DOCTOR', 'ADMIN'].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  style={{
                    flex: 1, padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none', cursor: 'pointer',
                    fontSize: '0.8rem', fontWeight: 600,
                    background: form.role === r ? 'white' : 'transparent',
                    color: form.role === r ? 'var(--primary)' : 'var(--text-secondary)',
                    boxShadow: form.role === r ? 'var(--shadow-sm)' : 'none',
                    transition: 'var(--transition)'
                  }}
                >
                  {r === 'PATIENT' ? '🙋 Patient' : r === 'DOCTOR' ? '🩺 Doctor' : '🔑 Admin'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  className="form-control"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  id="login-password"
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>

              <div style={{ textAlign: 'right', marginBottom: '1.25rem' }}>
                <Link to="/forgot-password" style={{
                  fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500
                }}>
                  Forgot Password?
                </Link>
              </div>

              <button
                id="login-submit"
                type="submit"
                className="btn btn-primary btn-full btn-lg"
                disabled={loading}
              >
                {loading ? '⏳ Signing in...' : '🔐 Sign In'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                Register as Patient
              </Link>
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
          © 2025 MediCare Hospital System
        </p>
      </div>
    </div>
  )
}
