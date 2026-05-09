import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authApi } from '../../api'
import { useAuth } from '../../context/AuthContext'
import { FiMail, FiLock, FiUser, FiShield, FiChevronRight, FiActivity } from 'react-icons/fi'

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
      {/* Decorative Bubbles */}
      <div className="floating-bubbles">
        <div className="bubble" style={{ width: 100, height: 100, top: '10%', left: '10%', animationDelay: '0s' }}></div>
        <div className="bubble" style={{ width: 150, height: 150, bottom: '15%', right: '15%', animationDelay: '2s' }}></div>
        <div className="bubble" style={{ width: 80, height: 80, top: '40%', right: '5%', animationDelay: '4s' }}></div>
      </div>

      <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }} className="scale-in">
        {/* Glass Card */}
        <div className="glass-card overflow-hidden">
          {/* Enhanced Header */}
          <div className="auth-header">
            <div style={{
              width: 80, height: 80,
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
              borderRadius: 22,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', margin: '0 auto 1.5rem',
              color: 'white',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <FiActivity />
            </div>
            <h1 style={{ color: 'white', fontSize: '2rem', fontFamily: 'Outfit', fontWeight: 800, marginBottom: 4, letterSpacing: '-0.5px' }}>
              MediCare
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', fontWeight: 500 }}>
              Your Health, Our Priority
            </p>
          </div>

          {/* Form Content */}
          <div style={{ padding: '2.5rem 2rem' }}>
            <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', textAlign: 'center', fontWeight: 700, color: 'var(--gray-800)' }}>
              Sign In
            </h2>

            {/* Custom Role Selector */}
            <div className="role-tab-container">
              {[
                { id: 'PATIENT', label: 'Patient', icon: <FiUser /> },
                { id: 'DOCTOR', label: 'Doctor', icon: <FiActivity /> },
                { id: 'ADMIN', label: 'Admin', icon: <FiShield /> }
              ].map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setForm({ ...form, role: r.id })}
                  className={`role-tab ${form.role === r.id ? 'active' : ''}`}
                >
                  {r.icon}
                  <span>{r.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-with-icon">
                  <FiMail className="icon" />
                  <input
                    id="login-email"
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-with-icon">
                  <FiLock className="icon" />
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
              </div>

              <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                <Link to="/forgot-password" style={{
                  fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600
                }}>
                  Forgot Password?
                </Link>
              </div>

              <button
                id="login-submit"
                type="submit"
                className="btn btn-primary btn-full btn-lg hover-lift"
                disabled={loading}
                style={{ height: 56, borderRadius: 16 }}
              >
                {loading ? '⏳ Processing...' : (
                  <>
                    <span>Sign In to Account</span>
                    <FiChevronRight style={{ fontSize: '1.2rem' }} />
                  </>
                )}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                New to MediCare?{' '}
                <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
                  Create an Account
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
          © 2025 MediCare Global • Secure Access
        </p>
      </div>
    </div>
  )
}
